import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.GEMINI_API_KEY || ""

const genAI = new GoogleGenerativeAI(apiKey)

export const model = genAI.getGenerativeModel({ 
  model: "gemini-flash-latest",
})

// Kiểm tra API Key khi thực sự sử dụng để tránh lỗi lúc build trên Vercel
export const getGeminiModel = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable")
  }
  return model
}
