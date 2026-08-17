import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen, Search, Volume2, ChevronDown, ChevronUp,
  Globe, Tag, X, RefreshCw, BookMarked
} from 'lucide-react';
import axios from 'axios';

const API_BASE = '/api';

function speakWord(text) {
  if (!window.speechSynthesis) return;
  const utter = new window.SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = 0.85;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function WordCard({ word }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none ${
        expanded
          ? 'bg-indigo-950/40 border-indigo-500/30 shadow-lg shadow-indigo-500/10'
          : 'bg-white/[0.02] border-white/5 hover:border-indigo-500/20 hover:bg-white/[0.04]'
      }`}
      onClick={() => setExpanded(v => !v)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="shrink-0 mt-0.5">
            <button
              onClick={e => { e.stopPropagation(); speakWord(word.word); }}
              className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center text-indigo-400 hover:bg-indigo-500/25 transition"
              title="Nghe phat am"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-extrabold text-white">{word.word}</span>
              {word.pos && (
                <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                  {word.pos}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {word.ipa && <span className="text-xs font-mono text-indigo-400">{word.ipa}</span>}
              {word.reading && <span className="text-[10px] text-gray-500">/ {word.reading} /</span>}
            </div>
            <p className="text-xs text-slate-300 mt-1 font-semibold leading-snug line-clamp-1">{word.meaning}</p>
          </div>
        </div>
        <div className="shrink-0 text-gray-600 mt-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/5 space-y-3 text-xs animate-fade-in">
          {word.example && (
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Cau vi du (EN):</p>
              <p className="text-slate-200 italic leading-relaxed">"{word.example}"</p>
              {word.example_vi && (
                <p className="text-gray-400 mt-1 leading-relaxed">({word.example_vi})</p>
              )}
            </div>
          )}
          <button
            onClick={e => { e.stopPropagation(); speakWord(word.example || word.word); }}
            className="flex items-center gap-1.5 text-[10px] text-indigo-400 hover:text-indigo-300 font-bold transition"
          >
            <Volume2 className="w-3 h-3" /> Nghe cau vi du
          </button>
        </div>
      )}
    </div>
  );
}

export default function VocabLibrary({ selectedGrade }) {
  const [topics, setTopics] = useState([]);
  const [wordsByTopic, setWordsByTopic] = useState({});
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [loadingWords, setLoadingWords] = useState({});
  const [activeTopic, setActiveTopic] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState(selectedGrade || '');
  const [allWords, setAllWords] = useState([]);

  const fetchTopics = async () => {
    setLoadingTopics(true);
    try {
      const res = await axios.get(`${API_BASE}/content/vocab/topics`);
      if (res.data?.status === 'success') {
        const data = (res.data.data || []).filter(t => t.is_active);
        setTopics(data);
        setActiveTopic(prev => prev || (data.length > 0 ? data[0].id : null));
      }
    } catch (err) {
      console.warn('Loi tai chu de tu vung:', err.message);
    } finally {
      setLoadingTopics(false);
    }
  };

  const fetchWordsForTopic = async (topicId) => {
    if (wordsByTopic[topicId]) return;
    setLoadingWords(prev => ({ ...prev, [topicId]: true }));
    try {
      const res = await axios.get(`${API_BASE}/content/vocab/words?topic_id=${topicId}`);
      if (res.data?.status === 'success') {
        setWordsByTopic(prev => ({
          ...prev,
          [topicId]: (res.data.data || []).filter(w => w.is_active),
        }));
      }
    } catch (err) {
      console.warn('Loi tai tu vung theo chu de:', err.message);
    } finally {
      setLoadingWords(prev => ({ ...prev, [topicId]: false }));
    }
  };

  const fetchAllWords = async () => {
    try {
      const res = await axios.get(`${API_BASE}/content/vocab/words`);
      if (res.data?.status === 'success') {
        setAllWords((res.data.data || []).filter(w => w.is_active));
      }
    } catch (err) {
      console.warn('Loi tai tat ca tu vung:', err.message);
    }
  };

  useEffect(() => { fetchTopics(); fetchAllWords(); }, []);
  useEffect(() => { if (activeTopic) fetchWordsForTopic(activeTopic); }, [activeTopic]);

  const filteredTopics = useMemo(() => {
    if (!gradeFilter) return topics;
    return topics.filter(t => String(t.grade) === String(gradeFilter));
  }, [topics, gradeFilter]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return allWords
      .filter(
        w =>
          w.word.toLowerCase().includes(q) ||
          w.meaning.toLowerCase().includes(q) ||
          (w.example || '').toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [searchQuery, allWords]);

  const isSearchMode = searchQuery.trim().length > 0;
  const currentTopicWords = activeTopic ? (wordsByTopic[activeTopic] || []) : [];
  const isLoadingCurrentTopic = activeTopic ? (loadingWords[activeTopic] || false) : false;
  const currentTopicData = topics.find(t => t.id === activeTopic);
  const GRADES = ['6', '7', '8', '9', '10', '11', '12'];

  return (
    <div className="space-y-6 w-full pb-16 animate-fade-in max-w-[1600px] mx-auto">
      {/* Hero Header */}
      <div className="glass rounded-3xl p-7 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-r from-slate-950 via-[#0b0c1e] to-indigo-950/80">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 shrink-0">
              <BookMarked className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-white font-outfit">
                Hoc lieu Tu vung
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Kho tu vung bien soan boi Giao vien &amp; AI Gemini — Phan loai theo Chu de &amp; Khoi lop
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="text-xs text-gray-400 font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
              <span className="text-white font-extrabold">{allWords.length}</span> tu vung
            </div>
            <div className="text-xs text-gray-400 font-bold bg-white/5 border border-white/10 px-3 py-2 rounded-xl">
              <span className="text-white font-extrabold">{topics.length}</span> chu de
            </div>
          </div>
        </div>
      </div>

      {/* Search + Grade Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Tim kiem tu vung, nghia, cau vi du..."
            className="w-full pl-10 pr-10 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 font-bold shrink-0">Lop:</span>
          <button
            onClick={() => setGradeFilter('')}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              !gradeFilter ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            Tat ca
          </button>
          {GRADES.map(g => (
            <button
              key={g}
              onClick={() => setGradeFilter(g)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                gradeFilter === g ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results */}
      {isSearchMode ? (
        <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3">
            <Search className="w-4 h-4 text-indigo-400" />
            <h3 className="font-extrabold text-sm text-white">
              Ket qua tim kiem:{' '}
              <span className="text-indigo-400">"{searchQuery}"</span>
              <span className="text-gray-500 font-normal ml-2">({searchResults.length} tu)</span>
            </h3>
          </div>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.map(w => <WordCard key={w.id} word={w} />)}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 text-sm font-bold">
              Khong tim thay tu phu hop. Hay thu tu khoa khac.
            </div>
          )}
        </div>
      ) : (
        /* Topic + Word Grid */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Topic Sidebar */}
          <div className="glass-card rounded-3xl p-4 border border-white/10 space-y-1.5 lg:col-span-1 h-fit max-h-[70vh] overflow-y-auto">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10 mb-3">
              <Tag className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-extrabold text-gray-300 uppercase tracking-wider">
                Chu de ({filteredTopics.length})
              </span>
              {loadingTopics && <RefreshCw className="w-3 h-3 text-gray-500 animate-spin ml-auto" />}
            </div>
            {filteredTopics.length === 0 && !loadingTopics ? (
              <div className="text-center py-8 text-gray-600 text-xs font-bold">
                Chua co chu de nao.
              </div>
            ) : (
              filteredTopics.map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTopic(t.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-start gap-2 ${
                    activeTopic === t.id
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`shrink-0 text-[9px] font-extrabold px-1.5 py-0.5 rounded mt-0.5 ${
                      activeTopic === t.id
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                        : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    L{t.grade}
                  </span>
                  <span className="leading-snug">{t.title}</span>
                </button>
              ))
            )}
          </div>

          {/* Word Cards */}
          <div className="lg:col-span-3 space-y-5">
            {currentTopicData && (
              <div className="glass-card rounded-3xl p-5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-lg uppercase">
                      Lop {currentTopicData.grade}
                    </span>
                    <h2 className="text-xl font-extrabold text-white font-outfit mt-1">{currentTopicData.title}</h2>
                    {currentTopicData.description && (
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{currentTopicData.description}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-extrabold text-indigo-400">{currentTopicWords.length}</div>
                    <div className="text-[10px] text-gray-500 font-bold">tu vung</div>
                  </div>
                </div>
              </div>
            )}

            {isLoadingCurrentTopic ? (
              <div className="glass-card rounded-3xl p-10 border border-white/10 text-center text-gray-500 animate-pulse font-bold text-xs">
                Dang tai danh sach tu vung...
              </div>
            ) : currentTopicWords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentTopicWords.map(w => <WordCard key={w.id} word={w} />)}
              </div>
            ) : activeTopic ? (
              <div className="glass-card rounded-3xl p-10 border border-white/10 flex flex-col items-center justify-center gap-3 text-center">
                <BookOpen className="w-10 h-10 text-gray-600" />
                <p className="text-gray-500 text-sm font-bold">Chu de nay chua co tu vung.</p>
                <p className="text-gray-600 text-xs">Admin co the them tu trong phan Quan ly Hoc lieu (CMS).</p>
              </div>
            ) : (
              <div className="glass-card rounded-3xl p-10 border border-white/10 flex flex-col items-center justify-center gap-3 text-center">
                <Globe className="w-10 h-10 text-gray-600" />
                <p className="text-gray-500 text-sm font-bold">Chon mot chu de tu danh sach ben trai de xem tu vung.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
