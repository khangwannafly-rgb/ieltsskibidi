import { getGeminiModel, hasGeminiApiKey } from "@/lib/gemini";
import { parseAIJson, readJsonBody } from "@/lib/ai-response";
import { checkRateLimit, rateLimitExceededResponse, sanitizeTargetBand } from "@/lib/api-guard";
import { getFallbackWritingTask } from "@/lib/fallback-tasks";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const rl = checkRateLimit(req, "gen-writing", 25, 60_000);
  if (!rl.allowed) return rateLimitExceededResponse(rl.retryAfterSeconds);

  const body = await readJsonBody<{ type: string; targetScore: number; subType?: string }>(req);
  const type = body.type === "task1" ? "task1" : "task2";
  const targetScore = sanitizeTargetBand(body.targetScore, 6.5);
  const subType = body.subType;
  try {
    if (!hasGeminiApiKey()) {
      return NextResponse.json(getFallbackWritingTask(type, targetScore, subType));
    }
    const model = getGeminiModel();
    const task1Types = ["line", "bar", "pie", "table", "process", "map", "multiple"];
    const task2Types = ["discussion", "opinion", "advantages", "problem_solution", "two_part"];
    const chosenSubType =
      subType && subType !== "all"
        ? subType
        : type === "task1"
        ? task1Types[Math.floor(Math.random() * task1Types.length)]
        : task2Types[Math.floor(Math.random() * task2Types.length)];

    const prompt = `You are an official IELTS test designer. Generate a high-quality, authentic IELTS Writing ${type} question specifically using the subtype "${chosenSubType}".
    
    Guidelines:
    - Use formal, academic English.
    - Topic: Randomly choose from (Education, Environment, Technology, Globalisation, Health, Work, Government, Crime, Media).
    - Task 1: Focus on describing trends, comparisons, and key features.
    - Task 2: Focus on discussion, opinion, problem-solution, or double-question formats.
    - Difficulty: Target Band ${targetScore} level vocabulary in the prompt.
    
    ${type === 'task1' ? `
    For Task 1, you MUST generate complex data that allows for sophisticated comparisons.
    The chart type can be: "bar", "line", "pie", "table", "map", "process", "multiple".

    Specific Requirements per Type:
    - "line": Generate trends over time (years/months) with at least 3 categories.
    - "pie": Generate distribution data, often comparing two different years or locations.
    - "table": Generate complex numerical data with rows and columns for comparison.
    - "map": Compare two maps (e.g., a town before and after development). Use "description" for the visual changes and "labels" for key locations.
    - "process": Describe a linear or cyclical process (e.g., manufacturing, life cycle). Use "description" for the overview and "labels" for the steps.
    - "multiple": Combine TWO different types (e.g., 1 Bar + 1 Pie, or 1 Table + 1 Line). Use the "charts" array.
    
    Structure guidance for Task 1:
    - Introduction: Paraphrase the question.
    - Overview: 2 sentences. Highlight main trends, stages, or significant changes.
    - Body 1 & 2: Group data logically (e.g., by time, category, or features).

    Return ONLY a JSON object in this format:
    {
      "question": "The [chart type] below shows information about [topic] in [context] between [years/categories]...",
      "instructions": "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
      "min_words": 150,
      "difficulty_estimate_band": ${targetScore},
      "structure_tips": {
        "introduction": "How to paraphrase this specific question...",
        "overview": "Specific main features to highlight for this data...",
        "body_paragraph_1": "What to include in the first detail paragraph...",
        "body_paragraph_2": "What to include in the second detail paragraph..."
      },
      "vocabulary_hints": [
        {"word": "word/phrase", "meaning": "vietnamese meaning", "usage": "example sentence (related to the topic)"}
      ],
      "sample_answer": "string (A complete Band 8.5 model report of ~175 words with 4 clear paragraphs separated by \\n\\n)",
      "chart_data": {
        "type": "bar" | "line" | "pie" | "table" | "map" | "process" | "multiple",
        "title": "string (Main title)",
        "charts": [ 
          {
            "type": "bar" | "line" | "pie" | "table",
            "title": "string (Sub-chart title)",
            "labels": ["string"],
            "datasets": [{"label": "string", "data": [number]}]
          }
        ],
        "labels": ["string (Only if type is NOT multiple. For map/process, use this for steps/locations)"],
        "datasets": [
          {
            "label": "string",
            "data": [number]
          }
        ],
        "description": "string (For map/process/multiple, provide a clear, detailed description of the visual elements to help the student.)"
      }
    }
    ` : `
    Return ONLY a JSON object in this format:
    {
      "question": "string (A formal prompt, e.g., 'Some people believe that... while others argue... Discuss both views and give your opinion.')",
      "instructions": "Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
      "min_words": 250,
      "difficulty_estimate_band": ${targetScore},
      "structure_tips": {
        "introduction": "Paraphrase the prompt and state your position...",
        "body_1": "Main argument 1 details...",
        "body_2": "Main argument 2 details...",
        "conclusion": "Summary of main points and final opinion."
      },
      "vocabulary_hints": [
        {"word": "word/phrase", "meaning": "vietnamese meaning", "usage": "example sentence"}
      ],
      "sample_answer": "string (A complete Band 8.5 model essay of ~280 words with 4 clear paragraphs separated by \\n\\n)"
    }
    `}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = parseAIJson<Record<string, unknown>>(response.text());

    if (!data.question || typeof data.question !== "string") {
      throw new Error("AI trả về đề bài không đầy đủ");
    }
    if (!data.min_words) data.min_words = type === "task1" ? 150 : 250;
    if (!data.difficulty_estimate_band) data.difficulty_estimate_band = targetScore;

    return NextResponse.json({ ...data, task_type: type });
  } catch (error) {
    console.warn("[Writing Generate API] Gemini failed, falling back to Cambridge Writing Bank:", error);
    return NextResponse.json(getFallbackWritingTask(type, targetScore, subType));
  }
}
