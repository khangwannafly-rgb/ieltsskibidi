"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Volume2,
  AlertTriangle,
  ChevronRight,
  Trophy,
  BookOpen,
  Gauge,
  Flag,
  Clock,
} from "lucide-react";
import { useUser } from "@/context/UserContext";
import { isAnswerCorrect } from "@/lib/answers";
import ExamAnnotationSuite from "@/components/ExamAnnotationSuite";

const TEST_DURATION = 1800; // 30 minutes

interface Segment {
  speaker: string;
  text: string;
}

/** Tách transcript thành các lượt nói "Speaker: text" để đọc bằng nhiều giọng. */
function parseTranscript(transcript: string): Segment[] {
  return transcript
    .replace(/\*\*|__|#+\s?/g, "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const m = line.match(/^([A-Z][\w .'-]{0,30}?)\s*:\s*(.+)$/);
      return m ? { speaker: m[1].trim(), text: m[2].trim() } : { speaker: "", text: line };
    })
    .filter((s) => s.text.length > 0);
}

const LISTENING_PARTS = [
  { id: 0, label: "Ngẫu nhiên", sub: "All Parts", desc: "Hệ thống chọn ngẫu nhiên 1 trong 4 Part chuẩn Cambridge." },
  { id: 1, label: "Part 1", sub: "Social Dialogue", desc: "Hội thoại đời sống (đăng ký khóa học, đặt phòng, dịch vụ) — Điền từ/số." },
  { id: 2, label: "Part 2", sub: "Social Monologue", desc: "Độc thoại hướng dẫn (tham quan bảo tàng, công viên, sự kiện)." },
  { id: 3, label: "Part 3", sub: "Academic Discussion", desc: "Thảo luận học thuật giữa sinh viên và giảng viên về dự án nghiên cứu." },
  { id: 4, label: "Part 4", sub: "Academic Lecture", desc: "Bài giảng đại học chuyên sâu — Note/Summary Completion (ONE WORD ONLY)." },
];

export default function ListeningPage() {
  const { user, addSubmission } = useUser();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [selectedPart, setSelectedPart] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [segmentIdx, setSegmentIdx] = useState(0);
  const [rate, setRate] = useState(0.95);
  const [ttsSupported, setTtsSupported] = useState(true);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);

  const segmentsRef = useRef<Segment[]>([]);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const playingRef = useRef(false);
  const submittingRef = useRef(false);
  const examContainerRef = useRef<HTMLDivElement | null>(null);

  const transcript: string | undefined = data?.transcript;
  const segments = useMemo(() => (transcript ? parseTranscript(transcript) : []), [transcript]);
  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

  // Khởi tạo danh sách giọng đọc tiếng Anh của trình duyệt
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setTtsSupported(false);
      return;
    }
    const loadVoices = () => {
      const all = window.speechSynthesis.getVoices();
      const english = all.filter((v) => v.lang?.toLowerCase().startsWith("en"));
      english.sort((a, b) => Number(b.lang === "en-GB") - Number(a.lang === "en-GB"));
      voicesRef.current = english.length > 0 ? english : all;
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (data && !data.error && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [data, submitted]);

  const stopAudio = useCallback(() => {
    playingRef.current = false;
    setIsPlaying(false);
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const speakFrom = useCallback(
    (index: number) => {
      const segs = segmentsRef.current;
      if (!playingRef.current || index >= segs.length) {
        playingRef.current = false;
        setIsPlaying(false);
        if (index >= segs.length) setSegmentIdx(segs.length);
        return;
      }
      setSegmentIdx(index);
      const seg = segs[index];
      const utterance = new SpeechSynthesisUtterance(seg.text);
      utterance.lang = "en-GB";
      utterance.rate = rate;

      const voices = voicesRef.current;
      if (voices.length > 0) {
        const speakers = Array.from(new Set(segs.map((s) => s.speaker)));
        const speakerIdx = Math.max(0, speakers.indexOf(seg.speaker));
        utterance.voice = voices[speakerIdx % voices.length];
        utterance.lang = utterance.voice.lang;
        if (voices.length === 1) utterance.pitch = speakerIdx % 2 === 0 ? 1 : 0.85;
      }

      utterance.onend = () => {
        if (playingRef.current) speakFrom(index + 1);
      };
      utterance.onerror = (e) => {
        if (e.error !== "interrupted" && e.error !== "canceled") {
          console.error("Speech synthesis error:", e.error);
          playingRef.current = false;
          setIsPlaying(false);
        }
      };
      window.speechSynthesis.speak(utterance);
    },
    [rate]
  );

  const toggleAudio = () => {
    if (!ttsSupported || !data?.transcript) return;
    if (isPlaying) {
      stopAudio();
      return;
    }
    window.speechSynthesis.cancel();
    playingRef.current = true;
    setIsPlaying(true);
    const start = segmentIdx >= segments.length ? 0 : segmentIdx;
    speakFrom(start);
  };

  const restartAudio = () => {
    stopAudio();
    setSegmentIdx(0);
  };

  const generateTask = async (partOverride?: number) => {
    const partToUse = partOverride !== undefined ? partOverride : selectedPart;
    stopAudio();
    setLoading(true);
    setData(null);
    setUserAnswers({});
    setFlagged({});
    setSubmitted(false);
    setShowResultModal(false);
    setTimeLeft(TEST_DURATION);
    setSegmentIdx(0);
    try {
      const res = await fetch("/api/generate/listening", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetScore: user?.targetScore || 6.5,
          part: partToUse > 0 ? partToUse : undefined,
        }),
      });
      const json = await res.json().catch(() => ({ error: "Phản hồi từ máy chủ không hợp lệ" }));
      if (!json.error && (!Array.isArray(json.questions) || !Array.isArray(json.answers))) {
        json.error = "Đề bài AI tạo ra không hợp lệ. Vui lòng thử lại.";
      }
      setData(json);
      window.scrollTo({ top: 0 });
    } catch (error) {
      console.error(error);
      setData({ error: "Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (id: number, value: string) => {
    if (submitted) return;
    setUserAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const toggleFlag = (id: number) => {
    setFlagged((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getAnswer = (id: number) => data?.answers?.find((a: any) => a.id === id);
  const isCorrect = (id: number) => isAnswerCorrect(userAnswers[id], getAnswer(id)?.correct_answer);

  const submitTest = useCallback(
    async (auto = false) => {
      if (!data || submitted || submittingRef.current) return;
      if (!auto) {
        const unanswered = data.questions.filter((q: { id: number }) => !userAnswers[q.id]?.trim()).length;
        if (unanswered > 0 && !window.confirm(`Bạn còn ${unanswered} câu chưa trả lời. Vẫn nộp bài?`)) return;
      }
      submittingRef.current = true;
      setSubmitting(true);
      try {
        const orderedUserAnswers = data.answers.map((ans: { id: number }) => userAnswers[ans.id] || "");

        const res = await fetch("/api/score/listening", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userAnswers: orderedUserAnswers,
            correctAnswers: data.answers,
          }),
        });
        const scoreData = await res.json();
        if (!res.ok || scoreData.error) throw new Error(scoreData.error || "Failed to score");

        setData({ ...data, score: scoreData });
        setSubmitted(true);
        setShowResultModal(true);
        stopAudio();

        addSubmission({
          skill: "listening",
          band: scoreData.band,
          details: {
            title: data.title,
            section: data.section_type,
            rawScore: scoreData.rawScore,
            totalQuestions: scoreData.totalQuestions,
            questions: data.questions,
            answers: data.answers,
            userAnswers,
          },
        });
      } catch (error) {
        console.error("Error submitting test:", error);
        alert("Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.");
      } finally {
        submittingRef.current = false;
        setSubmitting(false);
      }
    },
    [data, submitted, userAnswers, addSubmission, stopAudio]
  );

  useEffect(() => {
    if (timeLeft === 0 && data && !data.error && !submitted) {
      submitTest(true);
    }
  }, [timeLeft, data, submitted, submitTest]);

  const totalSegments = segments.length;
  const audioProgress = totalSegments > 0 ? Math.min(100, (segmentIdx / totalSegments) * 100) : 0;
  const activeSpeaker = isPlaying && segments[segmentIdx]?.speaker ? segments[segmentIdx].speaker : null;
  const answeredCount = data?.questions
    ? data.questions.filter((q: { id: number }) => userAnswers[q.id]?.trim()).length
    : 0;

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-[#F9FAFB] p-6">
        <div className="w-full max-w-md p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-6 shadow-xl">
          <div className="relative w-24 h-24 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-b-4 border-purple-600 rounded-full"
            />
            <Headphones className="absolute inset-0 m-auto w-10 h-10 text-purple-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Đang chuẩn bị bài nghe...</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Hệ thống đang khởi tạo kịch bản âm thanh và bộ 10 câu hỏi chuẩn Cambridge IELTS Listening.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (data?.error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-[#F9FAFB] p-6">
        <div className="max-w-md w-full p-10 bg-white rounded-3xl border border-rose-100 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-600 border border-rose-100">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 uppercase">Lỗi hệ thống</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{data.error}</p>
          </div>
          <button onClick={() => generateTask()} className="btn-primary w-full py-4 text-sm">
            Thử lại ngay
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] flex flex-col">
      {/* Top Exam Bar */}
      <div className="h-14 bg-slate-900 text-white flex items-center justify-between px-4 lg:px-8 sticky top-16 z-30 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <Headphones className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-black tracking-widest uppercase text-[10px] text-purple-400 block leading-none">
              IELTS Listening Test
            </span>
            <span className="font-bold text-xs text-slate-200">
              {data ? `${data.section_type || "Part 1"} · 10 Questions` : "Computer-Delivered Format"}
            </span>
          </div>
        </div>

        {data && (
          <div className="flex items-center gap-2 md:gap-4">
            <ExamAnnotationSuite containerRef={examContainerRef} resetKey={data.title} />
            <button
              onClick={() => generateTask(selectedPart)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700"
              title="Đổi sang đề và dạng bài khác"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đổi đề khác</span>
            </button>
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm tabular-nums ${
                timeLeft < 300 && !submitted
                  ? "bg-rose-950 border-rose-700 text-rose-300 animate-pulse"
                  : "bg-slate-800 border-slate-700 text-purple-300"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timeLeft)}
            </div>

            {!submitted ? (
              <button
                onClick={() => submitTest(false)}
                disabled={submitting}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition-all disabled:opacity-50"
              >
                {submitting ? "Đang chấm..." : "Nộp bài"}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowResultModal(true)}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider transition-all"
                >
                  Kết quả ({data.score?.band})
                </button>
                <button
                  onClick={() => generateTask()}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
                >
                  Đề mới
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {!data ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl w-full bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-lg space-y-8"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-b border-slate-100 pb-6">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 shrink-0">
                <Headphones className="w-8 h-8 text-purple-600" />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-purple-600">
                  Cambridge IELTS Listening
                </span>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Phòng thi Listening</h1>
                <p className="text-slate-500 text-sm font-medium">
                  Chọn Part bạn muốn luyện tập. Giọng đọc đa nhân vật (Anh-Anh) kèm giới hạn từ chuẩn kỳ thi thật.
                </p>
              </div>
            </div>

            {/* Part Selector Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {LISTENING_PARTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPart(p.id)}
                  className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2 ${
                    selectedPart === p.id
                      ? "bg-purple-50/80 border-purple-600 ring-2 ring-purple-500/20"
                      : "bg-slate-50/70 border-slate-200 hover:border-purple-200 hover:bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">{p.label}</span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        selectedPart === p.id ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {p.sub}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{p.desc}</p>
                </button>
              ))}
            </div>

            {!ttsSupported && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                Trình duyệt của bạn không hỗ trợ đọc văn bản (Text-to-Speech). Hãy dùng Chrome, Edge hoặc Safari bản mới.
              </div>
            )}

            <button
              onClick={() => generateTask(selectedPart)}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-base group"
            >
              Bắt đầu làm bài {selectedPart > 0 ? `(Part ${selectedPart})` : ""}
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      ) : (
        <div ref={examContainerRef} className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 space-y-6 pb-24">
          {/* Compact Audio Player Bar */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm sticky top-[7.5rem] z-20">
            <div className="flex flex-col md:flex-row items-center gap-5">
              <button
                onClick={toggleAudio}
                disabled={!ttsSupported}
                aria-label={isPlaying ? "Tạm dừng" : "Phát bài nghe"}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-md shrink-0 ${
                  isPlaying
                    ? "bg-rose-600 hover:bg-rose-500 text-white"
                    : "bg-purple-600 hover:bg-purple-500 text-white"
                } ${!ttsSupported ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>

              <div className="flex-1 w-full space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-700 font-black text-xs uppercase tracking-wider">
                      {data.section_type || "Part 1"}
                    </span>
                    <h2 className="text-sm md:text-base font-bold text-slate-900 line-clamp-1">
                      {data.context || "IELTS Listening Recording"}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeSpeaker && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                        <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                        {activeSpeaker}
                      </span>
                    )}
                    {submitted && (
                      <button
                        onClick={() => {
                          document.getElementById("transcript-section")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-lg border border-purple-200 hover:bg-purple-100 transition-all"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        Transcript
                      </button>
                    )}
                    <button
                      onClick={restartAudio}
                      disabled={!ttsSupported}
                      className="p-2 bg-slate-100 rounded-lg text-slate-600 hover:text-purple-600 transition-colors"
                      title="Nghe lại từ đầu"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <label className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-700">
                      <Gauge className="w-3.5 h-3.5 text-purple-600" />
                      <select
                        value={rate}
                        onChange={(e) => {
                          stopAudio();
                          setRate(parseFloat(e.target.value));
                        }}
                        className="bg-transparent outline-none cursor-pointer font-bold"
                        aria-label="Tốc độ đọc"
                      >
                        <option value={0.8}>0.8x</option>
                        <option value={0.95}>1.0x (Chuẩn)</option>
                        <option value={1.1}>1.15x</option>
                      </select>
                    </label>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <motion.div
                    className="h-full bg-purple-600 rounded-full"
                    animate={{ width: `${audioProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>

                <div className="flex justify-between items-center text-[11px] font-semibold text-slate-500">
                  <span>
                    Lượt thoại {Math.min(segmentIdx + (isPlaying ? 1 : 0), totalSegments)} / {totalSegments}
                  </span>
                  <span className={isPlaying ? "text-purple-600 font-bold" : ""}>
                    {!ttsSupported
                      ? "Trình duyệt không hỗ trợ TTS"
                      : isPlaying
                      ? "Đang phát băng ghi âm..."
                      : segmentIdx === 0
                      ? "Nhấn nút Play để bắt đầu nghe"
                      : `Đã nghe ${audioProgress.toFixed(0)}%`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Official Cambridge Instruction Box */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 md:p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 block">
                  Questions 1–{data.questions.length} · Official Instructions
                </span>
                <p className="text-sm font-bold text-slate-900">
                  {data.instruction ||
                    "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer."}
                </p>
              </div>
              <div className="text-xs font-bold text-slate-600 shrink-0">
                Đã làm: <span className="text-purple-700 font-black">{answeredCount}</span>/{data.questions.length}
              </div>
            </div>

            {Array.isArray(data.box_items) && data.box_items.length > 0 && (
              <div className="bg-white border border-amber-300 rounded-xl p-4 space-y-2 shadow-sm">
                {data.box_title && (
                  <p className="text-xs font-black uppercase tracking-wider text-purple-700">
                    {data.box_title}
                  </p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {data.box_items.map((item: string, bi: number) => (
                    <div
                      key={bi}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data.questions.map((q: any, idx: number) => {
              const qNum = q.id ?? idx + 1;
              const isFlagged = !!flagged[qNum];
              const hasAns = !!userAnswers[qNum]?.trim();

              return (
                <div
                  key={qNum}
                  id={`lq-card-${qNum}`}
                  className={`bg-white rounded-2xl p-5 border transition-all ${
                    submitted
                      ? isCorrect(qNum)
                        ? "border-emerald-300 bg-emerald-50/20"
                        : "border-rose-300 bg-rose-50/20"
                      : hasAns
                      ? "border-purple-300 shadow-sm"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                          submitted
                            ? isCorrect(qNum)
                              ? "bg-emerald-600 text-white"
                              : "bg-rose-600 text-white"
                            : hasAns
                            ? "bg-purple-600 text-white"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {idx + 1}
                      </span>
                      {q.word_limit && (
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-600 uppercase tracking-wider">
                          {q.word_limit}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleFlag(qNum)}
                      title="Đánh dấu xem lại"
                      className={`p-1.5 rounded-lg border text-xs transition-colors ${
                        isFlagged
                          ? "bg-amber-50 border-amber-300 text-amber-600"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <p className="text-slate-900 font-semibold text-sm md:text-base leading-relaxed mb-4">
                    {q.question}
                  </p>

                  {q.type === "MCQ" && Array.isArray(q.options) && q.options.length > 0 ? (
                    <div className="grid gap-2">
                      {q.options.map((opt: string, i: number) => (
                        <label
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-xl border text-sm transition-all ${
                            submitted ? "cursor-default" : "cursor-pointer"
                          } ${
                            userAnswers[qNum] === opt
                              ? "bg-purple-50 border-purple-500 text-purple-900 font-bold"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:border-purple-200"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`lq-${qNum}`}
                            disabled={submitted}
                            checked={userAnswers[qNum] === opt}
                            onChange={() => handleAnswerChange(qNum, opt)}
                            className="w-4 h-4 accent-purple-600"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      disabled={submitted}
                      placeholder={q.word_limit ? `Nhập (${q.word_limit})...` : "Nhập câu trả lời..."}
                      value={userAnswers[qNum] || ""}
                      onChange={(e) => handleAnswerChange(qNum, e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-500 outline-none transition-all text-sm font-bold text-slate-900 placeholder:text-slate-400"
                    />
                  )}

                  {submitted && (
                    <div
                      className={`mt-4 p-3.5 rounded-xl border text-xs space-y-1.5 ${
                        isCorrect(qNum)
                          ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                          : "bg-rose-50/80 border-rose-200 text-rose-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 font-black">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>
                          Đáp án đúng:{" "}
                          <span className="underline">{getAnswer(qNum)?.correct_answer ?? "—"}</span>
                        </span>
                      </div>
                      {getAnswer(qNum)?.explanation && (
                        <p className="text-slate-600 font-medium leading-relaxed pl-6">
                          {getAnswer(qNum)?.explanation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Transcript Section - Shows after submission */}
          {submitted && data.transcript && (
            <motion.div
              id="transcript-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 border border-purple-100">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Audio Script / Transcript
                    </h3>
                    <p className="text-xs text-slate-500">
                      Đối chiếu lời thoại gốc với giải thích đáp án ở trên
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {segments.map((seg, i) => (
                  <p
                    key={i}
                    className={`text-sm leading-relaxed p-2.5 rounded-xl transition-colors ${
                      isPlaying && segmentIdx === i
                        ? "bg-purple-50 border border-purple-200 text-slate-900 font-semibold"
                        : "text-slate-700"
                    }`}
                  >
                    {seg.speaker && (
                      <span className="text-purple-700 font-black mr-2">{seg.speaker}:</span>
                    )}
                    {seg.text}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Bottom Question Palette Bar (Authentic Computer-Delivered IELTS) */}
      {data && (
        <div className="fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 px-4 lg:px-8 flex items-center justify-between z-30 shadow-lg">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 hidden sm:inline">
            Question Palette
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {data.questions.map((q: any, idx: number) => {
              const qNum = q.id ?? idx + 1;
              const hasAns = !!userAnswers[qNum]?.trim();
              const isFlagged = !!flagged[qNum];
              return (
                <button
                  key={qNum}
                  onClick={() => {
                    document.getElementById(`lq-card-${qNum}`)?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className={`relative w-8 h-8 rounded-lg font-black text-xs flex items-center justify-center border transition-all ${
                    submitted
                      ? isCorrect(qNum)
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "bg-rose-600 border-rose-600 text-white"
                      : hasAns
                      ? "bg-purple-600 border-purple-600 text-white"
                      : "bg-slate-100 border-slate-200 text-slate-700 hover:border-purple-400"
                  }`}
                >
                  {idx + 1}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 border border-white" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="text-xs font-bold text-slate-500 hidden md:block">
            {answeredCount}/{data.questions.length} Answered
          </div>
        </div>
      )}

      {/* Result Modal */}
      <AnimatePresence>
        {submitted && showResultModal && data?.score && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl max-w-md w-full overflow-hidden border border-slate-200 shadow-2xl"
            >
              <div className="bg-purple-600 p-8 text-center text-white space-y-2">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-black tracking-tight">Kết quả bài nghe</h3>
                <p className="text-purple-100 text-sm font-medium">{data.section_type || "IELTS Listening"}</p>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                      Số câu đúng
                    </p>
                    <div className="text-3xl font-black text-slate-900 tabular-nums">
                      {data.score.rawScore}/{data.score.totalQuestions}
                    </div>
                  </div>
                  <div className="p-5 bg-purple-50 rounded-2xl border border-purple-200 text-center">
                    <p className="text-purple-600 text-[10px] font-black uppercase tracking-widest mb-1">
                      Estimated Band
                    </p>
                    <div className="text-4xl font-black text-purple-600 tabular-nums">{data.score.band}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowResultModal(false)}
                    className="py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Xem đáp án & Script
                  </button>
                  <button
                    onClick={() => generateTask()}
                    className="py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
                  >
                    Làm bài mới
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
