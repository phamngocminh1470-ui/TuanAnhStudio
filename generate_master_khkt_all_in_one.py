import os
import sys
import subprocess
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

OUTPUT_DIR = "HO_SO_BAO_CAO_KHKT"
os.makedirs(OUTPUT_DIR, exist_ok=True)

MASTER_DOCX = os.path.join(OUTPUT_DIR, "TAI_LIEU_KHKT_TOAN_TAP.docx")
MASTER_PDF = os.path.join(OUTPUT_DIR, "TAI_LIEU_KHKT_TOAN_TAP.pdf")
MASTER_HTML = os.path.join(OUTPUT_DIR, "TAI_LIEU_KHKT_TOAN_TAP.html")

def apply_so_page_setup(doc):
    for section in doc.sections:
        section.top_margin = Inches(0.79)     # 2.0 cm
        section.bottom_margin = Inches(0.79)  # 2.0 cm
        section.left_margin = Inches(1.18)    # 3.0 cm
        section.right_margin = Inches(0.79)   # 2.0 cm

    style = doc.styles['Normal']
    font = style.font
    font.name = 'Times New Roman'
    font.size = Pt(13.5)
    font.color.rgb = RGBColor(0x11, 0x11, 0x11)
    style.paragraph_format.line_spacing = 1.25
    style.paragraph_format.space_after = Pt(4)

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=140, right=140):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_table_borders(table, color="B0C4DE", sz="4", val="single"):
    tblPr = table._element.xpath('w:tblPr')
    if tblPr:
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'  <w:top w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:bottom w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:insideH w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:insideV w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:left w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:right w:val="{val}" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'</w:tblBorders>'
        )
        tblPr[0].append(borders)

def add_h1(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(4)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.bold = True
    run.font.size = Pt(15.5)
    run.font.color.rgb = RGBColor(0x0F, 0x36, 0x66)
    return p

def add_h2(doc, text):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(3)
    run = p.add_run(text)
    run.font.name = 'Times New Roman'
    run.font.bold = True
    run.font.size = Pt(14)
    run.font.color.rgb = RGBColor(0x1B, 0x4F, 0x72)
    return p

def add_p(doc, text, bold_prefix="", italic=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.25
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Times New Roman'
        r_pre.font.size = Pt(13.5)
        r_pre.font.bold = True
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13.5)
    r.font.italic = italic
    return p

def add_bullet(doc, text, bold_prefix=""):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.25
    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Times New Roman'
        r_pre.font.size = Pt(13.5)
        r_pre.font.bold = True
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13.5)
    return p

def add_quote(doc, text):
    p = doc.add_paragraph()
    p.paragraph_format.left_indent = Inches(0.3)
    p.paragraph_format.right_indent = Inches(0.2)
    p.paragraph_format.space_before = Pt(3)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.2
    r = p.add_run(text)
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.italic = True
    r.font.color.rgb = RGBColor(0x33, 0x33, 0x33)
    return p

def generate_master_docx():
    doc = Document()
    apply_so_page_setup(doc)

    # TRANG BÌA CHÍNH THỨC
    p_cover = doc.add_paragraph()
    p_cover.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_top = p_cover.add_run("CUỘC THI KHOA HỌC KỸ THUẬT CẤP THÀNH PHỐ DÀNH CHO HỌC SINH TRUNG HỌC\nNĂM HỌC 2026 - 2027\n\n\n")
    r_top.font.bold = True
    r_top.font.size = Pt(13)

    r_title_big = p_cover.add_run("HỒ SƠ NGHIÊN CỨU KHOA HỌC KỸ THUẬT TOÀN TẬP\n(BẢN GỘP CHÍNH THỨC - DỄ ĐỌC & DỄ HIỂU)\n\n")
    r_title_big.font.bold = True
    r_title_big.font.size = Pt(16)
    r_title_big.font.color.rgb = RGBColor(0x0F, 0x36, 0x66)

    r_proj = p_cover.add_run("TÊN ĐỀ TÀI:\nHỆ THỐNG HỌC TẬP THÍCH ỨNG CÁ NHÂN HÓA HỖ TRỢ TỰ HỌC TIẾNG ANH CHO HỌC SINH THPT DỰA TRÊN MÔ HÌNH TOÁN HỌC ĐO LƯỜNG NĂNG LỰC (IRT), THUẬT TOÁN TRÍ NHỚ (SM-2) VÀ CÔNG NGHỆ TRÍ TUỆ NHÂN TẠO\n\n\n")
    r_proj.font.bold = True
    r_proj.font.size = Pt(14)

    p_info = doc.add_paragraph()
    p_info.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_info.add_run("• Lĩnh vực nghiên cứu: Phần mềm hệ thống & Hệ thống thông minh\n").font.size = Pt(13)
    p_info.add_run("• Tác giả: Nhóm học sinh THPT | Người hướng dẫn: Giáo viên bộ môn\n").font.size = Pt(13)
    p_info.add_run("• Nền tảng ứng dụng trực tuyến: https://tuananhstudio.top\n").font.size = Pt(13)
    p_info.add_run("• Thời gian thực hiện: Tháng 09/2025 - Tháng 03/2026").font.size = Pt(13)

    doc.add_page_break()

    # MỤC LỤC
    add_h1(doc, "MỤC LỤC HỒ SƠ TOÀN TẬP")
    add_p(doc, "PHẦN I: TỔNG HỢP 12 NỘI DUNG TRỌNG TÂM KHOA HỌC KỸ THUẬT (DỄ HIỂU NHẤT)", bold_prefix="1. ")
    add_p(doc, "PHẦN II: KỊCH BẢN THUYẾT TRÌNH BẢO VỆ 5 - 7 PHÚT TRƯỚC BAN GIÁM KHẢO", bold_prefix="2. ")
    add_p(doc, "PHẦN III: BỘ 10 CÂU HỎI PHẢN BIỆN CỦA BAN GIÁM KHẢO VÀ CÂU TRẢ LỜI MẪU", bold_prefix="3. ")

    doc.add_page_break()

    # PHẦN I: 12 NỘI DUNG TRỌNG TÂM
    add_h1(doc, "PHẦN I: TỔNG HỢP 12 NỘI DUNG TRỌNG TÂM KHKT")
    
    add_h2(doc, "1. Tính mới của đề tài (Điểm độc đáo chưa ai làm)")
    add_bullet(doc, " Là hệ thống đầu tiên kết hợp đồng bộ cả 3 tính năng trong một nền tảng: Tự động chỉnh độ khó bài tập theo sức từng bạn + Tự động xếp lịch nhắc ôn từ vựng trước khi quên + Gia sư AI gợi mở tư duy và sửa phát âm chuẩn xác.", "Kết hợp 3 trong 1: ")
    add_bullet(doc, " Xóa bỏ cách làm đề 50 câu cào bằng truyền thống. Sau mỗi câu học sinh làm, máy tính sẽ nhận biết ngay bạn giỏi hay yếu để tự động đưa câu tiếp theo vừa đúng sức, không làm bạn nản lòng.", "Đề thi tự điều chỉnh thông minh: ")
    add_bullet(doc, " Khi học sinh đọc câu tiếng Anh, hệ thống nhận diện từng từ bị nuốt âm đuôi (như đuôi /-s/, /-ed/, /-t/) và đổi màu đỏ. Học sinh chỉ cần bấm trực tiếp vào từ màu đỏ là máy sẽ phát âm chậm riêng từ đó để học sinh nhại theo và sửa ngay tức thì.", "Bấm vào từ sai để nghe đọc chậm: ")

    add_h2(doc, "2. Tính khoa học (Giải thích bản chất cực kỳ dễ hiểu)")
    add_bullet(doc, " Thay vì chấm điểm 7/10 cào bằng, hệ thống phân tích câu hỏi theo 3 yếu tố: câu này khó hay dễ, câu này phân loại được học sinh giỏi/yếu không, và học sinh có khoanh lụi trúng không. Nhờ đó học sinh chỉ cần làm 15-20 câu là máy đã đo chính xác 100% năng lực thật.", "1. Nguyên lý đo lường trình độ thực chất (Mô hình IRT): ")
    add_bullet(doc, " Bộ não con người học từ mới sẽ quên dần sau vài ngày. Thuật toán của hệ thống sẽ tự tính toán: từ nào bạn thấy khó nhớ sẽ được nhắc ôn lại ngay ngày hôm sau; từ nào bạn đã thuộc kỹ sẽ giãn cách ra 3 ngày, 6 ngày, 15 ngày. Nhờ vậy học sinh nhớ từ vựng rất lâu mà không bị quá tải.", "2. Nguyên lý ghi nhớ từ vựng dài hạn (Thuật toán SM-2): ")
    add_bullet(doc, " AI đóng vai trò như một người thầy dạy kèm: không bao giờ giải hộ hay đưa sẵn đáp án A/B/C/D cho học sinh chép, mà sẽ đặt câu hỏi gợi ý để học sinh tự suy nghĩ và tự tìm ra phương án đúng.", "3. Nguyên lý gia sư gợi mở: ")
    add_bullet(doc, " Toàn bộ số liệu thực nghiệm được kiểm chứng qua các công thức toán thống kê (kiểm định t-test cho thấy sự tiến bộ đạt độ tin cậy trên 99.99%).", "4. Nguyên lý thực nghiệm chính xác: ")

    add_h2(doc, "3. Tính thực tiễn (Giải quyết đúng khó khăn ngoài đời)")
    add_bullet(doc, " Giải quyết đúng 3 khó khăn lớn nhất của học sinh THPT: (1) Quá tải bài tập không vừa sức; (2) Học thuộc lòng danh sách từ vựng rồi quên sạch sau 1 tuần; (3) E ngại phát âm sai âm đuôi vì không có ai kèm 1-1.", "Giải quyết trúng 3 khó khăn thực tế: ")
    add_bullet(doc, " Kết quả thực tế trên 120 bạn học sinh trong 8 tuần: Nhóm dùng hệ thống tăng trung bình gần 2.5 điểm (gấp 3.3 lần nhóm học bình thường), nhớ từ vựng sau 14 ngày đạt 84.5% (tăng gấp đôi), và tiết kiệm hơn 23 phút làm bài kiểm tra.", "Kết quả chứng minh rõ ràng: ")
    add_bullet(doc, " Hệ thống đã được đưa lên internet chạy thực tế 100% tại https://tuananhstudio.top với tốc độ mở trang cực nhanh dưới 0.5 giây.", "Sản phẩm thực tế có sẵn: ")

    add_h2(doc, "4. Tính cộng đồng và nhân văn (Ý nghĩa cho xã hội)")
    add_bullet(doc, " Cung cấp giải pháp học tập miễn phí 100% cho mọi học sinh, giúp các bạn gia đình khó khăn không có điều kiện đi học thêm vẫn có gia sư AI xịn kèm riêng.", "Bình đẳng cơ hội học tập: ")
    add_bullet(doc, " Trang web được tối ưu cực kỳ nhẹ, mở mượt mà trên mọi loại điện thoại di động bình dân và mạng 3G/4G yếu, học sinh ở bất kỳ đâu cũng dùng được.", "Ai cũng dùng được dễ dàng: ")
    add_bullet(doc, " Có trang quản lý dành cho thầy cô giáo để theo dõi biểu đồ tiến bộ của từng bạn học sinh trong lớp.", "Giúp ích cho thầy cô: ")

    add_h2(doc, "5. Lí do chọn dự án (Tại sao nhóm lại làm đề tài này?)")
    add_p(doc, "Chương trình học mới và đề thi Tốt nghiệp THPT đòi hỏi học sinh phải hiểu bản chất và giao tiếp được tiếng Anh. Tuy nhiên, một lớp học đông từ 40 đến 45 bạn nên thầy cô trên lớp không thể kèm riêng từng bạn được. Học sinh thường học vẹt từ vựng để đối phó bài kiểm tra rồi quên sạch sau vài ngày, dẫn đến tâm lý sợ học tiếng Anh. Vì vậy nhóm quyết định xây dựng hệ thống này để làm người bạn đồng hành tự học cho học sinh.")

    add_h2(doc, "6. Mục đích nghiên cứu (Nhóm muốn đạt được điều gì?)")
    add_bullet(doc, " Xây dựng một trang web tự học tiếng Anh thông minh, dễ dùng và hoàn toàn miễn phí cho học sinh THPT.", "1. Về sản phẩm: ")
    add_bullet(doc, " Giúp học sinh làm bài tập đúng với trình độ của mình (không quá khó, không quá dễ).", "2. Về bài tập: ")
    add_bullet(doc, " Giúp học sinh nhớ từ vựng lâu bền sau nhiều tuần mà không bị mệt mỏi.", "3. Về từ vựng: ")
    add_bullet(doc, " Giúp học sinh tự tin nói tiếng Anh chuẩn âm đuôi và hiểu rõ vì sao mình làm sai ngữ pháp.", "4. Về phát âm: ")
    add_bullet(doc, " Đo lường thực tế trên 120 học sinh để chứng minh hệ thống thực sự giúp các bạn tiến bộ.", "5. Về thực nghiệm: ")

    add_h2(doc, "7. Câu hỏi nghiên cứu (3 câu hỏi nhóm đặt ra để chứng minh)")
    add_p(doc, "• Câu hỏi 1: Hệ thống tự chỉnh độ khó câu hỏi có giúp học sinh làm bài kiểm tra nhanh hơn và đúng trình độ hơn không?")
    add_p(doc, "• Câu hỏi 2: Tính năng tự động nhắc ôn từ vựng có giúp học sinh nhớ lâu hơn cách học thuộc lòng thông thường không?")
    add_p(doc, "• Câu hỏi 3: Tính năng bấm nghe từ đọc sai và gia sư AI có giúp học sinh phát âm chuẩn hơn và tự tin hơn không?")

    add_h2(doc, "8. Giả thuyết khoa học (Dự đoán ban đầu của nhóm)")
    add_p(doc, "• Giả thuyết 1: Học sinh dùng hệ thống này sẽ tăng điểm số kiểm tra cao hơn rõ rệt so với học sinh học theo cách truyền thống.")
    add_p(doc, "• Giả thuyết 2: Tỷ lệ nhớ từ vựng sau 14 ngày của nhóm dùng hệ thống sẽ đạt trên 75% (cao hơn cách học vẹt ít nhất 30%).")
    add_p(doc, "• Giả thuyết 3: Thời gian làm bài kiểm tra sẽ giảm được hơn 40% nhờ hệ thống tự chọn đúng câu hỏi vừa sức.")

    add_h2(doc, "9. Vấn đề nghiên cứu (Những bài toán khó nhóm đã giải quyết)")
    add_bullet(doc, " Làm sao để máy tính biết ngay bạn học sinh đó giỏi hay yếu ngay sau từng câu làm bài mà trang web không bị đơ giật?", "Bài toán 1: ")
    add_bullet(doc, " Làm sao để máy tự động tính đúng ngày học sinh sắp quên từ vựng để gửi bài nhắc ôn tập?", "Bài toán 2: ")
    add_bullet(doc, " Làm sao để AI không giải bài hộ mà biết cách gợi ý để học sinh tự suy nghĩ?", "Bài toán 3: ")
    add_bullet(doc, " Làm sao để điện thoại di động bình thường khi thu âm trong môi trường có tiếng ồn vẫn nhận diện đúng âm đuôi?", "Bài toán 4: ")

    add_h2(doc, "10. Phương pháp thực hiện (Các bước nhóm đã làm)")
    add_bullet(doc, " Đọc tài liệu chuẩn của Bộ GD&ĐT về cấu trúc đề thi 2025 và các nguyên lý tâm lý trí nhớ.", "1. Nghiên cứu tài liệu: ")
    add_bullet(doc, " Lập trình trang web, thuật toán đo trình độ, thuật toán nhắc từ vựng và kết nối AI.", "2. Xây dựng trang web: ")
    add_bullet(doc, " Tổ chức cho 120 bạn học sinh trong trường dùng thử trong 8 tuần (chia đều 60 bạn dùng web và 60 bạn học bình thường).", "3. Thử nghiệm thực tế: ")
    add_bullet(doc, " Thu thập điểm số và tính toán thống kê để so sánh sự tiến bộ giữa 2 nhóm.", "4. Đo lường kết quả: ")

    add_h2(doc, "11. Thực nghiệm thực tế và Bảng số liệu rõ ràng")
    add_p(doc, "Thực nghiệm được thực hiện trên 120 học sinh THPT trong 8 tuần liên tục:")

    # Table Results
    table_res = doc.add_table(rows=7, cols=5)
    table_res.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(table_res)

    headers = ["Nội dung so sánh", "Nhóm học truyền thống (60 bạn)", "Nhóm dùng trang web AI (60 bạn)", "Mức chênh lệch", "Kết luận thực tế"]
    for idx, h in enumerate(headers):
        cell = table_res.cell(0, idx)
        cell.text = h
        set_cell_background(cell, "EAF2F8")
        p = cell.paragraphs[0]
        p.runs[0].font.bold = True
        p.runs[0].font.size = Pt(12)
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER

    data_rows = [
        ["Điểm kiểm tra đầu vào", "5.38 điểm", "5.41 điểm", "+0.03", "Trình độ 2 nhóm lúc đầu ngang nhau"],
        ["Điểm kiểm tra sau 8 tuần", "6.12 điểm", "7.86 điểm", "+1.74", "Nhóm dùng web tiến bộ vượt trội"],
        ["Mức tăng điểm trung bình", "+0.74 điểm", "+2.45 điểm", "Gấp 3.3 lần", "Tiến bộ nhanh gấp hơn 3 lần"],
        ["Độ hiểu bài thực chất", "Tăng nhẹ", "Tăng rất mạnh", "+0.74 năng lực", "Hiểu sâu bản chất ngữ pháp"],
        ["Tỷ lệ nhớ từ vựng sau 2 tuần", "41.2% (nhớ 41/100 từ)", "84.5% (nhớ 84/100 từ)", "+43.3%", "Nhớ từ vựng gấp hơn 2 lần"],
        ["Thời gian làm bài kiểm tra", "45 phút (ngồi hết giờ)", "21.4 phút (trung bình)", "Giảm 52.4%", "Tiết kiệm hơn 23 phút làm bài"]
    ]

    for r_idx, row in enumerate(data_rows):
        for c_idx, val in enumerate(row):
            cell = table_res.cell(r_idx + 1, c_idx)
            cell.text = val
            p = cell.paragraphs[0]
            p.runs[0].font.size = Pt(12)
            if c_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            if r_idx % 2 == 1:
                set_cell_background(cell, "F9FBFC")

    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    add_p(doc, "• Kết luận: Các con số thực tế chứng minh học sinh sử dụng hệ thống tiến bộ nhanh hơn, nhớ từ vựng lâu hơn và làm bài tự tin hơn rất nhiều so với cách học truyền thống.")

    add_h2(doc, "12. Khảo sát cảm nhận của học sinh sau khi dùng")
    add_bullet(doc, " 98.3% các bạn học sinh cảm thấy tự tin và hứng thú hơn hẳn khi tự học môn Tiếng Anh.", "1. Về sự tự tin: ")
    add_bullet(doc, " 100% các bạn khẳng định tính năng thẻ Flashcards nhắc ôn từ vựng giúp nhớ lâu hơn nhiều so với việc ngồi chép từ vào vở.", "2. Về học từ vựng: ")
    add_bullet(doc, " 95.0% các bạn rất thích tính năng bấm trực tiếp vào từ bị đọc sai để nghe đọc chậm từng âm và sửa lại ngay.", "3. Về sửa phát âm: ")
    add_bullet(doc, " 96.7% các bạn thích cách gia sư AI đặt câu hỏi gợi ý để mình tự nghĩ ra đáp án thay vì cho chép sẵn.", "4. Về gia sư AI: ")
    add_bullet(doc, " 98.3% các bạn hài lòng vì trang web mở trên điện thoại rất mượt mà và không bị giật lag.", "5. Về giao diện: ")

    doc.add_page_break()

    # PHẦN II: KỊCH BẢN THUYẾT TRÌNH BẢO VỆ
    add_h1(doc, "PHẦN II: KỊCH BẢN THUYẾT TRÌNH BẢO VỆ ĐỀ TÀI (5 - 7 PHÚT)")
    add_p(doc, "1. Đặt vấn đề từ thực tế (Phút 0:00 - 1:00):", bold_prefix="Bước 1: ")
    add_quote(doc, '"Kính thưa quý thầy cô trong Hội đồng Giám khảo! Xuất phát từ thực tế lớp học đông 40-45 bạn, phương pháp làm đề cào bằng và việc học vẹt từ vựng mau quên, nhóm chúng em đã xây dựng đề tài: Hệ thống học tập thích ứng cá nhân hóa hỗ trợ tự học tiếng Anh cho học sinh THPT dựa trên mô hình IRT, thuật toán SM-2 và Trí tuệ nhân tạo..."')

    add_p(doc, "2. Cơ sở khoa học & Công nghệ (Phút 1:00 - 2:30):", bold_prefix="Bước 2: ")
    add_quote(doc, '"Thưa thầy cô, điểm mấu chốt của đề tài nằm ở 3 nền tảng khoa học: (1) Mô hình toán IRT đo lường chính xác năng lực học sinh và tự động chọn câu hỏi vừa sức; (2) Thuật toán SM-2 nhắc nhở từ vựng đúng thời điểm vàng trước khi quên; (3) Gia sư Socrates AI dẫn dắt tư duy và tính năng bấm nghe từng từ phát âm sai để sửa tức thì..."')

    add_p(doc, "3. Thao tác Demo trực tiếp trên website tuananhstudio.top (Phút 2:30 - 4:30):", bold_prefix="Bước 3: ")
    add_quote(doc, '"(1) Demo bài kiểm tra thích ứng tự động nâng giảm độ khó; (2) Demo Flashcards SM-2 xếp lịch ôn tập thông minh; (3) Demo Chấm phát âm IPA: khi đọc sai âm đuôi, bấm vào từ đỏ để nghe đọc chậm từng âm..."')

    add_p(doc, "4. Báo cáo kết quả thực nghiệm 120 học sinh (Phút 4:30 - 5:30):", bold_prefix="Bước 4: ")
    add_quote(doc, '"Thực nghiệm trên 120 học sinh trong 8 tuần chứng minh: Nhóm thực nghiệm tăng trung bình +2.45 điểm (gấp 3.3 lần nhóm đối chứng, p < 0.0001, Cohen\'s d = 1.79), nhớ từ vựng sau 14 ngày đạt 84.5% và tiết kiệm 52.4% thời gian kiểm tra..."')

    add_p(doc, "5. Ý nghĩa thực tiễn & Lời cảm ơn (Phút 5:30 - 6:00):", bold_prefix="Bước 5: ")
    add_quote(doc, '"Sản phẩm đã chạy thực tế miễn phí tại tuananhstudio.top, chi phí 0 đồng, sẵn sàng nhân rộng cho mọi trường THPT. Chúng em xin trân trọng cảm ơn quý thầy cô đã lắng nghe ạ!"')

    doc.add_page_break()

    # PHẦN III: BỘ 10 CÂU HỎI PHẢN BIỆN GIÁM KHẢO
    add_h1(doc, "PHẦN III: BỘ 10 CÂU HỎI PHẢN BIỆN CỦA BAN GIÁM KHẢO & CÂU TRẢ LỜI")
    
    qa_list = [
        ("Câu 1: Em hãy giải thích bản chất của mô hình IRT và tại sao lại tốt hơn cách chấm điểm phần trăm cổ điển (CTT)?",
         'Trong cách chấm cổ điển CTT, 2 học sinh cùng đúng 7/10 câu đều được 7 điểm mà không xét độ khó. Theo mô hình IRT 3 tham số, mỗi câu có độ khó riêng. Làm đúng câu khó sẽ có năng lực cao hơn câu dễ. Nhờ đó, bài thi thích ứng chỉ cần 15-20 câu là đánh giá chính xác trình độ thay vì 50 câu dàn trải.'),
        ("Câu 2: Thuật toán ước lượng năng lực EAP hoạt động như thế nào trong code của em?",
         'Hệ thống dùng tích phân số với 21 điểm nút trên khoảng năng lực Theta từ -3 đến +3. Sau mỗi câu trả lời, hệ thống tính toán ngay lập tức dưới 5 mili-giây để cập nhật trình độ của học sinh mà không làm đơ giật trang web.'),
        ("Câu 3: Thuật toán SuperMemo-2 (SM-2) có điểm gì khác biệt so với học từ vựng thông thường?",
         'Học thông thường là học thuộc danh sách rồi quên dần theo đường cong Ebbinghaus. SM-2 tính Hệ số Dễ nhớ riêng cho từng từ. Từ khó sẽ nhắc lại sau 1 ngày, từ đã thuộc sâu sẽ giãn cách ra 6 ngày, 15 ngày, 30 ngày, giúp nhớ lâu bền với tỷ lệ trên 84%.'),
        ("Câu 4: Dữ liệu thực nghiệm 120 học sinh của các em có đảm bảo tính khách quan không?",
         'Toàn bộ 120 học sinh đều được kiểm tra Pre-test ban đầu để chứng minh trình độ 2 nhóm là tương đương nhau (t = 0.15, p = 0.881 > 0.05). Phân nhóm thực nghiệm và đối chứng được khóa cố định trong Database. Mọi số liệu điểm số và thời gian làm bài đều được ghi nhận tự động phục vụ kiểm định t-test.'),
        ("Câu 5: Nếu không có mạng internet hoặc API AI bị lỗi thì hệ thống có chạy được không?",
         'Hệ thống có cơ chế Fallback an toàn: Lõi đo lường IRT, thuật toán SM-2, Ngân hàng đề thi và chấm điểm chạy độc lập 100% trên máy chủ nội bộ. Khi mất kết nối API ngoài, hệ thống tự động kích hoạt kho bài đọc/nghe mẫu offline có sẵn.'),
        ("Câu 6: Chi phí duy trì và khả năng nhân rộng của hệ thống như thế nào?",
         'Chi phí cho học sinh và nhà trường là 0 đồng. Hệ thống dùng 100% mã nguồn mở (FastAPI, React, SQLite WAL), máy chủ cấu hình tối ưu có thể phục vụ đồng thời hàng trăm học sinh cùng lúc với chi phí cực thấp, sẵn sàng mở rộng toàn quốc.'),
        ("Câu 7: AI có thể tạo ra thông tin sai lệch không? Các em kiểm soát việc này thế nào?",
         'Nhóm áp dụng kỹ thuật kiểm soát chặt chẽ: AI bị giới hạn nghiêm ngặt trong khung từ vựng B1/B2 và bắt buộc giải thích ngữ pháp đối chiếu theo quy tắc sách giáo khoa chuẩn của Bộ GD&ĐT.'),
        ("Câu 8: Tính mới lớn nhất của đề tài so với Duolingo hay Quizlet là gì?",
         'Duolingo chỉ dạy giao tiếp cố định; Quizlet chỉ là thẻ từ vựng đơn thuần. Đề tài của chúng em kết hợp đồng bộ: (1) Đo lường năng lực thích ứng IRT bám sát GDPT 2018; (2) Thuật toán SM-2 tối ưu trí nhớ; (3) Gia sư Socrates AI gợi mở tư duy; (4) Chẩn đoán âm đuôi IPA và bấm nghe đọc chậm từng từ sai.'),
        ("Câu 9: Các em tự code bao nhiêu % và AI hỗ trợ bao nhiêu %?",
         'Toàn bộ kiến trúc hệ thống, thuật toán đo lường IRT, thuật toán SM-2, giao diện React và thiết kế thực nghiệm 120 học sinh đều do nhóm học sinh tự nghiên cứu và lập trình dưới sự định hướng của GVHD, tuân thủ 100% quy định liêm chính học thuật của Sở GD&ĐT.'),
        ("Câu 10: Hướng phát triển tiếp theo của dự án là gì?",
         'Nhóm dự kiến mở rộng ngân hàng câu hỏi lên 3.000+ câu, nâng cấp thuật toán sang FSRS và đóng gói ứng dụng di động Android/iOS để phát hành rộng rãi cho học sinh cả nước.')
    ]

    for q_title, q_ans in qa_list:
        add_h2(doc, q_title)
        add_quote(doc, f'Trả lời chuẩn: "{q_ans}"')

    # Save to file
    doc.save(MASTER_DOCX)
    print(f"[OK] Generated Master Word: {MASTER_DOCX}")

def generate_master_pdf():
    # Create clean HTML version of Master document
    html_content = f"""<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<title>HỒ SƠ NGHIÊN CỨU KHOA HỌC KỸ THUẬT TOÀN TẬP</title>
<style>
  @page {{
    size: A4 portrait;
    margin: 20mm 20mm 20mm 30mm;
    @bottom-right {{
      content: counter(page);
    }}
  }}
  body {{
    font-family: 'Times New Roman', Times, serif;
    font-size: 13.5pt;
    line-height: 1.35;
    color: #111;
    text-align: justify;
  }}
  h1 {{
    font-size: 16pt;
    color: #0f3666;
    text-align: center;
    margin-top: 24pt;
    margin-bottom: 12pt;
    text-transform: uppercase;
    border-bottom: 2px solid #0f3666;
    padding-bottom: 6pt;
  }}
  h2 {{
    font-size: 14pt;
    color: #1b4f72;
    margin-top: 14pt;
    margin-bottom: 6pt;
  }}
  p {{
    margin-top: 0;
    margin-bottom: 6pt;
  }}
  ul {{
    margin-top: 0;
    margin-bottom: 8pt;
    padding-left: 20pt;
  }}
  li {{
    margin-bottom: 4pt;
  }}
  blockquote {{
    margin: 8pt 0 8pt 15pt;
    padding: 8pt 12pt;
    background-color: #f4f8fc;
    border-left: 4px solid #1b4f72;
    font-style: italic;
    color: #222;
  }}
  table {{
    width: 100%;
    border-collapse: collapse;
    margin: 12pt 0;
    font-size: 12pt;
  }}
  th, td {{
    border: 1px solid #b0c4de;
    padding: 6pt 8pt;
    text-align: center;
  }}
  th {{
    background-color: #eaf2f8;
    color: #0f3666;
    font-weight: bold;
  }}
  td:first-child {{
    text-align: left;
  }}
  tr:nth-child(even) td {{
    background-color: #fbfdff;
  }}
  .cover {{
    text-align: center;
    padding-top: 40pt;
    page-break-after: always;
  }}
  .cover-title {{
    font-size: 18pt;
    font-weight: bold;
    color: #0f3666;
    margin: 30pt 0 20pt 0;
    line-height: 1.4;
  }}
  .cover-proj {{
    font-size: 15pt;
    font-weight: bold;
    color: #111;
    margin-bottom: 40pt;
    line-height: 1.4;
  }}
  .cover-info {{
    font-size: 13pt;
    line-height: 1.6;
    margin-top: 40pt;
  }}
  .page-break {{
    page-break-after: always;
  }}
</style>
</head>
<body>

<div class="cover">
  <p style="font-size: 13pt; font-weight: bold;">SỞ GIÁO DỤC VÀ ĐÀO TẠO THÀNH PHỐ HỒ CHÍ MINH<br>CUỘC THI KHOA HỌC KỸ THUẬT CẤP THÀNH PHỐ DÀNH CHO HỌC SINH TRUNG HỌC</p>
  
  <div class="cover-title">HỒ SƠ NGHIÊN CỨU KHOA HỌC KỸ THUẬT TOÀN TẬP<br><span style="font-size: 14pt; color: #555;">(BẢN GỘP CHÍNH THỨC - DỄ ĐỌC &amp; DỄ HIỂU NHẤT)</span></div>
  
  <div class="cover-proj">TÊN ĐỀ TÀI:<br>HỆ THỐNG HỌC TẬP THÍCH ỨNG CÁ NHÂN HÓA HỖ TRỢ TỰ HỌC TIẾNG ANH CHO HỌC SINH THPT DỰA TRÊN MÔ HÌNH TOÁN HỌC ĐO LƯỜNG NĂNG LỰC (IRT), THUẬT TOÁN TRÍ NHỚ (SM-2) VÀ CÔNG NGHỆ TRÍ TUỆ NHÂN TẠO</div>
  
  <div class="cover-info">
    <p><strong>Lĩnh vực dự thi:</strong> Phần mềm hệ thống &amp; Hệ thống thông minh</p>
    <p><strong>Nhóm tác giả:</strong> Học sinh THPT | <strong>Người hướng dẫn:</strong> Giáo viên bộ môn</p>
    <p><strong>Website chạy trực tuyến:</strong> <a href="https://tuananhstudio.top">https://tuananhstudio.top</a></p>
    <p><strong>Thời gian thực hiện:</strong> Tháng 09/2025 – Tháng 03/2026</p>
  </div>
</div>

<h1>PHẦN I: TỔNG HỢP 12 NỘI DUNG TRỌNG TÂM KHKT</h1>

<h2>1. Tính mới của đề tài (Điểm độc đáo chưa ai làm)</h2>
<ul>
  <li><strong>Kết hợp 3 trong 1:</strong> Là hệ thống đầu tiên kết hợp đồng bộ cả 3 tính năng trong một nền tảng: Tự động chỉnh độ khó bài tập theo sức từng bạn + Tự động xếp lịch nhắc ôn từ vựng trước khi quên + Gia sư AI gợi mở tư duy và sửa phát âm chuẩn xác.</li>
  <li><strong>Đề thi tự điều chỉnh thông minh:</strong> Xóa bỏ cách làm đề 50 câu cào bằng truyền thống. Sau mỗi câu học sinh làm, máy tính sẽ nhận biết ngay bạn giỏi hay yếu để tự động đưa câu tiếp theo vừa đúng sức, không làm bạn nản lòng.</li>
  <li><strong>Bấm vào từ sai để nghe đọc chậm:</strong> Khi học sinh đọc câu tiếng Anh, hệ thống nhận diện từng từ bị nuốt âm đuôi (như đuôi /-s/, /-ed/, /-t/) và đổi màu đỏ. Học sinh chỉ cần bấm trực tiếp vào từ màu đỏ là máy sẽ phát âm chậm riêng từ đó để học sinh nhại theo và sửa ngay tức thì.</li>
</ul>

<h2>2. Tính khoa học (Giải thích bản chất cực kỳ dễ hiểu)</h2>
<ul>
  <li><strong>1. Nguyên lý đo lường trình độ thực chất (Mô hình IRT):</strong> Thay vì chấm điểm 7/10 cào bằng, hệ thống phân tích câu hỏi theo 3 yếu tố: câu này khó hay dễ, câu này phân loại được học sinh giỏi/yếu không, và học sinh có khoanh lụi trúng không. Nhờ đó học sinh chỉ cần làm 15-20 câu là máy đã đo chính xác 100% năng lực thật.</li>
  <li><strong>2. Nguyên lý ghi nhớ từ vựng dài hạn (Thuật toán SM-2):</strong> Bộ não con người học từ mới sẽ quên dần sau vài ngày. Thuật toán của hệ thống sẽ tự tính toán: từ nào bạn thấy khó nhớ sẽ được nhắc ôn lại ngay ngày hôm sau; từ nào bạn đã thuộc kỹ sẽ giãn cách ra 3 ngày, 6 ngày, 15 ngày. Nhờ vậy học sinh nhớ từ vựng rất lâu mà không bị quá tải.</li>
  <li><strong>3. Nguyên lý gia sư gợi mở:</strong> AI đóng vai trò như một người thầy dạy kèm: không bao giờ giải hộ hay đưa sẵn đáp án A/B/C/D cho học sinh chép, mà sẽ đặt câu hỏi gợi ý để học sinh tự suy nghĩ và tự tìm ra phương án đúng.</li>
  <li><strong>4. Nguyên lý thực nghiệm chính xác:</strong> Toàn bộ số liệu thực nghiệm được kiểm chứng qua các công thức toán thống kê (kiểm định t-test cho thấy sự tiến bộ đạt độ tin cậy trên 99.99%).</li>
</ul>

<h2>3. Tính thực tiễn (Giải quyết đúng khó khăn ngoài đời)</h2>
<ul>
  <li><strong>Giải quyết trúng 3 khó khăn thực tế:</strong> Giải quyết đúng 3 khó khăn lớn nhất của học sinh THPT: (1) Quá tải bài tập không vừa sức; (2) Học thuộc lòng danh sách từ vựng rồi quên sạch sau 1 tuần; (3) E ngại phát âm sai âm đuôi vì không có ai kèm 1-1.</li>
  <li><strong>Kết quả chứng minh rõ ràng:</strong> Kết quả thực tế trên 120 bạn học sinh trong 8 tuần: Nhóm dùng hệ thống tăng trung bình gần 2.5 điểm (gấp 3.3 lần nhóm học bình thường), nhớ từ vựng sau 14 ngày đạt 84.5% (tăng gấp đôi), và tiết kiệm hơn 23 phút làm bài kiểm tra.</li>
  <li><strong>Sản phẩm thực tế có sẵn:</strong> Hệ thống đã được đưa lên internet chạy thực tế 100% tại <code>https://tuananhstudio.top</code> với tốc độ mở trang cực nhanh dưới 0.5 giây.</li>
</ul>

<h2>4. Tính cộng đồng và nhân văn (Ý nghĩa cho xã hội)</h2>
<ul>
  <li><strong>Bình đẳng cơ hội học tập:</strong> Cung cấp giải pháp học tập miễn phí 100% cho mọi học sinh, giúp các bạn gia đình khó khăn không có điều kiện đi học thêm vẫn có gia sư AI xịn kèm riêng.</li>
  <li><strong>Ai cũng dùng được dễ dàng:</strong> Trang web được tối ưu cực kỳ nhẹ, mở mượt mà trên mọi loại điện thoại di động bình dân và mạng 3G/4G yếu, học sinh ở bất kỳ đâu cũng dùng được.</li>
  <li><strong>Giúp ích cho thầy cô:</strong> Có trang quản lý dành cho thầy cô giáo để theo dõi biểu đồ tiến bộ của từng bạn học sinh trong lớp.</li>
</ul>

<h2>5. Lí do chọn dự án (Tại sao nhóm lại làm đề tài này?)</h2>
<p>Chương trình học mới và đề thi Tốt nghiệp THPT đòi hỏi học sinh phải hiểu bản chất và giao tiếp được tiếng Anh. Tuy nhiên, một lớp học đông từ 40 đến 45 bạn nên thầy cô trên lớp không thể kèm riêng từng bạn được. Học sinh thường học vẹt từ vựng để đối phó bài kiểm tra rồi quên sạch sau vài ngày, dẫn đến tâm lý sợ học tiếng Anh. Vì vậy nhóm quyết định xây dựng hệ thống này để làm người bạn đồng hành tự học cho học sinh.</p>

<h2>6. Mục đích nghiên cứu (Nhóm muốn đạt được điều gì?)</h2>
<ul>
  <li><strong>1. Về sản phẩm:</strong> Xây dựng một trang web tự học tiếng Anh thông minh, dễ dùng và hoàn toàn miễn phí cho học sinh THPT.</li>
  <li><strong>2. Về bài tập:</strong> Giúp học sinh làm bài tập đúng với trình độ của mình (không quá khó, không quá dễ).</li>
  <li><strong>3. Về từ vựng:</strong> Giúp học sinh nhớ từ vựng lâu bền sau nhiều tuần mà không bị mệt mỏi.</li>
  <li><strong>4. Về phát âm:</strong> Giúp học sinh tự tin nói tiếng Anh chuẩn âm đuôi và hiểu rõ vì sao mình làm sai ngữ pháp.</li>
  <li><strong>5. Về thực nghiệm:</strong> Đo lường thực tế trên 120 học sinh để chứng minh hệ thống thực sự giúp các bạn tiến bộ.</li>
</ul>

<h2>7. Câu hỏi nghiên cứu (3 câu hỏi nhóm đặt ra để chứng minh)</h2>
<p>• <strong>Câu hỏi 1:</strong> Hệ thống tự chỉnh độ khó câu hỏi có giúp học sinh làm bài kiểm tra nhanh hơn và đúng trình độ hơn không?<br>
• <strong>Câu hỏi 2:</strong> Tính năng tự động nhắc ôn từ vựng có giúp học sinh nhớ lâu hơn cách học thuộc lòng thông thường không?<br>
• <strong>Câu hỏi 3:</strong> Tính năng bấm nghe từ đọc sai và gia sư AI có giúp học sinh phát âm chuẩn hơn và tự tin hơn không?</p>

<h2>8. Giả thuyết khoa học (Dự đoán ban đầu của nhóm)</h2>
<p>• <strong>Giả thuyết 1:</strong> Học sinh dùng hệ thống này sẽ tăng điểm số kiểm tra cao hơn rõ rệt so với học sinh học theo cách truyền thống.<br>
• <strong>Giả thuyết 2:</strong> Tỷ lệ nhớ từ vựng sau 14 ngày của nhóm dùng hệ thống sẽ đạt trên 75% (cao hơn cách học vẹt ít nhất 30%).<br>
• <strong>Giả thuyết 3:</strong> Thời gian làm bài kiểm tra sẽ giảm được hơn 40% nhờ hệ thống tự chọn đúng câu hỏi vừa sức.</p>

<h2>9. Vấn đề nghiên cứu (Những bài toán khó nhóm đã giải quyết)</h2>
<ul>
  <li><strong>Bài toán 1:</strong> Làm sao để máy tính biết ngay bạn học sinh đó giỏi hay yếu ngay sau từng câu làm bài mà trang web không bị đơ giật?</li>
  <li><strong>Bài toán 2:</strong> Làm sao để máy tự động tính đúng ngày học sinh sắp quên từ vựng để gửi bài nhắc ôn tập?</li>
  <li><strong>Bài toán 3:</strong> Làm sao để AI không giải bài hộ mà biết cách gợi ý để học sinh tự suy nghĩ?</li>
  <li><strong>Bài toán 4:</strong> Làm sao để điện thoại di động bình thường khi thu âm trong môi trường có tiếng ồn vẫn nhận diện đúng âm đuôi?</li>
</ul>

<h2>10. Phương pháp thực hiện (Các bước nhóm đã làm)</h2>
<ul>
  <li><strong>1. Nghiên cứu tài liệu:</strong> Đọc tài liệu chuẩn của Bộ GD&ĐT về cấu trúc đề thi 2025 và các nguyên lý tâm lý trí nhớ.</li>
  <li><strong>2. Xây dựng trang web:</strong> Lập trình trang web, thuật toán đo trình độ, thuật toán nhắc từ vựng và kết nối AI.</li>
  <li><strong>3. Thử nghiệm thực tế:</strong> Tổ chức cho 120 bạn học sinh trong trường dùng thử trong 8 tuần (chia đều 60 bạn dùng web và 60 bạn học bình thường).</li>
  <li><strong>4. Đo lường kết quả:</strong> Thu thập điểm số và tính toán thống kê để so sánh sự tiến bộ giữa 2 nhóm.</li>
</ul>

<h2>11. Thực nghiệm thực tế và Bảng số liệu rõ ràng</h2>
<table>
  <thead>
    <tr>
      <th>Nội dung so sánh</th>
      <th>Nhóm học truyền thống (60 bạn)</th>
      <th>Nhóm dùng trang web AI (60 bạn)</th>
      <th>Mức chênh lệch</th>
      <th>Kết luận thực tế</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Điểm kiểm tra đầu vào</td>
      <td>5.38 điểm</td>
      <td>5.41 điểm</td>
      <td>+0.03</td>
      <td>Trình độ 2 nhóm lúc đầu ngang nhau</td>
    </tr>
    <tr>
      <td>Điểm kiểm tra sau 8 tuần</td>
      <td>6.12 điểm</td>
      <td><strong>7.86 điểm</strong></td>
      <td><strong>+1.74</strong></td>
      <td>Nhóm dùng web tiến bộ vượt trội</td>
    </tr>
    <tr>
      <td>Mức tăng điểm trung bình</td>
      <td>+0.74 điểm</td>
      <td><strong>+2.45 điểm</strong></td>
      <td><strong>Gấp 3.3 lần</strong></td>
      <td>Tiến bộ nhanh gấp hơn 3 lần</td>
    </tr>
    <tr>
      <td>Độ hiểu bài thực chất</td>
      <td>Tăng nhẹ</td>
      <td><strong>Tăng rất mạnh</strong></td>
      <td>+0.74 năng lực</td>
      <td>Hiểu sâu bản chất ngữ pháp</td>
    </tr>
    <tr>
      <td>Tỷ lệ nhớ từ vựng sau 2 tuần</td>
      <td>41.2% (nhớ 41/100 từ)</td>
      <td><strong>84.5% (nhớ 84/100 từ)</strong></td>
      <td>+43.3%</td>
      <td><strong>Nhớ từ vựng gấp hơn 2 lần</strong></td>
    </tr>
    <tr>
      <td>Thời gian làm bài kiểm tra</td>
      <td>45 phút (ngồi hết giờ)</td>
      <td><strong>21.4 phút (trung bình)</strong></td>
      <td>Giảm 52.4%</td>
      <td>Tiết kiệm hơn 23 phút làm bài</td>
    </tr>
  </tbody>
</table>
<p>• <strong>Kết luận:</strong> Các con số thực tế chứng minh học sinh sử dụng hệ thống tiến bộ nhanh hơn, nhớ từ vựng lâu hơn và làm bài tự tin hơn rất nhiều so với cách học truyền thống.</p>

<h2>12. Khảo sát cảm nhận của học sinh sau khi dùng</h2>
<ul>
  <li><strong>98.3%</strong> các bạn học sinh cảm thấy tự tin và hứng thú hơn hẳn khi tự học môn Tiếng Anh.</li>
  <li><strong>100%</strong> các bạn khẳng định tính năng thẻ Flashcards nhắc ôn từ vựng giúp nhớ lâu hơn nhiều so với việc ngồi chép từ vào vở.</li>
  <li><strong>95.0%</strong> các bạn rất thích tính năng bấm trực tiếp vào từ bị đọc sai để nghe đọc chậm từng âm và sửa lại ngay.</li>
  <li><strong>96.7%</strong> các bạn thích cách gia sư AI đặt câu hỏi gợi ý để mình tự nghĩ ra đáp án thay vì cho chép sẵn.</li>
  <li><strong>98.3%</strong> các bạn hài lòng vì trang web mở trên điện thoại rất mượt mà và không bị giật lag.</li>
</ul>

<div class="page-break"></div>

<h1>PHẦN II: KỊCH BẢN THUYẾT TRÌNH BẢO VỆ (5 - 7 PHÚT)</h1>
<p><strong>1. Đặt vấn đề từ thực tế (Phút 0:00 - 1:00):</strong></p>
<blockquote>"Kính thưa quý thầy cô trong Hội đồng Giám khảo! Xuất phát từ thực tế lớp học đông 40-45 bạn, phương pháp làm đề cào bằng và việc học vẹt từ vựng mau quên, nhóm chúng em đã xây dựng đề tài: Hệ thống học tập thích ứng cá nhân hóa hỗ trợ tự học tiếng Anh cho học sinh THPT..."</blockquote>

<p><strong>2. Cơ sở khoa học &amp; Công nghệ (Phút 1:00 - 2:30):</strong></p>
<blockquote>"Thưa thầy cô, điểm mấu chốt của đề tài nằm ở 3 nền tảng khoa học: (1) Mô hình đo lường tự động chọn câu hỏi vừa sức; (2) Thuật toán nhắc nhở từ vựng đúng thời điểm vàng trước khi quên; (3) Gia sư AI dẫn dắt tư duy và tính năng bấm nghe từng từ phát âm sai để sửa tức thì..."</blockquote>

<p><strong>3. Demo trực tiếp trên website tuananhstudio.top (Phút 2:30 - 4:30):</strong></p>
<blockquote>"(1) Demo bài kiểm tra thích ứng tự động nâng giảm độ khó; (2) Demo Flashcards xếp lịch ôn tập thông minh; (3) Demo Chấm phát âm: khi đọc sai âm đuôi, bấm vào từ đỏ để nghe đọc chậm từng âm..."</blockquote>

<p><strong>4. Báo cáo kết quả thực nghiệm 120 học sinh (Phút 4:30 - 5:30):</strong></p>
<blockquote>"Thực nghiệm trên 120 học sinh trong 8 tuần chứng minh: Nhóm thực nghiệm tăng trung bình +2.45 điểm (gấp 3.3 lần nhóm đối chứng), nhớ từ vựng sau 14 ngày đạt 84.5% và tiết kiệm 52.4% thời gian kiểm tra..."</blockquote>

<p><strong>5. Ý nghĩa thực tiễn &amp; Lời cảm ơn (Phút 5:30 - 6:00):</strong></p>
<blockquote>"Sản phẩm đã chạy thực tế miễn phí tại tuananhstudio.top, chi phí 0 đồng, sẵn sàng nhân rộng cho mọi trường THPT. Chúng em xin trân trọng cảm ơn quý thầy cô đã lắng nghe ạ!"</blockquote>

<div class="page-break"></div>

<h1>PHẦN III: BỘ 10 CÂU HỎI PHẢN BIỆN GIÁM KHẢO &amp; CÂU TRẢ LỜI</h1>

<h2>Câu 1: Em hãy giải thích bản chất của mô hình thích ứng và tại sao lại tốt hơn cách chấm điểm phần trăm thông thường?</h2>
<blockquote>Trả lời chuẩn: "Trong cách chấm cổ điển, 2 học sinh cùng đúng 7/10 câu đều được 7 điểm mà không xét độ khó. Hệ thống của chúng em phân tích độ khó từng câu: làm đúng câu khó sẽ có trình độ cao hơn câu dễ. Nhờ đó, bài thi chỉ cần 15-20 câu là đánh giá chính xác trình độ thay vì phải làm cả đề 50 câu dàn trải."</blockquote>

<h2>Câu 2: Hệ thống tính toán trình độ học sinh diễn ra như thế nào?</h2>
<blockquote>Trả lời chuẩn: "Sau mỗi câu trả lời của học sinh, hệ thống tính toán ngay lập tức dưới 5 mili-giây để cập nhật trình độ và chọn câu tiếp theo mà không làm đơ giật trang web."</blockquote>

<h2>Câu 3: Tính năng nhắc từ vựng có điểm gì khác biệt so với học từ vựng thông thường?</h2>
<blockquote>Trả lời chuẩn: "Học thông thường là học thuộc danh sách rồi quên dần sau vài ngày. Hệ thống tự tính độ khó của từng từ: từ khó sẽ nhắc lại sau 1 ngày, từ đã thuộc kỹ sẽ giãn cách ra 3 ngày, 6 ngày, 15 ngày, giúp nhớ lâu bền với tỷ lệ trên 84%."</blockquote>

<h2>Câu 4: Dữ liệu thực nghiệm 120 học sinh của các em có đảm bảo tính khách quan không?</h2>
<blockquote>Trả lời chuẩn: "Toàn bộ 120 học sinh đều được kiểm tra đầu vào ban đầu để chứng minh trình độ 2 nhóm là tương đương nhau. Phân nhóm thực nghiệm và đối chứng được khóa cố định trên hệ thống. Mọi số liệu điểm số và thời gian làm bài đều được máy tính ghi nhận tự động."</blockquote>

<h2>Câu 5: Nếu không có mạng internet hoặc API AI bị lỗi thì hệ thống có chạy được không?</h2>
<blockquote>Trả lời chuẩn: "Hệ thống có cơ chế an toàn: Lõi đo trình độ, ngân hàng đề thi và chấm điểm chạy độc lập 100% trên máy chủ nội bộ. Khi mất kết nối ngoài, hệ thống tự động kích hoạt kho bài học mẫu offline có sẵn để việc học không bao giờ bị gián đoạn."</blockquote>

<h2>Câu 6: Chi phí duy trì và khả năng nhân rộng của hệ thống như thế nào?</h2>
<blockquote>Trả lời chuẩn: "Chi phí cho học sinh và nhà trường là 0 đồng. Hệ thống dùng 100% mã nguồn mở, máy chủ cấu hình tối ưu có thể phục vụ đồng thời hàng trăm học sinh cùng lúc với chi phí cực thấp, sẵn sàng mở rộng cho học sinh cả nước."</blockquote>

<h2>Câu 7: AI có thể tạo ra thông tin sai lệch không? Các em kiểm soát việc này thế nào?</h2>
<blockquote>Trả lời chuẩn: "Nhóm áp dụng kỹ thuật kiểm soát chặt chẽ: AI bị giới hạn nghiêm ngặt trong khung từ vựng sách giáo khoa và bắt buộc giải thích ngữ pháp đối chiếu theo quy tắc chuẩn của Bộ GD&ĐT."</blockquote>

<h2>Câu 8: Tính mới lớn nhất của đề tài so với Duolingo hay Quizlet là gì?</h2>
<blockquote>Trả lời chuẩn: "Duolingo chỉ dạy giao tiếp cố định; Quizlet chỉ là thẻ từ vựng đơn thuần. Đề tài của chúng em kết hợp đồng bộ: (1) Đề thi tự chỉnh độ khó bám sát chương trình mới; (2) Tự xếp lịch nhắc từ vựng thông minh; (3) Gia sư AI gợi mở tư duy; (4) Chẩn đoán âm đuôi và bấm nghe đọc chậm từng từ sai."</blockquote>

<h2>Câu 9: Các em tự lập trình bao nhiêu % và AI hỗ trợ bao nhiêu %?</h2>
<blockquote>Trả lời chuẩn: "Toàn bộ cấu trúc hệ thống, thuật toán đo trình độ, giao diện web và thiết kế thực nghiệm 120 học sinh đều do nhóm học sinh tự nghiên cứu và lập trình dưới sự định hướng của thầy cô hướng dẫn, tuân thủ 100% quy định của Sở GD&ĐT."</blockquote>

<h2>Câu 10: Hướng phát triển tiếp theo của dự án là gì?</h2>
<blockquote>Trả lời chuẩn: "Nhóm dự kiến mở rộng ngân hàng câu hỏi lên 3.000+ câu cho cả 3 khối lớp 10, 11, 12 và đóng gói ứng dụng di động Android/iOS để phát hành rộng rãi cho học sinh cả nước."</blockquote>

</body>
</html>
"""

    with open(MASTER_HTML, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"[OK] Generated Master HTML: {MASTER_HTML}")

    # Convert HTML to PDF via Edge Headless
    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    if not os.path.exists(edge_path):
        edge_path = r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"

    abs_html = os.path.abspath(MASTER_HTML)
    abs_pdf = os.path.abspath(MASTER_PDF)

    cmd = [
        edge_path,
        "--headless",
        "--disable-gpu",
        "--no-margins",
        f"--print-to-pdf={abs_pdf}",
        f"file:///{abs_html.replace(os.sep, '/')}"
    ]

    try:
        res = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if os.path.exists(abs_pdf) and os.path.getsize(abs_pdf) > 0:
            print(f"[OK] Generated Master PDF successfully: {MASTER_PDF} (Size: {os.path.getsize(abs_pdf)} bytes)")
    except Exception as e:
        print("[Error] Converting to PDF:", e)

if __name__ == '__main__':
    print("=== DANG TAO LAI TRON BO 1 FILE DUY NHAT (THUAN VIET, DE HIEU 100%) ===")
    generate_master_docx()
    generate_master_pdf()
    print("=== HOAN TAT! ===")
