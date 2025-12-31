import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { transcript, questions } = await req.json();
    const model = getGeminiModel();

    if (!transcript) {
      return NextResponse.json({ error: "Transcript is required" }, { status: 400 });
    }

    const prompt = `You are an expert IELTS Speaking examiner.
    Score the following candidate's response based on the transcript provided.
    
    Test Questions: ${JSON.stringify(questions)}
    Candidate Transcript: ${transcript}
    
    Score using official IELTS band descriptors for:
    1. Fluency and Coherence (FC)
    2. Lexical Resource (LR)
    3. Grammatical Range and Accuracy (GRA)
    4. Pronunciation (PR - Estimate based on text clarity and sentence structure)
    
    Rules:
    - Band 0-9 per criterion.
    - Feedback must quote the candidate's words.
    - Provide a list of "Lexical Upgrades" to improve the score.
    
    Return ONLY a JSON object in this format:
    {
      "overallBand": number,
      "criteria": {
        "fluency_and_coherence": { "score": number, "feedback": "string" },
        "lexical_resource": { "score": number, "feedback": "string" },
        "grammatical_range_and_accuracy": { "score": number, "feedback": "string" },
        "pronunciation": { "score": number, "feedback": "string" }
      },
      "strengths": ["string"],
      "improvements": ["string"]
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
    console.error("Error scoring speaking task:", error);
    return NextResponse.json({ error: "Failed to score speaking task" }, { status: 500 });
  }
}
