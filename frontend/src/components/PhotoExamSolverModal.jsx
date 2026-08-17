import React, { useState, useRef } from 'react';
import { 
  Camera, Upload, Sparkles, CheckCircle2, BookOpen, AlertCircle, 
  HelpCircle, ArrowRight, RefreshCw, X, Lightbulb, FileText, Image as ImageIcon
} from 'lucide-react';
import axios from 'axios';

export default function PhotoExamSolverModal({ isOpen, onClose, selectedGrade, keys }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
      setSolution(null);
      setError(null);
    }
  };

  const handleSolve = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('grade', selectedGrade || '12');

    const headers = {};
    if (keys?.gemini) {
      headers['X-Gemini-Key'] = keys.gemini;
    }

    try {
      const res = await axios.post('/api/ai/solve-photo', formData, { headers });
      if (res.data && res.data.data) {
        setSolution(res.data.data);
      } else {
        throw new Error("Không nhận được dữ liệu giải từ máy chủ");
      }
    } catch (err) {
      console.error("Lỗi giải đề qua ảnh:", err);
      setError("Không thể nhận diện hoặc giải bức ảnh này. Vui lòng kiểm tra lại ảnh chụp rõ nét hơn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass rounded-3xl border border-white/10 p-6 md:p-8 bg-[#0a0d14]/95 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Chụp Ảnh Giải Đề &amp; Hướng Dẫn Sư Phạm AI</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                  Khối Lớp {selectedGrade}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Nhận diện câu hỏi từ ảnh chụp • Lời giải chi tiết bám sát chuẩn kiến thức Bộ GD&amp;ĐT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload / Preview Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Left: Image Box */}
          <div className="space-y-4">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#070a14] group">
                <img 
                  src={imagePreview} 
                  alt="Đề bài chụp" 
                  className="w-full max-h-80 object-contain mx-auto"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer backdrop-blur"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Đổi ảnh khác</span>
                </button>
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-2xl border-2 border-dashed border-white/15 hover:border-blue-500/50 bg-[#0d1424] text-center cursor-pointer transition flex flex-col items-center justify-center gap-3 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:scale-110 transition">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white group-hover:text-blue-300 transition">
                    Nhấn để tải lên hoặc chụp ảnh bài tập
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Hỗ trợ ảnh JPG, PNG, WebP (câu hỏi trắc nghiệm, bài đọc, sắp xếp câu)
                  </div>
                </div>
              </div>
            )}

            {imagePreview && (
              <button
                onClick={handleSolve}
                disabled={loading}
                className="btn-primary w-full py-3.5 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-500/20"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>AI Đang Phân Tích &amp; Giải Đề...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Bắt Đầu Nhận Diện &amp; Giải Chi Tiết</span>
                  </>
                )}
              </button>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Right: AI Pedagogical Solution Display */}
          <div className="space-y-4">
            {solution ? (
              <div className="space-y-4 animate-fade-in">
                {/* Recognized prompt box */}
                <div className="p-4 rounded-xl bg-[#0f172a] border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>NỘI DUNG NHẬN DIỆN TỪ ẢNH</span>
                    <span className="text-blue-400 font-mono">{solution.task_type}</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {solution.recognized_question}
                  </p>
                </div>

                {/* Correct answer badge */}
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-400 block">
                      ĐÁP ÁN CHÍNH XÁC
                    </span>
                    <span className="text-base font-black text-white font-mono mt-0.5 block">
                      {solution.correct_answer}
                    </span>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>

                {/* Step by step explanation */}
                <div className="p-4 rounded-xl bg-[#0d1424] border border-white/5 space-y-2">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Hướng dẫn giải sư phạm chi tiết:
                  </span>
                  <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {solution.step_by_step_explanation}
                  </div>
                </div>

                {/* Key vocabulary */}
                {solution.key_vocabulary && solution.key_vocabulary.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#0d1424] border border-white/5 space-y-2">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">
                      Từ vựng trọng tâm cần nhớ:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {solution.key_vocabulary.map((v, i) => (
                        <div key={i} className="p-2 rounded-lg bg-white/5 text-xs text-slate-200 flex flex-col">
                          <span className="font-bold text-white">{v.word} <span className="font-mono text-[10px] text-slate-400 font-normal">{v.ipa}</span></span>
                          <span className="text-[11px] text-slate-400">{v.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exam Tip */}
                {solution.exam_tip && (
                  <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 flex items-start gap-2.5">
                    <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300 block mb-0.5">Mẹo làm bài thi:</span>
                      <p className="leading-relaxed">{solution.exam_tip}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 text-xs space-y-2 border border-white/5 rounded-2xl bg-[#080d1a]">
                <Camera className="w-8 h-8 mx-auto text-slate-600" />
                <p>Tải ảnh đề bài ở cột bên trái và bấm <strong>"Bắt Đầu Giải Chi Tiết"</strong> để AI phân tích và đưa ra lời giải sư phạm.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
