'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Headphones, Book, PenTool, Mic, Flame, Star, Trophy, Crown, CheckCircle2, Zap, Lock, X, Sparkles
} from 'lucide-react';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  glowColor: string;
  unlocked: boolean;
  category: string;
}

const BADGES: Badge[] = [
  {
    id: 'listening-master',
    name: 'Listening Master',
    description: 'Chinh phục mọi giọng đọc! Đạt điểm tuyệt đối trong 5 bài nghe liên tiếp.',
    icon: Headphones,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    glowColor: 'shadow-purple-400/50',
    unlocked: true,
    category: 'Skill'
  },
  {
    id: 'reading-wizard',
    name: 'Reading Wizard',
    description: 'Đọc nhanh như chớp! Hoàn thành bài Reading trong dưới 40 phút.',
    icon: Book,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    glowColor: 'shadow-blue-400/50',
    unlocked: true,
    category: 'Skill'
  },
  {
    id: 'writing-pro',
    name: 'Writing Pro',
    description: 'Bậc thầy ngôn từ! AI đánh giá Lexical Resource đạt 8.5+.',
    icon: PenTool,
    color: 'text-pink-500',
    bgColor: 'bg-pink-100',
    glowColor: 'shadow-pink-400/50',
    unlocked: false,
    category: 'Skill'
  },
  {
    id: 'speaking-star',
    name: 'Speaking Star',
    description: 'Tự tin tỏa sáng! Luyện tập Speaking hơn 60 phút mỗi tuần.',
    icon: Mic,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
    glowColor: 'shadow-yellow-400/50',
    unlocked: true,
    category: 'Skill'
  },
  {
    id: 'streak-7',
    name: '7-Day Streak',
    description: 'Nỗ lực không ngừng! Duy trì việc học trong 7 ngày liên tiếp.',
    icon: Flame,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    glowColor: 'shadow-orange-400/50',
    unlocked: true,
    category: 'Streak'
  },
  {
    id: 'streak-30',
    name: '30-Day Legend',
    description: 'Huyền thoại Skibidi! 30 ngày học tập không nghỉ một giây.',
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    glowColor: 'shadow-red-500/50',
    unlocked: false,
    category: 'Streak'
  },
  {
    id: 'band-6.5',
    name: 'Band 6.5 Achieved',
    description: 'Cột mốc đầu tiên! Đạt tổng điểm 6.5 trong bài thi thử.',
    icon: Star,
    color: 'text-cyan-500',
    bgColor: 'bg-cyan-100',
    glowColor: 'shadow-cyan-400/50',
    unlocked: true,
    category: 'Milestone'
  },
  {
    id: 'band-7.0',
    name: 'Band 7.0 Warrior',
    description: 'Chiến binh IELTS! Vượt ngưỡng 7.0 đầy ấn tượng.',
    icon: Trophy,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100',
    glowColor: 'shadow-amber-400/50',
    unlocked: false,
    category: 'Milestone'
  },
  {
    id: 'band-8.0',
    name: 'Band 8.0 Elite',
    description: 'Đẳng cấp tinh hoa! Gia nhập câu lạc bộ 8.0 siêu hiếm.',
    icon: Crown,
    color: 'text-purple-600',
    bgColor: 'bg-purple-200',
    glowColor: 'shadow-purple-500/50',
    unlocked: false,
    category: 'Milestone'
  },
  {
    id: 'first-mock',
    name: 'First Blood',
    description: 'Vạn sự khởi đầu nan! Hoàn thành bài thi thử (Mock Test) đầu tiên.',
    icon: CheckCircle2,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100',
    glowColor: 'shadow-emerald-400/50',
    unlocked: true,
    category: 'General'
  },
  {
    id: 'daily-hero',
    name: 'Daily Hero',
    description: 'Siêu anh hùng mỗi ngày! Hoàn thành tất cả nhiệm vụ trong ngày.',
    icon: Zap,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-50',
    glowColor: 'shadow-yellow-300/50',
    unlocked: false,
    category: 'General'
  }
];

export default function BadgeSection() {
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
            Hệ thống Huy hiệu
            <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
          </h3>
          <p className="text-[12px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Thu thập sticker - Khẳng định đẳng cấp Gen Z
          </p>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {BADGES.map((badge) => (
          <motion.div
            key={badge.id}
            whileHover={{ 
              scale: 1.1,
              rotate: badge.unlocked ? [0, -5, 5, 0] : 0,
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedBadge(badge)}
            className={`
              relative aspect-square rounded-[2.5rem] flex flex-col items-center justify-center cursor-pointer
              transition-all duration-500 border-4
              ${badge.unlocked 
                ? `${badge.bgColor} border-white shadow-xl ${badge.glowColor} hover:shadow-2xl` 
                : 'bg-slate-100 border-slate-200 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
              }
            `}
          >
            {/* Sparkle effects for unlocked badges */}
            {badge.unlocked && (
              <motion.div
                animate={{ opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-4 right-4 text-white"
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            )}

            <div className={`
              w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-3xl
              ${badge.unlocked ? 'bg-white shadow-inner' : 'bg-slate-200'}
            `}>
              <badge.icon className={`w-10 h-10 sm:w-12 sm:h-12 ${badge.unlocked ? badge.color : 'text-slate-400'}`} />
            </div>

            {!badge.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/10 rounded-[2.5rem]">
                <div className="bg-white/90 p-2 rounded-xl shadow-lg">
                  <Lock className="w-5 h-5 text-slate-600" />
                </div>
              </div>
            )}
            
            {/* Badge Outline/Border for Pixel Art Vibe */}
            <div className="absolute inset-0 rounded-[2.5rem] border-[3px] border-black/5 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      {/* Badge Details Modal */}
      <AnimatePresence>
        {selectedBadge && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedBadge(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className={`
                relative w-full max-w-md bg-white rounded-[3.5rem] shadow-2xl overflow-hidden border-8 border-white
                ${selectedBadge.unlocked ? '' : 'grayscale-[0.5]'}
              `}
            >
              {/* Modal Header/Background */}
              <div className={`h-40 w-full relative flex items-center justify-center ${selectedBadge.bgColor}`}>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute w-64 h-64 bg-white/20 rounded-full blur-3xl"
                />
                
                <div className={`
                  w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center relative z-10
                  ${selectedBadge.unlocked ? 'animate-bounce' : ''}
                `}>
                  <selectedBadge.icon className={`w-14 h-14 ${selectedBadge.color}`} />
                </div>
                
                <button 
                  onClick={() => setSelectedBadge(null)}
                  className="absolute top-6 right-6 p-2 bg-white/50 hover:bg-white rounded-2xl transition-colors z-20"
                >
                  <X className="w-6 h-6 text-slate-900" />
                </button>
              </div>

              <div className="p-10 space-y-6 text-center">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedBadge.bgColor} ${selectedBadge.color}`}>
                      {selectedBadge.category}
                    </span>
                    {selectedBadge.unlocked ? (
                      <span className="bg-emerald-100 text-emerald-600 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                        Unlocked
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    )}
                  </div>
                  <h4 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
                    {selectedBadge.name}
                  </h4>
                </div>

                <p className="text-slate-600 font-medium text-lg leading-relaxed">
                  {selectedBadge.description}
                </p>

                {selectedBadge.unlocked ? (
                  <div className="pt-4">
                    <div className="bg-purple-50 p-6 rounded-3xl border border-purple-100 inline-block">
                      <p className="text-purple-600 font-black text-sm uppercase tracking-widest">
                        🎉 Đã thu thập vào bộ sưu tập!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4">
                    <button className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-purple-600 transition-colors shadow-xl shadow-purple-500/20">
                      Luyện tập ngay để mở khóa
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
