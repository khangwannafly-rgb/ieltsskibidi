import { convertRawToBand } from "@/lib/band-conversion";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userAnswers, correctAnswers } = await req.json();

    if (!userAnswers || !correctAnswers) {
      return NextResponse.json({ error: "Answers are required" }, { status: 400 });
    }

    let rawScore = 0;
    const results = correctAnswers.map((correct: any, index: number) => {
      const isCorrect = userAnswers[index]?.toLowerCase() === correct.correct_answer.toLowerCase();
      if (isCorrect) rawScore++;
      return {
        id: correct.id,
        userAnswer: userAnswers[index],
        correctAnswer: correct.correct_answer,
        isCorrect,
        explanation: correct.explanation
      };
    });

    const scaledScore = Math.round((rawScore / correctAnswers.length) * 40);
    const band = convertRawToBand(scaledScore, 'listening');

    return NextResponse.json({
      rawScore,
      totalQuestions: correctAnswers.length,
      band,
      results
    });
  } catch (error) {
    console.error("Error scoring listening task:", error);
    return NextResponse.json({ error: "Failed to score listening task" }, { status: 500 });
  }
}
