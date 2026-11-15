import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/ai-response";
import {
  checkRateLimit,
  rateLimitExceededResponse,
  sanitizeString,
} from "@/lib/api-guard";
import { generateAIJsonWithFallback } from "@/lib/gemini";

interface ExplainResult {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  level: "C1" | "C2";
  meaning: string;
  collocations: string[];
  example: string;
}

export async function POST(req: Request) {
  const rl = checkRateLimit(req, "ai-explain", 25, 60_000);
  if (!rl.allowed) return rateLimitExceededResponse(rl.retryAfterSeconds);

  const body = await readJsonBody<{ word?: string; context?: string }>(req);
  const word = sanitizeString(body.word, 120);
  const context = sanitizeString(body.context, 400);

  if (!word) {
    return NextResponse.json({ error: "Word or phrase is required" }, { status: 400 });
  }

  const prompt = `You are a Cambridge IELTS Academic lexicographer.
Analyze the following English word or academic phrase for an IELTS Band 8.0+ candidate:
Term: "${word}"
${context ? `Context sentence: "${context}"` : ""}

Return ONLY a JSON object with:
{
  "word": "${word}",
  "phonetic": "IPA transcription (UK)",
  "partOfSpeech": "noun / verb / adjective / noun phrase / verb phrase",
  "level": "C1" or "C2",
  "meaning": "Accurate Vietnamese academic definition",
  "collocations": ["3 high-scoring IELTS academic collocations using this term"],
  "example": "1 Band 8.5 Academic IELTS Writing/Reading sentence using this term"
}`;

  const data = await generateAIJsonWithFallback<ExplainResult>(
    prompt,
    () => ({
      word,
      phonetic: `/ˈæk.ə.dem.ɪk/`,
      partOfSpeech: word.includes(" ") ? "academic phrase" : "academic term",
      level: "C1",
      meaning: `Thuật ngữ học thuật IELTS ("${word}") dùng để nâng cao tiêu chí Lexical Resource lên Band 7.5–8.5.`,
      collocations: [
        `effectively ${word.toLowerCase()}`,
        `${word.toLowerCase()} in contemporary society`,
        `significant ${word.toLowerCase()}`,
      ],
      example:
        context ||
        `Incorporating "${word}" into formal academic discourse demonstrates strong lexical precision and stylistic maturity.`,
    }),
    {
      cacheKey: `explain:${word.toLowerCase()}`,
      cacheTtlMs: 30 * 60 * 1000,
    }
  );

  return NextResponse.json(data);
}
