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
        className="mx-auto max-w-7xl pointer-events-auto"
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
        <div className="glass rounded-[2rem] px-8 h-20 flex items-center justify-between transition-all duration-300">
          <Link href="/" className="logo text-3xl font-black flex items-center gap-3">
            <span className="text-4xl">🚀</span>
            <span className="text-gradient">IELTS SKIBIDI</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-10 items-center">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href} 
                className="relative py-2 text-[15px] font-bold text-slate-500 hover:text-purple-600 transition-all group"
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-purple rounded-full transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end mr-2">
                  <span className="text-sm font-bold text-slate-900">{user.name}</span>
                  <span className="text-[11px] flex items-center gap-1 text-purple-600 font-extrabold uppercase tracking-wider">
                    <Target className="w-3 h-3" /> Mục tiêu: {user.targetScore.toFixed(1)}
                  </span>
                </div>
                <div className="relative group">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-purple shadow-lg border-2 border-white flex items-center justify-center text-white font-black text-lg cursor-pointer transition-transform hover:scale-110 active:scale-95">
                    {user.name.charAt(0)}
                  </div>
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-slate-100 rounded-2xl p-2 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all shadow-2xl z-50">
                    <div className="px-4 py-3 border-bottom border-slate-50 mb-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tài khoản</p>
                      <p className="text-sm font-black text-slate-900 truncate">{user.name}</p>
                    </div>
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                    >
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/dashboard" className="px-6 py-3 text-sm font-bold text-purple-600 hover:bg-purple-50 rounded-full transition-all">
                  Đăng nhập
                </Link>
                <Link href="/dashboard" className="btn-primary !py-3 !px-6 text-sm">
                  Bắt đầu ngay
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-3 text-slate-500 hover:text-purple-600 bg-slate-50 rounded-2xl transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden mt-4 mx-auto max-w-7xl pointer-events-auto"
          >
            <div className="glass rounded-[2rem] p-6 shadow-2xl">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-6 py-4 rounded-2xl font-bold text-slate-600 hover:bg-purple-50 hover:text-purple-600 transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="btn-primary text-center mt-2"
                  >
                    Bắt đầu ngay
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
