'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, User, Mail, ChevronRight, Check } from 'lucide-react';
import { useUser } from '@/context/UserContext';

export default function Onboarding() {
  const { login, user, loading } = useUser();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [target, setTarget] = useState(6.5);

  if (loading || user) return null;

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else {
      login(email, name, target).then(() => {
        // After login, we can also update the target score
        // but the login mock already sets it. In a real app we'd do more.
      });
    }
  };

  const targets = [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 transition-colors">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card max-w-md w-full p-8 space-y-8 bg-white border-slate-200"
      >
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Chào mừng bạn!</h2>
          <p className="text-slate-600">Hãy cá nhân hóa trải nghiệm học tập của bạn</p>
        </div>

        <div className="flex justify-center space-x-2">
          {[1, 2].map((i) => (
            <div 
              key={i} 
              className={`h-1.5 w-8 rounded-full transition-all duration-300 ${
                step >= i ? 'bg-indigo-600' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Tên của bạn"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="Địa chỉ Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <button
                onClick={handleNext}
                disabled={!name || !email}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold disabled:opacity-50 transition-all"
              >
                Tiếp tục <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center">
                <Target className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900">Chọn Band điểm mục tiêu</h3>
                <p className="text-slate-600 text-sm">Chúng tôi sẽ điều chỉnh theo dõi tiến độ theo mục tiêu này</p>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {targets.map((val) => (
                  <button
                    key={val}
                    onClick={() => setTarget(val)}
                    className={`py-3 rounded-xl font-bold transition-all border ${
                      target === val 
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' 
                        : 'bg-white text-slate-600 border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    {val.toFixed(1)}
                  </button>
                ))}
              </div>

              <button
                onClick={handleNext}
                className="btn-primary w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all"
              >
                Bắt đầu học ngay <Check className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
