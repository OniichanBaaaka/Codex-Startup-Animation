# Codex & ChatGPT Startup Animation

Hoạt ảnh khởi động điện ảnh (~12 giây) và hình nền mờ tùy chỉnh cho ứng dụng **Codex / ChatGPT Desktop** chính thức trên **Windows** và **macOS**.

> [!IMPORTANT]
> **Tuyên bố miễn trừ trách nhiệm & Tính chất dự án:**
> - Đây là **bộ khởi chạy ngoài của bên thứ ba (External Launcher)**, hoàn toàn độc lập và không phải là sản phẩm, tiện ích mở rộng hay plugin chính thức từ OpenAI.
> - Dự án tuân thủ nguyên tắc **phi xâm lấn (non-invasive)**: Tuyệt đối **không chỉnh sửa tệp thực thi gốc, không can thiệp tệp gói `app.asar`**, và không thay đổi bất kỳ tính năng cốt lõi hay dữ liệu tài khoản nào của ChatGPT/Codex.
> - Sau khi hoạt ảnh kết thúc, lớp phủ tự động biến mất và bàn giao lại giao diện làm việc nguyên bản của ChatGPT.

---

## 📑 Mục lục

1. [Giới thiệu & Nguyên lý hoạt động](#1-giới-thiệu--nguyên-lý-hoạt-động)
2. [Các cải tiến & Tính năng mới được bổ sung](#2-các-cải-tiến--tính-năng-mới-được-bổ-sung)
3. [Chức năng chính](#3-chức-năng-chính)
4. [Yêu cầu hệ thống](#4-yêu-cầu-hệ-thống)
5. [Cách tải và lưu dự án về máy](#5-cách-tải-và-lưu-dự-án-về-máy)
6. [Bắt đầu nhanh (Dành cho người mới)](#6-bắt-đầu-nhanh-dành-cho-người-mới)
7. [Hướng dẫn khởi chạy chi tiết](#7-hướng-dẫn-khởi-chạy-chi-tiết)
8. [Hướng dẫn tùy chỉnh hình ảnh, chữ & ngôn ngữ](#8-hướng-dẫn-tùy-chỉnh-hình-ảnh-chữ--ngôn-ngữ)
9. [Dữ liệu & Lưu ý vận hành](#9-dữ-liệu--lưu-ý-vận-hành)
10. [Xử lý lỗi thường gặp (Troubleshooting)](#10-xử-lý-lỗi-thường-gặp-troubleshooting)
11. [Cấu trúc thư mục](#11-cấu-trúc-thư-mục)
12. [Kiểm thử & Giới hạn kỹ thuật](#12-kiểm-thử--giới-hạn-kỹ-thuật)
13. [Ghi công & Bản quyền](#13-ghi-công--bản-quyền)

---

## 1. Giới thiệu & Nguyên lý hoạt động

### Launcher này dùng để làm gì?
Khi bạn mở ChatGPT / Codex Desktop thông thường, ứng dụng sẽ vào ngay giao diện làm việc mặc định. Dự án này mang đến một trải nghiệm mở đầu độc đáo: hiển thị đoạn hoạt ảnh nghệ thuật dài khoảng 12 giây, sau đó giữ lại hình nền mờ tinh tế phía sau giao diện chat.

### Nguyên lý hoạt động dưới nền tảng (Đã xác minh qua mã nguồn)
1. **Khởi chạy ứng dụng với cổng gỡ lỗi an toàn:** Launcher mở ứng dụng ChatGPT chính thức kèm cờ kết nối nội bộ `--remote-debugging-port=<port>` giới hạn nghiêm ngặt tại địa chỉ mạng cục bộ `127.0.0.1` (loopback).
2. **Nạp giao diện tạm thời qua giao thức CDP:** Thông qua kết nối WebSocket (Chrome DevTools Protocol - CDP), launcher tiêm một lớp phủ hoạt ảnh (`iframe`) vào trang chủ `app://-/index.html`.
3. **Tự động ngắt kết nối và giải phóng:** Ngay khi hoạt ảnh bắt đầu phát thành công, tiến trình hỗ trợ lập tức ngắt kết nối và thoát. Khi hoạt ảnh chạy hết 12 giây, toàn bộ cấu trúc hoạt ảnh sẽ tự động được gỡ bỏ khỏi DOM, chỉ để lại hình nền tĩnh nhẹ nhàng và phím tắt mở bảng cài đặt.

---

## 2. Các cải tiến & Tính năng mới được bổ sung

So với dự án nguyên mẫu ban đầu (vốn chỉ hỗ trợ macOS và tiếng Trung), phiên bản hiện tại đã được nâng cấp toàn diện với 3 hạng mục phát triển lớn (toàn bộ mã nguồn mở rộng, tối ưu hóa và porting sang Windows đều do AI thực hiện và hoàn thiện):

### 1. 🖥️ Bổ sung chạy trên hệ điều hành Windows
- **Native Launcher chuyên nghiệp (`Native/Launcher.cs` → `Codex.exe`):**
  - Xây dựng bằng C# WinForms với chủ đề **Dark theme & Pink accent**, đồng bộ hoàn hảo với phong cách nghệ thuật của ứng dụng.
  - Tự động nhận diện đường dẫn ứng dụng ChatGPT chính thức từ gói Microsoft Store (MSIX `OpenAI.Codex_*`) lẫn các bộ cài EXE tiêu chuẩn (`%LOCALAPPDATA%`, `Program Files`).
  - Kiểm soát phiên làm việc đơn lẻ (Single Instance Mutex) an toàn, ngăn chặn việc nhấp chuột mở nhiều cửa sổ chồng chéo.
- **Hộp thoại thông minh khi ứng dụng đang chạy (Không cưỡng chế đóng):**
  - Khi phát hiện ChatGPT đang chạy, launcher hiển thị hộp thoại giao diện tối đẹp mắt với 3 lựa chọn rõ ràng:
    - *Mở cửa sổ đang chạy:* Khôi phục và đưa cửa sổ hiện có lên trước màn hình (hỗ trợ cả trường hợp app đang thu nhỏ trong khay hệ thống System Tray).
    - *Đóng và khởi động lại:* Đóng dứt điểm toàn bộ cây tiến trình ChatGPT cũ một cách an toàn và khởi động ngay phiên mới cùng hoạt ảnh.
    - *Hủy (Esc):* Thoát launcher và giữ nguyên phiên làm việc hiện tại.
- **Kịch bản điều khiển Node.js trên Windows (`extension/run-windows.mjs`):** Tích hợp kết nối Chrome DevTools Protocol (CDP) an toàn trên loopback `127.0.0.1`.
- **Tự động sinh đường nét vector (Auto-trace Contours) trên Windows:** Tích hợp thuật toán xử lý ảnh Sobel Canvas trực tiếp trên trình duyệt, tự động vẽ lại nét chì vector khi người dùng thay đổi ảnh nền mới mà không phụ thuộc vào công cụ macOS Vision.
- **Công cụ khởi chạy linh hoạt:** Bổ sung `Khởi động Codex.vbs` (chạy ngầm không nháy cửa sổ đen Command Prompt), `Khởi động Codex.bat` và `Xem trước hoạt ảnh.bat`.
- **Script build tự động:** Hỗ trợ biên dịch nhanh với `tools\build-windows.bat` và `tools\build-windows.ps1` sử dụng trình biên dịch `csc.exe` có sẵn trong Windows.

### 2. 🌐 Thêm hỗ trợ đa ngôn ngữ (Tiếng Anh & Tiếng Việt)
- **Hệ thống đa ngôn ngữ (i18n):** Tích hợp nút chuyển đổi nhanh trực tiếp trong bảng cài đặt giữa 3 ngôn ngữ: **Tiếng Việt**, **English**, **中文**.
- **Chuyển ngữ toàn diện:** Dịch toàn bộ các tiêu đề, nhãn nhập liệu, giới hạn ký tự (16/48/60 ký tự), các gợi ý định dạng ảnh, thanh trượt hình nền, trạng thái thông báo và các nút bấm điều khiển.
- **Tự động ghi nhớ:** Ngôn ngữ được chọn sẽ tự động lưu vào `localStorage['aemeath-lang']` để ghi nhớ cho các lần sử dụng tiếp theo.

### 3. ⚡ Tối ưu hóa hệ thống & Hiệu năng render
- **Xóa bỏ giật/khựng (stutter) trong đoạn chuyển cảnh:** Khắc phục triệt để hiện tượng sụt giảm khung hình ở phân đoạn chuyển cảnh phức tạp nhất khi phân rã hạt và vẽ nét viền vector (từ giây thứ 4.18s đến 7.43s).
- **Tối ưu hóa vòng lặp render Canvas 2D:**
  - Lưu đệm (cache) sẵn toàn bộ DOM query selectors ra ngoài vòng lặp `tick()`, loại bỏ việc truy vấn lại DOM tốn tài nguyên mỗi khung hình.
  - Chuyển đổi từ `forEach` sang vòng lặp `for` theo chỉ số mảng, giảm cấp phát closure liên tục và giảm áp lực cho Garbage Collector.
  - Phân loại mảnh hạt tĩnh (`settled fragments`) để bỏ qua toàn bộ các phép tính lượng giác `sin/cos` không cần thiết sau khi hạt đã ổn định vị trí.
  - Kích hoạt tăng tốc phần cứng GPU thông qua CSS `transform: translateZ(0)` và `backface-visibility: hidden`.
- **Kết quả đo kiểm benchmark:** Thời gian thực thi JavaScript giảm sâu xuống chỉ còn **0.50 ms/frame** (trung vị) và **1.10 ms/frame** (P95). Tỉ lệ rớt khung hình dưới 30FPS đạt **0.0%**.
- **Dọn dẹp mã nguồn:** Loại bỏ các tệp script trùng lặp dư thừa, tối ưu dự án gọn gàng và dễ bảo trì.

---

## 3. Chức năng chính

- 🎬 **Hoạt ảnh khởi động 12 giây 6 giai đoạn:**
  1. *Pulse Loading (0.0s – 1.0s):* Vòng tròn sóng xung phát sáng giữa nền tối.
  2. *Avatar & Rings (1.0s – 4.0s):* Hiển thị ảnh đại diện cùng vòng xoay và các dòng chữ giới thiệu.
  3. *Fragment Dispersing (4.0s – 5.0s):* Ảnh đại diện phân rã thành hàng ngàn mảnh hạt ánh sáng tỏa ra xung quanh.
  4. *Vector Contours Drawing (5.0s – 6.6s):* Các đường nét phác thảo vector của nhân vật/hình nền xuất hiện và được vẽ quét dần từ trái sang phải.
  5. *Artwork Flash & Fade-in (6.6s – 8.0s):* Ánh sáng lóe lên, toàn bộ bức tranh nền sắc màu hòa quyện vào các đường nét vẽ.
  6. *Center Zoom & Enter App (8.0s – 12.0s):* Bức tranh thu gọn mượt mà vào trung tâm và mở ra giao diện ChatGPT.
- 🎨 **Tự động vẽ nét vector viền (Line-art Contours):** Khi người dùng đổi sang ảnh nền mới, thuật toán tích hợp sẽ tự động phân tích độ tương phản và trích xuất đường nét vẽ chì vector đồng bộ.
- 🖼️ **Hình nền tĩnh mờ sau khi vào app:** Hình nền tiếp tục hiển thị chìm phía sau khung chat với độ hiển thị có thể điều chỉnh từ `0%` (tắt) đến `75%`.
- ⌨️ **Hộp thoại cài đặt đa ngôn ngữ:** Nhấn `Ctrl + Alt + B` (Windows) hoặc `⌘ + ⌥ + B` (macOS) để đổi ảnh đại diện, đổi hình nền, sửa tiêu đề/phụ đề và chuyển đổi giữa 3 ngôn ngữ: **Tiếng Việt**, **English**, **中文**.
- 🔔 **Xử lý ứng dụng thông minh khi ChatGPT đang chạy sẵn:** Launcher hiển thị bảng thông báo với các lựa chọn: đưa cửa sổ hiện tại lên trước, đóng an toàn để khởi động lại kèm hoạt ảnh, hoặc hủy bỏ.
- ⚡ **Tối ưu hóa hiệu năng render:** Vòng lặp Canvas 2D được tinh chỉnh với thời gian thực thi mã nguồn chỉ khoảng **0.5ms/frame**, loại bỏ hoàn toàn hiện tượng khựng khung hình dưới 30FPS.
- ⏭️ **Điều khiển linh hoạt:** Nhấn phím `Esc` hoặc nhấp chuột vào màn hình bất kỳ lúc nào để bỏ qua nhanh hoạt ảnh.

---

## 4. Yêu cầu hệ thống

| Hạng mục | Yêu cầu | Ghi chú & Phạm vi đã xác minh |
| :--- | :--- | :--- |
| **Hệ điều hành Windows** | Windows 10 hoặc Windows 11 (64-bit) | Đã kiểm thử thực tế trên Windows 11 x64. Hỗ trợ cả gói cài đặt MSIX (Microsoft Store) và bộ cài EXE truyền thống. |
| **Hệ điều hành macOS** | macOS 13.0 (Ventura) trở lên | Đã kiểm thử trên kiến trúc Apple Silicon / Intel. Yêu cầu ứng dụng mang bundle ID `com.openai.codex`. |
| **Hệ điều hành Linux** | *Chưa hỗ trợ* | Chưa có kịch bản nạp và chưa có bản ChatGPT desktop tương ứng. |
| **Ứng dụng chính thức** | [ChatGPT Desktop (OpenAI)](https://chatgpt.com/) | Bắt buộc phải cài đặt ứng dụng chính thức trước khi khởi chạy. |
| **Môi trường Node.js** | Node.js v18.0.0 trở lên | **Windows:** Bắt buộc cài đặt để chạy file `.mjs` điều khiển. <br>**macOS:** Tự động sử dụng Node.js tích hợp sẵn bên trong app chính thức, không cần cài thêm. |
| **Trình duyệt (Cho Preview)** | Microsoft Edge hoặc Google Chrome | Chỉ cần khi bạn muốn chạy chế độ xem trước hoạt ảnh độc lập (`Xem trước hoạt ảnh.bat`). |
| **Công cụ biên dịch (Tùy chọn)** | Windows: .NET Framework `csc.exe`<br>macOS: Xcode Command Line Tools | **Chỉ cần khi bạn tự build lại mã nguồn**. Máy tính Windows thông thường đã có sẵn `csc.exe` trong thư mục `Microsoft.NET`. |
| **Cấu hình phần cứng** | Chưa có số liệu tối thiểu cụ thể | Dự án sử dụng Canvas 2D và Web tiêu chuẩn, chiếm dụng CPU/RAM rất thấp và hoạt động tốt trên máy tính phổ thông. |

### Phân loại các công cụ theo mục đích sử dụng

1. **Cần thiết để chạy ứng dụng (Runtime):**
   - Ứng dụng chính thức ChatGPT Desktop.
   - Node.js (trên Windows: kiểm tra bằng lệnh `node -v`).
2. **Chỉ cần khi bạn muốn tự build lại file `.exe` hoặc `.app` từ mã nguồn (Build-time):**
   - Trên Windows: Trình biên dịch C# `csc.exe` (mặc định có sẵn tại `C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe`).
   - Trên macOS: Xcode Command Line Tools (chạy `xcode-select --install`).
3. **Chỉ cần khi phát triển hoặc chạy kiểm thử tự động (Dev & Test):**
   - Git (để quản lý phiên bản).
   - Trình chạy test tích hợp sẵn của Node.js (`node --test`).

---

## 5. Cách tải và lưu dự án về máy

### Cách 1: Tải tệp nén ZIP từ GitHub (Dễ nhất cho người mới)

1. Mở trang dự án trên GitHub: [OniichanBaaaka/Codex-Startup-Animation](https://github.com/OniichanBaaaka/Codex-Startup-Animation).
2. Nhấn vào nút xanh lá cây **Code** ở góc phải trên, sau đó chọn **Download ZIP**.
3. Sau khi tải về, nhấp chuột phải vào file ZIP và chọn **Extract All...** (Giải nén toàn bộ) vào một thư mục riêng biệt trên ổ đĩa (ví dụ: `C:\Tools\Codex-Startup-Animation` hoặc `D:\Codex-Startup-Animation`).
4. **Lưu ý quan trọng:**
   - Tuyệt đối **không mở và chạy trực tiếp các file bên trong cửa sổ xem file ZIP** (sẽ thiếu thư mục liên kết và báo lỗi).
   - Hãy giải nén hoàn chỉnh và giữ nguyên vẹn toàn bộ các thư mục con như `assets/`, `extension/`, `Native/`, `tools/`.

### Cách 2: Tải thông qua Git (Dành cho lập trình viên)

Mở terminal (PowerShell, Command Prompt hoặc Terminal macOS) và thực hiện các lệnh:

```bash
git clone https://github.com/OniichanBaaaka/Codex-Startup-Animation.git
cd Codex-Startup-Animation
```

> [!NOTE]
> **Về các tệp nhị phân đã biên dịch sẵn (`.exe` / `.app`):**
> Trong mã nguồn gốc Git, các file nhị phân lớn trong thư mục `dist/` không được đưa lên repository để đảm bảo an toàn. Nếu bạn tải source code về, trên Windows bạn có thể khởi chạy ngay thông qua file `Khởi động Codex.bat` (file này sẽ tự động gọi Node.js khởi chạy mà không bắt buộc phải có sẵn `Codex.exe`), hoặc chạy `tools\build-windows.bat` một lần để sinh ra file `Codex.exe`.

---

## 6. Bắt đầu nhanh (Dành cho người mới)

Dưới đây là các bước nhanh nhất để trải nghiệm hoạt ảnh trên **Windows**:

1. **Kiểm tra Node.js:** Nhấn phím `Windows + R`, gõ `cmd`, ấn Enter. Gõ `node -v`. Nếu chưa có, tải và cài đặt bản LTS từ trang chủ [nodejs.org](https://nodejs.org/).
2. **Cài đặt ChatGPT:** Đảm bảo máy tính của bạn đã cài ứng dụng ChatGPT chính thức từ Microsoft Store hoặc OpenAI.
3. **Mở thư mục dự án đã giải nén.**
4. **Khởi chạy:**
   - Nhấp đúp vào file **`Khởi động Codex.bat`** (hoặc `Khởi động Codex.vbs` để chạy ngầm không hiện cửa sổ đen).
5. **Thưởng thức:** Hoạt ảnh khởi động sẽ tự động phát trực tiếp bên trong cửa sổ ChatGPT của bạn!

---

## 7. Hướng dẫn khởi chạy chi tiết

### Dành cho người dùng Windows

#### 1. Khởi động ứng dụng cùng hoạt ảnh

Có 3 cách để khởi chạy trên Windows:

- **Khởi chạy bằng file EXE chuẩn:** Nhấp đúp vào `Codex.exe` (hoặc `dist\Codex.exe`). File này cung cấp giao diện xử lý ứng dụng đang chạy rất đẹp mắt.
- **Khởi chạy im lặng không hiện cửa sổ console (Khuyến nghị hàng ngày):** Nhấp đúp vào `Khởi động Codex.vbs`. VBScript sẽ khởi chạy ngầm mà không làm nháy cửa sổ đen Command Prompt.
- **Khởi chạy bằng Batch Script:** Nhấp đúp vào `Khởi động Codex.bat`.

> **Hành vi khi ChatGPT đang mở sẵn:**
> Nếu ChatGPT đang chạy (kể cả chạy ngầm trong khay hệ thống), hộp thoại của launcher sẽ xuất hiện với 3 nút bấm:
> 1. **Mở cửa sổ đang chạy:** Đưa ngay cửa sổ ChatGPT hiện tại lên trên cùng.
> 2. **Đóng và khởi động lại:** Dừng dứt điểm các tiến trình ChatGPT đang mở, giải phóng cổng và lập tức khởi chạy phiên mới cùng hoạt ảnh.
> 3. **Hủy (Esc):** Thoát launcher mà không tác động đến phiên làm việc hiện tại.

#### 2. Xem trước hoạt ảnh độc lập (Preview)
- Nhấp đúp vào **`Xem trước hoạt ảnh.bat`** (hoặc `Aemeath Startup.exe`).
- Một cửa sổ trình duyệt độc lập sẽ mở ra giúp bạn kiểm tra toàn bộ hoạt ảnh, có sẵn thanh timeline để tua ngược, tua xuôi, tạm dừng và nút đổi giao diện.

#### 3. Tự biên dịch lại file thực thi trên Windows
Nếu bạn sửa đổi mã nguồn C# trong thư mục `Native/`, hãy chạy lệnh sau để build lại:
```cmd
tools\build-windows.bat
```
Hoặc trong PowerShell:
```powershell
.\tools\build-windows.ps1
```
Sản phẩm đầu ra sẽ được tạo tại `dist\Codex.exe` và tự động cập nhật ra thư mục gốc.

---

### Dành cho người dùng macOS

#### 1. Biên dịch ứng dụng lần đầu
Mở Terminal tại thư mục dự án và thực thi:
```bash
bash tools/build-extension.sh
bash tools/build-macos.sh
```

#### 2. Khởi chạy
- **Mở ChatGPT kèm hoạt ảnh:** Nhấp đúp vào `dist/Codex.app` (hoặc chạy file `扩展启动Codex.command`).
  - *Lưu ý:* Nếu ứng dụng Codex/ChatGPT đã mở sẵn, launcher trên macOS sẽ tự động kích hoạt cửa sổ hiện tại lên trước mà không khởi động lại. Để phát lại hoạt ảnh, hãy nhấn `⌘Q` để thoát hẳn app trước khi mở launcher.
- **Xem trước độc lập:** Nhấp đúp vào `dist/Aemeath Startup.app` (hoặc chạy file `预览动画.command`).

---

## 8. Hướng dẫn tùy chỉnh hình ảnh, chữ & ngôn ngữ

Trong khi hoạt ảnh đang phát hoặc bất kỳ lúc nào sau khi đã vào ChatGPT, bạn có thể mở bảng điều khiển cài đặt:

> ⌨️ **Phím tắt mở cài đặt:**
> - Trên Windows: **`Ctrl + Alt + B`**
> - Trên macOS: **`⌘ + ⌥ + B`** (Command + Option + B)
> - Khi ở chế độ xem trước (Preview): Nhấp vào nút **"Cài đặt giao diện"** ở góc trên bên trái.

![Giao diện cài đặt](assets/artwork.jpg)

### Chi tiết các mục cài đặt:

1. **Chuyển đổi ngôn ngữ:**
   - Ở góc trên hộp thoại, bạn có thể nhấp chọn giữa: **Tiếng Việt**, **English** hoặc **中文**.
   - Lựa chọn ngôn ngữ được lưu ngay vào `localStorage` của trình duyệt.
2. **Đổi Ảnh đại diện (Nửa đầu hoạt ảnh):**
   - Nhấp vào ô **Ảnh đại diện** để chọn ảnh mới (định dạng PNG, JPEG, WebP, dung lượng dưới 30 MB).
   - Hệ thống tự động căn giữa và crop theo tỉ lệ hình vuông chuẩn 512×512.
3. **Đổi Hình nền & Tự động tạo nét vẽ vector (Nửa sau hoạt ảnh):**
   - Nhấp vào ô **Hình nền** để chọn ảnh phong cảnh/nhân vật (khuyến nghị ảnh ngang tỉ lệ 3:2, kích thước chuẩn 1536×1024).
   - Trình duyệt sẽ tự động chạy thuật toán quét cạnh (edge-detection) để tạo các đường nét phác thảo vector chì đồng bộ với bức ảnh mới.
4. **Chỉnh sửa Tiêu đề & Phụ đề:**
   - *Tiêu đề dưới ảnh đại diện:* Tối đa 16 ký tự.
   - *Dòng phụ dưới tiêu đề:* Tối đa 48 ký tự.
   - *Phụ đề dưới hình nền:* Tối đa 60 ký tự.
   - *Mẹo:* Nếu bạn muốn ẩn dòng chữ nào, chỉ cần xóa sạch nội dung trong ô nhập tương ứng.
5. **Độ hiển thị hình nền trong ChatGPT:**
   - Kéo thanh trượt từ `0%` đến `75%` (mặc định là `42%`).
   - Mức `0%` sẽ tắt hoàn toàn hình nền sau khi khởi động.
6. **Lưu hoặc Hủy thay đổi:**
   - **Nút "Lưu & Xem trước":** Lưu vĩnh viễn hình ảnh và văn bản vào cơ sở dữ liệu `IndexedDB` của máy tính và tự động phát lại hoạt ảnh để bạn kiểm tra.
   - **Nút "X" (hoặc phím Esc):** Hủy bỏ các thay đổi vừa chỉnh sửa và đóng hộp thoại.
   - **Nút "Khôi phục mặc định":** Đưa toàn bộ ảnh đại diện, ảnh nền và các dòng chữ về lại bộ tài nguyên ban đầu của dự án.
   - **Nút "Tắt giao diện, khôi phục gốc Codex":** Gỡ bỏ hoàn toàn lớp màu nền trang trí, đưa ChatGPT về đúng giao diện đen/trắng mặc định ban đầu.

---

## 9. Dữ liệu & Lưu ý vận hành

- **Lưu trữ dữ liệu cục bộ (Local-only):** Mọi hình ảnh và nội dung chữ bạn tùy chỉnh được lưu trong `IndexedDB` (cơ sở dữ liệu tích hợp sẵn của trình duyệt trên máy bạn). Dự án **hoàn toàn không tải hay gửi bất kỳ dữ liệu nào ra mạng Internet**.
- **Độc lập dữ liệu giữa Preview và Ứng dụng thật:** Do cơ chế bảo mật sandbox của Chromium/WebKit, dữ liệu cài đặt trên trang Preview (`file://` hoặc `localhost`) và dữ liệu bên trong ChatGPT chính thức (`app://-/index.html`) được lưu tách biệt. Nếu bạn đổi ảnh trong Preview, hãy thao tác lại một lần bên trong ứng dụng thật bằng phím `Ctrl+Alt+B`.
- **Không di chuyển hoặc xóa thư mục dự án:** Khi khởi chạy, launcher cần đọc mã nguồn web từ thư mục `extension/`, `assets/` và `index.html`. Do đó, bạn nên đặt thư mục dự án ở một vị trí cố định trên ổ đĩa.
- **Cổng gỡ lỗi cục bộ (CDP Port):** Cổng kết nối gỡ lỗi chỉ được mở trên loopback `127.0.0.1` trong vài giây đầu khi nạp hoạt ảnh. Khi nạp xong, tiến trình điều khiển sẽ ngắt kết nối. Khi bạn tắt hẳn ChatGPT và mở lại bằng biểu tượng mặc định của ứng dụng, ChatGPT sẽ hoạt động bình thường mà không mở bất kỳ cổng gỡ lỗi nào.

---

## 10. Xử lý lỗi thường gặp (Troubleshooting)

| Hiện tượng | Nguyên nhân có thể | Cách xử lý |
| :--- | :--- | :--- |
| **Báo lỗi "Không tìm thấy ChatGPT / Codex"** | Ứng dụng chưa được cài đặt, hoặc nằm ở thư mục tùy chỉnh mà launcher chưa quét tới. | 1. Cài đặt lại ChatGPT từ Microsoft Store hoặc trang chủ OpenAI.<br>2. Hoặc khởi chạy qua dòng lệnh kèm đường dẫn chính xác: `node extension/run-windows.mjs --executable "C:\Đường_dẫn\ChatGPT.exe"`. |
| **Báo lỗi `'node' is not recognized`** | Máy tính chưa cài Node.js hoặc chưa thêm Node.js vào biến môi trường PATH. | Tải và cài đặt Node.js từ trang chủ [nodejs.org](https://nodejs.org/). Sau khi cài đặt xong, hãy khởi động lại Command Prompt hoặc máy tính. |
| **Mở `Codex.exe` nhưng không có phản hồi** | Một phiên bản launcher khác đang mở ngầm hoặc mutex chưa kịp giải phóng. | Nhấn `Ctrl + Shift + Esc` mở Task Manager, tìm và tắt các tiến trình có tên `Codex.exe` hoặc `ChatGPT.exe`, sau đó mở lại. |
| **Hộp thoại báo "Ứng dụng chưa đóng..."** | ChatGPT đang chạy nền trong khay hệ thống (System Tray). | Trong hộp thoại xuất hiện, hãy nhấp vào nút **"Đóng và khởi động lại"**. Launcher sẽ đóng sạch các tiến trình ngầm và phát hoạt ảnh ngay lập tức. |
| **Báo lỗi kết nối WebSocket hoặc Timeout quá hạn 45s** | Tiến trình ChatGPT cũ chưa đóng hết khiến cổng gỡ lỗi mới không thể lắng nghe. | Đóng hoàn toàn ChatGPT (nhấp chuột phải vào icon ChatGPT ở khay đồng hồ góc phải màn hình, chọn Quit), sau đó thử mở lại launcher. |
| **Không mở được cửa sổ xem trước (Preview)** | Máy tính thiếu trình duyệt Edge hoặc Chrome. | Đảm bảo máy tính đã cài Microsoft Edge hoặc Google Chrome. Hoặc bạn có thể nhấp đúp trực tiếp vào file `index.html` để mở xem trên bất kỳ trình duyệt nào. |
| **Hình ảnh tải lên báo lỗi "Ảnh quá 30MB"** | Tệp ảnh vượt quá giới hạn an toàn của IndexedDB. | Sử dụng các công cụ nén ảnh hoặc chọn ảnh có dung lượng dưới 30 MB để đảm bảo hiệu năng nạp nhanh. |
| **Đổi ảnh nền nhưng không thấy đường vẽ viền** | Bức ảnh có độ tương phản quá thấp, hoặc đường nét quá mờ. | Chọn các bức ảnh minh họa có đường nét chủ thể rõ ràng, độ tương phản sáng tối tách bạch để thuật toán vector hóa hoạt động tối ưu. |
| **Biên dịch `build-windows.bat` báo lỗi `csc.exe`** | Thiếu .NET Framework trên hệ điều hành. | Kiểm tra xem đường dẫn `C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe` có tồn tại không. Nếu không, hãy bật tính năng *.NET Framework 3.5 / 4.8* trong Windows Features. |

---

## 11. Cấu trúc thư mục

Dưới đây là cây thư mục rút gọn của dự án:

```text
codex-startup-animation/
├── assets/                     # Tài nguyên hình ảnh, vector và icon mặc định
│   ├── artwork.jpg             # Hình nền mặc định (nửa sau)
│   ├── avatar.jpg              # Ảnh đại diện mặc định (nửa đầu)
│   ├── contours.js             # Dữ liệu tọa độ các nét vẽ vector được sinh trước
│   ├── codex-pink.ico          # Biểu tượng icon ứng dụng trên Windows
│   └── codex-pink.icns         # Biểu tượng icon ứng dụng trên macOS
├── dist/                       # Thư mục chứa sản phẩm sau khi build (.exe / .app)
├── extension/                  # Các module tích hợp và điều khiển CDP
│   ├── cdp.mjs                 # Giao thức kết nối Chrome DevTools Protocol
│   ├── payload.mjs             # Đóng gói HTML/CSS/JS thành một chuỗi mã nạp
│   ├── renderer.mjs            # Lớp quản lý iframe hiển thị đè bên trong ChatGPT
│   ├── run-windows.mjs         # Kịch bản khởi chạy và tiêm hoạt ảnh trên Windows
│   ├── run.mjs                 # Kịch bản khởi chạy và tiêm hoạt ảnh trên macOS
│   └── wallpaper.css           # Định kiểu hình nền tĩnh sau khi hoạt ảnh kết thúc
├── Native/                     # Mã nguồn ứng dụng Native
│   ├── Launcher.cs             # Mã nguồn C# launcher Windows kèm hộp thoại Dark/Pink
│   ├── PreviewLauncher.cs      # Mã nguồn C# mở trình duyệt xem trước hoạt ảnh
│   ├── Extension.swift         # Mã nguồn Swift launcher trên macOS
│   └── App.swift               # Mã nguồn Swift ứng dụng preview trên macOS
├── tools/                      # Bộ script build, benchmark và kiểm thử tự động
│   ├── build-windows.bat       # Script đóng gói EXE trên Windows (Batch)
│   ├── build-windows.ps1       # Script đóng gói EXE trên Windows (PowerShell)
│   ├── build-extension.sh      # Script đóng gói .app trên macOS
│   ├── benchmark-animation.mjs # Kịch bản kiểm tra đo lường hiệu năng FPS/render
│   └── *.test.mjs              # Các bài kiểm thử đơn vị tự động
├── animation.js                # Lõi thuật toán Canvas 2D và tiến trình hoạt ảnh 12s
├── image-settings.js           # Bộ xử lý IndexedDB, crop ảnh và vector hóa Sobel
├── index.html                  # Giao diện hoạt ảnh và khung hộp thoại cài đặt
├── style.css                   # Định kiểu giao diện, hiệu ứng chuyển động và tăng tốc GPU
├── Codex.exe                   # File khởi chạy chính thức (Windows)
├── Khởi động Codex.bat         # File khởi chạy tiện lợi (Windows)
└── Khởi động Codex.vbs         # File khởi chạy im lặng không hiện màn hình đen (Windows)
```

---

## 12. Kiểm thử & Giới hạn kỹ thuật

### Kiểm thử tự động đã thực hiện
Dự án đi kèm bộ kiểm thử tự động kiểm tra tính toàn vẹn của hệ thống:
```bash
node --test tools/extension.test.mjs tools/extension-windows.test.mjs tools/launcher-flow.test.mjs
```
Bộ kiểm thử xác minh:
- Khả năng lọc đúng cửa sổ chính của ChatGPT, loại bỏ các cửa sổ phụ/trang web giả mạo.
- Cấp phát cổng mạng an toàn trên loopback `127.0.0.1`.
- Quá trình đóng gói payload không thiếu sót tài nguyên.
- Không còn bất kỳ câu lệnh cưỡng chế đóng tiến trình độc hại nào mà không có sự đồng ý của người dùng.
- Trình biên dịch kiểm tra mã thoát lỗi chính xác.

### Đo lường hiệu năng thực tế (Benchmark)
Chạy kịch bản đo thời gian render frame:
```bash
node tools/benchmark-animation.mjs
```
Kết quả đo kiểm trên giai đoạn chuyển cảnh nặng nhất (từ 3.5s đến 8.5s):
- **Thời gian xử lý JavaScript (renderMs):** Trung vị chỉ **0.50 ms**, P95 đạt **1.10 ms**.
- **Tỉ lệ rớt khung hình dưới 30FPS:** **0.0%** (Hoàn toàn mượt mà).

### Giới hạn kỹ thuật cần biết
1. **Phụ thuộc vào cấu trúc DOM của ChatGPT:** Nếu trong tương lai OpenAI cập nhật phiên bản thay đổi hoàn toàn kiến trúc Electron hoặc chặn cờ gỡ lỗi CDP, hoạt ảnh có thể cần cập nhật bộ chọn tương ứng.
2. **Khởi chạy lại từ biểu tượng gốc:** Nếu bạn mở ChatGPT từ shortcut gốc của OpenAI, ứng dụng sẽ vào thẳng giao diện mặc định mà không có hoạt ảnh. Bạn cần mở từ launcher của dự án này để thưởng thức hoạt ảnh.

---

## 13. Ghi công & Bản quyền

- **Ý tưởng & Mã nguồn gốc (macOS):** `panding999` ([panding999/codex-startup-animation](https://github.com/panding999/codex-startup-animation)).
- **Repository dự án này:** [OniichanBaaaka/Codex-Startup-Animation](https://github.com/OniichanBaaaka/Codex-Startup-Animation).
- **Phát triển mở rộng trong phiên bản này:**
  - 🖥️ Porting toàn bộ sang hệ điều hành Windows (Native C# WinForms launcher, dark theme dialog, auto-trace Sobel contours, batch & vbs launchers).
  - 🌐 Xây dựng hệ thống đa ngôn ngữ (i18n) bổ sung Tiếng Việt và Tiếng Anh bên cạnh Tiếng Trung.
  - ⚡ Tối ưu hóa sâu hiệu năng render loop Canvas 2D (giảm thời gian JS còn 0.5ms/frame, triệt tiêu giật khựng chuyển cảnh).
  - 🤖 **Phát triển mã nguồn:** Toàn bộ phần mã nguồn mở rộng, porting sang Windows, chuyển ngữ đa ngôn ngữ và tối ưu hóa hệ thống trong phiên bản này được tạo và thực hiện bởi AI (AI-assisted / AI-generated).
- **Bản quyền mã nguồn:** Hiện tại repository chưa công bố tệp giấy phép (LICENSE) chính thức. Bạn được tự do tham khảo, học tập và sử dụng cho mục đích cá nhân.
- **Bản quyền hình ảnh & nhân vật:** Quyền sở hữu đối với các tác phẩm hội họa mẫu, hình ảnh nhân vật (Aemeath), avatar và biểu tượng hoa hồng thuộc về các tác giả và chủ sở hữu tác phẩm gốc tương ứng.
