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
  { label: "Active Learners", value: "50K+", icon: Users, color: "text-indigo-600" },
  { label: "Avg Band Score", value: "7.8", icon: Award, color: "text-rose-600" },
  { label: "Success Rate", value: "96%", icon: Target, color: "text-emerald-600" },
];

const skills = [
  { 
    title: "Listening", 
    desc: "Train your ears with real exam audios. Practice conversations and academic lectures.",
    icon: Headphones,
    href: "/listening",
    color: "indigo"
  },
  { 
    title: "Reading", 
    desc: "Master academic texts with timed exercises and smart strategies that work.",
    icon: BookOpen,
    href: "/reading",
    color: "emerald"
  },
  { 
    title: "Writing", 
    desc: "Get AI feedback on Task 1 & 2. Improve grammar and coherence instantly.",
    icon: PenTool,
    href: "/writing",
    color: "rose"
  },
  { 
    title: "Speaking", 
    desc: "Record your answers and get pronunciation and fluency feedback that helps.",
    icon: Mic,
    href: "/speaking",
    color: "amber"
  },
];

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-black tracking-tighter text-indigo-600">
            IELTS SKIBIDI
          </Link>
          <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#skills" className="hover:text-slate-900 transition-colors">Skills</a>
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <Link href="/reviews" className="hover:text-slate-900 transition-colors">Reviews</Link>
            <Link href="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 hover:text-indigo-600 transition-colors">
            Log In
          </Link>
          <Link href="/dashboard" className="px-8 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all hover:-translate-y-0.5">
            Start Free 🎉
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-48 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.3em]"
            >
              <Sparkles className="w-4 h-4" />
              50,000+ Students Crushing It
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-7xl md:text-[9rem] font-black text-slate-900 tracking-tighter leading-[0.85] uppercase"
            >
              Master <br />
              <span className="text-indigo-600">IELTS.</span> <br />
              <span className="relative">
                No Cap.
                <div className="absolute -bottom-4 left-0 w-full h-4 bg-indigo-500/10 -rotate-2 -z-10" />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-slate-500 text-xl max-w-xl font-medium leading-relaxed"
            >
              Học IELTS cực cuốn, Band Score cực Skibidi! No cap! Master English with fun practice tests, AI feedback, and gamified learning.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-6"
            >
              <Link href="/dashboard" className="group px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-500/30 flex items-center gap-4 hover:-translate-y-1">
                Start Free Practice 🚀
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/dashboard" className="px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-xs border-2 border-slate-100 hover:border-slate-900 transition-all hover:-translate-y-1 shadow-sm">
                Take Mock Test
              </Link>
            </motion.div>

            <div className="grid grid-cols-3 gap-12 pt-12 border-t border-slate-100">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-1">
                  <div className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="aspect-square bg-slate-50 rounded-[4rem] relative flex items-center justify-center border border-slate-100 shadow-inner overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-500/5 via-transparent to-rose-500/5 rotate-12" />
              <div className="text-[12rem] relative z-10 animate-bounce-slow">🚀</div>
              
              {/* Floating badges */}
              <div className="absolute top-20 right-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">+1.5 Band</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Improvement</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 left-10 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 animate-float-delayed">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Expert AI</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Feedback 24/7</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-100 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
              <Target className="w-3.5 h-3.5" />
              All Four Skills
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase">Master Every Section</h2>
            <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium">
              Interactive practice for all skills with instant AI-powered feedback that actually slaps.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 space-y-8 group"
              >
                <div className={`w-16 h-16 rounded-2xl bg-${skill.color}-50 text-${skill.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                  <skill.icon className="w-8 h-8" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{skill.title}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed">{skill.desc}</p>
                </div>
                <Link href={skill.href} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 group-hover:gap-4 transition-all pt-4">
                  Start Practice <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Test Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-24 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                  Full Practice <br />
                  <span className="text-indigo-400">Tests</span>
                </h2>
                <p className="text-slate-400 text-xl font-medium leading-relaxed">
                  Experience the real deal with authentic IELTS practice tests. Timed, scored, and reviewed instantly. Get that bag! 💰
                </p>
              </div>

              <div className="space-y-6">
                {[
                  "Real Exam Conditions",
                  "Instant AI Band Scores",
                  "Detailed Performance Analytics",
                  "Vocabulary Recommendations"
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 text-white font-black uppercase tracking-[0.2em] text-[10px]">
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <Link href="/dashboard" className="group px-10 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-50 transition-all flex items-center gap-4 w-fit">
                Start Full Test Now 🎯
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Real Timing", icon: "⏱️" },
                { label: "AI Scoring", icon: "🤖" },
                { label: "Analytics", icon: "📊" },
                { label: "Feedback", icon: "📝" }
              ].map((item, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl space-y-4 hover:bg-white/10 transition-colors">
                  <div className="text-4xl">{item.icon}</div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-32 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-8">
              <Link href="/" className="text-3xl font-black tracking-tighter text-indigo-600">
                IELTS SKIBIDI
              </Link>
              <p className="text-slate-500 text-lg font-medium max-w-md leading-relaxed">
                Your ride-or-die partner for IELTS success. We help Gen Z students worldwide achieve their dream band scores with fun, engaging, and effective learning tools.
              </p>
            </div>
            
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Platform</h4>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <li><Link href="/listening" className="hover:text-indigo-600 transition-colors">Listening</Link></li>
                <li><Link href="/reading" className="hover:text-indigo-600 transition-colors">Reading</Link></li>
                <li><Link href="/writing" className="hover:text-indigo-600 transition-colors">Writing</Link></li>
                <li><Link href="/speaking" className="hover:text-indigo-600 transition-colors">Speaking</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900">Support</h4>
              <ul className="space-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <li><a href="#" className="hover:text-indigo-600 transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-600 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              © 2026 IELTS Skibidi. Made with 💜 for students worldwide.
            </div>
            <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <a href="#" className="hover:text-indigo-600">Twitter</a>
              <a href="#" className="hover:text-indigo-600">Instagram</a>
              <a href="#" className="hover:text-indigo-600">Discord</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

