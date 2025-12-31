'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@/context/UserContext";
import { LogOut, Target, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useUser();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      // Chỉ ẩn khi cuộn xuống quá 100px
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 px-4 pointer-events-none">
      <motion.nav 
        className="mx-auto max-w-6xl pointer-events-auto"
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: isVisible ? 0 : -120,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ 
          duration: 0.4,
          ease: [0.22, 1, 0.36, 1] // Custom cubic-bezier for smoother feel
        }}
      >
      <div className="glass bg-slate-900/80 border-slate-800/50 rounded-2xl px-6 h-16 flex items-center justify-between shadow-lg transition-colors duration-300">
        <Link href="/" className="text-2xl font-black tracking-tight gradient-text">
          IELTS SKIBIDI
        </Link>
        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-400">
          <Link href="/" className="hover:text-indigo-400 transition-colors">Tổng quan</Link>
          <Link href="/writing" className="hover:text-indigo-400 transition-colors">Viết</Link>
          <Link href="/reading" className="hover:text-indigo-400 transition-colors">Đọc</Link>
          <Link href="/listening" className="hover:text-indigo-400 transition-colors">Nghe</Link>
          <Link href="/speaking" className="hover:text-indigo-400 transition-colors">Nói</Link>
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
        </div>
      </div>
    </motion.nav>
    </div>
  );
}
