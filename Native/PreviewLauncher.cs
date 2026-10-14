using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace AemeathPreview {
    static class Program {
        [STAThread]
        static void Main(string[] args) {
            try {
                string baseDir = AppDomain.CurrentDomain.BaseDirectory;
                string projectDir = baseDir;

                if (File.Exists(Path.Combine(baseDir, "index.html"))) {
                    projectDir = baseDir;
                } else if (File.Exists(Path.Combine(baseDir, "..\\index.html"))) {
                    projectDir = Path.GetFullPath(Path.Combine(baseDir, ".."));
                } else if (File.Exists(Path.Combine(Directory.GetCurrentDirectory(), "index.html"))) {
                    projectDir = Directory.GetCurrentDirectory();
                }

                string htmlPath = Path.Combine(projectDir, "index.html");
                if (!File.Exists(htmlPath)) {
                    MessageBox.Show("Không tìm thấy tệp index.html tại: " + htmlPath, "Lỗi xem trước", MessageBoxButtons.OK, MessageBoxIcon.Error);
                    return;
                }

                string url = "file:///" + htmlPath.Replace('\\', '/');

                // Dùng UseShellExecute để Windows Shell kích hoạt trình duyệt đúng context
                bool launched = false;
                foreach (string browser in new string[] { "msedge", "chrome" }) {
                    try {
                        ProcessStartInfo psi = new ProcessStartInfo {
                            FileName = browser,
                            Arguments = "--app=\"" + url + "\" --window-size=1020,700",
                            UseShellExecute = true
                        };
                        Process.Start(psi);
                        launched = true;
                        break;
                    } catch {}
                }

                if (!launched) {
                    Process.Start(new ProcessStartInfo(url) { UseShellExecute = true });
                }
            } catch (Exception ex) {
                MessageBox.Show("Lỗi: " + ex.Message, "Xem trước hoạt ảnh", MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
        }
    }
}
