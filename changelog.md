# CHANGELOG - HỆ THỐNG ÔN THI THPT TIẾNG ANH THÍCH ỨNG AI (PHIÊN BẢN 2.0)

---

## [2.0.0] - 2026-08-06

### HỌC THUẬT & TOÁN HỌC (IRT/CAT & SPACED REPETITION)

*   **[SỬA LỖI CHÍ MẠNG] Loại bỏ vòng lặp IRT giả lập (Simulated Loop):**
    *   Hủy bỏ cơ chế cũ: Gemini tự sinh câu hỏi động kèm gán nhãn độ khó ảo.
    *   **Tích hợp Ngân hàng câu hỏi định chuẩn (Item Bank):** Tạo cơ sở dữ liệu tệp `irt_item_bank.json` chứa 20 câu hỏi ngữ pháp lấy trực tiếp từ đề thi chính thức THPT Quốc gia của Bộ GD&ĐT đã được gán nhãn độ khó $b$, độ phân biệt $a$, độ đoán mò $c$ chuẩn xác.
*   **[NÂNG CẤP] Lõi tính toán EAP (Expected A Posteriori):**
    *   Đảm bảo EAP tích phân 21 điểm nút Gaussian hội tụ đúng toán học đo lường.
*   **[THÊM GIẢI THUẬT] Bộ chọn câu hỏi thích ứng khách quan (Adaptive Question Selector):**
    *   Xây dựng thuật toán xếp hạng câu hỏi deterministic kết hợp:
        1. Khoảng cách năng lực $\theta$ của người học và độ khó $b$ (IRT).
        2. Mức độ thiếu hụt độ thành thạo kỹ năng ($1.0 - \text{Mastery}$).
        3. Ràng buộc đồ thị tri thức (Knowledge Graph prerequisite).
    *   Tự động sinh lý do đề xuất rõ ràng, dễ giải thích (`recommendation_reason`).
*   **[THÊM GIẢI THUẬT] Đồ thị tri thức ngữ pháp (Knowledge Graph):**
    *   Xác lập quan hệ phụ thuộc kiến thức (Ví dụ: `Passive Voice` / `Conditionals` / `Reported Speech` phụ thuộc vào `Tenses`).
    *   Tác tử tự động hạ ưu tiên câu hỏi nâng cao nếu kỹ năng nền tảng chưa vững.
*   **[THÊM GIẢI THUẬT] Bộ chẩn đoán lỗi hệ thống (Diagnostic Engine):**
    *   Chạy chẩn đoán lỗi khi học sinh làm sai, tự động gom nhóm lỗi (`TENSE_CONFUSION`, `VOCABULARY_GAP`, `PHONOLOGY_ERROR`) kèm chỉ số độ tin cậy thuật toán (Confidence Score).
*   **[NÂNG CẤP] Thuật toán Spaced Repetition (SM-2 & FSRS):**
    *   Lập trình lớp `FSRSEngine` song song với `SM2Engine` dựa trên mô hình ba thành phần vết trí nhớ ($R$, $S$, $D$) giúp dự đoán tối ưu chu kỳ ôn tập.

---

### GIAO DIỆN NGƯỜI DÙNG (FRONTEND / UX-UI)

*   **[CẢI TIẾN] Bảng chỉ số kép (Double Metrics Panel):**
    *   Tách biệt hiển thị **Tỷ lệ đúng thực tế (%)** và **Ước lượng năng lực IRT (Theta/CEFR)** trong [IRTTestEngine.jsx](file:///C:/Users/TUANANH-STUDIOO/Documents/KHKT/frontend/src/components/IRTTestEngine.jsx) giúp học sinh dễ hiểu kết quả học tập thực chất.
*   **[CỦNG CỐ] Hiển thị gợi ý thích ứng & chẩn đoán lỗi:**
    *   Hiển thị biểu ngữ giải thích lý do đề xuất câu hỏi từ thuật toán thích ứng.
    *   Hiển thị bảng chẩn đoán lỗi trực quan kèm mức độ tin cậy khi học sinh trả lời chưa chính xác.
*   **[THÊM CHỨC NĂNG] Biểu đồ Độ thành thạo kỹ năng (Skill Mastery Grid):**
    *   Hiển thị tiến độ động chi tiết của 9 kỹ năng ngữ pháp, từ vựng và ngữ âm phổ thông dưới dạng thanh tiến trình động thời gian thực.
*   **[ĐỊNH VỊ THƯƠNG HIỆU] Hướng trọng tâm Ôn thi THPT Quốc gia:**
    *   Thay đổi toàn bộ logo phụ, tiêu đề dashboard, mô tả hệ thống tại [App.jsx](file:///c:/Users/TUANANH-STUDIOO/Documents/KHKT/frontend/src/App.jsx) và [AdaptiveDashboard.jsx](file:///C:/Users/TUANANH-STUDIOO/Documents/KHKT/frontend/src/components/AdaptiveDashboard.jsx) tập trung hoàn toàn cho mảng Luyện thi tốt nghiệp THPT Quốc gia.

---

### HẠ TẦNG & DỮ LIỆU NGHIÊN CỨU (INFRASTRUCTURE & LOGGING)

*   **[THÊM CHỨC NĂNG] Ghi nhật ký thực nghiệm (Research Logging):**
    *   Tự động lưu nhật ký học tập chi tiết của học sinh ra tệp `research_experiment_logs.jsonl` tại backend để sẵn sàng xuất dữ liệu phân tích thống kê (t-test trên SPSS) phục vụ hồ sơ nghiên cứu KHKT.
*   **[CẤU HÌNH] Chế độ A/B Testing (Experiment Mode):**
    *   Hỗ trợ truyền các tham số phân nhóm nghiên cứu (`student_id`, `experiment_group`, `repetition_engine`) qua payload API để so sánh hiệu quả giữa mô hình Thích ứng vs Truyền thống, SM-2 vs FSRS.
*   **[TỐI ƯU] Xử lý tương thích ngược:**
    *   Duy trì signature API cũ cho tính năng luyện nói thích ứng của `PronunciationAssessor.jsx`.
