'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { LogOut, Target, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useUser();
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const diff = latest - previous;
    
    // Ẩn khi cuộn xuống quá 100px và có độ lệch cuộn > 5px
    if (latest > 100 && diff > 5) {
      setIsVisible(false);
      setIsMobileMenuOpen(false); // Tự động đóng menu mobile khi cuộn xuống
    } 
    // Hiện khi cuộn lên hoặc khi ở gần đỉnh trang
    else if (diff < -5 || latest < 10) {
      setIsVisible(true);
    }
  });

  const navLinks = [
    { href: "/", label: "Tổng quan" },
    { href: "/writing", label: "Viết" },
    { href: "/reading", label: "Đọc" },
    { href: "/listening", label: "Nghe" },
    { href: "/speaking", label: "Nói" },
    { href: "/reviews", label: "Đánh giá" },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] pt-4 px-4 pointer-events-none">
      <motion.nav 
        className="mx-auto max-w-6xl pointer-events-auto"
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: isVisible ? 0 : -120,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ 
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1]
        }}
      >
        <div className="glass bg-slate-900/90 border-slate-800/50 rounded-2xl px-6 h-16 flex items-center justify-between shadow-2xl backdrop-blur-xl transition-all duration-300">
          <Link href="/" className="text-2xl font-black tracking-tight gradient-text hover:scale-105 transition-transform">
            IELTS SKIBIDI
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 text-sm font-bold text-slate-400">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-indigo-400 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-xs font-bold text-white">{user.name}</span>
                  <span className="text-[10px] flex items-center gap-1 text-indigo-400 font-bold uppercase tracking-wider">
                    <Target className="w-2.5 h-2.5" /> Mục tiêu: {user.targetScore.toFixed(1)}
                  </span>
                </div>
                <div className="relative group">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md border-2 border-slate-800 flex items-center justify-center text-white font-bold cursor-pointer">
                    {user.name.charAt(0)}
                  </div>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all shadow-xl z-50">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-9 w-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400">
                <User className="w-5 h-5" />
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Content */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-full left-0 right-0 mt-2 mx-auto max-w-6xl pointer-events-auto"
            >
              <div className="glass-premium bg-slate-950/90 border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 backdrop-blur-2xl">
                {navLinks.map((link) => (
                  <Link 
                    key={link.href} 
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-6 py-4 rounded-2xl hover:bg-white/5 text-slate-300 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all border border-transparent hover:border-white/5"
                  >
                    {link.label}
                  </Link>
                ))}
                {user && (
                  <button 
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-6 py-4 text-rose-400 font-black uppercase tracking-widest text-[10px] hover:bg-rose-500/10 rounded-2xl transition-all border border-transparent hover:border-rose-500/20"
                  >
                    <LogOut className="w-4 h-4" /> Đăng xuất
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
