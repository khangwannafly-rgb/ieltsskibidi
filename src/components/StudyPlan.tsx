'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Headphones, PenTool, Mic, ArrowRight, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function StudyPlan() {
  const { user } = useUser();

  if (!user) return null;

  // Simple logic to suggest next task based on least practiced skill
  const skillCounts = {
    reading: user.submissions.filter(s => s.skill === 'reading').length,
    listening: user.submissions.filter(s => s.skill === 'listening').length,
    writing: user.submissions.filter(s => s.skill === 'writing').length,
    speaking: user.submissions.filter(s => s.skill === 'speaking').length,
  };

  const weakestSkill = Object.entries(skillCounts).reduce((a, b) => a[1] < b[1] ? a : b)[0] as keyof typeof skillCounts;

  const suggestions = {
    reading: {
      title: 'Luyện tập Reading',
      desc: 'Kỹ năng Đọc của bạn cần được "buff" thêm. Thử sức với bài đọc Academic ngay!',
      icon: BookOpen,
      href: '/reading',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    listening: {
      title: 'Luyện tập Listening',
      desc: 'Luyện tai với các bài nghe thực tế để không bỏ lỡ thông tin quan trọng.',
      icon: Headphones,
      href: '/listening',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    writing: {
      title: 'Luyện tập Writing',
      desc: 'Viết lách không khó với sự hỗ trợ từ AI. Thử ngay Task 2 nào!',
      icon: PenTool,
      href: '/writing',
      color: 'text-pink-500',
      bgColor: 'bg-pink-50',
    },
    speaking: {
      title: 'Luyện tập Speaking',
      desc: 'Tự tin giao tiếp như người bản xứ. Record bài nói của bạn ngay!',
      icon: Mic,
      href: '/speaking',
      color: 'text-amber-500',
      bgColor: 'bg-amber-50',
    },
  };

  const suggestion = suggestions[weakestSkill];

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl space-y-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className="w-24 h-24 text-purple-500" />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Lộ trình hôm nay</h3>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Gợi ý từ AI Skibidi</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <div className={`p-8 rounded-[2.5rem] ${suggestion.bgColor} border-2 border-white shadow-inner space-y-6`}>
          <div className="flex items-start gap-6">
            <div className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg ${suggestion.color}`}>
              <suggestion.icon className="w-8 h-8" />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{suggestion.title}</h4>
              <p className="text-slate-600 font-medium leading-relaxed">
                {suggestion.desc}
              </p>
            </div>
          </div>

          <Link href={suggestion.href}>
            <motion.button
              whileHover={{ x: 10 }}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 hover:bg-purple-600 transition-colors group"
            >
              Bắt đầu ngay
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </motion.button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-2">
            <div className="flex items-center gap-2 text-emerald-500">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Nhiệm vụ 1</span>
            </div>
            <p className="text-sm font-bold text-slate-700">Hoàn thành 1 bài luyện tập</p>
          </div>
          <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-2 opacity-50">
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
              <span className="text-[10px] font-black uppercase tracking-widest">Nhiệm vụ 2</span>
            </div>
            <p className="text-sm font-bold text-slate-500">Đạt band 7.0+ hôm nay</p>
          </div>
        </div>
      </div>
    </div>
  );
}
