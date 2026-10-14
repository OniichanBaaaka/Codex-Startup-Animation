import {execFile as rawExec, spawn} from 'node:child_process';
import {promisify} from 'node:util';
import {createServer} from 'node:net';
import {stat} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {setTimeout as delay} from 'node:timers/promises';
import {buildInjection} from './payload.mjs';
import {connect, pageTarget, localSocket} from './cdp.mjs';

const exec = promisify(rawExec);
const root = dirname(dirname(fileURLToPath(import.meta.url)));

async function command(file, args) {
  const result = await exec(file, args, {timeout: 15000, maxBuffer: 1024 * 1024});
  return result.stdout.trim();
}

export async function findCodexExecutable(customPath) {
  if (customPath) {
    try {
      await stat(customPath);
      return customPath;
    } catch {}
  }

  // 1. Check WindowsApps / AppxPackage
  try {
    const {stdout} = await exec('powershell', [
      '-NoProfile',
      '-Command',
      '(Get-AppxPackage *OpenAI.Codex*).InstallLocation'
    ]);
    const loc = stdout.trim();
    if (loc) {
      // Create user-level junction in %LOCALAPPDATA%\Programs\Codex
      // so Windows 11 treats the running process as a standard Win32 app and correctly binds taskbar icons
      const appDir = existsSync(join(loc, 'app')) ? join(loc, 'app') : loc;
      const localDir = join(process.env.LOCALAPPDATA || '', 'Programs', 'Codex');
      try {
        if (!existsSync(localDir)) {
          await exec('cmd', ['/c', 'mklink', '/J', localDir, appDir]);
        }
        for (const name of ['ChatGPT.exe', 'Codex.exe']) {
          const cand = join(localDir, name);
          if (existsSync(cand)) return cand;
        }
      } catch {}

      for (const name of ['app\\ChatGPT.exe', 'app\\Codex.exe', 'ChatGPT.exe', 'Codex.exe']) {
        const candidate = join(loc, name);
        try {
          await stat(candidate);
          return candidate;
        } catch {}
      }
    }
  } catch {}

  // 2. Check standard installation directories
  const candidates = [
    join(process.env.LOCALAPPDATA || '', 'Programs', 'Codex', 'Codex.exe'),
    join(process.env.LOCALAPPDATA || '', 'Programs', 'ChatGPT', 'ChatGPT.exe'),
    join(process.env.LOCALAPPDATA || '', 'OpenAI', 'Codex', 'Codex.exe'),
    join(process.env.ProgramFiles || 'C:\\Program Files', 'OpenAI', 'Codex', 'Codex.exe'),
    join(process.env.ProgramFiles || 'C:\\Program Files', 'Codex', 'Codex.exe'),
    join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'OpenAI', 'Codex', 'Codex.exe')
  ];

  for (const p of candidates) {
    try {
      await stat(p);
      return p;
    } catch {}
  }

  return null;
}

export async function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(error => (error ? reject(error) : resolve(port)));
    });
  });
}

export async function verifyListener(port, expectedExecutable, expectedPid) {
  const records = await command('netstat', ['-ano', '-p', 'tcp']);
  const lines = records.split(/\r?\n/);
  const pids = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('TCP') && trimmed.includes(`127.0.0.1:${port}`) && trimmed.includes('LISTENING')) {
      const parts = trimmed.split(/\s+/);
      const pid = Number(parts[parts.length - 1]);
      if (pid) pids.push(pid);
    }
  }

  if (!pids.length) {
    throw new Error('调试端口尚未在 127.0.0.1 监听');
  }

  const pidSet = new Set(pids);
  if (expectedPid && pidSet.has(expectedPid)) {
    return;
  }

  for (const pid of pidSet) {
    const procPath = await command('powershell', [
      '-NoProfile',
      '-Command',
      `(Get-Process -Id ${pid} -ErrorAction SilentlyContinue).Path`
    ]);
    const path = procPath.toLowerCase();
    const expected = (expectedExecutable || '').toLowerCase();
    if (!path || (!path.includes('chatgpt') && !path.includes('codex') && !path.includes(expected))) {
      throw new Error(`调试端口不属于目标 Codex/ChatGPT 进程 (PID: ${pid}, Path: ${procPath})`);
    }
  }
}

export async function focusExistingWindow() {
  const script = `
Add-Type @'
using System;
using System.Text;
using System.Collections.Generic;
using System.Runtime.InteropServices;
public class WinFocus {
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
    [DllImport("user32.dll")] public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

    public static bool BringToFront(int[] pids) {
        var pidSet = new HashSet<int>(pids);
        bool activated = false;
        EnumWindows((hWnd, lParam) => {
            uint pid;
            GetWindowThreadProcessId(hWnd, out pid);
            if (pidSet.Contains((int)pid) && IsWindowVisible(hWnd)) {
                var sb = new StringBuilder(256);
                GetWindowText(hWnd, sb, 256);
                string title = sb.ToString();
                if (!string.IsNullOrEmpty(title) && title != "Default IME" && title != "MSCTFIME UI") {
                    ShowWindow(hWnd, 9); // SW_RESTORE
                    SetForegroundWindow(hWnd);
                    activated = true;
                    return false;
                }
            }
            return true;
        }, IntPtr.Zero);
        return activated;
    }
}
'@
$procs = Get-Process -Name ChatGPT, Codex -ErrorAction SilentlyContinue | Where-Object {
    $p = $_.Path
    $p -and (-not $p.StartsWith('${root.replace(/'/g, "''")}', [System.StringComparison]::OrdinalIgnoreCase))
}
if ($procs) {
    [WinFocus]::BringToFront($procs.Id)
} else {
    $false
}
`;
  try {
    const result = await command('powershell', ['-NoProfile', '-Command', script]);
    return result.toLowerCase() === 'true';
  } catch {
    return false;
  }
}

async function verifyAuthenticode(exePath) {
  try {
    const status = await command('powershell', [
      '-NoProfile',
      '-Command',
      `(Get-AuthenticodeSignature '${exePath.replace(/'/g, "''")}').Status.ToString()`
    ]);
    if (status !== 'Valid') {
      console.warn(`[Cảnh báo] Trạng thái chữ ký Authenticode: ${status}`);
    }
  } catch {}
}

export async function ensureShortcuts(exePath) {
  try {
    const icoPath = join(root, 'assets', 'codex-pink.ico');
    const userStartMenu = join(process.env.APPDATA || '', 'Microsoft', 'Windows', 'Start Menu', 'Programs');
    const psCmd = `
      $wsh = New-Object -ComObject WScript.Shell
      foreach ($name in @('ChatGPT.lnk', 'Codex.lnk')) {
        $p = Join-Path '${userStartMenu.replace(/'/g, "''")}' $name
        $lnk = $wsh.CreateShortcut($p)
        $lnk.TargetPath = '${exePath.replace(/'/g, "''")}'
        $lnk.WorkingDirectory = [System.IO.Path]::GetDirectoryName('${exePath.replace(/'/g, "''")}')
        $lnk.IconLocation = '${icoPath.replace(/'/g, "''")},0'
        $lnk.Save()
      }
    `;
    await exec('powershell', ['-NoProfile', '-Command', psCmd]);
  } catch {}
}

async function main() {
  const customIndex = process.argv.indexOf('--executable');
  const customPath = customIndex >= 0 ? process.argv[customIndex + 1] : null;

  if (process.argv.includes('--probe')) {
    const exe = await findCodexExecutable(customPath);
    const pidsOutput = await command('powershell', [
      '-NoProfile',
      '-Command',
      '(Get-Process -Name ChatGPT, Codex -ErrorAction SilentlyContinue).Id | ConvertTo-Json -Compress'
    ]);
    let pids = [];
    try {
      pids = JSON.parse(pidsOutput);
      if (!Array.isArray(pids)) pids = [pids];
    } catch {}
    console.log(JSON.stringify({application: exe, running: pids}));
    return;
  }

  const executable = await findCodexExecutable(customPath);
  if (!executable) {
    throw new Error('Không tìm thấy ứng dụng Codex / ChatGPT trên Windows. Vui lòng cài đặt hoặc chỉ định bằng cờ --executable <đường-dẫn>.');
  }

  // Kiểm tra nếu ứng dụng đang chạy khi gọi trực tiếp từ dòng lệnh
  const isForce = process.argv.includes('--force') || process.argv.includes('--restart');
  try {
    const scriptCheck = `(Get-Process -Name ChatGPT, Codex -ErrorAction SilentlyContinue | Where-Object {
      $p = $_.Path
      $p -and (-not $p.StartsWith('${root.replace(/'/g, "''")}', [System.StringComparison]::OrdinalIgnoreCase))
    }).Count`;
    const countRunning = Number(await command('powershell', ['-NoProfile', '-Command', scriptCheck])) || 0;
    if (countRunning > 0) {
      if (!isForce) {
        console.log('Thông báo: ChatGPT / Codex đang chạy. Đang kích hoạt đưa cửa sổ lên trước...');
        const activated = await focusExistingWindow();
        if (activated) {
          console.log('Đã kích hoạt và đưa cửa sổ ChatGPT/Codex lên trước màn hình.');
        } else {
          console.log('Ứng dụng đang chạy ngầm trong khay hệ thống (System Tray). Vui lòng mở từ khay hệ thống hoặc dùng launcher Codex.exe.');
        }
        return;
      }
    }
  } catch {}

  // Tự động kiểm tra và vẽ lại đường viền nét vẽ nếu artwork.jpg mới hơn contours.js
  try {
    const artStat = await stat(join(root, 'assets', 'artwork.jpg'));
    const contStat = await stat(join(root, 'assets', 'contours.js'));
    if (artStat.mtimeMs > contStat.mtimeMs) {
      console.log('Phát hiện artwork.jpg mới, đang tự động vẽ lại đường nét vector...');
      await exec('node', [join(root, 'tools', 'generate-contours.mjs')]);
    }
  } catch {}


  await verifyAuthenticode(executable);
  await ensureShortcuts(executable);
  const port = await freePort();

  // Đọc và chuẩn bị sẵn payload tiêm hoạt ảnh
  const sourcePromise = buildInjection(root);

  // Khởi chạy Codex / ChatGPT với cổng gỡ lỗi cục bộ
  console.log(`Đang khởi chạy ChatGPT qua cổng gỡ lỗi ${port}...`);
  const child = spawn(executable, [
    `--remote-debugging-port=${port}`,
    '--remote-debugging-address=127.0.0.1'
  ], {
    detached: true,
    stdio: 'ignore'
  });
  child.unref();

  const source = await sourcePromise;
  const deadline = Date.now() + 45000;
  let lastError = 'Đang chờ cửa sổ ChatGPT xuất hiện...';
  let injected = false;

  // Vòng lặp thăm dò cực nhanh: poll trực tiếp qua HTTP mỗi 35ms mà không sinh tiến trình powershell
  while (Date.now() < deadline) {
    let client;
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`, {
        signal: AbortSignal.timeout(200),
        redirect: 'error'
      });
      if (response.ok) {
        const targets = await response.json();
        if (Array.isArray(targets)) {
          const target = targets.find(pageTarget);
          if (target) {
            await verifyListener(port, executable, child.pid);
            client = await connect(localSocket(target.webSocketDebuggerUrl, port));
            const result = await client.call('Runtime.evaluate', {
              expression: source,
              returnByValue: true,
              awaitPromise: true
            });

            if (!result.exceptionDetails && result.result?.value?.installed === true) {
              for (let attempt = 0; attempt < 60; attempt++) {
                const answer = await client.call('Runtime.evaluate', {
                  expression: 'globalThis.__aemeathExtension?.status()',
                  returnByValue: true
                });
                const state = answer.result?.value;
                if (state?.ready) {
                  console.log('✓ Hoạt ảnh đang phát trực tiếp bên trong cửa sổ ChatGPT!');
                  console.log('  Phím tắt Ctrl+Alt+B để tùy chỉnh hình nền và chữ.');
                  injected = true;
                  break;
                }
                if (state?.phase === 'failed' || state?.phase === 'timeout') {
                  throw new Error('Hoạt ảnh bên trong ChatGPT bị gián đoạn: ' + state?.phase);
                }
                await delay(50);
              }
            }
          }
        }
      }
      if (injected) {
        client?.close();
        return;
      }
    } catch (err) {
      lastError = err.message;
    } finally {
      client?.close();
    }
    await delay(35);
  }

  throw new Error('Thời gian chờ kết nối ChatGPT quá hạn: ' + lastError);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main().catch(error => {
    console.error('Lỗi khởi chạy:', error.message);
    process.exitCode = 1;
  });
}
