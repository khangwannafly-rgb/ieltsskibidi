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
            <PenTool className="absolute inset-0 m-auto w-14 h-14 text-purple-600" />
          </div>
          <div className="space-y-4 relative">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Đang soạn đề bài...</h2>
            <p className="text-slate-500 font-bold leading-relaxed">AI đang biên soạn đề bài Writing phù hợp với mục tiêu Band {user?.targetScore || 6.5} của bạn.</p>
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

  if (question?.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F9FAFB]">
        <div className="max-w-md w-full p-12 bg-white rounded-[3rem] border border-rose-100 text-center space-y-10 shadow-2xl">
          <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto text-rose-600 border border-rose-100 shadow-xl shadow-rose-500/10">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Lỗi hệ thống</h2>
            <p className="text-slate-500 font-bold leading-relaxed">
              {question.error || "Không thể kết nối với AI để tạo đề bài. Vui lòng thử lại sau giây lát."}
            </p>
          </div>
          <button 
            onClick={() => generateTask(taskType)}
            className="btn-primary w-full py-6 text-sm"
          >
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-32 pb-24">
      <div className="max-w-[1600px] mx-auto px-6 space-y-12">
        {/* Header Section */}
        {!question && (
          <div className="flex flex-col lg:flex-row justify-between items-end gap-12 border-b border-slate-200 pb-12">
            <div className="space-y-6 flex-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-100 text-purple-600 text-[10px] font-black uppercase tracking-widest shadow-sm"
              >
                <Sparkles className="w-4 h-4" />
                AI-Powered Learning
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                Writing <span className="text-gradient">Mastery</span>
              </h1>
              <p className="text-slate-600 font-bold text-xl leading-relaxed max-w-2xl">
                Luyện tập viết luận Task 1 & 2 với phản hồi chi tiết từ AI dựa trên các tiêu chí chấm điểm IELTS chính thức.
              </p>
            </div>
            
            <div className="flex bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-xl">
              <button 
                onClick={() => setTaskType("task1")}
                className={`px-12 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                  taskType === 'task1' ? 'bg-gradient-purple text-white shadow-lg shadow-purple-500/30' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Academic Task 1
              </button>
              <button 
                onClick={() => setTaskType("task2")}
                className={`px-12 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 ${
                  taskType === 'task2' ? 'bg-gradient-purple text-white shadow-lg shadow-purple-500/30' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                Academic Task 2
              </button>
            </div>
          </div>
        )}

        {/* Question Header when active */}
        {question && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl"
          >
            <button 
              onClick={() => setQuestion(null)}
              className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-slate-50 text-slate-500 hover:text-purple-600 hover:bg-purple-50 transition-all font-black uppercase tracking-widest text-[10px] border border-slate-100"
            >
              <ChevronRight className="w-4 h-4 rotate-180" /> Quay lại
            </button>
            <div className="flex items-center gap-6 px-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Đang luyện tập</span>
                <span className="text-lg font-black text-slate-900 uppercase tracking-tighter">Writing {taskType === 'task1' ? 'Task 1' : 'Task 2'}</span>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div className="flex items-center gap-3">
                <Timer className="w-6 h-6 text-purple-600" />
                <span className="text-2xl font-black text-slate-900 tabular-nums tracking-tighter">{taskType === 'task1' ? '20:00' : '40:00'}</span>
              </div>
            </div>
          </motion.div>
        )}

        {!question ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto pt-4">
            <motion.button 
              whileHover={{ y: -16 }}
              onClick={() => generateTask("task1")}
              className="bg-white rounded-[3rem] p-12 text-left group transition-all duration-500 border border-slate-100 shadow-xl hover:shadow-2xl hover:border-purple-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-purple-500/10 transition-colors" />
              <div className="w-24 h-24 bg-purple-50 rounded-3xl flex items-center justify-center text-purple-600 mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-purple-100 shadow-lg shadow-purple-500/5">
                <BarChart2 className="w-12 h-12" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-4 group-hover:text-purple-600 transition-all tracking-tighter uppercase">Academic Task 1</h3>
              <p className="text-slate-500 font-bold leading-relaxed mb-10 text-lg">
                Mô tả và giải thích dữ liệu từ biểu đồ đường, cột, tròn hoặc quy trình sản xuất. Rèn luyện kỹ năng phân tích số liệu chính xác.
              </p>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-purple-600 group-hover:translate-x-3 transition-transform">
                Bắt đầu ngay <ChevronRight className="w-5 h-5" />
              </div>
            </motion.button>

            <motion.button 
              whileHover={{ y: -16 }}
              onClick={() => generateTask("task2")}
              className="bg-white rounded-[3rem] p-12 text-left group transition-all duration-500 border border-slate-100 shadow-xl hover:shadow-2xl hover:border-purple-500/20 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-purple-500/10 transition-colors" />
              <div className="w-24 h-24 bg-purple-50 rounded-3xl flex items-center justify-center text-purple-600 mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-purple-100 shadow-lg shadow-purple-500/5">
                <PenTool className="w-12 h-12" />
              </div>
              <h3 className="text-4xl font-black text-slate-900 mb-4 group-hover:text-purple-600 transition-all tracking-tighter uppercase">Academic Task 2</h3>
              <p className="text-slate-500 font-bold leading-relaxed mb-10 text-lg">
                Viết bài luận nghị luận về các chủ đề xã hội, giáo dục hoặc môi trường. Tập trung vào tư duy phản biện và cấu trúc bài viết.
              </p>
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-purple-600 group-hover:translate-x-3 transition-transform">
                Bắt đầu ngay <ChevronRight className="w-5 h-5" />
              </div>
            </motion.button>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr_0.8fr] gap-10 items-start">
            {/* Left Side: Question & Data */}
            <div className="space-y-10">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[3rem] p-10 space-y-8 relative overflow-hidden border border-slate-100 shadow-xl"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                
                <div className="flex justify-between items-start relative">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Practice Content</span>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Đề bài chi tiết</h2>
                  </div>
                  <div className="px-6 py-3 bg-purple-50 text-purple-600 text-[10px] font-black rounded-2xl border border-purple-100 uppercase tracking-widest shadow-sm">
                    Mục tiêu Band {question.difficulty_estimate_band}
                  </div>
                </div>

                <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group">
                  <p className="text-slate-900 font-bold text-2xl leading-relaxed italic">
                    "{question.question}"
                  </p>
                </div>

                {taskType === 'task1' && question.chart_data && (
                  <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 min-h-[450px] shadow-inner">
                    <WritingTask1Chart data={question.chart_data} />
                  </div>
                )}

                <div className="flex flex-wrap gap-10 pt-10 border-t border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 shadow-sm">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</span>
                      <span className="text-base font-black text-slate-900 uppercase tracking-tighter">{taskType === 'task1' ? '20' : '40'} Phút</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 shadow-sm">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yêu cầu</span>
                      <span className="text-base font-black text-slate-900 uppercase tracking-tighter">Tối thiểu {question.min_words} từ</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Middle: Editor */}
            <div className="space-y-10 lg:sticky lg:top-32">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100"
              >
                <div className="bg-slate-50 px-10 py-8 flex justify-between items-center border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className={`w-4 h-4 rounded-full animate-pulse shadow-lg ${loading ? 'bg-purple-500 shadow-purple-500/20' : 'bg-purple-600 shadow-purple-600/20'}`} />
                    <span className={`text-[10px] font-black uppercase tracking-widest ${loading ? 'text-purple-600' : 'text-slate-900'}`}>
                      {loading ? 'Đang phân tích bài viết...' : 'Editor Mode'}
                    </span>
                  </div>
                  <div className={`text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl border transition-all duration-500 shadow-sm ${wordCount < (question.min_words || 150) ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-purple-50 text-purple-600 border-purple-100'}`}>
                    {wordCount} Words
                  </div>
                </div>
                <textarea 
                  className="w-full h-[650px] p-12 outline-none bg-transparent text-slate-900 font-bold text-xl leading-relaxed resize-none transition-colors placeholder:text-slate-300 selection:bg-purple-100"
                  placeholder="Bắt đầu viết bài luận của bạn tại đây..."
                  value={essay}
                  onChange={(e) => setEssay(e.target.value)}
                  disabled={loading || !!result}
                />
                <div className="p-10 bg-slate-50 border-t border-slate-100 flex justify-end gap-6">
                  {!result ? (
                    <button 
                      onClick={submitEssay}
                      disabled={loading || wordCount < 50}
                      className="btn-primary flex items-center gap-4 py-5 px-10 disabled:opacity-30 disabled:grayscale group"
                    >
                      {loading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                      <span className="text-base font-black uppercase tracking-widest">Chấm điểm ngay</span>
                    </button>
                  ) : (
                    <button 
                      onClick={() => generateTask(taskType)}
                      className="btn-secondary flex items-center gap-4 py-5 px-10 border border-slate-200"
                    >
                      <RefreshCw className="w-6 h-6" />
                      <span className="text-base font-black uppercase tracking-widest">Luyện đề mới</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Side: Structural Guide & Vocabulary */}
            <div className="space-y-10 lg:sticky lg:top-32">
              {/* Structural Guide */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-[3rem] p-10 space-y-8 border border-slate-100 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Cấu trúc chuẩn</h3>
                </div>

                {question.structure_tips && (
                  <div className="space-y-8">
                    {Object.entries(question.structure_tips).map(([key, tip]: [string, any]) => {
                      const labelMap: Record<string, { title: string, icon: any }> = {
                        'introduction': { title: 'Mở bài', icon: <PenTool className="w-4 h-4" /> },
                        'overview': { title: 'Tổng quan', icon: <TrendingUp className="w-4 h-4" /> },
                        'body_paragraph_1': { title: 'Thân bài 1', icon: <ChevronRight className="w-4 h-4" /> },
                        'body_paragraph_2': { title: 'Thân bài 2', icon: <ChevronRight className="w-4 h-4" /> },
                        'body_1': { title: 'Thân bài 1', icon: <ChevronRight className="w-4 h-4" /> },
                        'body_2': { title: 'Thân bài 2', icon: <ChevronRight className="w-4 h-4" /> },
                        'conclusion': { title: 'Kết bài', icon: <CheckCircle className="w-4 h-4" /> }
                      };
                      const config = labelMap[key] || { title: key.replace('_', ' '), icon: <ChevronRight className="w-4 h-4" /> };
                      
                      return (
                        <div key={key} className="space-y-4 group">
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all duration-300">
                              {config.icon}
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-purple-600 transition-colors">{config.title}</span>
                          </div>
                          <div className="pl-12 relative">
                            <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-100 group-hover:bg-purple-200 transition-colors" />
                            <p className="text-sm text-slate-500 leading-relaxed font-bold">
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
                className="bg-white rounded-[3rem] p-10 space-y-8 shadow-xl border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] rounded-full" />
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Từ vựng gợi ý</h3>
                  </div>

                  <div className="space-y-6">
                    {question.vocabulary_hints?.map((hint: any, idx: number) => (
                      <div key={idx} className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-purple-200 hover:bg-white hover:shadow-xl transition-all group">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-base font-black text-purple-600 group-hover:scale-105 transition-transform">{hint.word}</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">{hint.meaning}</span>
                        </div>
                        <p className="text-xs text-slate-500 italic font-bold leading-relaxed">
                          "{hint.usage}"
                        </p>
                      </div>
                    ))}
                    {!question.vocabulary_hints && (
                      <p className="text-xs text-slate-400 italic font-bold">Đang phân tích từ vựng phù hợp...</p>
                    )}
                  </div>
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
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 40, opacity: 0 }}
                className="bg-white max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col rounded-[3rem] border border-slate-100 shadow-2xl"
              >
                {/* Modal Header */}
                <div className="p-10 border-b border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-purple rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/30">
                      <Trophy className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Kết quả Writing</h2>
                      <p className="text-slate-500 font-bold text-lg">Phân tích chi tiết từ Giám khảo AI</p>
                    </div>
                  </div>
                  <div className="bg-white px-10 py-6 rounded-3xl border border-slate-200 text-center shadow-lg">
                    <div className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-1">Overall Band</div>
                    <div className="text-5xl font-black text-slate-900 tracking-tighter">{result.overall_band}</div>
                  </div>
                </div>

                <div className="p-10 overflow-y-auto space-y-12">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                          className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-center space-y-4 shadow-sm"
                        >
                          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest h-10 flex items-center justify-center leading-tight">
                            {criteriaMap[key] || key}
                          </div>
                          <div className="text-4xl font-black text-slate-900">{score}</div>
                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-200/50">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(score/9)*100}%` }}
                              className="h-full bg-gradient-purple"
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* AI Insights */}
                  <div className="space-y-8">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4 uppercase tracking-tighter">
                      <Sparkles className="w-8 h-8 text-purple-600" />
                      Chiến thuật cải thiện
                    </h3>
                    <div className="grid gap-6">
                      {result.key_improvements.map((improvement: string, i: number) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex items-start gap-6 hover:bg-white hover:shadow-xl hover:border-purple-100 transition-all duration-300 group"
                        >
                          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center flex-shrink-0 border border-purple-100 group-hover:bg-purple-600 group-hover:text-white transition-all">
                            <CheckCircle className="w-6 h-6 text-purple-600 group-hover:text-white" />
                          </div>
                          <p className="text-slate-600 font-bold leading-relaxed text-lg">{improvement}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-10 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-6">
                  <button 
                    onClick={() => {
                      setResult(null);
                      setQuestion(null);
                      setEssay("");
                    }}
                    className="flex-1 py-6 bg-white hover:bg-slate-50 text-slate-900 font-black text-sm uppercase tracking-widest rounded-[2rem] transition-all border border-slate-200 shadow-sm"
                  >
                    Luyện tập bài mới
                  </button>
                  <button 
                    onClick={() => setResult(null)}
                    className="flex-1 py-6 bg-gradient-purple text-white font-black text-sm uppercase tracking-widest rounded-[2rem] transition-all shadow-xl shadow-purple-500/20 hover:scale-[1.02] active:scale-95"
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
