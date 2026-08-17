# BỘ CÂU HỎI PHẢN BIỆN CỦA BAN GIÁM KHẢO KHKT & CÂU TRẢ LỜI MẪU
*(Tài liệu ôn luyện bảo vệ đề tài đạt điểm tối đa từ Hội đồng Chuyên môn)*

---

### ❓ Câu 1: Em hãy giải thích bản chất của mô hình IRT và tại sao lại tốt hơn cách chấm điểm phần trăm cổ điển (Classical Test Theory - CTT)?
* **Trả lời chuẩn:**  
  > *"Dạ kính thưa thầy cô, trong cách chấm cổ điển CTT, nếu 2 học sinh cùng làm đúng 7/10 câu thì đều được 7 điểm như nhau mà không xét đến độ khó của từng câu. Nhưng theo **Mô hình IRT 3 tham số (3PL)**, mỗi câu hỏi có 3 chỉ số riêng: độ khó $b$, độ phân biệt $a$, và độ đoán mò $c$. Nếu học sinh A làm đúng 7 câu khó thì năng lực Theta ($\theta$) sẽ cao hơn nhiều so với học sinh B chỉ làm đúng 7 câu dễ. Do đó, IRT đo lường được năng lực thực chất và cho phép bài thi thích ứng (CAT) chỉ cần 10-15 câu là ước lượng chính xác trình độ thay vì phải làm cả đề 50 câu dàn trải."*

---

### ❓ Câu 2: Thuật toán ước lượng năng lực EAP (Expected A Posteriori) hoạt động như thế nào trong code của em?
* **Trả lời chuẩn:**  
  > *"Dạ thưa thầy cô, thay vì dùng phương pháp lặp xấp xỉ Newton-Raphson dễ bị phân kỳ khi học sinh làm đúng/sai liên tiếp, hệ thống dùng **tích phân số Gauss-Hermite với 21 điểm nút** trên khoảng $\theta \in [-3, +3]$. Sau mỗi câu trả lời, hàm hợp lý (Likelihood) được nhân với phân phối tiên nghiệm chuẩn $N(0, 1)$ để tính kỳ vọng toán học của phân phối hậu nghiệm. Nhờ đó, việc tính toán diễn ra ngay lập tức dưới 5 mili-giây, cực kỳ mượt mà trên giao diện web."*

---

### ❓ Câu 3: Thuật toán SuperMemo-2 (SM-2) có điểm gì khác biệt so với việc học từ vựng thông thường?
* **Trả lời chuẩn:**  
  > *"Dạ thưa thầy cô, học từ vựng thông thường là học thuộc danh sách từ rồi sau vài tuần không ôn lại sẽ quên mất theo đường cong Ebbinghaus. Thuật toán SM-2 tính toán chỉ số **Easiness Factor ($EF$)** riêng cho từng từ dựa trên mức độ phản hồi của học sinh ($q \in [0, 5]$). Từ nào khó nhớ sẽ được hệ thống nhắc lại sau 1 ngày, từ nào đã thuộc sâu sẽ giãn cách ra 6 ngày, 15 ngày, 30 ngày. Điều này giúp tối ưu hóa thời gian học và tăng tỷ lệ lưu giữ trí nhớ dài hạn lên trên $85\%$."*

---

### ❓ Câu 4: Ngân hàng câu hỏi của các em lấy từ đâu? Làm sao đảm bảo các chỉ số $a, b, c$ là chuẩn xác?
* **Trả lời chuẩn:**  
  > *"Dạ kính thưa thầy cô, Ngân hàng câu hỏi của chúng em được trích xuất và chuẩn hóa từ **Đề thi tham khảo và Đề thi chính thức THPT Quốc gia của Bộ Giáo dục và Đào tạo các năm gần đây**, bám sát ma trận đề thi 2025. Các hệ số độ khó $b$ và độ phân biệt $a$ được gán nhãn dựa trên tỷ lệ trả lời đúng thực tế trong kỳ thi thử và được tham vấn bởi giáo viên bộ môn Tiếng Anh giàu kinh nghiệm của trường."*

---

### ❓ Câu 5: Nếu không có kết nối internet hoặc API AI bị lỗi thì hệ thống có hoạt động được không?
* **Trả lời chuẩn:**  
  > *"Dạ thưa thầy cô, hệ thống được thiết kế theo cơ chế **Fallback 2 lớp an toàn tuyệt đối**:  
  > (1) Các lõi tính toán thích ứng IRT, thuật toán SM-2, Ngân hàng câu hỏi và chấm thi đều chạy độc lập 100% dưới backend FastAPI và SQLite trên máy chủ, không phụ thuộc vào bất kỳ API bên ngoài nào.  
  > (2) Đối với các tính năng tạo bài đọc/nghe AI, nếu API gặp sự cố, hệ thống tự động kích hoạt bộ nhớ đệm bài học offline mẫu cực kỳ chi tiết (400-500 từ) để học sinh không bao giờ bị gián đoạn việc học."*

---

### ❓ Câu 6: Dữ liệu thực nghiệm 40 học sinh của các em có đảm bảo tính khách quan và ngẫu nhiên không?
* **Trả lời chuẩn:**  
  > *"Dạ thưa thầy cô, toàn bộ 40 học sinh Lớp 12 tham gia nghiên cứu đều được kiểm tra bài Pre-test ban đầu để đảm bảo trình độ 2 nhóm là **tương đương nhau** ($p = 0.912 > 0.05$). Phân nhóm thực nghiệm (ADAPTIVE) và đối chứng (CONTROL) được lưu trực tiếp trong Cơ sở dữ liệu SQLite dưới backend để tránh việc học sinh tự ý can thiệp. Mọi tương tác, số giây làm bài, kết quả từng câu đều được ghi nhật ký tự động (research experiment log) và xuất file CSV phục vụ kiểm định $t$-test trên phần mềm SPSS."*

---

### ❓ Câu 7: Chi phí duy trì và triển khai hệ thống cho hàng nghìn học sinh là bao nhiêu?
* **Trả lời chuẩn:**  
  > *"Dạ thưa thầy cô, chi phí triển khai cho học sinh và nhà trường là **hoàn toàn 0 đồng**:  
  > * Hệ thống sử dụng 100% mã nguồn mở (FastAPI, React, SQLite WAL Mode).  
  > * Máy chủ VPS chỉ tốn khoảng 100.000 VNĐ/tháng nhưng với cấu hình Nginx Reverse Proxy và SQLite WAL, máy chủ có thể phục vụ đồng thời hàng nghìn học sinh cùng lúc mà không bị nghẽn mạng."*

---

### ❓ Câu 8: AI có thể tạo ra thông tin sai lệch (hallucination) trong bài đọc không? Các em kiểm soát việc này thế nào?
* **Trả lời chuẩn:**  
  > *"Dạ thưa thầy cô, chúng em áp dụng kỹ thuật **Structured Few-Shot Prompting & JSON Schema Validation**. Chúng em giới hạn AI chỉ được sử dụng danh mục từ vựng học thuật trong khung CEFR B1/B2 và bắt buộc xuất ra định dạng JSON có kèm giải thích ngữ pháp đối chiếu theo quy tắc sách giáo khoa chuẩn. Mọi câu hỏi trắc nghiệm đều được thuật toán backend kiểm tra tính hợp lệ về số lượng đáp án và logic trước khi hiển thị cho học sinh."*

---

### ❓ Câu 9: Tính mới lớn nhất của đề tài này so với các ứng dụng như Duolingo hay Quizlet là gì?
* **Trả lời chuẩn:**  
  > *"Dạ thưa thầy cô, Duolingo chỉ dạy giao tiếp cơ bản theo cây kỹ năng cố định; Quizlet chỉ là thẻ từ vựng đơn thuần. Còn **AI English Mentor** là hệ thống đầu tiên kết hợp:  
  > 1. Ma trận đề thi THPT 2025 của Bộ GD&ĐT Việt Nam.  
  > 2. Đo lường năng lực động bằng mô hình IRT.  
  > 3. Tích hợp Đồ thị tri thức phát hiện lỗ hổng và dự báo điểm thi học kỳ/tốt nghiệp THPT thời gian thực."*

---

### ❓ Câu 10: Hướng phát triển tiếp theo của dự án là gì?
* **Trả lời chuẩn:**  
  > *"Dạ thưa thầy cô, nhóm chúng em dự kiến:  
  > (1) Mở rộng ngân hàng câu hỏi lên 2.000+ câu bao quát cả Lớp 10, 11, 12.  
  > (2) Đóng gói ứng dụng di động Flutter/React Native phát hành trên App Store và Google Play.  
  > (3) Tích hợp mô hình FSRS (Free Spaced Repetition Scheduler) 4 tham số để tối ưu hóa trí nhớ chính xác hơn nữa."*

---
💡 *Bí quyết đạt điểm cao:* Khi trả lời, bắt đầu bằng *"Dạ kính thưa thầy cô..."*, trả lời tự tin, súc tích và luôn gắn liền với số liệu thực nghiệm định lượng!
