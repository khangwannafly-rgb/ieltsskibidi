import { NextResponse } from "next/server";

interface RateBucket {
  timestamps: number[];
}

const rateBuckets = new Map<string, RateBucket>();

/**
 * Kiểm tra giới hạn tần suất gọi API (Sliding Window Rate Limiter).
 * Mặc định: tối đa 30 requests / 60 giây trên mỗi IP cho từng nhóm route.
 */
export function checkRateLimit(
  req: Request,
  bucketPrefix = "api",
  maxRequests = 30,
  windowMs = 60_000
): { allowed: boolean; remaining: number; retryAfterSeconds: number } {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "local-client";
  const key = `${bucketPrefix}:${ip}`;
  const now = Date.now();

  const existing = rateBuckets.get(key) || { timestamps: [] };
  existing.timestamps = existing.timestamps.filter((t) => now - t < windowMs);

  if (existing.timestamps.length >= maxRequests) {
    const oldest = existing.timestamps[0];
    const retryAfterSeconds = Math.max(1, Math.ceil((windowMs - (now - oldest)) / 1000));
    rateBuckets.set(key, existing);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  existing.timestamps.push(now);
  rateBuckets.set(key, existing);
  return {
    allowed: true,
    remaining: Math.max(0, maxRequests - existing.timestamps.length),
    retryAfterSeconds: 0,
  };
}

export function rateLimitExceededResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      error: `Bạn thao tác quá nhanh. Vui lòng đợi ${retryAfterSeconds} giây trước khi thử lại.`,
      code: "RATE_LIMIT_EXCEEDED",
      retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfterSeconds),
      },
    }
  );
}

/** Giới hạn độ dài chuỗi đầu vào để bảo vệ bộ nhớ và tránh prompt injection quá lớn. */
export function sanitizeString(input: unknown, maxLength = 15000): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, maxLength);
}

/** Chuẩn hóa điểm mục tiêu IELTS trong khoảng 4.0 -> 9.0 (bước 0.5). */
export function sanitizeTargetBand(input: unknown, fallback = 6.5): number {
  const num = typeof input === "number" ? input : parseFloat(String(input ?? ""));
  if (!Number.isFinite(num)) return fallback;
  const clamped = Math.min(9.0, Math.max(4.0, num));
  return Math.round(clamped * 2) / 2;
}
