"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Clock, AlertTriangle, Trophy, Flag, RotateCcw, Type } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { isAnswerCorrect } from "@/lib/answers";
import ExamAnnotationSuite from "@/components/ExamAnnotationSuite";

const TEST_DURATION = 1200; // 20 minutes per Reading Passage (60 mins / 3 passages in real IELTS)

interface ReadingQuestion {
  id: number;
  type: string;
  group?: string;
  instruction?: string;
  box_title?: string;
  box_items?: string[];
  word_limit?: string;
  question: string;
  options?: string[];
}

const PASSAGE_MODES = [
  { id: "all", label: "Ngẫu nhiên (Đa dạng)", desc: "Xoay vòng đủ mọi dạng: Matching Headings (i–vii), Matching Researchers, Sentence Endings, Word Bank, T/F/NG, Y/N/NG" },
  { id: "Passage 1", label: "Passage 1 · Descriptive", desc: "Sentence/Note Completion + True/False/Not Given + Matching Paragraph Info" },
  { id: "Passage 2", label: "Passage 2 · Analytical", desc: "Matching Researchers (A–D) / Sentence Endings (A–F) + Yes/No/Not Given + MCQ" },
  { id: "Passage 3", label: "Passage 3 · Argumentative", desc: "Matching Headings (i–vii) + Summary Word Bank (A–F) + Yes/No/Not Given" },
];

export default function ReadingPage() {
  const { user, addSubmission } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<string>("all");
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [fontScale, setFontScale] = useState<"sm" | "md" | "lg">("md");
  const submittingRef = useRef(false);
  const examContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data && !data.error && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [data, submitted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAnswer = (id: number) => data?.answers?.find((a: any) => a.id === id);
  const isCorrect = (id: number) => isAnswerCorrect(userAnswers[id], getAnswer(id)?.correct_answer);

  const generateTask = async (sectionOverride?: string) => {
    const sectionToUse = sectionOverride !== undefined ? sectionOverride : selectedSection;
    setLoading(true);
    setData(null);
    setUserAnswers({});
    setFlagged({});
    setSubmitted(false);
    setShowResultModal(false);
    setTimeLeft(TEST_DURATION);
    try {
      const res = await fetch("/api/generate/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetScore: user?.targetScore || 6.5,
          section: sectionToUse,
        }),
      });
      const json = await res.json().catch(() => ({ error: "Phản hồi từ máy chủ không hợp lệ" }));
      if (!json.error && (!Array.isArray(json.questions) || !Array.isArray(json.answers))) {
        json.error = "Đề bài AI tạo ra không hợp lệ. Vui lòng thử lại.";
      }
      setData(json);
      window.scrollTo({ top: 0 });
    } catch (error) {
      console.error(error);
      setData({ error: "Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (id: number, value: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const toggleFlag = (id: number) => {
    setFlagged((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const submitTest = useCallback(async (auto = false) => {
    if (!data || submitted || submittingRef.current) return;
    if (!auto) {
      const unanswered = data.questions.filter((q: { id: number }) => !userAnswers[q.id]?.trim()).length;
      if (unanswered > 0 && !window.confirm(`Bạn còn ${unanswered} câu chưa trả lời. Vẫn nộp bài?`)) return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const orderedUserAnswers = data.answers.map((ans: { id: number }) => userAnswers[ans.id] || "");
      
      const res = await fetch("/api/score/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswers: orderedUserAnswers,
          correctAnswers: data.answers
        })
      });
      const scoreData = await res.json();
      if (!res.ok || scoreData.error) throw new Error(scoreData.error || "Failed to score");

      setData({ ...data, score: scoreData });
      setSubmitted(true);
      setShowResultModal(true);
      
      addSubmission({
        skill: 'reading',
        band: scoreData.band,
        details: {
          title: data.title,
          section: data.section,
          rawScore: scoreData.rawScore,
          totalQuestions: scoreData.totalQuestions,
          timeSpent: TEST_DURATION - timeLeft,
          questions: data.questions,
          answers: data.answers,
          userAnswers,
        }
      });
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }, [data, submitted, userAnswers, addSubmission, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && data && !data.error && !submitted) {
      submitTest(true);
    }
  }, [timeLeft, data, submitted, submitTest]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-[#F9FAFB] p-6">
        <div className="w-full max-w-md p-10 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-b-4 border-purple-600 rounded-full"
            />
            <BookOpen className="absolute inset-0 m-auto w-9 h-9 text-purple-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Đang biên soạn đề Reading...</h2>
            <p className="text-slate-500 text-sm font-medium">Chuẩn hóa đoạn văn học thuật (700–900 từ) và 13 câu hỏi chuẩn Cambridge IELTS cho mục tiêu Band {user?.targetScore || 6.5}.</p>
          </div>
        </div>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-[#F9FAFB] p-6">
        <div className="max-w-md w-full p-10 bg-white rounded-3xl border border-rose-100 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-600 border border-rose-100">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Lỗi hệ thống</h2>
            <p className="text-slate-500 text-sm font-medium">{data.error}</p>
          </div>
          <button onClick={() => generateTask()} className="btn-primary w-full py-4 text-xs">
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  const answeredCount = data?.questions
    ? data.questions.filter((q: { id: number }) => userAnswers[q.id]?.trim()).length
    : 0;

  const passageFontClass =
    fontScale === "sm" ? "text-[15px] leading-7" : fontScale === "lg" ? "text-[19px] leading-8" : "text-[16.5px] leading-[1.8]";

  return (
    <div className="bg-[#F9FAFB] flex flex-col">
      {!data ? (
        <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          <div className="max-w-3xl w-full bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 md:p-10 space-y-7 relative">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-left border-b border-slate-100 pb-6">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 shrink-0">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <div className="space-y-1">
                <span className="inline-block text-[11px] font-extrabold text-purple-600 uppercase tracking-wider">
                  IELTS Academic Reading · Đa dạng dạng bài
                </span>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                  Phòng Thi Reading
                </h1>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Đầy đủ các dạng câu hỏi chuẩn Cambridge: Matching Headings (i–vii), Matching Researchers, Sentence Endings, Word Bank, Note/Summary Completion, T/F/NG, Y/N/NG & MCQ.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {PASSAGE_MODES.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedSection(m.id)}
                  className={`p-4 rounded-2xl border transition-all space-y-1.5 ${
                    selectedSection === m.id
                      ? "bg-purple-50/80 border-purple-600 ring-2 ring-purple-500/20"
                      : "bg-slate-50/70 border-slate-200 hover:border-purple-200 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">{m.label}</span>
                    {selectedSection === m.id && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-600 text-white">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{m.desc}</p>
                </button>
              ))}
            </div>

            <button 
              onClick={() => generateTask(selectedSection)}
              className="btn-primary w-full !py-4 text-sm mx-auto flex items-center justify-center gap-3 group"
            >
              Bắt đầu làm bài ({PASSAGE_MODES.find((m) => m.id === selectedSection)?.label})
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col lg:h-[calc(100vh-4rem)]">
          {/* Exam Top Bar */}
          <div className="h-16 bg-white text-slate-900 flex items-center justify-between px-6 border-b border-slate-200 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-extrabold uppercase tracking-wider">
                {data.section || "Reading Passage 1"}
              </span>
              <span className="text-sm font-bold text-slate-600 hidden md:inline">
                Questions 1–{data.questions.length} · Spend about 20 minutes
              </span>
              <button
                onClick={() => generateTask()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-600 text-xs font-bold transition-colors"
                title="Đổi sang đề và dạng bài khác"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Đổi đề khác
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Highlight & Sticky Notes Tool (IDP/BC Computer-Delivered Standard) */}
              <ExamAnnotationSuite containerRef={examContainerRef} resetKey={data.title} />

              {/* Font size control */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                <Type className="w-4 h-4 text-slate-500 ml-2 mr-1" />
                {(["sm", "md", "lg"] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setFontScale(sz)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      fontScale === sz ? "bg-white text-purple-700 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {sz === "sm" ? "A-" : sz === "md" ? "A" : "A+"}
                  </button>
                ))}
              </div>

              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-black text-base tabular-nums ${
                timeLeft < 180 && !submitted
                  ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse'
                  : 'bg-slate-50 text-slate-900 border-slate-200'
              }`}>
                <Clock className="w-4 h-4 text-purple-600" />
                <span>{formatTime(timeLeft)}</span>
              </div>

              {!submitted ? (
                <button 
                  onClick={() => submitTest(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all disabled:opacity-50 shadow-sm"
                >
                  {submitting ? 'Đang chấm...' : 'Nộp bài'}
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowResultModal(true)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs uppercase tracking-wider transition-all"
                  >
                    Band {data.score?.band} ({data.score?.rawScore}/{data.score?.totalQuestions})
                  </button>
                  <button
                    onClick={() => generateTask()}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Làm đề mới"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Split-Screen Panes (Left: Passage, Right: Questions) */}
          <div ref={examContainerRef} className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Pane: Academic Reading Passage */}
            <div className="w-full lg:w-1/2 lg:h-full overflow-y-auto p-6 md:p-10 bg-white border-b lg:border-b-0 lg:border-r border-slate-200">
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="border-b border-slate-200 pb-5 space-y-2">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-purple-600">
                    {data.section || "READING PASSAGE"}
                  </p>
                  <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                    {data.title || "Academic Reading Passage"}
                  </h1>
                  {data.subtitle && (
                    <p className="text-slate-500 text-sm italic font-medium">{data.subtitle}</p>
                  )}
                </div>

                <div className={`markdown-passage text-slate-800 ${passageFontClass}`}>
                  <ReactMarkdown>{data.passage || ""}</ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Right Pane: Grouped Questions */}
            <div className="w-full lg:w-1/2 lg:h-full overflow-y-auto p-6 md:p-10 bg-[#F8FAFC]">
              <div className="max-w-2xl mx-auto space-y-5 pb-12">
                {data.questions.map((q: ReadingQuestion, idx: number) => {
                  const prevGroup = idx > 0 ? data.questions[idx - 1]?.group : null;
                  const showGroupHeader = Boolean(q.group && q.group !== prevGroup);

                  return (
                    <div key={q.id} className="space-y-4">
                      {showGroupHeader && (
                        <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 shadow-sm mt-4">
                          <h3 className="text-sm font-extrabold uppercase tracking-wider text-purple-300">
                            {q.group}
                          </h3>
                          {q.instruction && (
                            <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed font-medium">
                              {q.instruction}
                            </p>
                          )}
                          {Array.isArray(q.box_items) && q.box_items.length > 0 && (
                            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-4 space-y-2 mt-2">
                              {q.box_title && (
                                <p className="text-[11px] font-black uppercase tracking-widest text-amber-300">
                                  {q.box_title}
                                </p>
                              )}
                              <div className="grid grid-cols-1 gap-1.5">
                                {q.box_items.map((item, bi) => (
                                  <div key={bi} className="text-xs font-semibold text-slate-100 leading-relaxed">
                                    {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        id={`q-${q.id}`}
                        className={`bg-white rounded-2xl p-6 border transition-all ${
                          submitted
                            ? isCorrect(q.id)
                              ? "border-emerald-200 bg-emerald-50/20"
                              : "border-rose-200 bg-rose-50/20"
                            : userAnswers[q.id]?.trim()
                            ? "border-purple-200 shadow-sm"
                            : "border-slate-200/80 shadow-sm hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                            submitted
                              ? isCorrect(q.id)
                                ? "bg-emerald-600 text-white"
                                : "bg-rose-600 text-white"
                              : userAnswers[q.id]?.trim()
                              ? "bg-purple-600 text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}>
                            {idx + 1}
                          </span>

                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between gap-3">
                              <p className="text-slate-900 font-semibold text-base leading-relaxed">
                                {q.question}
                              </p>
                              <button
                                type="button"
                                onClick={() => toggleFlag(q.id)}
                                title="Đánh dấu xem lại (Review)"
                                className={`p-1.5 rounded-lg border text-xs transition-colors flex-shrink-0 ${
                                  flagged[q.id]
                                    ? "bg-amber-50 border-amber-300 text-amber-600"
                                    : "border-transparent text-slate-300 hover:text-slate-500"
                                }`}
                              >
                                <Flag className="w-4 h-4 fill-current" />
                              </button>
                            </div>

                            {q.word_limit && q.type === "FILL" && (
                              <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                {q.word_limit}
                              </span>
                            )}

                            {(q.type === 'MCQ' || q.type === 'HEAD') && Array.isArray(q.options) && q.options.length > 0 ? (
                              <div className="grid gap-2.5">
                                {q.options.map((opt: string, i: number) => (
                                  <label
                                    key={i}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                                      submitted ? "cursor-default" : "cursor-pointer"
                                    } ${
                                      userAnswers[q.id] === opt
                                        ? "bg-purple-50 border-purple-500 text-purple-900 font-bold"
                                        : "bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-white hover:border-purple-300"
                                    }`}
                                  >
                                    <input 
                                      type="radio" 
                                      name={`q-${q.id}`}
                                      disabled={submitted}
                                      checked={userAnswers[q.id] === opt}
                                      onChange={() => handleAnswerChange(q.id, opt)}
                                      className="w-4 h-4 accent-purple-600"
                                    />
                                    <span>{opt}</span>
                                  </label>
                                ))}
                              </div>
                            ) : q.type === 'TFN' || q.type === 'YNN' ? (
                              <div className="flex flex-wrap gap-2.5">
                                {(q.type === 'YNN' ? ['Yes', 'No', 'Not Given'] : ['True', 'False', 'Not Given']).map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    disabled={submitted}
                                    onClick={() => handleAnswerChange(q.id, opt)}
                                    className={`px-5 py-2.5 rounded-xl border text-xs font-extrabold uppercase tracking-wider transition-all ${
                                      userAnswers[q.id] === opt 
                                        ? 'bg-purple-600 border-purple-600 text-white shadow-sm' 
                                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-700 hover:bg-white'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <input 
                                type="text"
                                disabled={submitted}
                                placeholder="Nhập đáp án từ bài đọc..."
                                value={userAnswers[q.id] || ''}
                                onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 outline-none transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                              />
                            )}

                            {submitted && (
                              <div className={`mt-3 p-4 rounded-xl border text-sm space-y-2 ${
                                isCorrect(q.id)
                                  ? 'bg-emerald-50/70 border-emerald-200'
                                  : 'bg-rose-50/70 border-rose-200'
                              }`}>
                                <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
                                  {!isCorrect(q.id) && (
                                    <span className="text-rose-700">
                                      Bạn chọn: <strong className="underline">{userAnswers[q.id]?.trim() || '(bỏ trống)'}</strong>
                                    </span>
                                  )}
                                  <span className="text-emerald-800">
                                    Đáp án đúng: <strong className="px-2 py-0.5 rounded bg-white border border-emerald-200">{getAnswer(q.id)?.correct_answer ?? '—'}</strong>
                                  </span>
                                </div>
                                {getAnswer(q.id)?.explanation && (
                                  <p className="text-slate-600 text-xs leading-relaxed">
                                    <strong className="text-slate-800">Giải thích:</strong> {getAnswer(q.id)?.explanation}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Question Palette Bar (Chuẩn IELTS on Computer) */}
          <div className="h-14 bg-white border-t border-slate-200 px-6 flex items-center justify-between gap-4 flex-shrink-0 overflow-x-auto">
            <div className="flex items-center gap-1.5">
              {data.questions.map((q: { id: number }, idx: number) => {
                const answered = Boolean(userAnswers[q.id]?.trim());
                const isFlag = Boolean(flagged[q.id]);
                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      const el = document.getElementById(`q-${q.id}`);
                      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }}
                    className={`relative w-8 h-8 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center border ${
                      submitted
                        ? isCorrect(q.id)
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "bg-rose-600 border-rose-600 text-white"
                        : answered
                        ? "bg-purple-600 border-purple-600 text-white"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:border-purple-400"
                    }`}
                  >
                    {idx + 1}
                    {isFlag && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="text-xs font-bold text-slate-500 whitespace-nowrap">
              Đã làm: <span className="text-purple-600 font-black">{answeredCount}/{data.questions.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {submitted && showResultModal && data.score && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl max-w-lg w-full overflow-hidden border border-slate-100 shadow-2xl"
          >
            <div className="bg-gradient-purple p-8 text-center text-white">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black tracking-tight">Kết quả Reading Academic</h3>
              <p className="text-purple-100 text-sm mt-1">{data.title}</p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-slate-400 text-[11px] font-extrabold uppercase tracking-wider mb-1">Số câu đúng</p>
                  <div className="text-4xl font-black text-slate-900 tabular-nums">
                    {data.score.rawScore}<span className="text-slate-300 mx-1 text-2xl">/</span>{data.score.totalQuestions}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-6 bg-purple-600 rounded-2xl text-white">
                  <p className="text-purple-100 text-[11px] font-extrabold uppercase tracking-wider mb-1">Estimated Band</p>
                  <div className="text-4xl font-black tabular-nums">{data.score.band.toFixed(1)}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button 
                  onClick={() => setShowResultModal(false)}
                  className="py-3.5 bg-white hover:bg-slate-50 text-slate-900 rounded-xl font-extrabold uppercase tracking-wider text-xs transition-all border border-slate-200"
                >
                  Xem giải thích chi tiết
                </button>
                <button 
                  onClick={() => generateTask()}
                  className="btn-primary !py-3.5 !rounded-xl text-xs"
                >
                  Làm Passage tiếp theo
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .markdown-passage h2 { font-size: 1.05rem; font-weight: 800; margin-top: 1.75rem; margin-bottom: 0.5rem; color: #6d28d9; text-transform: uppercase; letter-spacing: 0.04em; }
        .markdown-passage p { margin-bottom: 1.25rem; color: #1e293b; text-align: justify; }
        .markdown-passage strong { color: #0f172a; font-weight: 700; }
      `}</style>
    </div>
  );
}
