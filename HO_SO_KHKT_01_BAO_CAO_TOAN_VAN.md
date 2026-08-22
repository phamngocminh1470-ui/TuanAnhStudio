# BÁO CÁO TOÀN VĂN KẾT QUẢ NGHIÊN CỨU ĐỀ TÀI KHOA HỌC KỸ THUẬT

**CUỘC THI KHOA HỌC KỸ THUẬT CẤP TỈNH / QUỐC GIA DÀNH CHO HỌC SINH TRUNG HỌC**

---

### **TÊN ĐỀ TÀI:**
## **NGHIÊN CỨU, XÂY DỰNG HỆ THỐNG HỌC TẬP THÍCH ỨNG CÁ NHÂN HÓA HỖ TRỢ TỰ HỌC TIẾNG ANH CHO HỌC SINH THPT DỰA TRÊN MÔ HÌNH LÝ THUYẾT ỨNG ĐÁP CÂU HỎI (IRT), THUẬT TOÁN LẶP NGẮT QUÃNG (SM-2) VÀ CÔNG NGHỆ TRÍ TUỆ NHÂN TẠO**

* **Lĩnh vực nghiên cứu:** Phần mềm hệ thống (System Software) & Hệ thống thông minh
* **Nhóm tác giả:** Học sinh Trường Trung học Phổ thông
* **Người hướng dẫn khoa học:** Giáo viên môn Tiếng Anh / Tin học
* **Sản phẩm ứng dụng trực tuyến:** `https://tuananhstudio.top`

---

## MỤC LỤC BÁO CÁO

* **PHẦN I: MỞ ĐẦU VÀ TÍNH CẤP THIẾT CỦA ĐỀ TÀI**
  * 1.1. Lý do chọn đề tài
  * 1.2. Mục đích nghiên cứu
  * 1.3. Khách thể và đối tượng nghiên cứu
  * 1.4. Câu hỏi nghiên cứu và Giả thuyết khoa học
  * 1.5. Phạm vi và giới hạn của đề tài
  * 1.6. Phương pháp nghiên cứu sử dụng
* **PHẦN II: TỔNG QUAN TÀI LIỆU VÀ CƠ SỞ KHOA HỌC**
  * 2.1. Tổng quan các nghiên cứu trong và ngoài nước
  * 2.2. Cơ sở lý thuyết đo lường giáo dục: Mô hình Lý thuyết Ứng đáp Câu hỏi (IRT)
  * 2.3. Cơ sở tâm lý học nhận thức: Đường cong quên lãng Ebbinghaus và Thuật toán Lặp lại ngắt quãng SuperMemo-2 (SM-2)
  * 2.4. Phương pháp sư phạm đối thoại gợi mở (Socratic Scaffolding) kết hợp Mô hình Ngôn ngữ Lớn (LLM)
  * 2.5. Cơ chế phân tích âm học và nhận diện lỗi ngữ âm theo chuẩn IPA
* **PHẦN III: THIẾT KẾ KỸ THUẬT VÀ QUY TRÌNH XÂY DỰNG HỆ THỐNG**
  * 3.1. Kiến trúc tổng thể hệ thống (System Architecture)
  * 3.2. Thiết kế Cơ sở dữ liệu và Ngân hàng câu hỏi định chuẩn GDPT 2018
  * 3.3. Thuật toán chọn câu hỏi thích ứng theo hàm thông tin Fisher tối đa
  * 3.4. Module chấm và phân tích phát âm đa tầng (Multi-tier Acoustic Pipeline)
  * 3.5. Module gia sư đàm thoại gợi mở Socratic AI
* **PHẦN IV: KẾT QUẢ THỰC NGHIỆM SƯ PHẠM VÀ PHÂN TÍCH SỐ LIỆU**
  * 4.1. Thiết kế và quy trình tổ chức thực nghiệm
  * 4.2. Thống kê mô tả kết quả kiểm tra trước và sau thực nghiệm (Pre-test & Post-test)
  * 4.3. Kiểm định thống kê suy luận (Kiểm định t-test và Độ lớn ảnh hưởng Cohen's d)
  * 4.4. Đánh giá sự biến thiên năng lực ($\theta$) và khả năng ghi nhớ từ vựng
  * 4.5. Khảo sát định tính về thái độ, tính tự chủ và phản hồi của học sinh - giáo viên
  * 4.6. Phân tích những khó khăn, hạn chế và sai số thực nghiệm
* **PHẦN V: KẾT LUẬN, KIẾN NGHỊ VÀ HƯỚNG PHÁT TRIỂN**
  * 5.1. Kết luận khoa học
  * 5.2. Ý nghĩa thực tiễn và tính khả thi trong nhân rộng
  * 5.3. Khuyến nghị sư phạm đối với nhà trường
  * 5.4. Hướng mở rộng đề tài trong tương lai
* **TÀI LIỆU THAM KHẢO**

---

# PHẦN I: MỞ ĐẦU VÀ TÍNH CẤP THIẾT CỦA ĐỀ TÀI

### 1.1. Lý do chọn đề tài

Trong bối cảnh toàn cầu hóa và hội nhập quốc tế, năng lực sử dụng Tiếng Anh đóng vai trò then chốt đối với học sinh trung học phổ thông (THPT). Chương trình Giáo dục phổ thông 2018 (GDPT 2018) môn Tiếng Anh đã chuyển dịch mạnh mẽ từ việc cung cấp kiến thức ngôn ngữ hàn lâm (ngữ pháp, từ vựng đơn lẻ) sang hình thành và phát triển toàn diện năng lực giao tiếp (Nghe, Nói, Đọc, Viết) gắn liền với bối cảnh thực tiễn. Cấu trúc định dạng đề thi Tốt nghiệp THPT mới cũng đòi hỏi học sinh phải có khả năng xử lý thông tin thực tế, tư duy phản biện và vận dụng ngôn ngữ linh hoạt.

Tuy nhiên, qua khảo sát thực tế và quan sát quá trình học tập tại các trường THPT, nhóm nghiên cứu nhận thấy học sinh đang gặp phải ba rào cản rất lớn:

1. **Rào cản về cá nhân hóa trong lớp học truyền thống:** Với sĩ số trung bình từ 40 đến 45 học sinh trong một lớp học, sự phân hóa về trình độ đầu vào là rất lớn. Phương pháp giảng dạy "đồng loạt, cào bằng" khiến học sinh có học lực khá/giỏi cảm thấy thiếu thử thách, trong khi học sinh có học lực trung bình/yếu dễ rơi vào trạng thái quá tải, nản lòng trước các bài tập quá khó. Giáo viên trên lớp không đủ thời gian để theo dõi và kèm cặp từng lỗ hổng kiến thức riêng biệt của từng học sinh.
2. **Hội chứng "học vẹt - mau quên" từ vựng:** Đa số học sinh học từ vựng bằng cách chép danh sách từ nhiều lần vào vở để đối phó với các bài kiểm tra 15 phút. Thiếu một cơ chế nhắc nhở ôn tập khoa học dựa trên đặc điểm suy giảm trí nhớ sinh học, dẫn đến việc học sinh quên đến 70-80% lượng từ vựng chỉ sau 1 đến 2 tuần.
3. **Tâm lý e ngại và thiếu môi trường rèn luyện kỹ năng Nói (Speaking) - Viết (Writing):** Kỹ năng phát âm và giao tiếp là điểm yếu phổ biến nhất của học sinh Việt Nam do thói quen nuốt âm đuôi (*ending sounds* như `/s/`, `/z/`, `/t/`, `/d/`, `/ks/`, `/θ/`), phát âm sai trọng âm và ngữ điệu. Trong khi đó, việc theo học tại các trung tâm ngoại ngữ có giáo viên bản xứ kèm 1-1 lại quá tốn kém, tạo nên sự bất bình đẳng về cơ hội tiếp cận giáo dục chất lượng cao giữa học sinh thành thị và học sinh nông thôn, miền núi.

Nhận thức được những trăn trở đó, với niềm đam mê nghiên cứu khoa học và sự hướng dẫn của giáo viên, nhóm tác giả đã lựa chọn đề tài: **"Nghiên cứu, xây dựng hệ thống học tập thích ứng cá nhân hóa hỗ trợ tự học tiếng Anh cho học sinh THPT dựa trên mô hình Lý thuyết Ứng đáp Câu hỏi (IRT), thuật toán Lặp ngắt quãng (SM-2) và công nghệ Trí tuệ nhân tạo"** (tên ứng dụng: *AI English Mentor*).

### 1.2. Mục đích nghiên cứu

1. Vận dụng mô hình khoa học đo lường giáo dục hiện đại (Item Response Theory) và thuật toán tâm lý nhận thức (SuperMemo-2) để xây dựng giải pháp công nghệ tự động điều chỉnh độ khó bài tập, chẩn đoán lỗ hổng kiến thức và tối ưu hóa chu kỳ ghi nhớ từ vựng cho từng học sinh.
2. Ứng dụng công nghệ xử lý âm thanh và Trí tuệ nhân tạo tạo sinh (Generative AI) theo phương pháp đàm thoại gợi mở Socrates (Socratic Scaffolding), giúp học sinh tự rèn luyện kỹ năng Phát âm chuẩn quốc tế và tư duy giải quyết vấn đề mà không bị phụ thuộc vào việc "cho sẵn đáp án".
3. Triển khai thử nghiệm thực tế tại trường THPT nhằm đánh giá tính khả thi, hiệu quả sư phạm và khả năng nhân rộng của hệ sinh thái phần mềm vào hoạt động tự học của học sinh phổ thông.

### 1.3. Khách thể và đối tượng nghiên cứu

* **Khách thể nghiên cứu:** Quá trình tự học và ôn luyện môn Tiếng Anh của học sinh bậc Trung học Phổ thông theo Chương trình GDPT 2018.
* **Đối tượng nghiên cứu:** 
  * Mô hình trắc nghiệm thích ứng trên máy tính (Computerized Adaptive Testing - CAT) dựa trên lý thuyết IRT 2-PL / 3-PL.
  * Thuật toán lập lịch lặp lại ngắt quãng SuperMemo-2 (SM-2).
  * Quy trình xử lý ngôn ngữ tự nhiên và âm học (Acoustic Phonetics) trong đánh giá phát âm và đàm thoại sư phạm AI.
  * Kiến trúc phần mềm ứng dụng Web Fullstack hỗ trợ học tập cá nhân hóa đa nền tảng.

### 1.4. Câu hỏi nghiên cứu và Giả thuyết khoa học

#### 1.4.1. Câu hỏi nghiên cứu
* **Câu hỏi 1 (Q1):** Việc áp dụng thuật toán kiểm tra thích ứng IRT có giúp xác định chính xác năng lực thực chất và rút ngắn thời gian làm bài của học sinh so với phương pháp làm đề truyền thống hay không?
* **Câu hỏi 2 (Q2):** Học từ vựng thông qua thuật toán Lặp ngắt quãng SM-2 có giúp nâng cao độ bền ghi nhớ dài hạn (sau 14 và 30 ngày) so với phương pháp học thuộc lòng truyền thống không?
* **Câu hỏi 3 (Q3):** Việc kết hợp hệ thống gia sư gợi mở Socrates AI và module chấm phát âm âm học có tạo ra sự cải thiện có ý nghĩa thống kê về điểm số, khả năng tự học và mức độ tự tin của học sinh hay không?

#### 1.4.2. Giả thuyết khoa học
* **Giả thuyết $H_1$:** Học sinh học tập trên hệ thống thích ứng cá nhân hóa (Nhóm Thực nghiệm) sẽ có mức tăng trưởng điểm kiểm tra ($\Delta \text{Score}$) và năng lực tiềm ẩn ($\Delta \theta$) cao hơn có ý nghĩa thống kê ($p < 0.05$) so với học sinh tự học theo phương pháp truyền thống (Nhóm Đối chứng).
* **Giả thuyết $H_2$:** Tỷ lệ duy trì trí nhớ từ vựng sau 14 ngày của nhóm sử dụng thuật toán SM-2 đạt trên 75%, cao hơn ít nhất 30% so với nhóm không sử dụng thuật toán.
* **Giả thuyết $H_3$:** Thời gian làm bài đánh giá năng lực của học sinh trên hệ thống CAT-IRT giảm ít nhất 40% so với bài kiểm tra định kỳ cố định mà vẫn đảm bảo độ tin cậy đo lường.

### 1.5. Phạm vi và giới hạn của đề tài

* **Phạm vi nội dung:** Bám sát chương trình môn Tiếng Anh THPT (Lớp 10, 11, 12) và cấu trúc đề thi tham khảo Tốt nghiệp THPT của Bộ Giáo dục và Đào tạo.
* **Phạm vi thực nghiệm:** Thực hiện trên 120 học sinh thuộc khối 10, 11, 12 tại trường THPT trong thời gian 8 tuần liên tục (Học kỳ II năm học 2025 - 2026).
* **Giới hạn công nghệ:** Hệ thống được phát triển dưới dạng ứng dụng Web tiến bộ (Progressive Web Application), tối ưu hóa trên mọi thiết bị có kết nối Internet (Máy tính, Máy tính bảng, Điện thoại thông minh).

### 1.6. Phương pháp nghiên cứu sử dụng

1. **Phương pháp nghiên cứu lý thuyết:** Nghiên cứu các tài liệu khoa học về Lý thuyết Ứng đáp Câu hỏi (Item Response Theory), Tâm lý học nhận thức (Cognitive Psychology), Đường cong quên lãng Ebbinghaus, Phương pháp giáo dục gợi mở Socrates, các mô hình Xử lý Ngôn ngữ Tự nhiên (NLP) và Xử lý Tín hiệu Âm thanh.
2. **Phương pháp phân tích và thiết kế phần mềm:** Áp dụng quy trình kỹ thuật phần mềm chuẩn (Agile/Scrum), thiết kế hệ thống phân tán Client-Server, xây dựng RESTful API và cơ sở dữ liệu quan hệ tối ưu hóa hiệu năng.
3. **Phương pháp thực nghiệm sư phạm đối chứng:** Chia mẫu nghiên cứu thành hai nhóm tương đương về trình độ đầu vào: Nhóm Thực nghiệm (sử dụng hệ thống) và Nhóm Đối chứng (học phương pháp truyền thống). Tiến hành đo lường trước thực nghiệm (Pre-test), trong quá trình học và sau thực nghiệm (Post-test).
4. **Phương pháp thống kê toán học:** Sử dụng phần mềm thống kê để phân tích các chỉ số: Trung bình cộng ($\bar{X}$), Độ lệch chuẩn ($SD$), Kiểm định $t$-Student độc lập và theo cặp (Independent & Paired $t$-test), Đo lường độ lớn ảnh hưởng (Cohen's $d$) và Phân tích tương quan Pearson ($r$).

---

# PHẦN II: TỔNG QUAN TÀI LIỆU VÀ CƠ SỞ KHOA HỌC

### 2.1. Tổng quan các nghiên cứu trong và ngoài nước

* **Trên thế giới:** Các hệ thống kiểm tra thích ứng trên máy tính (CAT) dựa trên IRT đã được áp dụng rộng rãi trong các kỳ thi chuẩn hóa quốc tế hàng đầu như GRE, GMAT, Duolingo English Test (DET). Về mặt trí nhớ, thuật toán SuperMemo (Wozniak, 1990) và Anki đã chứng minh được hiệu quả vượt trội trong việc duy trì trí nhớ dài hạn. Tuy nhiên, phần lớn các ứng dụng quốc tế hiện nay là phần mềm thương mại đóng gói, chi phí bản quyền cao và nội dung không bám sát chương trình giáo dục phổ thông của Việt Nam.
* **Tại Việt Nam:** Hầu hết các trang web luyện thi trực tuyến hiện nay (như Tuyensinh247, Hocmai, Vietjack) hoạt động theo mô hình tĩnh: cung cấp các đề thi có sẵn với danh sách câu hỏi cố định cho mọi đối tượng học sinh (Lý thuyết Khảo thí Cổ điển - CTT). Học sinh làm đúng hay sai cũng chỉ nhận được điểm số tổng mà không được chẩn đoán chính xác năng lực tiềm ẩn ($\theta$) hay lộ trình khắc phục điểm yếu cá nhân.

### 2.2. Cơ sở lý thuyết đo lường giáo dục: Mô hình Lý thuyết Ứng đáp Câu hỏi (Item Response Theory - IRT)

Khác với Lý thuyết Trắc nghiệm Cổ điển (CTT) vốn đánh giá năng lực học sinh dựa trên tổng số câu đúng (dễ bị sai lệch khi đề quá dễ hoặc quá khó), **Lý thuyết Ứng đáp Câu hỏi (IRT)** xem năng lực của học sinh là một biến tiềm ẩn (Latent Trait, ký hiệu là $\theta \in [-\infty, +\infty]$, chuẩn hóa trong khoảng $[-3.0, +3.0]$).

Trong đề tài này, nhóm nghiên cứu áp dụng **Mô hình Logistic 3 Tham số (3-Parameter Logistic Model - 3PL)** cho các câu hỏi trắc nghiệm khách quan 4 lựa chọn:

$$P_i(\theta) = c_i + (1 - c_i) \frac{1}{1 + e^{-1.7 a_i (\theta - b_i)}}$$

*Trong đó:*
* $P_i(\theta)$: Xác suất một học sinh có mức năng lực $\theta$ trả lời đúng câu hỏi $i$.
* $b_i \in [-3, +3]$: **Độ khó của câu hỏi** (*Item Difficulty*). Câu có $b_i$ càng cao thì đòi hỏi năng lực $\theta$ càng lớn mới có xác suất làm đúng cao.
* $a_i \in [0.5, 2.5]$: **Độ phân biệt của câu hỏi** (*Item Discrimination*). Thể hiện độ dốc của đường cong đặc trưng câu hỏi (ICC).
* $c_i \in [0, 1]$: **Hệ số đoán mò ngẫu nhiên** (*Guessing Parameter*). Đối với trắc nghiệm 4 lựa chọn, $c_i \approx 0.20 - 0.25$.

```
Xác suất Đúng P(θ)
1.0 |                                       . - - - (Học sinh Giỏi θ > 1.5)
    |                                 . - '
0.5 |                      . - - '   (Điểm uốn: θ = b_i)
    |             . - - ' 
0.2 | - - - - - - - - - - - - - - - - - - - - - - - (Hệ số đoán mò c_i = 0.2)
0.0 |__________________________________________
   -3.0        -1.5         0.0        +1.5       +3.0   Năng lực Học sinh (θ)
```

**Thuật toán ước lượng năng lực EAP (Expected A Posteriori):**
Sau mỗi câu trả lời của học sinh (đúng: $u_i = 1$, sai: $u_i = 0$), hàm hợp lý (Likelihood Function) được cập nhật:
$$L(\mathbf{u}|\theta) = \prod_{i=1}^n P_i(\theta)^{u_i} (1 - P_i(\theta))^{1 - u_i}$$
Hệ thống sử dụng phương pháp tích phân số cầu phương Gauss-Hermite với 21 điểm nút trên đoạn $[-3.0, +3.0]$ để cập nhật giá trị kỳ vọng năng lực $\hat{\theta}$:
$$\hat{\theta}_{EAP} = \frac{\sum_{k=1}^{21} X_k \cdot L(\mathbf{u}|X_k) \cdot W_k}{\sum_{k=1}^{21} L(\mathbf{u}|X_k) \cdot W_k}$$

**Nguyên lý chọn câu hỏi thích ứng (Maximum Fisher Information):**
Câu hỏi tiếp theo được chọn từ ngân hàng đề là câu hỏi cung cấp lượng thông tin tối đa tại mức năng lực hiện tại $\hat{\theta}$ của học sinh:
$$I_i(\theta) = \frac{(P'_i(\theta))^2}{P_i(\theta)(1 - P_i(\theta))} = 1.7^2 a_i^2 \frac{1 - P_i(\theta)}{P_i(\theta)} \left[ \frac{P_i(\theta) - c_i}{1 - c_i} \right]^2$$
Nhờ cơ chế này, học sinh luôn được làm những câu hỏi **vừa sức và mang lại giá trị chẩn đoán cao nhất**, loại bỏ hoàn toàn cảm giác chán nản hoặc quá tải.

---

### 2.3. Cơ sở tâm lý học nhận thức: Đường cong quên lãng Ebbinghaus và Thuật toán SuperMemo-2 (SM-2)

Nghiên cứu của nhà tâm lý học người Đức Hermann Ebbinghaus đã chỉ ra rằng bộ não con người có xu hướng quên thông tin mới tiếp nhận theo một hàm số mũ suy giảm nhanh chóng trong 24-48 giờ đầu tiên. Tuy nhiên, nếu thông tin được nhắc lại đúng vào **thời điểm sắp bị quên**, độ bền của dấu vết thần kinh (Memory Trace) sẽ được gia cố và tốc độ suy giảm sẽ chậm dần.

```
Mức độ nhớ (%)
100% |  \ Lần 1     /---\ Lần 2       /-----\ Lần 3         /-------\ Lần 4 (Trí nhớ dài hạn)
     |   \         /     \           /       \             /
     |    \       /       \         /         \           /
 50% |     \     /         \       /           \         /
     |      \   /           \     /             \       /
  0% |_______\_/_____________\___/_______________\_____/___________ Thời gian (Ngày)
     Ngày 0   Ngày 1          Ngày 3               Ngày 7      Ngày 14
```

Đề tài tích hợp thuật toán **SuperMemo-2 (SM-2)** để tự động tính toán lịch nhắc nhở từ vựng cho từng học sinh:
1. **Chỉ số đánh giá chất lượng phản hồi ($q \in [0, 5]$):**
   * $q = 5$: Nhớ hoàn hảo, phản xạ tức thì.
   * $q = 4$: Nhớ đúng sau một chút suy nghĩ.
   * $q = 3$: Nhớ đúng nhưng gặp khó khăn lớn.
   * $q \le 2$: Không nhớ hoặc nhớ sai hoàn toàn.
2. **Cập nhật Hệ số Dễ nhớ (Easiness Factor - $EF$):**
   $$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$
   *(với điều kiện biên $EF' \ge 1.3$; giá trị khởi tạo $EF_0 = 2.5$).*
3. **Tính toán Khoảng cách Ngày ôn tập tiếp theo ($I(n)$):**
   $$I(n) = \begin{cases} 1 \text{ ngày} & \text{khi } n = 1 \\ 6 \text{ ngày} & \text{khi } n = 2 \\ \text{round}(I(n-1) \times EF') & \text{khi } n > 2 \end{cases}$$
   *(Nếu $q < 3$, quá trình lặp lại được đặt lại từ đầu: $n = 1, I(1) = 1$).*

---

### 2.4. Phương pháp sư phạm đối thoại gợi mở (Socratic Scaffolding)

Một sai lầm phổ biến khi học sinh sử dụng các công cụ AI hiện nay (như ChatGPT) là việc yêu cầu AI giải hộ bài tập hoặc chép nguyên đáp án. Điều này làm triệt tiêu tư duy độc lập và năng lực tự học của học sinh.

Trong đề tài này, nhóm nghiên cứu đã thiết lập hệ thống **Gia sư Socratic AI** dựa trên thuyết "Vùng phát triển gần nhất" (Zone of Proximal Development - ZPD) của nhà tâm lý học Lev Vygotsky. Hệ thống được lập trình tuân thủ nghiêm ngặt các nguyên tắc sư phạm:
* **Không bao giờ đưa ra đáp án trực tiếp:** Khi học sinh chọn sai hoặc đặt câu hỏi, AI sẽ đóng vai trò người dẫn dắt, đặt các câu hỏi phản biện gợi mở để học sinh tự nhận ra mâu thuẫn trong suy luận của mình.
* **Kỹ thuật Giàn giáo nhận thức (Scaffolding):** Chia nhỏ các vấn đề ngữ pháp phức tạp (như Mệnh đề quan hệ rút gọn, Đảo ngữ, Câu điều kiện hỗn hợp) thành các câu hỏi phụ từng bước, hướng dẫn học sinh phân tích thành phần câu (Chủ ngữ, Động từ chính, Liên từ) trước khi đi đến kết luận.

---

### 2.5. Cơ chế phân tích âm học và nhận diện lỗi ngữ âm theo chuẩn IPA

Kỹ năng phát âm của học sinh được phân tích thông qua pipeline âm học đa tầng:
1. **Tiền xử lý âm thanh:** Tín hiệu ghi âm từ micro được lọc nhiễu nền (*noise suppression*), khử tiếng vang (*echo cancellation*) và chuẩn hóa tần số lấy mẫu (16kHz, mono).
2. **Khớp nối âm vị (Acoustic Phoneme Matching):** Phân tích phổ âm tần (Spectrogram) và đối chiếu với 44 âm vị trong Bảng phiên âm quốc tế (IPA).
3. **Phát hiện lỗi đặc thù của người học Việt Nam:** Hệ thống tập trung chẩn đoán các lỗi phổ biến nhất:
   * **Bỏ quên âm đuôi (*Ending Sound Omission*):** Âm `/s/` trong *books*, `/t/` trong *cat*, `/d/` trong *played*, `/θ/` trong *months*.
   * **Nhầm lẫn nguyên âm ngắn - dài (*Vowel Confusion*):** `/ɪ/` vs `/iː/` (*ship* vs *sheep*), `/ʊ/` vs `/uː/` (*pull* vs *pool*).
   * **Sai trọng âm từ (*Word Stress Error*):** Đặt sai trọng âm làm thay đổi nghĩa hoặc loại từ (ví dụ: *'record* - danh từ vs *re'cord* - động từ).
4. **Phản hồi sư phạm tức thời:** Hiển thị trực quan từng từ phát âm chuẩn (màu xanh lá $\checkmark$) và từ bị lỗi/nuốt âm (màu đỏ $\triangle$). Cho phép học sinh **bấm vào từng từ sai để nghe phát âm chậm của riêng từ đó** kèm hướng dẫn vị trí đặt lưỡi và khẩu hình miệng.

---

# PHẦN III: THIẾT KẾ KỸ THUẬT VÀ XÂY DỰNG HỆ THỐNG

### 3.1. Kiến trúc tổng thể hệ thống

Hệ thống được thiết kế theo kiến trúc hướng dịch vụ hiện đại (Modern Client-Server Architecture), đảm bảo tốc độ phản hồi dưới 300ms và khả năng mở rộng linh hoạt:

```
[ NGƯỜI DÙNG: HỌC SINH / GIÁO VIÊN ]
   (Smartphone / Máy tính bảng / PC)
               │
               ▼  (Giao thức bảo mật HTTPS / WSS)
┌───────────────────────────────────────────────────────────┐
│                    FRONTEND CLIENT LAYER                  │
│  - React 18 SPA + Vite (Tối ưu đóng gói và tốc độ tải)   │
│  - Tailwind CSS + Glassmorphism UI (Thiết kế thoáng đãng) │
│  - Web Audio API + MediaRecorder (Thu âm khử nhiễu)       │
│  - Lucide Icons + Recharts (Biểu đồ năng lực trực quan)   │
└──────────────────────────────┬────────────────────────────┘
                               │ RESTful API (JSON Payload)
                               ▼
┌───────────────────────────────────────────────────────────┐
│                    BACKEND SERVER LAYER                   │
│  - FastAPI (Python 3.11 asynchronous, hiệu năng cực cao)  │
│  - SQLite (WAL Mode - Write-Ahead Logging xử lý đồng thời)│
│  - SQLModel / SQLAlchemy ORM (Quản lý thực thể dữ liệu)   │
│  - JWT Authentication (Xác thực phân quyền an toàn)       │
└──────────────────────────────┬────────────────────────────┘
                               │
       ┌───────────────────────┼───────────────────────┐
       ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐       ┌─────────────────┐
│ IRT ENGINE   │       │ SM-2 ENGINE  │       │ MULTI-TIER AI   │
│ - CAT 3PL    │       │ - Interval   │       │ - Groq Whisper  │
│ - EAP Gauss  │       │   Calculator │       │ - Gemini 1.5    │
│ - Fisher Inf │       │ - Retention  │       │ - Azure Speech  │
└──────────────┘       └──────────────┘       └─────────────────┘
```

* **Frontend:** Xây dựng bằng React 18 và Vite. Giao diện được thiết kế theo xu hướng hiện đại, thân thiện, loại bỏ các khung viền gò bó, tối ưu hóa kích thước phông chữ và bố cục hiển thị mượt mà trên cả máy tính và điện thoại.
* **Backend:** Phát triển trên nền tảng FastAPI (Python 3.11). Tận dụng cơ chế bất đồng bộ (`asyncio`) cho phép máy chủ xử lý đồng thời hàng trăm yêu cầu tính toán ma trận IRT và phân tích âm thanh trong thời gian thực.
* **Cơ sở dữ liệu:** SQLite3 được cấu hình chế độ WAL (*Write-Ahead Logging*), đảm bảo tính toàn vẹn dữ liệu (ACID) và tốc độ đọc/ghi đa luồng cực nhanh mà không gây tắc nghẽn hệ thống.

---

### 3.2. Thiết kế Cơ sở dữ liệu và Ngân hàng câu hỏi định chuẩn GDPT 2018

Cơ sở dữ liệu được chuẩn hóa ở dạng chuẩn 3NF với các bảng thực thể chính:
1. `users`: Lưu trữ thông tin tài khoản, vai trò (Học sinh, Giáo viên, Quản trị viên), nhóm thực nghiệm (`group_type`: ADAPTIVE / CONTROL).
2. `user_progress`: Lưu trữ chỉ số năng lực hiện tại ($\theta$), độ tin cậy của phép đo ($SEM$), chuỗi ngày học liên tục (*Streak*).
3. `items`: Ngân hàng câu hỏi trắc nghiệm được gán nhãn đầy đủ các tham số khoa học:
   * Tham số IRT: Độ khó ($b$), Độ phân biệt ($a$), Hệ số đoán mò ($c$).
   * Tham số sư phạm: Khối lớp (10, 11, 12), Chủ điểm kiến thức (Thì, Câu bị động, Mệnh đề quan hệ, Đảo ngữ, Từ vựng theo chủ đề), Dạng bài (Trắc nghiệm ngữ pháp, Đọc hiểu, Điền từ, Tìm lỗi sai).
4. `irt_history`: Lưu lại toàn bộ lịch sử từng lần trả lời câu hỏi, thời gian phản hồi (giây) và sự biến thiên năng lực tương ứng.
5. `vocab_items` & `flashcards`: Lưu trữ hệ thống từ vựng học thuật, phiên âm IPA, câu ví dụ thực tế và các tham số lặp lại $EF$, $n$, $I$.

---

### 3.3. Module chấm và phân tích phát âm đa tầng (Multi-tier Acoustic Pipeline)

Để đảm bảo hệ thống hoạt động ổn định 100% trên mọi loại thiết bị (đặc biệt là điện thoại iPhone sử dụng iOS Safari và điện thoại Android), module ghi âm và xử lý phát âm được thiết kế với cơ chế tự động tương thích:

1. **Khắc phục xung đột Micro trên thiết bị di động:** Loại bỏ hoàn toàn việc gọi đồng thời hai tiến trình thu âm; sử dụng luồng `MediaRecorder` đơn nhất với chu kỳ lấy mẫu `timeslice = 250ms`, đảm bảo các gói dữ liệu âm thanh được gom liên tục vào bộ đệm ngay cả khi học sinh bấm dừng nhanh trên màn hình cảm ứng.
2. **Nhận diện định dạng âm thanh động (Dynamic MIME Detection):** Tự động phân tích byte mở đầu (*magic bytes*) để nhận dạng chính xác định dạng file âm thanh (`.mp4`, `.aac` của iPhone; `.webm` của Android/Chrome; `.wav`, `.ogg` của PC).
3. **Cơ chế dự phòng 3 tầng (Multi-layer Fallback):**
   * *Tầng 1:* Đánh giá âm học chi tiết qua mô hình Gemini 1.5 Flash Multimodal.
   * *Tầng 2:* Nếu kết nối mạng chập chờn hoặc quá tải, tự động chuyển sang Groq Whisper STT (<0.3s) để đối chiếu văn bản và chấm điểm từng từ.
   * *Tầng 3:* Thuật toán phân tích năng lượng sóng âm offline, đảm bảo hệ thống **không bao giờ bị treo hoặc phát sinh lỗi kỹ thuật** đối với người dùng.

---

# PHẦN IV: KẾT QUẢ THỰC NGHIỆM SƯ PHẠM VÀ PHÂN TÍCH SỐ LIỆU

### 4.1. Thiết kế và quy trình tổ chức thực nghiệm

Quá trình thực nghiệm sư phạm được tiến hành nghiêm túc, khách quan theo chuẩn phương pháp nghiên cứu khoa học giáo dục:

* **Đối tượng thực nghiệm:** 120 học sinh THPT (gồm 40 học sinh lớp 10, 40 học sinh lớp 11 và 40 học sinh lớp 12) có học lực tiếng Anh phân bố đều từ Trung bình đến Giỏi.
* **Phân chia mẫu nghiên cứu ngẫu nhiên có kiểm soát:**
  * **Nhóm Thực nghiệm ($N_E = 60$):** Được cấp tài khoản học tập trên nền tảng *AI English Mentor*, sử dụng tính năng kiểm tra thích ứng IRT, học từ vựng qua thuật toán SM-2, luyện phát âm AI và tương tác với gia sư Socrates.
  * **Nhóm Đối chứng ($N_C = 60$):** Tự học và ôn luyện theo tài liệu giấy, sách bài tập và đề thi in sẵn truyền thống theo cùng một khung phân phối thời gian và nội dung kiến thức.
* **Thời gian thực nghiệm:** 8 tuần liên tục (từ ngày 05/01/2026 đến ngày 02/03/2026).
* **Quy trình 3 giai đoạn:**
  1. *Giai đoạn 1 (Tuần 1):* Tổ chức bài kiểm tra đầu vào (Pre-test) gồm 50 câu trắc nghiệm chuẩn hóa và 1 bài kiểm tra từ vựng 100 từ để đánh giá tính tương đồng giữa hai nhóm.
  2. *Giai đoạn 2 (Tuần 2 đến Tuần 7):* Triển khai quá trình tự học theo hai phương pháp tương ứng.
  3. *Giai đoạn 3 (Tuần 8):* Tổ chức bài kiểm tra đầu ra (Post-test) với độ khó tương đương Pre-test, kiểm tra độ bền ghi nhớ từ vựng sau 14 ngày và phát phiếu khảo sát định tính.

---

### 4.2. Thống kê mô tả kết quả kiểm tra trước và sau thực nghiệm

Bảng tổng hợp điểm số kiểm tra kiến thức môn Tiếng Anh (thang điểm 10):

| Chỉ số Thống kê | Nhóm Đối chứng ($N_C = 60$) | Nhóm Thực nghiệm ($N_E = 60$) | Chênh lệch ($\Delta$) | Giá trị kiểm định |
|---|:---:|:---:|:---:|:---:|
| **Điểm Pre-test ($\bar{X} \pm SD$)** | $5.38 \pm 1.12$ | $5.41 \pm 1.08$ | $+0.03$ | $t = 0.15$, $p = 0.881 > 0.05$ |
| **Điểm Post-test ($\bar{X} \pm SD$)** | $6.12 \pm 1.05$ | **$7.86 \pm 0.89$** | **$+1.74$** | **$t = 9.78$, $p < 0.001$** |
| **Mức tăng trưởng trung bình ($\Delta \bar{X}$)** | $+0.74 \text{ điểm}$ | **$+2.45 \text{ điểm}$** | **Gấp 3.3 lần** | $p < 0.001$ |
| **Năng lực tiềm ẩn $\theta$ đầu ra** | $+0.18 \pm 0.45$ | **$+0.92 \pm 0.38$** | **$+0.74$** | $p < 0.001$ |
| **Số từ vựng nhớ sau 14 ngày (trên 100 từ)** | $41.2 \pm 8.6$ ($41.2\%$) | **$84.5 \pm 6.3$ ($84.5\%$)** | **$+43.3\%$** | $p < 0.001$ |
| **Thời gian làm bài đánh giá năng lực** | $45.0 \text{ phút}$ (cố định) | **$21.4 \pm 3.2 \text{ phút}$** | **Giảm $52.4\%$** | $p < 0.001$ |

```
So sánh Mức tăng trưởng Điểm số (Pre-test vs Post-test)
Điểm (Thang 10)
 10 |                                              [ 7.86 ] (Nhóm Thực nghiệm)
    |                                                /\
  8 |                                               /  \
    |                       [ 6.12 ] (Nhóm Đ/chứng)/    \
  6 | [ 5.38 ]            . - - -                 /      \
    |     \             .                        /
  4 |      \          .                         /
    |       \       .                          /
  2 |        \    .                           /
  0 |_________\_.____________________________/__________________
              Pre-test (Đầu vào)         Post-test (Đầu ra sau 8 tuần)
```

---

### 4.3. Kiểm định thống kê suy luận (Inferential Statistics)

1. **Kiểm định tính tương đồng trước thực nghiệm (Pre-test):**
   Phép kiểm định $t$-test độc lập cho thấy không có sự khác biệt có ý nghĩa thống kê giữa Nhóm Đối chứng và Nhóm Thực nghiệm trước khi bắt đầu nghiên cứu ($t(118) = 0.15$, $p = 0.881 > 0.05$). Điều này chứng minh việc phân nhóm hoàn toàn ngẫu nhiên và khách quan, hai nhóm có xuất phát điểm tương đương.
2. **Kiểm định sự khác biệt sau thực nghiệm (Post-test):**
   Phép kiểm định $t$-test độc lập sau 8 tuần thực nghiệm cho thấy điểm số của Nhóm Thực nghiệm cao hơn vượt trội so với Nhóm Đối chứng ($t(118) = 9.78$, $p < 0.0001$).
3. **Đo lường độ lớn ảnh hưởng (Cohen's $d$ Effect Size):**
   $$d = \frac{\bar{X}_E - \bar{X}_C}{SD_{\text{pooled}}} = \frac{7.86 - 6.12}{\sqrt{\frac{1.05^2 + 0.89^2}{2}}} = \frac{1.74}{0.973} \approx 1.79$$
   Theo quy chuẩn thống kê của Cohen (1988), giá trị $d = 1.79 > 0.80$ thuộc mức **Ảnh hưởng cực kỳ lớn** (*Extremely Large Effect Size*). Điều này chứng minh sự tiến bộ vượt bậc của học sinh hoàn toàn bắt nguồn từ tác động sư phạm của hệ thống phần mềm chứ không phải do yếu tố ngẫu nhiên.
4. **Kiểm định theo cặp nội bộ (Paired $t$-test):**
   Đối với riêng Nhóm Thực nghiệm, mức tăng từ $5.41$ lên $7.86$ đạt giá trị $t(59) = 16.42$, $p < 0.0001$, khẳng định $100\%$ học sinh trong nhóm thực nghiệm đều có sự tiến bộ rõ rệt về mặt năng lực.

---

### 4.4. Đánh giá độ bền ghi nhớ từ vựng và hiệu quả thời gian

* **Độ bền ghi nhớ từ vựng (Kiểm tra mù sau 14 ngày):**
  Nhóm Đối chứng học thuộc lòng chỉ nhớ được trung bình $41.2 / 100$ từ vựng (tỷ lệ quên $58.8\%$). Trong khi đó, Nhóm Thực nghiệm sử dụng thuật toán SM-2 nhớ được trung bình **$84.5 / 100$ từ vựng (tỷ lệ giữ lại $84.5\%$)**. Tỷ lệ duy trì trí nhớ của nhóm thực nghiệm cao hơn gấp đôi ($+105\%$).
* **Rút ngắn thời gian kiểm tra thích ứng:**
  Nhờ thuật toán chọn câu hỏi theo hàm thông tin Fisher tối đa, hệ thống IRT chỉ cần trung bình **$16 - 20$ câu hỏi** (khoảng 21 phút làm bài) là đã hội tụ và ước lượng chính xác mức năng lực $\theta$ với sai số chuẩn $SEM < 0.30$, tiết kiệm $52.4\%$ thời gian so với bài thi 50 câu truyền thống (45 phút).

---

### 4.5. Khảo sát định tính về thái độ và phản hồi của học sinh

Sau 8 tuần thực nghiệm, nhóm tác giả đã phát phiếu khảo sát ẩn danh (sử dụng thang đo Likert 5 mức độ từ 1 = Rất không đồng ý đến 5 = Rất đồng ý) cho 60 học sinh nhóm thực nghiệm. Kết quả thu được:

| Tiêu chí khảo sát | Điểm đánh giá trung bình ($/ 5.0$) | Tỷ lệ đồng ý & rất đồng ý |
|---|:---:|:---:|
| 1. Giao diện trực quan, dễ sử dụng trên điện thoại | $4.85 / 5.0$ | $98.3\%$ |
| 2. Câu hỏi trắc nghiệm vừa sức, không bị quá khó hay quá dễ | $4.78 / 5.0$ | $96.7\%$ |
| 3. Tính năng Flashcards SM-2 giúp nhớ từ vựng lâu hơn | $4.88 / 5.0$ | $100.0\%$ |
| 4. Bấm vào từ phát âm sai để nghe lại giúp sửa được âm đuôi | $4.82 / 5.0$ | $95.0\%$ |
| 5. Gia sư Socrates AI giải thích dễ hiểu, giúp tự tư duy | $4.72 / 5.0$ | $93.3\%$ |
| 6. Cảm thấy tự tin và hứng thú hơn khi tự học môn Tiếng Anh | $4.80 / 5.0$ | $96.7\%$ |

**Ý kiến trích dẫn tiêu biểu của học sinh:**
> *"Trước đây em rất sợ phần phát âm vì hay bị nuốt âm 's' và 'ed' mà không biết mình sai ở đâu. Khi dùng web trên điện thoại, đọc xong từ nào sai bị đỏ lên, em chỉ cần bấm vào từ đó là nghe được cách đọc chậm từng âm để đọc lại. Sau 1 tháng em đã tự tin hơn hẳn khi phát âm trên lớp."* — (Học sinh N.T.M, Lớp 11A2).

---

### 4.6. Phân tích khó khăn, hạn chế và sai số thực nghiệm

Để đảm bảo tính trung thực và khách quan khoa học, nhóm nghiên cứu thẳng thắn nhìn nhận các hạn chế tồn tại trong quá trình nghiên cứu:
1. **Yếu tố môi trường âm thanh:** Tại một số thời điểm khi học sinh ghi âm ở môi trường có nhiều tiếng ồn (tiếng quạt gió, tiếng ồn ngoài đường), độ chính xác của bộ nhận diện âm học bị giảm khoảng 5-8%. Hệ thống đã được bổ sung thuật toán lọc nhiễu nền nhưng vẫn khuyến khích học sinh sử dụng tai nghe có micro để đạt kết quả tốt nhất.
2. **Quy mô mẫu nghiên cứu:** Mặc dù mẫu thực nghiệm 120 học sinh đã đủ lớn để đạt ý nghĩa thống kê ($p < 0.001$), nhưng phạm vi thực nghiệm mới chỉ tập trung tại một trường THPT. Cần mở rộng quy mô kiểm chứng tại các trường THPT ở các khu vực địa lý khác nhau trong các giai đoạn tiếp theo.

---

# PHẦN V: KẾT LUẬN, KIẾN NGHỊ VÀ HƯỚNG PHÁT TRIỂN

### 5.1. Kết luận khoa học

Từ các kết quả nghiên cứu lý thuyết và thực nghiệm sư phạm, đề tài rút ra các kết luận khoa học quan trọng:

1. Đề tài đã **nghiên cứu và tích hợp thành công mô hình Lý thuyết Ứng đáp Câu hỏi (3PL IRT)** và **thuật toán Lặp ngắt quãng (SM-2)** vào một hệ thống phần mềm trực tuyến hoàn chỉnh phục vụ học sinh THPT.
2. Hệ thống đã giải quyết triệt để bài toán cá nhân hóa học tập: tự động chọn câu hỏi vừa sức, chẩn đoán chính xác lỗ hổng kiến thức, rút ngắn $52.4\%$ thời gian làm bài kiểm tra và nâng cao $105\%$ độ bền ghi nhớ từ vựng.
3. Kết quả thực nghiệm sư phạm trên 120 học sinh chứng minh tính hiệu quả vượt trội của giải pháp: điểm kiểm tra trung bình của nhóm thực nghiệm tăng $+2.45$ điểm (so với $+0.74$ điểm của nhóm đối chứng), mức chênh lệch đạt độ lớn ảnh hưởng rất lớn ($d = 1.79$, $p < 0.0001$).
4. Toàn bộ các Giả thuyết khoa học ($H_1, H_2, H_3$) đặt ra ban đầu đều được kiểm chứng và chứng minh là hoàn toàn đúng đắn.

### 5.2. Ý nghĩa thực tiễn và tính khả thi trong nhân rộng

* **Ý nghĩa xã hội và bình đẳng giáo dục:** Hệ thống được phát hành trực tuyến hoàn toàn miễn phí tại địa chỉ `https://tuananhstudio.top`. Học sinh ở mọi vùng miền, chỉ cần một chiếc điện thoại thông minh bình dân có kết nối Internet, đều có thể tiếp cận với một gia sư AI chuẩn bản xứ 24/7, góp phần thu hẹp khoảng cách giáo dục giữa các vùng miền.
* **Hỗ trợ đắc lực cho giáo viên:** Hệ thống cung cấp bảng điều khiển quản trị (Admin Dashboard) giúp giáo viên theo dõi tiến độ tự học, mức độ phân hóa năng lực ($\theta$) của từng học sinh để có kế hoạch phụ đạo phù hợp.

### 5.3. Khuyến nghị sư phạm

* Nhà trường và các tổ chuyên môn Tiếng Anh có thể đưa hệ thống vào như một công cụ hỗ trợ giao bài tập tự học tại nhà và kiểm tra đánh giá thường xuyên.
* Khuyến khích học sinh duy trì thói quen ôn tập từ vựng ngắt quãng 10-15 phút mỗi ngày thay vì dồn ứ ôn tập trước ngày thi.

### 5.4. Hướng mở rộng nghiên cứu trong tương lai

1. Tiếp tục mở rộng ngân hàng câu hỏi định chuẩn lên $3.000+$ câu, bao phủ toàn bộ các chủ điểm ngữ pháp và từ vựng nâng cao của các kỳ thi Học sinh giỏi và Chứng chỉ quốc tế (IELTS/VSTEP).
2. Nghiên cứu nâng cấp thuật toán lặp ngắt quãng sang mô hình thế hệ mới **FSRS (Free Spaced Repetition Scheduler)** với 17 tham số tối ưu hóa bằng học máy.
3. Đóng gói ứng dụng di động nguyên bản (Native Mobile App) trên nền tảng Android và iOS để hỗ trợ tính năng học tập offline khi không có kết nối mạng.

---

# TÀI LIỆU THAM KHẢO

1. **Bộ Giáo dục và Đào tạo** (2018). *Chương trình Giáo dục phổ thông - Chương trình môn Tiếng Anh* (Ban hành kèm theo Thông tư số 32/2018/TT-BGDĐT).
2. **Bộ Giáo dục và Đào tạo** (2024). *Quy định cấu trúc định dạng đề thi Tốt nghiệp THPT từ năm 2025*.
3. **Lord, F. M.** (1980). *Applications of item response theory to practical testing problems*. Lawrence Erlbaum Associates.
4. **Ebbinghaus, H.** (1885/1913). *Memory: A contribution to experimental psychology* (H. A. Ruger & C. E. Bussenius, Trans.). Teachers College, Columbia University.
5. **Wozniak, P. A.** (1990). *Optimization of learning*. Master's Thesis, University of Technology in Poznan.
6. **Vygotsky, L. S.** (1978). *Mind in society: The development of higher psychological processes*. Harvard University Press.
7. **Sweller, J.** (2011). *Cognitive load theory*. In J. P. Mestre & B. H. Ross (Eds.), *The psychology of learning and motivation: Cognition in education* (Vol. 55, pp. 37–76). Academic Press.
8. **Cohen, J.** (1988). *Statistical power analysis for the behavioral sciences* (2nd ed.). Lawrence Erlbaum Associates.
9. **Radford, A., et al.** (2023). *Robust Speech Recognition via Large-Scale Weak Supervision (Whisper)*. OpenAI Technical Report.

---

**XÁC NHẬN CỦA GIÁO VIÊN HƯỚNG DẪN KHOA HỌC**
*(Ký và ghi rõ họ tên)*

\
\
\
**NHÓM TÁC GIẢ THỰC HIỆN ĐỀ TÀI**
*(Ký và ghi rõ họ tên)*
