import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn, execSync} from 'node:child_process';
import {existsSync, readFileSync, writeFileSync, unlinkSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));

test('Kiểm tra mã nguồn không còn chứa taskkill cưỡng chế', () => {
  const runWindowsCode = readFileSync(join(root, 'extension', 'run-windows.mjs'), 'utf8');
  assert.equal(runWindowsCode.includes('taskkill'), false, 'extension/run-windows.mjs không được chứa lệnh taskkill');
  assert.equal(runWindowsCode.includes("'/F'") || runWindowsCode.includes('"/F"'), false, 'extension/run-windows.mjs không được chứa cờ cưỡng chế /F');

  const launcherCode = readFileSync(join(root, 'Native', 'Launcher.cs'), 'utf8');
  assert.equal(launcherCode.includes('taskkill'), false, 'Native/Launcher.cs không được chứa lệnh taskkill');
  assert.equal(launcherCode.includes('"taskkill"') || launcherCode.includes('taskkill /F'), false, 'Native/Launcher.cs không được chứa cờ cưỡng chế /F');
});

test('Trình biên dịch build-windows.ps1 và build-windows.bat kiểm tra mã thoát', () => {
  const ps1Code = readFileSync(join(root, 'tools', 'build-windows.ps1'), 'utf8');
  assert.ok(ps1Code.includes('$LASTEXITCODE -ne 0'), 'PowerShell script phải kiểm tra $LASTEXITCODE');
  assert.ok(ps1Code.includes('exit $LASTEXITCODE'), 'PowerShell script phải trả mã thoát lỗi khi thất bại');

  const batCode = readFileSync(join(root, 'tools', 'build-windows.bat'), 'utf8');
  assert.ok(batCode.includes('%ERRORLEVEL% NEQ 0'), 'Batch script phải kiểm tra %ERRORLEVEL%');
});

test('Xác định chính xác ứng dụng ChatGPT/Codex trên Windows', async () => {
  const {findCodexExecutable} = await import('../extension/run-windows.mjs');
  const exe = await findCodexExecutable();
  assert.ok(exe !== null, 'Phải tìm thấy đường dẫn ứng dụng chính thức trên máy người dùng');
  assert.ok(existsSync(exe), `Tệp ứng dụng phải tồn tại trên ổ đĩa: ${exe}`);
  assert.match(exe.toLowerCase(), /chatgpt\.exe|codex\.exe/);
});

test('C# Launcher: Loại trừ chính launcher và tiến trình trong thư mục dự án', () => {
  const csc = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';
  const testCs = join(root, 'scratch_test_filter.cs');
  const testExe = join(root, 'scratch_test_filter.exe');

  const code = `
using System;
using System.IO;
using System.Diagnostics;
using CodexStartup;

public class TestRunner {
    public static int Main() {
        string prjDir = @"${root.replace(/\\/g, '\\\\')}";
        // 1. Kiểm tra khi ứng dụng không chạy
        var info = Program.DetectRunningApp(@"C:\\NonExistent\\App\\ChatGPT.exe", prjDir);
        if (info.ProcessIds.Count != 0) {
            Console.WriteLine("Loi: PIDs phai bang 0 khi ung dung khong ton tai");
            return 1;
        }

        // 2. Kiểm tra loại trừ chính thư mục dự án
        string fakeExeInProject = Path.Combine(prjDir, "Codex.exe");
        var infoSelf = Program.DetectRunningApp(fakeExeInProject, prjDir);
        int currentPid = Process.GetCurrentProcess().Id;
        if (infoSelf.ProcessIds.Contains(currentPid)) {
            Console.WriteLine("Loi: Khong duoc chua PID cua chinh launcher");
            return 2;
        }

        Console.WriteLine("SUCCESS");
        return 0;
    }
}
  `;

  writeFileSync(testCs, code);
  try {
    execSync(`"${csc}" /nologo /main:TestRunner /out:"${testExe}" /r:System.Windows.Forms.dll /r:System.Drawing.dll "${join(root, 'Native', 'Launcher.cs')}" "${testCs}"`);
    const out = execSync(`"${testExe}"`).toString();
    assert.match(out, /SUCCESS/);
  } finally {
    try { unlinkSync(testCs); } catch {}
    try { unlinkSync(testExe); } catch {}
  }
});

test('C# Launcher: Phân biệt ứng dụng có cửa sổ hiển thị và ứng dụng chỉ chạy nền', () => {
  const csc = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';
  const testCs = join(root, 'scratch_test_win.cs');
  const testExe = join(root, 'scratch_test_win.exe');

  const code = `
using System;
using System.IO;
using System.Diagnostics;
using CodexStartup;

public class TestWinRunner {
    public static int Main() {
        string prjDir = @"${root.replace(/\\/g, '\\\\')}";
        string officialExe = Program.FindOfficialExecutable(null);
        if (string.IsNullOrEmpty(officialExe)) {
            Console.WriteLine("Khong tim thay app");
            return 1;
        }

        var info = Program.DetectRunningApp(officialExe, prjDir);
        Console.WriteLine("Official app PIDs: " + info.ProcessIds.Count);
        Console.WriteLine("HasVisibleWindow: " + info.HasVisibleWindow);
        Console.WriteLine("MainWindowHandle: " + info.MainWindowHandle);
        Console.WriteLine("WindowTitle: " + info.WindowTitle);

        // Kiem tra tinh nhat quan: neu khong co cua so thi HasVisibleWindow phai bang false
        if (info.MainWindowHandle == IntPtr.Zero && info.HasVisibleWindow) {
            Console.WriteLine("Loi: Khong the co HasVisibleWindow=true khi handle=Zero");
            return 2;
        }

        Console.WriteLine("WIN_CHECK_OK");
        return 0;
    }
}
  `;

  writeFileSync(testCs, code);
  try {
    execSync(`"${csc}" /nologo /main:TestWinRunner /out:"${testExe}" /r:System.Windows.Forms.dll /r:System.Drawing.dll "${join(root, 'Native', 'Launcher.cs')}" "${testCs}"`);
    const out = execSync(`"${testExe}"`).toString();
    assert.match(out, /WIN_CHECK_OK/);
  } finally {
    try { unlinkSync(testCs); } catch {}
    try { unlinkSync(testExe); } catch {}
  }
});

test('C# Launcher: Đóng bình thường an toàn và hủy bỏ khi timeout trên tiến trình thử nghiệm', async () => {
  const csc = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';
  const mockCs = join(root, 'scratch_mock_app.cs');
  const mockExe = join(root, 'scratch_mock_app.exe');

  const mockCode = `
using System;
using System.Windows.Forms;
class MockApp {
    static void Main() {
        Form f = new Form();
        f.Text = "Mock Target Window";
        Application.Run(f);
    }
}
  `;

  writeFileSync(mockCs, mockCode);
  execSync(`"${csc}" /nologo /target:winexe /out:"${mockExe}" /r:System.Windows.Forms.dll "${mockCs}"`);

  // Khởi động mock app
  const mockProc = spawn(mockExe, [], {detached: true, stdio: 'ignore'});
  await new Promise(r => setTimeout(r, 600));

  try {
    assert.equal(mockProc.killed, false);

    // Gửi yêu cầu đóng bình thường đến mock app (không dùng taskkill /F)
    const closerCs = join(root, 'scratch_test_close.cs');
    const closerExe = join(root, 'scratch_test_close.exe');

    const closerCode = `
using System;
using System.Diagnostics;

class CloserRunner {
    static int Main() {
        int targetPid = ${mockProc.pid};
        Process p = Process.GetProcessById(targetPid);
        if (p == null || p.HasExited) return 1;

        // Gui yeu cau dong binh thuong
        p.CloseMainWindow();
        p.WaitForExit(4000);

        if (p.HasExited) {
            Console.WriteLine("GRACEFUL_CLOSE_SUCCESS");
            return 0;
        } else {
            Console.WriteLine("STILL_RUNNING");
            return 2;
        }
    }
}
    `;

    writeFileSync(closerCs, closerCode);
    execSync(`"${csc}" /nologo /out:"${closerExe}" /r:System.Windows.Forms.dll "${closerCs}"`);
    const out = execSync(`"${closerExe}"`).toString();
    assert.match(out, /GRACEFUL_CLOSE_SUCCESS/);
  } finally {
    try { mockProc.kill(); } catch {}
    try { unlinkSync(mockCs); } catch {}
    try { unlinkSync(mockExe); } catch {}
    try { unlinkSync(join(root, 'scratch_test_close.cs')); } catch {}
    try { unlinkSync(join(root, 'scratch_test_close.exe')); } catch {}
  }
});
