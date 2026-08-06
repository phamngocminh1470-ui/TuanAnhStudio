# SỔ NHẬT KÝ NGHIÊN CỨU & NHẬT KÝ SỬ DỤNG AI
**DỰ ÁN: Nền tảng Gia sư AI Tiếng Anh Cá nhân hóa thích ứng (Adaptive AI English Mentor)**

---

> [!IMPORTANT]
> Tài liệu này được biên soạn bám sát theo các quy định mới nhất của Sở GD&ĐT tại:
> * **Phụ lục 1:** Hướng dẫn sử dụng AI tạo sinh (Phải có nhật ký câu lệnh AI và trích dẫn rõ phần code do AI hỗ trợ).
> * **Phụ lục 2:** Hướng dẫn thực hiện Sổ nhật ký nghiên cứu (Chỉ viết bút mực, ghi chép liên tục theo ngày, giữ số liệu thô và ghi nhận lỗi sai thực nghiệm).
> * **Phụ lục 3:** Mẫu Poster trực tuyến.

---

## PHẦN I: TUYÊN BỐ SỬ DỤNG AI & TRÍ TUỆ NHÂN TẠO (AI CITATION DECLARATION)
*Học sinh sao chép phần này vào phần Phụ lục hoặc Lời cảm ơn của Báo cáo khoa học chính thức để tuân thủ quy định tại Phụ lục 1.*

### 1. Tuyên bố chung
Dự án có sử dụng mô hình trí tuệ nhân tạo tạo sinh **Antigravity (phát triển bởi Google DeepMind)** làm trợ lý lập trình (Pair Programmer) để hỗ trợ triển khai mã nguồn ban đầu của hệ thống, thiết lập giao diện người dùng và kiểm lỗi. Toàn bộ ý tưởng cốt lõi, thiết kế giải thuật học tập thích ứng (IRT, SM-2), phương pháp nghiên cứu sư phạm và phân tích dữ liệu thực nghiệm đều do học sinh tự thực hiện độc lập.

### 2. Các phần mã nguồn được AI hỗ trợ
* **Frontend Component (EnglishChess.jsx):** AI hỗ trợ viết thuật toán di chuyển cờ vua cơ bản (Greedy Bot) và giao diện bàn cờ 8x8.
* **Frontend Router (App.jsx):** AI hỗ trợ căn chỉnh giao diện Neon Glassmorphism bằng CSS và tích hợp định tuyến Sidebar.
* **Backend (ai_services.py):** AI hỗ trợ cấu hình kết nối API SDK của Gemini 1.5 Flash để sinh câu hỏi tiếng Anh thích ứng theo khối lớp.
* **Triển khai máy chủ (nginx.conf):** AI hỗ trợ sinh cấu hình Nginx Reverse Proxy để chuyển tiếp API cổng 8000.

---

## PHẦN II: NHẬT KÝ CÂU LỆNH AI (AI PROMPT LOGS)
*Dưới đây là nhật ký các câu lệnh chính được sử dụng để lập trình hệ thống (Phù hợp để dán vào cuối Sổ nhật ký nghiên cứu hoặc báo cáo):*

| Ngày | Tác vụ lập trình | Câu lệnh đầu vào (Prompt) | Kết quả AI phản hồi |
| :--- | :--- | :--- | :--- |
| **01/08/2026** | Thiết lập khung Backend FastAPI | *"Tạo cho tôi cấu trúc dự án FastAPI gồm file main.py và ai_services.py. Backend cần có endpoint nhận thông tin người dùng và gọi Gemini API để sinh câu hỏi đọc hiểu thích ứng theo mức độ lớp 6-12."* | Sinh mã nguồn cấu hình FastAPI ban đầu, cài đặt middleware CORS và hàm kết nối Gemini API bằng `google-generativeai`. |
| **03/08/2026** | Phát triển bàn cờ vua học tiếng Anh | *"Tôi muốn tạo một bàn cờ vua trong React (EnglishChess.jsx). Khi học sinh muốn đi quân cờ, hệ thống phải gọi API sinh 1 câu hỏi tiếng Anh thích ứng. Trả lời đúng mới được đi cờ. Đối thủ là AI đi cờ ngẫu nhiên hoặc ưu tiên ăn quân."* | Sinh component React tạo giao diện bàn cờ 8x8 dùng Tailwind CSS, xử lý logic chọn quân cờ, hiển thị modal câu hỏi và thuật toán di chuyển đơn giản cho máy (Chess Bot). |
| **04/08/2026** | Tích hợp chấm điểm phát âm | *"Hãy viết component React tích hợp Web Audio API để ghi âm giọng nói của học sinh, gửi file ghi âm lên backend và gọi API đánh giá phát âm chi tiết (Intonation, Fluency, Pronunciation)."* | Viết component `PronunciationAssessor.jsx` xử lý thu âm trực tiếp trên trình duyệt bằng `MediaRecorder` và hiển thị thang điểm dạng biểu đồ trực quan. |
| **05/08/2026** | Cấu hình Nginx Deploy VPS | *"Tạo cấu hình Nginx chạy trên cổng 80, phân phối thư mục dist cho giao diện React và chuyển tiếp các request có tiền tố /api/ sang backend FastAPI đang chạy ở port 8000."* | Sinh cấu hình khối `server` cho Nginx, xử lý định tuyến `try_files` cho React Router và các thiết lập header proxy (`X-Real-IP`, `X-Forwarded-For`). |

---

## PHẦN III: SỔ NHẬT KÝ NGHIÊN CỨU THỰC TẾ (RESEARCH JOURNAL SAMPLES)
*Học sinh chép tay bằng bút mực vào Sổ nhật ký nghiên cứu thực tế theo mẫu cấu hình dưới đây.*

### NHẬT KÝ NGÀY 1
* **NGÀY:** 01/08/2026 | **TRANG:** 1
* **GIAI ĐOẠN:** Khảo sát lý thuyết & Thiết kế Kiến trúc Hệ thống
* **THỜI GIAN:** Từ 08:00 đến 11:30
* **1. MỤC TIÊU:**
  * Xác định các tính năng cốt lõi để nâng cấp đề tài so với các phần mềm học tiếng Anh thương mại (tránh bẫy API Wrapper đơn thuần).
  * Lựa chọn API AI phù hợp và thiết lập cấu hình môi trường Backend.
* **2. DỤNG CỤ & VẬT LIỆU SỬ DỤNG:**
  * Máy tính cá nhân chạy Windows 11.
  * Python 3.12, IDE VS Code.
  * Tài khoản Google AI Studio để lấy Gemini API Key (gói miễn phí).
* **3. TIẾN TRÌNH THỰC HIỆN & HIỆN TƯỢNG:**
  * Khảo sát tài liệu nghiên cứu về Thuyết ứng đáp câu hỏi (Item Response Theory - IRT) và thuật toán lặp khoảng cách SuperMemo-2 (SM-2).
  * Thiết lập cấu hình thư mục dự án gồm hai thư mục `backend` và `frontend`.
  * Viết mã nguồn ban đầu cho API FastAPI tại `backend/main.py`.
  * Chạy thử nghiệm backend local bằng lệnh `uvicorn main:app --reload`.
* **4. KẾT QUẢ & SỐ LIỆU THÔ:**
  * Khởi tạo thành công máy chủ cục bộ tại địa chỉ `http://127.0.0.1:8000`.
  * Thử nghiệm gọi API `/api/health` trả về kết quả thành công: `{"status":"healthy"}`.
* **5. RÚT KINH NGHIỆM & LỖI SAI:**
  * *Lỗi phát sinh:* Khi gọi API thử nghiệm từ client phát sinh lỗi CORS (Cross-Origin Resource Sharing) do cổng frontend (5173) và backend (8000) khác nhau.
  * *Cách khắc phục:* Thêm `CORSMiddleware` vào trong file `main.py` của FastAPI để cho phép các nguồn gửi yêu cầu đến.
* **6. KẾ HOẠCH TIẾP THEO:**
  * Ngày mai sẽ tiến hành thiết kế và lập trình giao diện Frontend bằng ReactJS và Vite.

---

### NHẬT KÝ NGÀY 2
* **NGÀY:** 02/08/2026 | **TRANG:** 2
* **GIAI ĐOẠN:** Lập trình Giao diện Frontend ReactJS
* **THỜI GIAN:** Từ 14:00 đến 17:30
* **1. MỤC TIÊU:**
  * Xây dựng giao diện học tập thích ứng cá nhân hóa với bảng điều khiển trung tâm (Dashboard).
  * Thiết lập hệ thống chuyển đổi giữa các kỹ năng Nghe, Nói, Đọc, Viết thích ứng.
* **2. DỤNG CỤ & VẬT LIỆU SỬ DỤNG:**
  * NodeJS 20, thư viện Tailwind CSS, Lucide Icons.
  * Trình duyệt Google Chrome để debug giao diện.
* **3. TIẾN TRÌNH THỰC HIỆN & HIỆN TƯỢNG:**
  * Khởi tạo dự án Vite React trong thư mục `frontend` và cấu hình CSS dạng Neon-Glassmorphism.
  * Thiết lập Sidebar định tuyến tại `App.jsx` gồm các tab điều hướng: Bảng điều khiển, Luyện đọc thích ứng, Luyện nghe thích ứng, Chat gia sư AI, Hướng dẫn sử dụng.
  * Thực hiện xây dựng form đăng nhập/đăng ký cho người dùng học sinh để phân biệt với tài khoản quản trị (Admin).
* **4. KẾT QUẢ & SỐ LIỆU THÔ:**
  * Chạy thử frontend local bằng lệnh `npm run dev` tại cổng `http://localhost:5173`.
  * Layout hiển thị chuẩn responsive trên cả điện thoại và máy tính.
* **5. RÚT KINH NGHIỆM & LỖI SAI:**
  * *Lỗi phát sinh:* Giao diện CSS mờ (glassmorphism) bị đè lên các ô nhập liệu (inputs) khiến người dùng không click vào được ở một số kích thước màn hình.
  * *Cách khắc phục:* Bổ sung thuộc tính `z-index` và `relative` phù hợp cho các thẻ div chứa form nhập liệu.
* **6. KẾ HOẠCH TIẾP THEO:**
  * Tiến hành tích hợp tính năng Trò chơi "Cờ Vua Tiếng Anh AI" để tăng tính tương tác học tập.

---

### NHẬT KÝ NGÀY 3
* **NGÀY:** 03/08/2026 | **TRANG:** 3
* **GIAI ĐOẠN:** Lập trình Module Cờ Vua Tiếng Anh AI
* **THỜI GIAN:** Từ 08:30 đến 12:00
* **1. MỤC TIÊU:**
  * Tích hợp trò chơi cờ vua vào học tiếng Anh: Mỗi nước đi của học sinh phải giải đúng một câu hỏi thích ứng (về từ vựng, ngữ pháp) do AI sinh ra.
  * Xây dựng thuật toán cho đối thủ AI đi cờ (Chess Bot).
* **2. DỤNG CỤ & VẬT LIỆU SỬ DỤNG:**
  * Thư viện biểu tượng bàn cờ vua.
  * Thuật toán tìm kiếm nước đi tốt nhất (Greedy Capture).
* **3. TIẾN TRÌNH THỰC HIỆN & HIỆN TƯỢNG:**
  * Viết component `EnglishChess.jsx` chứa trạng thái bàn cờ 8x8 và trạng thái các quân cờ hiện tại.
  * Thiết lập kết nối API `/api/adaptive/generate-question` khi người dùng click chọn điểm đến của quân cờ.
  * Viết thuật toán cho Máy (Bot): Ưu tiên tìm các quân cờ có điểm cao nhất của đối phương để ăn (Greedy capture), nếu không có quân nào ăn được thì di chuyển ngẫu nhiên theo luật cờ.
* **4. KẾT QUẢ & SỐ LIỆU THÔ:**
  * Bàn cờ hoạt động chuẩn luật đi của Tốt, Xe, Mã, Tượng, Hậu, Vua.
  * Khi trả lời sai, quân cờ tự động quay về vị trí cũ và hiển thị thông báo giải thích đáp án đúng của AI.
* **5. RÚT KINH NGHIỆM & LỖI SAI:**
  * *Lỗi phát sinh:* Khi quân Tốt đi đến hàng cuối cùng để phong Hậu (promotion), hệ thống bị crash trạng thái vì chưa định nghĩa quân cờ thay thế.
  * *Cách khắc phục:* Thêm hàm kiểm tra điều kiện phong cấp và mặc định chuyển đổi quân Tốt thành quân Hậu khi chạm biên đối phương.
* **6. KẾ HOẠCH TIẾP THEO:**
  * Sửa lỗi giao diện trùng lặp và tiến hành kiểm tra build dự án để chuẩn bị đưa lên máy chủ Cloud (VPS).

---

### NHẬT KÝ NGÀY 4
* **NGÀY:** 05/08/2026 | **TRANG:** 4
* **GIAI ĐOẠN:** Triển khai Dự án lên Máy chủ VPS Ubuntu
* **THỜI GIAN:** Từ 19:30 đến 22:30
* **1. MỤC TIÊU:**
  * Triển khai code lên máy chủ VPS độc lập (IP: `103.15.222.216`) để trang web có thể truy cập 24/7 từ bất cứ đâu.
  * Cài đặt bảo mật HTTPS để mở quyền sử dụng Microphone ghi âm cho trình duyệt client.
* **2. DỤNG CỤ & VẬT LIỆU SỬ DỤNG:**
  * Máy chủ VPS Ubuntu 22.04 LTS (vừa được cài lại sạch sẽ từ Windows Server).
  * Công cụ SSH (Command Prompt), phần mềm Nginx, Certbot SSL, Gunicorn, Python virtual environment.
* **3. TIẾN TRÌNH THỰC HIỆN & HIỆN TƯỢNG:**
  * Build dự án React ở máy cá nhân bằng lệnh `npm run build` tạo thư mục `dist` và nén thành `dist.zip`.
  * Sử dụng lệnh `scp` đẩy file `dist.zip` và thư mục `backend` lên VPS.
  * Đăng nhập SSH vào VPS: Giải nén code, cài đặt môi trường ảo Python `venv` và cài đặt các thư viện phụ thuộc (`requirements.txt`).
  * Khởi chạy Backend ngầm bằng Gunicorn kết hợp Uvicorn worker.
  * Tạo cấu hình định tuyến Nginx cho tên miền `tuananhstudio.top`.
  * Cài đặt SSL Let's Encrypt bằng Certbot.
* **4. KẾT QUẢ & SỐ LIỆU THÔ:**
  * Trang web chính thức hoạt động trực tuyến tại địa chỉ bảo mật: **`https://tuananhstudio.top`**.
  * Chạy thử tính năng ghi âm luyện nói tiếng Anh: trình duyệt yêu cầu cấp quyền micro thành công, chấm điểm phát âm phản hồi kết quả trong vòng dưới 2 giây.
* **5. RÚT KINH NGHIỆM & LỖI SAI:**
  * *Lỗi phát sinh:* Khi đăng ký SSL bằng Certbot lần đầu bị thất bại do bản ghi A của tên miền trên Cloudflare đang bật chế độ Proxy (đám mây màu cam), khiến Let's Encrypt không thể xác thực IP gốc của VPS.
  * *Cách khắc phục:* Truy cập vào Cloudflare tắt Proxy chuyển sang chế độ "DNS Only" (đám mây màu xám), đợi 1 phút và chạy lại lệnh của Certbot thành công hoàn toàn.
* **6. KẾ HOẠCH TIẾP THEO:**
  * Thử nghiệm lấy ý kiến phản hồi của học sinh và thầy cô (Thực nghiệm sư phạm) để lấy số liệu phân tích độ hiệu quả của đề tài.
