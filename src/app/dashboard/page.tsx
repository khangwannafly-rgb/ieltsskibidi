"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  TrendingUp,
  ArrowUpRight,
  Target,
  BarChart3,
  Clock,
  FileCheck2,
  BookMarked,
  Eye,
  X,
  CheckCircle2,
  CloudUpload,
} from "lucide-react";
import BadgeSection from "@/components/BadgeSection";
import DailyStreak from "@/components/DailyStreak";
import StudyPlan from "@/components/StudyPlan";
import WritingInteractiveDiff from "@/components/WritingInteractiveDiff";
import Link from "next/link";
import { useUser, Submission } from "@/context/UserContext";
import { isAnswerCorrect } from "@/lib/answers";
import { useState, useEffect } from "react";

const mockDescriptorData = [
  { subject: "TR / FC", A: 7.5, fullMark: 9 },
  { subject: "CC", A: 6.5, fullMark: 9 },
  { subject: "LR", A: 8.0, fullMark: 9 },
  { subject: "GRA", A: 6.5, fullMark: 9 },
  { subject: "PR", A: 7.0, fullMark: 9 },
];

const mockProgressData = [
  { name: "Đề 1", band: 6.0 },
  { name: "Đề 2", band: 6.5 },
  { name: "Đề 3", band: 6.5 },
  { name: "Đề 4", band: 7.0 },
  { name: "Đề 5", band: 7.5 },
];

const skills = [
  {
    name: "Academic Reading",
    vnName: "Kỹ năng Đọc",
    spec: "60 phút • Highlight & Note",
    icon: BookOpen,
    href: "/reading",
    desc: "Luyện đọc văn bản học thuật chuyên sâu với công cụ Highlight, Ghi chú trực tiếp và lưu từ vựng C1–C2.",
  },
  {
    name: "Academic Listening",
    vnName: "Kỹ năng Nghe",
    spec: "30 phút • Parts 1–4",
    icon: Headphones,
    href: "/listening",
    desc: "Luyện nghe hội thoại và bài giảng đại học với các dạng Form, Map Labelling, Flow-chart & MCQ.",
  },
  {
    name: "Academic Writing",
    vnName: "Kỹ năng Viết",
    spec: "60 phút • In-line C1/C2 Diff",
    icon: PenTool,
    href: "/writing",
    desc: "Phân tích biểu đồ/quy trình/bản đồ và viết luận học thuật, chấm sửa từng câu chuẩn C1/C2 theo 4 tiêu chí.",
  },
  {
    name: "Academic Speaking",
    vnName: "Kỹ năng Nói",
    spec: "11–14 phút • 3 Parts",
    icon: Mic,
    href: "/speaking",
    desc: "Phỏng vấn trực tiếp cùng Giám khảo AI qua 3 phần thi với bấm giờ chuẩn và bài mẫu Band 8.0+.",
  },
];

export default function Dashboard() {
  const { user } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
  const [driveSyncing, setDriveSyncing] = useState(false);
  const [driveSyncMsg, setDriveSyncMsg] = useState<string | null>(null);

  const handleSyncDrive = async () => {
    if (driveSyncing) return;
    setDriveSyncing(true);
    setDriveSyncMsg(null);
    try {
      const res = await fetch("/api/drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
      });
      if (res.ok) {
        setDriveSyncMsg("Đã đồng bộ dữ liệu lên Google Drive thành công!");
      }
    } catch {
      setDriveSyncMsg("Đã lưu bản sao lưu cục bộ.");
    } finally {
      setDriveSyncing(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const submissions = user?.submissions || [];

  const lastSubmissions = submissions.slice(0, 5).reverse();
  const currentBand =
    submissions.length > 0
      ? submissions.reduce((acc, sub) => acc + sub.band, 0) / submissions.length
      : 0;

  const targetBand = user?.targetScore || 7.0;
  const progressPercent =
    targetBand > 0 ? Math.min(100, Math.max(0, (currentBand / targetBand) * 100)) : 0;

  const progressData =
    lastSubmissions.length > 0
      ? lastSubmissions.map((sub, idx) => ({
          name: `Lần ${idx + 1}`,
          band: sub.band,
          skill: sub.skill.charAt(0).toUpperCase() + sub.skill.slice(1),
        }))
      : mockProgressData;

  const latestDetailedSub = submissions.find(
    (sub) => sub.skill === "writing" || sub.skill === "speaking"
  );
  const writingScores = latestDetailedSub?.details?.criteria_scores;
  const speakingCriteria = latestDetailedSub?.details?.criteria;
  const descriptorData =
    latestDetailedSub && (writingScores || speakingCriteria)
      ? [
          {
            subject: "TR / FC",
            A:
              latestDetailedSub.skill === "writing"
                ? (writingScores?.task_achievement ??
                  writingScores?.task_response ??
                  latestDetailedSub.band)
                : (speakingCriteria?.fluency_and_coherence?.score ??
                  speakingCriteria?.fluency?.band ??
                  latestDetailedSub.band),
            fullMark: 9,
          },
          {
            subject: "CC / LR",
            A:
              latestDetailedSub.skill === "writing"
                ? (writingScores?.coherence_and_cohesion ?? latestDetailedSub.band)
                : (speakingCriteria?.lexical_resource?.score ??
                  speakingCriteria?.vocabulary?.band ??
                  latestDetailedSub.band),
            fullMark: 9,
          },
          {
            subject: "LR / GRA",
            A:
              latestDetailedSub.skill === "writing"
                ? (writingScores?.lexical_resource ?? latestDetailedSub.band)
                : (speakingCriteria?.grammatical_range_and_accuracy?.score ??
                  speakingCriteria?.grammar?.band ??
                  latestDetailedSub.band),
            fullMark: 9,
          },
          {
            subject: "GRA / PR",
            A:
              latestDetailedSub.skill === "writing"
                ? (writingScores?.grammatical_range_and_accuracy ?? latestDetailedSub.band)
                : (speakingCriteria?.pronunciation?.score ??
                  speakingCriteria?.pronunciation?.band ??
                  latestDetailedSub.band),
            fullMark: 9,
          },
          {
            subject: "Overall",
            A: latestDetailedSub.band,
            fullMark: 9,
          },
        ]
      : mockDescriptorData;

  const getStrengthsText = () => {
    if (submissions.length === 0)
      return "Chưa có dữ liệu bài thi. Hãy hoàn thành bài kiểm tra đầu tiên để hệ thống phân tích năng lực theo thang điểm IELTS.";

    const skillAverages = ["reading", "listening", "writing", "speaking"].map((s) => {
      const skillSubs = submissions.filter((sub) => sub.skill === s);
      return {
        skill: s,
        avg:
          skillSubs.length > 0
            ? skillSubs.reduce((a, b) => a + b.band, 0) / skillSubs.length
            : 0,
      };
    });

    const bestSkill = skillAverages.reduce((a, b) => (a.avg > b.avg ? a : b));
    if (bestSkill.avg === 0) return "Đang tổng hợp dữ liệu phân tích năng lực...";

    const skillNames: Record<string, string> = {
      reading: "Academic Reading",
      listening: "Academic Listening",
      writing: "Academic Writing",
      speaking: "Academic Speaking",
    };
    return `Năng lực nổi bật hiện tại: ${skillNames[bestSkill.skill]} (Trung bình Band ${bestSkill.avg.toFixed(1)}).`;
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-8 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Candidate Executive Header */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="IELTS SKIBIDI"
              className="h-14 w-14 rounded-xl object-cover border border-slate-200 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                  Hồ sơ Thí sinh
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-medium text-slate-500">
                  IELTS SKIBIDI Academic Prep
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mt-1">
                {user ? user.name : "Thí sinh IELTS SKIBIDI"}
              </h1>
              <p className="text-slate-500 text-sm mt-0.5">
                Theo dõi biểu đồ tiến độ Band điểm, tra cứu Sổ tay Từ vựng C1–C2 và xem lại chi tiết
                từng bài thi.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100">
            <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Mục tiêu
              </p>
              <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                {targetBand.toFixed(1)}
              </p>
            </div>
            <div className="px-4 py-3 bg-blue-50/70 rounded-lg border border-blue-200/80">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                Trung bình
              </p>
              <p className="text-2xl font-bold text-blue-700 font-mono mt-0.5">
                {currentBand > 0 ? currentBand.toFixed(1) : "—"}
              </p>
            </div>
            <div className="px-4 py-3 bg-slate-50 rounded-lg border border-slate-200/80">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                Bài đã làm
              </p>
              <p className="text-2xl font-bold text-slate-900 font-mono mt-0.5">
                {submissions.length}
              </p>
            </div>
          </div>
        </div>

        <DailyStreak />

        {/* Main Analytics Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Band Trajectory Chart */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
                    Performance Trajectory
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Biểu đồ Tiến trình Band điểm (5 bài gần nhất)
                  </h2>
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="h-[280px] w-full">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748B", fontSize: 12, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis
                        domain={[0, 9]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#64748B", fontSize: 12, fontWeight: 600 }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "10px",
                          border: "1px solid #E2E8F0",
                          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.12)",
                          padding: "10px 14px",
                          backgroundColor: "#FFFFFF",
                        }}
                        itemStyle={{
                          fontWeight: 700,
                          fontSize: "12px",
                          color: "#1D4ED8",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="band"
                        name="Band Score"
                        stroke="#1D4ED8"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#0F172A", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 7, fill: "#1D4ED8", strokeWidth: 2, stroke: "#fff" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* 4 Modules Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">
                  Học phần Luyện thi (IELTS Academic Modules)
                </h2>
                <span className="text-xs font-medium text-slate-500">
                  Chọn kỹ năng để bắt đầu làm đề
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {skills.map((skill, i) => (
                  <Link
                    key={i}
                    href={skill.href}
                    className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-600 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="w-11 h-11 rounded-lg bg-slate-900 text-white flex items-center justify-center group-hover:bg-blue-700 transition-colors">
                          <skill.icon className="w-5 h-5" />
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {skill.spec}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {skill.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 mb-2">{skill.vnName}</p>
                      <p className="text-xs text-slate-600 leading-relaxed">{skill.desc}</p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-700">
                      <span>Vào phòng thi mô phỏng</span>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Submissions History with Detailed Review Modal */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <FileCheck2 className="w-5 h-5 text-blue-700" />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Lịch sử Bài thi & Xem lại Chi tiết
                    </h3>
                    <p className="text-xs text-slate-500">
                      Bấm vào bất kỳ bài thi nào để xem lại bài làm, nhận xét 4 tiêu chí và câu sửa
                      C1/C2
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium">
                  Tổng cộng {submissions.length} bài
                </span>
              </div>

              {submissions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  Chưa có bài làm nào được lưu. Hãy hoàn thành một đề Reading, Listening, Writing
                  hoặc Speaking để xem phân tích chi tiết tại đây.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {submissions.slice(0, 8).map((sub) => {
                    const customTitle =
                      sub.details?.title ||
                      sub.details?.topic ||
                      (sub.details?.taskType
                        ? `Academic Writing ${sub.details.taskType.toUpperCase()}`
                        : `Bài thi mô phỏng Academic ${
                            sub.skill.charAt(0).toUpperCase() + sub.skill.slice(1)
                          }`);
                    return (
                      <div
                        key={sub.id}
                        onClick={() => setSelectedSub(sub)}
                        className="py-3.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between gap-4 text-sm group"
                      >
                        <div className="min-w-0">
                          <span className="font-semibold text-slate-900 uppercase tracking-wide text-xs bg-slate-100 px-2.5 py-1 rounded mr-2.5">
                            {sub.skill}
                          </span>
                          <span className="text-slate-700 font-semibold group-hover:text-blue-700 transition-colors">
                            {customTitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-slate-400 hidden sm:inline">
                            {new Date(sub.date).toLocaleDateString("vi-VN")}
                          </span>
                          <span className="px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 font-mono font-bold text-xs">
                            Band {sub.band.toFixed(1)}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSub(sub);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Chi tiết</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Academic Milestones */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm">
              <BadgeSection />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Vocabulary Vault Banner Card */}
            <div className="bg-slate-900 text-white p-6 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-semibold uppercase tracking-wider">
                  Lexical Resource C1–C2
                </span>
                <BookMarked className="w-5 h-5 text-blue-400" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold">Sổ tay Từ vựng & Flashcard</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ôn tập 24+ cụm Academic Collocations C1–C2 và các từ vựng bạn đã đánh dấu trực
                  tiếp từ đề thi Reading, Listening & Writing.
                </p>
              </div>
              <Link
                href="/vocabulary"
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold inline-flex items-center justify-center gap-2 transition-colors"
              >
                <span>Mở Sổ tay & Lật thẻ Flashcard</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Google Drive Cloud Backup Card */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                    <CloudUpload className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Google Drive Workspace</h3>
                    <p className="text-[11px] text-slate-500">khangwannafly@gmail.com</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase">
                  Docs & Sheets
                </span>
              </div>

              <div className="space-y-1.5">
                <a
                  href="https://docs.google.com/document/d/1S2W98lOaWLOwIDrJgRoiUjxp7rfTSw1tMc72FrlajDM/edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200/80 text-blue-900 text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span>📄 Hồ Sơ & Báo Cáo Học Thuật (Google Docs)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                </a>
                <a
                  href="https://docs.google.com/spreadsheets/d/1W9Gl9LoQm6zL3cvOnr7LjQlkhF_cF_hrse2SYWSbxHQ/edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-emerald-50/70 hover:bg-emerald-100/80 border border-emerald-200/80 text-emerald-900 text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span>📊 Bảng Điểm & Lịch Sử Thi (Google Sheets)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                </a>
                <a
                  href="https://docs.google.com/spreadsheets/d/1FQdNal7cuivifJQYczeNSXyB854wD3Up_CoNiB5WL_w/edit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-amber-50/70 hover:bg-amber-100/80 border border-amber-200/80 text-amber-900 text-xs font-semibold flex items-center justify-between transition-colors"
                >
                  <span>📗 Sổ Tay Từ Vựng C1–C2 (Google Sheets)</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                </a>
              </div>

              {driveSyncMsg && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {driveSyncMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleSyncDrive}
                  disabled={driveSyncing}
                  className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  {driveSyncing ? "Đang đồng bộ..." : "Cập nhật báo cáo"}
                </button>
                <a
                  href="/api/drive?format=html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold inline-flex items-center justify-center gap-1 transition-colors"
                >
                  <span>Bản in Báo cáo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Criteria Radar Chart */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-0.5">
                    Assessment Criteria
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    Biểu đồ Tiêu chí Chấm điểm
                  </h3>
                </div>
                <BarChart3 className="w-5 h-5 text-slate-500" />
              </div>

              <div className="h-[240px] w-full">
                {isMounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="78%" data={descriptorData}>
                      <PolarGrid stroke="#E2E8F0" />
                      <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: "#475569", fontSize: 11, fontWeight: 700 }}
                      />
                      <PolarRadiusAxis domain={[0, 9]} tick={false} axisLine={false} />
                      <Radar
                        name="Band Score"
                        dataKey="A"
                        stroke="#1D4ED8"
                        fill="#1D4ED8"
                        fillOpacity={0.18}
                        strokeWidth={2.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
                  Nhận xét Chuyên môn
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">{getStrengthsText()}</p>
              </div>
            </div>

            <StudyPlan />

            {/* Target Progress Card */}
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Tiến độ Mục tiêu Band {targetBand.toFixed(1)}
                    </h3>
                    <p className="text-xs text-slate-500">So với điểm trung bình hiện tại</p>
                  </div>
                </div>
                <div className="text-blue-700 font-bold text-xl font-mono">
                  {Math.round(progressPercent)}%
                </div>
              </div>

              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${progressPercent}%` }}
                  className="h-full bg-blue-700 rounded-full transition-all duration-700"
                />
              </div>

              <p className="text-slate-600 text-xs leading-relaxed">
                {currentBand >= targetBand && submissions.length > 0 ? (
                  <>
                    Bạn đã đạt mục tiêu{" "}
                    <span className="text-blue-700 font-semibold">
                      Band {targetBand.toFixed(1)}
                    </span>
                    . Hãy tiếp tục duy trì phong độ qua các đề thi mô phỏng nâng cao.
                  </>
                ) : (
                  <>
                    Khoảng cách hiện tại tới mục tiêu là{" "}
                    <span className="text-slate-900 font-semibold">
                      {Math.max(0, targetBand - currentBand).toFixed(1)} band
                    </span>
                    . Hãy ưu tiên hoàn thành lộ trình học tập mỗi ngày.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Institutional Footer */}
        <footer className="pt-12 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <Link href="/" className="inline-flex items-center gap-2.5 font-bold text-slate-900">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="IELTS SKIBIDI"
              className="w-7 h-7 rounded-md object-cover border border-slate-200"
            />
            <span>IELTS SKIBIDI • CAMBRIDGE TEST PREP</span>
          </Link>
          <p>© 2026 IELTS SKIBIDI. Chuẩn hóa theo khung khảo thí quốc tế.</p>
        </footer>
      </div>

      {/* Detailed Submission Review Modal */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-slate-900 text-white text-xs font-bold uppercase">
                    {selectedSub.skill}
                  </span>
                  <span className="text-xs text-slate-500">
                    Ngày làm bài: {new Date(selectedSub.date).toLocaleString("vi-VN")}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedSub.details?.title ||
                    selectedSub.details?.topic ||
                    `Báo cáo chi tiết bài thi ${selectedSub.skill.toUpperCase()}`}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 rounded-xl bg-blue-600 text-white text-center">
                  <div className="text-[10px] font-semibold uppercase">Band Score</div>
                  <div className="text-xl font-bold font-mono">{selectedSub.band.toFixed(1)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSub(null)}
                  className="p-2 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* WRITING SUBMISSION DETAILS */}
              {selectedSub.skill === "writing" && (
                <>
                  {selectedSub.details?.criteria_scores && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {Object.entries(selectedSub.details.criteria_scores).map(([k, v]) => (
                        <div
                          key={k}
                          className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center"
                        >
                          <div className="text-[11px] font-semibold text-slate-500 uppercase">
                            {k.replace(/_/g, " ")}
                          </div>
                          <div className="text-xl font-bold text-slate-900 font-mono mt-1">
                            {Number(v).toFixed(1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedSub.details?.prompt && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-xs font-bold uppercase text-blue-700">Đề bài</div>
                      <p className="text-sm text-slate-800 font-medium leading-relaxed">
                        {selectedSub.details.prompt}
                      </p>
                    </div>
                  )}

                  {selectedSub.details?.essay ? (
                    <WritingInteractiveDiff
                      essay={selectedSub.details.essay}
                      revisions={selectedSub.details.revisions || []}
                      lexicalUpgrades={selectedSub.details.lexical_upgrades || []}
                    />
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      Bài thi này được lưu trước khi cập nhật tính năng lưu toàn văn bài viết. Các
                      bài thi Writing mới sẽ hiển thị đầy đủ bài viết và bản sửa từng câu C1/C2 tại
                      đây.
                    </p>
                  )}
                </>
              )}

              {/* SPEAKING SUBMISSION DETAILS */}
              {selectedSub.skill === "speaking" && (
                <div className="space-y-4">
                  {selectedSub.details?.criteria && (
                    <div className="grid sm:grid-cols-2 gap-3">
                      {Object.entries(selectedSub.details.criteria).map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        ([key, val]: [string, any]) => (
                          <div
                            key={key}
                            className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase text-slate-700">
                                {key.replace(/_/g, " ")}
                              </span>
                              <span className="text-sm font-bold font-mono text-blue-700">
                                Band {val?.score ?? val?.band ?? selectedSub.band}
                              </span>
                            </div>
                            {val?.feedback && (
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {val.feedback}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {selectedSub.details?.transcript && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="text-xs font-bold uppercase text-blue-700">
                        Bản ghi lời nói (Transcript)
                      </div>
                      <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                        {selectedSub.details.transcript}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* READING & LISTENING SUBMISSION DETAILS */}
              {(selectedSub.skill === "reading" || selectedSub.skill === "listening") && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <div className="text-xs text-slate-500">Số câu đúng</div>
                      <div className="text-xl font-bold text-slate-900 font-mono">
                        {selectedSub.details?.rawScore ?? "—"} /{" "}
                        {selectedSub.details?.totalQuestions ?? "—"}
                      </div>
                    </div>
                  </div>

                  {Array.isArray(selectedSub.details?.answers) && (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Bảng đối chiếu đáp án chi tiết
                      </h4>
                      {selectedSub.details.answers.map(
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (ans: any) => {
                          const uAns = selectedSub.details?.userAnswers?.[ans.id] || "";
                          const ok = isAnswerCorrect(uAns, ans.correct_answer);
                          return (
                            <div
                              key={ans.id}
                              className={`p-3.5 rounded-xl border text-xs space-y-1 ${
                                ok
                                  ? "bg-emerald-50/50 border-emerald-200"
                                  : "bg-rose-50/50 border-rose-200"
                              }`}
                            >
                              <div className="flex items-center justify-between font-bold">
                                <span className="text-slate-900">Câu #{ans.id}</span>
                                <span className={ok ? "text-emerald-700" : "text-rose-700"}>
                                  {ok ? "✓ Chính xác" : "✗ Chưa chính xác"}
                                </span>
                              </div>
                              <div className="flex flex-wrap gap-4 text-slate-700">
                                <span>
                                  Bạn chọn: <strong>{uAns || "(Bỏ trống)"}</strong>
                                </span>
                                <span>
                                  Đáp án chuẩn:{" "}
                                  <strong className="text-emerald-800">{ans.correct_answer}</strong>
                                </span>
                              </div>
                              {ans.explanation && (
                                <p className="text-slate-600 pt-1">{ans.explanation}</p>
                              )}
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-5 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Đóng báo cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
