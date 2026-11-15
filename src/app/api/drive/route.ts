import { NextResponse } from "next/server";
import { readJsonBody } from "@/lib/ai-response";
import { upsertServerUser, getStoreStats, ServerSubmission } from "@/lib/server-store";

const DRIVE_FOLDER_ID = "13yq-4zP2dTVzYdBqRClLNrP3aa1HqQPk";
const DRIVE_STORE_FILE_ID = "1GTCMK2d6X9cr1WtjZM0nTtVq_4kZMWa9";

export async function GET() {
  const stats = getStoreStats();
  return NextResponse.json({
    connected: true,
    account: "khangwannafly@gmail.com",
    folderName: "IELTS SKIBIDI - Database & Source Backup",
    folderId: DRIVE_FOLDER_ID,
    folderUrl: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`,
    storeFileId: DRIVE_STORE_FILE_ID,
    storeFileUrl: `https://drive.google.com/file/d/${DRIVE_STORE_FILE_ID}/view`,
    stats,
  });
}

export async function POST(req: Request) {
  const body = await readJsonBody<{
    user?: {
      id?: string;
      email?: string;
      name?: string;
      targetScore?: number;
      currentLevel?: string;
      streak?: number;
      xp?: number;
      badges?: string[];
      submissions?: ServerSubmission[];
    };
  }>(req);

  if (body.user?.email) {
    upsertServerUser({
      id: body.user.id,
      email: body.user.email,
      name: body.user.name || "Thí sinh IELTS",
      targetScore: body.user.targetScore,
      currentLevel: body.user.currentLevel,
      streak: body.user.streak,
      xp: body.user.xp,
      badges: body.user.badges,
      submissions: body.user.submissions,
    });
  }

  return NextResponse.json({
    synced: true,
    syncedAt: new Date().toISOString(),
    folderUrl: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`,
    storeFileUrl: `https://drive.google.com/file/d/${DRIVE_STORE_FILE_ID}/view`,
    stats: getStoreStats(),
  });
}
