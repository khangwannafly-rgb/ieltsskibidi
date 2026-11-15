import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/ai-response";
import {
  checkRateLimit,
  rateLimitExceededResponse,
  sanitizeString,
  sanitizeTargetBand,
} from "@/lib/api-guard";
import {
  getServerUser,
  upsertServerUser,
  computeUserAnalytics,
  ServerSubmission,
} from "@/lib/server-store";

export async function GET(req: Request) {
  const rl = checkRateLimit(req, "user-get", 60, 60_000);
  if (!rl.allowed) return rateLimitExceededResponse(rl.retryAfterSeconds);

  const { searchParams } = new URL(req.url);
  const email = sanitizeString(searchParams.get("email"), 120).toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }

  const user = getServerUser(email);
  if (!user) {
    return NextResponse.json({ user: null, analytics: null }, { status: 404 });
  }

  return NextResponse.json({
    user,
    analytics: computeUserAnalytics(email),
  });
}

export async function POST(req: Request) {
  const rl = checkRateLimit(req, "user-post", 40, 60_000);
  if (!rl.allowed) return rateLimitExceededResponse(rl.retryAfterSeconds);

  const body = await readJsonBody<{
    id?: string;
    email?: string;
    name?: string;
    targetScore?: number;
    currentLevel?: string;
    streak?: number;
    xp?: number;
    badges?: string[];
    submissions?: ServerSubmission[];
  }>(req);

  const email = sanitizeString(body.email, 120).toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
  }

  const user = upsertServerUser({
    id: sanitizeString(body.id, 64) || undefined,
    email,
    name: sanitizeString(body.name, 80) || "Thí sinh IELTS",
    targetScore: sanitizeTargetBand(body.targetScore, 6.5),
    currentLevel: sanitizeString(body.currentLevel, 40) || "Intermediate",
    streak: typeof body.streak === "number" ? Math.max(0, body.streak) : undefined,
    xp: typeof body.xp === "number" ? Math.max(0, body.xp) : undefined,
    badges: Array.isArray(body.badges) ? body.badges.slice(0, 30) : undefined,
    submissions: Array.isArray(body.submissions) ? body.submissions : undefined,
  });

  return NextResponse.json({
    user,
    analytics: computeUserAnalytics(email),
  });
}
