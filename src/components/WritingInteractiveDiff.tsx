"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  BookMarked,
  Check,
  Eye,
  FileDiff,
} from "lucide-react";
import { addWordToVault } from "@/lib/vocabulary";

export interface EssayRevision {
  original?: string;
  improved?: string;
  explanation?: string;
  criterion?: string;
}

export interface LexicalUpgrade {
  original?: string;
  upgrade?: string;
  meaning?: string;
}

interface Props {
  essay: string;
  revisions: EssayRevision[];
  lexicalUpgrades?: LexicalUpgrade[];
}

export default function WritingInteractiveDiff({
  essay,
  revisions = [],
  lexicalUpgrades = [],
}: Props) {
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [previewUpgradedInEssay, setPreviewUpgradedInEssay] = useState<boolean>(false);
  const [savedKeys, setSavedKeys] = useState<Record<string, boolean>>({});

  const validRevisions = revisions.filter((r) => r && r.original && r.improved);

  const handleSavePhrase = (phrase: string, meaning?: string, example?: string) => {
    addWordToVault({
      word: phrase,
      meaning: meaning || "Cấu trúc / Cụm từ C1–C2 nâng cấp từ bài chấm IELTS Writing",
      example: example || phrase,
      topic: "Saved from Tests",
      level: "C1",
    });
    setSavedKeys((prev) => ({ ...prev, [phrase]: true }));
  };

  // Render essay with interactive highlighted sentences
  const renderAnnotatedEssay = () => {
    if (!essay) return null;
    if (validRevisions.length === 0) {
      return <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">{essay}</p>;
    }

    // Split essay into segments matching each revision's original sentence
    type Segment = { text: string; revIndex?: number };
    let segments: Segment[] = [{ text: essay }];

    validRevisions.forEach((rev, rIdx) => {
      const target = rev.original?.trim();
      if (!target || target.length < 4) return;
      const nextSegments: Segment[] = [];
      segments.forEach((seg) => {
        if (seg.revIndex !== undefined) {
          nextSegments.push(seg);
          return;
        }
        const pos = seg.text.indexOf(target);
        if (pos === -1) {
          nextSegments.push(seg);
        } else {
          if (pos > 0) {
            nextSegments.push({ text: seg.text.slice(0, pos) });
          }
          nextSegments.push({ text: target, revIndex: rIdx });
          const after = seg.text.slice(pos + target.length);
          if (after.length > 0) {
            nextSegments.push({ text: after });
          }
        }
      });
      segments = nextSegments;
    });

    return (
      <div className="text-sm leading-relaxed text-slate-800 whitespace-pre-line">
        {segments.map((seg, i) => {
          if (seg.revIndex === undefined) {
            return <span key={i}>{seg.text}</span>;
          }
          const rev = validRevisions[seg.revIndex];
          const isSelected = activeIdx === seg.revIndex;
          return (
            <span
              key={i}
              onClick={() => setActiveIdx(seg.revIndex!)}
              className={`inline cursor-pointer rounded px-1 py-0.5 mx-0.5 transition-all border-b-2 ${
                previewUpgradedInEssay
                  ? "bg-emerald-100/90 text-emerald-950 border-emerald-600 font-semibold"
                  : isSelected
                  ? "bg-blue-100 text-blue-950 border-blue-700 font-semibold ring-2 ring-blue-500/20"
                  : "bg-amber-100/80 text-amber-950 border-amber-500 hover:bg-amber-200/80"
              }`}
              title="Bấm để xem phân tích và cách viết lại chuẩn C1/C2"
            >
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 mr-1 rounded bg-slate-900 text-white text-[10px] font-mono font-bold">
                #{seg.revIndex + 1}
              </span>
              {previewUpgradedInEssay ? rev.improved : seg.text}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Interactive In-line Essay Diff Section */}
      {essay && (
        <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileDiff className="w-4 h-4 text-blue-700" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Chấm trực quan trên bài viết (Interactive In-line Essay Diff)
              </h4>
            </div>

            {validRevisions.length > 0 && (
              <button
                type="button"
                onClick={() => setPreviewUpgradedInEssay(!previewUpgradedInEssay)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  previewUpgradedInEssay
                    ? "bg-emerald-600 border-emerald-600 text-white"
                    : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                {previewUpgradedInEssay
                  ? "Đang xem: Bài viết đã áp dụng câu C1/C2"
                  : "Xem trước bài viết khi thay bằng câu C1/C2"}
              </button>
            )}
          </div>

          <div className="p-5 space-y-4">
            {renderAnnotatedEssay()}

            {validRevisions.length > 0 && validRevisions[activeIdx] && (
              <div className="bg-white rounded-xl border-2 border-blue-600/30 p-4 space-y-3 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-white text-xs font-mono font-bold">
                      Câu #{activeIdx + 1}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
                      {validRevisions[activeIdx].criterion || "Nâng cấp Học thuật C1/C2"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {validRevisions.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveIdx(idx)}
                        className={`w-6 h-6 rounded text-xs font-bold font-mono transition-colors ${
                          activeIdx === idx
                            ? "bg-blue-700 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-rose-50/70 border border-rose-200/80 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-rose-700">
                      Câu gốc trong bài của bạn
                    </div>
                    <p className="text-xs text-rose-950 line-through leading-relaxed">
                      {validRevisions[activeIdx].original}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200 space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      Bản Paraphrase C1/C2 (Band 8.0+)
                    </div>
                    <p className="text-xs text-emerald-950 font-semibold leading-relaxed">
                      {validRevisions[activeIdx].improved}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs">
                  <p className="text-slate-600 italic">
                    <strong className="text-slate-800 not-italic">Giải thích:</strong>{" "}
                    {validRevisions[activeIdx].explanation}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      handleSavePhrase(
                        validRevisions[activeIdx].improved || "",
                        validRevisions[activeIdx].explanation,
                        validRevisions[activeIdx].improved
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold shrink-0 transition-colors"
                  >
                    {savedKeys[validRevisions[activeIdx].improved || ""] ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Đã lưu vào Sổ tay</span>
                      </>
                    ) : (
                      <>
                        <BookMarked className="w-3.5 h-3.5" />
                        <span>+ Lưu câu mẫu vào Sổ tay</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* All Sentence Revisions List */}
      {validRevisions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-700" />
            Danh sách Đối chiếu & Nâng cấp câu chuẩn C1/C2 ({validRevisions.length} câu)
          </h4>
          <div className="grid gap-3">
            {validRevisions.map((rev, idx) => (
              <div
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                  activeIdx === idx
                    ? "bg-blue-50/30 border-blue-400"
                    : "bg-white border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    Câu #{idx + 1} •{" "}
                    <span className="text-blue-700">
                      {rev.criterion || "Lexical & Grammatical Upgrade"}
                    </span>
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-100 text-rose-800 line-through">
                    {rev.original}
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 font-semibold">
                    {rev.improved}
                  </div>
                </div>
                {rev.explanation && (
                  <p className="text-xs text-slate-500">{rev.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lexical Upgrades (Collocations C1/C2) */}
      {lexicalUpgrades && lexicalUpgrades.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <BookMarked className="w-4 h-4 text-blue-700" />
            Gợi ý Nâng cấp Từ vựng Học thuật (C1–C2 Collocation Upgrades)
          </h4>
          <div className="grid sm:grid-cols-3 gap-3">
            {lexicalUpgrades.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="line-through">{item.original}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                  </div>
                  <div className="text-sm font-bold text-blue-800">{item.upgrade}</div>
                  {item.meaning && (
                    <p className="text-xs text-slate-600 leading-relaxed">{item.meaning}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleSavePhrase(item.upgrade || "", item.meaning, item.upgrade)
                  }
                  className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-800 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  {savedKeys[item.upgrade || ""] ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Đã lưu vào Sổ tay</span>
                    </>
                  ) : (
                    <>
                      <BookMarked className="w-3.5 h-3.5" />
                      <span>+ Lưu vào Sổ tay C1–C2</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
