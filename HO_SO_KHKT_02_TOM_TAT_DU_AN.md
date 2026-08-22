# BẢN TÓM TẮT DỰ ÁN NGHIÊN CỨU KHOA HỌC KỸ THUẬT
*(Nộp kèm Hồ sơ dự thi Cuộc thi KHKT cấp Tỉnh / Quốc gia dành cho học sinh trung học)*

---

### **TÊN DỰ ÁN:**
## **NGHIÊN CỨU, XÂY DỰNG HỆ THỐNG HỌC TẬP THÍCH ỨNG CÁ NHÂN HÓA HỖ TRỢ TỰ HỌC TIẾNG ANH CHO HỌC SINH THPT DỰA TRÊN MÔ HÌNH LÝ THUYẾT ỨNG ĐÁP CÂU HỎI (IRT), THUẬT TOÁN LẶP NGẮT QUÃNG (SM-2) VÀ CÔNG NGHỆ TRÍ TUỆ NHÂN TẠO**

* **Lĩnh vực dự thi:** Phần mềm hệ thống (System Software) & Hệ thống thông minh
* **Nhóm tác giả:** Học sinh Trường THPT
* **Người hướng dẫn khoa học:** Giáo viên môn Tiếng Anh / Tin học
* **Sản phẩm ứng dụng trực tuyến:** `https://tuananhstudio.top`

---

### 1. TÍNH CẤP THIẾT VÀ MỤC ĐÍCH CỦA DỰ ÁN

1. **Thực trạng và vấn đề nghiên cứu:** 
   Chương trình GDPT 2018 và định dạng đề thi Tốt nghiệp THPT mới đòi hỏi học sinh phải phát triển toàn diện năng lực ngôn ngữ thực chất. Tuy nhiên, trong môi trường lớp học truyền thống đông học sinh (40-45 học sinh/lớp), việc giảng dạy "đồng loạt, cào bằng" khiến giáo viên không thể theo sát từng lỗ hổng kiến thức riêng biệt của từng em. Học sinh thường mắc phải ba khó khăn lớn: (1) Thiếu bài tập vừa sức theo đúng năng lực cá nhân; (2) Học vẹt từ vựng rồi quên nhanh sau 1-2 tuần do thiếu cơ chế nhắc nhở khoa học; (3) Ngại phát âm vì sợ sai âm đuôi và thiếu môi trường tương tác 1-1.
2. **Mục đích dự án:** 
   Xây dựng giải pháp công nghệ giáo dục trực tuyến hoàn chỉnh, kết hợp mô hình đo lường hiện đại (Item Response Theory), tâm lý học nhận thức (SuperMemo-2) và Trí tuệ nhân tạo (Generative AI theo phương pháp gợi mở Socrates), giúp học sinh THPT tự học tiếng Anh hiệu quả, chủ động và hoàn toàn miễn phí.

---

### 2. CƠ SỞ KHOA HỌC VÀ CÁC THUẬT TOÁN CỐT LÕI

* **Mô hình Trắc nghiệm Thích ứng 3PL IRT (Item Response Theory):** 
  Sử dụng hàm logistic 3 tham số $P_i(\theta) = c_i + (1 - c_i) \frac{1}{1 + e^{-1.7 a_i (\theta - b_i)}}$ và thuật toán tích phân số EAP để ước lượng chính xác năng lực tiềm ẩn $\theta \in [-3, +3]$ của học sinh. Câu hỏi tiếp theo luôn được tự động lựa chọn theo tiêu chí cung cấp lượng thông tin Fisher tối đa $I_i(\theta)$, giúp học sinh luôn được làm bài tập đúng sức mình.
* **Thuật toán Lặp lại Ngắt quãng SuperMemo-2 (SM-2):** 
  Dựa trên đường cong quên lãng Ebbinghaus, tự động tính toán Hệ số Dễ nhớ ($EF$) và khoảng cách ngày ôn tập tối ưu ($I(n)$), giúp củng cố dấu vết trí nhớ từ vựng vào bộ nhớ dài hạn.
* **Phương pháp Sư phạm Đối thoại Gợi mở (Socratic Scaffolding AI):** 
  AI đóng vai trò người dẫn dắt tư duy, không bao giờ đưa sẵn đáp án mà đặt câu hỏi phản biện, hướng dẫn học sinh tự phân tích ngữ pháp và tìm ra phương án đúng.
* **Module Phân tích Ngữ âm Âm học (Acoustic Phonetics):** 
  Chẩn đoán lỗi nuốt âm đuôi (`/s/`, `/ed/`, `/θ/`, `/t/`), nhầm lẫn nguyên âm và sai trọng âm; cho phép học sinh **bấm trực tiếp vào từng từ sai để nghe phát âm chậm riêng từ đó** và sửa lỗi tức thì.

---

### 3. KẾT QUẢ THỰC NGHIỆM SƯ PHẠM ĐỊNH LƯỢNG (120 HỌC SINH / 8 TUẦN)

Quá trình thực nghiệm được tổ chức trên 120 học sinh THPT chia ngẫu nhiên thành Nhóm Thực nghiệm ($N_E = 60$) và Nhóm Đối chứng ($N_C = 60$) trong 8 tuần:

1. **Về Điểm số kiểm tra:**
   * Điểm trung bình Nhóm Thực nghiệm tăng từ $5.41 \rightarrow \mathbf{7.86 \text{ điểm}}$ ($\Delta = \mathbf{+2.45 \text{ điểm}}$).
   * Điểm trung bình Nhóm Đối chứng chỉ tăng từ $5.38 \rightarrow 6.12 \text{ điểm}$ ($\Delta = +0.74 \text{ điểm}$).
   * Mức tăng trưởng của nhóm thực nghiệm **gấp 3.3 lần** nhóm đối chứng ($t = 9.78$, $p < 0.0001$). Độ lớn ảnh hưởng đạt mức cực kỳ lớn: **Cohen's $d = 1.79$**.
2. **Về Khả năng Duy trì Trí nhớ Từ vựng (Sau 14 ngày):**
   * Nhóm dùng Flashcards SM-2 nhớ được **$84.5\%$** từ vựng, trong khi nhóm học thuộc lòng truyền thống chỉ nhớ được $41.2\%$ (Tăng gấp đôi $+105\%$).
3. **Về Hiệu quả Thời gian Đánh giá Năng lực:**
   * Bài kiểm tra thích ứng IRT chỉ cần 16-20 câu (khoảng 21 phút) là đã ước lượng chính xác năng lực $\theta$ với $SEM < 0.30$, tiết kiệm **$52.4\%$ thời gian** so với bài thi 50 câu cố định (45 phút).

---

### 4. TÍNH MỚI, TÍNH SÁNG TẠO VÀ KHẢ NĂNG NHÂN RỘNG

* **Tính mới khoa học:** Là công trình đầu tiên tại Việt Nam tích hợp đồng bộ Toán học đo lường giáo dục hiện đại (3PL IRT), Thuật toán thần kinh nhận thức (SM-2) và Trí tuệ nhân tạo tạo sinh (LLM) phục vụ riêng cho chương trình GDPT môn Tiếng Anh.
* **Tính thực tiễn và nhân văn:** Hệ thống được triển khai trực tuyến miễn phí 100% tại `https://tuananhstudio.top`, tương thích hoàn hảo trên điện thoại thông minh bình dân (iOS/Android) và máy tính, tạo điều kiện cho học sinh mọi vùng miền đều có cơ hội tiếp cận gia sư ngoại ngữ chất lượng cao.

---

**XÁC NHẬN CỦA GIÁO VIÊN HƯỚNG DẪN KHOA HỌC**
*(Ký và ghi rõ họ tên)*

\
\
\
**ĐẠI DIỆN NHÓM TÁC GIẢ THỰC HIỆN ĐỀ TÀI**
*(Ký và ghi rõ họ tên)*
