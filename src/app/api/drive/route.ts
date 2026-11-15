import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { readJsonBody } from "@/lib/ai-response";
import {
  upsertServerUser,
  getAllServerUsers,
  getStoreStats,
  ServerSubmission,
} from "@/lib/server-store";
import {
  DRIVE_LINKS,
  generateScoresSpreadsheetCsv,
  generateVocabSpreadsheetCsv,
  generateAcademicReportHtml,
} from "@/lib/drive-export";
import { VocabItem } from "@/lib/vocabulary";

function writeExportSnapshots(customVocab: VocabItem[] = []) {
  try {
    const exportDir = path.join(process.cwd(), ".data", "exports");
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }
    const users = getAllServerUsers();
    fs.writeFileSync(
      path.join(exportDir, "Bảng_Điểm_IELTS_SKIBIDI.csv"),
      generateScoresSpreadsheetCsv(users),
      "utf-8"
    );
    fs.writeFileSync(
      path.join(exportDir, "Sổ_Tay_Từ_Vựng_IELTS_SKIBIDI.csv"),
      generateVocabSpreadsheetCsv(customVocab),
      "utf-8"
    );
    fs.writeFileSync(
      path.join(exportDir, "Báo_Cáo_Học_Thuật_IELTS_SKIBIDI.html"),
      generateAcademicReportHtml(users, customVocab),
      "utf-8"
    );
  } catch {
    // Bỏ qua lỗi ghi file nếu chạy trên môi trường read-only
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");
  const users = getAllServerUsers();

  if (format === "html") {
    const html = generateAcademicReportHtml(users);
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  }

  if (format === "scores-csv") {
    const csv = generateScoresSpreadsheetCsv(users);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="Bang_Diem_IELTS_SKIBIDI.csv"',
      },
    });
  }

  if (format === "vocab-csv") {
    const csv = generateVocabSpreadsheetCsv();
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="So_Tay_Tu_Vung_IELTS_SKIBIDI.csv"',
      },
    });
  }

  const stats = getStoreStats();
  return NextResponse.json({
    connected: true,
    account: "khangwannafly@gmail.com",
    folderName: "IELTS SKIBIDI - Database & Source Backup",
    ...DRIVE_LINKS,
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
    customVocab?: VocabItem[];
  }>(req);

  if (body.user?.email) {
    upsertServerUser({
      id: body.user.id,
      email: body.user.email,
      name: body.user.name || "Nguyễn Khang",
      targetScore: body.user.targetScore,
      currentLevel: body.user.currentLevel,
      streak: body.user.streak,
      xp: body.user.xp,
      badges: body.user.badges,
      submissions: body.user.submissions,
    });
  }

  writeExportSnapshots(body.customVocab || []);

  return NextResponse.json({
    synced: true,
    syncedAt: new Date().toISOString(),
    ...DRIVE_LINKS,
    stats: getStoreStats(),
  });
}
