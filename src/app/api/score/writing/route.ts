import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { question, essay, task_type = "task2" } = await req.json();
    const model = getGeminiModel();

    if (!question || !essay) {
      return NextResponse.json({ error: "Question and essay are required" }, { status: 400 });
    }

    const prompt = `You are an expert IELTS Writing examiner. 
    Score the following essay based on the question provided.
    
    Task Type: ${task_type}
    Question: ${question}
    User's Essay: ${essay}
    
    Score using official IELTS band descriptors for:
    1. ${task_type === 'task1' ? 'Task Achievement (TA)' : 'Task Response (TR)'}
    2. Coherence and Cohesion (CC)
    3. Lexical Resource (LR)
    4. Grammatical Range and Accuracy (GRA)
    
    Rules for Task 1:
    - Evaluate if the user provided a clear overview.
    - Check if key features are highlighted and supported by data.
    - Ensure comparisons are made where relevant.
    - Check for accuracy in reporting data from the visual.

    Rules for Task 2:
    - Evaluate if the prompt is fully addressed.
    - Check for a clear position throughout.
    - Check if main ideas are extended and supported.

    General Rules:
    - Band 0-9 per criterion (can be .5).
    - Overall band is the arithmetic mean of the four, rounded to the nearest 0.5.
    - Feedback must be constructive and quote specific parts of the user's text.
    - Provide 3 targeted revisions that improve the score while maintaining the original meaning.
    
    Return ONLY a JSON object in this format:
    {
      "overall_band": number,
      "criteria_scores": {
        "task_achievement": number,
        "coherence_and_cohesion": number,
        "lexical_resource": number,
        "grammatical_range_and_accuracy": number
      },
      "key_improvements": ["string"]
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
    console.error("Error scoring writing task:", error);
    
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
