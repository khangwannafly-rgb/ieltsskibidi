import { NextResponse } from "next/server";
import { hasGeminiApiKey } from "@/lib/gemini";
import { getStoreStats } from "@/lib/server-store";

export async function GET() {
  const storeStats = getStoreStats();
  return NextResponse.json({
    status: "ok",
    service: "IELTS SKIBIDI Academic Backend",
    timestamp: new Date().toISOString(),
    aiEngine: {
      geminiConfigured: hasGeminiApiKey(),
      failoverMode: "Multi-Model Gemini + Built-in Cambridge Task Bank",
    },
    taskBank: {
      readingPassages: 4,
      listeningRecordings: 6,
      writingTask1Variants: 7,
      writingTask2Variants: 5,
      speakingTopics: 12,
    },
    store: storeStats,
  });
}
