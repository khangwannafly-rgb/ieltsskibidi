"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { LogOut, Target, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useUser();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/dashboard", label: "Bảng điều khiển" },
    { href: "/reading", label: "Reading" },
    { href: "/listening", label: "Listening" },
    { href: "/writing", label: "Writing" },
    { href: "/speaking", label: "Speaking" },
    { href: "/vocabulary", label: "Từ vựng C1–C2" },
    { href: "/reviews", label: "Kết quả học viên" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="mx-auto max-w-7xl h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="IELTS SKIBIDI"
            className="w-9 h-9 rounded-lg object-cover border border-slate-200 shadow-xs"
          />
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
              IELTS SKIBIDI
            </span>
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mt-0.5">
              Cambridge Test Prep
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-slate-900 leading-tight">{user.name}</span>
                <span className="text-[11px] flex items-center gap-1 text-blue-700 font-semibold">
                  <Target className="w-3 h-3" /> Target Band {(user.targetScore ?? 6.5).toFixed(1)}
                </span>
              </div>
              <div className="relative group">
                <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center text-white font-bold text-sm cursor-pointer">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl p-1.5 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all shadow-lg z-50">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Thí sinh</p>
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Đăng nhập
              </Link>
              <Link href="/dashboard" className="btn-primary !py-2 !px-4 !text-xs">
                Vào phòng luyện thi
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                pathname === link.href ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
