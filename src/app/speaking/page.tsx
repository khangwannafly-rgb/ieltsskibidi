"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mic,
  Square,
  Play,
  Pause,
  RefreshCw,
  User,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  MicOff,
  Info,
  Trophy,
  AlertCircle,
  Keyboard,
  Volume2,
  Sparkles,
  CheckCircle,
  Clock,
  BookOpen,
  FileText,
} from "lucide-react";
import { useUser } from "@/context/UserContext";

// --- Web Speech API typings ---
interface SpeechRecognitionResultLike {
  isFinal: boolean;
  0: { transcript: string };
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}
interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

const CRITERIA_LABELS: Record<string, string> = {
  fluency_and_coherence: "Fluency & Coherence",
  lexical_resource: "Lexical Resource",
  grammatical_range_and_accuracy: "Grammar Range & Accuracy",
  pronunciation: "Pronunciation",
};

interface AnswerState {
  text: string;
  audioUrl?: string;
  duration: number;
}

export default function SpeakingPage() {
  const { user, addSubmission } = useUser();
  const [part, setPart] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [score, setScore] = useState<any>(null);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scoring, setScoring] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, AnswerState>>({});
  const [interim, setInterim] = useState("");
  const [timer, setTimer] = useState(0);
  const [micError, setMicError] = useState<string | null>(null);
  const [typingMode, setTypingMode] = useState(false);
  const [sttSupported, setSttSupported] = useState(true);
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [showSample, setShowSample] = useState(false);

  // Part 2 Preparation state (1 minute prep + notes)
  const [prepTimeLeft, setPrepTimeLeft] = useState(60);
  const [isPrepping, setIsPrepping] = useState(false);
  const [part2Notes, setPart2Notes] = useState("");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const finalTextRef = useRef("");
  const recordingRef = useRef(false);
  const timerValueRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    setSttSupported(!!getSpeechRecognition());
    const urls = audioUrlsRef.current;
    return () => {
      recordingRef.current = false;
      recognitionRef.current?.abort();
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
      streamRef.current?.getTracks().forEach((t) => t.stop());
      urls.forEach((u) => URL.revokeObjectURL(u));
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          timerValueRef.current = prev + 1;
          return prev + 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Part 2 60s preparation timer
  useEffect(() => {
    if (!isPrepping) return;
    const id = setInterval(() => {
      setPrepTimeLeft((prev) => {
        if (prev <= 1) {
          setIsPrepping(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPrepping]);

  const questionList: string[] = data
    ? part === 2
      ? [data.task]
      : Array.isArray(data.questions)
      ? data.questions
      : []
    : [];
  const sampleAnswers: string[] = Array.isArray(data?.sample_answers) ? data.sample_answers : [];
  const currentSample = sampleAnswers[currentQuestionIdx] || sampleAnswers[0] || "";
  const currentAnswer = answers[currentQuestionIdx];
  const answeredCount = Object.values(answers).filter((a) => a.text.trim()).length;

  const speakText = useCallback((text: string) => {
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  }, []);

  const resetSession = () => {
    stopRecording(true);
    audioUrlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    audioUrlsRef.current = [];
    setAnswers({});
    setCurrentQuestionIdx(0);
    setTimer(0);
    setInterim("");
    setMicError(null);
    setScore(null);
    setShowScore(false);
    setShowSample(false);
    setIsPrepping(false);
    setPrepTimeLeft(60);
    setPart2Notes("");
  };

  const generateTask = async (selectedPart: number) => {
    resetSession();
    setLoading(true);
    setData(null);
    setPart(selectedPart);
    try {
      const res = await fetch("/api/generate/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          part: selectedPart,
          targetScore: user?.targetScore || 6.5,
          topic: selectedPart === 3 ? data?.topic : undefined,
        }),
      });
      const json = await res.json().catch(() => ({ error: "Phản hồi từ máy chủ không hợp lệ" }));
      if (!res.ok && !json.error) json.error = "Không thể tạo câu hỏi";
      setData(json);
    } catch (error) {
      console.error(error);
      setData({ error: "Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng và thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const saveAnswer = (idx: number, patch: Partial<AnswerState>) => {
    setAnswers((prev) => ({
      ...prev,
      [idx]: { ...(prev[idx] ?? { text: "", duration: 0 }), ...patch },
    }));
  };

  const startRecording = async () => {
    setIsPrepping(false);
    setMicError(null);
    setInterim("");
    finalTextRef.current = "";
    const idx = currentQuestionIdx;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      if (typeof MediaRecorder !== "undefined") {
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
          if (blob.size > 0) {
            const url = URL.createObjectURL(blob);
            audioUrlsRef.current.push(url);
            saveAnswer(idx, { audioUrl: url });
          }
          stream.getTracks().forEach((t) => t.stop());
        };
        recorder.start();
        recorderRef.current = recorder;
      }
    } catch (error) {
      console.error("Microphone error:", error);
      setMicError(
        "Không thể truy cập micro. Hãy cấp quyền micro cho trình duyệt, hoặc bấm nút 'Nhập bằng phím' ở góc trên."
      );
      return;
    }

    const SR = getSpeechRecognition();
    if (SR) {
      const recognition = new SR();
      recognition.lang = "en-US";
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (e) => {
        let interimText = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const r = e.results[i];
          if (r.isFinal) finalTextRef.current += r[0].transcript.trim() + " ";
          else interimText += r[0].transcript;
        }
        setInterim(interimText);
      };
      recognition.onerror = (e) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          setMicError("Trình duyệt chặn nhận dạng giọng nói. Bạn có thể nhập câu trả lời bằng bàn phím.");
        } else if (e.error === "network") {
          setMicError("Nhận dạng giọng nói cần kết nối Internet. Bạn có thể nhập câu trả lời bằng bàn phím.");
        }
      };
      recognition.onend = () => {
        if (recordingRef.current) {
          try {
            recognition.start();
          } catch {
            /* ignore */
          }
        }
      };
      try {
        recognition.start();
        recognitionRef.current = recognition;
      } catch (error) {
        console.error("Speech recognition start error:", error);
      }
    }

    recordingRef.current = true;
    timerValueRef.current = 0;
    setTimer(0);
    setIsRecording(true);
  };

  function stopRecording(discard = false) {
    if (!recordingRef.current) return;
    recordingRef.current = false;
    setIsRecording(false);
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    recorderRef.current = null;

    if (!discard) {
      const idx = currentQuestionIdx;
      const spoken = (finalTextRef.current + " " + interim).replace(/\s+/g, " ").trim();
      setAnswers((prev) => {
        const existing = prev[idx]?.text?.trim();
        return {
          ...prev,
          [idx]: {
            ...prev[idx],
            text: spoken || existing || "",
            duration: timerValueRef.current,
          },
        };
      });
    }
    setInterim("");
  }

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const togglePlayback = (idx: number) => {
    const url = answers[idx]?.audioUrl;
    if (!url) return;
    if (playingIdx === idx && audioRef.current) {
      audioRef.current.pause();
      setPlayingIdx(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(url);
    audio.onended = () => setPlayingIdx(null);
    audio.play().catch((err) => console.error(err));
    audioRef.current = audio;
    setPlayingIdx(idx);
  };

  const clearAnswer = (idx: number) => {
    if (playingIdx === idx) audioRef.current?.pause();
    setAnswers((prev) => {
      const n = { ...prev };
      delete n[idx];
      return n;
    });
  };

  const goToQuestion = (idx: number) => {
    if (isRecording) stopRecording();
    setCurrentQuestionIdx(idx);
    setTimer(answers[idx]?.duration || 0);
    setShowSample(false);
  };

  const submitTest = async () => {
    if (isRecording) stopRecording();
    const payloadAnswers = questionList
      .map((q, i) => ({
        question: q,
        answer: answers[i]?.text?.trim() || "",
        duration: answers[i]?.duration || 0,
      }))
      .filter((a) => a.answer);

    if (payloadAnswers.length === 0) {
      alert("Bạn chưa trả lời câu hỏi nào. Hãy ghi âm hoặc nhập câu trả lời trước khi chấm điểm.");
      return;
    }

    setScoring(true);
    try {
      const res = await fetch("/api/score/speaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          part,
          questions: questionList,
          answers: payloadAnswers,
        }),
      });

      const scoreData = await res.json().catch(() => ({}));
      if (!res.ok || scoreData.error) {
        throw new Error(scoreData.error || "Failed to score speaking task");
      }

      setScore(scoreData);
      setShowScore(true);

      addSubmission({
        skill: "speaking",
        band: scoreData.overallBand,
        details: {
          part,
          topic: data.topic,
          criteria: scoreData.criteria,
          transcript: scoreData.transcript,
          strengths: scoreData.strengths,
          improvements: scoreData.improvements,
          lexical_upgrades: scoreData.lexical_upgrades,
          duration: payloadAnswers.reduce((sum, a) => sum + a.duration, 0),
        },
      });
    } catch (error) {
      console.error("Error scoring speaking:", error);
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra khi chấm điểm. Vui lòng thử lại.");
    } finally {
      setScoring(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-[#F9FAFB] p-6">
        <div className="w-full max-w-md p-10 bg-white rounded-3xl border border-slate-200 text-center space-y-6 shadow-xl">
          <div className="relative w-24 h-24 mx-auto">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-b-4 border-purple-600 rounded-full"
            />
            <Mic className="absolute inset-0 m-auto w-10 h-10 text-purple-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
              Đang chuẩn bị Speaking Part {part}...
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              Giám khảo AI đang soạn bộ câu hỏi và bài mẫu Band 8.0 sát đề thi thực tế.
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
            <MicOff className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 uppercase">Rất tiếc!</h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">{data.error}</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setData(null)} className="btn-secondary flex-1 py-3.5 text-xs">
              Quay lại
            </button>
            <button onClick={() => generateTask(part)} className="btn-primary flex-1 py-3.5 text-xs">
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#F8FAFC] py-6 px-4 md:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest block">
                Cambridge IELTS Speaking Simulator
              </span>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Phòng thi Speaking 1-1 cùng Giám khảo AI
              </h1>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[
              { id: 1, label: "Part 1 (Interview)" },
              { id: 2, label: "Part 2 (Cue Card)" },
              { id: 3, label: "Part 3 (Discussion)" },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  if (answeredCount > 0 && !score && !window.confirm("Câu trả lời hiện tại sẽ bị mất. Tiếp tục?"))
                    return;
                  generateTask(p.id);
                }}
                className={`px-3.5 py-2 rounded-lg font-black text-xs transition-all ${
                  data && part === p.id
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-purple-600"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {!data ? (
          <div className="space-y-6">
            {!sttSupported && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                Trình duyệt này không hỗ trợ nhận dạng giọng nói tự động. Bạn vẫn có thể ghi âm và nhập câu trả lời bằng bàn phím (khuyên dùng Chrome hoặc Edge).
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  id: 1,
                  title: "Part 1 · Introduction & Interview",
                  time: "4–5 phút · 4 câu hỏi",
                  desc: "Trả lời các câu hỏi quen thuộc về bản thân, công việc, học tập, sở thích hàng ngày (20–30 giây/câu).",
                  icon: MessageSquare,
                },
                {
                  id: 2,
                  title: "Part 2 · Individual Long Turn",
                  time: "1 phút chuẩn bị · Nói 1–2 phút",
                  desc: "Nhận thẻ chủ đề (Cue Card) kèm 4 gợi ý, có 1 phút ghi chú vào giấy nháp trước khi trình bày liên tục.",
                  icon: Trophy,
                },
                {
                  id: 3,
                  title: "Part 3 · Two-Way Discussion",
                  time: "4–5 phút · Thảo luận học thuật",
                  desc: "Phân tích sâu các vấn đề xã hội, trừu tượng mở rộng từ chủ đề Part 2 với cấu trúc lập luận chặt chẽ.",
                  icon: ShieldCheck,
                },
              ].map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ y: -4 }}
                  onClick={() => generateTask(item.id)}
                  className="bg-white rounded-2xl text-left p-6 border border-slate-200 hover:border-purple-400 transition-all shadow-sm hover:shadow-md flex flex-col justify-between gap-5 group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 border border-purple-100">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        {item.time}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-purple-600 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-slate-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-black text-purple-600">
                    <span>Bắt đầu thi thử</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Examiner Bar */}
            <div className="px-6 py-4 border-b border-slate-200 flex flex-wrap gap-3 justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white font-black">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">Examiner: Mr. Anderson</span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 font-bold text-[10px] uppercase">
                      Part {part}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Topic: <span className="font-bold text-slate-700">{data.topic || "General IELTS Topic"}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSample((s) => !s)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    showSample
                      ? "bg-amber-50 border-amber-300 text-amber-800"
                      : "bg-white border-slate-200 text-slate-600 hover:border-purple-300"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {showSample ? "Ẩn bài mẫu Band 8.0" : "Xem gợi ý & Bài mẫu Band 8.0"}
                </button>

                <button
                  onClick={() => setTypingMode((m) => !m)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                    typingMode
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-slate-600 border-slate-200 hover:text-purple-600"
                  }`}
                >
                  <Keyboard className="w-3.5 h-3.5" />
                  {typingMode ? "Đang gõ phím" : "Nhập bằng phím"}
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Question / Cue Card Area */}
              {part === 2 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left: Official Candidate Task Card (Cue Card) */}
                  <div className="lg:col-span-7 bg-amber-50/60 border-2 border-amber-200/80 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
                      <span className="text-[11px] font-black uppercase tracking-widest text-amber-900">
                        Candidate Task Card · IELTS Speaking Part 2
                      </span>
                      <button
                        onClick={() => speakText(data.task)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-amber-800 hover:bg-amber-100 text-xs font-bold transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5" /> Nghe đề
                      </button>
                    </div>

                    <h3 className="text-lg md:text-xl font-black text-slate-900 leading-snug">{data.task}</h3>

                    {Array.isArray(data.bullets) && data.bullets.length > 0 && (
                      <div className="space-y-2 pt-1">
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">You should say:</p>
                        <ul className="space-y-2 pl-1">
                          {data.bullets.map((b: string, i: number) => (
                            <li key={i} className="flex items-start gap-2.5 text-sm font-semibold text-slate-800">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right: 1-Minute Preparation Timer & Scratchpad */}
                  <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-purple-600" />
                        <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                          Giấy nháp 1 phút (Notes)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs border ${
                            isPrepping
                              ? "bg-amber-100 border-amber-300 text-amber-900 animate-pulse"
                              : "bg-white border-slate-200 text-slate-600"
                          }`}
                        >
                          <Clock className="w-3 h-3 inline mr-1" />
                          Prep: {formatTimer(prepTimeLeft)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (isPrepping) {
                              setIsPrepping(false);
                            } else {
                              setPrepTimeLeft(60);
                              setIsPrepping(true);
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all"
                        >
                          {isPrepping ? "Dừng" : "Đếm 1 phút"}
                        </button>
                      </div>
                    </div>

                    <textarea
                      value={part2Notes}
                      onChange={(e) => setPart2Notes(e.target.value)}
                      placeholder="Ghi nhanh từ khóa, ý chính (Who, When, What, Why) trong 1 phút chuẩn bị giống kỳ thi thật..."
                      className="w-full h-32 p-3 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 outline-none focus:border-purple-400 resize-none"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
                  <div className="flex items-center justify-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-black uppercase tracking-wider">
                      Câu hỏi {currentQuestionIdx + 1} / {questionList.length}
                    </span>
                    <button
                      onClick={() => speakText(questionList[currentQuestionIdx])}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-purple-600 text-xs font-bold transition-all"
                    >
                      <Volume2 className="w-3.5 h-3.5" /> Nghe câu hỏi
                    </button>
                  </div>

                  <p className="text-xl md:text-2xl font-black text-slate-900 max-w-2xl mx-auto leading-snug">
                    &ldquo;{questionList[currentQuestionIdx]}&rdquo;
                  </p>

                  {/* Question Dots */}
                  <div className="flex justify-center gap-2 pt-1">
                    {questionList.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => goToQuestion(i)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                          currentQuestionIdx === i
                            ? "bg-purple-600 border-purple-600 text-white"
                            : answers[i]?.text?.trim()
                            ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                            : "bg-white border-slate-200 text-slate-500 hover:border-purple-300"
                        }`}
                      >
                        Q{i + 1} {answers[i]?.text?.trim() ? "✓" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Collapsible Examiner Notes & Band 8.0 Sample Answer */}
              <AnimatePresence>
                {showSample && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-3 overflow-hidden"
                  >
                    {data.examiner_notes && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-800 block">
                           Chiến thuật phòng thi (Examiner Tip)
                        </span>
                        <p className="text-xs font-semibold text-slate-800 leading-relaxed">{data.examiner_notes}</p>
                      </div>
                    )}
                    {currentSample && (
                      <div className="space-y-2 pt-2 border-t border-amber-200/70">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-widest text-purple-700">
                            Câu trả lời mẫu Band 8.0+ (Model Answer)
                          </span>
                          <button
                            type="button"
                            onClick={() => speakText(currentSample)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-purple-200 text-purple-700 text-xs font-bold hover:bg-purple-50"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> Nghe bài mẫu
                          </button>
                        </div>
                        <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-line bg-white/80 p-4 rounded-xl border border-amber-100">
                          {currentSample}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Recording / Typing Area */}
              {typingMode ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600 block">
                    Nhập câu trả lời tiếng Anh của bạn cho câu hỏi này:
                  </label>
                  <textarea
                    value={currentAnswer?.text || ""}
                    onChange={(e) => saveAnswer(currentQuestionIdx, { text: e.target.value })}
                    placeholder={
                      part === 2
                        ? "Nhập bài nói Part 2 của bạn (khoảng 180–250 từ tương đương 1.5–2 phút nói)..."
                        : "Nhập câu trả lời của bạn bằng tiếng Anh (3–5 câu đầy đủ ý)..."
                    }
                    className="w-full h-40 p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-purple-500 outline-none text-sm font-medium text-slate-900 resize-y"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-5 py-4">
                  <div className="flex items-center gap-6">
                    <button
                      onClick={toggleRecording}
                      aria-label={isRecording ? "Dừng ghi âm" : "Bắt đầu ghi âm"}
                      className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-lg border-4 border-white ${
                        isRecording
                          ? "bg-rose-600 hover:bg-rose-500 shadow-rose-500/30 scale-105"
                          : "bg-purple-600 hover:bg-purple-500 shadow-purple-500/30"
                      }`}
                    >
                      {isRecording ? (
                        <Square className="w-7 h-7 text-white fill-white" />
                      ) : (
                        <Mic className="w-8 h-8 text-white" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div
                        className={`px-4 py-2 rounded-xl font-mono font-black text-2xl flex items-center gap-2.5 border ${
                          isRecording
                            ? "bg-rose-50 border-rose-200 text-rose-600"
                            : "bg-slate-50 border-slate-200 text-slate-600"
                        }`}
                      >
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isRecording ? "bg-rose-500 animate-ping" : "bg-slate-300"
                          }`}
                        />
                        {formatTimer(timer)}
                        {part === 2 && <span className="text-xs font-sans font-bold text-slate-400">/ 2:00</span>}
                      </div>
                      <p className="text-xs font-semibold text-slate-500">
                        {isRecording
                          ? "Đang thu âm... Nhấn nút đỏ để dừng"
                          : currentAnswer?.text
                          ? "Đã lưu câu trả lời (nhấn Mic để nói lại)"
                          : "Nhấn biểu tượng Micro để bắt đầu nói"}
                      </p>
                    </div>
                  </div>

                  {/* Live transcript / Editable recognized text */}
                  {(isRecording || currentAnswer?.text) && (
                    <div className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-purple-600">
                          {isRecording ? "Transcript trực tiếp..." : "Transcript câu trả lời (có thể sửa lại nếu máy nghe nhầm)"}
                        </span>
                        {!isRecording && currentAnswer && (
                          <div className="flex items-center gap-2">
                            {currentAnswer.audioUrl && (
                              <button
                                onClick={() => togglePlayback(currentQuestionIdx)}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold hover:bg-purple-200"
                              >
                                {playingIdx === currentQuestionIdx ? (
                                  <Pause className="w-3 h-3 fill-current" />
                                ) : (
                                  <Play className="w-3 h-3 fill-current" />
                                )}
                                {playingIdx === currentQuestionIdx ? "Tạm dừng" : "Nghe lại giọng bạn"}
                              </button>
                            )}
                            <button
                              onClick={() => clearAnswer(currentQuestionIdx)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300"
                            >
                              <RefreshCw className="w-3 h-3" /> Xoá
                            </button>
                          </div>
                        )}
                      </div>

                      {isRecording ? (
                        <p className="text-slate-800 text-sm font-medium leading-relaxed min-h-[2.5rem]">
                          {(finalTextRef.current + " " + interim).trim() ||
                            (sttSupported
                              ? "Hãy nói tiếng Anh vào micro..."
                              : "Trình duyệt không hỗ trợ STT tự động — bạn có thể gõ lại sau khi dừng ghi âm.")}
                        </p>
                      ) : (
                        <textarea
                          value={currentAnswer?.text || ""}
                          onChange={(e) => saveAnswer(currentQuestionIdx, { text: e.target.value })}
                          className="w-full min-h-[80px] bg-white p-3 rounded-xl border border-slate-200 outline-none text-slate-800 text-sm font-medium leading-relaxed resize-y"
                        />
                      )}
                    </div>
                  )}

                  {micError && (
                    <div className="flex items-start gap-2.5 w-full p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{micError}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Navigation Bar */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4">
              <button
                onClick={() => generateTask(part)}
                className="flex items-center gap-2 text-slate-600 hover:text-purple-600 font-bold text-xs transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                Đổi bộ đề Part {part} khác
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-500">
                  Đã trả lời: <strong className="text-slate-900">{answeredCount}</strong>/{questionList.length}
                </span>

                {part !== 2 && currentQuestionIdx > 0 && (
                  <button
                    onClick={() => goToQuestion(currentQuestionIdx - 1)}
                    className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-700 px-3.5 py-2.5 rounded-xl font-bold text-xs border border-slate-200"
                  >
                    <ChevronLeft className="w-4 h-4" /> Câu trước
                  </button>
                )}

                {part !== 2 && currentQuestionIdx < questionList.length - 1 && (
                  <button
                    onClick={() => goToQuestion(currentQuestionIdx + 1)}
                    className="flex items-center gap-1 bg-white hover:bg-slate-100 text-slate-900 px-4 py-2.5 rounded-xl font-bold text-xs border border-slate-200 shadow-sm"
                  >
                    Câu tiếp theo <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                {score ? (
                  <button
                    onClick={() => setShowScore(true)}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-sm"
                  >
                    Xem kết quả (Band {score.overallBand})
                  </button>
                ) : (
                  <button
                    onClick={submitTest}
                    disabled={scoring || isRecording || answeredCount === 0}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider shadow-sm disabled:opacity-40"
                  >
                    {scoring ? "Đang chấm..." : "Chấm điểm Speaking"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Score Display Modal */}
        <AnimatePresence>
          {score && showScore && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-slate-200 shadow-2xl rounded-3xl"
              >
                <div className="p-6 md:p-8 border-b border-slate-200 bg-slate-50 flex justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-md">
                      <Trophy className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                        Báo cáo Speaking Part {part}
                      </h2>
                      <p className="text-slate-500 font-medium text-sm">
                        Đánh giá theo 4 tiêu chí chấm thi IELTS Speaking chính thức
                      </p>
                    </div>
                  </div>
                  <div className="bg-purple-600 px-6 py-4 rounded-2xl text-center text-white shrink-0">
                    <div className="text-[10px] font-black uppercase tracking-widest text-purple-200">Overall Band</div>
                    <div className="text-3xl font-black">{score.overallBand}</div>
                  </div>
                </div>

                <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {Object.entries(score.criteria || {}).map(([key, value]: [string, any]) => (
                      <div
                        key={key}
                        className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-1"
                      >
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
                          {CRITERIA_LABELS[key] || key}
                        </div>
                        <div className="text-2xl font-black text-purple-600">{value?.score ?? "—"}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                      Nhận xét từng tiêu chí
                    </h3>
                    <div className="grid gap-3">
                      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                      {Object.entries(score.criteria || {}).map(([key, value]: [string, any]) =>
                        value?.feedback ? (
                          <div key={key} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <h4 className="font-black text-purple-700 uppercase text-xs">
                                {CRITERIA_LABELS[key] || key}
                              </h4>
                              <span className="px-2.5 py-0.5 bg-purple-50 rounded-md text-purple-700 text-xs font-black border border-purple-200">
                                Band {value.score}
                              </span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed">{value.feedback}</p>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>

                  {(score.strengths?.length > 0 || score.improvements?.length > 0) && (
                    <div className="grid md:grid-cols-2 gap-4">
                      {score.strengths?.length > 0 && (
                        <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                          <h4 className="font-black text-emerald-800 uppercase text-xs tracking-wider">Điểm mạnh</h4>
                          <ul className="space-y-2 text-xs font-semibold text-slate-700">
                            {score.strengths.map((s: string, i: number) => (
                              <li key={i} className="flex gap-2">
                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {score.improvements?.length > 0 && (
                        <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2.5">
                          <h4 className="font-black text-purple-800 uppercase text-xs tracking-wider">Cần cải thiện</h4>
                          <ul className="space-y-2 text-xs font-semibold text-slate-700">
                            {score.improvements.map((s: string, i: number) => (
                              <li key={i} className="flex gap-2">
                                <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                                <span>{s}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {score.lexical_upgrades?.length > 0 && (
                    <div className="space-y-2.5">
                      <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">
                        Nâng cấp từ vựng Band 7.5+
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {score.lexical_upgrades.map((u: { original?: string; upgrade: string }, i: number) => (
                          <div
                            key={i}
                            className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold"
                          >
                            {u.original && <span className="text-slate-400 line-through mr-2">{u.original}</span>}
                            <span className="text-purple-700">→ {u.upgrade}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 border-t border-slate-200 bg-slate-50 flex gap-3">
                  <button
                    onClick={() => generateTask(part)}
                    className="flex-1 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-200"
                  >
                    Làm đề mới
                  </button>
                  <button
                    onClick={() => setShowScore(false)}
                    className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl"
                  >
                    Đóng & Xem lại bài mẫu
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
