"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Square, Play, RefreshCw, User, ShieldCheck, MessageSquare, ChevronRight, MicOff, Info, Trophy, AlertCircle, TrendingUp } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function SpeakingPage() {
  const { user, addSubmission } = useUser();
  const [part, setPart] = useState(1);
  const [data, setData] = useState<any>(null);
  const [score, setScore] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [recordings, setRecordings] = useState<Record<number, boolean>>({});
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const generateTask = async (selectedPart: number) => {
    setLoading(true);
    setData(null);
    setScore(null);
    setPart(selectedPart);
    setCurrentQuestionIdx(0);
    setRecordings({});
    setTimer(0);
    try {
      const res = await fetch("/api/generate/speaking", {
        method: "POST",
        body: JSON.stringify({ 
          part: selectedPart, 
          targetScore: user?.targetScore || 6.5 
        })
      });
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const submitTest = async () => {
    setScoring(true);
    try {
      const res = await fetch("/api/score/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          part,
          questions: part === 2 ? [data.task] : data.questions,
          transcript: "Bản ghi âm mô phỏng của người dùng. (Trong thực tế, tính năng chuyển giọng nói thành văn bản sẽ được tích hợp ở đây)."
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to score speaking task");
      }

      const scoreData = await res.json();
      setScore(scoreData);

      // Save submission
      addSubmission({
        skill: 'speaking',
        band: scoreData.overallBand,
        details: {
          part,
          criteria: scoreData.criteria
        }
      });
    } catch (error) {
      console.error("Error scoring speaking:", error);
      alert("Có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.");
    } finally {
      setScoring(false);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimer(0);
    } else {
      setIsRecording(false);
      setRecordings(prev => ({ ...prev, [currentQuestionIdx]: true }));
    }
  };

  const nextQuestion = () => {
    if (part === 1 && currentQuestionIdx < data.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setIsRecording(false);
    } else if (part === 3 && currentQuestionIdx < data.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setIsRecording(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
        <div className="w-full max-w-md p-12 glass-premium border-white/10 text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full" />
          
          <div className="relative w-28 h-28 mx-auto">
            <div className="absolute inset-0 border-b-2 border-indigo-500 rounded-full animate-spin" />
            <div className="absolute inset-2 border-t-2 border-violet-500/30 rounded-full animate-spin-slow" />
            <Mic className="absolute inset-0 m-auto w-12 h-12 text-indigo-400" />
          </div>

          <div className="space-y-4 relative">
            <h2 className="text-3xl font-black text-white tracking-tight">Đang chuẩn bị câu hỏi...</h2>
            <p className="text-slate-400 font-medium leading-relaxed">AI đang chuẩn bị các câu hỏi Speaking Part {part} cho bạn.</p>
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 p-6">
        <div className="max-w-md w-full p-12 glass-premium border-rose-500/20 text-center space-y-8">
          <div className="w-24 h-24 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto text-rose-400 relative">
            <div className="absolute inset-0 bg-rose-500/20 blur-xl rounded-full" />
            <MicOff className="w-12 h-12 relative" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-white tracking-tight">Rất tiếc!</h2>
            <p className="text-slate-400 font-medium leading-relaxed">
              {data.error || "Không thể tạo câu hỏi ngay lúc này. Vui lòng thử lại sau."}
            </p>
            {data.code === "MISSING_API_KEY" && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mt-4">
            Mẹo: Hãy kiểm tra xem bạn đã thêm GEMINI_API_KEY vào Environment Variables trên Vercel chưa.
          </div>
        )}
        {data.code === "LEAKED_API_KEY" && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold mt-4">
            Mẹo: Hãy tạo API Key mới tại Google AI Studio, sau đó cập nhật lại biến GEMINI_API_KEY trên Vercel.
          </div>
        )}
          </div>
          <button 
            onClick={() => generateTask(part)}
            className="w-full py-4 glass-premium bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl transition-all border-white/10"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full animate-pulse-slow" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest">
              AI Speaking Lab
            </div>
            <h1 className="premium-title">Speaking Simulator</h1>
            <p className="premium-subtitle">Môi trường phỏng vấn IELTS chuyên nghiệp với AI.</p>
          </div>
          
          <div className="flex glass-premium p-1.5 rounded-2xl border-white/5">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => generateTask(p)}
                className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-[0.2em] transition-all ${
                  part === p 
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-105' 
                  : 'text-slate-400 hover:text-white'
                }`}
              >
                Part {p}
              </button>
            ))}
          </div>
        </div>

        {!data ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { id: 1, title: 'Introduction', desc: 'Warm-up questions about familiar everyday topics.', icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10', borderColor: 'group-hover:border-emerald-500/30' },
              { id: 2, title: 'Cue Card', desc: 'Speak about a specific topic with 1-minute preparation.', icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10', borderColor: 'group-hover:border-amber-500/30' },
              { id: 3, title: 'Discussion', desc: 'More abstract and in-depth academic discussions.', icon: ShieldCheck, color: 'text-indigo-400', bg: 'bg-indigo-500/10', borderColor: 'group-hover:border-indigo-500/30' },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ y: -8 }}
                onClick={() => generateTask(item.id)}
                className={`glass-premium group text-left p-8 border-white/5 transition-all relative overflow-hidden ${item.borderColor}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className={`${item.bg} w-16 h-16 rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <ChevronRight className={`w-6 h-6 ${item.color} opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0`} />
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-white transition-colors">{item.title}</h3>
                    <p className="text-slate-400 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                  
                  <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${item.color}`}>
                    Bắt đầu luyện tập
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Examiner View */}
            <div className="glass-premium !p-0 border-white/5 relative overflow-hidden rounded-[2.5rem]">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[100px] rounded-full -mr-64 -mt-64" />
              
              <div className="relative">
                {/* Examiner Info Bar */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Giám khảo IELTS AI</span>
                      <h2 className="text-xl font-bold text-white">Mr. Anderson</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10">
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                    <span className="font-bold text-white tracking-wider text-xs uppercase">
                      Mục tiêu: Band {user?.targetScore || 6.5}
                    </span>
                  </div>
                </div>

                <div className="p-10 space-y-12">
                  <div className="max-w-3xl mx-auto text-center space-y-8">
                    {part === 2 ? (
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
                            Cue Card Topic
                          </span>
                          <h3 className="text-3xl font-black text-white leading-tight">{data.task}</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                          {data.bullets.map((b: string, i: number) => (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              key={i} 
                              className="flex items-center gap-4 text-slate-300 font-medium bg-white/5 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                            >
                              <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                              {b}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-widest">
                          Câu hỏi {currentQuestionIdx + 1} / {data.questions.length}
                        </div>
                        <p className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight italic">
                          "{data.questions[currentQuestionIdx]}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Recording Interface */}
                  <div className="flex flex-col items-center gap-8 py-8">
                    <div className="relative">
                      <AnimatePresence>
                        {isRecording && (
                          <motion.div 
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl"
                          />
                        )}
                      </AnimatePresence>
                      
                      <button 
                        onClick={toggleRecording}
                        className={`w-32 h-32 rounded-full flex items-center justify-center transition-all relative z-10 ${
                          isRecording 
                          ? 'bg-rose-500 shadow-lg shadow-rose-500/25 scale-110' 
                          : 'bg-indigo-600 shadow-lg shadow-indigo-500/25 hover:scale-105'
                        }`}
                      >
                        {isRecording ? (
                          <Square className="w-10 h-10 text-white fill-white" />
                        ) : (
                          <Mic className="w-12 h-12 text-white" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                      <div className={`px-6 py-3 rounded-2xl font-mono font-black text-2xl flex items-center gap-4 border ${
                        isRecording 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                        : 'bg-white/5 border-white/10 text-slate-400'
                      }`}>
                        <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse' : 'bg-slate-600'}`} />
                        {formatTimer(timer)}
                      </div>
                      
                      <div className="flex items-center gap-3 text-slate-500">
                        {isRecording ? (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              {[1, 2, 3].map(i => (
                                <motion.div
                                  key={i}
                                  animate={{ height: [4, 12, 4] }}
                                  transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                  className="w-1 bg-rose-400 rounded-full"
                                />
                              ))}
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-rose-400">Đang ghi âm...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Info className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-widest">Nhấn để bắt đầu trả lời</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isRecording && recordings[currentQuestionIdx] && (
                      <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 hover:bg-emerald-500/20 transition-all font-bold">
                          <Play className="w-5 h-5" />
                          Nghe lại
                        </button>
                        <button 
                          onClick={() => setRecordings(prev => {
                            const n = {...prev};
                            delete n[currentQuestionIdx];
                            return n;
                          })}
                          className="flex items-center gap-2 px-6 py-3 bg-white/5 text-slate-400 rounded-2xl border border-white/10 hover:bg-white/10 transition-all font-bold"
                        >
                          <RefreshCw className="w-5 h-5" />
                          Ghi lại
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Bar */}
                <div className="p-8 bg-white/[0.02] border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                  <button 
                    onClick={() => setData(null)}
                    className="flex items-center gap-2 text-slate-500 hover:text-white font-black text-xs uppercase tracking-widest transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Đổi chủ đề khác
                  </button>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {part !== 2 && currentQuestionIdx < data.questions.length - 1 && (
                      <button 
                        onClick={nextQuestion}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-white/10"
                      >
                        Câu hỏi tiếp theo
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                    
                    {(part === 2 || currentQuestionIdx === data.questions.length - 1) && (
                      <button 
                        onClick={submitTest}
                        disabled={scoring || (part !== 2 && !recordings[currentQuestionIdx])}
                        className="flex-1 md:flex-none bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {scoring ? (
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Đang chấm điểm...
                          </div>
                        ) : 'Hoàn thành bài thi'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Score Display Modal */}
        <AnimatePresence>
          {score && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="glass-premium max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border-white/10 shadow-2xl"
              >
                {/* Modal Header */}
                <div className="p-8 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tight">Kết quả Speaking</h2>
                      <p className="text-slate-400 font-medium">Phân tích chi tiết từ Giám khảo AI</p>
                    </div>
                  </div>
                  <div className="bg-indigo-500/10 px-8 py-5 rounded-2xl border border-indigo-500/20 text-center">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Overall Band</div>
                    <div className="text-4xl font-black text-white">{score.overallBand}</div>
                  </div>
                </div>

                <div className="p-8 overflow-y-auto space-y-10">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(score.criteria).map(([key, value]: [string, any], i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={key} 
                        className="bg-white/5 p-5 rounded-2xl border border-white/5 text-center space-y-2"
                      >
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest h-8 flex items-center justify-center leading-tight">
                          {key === 'fluency' ? 'Fluency & Coherence' : 
                           key === 'vocabulary' ? 'Lexical Resource' : 
                           key === 'grammar' ? 'Grammar Range' : 'Pronunciation'}
                        </div>
                        <div className="text-3xl font-black text-white">{value.band}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Detailed Analysis */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-indigo-400" />
                      Nhận xét chi tiết
                    </h3>
                    <div className="grid gap-4">
                      {Object.entries(score.criteria).map(([key, value]: [string, any]) => (
                        <div key={key} className="bg-white/5 rounded-2xl border border-white/5 p-6 space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="font-black text-indigo-400 uppercase text-xs tracking-widest">
                              {key === 'fluency' ? 'Fluency & Coherence' : 
                               key === 'vocabulary' ? 'Lexical Resource' : 
                               key === 'grammar' ? 'Grammar Range' : 'Pronunciation'}
                            </h4>
                            <span className="px-3 py-1 bg-indigo-500/10 rounded-full text-indigo-400 text-xs font-bold">Band {value.band}</span>
                          </div>
                          <p className="text-slate-300 leading-relaxed font-medium">{value.feedback}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-8 border-t border-white/10 bg-white/[0.02] flex gap-4">
                  <button 
                    onClick={() => {
                      setScore(null);
                      setData(null);
                    }}
                    className="flex-1 py-4 glass-premium bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all border-white/10"
                  >
                    Luyện tập bài mới
                  </button>
                  <button 
                    onClick={() => setScore(null)}
                    className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Xem lại câu hỏi
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
