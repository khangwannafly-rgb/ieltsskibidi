import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { targetScore = 6.5 } = await req.json();
    const model = getGeminiModel();
    const prompt = `You are an IELTS Reading test creator for Cambridge. Generate a high-quality, authentic IELTS Academic Reading passage (Section 1, 2, or 3) with exactly 13-14 questions.
    
    Passage Requirements:
    - Length: 700-900 words.
    - Tone: Academic, formal, sophisticated.
    - Topic: Choose from Science, History, Sociology, Environment, or Psychology.
    - Structure: Use multiple paragraphs with clear thematic progression.
    - Difficulty: Appropriate for someone aiming for a Band ${targetScore}.
    
    Question Requirements (Mixed types):
    - True/False/Not Given (TFN)
    - Multiple Choice (MCQ)
    - Matching Information/Headings (HEAD)
    - Summary Completion (FILL)
    
    Return ONLY a JSON object in this format:
    {
      "title": "string (Passage Title)",
      "passage": "string (markdown formatted, use ## for subheadings if necessary)",
      "difficulty_estimate_band": ${targetScore},
      "questions": [
        {
          "id": number,
          "type": "TFN" | "HEAD" | "MCQ" | "FILL",
          "question": "string (The actual question text)",
          "options": ["string"] // Required ONLY for MCQ and Matching Headings
        }
      ],
      "answers": [
        { 
          "id": number, 
          "correct_answer": "string", 
          "explanation": "string (Explain WHERE in the text the answer is found and WHY it's correct)" 
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const data = JSON.parse(text);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error("JSON parse error:", text);
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const data = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(text);
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Error generating reading task:", error);
    return NextResponse.json({ error: "Failed to generate reading task" }, { status: 500 });
  }
}
