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
    const text = response.text().trim();
    
    // Tìm vị trí của JSON trong phản hồi
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("AI response does not contain valid JSON");
    }
    
    const jsonString = text.substring(jsonStart, jsonEnd);
    
    try {
      const data = JSON.parse(jsonString);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error("JSON parse error:", text);
      return NextResponse.json({ error: "Lỗi định dạng dữ liệu từ AI" }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error scoring speaking task:", error);
    
    // Xử lý lỗi thiếu API Key cụ thể
    if (error.code === "MISSING_API_KEY" || error.message?.includes("GEMINI_API_KEY")) {
      return NextResponse.json({ 
        error: "Cấu hình API Key bị thiếu. Vui lòng thêm GEMINI_API_KEY vào biến môi trường trên Vercel.",
        code: "MISSING_API_KEY"
      }, { status: 500 });
    }

    return NextResponse.json({ 
      error: error.message || "Không thể kết nối với AI để chấm bài" 
    }, { status: 500 });
  }
}
