import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, Sparkles, RefreshCw, Copy, Check, 
  RotateCcw, Mic, Plus, ChevronDown, Award, BrainCircuit,
  HelpCircle, Lightbulb, Compass, Zap, BookOpen, Layers, Clock, 
  Volume2, MicOff, History, MessageSquare, Trash2, X, MessageSquarePlus
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

// Format inline markdown (bold, italic, inline code, cleaned LaTeX)
function formatInline(text) {
  if (!text) return '';
  return text
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\$([^\$]+)\$/g, '<span class="font-mono text-cyan-300">$1</span>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-bold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="text-slate-300 italic">$1</em>')
    .replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-white/10 text-cyan-300 font-mono text-xs">$1</code>');
}

function AIMessageBody({ content }) {
  if (!content) return null;
  const lines = content.split('\n');
  const elements = [];
  let currentList = [];
  let currentTable = [];
  let currentCallout = [];

  const flushList = (key) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`ul-${key}`} className="space-y-2 my-2.5 pl-2">
          {currentList.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0"></span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            </li>
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const flushCallout = (key) => {
    if (currentCallout.length > 0) {
      elements.push(
        <div key={`callout-${key}`} className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 via-indigo-950/50 to-slate-900/60 border border-blue-500/30 text-slate-200 text-xs md:text-sm font-medium my-3 shadow-lg space-y-1.5">
          {currentCallout.map((line, idx) => (
            <p key={idx} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          ))}
        </div>
      );
      currentCallout = [];
    }
  };

  const flushTable = (key) => {
    if (currentTable.length >= 2) {
      const rawHeader = currentTable[0];
      const headers = rawHeader.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
      
      const rawRows = currentTable.slice(1).filter(r => !/^\|?\s*[-:]+[-| :]*\|?$/.test(r.trim()));
      const rows = rawRows.map(r => r.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1));

      elements.push(
        <div key={`table-${key}`} className="overflow-x-auto my-4 rounded-2xl border border-white/15 shadow-xl bg-[#090f20]/80 backdrop-blur-md">
          <table className="w-full text-left text-xs md:text-sm text-slate-200 border-collapse">
            <thead className="bg-white/[0.08] border-b border-white/15 text-cyan-300 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                {headers.map((h, i) => (
                  <th key={i} className="px-4 py-3.5 border-r border-white/10 last:border-r-0 font-bold" dangerouslySetInnerHTML={{ __html: formatInline(h) }} />
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-medium">
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-white/[0.03] transition duration-150 odd:bg-transparent even:bg-white/[0.015]">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-3 border-r border-white/10 last:border-r-0" dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      currentTable = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      flushList(index);
      flushCallout(index);
      currentTable.push(trimmed);
      return;
    }

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
      flushTable(index);
      flushCallout(index);
      currentList.push(trimmed.replace(/^[-*]\s+|\d+\.\s+/, ''));
      return;
    }

    if (trimmed.startsWith('>')) {
      flushTable(index);
      flushList(index);
      currentCallout.push(trimmed.replace(/^>\s*/, ''));
      return;
    }

    flushList(index);
    flushTable(index);
    flushCallout(index);
    if (trimmed) {
      elements.push(
        <p key={`p-${index}`} className="text-sm text-slate-200 leading-relaxed my-1.5" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    }
  });

  flushList('end');
  flushTable('end');
  flushCallout('end');
  return <div className="space-y-1">{elements}</div>;
}

export default function ChatMentor({ selectedGrade, keys, currentUser, onNavigate }) {
  const userId = currentUser?.id ? String(currentUser.id) : (currentUser?.username ? String(currentUser.username) : 'guest');
  
  const [engineMode, setEngineMode] = useState('reasoning'); // 'reasoning' (DeepSeek 120B) | 'groq' | 'gemini' | 'openrouter'
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(null);
  
  const chatEndRef = useRef(null);

  // Tải danh sách lịch sử riêng biệt cho từng tài khoản
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`examora_chat_sessions_${userId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSessions(parsed);
        } else {
          setSessions([]);
        }
      } else {
        setSessions([]);
      }
    } catch (e) {
      setSessions([]);
    }
    setActiveSessionId(null);
    setMessages([]);
  }, [userId]);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getHeaders = () => {
    const headers = {};
    const geminiKey = keys?.gemini || localStorage.getItem('api_gemini') || '';
    const groqKey = keys?.groq || localStorage.getItem('api_groq') || '';
    const deepseekKey = keys?.deepseek || localStorage.getItem('api_deepseek') || '';
    const openrouterKey = keys?.openrouter || localStorage.getItem('api_openrouter') || '';
    const azureKey = keys?.azure || localStorage.getItem('api_azure') || '';

    if (geminiKey) headers['x-gemini-key'] = geminiKey;
    if (groqKey) headers['x-groq-key'] = groqKey;
    if (deepseekKey) headers['x-deepseek-key'] = deepseekKey;
    if (openrouterKey) headers['x-openrouter-key'] = openrouterKey;
    if (azureKey) headers['x-azure-key'] = azureKey;
    headers['x-engine-mode'] = engineMode;
    return headers;
  };

  // Lưu phiên chat vào bộ nhớ tài khoản
  const saveSessionState = (sessionId, updatedMessages, promptText = '') => {
    setSessions(prev => {
      let next;
      const idx = prev.findIndex(s => s.id === sessionId);
      const title = promptText ? (promptText.length > 40 ? promptText.slice(0, 40) + '...' : promptText) : 'Chủ điểm ôn tập';
      
      if (idx >= 0) {
        next = [...prev];
        next[idx] = {
          ...next[idx],
          messages: updatedMessages,
          updatedAt: new Date().toISOString()
        };
      } else {
        const newSession = {
          id: sessionId,
          title: title,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: updatedMessages
        };
        next = [newSession, ...prev];
      }
      try {
        localStorage.setItem(`examora_chat_sessions_${userId}`, JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  };

  // Bắt đầu phiên chat mới
  const handleNewChat = () => {
    setActiveSessionId(null);
    setMessages([]);
    setInputText('');
    setShowHistory(false);
  };

  // Chọn xem lại phiên chat cũ
  const handleSelectSession = (session) => {
    setActiveSessionId(session.id);
    setMessages(session.messages || []);
    setShowHistory(false);
  };

  // Xóa một phiên chat
  const handleDeleteSession = (sessionId, e) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== sessionId);
    setSessions(updated);
    try {
      localStorage.setItem(`examora_chat_sessions_${userId}`, JSON.stringify(updated));
    } catch (err) {}
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setMessages([]);
    }
  };

  // Xóa toàn bộ lịch sử của tài khoản này
  const handleClearAll = async () => {
    const ok = window.appConfirm 
      ? await window.appConfirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử tra cứu của tài khoản này không? Thao tác này không thể hoàn tác.", "Xóa Toàn Bộ Lịch Sử", { type: 'error', confirmText: 'Xóa Toàn Bộ' })
      : window.confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử tra cứu của tài khoản này không?");
    if (ok) {
      setSessions([]);
      setActiveSessionId(null);
      setMessages([]);
      try {
        localStorage.removeItem(`examora_chat_sessions_${userId}`);
      } catch (e) {}
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSpeak = (text, idx) => {
    if (!window.speechSynthesis) return;
    if (speakingIndex === idx) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[*#`|_$]/g, '').slice(0, 400);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    setSpeakingIndex(idx);
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Trình duyệt chưa hỗ trợ nhận diện giọng nói. Hãy dùng Google Chrome hoặc Microsoft Edge!');
      return;
    }
    if (isListening) {
      setIsListening(false);
      return;
    }
    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
        }
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      setIsListening(false);
    }
  };

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim()) return;

    const currentId = activeSessionId || `session_${Date.now()}`;
    if (!activeSessionId) {
      setActiveSessionId(currentId);
    }

    const newMessages = [
      ...messages,
      { role: 'user', content: textToSend }
    ];

    setMessages(newMessages);
    if (!customText) setInputText('');
    setIsLoading(true);

    // Lưu ngay tin nhắn của người dùng
    saveSessionState(currentId, newMessages, textToSend);

    const systemInstruction = `You are Socrates Examora AI, a brilliant, friendly, highly intelligent pedagogical AI Tutor created exclusively for Vietnamese high school students.
CONVERSATIONAL GUIDELINES:
1. Speak naturally, fluently, warmly and intelligently.
2. If greeted in English or Vietnamese (e.g. 'hello', 'chào bạn'), respond warmly and politely.
3. If asked to switch language (e.g. 'trl tiếng việt'), confirm warmly and answer in Vietnamese.
4. For all English questions (grammar, vocabulary, reading comprehension, writing, translations), deliver a comprehensive, deep explanation with:
   - 1. Bản chất & Khái niệm cốt lõi.
   - 2. Bảng so sánh Markdown trực quan (Tránh LaTeX \\text{}, hãy dùng text in đậm rõ ràng).
   - 3. Dấu hiệu nhận biết & Bẫy đề thi THPT phân hóa điểm 9+.
   - 4. Ví dụ minh họa thực tế & Bài tập vận dụng có đáp án.`;

    try {
      const response = await axios.post(
        `${API_BASE}/chat`, 
        { 
          messages: newMessages,
          system_instruction: systemInstruction
        },
        { headers: getHeaders() }
      );

      const aiReply = response.data?.reply || "Tôi có thể giúp gì cho bạn hôm nay?";
      const fullMessages = [...newMessages, { role: 'model', content: aiReply }];
      setMessages(fullMessages);
      saveSessionState(currentId, fullMessages, textToSend);
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
      let errMsg = "Xin lỗi, kết nối AI bị gián đoạn. Vui lòng thử lại trong giây lát.";
      if (error.response?.data?.detail) {
        errMsg = error.response.data.detail;
      }
      const fullMessages = [...newMessages, { role: 'model', content: errMsg }];
      setMessages(fullMessages);
      saveSessionState(currentId, fullMessages, textToSend);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = (index) => {
    const lastUser = messages.slice(0, index).reverse().find(m => m.role === 'user');
    if (lastUser) {
      handleSendMessage(lastUser.content);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-130px)] min-h-[560px] animate-fade-in relative">
      
      {/* ─── TOP CONTROL BAR (MODEL SELECTOR + HISTORY DRAWER BUTTON) ─── */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between border-b border-white/10 bg-slate-950/80 backdrop-blur-xl rounded-2xl mb-2 gap-2 shadow-lg overflow-x-auto scrollbar-none">
        
        {/* Left: History & New Chat Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              showHistory 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5'
            }`}
            title="Lịch sử tra cứu của tài khoản"
          >
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lịch sử ({sessions.length})</span>
          </button>

          <button
            onClick={handleNewChat}
            className="px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 hover:text-white border border-blue-500/30 cursor-pointer shadow-sm shrink-0"
            title="Tạo cuộc hội thoại mới"
          >
            <MessageSquarePlus className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Hội thoại mới</span>
          </button>
        </div>

        {/* Right: AI Engine Model Selector */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none shrink-0">
          {[
            { id: 'reasoning', label: '🧠 Tư Duy Sâu (DeepSeek 120B)', desc: 'Phân tích bẫy đề thi THPT 9+' },
            { id: 'groq', label: '⚡ Siêu Tốc (Fast 0.2s)', desc: 'Phản xạ tức thì, cực nhanh' },
            { id: 'gemini', label: '👁️ Đa Phương Thức (Gemini)', desc: 'Nhận diện hình ảnh & văn cảnh' },
            { id: 'openrouter', label: '🌐 Đa Mô Hình (OpenRouter)', desc: 'Claude 3.5, GPT-4o, Llama' },
          ].map((engine) => (
            <button
              key={engine.id}
              onClick={() => setEngineMode(engine.id)}
              className={`px-2.5 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer ${
                engineMode === engine.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 border border-blue-400/50'
                  : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5'
              }`}
              title={engine.desc}
            >
              <span>{engine.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ─── MAIN CHAT AREA WITH SLIDING HISTORY DRAWER ─── */}
      <div className="flex-1 flex overflow-hidden relative rounded-3xl border border-white/10 bg-[#080d1e]/80 backdrop-blur-xl shadow-2xl">
        
        {/* ─── HISTORY DRAWER SIDEBAR ─── */}
        {showHistory && (
          <aside className="w-72 sm:w-80 bg-[#070b19] border-r border-white/10 flex flex-col z-20 animate-fade-in shadow-2xl shrink-0">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-sm text-white font-outfit">Lịch sử tra cứu</span>
              </div>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Account Badge */}
            <div className="px-4 py-2 bg-white/[0.02] border-b border-white/5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Tài khoản: <strong className="text-cyan-300 font-bold">{currentUser?.full_name || currentUser?.username || 'Khách'}</strong></span>
              {sessions.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-rose-400 hover:text-rose-300 underline font-semibold cursor-pointer"
                >
                  Xóa hết
                </button>
              )}
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {sessions.length === 0 ? (
                <div className="text-center p-8 text-slate-500 text-xs space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-slate-600 opacity-50" />
                  <p>Chưa có lịch sử tra cứu nào.</p>
                  <p className="text-[10px] text-slate-600">Đặt câu hỏi để lưu lại phiên tra cứu!</p>
                </div>
              ) : (
                sessions.map((s) => {
                  const isActive = activeSessionId === s.id;
                  return (
                    <div
                      key={s.id}
                      onClick={() => handleSelectSession(s)}
                      className={`group p-3 rounded-2xl border transition text-left cursor-pointer flex items-center justify-between gap-2 ${
                        isActive
                          ? 'bg-blue-600/20 border-blue-500/40 text-white shadow-md'
                          : 'bg-white/[0.02] hover:bg-white/[0.06] border-white/5 text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                        <div className="truncate">
                          <p className="text-xs font-bold truncate leading-tight">{s.title}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(s.updatedAt || s.createdAt).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition cursor-pointer shrink-0"
                        title="Xóa phiên này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        )}

        {/* ─── CHAT MESSAGES CONTENT ─── */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          
          {/* Welcome Screen */}
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
              
              <div className="relative group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg border border-cyan-400/30 group-hover:scale-105 transition-all duration-300">
                  <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2 px-2">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  Socrates Examora AI • 24/7
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white font-outfit tracking-tight leading-snug">
                  Chào bạn, tôi có thể hỗ trợ gì cho bạn hôm nay?
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                  Gia sư AI 1:1 Độc quyền — Giải đáp chuyên sâu Ngữ pháp, Bẫy đề thi THPT, Từ vựng, và Viết luận tiếng Anh theo thời gian thực.
                </p>
              </div>

              {/* ══════════════════════════════════════════════════════════════════════════════ */}
              {/* PHÒNG THI NÓI & ĐỐI THOẠI AI (SPEAKING EXAM & SOCRATIC SIMULATOR) */}
              {/* ══════════════════════════════════════════════════════════════════════════════ */}
              <div className="w-full max-w-xl p-4 rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-black text-white">Phòng Thi Nói &amp; Đối Thoại AI</h4>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        MỚI • FULL ENGLISH
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Vấn đáp GDPT 2018 theo Unit, Tranh luận Socratic &amp; Phỏng vấn IELTS Band 8.5
                    </p>
                  </div>
                </div>
                {onNavigate && (
                  <button
                    onClick={() => onNavigate('speaking-exam')}
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition cursor-pointer shrink-0 shadow-md flex items-center justify-center gap-1.5"
                  >
                    <span>Vào Thi Nói</span>
                    <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
                  </button>
                )}
              </div>

              {/* ══════════════════════════════════════════════════════════════════════════════ */}
              {/* TÍNH MỚI KHKT: LOCAL-CONTEXT ROLEPLAY (LUYỆN NÓI TÌNH HUỐNG BẢN ĐỊA VIỆT NAM)  */}
              {/* ══════════════════════════════════════════════════════════════════════════════ */}
              <div className="w-full max-w-xl space-y-3 pt-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>🇻🇳 Luyện Nói Tình Huống Bản Địa Việt Nam (Local Roleplay)</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    TÍNH MỚI KHKT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    {
                      title: "🥖 Chỉ đường & Mua Bánh Mì cho khách Tây",
                      desc: "Đóng vai du khách nước ngoài muốn mua bánh mì pate & cà phê trứng",
                      prompt: "Hãy đóng vai một du khách người Anh lần đầu đến Việt Nam và hỏi tôi cách gọi một ổ bánh mì pate và ly cà phê trứng ở vỉa hè Hà Nội. Hãy nói chuyện bằng tiếng Anh thân thiện, và sau mỗi câu hỏi của bạn, hãy gợi ý cho tôi 3 cách trả lời: (1) Cơ bản, (2) Tự nhiên, (3) Pro như người bản xứ. Hãy bắt đầu chào tôi trước!"
                    },
                    {
                      title: "🏞️ Thuyết trình Danh Lam Thắng Cảnh Quê Hương",
                      desc: "Bám sát định hướng Giáo dục Địa phương Chương trình GDPT 2018",
                      prompt: "Hãy đóng vai một ban giám khảo hội thi nói tiếng Anh, lắng nghe và hướng dẫn tôi thuyết trình 2 phút giới thiệu về danh lam thắng cảnh hoặc đặc sản quê hương của tỉnh tôi. Hãy đặt câu hỏi mở đầu và gợi ý các từ vựng ăn điểm (Collocations) cho tôi!"
                    },
                    {
                      title: "🏫 Phỏng vấn tham gia CLB Tiếng Anh Cấp 3",
                      desc: "Tập dượt trả lời phỏng vấn ứng tuyển ban truyền thông / chuyên môn",
                      prompt: "Hãy đóng vai Chủ nhiệm CLB Tiếng Anh (English Club President) của trường THPT và phỏng vấn tôi bằng tiếng Anh để gia nhập CLB. Hãy đặt từng câu hỏi một và sửa lỗi ngữ pháp kèm cách diễn đạt tự nhiên hơn cho tôi nhé!"
                    },
                    {
                      title: "🛵 Đặt xe ôm công nghệ & Chỉ đường",
                      desc: "Xử lý tình huống giao tiếp đời thực nhanh gọn, tự tin",
                      prompt: "Hãy đóng vai một người bạn nước ngoài đi cùng tôi bị lạc đường ở Việt Nam và hỏi tôi cách đặt xe công nghệ (Grab/Be) và chỉ đường bằng tiếng Anh. Hãy bắt đầu hội thoại tự nhiên nhé!"
                    }
                  ].map((scenario, sIdx) => (
                    <button
                      key={sIdx}
                      onClick={() => handleSendMessage(scenario.prompt)}
                      className="p-3 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900/60 to-indigo-950/40 hover:from-amber-500/20 hover:to-indigo-900/50 border border-amber-500/30 hover:border-amber-400/60 text-left transition duration-200 cursor-pointer shadow-md group"
                    >
                      <strong className="text-xs font-bold text-amber-200 block group-hover:text-amber-100 transition">
                        {scenario.title}
                      </strong>
                      <span className="text-[10px] text-slate-400 block mt-0.5 leading-snug">
                        {scenario.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Prompts Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-xl pt-1 px-1">
                {[
                  { text: "Cách phân biệt Thì Hiện tại Hoàn thành & Quá khứ Đơn", icon: Clock, color: "text-emerald-400" },
                  { text: "Giải thích chi tiết Đại từ quan hệ (Who / Whom / Which / Whose)", icon: BookOpen, color: "text-cyan-400" },
                  { text: "Mẹo nhớ các cấu trúc Đảo ngữ (Inversion) ăn trọn điểm 9+", icon: Zap, color: "text-amber-400" },
                  { text: "Dịch & Phân tích ngữ pháp: 'Cá hồi là thực phẩm giàu dinh dưỡng'", icon: Compass, color: "text-purple-400" }
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(item.text)}
                    className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#0e172e]/80 hover:bg-[#1b2540] border border-white/10 hover:border-cyan-500/40 text-left text-xs text-slate-200 transition duration-200 flex items-start gap-2.5 sm:gap-3 group cursor-pointer shadow-lg backdrop-blur-sm active:scale-98"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition">
                      <Sparkles className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${item.color}`} />
                    </div>
                    <span className="font-medium leading-relaxed group-hover:text-white transition">
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
              {messages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={index} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}>
                    
                    {/* User Bubble */}
                    {isUser ? (
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl rounded-tr-md px-5 py-3 text-sm leading-relaxed max-w-[85%] md:max-w-[75%] shadow-lg border border-blue-400/20 font-medium">
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    ) : (
                      /* AI Message Body */
                      <div className="w-full space-y-3 pl-1 pr-4">
                        <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-1">
                          <div className="flex items-center gap-2">
                            <Bot className="w-4 h-4" />
                            <span>Socrates AI Mentor</span>
                          </div>
                          <button
                            onClick={() => handleSpeak(msg.content, index)}
                            className={`p-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                              speakingIndex === index
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse'
                                : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border-white/5'
                            }`}
                            title="Nghe AI đọc tiếng Anh bản ngữ"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">{speakingIndex === index ? 'Đang đọc...' : 'Nghe giọng đọc'}</span>
                          </button>
                        </div>

                        <div className="text-slate-100 text-sm leading-relaxed bg-[#0b1224]/80 p-5 md:p-6 rounded-3xl border border-white/10 shadow-lg">
                          <AIMessageBody content={msg.content} />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-1 text-slate-400 opacity-80 group-hover:opacity-100 transition pl-2">
                          <button
                            onClick={() => handleCopy(msg.content, index)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs"
                            title="Sao chép nội dung"
                          >
                            {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span className="text-[11px]">{copiedIndex === index ? 'Đã chép' : 'Sao chép'}</span>
                          </button>
                          <button
                            onClick={() => handleRegenerate(index)}
                            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs"
                            title="Tạo lại câu trả lời"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="text-[11px]">Tạo lại</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading State */}
              {isLoading && (
                <div className="flex items-center gap-3 pl-2 text-cyan-300 text-sm animate-pulse bg-cyan-950/40 p-3.5 rounded-2xl border border-cyan-500/25 max-w-md shadow-lg">
                  <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                  <span className="font-semibold text-xs">Socrates AI đang phân tích bẫy đề thi và soạn bài giảng chi tiết...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>
          )}

          {/* ─── FLOATING COCKPIT INPUT BAR ─── */}
          <div className="p-4 pt-2">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
              className="rounded-full bg-[#0c142b]/95 border border-cyan-500/30 hover:border-cyan-500/60 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-500/40 px-4 py-2.5 shadow-2xl backdrop-blur-2xl flex items-center gap-3 transition duration-200"
            >
              <button
                type="button"
                onClick={handleNewChat}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
                title="Bắt đầu hội thoại mới"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isListening ? "Đang lắng nghe bạn nói tiếng Anh..." : "Nhập câu hỏi, bài tập hoặc chủ điểm tiếng Anh cần giải đáp..."}
                disabled={isLoading}
                className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
              />

              <button
                type="button"
                onClick={handleVoiceInput}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
                  isListening
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-pulse'
                    : 'text-slate-400 hover:text-cyan-300 hover:bg-white/10'
                }`}
                title="Nói tiếng Anh trực tiếp qua Micro"
              >
                {isListening ? <MicOff className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition cursor-pointer shrink-0 ${
                  inputText.trim() && !isLoading
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95'
                    : 'text-slate-600 bg-white/5 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
              Socrates Examora AI • Lịch sử trò chuyện được lưu trữ độc lập theo tài khoản cá nhân
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
