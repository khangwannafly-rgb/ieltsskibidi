"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Send, RefreshCw, BarChart2, CheckCircle, AlertTriangle, ChevronRight, BookOpen, Clock, Sparkles, Timer, Trophy, Eye, FileText, Dices, Check } from "lucide-react";
import WritingTask1Chart from "@/components/WritingTask1Chart";
import WritingInteractiveDiff from "@/components/WritingInteractiveDiff";
import { useUser } from "@/context/UserContext";
import { VocabItem, loadVocabVault, shuffleArray } from "@/lib/vocabulary";

const TASK1_SUBTYPES = [
  { id: "all", label: "Ngẫu nhiên (Mọi dạng)" },
  { id: "line", label: "Line Graph (Đường)" },
  { id: "bar", label: "Bar Chart (Cột)" },
  { id: "pie", label: "Pie Chart (Tròn)" },
  { id: "table", label: "Table (Bảng số liệu)" },
  { id: "process", label: "Process (Quy trình)" },
  { id: "map", label: "Map (Bản đồ)" },
  { id: "multiple", label: "Mixed (Kết hợp 2 biểu đồ)" },
];

const TASK2_SUBTYPES = [
  { id: "all", label: "Ngẫu nhiên (Mọi dạng)" },
  { id: "discussion", label: "Discuss Both Views" },
  { id: "opinion", label: "Agree / Disagree" },
  { id: "advantages", label: "Advantages / Disadvantages" },
  { id: "problem_solution", label: "Causes & Solutions" },
  { id: "two_part", label: "Two-Part Question" },
];

export default function WritingPage() {
  const { user, addSubmission } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [question, setQuestion] = useState<any>(null);
  const [essay, setEssay] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [taskType, setTaskType] = useState<"task1" | "task2">("task2");
  const [task1Sub, setTask1Sub] = useState<string>("all");
  const [task2Sub, setTask2Sub] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"structure" | "vocab" | "sample">("structure");
  const [timeLeft, setTimeLeft] = useState(0);
  const [lexicalTargets, setLexicalTargets] = useState<VocabItem[]>([]);
  const [selectedLexicalHint, setSelectedLexicalHint] = useState<VocabItem | null>(null);

  const rollLexicalTargets = useCallback((forType: "task1" | "task2") => {
    const vault = loadVocabVault();
    const pool =
      forType === "task1"
        ? vault.filter((v) => v.topic === "Academic Task 1")
        : vault.filter((v) => v.topic !== "Academic Task 1");
    const picked = shuffleArray(pool.length >= 5 ? pool : vault).slice(0, 5);
    setLexicalTargets(picked);
    setSelectedLexicalHint(null);
  }, []);

  useEffect(() => {
    rollLexicalTargets(taskType);
  }, [taskType, rollLexicalTargets]);

  useEffect(() => {
    if (!question || question.error || result) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [question, result]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const generateTask = async (type: "task1" | "task2", subTypeOverride?: string) => {
    const subToUse = subTypeOverride !== undefined ? subTypeOverride : type === "task1" ? task1Sub : task2Sub;
    setLoading(true);
    setQuestion(null);
    setResult(null);
    setShowResult(false);
    setScoreError(null);
    setEssay("");
    setTaskType(type);
    setActiveTab("structure");
    setTimeLeft(type === "task1" ? 20 * 60 : 40 * 60);
    try {
      const res = await fetch("/api/generate/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type,
          subType: subToUse,
          targetScore: user?.targetScore || 6.5
        }),
      });
      const data = await res.json().catch(() => ({ error: "Phản hồi từ máy chủ không hợp lệ" }));
      if (!res.ok && !data.error) data.error = "Không thể tạo đề bài";
      setQuestion(data);
    } catch (error) {
      console.error(error);
      setQuestion({ error: "Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;
  const paragraphCount = essay.trim() ? essay.trim().split(/\n\s*\n/).filter(Boolean).length : 0;
  const minWords = question?.min_words || (taskType === "task1" ? 150 : 250);

  const submitEssay = async () => {
    if (loading || result) return;
    setLoading(true);
    setScoreError(null);
    try {
      const res = await fetch("/api/score/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: question.question, 
          essay,
          task_type: taskType
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to score writing task");
      }

      setResult(data);
      setShowResult(true);

      addSubmission({
        skill: 'writing',
        band: data.overall_band,
        details: {
          taskType,
          prompt: question.question,
          essay,
          criteria_scores: data.criteria_scores,
          criteria_feedback: data.criteria_feedback,
          strengths: data.strengths,
          key_improvements: data.key_improvements,
          revisions: data.revisions,
          lexical_upgrades: data.lexical_upgrades,
          sample_answer: question.sample_answer,
          wordCount
        }
      });
    } catch (error) {
      console.error(error);
      setScoreError(error instanceof Error ? error.message : "Không thể chấm bài. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-[#F9FAFB] p-6">
        <div className="w-full max-w-md p-10 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-6">
          <div className="relative w-20 h-20 mx-auto">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-b-4 border-purple-600 rounded-full"
            />
            <PenTool className="absolute inset-0 m-auto w-9 h-9 text-purple-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Đang biên soạn đề Writing...</h2>
            <p className="text-slate-500 text-sm font-medium">AI đang chuẩn bị đề thi {taskType === "task1" ? "Academic Task 1 (kèm biểu đồ & bài mẫu)" : "Academic Task 2"} cho mục tiêu Band {user?.targetScore || 6.5}.</p>
          </div>
        </div>
      </div>
    );
  }

  if (question?.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-[#F9FAFB] p-6">
        <div className="max-w-md w-full p-10 bg-white rounded-3xl border border-rose-100 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-600 border border-rose-100">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Lỗi hệ thống</h2>
            <p className="text-slate-500 text-sm font-medium">{question.error}</p>
          </div>
          <button onClick={() => generateTask(taskType)} className="btn-primary w-full py-4 text-xs">
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  const structureLabelMap: Record<string, string> = {
    introduction: "1. Introduction (Mở bài)",
    overview: "2. Overview (Tổng quan — Bắt buộc ở Task 1)",
    body_paragraph_1: "3. Body Paragraph 1 (Thân bài 1)",
    body_paragraph_2: "4. Body Paragraph 2 (Thân bài 2)",
    body_1: "2. Body Paragraph 1 (Luận điểm 1)",
    body_2: "3. Body Paragraph 2 (Luận điểm 2)",
    conclusion: "4. Conclusion (Kết bài)",
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F9FAFB] pb-16">
      {!question ? (
        <div className="max-w-5xl mx-auto px-6 pt-8 space-y-10">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              IELTS Academic Writing · Official Band Descriptors (TA/TR · CC · LR · GRA)
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Phòng Thi <span className="text-gradient">Writing</span>
            </h1>
            <p className="text-slate-600 text-base font-medium max-w-2xl">
              Luyện viết theo chuẩn thi máy (IELTS on Computer) với đề bài chuẩn Cambridge, biểu đồ trực quan, bài mẫu Band 8.5 và chấm điểm chi tiết theo 4 tiêu chí.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 text-left transition-all border border-slate-200/80 shadow-md hover:shadow-xl hover:border-purple-300 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 border border-purple-100">
                    <BarChart2 className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-extrabold">20 phút · 150+ từ · 7 dạng biểu đồ</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Academic Writing Task 1</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    Chọn dạng biểu đồ bạn muốn luyện hoặc để hệ thống chọn ngẫu nhiên:
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TASK1_SUBTYPES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setTask1Sub(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        task1Sub === st.id
                          ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-purple-300"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => generateTask("task1", task1Sub)}
                className="btn-primary w-full !py-4 text-xs flex items-center justify-center gap-2 group"
              >
                <span>Bắt đầu làm Task 1 ({TASK1_SUBTYPES.find((s) => s.id === task1Sub)?.label})</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="bg-white rounded-3xl p-8 text-left transition-all border border-slate-200/80 shadow-md hover:shadow-xl hover:border-purple-300 flex flex-col justify-between space-y-6">
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 border border-purple-100">
                    <PenTool className="w-7 h-7" />
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-extrabold">40 phút · 250+ từ · 5 dạng bài luận</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Academic Writing Task 2</h3>
                  <p className="text-slate-600 text-sm font-medium leading-relaxed">
                    Chọn dạng câu hỏi nghị luận bạn muốn luyện hoặc xoay vòng ngẫu nhiên:
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TASK2_SUBTYPES.map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setTask2Sub(st.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        task2Sub === st.id
                          ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-purple-300"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => generateTask("task2", task2Sub)}
                className="btn-primary w-full !py-4 text-xs flex items-center justify-center gap-2 group"
              >
                <span>Bắt đầu làm Task 2 ({TASK2_SUBTYPES.find((s) => s.id === task2Sub)?.label})</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 pt-4 space-y-6">
          {/* Exam Top Bar */}
          <div className="bg-white px-6 py-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => {
                  if (essay.trim() && !result && !window.confirm("Bài viết hiện tại sẽ bị mất. Bạn có chắc muốn quay lại?")) return;
                  setQuestion(null);
                  setResult(null);
                  setShowResult(false);
                  setScoreError(null);
                  setEssay("");
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition-all font-bold text-xs"
              >
                <ChevronRight className="w-4 h-4 rotate-180" /> Đổi Task
              </button>
              <span className="px-3 py-1 rounded-lg bg-purple-600 text-white text-xs font-extrabold uppercase tracking-wider">
                Writing {taskType === "task1" ? "Task 1" : "Task 2"}
              </span>
              <span className="text-xs font-bold text-slate-500 hidden sm:inline">
                You should spend about {taskType === "task1" ? "20" : "40"} minutes on this task · Write at least {minWords} words
              </span>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={taskType === "task1" ? task1Sub : task2Sub}
                onChange={(e) => {
                  const val = e.target.value;
                  if (taskType === "task1") setTask1Sub(val);
                  else setTask2Sub(val);
                  generateTask(taskType, val);
                }}
                aria-label="Chọn dạng bài Writing"
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none focus:border-purple-400 cursor-pointer"
              >
                {(taskType === "task1" ? TASK1_SUBTYPES : TASK2_SUBTYPES).map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => generateTask(taskType, "all")}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-200 text-xs font-bold transition-all"
                title="Đổi sang dạng đề ngẫu nhiên khác"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Đề ngẫu nhiên khác
              </button>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono font-black text-base tabular-nums ${
                timeLeft < 180 && !result ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-slate-50 border-slate-200 text-slate-900"
              }`}>
                <Timer className="w-4 h-4 text-purple-600" />
                <span>{formatTime(timeLeft)}</span>
              </div>
            </div>
          </div>

          {/* 2-Column Split Screen (Left: Prompt + Chart + Tabs, Right: Exam Editor) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Official Cambridge Prompt Box */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-extrabold text-purple-600 uppercase tracking-wider">
                      IELTS Academic Writing · {taskType === "task1" ? "Task 1" : "Task 2"}
                    </span>
                    <h2 className="text-lg font-black text-slate-900">
                      You should spend about {taskType === "task1" ? "20" : "40"} minutes on this task.
                    </h2>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-extrabold border border-purple-100">
                    Band {question.difficulty_estimate_band}
                  </span>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border-l-4 border-purple-600 space-y-3">
                  <p className="text-slate-900 font-bold text-base leading-relaxed">
                    {question.question}
                  </p>
                  <p className="text-slate-600 text-sm font-medium italic">
                    {question.instructions || (taskType === "task1"
                      ? "Summarise the information by selecting and reporting the main features, and make comparisons where relevant."
                      : "Give reasons for your answer and include any relevant examples from your own knowledge or experience.")}
                  </p>
                  <p className="text-slate-800 text-xs font-extrabold uppercase tracking-wider">
                    Write at least {minWords} words.
                  </p>
                </div>

                {taskType === 'task1' && question.chart_data && (
                  <div className="bg-white rounded-2xl p-5 border border-slate-200 h-[360px]">
                    <WritingTask1Chart data={question.chart_data} />
                  </div>
                )}
              </div>

              {/* Tabbed Support Panel: Structure / Vocabulary / Sample Band 8.5 */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                  <button
                    onClick={() => setActiveTab("structure")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
                      activeTab === "structure" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Dàn ý chuẩn
                  </button>
                  <button
                    onClick={() => setActiveTab("vocab")}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
                      activeTab === "vocab" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Từ vựng Band 7.5+
                  </button>
                  {question.sample_answer && (
                    <button
                      onClick={() => setActiveTab("sample")}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
                        activeTab === "sample" ? "bg-white text-purple-700 shadow-sm" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Bài mẫu Band 8.5
                    </button>
                  )}
                </div>

                {activeTab === "structure" && question.structure_tips && (
                  <div className="space-y-3">
                    {Object.entries(question.structure_tips).map(([key, tip]: [string, unknown]) => (
                      <div key={key} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                        <p className="text-xs font-extrabold text-purple-700 uppercase tracking-wider">
                          {structureLabelMap[key] || key.replace(/_/g, " ")}
                        </p>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                          {String(tip)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "vocab" && (
                  <div className="space-y-3">
                    {question.vocabulary_hints?.map((hint: { word: string; meaning: string; usage: string }, idx: number) => (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-black text-purple-700">{hint.word}</span>
                          <span className="text-xs font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">{hint.meaning}</span>
                        </div>
                        <p className="text-xs text-slate-500 italic">&ldquo;{hint.usage}&rdquo;</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "sample" && question.sample_answer && (
                  <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                        <FileText className="w-4 h-4" /> Bài mẫu tham khảo Band 8.5
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {String(question.sample_answer).trim().split(/\s+/).length} words
                      </span>
                    </div>
                    <div className="space-y-3 text-sm text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                      {question.sample_answer}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Official Exam Editor (6 cols) */}
            <div className="lg:col-span-6 lg:sticky lg:top-28">
              <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 flex flex-col">
                <div className="bg-slate-50 px-6 py-4 flex flex-wrap justify-between items-center gap-3 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${loading ? 'bg-purple-500 animate-ping' : 'bg-emerald-500'}`} />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                      {loading ? 'Giám khảo AI đang chấm bài...' : 'Answer Sheet'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold">
                    <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-600">
                      {paragraphCount} đoạn
                    </span>
                    <span className={`px-3 py-1 rounded-lg border font-extrabold ${
                      wordCount < minWords
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {wordCount} / {minWords} words
                    </span>
                  </div>
                </div>

                {/* Live Random C1-C2 Lexical Challenge Bar */}
                {lexicalTargets.length > 0 && (
                  <div className="px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                          <Dices className="w-3.5 h-3.5" />
                          Thử thách Chèn Từ vựng C1–C2 Ngẫu nhiên:
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                          Đã áp dụng:{" "}
                          {
                            lexicalTargets.filter((t) =>
                              essay.toLowerCase().includes(t.word.toLowerCase())
                            ).length
                          }
                          /{lexicalTargets.length}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => rollLexicalTargets(taskType)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <Dices className="w-3 h-3 text-blue-400" />
                        Đổi 5 từ khác
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {lexicalTargets.map((t) => {
                        const isUsed = essay.toLowerCase().includes(t.word.toLowerCase());
                        const isSelected = selectedLexicalHint?.id === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() =>
                              setSelectedLexicalHint((prev) => (prev?.id === t.id ? null : t))
                            }
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-all inline-flex items-center gap-1 ${
                              isUsed
                                ? "bg-emerald-600 border-emerald-500 text-white"
                                : isSelected
                                  ? "bg-blue-600 border-blue-400 text-white"
                                  : "bg-slate-800 border-slate-700 text-slate-200 hover:border-slate-500"
                            }`}
                          >
                            {isUsed && <Check className="w-3 h-3" />}
                            <span>{t.word}</span>
                            <span className="text-[10px] opacity-75">({t.level})</span>
                          </button>
                        );
                      })}
                    </div>

                    {selectedLexicalHint && (
                      <div className="p-2.5 rounded-lg bg-slate-800/90 border border-slate-700 flex items-center justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-blue-300">
                            {selectedLexicalHint.word}{" "}
                            <span className="font-normal text-slate-300">
                              — {selectedLexicalHint.meaning}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 italic">
                            Collocation mẫu: &ldquo;{selectedLexicalHint.collocations[0]}&rdquo;
                          </div>
                        </div>
                        {!result && (
                          <button
                            type="button"
                            onClick={() =>
                              setEssay((prev) =>
                                prev
                                  ? `${prev.trimEnd()} ${selectedLexicalHint.word} `
                                  : `${selectedLexicalHint.word} `
                              )
                            }
                            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold shrink-0"
                          >
                            + Chèn vào bài
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <textarea 
                  className="w-full h-[500px] p-6 md:p-8 outline-none bg-white text-slate-900 font-medium text-base leading-relaxed resize-none placeholder:text-slate-400 selection:bg-purple-100"
                  placeholder={`Viết bài ${taskType === "task1" ? "Task 1 (tối thiểu 150 từ, nên chia 3–4 đoạn: Introduction, Overview, Body 1, Body 2)" : "Task 2 (tối thiểu 250 từ, nên chia 4 đoạn: Introduction, Body 1, Body 2, Conclusion)"} tại đây...`}
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  disabled={loading || !!result}
                  spellCheck={false}
                />

                <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  {scoreError && (
                    <div className="w-full flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{scoreError}</span>
                    </div>
                  )}
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {wordCount < 50
                      ? `Cần viết thêm ít nhất ${50 - wordCount} từ để nộp bài chấm điểm`
                      : wordCount < minWords
                      ? `Còn thiếu ${minWords - wordCount} từ để đạt chuẩn ${minWords} từ của IELTS`
                      : "Đã đạt yêu cầu độ dài chuẩn IELTS"}
                  </div>
                  <div className="flex items-center gap-3 ml-auto">
                    {!result ? (
                      <button 
                        onClick={submitEssay}
                        disabled={loading || wordCount < 50}
                        className="btn-primary !py-3.5 !px-7 flex items-center gap-2.5 disabled:opacity-40 disabled:pointer-events-none"
                      >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        <span>{scoreError ? 'Thử lại' : 'Nộp & Chấm điểm'}</span>
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => setShowResult(true)}
                          className="btn-primary !py-3.5 !px-6 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Xem kết quả (Band {result.overall_band})</span>
                        </button>
                        <button 
                          onClick={() => generateTask(taskType)}
                          className="btn-secondary !py-3.5 !px-6 flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" />
                          <span>Đề mới</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      <AnimatePresence>
        {result && showResult && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              className="bg-white max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col rounded-3xl border border-slate-200 shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-slate-200 bg-slate-50 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-purple rounded-2xl flex items-center justify-center shadow-lg">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Báo cáo Chấm điểm Writing</h2>
                    <p className="text-slate-500 font-medium text-sm">Đánh giá theo 4 tiêu chí IELTS Writing Band Descriptors ({result.word_count || wordCount} words)</p>
                  </div>
                </div>
                <div className="bg-purple-600 text-white px-6 py-3 rounded-2xl text-center">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-purple-100">Overall Band</div>
                  <div className="text-3xl font-black">{Number(result.overall_band).toFixed(1)}</div>
                </div>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-8">
                {/* 4 Criteria Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(result.criteria_scores || {}).map(([key, score]: [string, unknown]) => {
                    const criteriaMap: Record<string, string> = {
                      'task_achievement': 'Task Achievement (TA)',
                      'task_response': 'Task Response (TR)',
                      'coherence_and_cohesion': 'Coherence & Cohesion (CC)',
                      'lexical_resource': 'Lexical Resource (LR)',
                      'grammatical_range_and_accuracy': 'Grammar & Accuracy (GRA)'
                    };
                    return (
                      <div key={key} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-center space-y-2">
                        <div className="text-xs font-extrabold text-slate-500 h-8 flex items-center justify-center leading-tight">
                          {criteriaMap[key] || key}
                        </div>
                        <div className="text-3xl font-black text-slate-900">{Number(score).toFixed(1)}</div>
                        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-purple" style={{ width: `${(Number(score) / 9) * 100}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Word count warning */}
                {typeof result.word_count === 'number' && result.word_count < (result.min_words || 0) && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>Bài viết có {result.word_count} từ, chưa đạt yêu cầu tối thiểu {result.min_words} từ — tiêu chí {taskType === 'task1' ? 'Task Achievement' : 'Task Response'} bị trừ điểm.</span>
                  </div>
                )}

                {/* Criteria feedback */}
                {result.criteria_feedback && Object.keys(result.criteria_feedback).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                      <BookOpen className="w-5 h-5 text-purple-600" />
                      Nhận xét chi tiết từng tiêu chí
                    </h3>
                    <div className="grid gap-3">
                      {Object.entries(result.criteria_feedback).map(([key, fb]: [string, unknown]) => fb ? (
                        <div key={key} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                          <div className="text-xs font-extrabold text-purple-700 uppercase tracking-wider">
                            {({ task_achievement: 'Task Achievement', task_response: 'Task Response', coherence_and_cohesion: 'Coherence & Cohesion', lexical_resource: 'Lexical Resource', grammatical_range_and_accuracy: 'Grammar & Accuracy' } as Record<string, string>)[key] || key}
                          </div>
                          <p className="text-slate-700 text-sm font-medium leading-relaxed">{String(fb)}</p>
                        </div>
                      ) : null)}
                    </div>
                  </div>
                )}

                {/* Key Improvements */}
                <div className="space-y-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    Hướng dẫn nâng Band
                  </h3>
                  <div className="grid gap-3">
                    {(result.key_improvements || []).map((improvement: string, i: number) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-700 text-sm font-medium leading-relaxed">{improvement}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Interactive Essay Diff & C1/C2 Upgrades */}
                <WritingInteractiveDiff
                  essay={essay}
                  revisions={result.revisions || []}
                  lexicalUpgrades={result.lexical_upgrades || []}
                />
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => {
                    setShowResult(false);
                    if (question.sample_answer) setActiveTab("sample");
                  }}
                  className="flex-1 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all border border-slate-200"
                >
                  Đóng & Xem bài mẫu Band 8.5
                </button>
                <button 
                  onClick={() => generateTask(taskType)}
                  className="flex-1 py-3.5 bg-gradient-purple text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
                >
                  Luyện đề mới
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
