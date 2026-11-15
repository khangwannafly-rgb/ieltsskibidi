"use client";

import React from "react";
import Link from "next/link";
import {
  ChevronRight,
  Target,
  Award,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  CheckCircle2,
  ArrowRight,
  FileCheck2,
  BarChart3,
  Clock,
  ShieldCheck,
} from "lucide-react";

const stats = [
  { label: "Dạng câu hỏi chuẩn Cambridge", value: "24+" },
  { label: "Tiêu chí chấm điểm chính thức", value: "4 Tiêu chí" },
  { label: "Bài mẫu học thuật tích hợp", value: "Band 8.5" },
];

const skills = [
  {
    code: "MODULE 01",
    title: "Academic Reading",
    spec: "20 phút / Passage · 13 câu hỏi",
    desc: "Giao diện chia đôi màn hình (Split-Screen) chuẩn thi máy. Đầy đủ 8 dạng câu hỏi: Matching Headings (i–vii), Matching Researchers, Sentence Endings, Word Bank, T/F/NG, Y/N/NG & MCQ.",
    icon: BookOpen,
    href: "/reading",
    tags: ["Matching Headings", "T/F/Not Given", "Summary Word Bank"],
  },
  {
    code: "MODULE 02",
    title: "IELTS Listening",
    spec: "Parts 1–4 · 10 câu / Part",
    desc: "Hệ thống âm thanh đa giọng đọc Anh–Anh theo ngữ cảnh hội thoại và bài giảng học thuật. Tích hợp sơ đồ mặt bằng (Floor Plan / Map Labelling), Matching Box và Note Completion.",
    icon: Headphones,
    href: "/listening",
    tags: ["Part 1–4", "Floor Plan Labelling", "Transcript đối chiếu"],
  },
  {
    code: "MODULE 03",
    title: "Academic Writing",
    spec: "Task 1 (150w+) & Task 2 (250w+)",
    desc: "Bao phủ đủ 7 dạng biểu đồ Task 1 (Line, Bar, Pie, Table, Process, Map, Mixed) và 5 dạng bài luận Task 2. Tích hợp dàn ý 4 đoạn, từ vựng C1–C2 và bài mẫu Band 8.5.",
    icon: PenTool,
    href: "/writing",
    tags: ["7 Dạng Biểu Đồ", "5 Dạng Luận", "Chấm 4 Tiêu Chí"],
  },
  {
    code: "MODULE 04",
    title: "Speaking Examiner",
    spec: "Part 1, Part 2 (Cue Card) & Part 3",
    desc: "Mô phỏng phòng thi 1-1 với đồng hồ 1 phút chuẩn bị & giấy nháp cho Part 2 Cue Card, nhận diện giọng nói trực tiếp và câu trả lời mẫu Band 8.0+ có phát âm mẫu.",
    icon: Mic,
    href: "/speaking",
    tags: ["Cue Card 1-Min Prep", "Band 8.0 Samples", "4 Criteria Report"],
  },
];

export default function LandingPage() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-900">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 px-4 sm:px-6 lg:px-8 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Executive Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Hệ thống mô phỏng thi IELTS trên máy tính (Computer-Delivered IELTS)</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.12]">
              Luyện thi IELTS học thuật theo chuẩn{" "}
              <span className="text-blue-700">Cambridge Assessment</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
              Trải nghiệm môi trường phòng thi máy tính thực tế cho cả 4 kỹ năng Nghe, Nói, Đọc, Viết. Ngân hàng đề đa dạng không lặp khuôn mẫu, tích hợp bài mẫu Band 8.0–8.5 và đánh giá chi tiết theo bảng tiêu chí chấm thi chính thức.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
                <span>Vào bảng điều khiển học tập</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/reading" className="btn-secondary inline-flex items-center gap-2">
                <span>Làm đề Reading mẫu</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              {stats.map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl sm:text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="text-xs font-medium text-slate-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Authentic Exam Interface Preview */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800 space-y-5">
              {/* Mock Exam Topbar */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                    IELTS Academic Exam Preview
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-blue-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>19:42</span>
                </div>
              </div>

              {/* Mock Score & Criteria Breakdown */}
              <div className="bg-slate-800/80 rounded-xl p-4 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Official Band Report
                    </span>
                    <h3 className="text-base font-bold text-white">Writing Task 2 · Discussion Essay</h3>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-right">
                    <span className="text-[10px] uppercase font-semibold block leading-none opacity-80">Overall</span>
                    <span className="text-xl font-bold">8.0</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {[
                    { code: "TR", name: "Task Response", score: "8.0" },
                    { code: "CC", name: "Coherence & Cohesion", score: "8.5" },
                    { code: "LR", name: "Lexical Resource", score: "8.0" },
                    { code: "GRA", name: "Grammatical Range", score: "7.5" },
                  ].map((item) => (
                    <div
                      key={item.code}
                      className="bg-slate-900/90 px-3 py-2.5 rounded-lg border border-slate-700/60 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-blue-400 block">{item.code}</span>
                        <span className="text-xs text-slate-300 font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-bold text-white">{item.score}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Skill Launchers inside Preview */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Truy cập nhanh phòng thi
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: "Reading Split-View", href: "/reading" },
                    { label: "Listening Part 1–4", href: "/listening" },
                    { label: "Writing Task 1 & 2", href: "/writing" },
                    { label: "Speaking Simulator", href: "/speaking" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="px-3 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition-colors border border-slate-700/70"
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Modules Section */}
      <section id="skills" className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700 block mb-1">
                Cấu trúc bài thi chuẩn quốc tế
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                4 Kỹ năng IELTS Academic
              </h2>
            </div>
            <p className="text-slate-600 text-sm max-w-md">
              Mỗi phân hệ được thiết kế sát với giao diện thi máy tính của IDP và British Council, giúp thí sinh làm quen áp lực thời gian thực.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {skills.map((skill, i) => (
              <div
                key={i}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center">
                        <skill.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                          {skill.code}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900">{skill.title}</h3>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                      {skill.spec}
                    </span>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed">{skill.desc}</p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600 text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={skill.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    <span>Vào phòng thi {skill.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Methodology & Assessment Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700 block">
              Tiêu chuẩn đánh giá học thuật
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
              Phân tích bài làm chuyên sâu và đối chiếu đáp án minh bạch
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Thay vì chỉ chấm điểm tổng quát, hệ thống cung cấp trích dẫn câu gốc trong bài đọc/bản ghi âm, dàn ý học thuật 4 đoạn, bài viết mẫu Band 8.5 và gợi ý nâng cấp từ vựng theo ngữ cảnh.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              {[
                "Chia đôi màn hình Reading & Writing chuẩn thi máy",
                "Đầy đủ 7 dạng biểu đồ Task 1 & 5 dạng luận Task 2",
                "Giải thích đáp án trích dẫn trực tiếp từ văn bản",
                "Đồng hồ đếm ngược & Question Palette cố định",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-2.5 text-slate-800 text-xs sm:text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
                <span>Thiết lập mục tiêu Band điểm</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
            {[
              {
                icon: FileCheck2,
                title: "Đề thi sát chuẩn Cambridge",
                text: "Độ dài văn bản 700–850 từ, phân đoạn A–G rõ ràng, bẫy thông tin (distractors) và giới hạn số từ nghiêm ngặt.",
              },
              {
                icon: BarChart3,
                title: "Biểu đồ & Dữ liệu trực quan",
                text: "Tích hợp biểu đồ Line, Bar, Pie, Table, Process 6 bước, Map quy hoạch và Mixed Charts.",
              },
              {
                icon: Target,
                title: "Theo dõi tiến độ thực tế",
                text: "Thống kê điểm trung bình theo từng kỹ năng, biểu đồ Radar 4 tiêu chí và lịch sử làm bài chi tiết.",
              },
              {
                icon: Award,
                title: "Bài mẫu Band 8.0–8.5",
                text: "Mỗi đề Writing và Speaking đều đi kèm bài mẫu học thuật hoàn chỉnh để đối chiếu cấu trúc câu.",
              },
            ].map((card, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-[#F8FAFC] border border-slate-200 space-y-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 flex items-center justify-center">
                  <card.icon className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{card.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="IELTS SKIBIDI"
              className="w-8 h-8 rounded-lg object-cover border border-slate-200"
            />
            <span className="text-sm font-bold text-slate-900">IELTS SKIBIDI</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
            <Link href="/reading" className="hover:text-slate-900">Reading</Link>
            <Link href="/listening" className="hover:text-slate-900">Listening</Link>
            <Link href="/writing" className="hover:text-slate-900">Writing</Link>
            <Link href="/speaking" className="hover:text-slate-900">Speaking</Link>
            <Link href="/reviews" className="hover:text-slate-900">Kết quả học viên</Link>
          </div>

          <p className="text-slate-400 text-xs">
            © 2026 IELTS SKIBIDI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
