# TỔNG HỢP 12 NỘI DUNG TRỌNG TÂM NGHIÊN CỨU KHOA HỌC KỸ THUẬT
*(Tài liệu ôn luyện, hoàn thiện hồ sơ và chuẩn bị trả lời phỏng vấn trước Hội đồng Giám khảo)*

* **Tên đề tài:** Hệ thống học tập thích ứng cá nhân hóa hỗ trợ tự học tiếng Anh cho học sinh THPT dựa trên mô hình Lý thuyết Ứng đáp Câu hỏi (IRT), Thuật toán lặp ngắt quãng (SM-2) và Công nghệ Trí tuệ nhân tạo
* **Lĩnh vực:** Phần mềm hệ thống (System Software) & Hệ thống thông minh
* **Sản phẩm trực tuyến:** [https://tuananhstudio.top](https://tuananhstudio.top)

---

## 🌟 1. TÍNH MỚI CỦA ĐỀ TÀI (NOVELTY & INNOVATION)
* **Đột phá về tích hợp liên ngành:** Là công trình đầu tiên tại Việt Nam kết hợp đồng bộ 3 trụ cột khoa học: **Toán học đo lường giáo dục hiện đại (Mô hình 3PL IRT)**, **Tâm lý học nhận thức thần kinh (Thuật toán lặp ngắt quãng SuperMemo-2)** và **Trí tuệ nhân tạo đàm thoại gợi mở (Socratic AI Scaffolding)** vào một nền tảng tự học tiếng Anh hoàn chỉnh cho học sinh phổ thông.
* **Xóa bỏ kiểm tra cào bằng:** Không dùng thang điểm phần trăm cố định. Hệ thống đo lường năng lực tiềm ẩn $\theta \in [-3, +3]$ sau từng câu hỏi, tự động chọn câu tiếp theo có độ khó tối ưu theo hàm thông tin Fisher tối đa.
* **Tương tác ngữ âm trực quan độc bản:** Module nhận diện âm thanh đối chiếu âm vị chuẩn IPA, chỉ ra chính xác lỗi nuốt âm đuôi (`/s/`, `/ed/`, `/θ/`, `/t/`) và cho phép học sinh **bấm trực tiếp vào từng từ bị sai để nghe phát âm đọc chậm riêng từ đó** để nhại theo và sửa ngay lập tức.

---

## 🔬 2. TÍNH KHOA HỌC (SCIENTIFIC RIGOR & THEORETICAL BASIS)
* **Cơ sở Toán học Đo lường Giáo dục (IRT):** Sử dụng hàm xác suất Logistic 3 tham số $P_i(\theta) = c_i + (1 - c_i) \frac{1}{1 + e^{-1.7 a_i (\theta - b_i)}}$ (với $a_i$: độ phân biệt, $b_i$: độ khó, $c_i$: hệ số đoán mò) và thuật toán tích phân số Gauss-Hermite 21 điểm nút để tính kỳ vọng năng lực EAP trong thời gian $< 5\text{ms}$.
* **Cơ sở Tâm lý học Nhận thức (Spaced Repetition):** Dựa trên quy luật suy giảm trí nhớ của Hermann Ebbinghaus (1885) và thuật toán tối ưu hóa ghi nhớ SuperMemo-2 (P.A. Wozniak, 1990) để tự động cập nhật Hệ số Dễ nhớ ($EF$) và tính khoảng cách ngày ôn tập $I(n) = I(n-1) \times EF'$.
* **Cơ sở Lý luận Sư phạm (Socratic Scaffolding):** Áp dụng Thuyết vùng phát triển gần nhất (ZPD - Vygotsky) và phương pháp giàn giáo sư phạm Socrates: AI không bao giờ giải hộ hay đưa sẵn đáp án mà đặt câu hỏi phản biện, dẫn dắt học sinh tự tìm ra cách giải.
* **Phương pháp Xử lý Số liệu Chuẩn xác:** Kiểm định $t$-test mẫu độc lập (Independent $t$-test), kiểm định $t$-test theo cặp (Paired $t$-test) và đo lường độ lớn ảnh hưởng chuẩn hóa **Cohen's $d = 1.79$**.

---

## 🎯 3. TÍNH THỰC TIỄN (PRACTICAL EFFECTIVENESS)
* **Giải quyết đúng 3 khó khăn thực tế:** (1) Quá tải bài tập không vừa sức; (2) Học vẹt từ vựng rồi quên 80% sau 1-2 tuần; (3) E ngại nuốt âm đuôi và thiếu môi trường tương tác 1-1.
* **Hiệu quả thực chứng vượt trội (120 học sinh / 8 tuần):**
  * Điểm trung bình tăng **$+2.45$ điểm** (gấp 3.3 lần nhóm đối chứng).
  * Tỷ lệ ghi nhớ từ vựng sau 14 ngày đạt **$84.5\%$** (tăng gấp đôi $+105\%$).
  * Tiết kiệm **$52.4\%$** thời gian làm bài kiểm tra.
* **Sản phẩm hoàn thiện, sẵn sàng sử dụng:** Đang chạy trực tuyến 100% tại `https://tuananhstudio.top`, điểm Google PageSpeed đạt 99-100/100, phản hồi dưới 0.5 giây.

---

## 🌍 4. TÍNH CỘNG ĐỒNG VÀ NHÂN VĂN (COMMUNITY IMPACT)
* **Bình đẳng cơ hội giáo dục:** Cung cấp nền tảng tự học miễn phí 100% cho mọi học sinh và nhà trường, xóa bỏ rào cản chi phí học thêm đắt đỏ.
* **Tiếp cận phổ quát:** Tối ưu hóa cực kỳ nhẹ, chạy mượt mà trên cả điện thoại thông minh bình dân và mạng 3G/4G yếu, giúp học sinh ở mọi vùng miền tiếp cận gia sư AI chất lượng cao.
* **Đồng hành cùng giáo viên:** Cung cấp Bảng Quản trị Nghiên cứu Sư phạm (Admin Research Panel) cho giáo viên theo dõi tiến độ của học sinh và xuất dữ liệu Excel/CSV phục vụ nghiên cứu của nhà trường.

---

## 💡 5. LÍ DO CHỌN DỰ ÁN (RATIONALE & BACKGROUND)
* Chương trình GDPT 2018 và định dạng đề thi Tốt nghiệp THPT mới từ năm 2025 đòi hỏi học sinh phát triển năng lực ngôn ngữ thực chất (đọc hiểu tờ rơi, thông báo, sắp xếp đoạn văn, tư duy ngôn ngữ).
* Sĩ số lớp học phổ thông đông (**40 - 45 học sinh/lớp**), giáo viên trên lớp không thể kèm riêng từng học sinh để chỉ ra từng lỗi ngữ pháp và phát âm.
* Học sinh thiếu một phương pháp tự học khoa học, thường học thuộc lòng danh sách từ rồi mau quên, dẫn đến tâm lý chán nản, sợ môn Tiếng Anh.

---

## 🎯 6. MỤC ĐÍCH NGHIÊN CỨU (RESEARCH OBJECTIVES)
1. Xây dựng một nền tảng Web học tập trực tuyến thông minh, thích ứng cá nhân hóa hoàn toàn miễn phí cho học sinh THPT.
2. Ứng dụng mô hình 3PL IRT và thuật toán EAP để ước lượng chính xác năng lực tiềm ẩn $\theta$ và tự động chọn bài tập vừa đúng sức của học sinh.
3. Ứng dụng thuật toán SuperMemo-2 để chuyển hóa từ vựng ngắn hạn thành trí nhớ dài hạn bền vững.
4. Tích hợp phân tích âm học và gia sư Socrates AI để rèn luyện kỹ năng phát âm chuẩn IPA và tư duy tự sửa lỗi ngữ pháp.
5. Kiểm chứng thực nghiệm tính hiệu quả sư phạm của hệ thống trên 120 học sinh THPT trong 8 tuần.

---

## ❓ 7. CÂU HỎI NGHIÊN CỨU (RESEARCH QUESTIONS)
* **Q1 (Về Đo lường Năng lực):** Mô hình trắc nghiệm thích ứng 3PL IRT có giúp xác định chính xác năng lực thực chất và rút ngắn thời gian làm bài của học sinh so với bài thi 50 câu cố định truyền thống không?
* **Q2 (Về Độ bền Trí nhớ):** Thuật toán lặp ngắt quãng SuperMemo-2 có nâng cao tỷ lệ duy trì trí nhớ từ vựng sau 14 ngày so với phương pháp học thuộc lòng thông thường không?
* **Q3 (Về Ngữ âm & Tư duy):** Module chẩn đoán âm học và Gia sư gợi mở Socrates AI có giúp học sinh tự sửa lỗi nuốt âm đuôi và tăng sự tự tin khi tự học tiếng Anh không?

---

## 🧪 8. GIẢ THUYẾT KHOA HỌC (SCIENTIFIC HYPOTHESES)
* **Giả thuyết H1 (Về điểm số & năng lực):** Học sinh sử dụng hệ thống AI English Mentor (Nhóm Thực nghiệm) sẽ có mức tăng trưởng điểm số kiểm tra và năng lực $\theta$ cao hơn có ý nghĩa thống kê ($p < 0.05$) so với học sinh học theo phương pháp truyền thống (Nhóm Đối chứng).
* **Giả thuyết H2 (Về trí nhớ từ vựng):** Tỷ lệ ghi nhớ từ vựng sau 14 ngày của nhóm sử dụng Flashcards SM-2 đạt trên $75\%$, cao hơn ít nhất $30\%$ so với nhóm đối chứng học truyền thống.
* **Giả thuyết H3 (Về thời gian đánh giá):** Bài kiểm tra thích ứng CAT dựa trên IRT giảm ít nhất $40\%$ thời gian làm bài so với bài thi 50 câu cố định mà vẫn duy trì sai số ước lượng chuẩn $SEM < 0.30$.

---

## ⚠️ 9. VẤN ĐỀ NGHIÊN CỨU (CORE RESEARCH PROBLEMS)
* **Vấn đề 1 (Toán học ước lượng):** Làm thế nào để ước lượng chính xác năng lực thực chất $\theta$ của học sinh ngay sau từng câu hỏi mà không gây độ trễ giao diện?
* **Vấn đề 2 (Tâm lý học nhận thức):** Làm thế nào để tự động tính toán chu kỳ lặp lại ngắt quãng phù hợp với tốc độ ghi nhớ riêng biệt của từng cá nhân?
* **Vấn đề 3 (Sư phạm đàm thoại):** Làm thế nào để công nghệ AI đóng vai trò người thầy gợi mở tư duy (scaffolding) mà không đưa sẵn đáp án cho học sinh ỷ lại?
* **Vấn đề 4 (Xử lý âm học):** Làm thế nào để chẩn đoán chính xác lỗi âm vị (nhất là âm đuôi tiếng Anh) trên thiết bị di động bình dân trong điều kiện môi trường có tạp âm?

---

## 🛠️ 10. PHƯƠNG PHÁP NGHIÊN CỨU & CÔNG NGHỆ (METHODOLOGY & TECH)
1. **Phương pháp nghiên cứu lý thuyết:** Nghiên cứu các công trình đo lường giáo dục của Lord (1980), đường cong quên lãng Ebbinghaus (1885), thuật toán SM-2 của Wozniak (1990) và khung năng lực CEFR B1/B2.
2. **Phương pháp mô hình hóa toán học & lập trình:** Xây dựng hàm 3PL IRT; thuật toán tích phân số Gauss-Hermite 21 điểm nút; thuật toán lặp ngắt quãng SM-2; pipeline phân tích âm học đa tầng (Acoustic Phonetics); kỹ thuật Structured Few-shot Prompting với JSON schema validation.
3. **Phương pháp thực nghiệm sư phạm:** Thiết kế thực nghiệm có nhóm đối chứng (Pre-test / Post-test Control Group Design) trên 120 học sinh THPT trong 8 tuần liên tục.
4. **Phương pháp thống kê toán học:** Sử dụng kiểm định $t$-test độc lập, kiểm định $t$-test theo cặp, đo lường độ lớn ảnh hưởng Cohen's $d$ và xử lý bằng Python Scipy Stats / SPSS.

---

## 📊 11. THỰC NGHIỆM SƯ PHẠM VÀ KẾT QUẢ ĐỊNH LƯỢNG (EXPERIMENT & DATA)
Thực nghiệm được tiến hành trong 8 tuần (từ 05/01/2026 đến 28/02/2026) trên 120 học sinh THPT chia đều thành 2 nhóm:

| Chỉ số đánh giá | Nhóm Đối chứng ($N_C=60$) | Nhóm Thực nghiệm ($N_E=60$) | Chênh lệch ($\Delta$) | Ý nghĩa thống kê |
|:---|:---:|:---:|:---:|:---:|
| **Điểm Pre-test (Trước TN)** | $5.38 \pm 1.12$ | $5.41 \pm 1.08$ | $+0.03$ | $t = 0.15, p = 0.881 > 0.05$ (Tương đồng ban đầu) |
| **Điểm Post-test (Sau TN)** | $6.12 \pm 1.05$ | $\mathbf{7.86 \pm 0.89}$ | $\mathbf{+1.74}$ | $t = 9.78, p < 0.0001$ (Bác bỏ $H_0$) |
| **Mức tăng trung bình** | $+0.74\text{ điểm}$ | $\mathbf{+2.45\text{ điểm}}$ | **Gấp 3.3 lần** | Nhóm TN bứt phá vượt bậc |
| **Năng lực Theta đầu ra** | $+0.18 \pm 0.45$ | $\mathbf{+0.92 \pm 0.38}$ | $+0.74$ | $p < 0.0001$ (Hội tụ chuẩn) |
| **Từ vựng nhớ sau 14 ngày** | $41.2\%\text{ (41/100)}$ | $\mathbf{84.5\%\text{ (84/100)}}$ | $+43.3\%$ | **Tăng gấp đôi (+105%)** |
| **Thời gian làm bài CAT** | $45.0\text{ phút (cố định)}$ | $\mathbf{21.4 \pm 3.2\text{ phút}}$ | Giảm $52.4\%$ | Tiết kiệm hơn $23$ phút |

* **Kết luận thống kê:** Kiểm định $t$-test độc lập cho kết quả $t(118) = 9.78, p < 0.0001$ và **Cohen's $d = 1.79$** ($> 0.80$ - mức độ ảnh hưởng cực lớn), chứng minh giả thuyết H1, H2, H3 là hoàn toàn đúng đắn.

---

## 📋 12. KHẢO SÁT THỰC TẾ & ĐÁNH GIÁ MỨC ĐỘ HÀI LÒNG (SURVEY & ACCEPTANCE)
Khảo sát định lượng trên thang đo Likert 5 mức độ đối với 60 học sinh Nhóm Thực nghiệm sau 8 tuần:
1. **Về sự tự tin & động lực:** **$98.3\%$** học sinh đồng ý hệ thống giúp nâng cao sự tự tin và hứng thú khi tự học môn Tiếng Anh.
2. **Về hiệu quả ghi nhớ từ vựng:** **$100\%$** học sinh khẳng định tính năng Flashcards SM-2 giúp ghi nhớ từ vựng lâu hơn nhiều so với việc chép danh sách từ truyền thống.
3. **Về tính năng sửa phát âm:** **$95.0\%$** học sinh đánh giá cao tính năng bấm trực tiếp vào từ phát âm sai để nghe đọc chậm từng âm và sửa lại tức thì.
4. **Về phong cách sư phạm AI:** **$96.7\%$** học sinh thích thú với phương pháp gia sư Socrates AI gợi mở câu hỏi thay vì đưa sẵn đáp án như các công cụ giải bài thông thường.
5. **Về trải nghiệm công nghệ:** **$98.3\%$** học sinh hài lòng với tốc độ tải trang tức thì và giao diện mượt mà trên điện thoại thông minh.
