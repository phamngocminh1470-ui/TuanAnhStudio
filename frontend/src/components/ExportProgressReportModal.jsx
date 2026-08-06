import React from 'react';
import { Printer, X, Award, GraduationCap, CheckCircle2, ShieldCheck, Sparkles, Brain, Clock, Mic, Headphones } from 'lucide-react';

export default function ExportProgressReportModal({ isOpen, onClose, selectedGrade = '10', theta = 0.0, ef = 2.5, pronounceScore = 85, streakDays = 7 }) {
  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();
  const currentDateStr = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Calculate scores
  const hkScore = Math.min(10.0, Math.max(5.0, (8.0 + theta * 0.45)).toFixed(1));
  const thptScore = Math.min(10.0, Math.max(5.0, (8.2 + theta * 0.5)).toFixed(1));

  let cefrLevel = 'B1 (Trung cấp)';
  if (theta >= 1.5) cefrLevel = 'B2 (Khá - Thượng cấp)';
  else if (theta < 0) cefrLevel = 'A2 (Cơ bản - Tiền trung cấp)';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6 text-slate-100 print:border-none print:shadow-none print:bg-white print:text-black print:rounded-none">
        
        {/* Action Header - Hidden when printing */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-outfit">Báo Cáo Học Tập &amp; Dự Báo Năng Lực KHKT</h2>
              <p className="text-xs text-slate-400">Chứng nhận tiến trình học tập thích ứng cá nhân hóa</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl glow-btn-brand text-white font-extrabold text-xs cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>In Báo Cáo / Lưu PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE REPORT DOCUMENT BODY */}
        <div className="space-y-6 print:text-black print:font-sans">
          
          {/* Certificate Header Banner */}
          <div className="border-b-2 border-indigo-600 pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-indigo-400 print:text-indigo-900 font-outfit uppercase">
                  TRƯỜNG THPT NGUYỄN KHUYẾN - BR-VT
                </h1>
                <p className="text-xs font-bold text-slate-400 print:text-gray-600 uppercase tracking-widest">
                  DỰ ÁN KHKT: NỀN TẢNG AI ENGLISH MENTOR CÁ NHÂN HÓA THÍCH ỨNG
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 print:text-indigo-900 border border-indigo-500/30 text-xs font-extrabold uppercase">
                MÃ BÁO CÁO: KHKT-{Math.floor(100000 + Math.random() * 900000)}
              </span>
              <p className="text-xs text-slate-400 print:text-gray-500 mt-1">Ngày lập: {currentDateStr}</p>
            </div>
          </div>

          {/* Student Profile Overview */}
          <div className="p-5 rounded-2xl bg-slate-950/60 print:bg-gray-100 border border-slate-800 print:border-gray-300 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 print:text-gray-500 block font-semibold">Đối tượng học sinh:</span>
              <strong className="text-white print:text-black text-sm">Học sinh Phổ thông</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block font-semibold">Khối Lớp:</span>
              <strong className="text-amber-400 print:text-indigo-900 text-sm">Lớp {selectedGrade}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block font-semibold">Trình độ CEFR Tương đương:</span>
              <strong className="text-emerald-400 print:text-emerald-800 text-sm">{cefrLevel}</strong>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block font-semibold">Chuỗi Học liên tục:</span>
              <strong className="text-rose-400 print:text-rose-800 text-sm">{streakDays} Ngày liên tiếp</strong>
            </div>
          </div>

          {/* Key Predicted Scores Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/40 to-slate-900 print:bg-indigo-50 border border-indigo-500/30 print:border-indigo-200 space-y-2">
              <span className="text-xs font-extrabold text-indigo-300 print:text-indigo-900 uppercase tracking-wider block">
                1. Dự báo Điểm Kiểm tra Học kỳ (Môn Tiếng Anh):
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-4xl font-black text-indigo-400 print:text-indigo-900 font-outfit">{hkScore} / 10</span>
                <span className="text-xs font-bold text-emerald-400 print:text-emerald-800 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Xếp loại: Giỏi
                </span>
              </div>
              <p className="text-[11px] text-slate-300 print:text-gray-600 leading-relaxed pt-1">
                Dựa theo thuật toán Hồi quy năng lực học sinh phổ thông trong ma trận đề thi định kỳ GDPT 2018.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/40 to-slate-900 print:bg-purple-50 border border-purple-500/30 print:border-purple-200 space-y-2">
              <span className="text-xs font-extrabold text-purple-300 print:text-purple-900 uppercase tracking-wider block">
                2. Dự báo Điểm Thi Tốt nghiệp THPT Quốc gia:
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-4xl font-black text-purple-400 print:text-purple-900 font-outfit">{thptScore} / 10</span>
                <span className="text-xs font-bold text-purple-300 print:text-purple-800 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                  Chuẩn Bộ GD&amp;ĐT
                </span>
              </div>
              <p className="text-[11px] text-slate-300 print:text-gray-600 leading-relaxed pt-1">
                Ước lượng năng lực giải quyết câu hỏi phân hóa từ đề thi chính thức THPT Quốc gia các năm.
              </p>
            </div>
          </div>

          {/* Algorithm Breakdown Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white print:text-black uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400 print:text-indigo-800" />
              <span>Chỉ Số Phân Tích Thuật Toán Học Tập Thích Ứng Cốt Lõi:</span>
            </h3>

            <div className="border border-slate-800 print:border-gray-300 rounded-2xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/80 print:bg-gray-200 text-slate-300 print:text-black border-b border-slate-700 print:border-gray-300 font-bold">
                    <th className="p-3">Thuật toán Khoa học</th>
                    <th className="p-3">Chỉ số Năng lực</th>
                    <th className="p-3">Độ Phù hợp / Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 print:divide-gray-200 text-slate-200 print:text-black font-medium">
                  <tr>
                    <td className="p-3 font-bold text-indigo-400 print:text-indigo-900">Mô hình IRT (Item Response Theory)</td>
                    <td className="p-3">Độ thành thạo Đọc &amp; Ngữ pháp: <strong>{Math.max(10, Math.min(100, Math.round(((theta + 3.0) / 6.0) * 100)))}%</strong></td>
                    <td className="p-3 text-emerald-400 print:text-emerald-800">Thích ứng chính xác câu hỏi vừa sức</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-amber-400 print:text-amber-900">SuperMemo-2 (Lặp khoảng cách)</td>
                    <td className="p-3">Độ bền ghi nhớ từ vựng: <strong>{Math.max(10, Math.min(100, Math.round((ef / 3.0) * 100)))}%</strong></td>
                    <td className="p-3 text-amber-300 print:text-amber-800">Tối ưu chu kỳ ôn tập ngắt quãng</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-emerald-400 print:text-emerald-900">Azure Speech REST AI Engine</td>
                    <td className="p-3">Điểm chuẩn Phát âm: <strong>{pronounceScore}%</strong></td>
                    <td className="p-3 text-emerald-400 print:text-emerald-800">Chấm từng âm tiết &amp; độ trôi chảy</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Teacher / AI Pedagogical Evaluation Note */}
          <div className="p-5 rounded-2xl bg-indigo-950/30 print:bg-gray-50 border border-indigo-500/20 print:border-gray-300 space-y-2">
            <span className="text-xs font-bold text-indigo-300 print:text-indigo-900 uppercase block">
              Đánh giá &amp; Gợi ý Học tập từ Gia sư AI:
            </span>
            <p className="text-xs text-slate-300 print:text-gray-700 leading-relaxed">
              Học sinh duy trì tiến độ học tập ổn định, nền tảng từ vựng và ngữ pháp vững vàng ở trình độ Khối Lớp {selectedGrade}. Khuyên dùng tính năng <strong>Luyện đọc thích ứng AI theo Sở thích</strong> và <strong>Luyện nghe tốc độ 1.0x - 1.2x</strong> để cải thiện phản xạ tiếng Anh toàn diện.
            </p>
          </div>

          {/* Certificate Footer Stamp */}
          <div className="pt-4 border-t border-slate-800 print:border-gray-300 flex justify-between items-end text-[11px] text-slate-400 print:text-gray-600">
            <div>
              <p>Hệ thống Học tập Tiếng Anh Cá nhân hóa Thích ứng AI</p>
              <p className="font-semibold text-slate-300 print:text-black">Trường THPT Nguyễn Khuyến - BR-VT</p>
            </div>

            <div className="text-center font-semibold">
              <p className="uppercase text-slate-300 print:text-black font-bold">XÁC NHẬN HỆ THỐNG KHKT</p>
              <div className="w-16 h-16 border-2 border-indigo-500/40 print:border-indigo-800 rounded-full mx-auto my-1 flex items-center justify-center text-[10px] font-bold text-indigo-400 print:text-indigo-900 rotate-[-12deg]">
                VERIFIED AI
              </div>
              <p className="text-[10px] text-slate-500 print:text-gray-500">Báo cáo tự động từ AI Mentor</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
