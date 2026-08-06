import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Mic, Square, Volume2, Loader2, Sparkles, BookOpen, User, HelpCircle } from 'lucide-react';

const API_BASE = '/api';

export default function ChatMentor({ selectedGrade, keys }) {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content: "Hello! I am your AI English Mentor. I can help you practice conversations, check your grammar, or prepare for tests. Let's chat! What would you like to talk about today?"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  
  const chatEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Tạo headers chứa API keys động gửi lên backend
  const getHeaders = (isMultipart = false) => {
    const headers = {};
    if (isMultipart) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    if (keys?.gemini) headers['x-gemini-key'] = keys.gemini;
    if (keys?.groq) headers['x-groq-key'] = keys.groq;
    if (keys?.azure) headers['x-azure-key'] = keys.azure;
    return headers;
  };

  // Tự động cuộn xuống cuối đoạn chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Gửi tin nhắn dạng Text
  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!textToSend) setInputText('');
    
    // Cập nhật giao diện với tin nhắn của người dùng
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setIsLoading(true);

    // Cấu hình prompt động bám sát trình độ khối lớp
    const getSystemInstruction = (grade) => {
      const base = "You are an encouraging and patient AI English Mentor named Antigravity. " +
        "Your task is to help Vietnamese students learn English. Always respond in clear, grammatically correct English. " +
        "If the student speaks Vietnamese, you can guide them back to English gently. " +
        "Keep your responses concise, friendly, and pedagogically sound.";
      if (grade === '6' || grade === '7') {
        return base + " Target user is a grade 6-7 student (CEFR A1 level). Use very simple vocabulary, short sentences, and explain difficult phrases using simple Vietnamese translation if necessary. Speak at a slow and clear pace.";
      } else if (grade === '8' || grade === '9') {
        return base + " Target user is a grade 8-9 student (CEFR A2 level). Use simple and intermediate vocabulary, moderately short sentences, and encourage them to explain their ideas in English.";
      } else {
        return base + " Target user is a high school student (CEFR B1-B2 level). Use natural conversation speed, introduce advanced/idiomatic vocabulary, and challenge them to write longer paragraphs.";
      }
    };

    try {
      // Gọi API Chatbot backend có kèm header key động và prompt động theo lớp
      const response = await axios.post(
        `${API_BASE}/chat`, 
        { 
          messages: newMessages,
          system_instruction: getSystemInstruction(selectedGrade)
        },
        { headers: getHeaders() }
      );

      const aiReply = response.data.reply;
      setMessages([...newMessages, { role: 'model', content: aiReply }]);
      
      // Tự động phát âm thanh phản hồi của AI nếu muốn
      playTTS(aiReply, newMessages.length);
    } catch (error) {
      console.error("Lỗi gửi tin nhắn:", error);
      let errMsg = "Sorry, I encountered an error connecting to my AI core. Please make sure the backend server is running.";
      if (error.response?.data?.detail) {
        errMsg = error.response.data.detail;
      }
      setMessages([...newMessages, { role: 'model', content: errMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Chuyển văn bản thành giọng nói và phát (TTS)
  const playTTS = async (text, id) => {
    try {
      setPlayingAudioId(id);
      const response = await axios.post(
        `${API_BASE}/tts`, 
        { text }, 
        { 
          responseType: 'blob',
          headers: getHeaders()
        }
      );
      
      const audioBlob = response.data;
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => setPlayingAudioId(null);
      audio.onerror = () => setPlayingAudioId(null);
      
      await audio.play();
    } catch (error) {
      console.error("Lỗi phát TTS:", error);
      setPlayingAudioId(null);
    }
  };

  // Bắt đầu ghi âm từ microphone
  const startRecording = async () => {
    audioChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        
        // Gửi file âm thanh lên backend STT
        setIsLoading(true);
        const formData = new FormData();
        formData.append('file', audioBlob, 'voice.wav');

        try {
          const response = await axios.post(`${API_BASE}/stt`, formData, {
            headers: getHeaders(true)
          });
          const text = response.data.text;
          if (text && text.trim()) {
            handleSendMessage(text);
          } else {
            alert("Could not recognize any speech. Please try speaking louder or clearer.");
          }
        } catch (error) {
          console.error("Lỗi STT:", error);
          alert("Error processing your voice message. Check if GROQ_API_KEY is configured.");
        } finally {
          setIsLoading(false);
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Không tiếp cận được micro:", error);
      alert("Please allow microphone access to practice speaking.");
    }
  };

  // Dừng ghi âm
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full py-2 px-1">
      {/* Header */}
      <div className="flex items-center justify-between p-5 glass rounded-2xl mb-4 shadow-lg border border-white/5">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white font-outfit tracking-wide">Antigravity AI Mentor</h2>
            <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Gia sư Tiếng Anh của bạn
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-semibold px-4 py-2 rounded-xl bg-white/5 border border-white/5">
          <BookOpen className="w-4 h-4 text-brand-400" />
          <span>Giao tiếp Lớp {selectedGrade}</span>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-5 px-6 py-6 glass rounded-2xl shadow-inner scrollbar-thin border border-white/5">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-4 max-w-[85%] ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${
              msg.role === 'user' 
                ? 'bg-indigo-600 shadow-indigo-500/10' 
                : 'bg-gradient-to-tr from-brand-600 to-violet-600 shadow-brand-500/15'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Sparkles className="w-5 h-5 text-white" />}
            </div>

            {/* Message Bubble */}
            <div className={`relative rounded-2xl px-5 py-3.5 text-base shadow-md transition-all duration-300 leading-relaxed ${
              msg.role === 'user'
                ? 'bg-brand-600 text-white rounded-tr-none hover:shadow-lg hover:shadow-brand-500/15'
                : 'bg-white/[0.04] text-gray-100 rounded-tl-none border border-white/5 hover:bg-white/[0.06] hover:border-white/10 hover:shadow-md'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
              
              {/* Nút phát giọng nói cho phản hồi của AI */}
              {msg.role === 'model' && (
                <button
                  onClick={() => playTTS(msg.content, index)}
                  className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-white/5 hover:bg-white/10 text-brand-400 transition ${
                    playingAudioId === index ? 'text-amber-400 bg-amber-400/10 animate-pulse' : ''
                  }`}
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{playingAudioId === index ? 'Speaking...' : 'Listen'}</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-4 max-w-[80%] mr-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 flex items-center justify-center shadow-md">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className="bg-white/[0.04] text-gray-400 rounded-2xl rounded-tl-none px-5 py-3.5 text-sm border border-white/5 flex items-center gap-2">
              <span className="text-xs">AI Mentor is analyzing...</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input controls */}
      <div className="mt-5 flex items-center gap-4">
        {/* Nút Voice Record */}
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="w-14 h-14 rounded-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20 pulse-record glow-btn-danger cursor-pointer"
            title="Dừng và gửi giọng nói"
          >
            <Square className="w-6 h-6 fill-current" />
          </button>
        ) : (
          <button
            onClick={startRecording}
            disabled={isLoading}
            className="w-14 h-14 rounded-2xl bg-[#0a0d16] border border-white/5 disabled:bg-gray-800 disabled:border-transparent flex items-center justify-center text-brand-400 hover:text-white transition shadow-md glow-btn-brand cursor-pointer"
            title="Nói tiếng Anh"
          >
            <Mic className="w-6 h-6" />
          </button>
        )}

        {/* Text Input */}
        <div className="flex-1 flex items-center glass rounded-2xl px-5 py-2 shadow-md border border-white/5">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isRecording ? "Listening to your voice..." : "Type your message in English..."}
            disabled={isRecording || isLoading}
            className="flex-1 bg-transparent text-base text-gray-100 outline-none placeholder-gray-600 py-2.5"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading || isRecording}
            className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white disabled:bg-transparent disabled:text-gray-700 flex items-center justify-center transition glow-btn-brand cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
