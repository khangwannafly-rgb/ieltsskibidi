'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Headphones, Book, PenTool, Mic, Flame, Star, Trophy, Crown, CheckCircle2, Zap, Lock, X, Sparkles, Moon, Sun
} from 'lucide-react';
import { useUser } from '@/context/UserContext';

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
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Cú đêm chăm chỉ! Hoàn thành bài học sau 10 giờ tối.',
    icon: Moon,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
    glowColor: 'shadow-indigo-400/50',
    unlocked: false,
    category: 'Lifestyle'
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Dậy sớm để thành công! Hoàn thành bài học trước 6 giờ sáng.',
    icon: Sun,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100',
    glowColor: 'shadow-amber-400/50',
    unlocked: false,
    category: 'Lifestyle'
  },
];

export default function BadgeSection() {
  const { user } = useUser();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  // Calculate unlocked status based on user data
  const processedBadges = BADGES.map(badge => {
    let isUnlocked = false;
    
    if (!user) return { ...badge, unlocked: false };
    
    // Check if badge is already unlocked in user profile
    if (user.badges?.includes(badge.id)) return { ...badge, unlocked: true };

    // Logic for checking unlock conditions based on user stats
    switch (badge.id) {
      case 'streak-7':
        isUnlocked = (user.streak || 0) >= 7;
        break;
      case 'streak-30':
        isUnlocked = (user.streak || 0) >= 30;
        break;
      case 'band-6.5':
        const avgBand = user.submissions.length > 0 
          ? user.submissions.reduce((acc, sub) => acc + sub.band, 0) / user.submissions.length 
          : 0;
        isUnlocked = avgBand >= 6.5;
        break;
      case 'band-7.0':
        const avgBand7 = user.submissions.length > 0 
          ? user.submissions.reduce((acc, sub) => acc + sub.band, 0) / user.submissions.length 
          : 0;
        isUnlocked = avgBand7 >= 7.0;
        break;
      // Add more conditions here as needed
      default:
        isUnlocked = badge.unlocked; // Fallback to default state
    }

    return { ...badge, unlocked: isUnlocked };
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Bộ sưu tập huy hiệu</h3>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Sưu tầm: {processedBadges.filter(b => b.unlocked).length}/{processedBadges.length}</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-500 flex items-center justify-center">
          <Trophy className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        {processedBadges.map((badge) => (
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
            <div className={`
              ${badge.unlocked ? badge.color : 'text-slate-400'}
              transition-colors duration-300
            `}>
              <badge.icon className="w-8 h-8" strokeWidth={2.5} />
            </div>
            
            {!badge.unlocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-100/50 backdrop-blur-[1px] rounded-[2.3rem]">
                <Lock className="w-6 h-6 text-slate-400" />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-[3rem] shadow-2xl max-w-sm w-full relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedBadge(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className={`
                  w-32 h-32 rounded-full flex items-center justify-center
                  ${selectedBadge.unlocked ? selectedBadge.bgColor : 'bg-slate-100'}
                  mb-2 relative
                `}>
                  <selectedBadge.icon className={`w-16 h-16 ${selectedBadge.unlocked ? selectedBadge.color : 'text-slate-400'}`} />
                  {selectedBadge.unlocked && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-4 border-dashed border-current opacity-30 rounded-full"
                      style={{ color: 'currentColor' }} 
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">{selectedBadge.name}</h3>
                  <div className={`
                    inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest
                    ${selectedBadge.unlocked ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}
                  `}>
                    {selectedBadge.unlocked ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Đã mở khóa
                      </>
                    ) : (
                      <>
                        <Lock className="w-3 h-3" />
                        Chưa mở khóa
                      </>
                    )}
                  </div>
                </div>

                <p className="text-slate-500 font-medium leading-relaxed">
                  {selectedBadge.description}
                </p>

                {!selectedBadge.unlocked && (
                  <div className="w-full p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Tiếp tục cố gắng nhé! 🚀
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
