"use client";

import React from "react";
import {
  Headphones,
  Book,
  PenTool,
  Mic,
  Flame,
  Star,
  Trophy,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

interface Milestone {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: string;
}

const MILESTONES: Milestone[] = [
  {
    id: "band-6.5",
    name: "Competent User (Band 6.5+)",
    description: "Đạt Band 6.5 trở lên trong một bài thi thực hành bất kỳ.",
    icon: Star,
    category: "Academic",
  },
  {
    id: "band-7.0",
    name: "Good User (Band 7.0+)",
    description: "Chinh phục mốc Band 7.0 chuẩn đầu vào đại học quốc tế.",
    icon: Trophy,
    category: "Academic",
  },
  {
    id: "reading-wizard",
    name: "Academic Reader",
    description: "Hoàn thành bài thi Reading đạt từ Band 7.5 trở lên.",
    icon: Book,
    category: "Skill",
  },
  {
    id: "listening-master",
    name: "Active Listener",
    description: "Đạt điểm tối đa hoặc Band 8.5+ trong 5 bài thi Listening.",
    icon: Headphones,
    category: "Skill",
  },
  {
    id: "writing-pro",
    name: "Analytical Writer",
    description: "Đạt điểm tiêu chí Lexical Resource hoặc Overall Writing từ 8.0+.",
    icon: PenTool,
    category: "Skill",
  },
  {
    id: "speaking-star",
    name: "Articulate Speaker",
    description: "Hoàn thành tối thiểu 10 phiên thi mô phỏng Speaking.",
    icon: Mic,
    category: "Skill",
  },
  {
    id: "streak-7",
    name: "7-Day Consistency",
    description: "Duy trì kỷ luật luyện thi liên tục trong 7 ngày.",
    icon: Flame,
    category: "Consistency",
  },
  {
    id: "streak-30",
    name: "30-Day Dedication",
    description: "Duy trì kỷ luật luyện thi liên tục trong 30 ngày.",
    icon: Flame,
    category: "Consistency",
  },
];

export default function BadgeSection() {
  const { user } = useUser();
  const submissions = user?.submissions || [];
  const avgBand =
    submissions.length > 0
      ? submissions.reduce((acc, sub) => acc + sub.band, 0) / submissions.length
      : 0;

  const processed = MILESTONES.map((m) => {
    if (!user) return { ...m, unlocked: false };
    if (user.badges?.includes(m.id)) return { ...m, unlocked: true };

    let unlocked = false;
    switch (m.id) {
      case "listening-master": {
        const subs = submissions.filter((s) => s.skill === "listening");
        unlocked =
          subs.filter(
            (s) =>
              s.band >= 8.5 ||
              (s.details?.totalQuestions && s.details?.rawScore === s.details?.totalQuestions)
          ).length >= 5;
        break;
      }
      case "reading-wizard": {
        const subs = submissions.filter((s) => s.skill === "reading");
        unlocked = subs.some((s) => s.band >= 7.5);
        break;
      }
      case "writing-pro": {
        const subs = submissions.filter((s) => s.skill === "writing");
        unlocked = subs.some(
          (s) => (s.details?.criteria_scores?.lexical_resource ?? 0) >= 8.0 || s.band >= 8.0
        );
        break;
      }
      case "speaking-star": {
        const subs = submissions.filter((s) => s.skill === "speaking");
        unlocked = subs.length >= 10;
        break;
      }
      case "streak-7":
        unlocked = (user.streak || 0) >= 7;
        break;
      case "streak-30":
        unlocked = (user.streak || 0) >= 30;
        break;
      case "band-6.5":
        unlocked = submissions.length > 0 && (avgBand >= 6.5 || submissions.some((s) => s.band >= 6.5));
        break;
      case "band-7.0":
        unlocked = submissions.length > 0 && (avgBand >= 7.0 || submissions.some((s) => s.band >= 7.0));
        break;
      default:
        unlocked = false;
    }
    return { ...m, unlocked };
  });

  const unlockedCount = processed.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Cột mốc học thuật (Academic Milestones)</h3>
          <p className="text-slate-500 text-xs">
            Đã đạt được {unlockedCount} / {processed.length} chứng nhận năng lực
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {processed.map((m) => (
          <div
            key={m.id}
            className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
              m.unlocked
                ? "bg-blue-50/40 border-blue-200 text-slate-900"
                : "bg-slate-50/70 border-slate-200 text-slate-500 opacity-75"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                m.unlocked ? "bg-slate-900 text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              <m.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-slate-900 truncate">{m.name}</h4>
                {m.unlocked ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">{m.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
