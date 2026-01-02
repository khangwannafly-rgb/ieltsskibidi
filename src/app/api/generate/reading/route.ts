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
    let text = response.text().trim();
    
    // Tiền xử lý text để loại bỏ markdown code blocks nếu có
    if (text.startsWith('```json')) {
      text = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (text.startsWith('```')) {
      text = text.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }
    
    // Tìm vị trí của JSON trong phản hồi (đôi khi model trả về kèm text giải thích)
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}') + 1;
    
    if (jsonStart === -1 || jsonEnd === 0) {
      console.error("No JSON found in response:", text);
      throw new Error("AI response does not contain valid JSON");
    }
    
    const jsonString = text.substring(jsonStart, jsonEnd);
    
    try {
      const data = JSON.parse(jsonString);
      return NextResponse.json(data);
    } catch (parseError) {
      console.error("JSON parse error for text:", jsonString);
      return NextResponse.json({ 
        error: "Lỗi định dạng dữ liệu từ AI",
        details: "Không thể phân giải JSON từ phản hồi của AI",
        raw: text.substring(0, 100) + "..."
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Error generating reading task:", error);
    
    // Xử lý lỗi thiếu API Key cụ thể
    if (error.code === "MISSING_API_KEY" || error.message?.includes("GEMINI_API_KEY")) {
      return NextResponse.json({ 
        error: "Cấu hình API Key bị thiếu. Vui lòng thêm GEMINI_API_KEY vào biến môi trường trên Vercel.",
        code: "MISSING_API_KEY"
      }, { status: 500 });
    }

    if (error.message?.includes("leaked") || error.message?.includes("403 Forbidden")) {
      return NextResponse.json({ 
        error: "API Key của bạn đã bị lộ (leaked) và bị Google vô hiệu hóa. Vui lòng tạo API Key mới tại Google AI Studio và cập nhật lại trên Vercel.",
        code: "LEAKED_API_KEY"
      }, { status: 403 });
    }

    return NextResponse.json({ 
      error: error.message || "Không thể kết nối với AI để tạo đề bài" 
    }, { status: 500 });
  }
}
