import React, { useState, useRef } from 'react';
import {
  PenLine, Sparkles, CheckCircle2, XCircle, RefreshCw, ChevronRight,
  RotateCcw, Zap, Star, AlertCircle, Lightbulb, BookOpen, FileText,
  Layers, Volume2, Award, ArrowRight, Check, Copy, HelpCircle
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

// Danh sách đề bài viết đoạn văn / bài luận THPT mẫu
const ESSAY_PROMPTS = [
  {
    id: 'ai-education',
    title: 'Tác động của Trí tuệ Nhân tạo (AI) đối với Giáo dục',
    prompt: 'Write a paragraph (150-180 words) discussing the benefits and drawbacks of using Artificial Intelligence (AI) in education.',
    level: 'Lớp 12 - Nâng cao',
    category: 'Công nghệ & Giáo dục'
  },
  {
    id: 'environmental-protection',
    title: 'Giải pháp Bảo vệ Môi trường của Giới trẻ',
    prompt: 'Write a paragraph (150-180 words) about practical actions high school students can take to protect the environment.',
    level: 'Lớp 11 - 12',
    category: 'Môi trường & Xã hội'
  },
  {
    id: 'online-learning',
    title: 'Học Trực tuyến so với Học Truyền thống',
    prompt: 'Write a paragraph (150-180 words) comparing online learning and traditional classroom learning.',
    level: 'Lớp 10 - 11',
    category: 'Đời sống học đường'
  },
  {
    id: 'part-time-job',
    title: 'Học sinh THPT có nên đi làm thêm không?',
    prompt: 'Write a paragraph (150-180 words) about whether high school students should take part-time jobs.',
    level: 'Lớp 11 - 12',
    category: 'Kỹ năng sống'
  }
];

// Danh sách bài tập luyện viết câu nhanh
const SENTENCE_EXERCISES = [
  {
    id: 'grammar-check',
    label: 'Kiểm tra ngữ pháp',
    color: 'indigo',
    icon: CheckCircle2,
    description: 'Nhập câu tiếng Anh bất kỳ, AI sẽ phân tích ngữ pháp và cấu trúc câu.',
    placeholder: 'Nhập câu tiếng Anh của bạn vào đây (ví dụ: She don\'t like eating apples)...',
  },
  {
    id: 'translate-vi-en',
    label: 'Dịch Việt -> Anh',
    color: 'amber',
    icon: ChevronRight,
    description: 'Nhập câu tiếng Việt, AI sẽ cung cấp bản dịch chuẩn học thuật và nhận xét bản dịch của bạn.',
    placeholder: 'Nhập câu tiếng Việt cần dịch...',
  },
  {
    id: 'fill-blank',
    label: 'Điền từ thích hợp',
    color: 'emerald',
    icon: Lightbulb,
    description: 'AI tạo câu có chỗ trống (___), bạn điền từ thích hợp vào ô bên dưới.',
    placeholder: 'Nhập từ để điền vào chỗ trống...',
    hasPrompt: true,
  },
  {
    id: 'rewrite',
    label: 'Viết lại câu sửa lỗi',
    color: 'purple',
    icon: RotateCcw,
    description: 'AI đưa ra câu có lỗi ngữ pháp, bạn viết lại câu hoàn chỉnh cho đúng.',
    placeholder: 'Nhập câu đã sửa lại...',
    hasPrompt: true,
  },
];

export default function WritingPractice({ selectedGrade, keys }) {
  const [mainTab, setMainTab] = useState('essay'); // 'essay' | 'sentence'
  
  // State for Essay Mode
  const [selectedPrompt, setSelectedPrompt] = useState(ESSAY_PROMPTS[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [essayContent, setEssayContent] = useState('');
  const [essayOutline, setEssayOutline] = useState(null);
  const [essayVocab, setEssayVocab] = useState(null);
  const [modelEssay, setModelEssay] = useState(null);
  const [essayEvaluation, setEssayEvaluation] = useState(null);
  
  const [loadingOutline, setLoadingOutline] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [loadingGrading, setLoadingGrading] = useState(false);
  const [essayError, setEssayError] = useState('');

  // State for Sentence Mode
  const [activeSentenceType, setActiveSentenceType] = useState(SENTENCE_EXERCISES[0]);
  const [userInput, setUserInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [sentenceResult, setSentenceResult] = useState(null);
  const [sentenceLoading, setSentenceLoading] = useState(false);
  const [sentenceError, setSentenceError] = useState('');
  const [sessionCount, setSessionCount] = useState(0);

  const geminiKey = keys?.gemini || localStorage.getItem('api_gemini') || '';
  const groqKey = keys?.groq || localStorage.getItem('api_groq') || '';

  const getHeaders = () => {
    const h = {};
    if (geminiKey) h['X-Gemini-Key'] = geminiKey;
    if (groqKey) h['X-Groq-Key'] = groqKey;
    return h;
  };

  // Helper bóc tách JSON an toàn tuyệt đối từ phản hồi của LLM
  const parseSafeJSON = (raw) => {
    if (!raw) return null;
    if (typeof raw === 'object') return raw;
    try { return JSON.parse(raw); } catch (e) {}
    
    const cleaned = String(raw).replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    try { return JSON.parse(cleaned); } catch (e) {}
    
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      const jsonSub = cleaned.substring(firstBrace, lastBrace + 1);
      try { return JSON.parse(jsonSub); } catch (e) {}
    }
    return null;
  };

  // Tính số từ trong bài viết
  const wordCount = essayContent.trim() ? essayContent.trim().split(/\s+/).length : 0;
  const currentPromptText = customPrompt.trim() ? customPrompt : selectedPrompt.prompt;

  // 1. Sinh Dàn ý & Từ vựng gợi ý cho bài luận
  const handleGenerateOutline = async () => {
    setLoadingOutline(true);
    setEssayError('');
    setEssayOutline(null);
    setEssayVocab(null);

    const prompt = `You are a top-tier IELTS and Vietnamese National High School Exam (THPT) English Teacher.
Topic: "${currentPromptText}"
Target Grade: Grade ${selectedGrade || '12'}

Create a comprehensive writing guide for Vietnamese students in STRICT JSON format:
{
  "outline": {
    "topic_sentence": "Suggested opening topic sentence in English",
    "topic_sentence_vi": "Giải thích câu mở đoạn bằng tiếng Việt",
    "supporting_points": [
      {
        "point_en": "First supporting idea in English",
        "point_vi": "Giải thích luận điểm 1 bằng tiếng Việt",
        "example_en": "Specific evidence / example in English"
      },
      {
        "point_en": "Second supporting idea in English",
        "point_vi": "Giải thích luận điểm 2 bằng tiếng Việt",
        "example_en": "Specific evidence / example in English"
      }
    ],
    "concluding_sentence": "Suggested concluding sentence in English",
    "concluding_sentence_vi": "Giải thích câu kết đoạn bằng tiếng Việt"
  },
  "advanced_vocabulary": [
    {
      "word": "Academic word or collocation",
      "ipa": "/.../",
      "meaning": "Nghĩa tiếng Việt",
      "example": "Example sentence using this word"
    },
    {
      "word": "Another academic word",
      "ipa": "/.../",
      "meaning": "Nghĩa tiếng Việt",
      "example": "Example sentence using this word"
    },
    {
      "word": "Third academic phrase",
      "ipa": "/.../",
      "meaning": "Nghĩa tiếng Việt",
      "example": "Example sentence using this phrase"
    }
  ]
}
Return ONLY pure JSON.`;

    try {
      const headers = getHeaders();
      const res = await axios.post(`${API_BASE}/writing/practice-ai`, { prompt }, { headers });
      const parsed = parseSafeJSON(res.data?.reply);
      if (parsed && parsed.outline) {
        setEssayOutline(parsed.outline);
        setEssayVocab(parsed.advanced_vocabulary || []);
      } else {
        throw new Error('Dữ liệu dàn ý không hợp lệ');
      }
    } catch (err) {
      console.error(err);
      setEssayError('Không thể tạo dàn ý. Vui lòng kiểm tra lại kết nối hoặc API Key.');
    } finally {
      setLoadingOutline(false);
    }
  };

  // 2. Sinh Bài viết mẫu chuẩn 9-10
  const handleGenerateModelEssay = async () => {
    setLoadingModel(true);
    setEssayError('');
    setModelEssay(null);

    const prompt = `You are an expert English teacher. Write a Band 9.0 / High Distinction Model Paragraph (160-190 words) for Vietnamese high school students.
Topic: "${currentPromptText}"
Target Grade: Grade ${selectedGrade || '12'}

Return ONLY a pure JSON object with this exact structure:
{
  "title": "Clear English Title",
  "model_text": "The full polished English paragraph (160-190 words) using rich academic vocabulary, varied sentence structures, and logical transitions.",
  "translation_vi": "Bản dịch tiếng Việt hoàn chỉnh, tự nhiên và chuẩn văn phong học thuật.",
  "key_phrases": [
    {"phrase": "Highlight phrase 1", "meaning": "Nghĩa tiếng Việt"},
    {"phrase": "Highlight phrase 2", "meaning": "Nghĩa tiếng Việt"},
    {"phrase": "Highlight phrase 3", "meaning": "Nghĩa tiếng Việt"}
  ],
  "teacher_notes": "Nhận xét sư phạm về cấu trúc và cách liên kết câu trong bài mẫu (2-3 câu tiếng Việt)."
}`;

    try {
      const headers = getHeaders();
      const res = await axios.post(`${API_BASE}/writing/practice-ai`, { prompt }, { headers });
      const parsed = parseSafeJSON(res.data?.reply);
      if (parsed && parsed.model_text) {
        setModelEssay(parsed);
      } else {
        throw new Error('Dữ liệu bài mẫu không hợp lệ');
      }
    } catch (err) {
      console.error(err);
      setEssayError('Không thể tạo bài mẫu. Vui lòng thử lại.');
    } finally {
      setLoadingModel(false);
    }
  };

  // 3. Chấm điểm chi tiết 4 tiêu chí cho bài viết của học sinh
  const handleGradeEssay = async () => {
    if (!essayContent.trim() || wordCount < 30) {
      setEssayError('Vui lòng viết ít nhất 30 từ trước khi yêu cầu AI chấm điểm.');
      return;
    }

    setLoadingGrading(true);
    setEssayError('');
    setEssayEvaluation(null);

    const prompt = `You are a strict, constructive and highly pedagogical English Examiner for the Vietnamese National High School Graduation Exam (THPT Quốc gia).
Prompt: "${currentPromptText}"
Student Essay:
"""
${essayContent}
"""

Evaluate the student's essay thoroughly across 4 official criteria on a scale of 0 to 10.
Return ONLY pure JSON (no markdown):
{
  "overall_score": 0.0-10.0,
  "criteria": {
    "task_achievement": { "score": 0.0-10.0, "comment": "Nhận xét độ hoàn thành yêu cầu đề bài bằng tiếng Việt" },
    "coherence_cohesion": { "score": 0.0-10.0, "comment": "Nhận xét tính mạch lạc và liên kết câu bằng tiếng Việt" },
    "lexical_resource": { "score": 0.0-10.0, "comment": "Nhận xét vốn từ vựng và cụm từ bằng tiếng Việt" },
    "grammatical_accuracy": { "score": 0.0-10.0, "comment": "Nhận xét độ chính xác và đa dạng ngữ pháp bằng tiếng Việt" }
  },
  "general_feedback": "Đánh giá tổng quan điểm mạnh và điểm cần cải thiện (3-4 câu tiếng Việt).",
  "sentence_corrections": [
    {
      "original": "Original sentence with issues",
      "issue": "Giải thích lỗi ngữ pháp/từ vựng bằng tiếng Việt",
      "better_version": "Upgraded, natural and grammatically correct English version"
    }
  ],
  "improved_version": "A complete rewritten and polished version of the entire student essay at Band 8.5-9.0 level"
}`;

    try {
      const headers = getHeaders();
      const res = await axios.post(`${API_BASE}/writing/practice-ai`, { prompt }, { headers });
      const parsed = parseSafeJSON(res.data?.reply);
      if (parsed && (parsed.overall_score || parsed.criteria)) {
        setEssayEvaluation(parsed);
        setSessionCount(c => c + 1);
      } else {
        throw new Error('Dữ liệu chấm điểm không hợp lệ');
      }
    } catch (err) {
      console.error(err);
      setEssayError('Không thể chấm bài. Vui lòng kiểm tra lại kết nối hoặc API Key.');
    } finally {
      setLoadingGrading(false);
    }
  };

  // 4. Luyện viết câu nhanh
  const handleSentenceSubmit = async () => {
    if (!userInput.trim()) {
      setSentenceError('Vui lòng nhập nội dung trước khi gửi.');
      return;
    }
    setSentenceLoading(true);
    setSentenceError('');
    setSentenceResult(null);

    let prompt = '';
    if (activeSentenceType.id === 'grammar-check') {
      prompt = `Analyze this English sentence for Vietnamese high school students (Grade ${selectedGrade || '12'}): "${userInput}"
Return JSON: {"is_correct": true/false, "score": 0-10, "corrected": "corrected sentence", "errors": ["error 1"], "explanation": "giải thích tiếng Việt", "tip": "lời khuyên tiếng Việt"}`;
    } else if (activeSentenceType.id === 'translate-vi-en') {
      prompt = `Translate Vietnamese to English for high school: Vietnamese: "${userInput}", Student attempt: "${aiPrompt || 'none'}"
Return JSON: {"correct_translation": "best translation", "student_translation_score": 0-10, "feedback": "nhận xét tiếng Việt", "tip": "lời khuyên tiếng Việt"}`;
    } else if (activeSentenceType.id === 'fill-blank') {
      prompt = `Generate fill-in-blank for Grade ${selectedGrade}: Target word: "${userInput}"
Return JSON: {"sentence_with_blank": "Sentence with ___", "correct_answer": "word", "explanation": "giải thích tiếng Việt"}`;
    } else {
      prompt = `Generate sentence with grammar mistake and evaluate: "${userInput}"
Return JSON: {"original_wrong_sentence": "wrong sentence", "correct_rewrite": "correct sentence", "mistake_explanation": "giải thích tiếng Việt", "student_answer_score": 0-10, "student_answer_feedback": "nhận xét tiếng Việt"}`;
    }

    try {
      const headers = getHeaders();
      const res = await axios.post(`${API_BASE}/writing/practice-ai`, { prompt }, { headers });
      const parsed = parseSafeJSON(res.data?.reply);
      if (parsed) {
        setSentenceResult(parsed);
        setSessionCount(c => c + 1);
      } else {
        throw new Error('Dữ liệu kết quả câu không hợp lệ');
      }
    } catch (err) {
      setSentenceError('Lỗi kết nối AI. Vui lòng thử lại.');
    } finally {
      setSentenceLoading(false);
    }
  };

  return (
    <div className="space-y-8 w-full pb-16 animate-fade-in max-w-[1600px] mx-auto">
      
      {/* Hero Header */}
      <div className="glass rounded-3xl p-8 md:p-10 border border-purple-500/25 shadow-2xl relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#100c28] to-purple-950/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-purple-500/20 shrink-0">
              <PenLine className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-white font-outfit">
                  Luyện Viết &amp; Chấm Bài Luận AI
                </h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Chuẩn GDPT 2018
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Dàn ý thông minh • Bài viết mẫu chuẩn 9-10 • Chấm điểm 4 tiêu chí &amp; Sửa lỗi chi tiết từng câu
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 shrink-0">
            <button
              onClick={() => setMainTab('essay')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                mainTab === 'essay'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Chấm Bài Luận / Đoạn Văn</span>
            </button>
            <button
              onClick={() => setMainTab('sentence')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                mainTab === 'sentence'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Luyện Viết Câu Nhanh</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================== TAB 1: ESSAY & PARAGRAPH WRITING ===================== */}
      {mainTab === 'essay' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Topic Selection & Tools (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Topic Picker */}
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Chủ Đề Viết Đoạn Văn THPT
                </span>
                <span className="text-[10px] text-gray-500 font-bold">Lớp {selectedGrade || '12'}</span>
              </div>

              <div className="space-y-2.5">
                {ESSAY_PROMPTS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedPrompt(item); setCustomPrompt(''); }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition cursor-pointer ${
                      selectedPrompt.id === item.id && !customPrompt
                        ? 'bg-purple-600/20 border-purple-500/40 shadow-lg'
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{item.title}</span>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white/5 text-purple-300">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 italic">
                      "{item.prompt}"
                    </p>
                  </button>
                ))}
              </div>

              {/* Custom Topic Input */}
              <div className="pt-2 border-t border-white/5 space-y-2">
                <label className="text-[11px] font-bold text-gray-400 block">
                  Hoặc tự nhập đề bài của riêng bạn:
                </label>
                <input
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Ví dụ: Write a paragraph about why we should protect wildlife..."
                  className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-gray-600 outline-none focus:border-purple-500 transition"
                />
              </div>

              {/* Action Buttons: Gợi ý Dàn ý & Bài Mẫu */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleGenerateOutline}
                  disabled={loadingOutline}
                  className="px-4 py-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-200 border border-indigo-500/30 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {loadingOutline ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lightbulb className="w-3.5 h-3.5 text-amber-400" />}
                  <span>Xem Dàn Ý &amp; Từ Vựng</span>
                </button>

                <button
                  onClick={handleGenerateModelEssay}
                  disabled={loadingModel}
                  className="px-4 py-3 rounded-xl bg-pink-600/20 hover:bg-pink-600/30 text-pink-200 border border-pink-500/30 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {loadingModel ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5 text-pink-400" />}
                  <span>Bài Viết Mẫu 9-10</span>
                </button>
              </div>
            </div>

            {/* Outline Card Display */}
            {essayOutline && (
              <div className="glass-card rounded-3xl p-6 border border-indigo-500/25 space-y-4 animate-fade-in shadow-xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  <h3 className="font-extrabold text-sm text-white">Dàn Ý Gợi Ý Chuẩn Cấu Trúc</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-1">
                    <p className="font-bold text-indigo-300 uppercase text-[10px]">Câu Mở Đoạn (Topic Sentence):</p>
                    <p className="text-white font-semibold">{essayOutline.topic_sentence}</p>
                    <p className="text-gray-400 text-[11px] italic">{essayOutline.topic_sentence_vi}</p>
                  </div>

                  {essayOutline.supporting_points?.map((pt, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                      <p className="font-bold text-purple-300 uppercase text-[10px]">Luận Điểm {idx + 1}:</p>
                      <p className="text-white font-semibold">{pt.point_en}</p>
                      <p className="text-gray-400 text-[11px] italic">{pt.point_vi}</p>
                      {pt.example_en && (
                        <p className="text-emerald-300 text-[11px] pt-1 font-mono">Ví dụ: {pt.example_en}</p>
                      )}
                    </div>
                  ))}

                  <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20 space-y-1">
                    <p className="font-bold text-pink-300 uppercase text-[10px]">Câu Kết Đoạn (Conclusion):</p>
                    <p className="text-white font-semibold">{essayOutline.concluding_sentence}</p>
                    <p className="text-gray-400 text-[11px] italic">{essayOutline.concluding_sentence_vi}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Vocab Card */}
            {essayVocab && essayVocab.length > 0 && (
              <div className="glass-card rounded-3xl p-6 border border-emerald-500/25 space-y-4 animate-fade-in shadow-xl">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-extrabold text-sm text-white">Từ Vựng &amp; Cụm Từ Học Thuật (Band 8-9)</h3>
                </div>

                <div className="space-y-2.5">
                  {essayVocab.map((v, i) => (
                    <div key={i} className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-300 text-xs">{v.word}</span>
                        <span className="text-[10px] text-gray-400 font-mono">{v.ipa}</span>
                      </div>
                      <p className="text-xs text-white font-medium">{v.meaning}</p>
                      <p className="text-[11px] text-gray-400 italic">Ví dụ: "{v.example}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Model Essay Display */}
            {modelEssay && (
              <div className="glass-card rounded-3xl p-6 border border-pink-500/25 space-y-4 animate-fade-in shadow-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-pink-400" />
                    <h3 className="font-extrabold text-sm text-white">Bài Viết Mẫu Điểm 9-10 (Model Essay)</h3>
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                    Band 9.0
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-[#090d20] border border-white/10 text-gray-100 text-xs leading-relaxed font-medium space-y-2">
                    <p className="font-bold text-purple-300 text-sm">{modelEssay.title}</p>
                    <p>{modelEssay.model_text}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 text-gray-300 text-xs leading-relaxed italic space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider not-italic">Bản Dịch Tiếng Việt:</p>
                    <p>{modelEssay.translation_vi}</p>
                  </div>

                  {modelEssay.teacher_notes && (
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 leading-relaxed">
                      <strong>Lời khuyên giáo viên:</strong> {modelEssay.teacher_notes}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Writing Pad & AI Evaluation (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Writing Pad */}
            <div className="glass-card rounded-3xl p-6 md:p-8 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="font-extrabold text-base text-white font-outfit">Soạn Thảo Bài Viết Của Bạn</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Yêu cầu dung lượng khuyến nghị: 150 - 180 từ</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                    wordCount >= 140 && wordCount <= 190
                      ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      : 'bg-white/5 text-gray-400 border-white/10'
                  }`}>
                    {wordCount} Từ
                  </span>
                </div>
              </div>

              {/* Topic Prompt Reminder */}
              <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200">
                <span className="font-bold text-purple-300">Đề bài: </span>
                {currentPromptText}
              </div>

              <textarea
                value={essayContent}
                onChange={(e) => setEssayContent(e.target.value)}
                rows={10}
                placeholder="Write your English paragraph here. Focus on topic sentence, supporting arguments, cohesive devices, and conclusion..."
                className="w-full px-5 py-4 bg-[#080c1a] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500 transition resize-y leading-relaxed font-sans shadow-inner"
              />

              {essayError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {essayError}
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  onClick={() => { setEssayContent(''); setEssayEvaluation(null); }}
                  className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-xs font-bold transition cursor-pointer"
                >
                  Xóa Viết Lại
                </button>

                <button
                  onClick={handleGradeEssay}
                  disabled={loadingGrading || wordCount < 20}
                  className={`flex-1 flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-white font-extrabold text-sm transition cursor-pointer shadow-xl ${
                    loadingGrading || wordCount < 20
                      ? 'bg-purple-600/30 text-purple-400/50 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 shadow-purple-600/30 glow-btn-brand'
                  }`}
                >
                  {loadingGrading ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> AI Đang Chấm Điểm 4 Tiêu Chí...</>
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Nộp Bài &amp; Chấm Điểm Chi Tiết AI</>
                  )}
                </button>
              </div>
            </div>

            {/* AI Comprehensive Evaluation Result */}
            {essayEvaluation && (
              <div className="glass-card rounded-3xl p-6 md:p-8 border border-purple-500/30 space-y-6 animate-fade-in shadow-2xl bg-gradient-to-b from-[#0e122b] to-[#0a0d1e]">
                
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-xl shadow-purple-600/30">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white font-outfit">Kết Quả Phân Tích &amp; Sửa Lỗi Chi Tiết</h3>
                      <p className="text-xs text-gray-400">Đánh giá thực chất 4 tiêu chí chuẩn quốc tế &amp; Hướng dẫn sửa từng câu</p>
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> Đã hoàn thành đánh giá
                  </div>
                </div>

                {/* 4 Criteria Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Task Response */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300">1. Hoàn Thành Yêu Cầu (Task Response)</span>
                      <span className="text-[11px] font-bold text-emerald-400 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/20">
                        {essayEvaluation.criteria?.task_achievement?.score >= 8 ? 'Xuất sắc' : essayEvaluation.criteria?.task_achievement?.score >= 6.5 ? 'Đạt yêu cầu' : 'Cần bổ sung ý'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {essayEvaluation.criteria?.task_achievement?.comment}
                    </p>
                  </div>

                  {/* Coherence & Cohesion */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-300">2. Tính Mạch Lạc (Coherence &amp; Cohesion)</span>
                      <span className="text-[11px] font-bold text-indigo-300 px-2.5 py-0.5 rounded-md bg-indigo-500/15 border border-indigo-500/20">
                        {essayEvaluation.criteria?.coherence_cohesion?.score >= 8 ? 'Rất mạch lạc' : essayEvaluation.criteria?.coherence_cohesion?.score >= 6.5 ? 'Liên kết tốt' : 'Cần thêm từ nối'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {essayEvaluation.criteria?.coherence_cohesion?.comment}
                    </p>
                  </div>

                  {/* Lexical Resource */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-pink-300">3. Vốn Từ Vựng (Lexical Resource)</span>
                      <span className="text-[11px] font-bold text-pink-300 px-2.5 py-0.5 rounded-md bg-pink-500/15 border border-pink-500/20">
                        {essayEvaluation.criteria?.lexical_resource?.score >= 8 ? 'Từ vựng đa dạng' : essayEvaluation.criteria?.lexical_resource?.score >= 6.5 ? 'Đúng ngữ cảnh' : 'Cần tránh lặp từ'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {essayEvaluation.criteria?.lexical_resource?.comment}
                    </p>
                  </div>

                  {/* Grammatical Accuracy */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300">4. Độ Chính Xác Ngữ Pháp (Grammar)</span>
                      <span className="text-[11px] font-bold text-emerald-300 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/20">
                        {essayEvaluation.criteria?.grammatical_accuracy?.score >= 8 ? 'Chuẩn ngữ pháp' : essayEvaluation.criteria?.grammatical_accuracy?.score >= 6.5 ? 'Ít lỗi cơ bản' : 'Cần sửa cấu trúc'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {essayEvaluation.criteria?.grammatical_accuracy?.comment}
                    </p>
                  </div>

                </div>

                {/* General Teacher Feedback */}
                {essayEvaluation.general_feedback && (
                  <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-1.5">
                    <p className="text-xs font-extrabold text-indigo-300 uppercase tracking-wider">Nhận xét tổng quát từ Gia sư AI:</p>
                    <p className="text-xs text-gray-200 leading-relaxed">{essayEvaluation.general_feedback}</p>
                  </div>
                )}

                {/* Line-by-line Sentence Corrections */}
                {essayEvaluation.sentence_corrections && essayEvaluation.sentence_corrections.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> Chi Tiết Sửa Lỗi Từng Câu:
                    </h4>
                    <div className="space-y-2.5">
                      {essayEvaluation.sentence_corrections.map((c, i) => (
                        <div key={i} className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1.5">
                          <p className="text-xs text-red-300 line-through">"{c.original}"</p>
                          <p className="text-xs text-emerald-300 font-semibold">✓ Sửa lại: "{c.better_version}"</p>
                          <p className="text-[11px] text-gray-400 italic">Lý do: {c.issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Polished Upgraded Version */}
                {essayEvaluation.improved_version && (
                  <div className="p-5 rounded-2xl bg-[#070a18] border border-purple-500/30 space-y-2">
                    <p className="text-xs font-extrabold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                      <Star className="w-4 h-4 text-amber-400" /> Bản Nâng Cấp Hoàn Chỉnh (Band 9.0):
                    </p>
                    <p className="text-xs text-gray-200 leading-relaxed font-medium">
                      {essayEvaluation.improved_version}
                    </p>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      )}

      {/* ===================== TAB 2: SENTENCE WRITING PRACTICE ===================== */}
      {mainTab === 'sentence' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Exercise Types */}
          <div className="lg:col-span-1 space-y-3">
            <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider px-1">Chọn dạng bài tập câu:</p>
            {SENTENCE_EXERCISES.map(type => {
              const isActive = activeSentenceType.id === type.id;
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => { setActiveSentenceType(type); setUserInput(''); setSentenceResult(null); }}
                  className={`w-full text-left p-4 rounded-2xl border transition cursor-pointer ${
                    isActive ? 'bg-purple-600/20 border-purple-500/40 text-purple-300' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-purple-400' : 'text-gray-500'}`} />
                    <div>
                      <p className="text-sm font-extrabold text-white">{type.label}</p>
                      <p className="text-[10px] text-gray-500 leading-snug mt-0.5">{type.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Input & Result */}
          <div className="lg:col-span-2 space-y-5">
            <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-white/10 pb-3">
                <Sparkles className="w-4 h-4 text-purple-400" /> {activeSentenceType.label}
              </h3>

              <textarea
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                rows={3}
                placeholder={activeSentenceType.placeholder}
                className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:border-purple-500 transition resize-none font-medium"
              />

              {activeSentenceType.id === 'translate-vi-en' && (
                <input
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="Bản dịch tiếng Anh thử của bạn (có thể để trống)..."
                  className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-600 outline-none focus:border-amber-500 transition"
                />
              )}

              {sentenceError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {sentenceError}
                </div>
              )}

              <button
                onClick={handleSentenceSubmit}
                disabled={sentenceLoading || !userInput.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs shadow-xl cursor-pointer hover:opacity-95 transition flex items-center justify-center gap-2"
              >
                {sentenceLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>Phân Tích Câu Với AI</span>
              </button>
            </div>

            {sentenceResult && (
              <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-black text-emerald-400">
                    {sentenceResult.score ?? sentenceResult.student_translation_score ?? sentenceResult.student_answer_score ?? 9}/10
                  </span>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                    Đã hoàn thành
                  </span>
                </div>

                {sentenceResult.corrected && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                    <p className="font-bold text-gray-400 uppercase text-[10px]">Câu Đúng:</p>
                    <p className="text-white font-semibold">{sentenceResult.corrected}</p>
                  </div>
                )}

                {sentenceResult.correct_translation && (
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                    <p className="font-bold text-gray-400 uppercase text-[10px]">Bản Dịch Chuẩn:</p>
                    <p className="text-emerald-300 font-semibold">{sentenceResult.correct_translation}</p>
                  </div>
                )}

                {sentenceResult.explanation && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/10 text-xs text-gray-300">
                    {sentenceResult.explanation}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
