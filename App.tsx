import React, { useState, useMemo, useEffect } from 'react';
import {
  Home,
  BookOpen,
  HelpCircle,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Search,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Zap,
  Clock,
  BookMarked,
  Play,
  Square
} from 'lucide-react';

import {
  MAIN_PAGE_PARAGRAPHS,
  MAIN_PAGE_FULL_ES,
  MAIN_PAGE_FULL_HY,
  EXAM_STORY_PARAGRAPHS,
  SHORT_EXAM_TEXT_PARAGRAPHS,
  ULTRA_SHORT_SUMMARY,
  DETAILED_SECTIONS,
  COMPARISON_ROWS,
  VOCABULARY_LIST,
  EXAM_QA_LIST,
} from './data.ts';

import { speakText, stopSpeaking } from './speech.ts';

type TabType = 'main' | 'story' | 'short' | 'detailed' | 'qa' | 'vocab' | 'comparison';
type ViewDirection = 'es-to-hy' | 'hy-to-es' | 'both';

export default function App() {
  // Default tab is 'main' (Principal / Գլխավոր)
  const [activeTab, setActiveTab] = useState<TabType>('main');
  const [viewDirection, setViewDirection] = useState<ViewDirection>('es-to-hy');
  
  // Set of revealed IDs (for click-to-reveal)
  const [revealedItems, setRevealedItems] = useState<Record<string, boolean>>({});
  
  // Selected sentence in Main tab for synchronized highlight
  const [activeMainSentence, setActiveMainSentence] = useState<string | null>(null);

  // Voice synthesis state
  const [currentlySpeaking, setCurrentlySpeaking] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.9);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Q&A mastery tracker (saved in localStorage)
  const [masteredQA, setMasteredQA] = useState<Record<number, boolean>>(() => {
    try {
      const saved = localStorage.getItem('neolith_qa_mastered');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active QA filter: 'all' | 'unmastered' | 'mastered'
  const [qaFilter, setQaFilter] = useState<'all' | 'unmastered' | 'mastered'>('all');
  // QA mode: 'list' or 'flashcard'
  const [qaMode, setQaMode] = useState<'list' | 'flashcard'>('list');
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  // Copy notification state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Practice timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleMastered = (id: number) => {
    setMasteredQA((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('neolith_qa_mastered', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Toggle single item reveal
  const toggleReveal = (id: string) => {
    setRevealedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Reveal all or hide all for current view
  const revealAll = () => {
    const newRevealed: Record<string, boolean> = {};
    MAIN_PAGE_PARAGRAPHS.forEach((p) => (newRevealed[p.id] = true));
    EXAM_STORY_PARAGRAPHS.forEach((p) => (newRevealed[p.id] = true));
    SHORT_EXAM_TEXT_PARAGRAPHS.forEach((p) => (newRevealed[p.id] = true));
    newRevealed[ULTRA_SHORT_SUMMARY.id] = true;
    EXAM_QA_LIST.forEach((qa) => {
      newRevealed[`qa-q-${qa.id}`] = true;
      newRevealed[`qa-a-${qa.id}`] = true;
      newRevealed[`qa-card-${qa.id}`] = true;
    });
    VOCABULARY_LIST.forEach((v) => (newRevealed[`vocab-${v.id}`] = true));
    DETAILED_SECTIONS.forEach((s) => {
      s.sentences.forEach((_, idx) => (newRevealed[`det-${s.id}-${idx}`] = true));
      if (s.highlightWords) {
        s.highlightWords.forEach((_, idx) => (newRevealed[`det-hw-${s.id}-${idx}`] = true));
      }
    });
    COMPARISON_ROWS.forEach((r) => (newRevealed[`comp-${r.id}`] = true));
    setRevealedItems(newRevealed);
  };

  const hideAll = () => {
    setRevealedItems({});
  };

  const handleSpeak = (text: string, lang: 'es' | 'hy', id: string) => {
    if (currentlySpeaking === id) {
      stopSpeaking();
      setCurrentlySpeaking(null);
      return;
    }
    setCurrentlySpeaking(id);
    speakText(
      text,
      lang,
      speechRate,
      () => setCurrentlySpeaking(id),
      () => setCurrentlySpeaking(null)
    );
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Filtered Q&As
  const filteredQA = useMemo(() => {
    let list = EXAM_QA_LIST;
    if (qaFilter === 'mastered') {
      list = list.filter((qa) => !!masteredQA[qa.id]);
    } else if (qaFilter === 'unmastered') {
      list = list.filter((qa) => !masteredQA[qa.id]);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (qa) =>
          qa.questionEs.toLowerCase().includes(q) ||
          qa.questionHy.toLowerCase().includes(q) ||
          qa.answerEs.toLowerCase().includes(q) ||
          qa.answerHy.toLowerCase().includes(q)
      );
    }
    return list;
  }, [qaFilter, masteredQA, searchQuery]);

  // Filtered Vocab
  const filteredVocab = useMemo(() => {
    if (!searchQuery.trim()) return VOCABULARY_LIST;
    const q = searchQuery.toLowerCase();
    return VOCABULARY_LIST.filter(
      (v) => v.es.toLowerCase().includes(q) || v.hy.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filtered Detailed Sections
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return DETAILED_SECTIONS;
    const q = searchQuery.toLowerCase();
    return DETAILED_SECTIONS.filter(
      (s) =>
        s.titleEs.toLowerCase().includes(q) ||
        s.titleHy.toLowerCase().includes(q) ||
        s.sentences.some(
          (sent) =>
            sent.es.toLowerCase().includes(q) || sent.hy.toLowerCase().includes(q)
        )
    );
  }, [searchQuery]);

  const totalQACount = EXAM_QA_LIST.length;
  const masteredCount = Object.values(masteredQA).filter(Boolean).length;
  const masteredPercentage = Math.round((masteredCount / totalQACount) * 100);

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 font-sans flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Unit 1: Prehistory
                </span>
                <span className="text-xs font-semibold text-stone-500">
                  Tema 3 • Թեմա 3
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight mt-1 flex items-center gap-2">
                <span>The Neolithic Period</span>
                <span className="text-amber-700 font-semibold text-lg sm:text-xl">
                  — El Neolítico
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 font-medium font-serif mt-0.5">
                Նեոլիթյան ժամանակաշրջանը • Ուսումնական ինտերակտիվ նյութ
              </p>
            </div>

            {/* Global Controls: Direction & Speech Rate */}
            <div className="flex items-center flex-wrap gap-2 pt-1 md:pt-0">
              {/* Direction selector */}
              <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-300 text-xs font-semibold">
                <button
                  onClick={() => setViewDirection('es-to-hy')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewDirection === 'es-to-hy'
                      ? 'bg-amber-600 text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                  title="🇪🇸 ➔ 🇦🇲"
                >
                  <span>🇪🇸</span>
                  <span>➔</span>
                  <span>🇦🇲</span>
                  <span className="text-[11px] font-medium">ES ➔ HY</span>
                </button>

                <button
                  onClick={() => setViewDirection('hy-to-es')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewDirection === 'hy-to-es'
                      ? 'bg-amber-600 text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                  title="🇦🇲 ➔ 🇪🇸"
                >
                  <span>🇦🇲</span>
                  <span>➔</span>
                  <span>🇪🇸</span>
                  <span className="text-[11px] font-medium">HY ➔ ES</span>
                </button>

                <button
                  onClick={() => setViewDirection('both')}
                  className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    viewDirection === 'both'
                      ? 'bg-amber-600 text-white shadow-xs font-bold'
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-200/60'
                  }`}
                  title="ES + HY"
                >
                  <span>🇪🇸+🇦🇲</span>
                  <span className="text-[11px] font-medium">Ambos</span>
                </button>
              </div>

              {/* Reveal All / Hide All */}
              {viewDirection !== 'both' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={revealAll}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-stone-700 hover:text-amber-800 bg-white hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors flex items-center gap-1"
                    title="Mostrar todo / Ցույց տալ բոլորը"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    <span className="hidden md:inline">Mostrar / Ցույց տալ</span>
                  </button>
                  <button
                    onClick={hideAll}
                    className="p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 bg-white hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors flex items-center gap-1"
                    title="Ocultar / Թաքցնել"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                    <span className="hidden md:inline">Ocultar / Թաքցնել</span>
                  </button>
                </div>
              )}

              {/* Audio Speed toggle */}
              <button
                onClick={() => setSpeechRate((r) => (r === 0.9 ? 0.75 : 0.9))}
                className="px-2.5 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 rounded-lg border border-stone-300 transition-colors flex items-center gap-1"
                title="Velocidad / Արագություն"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                <span className="font-mono text-[11px] font-bold">
                  {speechRate === 0.9 ? '1.0x' : '0.75x'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Notice Tip */}
          <div className="mt-2.5 bg-amber-50/90 border border-amber-200/80 rounded-xl px-3 py-2 text-xs text-amber-900 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Clic:</strong> Haz clic en cualquier frase para ver la traducción. 🔊 para escuchar pronunciación. • Սեղմեք ցանկացած նախադասության վրա՝ թարգմանությունը տեսնելու համար։
              </span>
            </div>
            {currentlySpeaking && (
              <button
                onClick={() => {
                  stopSpeaking();
                  setCurrentlySpeaking(null);
                }}
                className="shrink-0 flex items-center gap-1 text-[11px] bg-red-100 text-red-700 hover:bg-red-200 px-2.5 py-1 rounded-md font-medium"
              >
                <VolumeX className="w-3 h-3" /> Detener / Դադարեցնել
              </button>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mt-3 scrollbar-none">
            {/* TAB 0: MAIN (Principal / Գլխավոր) */}
            <button
              onClick={() => setActiveTab('main')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'main'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>Principal / Գլխավոր</span>
            </button>

            <button
              onClick={() => setActiveTab('story')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'story'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>1. Texto para contar</span>
              <span className="text-[10px] opacity-75">9</span>
            </button>

            <button
              onClick={() => setActiveTab('short')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'short'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>2. Texto corto & Resumen</span>
            </button>

            <button
              onClick={() => setActiveTab('qa')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'qa'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>3. Preguntas y respuestas</span>
              <span className="bg-amber-100 text-amber-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {masteredCount}/20
              </span>
            </button>

            <button
              onClick={() => setActiveTab('detailed')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'detailed'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>4. Temas en detalle (13)</span>
            </button>

            <button
              onClick={() => setActiveTab('vocab')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'vocab'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              <BookMarked className="w-4 h-4 text-amber-400" />
              <span>5. Vocabulario (20)</span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                activeTab === 'comparison'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 text-amber-400" />
              <span>6. Paleolítico vs Neolítico</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-1 w-full">
        {/* TAB 0: PRINCIPAL / ԳԼԽԱՎՈՐ */}
        {activeTab === 'main' && (
          <div className="space-y-6">
            {/* Header banner */}
            <div className="bg-linear-to-r from-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold tracking-wider uppercase mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Unit 1: Prehistory • Tema 3 • Թեմա 3</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                El Neolítico — Նեոլիթյան ժամանակաշրջանը
              </h2>
              <p className="text-amber-100/80 text-xs sm:text-sm mt-1 max-w-2xl font-serif">
                Texto de introducción general: primero en español completo y abajo la traducción completa al armenio. • Ներածական տեքստ՝ նախ ամբողջությամբ իսպաներեն, ապա ներքևում՝ հայերեն։
              </p>
            </div>

            {/* BLOCK 1 (TOP): ESPAÑOL COMPLETO */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300/80 shadow-xs hover:border-amber-400 transition-all">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇪🇸</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                      El Neolítico
                    </h2>
                    <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Español (Texto completo)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeak(MAIN_PAGE_FULL_ES, 'es', 'main-full-es')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-2xs ${
                      currentlySpeaking === 'main-full-es'
                        ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                        : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200'
                    }`}
                    title="Escuchar todo en español"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Escuchar todo 🇪🇸</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(MAIN_PAGE_FULL_ES, 'main-copy-es')}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs transition-colors border border-stone-200"
                    title="Copiar texto"
                  >
                    {copiedId === 'main-copy-es' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Spanish Paragraphs */}
              <div className="space-y-4 text-base sm:text-lg leading-relaxed text-stone-800 font-medium">
                {MAIN_PAGE_PARAGRAPHS.map((p, idx) => {
                  const isActive = activeMainSentence === p.id;
                  const isRevealed = viewDirection === 'both' || !!revealedItems[p.id];

                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveMainSentence(isActive ? null : p.id);
                        toggleReveal(p.id);
                      }}
                      className={`group p-4 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-50 border-amber-400 shadow-xs'
                          : 'bg-stone-50/60 border-stone-200/80 hover:bg-amber-50/40 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-stone-900">{p.es}</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeak(p.es, 'es', `main-p-es-${p.id}`);
                            }}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-amber-900 hover:bg-white border border-transparent hover:border-stone-200 transition-colors"
                            title="Pronunciación"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Interactive translation reveal if clicked */}
                      {isRevealed && (
                        <div className="mt-3 pt-3 border-t border-amber-200/70 bg-amber-100/40 rounded-xl p-3 text-stone-800 text-sm sm:text-base font-serif">
                          <div className="flex items-center justify-between gap-2 mb-1 text-[11px] font-bold uppercase text-amber-900">
                            <span>🇦🇲 Հայերեն թարգմանություն</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(p.hy, 'hy', `main-p-hy-${p.id}`);
                              }}
                              className="p-1 rounded text-amber-900 hover:bg-amber-200"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          </div>
                          <p>{p.hy}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BLOCK 2 (BOTTOM): ARMENIAN COMPLETO */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-stone-200 shadow-xs hover:border-amber-300 transition-all">
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇦🇲</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif tracking-tight">
                      Նեոլիթը
                    </h2>
                    <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                      Հայերեն (Ամբողջական տեքստ)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeak(MAIN_PAGE_FULL_HY, 'hy', 'main-full-hy')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-2xs ${
                      currentlySpeaking === 'main-full-hy'
                        ? 'bg-amber-600 text-white border-amber-600 animate-pulse'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-800 border-stone-300'
                    }`}
                    title="Լսել ամբողջը հայերեն"
                  >
                    <Volume2 className="w-4 h-4 text-amber-700" />
                    <span>Լսել ամբողջը 🇦🇲</span>
                  </button>

                  <button
                    onClick={() => copyToClipboard(MAIN_PAGE_FULL_HY, 'main-copy-hy')}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs transition-colors border border-stone-200"
                    title="Պատճենել տեքստը"
                  >
                    {copiedId === 'main-copy-hy' ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Armenian Paragraphs */}
              <div className="space-y-4 text-base sm:text-lg leading-relaxed text-stone-800 font-serif">
                {MAIN_PAGE_PARAGRAPHS.map((p, idx) => {
                  const isActive = activeMainSentence === p.id;

                  return (
                    <div
                      key={p.id}
                      onClick={() => setActiveMainSentence(isActive ? null : p.id)}
                      className={`group p-4 rounded-2xl border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-amber-50 border-amber-400 shadow-xs'
                          : 'bg-stone-50/60 border-stone-200/80 hover:bg-amber-50/40 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-800 text-xs font-bold font-sans flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <p className="text-stone-900">{p.hy}</p>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 opacity-80 group-hover:opacity-100">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeak(p.hy, 'hy', `main-p-hy-${p.id}`);
                            }}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-amber-900 hover:bg-white border border-transparent hover:border-stone-200 transition-colors"
                            title="Արտասանություն"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Search bar when in detailed or qa or vocab */}
        {(activeTab === 'detailed' || activeTab === 'qa' || activeTab === 'vocab') && (
          <div className="mb-5 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en español o armenio... / Որոնել իսպաներեն կամ հայերեն..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-700 bg-stone-100 rounded-full px-1.5 py-0.5"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* TAB 1: TEXTO PARA CONTAR */}
        {activeTab === 'story' && (
          <div className="space-y-6">
            {/* Header description */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📖</span>
                  <h2 className="text-lg font-bold text-stone-900">
                    Texto para contar
                  </h2>
                </div>
                <p className="text-sm font-medium text-amber-800 font-serif mt-0.5">
                  Տեքստ՝ պատմելու համար
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Texto estructurado de 9 párrafos. Haz clic para ver la traducción al armenio. • 9 պարբերությունից բաղկացած պատմություն։ Սեղմեք թարգմանության համար։
                </p>
              </div>

              {/* Practice Timer */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 flex items-center gap-3 shrink-0">
                <Clock className="w-5 h-5 text-amber-700" />
                <div>
                  <div className="text-[11px] font-semibold uppercase text-amber-900 tracking-wider">
                    Cronómetro / Ժամաչափ
                  </div>
                  <div className="text-lg font-mono font-bold text-stone-900">
                    {formatTimer(timerSeconds)}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`p-2 rounded-lg text-white font-bold transition-all ${
                      isTimerRunning
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-amber-700 hover:bg-amber-800'
                    }`}
                    title={isTimerRunning ? 'Pausar' : 'Iniciar'}
                  >
                    {isTimerRunning ? (
                      <Square className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(0);
                    }}
                    className="p-2 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-700 transition-all"
                    title="Reiniciar / Վերսկսել"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* List of paragraphs */}
            <div className="space-y-3.5">
              {EXAM_STORY_PARAGRAPHS.map((paragraph, index) => {
                const isRevealed = viewDirection === 'both' || !!revealedItems[paragraph.id];
                const primaryLang = viewDirection === 'hy-to-es' ? 'hy' : 'es';
                const secondaryLang = primaryLang === 'es' ? 'hy' : 'es';
                const primaryText = primaryLang === 'es' ? paragraph.es : paragraph.hy;
                const secondaryText = secondaryLang === 'es' ? paragraph.es : paragraph.hy;

                return (
                  <div
                    key={paragraph.id}
                    className={`group bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md ${
                      isRevealed
                        ? 'border-amber-300 ring-1 ring-amber-200/70'
                        : 'border-stone-200 hover:border-amber-300/80'
                    }`}
                  >
                    <div className="p-4 sm:p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center border border-stone-200">
                            {index + 1}
                          </span>
                          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                            {primaryLang === 'es' ? '🇪🇸 Español' : '🇦🇲 Հայերեն'}
                          </span>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                          <button
                            onClick={() => handleSpeak(primaryText, primaryLang, `story-p-${paragraph.id}`)}
                            className={`p-1.5 rounded-lg border text-xs transition-colors flex items-center gap-1 ${
                              currentlySpeaking === `story-p-${paragraph.id}`
                                ? 'bg-amber-600 text-white border-amber-600'
                                : 'bg-stone-50 hover:bg-amber-50 text-stone-700 hover:text-amber-800 border-stone-200'
                            }`}
                            title="Pronunciación / Արտասանություն"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => copyToClipboard(primaryText, `story-copy-${paragraph.id}`)}
                            className="p-1.5 rounded-lg border border-stone-200 text-stone-500 hover:text-stone-800 bg-stone-50 hover:bg-stone-100 text-xs transition-colors"
                            title="Copiar / Պատճենել"
                          >
                            {copiedId === `story-copy-${paragraph.id}` ? (
                              <Check className="w-3.5 h-3.5 text-green-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {viewDirection !== 'both' && (
                            <button
                              onClick={() => toggleReveal(paragraph.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1 ${
                                isRevealed
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-stone-100 text-stone-700 hover:bg-amber-50 border-stone-200'
                              }`}
                            >
                              {isRevealed ? (
                                <>
                                  <ChevronUp className="w-3.5 h-3.5" /> Ocultar
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="w-3.5 h-3.5" /> Traducción
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Primary Text (Clickable to reveal) */}
                      <div
                        onClick={() => toggleReveal(paragraph.id)}
                        className="cursor-pointer select-text"
                      >
                        <p className="text-base sm:text-lg font-medium text-stone-900 leading-relaxed group-hover:text-amber-950 transition-colors">
                          {primaryText}
                        </p>
                      </div>

                      {/* Translation Block */}
                      {isRevealed && (
                        <div className="mt-3.5 pt-3.5 border-t border-amber-100 bg-amber-50/50 rounded-xl p-3.5 transition-all">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                              {secondaryLang === 'es' ? '🇪🇸 Español' : '🇦🇲 Հայերեն (Թարգմանություն)'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(secondaryText, secondaryLang, `story-s-${paragraph.id}`);
                              }}
                              className={`p-1 rounded-md text-xs transition-colors flex items-center gap-1 ${
                                currentlySpeaking === `story-s-${paragraph.id}`
                                  ? 'bg-amber-700 text-white'
                                  : 'text-amber-800 hover:bg-amber-200/60'
                              }`}
                              title="Pronunciación / Արտասանություն"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-serif">
                            {secondaryText}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: TEXTO CORTO & RESUMEN */}
        {activeTab === 'short' && (
          <div className="space-y-6">
            {/* Ultra Short Memory Summary Box */}
            <div className="bg-linear-to-r from-amber-600 to-amber-700 text-white rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-white/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-2 text-amber-200 text-xs font-bold tracking-wider uppercase mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Resumen muy corto para memorizar • Շատ կարճ ամփոփում՝ հիշելու համար</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-3">
                Resumen esencial • Ամփոփում
              </h2>

              <div className="space-y-4">
                {/* Spanish */}
                <div className="bg-black/20 backdrop-blur-xs rounded-2xl p-4 border border-white/15">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
                      <span>🇪🇸</span> Español
                    </span>
                    <button
                      onClick={() => handleSpeak(ULTRA_SHORT_SUMMARY.es, 'es', 'ultra-es')}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                      title="Escuchar"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-base sm:text-lg font-medium leading-relaxed">
                    {ULTRA_SHORT_SUMMARY.es}
                  </p>
                </div>

                {/* Armenian */}
                <div className="bg-black/20 backdrop-blur-xs rounded-2xl p-4 border border-white/15">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
                      <span>🇦🇲</span> Հայերեն
                    </span>
                    <button
                      onClick={() => handleSpeak(ULTRA_SHORT_SUMMARY.hy, 'hy', 'ultra-hy')}
                      className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                      title="Լսել"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm sm:text-base font-serif leading-relaxed text-amber-50">
                    {ULTRA_SHORT_SUMMARY.hy}
                  </p>
                </div>
              </div>
            </div>

            {/* Short Answer (Texto corto para responder) */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg sm:text-xl font-bold text-stone-900">
                      Texto corto para responder
                    </h3>
                  </div>
                  <p className="text-sm font-medium text-amber-800 font-serif mt-0.5">
                    Կարճ տեքստ՝ պատասխանելու համար
                  </p>
                </div>
                <span className="text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-full self-start">
                  3 párrafos / 3 պարբերություն
                </span>
              </div>

              <div className="space-y-4">
                {SHORT_EXAM_TEXT_PARAGRAPHS.map((p, idx) => {
                  const isRevealed = viewDirection === 'both' || !!revealedItems[p.id];
                  const primaryText = viewDirection === 'hy-to-es' ? p.hy : p.es;
                  const secondaryText = viewDirection === 'hy-to-es' ? p.es : p.hy;
                  const primaryLang = viewDirection === 'hy-to-es' ? 'hy' : 'es';
                  const secondaryLang = primaryLang === 'es' ? 'hy' : 'es';

                  return (
                    <div
                      key={p.id}
                      onClick={() => toggleReveal(p.id)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                        isRevealed
                          ? 'bg-amber-50/40 border-amber-300'
                          : 'bg-stone-50/80 border-stone-200 hover:border-amber-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                          Párrafo {idx + 1} • {primaryLang === 'es' ? '🇪🇸 Español' : '🇦🇲 Հայերեն'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpeak(primaryText, primaryLang, `short-${p.id}`);
                            }}
                            className="p-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs transition-colors"
                            title="Pronunciación"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                          {viewDirection !== 'both' && (
                            <span className="text-xs text-amber-700 font-medium">
                              {isRevealed ? '▲ Ocultar' : '▼ Traducción'}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-base sm:text-lg font-medium text-stone-900 leading-relaxed">
                        {primaryText}
                      </p>

                      {isRevealed && (
                        <div className="mt-3 pt-3 border-t border-amber-200/80">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[11px] font-bold uppercase text-amber-800">
                              {secondaryLang === 'es' ? '🇪🇸 Español' : '🇦🇲 Հայերեն'}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(secondaryText, secondaryLang, `short-sec-${p.id}`);
                              }}
                              className="p-1 rounded text-amber-800 hover:bg-amber-100"
                            >
                              <Volume2 className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-sm sm:text-base font-serif text-stone-800 leading-relaxed">
                            {secondaryText}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 20 PREGUNTAS Y RESPUESTAS */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            {/* Header + Stats & Mode Switcher */}
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-amber-600" />
                    <h2 className="text-lg font-bold text-stone-900">
                      Preguntas y respuestas (20)
                    </h2>
                  </div>
                  <p className="text-sm font-medium text-amber-800 font-serif mt-0.5">
                    Հարցեր և պատասխաններ (20)
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Haz clic en la pregunta o respuesta para ver la traducción. • Սեղմեք հարցի կամ պատասխանի վրա՝ թարգմանությունը տեսնելու համար։
                  </p>
                </div>

                {/* Mode toggle (List vs Flashcards) & Progress */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="bg-stone-100 p-1 rounded-xl border border-stone-300 flex items-center text-xs font-semibold">
                    <button
                      onClick={() => setQaMode('list')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        qaMode === 'list'
                          ? 'bg-white text-stone-900 shadow-xs font-bold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      Lista (20)
                    </button>
                    <button
                      onClick={() => {
                        setQaMode('flashcard');
                        setFlashcardFlipped(false);
                      }}
                      className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                        qaMode === 'flashcard'
                          ? 'bg-amber-600 text-white shadow-xs font-bold'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tarjetas / Քարտեր</span>
                    </button>
                  </div>

                  {/* Filter chips */}
                  <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
                    <button
                      onClick={() => setQaFilter('all')}
                      className={`px-2.5 py-1 rounded-lg ${
                        qaFilter === 'all'
                          ? 'bg-white font-bold text-stone-900 shadow-2xs'
                          : 'text-stone-600'
                      }`}
                    >
                      Todos ({EXAM_QA_LIST.length})
                    </button>
                    <button
                      onClick={() => setQaFilter('unmastered')}
                      className={`px-2.5 py-1 rounded-lg ${
                        qaFilter === 'unmastered'
                          ? 'bg-white font-bold text-amber-900 shadow-2xs'
                          : 'text-stone-600'
                      }`}
                    >
                      Por aprender ({totalQACount - masteredCount})
                    </button>
                    <button
                      onClick={() => setQaFilter('mastered')}
                      className={`px-2.5 py-1 rounded-lg ${
                        qaFilter === 'mastered'
                          ? 'bg-white font-bold text-green-800 shadow-2xs'
                          : 'text-stone-600'
                      }`}
                    >
                      Aprendido ({masteredCount})
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-3">
                <div className="flex-1 bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200">
                  <div
                    className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${masteredPercentage}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-stone-700 min-w-16 text-right">
                  {masteredCount} / {totalQACount} ({masteredPercentage}%)
                </span>
              </div>
            </div>

            {/* FLASHCARD MODE */}
            {qaMode === 'flashcard' && filteredQA.length > 0 && (
              <div className="max-w-2xl mx-auto space-y-4">
                {(() => {
                  const currentCard = filteredQA[currentFlashcardIndex] || filteredQA[0];
                  if (!currentCard) return null;
                  const isCurrentMastered = !!masteredQA[currentCard.id];

                  return (
                    <div>
                      {/* Card Navigation Header */}
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-2 px-1">
                        <span>
                          Tarjeta {currentFlashcardIndex + 1} / {filteredQA.length} (№{currentCard.id})
                        </span>
                        <button
                          onClick={() => toggleMastered(currentCard.id)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs transition-colors ${
                            isCurrentMastered
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{isCurrentMastered ? 'Aprendido ✓' : 'Marcar como aprendido'}</span>
                        </button>
                      </div>

                      {/* Flip card */}
                      <div
                        onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                        className="min-h-72 sm:min-h-80 bg-white rounded-3xl border-2 border-amber-300 shadow-md p-6 sm:p-8 flex flex-col justify-between cursor-pointer hover:border-amber-400 transition-all select-none relative group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                              {flashcardFlipped ? '💡 Respuesta / Պատասխան' : '❓ Pregunta / Հարց'}
                            </span>
                            <span className="text-xs text-stone-400 group-hover:text-stone-600">
                              Clic para girar 🔄 • Սեղմեք շրջելու համար
                            </span>
                          </div>

                          {!flashcardFlipped ? (
                            /* Front: Question */
                            <div className="space-y-4 pt-2">
                              <div>
                                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                                  🇪🇸 Español
                                </span>
                                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mt-1 leading-snug">
                                  {currentCard.questionEs}
                                </h3>
                              </div>
                              <div className="pt-2 border-t border-stone-100">
                                <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                                  🇦🇲 Հայերեն
                                </span>
                                <p className="text-base sm:text-lg font-serif text-stone-700 mt-1">
                                  {currentCard.questionHy}
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* Back: Answer */
                            <div className="space-y-4 pt-2">
                              <div>
                                <span className="text-xs font-bold text-green-700 uppercase tracking-wider">
                                  🇪🇸 Respuesta
                                </span>
                                <p className="text-lg sm:text-xl font-semibold text-stone-900 mt-1 leading-relaxed">
                                  {currentCard.answerEs}
                                </p>
                              </div>
                              <div className="pt-2 border-t border-stone-100">
                                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                                  🇦🇲 Պատասխան
                                </span>
                                <p className="text-base sm:text-lg font-serif text-stone-800 mt-1 leading-relaxed">
                                  {currentCard.answerHy}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Card bottom actions */}
                        <div
                          className="pt-4 border-t border-stone-100 flex items-center justify-between gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                const text = !flashcardFlipped
                                  ? currentCard.questionEs
                                  : currentCard.answerEs;
                                handleSpeak(text, 'es', `fc-es-${currentCard.id}`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium flex items-center gap-1 border border-stone-200"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                              <span>Español 🇪🇸</span>
                            </button>
                            <button
                              onClick={() => {
                                const text = !flashcardFlipped
                                  ? currentCard.questionHy
                                  : currentCard.answerHy;
                                handleSpeak(text, 'hy', `fc-hy-${currentCard.id}`);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium flex items-center gap-1 border border-stone-200"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                              <span>Հայերեն 🇦🇲</span>
                            </button>
                          </div>

                          <span className="text-xs font-bold text-stone-400">
                            {flashcardFlipped ? 'Respuesta' : 'Pregunta'}
                          </span>
                        </div>
                      </div>

                      {/* Navigation buttons */}
                      <div className="flex items-center justify-between gap-3 mt-4">
                        <button
                          onClick={() => {
                            setCurrentFlashcardIndex((prev) =>
                              prev > 0 ? prev - 1 : filteredQA.length - 1
                            );
                            setFlashcardFlipped(false);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 font-semibold text-xs sm:text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          ← Anterior / Նախորդ
                        </button>
                        <button
                          onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
                        >
                          {flashcardFlipped ? 'Ver pregunta' : 'Ver respuesta'}
                        </button>
                        <button
                          onClick={() => {
                            setCurrentFlashcardIndex((prev) =>
                              prev < filteredQA.length - 1 ? prev + 1 : 0
                            );
                            setFlashcardFlipped(false);
                          }}
                          className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 font-semibold text-xs sm:text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                        >
                          Siguiente / Հաջորդ →
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* LIST MODE (All 20 Questions) */}
            {qaMode === 'list' && (
              <div className="space-y-4">
                {filteredQA.length === 0 && (
                  <div className="bg-white rounded-2xl p-8 text-center text-stone-500">
                    No hay preguntas con el filtro actual.
                  </div>
                )}

                {filteredQA.map((qa) => {
                  const isMastered = !!masteredQA[qa.id];
                  const isCardRevealed = viewDirection === 'both' || !!revealedItems[`qa-card-${qa.id}`];

                  const primaryQuestion = viewDirection === 'hy-to-es' ? qa.questionHy : qa.questionEs;
                  const secondaryQuestion = viewDirection === 'hy-to-es' ? qa.questionEs : qa.questionHy;

                  const primaryAnswer = viewDirection === 'hy-to-es' ? qa.answerHy : qa.answerEs;
                  const secondaryAnswer = viewDirection === 'hy-to-es' ? qa.answerEs : qa.answerHy;

                  return (
                    <div
                      key={qa.id}
                      className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
                        isMastered
                          ? 'border-green-200 bg-green-50/20'
                          : isCardRevealed
                          ? 'border-amber-300'
                          : 'border-stone-200'
                      }`}
                    >
                      <div className="p-4 sm:p-5">
                        {/* Header of Question Card */}
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 font-bold text-xs flex items-center justify-center border border-amber-200">
                              #{qa.id}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                              Pregunta {qa.id} • Հարց {qa.id}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {/* Mastered toggle checkbox */}
                            <button
                              onClick={() => toggleMastered(qa.id)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                                isMastered
                                  ? 'bg-green-600 text-white border-green-600 shadow-2xs'
                                  : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                              }`}
                              title={isMastered ? 'Aprendido' : 'Por aprender'}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">
                                {isMastered ? 'Aprendido' : 'Marcar'}
                              </span>
                            </button>

                            {/* Voice Button Question */}
                            <button
                              onClick={() => handleSpeak(qa.questionEs, 'es', `qa-q-es-${qa.id}`)}
                              className="p-1.5 rounded-lg bg-stone-50 hover:bg-amber-50 text-stone-700 border border-stone-200 text-xs transition-colors"
                              title="Pronunciación (ES)"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                            </button>
                          </div>
                        </div>

                        {/* Question content */}
                        <div
                          onClick={() => toggleReveal(`qa-card-${qa.id}`)}
                          className="cursor-pointer"
                        >
                          <h4 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                            {primaryQuestion}
                          </h4>

                          {/* Secondary question if revealed or both */}
                          {isCardRevealed && (
                            <p className="text-xs sm:text-sm font-serif text-amber-900 mt-1 border-l-2 border-amber-400 pl-2">
                              {secondaryQuestion}
                            </p>
                          )}
                        </div>

                        {/* Answer Section */}
                        <div className="mt-4 pt-3 border-t border-stone-100">
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-green-700 flex items-center gap-1">
                              <span>💡 Respuesta / Պատասխան</span>
                            </span>

                            {/* Voice Button Answer */}
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleSpeak(qa.answerEs, 'es', `qa-a-es-${qa.id}`)}
                                className="px-2 py-0.5 rounded text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                                title="Pronunciación (ES)"
                              >
                                🇪🇸 🔊
                              </button>
                              <button
                                onClick={() => handleSpeak(qa.answerHy, 'hy', `qa-a-hy-${qa.id}`)}
                                className="px-2 py-0.5 rounded text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium"
                                title="Լսել հայերեն"
                              >
                                🇦🇲 🔊
                              </button>
                            </div>
                          </div>

                          {/* Click to reveal answer or translation */}
                          <div
                            onClick={() => toggleReveal(`qa-card-${qa.id}`)}
                            className="cursor-pointer"
                          >
                            <p className="text-sm sm:text-base font-semibold text-stone-900 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
                              {primaryAnswer}
                            </p>

                            {/* Revealed translation for answer */}
                            {isCardRevealed && (
                              <div className="mt-2 pl-3 pr-2 py-2 bg-stone-50 rounded-xl border border-stone-200">
                                <span className="text-[10px] font-bold uppercase text-stone-400 block mb-0.5">
                                  {viewDirection === 'hy-to-es' ? '🇪🇸 Español' : '🇦🇲 Հայերեն'}
                                </span>
                                <p className="text-xs sm:text-sm font-serif text-stone-800 leading-relaxed">
                                  {secondaryAnswer}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: 13 TEMAS EN DETALLE */}
        {activeTab === 'detailed' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900">
                  Tema explicada en detalle (13)
                </h2>
              </div>
              <p className="text-sm font-medium text-amber-800 font-serif mt-0.5">
                Թեման մանրամասն (13)
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Haz clic en cualquier frase para ver la traducción. • Սեղմեք նախադասության վրա՝ թարգմանությունը տեսնելու համար։
              </p>
            </div>

            <div className="space-y-4">
              {filteredSections.map((section) => (
                <div
                  key={section.id}
                  className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-amber-300 transition-all"
                >
                  {/* Section Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3 mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-stone-900">
                        {section.titleEs}
                      </h3>
                      <h4 className="text-xs sm:text-sm font-serif font-semibold text-amber-800 mt-0.5">
                        {section.titleHy}
                      </h4>
                    </div>

                    <button
                      onClick={() => handleSpeak(section.titleEs, 'es', `sec-title-${section.id}`)}
                      className="self-start sm:self-auto p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs flex items-center gap-1"
                      title="Pronunciación"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                      <span className="text-[11px] font-bold">ES</span>
                    </button>
                  </div>

                  {/* Section Sentences */}
                  <div className="space-y-3">
                    {section.sentences.map((sent, sIdx) => {
                      const itemKey = `det-${section.id}-${sIdx}`;
                      const isRevealed = viewDirection === 'both' || !!revealedItems[itemKey];
                      const primaryText = viewDirection === 'hy-to-es' ? sent.hy : sent.es;
                      const secondaryText = viewDirection === 'hy-to-es' ? sent.es : sent.hy;
                      const primaryLang = viewDirection === 'hy-to-es' ? 'hy' : 'es';
                      const secondaryLang = primaryLang === 'es' ? 'hy' : 'es';

                      return (
                        <div
                          key={sIdx}
                          onClick={() => toggleReveal(itemKey)}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                            isRevealed
                              ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-200/50'
                              : 'bg-stone-50/70 border-stone-200 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm sm:text-base font-medium text-stone-900 leading-relaxed">
                              {primaryText}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSpeak(primaryText, primaryLang, `sent-${itemKey}`);
                              }}
                              className="p-1 rounded-md text-stone-500 hover:text-stone-800 hover:bg-stone-200 shrink-0"
                              title="Pronunciación"
                            >
                              <Volume2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {isRevealed && (
                            <div className="mt-2.5 pt-2.5 border-t border-amber-200/60">
                              <span className="text-[10px] font-bold uppercase text-amber-800 block mb-0.5">
                                {secondaryLang === 'es' ? '🇪🇸 Español' : '🇦🇲 Հայերեն'}
                              </span>
                              <p className="text-xs sm:text-sm font-serif text-stone-800 leading-relaxed">
                                {secondaryText}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Highlight words */}
                  {section.highlightWords && section.highlightWords.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-stone-200">
                      <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 mb-3">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        <span>Palabras importantes • Կարևոր բառեր</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {section.highlightWords.map((hw, hwIdx) => (
                          <div
                            key={hwIdx}
                            className="bg-amber-50/90 border border-amber-200 rounded-xl p-3.5"
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold text-sm text-stone-900">
                                {hw.es}
                              </span>
                              <button
                                onClick={() => handleSpeak(hw.es, 'es', `hw-es-${hwIdx}`)}
                                className="text-amber-800 hover:text-amber-950"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-xs font-semibold text-stone-600 mb-2">
                              {hw.explanationEs}
                            </div>
                            <div className="border-t border-amber-200/60 pt-1.5 text-xs font-serif text-amber-950">
                              <div className="font-bold">{hw.hy}</div>
                              <div className="text-stone-700">{hw.explanationHy}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: VOCABULARIO (20) */}
        {activeTab === 'vocab' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <BookMarked className="w-5 h-5 text-amber-600" />
                  <h2 className="text-lg font-bold text-stone-900">
                    Vocabulario importante (20)
                  </h2>
                </div>
                <p className="text-sm font-medium text-amber-800 font-serif mt-0.5">
                  Կարևոր բառապաշար (20)
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  Haz clic en una palabra para ver la traducción. • Սեղմեք բառի վրա՝ թարգմանությունը տեսնելու համար։
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={revealAll}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200"
                >
                  Mostrar todo / Ցույց տալ
                </button>
                <button
                  onClick={hideAll}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200"
                >
                  Ocultar / Թաքցնել
                </button>
              </div>
            </div>

            {/* Vocab Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredVocab.map((item) => {
                const isRevealed = viewDirection === 'both' || !!revealedItems[`vocab-${item.id}`];
                const primaryWord = viewDirection === 'hy-to-es' ? item.hy : item.es;
                const secondaryWord = viewDirection === 'hy-to-es' ? item.es : item.hy;
                const primaryLang = viewDirection === 'hy-to-es' ? 'hy' : 'es';
                const secondaryLang = primaryLang === 'es' ? 'hy' : 'es';

                return (
                  <div
                    key={item.id}
                    onClick={() => toggleReveal(`vocab-${item.id}`)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none shadow-2xs hover:shadow-md ${
                      isRevealed
                        ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-200/50'
                        : 'bg-white border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[11px] font-mono font-bold text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md">
                        #{item.id}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeak(item.es, 'es', `vocab-es-${item.id}`);
                          }}
                          className="p-1 rounded text-stone-500 hover:text-amber-800 hover:bg-stone-100"
                          title="Pronunciación"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-base sm:text-lg font-bold text-stone-900">
                      {primaryWord}
                    </div>

                    {isRevealed ? (
                      <div className="mt-3 pt-2.5 border-t border-amber-200/80">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block mb-0.5">
                          {secondaryLang === 'es' ? '🇪🇸 Español' : '🇦🇲 Հայերեն'}
                        </span>
                        <div className="text-sm sm:text-base font-serif font-semibold text-stone-800">
                          {secondaryWord}
                        </div>
                      </div>
                    ) : (
                      <div className="mt-3 pt-2.5 border-t border-dashed border-stone-200 flex items-center justify-between text-xs text-stone-400 font-medium">
                        <span>Traducción / Թարգմանություն</span>
                        <span>▼</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 6: COMPARACIÓN PALEOLÍTICO VS NEOLÍTICO */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-stone-900">
                  Diferencia entre Paleolítico y Neolítico
                </h2>
              </div>
              <p className="text-sm font-medium text-amber-800 font-serif mt-0.5">
                Պալեոլիթի և Նեոլիթի տարբերությունը
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Haz clic en cada tarjeta para ver la traducción. • Սեղմեք քարտի վրա՝ թարգմանությունը տեսնելու համար։
              </p>
            </div>

            {/* Comparison Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {COMPARISON_ROWS.map((row) => {
                const isRevealed = viewDirection === 'both' || !!revealedItems[`comp-${row.id}`];

                return (
                  <div
                    key={row.id}
                    onClick={() => toggleReveal(`comp-${row.id}`)}
                    className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:border-amber-300 transition-all cursor-pointer"
                  >
                    {/* Feature Title */}
                    <div className="flex items-center justify-between gap-2 border-b border-stone-100 pb-2.5 mb-4">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                          Característica #{row.id} • Հատկանիշ #{row.id}
                        </span>
                        <h4 className="text-base font-bold text-stone-900">
                          {row.feature.es}
                        </h4>
                        <p className="text-xs font-serif text-stone-600">
                          {row.feature.hy}
                        </p>
                      </div>
                      <span className="text-xs text-stone-400 font-medium">
                        {isRevealed ? '▲ Ocultar' : '▼ Traducción'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Paleolithic Column */}
                      <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                          Paleolítico
                        </span>
                        <div className="text-sm font-semibold text-stone-900">
                          {row.paleolithic.es}
                        </div>
                        {isRevealed && (
                          <div className="mt-2 pt-2 border-t border-stone-200 text-xs font-serif text-stone-700">
                            {row.paleolithic.hy}
                          </div>
                        )}
                      </div>

                      {/* Neolithic Column */}
                      <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                          Neolítico
                        </span>
                        <div className="text-sm font-bold text-stone-900">
                          {row.neolithic.es}
                        </div>
                        {isRevealed && (
                          <div className="mt-2 pt-2 border-t border-amber-200 text-xs font-serif text-amber-950 font-medium">
                            {row.neolithic.hy}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-stone-200 py-6 text-stone-600 text-xs">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            <span className="font-bold text-stone-900">Unit 1: Prehistory</span> — El Neolítico / Նեոլիթյան ժամանակաշրջանը
            <p className="text-stone-500 mt-0.5">
              Material interactivo de estudio (Español 🇪🇸 — Հայերեն 🇦🇲) • Ինտերակտիվ ուսումնական նյութ
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-md text-[11px]">
              20 preguntas • 20 términos • 13 temas / 20 հարց • 20 բառ • 13 թեմա
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
