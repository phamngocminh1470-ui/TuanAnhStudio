import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, Mic, Square, Volume2, Loader2, Sparkles, BookOpen, 
  User, HelpCircle, Lightbulb, Compass, MessageSquare, Flame, CheckCircle2 
} from 'lucide-react';

const API_BASE = '/api';

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

  // Gửi tin nhắn
  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) setInputText('');
    
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    // Xây dựng System Instruction theo triết lý Socratic
    const getSystemInstruction = (grade, mode) => {
      let instruction = "You are Socrates AI Mentor, an elite, patient and inspiring English Teacher for Vietnamese High School Students (Grade " + (grade || "12") + "). ";
      
      if (mode === 'socratic') {
        instruction += "METHODOLOGY: SOCRATIC TEACHING METHOD. " +
          "1. NEVER give the full answer immediately if the student asks for a solution to an exercise or question. " +
          "2. Instead, ask guided, thought-provoking questions, highlight key grammar clues or signal words in the sentence, and encourage the student to think step-by-step. " +
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
    <div className="space-y-6 w-full pb-16 animate-fade-in max-w-[1600px] mx-auto">
      
      {/* Header */}
      <div className="glass rounded-3xl p-6 md:p-8 border border-blue-500/25 shadow-2xl relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0a1028] to-blue-950/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 shrink-0">
              <Compass className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white font-outfit">Socrates AI Tutor</h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
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
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                  isUser 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
                </div>

                <div className={`max-w-[80%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-lg ${
                  isUser
                    ? 'bg-purple-600 text-white rounded-tr-none'
                    : 'bg-[#090e22] text-gray-100 border border-white/10 rounded-tl-none space-y-2'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Compass className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 rounded-2xl bg-[#090e22] border border-white/10 text-xs text-gray-400 flex items-center gap-2">
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
        <div className="p-4 border-t border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
              placeholder={mentorMode === 'socratic' ? "Hỏi bài tập hoặc chia sẻ suy nghĩ của em để thầy hướng dẫn từng bước..." : "Nhập câu hỏi ngữ pháp, đề thi hoặc yêu cầu dịch..."}
              className="flex-1 px-5 py-3.5 bg-white/[0.04] border border-white/10 rounded-2xl text-xs md:text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition font-medium"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputText.trim()}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl cursor-pointer transition flex items-center gap-2 shrink-0 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Gửi</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
