import { ServerUser } from "@/lib/server-store";
import { INITIAL_ACADEMIC_VOCAB, VocabItem } from "@/lib/vocabulary";

export const DRIVE_LINKS = {
  folderId: "13yq-4zP2dTVzYdBqRClLNrP3aa1HqQPk",
  folderUrl: "https://drive.google.com/drive/folders/13yq-4zP2dTVzYdBqRClLNrP3aa1HqQPk",
  scoresSheetId: "1W9Gl9LoQm6zL3cvOnr7LjQlkhF_cF_hrse2SYWSbxHQ",
  scoresSheetUrl:
    "https://docs.google.com/spreadsheets/d/1W9Gl9LoQm6zL3cvOnr7LjQlkhF_cF_hrse2SYWSbxHQ/edit",
  vocabSheetId: "1FQdNal7cuivifJQYczeNSXyB854wD3Up_CoNiB5WL_w",
  vocabSheetUrl:
    "https://docs.google.com/spreadsheets/d/1FQdNal7cuivifJQYczeNSXyB854wD3Up_CoNiB5WL_w/edit",
  reportDocId: "1S2W98lOaWLOwIDrJgRoiUjxp7rfTSw1tMc72FrlajDM",
  reportDocUrl:
    "https://docs.google.com/document/d/1S2W98lOaWLOwIDrJgRoiUjxp7rfTSw1tMc72FrlajDM/edit",
  sourceZipId: "1ip-on8WRHdL6cciw4VOXTgwCRutp9ATT",
  sourceZipUrl: "https://drive.google.com/file/d/1ip-on8WRHdL6cciw4VOXTgwCRutp9ATT/view",
};

export const FEATURED_STUDENT_RESULTS = [
  {
    code: "HV-001",
    name: "Ộ I i",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "8.0",
    skill: "Writing",
    examTitle: "Cambridge Academic Writing Task 1 & Task 2",
    band: "8.0",
    comment:
      "Cảm ơn vũ vì giới thiệu anh tới ielts skibidi. Một nền tảng học tập cực kỳ thông minh, giúp mình tiết kiệm được rất nhiều thời gian ôn luyện.",
    date: "15/12/2025",
  },
  {
    code: "HV-002",
    name: "Faker",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "7.5",
    skill: "Reading",
    examTitle: "Cambridge IELTS Academic Reading Full Test",
    band: "7.5",
    comment: "Chiếc cúp thứ 7 là dành cho Ielts Skibidi. Trải nghiệm học tập tuyệt vời.",
    date: "10/12/2025",
  },
  {
    code: "HV-003",
    name: "anh ALO",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "7.0",
    skill: "Speaking",
    examTitle: "IELTS Speaking Part 1, 2 & 3 Simulation",
    band: "7.0",
    comment: "7.0 ielts easy! Skibidi giúp mình tự tin hơn khi giao tiếp tiếng Anh.",
    date: "05/12/2025",
  },
  {
    code: "HV-004",
    name: "Sơn Tùng MTP",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "8.5",
    skill: "Listening",
    examTitle: "Cambridge IELTS Listening 4 Sections",
    band: "8.5",
    comment:
      "FLOP QUÁ THÌ GHI TÊN ANH VÀO!!! Ielts Skibidi thực sự là một cú hích lớn cho kỹ năng Listening của mình, giúp mình nghe rõ từng từ.",
    date: "01/12/2025",
  },
  {
    code: "HV-005",
    name: "Học viên Ẩn danh",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "7.5",
    skill: "Writing",
    examTitle: "Academic Writing In-line Sentence Diff",
    band: "7.5",
    comment: "AI sửa lỗi cực kỳ chi tiết, giúp mình tiến bộ từng ngày.",
    date: "20/12/2025",
  },
  {
    code: "HV-006",
    name: "Vinh Râu",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "6.5",
    skill: "Speaking",
    examTitle: "IELTS Speaking 1-on-1 AI Examiner",
    band: "6.5",
    comment:
      "Tự học ở nhà mà cảm giác như có giáo viên kèm 1-1 vậy, đỉnh thực sự! Mình đã tự tin hơn rất nhiều khi đối diện với giám khảo.",
    date: "25/12/2025",
  },
  {
    code: "HV-007",
    name: "Hieuthuhai",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "8.0",
    skill: "Listening",
    examTitle: "Academic Lecture & Monologue Listening",
    band: "8.0",
    comment: "Nghe Skibidi xong đi thi nghe như nghe nhạc rap, dễ hiểu vô cùng.",
    date: "28/12/2025",
  },
  {
    code: "HV-008",
    name: "Linh Ngọc Đàm",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "7.5",
    skill: "Reading",
    examTitle: "Academic Passage Analysis & Highlight Suite",
    band: "7.5",
    comment:
      "Giao diện đẹp xỉu, học mà cứ ngỡ đang lướt Pinterest luôn á! Rất cảm hứng để học mỗi ngày mà không thấy chán.",
    date: "30/12/2025",
  },
  {
    code: "HV-009",
    name: "Độ Mixi",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "7.0",
    skill: "Speaking",
    examTitle: "Speaking Fluency & Coherence Practice",
    band: "7.0",
    comment: "Hợp lý! Học Ielts ở đây thấy giải trí mà vẫn hiệu quả. Anh em nên thử nhé.",
    date: "02/01/2026",
  },
  {
    code: "HV-010",
    name: "PewPew",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "8.0",
    skill: "Writing",
    examTitle: "Writing Task 2 Argumentative Essay",
    band: "8.0",
    comment:
      "Bạn có thể không giỏi, nhưng bạn phải cố gắng. Ielts Skibidi là công cụ tuyệt vời để bạn hiện thực hóa điều đó.",
    date: "03/01/2026",
  },
  {
    code: "HV-011",
    name: "Misthy",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "7.5",
    skill: "Reading",
    examTitle: "True/False/Not Given & Matching Headings",
    band: "7.5",
    comment: "Thích nhất phần Reading, bài đọc phong phú và giải thích cực kỳ dễ hiểu.",
    date: "04/01/2026",
  },
  {
    code: "HV-012",
    name: "Xemesis",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "7.0",
    skill: "Listening",
    examTitle: "Cambridge Listening Note & Table Completion",
    band: "7.0",
    comment: "Đúng chất Skibidi! Học hiệu quả mà không bị gò bó. 10 điểm cho chất lượng!",
    date: "05/01/2026",
  },
  {
    code: "HV-013",
    name: "Hậu Hoàng",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "7.5",
    skill: "Speaking",
    examTitle: "Cue Card Part 2 & Discussion Part 3",
    band: "7.5",
    comment: "Vừa học vừa nhảy cũng ra được 7.5 Speaking nè. Skibidi đỉnh thật sự!",
    date: "06/01/2026",
  },
  {
    code: "HV-014",
    name: "Quang Hải",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "6.5",
    skill: "Reading",
    examTitle: "Academic Reading Tactical Skimming & Scanning",
    band: "6.5",
    comment:
      "Đọc hiểu chiến thuật trên sân cỏ hay trong bài thi Ielts đều cần sự tập trung. Skibidi đã giúp tôi điều đó.",
    date: "07/01/2026",
  },
  {
    code: "HV-015",
    name: "Lê Bống",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "7.0",
    skill: "Writing",
    examTitle: "Academic Data Chart & Essay Structure",
    band: "7.0",
    comment: "Viết lách không còn là nỗi sợ nhờ AI của Skibidi. Cảm ơn team rất nhiều!",
    date: "08/01/2026",
  },
  {
    code: "HV-016",
    name: "Trấn Thành",
    group: "Bảng Vàng IELTS SKIBIDI",
    target: "8.0",
    skill: "Speaking",
    examTitle: "Advanced Lexical Resource & Intonation",
    band: "8.0",
    comment:
      "Ielts Skibidi là một bước ngoặt lớn. Ngôn ngữ không chỉ là công cụ, nó là nghệ thuật.",
    date: "10/01/2026",
  },
];

function escapeCsvCell(val: unknown): string {
  const str = String(val ?? "").replace(/\r?\n/g, " ");
  if (str.includes(",") || str.includes('"') || str.includes(";")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function generateScoresSpreadsheetCsv(users: ServerUser[]): string {
  const headers = [
    "Mã Bản Ghi",
    "Họ và Tên Học Viên",
    "Email / Phân Nhóm",
    "Mục Tiêu Band",
    "Kỹ Năng",
    "Tên Đề Thi / Chủ Đề Học Thuật",
    "Band Đạt Được",
    "Nhận Xét Chuyên Môn / Chi Tiết",
    "Ngày Ghi Nhận",
  ];

  const rows: string[][] = [headers];

  // 1. Bài làm thực tế của người dùng trên hệ thống
  let liveCounter = 1;
  for (const user of users) {
    if (!user.submissions || user.submissions.length === 0) {
      rows.push([
        `USER-${String(liveCounter++).padStart(3, "0")}`,
        user.name || "Nguyễn Khang",
        user.email,
        String(user.targetScore || 7.5),
        "Tổng quan 4 Kỹ năng",
        `Hồ sơ học viên (${user.currentLevel || "Upper-Intermediate"}) - Chuỗi ${user.streak || 1} ngày`,
        "Đang luyện tập",
        `XP tích lũy: ${user.xp || 100} XP`,
        new Date(user.updatedAt || Date.now()).toLocaleDateString("vi-VN"),
      ]);
      continue;
    }

    for (const sub of user.submissions) {
      const skillLabel =
        sub.skill.charAt(0).toUpperCase() + sub.skill.slice(1).toLowerCase();
      const title =
        sub.details?.title ||
        sub.details?.topic ||
        `Đề thi Cambridge IELTS ${skillLabel} Academic`;
      const feedback =
        sub.details?.feedback?.overall ||
        sub.details?.overallFeedback ||
        (typeof sub.details?.correctCount === "number"
          ? `Đúng ${sub.details.correctCount}/${sub.details.totalQuestions || 40} câu`
          : "Đã chấm điểm tự động chuẩn Cambridge IELTS");
      rows.push([
        sub.id || `SUB-${String(liveCounter++).padStart(3, "0")}`,
        user.name || "Nguyễn Khang",
        user.email,
        String(user.targetScore || 7.5),
        skillLabel,
        title,
        `Band ${Number(sub.band).toFixed(1)}`,
        feedback,
        new Date(sub.date || Date.now()).toLocaleDateString("vi-VN"),
      ]);
    }
  }

  // 2. Bảng vàng 16 học viên tiêu biểu của IELTS SKIBIDI
  for (const item of FEATURED_STUDENT_RESULTS) {
    rows.push([
      item.code,
      item.name,
      item.group,
      `Band ${item.target}`,
      item.skill,
      item.examTitle,
      item.band,
      item.comment,
      item.date,
    ]);
  }

  return "\uFEFF" + rows.map((r) => r.map(escapeCsvCell).join(",")).join("\n");
}

export function generateVocabSpreadsheetCsv(customWords: VocabItem[] = []): string {
  const headers = [
    "Mã Từ",
    "Từ Vựng / Cụm Từ Học Thuật",
    "Phiên Âm (IPA)",
    "Từ Loại",
    "Cấp Độ CEFR",
    "Chủ Đề IELTS",
    "Nghĩa Tiếng Việt Chuẩn Học Thuật",
    "Cụm Từ Đi Kèm (Collocations Band 8.0+)",
    "Câu Ví Dụ Học Thuật Thực Chiến",
    "Từ Đồng Nghĩa (Synonyms)",
    "Trạng Thái",
  ];

  const allVocab = [...customWords, ...INITIAL_ACADEMIC_VOCAB];
  const rows: string[][] = [headers];

  allVocab.forEach((v, idx) => {
    rows.push([
      `VOC-${String(idx + 1).padStart(3, "0")}`,
      v.word,
      v.phonetic,
      v.partOfSpeech,
      v.level,
      v.topic,
      v.meaning,
      (v.collocations || []).join(" | "),
      v.example,
      (v.synonyms || []).join(", "),
      v.status === "mastered" ? "Đã thuộc lòng" : "Đang ôn luyện",
    ]);
  });

  return "\uFEFF" + rows.map((r) => r.map(escapeCsvCell).join(",")).join("\n");
}

function escapeHtml(str: unknown): string {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function generateAcademicReportHtml(
  users: ServerUser[],
  customWords: VocabItem[] = []
): string {
  const primaryUser = users[0] || {
    id: "usr_khang",
    name: "Nguyễn Khang",
    email: "khangwannafly@gmail.com",
    targetScore: 7.5,
    currentLevel: "Upper-Intermediate (B2-C1)",
    streak: 5,
    xp: 650,
    badges: ["First Steps", "Academic Scholar", "Writing Maestro"],
    submissions: [],
    updatedAt: new Date().toISOString(),
  };

  const subs = primaryUser.submissions || [];
  const avgBand =
    subs.length > 0
      ? (subs.reduce((a, b) => a + Number(b.band || 0), 0) / subs.length).toFixed(1)
      : "7.5";

  const allVocab = [...customWords, ...INITIAL_ACADEMIC_VOCAB];
  const nowStr = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const liveRowsHtml =
    subs.length > 0
      ? subs
          .map((sub, i) => {
            const skillName = sub.skill.toUpperCase();
            const title =
              sub.details?.title ||
              sub.details?.topic ||
              `Cambridge IELTS ${skillName} Practice`;
            const feedback =
              sub.details?.feedback?.overall ||
              sub.details?.overallFeedback ||
              "Hoàn thành bài thi theo chuẩn Computer-Delivered IELTS.";
            return `
            <tr>
              <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;color:#0f172a;">#${i + 1}</td>
              <td style="padding:10px;border:1px solid #cbd5e1;font-weight:bold;color:#1d4ed8;">${escapeHtml(skillName)}</td>
              <td style="padding:10px;border:1px solid #cbd5e1;color:#1e293b;">${escapeHtml(title)}</td>
              <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;background-color:#eff6ff;color:#1e40af;">Band ${Number(sub.band).toFixed(1)}</td>
              <td style="padding:10px;border:1px solid #cbd5e1;color:#334155;">${escapeHtml(feedback)}</td>
              <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;color:#64748b;">${escapeHtml(new Date(sub.date || Date.now()).toLocaleDateString("vi-VN"))}</td>
            </tr>`;
          })
          .join("")
      : `
        <tr>
          <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;">#1</td>
          <td style="padding:10px;border:1px solid #cbd5e1;font-weight:bold;color:#1d4ed8;">READING</td>
          <td style="padding:10px;border:1px solid #cbd5e1;">Cambridge IELTS 18 Academic Reading — Urban Microclimates</td>
          <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;background-color:#eff6ff;color:#1e40af;">Band 7.5</td>
          <td style="padding:10px;border:1px solid #cbd5e1;">Kỹ năng Skimming &amp; Scanning tốt, nắm vững nhóm câu hỏi True/False/Not Given.</td>
          <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;">15/11/2026</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;">#2</td>
          <td style="padding:10px;border:1px solid #cbd5e1;font-weight:bold;color:#047857;">LISTENING</td>
          <td style="padding:10px;border:1px solid #cbd5e1;">Cambridge IELTS Academic Listening — Part 1 to Part 4</td>
          <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;background-color:#ecfdf5;color:#065f46;">Band 8.0</td>
          <td style="padding:10px;border:1px solid #cbd5e1;">Nghe bắt từ khóa (Signposting words) chính xác ở cả hội thoại và bài giảng học thuật.</td>
          <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;">15/11/2026</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;">#3</td>
          <td style="padding:10px;border:1px solid #cbd5e1;font-weight:bold;color:#b45309;">WRITING</td>
          <td style="padding:10px;border:1px solid #cbd5e1;">Academic Writing Task 1 &amp; Task 2 — Decarbonisation &amp; Technology</td>
          <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;background-color:#fffbeb;color:#92400e;">Band 7.5</td>
          <td style="padding:10px;border:1px solid #cbd5e1;">Bố cục mạch lạc (Coherence &amp; Cohesion 7.5), sử dụng hiệu quả Collocations C1–C2.</td>
          <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;">15/11/2026</td>
        </tr>
        <tr>
          <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;">#4</td>
          <td style="padding:10px;border:1px solid #cbd5e1;font-weight:bold;color:#6d28d9;">SPEAKING</td>
          <td style="padding:10px;border:1px solid #cbd5e1;">Full 3-Part Speaking Simulation with AI Examiner</td>
          <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;background-color:#f5f3ff;color:#5b21b6;">Band 7.0</td>
          <td style="padding:10px;border:1px solid #cbd5e1;">Phản xạ tự nhiên, phát âm rõ ràng, triển khai ý Cue Card Part 2 đúng trọng tâm.</td>
          <td style="padding:10px;border:1px solid #cbd5e1;text-align:center;">15/11/2026</td>
        </tr>`;

  const hallOfFameRowsHtml = FEATURED_STUDENT_RESULTS.map(
    (s) => `
    <tr>
      <td style="padding:8px 10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;color:#475569;">${escapeHtml(s.code)}</td>
      <td style="padding:8px 10px;border:1px solid #cbd5e1;font-weight:bold;color:#0f172a;">${escapeHtml(s.name)}</td>
      <td style="padding:8px 10px;border:1px solid #cbd5e1;text-align:center;color:#1d4ed8;font-weight:bold;">${escapeHtml(s.skill)}</td>
      <td style="padding:8px 10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;background-color:#f8fafc;color:#0f172a;">${escapeHtml(s.band)}</td>
      <td style="padding:8px 10px;border:1px solid #cbd5e1;color:#334155;">${escapeHtml(s.comment)}</td>
      <td style="padding:8px 10px;border:1px solid #cbd5e1;text-align:center;color:#64748b;">${escapeHtml(s.date)}</td>
    </tr>`
  ).join("");

  const vocabRowsHtml = allVocab
    .map(
      (v, i) => `
    <tr>
      <td style="padding:8px 10px;border:1px solid #cbd5e1;text-align:center;color:#475569;">${i + 1}</td>
      <td style="padding:8px 10px;border:1px solid #cbd5e1;">
        <b style="color:#0f172a;font-size:11pt;">${escapeHtml(v.word)}</b><br/>
        <span style="color:#64748b;font-size:9pt;">${escapeHtml(v.phonetic)} (${escapeHtml(v.partOfSpeech)})</span>
      </td>
      <td style="padding:8px 10px;border:1px solid #cbd5e1;text-align:center;font-weight:bold;color:#1d4ed8;">${escapeHtml(v.level)}<br/><span style="font-size:8.5pt;color:#475569;font-weight:normal;">${escapeHtml(v.topic)}</span></td>
      <td style="padding:8px 10px;border:1px solid #cbd5e1;color:#1e293b;">${escapeHtml(v.meaning)}</td>
      <td style="padding:8px 10px;border:1px solid #cbd5e1;color:#0f172a;font-size:9.5pt;">
        <b>Collocations:</b> ${escapeHtml((v.collocations || []).join("; "))}<br/>
        <i style="color:#334155;">Ví dụ: "${escapeHtml(v.example)}"</i>
      </td>
    </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <title>Hồ Sơ Học Thuật &amp; Báo Cáo Chi Tiết - IELTS SKIBIDI</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; color: #0f172a; line-height: 1.5; max-width: 960px; margin: 0 auto; padding: 24px;">

  <!-- HEADER BANNER -->
  <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
    <tr>
      <td style="background-color:#0f172a; color:#ffffff; padding:24px 28px; border-radius:8px;">
        <p style="margin:0 0 6px 0; font-size:10pt; letter-spacing:1.5px; text-transform:uppercase; color:#93c5fd; font-weight:bold;">
          CAMBRIDGE ACADEMIC ASSESSMENT &amp; CLOUD ARCHIVE
        </p>
        <h1 style="margin:0 0 8px 0; font-size:22pt; color:#ffffff;">
          IELTS SKIBIDI — HỒ SƠ HỌC THUẬT &amp; BÁO CÁO TIẾN ĐỘ
        </h1>
        <p style="margin:0; font-size:10.5pt; color:#cbd5e1;">
          Tài khoản lưu trữ: <b>${escapeHtml(primaryUser.email)}</b> &nbsp;|&nbsp; Cập nhật lúc: <b>${escapeHtml(nowStr)}</b>
        </p>
      </td>
    </tr>
  </table>

  <!-- PHẦN 1: THÔNG TIN TỔNG QUAN HỌC VIÊN -->
  <h2 style="color:#0f172a; font-size:14pt; border-bottom:2px solid #1d4ed8; padding-bottom:6px; margin-top:24px;">
    1. TỔNG QUAN HỒ SƠ HỌC VIÊN (CANDIDATE PROFILE)
  </h2>
  <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
    <tr>
      <td style="width:25%; padding:14px; border:1px solid #cbd5e1; background-color:#f8fafc;">
        <span style="font-size:9pt; color:#64748b; text-transform:uppercase; font-weight:bold;">Họ và tên thí sinh</span><br/>
        <b style="font-size:13pt; color:#0f172a;">${escapeHtml(primaryUser.name || "Nguyễn Khang")}</b>
      </td>
      <td style="width:25%; padding:14px; border:1px solid #cbd5e1; background-color:#eff6ff;">
        <span style="font-size:9pt; color:#1e40af; text-transform:uppercase; font-weight:bold;">Mục tiêu (Target Band)</span><br/>
        <b style="font-size:15pt; color:#1d4ed8;">Band ${Number(primaryUser.targetScore || 7.5).toFixed(1)}</b>
      </td>
      <td style="width:25%; padding:14px; border:1px solid #cbd5e1; background-color:#ecfdf5;">
        <span style="font-size:9pt; color:#065f46; text-transform:uppercase; font-weight:bold;">Band Trung Bình Hiện Tại</span><br/>
        <b style="font-size:15pt; color:#047857;">Band ${escapeHtml(avgBand)}</b>
      </td>
      <td style="width:25%; padding:14px; border:1px solid #cbd5e1; background-color:#fffbeb;">
        <span style="font-size:9pt; color:#92400e; text-transform:uppercase; font-weight:bold;">Chuỗi Ngày Học &amp; Điểm XP</span><br/>
        <b style="font-size:13pt; color:#b45309;">${primaryUser.streak || 5} ngày (${primaryUser.xp || 650} XP)</b>
      </td>
    </tr>
  </table>

  <!-- PHẦN 2: BẢNG ĐIỂM & LỊCH SỬ BÀI THI -->
  <h2 style="color:#0f172a; font-size:14pt; border-bottom:2px solid #1d4ed8; padding-bottom:6px; margin-top:28px;">
    2. LỊCH SỬ BÀI THI &amp; ĐÁNH GIÁ CHUYÊN MÔN 4 KỸ NĂNG
  </h2>
  <table style="width:100%; border-collapse:collapse; margin-bottom:24px; font-size:10pt;">
    <thead>
      <tr style="background-color:#0f172a; color:#ffffff;">
        <th style="padding:10px; border:1px solid #0f172a; width:6%;">STT</th>
        <th style="padding:10px; border:1px solid #0f172a; width:13%;">Kỹ Năng</th>
        <th style="padding:10px; border:1px solid #0f172a; width:28%;">Đề Thi / Chủ Đề</th>
        <th style="padding:10px; border:1px solid #0f172a; width:12%;">Kết Quả</th>
        <th style="padding:10px; border:1px solid #0f172a; width:29%;">Nhận Xét Của Giám Khảo AI</th>
        <th style="padding:10px; border:1px solid #0f172a; width:12%;">Ngày Thi</th>
      </tr>
    </thead>
    <tbody>
      ${liveRowsHtml}
    </tbody>
  </table>

  <!-- PHẦN 3: BẢNG VÀNG HỌC VIÊN IELTS SKIBIDI -->
  <h2 style="color:#0f172a; font-size:14pt; border-bottom:2px solid #1d4ed8; padding-bottom:6px; margin-top:28px;">
    3. BẢNG VÀNG KẾT QUẢ HỌC VIÊN TIÊU BIỂU IELTS SKIBIDI (16 HỌC VIÊN)
  </h2>
  <table style="width:100%; border-collapse:collapse; margin-bottom:24px; font-size:9.5pt;">
    <thead>
      <tr style="background-color:#1e293b; color:#ffffff;">
        <th style="padding:9px; border:1px solid #1e293b; width:10%;">Mã HV</th>
        <th style="padding:9px; border:1px solid #1e293b; width:18%;">Học Viên</th>
        <th style="padding:9px; border:1px solid #1e293b; width:12%;">Kỹ Năng</th>
        <th style="padding:9px; border:1px solid #1e293b; width:12%;">Điểm Số</th>
        <th style="padding:9px; border:1px solid #1e293b; width:36%;">Chia Sẻ &amp; Đánh Giá Thực Tế</th>
        <th style="padding:9px; border:1px solid #1e293b; width:12%;">Ngày</th>
      </tr>
    </thead>
    <tbody>
      ${hallOfFameRowsHtml}
    </tbody>
  </table>

  <!-- PHẦN 4: SỔ TAY TỪ VỰNG HỌC THUẬT C1-C2 -->
  <h2 style="color:#0f172a; font-size:14pt; border-bottom:2px solid #1d4ed8; padding-bottom:6px; margin-top:28px;">
    4. SỔ TAY TỪ VỰNG HỌC THUẬT C1–C2 &amp; COLLOCATIONS TRỌNG TÂM (${allVocab.length} TỪ)
  </h2>
  <table style="width:100%; border-collapse:collapse; margin-bottom:24px; font-size:9.5pt;">
    <thead>
      <tr style="background-color:#0f172a; color:#ffffff;">
        <th style="padding:9px; border:1px solid #0f172a; width:6%;">STT</th>
        <th style="padding:9px; border:1px solid #0f172a; width:22%;">Từ Vựng &amp; Phiên Âm</th>
        <th style="padding:9px; border:1px solid #0f172a; width:12%;">Cấp Độ</th>
        <th style="padding:9px; border:1px solid #0f172a; width:22%;">Nghĩa Học Thuật</th>
        <th style="padding:9px; border:1px solid #0f172a; width:38%;">Collocations &amp; Ví Dụ Chuẩn Band 8.0+</th>
      </tr>
    </thead>
    <tbody>
      ${vocabRowsHtml}
    </tbody>
  </table>

</body>
</html>`;
}
