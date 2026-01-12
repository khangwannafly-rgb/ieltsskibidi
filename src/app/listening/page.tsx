"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Headphones, Play, Pause, RotateCcw, CheckCircle, Clock, Volume2, Info, AlertCircle, AlertTriangle, TrendingUp, Target, ChevronRight, Trophy, BookOpen } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function ListeningPage() {
  const { user, addSubmission } = useUser();
  const [data, setData] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (data && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [data, submitted]);

  const generateTask = async () => {
    setLoading(true);
    setData(null);
    setUserAnswers({});
    setSubmitted(false);
    setTimeLeft(1800);
    setIsPlaying(false);
    setAudioProgress(0);
    try {
      const res = await fetch("/api/generate/listening", {
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

  const toggleAudio = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      audioIntervalRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            clearInterval(audioIntervalRef.current!);
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.1; // Simulated progress
        });
      }, 100);
    } else {
      setIsPlaying(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (id: number, value: string) => {
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const submitTest = async () => {
    setLoading(true);
    try {
      const orderedUserAnswers = data.answers.map((ans: any) => userAnswers[ans.id] || "");
      
      const res = await fetch("/api/score/listening", {
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
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setIsPlaying(false);

      // Save submission
      addSubmission({
        skill: 'listening',
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

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB] p-6">
        <div className="w-full max-w-md p-12 bg-white rounded-[3rem] border border-slate-100 text-center space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-purple-500/5 blur-3xl rounded-full" />
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
            <Headphones className="absolute inset-0 m-auto w-14 h-14 text-purple-600" />
          </div>
          <div className="space-y-4 relative">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Đang chuẩn bị bài nghe...</h2>
            <p className="text-slate-500 font-bold leading-relaxed">AI đang biên soạn kịch bản hội thoại và câu hỏi Listening cho bạn.</p>
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
            {data.code === "MISSING_API_KEY" && (
               <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 text-xs font-bold mt-4 text-left">
                 Mẹo: Hãy kiểm tra xem bạn đã thêm GEMINI_API_KEY vào Environment Variables trên Vercel chưa.
               </div>
             )}
             {data.code === "LEAKED_API_KEY" && (
               <div className="p-4 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-bold mt-4 text-left">
                 Mẹo: Hãy tạo API Key mới tại Google AI Studio, sau đó cập nhật lại biến GEMINI_API_KEY trên Vercel.
               </div>
             )}
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
      {/* Top Header */}
      <div className="h-20 bg-white/80 backdrop-blur-xl text-slate-900 flex items-center justify-between px-10 sticky top-[80px] z-40 border-b border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 border border-purple-500/10">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <div className="hidden sm:block">
            <span className="font-black tracking-[0.3em] uppercase text-[10px] block text-purple-600">Listening Session</span>
            <span className="font-black text-lg text-slate-900 tracking-tighter">IELTS Practice</span>
          </div>
        </div>

        {data && (
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6">
              <span className="text-[10px] uppercase font-black text-slate-400 tracking-[0.2em] hidden md:block">Time Remaining</span>
              <div className="px-6 py-3 bg-slate-50 text-purple-600 rounded-2xl border border-slate-100 font-mono font-black text-2xl tabular-nums">
                {formatTime(timeLeft)}
              </div>
            </div>
            {!submitted && (
              <button 
                onClick={submitTest}
                className="btn-primary px-10 py-3.5"
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
            className="max-w-2xl space-y-10 relative"
          >
            <div className="relative inline-block">
              <div className="w-32 h-32 bg-purple-50 rounded-[2.5rem] flex items-center justify-center border border-purple-100 shadow-sm rotate-6 transition-transform hover:rotate-0 duration-500">
                <Headphones className="w-16 h-16 text-purple-600 -rotate-6" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
                <Volume2 className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]">
                Phòng <span className="text-gradient">Nghe</span>
              </h1>
              <p className="text-slate-500 text-xl font-bold max-w-md mx-auto leading-relaxed">
                Luyện tập kỹ năng nghe với các tình huống hội thoại và độc thoại mô phỏng kỳ thi IELTS thực tế.
              </p>
            </div>

            <button 
              onClick={generateTask}
              className="btn-primary w-full max-w-sm mx-auto flex items-center justify-center gap-4 py-6 text-xl group"
            >
              Bắt đầu luyện nghe
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      ) : (
        <div className="flex-1 max-w-6xl mx-auto w-full p-12 space-y-12 pb-32">
          {/* Audio Player Card */}
          <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-purple-600" />
            <div className="absolute inset-0 bg-purple-500/5 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2" />
            
            <div className="flex flex-col lg:flex-row items-center gap-12 relative">
              <div className="relative group">
                <button 
                  onClick={toggleAudio}
                  disabled={submitted}
                  className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center transition-all shadow-2xl relative z-10 ${
                    isPlaying 
                    ? 'bg-rose-500 hover:bg-rose-400 shadow-rose-500/20' 
                    : 'bg-purple-600 hover:bg-purple-500 shadow-purple-500/20'
                  } ${submitted ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 active:translate-y-0'}`}
                >
                  {isPlaying ? <Pause className="w-12 h-12 text-white fill-current" /> : <Play className="w-12 h-12 text-white fill-current ml-1" />}
                </button>
                {/* Audio Visualizer Animation */}
                {isPlaying && (
                  <div className="absolute -inset-4 flex items-center justify-center gap-1 opacity-30">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [20, 40, 20] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                        className="w-1.5 bg-purple-500 rounded-full"
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex-1 w-full space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-600">Listening Audio</span>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Bản ghi âm bài nghe</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    {submitted && (
                      <button 
                        onClick={() => {
                          const el = document.getElementById('transcript-section');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-50 text-purple-600 text-[10px] font-black rounded-2xl border border-purple-100 uppercase tracking-widest hover:bg-purple-100 transition-all shadow-sm"
                      >
                        <BookOpen className="w-4 h-4" />
                        Xem Script
                      </button>
                    )}
                    <div className="flex items-center gap-3 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                      <Volume2 className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-black text-slate-900">100%</span>
                    </div>
                  </div>
                </div>
                
                <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200 shadow-inner cursor-pointer group">
                  <motion.div 
                    className="h-full bg-gradient-purple rounded-full relative"
                    style={{ width: `${audioProgress}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </motion.div>
                </div>
                
                <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <span>0:00</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-purple-600 animate-pulse' : 'bg-slate-300'}`} />
                    <span className={isPlaying ? 'text-purple-600' : ''}>Audio {audioProgress.toFixed(0)}% Complete</span>
                  </div>
                  <span>10:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-16">
            <div className="space-y-10">
              <div className="flex items-center gap-8">
                <div className="h-px flex-1 bg-slate-200" />
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em]">{data.section_type || "Listening Section"}</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{data.context || "Bài nghe IELTS"}</h2>
                </div>
                <div className="h-px flex-1 bg-slate-200" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {data.questions.map((q: any, idx: number) => (
                  <div key={q.id} id={`q-${q.id}`} className="bg-white rounded-[2.5rem] p-8 hover:shadow-2xl transition-all border border-slate-100 shadow-xl relative group">
                    <div className="flex gap-6">
                      <span className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center font-black text-lg border border-slate-100 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        {idx + 1}
                      </span>
                      <div className="flex-1 space-y-6">
                        <p className="text-slate-900 font-bold text-lg leading-relaxed">{q.question}</p>
                        
                        <input 
                          type="text"
                          disabled={submitted}
                          placeholder="Nhập câu trả lời..."
                          value={userAnswers[q.id] || ''}
                          onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          className="w-full p-5 rounded-2xl border border-slate-100 bg-slate-50 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-lg font-bold text-slate-900 placeholder:text-slate-300"
                        />

                        {submitted && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-[2rem] border relative overflow-hidden ${
                              userAnswers[q.id]?.toLowerCase().trim() === data.answers.find((a: any) => a.id === q.id).correct_answer.toLowerCase().trim()
                              ? 'bg-purple-50 border-purple-100'
                              : 'bg-rose-50 border-rose-100'
                            }`}
                          >
                            <div className="flex items-start gap-4 relative">
                              <div className={`mt-1 p-1.5 rounded-lg ${
                                userAnswers[q.id]?.toLowerCase().trim() === data.answers.find((a: any) => a.id === q.id).correct_answer.toLowerCase().trim()
                                ? 'bg-purple-500 text-white'
                                : 'bg-rose-500 text-white'
                              }`}>
                                <CheckCircle className="w-4 h-4" />
                              </div>
                              <div className="space-y-3">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                                  Đáp án đúng: <span className="text-purple-600 ml-2">{data.answers.find((a: any) => a.id === q.id).correct_answer}</span>
                                </p>
                                <div className="space-y-2">
                                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 block">Phân tích chuyên sâu:</span>
                                  <p className="text-slate-600 text-sm font-bold leading-relaxed italic">
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

            {/* Transcript Section - Shows after submission */}
            {submitted && data.transcript && (
              <motion.div 
                id="transcript-section"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 pt-16 border-t border-slate-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Transcript Chi Tiết</h3>
                </div>
                
                <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-purple-500/10 transition-colors" />
                  <div className="relative space-y-8">
                    {data.transcript.split('\n\n').map((paragraph: string, i: number) => (
                      <p key={i} className="text-slate-600 font-bold text-lg leading-relaxed first-letter:text-4xl first-letter:font-black first-letter:text-purple-600 first-letter:mr-1">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center pt-8">
                  <button 
                    onClick={generateTask}
                    className="btn-primary px-12 py-6 text-base flex items-center gap-4 group"
                  >
                    <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                    Luyện tập bài mới
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}

      {/* Result Modal */}
      <AnimatePresence>
        {submitted && data.score && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-[3rem] max-w-xl w-full overflow-hidden border border-slate-100 shadow-2xl"
            >
              <div className="bg-purple-600 p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="relative">
                  <div className="w-24 h-24 bg-white/20 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 backdrop-blur-md border border-white/20">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-4xl font-black text-white tracking-tight">Kết quả luyện tập</h3>
                  <p className="text-purple-100 font-medium text-lg mt-2 opacity-80">Listening Academic Practice</p>
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
                  <div className="flex flex-col items-center justify-center p-10 bg-purple-50 rounded-[2.5rem] border border-purple-100 shadow-sm group">
                    <p className="text-purple-600 text-[10px] font-black uppercase tracking-[0.2em] mb-3">Estimated Band</p>
                    <div className="text-7xl font-black text-purple-600 tracking-tighter tabular-nums">{data.score.band}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="py-5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs transition-all border border-slate-200"
                  >
                    Xem lại đáp án
                  </button>
                  <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-5 text-xs uppercase tracking-widest bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-purple-500/20"
                  >
                    Làm bài thi mới
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
