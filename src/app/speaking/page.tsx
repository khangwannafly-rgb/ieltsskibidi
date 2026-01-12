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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB] p-6">
        <div className="w-full max-w-md p-12 bg-white rounded-[3rem] border border-slate-100 text-center space-y-8 relative overflow-hidden shadow-2xl">
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
            <Mic className="absolute inset-0 m-auto w-14 h-14 text-purple-600" />
          </div>

          <div className="space-y-4 relative">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Đang chuẩn bị câu hỏi...</h2>
            <p className="text-slate-500 font-bold leading-relaxed">AI đang chuẩn bị các câu hỏi Speaking Part {part} cho bạn.</p>
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
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB] p-6">
        <div className="max-w-md w-full p-12 bg-white rounded-[3rem] border border-rose-100 text-center space-y-10 shadow-2xl">
          <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto text-rose-600 border border-rose-100 shadow-xl shadow-rose-500/10">
            <MicOff className="w-12 h-12 relative" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Rất tiếc!</h2>
            <p className="text-slate-500 font-bold leading-relaxed">
              {data.error || "Không thể tạo câu hỏi ngay lúc này. Vui lòng thử lại sau."}
            </p>
          </div>
          <button 
            onClick={() => generateTask(part)}
            className="btn-primary w-full py-6 text-sm"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-8 pb-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/5 blur-[120px] rounded-full animate-pulse-slow" />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-black uppercase tracking-widest">
              AI Speaking Lab
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Speaking <br /> Simulator</h1>
            <p className="text-slate-500 font-bold text-lg">Môi trường phỏng vấn IELTS chuyên nghiệp với AI.</p>
          </div>
          
          <div className="flex bg-white p-2 rounded-[2rem] border border-slate-100 shadow-xl">
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => generateTask(p)}
                className={`px-8 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                  part === p 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 scale-105' 
                  : 'text-slate-400 hover:text-purple-600'
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
              { id: 1, title: 'Introduction', desc: 'Warm-up questions about familiar everyday topics.', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50', borderColor: 'group-hover:border-purple-200' },
              { id: 2, title: 'Cue Card', desc: 'Speak about a specific topic with 1-minute preparation.', icon: Trophy, color: 'text-purple-600', bg: 'bg-purple-50', borderColor: 'group-hover:border-purple-200' },
              { id: 3, title: 'Discussion', desc: 'More abstract and in-depth academic discussions.', icon: ShieldCheck, color: 'text-purple-600', bg: 'bg-purple-50', borderColor: 'group-hover:border-purple-200' },
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ y: -8 }}
                onClick={() => generateTask(item.id)}
                className={`bg-white rounded-[3rem] group text-left p-10 border border-slate-100 transition-all relative overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-purple-500/10 ${item.borderColor}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10 space-y-8">
                  <div className="flex items-center justify-between">
                    <div className={`${item.bg} w-16 h-16 rounded-2xl flex items-center justify-center ${item.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm border border-purple-100`}>
                      <item.icon className="w-8 h-8" />
                    </div>
                    <ChevronRight className={`w-6 h-6 ${item.color} opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0`} />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black text-slate-900 transition-colors uppercase tracking-tight">{item.title}</h3>
                    <p className="text-slate-500 font-bold leading-relaxed">{item.desc}</p>
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
            <div className="bg-white border border-slate-100 relative overflow-hidden rounded-[3rem] shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[100px] rounded-full -mr-64 -mt-64" />
              
              <div className="relative">
                {/* Examiner Info Bar */}
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-[#F9FAFB]">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-purple rounded-[1.25rem] flex items-center justify-center shadow-xl shadow-purple-500/20">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-purple-600 uppercase tracking-[0.2em] block mb-1">Giám khảo IELTS AI</span>
                      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Mr. Anderson</h2>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 bg-purple-50 rounded-2xl border border-purple-100 shadow-sm">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="font-black text-purple-600 tracking-widest text-[10px] uppercase">
                      Mục tiêu: Band {user?.targetScore || 6.5}
                    </span>
                  </div>
                </div>

                <div className="p-12 space-y-12">
                  <div className="max-w-3xl mx-auto text-center space-y-10">
                    {part === 2 ? (
                      <div className="space-y-10">
                        <div className="space-y-4">
                          <span className="inline-block px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-black uppercase tracking-widest">
                            Cue Card Topic
                          </span>
                          <h3 className="text-4xl font-black text-slate-900 leading-tight tracking-tight uppercase">{data.task}</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                          {data.bullets.map((b: string, i: number) => (
                            <motion.div 
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.1 }}
                              key={i} 
                              className="flex items-center gap-4 text-slate-600 font-bold bg-[#F9FAFB] p-6 rounded-[2rem] border border-slate-100 hover:border-purple-200 transition-all group"
                            >
                              <div className="w-3 h-3 rounded-full bg-purple-600 shadow-[0_0_15px_rgba(147,51,234,0.5)] group-hover:scale-125 transition-transform" />
                              <span className="group-hover:text-slate-900 transition-colors">{b}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-600 text-[10px] font-black uppercase tracking-widest">
                          Câu hỏi {currentQuestionIdx + 1} / {data.questions.length}
                        </div>
                        <p className="text-4xl md:text-5xl font-black text-slate-900 leading-tight tracking-tighter italic uppercase">
                          "{data.questions[currentQuestionIdx]}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Recording Interface */}
                  <div className="flex flex-col items-center gap-10 py-10">
                    <div className="relative">
                      <AnimatePresence>
                        {isRecording && (
                          <>
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1.5, opacity: 1 }}
                              exit={{ scale: 2, opacity: 0 }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute inset-0 bg-rose-500/10 rounded-full blur-3xl"
                            />
                            <motion.div 
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1.2, opacity: 1 }}
                              exit={{ scale: 1.4, opacity: 0 }}
                              transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                              className="absolute inset-0 bg-rose-500/5 rounded-full blur-2xl"
                            />
                          </>
                        )}
                      </AnimatePresence>
                      
                      <button 
                        onClick={toggleRecording}
                        className={`w-36 h-36 rounded-full flex items-center justify-center transition-all relative z-10 border-8 border-white ${
                          isRecording 
                          ? 'bg-rose-600 shadow-2xl shadow-rose-500/40 scale-110' 
                          : 'bg-purple-600 shadow-2xl shadow-purple-500/30 hover:scale-105 hover:bg-purple-700'
                        }`}
                      >
                        {isRecording ? (
                          <Square className="w-12 h-12 text-white fill-white" />
                        ) : (
                          <Mic className="w-14 h-14 text-white" />
                        )}
                      </button>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                      <div className={`px-10 py-5 rounded-[2rem] font-mono font-black text-4xl flex items-center gap-6 border shadow-inner ${
                        isRecording 
                        ? 'bg-rose-50 border-rose-100 text-rose-600' 
                        : 'bg-slate-50 border-slate-100 text-slate-400 opacity-50'
                      }`}>
                        <div className={`w-4 h-4 rounded-full ${isRecording ? 'bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-slate-300'}`} />
                        {formatTimer(timer)}
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {isRecording ? (
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                              {[1, 2, 3, 4, 5].map(i => (
                                <motion.div
                                  key={i}
                                  animate={{ height: [6, 20, 6] }}
                                  transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                                  className="w-1.5 bg-rose-500 rounded-full"
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-500">Đang ghi âm câu trả lời của bạn...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 text-slate-400">
                            <Info className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Nhấn để bắt đầu trả lời</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {!isRecording && recordings[currentQuestionIdx] && (
                      <div className="flex gap-6">
                        <button className="flex items-center gap-3 px-8 py-4 bg-purple-50 text-purple-600 rounded-2xl border border-purple-100 hover:bg-purple-100 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-sm">
                          <Play className="w-5 h-5 fill-current" />
                          Nghe lại
                        </button>
                        <button 
                          onClick={() => setRecordings(prev => {
                            const n = {...prev};
                            delete n[currentQuestionIdx];
                            return n;
                          })}
                          className="flex items-center gap-3 px-8 py-4 bg-slate-50 text-slate-600 rounded-2xl border border-slate-100 hover:bg-slate-100 transition-all font-black text-[10px] uppercase tracking-[0.2em] shadow-sm"
                        >
                          <RefreshCw className="w-5 h-5" />
                          Ghi lại
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Navigation Bar */}
                <div className="p-8 bg-[#F9FAFB] border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
                  <button 
                    onClick={() => setData(null)}
                    className="flex items-center gap-3 text-slate-400 hover:text-purple-600 font-black text-[10px] uppercase tracking-[0.2em] transition-all group"
                  >
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    Đổi chủ đề khác
                  </button>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    {part !== 2 && currentQuestionIdx < data.questions.length - 1 && (
                      <button 
                        onClick={nextQuestion}
                        className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-900 px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-slate-200 shadow-xl"
                      >
                        Câu hỏi tiếp theo
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    )}
                    
                    {(part === 2 || currentQuestionIdx === data.questions.length - 1) && (
                      <button 
                        onClick={submitTest}
                        disabled={scoring || (part !== 2 && !recordings[currentQuestionIdx])}
                        className="flex-1 md:flex-none btn-primary px-12 py-5 text-[10px] shadow-2xl shadow-purple-500/30"
                      >
                        {scoring ? (
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="bg-white max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-100 shadow-2xl rounded-[3rem]"
              >
                {/* Modal Header */}
                <div className="p-10 border-b border-slate-100 bg-[#F9FAFB] flex justify-between items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                  <div className="flex items-center gap-6 relative">
                    <div className="w-20 h-20 bg-gradient-purple rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-purple-500/30">
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Kết quả Speaking</h2>
                      <p className="text-slate-500 font-bold text-lg mt-1">Phân tích chi tiết từ Giám khảo AI</p>
                    </div>
                  </div>
                  <div className="bg-purple-600 px-10 py-6 rounded-[2rem] shadow-2xl shadow-purple-500/30 text-center relative overflow-hidden group min-w-[160px]">
                    <div className="absolute inset-0 bg-gradient-purple" />
                    <div className="relative">
                      <div className="text-[10px] font-black text-purple-100 uppercase tracking-[0.2em] mb-1">Overall Band</div>
                      <div className="text-5xl font-black text-white">{score.overallBand}</div>
                    </div>
                  </div>
                </div>

                <div className="p-10 overflow-y-auto space-y-12">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {Object.entries(score.criteria).map(([key, value]: [string, any], i) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={key} 
                        className="bg-[#F9FAFB] p-6 rounded-[2rem] border border-slate-100 text-center space-y-3 hover:border-purple-200 transition-colors group"
                      >
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest h-10 flex items-center justify-center leading-tight group-hover:text-purple-600 transition-colors">
                          {key === 'fluency' ? 'Fluency & Coherence' : 
                           key === 'vocabulary' ? 'Lexical Resource' : 
                           key === 'grammar' ? 'Grammar Range' : 'Pronunciation'}
                        </div>
                        <div className="text-4xl font-black text-slate-900">{value.band}</div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Detailed Analysis */}
                  <div className="space-y-8">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tight">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-purple-600" />
                      </div>
                      Nhận xét chi tiết
                    </h3>
                    <div className="grid gap-6">
                      {Object.entries(score.criteria).map(([key, value]: [string, any]) => (
                        <div key={key} className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm space-y-4 hover:shadow-xl hover:shadow-purple-500/5 transition-all group">
                          <div className="flex items-center justify-between">
                            <h4 className="font-black text-purple-600 uppercase text-[10px] tracking-[0.2em]">
                              {key === 'fluency' ? 'Fluency & Coherence' : 
                               key === 'vocabulary' ? 'Lexical Resource' : 
                               key === 'grammar' ? 'Grammar Range' : 'Pronunciation'}
                            </h4>
                            <span className="px-4 py-1.5 bg-purple-50 rounded-full text-purple-600 text-[10px] font-black border border-purple-100 uppercase tracking-widest">Band {value.band}</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed font-bold text-lg italic opacity-80 group-hover:opacity-100 transition-opacity">"{value.feedback}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-10 border-t border-slate-100 bg-[#F9FAFB] flex gap-6">
                  <button 
                    onClick={() => {
                      setScore(null);
                      setData(null);
                    }}
                    className="flex-1 py-5 bg-white hover:bg-slate-50 text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl transition-all border border-slate-200 shadow-xl"
                  >
                    Luyện tập bài mới
                  </button>
                  <button 
                    onClick={() => setScore(null)}
                    className="flex-1 py-5 btn-primary text-[10px] shadow-2xl shadow-purple-500/30"
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
