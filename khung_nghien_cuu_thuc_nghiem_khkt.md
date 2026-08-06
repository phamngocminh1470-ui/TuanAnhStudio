# TÀI LIỆU KHUNG NGHIÊN CỨU THỰC NGHIỆM SƯ PHẠM KHKT
**DỰ ÁN: Nền tảng Ôn Thi Tốt Nghiệp THPT Môn Tiếng Anh Thích Ứng AI (AI English Mentor 2.0)**

---

> [!IMPORTANT]
> Tài liệu này được thiết kế để học sinh sử dụng làm hồ sơ thực nghiệm sư phạm chính thức, kẹp vào **Phụ lục báo cáo nghiên cứu** và chuẩn bị số liệu để chạy các phép kiểm định thống kê trên Excel/SPSS.

---

## 1. KẾ HOẠCH THỰC NGHIỆM SƯ PHẠM (EXPERIMENTAL PLAN)

### 1.1. Thiết kế nghiên cứu (Research Design)
Nghiên cứu sử dụng phương pháp **Thực nghiệm Sư phạm đối chiếu (Quasi-experimental Design)** với nhóm đối chứng và nhóm thực nghiệm độc lập.

*   **Nhóm Thực nghiệm (Group A - Experimental):** Học tập và ôn luyện ngữ pháp, nghe, nói thông qua hệ thống thích ứng AI (*AI English Mentor 2.0*) 20 phút mỗi ngày, 5 ngày/tuần.
*   **Nhóm Đối chứng (Group B - Control):** Ôn tập theo phương pháp truyền thống (luyện đề trên giấy, giáo viên chữa bài trên lớp, tự học không có AI cá nhân hóa hỗ trợ) với cùng thời lượng.

### 1.2. Tiến trình thực nghiệm (8 tuần)

*   **Tuần 1 (Khởi động & Đo lường đầu vào):**
    *   Tổ chức khảo sát Pre-test cho cả hai nhóm để xác định tính tương đồng về năng lực ban đầu.
    *   Nhóm Thực nghiệm tạo tài khoản, được hướng dẫn cách sử dụng hệ thống.
*   **Tuần 2 - 7 (Giai đoạn can thiệp):**
    *   Nhóm A học tập trên nền tảng. Hệ thống ghi nhật ký tự động vào tệp `research_experiment_logs.jsonl`.
    *   Nhóm B tự ôn luyện tài liệu giấy theo đề cương.
*   **Tuần 8 (Đo lường đầu ra & Đánh giá):**
    *   Tổ chức thi Post-test cho cả hai nhóm bằng đề độc lập nhưng có cấu trúc và độ khó tương đương Pre-test.
    *   Nhóm Thực nghiệm trả lời phiếu khảo sát sự chấp nhận công nghệ (TAM Scale).

---

## 2. BỘ DỮ LIỆU CẦN THU THẬP (DATA SCHEME FOR SPSS/EXCEL)

Học sinh cần lập bảng Excel ghi nhận thông tin của từng học sinh tham gia thực nghiệm theo cấu trúc sau để nhập liệu vào SPSS:

| Tên cột trong SPSS | Kiểu dữ liệu | Mô tả chỉ số | Ví dụ dữ liệu |
| :--- | :--- | :--- | :--- |
| **StudentID** | String / Nomianl | Mã định danh ẩn danh của học sinh | `HS_001` |
| **Group** | Numeric / Nominal | Nhóm học tập: `1` = Thực nghiệm (A), `2` = Đối chứng (B) | `1` |
| **Pre_Score** | Numeric / Scale | Điểm số Pre-test đầu vào (Thang điểm 10) | `5.5` |
| **Post_Score** | Numeric / Scale | Điểm số Post-test đầu ra (Thang điểm 10) | `8.0` |
| **Delta_Score** | Numeric / Scale | Mức độ tiến bộ: $\text{Post} - \text{Pre}$ | `2.5` |
| **Final_Theta** | Numeric / Scale | Năng lực IRT $\theta$ cuối cùng do hệ thống đo được (chỉ nhóm A) | `1.42` |
| **Accuracy_Rate** | Numeric / Scale | Tỷ lệ làm đúng trung bình trên hệ thống (chỉ nhóm A) | `78.5` |
| **TAM_Score** | Numeric / Scale | Điểm trung bình phiếu khảo sát TAM (Thang điểm 1-5) | `4.2` |

---

## 3. NHẬT KÝ NGHIÊN CỨU MẪU (RESEARCH JOURNAL TEMPLATE)
*(Theo chuẩn Phụ lục 1 - Nhật ký nghiên cứu của Sở GD&ĐT)*

*   **Ngày 01/06/2026:** Họp nhóm, định hình đề tài nghiên cứu: "Ứng dụng IRT và FSRS tối ưu hóa ôn thi tốt nghiệp THPT".
*   **Ngày 15/06/2026:** Thiết lập mã nguồn backend FastAPI, cài đặt lõi toán học ước lượng EAP và định chuẩn tham số Rasch.
*   **Ngày 22/06/2026:** Hoàn thiện giao diện dashboard React, tích hợp bảng chỉ số kép (Accuracy + IRT Level).
*   **Ngày 05/07/2026:** Gặp Giáo viên hướng dẫn, nhận góp ý tập trung chuyên sâu cho kỳ thi tốt nghiệp THPT Quốc gia môn Tiếng Anh và làm rõ hiệu quả chi phí.
*   **Ngày 12/07/2026:** Loại bỏ vòng lặp sinh câu hỏi giả lập, xây dựng ngân hàng đề định chuẩn `irt_item_bank.json` trích xuất từ đề thi chính thức của Bộ GD&ĐT.
*   **Ngày 20/07/2026:** Viết mã chẩn đoán lỗi (`DiagnosticEngine`) và ghi nhật ký tự động. Tiến hành kiểm thử build hệ thống thành công.
*   **Ngày 01/08/2026:** Khởi động giai đoạn thực nghiệm sư phạm tại trường học đối với 80 học sinh khối 12.

---

## 4. MẪU PHIẾU KHẢO SÁT CHẤP NHẬN CÔNG NGHỆ (TAM SCALE SURVEY)
*(Sử dụng thang đo Likert 5 điểm: 1 = Rất không đồng ý, 5 = Rất đồng ý)*

### A. Tính hữu ích cảm nhận được (Perceived Usefulness - PU)
1.  Hệ thống thích ứng giúp tôi nhận rõ lỗ hổng ngữ pháp của mình một cách nhanh chóng. [1] [2] [3] [4] [5]
2.  Việc dự báo điểm số thi THPT giúp tôi có động lực học tập tốt hơn. [1] [2] [3] [4] [5]
3.  Cơ chế ôn tập từ vựng giãn cách giúp tôi nhớ từ mới lâu hơn so với cách học thuộc lòng thông thường. [1] [2] [3] [4] [5]

### B. Tính dễ sử dụng cảm nhận được (Perceived Ease of Use - PEOU)
4.  Giao diện hệ thống rõ ràng, dễ tương tác trên cả điện thoại và máy tính. [1] [2] [3] [4] [5]
5.  Phần giải thích đề xuất câu hỏi giúp tôi hiểu tại sao mình cần học kiến thức đó. [1] [2] [3] [4] [5]

---

## 5. BỘ ĐỀ ĐO LƯỜNG ĐẦU VÀO & ĐẦU RA (PRE-TEST & POST-TEST SAMPLES)
*(Đề gồm 10 câu trắc nghiệm ngữ pháp đại diện cấu trúc thi tốt nghiệp THPT)*

### 5.1. Mẫu đề Pre-test (Đầu vào)
*   **Câu 1 (Thì):** She ________ English at this center since she was a freshman.
    *   A. has studied | B. studies | C. studied | D. is studying
*   **Câu 2 (Bị động):** The homework ________ by the students before the class started.
    *   A. had been done | B. was doing | C. has done | D. did
*   **Câu 3 (Mệnh đề quan hệ):** The laptop ________ I bought last year is still working perfectly.
    *   A. which | B. who | C. whose | D. whom
*   **Câu 4 (Điều kiện):** If you study hard, you ________ the national graduation exam easily.
    *   A. will pass | B. would pass | C. passed | D. pass
*   **Câu 5 (Gián tiếp):** He asked me where I ________ the day before.
    *   A. had gone | B. went | C. go | D. will go

### 5.2. Mẫu đề Post-test (Đầu ra)
*   **Câu 1 (Thì):** They ________ in Hanoi for five years before they moved to Ho Chi Minh city.
    *   A. had lived | B. live | C. have lived | D. were living
*   **Câu 2 (Bị động):** English ________ all over the world as a global language.
    *   A. is spoken | B. speaks | C. was speaking | D. has spoken
*   **Câu 3 (Mệnh đề quan hệ):** The teacher ________ guided us on the KHKT project is very dedicated.
    *   A. who | B. which | C. whose | D. whom
*   **Câu 4 (Điều kiện):** If I ________ more time, I would write a longer research paper.
    *   A. had | B. have | C. will have | D. would have
*   **Câu 5 (Gián tiếp):** She said that she ________ to visit her grandparents the next weekend.
    *   A. was going | B. goes | C. will go | D. has gone

---

## 6. QUY TRÌNH PHÂN TÍCH SỐ LIỆU THỰC NGHIỆM TRÊN SPSS/EXCEL

Học sinh cần làm báo cáo phân tích theo 3 bước sau:

### Bước 1: Kiểm định sự tương đồng đầu vào (Pre-test baseline)
*   Chạy kiểm định **Independent t-test** trên SPSS giữa điểm số `Pre_Score` của Nhóm Thực nghiệm và Nhóm Đối chứng.
*   **Kết quả kỳ vọng:** Chỉ số ý nghĩa thống kê $p > 0.05$ (Không có sự khác biệt có ý nghĩa thống kê về năng lực ban đầu giữa 2 nhóm, chứng minh phép chia nhóm là ngẫu nhiên và công bằng).

### Bước 2: Kiểm định sự tiến bộ nội bộ nhóm Thực nghiệm (Pre vs Post)
*   Chạy kiểm định **Paired t-test** trên điểm số của Nhóm Thực nghiệm (`Pre_Score` vs `Post_Score`).
*   **Kết quả kỳ vọng:** Chỉ số ý nghĩa thống kê $p < 0.05$ (Có sự tiến bộ rõ rệt sau can thiệp can sinh thích ứng AI).

### Bước 3: So sánh hiệu quả giữa 2 nhóm (Post-test comparison)
*   Chạy kiểm định **Independent t-test** giữa điểm số `Post_Score` của Nhóm Thực nghiệm và Nhóm Đối chứng.
*   **Kết quả kỳ vọng:** Điểm trung bình nhóm Thực nghiệm cao hơn và chỉ số ý nghĩa thống kê đạt $p < 0.05$ (Chứng minh phương pháp ôn luyện thích ứng AI hiệu quả hơn phương pháp truyền thống).
