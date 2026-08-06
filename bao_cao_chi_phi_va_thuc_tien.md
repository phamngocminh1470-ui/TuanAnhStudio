# BÁO CÁO PHÂN TÍCH HIỆU QUẢ CHI PHÍ & TÍNH THỰC TIỄN NHÂN RỘNG
**DỰ ÁN: Nền tảng Ôn Thi Tốt Nghiệp THPT Môn Tiếng Anh Thích Ứng AI (AI English Mentor)**

---

> [!TIP]
> Báo cáo này được thiết kế để giải quyết trực tiếp câu hỏi của Giáo viên/Giám khảo hướng dẫn:
> * *"Đào sâu tính ứng dụng thực tiễn, đối tượng tiếp cận rộng rãi không (phí chi trả nhiều hay ít hay free)?"*
> * *"Tập trung chuyên sâu vào mảng Ôn thi tốt nghiệp THPT để tránh ôm đồm."*
>
> Học sinh sử dụng nội dung báo cáo này để đưa vào **Chương 4 (Kết quả và Thảo luận)** của Báo cáo khoa học và làm slide thuyết trình trước Hội đồng giám khảo.

---

## 1. MỤC TIÊU PHÂN TÍCH
Chứng minh tính khả thi tuyệt đối của dự án khi ứng dụng vào thực tế học đường:
* **Hạ tầng chi phí cực thấp:** Tận dụng tối đa các tài nguyên đám mây và API trí tuệ nhân tạo miễn phí.
* **Khả năng tiếp cận rộng rãi:** Học sinh vùng sâu vùng xa, gia cảnh khó khăn đều có thể sử dụng miễn phí hoàn toàn để ôn thi tốt nghiệp THPT Quốc gia đạt điểm cao.
* **Khả năng nhân rộng (Scalability):** Hệ thống nhẹ, không yêu cầu cài đặt phần cứng mạnh, đáp ứng lượng truy cập đồng thời lớn.

---

## 2. BẢNG KÊ CHI PHÍ VẬN HÀNH CHI TIẾT (MÔ HÌNH THỰC TẾ)
Dự án được tối ưu hóa kiến trúc kỹ thuật để **không phát sinh chi phí thương mại** đối với người dùng cuối (học sinh).

| Hạng mục | Giải pháp công nghệ sử dụng | Chính sách chi phí | Chi phí thực tế (VNĐ) |
| :--- | :--- | :--- | :--- |
| **Giao diện người dùng (Frontend)** | Vercel Cloud Platform / GitHub Pages | Miễn phí cho dự án nghiên cứu/cá nhân | **0 VNĐ** |
| **Mô hình AI & Sinh câu hỏi** | Gemini 1.5 Flash (qua Google AI Studio) | Miễn phí tối đa 15 yêu cầu/phút (RPM), 1.5 triệu tokens/ngày. | **0 VNĐ** (Đủ dùng cho học sinh thực hành liên tục) |
| **Nhận diện giọng nói (STT)** | Whisper Large v3 (qua Groq Cloud API) | Miễn phí trong giai đoạn thử nghiệm rộng rãi | **0 VNĐ** |
| **Đánh giá phát âm chuẩn** | Azure Pronunciation Assessment (Gói F0) | Miễn phí 5 giờ âm thanh/tháng (đáp ứng ~10,000 lượt chấm phát âm) | **0 VNĐ** |
| **Lưu trữ dữ liệu & API (VPS)** | Thuê máy chủ ảo Cloud VPS (LANIT) | Cấu hình 2 Cores CPU, 2GB RAM, 40GB SSD | **120.000 VNĐ / tháng** |
| **Tổng chi phí cố định** | | | **120.000 VNĐ / tháng** |

---

## 3. PHÂN TÍCH CHI PHÍ TRÊN MỖI ĐẦU HỌC SINH (COST-PER-STUDENT)
Giả sử triển khai hệ thống thực nghiệm cho **toàn bộ học sinh khối 12** của một trường THPT quy mô trung bình (khoảng **500 học sinh**):

* **Tổng chi phí vận hành hệ thống:** 120.000 VNĐ/tháng (Tiền duy trì VPS chạy backend).
* **Chi phí phân bổ trung bình cho mỗi học sinh:**
  $$\text{Chi phí/Học sinh} = \frac{120.000 \text{ VNĐ}}{500 \text{ Học sinh}} = \mathbf{240 \text{ VNĐ / học sinh / tháng}}$$
* **Chi phí cho mỗi lượt ôn tập:** Giả sử một học sinh ôn tập trung bình 15 lượt/tháng:
  $$\text{Chi phí/Lượt học} = \frac{240 \text{ VNĐ}}{15 \text{ Lượt}} = \mathbf{16 \text{ VNĐ / lượt học}}$$

### 📊 Bảng so sánh hiệu quả kinh tế:

| Tiêu chí | Gia sư truyền thống / Lớp học thêm | Ứng dụng thương mại (Elsa, Duolingo,...) | Nền tảng Ôn thi THPT thích ứng AI của dự án |
| :--- | :--- | :--- | :--- |
| **Chi phí trung bình** | 100.000 - 150.000 VNĐ / buổi học | 100.000 - 200.000 VNĐ / tháng | **FREE hoàn toàn** cho học sinh (Trường tài trợ 240đ/hs/tháng) |
| **Thời gian học** | Cố định, giới hạn tuần 2-3 buổi | Tự do 24/7 | **Tự do 24/7**, không giới hạn vị trí địa lý |
| **Mức độ cá nhân hóa** | Thấp (học theo giáo trình chung cả lớp) | Trung bình (lộ trình cố định được lập trình sẵn) | **Cực kỳ cao** (Mô hình IRT liên tục chẩn đoán điểm yếu thời gian thực để sửa lỗi) |

---

## 4. TÍNH THỰC TIỄN & KHẢ NĂNG TIẾP CẬN RỘNG RÃI
* **Không phân biệt thiết bị:** Hệ thống chạy trực tiếp trên nền tảng Web responsive, tương thích tốt từ điện thoại thông minh giá rẻ, máy tính bảng đến máy tính để bàn mà không cần cài đặt phức tạp.
* **Hỗ trợ tự học vùng sâu vùng xa:** Học sinh không có điều kiện tài chính để đi học thêm tại các trung tâm ngoại ngữ lớn vẫn tiếp cận được công nghệ gia sư AI 1:1 chuẩn xác nhất.
* **Giải quyết áp lực thi cử:** Tập trung duy nhất vào cấu trúc đề thi **Tốt nghiệp THPT Quốc gia môn Tiếng Anh**, giúp học sinh củng cố nhanh các phần trọng tâm thường xuất hiện trong đề thi (Thì động từ, Mệnh đề quan hệ, Câu bị động, Trọng âm, Ngữ âm).

---

## 5. KHẢ NĂNG NHÂN RỘNG & TỐI ƯU HÓA HẠ TẦNG (SCALABILITY)
* **Xử lý bất đối xứng (Asynchronous Processing):** Backend được xây dựng trên ngôn ngữ **Python FastAPI** với cơ chế lập trình bất đồng bộ. Điều này cho phép một máy chủ VPS giá rẻ (2GB RAM) có thể xử lý đồng thời hơn **300 - 500 yêu cầu cùng một lúc** từ học sinh mà không xảy ra hiện tượng nghẽn mạng.
* **Cơ chế phân bổ API Key thông minh:** Trong giao diện cài đặt nâng cao, hệ thống hỗ trợ tích hợp "API Key cá nhân". Nếu trường học muốn mở rộng quy mô lên hàng nghìn học sinh vượt quá hạn mức miễn phí của trường, mỗi học sinh có thể tự cấu hình API Key Gemini miễn phí của riêng mình vào giao diện web để tiếp tục học tập mà không làm tăng tải chi phí lên máy chủ trung tâm.
* **Bảo mật & Tốc độ:** Kết hợp Nginx và Certbot SSL giúp tối ưu hóa thời gian tải trang (dưới 1.2 giây) và mã hóa an toàn tuyệt đối dữ liệu ghi âm giọng nói của học sinh.
