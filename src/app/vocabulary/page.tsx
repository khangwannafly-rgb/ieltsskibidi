"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  BookMarked,
  Volume2,
  CheckCircle2,
  Plus,
  Search,
  Layers,
  BrainCircuit,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import {
  VocabItem,
  VocabTopic,
  loadVocabVault,
  addWordToVault,
  toggleVocabStatus,
  removeVocabItem,
} from "@/lib/vocabulary";

const TOPICS: { id: "all" | VocabTopic; label: string }[] = [
  { id: "all", label: "Tất cả chủ đề" },
  { id: "Environment", label: "Environment" },
  { id: "Technology", label: "Technology" },
  { id: "Education", label: "Education" },
  { id: "Urbanisation", label: "Urbanisation" },
  { id: "Economy & Society", label: "Economy & Society" },
  { id: "Academic Task 1", label: "Writing Task 1" },
  { id: "Saved from Tests", label: "Đã lưu từ đề thi" },
];

export default function VocabularyPage() {
  const [items, setItems] = useState<VocabItem[]>([]);
  const [activeMode, setActiveMode] = useState<"vault" | "flashcards" | "quiz">("vault");
  const [selectedTopic, setSelectedTopic] = useState<"all" | VocabTopic>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "learning" | "mastered">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Add custom word modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [newExample, setNewExample] = useState("");
  const [newTopic, setNewTopic] = useState<VocabTopic>("Saved from Tests");
  const [newLevel, setNewLevel] = useState<"C1" | "C2">("C1");

  // Flashcard state
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(0);

  useEffect(() => {
    const sync = () => setItems(loadVocabVault());
    sync();
    window.addEventListener("vocab-updated", sync);
    return () => window.removeEventListener("vocab-updated", sync);
  }, []);

  const speakWord = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-GB";
    utter.rate = 0.92;
    window.speechSynthesis.speak(utter);
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedTopic !== "all" && item.topic !== selectedTopic) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.word.toLowerCase().includes(q) ||
          item.meaning.toLowerCase().includes(q) ||
          item.example.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [items, selectedTopic, statusFilter, searchQuery]);

  const masteredCount = items.filter((i) => i.status === "mastered").length;
  const savedFromTestsCount = items.filter((i) => i.topic === "Saved from Tests" || i.isCustom).length;

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;
    addWordToVault({
      word: newWord.trim(),
      meaning: newMeaning.trim(),
      example: newExample.trim() || undefined,
      topic: newTopic,
      level: newLevel,
    });
    setItems(loadVocabVault());
    setNewWord("");
    setNewMeaning("");
    setNewExample("");
    setShowAddModal(false);
  };

  // Flashcard deck
  const deck = filteredItems.length > 0 ? filteredItems : items;
  const currentCard = deck[cardIdx % Math.max(1, deck.length)];

  // Quiz generator
  const quizQuestions = useMemo(() => {
    const pool = items.length >= 4 ? items : [];
    return pool.map((target, idx) => {
      const distractors = pool
        .filter((w) => w.id !== target.id)
        .slice(0, 10)
        .sort((a, b) => ((a.id.charCodeAt(4) + idx) % 5) - ((b.id.charCodeAt(4) + idx) % 3))
        .slice(0, 3)
        .map((d) => d.word);
      const options = [target.word, ...distractors].sort((a, b) => a.localeCompare(b));
      const escaped = target.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const maskedSentence = target.example.replace(new RegExp(escaped, "gi"), "__________");
      return {
        target,
        sentence:
          maskedSentence !== target.example
            ? maskedSentence
            : `${target.example} (Từ đồng nghĩa / thuật ngữ tương ứng: __________)`,
        options,
      };
    });
  }, [items]);

  const currentQuiz = quizQuestions[quizIdx % Math.max(1, quizQuestions.length)];

  const handleSelectQuizOption = (option: string) => {
    if (selectedOption || !currentQuiz) return;
    setSelectedOption(option);
    setQuizAnswered((prev) => prev + 1);
    if (option === currentQuiz.target.word) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const nextQuizQuestion = () => {
    setSelectedOption(null);
    setQuizIdx((prev) => (prev + 1) % Math.max(1, quizQuestions.length));
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-4rem)] pt-8 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider">
              <BookMarked className="w-3.5 h-3.5" />
              IELTS SKIBIDI • Academic Lexical Resource (C1–C2)
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sổ tay Từ vựng Học thuật & Flashcard Ôn tập
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Hệ thống hóa các cụm từ học thuật (Academic Collocations C1–C2) giúp nâng điểm Lexical
              Resource trong Writing & Speaking, đồng thời lưu trữ mọi từ vựng bạn đánh dấu trực
              tiếp từ phòng thi Reading & Listening.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-[11px] font-semibold uppercase text-slate-500">Tổng số từ</div>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">{items.length}</div>
            </div>
            <div className="px-4 py-3 bg-emerald-50/70 rounded-lg border border-emerald-200 text-center">
              <div className="text-[11px] font-semibold uppercase text-emerald-700">Đã thuộc</div>
              <div className="text-2xl font-bold text-emerald-700 font-mono mt-0.5">
                {masteredCount}
              </div>
            </div>
            <div className="px-4 py-3 bg-blue-50/70 rounded-lg border border-blue-200 text-center">
              <div className="text-[11px] font-semibold uppercase text-blue-700">Lưu từ đề thi</div>
              <div className="text-2xl font-bold text-blue-700 font-mono mt-0.5">
                {savedFromTestsCount}
              </div>
            </div>
          </div>
        </div>

        {/* Mode Switcher & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveMode("vault")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === "vault"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookMarked className="w-4 h-4" />
              Sổ tay Từ vựng ({filteredItems.length})
            </button>
            <button
              onClick={() => {
                setActiveMode("flashcards");
                setCardIdx(0);
                setIsFlipped(false);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === "flashcards"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-4 h-4" />
              Lật thẻ Flashcard
            </button>
            <button
              onClick={() => {
                setActiveMode("quiz");
                setSelectedOption(null);
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === "quiz"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              Trắc nghiệm Ngữ cảnh
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary !py-2.5 !px-4 !text-xs inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Thêm từ vựng vào Sổ tay
          </button>
        </div>

        {/* Filter Bar (For Vault & Flashcards) */}
        {activeMode !== "quiz" && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm từ vựng, nghĩa tiếng Việt hoặc mẫu câu ví dụ..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:border-blue-600 outline-none"
                />
              </div>

              <div className="flex items-center gap-2">
                {(
                  [
                    { id: "all", label: "Tất cả" },
                    { id: "learning", label: "Đang học" },
                    { id: "mastered", label: "Đã thuộc" },
                  ] as const
                ).map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setStatusFilter(st.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      statusFilter === st.id
                        ? "bg-blue-50 border-blue-600 text-blue-800"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
              {TOPICS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setSelectedTopic(t.id);
                    setCardIdx(0);
                    setIsFlipped(false);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    selectedTopic === t.id
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* MODE 1: VOCABULARY VAULT */}
        {activeMode === "vault" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredItems.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                <p className="text-slate-600 font-semibold">
                  Không tìm thấy từ vựng phù hợp với bộ lọc hiện tại.
                </p>
                <button
                  onClick={() => {
                    setSelectedTopic("all");
                    setStatusFilter("all");
                    setSearchQuery("");
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-bold text-slate-900">{item.word}</h3>
                          <button
                            onClick={() => speakWord(item.word)}
                            className="p-1.5 rounded-md bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors"
                            title="Nghe phát âm chuẩn Anh-Anh"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                          <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold font-mono">
                            {item.level}
                          </span>
                          <span className="text-xs text-slate-400 italic">{item.partOfSpeech}</span>
                        </div>
                        <p className="text-xs font-mono text-slate-500 mt-0.5">{item.phonetic}</p>
                      </div>

                      <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold shrink-0">
                        {item.topic}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200/70">
                      {item.meaning}
                    </p>

                    {item.collocations.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                          Academic Collocations
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {item.collocations.map((col, idx) => (
                            <span
                              key={idx}
                              className="px-2.5 py-1 rounded-md bg-blue-50/60 border border-blue-100 text-blue-900 text-xs font-medium"
                            >
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                        Ví dụ trong IELTS Writing / Reading
                      </span>
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        &ldquo;{item.example}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setItems(toggleVocabStatus(item.id))}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        item.status === "mastered"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {item.status === "mastered" ? "Đã thuộc lòng" : "Đánh dấu đã thuộc"}
                    </button>

                    {item.isCustom && (
                      <button
                        onClick={() => setItems(removeVocabItem(item.id))}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa từ này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* MODE 2: FLASHCARDS */}
        {activeMode === "flashcards" && currentCard && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>
                Thẻ {(cardIdx % deck.length) + 1} / {deck.length} • Chủ đề:{" "}
                <strong className="text-slate-900">{currentCard.topic}</strong>
              </span>
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCardIdx((prev) => (prev + 3) % deck.length);
                }}
                className="inline-flex items-center gap-1.5 text-blue-700 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Đổi thẻ ngẫu nhiên
              </button>
            </div>

            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-600 shadow-sm p-8 sm:p-12 min-h-[340px] flex flex-col justify-between cursor-pointer transition-all select-none"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono">
                  {currentCard.level} • {currentCard.partOfSpeech}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {isFlipped ? "Mặt sau (Nghĩa & Ngữ cảnh)" : "Mặt trước (Bấm để lật thẻ)"}
                </span>
              </div>

              {!isFlipped ? (
                <div className="my-auto text-center space-y-4 py-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                    {currentCard.word}
                  </h2>
                  <p className="text-sm font-mono text-slate-500">{currentCard.phonetic}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakWord(currentCard.word);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-semibold transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    Nghe phát âm
                  </button>
                </div>
              ) : (
                <div className="my-auto space-y-5 py-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1">
                      Nghĩa học thuật
                    </div>
                    <p className="text-lg font-bold text-slate-900">{currentCard.meaning}</p>
                  </div>

                  {currentCard.collocations.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Collocations ăn điểm
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {currentCard.collocations.map((c, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                      Câu ví dụ chuẩn Band 8.5
                    </div>
                    <p className="text-sm text-slate-700 italic leading-relaxed">
                      &ldquo;{currentCard.example}&rdquo;
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Bấm vào bất kỳ đâu trên thẻ để lật</span>
                <span
                  className={`font-semibold ${
                    currentCard.status === "mastered" ? "text-emerald-600" : "text-amber-600"
                  }`}
                >
                  {currentCard.status === "mastered" ? "● Đã thuộc" : "● Đang học"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCardIdx((prev) => (prev - 1 + deck.length) % deck.length);
                }}
                className="px-4 py-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Thẻ trước
              </button>

              <button
                onClick={() => setItems(toggleVocabStatus(currentCard.id))}
                className={`px-5 py-2.5 rounded-lg text-xs font-semibold border transition-all ${
                  currentCard.status === "mastered"
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-white border-slate-300 text-slate-800 hover:border-slate-900"
                }`}
              >
                {currentCard.status === "mastered" ? "Đã thuộc lòng ✓" : "Đánh dấu Đã thuộc"}
              </button>

              <button
                onClick={() => {
                  setIsFlipped(false);
                  setCardIdx((prev) => (prev + 1) % deck.length);
                }}
                className="px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                Thẻ tiếp theo
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* MODE 3: CONTEXTUAL COLLOCATION QUIZ */}
        {activeMode === "quiz" && currentQuiz && (
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  Academic Lexical Quiz
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  Chọn thuật ngữ học thuật C1–C2 phù hợp với ngữ cảnh
                </h2>
              </div>
              <div className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold font-mono">
                Điểm: {quizScore} / {quizAnswered}
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-500">
                Gợi ý nghĩa tiếng Việt:{" "}
                <span className="text-slate-900 font-bold">{currentQuiz.target.meaning}</span>
              </div>
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-base text-slate-800 font-medium leading-relaxed">
                &ldquo;{currentQuiz.sentence}&rdquo;
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {currentQuiz.options.map((opt) => {
                const isCorrect = opt === currentQuiz.target.word;
                const isChosen = selectedOption === opt;
                let btnStyle =
                  "bg-white border-slate-200 text-slate-800 hover:border-blue-600 hover:bg-blue-50/30";
                if (selectedOption) {
                  if (isCorrect) {
                    btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-900 font-bold";
                  } else if (isChosen) {
                    btnStyle = "bg-rose-50 border-rose-400 text-rose-800";
                  } else {
                    btnStyle = "bg-slate-50 border-slate-200 text-slate-400";
                  }
                }
                return (
                  <button
                    key={opt}
                    onClick={() => handleSelectQuizOption(opt)}
                    disabled={!!selectedOption}
                    className={`p-4 rounded-xl border text-left text-sm font-semibold transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {selectedOption && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                    {selectedOption && isChosen && !isCorrect && (
                      <X className="w-4 h-4 text-rose-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {selectedOption && (
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-blue-900">
                    Đáp án đúng: {currentQuiz.target.word} ({currentQuiz.target.phonetic})
                  </div>
                  <p className="text-xs text-slate-600">
                    Collocations: {currentQuiz.target.collocations.join(" • ")}
                  </p>
                </div>
                <button
                  onClick={nextQuizQuestion}
                  className="btn-primary !py-2.5 !px-5 !text-xs shrink-0"
                >
                  Câu tiếp theo →
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal thêm từ vựng mới */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Thêm từ vựng vào Sổ tay IELTS SKIBIDI
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddWord} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Từ hoặc Cụm từ học thuật (Collocation) *
                </label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="Ví dụ: mitigate the adverse impacts"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Chủ đề</label>
                  <select
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value as VocabTopic)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white outline-none"
                  >
                    {TOPICS.filter((t) => t.id !== "all").map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Cấp độ CEFR
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value as "C1" | "C2")}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-800 bg-white outline-none"
                  >
                    <option value="C1">C1 (Band 7.0–7.5)</option>
                    <option value="C2">C2 (Band 8.0–9.0)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nghĩa tiếng Việt *
                </label>
                <input
                  type="text"
                  required
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="Ví dụ: Giảm thiểu các tác động bất lợi"
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Câu ví dụ ngữ cảnh (Tùy chọn)
                </label>
                <textarea
                  rows={2}
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="Ví dụ: Policymakers must act swiftly to mitigate the adverse impacts of inflation."
                  className="w-full px-3.5 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:border-blue-600 outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary !py-2 !px-5 !text-xs">
                  Lưu vào Sổ tay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
