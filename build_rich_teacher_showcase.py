# -*- coding: utf-8 -*-
"""
Tích hợp bảng giới thiệu tính năng Cổng Giáo Viên cực đẹp và chuyên nghiệp lên trực tiếp giao diện Web:
1. TeacherPortal.jsx (Màn hình khóa + Modal Giới Thiệu Chi Tiết)
2. UserGuide.jsx (Thêm mục Hướng Dẫn Giáo Viên)
3. GuestLandingPage.jsx (Thêm Section Giới Thiệu Cổng Giáo Viên trên trang chủ)
"""

# ==============================================================================
# 1. CẬP NHẬT TeacherPortal.jsx
# ==============================================================================
with open('frontend/src/components/TeacherPortal.jsx', 'r', encoding='utf-8') as f:
    tp_code = f.read()

# Thêm state showTeacherFeatureModal
if 'const [showTeacherFeatureModal, setShowTeacherFeatureModal] = useState(false);' not in tp_code:
    tp_code = tp_code.replace(
        "const [contactSuccess, setContactSuccess] = useState(false);",
        "const [contactSuccess, setContactSuccess] = useState(false);\n  const [showTeacherFeatureModal, setShowTeacherFeatureModal] = useState(false);"
    )

# Thêm nút xem giới thiệu tính năng ở Header khi đã kích hoạt
header_badge_target = """            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tài Khoản Giáo Viên Đã Xác Thực
              </span>
              <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Hotline/Zalo: 0975.711.254 (Admin Tuấn Anh)
              </span>
            </div>"""

header_badge_replacement = """            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Tài Khoản Giáo Viên Đã Xác Thực
              </span>
              <button
                onClick={() => setShowTeacherFeatureModal(true)}
                className="px-3 py-1 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-bold text-[11px] border border-cyan-500/30 flex items-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>🌟 Giới Thiệu &amp; Hướng Dẫn Tính Năng</span>
              </button>
              <span className="text-[11px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                Hotline/Zalo: 0975.711.254 (Admin Tuấn Anh)
              </span>
            </div>"""

if 'showTeacherFeatureModal' in tp_code and 'Giới Thiệu &amp; Hướng Dẫn Tính Năng' not in tp_code:
    tp_code = tp_code.replace(header_badge_target, header_badge_replacement)

# Cập nhật màn hình khóa: Thêm Grid 4 Card Giới Thiệu Tính Năng Đột Phá + Modal Chi Tiết
lock_screen_target = """          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://zalo.me/0975711254"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-2xl bg-[#0068FF]/20 hover:bg-[#0068FF]/30 border border-[#0068FF]/50 text-blue-300 font-extrabold text-xs transition flex items-center gap-2 shadow-lg"
            >
              <MessageSquare className="w-4 h-4 text-[#0068FF]" />
              <span>Nhắn Zalo Nhận Mã Miễn Phí: 0975.711.254 (Admin Tuấn Anh)</span>
            </a>

            <button
              onClick={() => setShowContactModal(true)}
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Gửi Đăng Ký Cấp Quyền Tự Động</span>
            </button>
          </div>
        </div>"""

lock_screen_replacement = """          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://zalo.me/0975711254"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-2xl bg-[#0068FF]/20 hover:bg-[#0068FF]/30 border border-[#0068FF]/50 text-blue-300 font-extrabold text-xs transition flex items-center gap-2 shadow-lg"
            >
              <MessageSquare className="w-4 h-4 text-[#0068FF]" />
              <span>Nhắn Zalo Nhận Mã Miễn Phí: 0975.711.254 (Admin Tuấn Anh)</span>
            </a>

            <button
              onClick={() => setShowContactModal(true)}
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Gửi Đăng Ký Cấp Quyền Tự Động</span>
            </button>

            <button
              onClick={() => setShowTeacherFeatureModal(true)}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/40 text-cyan-300 font-extrabold text-xs transition flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Xem Chi Tiết Các Tính Năng Dành Cho Giáo Viên</span>
            </button>
          </div>
        </div>

        {/* 🌟 SHOWCASE CÁC TÍNH NĂNG NỔI BẬT DÀNH CHO GIÁO VIÊN TRÊN HỆ THỐNG */}
        <div className="space-y-6 pt-4 animate-fade-in">
          <div className="text-center space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-black uppercase">
              HỆ SINH THÁI GIẢNG DẠY TIẾNG ANH THPT TOÀN DIỆN
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white font-outfit">
              Các Tính Năng Đột Phá Hỗ Trợ Thầy/Cô
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto">
              Hệ thống được thiết kế chuẩn sư phạm, giúp giáo viên tiết kiệm 80% thời gian soạn đề, xáo đề và quản lý học sinh.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1 */}
            <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-b from-[#141208] to-[#0a0e1c] space-y-4 hover:border-amber-500/60 transition shadow-xl">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Shuffle className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ĐỘT PHÁ 2026
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">1. Xáo Đề &amp; Xuất File Word (.docx/.doc) Chuẩn Bộ GD&amp;ĐT</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Tải trực tiếp file Word từ máy tính hoặc dán đề. Tự động xáo thành 4 mã đề (101-104), tính toán Bảng Ma Trận Đáp Án Chuẩn và xuất file Word đẹp mắt, căn chỉnh trang in A4 chuẩn sư phạm.
                </p>
              </div>
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[11px] text-amber-300 font-mono">
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Đọc file .docx trực tiếp</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ 4 Mã đề chuẩn xác</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Bảng ma trận đáp án</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-card rounded-3xl p-6 border border-cyan-500/30 bg-gradient-to-b from-[#071324] to-[#070b18] space-y-4 hover:border-cyan-500/60 transition shadow-xl">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  KHÔNG GIAN RIÊNG
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">2. Không Gian Lớp Học &amp; Cấp Mã Học Sinh</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Tạo lớp theo khối 10, 11, 12 với mã lớp riêng (ví dụ: <strong className="text-amber-400 font-mono">ENG-10A1-26</strong>). Học sinh chỉ cần nhập mã là vào làm bài, hoàn toàn không thấy các lớp khác và không can thiệp được hệ thống.
                </p>
              </div>
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[11px] text-cyan-300 font-mono">
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Mã lớp bảo mật</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Phân quyền học sinh</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Bảng tin dặn dò</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-b from-[#081814] to-[#070b18] space-y-4 hover:border-emerald-500/60 transition shadow-xl">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  TỰ ĐỘNG CHẤM
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">3. Giao Bài Tự Do &amp; AI Chấm Điểm Trực Tuyến</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Thầy/Cô tự tải file bài kiểm tra riêng của mình lên. Học sinh làm bài trực tuyến có đếm giờ. Khóa đáp án trong lúc thi để chống gian lận. Nộp bài xong điểm tự động lưu vào Sổ Điểm.
                </p>
              </div>
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[11px] text-emerald-300 font-mono">
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Đề thi tự do</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Chống gian lận</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Chấm điểm tức thì</span>
              </div>
            </div>

            {/* Card 4 */}
            <div className="glass-card rounded-3xl p-6 border border-purple-500/30 bg-gradient-to-b from-[#140b22] to-[#070b18] space-y-4 hover:border-purple-500/60 transition shadow-xl">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  BÁO CÁO NHANH
                </span>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">4. Sổ Điểm Điện Tử &amp; Xuất Excel (.CSV)</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Thống kê điểm trung bình môn, tỷ lệ hoàn thành bài tập, cảnh báo học sinh cần chú ý. Xuất sổ điểm ra file Excel chỉ với 1 click để nộp báo cáo chuyên môn cho nhà trường.
                </p>
              </div>
              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[11px] text-purple-300 font-mono">
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Thống kê điểm TB</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Xuất Excel 1 chạm</span>
                <span className="px-2 py-0.5 rounded bg-black/40 border border-white/10">✓ Theo dõi chuyên cần</span>
              </div>
            </div>
          </div>
        </div>"""

if 'HỆ SINH THÁI GIẢNG DẠY TIẾNG ANH THPT TOÀN DIỆN' not in tp_code:
    tp_code = tp_code.replace(lock_screen_target, lock_screen_replacement)

# Thêm Modal Giới Thiệu Tính Năng Chi Tiết (showTeacherFeatureModal)
feature_modal_code = """
      {/* MODAL GIỚI THIỆU TÍNH NĂNG DÀNH CHO GIÁO VIÊN */}
      {showTeacherFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-3xl rounded-3xl p-6 md:p-8 border border-cyan-500/40 bg-[#090f26] space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base md:text-lg text-white font-outfit">
                    Cẩm Nang Tính Năng Dành Cho Giáo Viên Tiếng Anh THPT
                  </h3>
                  <p className="text-xs text-slate-400">Hướng dẫn sử dụng và khai thác tối đa hệ thống</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTeacherFeatureModal(false)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-xs text-slate-300 leading-relaxed">
              {/* Quy trình 3 bước */}
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 space-y-2">
                <h4 className="font-bold text-cyan-300 text-sm flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  <span>Quy Trình 3 Bước Dành Cho Thầy/Cô:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="font-bold text-amber-400 font-mono">BƯỚC 1:</span>
                    <p className="font-semibold text-white">Soạn hoặc Tải Đề</p>
                    <p className="text-[11px] text-gray-400">Tải file Word (.docx) đề thi của Thầy/Cô lên hệ thống.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="font-bold text-cyan-400 font-mono">BƯỚC 2:</span>
                    <p className="font-semibold text-white">Xáo Đề hoặc Giao Bài</p>
                    <p className="text-[11px] text-gray-400">Tạo 4 mã đề in ấn hoặc cấp mã lớp cho học sinh làm bài.</p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="font-bold text-emerald-400 font-mono">BƯỚC 3:</span>
                    <p className="font-semibold text-white">AI Chấm &amp; Xuất Sổ Điểm</p>
                    <p className="text-[11px] text-gray-400">Hệ thống tự động chấm điểm và xuất file Excel nộp trường.</p>
                  </div>
                </div>
              </div>

              {/* Chi tiết từng tính năng */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <Shuffle className="w-4 h-4 text-amber-400" />
                    <span>Công Cụ Xáo Đề Thi Word (.docx/.doc) Chuẩn Quốc Gia</span>
                  </h5>
                  <p>• <strong>Đọc file Word thông minh:</strong> Tích hợp thư viện Mammoth trích xuất chính xác câu hỏi và 4 phương án từ file Word của giáo viên.</p>
                  <p>• <strong>Sinh 4 mã đề:</strong> Đảo trật tự câu và các phương án A, B, C, D ngẫu nhiên, tự động sinh Bảng Ma Trận Đáp Án Chuẩn.</p>
                  <p>• <strong>Xuất file Word chuẩn A4:</strong> Có sẵn khung tiêu đề Sở GD&ĐT, Trường THPT, SBD, căn đều 2 cột đẹp mắt.</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>Không Gian Quản Trị Lớp Học Trực Tuyến</span>
                  </h5>
                  <p>• <strong>Mã Lớp Bảo Mật:</strong> Cấp mã lớp (ví dụ: <span className="text-amber-400 font-mono font-bold">ENG-10A1-26</span>) cho học sinh. Học sinh chỉ thấy lớp của mình, không can thiệp được lớp khác.</p>
                  <p>• <strong>Giao Bài Kiểm Tra Tự Do:</strong> Thầy/Cô tự tải file đề thi của mình lên giao cho lớp làm bài trực tuyến có đếm giờ.</p>
                  <p>• <strong>Chống Gian Lận:</strong> Khóa đáp án và lời giải chi tiết khi học sinh đang làm bài, chỉ mở khóa sau khi nộp bài.</p>
                </div>

                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <h5 className="font-bold text-white text-sm flex items-center gap-2">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>Sổ Điểm Điện Tử &amp; Xuất Báo Cáo Excel</span>
                  </h5>
                  <p>• AI chấm trắc nghiệm ngay khi học sinh nộp bài và tự động lưu điểm vào sổ điểm của lớp.</p>
                  <p>• Tải file Excel Sổ Điểm (.CSV) danh sách cả lớp chỉ với 1 click chuột.</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h5 className="font-bold text-white">Cần Hỗ Trợ Hoặc Cấp Key Miễn Phí?</h5>
                  <p className="text-[11px] text-blue-300">Liên hệ Zalo Admin để được kích hoạt tài khoản giáo viên ngay tức thì.</p>
                </div>
                <a
                  href="https://zalo.me/0975711254"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#0068FF] hover:bg-blue-600 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shrink-0"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Zalo: 0975.711.254</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
"""

if '{showTeacherFeatureModal && (' not in tp_code:
    # Chèn modal trước thẻ đóng return cuối cùng
    last_div_idx = tp_code.rfind('</div>')
    tp_code = tp_code[:last_div_idx] + feature_modal_code + '\n' + tp_code[last_div_idx:]

with open('frontend/src/components/TeacherPortal.jsx', 'w', encoding='utf-8') as f:
    f.write(tp_code)

print("TeacherPortal.jsx updated with stunning feature showcase cards and detailed modal guide!")
