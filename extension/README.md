# Kiến trúc triển khai Extension

- `renderer.mjs`: Quản lý `iframe` tạm thời, giao tiếp qua closure an toàn, hình nền tĩnh, phím tắt và cơ chế khôi phục hoàn toàn. Không đăng ký vòng lặp thăm dò (polling) vĩnh viễn.
- `payload.mjs`: Đóng gói HTML/CSS/hình ảnh/hàm hoạt ảnh cục bộ, liên kết trực tiếp vào môi trường `iframe`; không cần sửa đổi chính sách CSP hay chạy máy chủ tài nguyên cục bộ.
- `cdp.mjs`: Bộ lọc chọn cửa sổ chính, xác thực kết nối WebSocket loopback, xử lý timeout có giới hạn và dọn dẹp kết nối sạch sẽ.
- `run.mjs` (và `run-windows.mjs`): Xác thực chữ ký ứng dụng OpenAI, cấp phát cổng loopback ngẫu nhiên và kiểm tra tiến trình sở hữu, khởi chạy ứng dụng gốc; xác nhận hoạt ảnh bắt đầu phát thì lập tức ngắt kết nối và thoát.
- `wallpaper.css`: Thiết lập bề mặt trong suốt dựa trên các thuộc tính bố cục và biến màu nguyên bản đã được đối chiếu.
- `Native/Extension.swift` (và `Native/Launcher.cs`): Điểm khởi chạy nhẹ, khi phát hiện ứng dụng đang chạy sẽ kích hoạt cửa sổ hoặc hiển thị hộp thoại xử lý, không tự tiện cưỡng chế khởi động lại.

### Nguyên tắc bảo mật & vận hành
Không chỉnh sửa gói cài đặt chính thức, không cài đặt tiến trình chạy ngầm (daemon), không đọc nội dung chat, không thay đổi cấu hình API. Cổng gỡ lỗi CDP duy trì cùng vòng đời của tiến trình Codex/ChatGPT; việc đóng lớp phủ hoạt ảnh không đóng cổng này, người dùng chỉ cần thoát hoàn toàn ứng dụng và mở lại bình thường từ biểu tượng gốc để đóng cổng.

### Trải nghiệm & Cài đặt
Thao tác thực tế đã được xác nhận hoạt động ổn định; các bản cập nhật mới vẫn cần được kiểm thử, việc chạy thành công trên trang test không đồng nghĩa với tương thích trên mọi phiên bản ứng dụng trong tương lai. Phím tắt mở cài đặt là `⌘⌥B` (macOS) hoặc `Ctrl+Alt+B` (Windows), lúc mở đầu sẽ không hiển thị nút cài đặt để giữ trọn vẹn khung hình. Bảng cài đặt giữ nguyên phong cách thiết kế, bổ sung các ô nhập tiêu đề và dòng phụ nửa đầu, phụ đề nửa sau, tái sử dụng dữ liệu trong `IndexedDB` và tương thích với các thiết lập ảnh cũ. Chỉ khi bấm lưu thành công hoạt ảnh mới tự phát lại; bấm đóng hoặc phím `Esc` sẽ lập tức tắt lớp phủ để quay lại trang chính, các thay đổi chưa lưu sẽ tự hủy bỏ.
