import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, Mic, Square, Volume2, Loader2, Sparkles, BookOpen, 
  User, HelpCircle, Lightbulb, Compass, MessageSquare, Flame, CheckCircle2 
} from 'lucide-react';

const API_BASE = '/api';

function formatInline(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-amber-300 font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<span class="text-cyan-300 font-medium">$1</span>')
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-cyan-200 font-mono text-xs">$1</code>');
}

function AIMessageBody({ content }) {
  if (!content) return null;
  const lines = content.split('\n');
  const elements = [];
  let currentList = [];
  let inCallout = false;
  let calloutLines = [];

  const flushList = (key) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="space-y-2 my-2.5 pl-1">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs md:text-sm text-slate-200 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0 shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const flushCallout = (key) => {
    if (calloutLines.length > 0) {
      elements.push(
        <div key={`callout-${key}`} className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 to-indigo-950/50 border border-blue-500/30 text-blue-100 text-xs md:text-sm font-medium my-3 shadow-lg space-y-1.5">
          {calloutLines.map((line, idx) => (
            <p key={idx} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          ))}
        </div>
      );
      calloutLines = [];
      inCallout = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Phân cách ---
    if (trimmed === '---') {
      flushList(index);
      flushCallout(index);
      elements.push(<hr key={`hr-${index}`} className="border-slate-800 my-3" />);
      return;
    }

    // Khối Chú ý / Mẹo bẫy (bắt đầu bằng 💡 hoặc 📌 hoặc >)
    if (trimmed.startsWith('💡') || trimmed.startsWith('📌') || trimmed.startsWith('>')) {
      flushList(index);
      inCallout = true;
      calloutLines.push(trimmed.replace(/^>\s*/, ''));
      return;
    }

    if (inCallout) {
      if (trimmed === '') {
        flushCallout(index);
      } else {
        calloutLines.push(trimmed);
      }
      return;
    }

    // Tiêu đề ### hoặc ## hoặc "1. Bản chất & Mục đích"
    if (trimmed.startsWith('###') || trimmed.startsWith('##') || /^[1-9]\.\s+[A-ZÀ-Ỹ]/.test(trimmed)) {
      flushList(index);
      flushCallout(index);
      const title = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <h4 key={`h-${index}`} className="text-sm md:text-base font-bold text-cyan-400 pt-3 pb-1 border-b border-white/5 flex items-center gap-2">
          <span className="w-1.5 h-3.5 rounded-full bg-cyan-400 inline-block shadow-[0_0_8px_rgba(6,182,212,0.8)]"></span>
          <span dangerouslySetInnerHTML={{ __html: formatInline(title) }} />
        </h4>
      );
      return;
    }

    // Danh sách đầu dòng (* hoặc -)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^[•\-]\s*/.test(trimmed)) {
      const cleanItem = trimmed.replace(/^[\*\-•]\s*/, '');
      currentList.push(cleanItem);
      return;
    }

    // Dòng thông thường
    flushList(index);
    if (trimmed) {
      elements.push(
        <p key={`p-${index}`} className="text-xs md:text-sm text-slate-200 leading-relaxed my-1.5" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    }
  });

  flushList('end');
  flushCallout('end');
  return <div className="space-y-1">{elements}</div>;
}

export default function ChatMentor({ selectedGrade, keys }) {
  const [mentorMode, setMentorMode] = useState('socratic'); // 'socratic' | 'direct'
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: "Xin chào! Thầy là **Socrates AI Mentor** — Gia sư Tiếng Anh của em. Thầy sẽ hướng dẫn em suy luận từng bước để chinh phục mọi dạng bài thi THPT Quốc gia. Em đang gặp khó khăn ở phần nào hôm nay?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  
  const chatEndRef = useRef(null);

  // Tạo headers chứa API keys động gửi lên backend
  const getHeaders = (isMultipart = false) => {
    const headers = {};
    if (isMultipart) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    const geminiKey = keys?.gemini || localStorage.getItem('api_gemini') || localStorage.getItem('gemini_api_key') || '';
    const groqKey = keys?.groq || localStorage.getItem('api_groq') || localStorage.getItem('groq_api_key') || '';
    const azureKey = keys?.azure || localStorage.getItem('api_azure') || localStorage.getItem('azure_speech_key') || '';

    if (geminiKey) headers['x-gemini-key'] = geminiKey;
    if (groqKey) headers['x-groq-key'] = groqKey;
    if (azureKey) headers['x-azure-key'] = azureKey;
    return headers;
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const newMessages = [
      ...messages,
      { role: 'user', content: textToSend }
    ];

    setMessages(newMessages);
    if (!customText) setInputText('');
    setIsLoading(true);

    const getSystemInstruction = (grade, mode) => {
      let instruction = `You are Socrates AI English Mentor, an expert pedagogical tutor for Vietnamese high school students (Grade ${grade || '12'}) preparing for the National High School Graduation Exam (THPT Quốc Gia).\n`;
      
      if (mode === 'socratic') {
        instruction += "METHODOLOGY: PURE SOCRATIC GUIDANCE (GỢI MỞ TƯ DUY TỪNG BƯỚC). " +
          "1. NEVER give the direct final answer immediately unless the student has tried multiple times. " +
          "2. Ask guiding questions, point out grammar clues, explain root causes of errors, and scaffold their reasoning step-by-step. " +
          "3. Praise their effort when they make progress. " +
          "4. You can explain terms in Vietnamese to ensure deep pedagogical understanding while encouraging English responses.";
      } else {
        instruction += "METHODOLOGY: COMPREHENSIVE DIRECT TUTORING. " +
          "1. Provide detailed explanations, model answers, vocabulary breakdowns, and grammar rules clearly in Vietnamese and English. " +
          "2. Point out common traps in the Vietnamese National High School Graduation Exam (THPT Quốc gia).";
      }

      return instruction;
    };

    try {
      const response = await axios.post(
        `${API_BASE}/chat`, 
        { 
          messages: newMessages,
          system_instruction: getSystemInstruction(selectedGrade, mentorMode)
        },
        { headers: getHeaders() }
      );

      const aiReply = response.data?.reply || "Thầy đã nhận được câu hỏi. Em hãy thử phân tích các từ khóa chính trong câu xem sao nhé!";
      setMessages([...newMessages, { role: 'model', content: aiReply }]);
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
      let errMsg = "Xin lỗi em, kết nối gia sư AI bị gián đoạn. Thầy gợi ý em kiểm tra lại API Key hoặc đặt câu hỏi ngắn gọn hơn nhé!";
      if (error.response?.data?.detail) {
        errMsg = error.response.data.detail;
      }
      setMessages([...newMessages, { role: 'model', content: errMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Thầy hướng dẫn em cách phân biệt Thì Hiện tại Hoàn thành và Quá khứ Đơn",
    "Làm sao để tránh bẫy câu Mệnh đề quan hệ trong đề thi THPT?",
    "Thầy gợi ý cho em dàn ý bài viết về chủ đề Bảo vệ Môi trường",
    "Em hay bị nhầm trọng âm từ có 3 âm tiết, thầy chỉ em mẹo với!"
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold text-white font-outfit">Socrates AI Tutor</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30 uppercase tracking-wider">
                  Gia sư Socratic 1:1
                </span>
              </div>
              <p className="text-xs text-gray-300 mt-1">
                Phương pháp gợi mở tư duy từng bước • Chẩn đoán bẫy đề thi &amp; Hướng dẫn giải chi tiết 24/7
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 shrink-0">
            <button
              onClick={() => setMentorMode('socratic')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                mentorMode === 'socratic'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Gợi Mở Socratic (Tư duy)</span>
            </button>
            <button
              onClick={() => setMentorMode('direct')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                mentorMode === 'direct'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Giải Đáp Trực Tiếp</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Box */}
      <div className="glass-card rounded-3xl border border-white/10 shadow-2xl flex flex-col h-[650px] overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div key={index} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                  isUser 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
                </div>

                <div className={`max-w-[85%] rounded-2xl p-5 text-sm leading-relaxed shadow-xl ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none font-medium'
                    : 'bg-[#0c1222] text-slate-100 border border-slate-800/80 rounded-tl-none space-y-2'
                }`}>
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <AIMessageBody content={msg.content} />
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Compass className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-[#0c1222] border border-slate-800/80 text-xs text-gray-400 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
                <span>Gia sư AI đang suy nghĩ câu hỏi gợi ý cho em...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-6 py-3 border-t border-white/5 bg-white/[0.01] flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider shrink-0">Gợi ý câu hỏi:</span>
          {quickPrompts.map((qp, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qp)}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-[11px] font-medium shrink-0 transition cursor-pointer truncate max-w-xs"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-4 border-t border-white/10 bg-[#070a16] flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Hỏi bài tập hoặc chia sẻ suy nghĩ của em để thầy hướng dẫn từng bước..."
              disabled={isLoading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition pr-12"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className={`p-3.5 rounded-2xl flex items-center justify-center transition cursor-pointer ${
              inputText.trim() && !isLoading
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/5 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
