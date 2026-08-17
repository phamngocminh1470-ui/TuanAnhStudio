import React, { useState, useRef } from 'react';
import {
  PenLine, Sparkles, CheckCircle2, XCircle, RefreshCw, ChevronRight,
  RotateCcw, Zap, Star, AlertCircle, Lightbulb
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

// --- Prompts for each exercise type ---
const EXERCISE_TYPES = [
  {
    id: 'grammar-check',
    label: 'Kiem tra ngu phap',
    color: 'indigo',
    icon: CheckCircle2,
    description: 'Nhap cau tieng Anh bat ky, AI se phan tich ngu phap va chinh ta.',
    placeholder: 'Nhap cau tieng Anh cua ban vao day...',
  },
  {
    id: 'translate-vi-en',
    label: 'Dich Viet -> Anh',
    color: 'amber',
    icon: ChevronRight,
    description: 'Nhap cau tieng Viet, AI se cho biet cach dich chinh xac va cau da dich cua ban.',
    placeholder: 'Nhap cau tieng Viet can dich...',
  },
  {
    id: 'fill-blank',
    label: 'Dien tu thich hop',
    color: 'emerald',
    icon: Lightbulb,
    description: 'AI se tao cau co cho trong (___), ban dien tu thich hop vao o phia duoi.',
    placeholder: 'Nhap tu de dien vao cho trong...',
    hasPrompt: true,
  },
  {
    id: 'rewrite',
    label: 'Viet lai cau',
    color: 'purple',
    icon: RotateCcw,
    description: 'AI cho mot cau co loi, ban sua lai cho dung ngu phap.',
    placeholder: 'Nhap cau da sua lai...',
    hasPrompt: true,
  },
];

function buildPrompt(exerciseType, userInput, aiPrompt, grade) {
  if (exerciseType === 'grammar-check') {
    return `You are an expert English teacher for Vietnamese high school students (Grade ${grade}).
Analyze this English sentence for grammar, spelling, and vocabulary:
"${userInput}"

Return ONLY a JSON object with this structure (no markdown):
{
  "is_correct": true/false,
  "score": 0-10,
  "corrected": "corrected sentence if wrong, else same",
  "errors": ["list of specific errors found"],
  "explanation": "brief explanation in Vietnamese (1-2 sentences)",
  "tip": "one learning tip in Vietnamese"
}`;
  }
  if (exerciseType === 'translate-vi-en') {
    return `You are an expert English-Vietnamese translator and teacher for Grade ${grade} Vietnamese students.
The student wants to translate: "${userInput}"
The student's attempted translation (may be empty or partially filled): "${aiPrompt || 'not provided'}"

Return ONLY a JSON object (no markdown):
{
  "correct_translation": "best English translation",
  "student_translation_score": 0-10 (0 if no student attempt),
  "feedback": "feedback on student translation in Vietnamese",
  "tip": "one grammar or vocabulary tip in Vietnamese"
}`;
  }
  if (exerciseType === 'fill-blank') {
    return `You are an English teacher. Generate a fill-in-the-blank exercise for Grade ${grade} Vietnamese students.
Create ONE sentence with exactly one blank (___) at a meaningful position.
The correct answer should be: "${userInput || 'any appropriate word'}"

Return ONLY a JSON object (no markdown):
{
  "sentence_with_blank": "The ___ sentence goes here.",
  "correct_answer": "correct word",
  "explanation": "why this word fits (in Vietnamese)",
  "alternative_answers": ["other possible correct answers"]
}`;
  }
  if (exerciseType === 'rewrite') {
    return `You are an English teacher for Grade ${grade} Vietnamese students.
Generate ONE English sentence with a grammar mistake (appropriate for this grade level).
Then evaluate the student's correction: "${userInput || 'not provided yet'}"

Return ONLY a JSON object (no markdown):
{
  "original_wrong_sentence": "The sentence with a mistake",
  "correct_rewrite": "The correctly rewritten sentence",
  "mistake_explanation": "explanation of what was wrong (in Vietnamese)",
  "student_answer_score": 0-10 (0 if no student answer),
  "student_answer_feedback": "feedback on student answer in Vietnamese"
}`;
  }
  return '';
}

function ResultCard({ result, exerciseType }) {
  if (!result) return null;
  const isGood = result.score >= 7 || result.student_translation_score >= 7 || result.student_answer_score >= 7;

  return (
    <div className={`rounded-2xl border p-5 space-y-4 ${isGood ? 'bg-emerald-950/30 border-emerald-500/25' : 'bg-red-950/20 border-red-500/20'}`}>
      {/* Score row */}
      {(result.score !== undefined || result.student_translation_score !== undefined || result.student_answer_score !== undefined) && (
        <div className="flex items-center gap-3">
          <div className={`text-3xl font-black ${isGood ? 'text-emerald-400' : 'text-red-400'}`}>
            {result.score ?? result.student_translation_score ?? result.student_answer_score ?? '-'}/10
          </div>
          {result.is_correct !== undefined && (
            <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${result.is_correct ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' : 'bg-red-500/15 text-red-300 border border-red-500/25'}`}>
              {result.is_correct ? 'Chính xác' : 'Cần sửa'}
            </span>
          )}
        </div>
      )}

      {/* Corrected / Correct answer */}
      {result.corrected && (
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Cau chinh xac:</p>
          <p className="text-sm font-bold text-white">{result.corrected}</p>
        </div>
      )}
      {result.correct_translation && (
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Ban dich chinh xac:</p>
          <p className="text-sm font-bold text-emerald-200">{result.correct_translation}</p>
        </div>
      )}
      {result.sentence_with_blank && (
        <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Cau co cho trong:</p>
          <p className="text-sm font-bold text-white">{result.sentence_with_blank}</p>
          <p className="text-xs text-indigo-300 mt-1">Dap an: <strong>{result.correct_answer}</strong></p>
        </div>
      )}
      {result.original_wrong_sentence && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Cau co loi:</p>
          <p className="text-sm text-red-200 line-through">{result.original_wrong_sentence}</p>
          <p className="text-xs text-emerald-300 mt-1 font-bold">Cau dung: {result.correct_rewrite}</p>
        </div>
      )}

      {/* Errors */}
      {result.errors && result.errors.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Loi can sua:</p>
          {result.errors.map((e, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-red-300">
              <XCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-red-400" />
              <span>{e}</span>
            </div>
          ))}
        </div>
      )}

      {/* Explanation / Feedback */}
      {(result.explanation || result.feedback || result.mistake_explanation || result.student_answer_feedback) && (
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8">
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Giai thich:</p>
          <p className="text-xs text-gray-300 leading-relaxed">
            {result.explanation || result.feedback || result.mistake_explanation || result.student_answer_feedback}
          </p>
        </div>
      )}

      {/* Tip */}
      {result.tip && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200 leading-relaxed">{result.tip}</p>
        </div>
      )}
    </div>
  );
}

export default function WritingPractice({ selectedGrade, keys }) {
  const [activeType, setActiveType] = useState(EXERCISE_TYPES[0]);
  const [userInput, setUserInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionCount, setSessionCount] = useState(0);
  const inputRef = useRef(null);

  const geminiKey = keys?.gemini || localStorage.getItem('api_gemini') || '';

  const handleSubmit = async () => {
    if (!userInput.trim()) {
      setError('Vui long nhap noi dung truoc khi gui.');
      return;
    }
    if (!geminiKey) {
      setError('Ban chua cai dat Gemini API Key. Vao Settings de nhap key.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    const prompt = buildPrompt(activeType.id, userInput.trim(), aiPrompt.trim(), selectedGrade);
    try {
      const headers = {};
      if (geminiKey) {
        headers['X-Gemini-Key'] = geminiKey;
      }
      const res = await axios.post(
        `${API_BASE}/writing/practice-ai`,
        { prompt },
        { headers }
      );
      const raw = res.data?.reply || '';
      const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);
      setResult(parsed);
      setSessionCount(c => c + 1);
    } catch (err) {
      setError('Khong the ket noi AI hoac phan tich ket qua. Kiem tra lai API Key va thu lai.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setUserInput('');
    setAiPrompt('');
    setResult(null);
    setError('');
    inputRef.current?.focus();
  };

  const typeColors = {
    indigo: { active: 'bg-indigo-600/20 text-indigo-300 border-indigo-500/30', icon: 'text-indigo-400' },
    amber: { active: 'bg-amber-600/20 text-amber-300 border-amber-500/30', icon: 'text-amber-400' },
    emerald: { active: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30', icon: 'text-emerald-400' },
    purple: { active: 'bg-purple-600/20 text-purple-300 border-purple-500/30', icon: 'text-purple-400' },
  };

  return (
    <div className="space-y-6 w-full pb-16 animate-fade-in max-w-[1600px] mx-auto">
      {/* Hero Header */}
      <div className="glass rounded-3xl p-7 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0b0c1e] to-purple-950/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/20 shrink-0">
              <PenLine className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white font-outfit">
                Luyen viet cau AI
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Cham diem ngu phap, dich thuat, dien tu — phan tich theo thoi gian thuc boi Gemini AI
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-gray-400 font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
              <span className="text-white font-extrabold">{sessionCount}</span> luot luyen hom nay
            </div>
            {!geminiKey && (
              <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-500/10 border border-amber-500/20 px-3 py-2 rounded-xl font-bold">
                <AlertCircle className="w-3.5 h-3.5" /> Chua co Gemini Key
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Exercise Type Selector */}
        <div className="lg:col-span-1 space-y-3">
          <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider px-1">Chon loai bai tap:</p>
          {EXERCISE_TYPES.map(type => {
            const colors = typeColors[type.color];
            const Icon = type.icon;
            const isActive = activeType.id === type.id;
            return (
              <button
                key={type.id}
                onClick={() => { setActiveType(type); handleReset(); }}
                className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer ${
                  isActive ? `${colors.active} border` : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? colors.icon : 'text-gray-500'}`} />
                  <div>
                    <p className={`text-sm font-extrabold ${isActive ? '' : 'text-gray-300'}`}>{type.label}</p>
                    <p className="text-[10px] text-gray-500 leading-snug mt-0.5">{type.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Input + Result */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="font-extrabold text-sm text-white">{activeType.label}</h3>
            </div>

            <div className="space-y-3">
              <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                {activeType.id === 'grammar-check' ? 'Nhap cau tieng Anh:' :
                 activeType.id === 'translate-vi-en' ? 'Nhap cau tieng Viet can dich:' :
                 activeType.id === 'fill-blank' ? 'Nhap tu can dien (hoac de trong de AI tu tao):' :
                 'Nhap cau da sua lai (de AI tao cau co loi):'}
              </label>
              <textarea
                ref={inputRef}
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSubmit(); }}
                rows={3}
                placeholder={activeType.placeholder}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500 transition resize-none font-medium leading-relaxed"
              />

              {activeType.id === 'translate-vi-en' && (
                <>
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wider block">
                    Ban dich thu cua ban (tieng Anh — co the de trong):
                  </label>
                  <input
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Nhap ban dich tieng Anh cua ban..."
                    className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:border-amber-500 transition"
                  />
                </>
              )}

              <p className="text-[10px] text-gray-600 font-medium">Ctrl + Enter de gui nhanh</p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-bold">
                <XCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading || !userInput.trim()}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-white font-extrabold text-xs transition cursor-pointer shadow-xl ${
                  loading || !userInput.trim()
                    ? 'bg-purple-600/30 text-purple-400/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 glow-btn-brand'
                }`}
              >
                {loading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Dang phan tich...</>
                ) : (
                  <><Zap className="w-4 h-4" /> Phan tich AI (Gemini)</>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer text-xs font-bold"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* AI Result */}
          {result && (
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Star className="w-4 h-4 text-amber-400" />
                <h3 className="font-extrabold text-sm text-white">Ket qua phan tich AI</h3>
              </div>
              <ResultCard result={result} exerciseType={activeType.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
