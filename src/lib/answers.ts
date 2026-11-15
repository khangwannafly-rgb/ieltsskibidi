/**
 * Chuẩn hoá câu trả lời để so sánh: bỏ khoảng trắng thừa, chữ hoa/thường,
 * dấu câu ở đầu/cuối, mạo từ đầu câu và các biến thể True/False/Not Given.
 */
export function normalizeAnswer(value: unknown): string {
  if (value === null || value === undefined) return "";
  let s = String(value).toLowerCase().trim();
  s = s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  s = s.replace(/^[\s"'.,;:!?()[\]]+|[\s"'.,;:!?()[\]]+$/g, "");
  s = s.replace(/\s+/g, " ");

  // Đồng nhất các biến thể TFN / YNNG
  const aliases: Record<string, string> = {
    t: "true", f: "false", ng: "not given", "not-given": "not given", notgiven: "not given",
    y: "yes", n: "no",
  };
  if (aliases[s]) s = aliases[s];

  // Bỏ mạo từ đầu câu cho dạng điền từ (the/a/an)
  s = s.replace(/^(the|a|an) /, "");
  return s;
}

/** Lấy phần chữ cái/số La Mã lựa chọn (A-H, Paragraph A-H, i-x) nếu đáp án có dạng "A", "A. text", "Paragraph A", "iv. text"... */
function optionLetter(value: string): string | null {
  const para = value.match(/^paragraph\s+([a-h])$/i);
  if (para) return para[1].toLowerCase();
  const roman = value.match(/^(i{1,3}|iv|vi{0,3}|ix|x)(?:[.):]\s*|\s+|$)/i);
  if (roman) return roman[1].toLowerCase();
  const m = value.match(/^([a-h])(?:[.):]\s*|\s+|$)/i);
  return m ? m[1].toLowerCase() : null;
}

/** So sánh câu trả lời của người dùng với đáp án đúng (hỗ trợ nhiều đáp án ngăn cách bởi "/" hoặc "|"). */
export function isAnswerCorrect(userAnswer: unknown, correctAnswer: unknown): boolean {
  const user = normalizeAnswer(userAnswer);
  if (!user) return false;

  const rawCorrect = String(correctAnswer ?? "");
  // So sánh cả chuỗi đầy đủ lẫn từng phương án thay thế ("A / B", "A | B", "A OR B")
  const candidates = [rawCorrect, ...rawCorrect.split(/\s+\/\s+|\s*\|\s*|\s+OR\s+/)]
    .map(normalizeAnswer)
    .filter(Boolean);

  for (const correct of candidates) {
    if (user === correct) return true;
    // MCQ / Matching: người dùng chọn "B. something" hoặc "Paragraph B" và đáp án là "B" (hoặc ngược lại)
    const uLetter = optionLetter(user);
    const cLetter = optionLetter(correct);
    if (uLetter && cLetter && (user.length <= 12 || correct.length <= 12) && uLetter === cLetter) return true;
    // MCQ: đáp án là nội dung lựa chọn, người dùng chọn "B. nội dung"
    const stripped = user.replace(/^(?:[a-h]|i{1,3}|iv|vi{0,3}|ix|x)[.):]\s*/i, "");
    if (stripped === correct) return true;
    const strippedCorrect = correct.replace(/^(?:[a-h]|i{1,3}|iv|vi{0,3}|ix|x)[.):]\s*/i, "");
    if (user === strippedCorrect || stripped === strippedCorrect) return true;
  }
  return false;
}
