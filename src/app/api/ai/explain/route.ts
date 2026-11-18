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

interface SentenceEvalResult {
  usedTargetWord: boolean;
  bandEstimate: number;
  feedbackVi: string;
  grammarNoteVi: string;
  upgradedSentence: string;
  collocationSuggestions: string[];
}

export async function POST(req: Request) {
  const rl = checkRateLimit(req, "ai-explain", 30, 60_000);
  if (!rl.allowed) return rateLimitExceededResponse(rl.retryAfterSeconds);

  const body = await readJsonBody<{
    action?: "explain" | "evaluate-sentence";
    word?: string;
    context?: string;
    sentence?: string;
    meaning?: string;
    example?: string;
  }>(req);

  const word = sanitizeString(body.word, 120);
  if (!word) {
    return NextResponse.json({ error: "Word or phrase is required" }, { status: 400 });
  }

  // Chế độ 2: Chấm điểm & nâng cấp câu đặt với từ vựng học thuật C1-C2
  if (body.action === "evaluate-sentence") {
    const sentence = sanitizeString(body.sentence, 600);
    const referenceExample = sanitizeString(body.example, 400);
    if (!sentence || sentence.length < 8) {
      return NextResponse.json(
        { error: "Vui lòng viết câu đầy đủ (tối thiểu 8 ký tự)." },
        { status: 400 }
      );
    }

    const lowerSentence = sentence.toLowerCase();
    const targetParts = word
      .toLowerCase()
      .split(/\s+/)
      .filter((p) => p.length > 3);
    const usedWord =
      lowerSentence.includes(word.toLowerCase()) ||
      (targetParts.length > 0 && targetParts.every((p) => lowerSentence.includes(p.slice(0, 5))));

    const wordCount = sentence.trim().split(/\s+/).length;
    const hasComplexConnector =
      /\b(although|whereas|consequently|furthermore|moreover|notwithstanding|whereby|thereby|whilst|nonetheless|undeniably|imperative)\b/i.test(
        sentence
      );

    const fallbackBand = !usedWord
      ? 6.0
      : wordCount >= 16 && hasComplexConnector
        ? 8.0
        : wordCount >= 11
          ? 7.5
          : 7.0;

    const evalPrompt = `You are a Senior Cambridge IELTS Academic Writing Examiner.
Evaluate the student's academic sentence written using the target C1/C2 vocabulary term "${word}".
Student sentence: "${sentence}"

Return ONLY a JSON object with:
{
  "usedTargetWord": boolean,
  "bandEstimate": number (6.0, 6.5, 7.0, 7.5, 8.0, 8.5, or 9.0),
  "feedbackVi": "Detailed Vietnamese critique on how accurately and naturally they used '${word}' in an academic register",
  "grammarNoteVi": "Vietnamese feedback on sentence structure, grammar, and punctuation",
  "upgradedSentence": "A Band 8.5-9.0 Cambridge Academic rewrite of the student's sentence preserving their core idea and using '${word}' impeccably",
  "collocationSuggestions": ["2-3 advanced academic collocations with '${word}'"]
}`;

    const evalData = await generateAIJsonWithFallback<SentenceEvalResult>(
      evalPrompt,
      () => ({
        usedTargetWord: usedWord,
        bandEstimate: fallbackBand,
        feedbackVi: usedWord
          ? `Bạn đã vận dụng chính xác thuật ngữ C1–C2 "${word}" vào ngữ cảnh học thuật (${wordCount} từ). Để đạt mức Band 8.5+, hãy kết hợp thêm danh từ hóa (nominalisation) và trạng từ học thuật.`
          : `Câu của bạn chưa chứa rõ thuật ngữ mục tiêu "${word}". Hãy chèn trực tiếp cụm từ này để nâng điểm tiêu chí Lexical Resource.`,
        grammarNoteVi:
          wordCount >= 12
            ? "Cấu trúc câu hoàn chỉnh, mệnh đề rõ ràng và đảm bảo văn phong trang trọng (formal register) của IELTS Writing Task 2."
            : "Câu hơi ngắn; nên mở rộng bằng mệnh đề quan hệ hoặc mệnh đề chỉ nguyên nhân - hệ quả.",
        upgradedSentence:
          referenceExample ||
          `From a macroeconomic and policy standpoint, addressing ${word.toLowerCase()} requires coordinated institutional reform alongside long-term public investment.`,
        collocationSuggestions: [
          `address ${word.toLowerCase()} systematically`,
          `profound implications of ${word.toLowerCase()}`,
          `mitigate ${word.toLowerCase()}`,
        ],
      })
    );

    return NextResponse.json(evalData);
  }

  // Chế độ 1: Giải thích từ vựng & gợi ý Collocation
  const context = sanitizeString(body.context, 400);
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
