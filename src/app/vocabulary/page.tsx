"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BookMarked,
  Volume2,
  CheckCircle2,
  Plus,
  Search,
  Layers,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Sparkles,
  Check,
  X,
  Shuffle,
  Dices,
  Flame,
  Zap,
  RefreshCw,
  Keyboard,
} from "lucide-react";
import {
  VocabItem,
  VocabTopic,
  loadVocabVault,
  addWordToVault,
  addBatchToVault,
  toggleVocabStatus,
  removeVocabItem,
  shuffleArray,
} from "@/lib/vocabulary";

const TOPICS: { id: "all" | VocabTopic; label: string }[] = [
  { id: "all", label: "Tất cả chủ đề" },
  { id: "Environment", label: "Environment" },
  { id: "Technology", label: "Technology" },
  { id: "Education", label: "Education" },
  { id: "Urbanisation", label: "Urbanisation" },
  { id: "Economy & Society", label: "Economy & Society" },
  { id: "Health & Psychology", label: "Health & Psychology" },
  { id: "Crime & Law", label: "Crime & Law" },
  { id: "Media & Culture", label: "Media & Culture" },
  { id: "Science & Innovation", label: "Science & Innovation" },
  { id: "Academic Task 1", label: "Writing Task 1" },
  { id: "Saved from Tests", label: "Đã lưu từ đề thi" },
];

type QuizQuestionType = "cloze" | "meaning" | "collocation";
type QuizFilterMode = "mix" | QuizQuestionType;

interface GeneratedQuizQuestion {
  id: string;
  type: QuizQuestionType;
  target: VocabItem;
  promptLabel: string;
  promptMain: string;
  promptSub: string;
  options: string[];
}

function buildRandomQuizSet(
  pool: VocabItem[],
  mode: QuizFilterMode,
  maxQuestions = 10
): GeneratedQuizQuestion[] {
  if (pool.length < 4) return [];
  const shuffledTargets = shuffleArray(pool).slice(0, Math.min(maxQuestions, pool.length));
  const types: QuizQuestionType[] = ["cloze", "meaning", "collocation"];

  return shuffledTargets.map((target, idx) => {
    const qType: QuizQuestionType =
      mode === "mix" ? types[Math.floor(Math.random() * types.length)] : mode;

    const distractors = shuffleArray(pool.filter((w) => w.id !== target.id))
      .slice(0, 3)
      .map((d) => d.word);
    const options = shuffleArray([target.word, ...distractors]);

    const escaped = target.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const maskedSentence = target.example.replace(new RegExp(escaped, "gi"), "__________");

    if (qType === "meaning") {
      return {
        id: `${target.id}_meaning_${idx}`,
        type: "meaning",
        target,
        promptLabel: "NHẬN DIỆN THUẬT NGỮ HỌC THUẬT (MEANING → TERM)",
        promptMain: target.meaning,
        promptSub: `Chủ đề: ${target.topic} • Từ loại: ${target.partOfSpeech} (${target.level})`,
        options,
      };
    }

    if (qType === "collocation") {
      const sampleCols = (target.collocations || [])
        .map((c) => c.replace(new RegExp(escaped, "gi"), " [ ... ] "))
        .join("  •  ");
      const synText =
        target.synonyms && target.synonyms.length > 0
          ? `Từ đồng nghĩa học thuật: ${target.synonyms.join(", ")}`
          : `Nghĩa gợi ý: ${target.meaning}`;
      return {
        id: `${target.id}_col_${idx}`,
        type: "collocation",
        target,
        promptLabel: "GHÉP CỤM COLLOCATION & ĐỒNG NGHĨA (LEXICAL MATCH)",
        promptMain: sampleCols || `Cụm từ đi kèm trong chủ đề ${target.topic}: [ ... ]`,
        promptSub: synText,
        options,
      };
    }

    return {
      id: `${target.id}_cloze_${idx}`,
      type: "cloze",
      target,
      promptLabel: "ĐIỀN TỪ VÀO NGỮ CẢNH BAND 8.5+ (CONTEXTUAL CLOZE)",
      promptMain:
        maskedSentence !== target.example
          ? maskedSentence
          : `${target.example} (Thuật ngữ tương ứng: __________)`,
      promptSub: `Gợi ý nghĩa: ${target.meaning}`,
      options,
    };
  });
}

export default function VocabularyPage() {
  const [items, setItems] = useState<VocabItem[]>([]);
  const [activeMode, setActiveMode] = useState<"vault" | "flashcards" | "quiz">("vault");
  const [selectedTopic, setSelectedTopic] = useState<"all" | VocabTopic>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "learning" | "mastered">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Randomization state for Vault & Spotlight
  const [spotlightId, setSpotlightId] = useState<string | null>(null);
  const [shuffledIds, setShuffledIds] = useState<string[] | null>(null);
  const [randomSprintIds, setRandomSprintIds] = useState<string[] | null>(null);
  const [generatingBatch, setGeneratingBatch] = useState(false);
  const [batchBanner, setBatchBanner] = useState<string | null>(null);

  // Add custom word modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [newExample, setNewExample] = useState("");
  const [newTopic, setNewTopic] = useState<VocabTopic>("Saved from Tests");
  const [newLevel, setNewLevel] = useState<"C1" | "C2">("C1");
  const [aiExplaining, setAiExplaining] = useState(false);

  // Flashcard state
  const [flashcardOrder, setFlashcardOrder] = useState<string[] | null>(null);
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz state
  const [quizMode, setQuizMode] = useState<QuizFilterMode>("mix");
  const [quizSeed, setQuizSeed] = useState(1);
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [inputRecallMode, setInputRecallMode] = useState(false);
  const [typedGuess, setTypedGuess] = useState("");

  useEffect(() => {
    const sync = () => {
      const loaded = loadVocabVault();
      setItems(loaded);
      setSpotlightId((prev) => {
        if (prev && loaded.some((i) => i.id === prev)) return prev;
        return loaded.length > 0
          ? loaded[Math.floor(Math.random() * loaded.length)].id
          : null;
      });
    };
    sync();
    window.addEventListener("vocab-updated", sync);
    return () => window.removeEventListener("vocab-updated", sync);
  }, []);

  const speakWord = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-GB";
    utter.rate = 0.92;
    window.speechSynthesis.speak(utter);
  }, []);

  const rollRandomSpotlight = () => {
    if (items.length === 0) return;
    const candidates = items.length > 1 ? items.filter((i) => i.id !== spotlightId) : items;
    const picked = candidates[Math.floor(Math.random() * candidates.length)];
    if (picked) setSpotlightId(picked.id);
  };

  const spotlightItem = useMemo(() => {
    if (items.length === 0) return null;
    return items.find((i) => i.id === spotlightId) || items[0];
  }, [items, spotlightId]);

  // Base filtered items
  const baseFilteredItems = useMemo(() => {
    return items.filter((item) => {
      if (selectedTopic !== "all" && item.topic !== selectedTopic) return false;
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.word.toLowerCase().includes(q) ||
          item.meaning.toLowerCase().includes(q) ||
          item.example.toLowerCase().includes(q) ||
          (item.synonyms || []).some((s) => s.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [items, selectedTopic, statusFilter, searchQuery]);

  // Displayed items in Vault (supporting Shuffle & Random Sprint)
  const displayedVaultItems = useMemo(() => {
    let list = baseFilteredItems;
    if (randomSprintIds && randomSprintIds.length > 0) {
      const sprintSet = new Set(randomSprintIds);
      const sprintItems = list.filter((i) => sprintSet.has(i.id));
      if (sprintItems.length > 0) list = sprintItems;
    }
    if (shuffledIds && shuffledIds.length > 0) {
      const rankMap = new Map(shuffledIds.map((id, idx) => [id, idx]));
      return [...list].sort((a, b) => (rankMap.get(a.id) ?? 9999) - (rankMap.get(b.id) ?? 9999));
    }
    return list;
  }, [baseFilteredItems, shuffledIds, randomSprintIds]);

  const handleShuffleVault = () => {
    const shuffled = shuffleArray(baseFilteredItems.map((i) => i.id));
    setShuffledIds(shuffled);
    setRandomSprintIds(null);
  };

  const handleRandomSprint = (count = 8) => {
    const learningPool = baseFilteredItems.filter((i) => i.status === "learning");
    const source = learningPool.length >= count ? learningPool : baseFilteredItems;
    const picked = shuffleArray(source)
      .slice(0, count)
      .map((i) => i.id);
    setRandomSprintIds(picked);
    setShuffledIds(picked);
  };

  const handleResetRandomFilters = () => {
    setShuffledIds(null);
    setRandomSprintIds(null);
  };

  const handleGenerateRandomBatch = async () => {
    if (generatingBatch) return;
    setGeneratingBatch(true);
    setBatchBanner(null);
    try {
      const res = await fetch("/api/generate/vocabulary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic === "Saved from Tests" ? "all" : selectedTopic,
          count: 4,
          excludeWords: items.map((i) => i.word),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.items) && data.items.length > 0) {
          const { addedItems, allItems } = addBatchToVault(data.items);
          setItems(allItems);
          if (addedItems.length > 0) {
            setSpotlightId(addedItems[0].id);
            setBatchBanner(
              `🎲 Đã tạo & thêm ${addedItems.length} từ học thuật C1–C2 ngẫu nhiên mới: ${addedItems
                .map((a) => a.word)
                .join(", ")}`
            );
          } else {
            const randomPick = shuffleArray(allItems).slice(0, 4);
            setRandomSprintIds(randomPick.map((i) => i.id));
            setShuffledIds(randomPick.map((i) => i.id));
            setBatchBanner("🎲 Đã rút ngẫu nhiên 4 từ vựng trọng tâm để bạn ôn luyện!");
          }
        }
      }
    } catch {
      // Fallback: pick 4 random words from current items
      const randomPick = shuffleArray(items).slice(0, 4);
      setRandomSprintIds(randomPick.map((i) => i.id));
      setBatchBanner("🎲 Đã chọn ngẫu nhiên 4 từ vựng trọng tâm từ kho lưu trữ!");
    } finally {
      setGeneratingBatch(false);
    }
  };

  const handleAIExplain = async () => {
    if (!newWord.trim() || aiExplaining) return;
    setAiExplaining(true);
    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: newWord.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.meaning) setNewMeaning(data.meaning);
        if (data.example) setNewExample(data.example);
        if (data.level === "C1" || data.level === "C2") setNewLevel(data.level);
      }
    } catch {
      // ignore
    } finally {
      setAiExplaining(false);
    }
  };

  const masteredCount = items.filter((i) => i.status === "mastered").length;
  const savedFromTestsCount = items.filter(
    (i) => i.topic === "Saved from Tests" || i.isCustom
  ).length;

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

  // Flashcard deck (supports shuffling & random sprint)
  const deck = useMemo(() => {
    const base = baseFilteredItems.length > 0 ? baseFilteredItems : items;
    if (!flashcardOrder || flashcardOrder.length === 0) return base;
    const map = new Map(base.map((i) => [i.id, i]));
    const ordered = flashcardOrder.map((id) => map.get(id)).filter(Boolean) as VocabItem[];
    return ordered.length > 0 ? ordered : base;
  }, [baseFilteredItems, items, flashcardOrder]);

  const currentCard = deck[cardIdx % Math.max(1, deck.length)];

  const shuffleFlashcardDeck = useCallback(() => {
    const base = baseFilteredItems.length > 0 ? baseFilteredItems : items;
    setFlashcardOrder(shuffleArray(base.map((i) => i.id)));
    setCardIdx(0);
    setIsFlipped(false);
  }, [baseFilteredItems, items]);

  const pickRandomFlashcard = useCallback(() => {
    if (deck.length <= 1) return;
    setIsFlipped(false);
    setCardIdx((prev) => {
      let next = Math.floor(Math.random() * deck.length);
      if (next === prev) next = (prev + 1) % deck.length;
      return next;
    });
  }, [deck.length]);

  // Keyboard shortcuts for Flashcards
  useEffect(() => {
    if (activeMode !== "flashcards" || showAddModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.code === "ArrowRight") {
        setIsFlipped(false);
        setCardIdx((prev) => (prev + 1) % Math.max(1, deck.length));
      } else if (e.code === "ArrowLeft") {
        setIsFlipped(false);
        setCardIdx((prev) => (prev - 1 + Math.max(1, deck.length)) % Math.max(1, deck.length));
      } else if (e.key.toLowerCase() === "r") {
        pickRandomFlashcard();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeMode, showAddModal, deck.length, pickRandomFlashcard]);

  // Randomized Multi-Mode Quiz
  const quizQuestions = useMemo(() => {
    const pool = baseFilteredItems.length >= 4 ? baseFilteredItems : items;
    void quizSeed;
    return buildRandomQuizSet(pool, quizMode, 10);
  }, [baseFilteredItems, items, quizMode, quizSeed]);

  const currentQuiz = quizQuestions[quizIdx];
  const isQuizFinished = quizQuestions.length > 0 && quizIdx >= quizQuestions.length;

  const startNewRandomQuiz = (newMode?: QuizFilterMode) => {
    if (newMode) setQuizMode(newMode);
    setQuizSeed((s) => s + 1);
    setQuizIdx(0);
    setSelectedOption(null);
    setTypedGuess("");
    setQuizScore(0);
    setQuizAnswered(0);
    setQuizStreak(0);
  };

  const handleSelectQuizOption = (option: string) => {
    if (selectedOption || !currentQuiz) return;
    setSelectedOption(option);
    setQuizAnswered((prev) => prev + 1);
    const isRight = option.trim().toLowerCase() === currentQuiz.target.word.trim().toLowerCase();
    if (isRight) {
      setQuizScore((prev) => prev + 1);
      setQuizStreak((prev) => prev + 1);
    } else {
      setQuizStreak(0);
    }
  };

  const handleTypedGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedGuess.trim() || selectedOption || !currentQuiz) return;
    const clean = typedGuess.trim().toLowerCase();
    const targetClean = currentQuiz.target.word.trim().toLowerCase();
    if (clean === targetClean) {
      handleSelectQuizOption(currentQuiz.target.word);
    } else {
      handleSelectQuizOption(typedGuess.trim());
    }
  };

  const nextQuizQuestion = () => {
    setSelectedOption(null);
    setTypedGuess("");
    setQuizIdx((prev) => prev + 1);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-[calc(100vh-4rem)] pt-8 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold uppercase tracking-wider">
              <BookMarked className="w-3.5 h-3.5" />
              IELTS SKIBIDI • Academic Lexical Resource (C1–C2)
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Sổ tay Từ vựng Học thuật & Ôn luyện Ngẫu nhiên
            </h1>
            <p className="text-slate-600 text-sm leading-relaxed">
              Kho từ vựng & Academic Collocations C1–C2 đa chủ đề chuẩn Cambridge. Hỗ trợ rút từ
              ngẫu nhiên, xáo trộn thẻ Flashcard và tạo đề trắc nghiệm đa dạng mỗi lần học.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200 text-center">
              <div className="text-[11px] font-semibold uppercase text-slate-500">Tổng số từ</div>
              <div className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                {items.length}
              </div>
            </div>
            <div className="px-4 py-3 bg-emerald-50/70 rounded-lg border border-emerald-200 text-center">
              <div className="text-[11px] font-semibold uppercase text-emerald-700">Đã thuộc</div>
              <div className="text-2xl font-bold text-emerald-700 font-mono mt-0.5">
                {masteredCount}
              </div>
            </div>
            <div className="px-4 py-3 bg-blue-50/70 rounded-lg border border-blue-200 text-center">
              <div className="text-[11px] font-semibold uppercase text-blue-700">
                Mở rộng / Đề thi
              </div>
              <div className="text-2xl font-bold text-blue-700 font-mono mt-0.5">
                {savedFromTestsCount}
              </div>
            </div>
          </div>
        </div>

        {/* RANDOM WORD SPOTLIGHT BANNER */}
        {spotlightItem && (
          <div className="bg-slate-900 text-white rounded-xl p-5 sm:p-6 shadow-sm border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-2.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-bold uppercase tracking-wider">
                  <Dices className="w-3.5 h-3.5" />
                  Từ vựng Ngẫu nhiên Trọng tâm
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono font-bold">
                  {spotlightItem.level} • {spotlightItem.partOfSpeech}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 text-[11px] font-semibold">
                  {spotlightItem.topic}
                </span>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {spotlightItem.word}
                </h2>
                <span className="text-xs font-mono text-slate-400">{spotlightItem.phonetic}</span>
                <button
                  onClick={() => speakWord(spotlightItem.word)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-200 transition-colors"
                  title="Nghe phát âm chuẩn Anh-Anh"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-sm text-slate-200 font-medium">{spotlightItem.meaning}</p>
              <p className="text-xs text-slate-400 italic">
                Ví dụ: &ldquo;{spotlightItem.example}&rdquo;
              </p>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={rollRandomSpotlight}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Dices className="w-4 h-4" />
                Đổi từ ngẫu nhiên khác
              </button>
              <button
                type="button"
                onClick={handleGenerateRandomBatch}
                disabled={generatingBatch}
                className="px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 text-xs font-semibold inline-flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                {generatingBatch ? "Đang rút từ..." : "+4 Từ C1–C2 Ngẫu nhiên"}
              </button>
            </div>
          </div>
        )}

        {batchBanner && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-between gap-3">
            <span>{batchBanner}</span>
            <button
              onClick={() => setBatchBanner(null)}
              className="text-blue-700 hover:text-blue-950 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Mode Switcher & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex-wrap">
            <button
              onClick={() => setActiveMode("vault")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === "vault"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookMarked className="w-4 h-4" />
              Sổ tay Từ vựng ({displayedVaultItems.length})
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
              Flashcard Ngẫu nhiên
            </button>
            <button
              onClick={() => {
                setActiveMode("quiz");
                startNewRandomQuiz();
              }}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                activeMode === "quiz"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BrainCircuit className="w-4 h-4" />
              Trắc nghiệm Ngẫu nhiên
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {activeMode === "vault" && (
              <>
                <button
                  onClick={handleShuffleVault}
                  className="px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <Shuffle className="w-3.5 h-3.5 text-blue-700" />
                  Xáo trộn vị trí
                </button>
                <button
                  onClick={() => handleRandomSprint(8)}
                  className="px-3.5 py-2.5 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100/80 text-blue-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-blue-700" />
                  Học nhanh 8 từ ngẫu nhiên
                </button>
              </>
            )}
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary !py-2.5 !px-4 !text-xs inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm từ mới
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm từ vựng, từ đồng nghĩa, nghĩa tiếng Việt hoặc mẫu câu..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 focus:border-blue-600 outline-none"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {(
                [
                  { id: "all", label: "Tất cả" },
                  { id: "learning", label: "Đang học" },
                  { id: "mastered", label: "Đã thuộc" },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setStatusFilter(st.id);
                    handleResetRandomFilters();
                  }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                    statusFilter === st.id
                      ? "bg-blue-50 border-blue-600 text-blue-800"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {st.label}
                </button>
              ))}
              {(shuffledIds || randomSprintIds) && (
                <button
                  onClick={handleResetRandomFilters}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  Hiện toàn bộ ({baseFilteredItems.length})
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTopic(t.id);
                  handleResetRandomFilters();
                  setFlashcardOrder(null);
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

        {/* MODE 1: VOCABULARY VAULT */}
        {activeMode === "vault" && (
          <div className="space-y-4">
            {randomSprintIds && (
              <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-900">
                  <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Chế độ Học nhanh Ngẫu nhiên: Đang lọc {displayedVaultItems.length} từ vựng bất
                    kỳ để tập trung ghi nhớ sâu.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRandomSprint(8)}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <Dices className="w-3.5 h-3.5" />
                    Đổi 8 từ khác
                  </button>
                  <button
                    onClick={handleResetRandomFilters}
                    className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold"
                  >
                    Thoát chế độ
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {displayedVaultItems.length === 0 ? (
                <div className="col-span-full bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                  <p className="text-slate-600 font-semibold">
                    Không tìm thấy từ vựng phù hợp với bộ lọc hiện tại.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedTopic("all");
                      setStatusFilter("all");
                      setSearchQuery("");
                      handleResetRandomFilters();
                    }}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
                  >
                    Đặt lại bộ lọc
                  </button>
                </div>
              ) : (
                displayedVaultItems.map((item) => (
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
                            <span className="text-xs text-slate-400 italic">
                              {item.partOfSpeech}
                            </span>
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

                      {item.synonyms && item.synonyms.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap text-xs">
                          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            Synonyms:
                          </span>
                          {item.synonyms.map((syn, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                            >
                              {syn}
                            </span>
                          ))}
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
          </div>
        )}

        {/* MODE 2: FLASHCARDS */}
        {activeMode === "flashcards" && currentCard && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-semibold text-slate-500 bg-white p-3.5 rounded-xl border border-slate-200">
              <span>
                Thẻ {(cardIdx % deck.length) + 1} / {deck.length} • Chủ đề:{" "}
                <strong className="text-slate-900">{currentCard.topic}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={shuffleFlashcardDeck}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 inline-flex items-center gap-1.5 transition-colors"
                >
                  <Shuffle className="w-3.5 h-3.5 text-blue-700" />
                  Xáo trộn cả bộ thẻ
                </button>
                <button
                  onClick={pickRandomFlashcard}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 inline-flex items-center gap-1.5 transition-colors"
                >
                  <Dices className="w-3.5 h-3.5" />
                  Rút thẻ ngẫu nhiên (Phím R)
                </button>
              </div>
            </div>

            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-600 shadow-sm p-8 sm:p-12 min-h-[360px] flex flex-col justify-between cursor-pointer transition-all select-none"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold font-mono">
                  {currentCard.level} • {currentCard.partOfSpeech}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {isFlipped ? "Mặt sau (Nghĩa & Ngữ cảnh)" : "Mặt trước (Bấm hoặc Space để lật)"}
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

                  {currentCard.synonyms && currentCard.synonyms.length > 0 && (
                    <div className="text-xs text-slate-600">
                      <strong className="text-slate-900">Từ đồng nghĩa (Synonyms): </strong>
                      {currentCard.synonyms.join(", ")}
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
                <span className="inline-flex items-center gap-1.5">
                  <Keyboard className="w-3.5 h-3.5" />
                  Phím tắt: Space (Lật) • ←/→ (Chuyển) • R (Ngẫu nhiên)
                </span>
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

        {/* MODE 3: RANDOMIZED MULTI-MODE QUIZ */}
        {activeMode === "quiz" && (
          <div className="max-w-3xl mx-auto space-y-5">
            {/* Quiz Mode Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 flex-wrap">
                {(
                  [
                    { id: "mix", label: "🎲 Hỗn hợp Ngẫu nhiên" },
                    { id: "cloze", label: "Điền từ Ngữ cảnh" },
                    { id: "meaning", label: "Nghĩa → Thuật ngữ" },
                    { id: "collocation", label: "Collocation & Synonym" },
                  ] as const
                ).map((m) => (
                  <button
                    key={m.id}
                    onClick={() => startNewRandomQuiz(m.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      quizMode === m.id
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setInputRecallMode((v) => !v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                    inputRecallMode
                      ? "bg-blue-50 border-blue-600 text-blue-800"
                      : "bg-white border-slate-200 text-slate-600"
                  }`}
                >
                  {inputRecallMode ? "Chế độ: Tự gõ từ" : "Chế độ: 4 Đáp án"}
                </button>
                <button
                  onClick={() => startNewRandomQuiz()}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  Đổi bộ đề mới
                </button>
              </div>
            </div>

            {isQuizFinished ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center space-y-5 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center mx-auto">
                  <BrainCircuit className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Hoàn thành lượt luyện tập ngẫu nhiên
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Kết quả: {quizScore} / {quizQuestions.length} câu chính xác
                  </h2>
                  <p className="text-sm text-slate-600">
                    Tỷ lệ chính xác:{" "}
                    <strong>{Math.round((quizScore / quizQuestions.length) * 100)}%</strong>
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => startNewRandomQuiz()}
                    className="btn-primary !py-2.5 !px-6 !text-xs inline-flex items-center gap-2"
                  >
                    <Dices className="w-4 h-4" />
                    Tạo đề 10 câu ngẫu nhiên mới
                  </button>
                </div>
              </div>
            ) : (
              currentQuiz && (
                <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-3">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
                        Câu {quizIdx + 1} / {quizQuestions.length} • {currentQuiz.promptLabel}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                        Chọn thuật ngữ C1–C2 chính xác nhất
                      </h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {quizStreak > 0 && (
                        <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold inline-flex items-center gap-1">
                          <Flame className="w-3.5 h-3.5 text-amber-600" />
                          Streak: {quizStreak}
                        </div>
                      )}
                      <div className="px-3.5 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-bold font-mono">
                        Điểm: {quizScore} / {quizAnswered}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-slate-500">
                      {currentQuiz.promptSub}
                    </div>
                    <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 text-base text-slate-900 font-semibold leading-relaxed">
                      &ldquo;{currentQuiz.promptMain}&rdquo;
                    </div>
                  </div>

                  {inputRecallMode ? (
                    <form onSubmit={handleTypedGuessSubmit} className="space-y-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          disabled={!!selectedOption}
                          value={typedGuess}
                          onChange={(e) => setTypedGuess(e.target.value)}
                          placeholder={`Gợi ý chữ cái đầu: "${currentQuiz.target.word.slice(0, 2)}..." (${currentQuiz.target.word.length} ký tự)`}
                          className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:border-blue-600 outline-none"
                        />
                        {!selectedOption && (
                          <button
                            type="submit"
                            className="btn-primary !px-6 !py-3 !text-xs shrink-0"
                          >
                            Kiểm tra
                          </button>
                        )}
                      </div>
                    </form>
                  ) : (
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
                            {selectedOption && isCorrect && (
                              <Check className="w-4 h-4 text-emerald-600" />
                            )}
                            {selectedOption && isChosen && !isCorrect && (
                              <X className="w-4 h-4 text-rose-600" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {selectedOption && (
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-900">
                            Đáp án đúng: {currentQuiz.target.word} ({currentQuiz.target.phonetic})
                          </span>
                          <button
                            type="button"
                            onClick={() => speakWord(currentQuiz.target.word)}
                            className="p-1 rounded bg-white text-blue-700 border border-blue-200"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 font-medium">
                          Nghĩa: {currentQuiz.target.meaning}
                        </p>
                        <p className="text-xs text-slate-600">
                          Collocations: {currentQuiz.target.collocations.join(" • ")}
                        </p>
                      </div>
                      <button
                        onClick={nextQuizQuestion}
                        className="btn-primary !py-2.5 !px-5 !text-xs shrink-0"
                      >
                        {quizIdx + 1 >= quizQuestions.length
                          ? "Xem kết quả tổng kết →"
                          : "Câu ngẫu nhiên tiếp theo →"}
                      </button>
                    </div>
                  )}
                </div>
              )
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
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Từ hoặc Cụm từ học thuật (Collocation) *
                  </label>
                  <button
                    type="button"
                    onClick={handleAIExplain}
                    disabled={!newWord.trim() || aiExplaining}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:underline disabled:opacity-40"
                  >
                    <Sparkles className="w-3 h-3" />
                    {aiExplaining ? "Đang phân tích..." : "AI tự động điền nghĩa & ví dụ"}
                  </button>
                </div>
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
