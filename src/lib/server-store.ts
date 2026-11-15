import fs from "fs";
import path from "path";

export interface ServerSubmission {
  id: string;
  userEmail: string;
  skill: "reading" | "listening" | "writing" | "speaking";
  band: number;
  date: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;
}

export interface ServerUser {
  id: string;
  email: string;
  name: string;
  targetScore: number;
  currentLevel: string;
  streak: number;
  xp: number;
  badges: string[];
  submissions: ServerSubmission[];
  updatedAt: string;
}

interface StoreSchema {
  users: Record<string, ServerUser>;
}

const DATA_DIR = path.join(process.cwd(), ".data");
const STORE_PATH = path.join(DATA_DIR, "ielts-store.json");

let memoryStore: StoreSchema | null = null;

function readStore(): StoreSchema {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      const parsed = JSON.parse(raw) as StoreSchema;
      if (parsed && typeof parsed.users === "object") {
        memoryStore = parsed;
        return memoryStore;
      }
    }
  } catch (err) {
    console.warn("[ServerStore] Using in-memory store fallback:", err);
  }
  memoryStore = { users: {} };
  return memoryStore;
}

function writeStore(store: StoreSchema) {
  memoryStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch {
    // Trên môi trường serverless read-only (như Vercel), giữ nguyên trong memoryStore
  }
}

export function upsertServerUser(payload: Partial<ServerUser> & { email: string }): ServerUser {
  const store = readStore();
  const key = payload.email.trim().toLowerCase();
  const existing = store.users[key];

  const mergedSubmissions = Array.isArray(payload.submissions)
    ? payload.submissions
    : existing?.submissions || [];

  const updated: ServerUser = {
    id: payload.id || existing?.id || "usr_" + Date.now().toString(36),
    email: key,
    name: payload.name?.trim() || existing?.name || "Thí sinh IELTS",
    targetScore:
      typeof payload.targetScore === "number"
        ? payload.targetScore
        : existing?.targetScore ?? 6.5,
    currentLevel: payload.currentLevel || existing?.currentLevel || "Intermediate",
    streak: typeof payload.streak === "number" ? payload.streak : existing?.streak ?? 0,
    xp: typeof payload.xp === "number" ? payload.xp : existing?.xp ?? 0,
    badges: Array.isArray(payload.badges) ? payload.badges : existing?.badges || [],
    submissions: mergedSubmissions.slice(0, 100),
    updatedAt: new Date().toISOString(),
  };

  store.users[key] = updated;
  writeStore(store);
  return updated;
}

export function getServerUser(email: string): ServerUser | null {
  const store = readStore();
  const key = email.trim().toLowerCase();
  return store.users[key] || null;
}

export function addServerSubmission(
  email: string,
  submission: Omit<ServerSubmission, "userEmail">
): ServerUser | null {
  const store = readStore();
  const key = email.trim().toLowerCase();
  const user = store.users[key];
  if (!user) return null;

  const exists = user.submissions.some((s) => s.id === submission.id);
  if (!exists) {
    user.submissions = [{ ...submission, userEmail: key }, ...user.submissions].slice(0, 100);
    user.xp = (user.xp || 0) + 100;
    user.updatedAt = new Date().toISOString();
    store.users[key] = user;
    writeStore(store);
  }
  return user;
}

export function computeUserAnalytics(email: string) {
  const user = getServerUser(email);
  const subs = user?.submissions || [];
  const skills = ["reading", "listening", "writing", "speaking"] as const;

  const skillStats = skills.map((skill) => {
    const list = subs.filter((s) => s.skill === skill);
    const avg =
      list.length > 0
        ? Math.round((list.reduce((a, b) => a + b.band, 0) / list.length) * 2) / 2
        : 0;
    return {
      skill,
      count: list.length,
      averageBand: avg,
      highestBand: list.length > 0 ? Math.max(...list.map((s) => s.band)) : 0,
    };
  });

  const overallBand =
    subs.length > 0
      ? Math.round((subs.reduce((a, b) => a + b.band, 0) / subs.length) * 2) / 2
      : 0;

  return {
    totalSubmissions: subs.length,
    overallBand,
    targetScore: user?.targetScore ?? 6.5,
    skillStats,
  };
}

export function getAllServerUsers(): ServerUser[] {
  const store = readStore();
  return Object.values(store.users);
}

export function getStoreStats() {
  const store = readStore();
  const users = Object.values(store.users);
  const totalSubmissions = users.reduce((sum, u) => sum + (u.submissions?.length || 0), 0);
  return {
    registeredUsers: users.length,
    totalSubmissions,
  };
}
