import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { targetScore = 6.5 } = await req.json();
    const model = getGeminiModel();
    const prompt = `You are an IELTS Listening test designer. Generate a high-quality, authentic IELTS Listening Section (Part 1, 2, 3, or 4) with exactly 10 questions.
    
    Section Requirements:
    - Part 1: Conversation between two people set in an everyday social context (e.g., booking a hotel, enquiring about a course).
    - Part 2: Monologue set in an everyday social context (e.g., a speech about local facilities, a guide for a tour).
    - Part 3: Conversation between up to four people set in an educational or training context (e.g., a university tutor and a student discussing an assignment).
    - Part 4: Monologue on an academic subject (e.g., a university lecture).
    - Difficulty: Appropriate for someone aiming for a Band ${targetScore}.
    
    Return ONLY a JSON object in this format:
    {
      "section_type": "Part 1" | "Part 2" | "Part 3" | "Part 4",
      "context": "string (Briefly describe the context)",
      "transcript": "string (The full script with speaker names, formatted in markdown)",
      "difficulty_estimate_band": ${targetScore},
      "questions": [
        {
          "id": number,
          "type": "FILL" | "MCQ" | "MATCH" | "MAP",
          "question": "string (Question text, e.g., 'Name: [1]______')",
          "options": ["string"] // Required ONLY for MCQ and MATCH
        }
      ],
      "answers": [
        { 
          "id": number, 
          "correct_answer": "string", 
          "explanation": "string (Include the exact sentence from the transcript that contains the answer)" 
        }
      ]
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
    console.error("Error generating listening task:", error);
    
    // Xử lý lỗi thiếu API Key cụ thể
    if (error.code === "MISSING_API_KEY" || error.message?.includes("GEMINI_API_KEY")) {
      return NextResponse.json({ 
        error: "Cấu hình API Key bị thiếu. Vui lòng thêm GEMINI_API_KEY vào biến môi trường trên Vercel.",
        code: "MISSING_API_KEY"
      }, { status: 500 });
    }

    return NextResponse.json({ 
      error: error.message || "Không thể kết nối với AI để tạo đề bài" 
    }, { status: 500 });
  }
}
