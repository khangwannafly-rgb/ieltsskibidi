import { getGeminiModel } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { type = "task2", targetScore = 6.5 } = await req.json();
    const model = getGeminiModel();

    const prompt = `You are an official IELTS test designer. Generate a high-quality, authentic IELTS Writing ${type} question.
    
    Guidelines:
    - Use formal, academic English.
    - Topic: Randomly choose from (Education, Environment, Technology, Globalisation, Health, Work, Government, Crime, Media).
    - Task 1: Focus on describing trends, comparisons, and key features.
    - Task 2: Focus on discussion, opinion, problem-solution, or double-question formats.
    - Difficulty: Target Band ${targetScore} level vocabulary in the prompt.
    
    ${type === 'task1' ? `
    For Task 1, you MUST generate complex data that allows for sophisticated comparisons.
    The chart type can be: "bar", "line", "pie", "table".
    Return ONLY a JSON object in this format:
    {
      "question": "The [chart type] below shows information about [topic] in [context] between [years/categories]...",
      "instructions": "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      "min_words": 150,
      "difficulty_estimate_band": ${targetScore},
      "chart_data": {
        "type": "bar" | "line" | "pie" | "table",
        "title": "string (The title displayed on the chart)",
        "labels": ["string (e.g., years 2010, 2015, 2020 or categories)"],
        "datasets": [
          {
            "label": "string (e.g., Country A, Group B)",
            "data": [number (realistic, logical data points)]
          }
        ]
      }
    }
    ` : `
    Return ONLY a JSON object in this format:
    {
      "question": "string (A formal prompt, e.g., 'Some people believe that... while others argue... Discuss both views and give your opinion.')",
      "instructions": "Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      "min_words": 250,
      "difficulty_estimate_band": ${targetScore}
    }
    `}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Tìm kiếm JSON trong phản hồi (tránh các ký tự thừa hoặc markdown)
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
      console.error("Failed to parse AI JSON:", jsonString);
      throw new Error("Failed to parse AI response as JSON");
    }
  } catch (error: any) {
    console.error("Error generating writing task:", error);
    
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
    
    return NextResponse.json({ error: "Failed to generate writing task: " + (error.message || "Unknown error") }, { status: 500 });
  }
}
