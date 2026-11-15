"use client";

import React, { useState } from "react";
import { Target, User, Mail, ChevronRight, Check } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function Onboarding() {
  const { login, user, loading } = useUser();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [target, setTarget] = useState(6.5);

  if (loading || user) return null;

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
    else {
      login(email.trim(), name.trim(), target);
    }
  };

  const targets = [5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="max-w-md w-full p-6 sm:p-8 space-y-6 bg-white border border-slate-200 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="IELTS SKIBIDI"
            className="w-10 h-10 rounded-lg object-cover border border-slate-200"
          />
          <div>
            <h2 className="text-lg font-bold text-slate-900">Hồ sơ thí sinh — IELTS SKIBIDI</h2>
            <p className="text-xs text-slate-500">Thiết lập mục tiêu để hệ thống điều chỉnh độ khó đề thi</p>
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Họ và tên thí sinh</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 block">Địa chỉ Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="candidate@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 focus:border-blue-600 outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleNext}
              disabled={!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <span>Tiếp tục</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-blue-700" />
                <span>Chọn Band điểm mục tiêu (Target Overall Band)</span>
              </label>
              <p className="text-xs text-slate-500">
                Độ phức tạp từ vựng và tiêu chí chấm bài sẽ được cá nhân hóa theo mức điểm này.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {targets.map((val) => (
                <button
                  key={val}
                  onClick={() => setTarget(val)}
                  className={`py-2.5 rounded-lg font-bold text-sm transition-all border ${
                    target === val
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-400"
                  }`}
                >
                  {val.toFixed(1)}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <span>Hoàn tất hồ sơ</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
