import { getGeminiModel, hasGeminiApiKey } from "@/lib/gemini";
import { aiErrorResponse, parseAIJson, readJsonBody } from "@/lib/ai-response";
import { getFallbackSpeakingTask } from "@/lib/fallback-tasks";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await readJsonBody<{ part: number | string; topic: string; targetScore: number }>(req);
    const part = Number(body.part) || 1;
    const { topic, targetScore = 6.5 } = body;
    if (!hasGeminiApiKey()) {
      return NextResponse.json(getFallbackSpeakingTask(part, targetScore, topic));
    }
    const model = getGeminiModel();

    let prompt = "";
    if (part === 1) {
      prompt = `Act as an official IELTS Speaking Examiner. Generate a Part 1 interview script.
      - Topic: Choose an everyday topic (e.g., Hometown, Accommodation, Work/Study, Music, Weather).
      - Include 4-5 questions that start from basic to slightly more descriptive.
      - Difficulty: Appropriate for someone aiming for a Band ${targetScore}.
      Return ONLY a JSON object: { 
        "topic": "string",
        "questions": ["string"],
        "sample_answers": ["string (Band 8.0 natural 2-3 sentence model answer for each question)"],
        "difficulty_estimate_band": ${targetScore},
        "examiner_notes": "string (Briefly explain what the examiner is looking for in this part at Band ${targetScore} level)"
      }`;
    } else if (part === 2) {
      prompt = `Act as an official IELTS Speaking Examiner. Generate a Part 2 Cue Card (Long Turn).
      - Topic: Randomly choose from (Person, Place, Object, Event, Activity).
      - Provide a clear prompt: "Describe [something]... You should say: [4 bullet points]... and explain why [something]."
      - Difficulty: Appropriate for someone aiming for a Band ${targetScore}.
      Return ONLY a JSON object: { 
        "task": "string (The full prompt text)", 
        "bullets": ["string"], 
        "topic": "string",
        "sample_answers": ["string (A complete Band 8.0 180-word model monologue)"],
        "difficulty_estimate_band": ${targetScore},
        "preparation_time": "1 minute",
        "speaking_time": "1-2 minutes"
      }`;
    } else {
      prompt = `Act as an official IELTS Speaking Examiner. Generate Part 3 Discussion questions.
      - These must be abstract and related to the Part 2 topic: ${topic || "society and culture"}.
      - Generate 4-6 deep, analytical questions.
      - Difficulty: Appropriate for someone aiming for a Band ${targetScore}.
      Return ONLY a JSON object: { 
        "topic": "string",
        "questions": ["string"],
        "sample_answers": ["string (Band 8.0 analytical model answer for each question)"],
        "difficulty_estimate_band": ${targetScore},
        "examiner_notes": "string (Explain the expected level of analysis and vocabulary for Band ${targetScore}+)"
      }`;
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = parseAIJson<{
      topic?: string;
      task?: string;
      bullets?: string[];
      questions?: string[];
      [key: string]: unknown;
    }>(response.text());

    if (part === 2) {
      if (!data.task) throw new Error("AI trả về Cue Card không đầy đủ");
      data.bullets = Array.isArray(data.bullets) ? data.bullets.filter(Boolean).map(String) : [];
    } else {
      const questions = Array.isArray(data.questions) ? data.questions.filter(Boolean).map(String) : [];
      if (questions.length === 0) throw new Error("AI trả về danh sách câu hỏi trống");
      data.questions = questions;
    }

    return NextResponse.json({ ...data, part });
  } catch (error) {
    return aiErrorResponse(error, "Không thể tạo câu hỏi Speaking");
  }
}
