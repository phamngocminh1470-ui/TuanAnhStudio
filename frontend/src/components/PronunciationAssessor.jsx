import React, { useState, useRef, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Play, Mic, Square, Volume2, Award, RefreshCw, ChevronRight, ChevronLeft, HelpCircle, BookOpen, Sparkles, Plus, Wand2, Shuffle, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';
import { EXTENDED_PRONUNCIATION_SENTENCES } from '../data/pronunciationSentencesData';

const API_BASE = '/api';

// Ngân hàng câu hỏi chấm phát âm Tiếng Anh mở rộng (285+ câu hỏi offline chuẩn SGK Global Success & CEFR)
// Được gán kèm thông số độ khó IRT difficulty (b) từ -2.5 (dễ) đến +3.4 (rất khó)
const SENTENCES_BY_GRADE = EXTENDED_PRONUNCIATION_SENTENCES;

export default function PronunciationAssessor({ selectedGrade, keys }) {
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  // THUẬT TOÁN THÍCH ỨNG IRT & SPACED REPETITION (SM-2)
  const [theta, setTheta] = useState(0.0); // Năng lực học tập ước lượng hiện tại
  const [history, setHistory] = useState([]); // Lịch sử làm bài: [{question, response}]
  const [isAdaptive, setIsAdaptive] = useState(true); // Bật/tắt chế độ thích ứng IRT
  const [loadingNext, setLoadingNext] = useState(false); // Trạng thái tải câu tiếp theo
  const [spacedRepetitionInfo, setSpacedRepetitionInfo] = useState(null); // Thông tin ôn tập SM-2

  // Ngân hàng câu hỏi động tải từ backend API & Gemini AI
  const [dynamicSentences, setDynamicSentences] = useState([]);
  const [aiSentences, setAiSentences] = useState([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isAutoAI, setIsAutoAI] = useState(true); // Bật chế độ tự động sinh câu AI liên tục bằng Gemini
  const [selectedWordInfo, setSelectedWordInfo] = useState(null); // Từ được click để nghe lại & xem hướng dẫn sửa âm

  const playWordSample = (wordText) => {
    if (!wordText) return;
    try {
      window.speechSynthesis?.cancel();
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis?.speak(utterance);
    } catch (e) {
      console.warn("Speech error:", e);
    }
  };

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Tải danh sách câu hỏi mỗi lớp/trình độ từ backend
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${API_BASE}/content/pronounce/sentences?grade=${selectedGrade}`);
        if (response.data.status === 'success' && response.data.data?.length > 0) {
          const mapped = response.data.data
            .filter(s => s.is_active)
            .map(s => ({
              id: s.id,
              text: s.text,
              level: `Lớp ${s.level_grade} (IRT: ${s.difficulty.toFixed(1)})`,
              difficulty: s.difficulty
            }));
          if (mapped.length > 0) {
            setDynamicSentences(mapped);
            return;
          }
        }
        setDynamicSentences([]);
      } catch (err) {
        console.error("Dùng ngân hàng câu hỏi nội bộ fallback:", err);
        setDynamicSentences([]);
      }
    };
    fetchQuestions();
  }, [selectedGrade]);

  // Sinh câu phát âm ngẫu nhiên mới bằng Gemini AI
  const generateNewAISentences = async (count = 1) => {
    setIsGeneratingAI(true);
    try {
      const generated = [];
      for (let i = 0; i < count; i++) {
        const response = await axios.post(
          `${API_BASE}/pronounce/generate-sentence`,
          { level: selectedGrade },
          { headers: getHeaders() }
        );
        if (response.data?.sentence) {
          generated.push(response.data.sentence);
        }
      }
      if (generated.length > 0) {
        setAiSentences(prev => [...generated, ...prev]);
        setAssessmentResult(null);
      }
    } catch (err) {
      console.error("Lỗi sinh câu AI:", err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Tự động sinh câu AI khi chuyển trình độ nếu bật Auto AI
  useEffect(() => {
    if (isAutoAI && keys?.gemini) {
      generateNewAISentences(2);
    }
  }, [selectedGrade]);

  // Lọc câu hỏi tương ứng khối lớp / trình độ CEFR - Hợp nhất DB và ngân hàng nội bộ
  const basePool = useMemo(() => {
    const localBank = SENTENCES_BY_GRADE[selectedGrade] || SENTENCES_BY_GRADE["12"] || [];
    const combined = [...dynamicSentences, ...localBank];
    const seen = new Set();
    const unique = [];
    for (const item of combined) {
      const clean = (item.text || '').trim().toLowerCase();
      if (clean && !seen.has(clean)) {
        seen.add(clean);
        unique.push(item);
      }
    }
    return unique.length > 0 ? unique : localBank;
  }, [dynamicSentences, selectedGrade]);

  const sentences = useMemo(() => [...aiSentences, ...basePool], [aiSentences, basePool]);
  const currentSentence = sentences[currentSentenceIndex] || sentences[0] || { text: "Welcome to AI English Mentor.", level: "Default" };

  // Tự động random câu hỏi khi vào trang hoặc đổi khối lớp
  useEffect(() => {
    const bank = SENTENCES_BY_GRADE[selectedGrade] || SENTENCES_BY_GRADE["12"] || [];
    if (bank.length > 0) {
      const randIdx = Math.floor(Math.random() * bank.length);
      setCurrentSentenceIndex(randIdx);
    } else {
      setCurrentSentenceIndex(0);
    }
    setAiSentences([]);
    setAssessmentResult(null);
    setTheta(0.0);
    setHistory([]);
    setSpacedRepetitionInfo(null);
  }, [selectedGrade]);

  // Helper lấy headers chứa Azure Key và Gemini Key
  const getHeaders = (isMultipart = false) => {
    const headers = {};
    if (isMultipart) {
      headers['Content-Type'] = 'multipart/form-data';
    }
    if (keys?.azure) headers['x-azure-key'] = keys.azure;
    if (keys?.gemini) headers['x-gemini-key'] = keys.gemini;
    return headers;
  };

  // Phát âm câu mẫu chuẩn (TTS)
  const playSample = async () => {
    setIsPlayingSample(true);
    try {
      const response = await axios.post(
        `${API_BASE}/tts`,
        { text: currentSentence.text },
        { 
          responseType: 'blob',
          headers: getHeaders()
        }
      );
      const audioUrl = URL.createObjectURL(response.data);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlayingSample(false);
      audio.onerror = () => setIsPlayingSample(false);
      await audio.play();
    } catch (error) {
      console.error("Lỗi phát giọng mẫu:", error);
      setIsPlayingSample(false);
    }
  };

  // Bắt đầu ghi âm giọng đọc (Tối ưu cho cả Mobile Safari/Chrome và Desktop)
  const startRecording = async () => {
    audioChunksRef.current = [];
    setAssessmentResult(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      let options = {};
      if (typeof MediaRecorder !== 'undefined') {
        if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
          options = { mimeType: 'audio/webm;codecs=opus' };
        } else if (MediaRecorder.isTypeSupported('audio/webm')) {
          options = { mimeType: 'audio/webm' };
        } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options = { mimeType: 'audio/mp4' };
        } else if (MediaRecorder.isTypeSupported('audio/aac')) {
          options = { mimeType: 'audio/aac' };
        }
      }

      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const actualMime = mediaRecorder.mimeType || options.mimeType || 'audio/webm';
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });
        try {
          stream.getTracks().forEach(track => track.stop());
        } catch (e) {}
        sendToAssessment(audioBlob);
      };

      mediaRecorder.start(250);
      setIsRecording(true);
    } catch (error) {
      console.error("Lỗi micro:", error);
      setAssessmentResult({
        silenceDetected: true,
        errorNotice: "Không thể truy cập Microphone. Vui lòng cấp quyền Microphone cho trình duyệt trong Cài đặt của điện thoại.",
        words: []
      });
    }
  };

  // Dừng ghi âm và gửi đi chấm điểm
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      if (mediaRecorderRef.current.state === 'recording') {
        try {
          mediaRecorderRef.current.requestData();
        } catch (e) {}
      }
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Gửi file ghi âm lên backend chấm điểm
  const sendToAssessment = async (audioBlob) => {
    setIsLoading(true);
    setAssessmentResult(null);

    const refWords = currentSentence.text.split(/\s+/).map(w => w.replace(/[.,!?"']/g, '').trim()).filter(Boolean);

    // Kiểm tra nếu audio quá bé (< 400 bytes)
    if (!audioBlob || audioBlob.size < 400) {
      setAssessmentResult({
        accuracyScore: 0,
        fluencyScore: 0,
        completenessScore: 0,
        pronunciationScore: 0,
        silenceDetected: true,
        words: refWords.map(w => ({
          Word: w,
          word: w,
          accuracyScore: 0,
          errorType: 'Omission'
        }))
      });
      setIsLoading(false);
      return;
    }

    let ext = 'webm';
    if (audioBlob.type.includes('mp4')) ext = 'mp4';
    else if (audioBlob.type.includes('aac') || audioBlob.type.includes('m4a')) ext = 'm4a';
    else if (audioBlob.type.includes('wav')) ext = 'wav';
    else if (audioBlob.type.includes('ogg')) ext = 'ogg';

    const formData = new FormData();
    formData.append('file', audioBlob, `speech.${ext}`);
    formData.append('reference_text', currentSentence.text);

    try {
      const response = await axios.post(`${API_BASE}/pronounce-assess`, formData, {
        headers: getHeaders(true)
      });
      
      const nbest = response.data.NBest?.[0];
      const isSilence = response.data.RecognitionStatus === 'InitialSilenceTimeout' || (!nbest || nbest.PronunciationAssessment?.PronunciationScore === 0);

      if (isSilence) {
        setAssessmentResult({
          accuracyScore: 0,
          fluencyScore: 0,
          completenessScore: 0,
          pronunciationScore: 0,
          silenceDetected: true,
          words: refWords.map(w => ({
            Word: w,
            word: w,
            accuracyScore: 0,
            errorType: 'Omission'
          }))
        });
        setIsLoading(false);
        return;
      }

      if (nbest) {
        let overallScore = nbest.PronunciationAssessment?.PronunciationScore || 0;
        let accuracy = nbest.PronunciationAssessment?.AccuracyScore || 0;
        let fluency = nbest.PronunciationAssessment?.FluencyScore || 0;
        let completeness = nbest.PronunciationAssessment?.CompletenessScore || 0;
        
        let evaluatedWords = (nbest.Words || []).map(w => {
          const wText = w.Word || w.word || '';
          const acc = w.PronunciationAssessment?.AccuracyScore ?? w.accuracyScore ?? 0;
          const err = w.PronunciationAssessment?.ErrorType ?? (acc >= 70 ? 'None' : 'Mispronunciation');
          return {
            Word: wText,
            word: wText,
            accuracyScore: acc,
            errorType: err
          };
        });

        const isReallySilent = evaluatedWords.length === 0 || evaluatedWords.every(w => w.accuracyScore === 0);

        setAssessmentResult({
          accuracyScore: accuracy,
          fluencyScore: fluency,
          completenessScore: completeness,
          pronunciationScore: overallScore,
          silenceDetected: isReallySilent,
          words: evaluatedWords
        });

        // Cập nhật IRT Năng lực
        const responseVal = overallScore >= 70 ? 1 : 0;
        const newHistoryItem = {
          question: {
            item_id: (currentSentence.id || 1).toString(),
            difficulty: currentSentence.difficulty || 0,
            discrimination: 1.0,
            guessing: 0.2
          },
          response: responseVal
        };
        const updatedHistory = [...history, newHistoryItem];
        setHistory(updatedHistory);

        try {
          const thetaRes = await axios.post(`${API_BASE}/adaptive/update-ability`, {
            history: updatedHistory
          });
          if (thetaRes.data.status === 'success') {
            setTheta(thetaRes.data.new_theta);
          }
        } catch (err) {}

        // Cập nhật SM-2 Spaced Repetition
        let quality = overallScore >= 85 ? 5 : overallScore >= 70 ? 4 : overallScore >= 55 ? 3 : 2;
        const currentRep = spacedRepetitionInfo?.repetition || 0;
        const currentEF = spacedRepetitionInfo?.ef || 2.5;
        const currentInterval = spacedRepetitionInfo?.interval || 1;

        try {
          const sm2Res = await axios.post(`${API_BASE}/spaced-repetition/next-review`, {
            quality: quality,
            current_repetition: currentRep,
            current_ef: currentEF,
            current_interval: currentInterval
          });
          if (sm2Res.data.status === 'success') {
            setSpacedRepetitionInfo({
              interval: sm2Res.data.next_interval_days,
              ef: sm2Res.data.new_ef,
              repetition: sm2Res.data.new_repetition,
              qualityScore: quality
            });
          }
        } catch (err) {}

      } else {
        setAssessmentResult({
          accuracyScore: 0,
          fluencyScore: 0,
          completenessScore: 0,
          pronunciationScore: 0,
          silenceDetected: true,
          words: refWords.map(w => ({
            Word: w,
            word: w,
            accuracyScore: 0,
            errorType: 'Omission'
          }))
        });
      }
    } catch (error) {
      console.error("Lỗi chấm phát âm:", error);
      setAssessmentResult({
        accuracyScore: 0,
        fluencyScore: 0,
        completenessScore: 0,
        pronunciationScore: 0,
        silenceDetected: true,
        words: refWords.map(w => ({
          Word: w,
          word: w,
          accuracyScore: 0,
          errorType: 'Omission'
        }))
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Đổi ngẫu nhiên một câu trong ngân hàng
  const jumpRandomSentence = () => {
    if (sentences.length <= 1) return;
    let nextIdx;
    let tries = 0;
    do {
      nextIdx = Math.floor(Math.random() * sentences.length);
      tries++;
    } while (nextIdx === currentSentenceIndex && tries < 10);
    setCurrentSentenceIndex(nextIdx);
    setAssessmentResult(null);
    setSpacedRepetitionInfo(null);
  };

  // Quay lại câu trước
  const prevSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(prev => prev - 1);
      setAssessmentResult(null);
      setSpacedRepetitionInfo(null);
    }
  };

  // Chuyển câu tiếp theo
  const nextSentence = async () => {
    setSpacedRepetitionInfo(null);

    // Nếu bật Auto AI, tự động sinh thêm 1 câu AI mới ở background khi tiến gần cuối danh sách
    if (isAutoAI && currentSentenceIndex >= sentences.length - 2) {
      generateNewAISentences(1);
    }

    // Nếu bật chế độ thích ứng IRT
    if (isAdaptive && history.length > 0) {
      setLoadingNext(true);
      try {
        const nextQRes = await axios.post(`${API_BASE}/adaptive/next-question`, {
          theta: theta,
          excluded_ids: history.map(h => h.question.item_id),
          pool: sentences.map(s => ({
            item_id: (s.id || 1).toString(),
            difficulty: s.difficulty || 0,
            discrimination: 1.0,
            guessing: 0.2
          }))
        });

        if (nextQRes.data.status === 'success') {
          const nextQuestionId = parseInt(nextQRes.data.question.item_id);
          const nextIndex = sentences.findIndex(s => s.id === nextQuestionId);
          if (nextIndex !== -1) {
            setCurrentSentenceIndex(nextIndex);
            setAssessmentResult(null);
            setLoadingNext(false);
            return;
          }
        }
      } catch (err) {
        console.error("Lỗi chọn câu hỏi thích ứng:", err);
      } finally {
        setLoadingNext(false);
      }
    }

    // Luồng chuyển câu bình thường tuần tự (xoay vòng)
    setCurrentSentenceIndex(prev => (prev + 1) % sentences.length);
    setAssessmentResult(null);
  };

  // Màu từ phát âm
  const getWordColor = (wordAssessment) => {
    if (!wordAssessment) return 'text-gray-300';
    const errorType = wordAssessment.errorType || wordAssessment.PronunciationAssessment?.ErrorType;
    const score = wordAssessment.accuracyScore ?? wordAssessment.PronunciationAssessment?.AccuracyScore ?? 0;
    
    if (errorType === 'Omission' || score === 0) return 'text-gray-600 line-through';
    if (errorType === 'Mispronunciation' || score < 70) return 'text-red-400 font-bold underline decoration-wavy decoration-red-500';
    return 'text-emerald-400 font-extrabold';
  };

  return (
    <div className="w-full py-2 px-1 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between p-5 glass rounded-2xl mb-6 shadow-md border border-white/5 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-xl text-white font-outfit tracking-wide">Luyện &amp; Chấm Phát âm AI</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Luyện phát âm theo <strong className="text-brand-400">Trình độ {selectedGrade}</strong> ({sentences.length} câu sẵn có &amp; Sinh câu ngẫu nhiên không giới hạn bằng Gemini AI)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Nút Đổi câu ngẫu nhiên */}
          <button
            onClick={jumpRandomSentence}
            className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-bold transition flex items-center gap-1.5 border border-white/10 cursor-pointer"
            title="Chọn ngẫu nhiên một câu khác trong ngân hàng câu hỏi"
          >
            <Shuffle className="w-3.5 h-3.5 text-amber-400" />
            <span>Đổi câu ngẫu nhiên</span>
          </button>

          {/* Nút Tạo 3 câu AI bằng Gemini */}
          <button
            onClick={() => generateNewAISentences(3)}
            disabled={isGeneratingAI}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow glow-btn-brand"
            title="Kích hoạt Gemini AI tạo thêm 3 câu luyện phát âm ngẫu nhiên mới"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAI ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAI ? 'Gemini đang tạo câu...' : '+3 Câu Gemini AI'}</span>
          </button>

          {/* Toggle Auto AI Generation */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-xs" title="Tự động sinh thêm câu phát âm ngẫu nhiên từ Gemini AI khi thực hành">
            <span className="text-gray-300 font-semibold flex items-center gap-1">
              <Wand2 className="w-3.5 h-3.5 text-indigo-400" /> Auto AI
            </span>
            <button
              onClick={() => setIsAutoAI(!isAutoAI)}
              className={`w-8 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                isAutoAI ? 'bg-indigo-600' : 'bg-gray-800'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  isAutoAI ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Chỉ số câu hỏi hiện tại */}
          <div className="text-xs text-gray-300 font-bold px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            Câu <span className="text-indigo-400 font-black text-sm">{currentSentenceIndex + 1}</span>/{sentences.length}
            {aiSentences.length > 0 && <span className="text-[10px] text-amber-400 ml-1 font-normal">(+{aiSentences.length} AI)</span>}
          </div>

          {/* Toggle IRT */}
          <div className="flex items-center space-x-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-gray-400 font-semibold">Thích ứng IRT</span>
            <button
              onClick={() => setIsAdaptive(!isAdaptive)}
              className={`w-8 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${
                isAdaptive ? 'bg-indigo-600' : 'bg-gray-800'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                  isAdaptive ? 'translate-x-3' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="text-xs text-brand-400 font-bold px-3 py-1.5 rounded-xl bg-brand-500/10 flex items-center gap-1.5 border border-brand-500/20">
            <BookOpen className="w-3.5 h-3.5 text-brand-400" />
            <span>{currentSentence.level}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Câu cần đọc & Nút điều khiển */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-8 shadow-md relative overflow-hidden min-h-[220px] flex flex-col justify-between border border-white/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl"></div>
            
            <div className="text-2xl md:text-3xl font-medium leading-relaxed font-outfit text-gray-100 py-2">
              {assessmentResult && !assessmentResult.silenceDetected ? (
                <div className="flex flex-wrap gap-x-3 gap-y-2">
                  {assessmentResult.words.map((wordObj, i) => (
                    <span key={i} className={getWordColor(wordObj)}>
                      {wordObj.Word || wordObj.word}
                    </span>
                  ))}
                </div>
              ) : (
                currentSentence.text
              )}
            </div>

            {assessmentResult?.silenceDetected && (
              <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold animate-fade-in mt-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                <span>Chưa phát hiện giọng nói: Micro chưa thu được tiếng của bạn hoặc âm lượng quá nhỏ. Bạn hãy bấm Micro lại và đọc to, rõ ràng câu mẫu nhé!</span>
              </div>
            )}

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <button
                onClick={playSample}
                disabled={isPlayingSample || isRecording || isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-gray-300 transition glow-btn-dark cursor-pointer ${
                  isPlayingSample ? 'text-amber-400 animate-pulse bg-amber-400/5' : ''
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>{isPlayingSample ? 'Đang đọc...' : 'Nghe phát âm chuẩn'}</span>
              </button>

              <div className="text-[11px] text-gray-500 italic">
                {currentSentence.topic ? `Chủ đề: ${currentSentence.topic}` : `Trình độ ${selectedGrade}`}
              </div>
            </div>
          </div>

          {/* Điều khiển ghi âm */}
          <div className="flex items-center justify-center gap-6 p-4">
            <button
              onClick={prevSentence}
              disabled={isRecording || isLoading || currentSentenceIndex === 0}
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-gray-300 transition border border-white/5 glow-btn-dark cursor-pointer"
              title="Câu trước đó"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {isRecording ? (
              <button
                onClick={stopRecording}
                className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center text-white transition shadow-lg shadow-red-500/20 pulse-record glow-btn-danger cursor-pointer"
                title="Dừng ghi âm và nhận diện"
              >
                <Square className="w-8 h-8 fill-current" />
              </button>
            ) : (
              <button
                onClick={startRecording}
                disabled={isPlayingSample || isLoading}
                className="w-20 h-20 rounded-full bg-brand-500 hover:bg-brand-600 disabled:bg-gray-800 flex items-center justify-center text-white transition shadow-lg shadow-brand-500/20 glow-btn-brand cursor-pointer"
                title="Bắt đầu nói"
              >
                <Mic className="w-9 h-9" />
              </button>
            )}

            <button
              onClick={jumpRandomSentence}
              disabled={isRecording || isLoading}
              className="w-12 h-12 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 flex items-center justify-center text-amber-400 transition border border-amber-500/20 glow-btn-dark cursor-pointer"
              title="Đổi ngẫu nhiên câu khác"
            >
              <Shuffle className="w-5 h-5" />
            </button>

            <button
              onClick={nextSentence}
              disabled={isRecording || isLoading || loadingNext}
              className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition border border-white/5 glow-btn-dark cursor-pointer"
              title="Câu tiếp theo"
            >
              <ChevronRight className={`w-6 h-6 ${loadingNext ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Cột phải: Kết quả phân tích từ AI */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-8 shadow-md min-h-[350px] flex flex-col justify-between border border-white/5">
            <h3 className="font-bold text-gray-200 text-sm mb-4 border-b border-white/5 pb-3">Phân tích phát âm</h3>
            
            {isLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-10 h-10 text-brand-500 animate-spin" />
                <span className="text-xs text-gray-400">AI đang lắng nghe và phân tích từng âm...</span>
              </div>
            ) : assessmentResult && !assessmentResult.silenceDetected ? (
              <div className="flex-1 flex flex-col justify-between space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xl md:text-2xl font-black text-white font-outfit">
                      {assessmentResult.words?.filter(w => (w.accuracyScore || 0) >= 70).length >= Math.ceil(assessmentResult.words?.length * 0.8) ? (
                        <span className="text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                          Phát âm Chuẩn &amp; Rõ Ràng
                        </span>
                      ) : assessmentResult.words?.filter(w => (w.accuracyScore || 0) >= 70).length >= Math.ceil(assessmentResult.words?.length * 0.5) ? (
                        <span className="text-amber-400 flex items-center gap-1.5">
                          <Sparkles className="w-6 h-6 text-amber-400" />
                          Khá Tốt • Cần Chỉnh Vài Âm
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1.5">
                          <AlertCircle className="w-6 h-6 text-rose-400" />
                          Cần Luyện Rõ Âm Đuôi
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-semibold mt-1">
                      {assessmentResult.words?.filter(w => (w.accuracyScore || 0) >= 70).length || 0} / {assessmentResult.words?.length || 0} từ đọc chuẩn xác
                    </div>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-brand-500/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-brand-400" />
                  </div>
                </div>

                {/* Phân tích từ đúng vs từ cần sửa */}
                <div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                    <span>Phân tích chi tiết từng từ:</span>
                    <span className="text-[10px] text-gray-500 font-normal">Bấm vào từ để nghe riêng</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {assessmentResult.words?.map((w, idx) => {
                      const wordText = w.Word || w.word;
                      const isGood = (w.accuracyScore || 0) >= 70;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            playWordSample(wordText);
                            setSelectedWordInfo({
                              word: wordText,
                              isGood: isGood
                            });
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer flex items-center gap-1.5 ${
                            isGood
                              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25'
                              : 'bg-rose-500/15 border-rose-500/30 text-rose-300 hover:bg-rose-500/25 animate-pulse'
                          }`}
                          title="Bấm để nghe AI phát âm chậm riêng từ này"
                        >
                          <span>{wordText}</span>
                          <span>{isGood ? '✓' : '⚠️'}</span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedWordInfo && (
                    <div className="mt-2 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between text-xs animate-fade-in">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="text-white font-bold">"{selectedWordInfo.word}":</span>
                        <span className="text-gray-300">
                          {selectedWordInfo.isGood ? 'Đã phát âm chuẩn xác!' : 'Cần bật rõ âm đuôi và nhấn đúng trọng âm.'}
                        </span>
                      </div>
                      <button
                        onClick={() => playWordSample(selectedWordInfo.word)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white font-bold text-[10px] hover:bg-indigo-500 cursor-pointer transition"
                      >
                        🔊 Nghe lại
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Độ chuẩn xác nguyên âm &amp; phụ âm</span>
                      <span className="text-emerald-400 font-bold">
                        {assessmentResult.accuracyScore >= 80 ? 'Rất chuẩn xác' : assessmentResult.accuracyScore >= 60 ? 'Tương đối tốt' : 'Cần chú ý âm đuôi'}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.max(15, assessmentResult.accuracyScore)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Độ lưu loát &amp; ngắt nghỉ tự nhiên</span>
                      <span className="text-brand-400 font-bold">
                        {assessmentResult.fluencyScore >= 75 ? 'Tự nhiên & Trôi chảy' : 'Khá lưu loát'}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full rounded-full" style={{ width: `${Math.max(20, assessmentResult.fluencyScore)}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-gray-400">Mức độ hoàn thành câu</span>
                      <span className="text-indigo-400 font-bold">
                        {assessmentResult.completenessScore >= 80 ? 'Hoàn thành trọn vẹn' : 'Đã đọc hầu hết các từ'}
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.max(25, assessmentResult.completenessScore)}%` }}></div>
                    </div>
                  </div>
                </div>

                {spacedRepetitionInfo && (
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-brand-500/10 to-indigo-500/10 border border-brand-500/10 space-y-1.5">
                    <div className="text-[11px] text-brand-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>Chu kỳ ôn tập ngắt quãng (SM-2)</span>
                    </div>
                    <div className="text-xs text-white font-medium">
                      Lịch nhắc nhở luyện lại câu này: <span className="text-emerald-400 font-bold underline">Sau {spacedRepetitionInfo.interval} ngày</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shadow-lg">
                  <Mic className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1.5 max-w-xs">
                  <h4 className="text-sm font-bold text-white">Sẵn sàng nhận diện phát âm</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Nhấn nút <strong className="text-emerald-400">Micro</strong> và đọc to câu mẫu tiếng Anh. AI sẽ chỉ ra từ nào bạn đọc chuẩn (màu xanh ✓) và từ nào cần sửa lại (màu đỏ ⚠️).
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
