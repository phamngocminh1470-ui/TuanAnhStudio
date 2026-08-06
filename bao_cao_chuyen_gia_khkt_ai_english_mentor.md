# BÁO CÁO PHẢN BIỆN CHUYÊN GIA & KHUNG PHÁT TRIỂN ĐỀ TÀI KHKT CẤP QUỐC GIA
**DỰ ÁN: Nền tảng Ôn Thi Tốt Nghiệp THPT Môn Tiếng Anh Thích Ứng AI (AI English Mentor 2.0)**
*Được biên soạn dưới góc nhìn của Hội đồng Thẩm định Khoa học Kỹ thuật (ISEF-aligned), Chuyên gia AI trong Giáo dục (AIED) và Product Architect.*

---

## PHẦN 1: PHÂN TÍCH TOÀN DIỆN HỆ THỐNG HIỆN TẠI (CRITICAL AUDIT)

### 1. Các chức năng đang có & Luồng hoạt động
*   **Module Đánh giá năng lực (IRT Test Engine):** Sinh câu hỏi trắc nghiệm tiếng Anh thích ứng dựa trên ước lượng năng lực $\theta$ của người học thông qua phương pháp EAP (Expected A Posteriori).
*   **Luyện Đọc thích ứng (Adaptive Reading):** Nhập chủ đề sở thích $\to$ Gọi Gemini sinh bài đọc theo độ dài phù hợp khối lớp, highlight từ vựng kèm câu hỏi dạng đề thi THPT Quốc gia.
*   **Luyện Nghe thích ứng (Adaptive Listening):** Sinh transcript qua Gemini $\to$ Phát giọng đọc bằng Azure TTS hoặc gTTS $\to$ Trả lời câu hỏi đọc hiểu âm thanh.
*   **Học từ vựng thông minh (SM-2):** Lưu trạng thái Easiness Factor (EF) và chu kỳ lặp lại ngắt quãng để tự động lên lịch ôn tập.
*   **Cờ Vua Tiếng Anh AI (English Chess):** Đi quân cờ dựa trên việc giải đúng câu hỏi thích ứng; bot cờ vua đối thủ sử dụng giải thuật Greedy Capture ăn quân trực tiếp.
*   **Chẩn đoán & Dự báo (Analytics & Score Prediction):** Ước lượng điểm thi học kỳ và điểm thi Tốt nghiệp THPT dựa trên các chỉ số $\theta$, EF và độ bền học tập.

### 2. Điểm mạnh công nghệ (Strengths)
*   **Thuật toán thực chất:** Hệ thống không chỉ là giao diện tĩnh mà đã tích hợp **thuật toán toán học thực sự** (Giải thuật EAP tích phân 21 điểm nút để ước lượng năng lực IRT và Thuật toán lặp ngắt quãng SM-2 thực chất).
*   **Tích hợp đa phương thức (Multimodal Integration):** Kết hợp cả Web Audio API thu âm trực tiếp trên trình duyệt, Azure Speech REST API để chấm phát âm chi tiết và Groq Whisper để chuyển đổi giọng nói siêu tốc.
*   **Hạ tầng tối ưu:** Chạy ổn định trên VPS Ubuntu 22.04 LTS, cấu hình Nginx Reverse Proxy an toàn qua chứng chỉ SSL Certbot.

### 3. Điểm yếu cốt lõi & Những phần "bình thường" cần phản biện nghiêm khắc (Weaknesses)
*   **Bẫy gọi API động (Dynamic Calibration Issue):** Hệ thống sinh câu hỏi thích ứng trực tiếp từ Gemini bằng prompt. Về mặt khoa học IRT, điều này **không hợp lệ**. Một hệ thống IRT thực tế bắt buộc các câu hỏi phải được **định chuẩn tham số trước (Pre-calibrated)** (xác định chính xác độ khó $b$, độ phân biệt $a$, độ đoán mò $c$ của từng câu hỏi thông qua thực nghiệm). Việc để Gemini tự gắn nhãn độ khó dựa trên tham số $\theta$ đầu vào chỉ là giải pháp giả lập, chưa có tính kiểm chứng thống kê.
*   **Chatbot & Sửa lỗi ở mức cơ bản:** Tính năng chat gia sư AI và sửa bài viết chỉ là gọi prompt trực tiếp cho Gemini 1.5 Flash. Đây chính là bẫy **"API Wrapper"** (vỏ bọc API) mà giám khảo KHKT cực kỳ không thích vì không có đóng góp công nghệ riêng.
*   **Thiếu Ma trận Kiến thức (Knowledge Graph):** Hệ thống báo cáo lỗ hổng kiến thức dựa trên các danh mục cứng (Tenses, Relative Clauses,...) mà không có một cây phân cấp kỹ năng chi tiết (ví dụ: học sinh yếu "Mệnh đề quan hệ rút gọn" do thiếu hụt kiến thức nền tảng về "Phân từ" hay "Động từ liên kết").
*   **Thiếu Giải thích năng lực (Explainable AI - XAI):** Dự báo điểm thi THPT chỉ là một công thức hồi quy tuyến tính/phân lớp cơ bản ở backend dựa trên $\theta$, người học không được giải thích rõ vì sao họ bị dự báo điểm số thấp và lộ trình cụ thể cần học bù lộ hổng đó như thế nào.

---

## PHẦN 2: ĐÁNH GIÁ TÍNH MỚI (NOVELTY ASSESSMENT)

Dưới đây là điểm số đánh giá độ trùng lặp và tính mới so với các nền tảng thương mại lớn hiện nay:

| Module hiện tại | Điểm tính mới (1-10) | So sánh trùng lặp với Elsa / Duolingo / Khan Academy | Tính phù hợp KHKT |
| :--- | :--- | :--- | :--- |
| **Đánh giá IRT** | **7/10** | **Khan Academy** sử dụng định chuẩn trình độ nhưng không dùng CAT-IRT thời gian thực cho từng câu đơn lẻ. **Duolingo** dùng IRT để thiết lập độ khó nhưng thuật toán ẩn. Ý tưởng này rất phù hợp KHKT nếu chứng minh được độ chính xác của mô hình EAP. | Rất cao |
| **Luyện đọc/nghe AI** | **5/10** | Trùng lặp ý tưởng với một số tính năng sinh bài viết của các ứng dụng AI mới xuất hiện gần đây. Tuy nhiên, tính năng này mang nặng tính CRUD + Prompt thông thường, chưa có đóng góp giải thuật. | Trung bình |
| **Từ vựng SM-2** | **4/10** | Trùng lặp **90%** với **Anki** và **Quizlet** (mô hình lặp khoảng cách). Nếu chỉ áp dụng SM-2 cơ bản thì giá trị nghiên cứu thấp. | Thấp |
| **Chấm phát âm** | **5/10** | Trùng lặp **85%** với **ELSA Speak** (ELSA mạnh hơn nhiều về nhận diện âm vị). Việc gọi Azure API chỉ thể hiện tính tích hợp. | Thấp |
| **Cờ Vua Tiếng Anh** | **8/10** | Tính gamification (trò chơi hóa) này khá độc đáo, **chưa thấy xuất hiện** trên các nền tảng học tiếng Anh phổ biến. Rất phù hợp để gây ấn tượng với giám khảo về tính sáng tạo thực tiễn. | Cao |
| **Dự báo điểm số** | **6/10** | Hầu hết các ứng dụng chỉ báo cáo tiến độ học (Completion rate) chứ không dự báo điểm thi chuẩn hóa dựa trên năng lực tiềm ẩn $\theta$. Rất phù hợp để phát triển thành module Machine Learning thực thụ. | Cao |

---

## PHẦN 3: ĐỀ XUẤT 20 CẢI TIẾN ĐỘT PHÁ (KHKT 2.0 ROADMAP)

Dưới đây là 20 cải tiến được thiết kế chuyên biệt để nâng tầm dự án thành một đề tài nghiên cứu khoa học thực thụ:

### Hướng 1: Adaptive Learning & Calibrated IRT (Học tập Thích ứng & Định chuẩn)

#### 1. Thuật toán Tự động Định chuẩn Câu hỏi (Self-Calibrating Question Engine)
*   **Mục đích:** Khắc phục nhược điểm "Gemini tự gắn nhãn độ khó" bằng cách cập nhật động độ khó thực tế của câu hỏi dựa trên phản hồi của cộng đồng người dùng.
*   **Cách hoạt động:** Áp dụng thuật toán **Cập nhật trực tuyến Rasch (Online Joint Maximum Likelihood Estimation - JMLE)**. Khi học sinh làm bài, hệ thống ghi nhận đúng/sai. Nếu một câu hỏi có độ khó lý thuyết là $1.0$ nhưng 95% học sinh yếu làm đúng $\to$ Hệ thống tự động hiệu chỉnh độ khó câu hỏi này xuống mức $-1.2$ ở database.
*   **Độ khó:** ★★★★☆ (Khó - cần xử lý toán học ma trận và cập nhật động DB).
*   **Giá trị nghiên cứu:** Nghiên cứu thuật toán hiệu chỉnh tham số động.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★☆
    *   Giá trị nghiên cứu: ★★★★★
    *   Khả năng triển khai: ★★★☆☆
    *   Khả năng đạt giải: ★★★★★

#### 2. Chiến lược Tối ưu hóa Lượng thông tin Fisher đa chiều (Multidimensional IRT - MIRT)
*   **Mục đích:** Đánh giá năng lực học sinh trên nhiều khía cạnh đồng thời (Ngữ pháp, Từ vựng, Đọc hiểu) thay vì gộp chung vào 1 chỉ số $\theta$ duy nhất.
*   **Cách hoạt động:** Biểu diễn năng lực dưới dạng vector $\Theta = [\theta_1, \theta_2, \theta_3]$. Thuật toán MFI (Multidimensional Fisher Information) sẽ chọn câu hỏi tiếp theo có thể tối ưu lượng thông tin đồng thời cho cả 3 chiều năng lực này.
*   **Độ khó:** ★★★★★ (Rất khó - toán học đa chiều).
*   **Giá trị nghiên cứu:** Khung lý thuyết kiểm tra đa chiều tiên tiến.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★★
    *   Giá trị nghiên cứu: ★★★★★
    *   Khả năng triển khai: ★★☆☆☆
    *   Khả năng đạt giải: ★★★★★

#### 3. Mô hình Sinh câu hỏi Định hướng theo Tham số b (Parameter-Guided Question Generation)
*   **Mục đích:** Ràng buộc Gemini chỉ sinh câu hỏi có cấu trúc ngữ pháp và từ vựng tương ứng chính xác với độ khó $b$ mục tiêu.
*   **Cách hoạt động:** Tạo bộ lọc (Few-Shot Prompts) chứa các mẫu câu hỏi chuẩn của Bộ GD&ĐT đã được gán nhãn độ khó bởi chuyên gia. Khi cần câu hỏi độ khó $b = 0.5$, AI sẽ thực hiện nội suy (Interpolation) từ các mẫu tương đương.
*   **Độ khó:** ★★★☆☆ (Trung bình).
*   **Giá trị nghiên cứu:** Prompt Engineering có kiểm soát tham số.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★☆
    *   Giá trị nghiên cứu: ★★★★☆
    *   Khả năng triển khai: ★★★★☆
    *   Khả năng đạt giải: ★★★★☆

### Hướng 2: Knowledge Graph & Error Diagnosis (Đồ thị Tri thức & Chẩn đoán Lỗi)

#### 4. Đồ thị Tri thức Ngữ pháp GDPT (Vietnamese High School English Knowledge Graph - VNEKG)
*   **Mục đích:** Xây dựng bản đồ các khái niệm ngữ pháp tiếng Anh từ lớp 6-12 và mối liên hệ phụ thuộc giữa chúng để làm nền tảng chẩn đoán gốc rễ lỗi sai.
*   **Cách hoạt động:** Sử dụng cơ sở dữ liệu đồ thị (Graph DB như Neo4j hoặc cấu trúc quan hệ phân cấp ở PostgreSQL). Ví dụ nút "Mệnh đề quan hệ rút gọn" sẽ có liên kết phụ thuộc `depends_on` đến nút "Phân từ hiện tại/quá khứ" và "Động từ chủ động/bị động".
*   **Độ khó:** ★★★★☆ (Khó - cần số hóa toàn bộ chương trình phổ thông thành đồ thị).
*   **Giá trị nghiên cứu:** Biểu diễn tri thức (Knowledge Representation) chuyên biệt cho người học Việt Nam.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★★
    *   Giá trị nghiên cứu: ★★★★★
    *   Khả năng triển khai: ★★★☆☆
    *   Khả năng đạt giải: ★★★★★

#### 5. Pipeline Chẩn đoán Lỗi Giao thoa Ngôn ngữ L1-L2 (L1-L2 Interference Diagnostics Pipeline)
*   **Mục đích:** Chẩn đoán lỗi sai ngữ pháp và phát âm đặc trưng do thói quen tư duy tiếng Việt (L1) ảnh hưởng lên tiếng Anh (L2).
*   **Cách hoạt động:** Hệ thống không chỉ sửa lỗi mà chạy qua một Agent chẩn đoán. Ví dụ, nếu học sinh viết *"She goes to school by bus every day"* nhưng phát âm thiếu âm cuối `/s/` ở từ `bus` và `goes` $\to$ AI chẩn đoán: *“Lỗi do L1 không có phụ âm cuối xát/vô thanh. Khuyến nghị luyện tập bài tập cơ hàm âm cuối.”*
*   **Độ khó:** ★★★★☆ (Khó - cần huấn luyện prompt phân tích lỗi hệ thống).
*   **Giá trị nghiên cứu:** Ứng dụng ngôn ngữ học đối chiếu (Contrastive Linguistics) vào AIED.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★★
    *   Giá trị nghiên cứu: ★★★★★
    *   Khả năng triển khai: ★★★★☆
    *   Khả năng đạt giải: ★★★★★

#### 6. Thuật toán Lan truyền Niềm tin Chẩn đoán Lỗi trên Đồ thị (Belief Propagation for Knowledge Tracing)
*   **Mục đích:** Khi học sinh làm sai 1 câu hỏi, hệ thống tự động suy luận xác suất họ bị hổng các kiến thức liên quan trên Đồ thị Tri thức.
*   **Cách hoạt động:** Sử dụng thuật toán lan truyền (Bayesian Knowledge Tracing kết hợp Graph Neural Network đơn giản). Nếu học sinh sai câu về "Mệnh đề quan hệ", xác suất hổng kiến thức "Đại từ quan hệ" tăng lên 80%, xác suất hổng kiến thức "Cấu trúc câu phức" tăng lên 50%.
*   **Độ khó:** ★★★★★ (Rất khó - toán xác suất đồ thị).
*   **Giá trị nghiên cứu:** Suy luận nhân quả trong giáo dục (Causal Inference in AIED).
*   *Đánh giá:*
    *   Mức độ mới: ★★★★★
    *   Giá trị nghiên cứu: ★★★★★
    *   Khả năng triển khai: ★★☆☆☆
    *   Khả năng đạt giải: ★★★★★

### Hướng 3: Learning Analytics & Predictive Learning (Phân tích Lộ trình & Dự báo)

#### 7. Mô hình Dự báo Điểm thi THPT dựa trên Mạng Neural Hồi quy (LSTM/GRUs Time-Series Score Predictor)
*   **Mục đích:** Thay thế công thức dự đoán điểm số tuyến tính bằng mô hình học máy chuỗi thời gian dự báo chính xác điểm số dựa trên biểu đồ tiến bộ của học sinh.
*   **Cách hoạt động:** Huấn luyện một mạng Neural hồi quy nhỏ (chạy bằng TensorFlow.js hoặc trên Python backend) nhận đầu vào là chuỗi giá trị $\theta$ theo ngày và độ giãn cách EF để dự báo điểm số THPT Quốc gia môn Tiếng Anh thực tế.
*   **Độ khó:** ★★★★☆ (Khó - cần xử lý dữ liệu chuỗi thời gian).
*   **Giá trị nghiên cứu:** Ứng dụng mô hình học sâu vào phân tích hành vi học tập (Learning Analytics).
*   *Đánh giá:*
    *   Mức độ mới: ★★★★☆
    *   Giá trị nghiên cứu: ★★★★☆
    *   Khả năng triển khai: ★★★☆☆
    *   Khả năng đạt giải: ★★★★☆

#### 8. Hệ thống Gợi ý Lộ trình Cá nhân hóa theo Mục tiêu (Goal-Oriented Path Recommender)
*   **Mục đích:** Tự động đề xuất danh sách các bài học cần làm để đạt được điểm số mục tiêu trong thời gian ngắn nhất.
*   **Cách hoạt động:** Sử dụng thuật toán **Tìm đường trên Đồ thị Tri thức (A* Search / Dijkstra)**. Điểm xuất phát là mức năng lực hiện tại của học sinh, điểm đích là mức năng lực cần thiết để đạt điểm thi tốt nghiệp THPT mục tiêu (ví dụ: mục tiêu 9.0 điểm cần $\theta \ge 2.2$). Thuật toán sẽ tìm lộ trình đi qua các nút kiến thức bị hổng ngắn nhất.
*   **Độ khó:** ★★★★☆ (Khó - lập trình giải thuật tìm đường trên cấu trúc đồ thị).
*   **Giá trị nghiên cứu:** Thuật toán tối ưu hóa lộ trình sư phạm.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★☆
    *   Giá trị nghiên cứu: ★★★★★
    *   Khả năng triển khai: ★★★☆☆
    *   Khả năng đạt giải: ★★★★★

#### 9. Dashboard Phân tích Tiến trình Giải thích được (Explainable Learning Dashboard)
*   **Mục đích:** Chỉ rõ cho học sinh và giáo viên hướng dẫn biết "Tại sao hệ thống lại dự đoán điểm thi THPT của bạn là 7.5 và bạn đang đứng ở trình độ B1".
*   **Cách hoạt động:** Sử dụng thuật toán **SHAP (SHapley Additive exPlanations)** để trực quan hóa mức độ ảnh hưởng của từng kỹ năng lên điểm số dự báo (ví dụ: Kỹ năng Đọc hiểu đóng góp +1.2 điểm, nhưng Phát âm kém làm giảm -0.4 điểm).
*   **Độ khó:** ★★★★☆ (Khó - tích hợp thư viện XAI).
*   **Giá trị nghiên cứu:** Trí tuệ nhân tạo giải thích được (Explainable AI - XAI) trong giáo dục.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★★
    *   Giá trị nghiên cứu: ★★★★★
    *   Khả năng triển khai: ★★★☆☆
    *   Khả năng đạt giải: ★★★★★

### Hướng 4: Advanced Spaced Repetition (Lặp khoảng cách nâng cao)

#### 10. Thuật toán Lặp khoảng cách Thích ứng Ngữ cảnh (Context-Aware Spaced Repetition - CASR)
*   **Mục đích:** Khắc phục nhược điểm của SM-2 cơ bản (vốn coi mọi từ vựng đều khó như nhau và bỏ qua độ dài/ngữ cảnh của từ).
*   **Cách hoạt động:** Tích hợp độ khó cấu trúc của từ (độ dài, mức độ phổ biến theo từ điển tần suất COCA) và năng lực $\theta$ hiện tại của học sinh vào việc tính toán hệ số dễ EF mới. Từ dài và phức tạp sẽ có EF giảm nhanh hơn.
*   **Độ khó:** ★★★☆☆ (Trung bình).
*   **Giá trị nghiên cứu:** Cải tiến thuật toán ghi nhớ sinh học.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★☆
    *   Giá trị nghiên cứu: ★★★★☆
    *   Khả năng triển khai: ★★★★☆
    *   Khả năng đạt giải: ★★★★☆

#### 11. Trình sinh Câu chuyện Ngữ cảnh Trí nhớ (Memory-Anchor Context Generator)
*   **Mục đích:** Tự động tạo một đoạn văn ngắn (Story) chứa toàn bộ các từ vựng đến hạn phải ôn tập trong ngày để học sinh ôn tập trong ngữ cảnh thay vì ôn từ đơn lẻ.
*   **Cách hoạt động:** Hệ thống lọc ra 5 từ vựng cần ôn tập trong ngày của học sinh $\to$ Gửi prompt đến Gemini yêu cầu viết một câu chuyện ngắn hài hước/kịch tính chứa đúng 5 từ này ở mức độ ngữ pháp phù hợp với $\theta$ của người học.
*   **Độ khó:** ★★★☆☆ (Trung bình).
*   **Giá trị nghiên cứu:** Phương pháp sư phạm neo giữ trí nhớ (Memory anchoring) qua Generative AI.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★☆
    *   Giá trị nghiên cứu: ★★★★☆
    *   Khả năng triển khai: ★★★★☆
    *   Khả năng đạt giải: ★★★★☆

### Hướng 5: Multi-Agent AI & RAG (Hệ thống Đại diện & RAG học thuật)

#### 12. Kiến trúc Cộng tác Multi-Agent chấm bài viết luận (Multi-Agent Essay Assessment Collaborative)
*   **Mục đích:** Đánh giá bài viết luận tiếng Anh của học sinh một cách khách quan, đa chiều và chống ảo tưởng (hallucination) của LLM.
*   **Cách hoạt động:** Thiết lập 3 Agent độc lập:
    *   *Agent 1 (Grammar Checker):* Chuyên tìm và phân tích lỗi ngữ pháp, cấu trúc câu.
    *   *Agent 2 (Cohesion & Lexical Resource Examiner):* Chuyên chấm điểm tính liên kết và độ phong phú từ vựng.
    *   *Agent 3 (Debater/Logic Auditor):* Đóng vai phản biện, đánh giá tính logic của các luận điểm.
    *   Cả 3 Agent gửi kết quả về *Supervisor Agent* để tổng hợp điểm số và đưa ra lời khuyên thống nhất.
*   **Độ khó:** ★★★★☆ (Khó - cấu hình luồng chạy song song Multi-Agent).
*   **Giá trị nghiên cứu:** Kiến trúc hệ thống AI cộng tác (Agentic Collaboration).
*   *Đánh giá:*
    *   Mức độ mới: ★★★★★
    *   Giá trị nghiên cứu: ★★★★★
    *   Khả năng triển khai: ★★★☆☆
    *   Khả năng đạt giải: ★★★★★

#### 13. Hệ thống RAG Kiểm soát Ảo ảnh Học thuật (Hallucination-Control Grammar RAG)
*   **Mục đích:** Đảm bảo các giải thích ngữ pháp của AI Mentor luôn chuẩn xác theo sách giáo khoa phổ thông Việt Nam và các tài liệu ngữ pháp uy tín quốc tế (Cambridge/Oxford), không tự bịa kiến thức.
*   **Cách hoạt động:** Số hóa sách giáo khoa tiếng Anh và tài liệu ngữ pháp thành dữ liệu Vector (Vector DB như FAISS/ChromaDB). Khi học sinh hỏi hoặc làm sai câu hỏi $\to$ Hệ thống tìm kiếm các đoạn luật ngữ pháp tương ứng từ Vector DB $\to$ Đính kèm vào prompt của Gemini để làm ngữ cảnh sinh câu trả lời (RAG).
*   **Độ khó:** ★★★★☆ (Khó - cần xử lý nhúng vector dữ liệu tài liệu).
*   **Giá trị nghiên cứu:** Ứng dụng RAG chống ảo ảnh kiến thức ngoại ngữ.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★☆
    *   Giá trị nghiên cứu: ★★★★★
    *   Khả năng triển khai: ★★★☆☆
    *   Khả năng đạt giải: ★★★★★

#### 14. Agent Chuyển đổi Ngữ cảnh Giáo viên (Persona-Adaptive Pedagogical Agent)
*   **Mục đích:** Tự động điều chỉnh phong cách dạy học của AI Mentor cho phù hợp với đặc điểm tâm lý của học sinh.
*   **Cách hoạt động:** Phân loại học sinh thành các nhóm phong cách học tập (ví dụ: Thích khích lệ, Thích nghiêm khắc, Thích phân tích số liệu). AI Tutor sẽ tự động thay đổi hệ thống prompt (Persona) tương ứng để đạt hiệu quả truyền đạt cao nhất.
*   **Độ khó:** ★★★☆☆ (Trung bình).
*   **Giá trị nghiên cứu:** Nghiên cứu sự thích ứng phong cách giảng dạy (Pedagogical Adaptivity).
*   *Đánh giá:*
    *   Mức độ mới: ★★★☆☆
    *   Giá trị nghiên cứu: ★★★★☆
    *   Khả năng triển khai: ★★★★☆
    *   Khả năng đạt giải: ★★★☆☆

### Hướng 6: Gamification & Game Theory (Trò chơi hóa & Lý thuyết trò chơi)

#### 15. Bàn Cờ Vua Thích Ứng Lý Thuyết Trò Chơi (Game-Theoretic Chess Adaptation)
*   **Mục đích:** Nâng cấp bàn cờ vua tiếng Anh hiện tại thành một mô hình lý thuyết trò chơi thực sự, nơi độ khó của câu hỏi tỷ lệ thuận với giá trị quân cờ muốn đi.
*   **Cách hoạt động:** Thiết lập luật chơi:
    *   Đi quân Tốt (1 điểm): Giải câu hỏi dễ ($b = -1.0$).
    *   Đi quân Mã/Tượng (3 điểm): Giải câu hỏi trung bình ($b = 0.2$).
    *   Đi Xe (5 điểm) / Hậu (9 điểm): Giải câu hỏi thách thức ($b \ge 1.5$).
    *   Nếu trả lời sai, người chơi bị phạt (mất lượt hoặc quân cờ bị suy yếu chỉ số phòng thủ).
*   **Độ khó:** ★★★☆☆ (Trung bình).
*   **Giá trị nghiên cứu:** Tích hợp cơ chế Game Theory vào học tập thích ứng.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★☆
    *   Giá trị nghiên cứu: ★★★★☆
    *   Khả năng triển khai: ★★★★☆
    *   Khả năng đạt giải: ★★★★☆

#### 16. Thuật toán Đối thủ Cờ vua Học máy (Reinforcement Learning Chess Bot - RLCB)
*   **Mục đích:** Thay thế thuật toán Greedy bằng một tác tử học máy cờ vua thích nghi với lối chơi và trình độ tiếng Anh của học sinh.
*   **Cách hoạt động:** Tích hợp thư viện cờ vua nhẹ hoặc thuật toán Minimax kết hợp Alpha-Beta pruning được điều chỉnh độ sâu tìm kiếm (depth) dựa trên chỉ số $\theta$ của học sinh. Học sinh giỏi tiếng Anh sẽ đối đầu với Bot cờ vua thông minh hơn.
*   **Độ khó:** ★★★★☆ (Khó).
*   **Giá trị nghiên cứu:** Đồng thích ứng (Co-adaptation) giữa năng lực ngoại ngữ và độ khó trò chơi.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★☆
    *   Giá trị nghiên cứu: ★★★★☆
    *   Khả năng triển khai: ★★★☆☆
    *   Khả năng đạt giải: ★★★★☆

### Hướng 7: Speech & Pronunciation Diagnostics (Phát âm chuyên sâu)

#### 17. Thuật toán Bản Đồ Nhiệt Âm Vị Lỗi (Phoneme Error Heatmap Matrix)
*   **Mục đích:** Chỉ ra cụ thể học sinh đang phát âm sai những âm vị (phụ âm/nguyên âm) nào lặp đi lặp lại nhiều lần thay vì chỉ báo điểm số chung chung.
*   **Cách hoạt động:** Trích xuất kết quả phân tích âm vị từ Azure Speech (trả về kết quả phát âm của từng từ đơn lẻ). Hệ thống thống kê toàn bộ các âm vị bị sai qua các bài luyện đọc $\to$ Vẽ một bản đồ nhiệt (Heatmap) chỉ ra 3 âm vị học sinh hay phát âm sai nhất (ví dụ: `/ʃ/`, `/θ/`, `/dʒ/`).
*   **Độ khó:** ★★★★☆ (Khó - cần bóc tách dữ liệu JSON sâu của Azure REST).
*   **Giá trị nghiên cứu:** Chẩn đoán lỗi âm vị tự động học sinh phổ thông.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★☆
    *   Giá trị nghiên cứu: ★★★★★
    *   Khả năng triển khai: ★★★★☆
    *   Khả năng đạt giải: ★★★★★

#### 18. Trình Luyện Nghe Phân Tích Giọng Điệu Bản Địa (Dialect-Adaptive Listening Module)
*   **Mục đích:** Giúp học sinh luyện nghe và phân biệt các chất giọng tiếng Anh phổ biến xuất hiện trong đề thi nghe tốt nghiệp/IELTS (Anh-Anh, Anh-Mỹ, Anh-Úc).
*   **Cách hoạt động:** Sử dụng Azure TTS cấu hình các giọng đọc khác nhau (ví dụ: `en-GB-SoniaNeural`, `en-US-GuyNeural`, `en-AU-NatashaNeural`). AI sẽ tự động thay đổi giọng đọc qua từng câu hỏi thích ứng và yêu cầu học sinh làm quen với các hiện tượng nối âm, nuốt âm đặc trưng của từng vùng.
*   **Độ khó:** ★★★☆☆ (Trung bình).
*   **Giá trị nghiên cứu:** Đa dạng hóa môi trường ngữ âm trong EdTech.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★☆
    *   Giá trị nghiên cứu: ★★★★☆
    *   Khả năng triển khai: ★★★★☆
    *   Khả năng đạt giải: ★★★★☆

### Hướng 8: Ethics & Guardrails (Đạo đức & Kiểm duyệt AI)

#### 19. Bộ lọc Kiểm duyệt An toàn Học thuật (Pedagogical Guardrails & Filter)
*   **Mục đích:** Ngăn chặn tuyệt đối việc học sinh lợi dụng chatbot AI để hỏi các chủ đề không liên quan đến học tập hoặc các nội dung độc hại.
*   **Cách hoạt động:** Thiết lập một lớp kiểm duyệt (Guardrail Agent) chặn trước API chat. Lớp này sử dụng mô hình phân loại văn bản nhỏ hoặc prompt kiểm duyệt cứng. Nếu câu hỏi không thuộc chủ đề tiếng Anh/học tập, AI sẽ từ chối trả lời và hướng dẫn học sinh tập trung học tập.
*   **Độ khó:** ★★★☆☆ (Trung bình).
*   **Giá trị nghiên cứu:** Đạo đức AI (AI Ethics) và an toàn trường học.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★☆
    *   Giá trị nghiên cứu: ★★★★☆
    *   Khả năng triển khai: ★★★★☆
    *   Khả năng đạt giải: ★★★★☆

#### 20. Trình Đối Sánh Kết Quả Tự Động (Auto-Evaluation & Validation Framework)
*   **Mục đích:** Tự động đối sánh và kiểm thử chất lượng câu hỏi do AI sinh ra trước khi gửi tới người dùng cuối.
*   **Cách hoạt động:** Trước khi câu hỏi được đưa vào cơ sở dữ liệu học sinh, một mô hình LLM độc lập (ví dụ: Claude/GPT-4o) sẽ đóng vai học sinh giải thử câu hỏi này. Nếu câu hỏi bị lỗi (không có đáp án đúng, trùng lặp đáp án, giải thích sai) $\to$ Hệ thống tự động hủy và yêu cầu sinh lại.
*   **Độ khó:** ★★★★☆ (Khó - tự động hóa quy trình kiểm thử chéo).
*   **Giá trị nghiên cứu:** Kiểm thử tự động hệ thống Generative AI.
*   *Đánh giá:*
    *   Mức độ mới: ★★★★★
    *   Giá trị nghiên cứu: ★★★★★
    *   Khả năng triển khai: ★★★☆☆
    *   Khả năng đạt giải: ★★★★★

---

## PHẦN 4: THIẾT KẾ KIẾN TRÚC HỆ THỐNG PHIÊN BẢN 2.0 (AI ENGLISH MENTOR 2.0)

Để có một đề tài KHKT đạt giải cao nhất, chúng ta cần tái cấu trúc dự án từ một trang web học tập thông thường thành **Hệ thống chẩn đoán lỗi sâu kết hợp học tập thích ứng đa chiều**.

### 1. Kiến trúc Trí tuệ nhân tạo (AI Pipeline & System Architecture)

```
+-----------------------------------------------------------------------------------+
|                                   USER INTERFACE                                  |
|         (React Vite App: Dashboard, Pronunciation Assessor, English Chess 2.0)     |
+----------------------------------------------------+------------------------------+
                                                     |
                                            Yêu cầu & Dữ liệu ghi âm
                                                     v
+----------------------------------------------------+------------------------------+
|                              FASTAPI MIDDLEWARE LAYER                             |
|                                                                                   |
|  +------------------------+  +-----------------------+  +----------------------+  |
|  |   Guardrail Agent      |  |  L1-L2 Diagnostics    |  |  Explainable SHAP    |  |
|  |   (Kiểm duyệt đầu vào) |  |  (Phân tích âm vị)    |  |  (Giải thích dự báo) |  |
|  +-----------+------------+  +-----------+-----------+  +-----------+----------+  |
|              |                           |                          |             |
+--------------+---------------------------+--------------------------+-------------+
               |                           |                          |
               | Yêu cầu an toàn           | Trích xuất phổ âm        | Yêu cầu phân tích
               v                           v                          v
+--------------+---------------------------+--------------------------+-------------+
|                                  AI AGENT PIPELINE                                |
|                                                                                   |
|   +-------------------+     +-------------------------+     +-----------------+   |
|   |   RAG Vector DB   | <-> |  Multi-Agent Assessors  | <-> |  Rasch Engine   |   |
|   |  (ChromaDB: SGK)  |     |  (Grammar/Lexical/Logic)|     |  (Định chuẩn b) |   |
|   +-------------------+     +-------------------------+     +-----------------+   |
+------------------------------------------+----------------------------------------+
                                           |
                                  Đại diện gọi LLM
                                           v
                               +-----------+-----------+
                               |     Gemini 1.5 Flash  |
                               |    (Google AI Studio) |
                               +-----------------------+
```

### 2. Thiết kế Cơ sở dữ liệu nâng cao (Database Schema)

Để đáp ứng được Đồ thị tri thức và Thuật toán thích ứng Rasch, Cơ sở dữ liệu cần thiết kế các bảng sau (Ví dụ sử dụng PostgreSQL):

#### Bảng `knowledge_nodes` (Đồ thị tri thức)
```sql
CREATE TABLE knowledge_nodes (
    node_id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    grade_level INT NOT NULL,
    prerequisite_node_id VARCHAR(50) REFERENCES knowledge_nodes(node_id) -- Nút tiên quyết
);
```

#### Bảng `questions_pool` (Kho câu hỏi định chuẩn)
```sql
CREATE TABLE questions_pool (
    item_id VARCHAR(50) PRIMARY KEY,
    node_id VARCHAR(50) REFERENCES knowledge_nodes(node_id),
    question_text TEXT NOT NULL,
    options JSONB NOT NULL, -- Mảng 4 đáp án dạng JSON
    correct_option CHAR(1) NOT NULL,
    difficulty_b DOUBLE PRECISION DEFAULT 0.0,      -- Tham số độ khó b
    discrimination_a DOUBLE PRECISION DEFAULT 1.0,   -- Tham số độ phân biệt a
    guessing_c DOUBLE PRECISION DEFAULT 0.2,         -- Tham số đoán mò c
    total_attempts INT DEFAULT 0,
    correct_attempts INT DEFAULT 0
);
```

#### Bảng `student_ability_history` (Nhật ký năng lực người học)
```sql
CREATE TABLE student_ability_history (
    history_id SERIAL PRIMARY KEY,
    student_id INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estimated_theta DOUBLE PRECISION NOT NULL,       -- Điểm theta ước lượng thời điểm đó
    raw_accuracy DOUBLE PRECISION NOT NULL           -- Tỷ lệ % đúng thực tế thời điểm đó
);
```

---

## PHẦN 5: KHUNG THỰC NGHIỆM SƯ PHẠM ĐẠT GIẢI (RESEARCH METHODOLOGY)

Để giám khảo KHKT tin tưởng đề tài, học sinh phải chứng minh được bằng con số thống kê qua thực nghiệm sư phạm. Dưới đây là quy trình thực nghiệm chuẩn:

### 1. Thiết kế Nhóm thực nghiệm (Experimental Design)
*   **Đối tượng:** Chọn 2 lớp 12 có học lực tiếng Anh tương đương nhau tại trường.
    *   **Nhóm A (Nhóm Thực nghiệm - 40 học sinh):** Cho sử dụng nền tảng *AI English Mentor 2.0* để tự học và ôn tập mỗi ngày 20 phút.
    *   **Nhóm B (Nhóm Đối chứng - 40 học sinh):** Ôn tập theo phương pháp truyền thống (làm đề trên giấy, giáo viên sửa bài trên lớp).
*   **Thời gian:** Thực nghiệm kéo dài liên tục trong **8 tuần** trước kỳ thi thử tốt nghiệp THPT Quốc gia.

### 2. Các chỉ số đo lường hiệu quả (Metrics & Verification)
*   **Chỉ số 1: Điểm kiểm tra Đầu vào - Đầu ra (Pre-test & Post-test):** Cho cả 2 nhóm làm chung 1 đề thi tốt nghiệp THPT chuẩn của Bộ GD&ĐT trước và sau thực nghiệm.
*   **Chỉ số 2: Độ hội tụ năng lực (IRT Convergence rate):** Đo lường số lượng câu hỏi hệ thống cần dùng để xác định chính xác năng lực học sinh (chứng minh thuật toán thích ứng giúp rút ngắn thời gian làm bài).

### 3. Phân tích thống kê bằng SPSS / Python (Statistical Analysis)
Học sinh phải thực hiện kiểm định giả thuyết thống kê để chứng minh sự tiến bộ của nhóm thực nghiệm không phải do ngẫu nhiên:
*   Sử dụng kiểm định **Paired t-test** (để so sánh điểm trước và sau thực nghiệm của nhóm A).
*   Sử dụng kiểm định **Independent t-test** (để so sánh mức độ tiến bộ giữa nhóm A và nhóm B).
*   **Mục tiêu kết quả:** Chỉ số ý nghĩa thống kê đạt **`p-value < 0.05`** (khẳng định sự cải thiện điểm số có ý nghĩa thực tế 95% độ tin cậy).

---

## KẾT LUẬN & ĐỀ XUẤT CHO BẢN NÂNG CẤP HIỆN TẠI
Trang web hiện tại của bạn đã có **hạ tầng cực tốt và thuật toán nền tảng vững chắc** (đầy đủ IRT, SM-2, Deploy VPS, SSL). 

Để chuẩn bị mang đi thi KHKT đạt giải cao nhất:
1. Bạn hãy bổ sung ngay giao diện hiển thị **Double Metrics (Tỷ lệ đúng thực tế + Điểm năng lực IRT)** mà mình vừa nâng cấp thành công ở tệp `IRTTestEngine.jsx` để tăng trải nghiệm người dùng.
2. In sẵn tài liệu **[bao_cao_chi_phi_va_thuc_tien.md](file:///C:/Users/TUANANH-STUDIOO/Documents/KHKT/bao_cao_chi_phi_va_thuc_tien.md)** để kẹp vào hồ sơ thuyết minh đề tài nhằm trả lời câu hỏi thực tiễn của ban giám khảo.
3. Sử dụng sơ đồ kiến trúc AI 2.0 và quy trình thực nghiệm sư phạm ở báo cáo chuyên gia này để viết vào tài liệu Đề cương nghiên cứu chính thức.
