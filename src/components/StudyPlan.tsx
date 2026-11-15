"use client";

import React from "react";
import { BookOpen, Headphones, PenTool, Mic, ArrowRight, Target, CheckCircle2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

export default function StudyPlan() {
  const { user } = useUser();

  if (!user) return null;

  const skillCounts = {
    reading: user.submissions.filter((s) => s.skill === "reading").length,
    listening: user.submissions.filter((s) => s.skill === "listening").length,
    writing: user.submissions.filter((s) => s.skill === "writing").length,
    speaking: user.submissions.filter((s) => s.skill === "speaking").length,
  };

  const weakestSkill = Object.entries(skillCounts).reduce((a, b) =>
    a[1] < b[1] ? a : b
  )[0] as keyof typeof skillCounts;

  const suggestions = {
    reading: {
      title: "Academic Reading Practice",
      desc: "Bạn có ít bài luyện Reading nhất. Hãy hoàn thành 1 bài đọc 13 câu để cân bằng 4 kỹ năng.",
      icon: BookOpen,
      href: "/reading",
    },
    listening: {
      title: "IELTS Listening Practice",
      desc: "Luyện tập nghe hiểu và điền từ chính xác với các bài hội thoại và bài giảng học thuật.",
      icon: Headphones,
      href: "/listening",
    },
    writing: {
      title: "Academic Writing Task 1 & 2",
      desc: "Rèn luyện phân tích số liệu biểu đồ và viết bài luận học thuật 250+ từ theo 4 tiêu chí.",
      icon: PenTool,
      href: "/writing",
    },
    speaking: {
      title: "Speaking Examiner Simulation",
      desc: "Thực hành trả lời phỏng vấn Part 1, trình bày Cue Card Part 2 và thảo luận học thuật Part 3.",
      icon: Mic,
      href: "/speaking",
    },
  };

  const suggestion = suggestions[weakestSkill];
  const todayStr = new Date().toDateString();
  const todaySubmissions = user.submissions.filter(
    (s) => new Date(s.date).toDateString() === todayStr
  );
  const completedTask1 = todaySubmissions.length >= 1;
  const completedTask2 = todaySubmissions.some((s) => s.band >= (user.targetScore || 6.5));

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Kế hoạch học tập hôm nay</h3>
          <p className="text-slate-500 text-xs">Đề xuất dựa trên lịch sử làm bài của bạn</p>
        </div>
        <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
          <Target className="w-4 h-4" />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
            <suggestion.icon className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900">{suggestion.title}</h4>
            <p className="text-slate-600 text-xs leading-relaxed">{suggestion.desc}</p>
          </div>
        </div>

        <Link
          href={suggestion.href}
          className="w-full py-2.5 bg-slate-900 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <span>Bắt đầu bài luyện tập</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Mục tiêu trong ngày
        </span>
        <div className="grid grid-cols-1 gap-2">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 ${completedTask1 ? "text-emerald-600" : "text-slate-300"}`}
              />
              <span className="text-xs font-medium text-slate-700">Hoàn thành ít nhất 1 đề thi thử</span>
            </div>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                completedTask1 ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-600"
              }`}
            >
              {completedTask1 ? "Hoàn thành" : "Chưa xong"}
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2
                className={`w-4 h-4 ${completedTask2 ? "text-emerald-600" : "text-slate-300"}`}
              />
              <span className="text-xs font-medium text-slate-700">
                Đạt mục tiêu Band {(user.targetScore || 6.5).toFixed(1)}+ trong ngày
              </span>
            </div>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                completedTask2 ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-600"
              }`}
            >
              {completedTask2 ? "Hoàn thành" : "Đang phấn đấu"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
