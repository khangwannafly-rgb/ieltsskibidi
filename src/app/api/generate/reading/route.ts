import { getGeminiModel, hasGeminiApiKey } from "@/lib/gemini";
import { parseAIJson, readJsonBody } from "@/lib/ai-response";
import { checkRateLimit, rateLimitExceededResponse, sanitizeTargetBand } from "@/lib/api-guard";
import { getFallbackReadingTask } from "@/lib/fallback-tasks";
import { NextResponse } from "next/server";

interface RawQuestion {
  id?: number | string;
  type?: string;
  group?: string;
  instruction?: string;
  box_title?: string;
  box_items?: string[];
  word_limit?: string;
  question?: string;
  options?: string[];
}
interface RawAnswer {
  id?: number | string;
  correct_answer?: string;
  explanation?: string;
}

const BLUEPRINTS = [
  "Blueprint A (Passage 1 style): Questions 1–5 Sentence/Note Completion (type: FILL, ONE WORD AND/OR A NUMBER), Questions 6–10 True/False/Not Given (type: TFN), Questions 11–13 Matching Paragraph Information & Multiple Choice (type: HEAD / MCQ).",
  "Blueprint B (Passage 2 style): Questions 1–4 Matching Researchers/Experts (type: HEAD with box_title 'List of Researchers' and box_items A–D), Questions 5–9 Yes/No/Not Given (type: YNN), Questions 10–13 Summary Completion (type: FILL, NO MORE THAN TWO WORDS).",
  "Blueprint C (Passage 3 style): Questions 1–6 Matching Headings (type: HEAD with box_title 'List of Headings' and Roman numerals i–vii in box_items), Questions 7–10 Summary Completion with Word Bank (type: HEAD with box_title 'Word Bank A–F' and box_items), Questions 11–13 Yes/No/Not Given (type: YNN).",
  "Blueprint D (Passage 2/3 style): Questions 1–4 Matching Sentence Endings (type: HEAD with box_title 'List of Sentence Endings A–F' and box_items), Questions 5–9 Note/Table Completion (type: FILL), Questions 10–13 Multiple Choice A–D (type: MCQ).",
];

const TOPICS = [
  "Urban Vertical Farming & Food Security",
  "Cognitive Neuroscience of Decision Fatigue",
  "Deciphering Ancient Undeciphered Scripts",
  "Deep-Sea Hydrothermal Vents & Astrobiology",
  "The History of Marine Chronometers & Navigation",
  "Bio-inspired Architecture & Termite Mound Cooling",
  "Behavioural Economics of Scarcity",
  "Pleistocene Megafauna Extinction Debates",
  "Quantum Cryptography & Information Security",
  "The Ecological Role of Mycorrhizal Fungal Networks",
];

export async function POST(req: Request) {
  const rl = checkRateLimit(req, "gen-reading", 25, 60_000);
  if (!rl.allowed) return rateLimitExceededResponse(rl.retryAfterSeconds);

  const body = await readJsonBody<{ targetScore: number; section?: string }>(req);
  const targetScore = sanitizeTargetBand(body.targetScore, 6.5);
  const section = body.section;
  try {
    if (!hasGeminiApiKey()) {
      return NextResponse.json(getFallbackReadingTask(targetScore, section));
    }
    const model = getGeminiModel();
    const randomBlueprint = BLUEPRINTS[Math.floor(Math.random() * BLUEPRINTS.length)];
    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];

    const prompt = `You are a Senior Cambridge IELTS Reading test writer. Generate an authentic IELTS Academic Reading passage (${section && section !== "all" ? section : "Reading Passage 1, 2, or 3"}) on the topic "${randomTopic}" with exactly 13 questions.

Follow this exact Question Group Blueprint so the test format is diverse:
${randomBlueprint}

Passage Requirements:
- Length: 650–800 words, divided into 6 or 7 labelled paragraphs: "## Paragraph A", "## Paragraph B", etc.
- Tone: Authentic Cambridge Academic journal style, Band ${targetScore}+.

Question Type Rules:
- "TFN": True / False / Not Given. correct_answer MUST be "True", "False", or "Not Given".
- "YNN": Yes / No / Not Given (writer's claims). correct_answer MUST be "Yes", "No", or "Not Given".
- "HEAD": Matching Headings (i–vii), Matching Information (Paragraph A–F), Matching Researchers (A–D), Matching Sentence Endings (A–F), or Summary Word Bank (A–F). Provide "options" array and, on the first question of the group, include "box_title" and "box_items" if a reference box is used.
- "FILL": Sentence / Note / Summary Completion. Include "word_limit" (e.g. "NO MORE THAN TWO WORDS" or "ONE WORD ONLY").
- "MCQ": 4 options A–D.

Return ONLY valid JSON:
{
  "section": "Reading Passage 1" | "Reading Passage 2" | "Reading Passage 3",
  "title": "string",
  "subtitle": "string",
  "passage": "string (with ## Paragraph A, ## Paragraph B...)",
  "difficulty_estimate_band": ${targetScore},
  "questions": [
    {
      "id": 1,
      "type": "TFN" | "YNN" | "HEAD" | "FILL" | "MCQ",
      "group": "string (e.g. 'Questions 1–5: Matching Headings')",
      "instruction": "string (Official Cambridge instruction on the first question of each group)",
      "box_title": "string (optional, e.g. 'List of Headings' or 'List of Researchers')",
      "box_items": ["string (optional list of items in the reference box)"],
      "word_limit": "string (optional, for FILL)",
      "question": "string",
      "options": ["string"]
    }
  ],
  "answers": [
    {
      "id": 1,
      "correct_answer": "string",
      "explanation": "string (Quote the exact sentence in the passage and explain in Vietnamese)"
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = parseAIJson<{
      section?: string;
      title?: string;
      subtitle?: string;
      passage?: string;
      difficulty_estimate_band?: number;
      questions?: RawQuestion[];
      answers?: RawAnswer[];
    }>(response.text());

    if (!data.passage || !Array.isArray(data.questions) || !Array.isArray(data.answers) || data.questions.length === 0) {
      return NextResponse.json(getFallbackReadingTask(targetScore, section));
    }

    const answerMap = new Map<number, RawAnswer>();
    data.answers.forEach((a, i) => answerMap.set(Number(a.id ?? i + 1), a));

    const questions: RawQuestion[] = [];
    const answers: { id: number; correct_answer: string; explanation: string }[] = [];

    data.questions.forEach((q, i) => {
      const id = Number(q.id ?? i + 1);
      const ans = answerMap.get(id);
      if (!q.question || !ans || ans.correct_answer === undefined || ans.correct_answer === null) return;
      let type = String(q.type || "FILL").toUpperCase();
      const options = Array.isArray(q.options) ? q.options.filter(Boolean).map(String) : [];
      if ((type === "MCQ" || type === "HEAD") && options.length < 2) type = "FILL";
      questions.push({
        id,
        type,
        question: q.question,
        ...(q.group ? { group: q.group } : {}),
        ...(q.instruction ? { instruction: q.instruction } : {}),
        ...(q.box_title ? { box_title: q.box_title } : {}),
        ...(Array.isArray(q.box_items) && q.box_items.length > 0 ? { box_items: q.box_items } : {}),
        ...(q.word_limit ? { word_limit: q.word_limit } : {}),
        ...(options.length >= 2 && type !== "TFN" && type !== "YNN" && type !== "FILL" ? { options } : {}),
      });
      answers.push({ id, correct_answer: String(ans.correct_answer), explanation: ans.explanation || "" });
    });

    if (questions.length === 0) {
      return NextResponse.json(getFallbackReadingTask(targetScore, section));
    }

    return NextResponse.json({
      section: data.section || "Reading Passage 1",
      title: data.title || "Reading Passage",
      subtitle: data.subtitle || "",
      passage: data.passage,
      difficulty_estimate_band: data.difficulty_estimate_band ?? targetScore,
      questions,
      answers,
    });
  } catch (error) {
    console.warn("[Reading API] Gemini failed, falling back to Cambridge Reading Bank:", error);
    return NextResponse.json(getFallbackReadingTask(targetScore, section));
  }
}
