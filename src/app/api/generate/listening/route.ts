import { getGeminiModel, hasGeminiApiKey } from "@/lib/gemini";
import { aiErrorResponse, parseAIJson, readJsonBody } from "@/lib/ai-response";
import { getFallbackListeningTask } from "@/lib/fallback-tasks";
import { NextResponse } from "next/server";

interface RawQuestion {
  id?: number | string;
  type?: string;
  word_limit?: string;
  question?: string;
  options?: string[];
}
interface RawAnswer {
  id?: number | string;
  correct_answer?: string;
  explanation?: string;
}

const LISTENING_FORMATS = [
  "Form / Note Completion (ONE WORD AND/OR A NUMBER) + Multiple Choice (A, B, C)",
  "Map / Floor Plan Labelling (Rooms A–F described in box_items) + Multiple Choice",
  "Matching Features / Opinions (Options A–E in box_items) + Flow-chart / Summary Completion",
  "Table / Lecture Note Completion (ONE WORD ONLY)",
];

export async function POST(req: Request) {
  try {
    const { targetScore = 6.5, part } = await readJsonBody<{ targetScore: number; part?: number }>(req);
    if (!hasGeminiApiKey()) {
      return NextResponse.json(getFallbackListeningTask(targetScore, part));
    }
    const model = getGeminiModel();
    const chosenPart = part && part >= 1 && part <= 4 ? part : Math.floor(Math.random() * 4) + 1;
    const formatHint = LISTENING_FORMATS[(chosenPart - 1) % LISTENING_FORMATS.length];

    const prompt = `You are a Senior Cambridge IELTS Listening test writer. Generate an authentic IELTS Listening Part ${chosenPart} with 10 questions using this format: ${formatHint}.

Section Rules:
- Part 1: Everyday social dialogue between 2 speakers (e.g., insurance claim, course booking, car rental). Include spelling of a surname and a distractor/self-correction.
- Part 2: Social monologue (e.g., library floor plan tour, heritage park orientation). Include a Floor Plan / Map box if appropriate.
- Part 3: Academic discussion between 2 students and/or tutor (e.g., psychology experiment, environmental dissertation). Include Matching Features (A–E) + Completion.
- Part 4: University lecture monologue on an academic topic (e.g., acoustics, botany, archaeology).
- Transcript MUST have each speaker turn on its own line ("Speaker: text") separated by a blank line.

Return ONLY valid JSON:
{
  "section_type": "Part ${chosenPart}",
  "context": "string",
  "instruction": "string (Official Cambridge instruction)",
  "box_title": "string (optional, for Map/Floor Plan or Matching Box A–E)",
  "box_items": ["string (optional list of rooms/features A–F)"],
  "transcript": "string",
  "difficulty_estimate_band": ${targetScore},
  "questions": [
    {
      "id": 1,
      "type": "FILL" | "MCQ",
      "word_limit": "ONE WORD AND/OR A NUMBER",
      "question": "string",
      "options": ["string"]
    }
  ],
  "answers": [
    {
      "id": 1,
      "correct_answer": "string",
      "explanation": "string"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = parseAIJson<{
      section_type?: string;
      context?: string;
      instruction?: string;
      box_title?: string;
      box_items?: string[];
      transcript?: string;
      difficulty_estimate_band?: number;
      questions?: RawQuestion[];
      answers?: RawAnswer[];
    }>(response.text());

    if (!data.transcript || !Array.isArray(data.questions) || !Array.isArray(data.answers) || data.questions.length === 0) {
      return NextResponse.json(getFallbackListeningTask(targetScore, part));
    }

    const answerMap = new Map<number, RawAnswer>();
    data.answers.forEach((a, i) => answerMap.set(Number(a.id ?? i + 1), a));

    const questions: { id: number; type: string; word_limit?: string; question: string; options?: string[] }[] = [];
    const answers: { id: number; correct_answer: string; explanation: string }[] = [];

    data.questions.forEach((q, i) => {
      const id = Number(q.id ?? i + 1);
      const ans = answerMap.get(id);
      if (!q.question || !ans || ans.correct_answer === undefined || ans.correct_answer === null) return;
      const options = Array.isArray(q.options) ? q.options.filter(Boolean).map(String) : [];
      const type = options.length >= 2 && String(q.type).toUpperCase() !== "FILL" ? "MCQ" : "FILL";
      questions.push({
        id,
        type,
        question: q.question,
        ...(q.word_limit ? { word_limit: q.word_limit } : {}),
        ...(type === "MCQ" ? { options } : {}),
      });
      answers.push({ id, correct_answer: String(ans.correct_answer), explanation: ans.explanation || "" });
    });

    if (questions.length === 0) {
      return NextResponse.json(getFallbackListeningTask(targetScore, part));
    }

    return NextResponse.json({
      section_type: data.section_type || `Part ${chosenPart}`,
      context: data.context || "Bài nghe IELTS",
      instruction: data.instruction || "Complete the questions below.",
      ...(data.box_title ? { box_title: data.box_title } : {}),
      ...(Array.isArray(data.box_items) && data.box_items.length > 0 ? { box_items: data.box_items } : {}),
      transcript: data.transcript,
      difficulty_estimate_band: data.difficulty_estimate_band ?? targetScore,
      questions,
      answers,
    });
  } catch (error) {
    return aiErrorResponse(error, "Không thể tạo đề Listening");
  }
}
