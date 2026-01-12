'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Zap, Trophy, Star } from 'lucide-react';
import { useUser } from '@/context/UserContext';

export default function DailyStreak() {
  const { user } = useUser();
  
  if (!user) return null;

  const streak = user.streak || 0;
  const xp = user.xp || 0;
  const level = Math.floor(xp / 1000) + 1;
  const nextLevelXP = level * 1000;
  const currentLevelXP = (level - 1) * 1000;
  const progress = ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Streak Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[2.5rem] border-4 border-orange-100 shadow-xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Flame className="w-24 h-24 text-orange-500" />
        </div>
        
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-orange-100 rounded-[1.5rem] flex items-center justify-center">
            <Flame className={`w-12 h-12 ${streak > 0 ? 'text-orange-600 animate-pulse' : 'text-orange-300'}`} />
          </div>
          <div>
            <h3 className="text-slate-500 font-black uppercase tracking-wider text-sm">Chuỗi ngày học</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-slate-900 tracking-tighter">{streak}</span>
              <span className="text-xl font-bold text-slate-400">ngày</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex gap-2">
          {[...Array(7)].map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            const isPracticed = user.submissions.some(s => 
              new Date(s.date).toDateString() === date.toDateString()
            );
            
            return (
              <div 
                key={i}
                className={`flex-1 h-3 rounded-full transition-all duration-500 ${
                  isPracticed ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]' : 'bg-slate-100'
                }`}
                title={date.toLocaleDateString()}
              />
            );
          })}
        </div>
        <p className="mt-4 text-slate-500 font-medium text-sm">
          {streak > 0 
            ? "Đỉnh nóc, kịch trần! Giữ vững phong độ nhé! 🔥" 
            : "Bắt đầu chuỗi ngày học ngay hôm nay thôi nào! 🚀"}
        </p>
      </motion.div>

      {/* XP & Level Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-8 rounded-[2.5rem] border-4 border-purple-100 shadow-xl relative overflow-hidden group"
      >
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
          <Star className="w-24 h-24 text-purple-500" />
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <div className="w-20 h-20 bg-purple-100 rounded-[1.5rem] flex items-center justify-center relative">
            <Zap className="w-12 h-12 text-purple-600" />
            <div className="absolute -top-2 -right-2 bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm border-4 border-white">
              {level}
            </div>
          </div>
          <div>
            <h3 className="text-slate-500 font-black uppercase tracking-wider text-sm">Kinh nghiệm (XP)</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-6xl font-black text-slate-900 tracking-tighter">{xp}</span>
              <span className="text-xl font-bold text-slate-400">XP</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between text-sm font-black text-slate-400 uppercase tracking-widest mb-2">
            <span>Level {level}</span>
            <span>Level {level + 1}</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden p-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
            />
          </div>
          <p className="mt-3 text-slate-500 font-medium text-sm">
            Còn <span className="text-purple-600 font-black">{nextLevelXP - xp} XP</span> nữa để lên cấp. No cap! ✨
          </p>
        </div>
      </motion.div>
    </div>
  );
}
