using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.IO;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Windows.Forms;

namespace CodexStartup {
    static class NativeMethods {
        public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

        [DllImport("user32.dll")]
        public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

        [DllImport("user32.dll")]
        public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

        [DllImport("user32.dll")]
        public static extern bool IsWindowVisible(IntPtr hWnd);

        [DllImport("user32.dll")]
        public static extern bool SetForegroundWindow(IntPtr hWnd);

        [DllImport("user32.dll")]
        public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);

        [DllImport("user32.dll")]
        public static extern bool PostMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);

        [DllImport("kernel32.dll", SetLastError = true)]
        public static extern bool QueryFullProcessImageName(IntPtr hProcess, int dwFlags, StringBuilder lpExeName, ref int lpdwSize);

        [DllImport("kernel32.dll", SetLastError = true)]
        public static extern IntPtr OpenProcess(uint dwDesiredAccess, bool bInheritHandle, int dwProcessId);

        [DllImport("kernel32.dll", SetLastError = true)]
        public static extern bool CloseHandle(IntPtr hObject);

        public const uint PROCESS_QUERY_LIMITED_INFORMATION = 0x1000;
        public const uint WM_CLOSE = 0x0010;
        public const int SW_RESTORE = 9;
    }

    public class RunningAppInfo {
        public string ExecutablePath { get; set; }
        public string DisplayName { get; set; }
        public List<int> ProcessIds { get; set; }
        public bool HasVisibleWindow { get; set; }
        public IntPtr MainWindowHandle { get; set; }
        public string WindowTitle { get; set; }

        public RunningAppInfo() {
            ProcessIds = new List<int>();
            MainWindowHandle = IntPtr.Zero;
            WindowTitle = string.Empty;
        }
    }

    public class RunningAppDialog : Form {
        private RunningAppInfo appInfo;
        private string projectDir;
        private Label lblStatus;
        private Button btnOpen;
        private Button btnRestart;
        private Button btnCancel;

        public RunningAppDialog(RunningAppInfo info, string prjDir) {
            appInfo = info;
            projectDir = prjDir;
            InitializeComponent();
        }

        private void InitializeComponent() {
            this.Text = "Khởi động " + appInfo.DisplayName;
            this.StartPosition = FormStartPosition.CenterScreen;
            this.FormBorderStyle = FormBorderStyle.FixedDialog;
            this.MaximizeBox = false;
            this.MinimizeBox = false;
            this.ShowIcon = true;
            this.AutoScaleMode = AutoScaleMode.Dpi;
            this.BackColor = Color.FromArgb(20, 18, 23); // #141217
            this.ForeColor = Color.FromArgb(245, 238, 242);
            this.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            this.ClientSize = new Size(550, 320);

            // Cố gắng nạp icon nếu có
            try {
                string icoPath = Path.Combine(projectDir, "assets\\codex-pink.ico");
                if (File.Exists(icoPath)) {
                    this.Icon = new Icon(icoPath);
                }
            } catch {}

            // Thanh điểm nhấn màu hồng trên cùng
            Panel accentBar = new Panel();
            accentBar.Dock = DockStyle.Top;
            accentBar.Height = 4;
            accentBar.BackColor = Color.FromArgb(215, 164, 192); // #d7a4c0
            this.Controls.Add(accentBar);

            // Container chính
            Panel mainPanel = new Panel();
            mainPanel.Dock = DockStyle.Fill;
            mainPanel.Padding = new Padding(24, 20, 24, 18);
            this.Controls.Add(mainPanel);

            // Tiêu đề
            Label lblTitle = new Label();
            lblTitle.Text = appInfo.DisplayName + " đang chạy";
            lblTitle.Font = new Font("Segoe UI", 13.5f, FontStyle.Bold);
            lblTitle.ForeColor = Color.FromArgb(255, 240, 246);
            lblTitle.Location = new Point(24, 20);
            lblTitle.AutoSize = true;
            mainPanel.Controls.Add(lblTitle);

            // Mô tả
            Label lblDesc = new Label();
            lblDesc.Text = "Bạn có thể tiếp tục phiên hiện tại hoặc đóng ứng dụng để phát lại hoạt ảnh khởi động.\r\nHãy lưu công việc trước khi khởi động lại.";
            lblDesc.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            lblDesc.ForeColor = Color.FromArgb(195, 180, 192);
            lblDesc.Location = new Point(24, 56);
            lblDesc.AutoSize = true;
            lblDesc.MaximumSize = new Size(500, 0);
            mainPanel.Controls.Add(lblDesc);

            int currentY = 116;

            // Nhắc nhở chạy nền nếu không có cửa sổ
            if (!appInfo.HasVisibleWindow) {
                Label lblNotice = new Label();
                lblNotice.Text = "• Lưu ý: Ứng dụng hiện đang chạy nền trong khay hệ thống (chưa có cửa sổ trên màn hình).";
                lblNotice.Font = new Font("Segoe UI", 9.0f, FontStyle.Italic);
                lblNotice.ForeColor = Color.FromArgb(235, 186, 128); // Cam nhạt cảnh báo
                lblNotice.Location = new Point(24, currentY);
                lblNotice.AutoSize = true;
                lblNotice.MaximumSize = new Size(500, 0);
                mainPanel.Controls.Add(lblNotice);
                currentY += 28;
            }

            // Dòng trạng thái (khi đang đóng ứng dụng hoặc thông báo lỗi)
            lblStatus = new Label();
            lblStatus.Text = string.Empty;
            lblStatus.Font = new Font("Segoe UI", 9.0f, FontStyle.Regular);
            lblStatus.ForeColor = Color.FromArgb(255, 140, 180);
            lblStatus.Location = new Point(24, currentY);
            lblStatus.Size = new Size(500, 48);
            mainPanel.Controls.Add(lblStatus);

            // Khu vực nút bấm
            Panel buttonPanel = new Panel();
            buttonPanel.Location = new Point(24, 245);
            buttonPanel.Size = new Size(500, 45);
            mainPanel.Controls.Add(buttonPanel);

            // Nút 1: "Mở cửa sổ đang chạy"
            btnOpen = new Button();
            btnOpen.Text = "Mở cửa sổ đang chạy";
            btnOpen.Size = new Size(160, 36);
            btnOpen.Location = new Point(0, 4);
            btnOpen.FlatStyle = FlatStyle.Flat;
            btnOpen.FlatAppearance.BorderColor = Color.FromArgb(99, 70, 92);
            btnOpen.BackColor = Color.FromArgb(36, 27, 38);
            btnOpen.ForeColor = Color.FromArgb(245, 235, 242);
            btnOpen.Cursor = Cursors.Hand;
            btnOpen.Click += BtnOpen_Click;
            buttonPanel.Controls.Add(btnOpen);

            // Nút 2: "Đóng và khởi động lại"
            btnRestart = new Button();
            btnRestart.Text = "Đóng và khởi động lại";
            btnRestart.Size = new Size(170, 36);
            btnRestart.Location = new Point(168, 4);
            btnRestart.FlatStyle = FlatStyle.Flat;
            btnRestart.FlatAppearance.BorderSize = 0;
            btnRestart.BackColor = Color.FromArgb(215, 164, 192); // Hồng
            btnRestart.ForeColor = Color.FromArgb(27, 18, 28);   // Chữ tối tương phản cao
            btnRestart.Font = new Font("Segoe UI", 9.5f, FontStyle.Bold);
            btnRestart.Cursor = Cursors.Hand;
            btnRestart.Click += BtnRestart_Click;
            buttonPanel.Controls.Add(btnRestart);

            // Nút 3: "Hủy"
            btnCancel = new Button();
            btnCancel.Text = "Hủy";
            btnCancel.Size = new Size(95, 36);
            btnCancel.Location = new Point(395, 4);
            btnCancel.FlatStyle = FlatStyle.Flat;
            btnCancel.FlatAppearance.BorderColor = Color.FromArgb(70, 60, 72);
            btnCancel.BackColor = Color.FromArgb(25, 22, 28);
            btnCancel.ForeColor = Color.FromArgb(175, 162, 172);
            btnCancel.Cursor = Cursors.Hand;
            btnCancel.Click += (s, e) => { this.DialogResult = DialogResult.Cancel; this.Close(); };
            buttonPanel.Controls.Add(btnCancel);

            // Thiết lập điều hướng bàn phím an toàn
            this.CancelButton = btnCancel;
            if (appInfo.HasVisibleWindow) {
                this.AcceptButton = btnOpen;
                btnOpen.TabIndex = 0;
                btnRestart.TabIndex = 1;
                btnCancel.TabIndex = 2;
            } else {
                this.AcceptButton = btnCancel;
                btnCancel.TabIndex = 0;
                btnRestart.TabIndex = 1;
                btnOpen.TabIndex = 2;
            }
        }

        private void BtnOpen_Click(object sender, EventArgs e) {
            Program.RefreshAppStatus(appInfo);

            if (appInfo.ProcessIds.Count == 0) {
                lblStatus.Text = "Ứng dụng đã đóng. Đang chuẩn bị khởi động hoạt ảnh...";
                lblStatus.ForeColor = Color.FromArgb(160, 230, 160);
                this.DialogResult = DialogResult.OK;
                this.Close();
                return;
            }

            if (appInfo.HasVisibleWindow && appInfo.MainWindowHandle != IntPtr.Zero) {
                NativeMethods.ShowWindow(appInfo.MainWindowHandle, NativeMethods.SW_RESTORE);
                NativeMethods.SetForegroundWindow(appInfo.MainWindowHandle);
                this.DialogResult = DialogResult.Ignore; // Đã kích hoạt xong, thoát launcher
                this.Close();
            } else {
                lblStatus.ForeColor = Color.FromArgb(240, 180, 140);
                lblStatus.Text = "Ứng dụng đang chạy ngầm trong khay hệ thống và không có cửa sổ để đưa lên trước.\r\nVui lòng mở từ khay hệ thống hoặc bấm \"Đóng và khởi động lại\".";
            }
        }

        private void BtnRestart_Click(object sender, EventArgs e) {
            btnOpen.Enabled = false;
            btnRestart.Enabled = false;
            btnCancel.Enabled = false;
            lblStatus.ForeColor = Color.FromArgb(255, 140, 180);
            lblStatus.Text = "Đang đóng " + appInfo.DisplayName + " và khởi chạy hoạt ảnh...";
            Application.DoEvents();

            // 1. Đóng dứt điểm toàn bộ tiến trình của ứng dụng
            Program.KillRunningApp(appInfo);

            // 2. Chờ 400ms để hệ điều hành giải phóng hoàn toàn cổng và tài nguyên
            System.Threading.Thread.Sleep(400);

            // 3. Đóng hộp thoại và bắt đầu khởi chạy hoạt ảnh ngay lập tức
            this.DialogResult = DialogResult.OK;
            this.Close();
        }
    }

    static class Program {
        private static Mutex singleInstanceMutex = null;

        [STAThread]
        static void Main(string[] args) {
            // Ngăn người dùng click đúp nhiều lần làm mở nhiều hộp thoại chồng nhau
            bool isNewInstance = false;
            try {
                singleInstanceMutex = new Mutex(true, "Global\\CodexStartupAnimationLauncher_Mutex", out isNewInstance);
            } catch {
                isNewInstance = true;
            }

            if (!isNewInstance) {
                // Đã có launcher khác đang chạy, nhẹ nhàng thoát
                return;
            }

            try {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string projectDir = baseDir;

                if (File.Exists(Path.Combine(baseDir, "extension\\run-windows.mjs"))) {
                    projectDir = baseDir;
                } else if (File.Exists(Path.Combine(baseDir, "..\\extension\\run-windows.mjs"))) {
                    projectDir = Path.GetFullPath(Path.Combine(baseDir, ".."));
                } else if (File.Exists(Path.Combine(Directory.GetCurrentDirectory(), "extension\\run-windows.mjs"))) {
                    projectDir = Directory.GetCurrentDirectory();
                }

                string scriptPath = Path.Combine(projectDir, "extension\\run-windows.mjs");
                if (!File.Exists(scriptPath)) {
                    MessageBox.Show("Không tìm thấy tệp: " + scriptPath, "Codex Startup", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                // 1. Phân tích tham số dòng lệnh tùy chọn
                string customExe = null;
                for (int i = 0; i < args.Length; i++) {
                    if (args[i] == "--executable" && i + 1 < args.Length) {
                        customExe = args[i + 1];
                    }
                }

                // 2. Tìm đường dẫn thực thi của ứng dụng chính thức
                string targetExe = FindOfficialExecutable(customExe);
                if (string.IsNullOrEmpty(targetExe)) {
                    MessageBox.Show(
                        "Không tìm thấy ứng dụng ChatGPT / Codex trên máy tính.\r\nVui lòng cài đặt từ Microsoft Store hoặc chỉ định đường dẫn qua cờ --executable.",
                        "Codex Startup",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Warning
                    );
                    return;
                }

                // 3. Kiểm tra xem ứng dụng chính thức có đang chạy hay không
                RunningAppInfo appInfo = DetectRunningApp(targetExe, projectDir);

                if (appInfo.ProcessIds.Count > 0) {
                    // Ứng dụng ĐANG CHẠY: Hiển thị hộp thoại tùy chỉnh đẹp mắt thay vì cưỡng chế tắt
                    Application.EnableVisualStyles();
                    Application.SetCompatibleTextRenderingDefault(false);

                    RunningAppDialog dlg = new RunningAppDialog(appInfo, projectDir);
                    DialogResult res = dlg.ShowDialog();

                    if (res != DialogResult.OK) {
                        // Người dùng chọn "Hủy" hoặc "Mở cửa sổ đang chạy": kết thúc launcher an toàn
                        return;
                    }
                }

                // 4. Khởi chạy phiên ứng dụng mới cùng hoạt ảnh
                LaunchCodexWithAnimation(scriptPath, projectDir, targetExe);

            } catch (Exception ex) {
                MessageBox.Show("Lỗi: " + ex.Message, "Codex Startup", MessageBoxButtons.OK, MessageBoxIcon.Error);
            } finally {
                if (singleInstanceMutex != null) {
                    try { singleInstanceMutex.ReleaseMutex(); } catch {}
                    singleInstanceMutex.Dispose();
                }
            }
        }

        public static string FindOfficialExecutable(string customPath) {
            if (!string.IsNullOrEmpty(customPath) && File.Exists(customPath)) {
                return Path.GetFullPath(customPath);
            }

            // 1. Kiểm tra WindowsApps (gói MSIX / Microsoft Store)
            try {
                string localApp = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                string packagesDir = Path.Combine(localApp, "Packages");
                if (Directory.Exists(packagesDir)) {
                    foreach (string pkg in Directory.GetDirectories(packagesDir, "*OpenAI.Codex*")) {
                        // Tìm đường dẫn thực thi trong WindowsApps
                    }
                }

                // Chạy lệnh PowerShell nhanh để lấy InstallLocation chính xác
                ProcessStartInfo psi = new ProcessStartInfo {
                    FileName = "powershell",
                    Arguments = "-NoProfile -Command \"(Get-AppxPackage *OpenAI.Codex*).InstallLocation\"",
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    RedirectStandardOutput = true
                };
                using (Process p = Process.Start(psi)) {
                    string loc = p.StandardOutput.ReadToEnd().Trim();
                    p.WaitForExit(5000);
                    if (!string.IsNullOrEmpty(loc) && Directory.Exists(loc)) {
                        string[] subpaths = new string[] {
                            "app\\ChatGPT.exe", "app\\Codex.exe", "ChatGPT.exe", "Codex.exe"
                        };
                        foreach (string sub in subpaths) {
                            string cand = Path.Combine(loc, sub);
                            if (File.Exists(cand)) return Path.GetFullPath(cand);
                        }
                    }
                }
            } catch {}

            // 2. Kiểm tra các thư mục chuẩn trên máy
            string localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            string progFiles = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
            string progFilesX86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);

            string[] candidates = new string[] {
                Path.Combine(localAppData, "Programs\\Codex\\Codex.exe"),
                Path.Combine(localAppData, "Programs\\ChatGPT\\ChatGPT.exe"),
                Path.Combine(localAppData, "OpenAI\\Codex\\Codex.exe"),
                Path.Combine(progFiles, "OpenAI\\Codex\\Codex.exe"),
                Path.Combine(progFiles, "Codex\\Codex.exe"),
                Path.Combine(progFilesX86, "OpenAI\\Codex\\Codex.exe")
            };

            foreach (string c in candidates) {
                if (File.Exists(c)) return Path.GetFullPath(c);
            }

            return null;
        }

        public static RunningAppInfo DetectRunningApp(string officialExePath, string projectDir) {
            RunningAppInfo info = new RunningAppInfo();
            info.ExecutablePath = officialExePath;
            info.DisplayName = Path.GetFileNameWithoutExtension(officialExePath);
            if (string.Equals(info.DisplayName, "ChatGPT", StringComparison.OrdinalIgnoreCase)) {
                info.DisplayName = "ChatGPT";
            } else {
                info.DisplayName = "Codex";
            }

            RefreshAppStatus(info, projectDir);
            return info;
        }

        public static void RefreshAppStatus(RunningAppInfo info, string projectDir = null) {
            info.ProcessIds.Clear();
            info.HasVisibleWindow = false;
            info.MainWindowHandle = IntPtr.Zero;
            info.WindowTitle = string.Empty;

            int currentPid = Process.GetCurrentProcess().Id;
            string targetPath = (info.ExecutablePath ?? string.Empty).ToLowerInvariant();

            // Tìm toàn bộ tiến trình có tên tương ứng
            List<Process> candidates = new List<Process>();
            candidates.AddRange(Process.GetProcessesByName("ChatGPT"));
            candidates.AddRange(Process.GetProcessesByName("Codex"));

            HashSet<int> matchedPids = new HashSet<int>();

            foreach (Process p in candidates) {
                if (p.Id == currentPid) continue;

                string procPath = GetProcessPathSafe(p);
                if (string.IsNullOrEmpty(procPath)) continue;

                // Loại trừ bất kỳ tiến trình nào chạy từ chính thư mục mã nguồn dự án
                if (!string.IsNullOrEmpty(projectDir) && procPath.StartsWith(projectDir, StringComparison.OrdinalIgnoreCase)) {
                    continue;
                }

                // Kiểm tra xem có đúng đường dẫn ứng dụng chính thức hay không
                bool isTargetAppx = targetPath.Contains("openai.codex");
                bool isProcAppx = procPath.ToLowerInvariant().Contains("openai.codex");

                bool isMatch = string.Equals(procPath, targetPath, StringComparison.OrdinalIgnoreCase);
                if (!isMatch && isTargetAppx && isProcAppx) {
                    isMatch = true;
                }

                if (isMatch) {
                    matchedPids.Add(p.Id);
                }
            }

            info.ProcessIds.AddRange(matchedPids);

            if (matchedPids.Count == 0) return;

            // Tìm cửa sổ hiển thị thực tế của các tiến trình đó bằng EnumWindows
            IntPtr foundHwnd = IntPtr.Zero;
            string foundTitle = string.Empty;

            NativeMethods.EnumWindows((hWnd, lParam) => {
                uint pid;
                NativeMethods.GetWindowThreadProcessId(hWnd, out pid);
                if (matchedPids.Contains((int)pid) && NativeMethods.IsWindowVisible(hWnd)) {
                    StringBuilder sb = new StringBuilder(256);
                    NativeMethods.GetWindowText(hWnd, sb, 256);
                    string title = sb.ToString().Trim();
                    if (!string.IsNullOrEmpty(title) && title != "Default IME" && title != "MSCTFIME UI") {
                        foundHwnd = hWnd;
                        foundTitle = title;
                        return false; // Dừng duyệt khi đã tìm thấy cửa sổ chính
                    }
                }
                return true;
            }, IntPtr.Zero);

            if (foundHwnd != IntPtr.Zero) {
                info.HasVisibleWindow = true;
                info.MainWindowHandle = foundHwnd;
                info.WindowTitle = foundTitle;
            }
        }

        private static string GetProcessPathSafe(Process proc) {
            try {
                if (proc.MainModule != null && !string.IsNullOrEmpty(proc.MainModule.FileName)) {
                    return Path.GetFullPath(proc.MainModule.FileName);
                }
            } catch {}

            IntPtr hProc = NativeMethods.OpenProcess(NativeMethods.PROCESS_QUERY_LIMITED_INFORMATION, false, proc.Id);
            if (hProc != IntPtr.Zero) {
                try {
                    StringBuilder sb = new StringBuilder(1024);
                    int size = sb.Capacity;
                    if (NativeMethods.QueryFullProcessImageName(hProc, 0, sb, ref size)) {
                        return Path.GetFullPath(sb.ToString());
                    }
                } catch {} finally {
                    NativeMethods.CloseHandle(hProc);
                }
            }

            return null;
        }

        public static void KillRunningApp(RunningAppInfo info) {
            if (info != null && info.ProcessIds != null) {
                foreach (int pid in info.ProcessIds) {
                    try {
                        ProcessStartInfo psi = new ProcessStartInfo {
                            FileName = "taskkill",
                            Arguments = "/F /PID " + pid + " /T",
                            CreateNoWindow = true,
                            UseShellExecute = false
                        };
                        using (Process p = Process.Start(psi)) {
                            p.WaitForExit(1500);
                        }
                    } catch {}
                    try {
                        Process p = Process.GetProcessById(pid);
                        if (!p.HasExited) p.Kill();
                    } catch {}
                }
            }

            try {
                ProcessStartInfo psiKill = new ProcessStartInfo {
                    FileName = "taskkill",
                    Arguments = "/F /IM \"ChatGPT.exe\" /T",
                    CreateNoWindow = true,
                    UseShellExecute = false
                };
                using (Process pKill = Process.Start(psiKill)) {
                    pKill.WaitForExit(2000);
                }
            } catch {}
        }

        private static string FindNodeExecutable() {
            try {
                ProcessStartInfo psi = new ProcessStartInfo {
                    FileName = "where.exe",
                    Arguments = "node",
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    RedirectStandardOutput = true
                };
                using (Process p = Process.Start(psi)) {
                    string output = p.StandardOutput.ReadToEnd().Trim();
                    p.WaitForExit(1000);
                    if (!string.IsNullOrEmpty(output)) {
                        string[] lines = output.Split(new char[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                        if (lines.Length > 0 && File.Exists(lines[0].Trim())) {
                            return lines[0].Trim();
                        }
                    }
                }
            } catch {}

            string progFiles = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
            string progFilesX86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);
            string localApp = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

            string[] candidates = new string[] {
                Path.Combine(progFiles, "nodejs\\node.exe"),
                Path.Combine(progFilesX86, "nodejs\\node.exe"),
                Path.Combine(localApp, "Programs\\node\\node.exe")
            };
            foreach (string c in candidates) {
                if (File.Exists(c)) return c;
            }

            return "node";
        }

        private static void LaunchCodexWithAnimation(string scriptPath, string projectDir, string targetExe) {
            // Giải phóng mutex trước khi bàn giao quyền khởi chạy
            if (singleInstanceMutex != null) {
                try {
                    singleInstanceMutex.ReleaseMutex();
                    singleInstanceMutex.Dispose();
                } catch {}
                singleInstanceMutex = null;
            }

            string nodeExe = FindNodeExecutable();

            ProcessStartInfo psi = new ProcessStartInfo {
                FileName = nodeExe,
                Arguments = "\"" + scriptPath + "\" --executable \"" + targetExe + "\" --force",
                WorkingDirectory = projectDir,
                CreateNoWindow = true,
                UseShellExecute = false
            };

            try {
                Process.Start(psi);
            } catch (Exception ex) {
                MessageBox.Show("Không thể khởi chạy Node.js: " + ex.Message, "Khởi động Codex", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
