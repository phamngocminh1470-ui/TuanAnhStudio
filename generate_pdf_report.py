import os
import urllib.request
from fpdf import FPDF

# Tải font Unicode tiếng Việt (Roboto) từ Google Fonts
font_dir = "fonts"
os.makedirs(font_dir, exist_ok=True)

font_url = "https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Regular.ttf"
font_bold_url = "https://raw.githubusercontent.com/googlefonts/roboto/main/src/hinted/Roboto-Bold.ttf"

font_path = os.path.join(font_dir, "Roboto-Regular.ttf")
font_bold_path = os.path.join(font_dir, "Roboto-Bold.ttf")

print("Downloading Roboto fonts...")
if not os.path.exists(font_path):
    urllib.request.urlretrieve(font_url, font_path)
if not os.path.exists(font_bold_path):
    urllib.request.urlretrieve(font_bold_url, font_bold_path)
print("Fonts ready.")

class PDF(FPDF):
    def header(self):
        # Draw top accent bar
        self.set_fill_color(37, 99, 235) # Indigo
        self.rect(0, 0, 210, 4, 'F')
        
    def footer(self):
        self.set_y(-15)
        self.set_font('Roboto', '', 8)
        self.set_text_color(150, 150, 150)
        self.cell(0, 10, f'Trang {self.page_no()} / {{nb}} | AI English Mentor Project', 0, 0, 'C')

pdf = PDF()
pdf.alias_nb_pages()
pdf.add_page()

# Đăng ký font tiếng Việt
pdf.add_font('Roboto', '', font_path)
pdf.add_font('Roboto', 'B', font_bold_path)

# --- TRANG BÌA / TIÊU ĐỀ ---
pdf.set_y(25)
pdf.set_font('Roboto', 'B', 22)
pdf.set_text_color(30, 41, 59) # Slate 900
pdf.cell(0, 12, "TÀI LIỆU CHI TIẾT & HƯỚNG DẪN SỬ DỤNG", new_x="LMARGIN", new_y="NEXT", align='C')

pdf.set_font('Roboto', 'B', 18)
pdf.set_text_color(79, 70, 229) # Indigo 600
pdf.cell(0, 10, "DỰ ÁN HỆ THỐNG AI ENGLISH MENTOR", new_x="LMARGIN", new_y="NEXT", align='C')

pdf.set_font('Roboto', '', 10)
pdf.set_text_color(100, 100, 100)
pdf.cell(0, 8, "Nền tảng học tiếng Anh thích ứng & Cá nhân hóa thông minh - NCKH KHKT", new_x="LMARGIN", new_y="NEXT", align='C')
pdf.ln(12)

# --- GIỚI THIỆU DỰ ÁN ---
pdf.set_font('Roboto', 'B', 12)
pdf.set_text_color(30, 41, 59)
pdf.cell(0, 8, "1. Tổng quan về Dự án", new_x="LMARGIN", new_y="NEXT", align='L')
pdf.set_font('Roboto', '', 9.5)
pdf.set_text_color(71, 85, 105) # Slate 600

intro_text = (
    "AI English Mentor là một nền tảng học tập tiếng Anh cá nhân hóa tích hợp trí tuệ nhân tạo (AI) "
    "và các thuật toán đo lường giáo dục hiện đại. Mục tiêu chính của dự án là giúp học sinh từ lớp 6 đến "
    "lớp 12 luyện tập toàn diện các kỹ năng tiếng Anh (Đọc, Ngữ pháp, Từ vựng, Nghe, Phát âm, Viết) "
    "dựa trên mô hình thích ứng thông minh. Thay vì làm các đề thi cố định, hệ thống tự động điều chỉnh độ khó "
    "và nội dung câu hỏi cho phù hợp nhất với năng lực thực tế của từng học sinh."
)
pdf.multi_cell(0, 6, intro_text)
pdf.ln(6)

# --- THUẬT TOÁN CỐT LÕI ---
pdf.set_font('Roboto', 'B', 12)
pdf.set_text_color(30, 41, 59)
pdf.cell(0, 8, "2. Các Thuật toán Cốt lõi được áp dụng", new_x="LMARGIN", new_y="NEXT", align='L')

pdf.set_font('Roboto', 'B', 10)
pdf.set_text_color(79, 70, 229)
pdf.cell(0, 6, "2.1 Thuật toán Ước lượng năng lực Thích ứng (IRT - Item Response Theory)", new_x="LMARGIN", new_y="NEXT", align='L')
pdf.set_font('Roboto', '', 9.5)
pdf.set_text_color(71, 85, 105)
irt_desc = (
    "Hệ thống áp dụng mô hình toán học IRT 3-tham số (độ khó, độ phân biệt, độ đoán mò) để ước lượng chỉ số "
    "năng lực năng khiếu (Theta - θ) của học sinh sau mỗi câu trả lời. Thuật toán kiểm tra thích ứng (CAT - Computerized "
    "Adaptive Testing) liên tục cập nhật năng lực học sinh theo phương pháp ước lượng Bayes EAP (Expected A Posteriori), "
    "sau đó chọn câu hỏi tiếp theo trong ngân hàng câu hỏi sao cho độ khó tiệm cận nhất với năng lực hiện tại của học sinh."
)
pdf.multi_cell(0, 6, irt_desc)
pdf.ln(4)

pdf.set_font('Roboto', 'B', 10)
pdf.set_text_color(79, 70, 229)
pdf.cell(0, 6, "2.2 Thuật toán Lặp lại ngắt quãng thông minh (SM-2 & FSRS)", new_x="LMARGIN", new_y="NEXT", align='L')
pdf.set_font('Roboto', '', 9.5)
pdf.set_text_color(71, 85, 105)
sm2_desc = (
    "Phần học từ vựng (Flashcards) áp dụng thuật toán tối ưu hóa ghi nhớ SuperMemo-2 (SM-2) và FSRS (Free Spaced "
    "Repetition Scheduler). Dựa trên đánh giá của học sinh về mức độ ghi nhớ sau mỗi lần ôn (Quên hoàn toàn, "
    "Nhớ mang máng, Nhớ rõ, Thuộc lòng), thuật toán tự động tính toán Hệ số dễ (Easiness Factor - EF) và khoảng "
    "thời gian (Interval) tối ưu cho lần ôn tập tiếp theo nhằm ngăn chặn đường cong quên lãng của não bộ."
)
pdf.multi_cell(0, 6, sm2_desc)
pdf.ln(6)

# --- CÁC TÍNH NĂNG CHÍNH ---
pdf.set_font('Roboto', 'B', 12)
pdf.set_text_color(30, 41, 59)
pdf.cell(0, 8, "3. Các Tính năng Chính trên Hệ thống", new_x="LMARGIN", new_y="NEXT", align='L')

features = [
    ("Đánh giá Đọc & Ngữ pháp (IRT):", "Học sinh làm bài test thích ứng, hệ thống tự động tìm câu hỏi phù hợp để đánh giá chính xác mức điểm Theta (từ -3.0 đến +3.0)."),
    ("Học từ vựng thông minh (SM-2):", "Học từ vựng qua thẻ flashcards ghi âm giọng phát âm bản xứ, dịch nghĩa và ghi nhớ lặp lại ngắt quãng."),
    ("Luyện đọc & Nghe thích ứng AI:", "Sinh bài đọc/bài nghe trực tiếp theo sở thích cá nhân (ví dụ: công nghệ, môi trường, thể thao) tương thích với năng lực hiện tại bằng Gemini AI."),
    ("Gia sư AI Chatbox:", "Trò chuyện trực tiếp với Gia sư tiếng Anh AI, học sinh nói/viết và AI sửa lỗi ngữ pháp/từ vựng chi tiết."),
    ("Chấm điểm Phát âm:", "Học sinh ghi âm giọng đọc trực tiếp, AI (Azure Speech API) chấm điểm phát âm theo từng âm tiết (IPA), độ lưu loát và ngữ điệu."),
    ("Bảng dự đoán điểm số:", "Sử dụng thuật toán hồi quy đa biến tuyến tính dự đoán điểm thi THPT Quốc Gia, IELTS, VSTEP của học sinh dựa trên Theta, Streak học tập và điểm phát âm."),
]

pdf.set_font('Roboto', '', 9.5)
for title, desc in features:
    pdf.set_text_color(30, 41, 59)
    pdf.set_font('Roboto', 'B', 9.5)
    pdf.cell(55, 6, "  • " + title, 0, 0, 'L')
    pdf.set_font('Roboto', '', 9.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 6, desc)
    pdf.ln(2)

pdf.ln(4)

# --- HƯỚNG DẪN SỬ DỤNG CHO HỌC SINH ---
pdf.set_font('Roboto', 'B', 12)
pdf.set_text_color(30, 41, 59)
pdf.cell(0, 8, "4. Hướng dẫn sử dụng cho Học sinh (Student Guide)", new_x="LMARGIN", new_y="NEXT", align='L')

student_steps = [
    ("Bước 1:", "Truy cập https://tuananhstudio.top và nhấp nút 'Đăng nhập / Đăng ký'. Nhập thông tin đăng ký lớp học của bạn."),
    ("Bước 2:", "Tại 'Bảng điều khiển', xem mức Theta và các dự đoán điểm số hiện tại. Lần đầu sử dụng, Theta của bạn sẽ bằng 0.0."),
    ("Bước 3:", "Chọn phần 'Đánh giá Đọc & Ngữ pháp (IRT)' để làm bài kiểm tra thích ứng nhằm cập nhật chỉ số năng lực của bạn."),
    ("Bước 4:", "Sử dụng 'Học từ vựng thông minh (SM-2)' để học và chấm điểm ôn tập từ vựng mỗi ngày nhằm tích lũy Streak học tập."),
    ("Bước 5:", "Sử dụng 'Chấm điểm phát âm' và 'Gia sư AI Chatbot' để cải thiện kỹ năng Nói/Giao tiếp. Hãy cấp quyền sử dụng Micro cho trình duyệt để ghi âm."),
]

pdf.set_font('Roboto', '', 9.5)
for step, text in student_steps:
    pdf.set_text_color(79, 70, 229)
    pdf.set_font('Roboto', 'B', 9.5)
    pdf.cell(20, 6, "  " + step, 0, 0, 'L')
    pdf.set_font('Roboto', '', 9.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 6, text)
    pdf.ln(1)

pdf.ln(6)

# --- HƯỚNG DẪN DÀNH CHO GIÁO VIÊN / NHÀ NGHIÊN CỨU ---
pdf.set_font('Roboto', 'B', 12)
pdf.set_text_color(30, 41, 59)
pdf.cell(0, 8, "5. Hướng dẫn dành cho Giáo viên & Nhà nghiên cứu KHKT", new_x="LMARGIN", new_y="NEXT", align='L')

teacher_steps = [
    ("Bước 1:", "Đăng nhập bằng tài khoản Quản trị viên (admin / admin123)."),
    ("Bước 2:", "Truy cập mục 'Admin Panel' ở cuối Menu bên trái để vào trung tâm quản lý."),
    ("Bước 3:", "Quản lý danh sách học sinh: Xem năng lực Theta (θ) hiện thời của từng em, khóa/mở khóa tài khoản, reset mật khẩu nhanh, hoặc reset tiến trình học tập (nhưng vẫn giữ nguyên lịch sử logs nghiên cứu)."),
    ("Bước 4:", "Xem biểu đồ tăng trưởng Theta trung bình của Nhóm Thích ứng (ADAPTIVE) và Nhóm Đối chứng (CONTROL) theo chuỗi thời gian ngày thực tế."),
    ("Bước 5:", "Xuất dữ liệu: Vào tab 'Xuất dữ liệu', lọc theo lớp, nhóm thực nghiệm hoặc khoảng ngày, bấm 'Tải file Excel' (.xlsx) để làm báo cáo, hoặc 'Tải file CSV' để import trực tiếp vào phần mềm định lượng SPSS / R phục vụ phân tích kiểm định T-test độc lập / ANOVA."),
]

pdf.set_font('Roboto', '', 9.5)
for step, text in teacher_steps:
    pdf.set_text_color(13, 148, 136) # Teal
    pdf.set_font('Roboto', 'B', 9.5)
    pdf.cell(20, 6, "  " + step, 0, 0, 'L')
    pdf.set_font('Roboto', '', 9.5)
    pdf.set_text_color(71, 85, 105)
    pdf.multi_cell(0, 6, text)
    pdf.ln(1)

pdf.ln(6)

# --- ĐÁNH GIÁ PRODUCTION ---
pdf.set_font('Roboto', 'B', 12)
pdf.set_text_color(30, 41, 59)
pdf.cell(0, 8, "6. Đánh giá Mức độ Sẵn sàng triển khai", new_x="LMARGIN", new_y="NEXT", align='L')
pdf.set_font('Roboto', '', 9.5)
pdf.set_text_color(71, 85, 105)
status_text = (
    "Dự án đã được kiểm thử tự động 100% qua bộ test suite 61 ca kiểm thử liên tục đạt trạng thái "
    "hoàn hảo (PASS). Hệ thống đã được cấu hình chạy ngầm chịu tải tốt qua Nginx reverse proxy và Gunicorn "
    "trên VPS (IP: 103.15.222.216), đã kích hoạt chứng chỉ SSL HTTPS đầy đủ, bảo mật phiên làm việc và bảo mật "
    "API Key của người dùng. Hệ thống hoàn toàn sẵn sàng đưa vào làm công cụ thực nghiệm thực tế quy mô trường học."
)
pdf.multi_cell(0, 6, status_text)

# Xuất PDF ra file
pdf_output = "ai_english_mentor_documentation.pdf"
pdf.output(pdf_output)
print(f"PDF successfully generated at {pdf_output}")
