"use client";

import React from "react";
import { Calendar, Award } from "lucide-react";
import { useUser } from "@/context/UserContext";

export default function DailyStreak() {
  const { user } = useUser();

  if (!user) return null;

  const streak = user.streak || 0;
  const xp = user.xp || 0;
  const level = Math.floor(xp / 1000) + 1;
  const nextLevelXP = level * 1000;
  const currentLevelXP = (level - 1) * 1000;
  const progress = Math.min(100, Math.max(0, ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Study Consistency Card */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-800">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Chuỗi ngày luyện tập liên tục
              </h3>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 tabular-nums">{streak}</span>
                <span className="text-xs font-semibold text-slate-500">ngày liên tiếp</span>
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500">7 ngày qua</span>
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-7 gap-1.5">
            {[...Array(7)].map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - (6 - i));
              const isPracticed = user.submissions.some(
                (s) => new Date(s.date).toDateString() === date.toDateString()
              );
              const dayLabel = date.toLocaleDateString("vi-VN", { weekday: "short" });

              return (
                <div key={i} className="text-center space-y-1">
                  <div
                    className={`h-2 rounded-sm transition-colors ${
                      isPracticed ? "bg-blue-700" : "bg-slate-100 border border-slate-200"
                    }`}
                    title={date.toLocaleDateString("vi-VN")}
                  />
                  <span className="text-[10px] font-medium text-slate-400 block">{dayLabel}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Academic Progress & Study Points */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col justify-between gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Điểm tích lũy học thuật
              </h3>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold text-slate-900 tabular-nums">{xp}</span>
                <span className="text-xs font-semibold text-slate-500">pts · Cấp độ {level}</span>
              </div>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
            {user.submissions.length} bài đã nộp
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-slate-500">
            <span>Tiến độ cấp độ {level}</span>
            <span>{nextLevelXP - xp} pts tới cấp {level + 1}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-slate-900 rounded-full transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
