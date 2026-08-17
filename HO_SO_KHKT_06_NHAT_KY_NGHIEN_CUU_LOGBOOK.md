# SỔ TAY NHẬT KÝ NGHIÊN CỨU KHOA HỌC KỸ THUẬT (RESEARCH LOGBOOK)
**DỰ ÁN: AI ENGLISH MENTOR**

* **Nhóm nghiên cứu:** Học sinh trường THPT
* **Giáo viên hướng dẫn:** Giáo viên bộ môn Tiếng Anh / Tin học
* **Thời gian thực hiện:** Từ tháng 06/2026 đến tháng 08/2026

---

## 📅 TIẾN TRÌNH NGHIÊN CỨU THEO TUẦN

### 🔹 GIAI ĐOẠN 1: XÁC ĐỊNH VẤN ĐỀ & KHẢO SÁT THỰC TRẠNG (Tháng 06/2026)

* **Tuần 1 (01/06 - 07/06/2026):**
  * *Nội dung:* Họp nhóm, trao đổi với giáo viên hướng dẫn về những khó khăn của học sinh lớp 12 khi tiếp cận cấu trúc đề thi Tốt nghiệp THPT môn Tiếng Anh theo chương trình GDPT 2018 mới.
  * *Kết quả:* Lập phiếu khảo sát nhu cầu học tập trên 150 học sinh THPT. Kết quả cho thấy $84\%$ học sinh cảm thấy phương pháp luyện đề truyền thống bị dàn trải, $76\%$ học sinh mau quên từ vựng sau 2 tuần.
  * *Quyết định:* Xác định tên đề tài và xây dựng đề cương nghiên cứu ban đầu.

* **Tuần 2 (08/06 - 15/06/2026):**
  * *Nội dung:* Nghiên cứu tài liệu khoa học về các mô hình đo lường giáo dục hiện đại: Lý thuyết Ứng đáp Câu hỏi (Item Response Theory - IRT), thuật toán Computerized Adaptive Testing (CAT), và các công trình nghiên cứu về đường cong quên lãng của Hermann Ebbinghaus.
  * *Kết quả:* Chọn mô hình 3PL IRT và thuật toán lặp ngắt quãng SuperMemo 2 (SM-2) làm xương sống cho hệ thống.

---

### 🔹 GIAI ĐOẠN 2: THIẾT KẾ THUẬT TOÁN & PHÁT TRIỂN HỆ THỐNG (Tháng 07/2026)

* **Tuần 3 (16/06 - 30/06/2026):**
  * *Nội dung:* Biên soạn và chuẩn hóa Ngân hàng 50+ câu hỏi định chuẩn THPT 2025 (Notice, Leaflet, Arrangement, Reading Comprehension). Tham vấn giáo viên để xác định các thông số độ khó $b$, độ phân biệt $a$, độ đoán mò $c$.
  * *Kết quả:* Hoàn thiện tệp cơ sở dữ liệu câu hỏi chuẩn hóa kèm lời giải chi tiết và phân loại dạng bài.

* **Tuần 4 (01/07 - 15/07/2026):**
  * *Nội dung:* Lập trình Backend bằng Python FastAPI. Xây dựng thuật toán tính toán tích phân số 21 điểm nút Gauss-Hermite cho ước lượng năng lực EAP. Thiết lập cơ sở dữ liệu SQLite cấu hình chế độ WAL.
  * *Kết quả:* Chạy thử nghiệm các hàm toán học đo lường độc lập, đảm bảo thời gian tính toán năng lực $\theta$ dưới 5 mili-giây.

* **Tuần 5 (16/07 - 31/07/2026):**
  * *Nội dung:* Xây dựng giao diện Frontend bằng React 18, Vite và Tailwind CSS theo phong cách Glassmorphism hiện đại, hỗ trợ Responsive đa thiết bị (máy tính, máy tính bảng, điện thoại). Tích hợp các dịch vụ AI: Google Gemini (sinh bài đọc), Groq Whisper và Azure Speech (chấm phát âm).
  * *Kết quả:* Triển khai hệ thống lên máy chủ VPS Linux tại địa chỉ tên miền chính thức: `https://tuananhstudio.top`.

---

### 🔹 GIAI ĐOẠN 3: THỰC NGHIỆM SƯ PHẠM & PHÂN TÍCH DỮ LIỆU (Tháng 08/2026)

* **Tuần 6 (01/08 - 05/08/2026):**
  * *Nội dung:* Tuyển chọn 40 học sinh lớp 12 tham gia thực nghiệm. Tiến hành cho làm bài kiểm tra Pre-test để đánh giá trình độ ban đầu.
  * *Kết quả:* Điểm trung bình của 2 nhóm tương đương nhau ($5.42$ vs $5.45$, $p = 0.912 > 0.05$). Phân chia thành 20 học sinh nhóm Thực nghiệm (dùng AI English Mentor) và 20 học sinh nhóm Đối chứng (học truyền thống).

* **Tuần 7 (06/08 - 15/08/2026):**
  * *Nội dung:* Theo dõi quá trình học tập thực tế qua hệ thống Admin Panel. Ghi nhận nhật ký tự động 100% các phiên học (thời gian làm bài, số từ học thuộc, điểm phát âm).
  * *Kết quả:* Không có sự cố gián đoạn hệ thống. Học sinh nhóm Thực nghiệm hào hứng luyện tập trung bình 25 phút mỗi ngày.

* **Tuần 8 (16/08 - 17/08/2026):**
  * *Nội dung:* Cho 40 học sinh làm bài kiểm tra sau thực nghiệm (Post-test) và kiểm tra khả năng nhớ từ vựng sau 14 ngày. Xuất dữ liệu từ Admin Panel sang phần mềm SPSS để chạy kiểm định $t$-test.
  * *Kết quả:* Điểm nhóm Thực nghiệm tăng vượt bậc ($7.85$ so với $6.15$ của nhóm đối chứng, $p < 0.001$). Tỷ lệ nhớ từ đạt $86\%$.
  * *Hoàn thiện:* Đóng gói toàn bộ hồ sơ báo cáo KHKT, bản tóm tắt, thiết kế poster triển lãm và kịch bản thuyết trình bảo vệ đề tài.

---
**XÁC NHẬN CỦA GIÁO VIÊN HƯỚNG DẪN & NHÓM TÁC GIẢ**
