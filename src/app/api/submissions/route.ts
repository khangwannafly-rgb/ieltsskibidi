import { NextResponse } from "next/server";
import { readJsonBody, roundBand } from "@/lib/ai-response";
import {
  checkRateLimit,
  rateLimitExceededResponse,
  sanitizeString,
} from "@/lib/api-guard";
import {
  addServerSubmission,
  computeUserAnalytics,
  getServerUser,
  upsertServerUser,
  ServerSubmission,
} from "@/lib/server-store";

export async function GET(req: Request) {
  const rl = checkRateLimit(req, "submissions-get", 60, 60_000);
  if (!rl.allowed) return rateLimitExceededResponse(rl.retryAfterSeconds);

  const { searchParams } = new URL(req.url);
  const email = sanitizeString(searchParams.get("email"), 120).toLowerCase();
  if (!email) {
    return NextResponse.json({ error: "Missing email parameter" }, { status: 400 });
  }

  const user = getServerUser(email);
  return NextResponse.json({
    submissions: user?.submissions || [],
    analytics: computeUserAnalytics(email),
  });
}

export async function POST(req: Request) {
  const rl = checkRateLimit(req, "submissions-post", 40, 60_000);
  if (!rl.allowed) return rateLimitExceededResponse(rl.retryAfterSeconds);

  const body = await readJsonBody<{
    email?: string;
    name?: string;
    submission?: Partial<ServerSubmission>;
  }>(req);

  const email = sanitizeString(body.email, 120).toLowerCase();
  const sub = body.submission;
  if (!email || !sub || !sub.skill) {
    return NextResponse.json(
      { error: "Email and valid submission are required" },
      { status: 400 }
    );
  }

  if (!getServerUser(email)) {
    upsertServerUser({
      email,
      name: sanitizeString(body.name, 80) || "Thí sinh IELTS",
    });
  }

  const validSkills = ["reading", "listening", "writing", "speaking"] as const;
  const skill = validSkills.includes(sub.skill as (typeof validSkills)[number])
    ? (sub.skill as (typeof validSkills)[number])
    : "reading";

  const updatedUser = addServerSubmission(email, {
    id: sanitizeString(sub.id, 64) || "sub_" + Date.now(),
    skill,
    band: roundBand(sub.band),
    date: sub.date || new Date().toISOString(),
    details: sub.details || {},
  });

  return NextResponse.json({
    user: updatedUser,
    analytics: computeUserAnalytics(email),
  });
}
