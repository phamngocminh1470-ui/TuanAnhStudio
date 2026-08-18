import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Send, Mic, Volume2, Loader2, Sparkles, User, 
  Copy, RotateCcw, Check, Plus, ChevronDown, Bot
} from 'lucide-react';

const API_BASE = '/api';

function formatInline(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.*?)\*/g, '<span class="text-slate-300 italic">$1</span>')
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
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0"></span>
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
      // Dòng 0 là headers
      const rawHeader = currentTable[0];
      const headers = rawHeader.split('|').map(c => c.trim()).filter((c, i, arr) => i > 0 && i < arr.length - 1);
      
      // Các dòng còn lại bỏ dòng divider (|---|---|)
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

    // Xử lý Table (dòng bắt đầu và kết thúc bằng | hoặc có chứa |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.length > 2) {
      flushList(index);
      flushCallout(index);
      currentTable.push(trimmed);
      return;
    } else if (currentTable.length > 0) {
      flushTable(index);
    }

    // Xử lý Callout / Quote (bắt đầu bằng >)
    if (trimmed.startsWith('>')) {
      flushList(index);
      flushTable(index);
      currentCallout.push(trimmed.replace(/^>\s*/, ''));
      return;
    } else if (currentCallout.length > 0) {
      flushCallout(index);
    }

    // Đường kẻ phân cách ---
    if (trimmed === '---') {
      flushList(index);
      flushTable(index);
      flushCallout(index);
      elements.push(<hr key={`hr-${index}`} className="border-white/10 my-3.5" />);
      return;
    }

    // Tiêu đề ## hoặc ### hoặc "1. Tiêu đề"
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

    // Danh sách đầu dòng (* hoặc -)
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || /^[•\-]\s*/.test(trimmed)) {
      flushTable(index);
      flushCallout(index);
      const cleanItem = trimmed.replace(/^[\*\-•]\s*/, '');
      currentList.push(cleanItem);
      return;
    }

    // Dòng văn bản thông thường
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
  const [selectedModel, setSelectedModel] = useState('Flash-Lite');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  
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

    const systemInstruction = `You are Gemini Pro English AI Tutor, a modern, highly intelligent, and natural pedagogical mentor for Vietnamese students.
CONVERSATIONAL STYLE:
1. Speak naturally, fluently, and engagingly just like the official Google Gemini Pro.
2. If greeted in English or Vietnamese (e.g. 'hello', 'chào bạn'), respond naturally and politely without rigid templates.
3. If asked to switch language (e.g. 'trl tiếng việt'), confirm warmly and answer in Vietnamese.
4. For all English questions (grammar, vocabulary, reading comprehension, writing, translations), provide direct, crystal-clear, accurate explanations with practical examples.
5. Avoid rigid robotic boilerplate headers. Be insightful, concise, and helpful.`;

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
      
      {/* Empty State / Welcome Screen */}
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold text-white font-outfit bg-gradient-to-r from-blue-400 via-indigo-200 to-purple-400 bg-clip-text text-transparent">
              Chào bạn, tôi có thể giúp gì hôm nay?
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Hỏi bất kỳ điều gì về Ngữ pháp, Từ vựng, Dịch thuật, hoặc Luyện thi Tiếng Anh THPT Quốc gia cùng Gemini AI.
            </p>
          </div>

          {/* Quick Prompts Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg pt-4">
            {[
              "Hello! Giới thiệu về bạn nhé",
              "Giải thích Đại từ quan hệ Who / Whom / Which",
              "Cách phân biệt Thì Hiện tại Hoàn thành & Quá khứ Đơn",
              "Dịch câu: Cá hồi là thực phẩm giàu dinh dưỡng"
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-left text-xs text-slate-300 hover:text-white transition duration-200 flex items-center justify-between group cursor-pointer shadow-sm hover:border-blue-500/40"
              >
                <span>{prompt}</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-400 opacity-0 group-hover:opacity-100 transition shrink-0 ml-2" />
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
                
                {/* User Message Bubble */}
                {isUser ? (
                  <div className="bg-[#1e293b] text-slate-100 rounded-3xl px-5 py-3 text-sm leading-relaxed max-w-[80%] md:max-w-[70%] shadow-md border border-white/5">
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                ) : (
                  /* AI Message (Clean Markdown + Actions Toolbar) */
                  <div className="w-full space-y-3 pl-1 pr-4">
                    <div className="text-slate-100 text-sm leading-relaxed">
                      <AIMessageBody content={msg.content} />
                    </div>

                    {/* Action Bar (Copy, TTS, Regenerate) */}
                    <div className="flex items-center gap-2 pt-1 text-slate-400 opacity-70 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleCopy(msg.content, index)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs"
                        title="Sao chép nội dung"
                      >
                        {copiedIndex === index ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => handleRegenerate(index)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition cursor-pointer"
                        title="Tạo lại câu trả lời"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 pl-1 text-slate-400 text-sm animate-pulse">
              <Sparkles className="w-4 h-4 text-blue-400 animate-spin" />
              <span>Gemini đang suy nghĩ...</span>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>
      )}

      {/* Floating Bottom Pill Container (Gemini Style) */}
      <div className="p-4 pt-2">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} 
          className="rounded-full bg-[#0d1527]/90 border border-white/15 px-4 py-2.5 shadow-2xl backdrop-blur-xl flex items-center gap-3 hover:border-white/25 focus-within:border-blue-500/60 transition duration-200"
        >
          {/* Action Plus Button */}
          <button
            type="button"
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0"
            title="Thêm đính kèm"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Prompt Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Hỏi Gemini..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />

          {/* Model Selector Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold text-slate-300 shrink-0 cursor-pointer hover:bg-white/10 transition">
            <span>{selectedModel}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
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
                ? 'bg-white text-slate-900 shadow-md hover:bg-slate-200'
                : 'text-slate-600 bg-white/5 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Subtext */}
        <p className="text-[11px] text-center text-slate-500 mt-2 font-medium">
          Gemini là AI và có thể mắc sai sót. Hãy kiểm tra lại thông tin quan trọng.
        </p>
      </div>

    </div>
  );
}
