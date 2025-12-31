import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai"

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

// Kiểm tra API Key khi thực sự sử dụng để tránh lỗi lúc build trên Vercel
export const getGeminiModel = (): GenerativeModel => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Trong môi trường build, trả về một proxy object để tránh lỗi module evaluation
    // Lỗi sẽ chỉ thực sự xảy ra khi hàm generateContent được gọi ở runtime
    console.warn("Warning: GEMINI_API_KEY is missing. AI features will fail at runtime.");
    return {
      generateContent: async () => {
        const error = new Error("Missing GEMINI_API_KEY environment variable. Please add it to Vercel environment variables.");
        (error as any).code = "MISSING_API_KEY";
        throw error;
      }
    } as unknown as GenerativeModel;
  }

  if (!genAI || !model) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
    });
  }
  
  return model;
}
