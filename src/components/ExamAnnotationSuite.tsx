"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Highlighter,
  StickyNote,
  BookMarked,
  Trash2,
  X,
  Check,
  Eraser,
} from "lucide-react";
import { addWordToVault } from "@/lib/vocabulary";

export interface ExamAnnotation {
  id: string;
  text: string;
  color: "yellow" | "blue";
  note?: string;
  createdAt: string;
}

interface Props {
  containerRef: React.RefObject<HTMLElement | null>;
  resetKey?: string | number;
}

export default function ExamAnnotationSuite({ containerRef, resetKey }: Props) {
  const [annotations, setAnnotations] = useState<ExamAnnotation[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Floating selection toolbar state
  const [selectionPopup, setSelectionPopup] = useState<{
    text: string;
    contextSentence: string;
    x: number;
    y: number;
  } | null>(null);
  const [addingNote, setAddingNote] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const savedRangeRef = useRef<Range | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 2600);
  };

  // Clear annotations when passage/test changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnnotations([]);
    setSelectionPopup(null);
    setAddingNote(false);
  }, [resetKey]);

  const applyDomHighlight = useCallback(
    (range: Range, id: string, color: "yellow" | "blue", note?: string) => {
      try {
        const mark = document.createElement("mark");
        mark.setAttribute("data-exam-hl-id", id);
        mark.className =
          color === "yellow"
            ? "bg-amber-200/85 text-slate-900 px-0.5 rounded-xs cursor-pointer transition-colors"
            : "bg-sky-200/85 text-slate-900 px-0.5 rounded-xs cursor-pointer transition-colors";
        if (note) {
          mark.title = `Ghi chú: ${note}`;
          mark.className += " border-b-2 border-blue-700";
        }
        const contents = range.extractContents();
        mark.appendChild(contents);
        range.insertNode(mark);
        window.getSelection()?.removeAllRanges();
      } catch {
        // Fallback if selection crosses complex block boundaries
        window.getSelection()?.removeAllRanges();
      }
    },
    []
  );

  const removeDomHighlightById = (id: string) => {
    if (!containerRef.current) return;
    const marks = containerRef.current.querySelectorAll(`mark[data-exam-hl-id="${id}"]`);
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      if (!parent) return;
      while (mark.firstChild) {
        parent.insertBefore(mark.firstChild, mark);
      }
      parent.removeChild(mark);
      parent.normalize();
    });
  };

  const clearAllHighlights = () => {
    if (!containerRef.current) return;
    const marks = containerRef.current.querySelectorAll("mark[data-exam-hl-id]");
    marks.forEach((mark) => {
      const parent = mark.parentNode;
      if (!parent) return;
      while (mark.firstChild) {
        parent.insertBefore(mark.firstChild, mark);
      }
      parent.removeChild(mark);
      parent.normalize();
    });
    setAnnotations([]);
    showToast("Đã xóa toàn bộ Highlight & Ghi chú");
  };

  useEffect(() => {
    const handleMouseUp = (e: MouseEvent) => {
      if (popupRef.current && popupRef.current.contains(e.target as Node)) {
        return;
      }

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !containerRef.current) {
        setSelectionPopup(null);
        setAddingNote(false);
        return;
      }

      const rawText = sel.toString().trim();
      if (rawText.length < 2 || rawText.length > 260) {
        setSelectionPopup(null);
        setAddingNote(false);
        return;
      }

      const anchorNode = sel.anchorNode;
      if (!anchorNode || !containerRef.current.contains(anchorNode)) {
        setSelectionPopup(null);
        setAddingNote(false);
        return;
      }

      // Do not trigger inside input/textarea/select
      const el =
        anchorNode.nodeType === Node.ELEMENT_NODE
          ? (anchorNode as HTMLElement)
          : anchorNode.parentElement;
      if (el && el.closest("input, textarea, select, button")) {
        return;
      }

      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;

      savedRangeRef.current = range.cloneRange();
      const parentBlockText = el?.closest("p, li, div")?.textContent?.trim() || rawText;
      const contextSentence =
        parentBlockText.length <= 240 ? parentBlockText : rawText;

      setSelectionPopup({
        text: rawText,
        contextSentence,
        x: Math.min(window.innerWidth - 180, Math.max(160, rect.left + rect.width / 2)),
        y: Math.max(72, rect.top - 10),
      });
      setAddingNote(false);
      setNoteInput("");
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, [containerRef]);

  const handleCreateAnnotation = (color: "yellow" | "blue", note?: string) => {
    if (!selectionPopup) return;
    const id = "hl_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6);
    if (savedRangeRef.current) {
      applyDomHighlight(savedRangeRef.current, id, color, note);
    }
    const newItem: ExamAnnotation = {
      id,
      text: selectionPopup.text,
      color,
      note: note?.trim() || undefined,
      createdAt: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setAnnotations((prev) => [newItem, ...prev]);
    setSelectionPopup(null);
    setAddingNote(false);
    setNoteInput("");
    showToast(note ? "Đã thêm Ghi chú vào đoạn văn" : "Đã đánh dấu Highlight");
  };

  const handleSaveToVocab = (wordText: string, exampleSentence?: string) => {
    const res = addWordToVault({
      word: wordText,
      example: exampleSentence,
      topic: "Saved from Tests",
      level: "C1",
    });
    setSelectionPopup(null);
    window.getSelection()?.removeAllRanges();
    showToast(
      res.added
        ? `Đã lưu "${wordText.slice(0, 28)}" vào Sổ tay Từ vựng C1–C2`
        : `"${wordText.slice(0, 28)}" đã có sẵn trong Sổ tay Từ vựng`
    );
  };

  return (
    <>
      {/* Trigger Button in Exam Top Bar */}
      <div className="relative flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setDrawerOpen(!drawerOpen)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            annotations.length > 0
              ? "bg-amber-50 border-amber-300 text-amber-900"
              : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
          }`}
          title="Bôi đen bất kỳ từ/câu nào trong đề để Highlight, Ghi chú hoặc Lưu từ vựng"
        >
          <Highlighter className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden md:inline">Highlight & Ghi chú</span>
          <span className="px-1.5 py-0.2 rounded bg-white border border-slate-200 text-[11px] font-mono font-bold">
            {annotations.length}
          </span>
        </button>

        {/* Slide-down Annotations Panel */}
        {drawerOpen && (
          <div className="fixed sm:absolute right-4 sm:right-0 top-28 sm:top-full sm:mt-2 w-[340px] sm:w-[380px] bg-white text-slate-900 rounded-xl border border-slate-200 shadow-2xl z-50 overflow-hidden">
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-blue-700" />
                <span className="text-xs font-bold text-slate-900">
                  Ghi chú & Highlight trong bài ({annotations.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                {annotations.length > 0 && (
                  <button
                    type="button"
                    onClick={clearAllHighlights}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:underline"
                  >
                    <Eraser className="w-3 h-3" />
                    Xóa hết
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100 p-2">
              {annotations.length === 0 ? (
                <div className="p-5 text-center space-y-2">
                  <p className="text-xs font-semibold text-slate-700">
                    Chưa có đoạn Highlight hoặc Ghi chú nào.
                  </p>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Mẹo chuẩn thi máy IDP/BC: Dùng chuột <strong>bôi đen bất kỳ cụm từ nào</strong>{" "}
                    trong bài đọc hoặc câu hỏi để tô màu Highlight, gắn Note hoặc lưu vào Sổ tay Từ
                    vựng C1–C2.
                  </p>
                </div>
              ) : (
                annotations.map((ann) => (
                  <div key={ann.id} className="p-3 space-y-2 hover:bg-slate-50 rounded-lg">
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded leading-relaxed ${
                          ann.color === "yellow"
                            ? "bg-amber-100 text-amber-950"
                            : "bg-sky-100 text-sky-950"
                        }`}
                      >
                        &ldquo;{ann.text}&rdquo;
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          removeDomHighlightById(ann.id);
                          setAnnotations((prev) => prev.filter((a) => a.id !== ann.id));
                        }}
                        className="text-slate-400 hover:text-rose-600 p-1 shrink-0"
                        title="Xóa highlight này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {ann.note && (
                      <div className="text-xs text-slate-700 bg-blue-50/70 border border-blue-200/80 px-2.5 py-1.5 rounded-md">
                        <strong className="text-blue-800">Note:</strong> {ann.note}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>{ann.createdAt}</span>
                      <button
                        type="button"
                        onClick={() => handleSaveToVocab(ann.text)}
                        className="inline-flex items-center gap-1 text-blue-700 font-semibold hover:underline"
                      >
                        <BookMarked className="w-3 h-3" />
                        Lưu vào Sổ tay từ vựng
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Selection Toolbar */}
      {selectionPopup && (
        <div
          ref={popupRef}
          style={{
            left: `${selectionPopup.x}px`,
            top: `${selectionPopup.y}px`,
            transform: "translate(-50%, -100%)",
          }}
          className="fixed z-50 bg-slate-900 text-white rounded-xl shadow-2xl border border-slate-700 p-1.5 flex flex-col gap-1.5 min-w-[260px]"
        >
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleCreateAnnotation("yellow")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-semibold transition-colors"
              title="Highlight Vàng"
            >
              <span className="w-3.5 h-3.5 rounded-full bg-amber-300 border border-white/40" />
              <span>Vàng</span>
            </button>

            <button
              type="button"
              onClick={() => handleCreateAnnotation("blue")}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-xs font-semibold transition-colors"
              title="Highlight Xanh"
            >
              <span className="w-3.5 h-3.5 rounded-full bg-sky-300 border border-white/40" />
              <span>Xanh</span>
            </button>

            <button
              type="button"
              onClick={() => setAddingNote(!addingNote)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                addingNote ? "bg-blue-600 text-white" : "hover:bg-slate-800"
              }`}
            >
              <StickyNote className="w-3.5 h-3.5" />
              <span>Ghi chú</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleSaveToVocab(selectionPopup.text, selectionPopup.contextSentence)
              }
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
              title="Lưu vào Sổ tay Từ vựng C1–C2"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>+ Từ vựng</span>
            </button>
          </div>

          {addingNote && (
            <div className="flex items-center gap-1.5 pt-1 border-t border-slate-700 px-1 pb-0.5">
              <input
                type="text"
                autoFocus
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateAnnotation("yellow", noteInput);
                }}
                placeholder="Nhập ghi chú (VD: Đáp án câu 5)..."
                className="flex-1 bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded-md border border-slate-600 outline-none focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => handleCreateAnnotation("yellow", noteInput)}
                className="p-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-16 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </>
  );
}
