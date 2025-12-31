import { model } from "@/lib/gemini";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { type = "task2", targetScore = 6.5 } = await req.json();

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
    console.error("Error generating writing task:", error);
    return NextResponse.json({ error: "Failed to generate writing task" }, { status: 500 });
  }
}
