import { GoogleGenerativeAI } from "@google/generative-ai"

// Khởi tạo biến bên ngoài để sử dụng lại (singleton pattern)
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

export const getGeminiModel = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Trong môi trường build của Vercel, GEMINI_API_KEY có thể không tồn tại
  // Chúng ta chỉ khởi tạo và kiểm tra khi thực sự chạy ở runtime
  if (!apiKey) {
    // Nếu đang trong quá trình build (Next.js pre-rendering), trả về một proxy hoặc null 
    // thay vì throw error ngay lập tức làm sập quá trình build
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
       console.warn("GEMINI_API_KEY is missing during build/server-side rendering. This is expected if not provided in environment variables.");
    }
    throw new Error("Missing GEMINI_API_KEY environment variable. Please add it to your .env.local or Vercel project settings.");
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ 
      model: "gemini-flash-latest",
    });
  }
  
  return model;
}
