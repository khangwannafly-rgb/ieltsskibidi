import { convertRawToBand } from "@/lib/band-conversion";
import { isAnswerCorrect } from "@/lib/answers";
import { readJsonBody } from "@/lib/ai-response";
import { NextResponse } from "next/server";

interface CorrectAnswer {
  id: number;
  correct_answer: string;
  explanation?: string;
}

export async function POST(req: Request) {
  try {
    const { userAnswers, correctAnswers } = await readJsonBody<{
      userAnswers: string[];
      correctAnswers: CorrectAnswer[];
    }>(req);

    if (!Array.isArray(userAnswers) || !Array.isArray(correctAnswers) || correctAnswers.length === 0) {
      return NextResponse.json({ error: "Answers are required" }, { status: 400 });
    }

    let rawScore = 0;
    const results = correctAnswers.map((correct, index) => {
      const isCorrect = isAnswerCorrect(userAnswers[index], correct?.correct_answer);
      if (isCorrect) rawScore++;
      return {
        id: correct?.id,
        userAnswer: userAnswers[index] ?? "",
        correctAnswer: correct?.correct_answer ?? "",
        isCorrect,
        explanation: correct?.explanation ?? ""
      };
    });

    // Scale up to 40 questions for band calculation
    const scaledScore = Math.round((rawScore / correctAnswers.length) * 40);
    const band = convertRawToBand(scaledScore, 'reading');

    return NextResponse.json({
      rawScore,
      totalQuestions: correctAnswers.length,
      band,
      results
    });
  } catch (error) {
    console.error("Error scoring reading task:", error);
    return NextResponse.json({ error: "Failed to score reading task" }, { status: 500 });
  }
}
