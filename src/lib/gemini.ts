import { GoogleGenerativeAI } from "@google/generative-ai"

// Khởi tạo biến bên ngoài để sử dụng lại (singleton pattern)
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

export const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Nếu không có API Key, trả về một mock object để tránh lỗi lúc build (Next.js pre-rendering)
  // Lỗi sẽ chỉ xảy ra khi thực sự gọi hàm generateContent() tại runtime
  if (!apiKey) {
    console.warn("Warning: GEMINI_API_KEY is missing. AI features will not work.");
    return {
      generateContent: async () => {
        throw new Error("Missing GEMINI_API_KEY. Please add it to your environment variables.");
      }
    } as any;
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
    });
  }
  
  return model;
}
