"use client";

import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { 
  BookOpen, Headphones, PenTool, Mic, ArrowRight, Zap, Target, TrendingUp, Star, Award, Shield, Flame, CheckCircle
} from 'lucide-react';

const badges = [
  { id: 'streak', name: '7 Ngày Bất Bại', icon: Flame, color: 'text-orange-500', bgColor: 'bg-orange-50', desc: 'Duy trì học tập 7 ngày liên tiếp' },
  { id: 'top-reading', name: 'Thánh Đọc', icon: BookOpen, color: 'text-purple-600', bgColor: 'bg-purple-50', desc: 'Đạt Band 8.0+ kỹ năng Đọc' },
  { id: 'pro-writer', name: 'Cây Bút Trẻ', icon: PenTool, color: 'text-blue-500', bgColor: 'bg-blue-50', desc: 'Hoàn thành 10 bài viết Task 2' },
  { id: 'speaker', name: 'Diễn Thuyết Gia', icon: Mic, color: 'text-rose-500', bgColor: 'bg-rose-50', desc: 'Luyện Speaking hơn 60 phút' },
];
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
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50',
    borderColor: 'group-hover:border-purple-500/30',
    href: '/reading',
    desc: 'Luyện tập với các đoạn văn học thuật và các dạng câu hỏi thực tế.'
  },
  { 
    name: 'Kỹ năng Nghe', 
    icon: Headphones, 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50',
    borderColor: 'group-hover:border-purple-500/30',
    href: '/listening',
    desc: 'Cải thiện kỹ năng nghe với nhiều giọng đọc và tốc độ khác nhau.'
  },
  { 
    name: 'Kỹ năng Viết', 
    icon: PenTool, 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50',
    borderColor: 'group-hover:border-purple-500/30',
    href: '/writing',
    desc: 'Hoàn thiện cấu trúc bài viết Task 1 & 2 với sự hỗ trợ từ AI.'
  },
  { 
    name: 'Kỹ năng Nói', 
    icon: Mic, 
    color: 'text-purple-600', 
    bgColor: 'bg-purple-50',
    borderColor: 'group-hover:border-purple-500/30',
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
    <div className="bg-[#F9FAFB] min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Welcome Header */}
        {user && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-8"
          >
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-3xl bg-gradient-purple flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-purple-500/20">
                {user.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">Chào mừng trở lại, {user.name}! 👋</h2>
                <p className="text-slate-500 font-medium text-lg">Hôm nay bạn muốn bứt phá kỹ năng nào?</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
              <div className="px-6 py-3 bg-purple-50 rounded-2xl border border-purple-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Mục tiêu</p>
                <p className="text-2xl font-black text-purple-600">{targetBand.toFixed(1)}</p>
              </div>
              <div className="px-6 py-3 bg-purple-50 rounded-2xl border border-purple-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Hiện tại</p>
                <p className="text-2xl font-black text-purple-600">{currentBand.toFixed(1)}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Hero Dashboard Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Chart Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Tiến trình học tập</h3>
                  <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Phân tích 5 bài gần nhất</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                        dy={10}
                      />
                      <YAxis 
                        domain={[0, 9]} 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700 }}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '15px' }}
                        itemStyle={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '10px' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="band" 
                        stroke="#8B5CF6" 
                        strokeWidth={5} 
                        dot={{ r: 8, fill: '#8B5CF6', strokeWidth: 4, stroke: '#fff' }}
                        activeDot={{ r: 10, fill: '#EC4899', strokeWidth: 4, stroke: '#fff' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Quick Skills Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {skills.map((skill, i) => (
                <Link key={i} href={skill.href} className="group">
                  <motion.div 
                    whileHover={{ y: -8 }}
                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 text-center space-y-4"
                  >
                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-purple text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform`}>
                      <skill.icon className="w-8 h-8" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-purple-600 transition-colors">{skill.name}</div>
                  </motion.div>
                </Link>
              ))}
            </div>

            {/* Badges Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-10"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Huy hiệu thành tích</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mở khóa các cột mốc quan trọng</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {badges.map((badge, i) => {
                  const isUnlocked = i < 2; // Mock: first two badges unlocked
                  return (
                    <div 
                      key={badge.id}
                      className={`relative p-6 rounded-[2rem] border transition-all duration-500 group ${
                        isUnlocked 
                        ? 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-purple-500/10' 
                        : 'bg-slate-50/50 border-slate-100 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          isUnlocked ? `${badge.bgColor} ${badge.color} group-hover:scale-110 group-hover:rotate-6` : 'bg-slate-200 text-slate-400'
                        }`}>
                          <badge.icon className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                          <h4 className={`text-sm font-black uppercase tracking-tight ${isUnlocked ? 'text-slate-900' : 'text-slate-400'}`}>
                            {badge.name}
                          </h4>
                          <p className="text-[10px] font-medium text-slate-500 leading-tight">
                            {badge.desc}
                          </p>
                        </div>
                      </div>
                      {!isUnlocked && (
                        <div className="absolute top-4 right-4">
                          <Shield className="w-4 h-4 text-slate-300" />
                        </div>
                      )}
                      {isUnlocked && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="w-4 h-4 text-purple-600" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar Analysis Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Radar Chart */}
            <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Phân tích kỹ năng</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Điểm mạnh & Điểm yếu</p>
              </div>

              <div className="h-[250px] w-full">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={descriptorData}>
                      <PolarGrid stroke="#f1f5f9" />
                      <PolarAngleAxis 
                        dataKey="subject" 
                        tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
                      />
                      <Radar
                        name="Kỹ năng"
                        dataKey="A"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.15}
                        strokeWidth={4}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-purple-600" />
                  <span className="text-xs font-black text-purple-600 uppercase tracking-widest">AI Nhận xét</span>
                </div>
                <p className="text-slate-600 text-sm font-bold leading-relaxed">
                  {getStrengthsText()}
                </p>
              </div>
            </div>

            {/* Target Progress */}
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[60px] rounded-full" />
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Mục tiêu Band {targetBand.toFixed(1)}</h3>
                  <div className="text-purple-600 font-black text-2xl">{Math.round(progressPercent)}%</div>
                </div>
                
                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-purple shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                  />
                </div>
                
                <p className="text-slate-500 text-xs font-bold leading-relaxed">
                  Bạn chỉ còn cách mục tiêu <span className="text-purple-600 font-black">{(targetBand - currentBand).toFixed(1)} band</span> nữa thôi. Cố lên, no cap! 🚀
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="pt-20 border-t border-slate-100 text-center space-y-6">
          <Link href="/" className="logo text-3xl font-black inline-flex items-center gap-3">
            <span className="text-4xl">🚀</span>
            <span className="text-gradient">IELTS SKIBIDI</span>
          </Link>
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
            © 2026 IELTS SKIBIDI. All rights reserved. No cap, just band.
          </p>
        </footer>
      </div>
    </div>
  );
}
