"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, BookOpen, CheckCircle, ChevronLeft, ChevronRight, Clock, HelpCircle, AlertTriangle, Target, Trophy } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function ReadingPage() {
  const { user, addSubmission } = useUser();
  const [data, setData] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [currentSection, setCurrentSection] = useState(0); // For pagination if needed

  useEffect(() => {
    if (data && !submitted) {
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

  const generateTask = async () => {
    setLoading(true);
    setData(null);
    setUserAnswers({});
    setSubmitted(false);
    setTimeLeft(3600);
    try {
      const res = await fetch("/api/generate/reading", {
        method: "POST",
        body: JSON.stringify({
          targetScore: user?.targetScore || 6.5
        }),
      });
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
      setData({ error: "Failed to generate task" });
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (id: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      // Map user answers to the same order as data.answers
      const orderedUserAnswers = data.answers.map((ans: any) => userAnswers[ans.id] || "");
      
      const res = await fetch("/api/score/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAnswers: orderedUserAnswers,
          correctAnswers: data.answers
        })
      });
      const scoreData = await res.json();
      setData({ ...data, score: scoreData });
      setSubmitted(true);
      
      // Save submission
      addSubmission({
        skill: 'reading',
        band: scoreData.band,
        details: {
          rawScore: scoreData.rawScore,
          totalQuestions: scoreData.totalQuestions
        }
      });
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
        <div className="w-full max-w-md p-12 glass-premium border-white/10 text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full" />
          <div className="relative w-28 h-28 mx-auto">
            <div className="absolute inset-0 border-b-2 border-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-2 border-t-2 border-violet-500/30 rounded-full animate-spin-slow" />
            <BookOpen className="absolute inset-0 m-auto w-12 h-12 text-indigo-400" />
          </div>
          <div className="space-y-4 relative">
            <h2 className="text-3xl font-black text-white tracking-tight">Đang soạn bài đọc...</h2>
            <p className="text-slate-400 font-medium leading-relaxed">AI đang biên soạn đoạn văn học thuật và câu hỏi chuẩn IELTS cho mục tiêu Band {user?.targetScore || 6.5}.</p>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent w-1/2 animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950">
        <div className="max-w-md w-full p-12 glass-premium border-rose-500/20 text-center space-y-10">
          <div className="w-24 h-24 bg-rose-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto text-rose-400 border border-rose-500/20 shadow-2xl shadow-rose-500/10">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white tracking-tight">Lỗi hệ thống</h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              {data.error || "Không thể kết nối với AI để tạo đề bài. Vui lòng thử lại sau giây lát."}
            </p>
            {data.code === "MISSING_API_KEY" && (
               <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mt-4 text-left">
                 Mẹo: Hãy kiểm tra xem bạn đã thêm GEMINI_API_KEY vào Environment Variables trên Vercel chưa.
               </div>
             )}
             {data.code === "LEAKED_API_KEY" && (
               <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mt-4 text-left">
                 Mẹo: Hãy tạo API Key mới tại Google AI Studio, sau đó cập nhật lại biến GEMINI_API_KEY trên Vercel.
               </div>
             )}
          </div>
          <button 
            onClick={generateTask}
            className="btn-primary w-full py-5 text-lg shadow-rose-500/20"
          >
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-0 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="h-20 bg-slate-900/80 backdrop-blur-xl text-white flex items-center justify-between px-10 sticky top-[80px] z-40 border-b border-white/5 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/20 border border-white/10">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-black tracking-[0.3em] uppercase text-[10px] block text-indigo-400">IELTS Academy</span>
            <span className="font-black text-lg text-white tracking-tighter">Reading Practice</span>
          </div>
        </div>
        
        {data && (
          <div className="flex items-center gap-8">
            <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl transition-all border ${timeLeft < 300 ? 'bg-rose-500 border-rose-400 animate-pulse text-white' : 'bg-slate-800/50 text-indigo-300 border-white/5'}`}>
              <Clock className="w-5 h-5" />
              <span className="font-mono font-black text-2xl tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            {!submitted && (
              <button 
                onClick={submitTest}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-3.5 rounded-2xl font-black text-sm transition-all shadow-2xl shadow-emerald-500/20 hover:-translate-y-1 active:translate-y-0 border border-white/10"
              >
                NỘP BÀI THI
              </button>
            )}
          </div>
        )}
      </div>

      {!data ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl space-y-10 relative"
          >
            <div className="w-24 h-24 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-inner">
              <BookOpen className="w-12 h-12 text-indigo-400" />
            </div>
            <div className="space-y-6">
              <h1 className="premium-title">
                Luyện Kỹ năng <span className="gradient-text">Đọc</span>
              </h1>
              <p className="premium-subtitle">
                Trải nghiệm môi trường thi IELTS thực tế với các bài đọc học thuật đa dạng chủ đề được biên soạn bởi AI.
              </p>
            </div>
            <button 
              onClick={generateTask}
              className="btn-primary w-full py-6 text-xl shadow-2xl shadow-indigo-500/20 max-w-sm mx-auto flex items-center justify-center gap-4 group"
            >
              Bắt đầu làm bài
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Question Navigator - Desktop Only */}
          <div className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col gap-2 z-30">
            {data.questions.map((q: any, idx: number) => (
              <button
                key={q.id}
                onClick={() => {
                  const el = document.getElementById(`q-${q.id}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`w-10 h-10 rounded-xl border flex items-center justify-center font-black text-xs transition-all ${
                  submitted 
                    ? (userAnswers[q.id]?.toLowerCase().trim() === data.answers.find((a: any) => a.id === q.id).correct_answer.toLowerCase().trim() ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-rose-500 border-rose-400 text-white')
                    : (userAnswers[q.id] ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-900 border-white/5 text-slate-500 hover:border-indigo-500/50')
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Passage Section */}
          <div className="w-full lg:w-1/2 overflow-y-auto p-12 bg-slate-900/30 border-r border-white/5 custom-scrollbar">
            <div className="max-w-3xl mx-auto">
              <div className="mb-8 flex items-center justify-between">
                <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-full border border-indigo-500/20 uppercase tracking-[0.2em]">
                  Reading Passage
                </span>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors" title="Highlight text (coming soon)">
                    <Target className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="prose prose-invert prose-slate markdown-passage">
                <ReactMarkdown>
                  {data.passage}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="w-full lg:w-1/2 overflow-y-auto p-12 bg-slate-950 custom-scrollbar">
            <div className="max-w-2xl mx-auto space-y-12 pb-24">
              <div className="flex items-center justify-between border-b border-white/5 pb-8">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Questions 1-{data.questions.length}</span>
                  <h2 className="text-3xl font-black text-white tracking-tight">Trả lời câu hỏi</h2>
                </div>
                <div className="px-5 py-2.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-2xl border border-indigo-500/20 uppercase tracking-[0.2em]">
                  Target Band {user?.targetScore || 6.5}
                </div>
              </div>

              {data.questions.map((q: any, idx: number) => (
                <div 
                  key={q.id} 
                  id={`q-${q.id}`}
                  className={`glass-card !p-8 border-white/5 bg-slate-900/40 transition-all ${submitted ? 'opacity-90' : 'hover:bg-slate-900/60'}`}
                >
                  <div className="flex gap-6">
                    <span className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-800 text-white flex items-center justify-center font-black text-sm border border-white/10 shadow-lg">
                      {idx + 1}
                    </span>
                    <div className="flex-1 space-y-6">
                      <p className="text-white font-bold text-xl leading-relaxed">{q.question}</p>
                      
                      {q.type === 'MCQ' ? (
                        <div className="grid gap-3">
                          {q.options.map((opt: string, i: number) => (
                            <label key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${userAnswers[q.id] === opt ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-slate-950/50 border-white/5 text-slate-400 hover:bg-slate-900'}`}>
                              <input 
                                type="radio" 
                                name={`q-${q.id}`}
                                disabled={submitted}
                                checked={userAnswers[q.id] === opt}
                                onChange={() => handleAnswerChange(q.id, opt)}
                                className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-white/10 bg-slate-800"
                              />
                              <span className="text-lg font-medium group-hover:text-white transition-colors">{opt}</span>
                            </label>
                          ))}
                        </div>
                      ) : q.type === 'TFN' ? (
                        <div className="flex flex-wrap gap-4">
                          {['True', 'False', 'Not Given'].map((opt) => (
                            <button
                              key={opt}
                              disabled={submitted}
                              onClick={() => handleAnswerChange(q.id, opt)}
                              className={`px-8 py-3.5 rounded-2xl border text-sm font-black transition-all ${
                                userAnswers[q.id] === opt 
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl shadow-indigo-500/30' 
                                : 'bg-slate-950/50 border-white/5 text-slate-400 hover:border-indigo-500/30 hover:text-white'
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
                          placeholder="Nhập câu trả lời của bạn..."
                          value={userAnswers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          className="w-full p-5 rounded-2xl border border-white/5 bg-slate-950/50 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-inner text-lg font-medium text-white placeholder:text-slate-700"
                        />
                      )}

                      {submitted && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-6 p-6 rounded-[2rem] border relative overflow-hidden ${
                            userAnswers[q.id]?.toLowerCase().trim() === data.answers.find((a: any) => a.id === q.id).correct_answer.toLowerCase().trim()
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-rose-500/5 border-rose-500/20'
                          }`}
                        >
                          <div className="flex items-start gap-4 relative">
                            <div className={`mt-1 p-1.5 rounded-lg ${
                              userAnswers[q.id]?.toLowerCase().trim() === data.answers.find((a: any) => a.id === q.id).correct_answer.toLowerCase().trim()
                              ? 'bg-emerald-500 text-white'
                              : 'bg-rose-50 text-white'
                            }`}>
                              <CheckCircle className="w-4 h-4" />
                            </div>
                            <div className="space-y-3">
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                Đáp án đúng: <span className="text-emerald-400 ml-2">{data.answers.find((a: any) => a.id === q.id).correct_answer}</span>
                              </p>
                              <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 block">Phân tích chuyên sâu:</span>
                                <p className="text-slate-300 text-sm font-medium leading-relaxed italic">
                                  {data.answers.find((a: any) => a.id === q.id).explanation}
                                </p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result Modal */}
      {submitted && data.score && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-premium !p-0 max-w-xl w-full overflow-hidden border-white/10 shadow-[0_0_100px_rgba(79,70,229,0.15)]"
          >
            <div className="bg-indigo-600 p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-white tracking-tight">Kết quả luyện tập</h3>
                <p className="text-indigo-100 font-medium text-lg mt-2 opacity-80">Reading Academic Practice</p>
              </div>
            </div>
            
            <div className="p-12 space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col items-center justify-center p-10 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-inner group">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 group-hover:text-indigo-400 transition-colors">Độ chính xác</p>
                  <div className="text-6xl font-black text-white tracking-tighter tabular-nums">
                    {data.score.rawScore}<span className="text-slate-700 mx-2 text-4xl">/</span>{data.score.totalQuestions}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-10 bg-indigo-500/10 rounded-[2.5rem] border border-indigo-500/20 shadow-2xl group">
                  <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Estimated Band</p>
                  <div className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">{data.score.band}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setSubmitted(false)}
                  className="py-5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl border border-white/5"
                >
                  Xem lại đáp án
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary py-5 text-xs uppercase tracking-widest"
                >
                  Làm bài thi mới
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .markdown-passage h1 { font-size: 3.5rem; font-weight: 900; margin-bottom: 2.5rem; color: #fff; letter-spacing: -0.04em; line-height: 1; }
        .markdown-passage h2 { font-size: 2rem; font-weight: 800; margin-top: 3.5rem; margin-bottom: 1.5rem; color: #fff; letter-spacing: -0.02em; border-left: 4px solid #4f46e5; padding-left: 1.5rem; }
        .markdown-passage p { font-size: 1.25rem; line-height: 1.8; margin-bottom: 2rem; color: #94a3b8; font-weight: 500; }
        .markdown-passage strong { color: #fff; font-weight: 800; }
        .markdown-passage em { color: #6366f1; font-style: normal; font-weight: 600; }
      `}</style>
    </div>
  );
}
