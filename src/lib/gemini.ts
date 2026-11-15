import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai"

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;
let cachedKey: string | null = null;

export const hasGeminiApiKey = (): boolean => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  return Boolean(apiKey && apiKey !== "your_gemini_api_key_here");
};

// Kiểm tra API Key khi thực sự sử dụng để tránh lỗi lúc build trên Vercel
export const getGeminiModel = (): GenerativeModel => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.warn("Warning: GEMINI_API_KEY is missing. Falling back to built-in IELTS tasks.");
    return {
      generateContent: async () => {
        const error = new Error("Missing GEMINI_API_KEY environment variable.");
        (error as Error & { code?: string }).code = "MISSING_API_KEY";
        throw error;
      }
    } as unknown as GenerativeModel;
  }

  if (!genAI || !model || cachedKey !== apiKey) {
    cachedKey = apiKey;
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-flash-latest",
      generationConfig: {
        // Yêu cầu Gemini trả về JSON thuần để tránh lỗi parse
        responseMimeType: "application/json",
      },
    });
  }

  return model;
}
