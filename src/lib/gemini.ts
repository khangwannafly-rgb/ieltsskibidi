import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import { parseAIJson } from "@/lib/ai-response";

let genAI: GoogleGenerativeAI | null = null;
let cachedKey: string | null = null;

const FALLBACK_MODELS = [
  process.env.GEMINI_MODEL || "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-flash-latest",
];

interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const aiCache = new Map<string, CacheEntry>();

export const hasGeminiApiKey = (): boolean => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  return Boolean(apiKey && apiKey !== "your_gemini_api_key_here");
};

function getClient(): GoogleGenerativeAI | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "your_gemini_api_key_here") return null;
  if (!genAI || cachedKey !== apiKey) {
    cachedKey = apiKey;
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs = 25000): Promise<T> {
  let timer: NodeJS.Timeout | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error(`AI request timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });
  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

/**
 * Trả về GenerativeModel có cơ chế tự động chuyển đổi model dự phòng (Multi-Model Failover)
 * và bảo vệ timeout khi gọi generateContent.
 */
export const getGeminiModel = (): GenerativeModel => {
  const client = getClient();

  if (!client) {
    return {
      generateContent: async () => {
        const error = new Error("Missing GEMINI_API_KEY environment variable.");
        (error as Error & { code?: string }).code = "MISSING_API_KEY";
        throw error;
      },
    } as unknown as GenerativeModel;
  }

  // Tạo proxy model tự động thử qua danh sách FALLBACK_MODELS nếu model đầu tiên bị lỗi 404/429/503
  return {
    generateContent: async (prompt: string) => {
      let lastError: unknown = null;
      const uniqueModels = Array.from(new Set(FALLBACK_MODELS));

      for (const modelName of uniqueModels) {
        try {
          const m = client.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.65,
            },
          });
          return await withTimeout(m.generateContent(prompt), 26000);
        } catch (err) {
          lastError = err;
          console.warn(`[Gemini Failover] Model ${modelName} failed, trying next if available...`);
        }
      }
      throw lastError || new Error("All Gemini models failed");
    },
  } as unknown as GenerativeModel;
};

/**
 * Hàm gọi AI thông minh kết hợp Cache + Multi-Model Failover + Tự động Fallback sang ngân hàng đề Cambridge.
 */
export async function generateAIJsonWithFallback<T extends object>(
  prompt: string,
  fallbackFn: () => T,
  options?: {
    cacheKey?: string;
    cacheTtlMs?: number;
  }
): Promise<T & { _meta?: { source: "gemini-ai" | "cambridge-bank" | "cache"; timestamp: string } }> {
  const now = Date.now();
  if (options?.cacheKey) {
    const cached = aiCache.get(options.cacheKey);
    if (cached && cached.expiresAt > now) {
      return {
        ...(cached.value as T),
        _meta: { source: "cache", timestamp: new Date().toISOString() },
      };
    }
  }

  if (!hasGeminiApiKey()) {
    return {
      ...fallbackFn(),
      _meta: { source: "cambridge-bank", timestamp: new Date().toISOString() },
    };
  }

  try {
    const model = getGeminiModel();
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = parseAIJson<T>(text);

    if (options?.cacheKey) {
      aiCache.set(options.cacheKey, {
        value: parsed,
        expiresAt: now + (options.cacheTtlMs || 5 * 60 * 1000),
      });
    }

    return {
      ...parsed,
      _meta: { source: "gemini-ai", timestamp: new Date().toISOString() },
    };
  } catch (error) {
    console.warn("[Backend AI Fallback] Switching seamlessly to built-in Cambridge bank:", error);
    return {
      ...fallbackFn(),
      _meta: { source: "cambridge-bank", timestamp: new Date().toISOString() },
    };
  }
}
