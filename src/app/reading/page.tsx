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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB]">
        <div className="w-full max-w-md p-12 bg-white rounded-[3rem] border border-slate-100 shadow-2xl text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-purple opacity-5 blur-3xl rounded-full" />
          <div className="relative w-32 h-32 mx-auto">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-b-4 border-purple-600 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-4 border-t-4 border-purple-200 rounded-full"
            />
            <BookOpen className="absolute inset-0 m-auto w-14 h-14 text-purple-600" />
          </div>
          <div className="space-y-4 relative">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Đang soạn bài đọc...</h2>
            <p className="text-slate-500 font-bold leading-relaxed">AI đang biên soạn đoạn văn học thuật và câu hỏi chuẩn IELTS cho mục tiêu Band {user?.targetScore || 6.5}.</p>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative border border-slate-200/50">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-purple w-1/2"
            />
          </div>
        </div>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB]">
        <div className="max-w-md w-full p-12 bg-white rounded-[3rem] border border-rose-100 text-center space-y-10 shadow-2xl">
          <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto text-rose-600 border border-rose-100 shadow-xl shadow-rose-500/10">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Lỗi hệ thống</h2>
            <p className="text-slate-500 font-bold leading-relaxed">
              {data.error || "Không thể kết nối với AI để tạo đề bài. Vui lòng thử lại sau giây lát."}
            </p>
          </div>
          <button 
            onClick={generateTask}
            className="btn-primary w-full py-6 text-sm"
          >
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-0 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="h-24 bg-white/80 backdrop-blur-xl text-slate-900 flex items-center justify-between px-10 sticky top-[80px] z-40 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm">
            <BookOpen className="w-7 h-7" />
          </div>
          <div className="hidden sm:block">
            <span className="font-black tracking-widest uppercase text-[10px] block text-purple-600">IELTS Academy</span>
            <span className="font-black text-xl text-slate-900 tracking-tighter uppercase">Reading Practice</span>
          </div>
        </div>
        
        {data && (
          <div className="flex items-center gap-10">
            <div className={`flex items-center gap-4 px-8 py-4 rounded-2xl transition-all border ${timeLeft < 300 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-slate-50 text-purple-600 border-slate-200'}`}>
              <Clock className="w-6 h-6" />
              <span className="font-mono font-black text-3xl tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            {!submitted && (
              <button 
                onClick={submitTest}
                className="btn-primary !px-12 !py-4 text-sm"
              >
                NỘP BÀI THI
              </button>
            )}
          </div>
        )}
      </div>

      {!data ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl space-y-12 relative"
          >
            <div className="w-32 h-32 bg-white rounded-[3rem] flex items-center justify-center mx-auto mb-8 border border-slate-100 shadow-2xl">
              <BookOpen className="w-16 h-16 text-purple-600" />
            </div>
            <div className="space-y-6">
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
                Luyện Kỹ năng <br />
                <span className="text-gradient">Đọc</span>
              </h1>
              <p className="text-slate-500 text-lg font-bold max-w-md mx-auto leading-relaxed">
                Trải nghiệm môi trường thi IELTS thực tế với các bài đọc học thuật đa dạng chủ đề được biên soạn bởi AI.
              </p>
            </div>
            <button 
              onClick={generateTask}
              className="btn-primary !px-16 !py-6 text-lg mx-auto flex items-center gap-4 group"
            >
              Bắt đầu làm bài
              <ChevronRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          {/* Question Navigator - Desktop Only */}
          <div className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-3 z-30">
            {data.questions.map((q: any, idx: number) => (
              <button
                key={q.id}
                onClick={() => {
                  const el = document.getElementById(`q-${q.id}`);
                  el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black text-sm transition-all shadow-sm ${
                  submitted 
                    ? (userAnswers[q.id]?.toLowerCase().trim() === data.answers.find((a: any) => a.id === q.id).correct_answer.toLowerCase().trim() ? 'bg-purple-600 border-purple-500 text-white shadow-purple-600/20' : 'bg-rose-500 border-rose-400 text-white shadow-rose-500/20')
                    : (userAnswers[q.id] ? 'bg-purple-600 border-purple-500 text-white shadow-purple-500/20' : 'bg-white border-slate-200 text-slate-400 hover:border-purple-500/50')
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          {/* Passage Section */}
          <div className="w-full lg:w-1/2 overflow-y-auto p-12 bg-white border-r border-slate-100">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="flex items-center justify-between">
                <span className="px-6 py-2 bg-purple-50 text-purple-600 text-[10px] font-black rounded-2xl border border-purple-100 uppercase tracking-widest shadow-sm">
                  Reading Passage
                </span>
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                    <Target className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="prose prose-slate max-w-none prose-p:text-slate-900 prose-p:font-bold prose-p:text-xl prose-p:leading-relaxed prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase">
                <ReactMarkdown>
                  {data.passage}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="w-full lg:w-1/2 overflow-y-auto p-12 bg-[#F9FAFB]">
            <div className="max-w-2xl mx-auto space-y-12 pb-24">
              <div className="flex items-center justify-between border-b border-slate-200 pb-10">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Questions 1-{data.questions.length}</span>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Trả lời câu hỏi</h2>
                </div>
                <div className="px-6 py-3 bg-purple-50 text-purple-600 text-[10px] font-black rounded-2xl border border-purple-100 uppercase tracking-widest shadow-sm">
                  Target Band {user?.targetScore || 6.5}
                </div>
              </div>

              {data.questions.map((q: any, idx: number) => (
                <div 
                  key={q.id} 
                  id={`q-${q.id}`}
                  className={`bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl transition-all duration-300 ${submitted ? 'opacity-90' : 'hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-500/5'}`}
                >
                  <div className="flex gap-8">
                    <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-black text-base shadow-lg shadow-purple-500/20">
                      {idx + 1}
                    </span>
                    <div className="flex-1 space-y-8">
                      <p className="text-slate-900 font-bold text-2xl leading-relaxed italic">"{q.question}"</p>
                      
                      {q.type === 'MCQ' ? (
                        <div className="grid gap-4">
                          {q.options.map((opt: string, i: number) => (
                            <label key={i} className={`flex items-center gap-5 p-6 rounded-[2rem] border-2 transition-all cursor-pointer group ${userAnswers[q.id] === opt ? 'bg-purple-50 border-purple-500 text-purple-600 shadow-lg shadow-purple-500/10' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white hover:border-purple-200'}`}>
                              <input 
                                type="radio" 
                                name={`q-${q.id}`}
                                disabled={submitted}
                                checked={userAnswers[q.id] === opt}
                                onChange={() => handleAnswerChange(q.id, opt)}
                                className="w-6 h-6 text-purple-600 focus:ring-purple-500 border-slate-300 bg-white"
                              />
                              <span className="text-lg font-black group-hover:text-slate-900 transition-colors uppercase tracking-tight">{opt}</span>
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
                              className={`px-10 py-5 rounded-[2rem] border-2 text-sm font-black transition-all uppercase tracking-widest ${
                                userAnswers[q.id] === opt 
                                ? 'bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-500/30' 
                                : 'bg-slate-50 border-slate-100 text-slate-500 hover:border-purple-300 hover:text-purple-600 hover:bg-white'
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
                          placeholder="Bắt đầu nhập câu trả lời..."
                          value={userAnswers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          className="w-full p-8 rounded-[2.5rem] border-2 border-slate-100 bg-slate-50 focus:ring-8 focus:ring-purple-500/5 focus:border-purple-500/20 focus:bg-white outline-none transition-all shadow-inner text-xl font-black text-slate-900 placeholder:text-slate-300"
                        />
                      )}

                      {submitted && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`mt-10 p-10 rounded-[2.5rem] border-2 relative overflow-hidden ${
                            userAnswers[q.id]?.toLowerCase().trim() === data.answers.find((a: any) => a.id === q.id).correct_answer.toLowerCase().trim()
                            ? 'bg-purple-50 border-purple-100'
                            : 'bg-rose-50 border-rose-100'
                          }`}
                        >
                          <div className="flex items-start gap-6 relative">
                            <div className={`mt-1 p-2 rounded-xl shadow-lg ${
                              userAnswers[q.id]?.toLowerCase().trim() === data.answers.find((a: any) => a.id === q.id).correct_answer.toLowerCase().trim()
                              ? 'bg-purple-600 text-white'
                              : 'bg-rose-500 text-white'
                            }`}>
                              <CheckCircle className="w-6 h-6" />
                            </div>
                            <div className="space-y-6">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                Đáp án đúng: <span className="text-purple-600 ml-4 bg-purple-100 px-4 py-1.5 rounded-lg shadow-sm">{data.answers.find((a: any) => a.id === q.id).correct_answer}</span>
                              </p>
                              <div className="space-y-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-purple-600 block">Phân tích chuyên sâu:</span>
                                <p className="text-slate-600 text-lg font-bold leading-relaxed italic">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-[3rem] max-w-xl w-full overflow-hidden border border-slate-100 shadow-2xl"
          >
            <div className="bg-gradient-purple p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                  <Trophy className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-4xl font-black text-white tracking-tight">Kết quả luyện tập</h3>
                <p className="text-purple-100 font-medium text-lg mt-2 opacity-80">Reading Academic Practice</p>
              </div>
            </div>
            
            <div className="p-12 space-y-10">
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 shadow-inner group">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3 group-hover:text-purple-600 transition-colors">Độ chính xác</p>
                  <div className="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">
                    {data.score.rawScore}<span className="text-slate-200 mx-2 text-4xl">/</span>{data.score.totalQuestions}
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center p-10 bg-purple-600 rounded-[2.5rem] border border-purple-500/20 shadow-2xl group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-purple opacity-90" />
                  <div className="relative text-center">
                    <p className="text-purple-100 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Estimated Band</p>
                    <div className="text-7xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">{data.score.band}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setSubmitted(false)}
                  className="py-5 bg-white hover:bg-slate-50 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-sm border border-slate-200"
                >
                  Xem lại đáp án
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="btn-primary py-5 text-xs"
                >
                  Làm bài thi mới
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .markdown-passage h1 { font-size: 3.5rem; font-weight: 900; margin-bottom: 2.5rem; color: #0f172a; letter-spacing: -0.04em; line-height: 1; }
        .markdown-passage h2 { font-size: 2rem; font-weight: 800; margin-top: 3.5rem; margin-bottom: 1.5rem; color: #0f172a; letter-spacing: -0.02em; border-left: 4px solid #9333ea; padding-left: 1.5rem; }
        .markdown-passage p { font-size: 1.25rem; line-height: 1.8; margin-bottom: 2rem; color: #475569; font-weight: 500; }
        .markdown-passage strong { color: #0f172a; font-weight: 800; }
        .markdown-passage em { color: #9333ea; font-style: normal; font-weight: 600; }
      `}</style>
    </div>
  );
}
