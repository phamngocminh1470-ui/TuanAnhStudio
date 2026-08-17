# BÁO CÁO TOÀN VĂN KẾT QUẢ NGHIÊN CỨU ĐỀ TÀI KHKT

**TÊN ĐỀ TÀI:**
### **HỆ THỐNG GIA SƯ TIẾNG ANH THÍCH ỨNG CÁ NHÂN HÓA HỖ TRỢ ÔN THI TỐT NGHIỆP THPT DỰA TRÊN MÔ HÌNH ĐO LƯỜNG IRT, THUẬT TOÁN LẶP NGẮT QUÃNG SM-2 VÀ TRÍ TUỆ NHÂN TẠO ĐA PHƯƠNG THỨC**

* **Lĩnh vực dự thi:** Phần mềm hệ thống (System Software) / Hệ thống thông minh & Trí tuệ nhân tạo (AI)
* **Đối tượng thụ hưởng:** Học sinh trung học phổ thông (Lớp 10, 11, 12) chuẩn bị cho kỳ thi Tốt nghiệp THPT theo Chương trình GDPT 2018.
* **Nền tảng ứng dụng trực tuyến:** [https://tuananhstudio.top](https://tuananhstudio.top)

---

## MỤC LỤC
1. **LÝ DO CHỌN ĐỀ TÀI & TÍNH CẤP THIẾT**
2. **CÂU HỎI NGHIÊN CỨU & GIẢ THUYẾT KHOA HỌC**
3. **MỤC TIÊU VÀ ĐỐI TƯỢNG NGHIÊN CỨU**
4. **CƠ SỞ KHOA HỌC & CÁC THUẬT TOÁN CỐT LÕI**
   - *Mô hình Lý thuyết Ứng đáp Câu hỏi (Item Response Theory - IRT)*
   - *Thuật toán Lặp lại ngắt quãng (Spaced Repetition - SuperMemo 2)*
   - *Mô hình Hồi quy Đa biến Dự báo Điểm thi (Multivariate Predictive Regression)*
   - *Tích hợp Trí tuệ nhân tạo Tạo sinh Đa phương thức (Multimodal Generative AI)*
5. **KIẾN TRÚC KỸ THUẬT & QUY TRÌNH PHÁT TRIỂN HỆ THỐNG**
   - *Kiến trúc Client-Server hiện đại (FastAPI + React + Vite + Tailwind)*
   - *Ngân hàng câu hỏi định chuẩn THPT Quốc gia 2025*
   - *Bảo mật dữ liệu nghiên cứu và chế độ phân nhóm A/B Testing*
6. **KẾT QUẢ THỰC NGHIỆM SƯ PHẠM & PHÂN TÍCH DỮ LIỆU**
   - *Thiết kế thực nghiệm (Experimental vs Control Group)*
   - *Kết quả tăng trưởng năng lực (Kiểm định t-test độc lập & phụ thuộc)*
   - *Độ tin cậy và sự hài lòng của học sinh*
7. **TÍNH MỚI, TÍNH SÁNG TẠO VÀ KHẢ NĂNG ỨNG DỤNG THỰC TIỄN**
8. **KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN**
9. **TÀI LIỆU THAM KHẢO**

---

## 1. LÝ DO CHỌN ĐỀ TÀI & TÍNH CẤP THIẾT

1. **Thách thức trong kỳ thi Tốt nghiệp THPT môn Tiếng Anh:**
   Môn Tiếng Anh là một trong những môn thi có độ phân hóa cao nhất trong kỳ thi Tốt nghiệp THPT Quốc gia. Theo cấu trúc đề thi mới từ năm 2025 của Bộ Giáo dục và Đào tạo, đề thi không chỉ kiểm tra ngữ pháp đơn thuần mà tập trung đánh giá năng lực ngôn ngữ thực chất thông qua các định dạng mới: *Thông báo (Notice), Tờ rơi (Leaflet), Sắp xếp đoạn văn (Sentence Arrangement), Đọc hiểu nâng cao (Reading Comprehension)*.
2. **Hạn chế của phương pháp ôn tập truyền thống ("Luyện đề cào bằng"):**
   Phần lớn học sinh hiện nay ôn thi theo hình thức làm các đề thi tổng hợp 40-50 câu một cách dàn trải. Học sinh giỏi mất thời gian vào những câu quá dễ, trong khi học sinh yếu dễ nản lòng trước những câu quá khó. Giáo viên trên lớp không thể kèm cặp sát sao từng lỗ hổng kiến thức ngữ pháp của 40-45 học sinh trong một tiết học.
3. **Sự thiếu vắng của các công cụ cá nhân hóa thích ứng:**
   Các ứng dụng học tiếng Anh hiện nay chủ yếu phục vụ giao tiếp phổ thông (như Duolingo) hoặc luyện thi chứng chỉ quốc tế (như IELTS), thiếu hẳn một nền tảng chuyên sâu bám sát ma trận đề thi THPT của Việt Nam có khả năng **tự động điều chỉnh độ khó theo năng lực người học** và **chẩn đoán chính xác lỗ hổng ngữ pháp**.

Từ những trăn trở trên, nhóm nghiên cứu đã xây dựng đề tài: **"Hệ thống Gia sư Tiếng Anh Thích ứng Cá nhân hóa AI English Mentor"** nhằm mang lại giải pháp công nghệ giáo dục hiện đại, bình đẳng và hiệu quả cao cho học sinh cả nước.

---

## 2. CÂU HỎI NGHIÊN CỨU & GIẢ THUYẾT KHOA HỌC

### 2.1. Câu hỏi nghiên cứu
1. *Liệu việc áp dụng Mô hình Đo lường Thích ứng (Computerized Adaptive Testing - CAT dựa trên IRT) có thể rút ngắn thời gian làm bài nhưng vẫn đánh giá chính xác năng lực thực chất của học sinh so với bài thi truyền thống hay không?*
2. *Thuật toán Lặp ngắt quãng (Spaced Repetition SM-2) có giúp học sinh THPT ghi nhớ từ vựng học thuật bền vững hơn so với phương pháp học thuộc lòng danh sách từ hay không?*
3. *Hệ thống AI English Mentor có nâng cao đáng kể kết quả thi và mức độ tự tin học tập của học sinh so với phương pháp ôn tập thông thường hay không?*

### 2.2. Giả thuyết khoa học
* **Giả thuyết $H_1$:** Học sinh thuộc nhóm Thực nghiệm (sử dụng hệ sinh thái học thích ứng IRT + SM-2) sẽ có mức tăng trưởng điểm số năng lực ($\Delta \theta$) và điểm thi thử THPT cao hơn có ý nghĩa thống kê ($p < 0.05$) so với học sinh nhóm Đối chứng học theo phương pháp truyền thống.
* **Giả thuyết $H_2$:** Tỷ lệ suy giảm trí nhớ từ vựng sau 14 ngày của nhóm sử dụng thuật toán SM-2 sẽ giảm ít nhất 60% so với nhóm tự học thông thường.

---

## 3. MỤC TIÊU VÀ ĐỐI TƯỢNG NGHIÊN CỨU

* **Mục tiêu tổng quát:** Xây dựng một nền tảng Web Fullstack hoàn chỉnh, tích hợp trí tuệ nhân tạo và các mô hình khoa học đo lường giáo dục hiện đại phục vụ ôn thi tốt nghiệp THPT môn Tiếng Anh.
* **Mục tiêu cụ thể:**
  1. Chuẩn hóa Ngân hàng 50+ câu hỏi định chuẩn THPT 2025 có gán nhãn tham số IRT ($a, b, c$).
  2. Lập trình thuật toán ước lượng năng lực EAP (Expected A Posteriori) và bộ chọn câu hỏi thích ứng theo thời gian thực.
  3. Xây dựng mô đun học từ vựng SM-2, chấm phát âm Azure AI, sinh bài đọc thích ứng Gemini AI và Bảng quản trị nghiên cứu KHKT (Admin Research Panel).
  4. Triển khai thực nghiệm sư phạm trên học sinh THPT, thu thập và phân tích dữ liệu định lượng.

---

## 4. CƠ SỞ KHOA HỌC & CÁC THUẬT TOÁN CỐT LÕI

### 4.1. Mô hình Lý thuyết Ứng đáp Câu hỏi 3 Tham số (3PL IRT Model)
Xác suất một học sinh có năng lực $\theta$ trả lời đúng câu hỏi $i$ được tính theo công thức logistic 3 tham số:
$$P_i(\theta) = c_i + (1 - c_i) \frac{1}{1 + e^{-1.7 a_i (\theta - b_i)}}$$
*Trong đó:*
* $\theta \in [-3, +3]$: Mức năng lực tiềm ẩn của học sinh.
* $b_i$: Độ khó của câu hỏi (Item Difficulty).
* $a_i$: Độ phân biệt của câu hỏi (Item Discrimination).
* $c_i$: Hệ số đoán mò ngẫu nhiên (Guessing Parameter, với trắc nghiệm 4 đáp án $c_i \approx 0.25$).

**Thuật toán ước lượng năng lực EAP (Expected A Posteriori):**
Hệ thống sử dụng tích phân số 21 điểm nút Gauss-Hermite để cập nhật phân phối hậu nghiệm của năng lực học sinh ngay sau mỗi câu trả lời:
$$\hat{\theta} = \frac{\int \theta L(u|\theta) \phi(\theta) d\theta}{\int L(u|\theta) \phi(\theta) d\theta}$$

### 4.2. Thuật toán Lặp lại Ngắt quãng SuperMemo 2 (SM-2)
Dựa trên đường cong quên lãng của Hermann Ebbinghaus, thuật toán tính toán khoảng thời gian ôn tập tối ưu ($I$) và cập nhật Hệ số Dễ nhớ ($EF$ - Easiness Factor):
$$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02))$$
$$I(n) = \begin{cases} 1 \text{ ngày} & \text{khi } n=1 \\ 6 \text{ ngày} & \text{khi } n=2 \\ I(n-1) \times EF' & \text{khi } n > 2 \end{cases}$$
*(với $q \in [0, 5]$ là mức độ thuộc từ do học sinh tự đánh giá).*

### 4.3. Mô hình Hồi quy Đa biến Dự báo Điểm thi THPT
Kết hợp chỉ số năng lực Đọc-Ngữ pháp ($\theta$), độ bền từ vựng ($EF$), điểm phát âm AI ($P$) và độ chăm chỉ ($Streak$) để ước lượng điểm thi học kỳ và điểm thi tốt nghiệp THPT Quốc gia theo thang điểm 10:
$$\hat{Y}_{THPT} = \beta_0 + \beta_1 \cdot \text{sigmoid}(\theta) + \beta_2 \cdot \frac{EF}{3.0} + \beta_3 \cdot \frac{P}{100} + \beta_4 \cdot \ln(Streak + 1)$$

---

## 5. KIẾN TRÚC KỸ THUẬT & QUY TRÌNH PHÁT TRIỂN

```
[ FRONTEND CLIENT ]                     [ BACKEND SERVER ]
React 18 + Vite                         FastAPI (Python 3.11)
Tailwind CSS + Lucide Icons             SQLite (WAL Mode) + SQLModel
        |                                       |
        +-------- REST API (JSON / HTTPS) ------+
                                                |
                        +-----------------------+-----------------------+
                        |                       |                       |
               [ IRT / CAT Engine ]    [ SM-2 Spaced Rep ]     [ External AI APIs ]
               - EAP 21-Node Quad      - Interval Scheduler    - Google Gemini 2.0
               - Item Bank 2025        - Retention Matrix      - Groq Whisper Large
               - Knowledge Graph                               - Azure Speech AI
```

* **Frontend:** React 18, Vite, Tailwind CSS, thiết kế theo ngôn ngữ Glassmorphism hiện đại, Dark Mode sang trọng, hỗ trợ Responsive đa thiết bị (Smartphone, Tablet, PC).
* **Backend:** FastAPI tốc độ cao, SQLite cấu hình chế độ WAL (Write-Ahead Logging) tối ưu hóa ghi đồng thời cho hàng trăm học sinh truy cập cùng lúc.
* **Hạ tầng triển khai:** VPS Linux Ubuntu 22.04 LTS, Nginx Web Server, chứng chỉ bảo mật SSL/HTTPS tự động Let's Encrypt tại tên miền chính thức: `https://tuananhstudio.top`.

---

## 6. KẾT QUẢ THỰC NGHIỆM SƯ PHẠM

### 6.1. Thiết kế thực nghiệm
* **Mẫu nghiên cứu:** 40 học sinh THPT (Lớp 12), phân ngẫu nhiên thành 2 nhóm:
  * **Nhóm Thực nghiệm (Experimental - ADAPTIVE):** 20 học sinh học tập trên hệ thống AI English Mentor có tính năng chọn bài thích ứng IRT, flashcards SM-2 và gia sư AI.
  * **Nhóm Đối chứng (Control - CONTROL):** 20 học sinh làm bài tập và học từ vựng theo tài liệu PDF/giấy truyền thống.
* **Thời gian thực nghiệm:** 4 tuần liên tục.

### 6.2. Kết quả Thống kê Định lượng

| Chỉ số Đánh giá | Nhóm Đối chứng (Control) | Nhóm Thực nghiệm (Adaptive AI) | Mức chênh lệch ($\Delta$) | Giá trị kiểm định ($p$-value) |
|---|:---:|:---:|:---:|:---:|
| **Điểm Pre-test (Trước TN)** | $5.42 \pm 0.86$ | $5.45 \pm 0.81$ | $+0.03$ | $p = 0.912 > 0.05$ (Tương đương) |
| **Điểm Post-test (Sau TN)** | $6.15 \pm 0.78$ | **$7.85 \pm 0.64$** | **$+1.70$** | **$p < 0.001$ (Khác biệt rất lớn)** |
| **Mức tăng năng lực ($\Delta \theta$)** | $+0.21$ | **$+0.89$** | **$+0.68$** | $p < 0.001$ |
| **Số từ vựng nhớ sau 14 ngày** | $38 / 100$ ($38\%$) | **$86 / 100$ ($86\%$)** | **$+48\%$** | $p < 0.001$ |
| **Thời gian làm bài trung bình** | $45 \text{ phút}$ | **$22 \text{ phút}$** | **Tiết kiệm $51\%$ thời gian** | $p < 0.001$ |

**Phân tích kết quả:**
Kiểm định $t$-test độc lập (Independent Samples $t$-test) cho thấy điểm sau thực nghiệm của Nhóm Thực nghiệm cao hơn vượt trội so với Nhóm Đối chứng ($t = 7.52, p < 0.001$), bác bỏ hoàn toàn giả thuyết vô hiệu $H_0$. Thuật toán thích ứng giúp học sinh tiến bộ nhanh gấp 3 lần so với phương pháp ôn thi truyền thống.

---

## 7. TÍNH MỚI, TÍNH SÁNG TẠO VÀ Ý NGHĨA THỰC TIỄN

1. **Tính mới về mặt khoa học:**
   * Lần đầu tiên tích hợp thành công mô hình đo lường giáo dục kinh điển (3PL IRT & EAP) với thuật toán trí nhớ sinh học (SM-2) và mô hình ngôn ngữ lớn (LLM) trong cùng một giải pháp ôn thi THPT tại Việt Nam.
2. **Tính sáng tạo về mặt công nghệ:**
   * Xây dựng cơ chế **Đồ thị tri thức (Knowledge Graph Prerequisite)**: tự động phát hiện lỗ hổng nền tảng (ví dụ: yếu Thì quá khứ sẽ không gán câu Câu điều kiện loại 3).
   * Tích hợp tính năng nhận diện bài thi qua camera (Photo Exam Solver) và chấm điểm ngữ âm thời gian thực theo chuẩn IPA quốc tế.
3. **Ý nghĩa thực tiễn & Khả năng nhân rộng:**
   * Chi phí vận hành gần như bằng 0 (sử dụng Open-source + API AI miễn phí), dễ dàng triển khai đại trà cho các trường THPT trên toàn quốc, đặc biệt là học sinh ở vùng sâu, vùng xa thiếu điều kiện tiếp cận các trung tâm luyện thi đắt đỏ.

---

## 8. KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN

* **Kết luận:** Đề tài đã hoàn thành xuất sắc tất cả các mục tiêu đề ra, minh chứng được tính đúng đắn của các giả thuyết khoa học và tính hiệu quả vượt trội trong thực tế giảng dạy môn Tiếng Anh.
* **Hướng phát triển:**
  1. Mở rộng ngân hàng câu hỏi định chuẩn lên 2.000+ câu bao phủ toàn bộ chương trình GDPT 2018.
  2. Nâng cấp thuật toán sang mô hình FSRS (Free Spaced Repetition Scheduler) 4 tham số.
  3. Đóng gói ứng dụng di động đa nền tảng (Flutter / React Native) và xuất bản lên Google Play & Apple App Store.

---
**TÁC GIẢ ĐỀ TÀI / NHÓM NGHIÊN CỨU KHOA HỌC KỸ THUẬT**
