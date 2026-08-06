# HƯỚNG DẪN QUẢN LÝ NGÂN HÀNG CÂU HỎI (ITEM BANK MANAGER) — DỰ ÁN KHKT

> Phiên bản: 2.0 (Full Metadata Schema)  
> Cập nhật: 06/08/2026  
> Đối tượng sử dụng: Giáo viên môn Tiếng Anh, Nhóm nghiên cứu KHKT, Giám khảo  

---

## I. DANH SÁCH FILE THAY ĐỔI & FILE MỚI

### 1. File mới tạo (`NEW`)
- `backend/item_bank_api.py`: FastAPI Router cho Item Bank Manager (CRUD, Import/Export CSV/Excel, Quality Check, Statistics).
- `frontend/src/components/ItemBankManager.jsx`: Giao diện React quản trị ngân hàng câu hỏi (4 tab: Dashboard, Quản lý câu hỏi, Import/Export, Kiểm tra chất lượng).
- `huong_dan_quan_ly_ngan_hang_cau_hoi.md`: Tài liệu hướng dẫn chi tiết dành cho giáo viên và nhà nghiên cứu.

### 2. File đã chỉnh sửa (`MODIFY`)
- `backend/irt_item_bank.json`: Nâng cấp toàn bộ 20 câu hỏi lên Schema Metadata v2.0 đầy đủ.
- `backend/main.py`: Tích hợp `item_bank_router` vào hệ thống API; ràng buộc Adaptive Question Selector chỉ dùng câu hỏi từ Item Bank định chuẩn (không sinh AI tự phát).
- `backend/requirements.txt`: Bổ sung thư viện `openpyxl>=3.1.0` xử lý file Excel.
- `frontend/src/App.jsx`: Thêm điều hướng Tab "Ngân hàng câu hỏi (Item Bank)" trên Sidebar menu.
- `frontend/src/components/IRTTestEngine.jsx`: Cập nhật xử lý luồng khi hoàn thành toàn bộ câu hỏi trong Item Bank.

---

## II. CẤU TRÚC DATABASE / SCHEMA (SCHEMA v2.0)

Ngân hàng câu hỏi lưu trữ dưới dạng JSON flat-file tại `backend/irt_item_bank.json`. Mỗi câu hỏi có cấu trúc metadata chuẩn như sau:

| Trường metadata | Kiểu dữ liệu | Mô tả & Quy định KHKT |
| :--- | :--- | :--- |
| `item_id` | String | Mã câu hỏi định danh (Ví dụ: `IRT_Q_001`, tự động sinh) |
| `question` | String | Nội dung câu hỏi trắc nghiệm tiếng Anh |
| `option_a` | String | Đáp án A |
| `option_b` | String | Đáp án B |
| `option_c` | String | Đáp án C |
| `option_d` | String | Đáp án D |
| `correct_answer` | String | Đáp án đúng (`A`, `B`, `C`, hoặc `D`) |
| `explanation` | String | Giải thích chi tiết quy tắc ngữ pháp/từ vựng (bắt buộc) |
| `topic` | String | Chủ đề kiến thức (`Grammar`, `Vocabulary`, `Phonology`, `Reading`,...) |
| `skill` | String | Kỹ năng cụ thể (`Tenses`, `Passive Voice`, `Conditionals`, `Relative Clauses`,...) |
| `question_type` | String | Dạng câu hỏi (`Multiple Choice`, `Fill in the blank`,...) |
| `cognitive_level` | String | Cấp độ nhận thức Bloom (`Remember`, `Understand`, `Apply`, `Analyze`,...) |
| `difficulty_level` | String | Độ khó định tính (`Easy`, `Medium`, `Hard`) |
| `source` | String | Trích dẫn nguồn đề thi (Ví dụ: `Đề thi tốt nghiệp THPT 2023`) |
| `source_year` | String | Năm ban hành nguồn đề (Ví dụ: `2023`, `2024`) |
| `calibration_status` | Enum | Trạng thái hiệu chuẩn IRT (`CALIBRATED`, `PROVISIONAL`, `UNCALIBRATED`) |
| `discrimination` | Float / Null | Tham số độ phân biệt a (chỉ gán khi đã hiệu chuẩn thực nghiệm) |
| `difficulty_parameter` | Float / Null | Tham số độ khó b (chỉ gán khi đã hiệu chuẩn thực nghiệm) |
| `guessing_parameter` | Float / Null | Tham số đoán mò c (mặc định 0.25 cho 4 lựa chọn) |
| `sample_size` | Integer | Số lượng mẫu học sinh đã làm thực nghiệm |
| `status` | Enum | Trạng thái kiểm duyệt (`Draft`, `Reviewed`, `Approved`) |
| `reviewer` | String | Tên giáo viên / chuyên gia phụ trách kiểm duyệt |
| `created_at` | ISO Timestamp | Thời điểm tạo câu hỏi |
| `updated_at` | ISO Timestamp | Thời điểm cập nhật gần nhất |

> **Quy định hiệu chuẩn IRT:** Câu hỏi mới nhập luôn mặc định có `calibration_status = UNCALIBRATED` và các tham số IRT (`a`, `b`, `c`) để trống. Tuyệt đối không tự ý gán tham số IRT "chuẩn xác" khi chưa có dữ liệu phản hồi thực nghiệm từ học sinh.

---

## III. HƯỚNG DẪN THÊM CÂU HỎI MỚI TRỰC TIẾP TRÊN GIAO DIỆN

1. Trên Menu chính phía bên trái, nhấp chọn **"Ngân hàng câu hỏi (Item Bank)"**.
2. Nhấp nút **"+ Thêm câu hỏi"** ở góc trên bên phải.
3. Điền đầy đủ các thông tin trong biểu mẫu:
   - **Nội dung câu hỏi** & **4 lựa chọn A, B, C, D**.
   - Select chọn **Đáp án đúng** (A, B, C hoặc D).
   - Điền **Giải thích (Explanation)** rõ ràng để học sinh đọc hiểu sau khi làm bài.
   - Chọn **Kỹ năng (Skill)**, **Chủ đề (Topic)**, **Cấp độ nhận thức (Cognitive Level)**, và **Độ khó (Difficulty Level)**.
   - Điền **Nguồn tài liệu (Source)** và **Năm ban hành (Source Year)**.
4. Nhấn **"Tạo câu hỏi"**. Hệ thống sẽ tự động gán mã `IRT_Q_XXX`, trạng thái `Draft` và `UNCALIBRATED`.

---

## IV. HƯỚNG DẪN IMPORT CÂU HỎI HÀNG LOẠT TỪ EXCEL / CSV

Để giáo viên dễ dàng nhập hàng chục hoặc hàng trăm câu hỏi từ file sẵn có:

1. Chuyển sang Tab **"Import / Export"**.
2. Nhấn nút **"Tải file Template CSV mẫu"** để tải file chuẩn về máy.
3. Mở file bằng **Microsoft Excel** hoặc **Google Sheets**.
4. Nhập dữ liệu theo các cột tương ứng.
   - *Cột bắt buộc:* `question`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `skill`, `topic`.
   - *Cột `correct_answer`:* Phải là một trong 4 chữ cái `A`, `B`, `C`, hoặc `D`.
5. Lưu file ở định dạng **.xlsx** hoặc **.csv (UTF-8)**.
6. Kéo thả file hoặc nhấp vào vùng upload trong tab **Import / Export** để tải lên.
7. Hệ thống tự động kiểm tra tính hợp lệ:
   - Nếu có dòng thiếu thông tin hoặc sai định dạng đáp án, hệ thống sẽ **báo lỗi chính xác số dòng và tên lỗi** để sửa lại.
   - Nếu hợp lệ, toàn bộ câu hỏi sẽ được thêm vào hệ thống với mã định danh tự động.

---

## V. QUY TRÌNH GIÁO VIÊN KIỂM DUYỆT CÂU HỎI (WORKFLOW)

Quy trình kiểm duyệt câu hỏi tuân thủ 3 bước nghiêm ngặt phục vụ nghiên cứu KHKT:

```
[Draft]  ──(Giáo viên rà soát nội dung & ngữ pháp)──>  [Reviewed]  ──(Hội đồng chuyên môn duyệt)──>  [Approved]
```

1. **Bước 1: Kiểm tra chất lượng tự động**
   - Giáo viên chuyển sang Tab **"Kiểm tra chất lượng"**.
   - Hệ thống tự động quét và liệt kê danh sách các câu hỏi bị lỗi: thiếu giải thích, thiếu nguồn, chưa chọn kỹ năng, câu chưa duyệt (Draft), hoặc câu bị trùng lặp nội dung.
   - Nhấn nút **"Sửa"** bên cạnh từng câu lỗi để cập nhật ngay.

2. **Bước 2: Xem trước và duyệt câu hỏi (Preview & Review)**
   - Tại Tab **"Quản lý câu hỏi"**, nhấn biểu tượng 👁️ (Xem trước) để xem câu hỏi dưới góc nhìn của học sinh.
   - Kiểm tra xem đáp án đúng, gợi ý ngữ pháp và nguồn trích dẫn đã chính xác chưa.
   - Chọn trạng thái:
     - `Draft`: Câu hỏi mới tạo hoặc cần chỉnh sửa thêm.
     - `Reviewed`: Giáo viên môn đã rà soát nội dung ngữ pháp.
     - `Approved`: Đã thông qua hội đồng kiểm duyệt KHKT.

3. **Bước 3: Duyệt hàng loạt (Bulk Approval)**
   - Tích chọn các câu hỏi đã rà soát đạt chuẩn.
   - Nhấn nút **"→ Reviewed"** hoặc **"→ Approved"** trên thanh thao tác hàng loạt.

---

## VI. XUẤT DỮ LIỆU PHỤC VỤ NGHIÊN CỨU & BÁO CÁO KHKT

1. Vào Tab **"Import / Export"**.
2. Chọn **"Export Excel (.xlsx)"** hoặc **"Export CSV (UTF-8)"**.
3. File Excel xuất ra tự động định dạng màu sắc trực quan:
   - **Xanh lá (Approved):** Các câu hỏi đã duyệt sẵn sàng cho thực nghiệm.
   - **Vàng (Reviewed):** Các câu đã rà soát ban đầu.
   - **Hồng (Draft):** Các câu mới nháp.
4. Giáo viên có thể đính kèm file Excel này vào **Hồ sơ minh chứng đề tài KHKT** để chứng minh ngân hàng câu hỏi đã được chuẩn hóa và kiểm duyệt minh bạch.
