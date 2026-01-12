'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ChevronRight, 
  Target, 
  Award, 
  Users, 
  TrendingUp, 
  BookOpen, 
  Headphones, 
  PenTool, 
  Mic,
  Star,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const stats = [
  { label: "Active Learners", value: "50K+", icon: Users, color: "text-purple-600" },
  { label: "Avg Band Score", value: "7.8", icon: Award, color: "text-purple-600" },
  { label: "Success Rate", value: "96%", icon: Target, color: "text-purple-600" },
];

const skills = [
  { 
    title: "Listening", 
    desc: "Train your ears with real exam audios. Practice conversations and academic lectures.",
    icon: Headphones,
    href: "/listening"
  },
  { 
    title: "Reading", 
    desc: "Master academic texts with timed exercises and smart strategies that work.",
    icon: BookOpen,
    href: "/reading"
  },
  { 
    title: "Writing", 
    desc: "Get AI feedback on Task 1 & 2. Improve grammar and coherence instantly.",
    icon: PenTool,
    href: "/writing"
  },
  { 
    title: "Speaking", 
    desc: "Record your answers and get pronunciation and fluency feedback that helps.",
    icon: Mic,
    href: "/speaking"
  },
];

export default function LandingPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 bg-gradient-purple overflow-hidden">
        {/* Floating Background Orbs */}
        <div className="absolute top-[-200px] right-[-100px] w-[600px] h-[600px] bg-white opacity-10 rounded-full animate-float"></div>
        <div className="absolute bottom-[-150px] left-[-100px] w-[400px] h-[400px] bg-white opacity-10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-black uppercase tracking-widest"
            >
              <Sparkles className="w-5 h-5" />
              50,000+ Học viên đang bứt phá
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.95]"
            >
              Lên Band <br />
              <span className="relative inline-block">
                IELTS
                <div className="absolute bottom-4 left-0 w-full h-4 bg-white/30 -rotate-2 -z-10 rounded-full" />
              </span> <br />
              Cực Skibidi! 🚀
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 text-xl max-w-xl font-medium leading-relaxed"
            >
              Học IELTS không còn nhàm chán! Trải nghiệm lộ trình học cá nhân hóa với AI, chấm điểm tức thì và giao diện cực cuốn. No cap!
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              <Link href="/dashboard" className="btn-white !px-12 !py-6 !text-sm flex items-center gap-4 group">
                Bắt đầu học ngay
                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              <Link href="/dashboard" className="px-12 py-6 rounded-full border-2 border-white text-white font-black uppercase tracking-widest text-xs hover:bg-white hover:text-purple-600 transition-all active:scale-95">
                Thi thử miễn phí
              </Link>
            </motion.div>

            <div className="grid grid-cols-3 gap-12 pt-12 border-t border-white/20">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="text-4xl font-black text-white tracking-tighter">{stat.value}</div>
                  <div className="text-[11px] font-black uppercase tracking-widest text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="aspect-square bg-white/20 backdrop-blur-[40px] rounded-[4rem] relative flex items-center justify-center border-2 border-white/30 shadow-2xl overflow-hidden animate-pulse-custom"
            >
              <div className="text-[14rem] relative z-10 drop-shadow-2xl">🚀</div>
              
              {/* Floating badges */}
              <div className="absolute top-20 right-10 bg-white p-5 rounded-3xl shadow-2xl animate-float">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <TrendingUp className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">+1.5 Band</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cải thiện</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 left-10 bg-white p-5 rounded-3xl shadow-2xl animate-float" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Star className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">AI Expert</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chấm điểm 24/7</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-40 px-6">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-gradient-purple text-white text-xs font-black uppercase tracking-widest shadow-lg shadow-purple-500/30">
              <Target className="w-4 h-4" />
              Luyện đủ 4 kỹ năng
            </div>
            <h2 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase">Làm chủ IELTS</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
              Phương pháp luyện tập hiện đại, giao diện trực quan và AI hỗ trợ tận răng giúp bạn bứt phá band điểm.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -16, scale: 1.02 }}
                className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-purple-500/20 transition-all duration-500 space-y-10 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-purple transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                
                <div className={`w-20 h-20 rounded-3xl bg-gradient-purple text-white flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform duration-500`}>
                  <skill.icon className="w-10 h-10" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight uppercase">{skill.title}</h3>
                  <p className="text-slate-500 font-medium text-base leading-relaxed">{skill.desc}</p>
                </div>
                
                <Link href={skill.href} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-purple-600 group-hover:gap-5 transition-all pt-6">
                  Luyện tập ngay <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Test CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto bg-white rounded-[5rem] p-16 md:p-32 relative overflow-hidden shadow-2xl border border-slate-100">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-purple opacity-5 pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
          
          <div className="grid lg:grid-cols-2 gap-24 items-center relative z-10">
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  Full Practice <br />
                  <span className="text-gradient">Tests</span>
                </h2>
                <p className="text-slate-500 text-xl font-bold leading-relaxed">
                  Trải nghiệm thi thử như thật với kho đề thi cập nhật liên tục. Chấm điểm AI ngay lập tức, phân tích điểm mạnh yếu để bạn về đích nhanh nhất. 💰
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Phòng thi ảo chuẩn quốc tế",
                  "Chấm điểm AI tức thì",
                  "Phân tích lỗi sai chi tiết",
                  "Gợi ý từ vựng nâng band"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-900 font-black uppercase tracking-widest text-xs">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100 shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <Link href="/dashboard" className="btn-primary !px-12 !py-6 !text-sm inline-flex items-center gap-4 group">
                Vào thi thử ngay
                <ArrowRight className="w-6 h-6 group-hover:translate-x-3 transition-transform" />
              </Link>
            </div>

            <div className="relative hidden lg:block">
              <div className="aspect-square bg-slate-50 rounded-[4rem] border border-slate-200 flex items-center justify-center animate-float shadow-inner">
                <div className="text-[15rem] drop-shadow-2xl">📝</div>
                <div className="absolute top-10 right-10 bg-gradient-purple p-8 rounded-3xl shadow-2xl -rotate-6">
                  <div className="text-white font-black text-5xl">8.5</div>
                  <div className="text-white/70 text-[10px] font-black uppercase tracking-widest">Target Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-20 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <Link href="/" className="logo text-4xl font-black inline-flex items-center gap-4">
            <span className="text-5xl">🚀</span>
            <span className="text-gradient">IELTS SKIBIDI</span>
          </Link>
          <div className="flex justify-center gap-12 text-sm font-black uppercase tracking-widest text-slate-400">
            <a href="#" className="hover:text-purple-600 transition-colors">Về chúng tôi</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Điều khoản</a>
            <a href="#" className="hover:text-purple-600 transition-colors">Bảo mật</a>
            <Link href="/reviews" className="hover:text-purple-600 transition-colors">Đánh giá</Link>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © 2026 IELTS SKIBIDI. All rights reserved. No cap, just band.
          </p>
        </div>
      </footer>
    </div>
  );
}

