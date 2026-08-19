import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, Sparkles, RefreshCw, Copy, Check, 
  RotateCcw, Mic, Plus, ChevronDown, Award, BrainCircuit,
  HelpCircle, Lightbulb, Compass, Zap, BookOpen, Layers
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

// Format inline markdown (bold, italic, inline code)
function formatInline(text) {
  if (!text) return '';
  return text
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
    }
    currentTable = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
      flushList(index);
      flushCallout(index);
      currentTable.push(trimmed);
      return;
    } else if (currentTable.length > 0) {
      flushTable(index);
    }

    if (trimmed.startsWith('>')) {
      flushList(index);
      flushTable(index);
      currentCallout.push(trimmed.replace(/^>\s*/, ''));
      return;
    } else if (currentCallout.length > 0) {
      flushCallout(index);
    }

    if (trimmed === '---') {
      flushList(index);
      flushTable(index);
      flushCallout(index);
      elements.push(<hr key={`hr-${index}`} className="border-white/10 my-3.5" />);
      return;
    }

    if (trimmed.startsWith('###') || trimmed.startsWith('##') || /^[1-9]\.\s+[A-ZÀ-Ỹ]/.test(trimmed)) {
      flushList(index);
      flushTable(index);
      flushCallout(index);
      const title = trimmed.replace(/^#+\s*/, '');
      elements.push(
        <h4 key={`h-${index}`} className="text-base font-bold text-white pt-3.5 pb-1 flex items-center gap-2">
          <span dangerouslySetInnerHTML={{ __html: formatInline(title) }} />
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^[•\-]\s*/.test(trimmed)) {
      flushTable(index);
      flushCallout(index);
      const cleanItem = trimmed.replace(/^[\*\-•]\s*/, '');
      currentList.push(cleanItem);
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

export default function ChatMentor({ selectedGrade, keys }) {
  const [selectedModel, setSelectedModel] = useState('Socrates Pro');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  
  const chatEndRef = useRef(null);

  const getHeaders = () => {
    const headers = {};
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

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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

    const systemInstruction = `You are Socrates AI English Mentor, a brilliant, friendly, highly intelligent pedagogical AI Tutor created exclusively for Vietnamese high school students.
CONVERSATIONAL GUIDELINES:
1. Speak naturally, fluently, warmly and intelligently.
2. If greeted in English or Vietnamese (e.g. 'hello', 'chào bạn'), respond warmly and politely.
3. If asked to switch language (e.g. 'trl tiếng việt'), confirm warmly and answer in Vietnamese.
4. For all English questions (grammar, vocabulary, reading comprehension, writing, translations), provide direct, crystal-clear, accurate explanations with practical examples.
5. Provide markdown comparison tables and structured bullet points when explaining complex topics.
6. Avoid robotic boilerplate. Be insightful, concise, encouraging and helpful.`;

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
      setMessages([...newMessages, { role: 'model', content: aiReply }]);
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
      let errMsg = "Xin lỗi, kết nối AI bị gián đoạn. Vui lòng thử lại trong giây lát.";
      if (error.response?.data?.detail) {
        errMsg = error.response.data.detail;
      }
      setMessages([...newMessages, { role: 'model', content: errMsg }]);
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
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[550px] animate-fade-in relative">
      
      {/* ─── BRANDED WELCOME SCREEN ─── */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
          
          {/* Custom Branded Socrates AI Badge */}
          <div className="relative group">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-cyan-500/25 border border-cyan-400/30 group-hover:scale-105 transition-all duration-300">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-lg -z-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              Socrates AI English Mentor • 24/7
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white font-outfit tracking-tight">
              Chào bạn, tôi có thể hỗ trợ gì cho bạn hôm nay?
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
              Trợ lý AI Độc quyền — Giải đáp mọi thắc mắc Ngữ pháp, Từ vựng, Dịch thuật và Luyện thi THPT Quốc gia theo thời gian thực.
            </p>
          </div>

          {/* Quick Prompts Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl pt-3">
            {[
              { text: "Giải thích chi tiết Đại từ quan hệ (Who / Whom / Which / Whose)", icon: BookOpen, color: "text-cyan-400" },
              { text: "Mẹo nhớ cách dùng Động từ To Be (Is / Are / Am) trong 3 giây", icon: Zap, color: "text-amber-400" },
              { text: "Cách phân biệt Thì Hiện tại Hoàn thành & Quá khứ Đơn", icon: Clock, color: "text-emerald-400" },
              { text: "Dịch & Phân tích ngữ pháp: 'Cá hồi là thực phẩm giàu dinh dưỡng'", icon: Compass, color: "text-purple-400" }
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(item.text)}
                className="p-4 rounded-2xl bg-[#0f172a]/80 hover:bg-[#1e293b]/90 border border-white/10 hover:border-cyan-500/40 text-left text-xs text-slate-200 transition duration-200 flex items-start gap-3 group cursor-pointer shadow-lg backdrop-blur-sm"
              >
                <div className="w-7 h-7 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-110 transition">
                  <Sparkles className={`w-3.5 h-3.5 ${item.color}`} />
                </div>
                <span className="font-medium leading-relaxed group-hover:text-white transition">
                  {item.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── MESSAGES STREAM ─── */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-6 space-y-6">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div key={index} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} group`}>
                
                {/* User Message Bubble */}
                {isUser ? (
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl rounded-tr-md px-5 py-3 text-sm leading-relaxed max-w-[85%] md:max-w-[70%] shadow-lg border border-blue-400/20 font-medium">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ) : (
                  /* Branded AI Message */
                  <div className="w-full space-y-3 pl-1 pr-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 mb-1">
                      <Bot className="w-4 h-4" />
                      <span>Socrates AI Mentor</span>
                    </div>

                    <div className="text-slate-100 text-sm leading-relaxed bg-[#0b1224]/60 p-4 md:p-5 rounded-3xl border border-white/10 shadow-lg">
                      <AIMessageBody content={msg.content} />
                    </div>

                    {/* Action Bar (Copy, Regenerate) */}
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

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 pl-2 text-cyan-300 text-sm animate-pulse bg-cyan-950/30 p-3 rounded-2xl border border-cyan-500/20 max-w-sm">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span className="font-semibold text-xs">Socrates AI đang suy luận và phân tích câu trả lời...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      )}

      {/* ─── BRANDED FLOATING COCKPIT INPUT BAR ─── */}
      <div className="p-4 pt-2">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
          className="rounded-full bg-[#0d162d]/95 border border-cyan-500/25 hover:border-cyan-500/50 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-500/40 px-4 py-2.5 shadow-2xl backdrop-blur-2xl flex items-center gap-3 transition duration-200"
        >
          {/* Add Option Button */}
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
            title="Tùy chọn học tập"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Prompt Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Nhập câu hỏi, bài tập hoặc chủ điểm tiếng Anh cần giải đáp..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
          />

          {/* Model Selector Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-bold text-cyan-300 shrink-0 cursor-pointer hover:bg-cyan-500/20 transition">
            <span>{selectedModel}</span>
            <ChevronDown className="w-3 h-3 text-cyan-400" />
          </div>

          {/* Mic Button */}
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
            title="Nhập bằng giọng nói"
          >
            <Mic className="w-4 h-4" />
          </button>

          {/* Send Button */}
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

        {/* Footer Subtext */}
        <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
          Socrates AI English Mentor • Nền tảng Ôn luyện & Đánh giá Năng lực Thích ứng THPT 2027
        </p>
      </div>

    </div>
  );
}
