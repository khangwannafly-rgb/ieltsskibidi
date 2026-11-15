import { NextResponse } from "next/server";

/**
 * Trích xuất và parse JSON từ phản hồi của AI.
 * Xử lý các trường hợp AI bọc JSON trong ```json ... ``` hoặc kèm text giải thích.
 */
export function parseAIJson<T = unknown>(raw: string): T {
  let text = raw.trim();

  // Loại bỏ markdown code fences nếu có
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) text = fenced[1].trim();

  const jsonStart = text.indexOf("{");
  const jsonEnd = text.lastIndexOf("}") + 1;
  if (jsonStart === -1 || jsonEnd === 0) {
    throw new Error("AI response does not contain valid JSON");
  }

  const jsonString = text.substring(jsonStart, jsonEnd);
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    // Thử sửa lỗi phổ biến: dấu phẩy thừa trước } hoặc ]
    const repaired = jsonString.replace(/,\s*([}\]])/g, "$1");
    try {
      return JSON.parse(repaired) as T;
    } catch {
      console.error("Failed to parse AI JSON:", jsonString.substring(0, 500));
      throw new Error("Lỗi định dạng dữ liệu từ AI. Vui lòng thử lại.");
    }
  }
}

/** Chuẩn hoá lỗi từ Gemini thành response JSON thân thiện (tiếng Việt). */
export function aiErrorResponse(error: unknown, fallbackMessage: string) {
  const err = error as { code?: string; message?: string; status?: number };
  const message = err?.message || "";
  console.error(fallbackMessage, error);

  if (err?.code === "MISSING_API_KEY" || message.includes("GEMINI_API_KEY")) {
    return NextResponse.json({
      error: "Cấu hình API Key bị thiếu. Vui lòng thêm GEMINI_API_KEY vào file .env.local (hoặc biến môi trường trên Vercel).",
      code: "MISSING_API_KEY"
    }, { status: 500 });
  }

  if (message.includes("leaked") || message.includes("403 Forbidden")) {
    return NextResponse.json({
      error: "API Key của bạn đã bị lộ (leaked) và bị Google vô hiệu hóa. Vui lòng tạo API Key mới tại Google AI Studio và cập nhật lại.",
      code: "LEAKED_API_KEY"
    }, { status: 403 });
  }

  if (message.includes("API key not valid") || message.includes("API_KEY_INVALID")) {
    return NextResponse.json({
      error: "API Key không hợp lệ. Vui lòng kiểm tra lại GEMINI_API_KEY.",
      code: "INVALID_API_KEY"
    }, { status: 401 });
  }

  if (message.includes("429") || message.toLowerCase().includes("quota") || message.includes("Too Many Requests")) {
    return NextResponse.json({
      error: "AI đang quá tải hoặc đã hết hạn mức sử dụng. Vui lòng thử lại sau ít phút.",
      code: "RATE_LIMITED"
    }, { status: 429 });
  }

  if (message.includes("503") || message.includes("overloaded")) {
    return NextResponse.json({
      error: "Máy chủ AI đang quá tải. Vui lòng thử lại sau giây lát.",
      code: "AI_OVERLOADED"
    }, { status: 503 });
  }

  return NextResponse.json({
    error: message ? `${fallbackMessage}: ${message}` : fallbackMessage
  }, { status: 500 });
}

/** Đọc body JSON an toàn (tránh crash khi body rỗng/không hợp lệ). */
export async function readJsonBody<T extends object>(req: Request): Promise<Partial<T>> {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? body : {};
  } catch {
    return {};
  }
}

/** Làm tròn band IELTS về bội số 0.5 gần nhất và giới hạn trong 0-9. */
export function roundBand(value: unknown): number {
  const n = typeof value === "number" ? value : parseFloat(String(value));
  if (!Number.isFinite(n)) return 0;
  return Math.min(9, Math.max(0, Math.round(n * 2) / 2));
}
