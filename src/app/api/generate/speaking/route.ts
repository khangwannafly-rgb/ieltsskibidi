import { model } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { part, topic, targetScore = 6.5 } = await req.json();

    let prompt = "";
    if (part === 1) {
      prompt = `Act as an official IELTS Speaking Examiner. Generate a Part 1 interview script.
      - Topic: Choose an everyday topic (e.g., Hometown, Accommodation, Work/Study, Music, Weather).
      - Include 4-5 questions that start from basic to slightly more descriptive.
      - Difficulty: Appropriate for someone aiming for a Band ${targetScore}.
      Return ONLY a JSON object: { 
        "topic": "string",
        "questions": ["string"],
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
        "difficulty_estimate_band": ${targetScore},
        "examiner_notes": "string (Explain the expected level of analysis and vocabulary for Band ${targetScore}+)"
      }`;
    }

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
    console.error("Error generating speaking task:", error);
    return NextResponse.json({ error: "Failed to generate speaking task" }, { status: 500 });
  }
}
