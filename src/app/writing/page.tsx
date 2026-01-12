"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenTool, Send, RefreshCw, BarChart2, CheckCircle, AlertTriangle, ChevronRight, BookOpen, Clock, TrendingUp, Sparkles, Timer, Trophy } from "lucide-react";
import WritingTask1Chart from "@/components/WritingTask1Chart";
import { useUser } from "@/context/UserContext";

export default function WritingPage() {
  const { user, addSubmission } = useUser();
  const [question, setQuestion] = useState<any>(null);
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [taskType, setTaskType] = useState<string>("task2");

  const generateTask = async (type: string) => {
    setLoading(true);
    setResult(null);
    setEssay("");
    setTaskType(type);
    try {
      const res = await fetch("/api/generate/writing", {
        method: "POST",
        body: JSON.stringify({ 
          type,
          targetScore: user?.targetScore || 6.5
        }),
      });
      const data = await res.json();
      setQuestion(data);
    } catch (error) {
      console.error(error);
      setQuestion({ error: "Failed to generate task" });
    } finally {
      setLoading(false);
    }
  };

  const submitEssay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/score/writing", {
        method: "POST",
        body: JSON.stringify({ 
          question: question.question, 
          essay,
          task_type: taskType
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to score writing task");
      }

      const data = await res.json();
      setResult(data);

      // Save submission
      addSubmission({
        skill: 'writing',
        band: data.overall_band,
        details: {
          taskType,
          criteria_scores: data.criteria_scores,
          wordCount
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  if (loading && !question) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-md p-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full" />
          <div className="relative w-28 h-28 mx-auto">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-b-2 border-indigo-600 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="absolute inset-2 border-t-2 border-indigo-200 rounded-full"
            />
            <PenTool className="absolute inset-0 m-auto w-12 h-12 text-indigo-600" />
          </div>
          <div className="space-y-4 relative">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Đang soạn đề bài...</h2>
            <p className="text-slate-500 font-medium leading-relaxed">AI đang biên soạn đề bài Writing phù hợp với mục tiêu Band {user?.targetScore || 6.5} của bạn.</p>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-600 to-transparent w-1/2"
            />
          </div>
        </div>
      </div>
    );
  }

  if (question?.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="max-w-md w-full p-12 bg-white rounded-[2.5rem] border border-rose-100 text-center space-y-10 shadow-2xl">
          <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto text-rose-600 border border-rose-100 shadow-2xl shadow-rose-500/5">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Lỗi hệ thống</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              {question.error || "Không thể kết nối với AI để tạo đề bài. Vui lòng thử lại sau giây lát."}
            </p>
          </div>
          <button 
            onClick={() => generateTask(taskType)}
            className="btn-primary w-full py-5 text-lg shadow-rose-500/10"
          >
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-24">
      <div className="max-w-[1600px] mx-auto px-6 space-y-12">
        {/* Header Section */}
        {!question && (
          <div className="flex flex-col lg:flex-row justify-between items-end gap-12 border-b border-slate-100 pb-12">
            <div className="space-y-6 flex-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-100"
              >
                <Sparkles className="w-3 h-3" />
                AI-Powered Learning
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                Writing <span className="text-indigo-600">Mastery</span>
              </h1>
              <p className="text-slate-600 font-medium text-lg md:text-xl leading-relaxed max-w-2xl">
                Luyện tập viết luận Task 1 & 2 với phản hồi chi tiết từ AI dựa trên các tiêu chí chấm điểm IELTS chính thức.
              </p>
            </div>
            
            <div className="flex bg-slate-50 p-2 rounded-[2rem] border border-slate-100 shadow-lg shadow-indigo-500/5">
              <button 
                onClick={() => setTaskType("task1")}
                className={`px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                  taskType === 'task1' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-105' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Task 1
              </button>
              <button 
                onClick={() => setTaskType("task2")}
                className={`px-10 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
                  taskType === 'task2' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 scale-105' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Task 2
              </button>
            </div>
          </div>
        )}

        {/* Question Header when active */}
        {question && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-100 shadow-lg shadow-indigo-500/5"
          >
            <button 
              onClick={() => setQuestion(null)}
              className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-black uppercase tracking-widest text-[10px] border border-slate-100"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Quay lại danh sách
            </button>
            <div className="flex items-center gap-4 px-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Đang luyện tập</span>
                <span className="text-sm font-black text-slate-900 uppercase tracking-tighter">Writing {taskType === 'task1' ? 'Task 1' : 'Task 2'}</span>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-indigo-600" />
                <span className="text-xl font-black text-slate-900 tabular-nums tracking-tighter">{taskType === 'task1' ? '20:00' : '40:00'}</span>
              </div>
            </div>
          </motion.div>
        )}

        {!question ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto pt-4">
            <motion.button 
              whileHover={{ y: -12, scale: 1.02 }}
              onClick={() => generateTask("task1")}
              className="bg-white rounded-[2.5rem] p-12 text-left group transition-all duration-500 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 hover:border-indigo-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-indigo-500/10 transition-colors" />
              <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-indigo-100">
                <BarChart2 className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-all tracking-tight">Academic Task 1</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-10 text-lg">
                Mô tả và giải thích dữ liệu từ biểu đồ đường, cột, tròn hoặc quy trình sản xuất. Rèn luyện kỹ năng phân tích số liệu chính xác.
              </p>
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-indigo-600 group-hover:translate-x-2 transition-transform">
                Bắt đầu ngay <ChevronRight className="w-5 h-5" />
              </div>
            </motion.button>

            <motion.button 
              whileHover={{ y: -12, scale: 1.02 }}
              onClick={() => generateTask("task2")}
              className="bg-white rounded-[2.5rem] p-12 text-left group transition-all duration-500 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 hover:border-indigo-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-indigo-500/10 transition-colors" />
              <div className="w-20 h-20 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-indigo-100">
                <PenTool className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-all tracking-tight">Academic Task 2</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-10 text-lg">
                Viết bài luận nghị luận về các chủ đề xã hội, giáo dục hoặc môi trường. Tập trung vào tư duy phản biện và cấu trúc bài viết.
              </p>
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.3em] text-indigo-600 group-hover:translate-x-2 transition-transform">
                Bắt đầu ngay <ChevronRight className="w-5 h-5" />
              </div>
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr_0.8fr] gap-8 items-start">
            {/* Left Side: Question & Data */}
            <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden border border-slate-100 shadow-sm"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="flex justify-between items-start relative">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Practice Content</span>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Đề bài chi tiết</h2>
                  </div>
                  <div className="px-5 py-2.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-2xl border border-indigo-100 uppercase tracking-[0.2em]">
                    Mục tiêu Band {question.difficulty_estimate_band}
                  </div>
                </div>

                <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group">
                  <p className="text-slate-900 font-bold text-xl leading-relaxed italic">
                    "{question.question}"
                  </p>
                </div>

                {taskType === 'task1' && question.chart_data && (
                  <div className="bg-white rounded-[2rem] p-8 border border-slate-100 min-h-[450px]">
                    <WritingTask1Chart data={question.chart_data} />
                  </div>
                )}

                <div className="flex flex-wrap gap-8 pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                      <Clock className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</span>
                      <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{taskType === 'task1' ? '20' : '40'} Phút</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yêu cầu</span>
                      <span className="text-sm font-black text-slate-900 uppercase tracking-tight">Tối thiểu {question.min_words} từ</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Middle: Editor */}
            <div className="space-y-8 lg:sticky lg:top-32">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100"
              >
                <div className="bg-slate-50 px-8 py-6 flex justify-between items-center border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-slate-900 text-[10px] font-black uppercase tracking-[0.3em]">Editor Mode</span>
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl border transition-colors duration-500 ${wordCount < (question.min_words || 150) ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                    {wordCount} Words
                  </div>
                </div>
                <textarea 
                  className="w-full h-[600px] p-10 outline-none bg-transparent text-slate-900 font-medium text-lg leading-relaxed resize-none transition-colors placeholder:text-slate-300 selection:bg-indigo-100"
                  placeholder="Bắt đầu viết bài luận của bạn tại đây..."
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  disabled={loading || !!result}
                />
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end gap-6">
                  {!result ? (
                    <button 
                      onClick={submitEssay}
                      disabled={loading || wordCount < 50}
                      className="btn-primary flex items-center gap-4 py-4 px-8 disabled:opacity-30 disabled:grayscale group"
                    >
                      {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                      <span className="text-lg">Chấm điểm bài viết</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => generateTask(taskType)}
                      className="btn-secondary flex items-center gap-4 py-4 px-8"
                    >
                      <RefreshCw className="w-5 h-5" />
                      <span className="text-lg">Luyện đề mới</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Side: Structural Guide & Vocabulary */}
            <div className="space-y-8 lg:sticky lg:top-32">
              {/* Structural Guide */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[2.5rem] p-8 space-y-6 border border-slate-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Cấu trúc chuẩn</h3>
                </div>

                {question.structure_tips && (
                  <div className="space-y-6">
                    {Object.entries(question.structure_tips).map(([key, tip]: [string, any]) => {
                      const labelMap: Record<string, { title: string, icon: any }> = {
                        'introduction': { title: 'Mở bài', icon: <PenTool className="w-3 h-3" /> },
                        'overview': { title: 'Tổng quan', icon: <TrendingUp className="w-3 h-3" /> },
                        'body_paragraph_1': { title: 'Thân bài 1', icon: <ChevronRight className="w-3 h-3" /> },
                        'body_paragraph_2': { title: 'Thân bài 2', icon: <ChevronRight className="w-3 h-3" /> },
                        'body_1': { title: 'Thân bài 1', icon: <ChevronRight className="w-3 h-3" /> },
                        'body_2': { title: 'Thân bài 2', icon: <ChevronRight className="w-3 h-3" /> },
                        'conclusion': { title: 'Kết bài', icon: <CheckCircle className="w-3 h-3" /> }
                      };
                      const config = labelMap[key] || { title: key.replace('_', ' '), icon: <ChevronRight className="w-3 h-3" /> };
                      
                      return (
                        <div key={key} className="space-y-3 group">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                              {config.icon}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-indigo-400 transition-colors">{config.title}</span>
                          </div>
                          <div className="pl-9 relative">
                            <div className="absolute left-3 top-0 bottom-0 w-px bg-white/5 group-hover:bg-indigo-500/30 transition-colors" />
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                              {tip}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* Vocabulary Hints */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
                className="glass-card !p-8 space-y-6 border-white/5 bg-slate-900/40"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400 border border-emerald-500/20">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Từ vựng gợi ý</h3>
                </div>

                <div className="space-y-4">
                  {question.vocabulary_hints?.map((hint: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950/50 border border-white/5 hover:border-emerald-500/30 transition-all group">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-black text-emerald-400">{hint.word}</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase">{hint.meaning}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic leading-relaxed">
                        "{hint.usage}"
                      </p>
                    </div>
                  ))}
                  {!question.vocabulary_hints && (
                    <p className="text-xs text-slate-500 italic">Đang phân tích từ vựng phù hợp...</p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Results Modal */}
        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 40, opacity: 0 }}
                className="glass-premium max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border-white/10 shadow-2xl"
              >
                {/* Modal Header */}
                <div className="p-8 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                      <Trophy className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tight">Kết quả Writing</h2>
                      <p className="text-slate-400 font-medium">Phân tích chi tiết từ Giám khảo AI</p>
                    </div>
                  </div>
                  <div className="bg-indigo-500/10 px-8 py-5 rounded-2xl border border-indigo-500/20 text-center">
                    <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">Overall Band</div>
                    <div className="text-4xl font-black text-white">{result.overall_band}</div>
                  </div>
                </div>

                <div className="p-8 overflow-y-auto space-y-12">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {Object.entries(result.criteria_scores).map(([key, score]: [string, any], i) => {
                      const criteriaMap: Record<string, string> = {
                        'task_achievement': 'Task Achievement',
                        'task_response': 'Task Response',
                        'coherence_and_cohesion': 'Coherence & Cohesion',
                        'lexical_resource': 'Lexical Resource',
                        'grammatical_range_and_accuracy': 'Grammar & Accuracy'
                      };
                      return (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          key={key} 
                          className="bg-white/5 p-6 rounded-2xl border border-white/5 text-center space-y-3"
                        >
                          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest h-8 flex items-center justify-center leading-tight">
                            {criteriaMap[key] || key}
                          </div>
                          <div className="text-3xl font-black text-white">{score}</div>
                          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(score/9)*100}%` }}
                              className="h-full bg-indigo-500"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* AI Insights */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-black text-white flex items-center gap-3">
                      <Sparkles className="w-6 h-6 text-indigo-400" />
                      Chiến thuật cải thiện
                    </h3>
                    <div className="grid gap-4">
                      {result.key_improvements.map((improvement: string, i: number) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-start gap-5 hover:bg-white/10 transition-all"
                        >
                          <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                            <CheckCircle className="w-5 h-5 text-indigo-400" />
                          </div>
                          <p className="text-slate-300 font-medium leading-relaxed">{improvement}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-8 border-t border-white/10 bg-white/[0.02] flex gap-4">
                  <button 
                    onClick={() => {
                      setResult(null);
                      setQuestion(null);
                      setEssay("");
                    }}
                    className="flex-1 py-4 glass-premium bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all border-white/10"
                  >
                    Luyện tập bài mới
                  </button>
                  <button 
                    onClick={() => setResult(null)}
                    className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-indigo-500/20"
                  >
                    Xem lại bài viết
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
