"use client";

import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { BookOpen, Headphones, PenTool, Mic, ArrowRight, Zap, Target, TrendingUp, Star } from "lucide-react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const mockDescriptorData = [
  { subject: 'TR / FC', A: 7.5, fullMark: 9 },
  { subject: 'CC', A: 6.5, fullMark: 9 },
  { subject: 'LR', A: 8.0, fullMark: 9 },
  { subject: 'GRA', A: 6.0, fullMark: 9 },
  { subject: 'PR', A: 7.0, fullMark: 9 },
];

const mockProgressData = [
  { name: 'Tuần 1', band: 6.0 },
  { name: 'Tuần 2', band: 6.5 },
  { name: 'Tuần 3', band: 6.5 },
  { name: 'Tuần 4', band: 7.0 },
  { name: 'Tuần 5', band: 7.2 },
];

const skills = [
  { 
    name: 'Kỹ năng Đọc', 
    icon: BookOpen, 
    color: 'text-indigo-400', 
    bgColor: 'bg-indigo-500/10',
    borderColor: 'group-hover:border-indigo-500/30',
    href: '/reading',
    desc: 'Luyện tập với các đoạn văn học thuật và các dạng câu hỏi thực tế.'
  },
  { 
    name: 'Kỹ năng Nghe', 
    icon: Headphones, 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/10',
    borderColor: 'group-hover:border-emerald-500/30',
    href: '/listening',
    desc: 'Cải thiện kỹ năng nghe với nhiều giọng đọc và tốc độ khác nhau.'
  },
  { 
    name: 'Kỹ năng Viết', 
    icon: PenTool, 
    color: 'text-rose-400', 
    bgColor: 'bg-rose-500/10',
    borderColor: 'group-hover:border-rose-500/30',
    href: '/writing',
    desc: 'Hoàn thiện cấu trúc bài viết Task 1 & 2 với sự hỗ trợ từ AI.'
  },
  { 
    name: 'Kỹ năng Nói', 
    icon: Mic, 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-500/10',
    borderColor: 'group-hover:border-amber-500/30',
    href: '/speaking',
    desc: 'Mô phỏng phỏng vấn và cải thiện độ trôi chảy khi nói.'
  },
];

export default function Dashboard() {
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Calculate real progress from submissions
  const submissions = user?.submissions || [];
  
  // Current Band: average of last 5 submissions (or all if < 5)
  const lastSubmissions = submissions.slice(0, 5).reverse();
  const currentBand = submissions.length > 0 
    ? submissions.reduce((acc, sub) => acc + sub.band, 0) / submissions.length
    : 0;
  
  const targetBand = user?.targetScore || 6.5;
  const progressPercent = targetBand > 0 ? Math.min(100, Math.max(0, (currentBand / targetBand) * 100)) : 0;

  // Real Progress Data for Line Chart
  const progressData = lastSubmissions.length > 0
    ? lastSubmissions.map((sub, idx) => ({
        name: `Bài ${idx + 1}`,
        band: sub.band,
        skill: sub.skill.charAt(0).toUpperCase() + sub.skill.slice(1)
      }))
    : mockProgressData;

  // Real Descriptor Data for Radar Chart (using latest Writing/Speaking if available)
  const latestDetailedSub = submissions.find(sub => sub.skill === 'writing' || sub.skill === 'speaking');
  const descriptorData = latestDetailedSub ? [
    { 
      subject: 'TR / FC', 
      A: latestDetailedSub.skill === 'writing' 
        ? latestDetailedSub.details.criteria_scores.task_achievement 
        : latestDetailedSub.details.criteria.fluency_and_coherence.score, 
      fullMark: 9 
    },
    { 
      subject: 'CC / LR', 
      A: latestDetailedSub.skill === 'writing' 
        ? latestDetailedSub.details.criteria_scores.coherence_and_cohesion 
        : latestDetailedSub.details.criteria.lexical_resource.score, 
      fullMark: 9 
    },
    { 
      subject: 'LR / GRA', 
      A: latestDetailedSub.skill === 'writing' 
        ? latestDetailedSub.details.criteria_scores.lexical_resource 
        : latestDetailedSub.details.criteria.grammatical_range_and_accuracy.score, 
      fullMark: 9 
    },
    { 
      subject: 'GRA / PR', 
      A: latestDetailedSub.skill === 'writing' 
        ? latestDetailedSub.details.criteria_scores.grammatical_range_and_accuracy 
        : latestDetailedSub.details.criteria.pronunciation.score, 
      fullMark: 9 
    },
    { 
      subject: 'Overall', 
      A: latestDetailedSub.band, 
      fullMark: 9 
    },
  ] : mockDescriptorData;

  const getStrengthsText = () => {
    if (submissions.length === 0) return "Hãy làm bài kiểm tra đầu tiên để AI phân tích kỹ năng của bạn.";
    
    // Simple logic to find best skill
    const skillAverages = ['reading', 'listening', 'writing', 'speaking'].map(s => {
      const skillSubs = submissions.filter(sub => sub.skill === s);
      return {
        skill: s,
        avg: skillSubs.length > 0 ? skillSubs.reduce((a, b) => a + b.band, 0) / skillSubs.length : 0
      };
    });
    
    const bestSkill = skillAverages.reduce((a, b) => a.avg > b.avg ? a : b);
    if (bestSkill.avg === 0) return "Đang phân tích điểm mạnh của bạn...";
    
    const skillNames: any = { reading: 'Đọc', listening: 'Nghe', writing: 'Viết', speaking: 'Nói' };
    return `Kỹ năng ${skillNames[bestSkill.skill]} hiện là điểm mạnh nhất của bạn.`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-16 pt-32 pb-24">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
        <div className="flex-1 space-y-8 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black uppercase tracking-[0.3em] mb-4"
          >
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            AI Learning Dashboard
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="premium-title"
          >
            Chinh phục <br />
            <span className="gradient-text">IELTS</span> cùng AI
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="premium-subtitle"
          >
            Hệ thống luyện thi IELTS thông minh ứng dụng AI. <br />
            Mục tiêu của bạn là Band <span className="text-indigo-400 font-black tracking-wider underline decoration-indigo-500/30 underline-offset-8">{targetBand.toFixed(1)}</span>. 
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4"
          >
            <Link href="/writing" className="btn-primary flex items-center gap-3 group">
              Bắt đầu luyện tập
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn-secondary">Xem lộ trình học</button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring", damping: 20 }}
          className="relative group w-full lg:w-auto"
        >
          <div className="absolute inset-0 bg-indigo-500/20 blur-[120px] rounded-full group-hover:bg-indigo-500/30 transition-all duration-700" />
          <div className="relative glass-premium border-white/10 text-center space-y-8 min-w-[340px] shadow-2xl animate-float">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-indigo-600 shadow-2xl shadow-indigo-500/40 mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
              <Target className="w-12 h-12 text-white" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Trình độ hiện tại</span>
              <div className="text-8xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
                {currentBand.toFixed(1)}
              </div>
            </div>
            <div className="space-y-4">
              <div className="w-full h-3 bg-slate-800/50 rounded-full overflow-hidden p-0.5 border border-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 rounded-full"
                />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex justify-between">
                <span>Khởi đầu</span>
                <span>{progressPercent.toFixed(0)}% Mục tiêu</span>
                <span>Band {targetBand.toFixed(1)}</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
        {skills.map((skill, index) => (
          <Link href={skill.href} key={skill.name}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -12, scale: 1.02 }}
              className={`glass-card glass-shine group h-full !p-8 border-white/5 bg-slate-900/40 hover:bg-slate-900/60 ${skill.borderColor}`}
            >
              <div className="space-y-8">
                <div className={`${skill.bgColor} w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${skill.color} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/5 shadow-inner`}>
                  <skill.icon className="w-8 h-8" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-white group-hover:gradient-text transition-all duration-300 tracking-tight">{skill.name}</h3>
                  <p className="text-slate-400 font-medium leading-relaxed line-clamp-3 text-sm">
                    {skill.desc}
                  </p>
                </div>

                <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] ${skill.color} pt-2`}>
                  Luyện tập ngay
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-1 glass-card space-y-10 !p-10 border-white/5 bg-slate-900/40"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Cơ cấu Kỹ năng</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Phân tích chi tiết theo tiêu chí</p>
          </div>
          <div className="h-[320px] -mx-4 min-h-[320px]">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={descriptorData}>
                  <PolarGrid stroke="#334155" strokeDasharray="3 3" opacity={0.5} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 9]} tick={false} axisLine={false} />
                  <Radar 
                    name="Thí sinh" 
                    dataKey="A" 
                    stroke="#6366f1" 
                    strokeWidth={3}
                    fill="#6366f1" 
                    fillOpacity={0.2} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="pt-8 border-t border-white/5 flex items-start gap-4 text-slate-400 text-sm font-medium leading-relaxed bg-indigo-500/5 -mx-10 -mb-10 p-10 rounded-b-[2rem]">
            <div className="mt-1 p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            {getStrengthsText()}
          </div>
        </motion.div>

        {/* Line Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 glass-card space-y-10 !p-10 border-white/5 bg-slate-900/40"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Tiến độ Phát triển</h2>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Lịch sử rèn luyện gần nhất</p>
            </div>
            {submissions.length > 1 && (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                +{ (submissions[0].band - submissions[submissions.length-1].band).toFixed(1) } Band
              </div>
            )}
          </div>
          <div className="h-[320px] -mx-4 min-h-[320px]">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                    dy={15}
                  />
                  <YAxis 
                    domain={[0, 9]} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '1.25rem', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                      padding: '1rem'
                    }}
                    itemStyle={{ color: '#fff', fontWeight: 900 }}
                    labelStyle={{ color: '#64748b', marginBottom: '0.5rem', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="band" 
                    stroke="#6366f1" 
                    strokeWidth={5} 
                    dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#1e293b' }}
                    activeDot={{ r: 8, fill: '#fff', strokeWidth: 4, stroke: '#6366f1' }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>
      </div>

      {/* Recent Submissions Table */}
      {submissions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass-card !p-10 space-y-10 border-white/5 bg-slate-900/40"
        >
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Hoạt động Gần đây</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">5 bài nộp mới nhất của bạn</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Kỹ năng</th>
                  <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Điểm số</th>
                  <th className="pb-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Ngày hoàn thành</th>
                  <th className="pb-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {submissions.slice(0, 5).map((sub) => (
                  <tr key={sub.id} className="group hover:bg-white/5 transition-colors">
                    <td className="py-6 pr-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border border-white/5 shadow-inner ${
                          sub.skill === 'reading' ? 'bg-indigo-500/10 text-indigo-400' :
                          sub.skill === 'listening' ? 'bg-emerald-500/10 text-emerald-400' :
                          sub.skill === 'writing' ? 'bg-rose-500/10 text-rose-400' :
                          'bg-amber-500/10 text-amber-400'
                        }`}>
                          {sub.skill === 'reading' && <BookOpen className="w-5 h-5" />}
                          {sub.skill === 'listening' && <Headphones className="w-5 h-5" />}
                          {sub.skill === 'writing' && <PenTool className="w-5 h-5" />}
                          {sub.skill === 'speaking' && <Mic className="w-5 h-5" />}
                        </div>
                        <span className="font-black text-slate-200 capitalize tracking-tight">{sub.skill}</span>
                      </div>
                    </td>
                    <td className="py-6">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-800/50 border border-white/5 text-white font-black text-sm tabular-nums">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        {sub.band.toFixed(1)}
                      </span>
                    </td>
                    <td className="py-6 text-sm font-bold text-slate-500">
                      {new Date(sub.date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="py-6 text-right">
                      <Link 
                        href={`/${sub.skill}`}
                        className="px-6 py-2 rounded-xl bg-indigo-600/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 hover:bg-indigo-600 hover:text-white transition-all duration-300"
                      >
                        Luyện tập lại
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
