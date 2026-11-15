import { NextResponse } from "next/server";
import { generateAIJsonWithFallback } from "@/lib/gemini";
import { readJsonBody } from "@/lib/ai-response";
import {
  checkRateLimit,
  rateLimitExceededResponse,
  sanitizeString,
} from "@/lib/api-guard";
import { shuffleArray, VocabTopic } from "@/lib/vocabulary";

interface GeneratedVocabItem {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  level: "C1" | "C2";
  topic: VocabTopic;
  meaning: string;
  collocations: string[];
  example: string;
  synonyms: string[];
}

const EXTRA_RANDOM_CAMBRIDGE_POOL: GeneratedVocabItem[] = [
  {
    word: "circular economy",
    phonetic: "/ˌsɜː.kjʊ.lər iˈkɒn.ə.mi/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Environment",
    meaning: "Kinh tế tuần hoàn (tái chế và tái sử dụng tài nguyên tối đa để giảm rác thải)",
    collocations: [
      "transition towards a circular economy",
      "embrace circular economy principles",
      "foster a closed-loop circular economy",
    ],
    example:
      "Transitioning towards a circular economy is imperative if industrialised nations wish to decouple economic growth from resource depletion.",
    synonyms: ["closed-loop economy", "regenerative industrial model"],
  },
  {
    word: "ecological footprint",
    phonetic: "/ˌiː.kəˈlɒdʒ.ɪ.kəl ˈfʊt.prɪnt/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Environment",
    meaning: "Dấu chân sinh thái (tổng mức độ tác động và tiêu thụ tài nguyên của con người)",
    collocations: [
      "minimise one's ecological footprint",
      "leave a disproportionate ecological footprint",
    ],
    example:
      "Affluent metropolitan areas frequently leave a disproportionate ecological footprint on surrounding agricultural regions.",
    synonyms: ["environmental impact", "carbon burden"],
  },
  {
    word: "algorithmic bias",
    phonetic: "/ˌæl.ɡəˈrɪð.mɪk ˈbaɪ.əs/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Technology",
    meaning: "Thiên kiến thuật toán (sự thiếu công bằng có hệ thống do dữ liệu huấn luyện AI)",
    collocations: [
      "perpetuate algorithmic bias",
      "audit automated systems for algorithmic bias",
      "mitigate entrenched algorithmic bias",
    ],
    example:
      "Unregulated recruitment software may inadvertently perpetuate algorithmic bias against underrepresented demographic groups.",
    synonyms: ["automated prejudice", "systematic model distortion"],
  },
  {
    word: "digital sovereignty",
    phonetic: "/ˈdɪdʒ.ɪ.təl ˈsɒv.rɪn.ti/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Technology",
    meaning: "Chủ quyền số (quyền tự chủ kiểm soát hạ tầng và dữ liệu công nghệ của quốc gia)",
    collocations: [
      "safeguard national digital sovereignty",
      "assert digital sovereignty over cloud infrastructure",
    ],
    example:
      "Many governments are enacting data-localisation laws to safeguard national digital sovereignty.",
    synonyms: ["technological autonomy", "data self-determination"],
  },
  {
    word: "experiential learning",
    phonetic: "/ɪkˌspɪə.riˈen.ʃəl ˈlɜː.nɪŋ/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Education",
    meaning: "Học tập qua trải nghiệm thực tế (thay vì chỉ học lý thuyết sách vở)",
    collocations: [
      "integrate experiential learning into the curriculum",
      "prioritise hands-on experiential learning",
    ],
    example:
      "Tertiary institutions are increasingly integrating experiential learning modules to bridge the gap between academic theory and workplace readiness.",
    synonyms: ["hands-on education", "practical pedagogy"],
  },
  {
    word: "intellectual curiosity",
    phonetic: "/ˌɪn.təlˈek.tʃu.əl ˌkjʊə.riˈɒs.ə.ti/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Education",
    meaning: "Sự tò mò, ham học hỏi và khám phá tri thức chuyên sâu",
    collocations: [
      "stifle innate intellectual curiosity",
      "cultivate lifelong intellectual curiosity",
    ],
    example:
      "Over-reliance on standardised testing risks stifling students' innate intellectual curiosity.",
    synonyms: ["inquisitiveness", "thirst for knowledge"],
  },
  {
    word: "urban sprawl",
    phonetic: "/ˈɜː.bən sprɔːl/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Urbanisation",
    meaning: "Sự đô thị hóa tràn lan, mở rộng thiếu quy hoạch ra vùng ngoại ô",
    collocations: [
      "unregulated urban sprawl",
      "curb horizontal urban sprawl",
      "encroach upon arable land through urban sprawl",
    ],
    example:
      "High-density vertical housing is widely regarded as an effective antidote to unregulated urban sprawl.",
    synonyms: ["suburban expansion", "unplanned metropolitan growth"],
  },
  {
    word: "civic infrastructure",
    phonetic: "/ˈsɪv.ɪk ˈɪn.frəˌstrʌk.tʃər/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Urbanisation",
    meaning: "Cơ sở hạ tầng dân sinh công cộng (bệnh viện, công viên, giao thông, trường học)",
    collocations: [
      "modernise ageing civic infrastructure",
      "place immense strain on civic infrastructure",
    ],
    example:
      "Rapid rural-to-urban migration has placed immense strain on municipal housing and civic infrastructure.",
    synonyms: ["public amenities", "municipal facilities"],
  },
  {
    word: "intergenerational equity",
    phonetic: "/ˌɪn.tə.dʒen.əˈreɪ.ʃən.əl ˈek.wɪ.ti/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Economy & Society",
    meaning: "Sự công bằng giữa các thế hệ (không để thế hệ tương lai gánh chịu nợ nần/ô nhiễm)",
    collocations: [
      "uphold intergenerational equity",
      "undermine long-term intergenerational equity",
    ],
    example:
      "Sound fiscal and environmental policies must uphold intergenerational equity rather than prioritising short-term political gains.",
    synonyms: ["fairness across generations", "long-term societal justice"],
  },
  {
    word: "universal basic income",
    phonetic: "/ˌjuː.nɪˈvɜː.səl ˈbeɪ.sɪk ˈɪŋ.kʌm/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Economy & Society",
    meaning: "Thu nhập cơ bản phổ quát (khoản trợ cấp định kỳ cho mọi công dân)",
    collocations: [
      "pilot a universal basic income scheme",
      "cushion automation shocks via universal basic income",
    ],
    example:
      "Several economists advocate for a universal basic income to cushion the workforce against AI-induced job displacement.",
    synonyms: ["guaranteed minimum income", "unconditional social dividend"],
  },
  {
    word: "psychosomatic",
    phonetic: "/ˌsaɪ.kəʊ.səˈmæt.ɪk/",
    partOfSpeech: "adjective",
    level: "C2",
    topic: "Health & Psychology",
    meaning: "Tâm thể (bệnh lý thể chất khởi phát hoặc trầm trọng hơn do căng thẳng tâm lý)",
    collocations: [
      "manifest psychosomatic symptoms",
      "stress-induced psychosomatic disorders",
    ],
    example:
      "Prolonged occupational burnout frequently manifests in acute psychosomatic ailments among corporate employees.",
    synonyms: ["mind-body related", "stress-triggered physical"],
  },
  {
    word: "herd immunity",
    phonetic: "/ˌhɜːd ɪˈmjuː.nə.ti/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Health & Psychology",
    meaning: "Miễn dịch cộng đồng",
    collocations: [
      "achieve population-wide herd immunity",
      "jeopardise herd immunity thresholds",
    ],
    example:
      "Declining childhood vaccination uptake threatens to jeopardise herd immunity against preventable infectious diseases.",
    synonyms: ["community immunity", "collective epidemiological protection"],
  },
  {
    word: "white-collar crime",
    phonetic: "/ˌwaɪtˈkɒl.ər kraɪm/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Crime & Law",
    meaning: "Tội phạm cổ cồn trắng (gian lận tài chính, tham nhũng, rửa tiền trong giới chức/doanh nghiệp)",
    collocations: [
      "prosecute corporate white-collar crime",
      "lenient sentencing for white-collar crime",
    ],
    example:
      "Public trust in the judiciary erodes when white-collar crime receives disproportionately lenient sentencing.",
    synonyms: ["corporate fraud", "financial malfeasance"],
  },
  {
    word: "presumption of innocence",
    phonetic: "/prɪˈzʌmp.ʃən əv ˈɪn.ə.səns/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Crime & Law",
    meaning: "Nguyên tắc suy đoán vô tội (mọi bị cáo đều vô tội cho đến khi được chứng minh phạm tội)",
    collocations: [
      "uphold the fundamental presumption of innocence",
      "erode the presumption of innocence through trial by media",
    ],
    example:
      "Sensationalised media coverage of ongoing trials often erodes the defendant's constitutional presumption of innocence.",
    synonyms: ["due process protection", "burden of proof principle"],
  },
  {
    word: "commodification of culture",
    phonetic: "/kəˌmɒd.ɪ.fɪˈkeɪ.ʃən əv ˈkʌl.tʃər/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Media & Culture",
    meaning: "Sự thương mại hóa văn hóa (biến các giá trị truyền thống thành hàng hóa kiếm lời)",
    collocations: [
      "resist the rampant commodification of culture",
      "mass tourism and the commodification of indigenous culture",
    ],
    example:
      "While mass tourism generates revenue, it frequently leads to the superficial commodification of local culture.",
    synonyms: ["commercialisation of heritage", "cultural monetisation"],
  },
  {
    word: "epistemological",
    phonetic: "/ɪˌpɪs.tə.məˈlɒdʒ.ɪ.kəl/",
    partOfSpeech: "adjective",
    level: "C2",
    topic: "Science & Innovation",
    meaning: "Thuộc về nhận thức luận (bản chất, nguồn gốc và giới hạn của tri thức khoa học)",
    collocations: [
      "epistemological foundations of modern science",
      "trigger an epistemological crisis",
    ],
    example:
      "The proliferation of deepfake media has triggered an epistemological crisis regarding the verifiability of digital evidence.",
    synonyms: ["knowledge-theoretical", "foundational scientific"],
  },
  {
    word: "exponential trajectory",
    phonetic: "/ˌek.spəˈnen.ʃəl trəˈdʒek.tər.i/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Academic Task 1",
    meaning: "Quỹ đạo tăng trưởng theo cấp số nhân (tăng vọt cực nhanh trên biểu đồ)",
    collocations: [
      "follow a steep exponential trajectory",
      "maintain an upward exponential trajectory between 2015 and 2025",
    ],
    example:
      "Following a period of stagnation, global solar photovoltaic capacity followed a steep exponential trajectory from 2015 onwards.",
    synonyms: ["geometric surge", "rapid upward curve"],
  },
  {
    word: "marginal fluctuation",
    phonetic: "/ˈmɑː.dʒɪ.nəl ˌflʌk.tʃuˈeɪ.ʃən/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Academic Task 1",
    meaning: "Sự biến động nhỏ, không đáng kể quanh một mức ổn định",
    collocations: [
      "experience only marginal fluctuations",
      "exhibit marginal fluctuations throughout the decade",
    ],
    example:
      "In contrast to the volatile tech sector, agricultural employment experienced only marginal fluctuations over the twenty-year period.",
    synonyms: ["minor oscillation", "negligible variation"],
  },
];

export async function POST(req: Request) {
  const rl = checkRateLimit(req, "vocab-generate", 25, 60_000);
  if (!rl.allowed) return rateLimitExceededResponse(rl.retryAfterSeconds);

  const body = await readJsonBody<{
    topic?: string;
    count?: number;
    excludeWords?: string[];
  }>(req);

  const count = Math.min(8, Math.max(1, Number(body.count) || 4));
  const topicFilter = sanitizeString(body.topic, 50) || "all";
  const excludeSet = new Set(
    Array.isArray(body.excludeWords)
      ? body.excludeWords.map((w) => String(w).toLowerCase())
      : []
  );

  // Chuẩn bị bộ từ vựng ngẫu nhiên từ kho Cambridge mở rộng làm fallback tức thì
  const filteredPool = EXTRA_RANDOM_CAMBRIDGE_POOL.filter((item) => {
    if (excludeSet.has(item.word.toLowerCase())) return false;
    if (topicFilter !== "all" && item.topic !== topicFilter) return false;
    return true;
  });

  const fallbackPool =
    filteredPool.length >= count
      ? shuffleArray(filteredPool).slice(0, count)
      : shuffleArray(
          EXTRA_RANDOM_CAMBRIDGE_POOL.filter((i) => !excludeSet.has(i.word.toLowerCase()))
        ).slice(0, count);

  const prompt = `Generate ${count} random, high-impact IELTS Academic C1-C2 vocabulary terms or collocations${
    topicFilter !== "all" ? ` strictly on the topic "${topicFilter}"` : " across diverse IELTS Academic topics"
  }.
Do NOT include any of these words: ${Array.from(excludeSet).slice(0, 30).join(", ")}.
Return ONLY a valid JSON object matching this exact structure:
{
  "items": [
    {
      "word": "string (C1 or C2 academic term/collocation)",
      "phonetic": "string (IPA phonetic transcription)",
      "partOfSpeech": "string (e.g. noun phrase, verb, adjective)",
      "level": "C1" | "C2",
      "topic": "${topicFilter !== "all" ? topicFilter : "Environment"}",
      "meaning": "string (Clear Vietnamese academic explanation)",
      "collocations": ["string", "string", "string"],
      "example": "string (Band 8.5+ IELTS Academic Writing sentence using the term)",
      "synonyms": ["string", "string"]
    }
  ]
}`;

  const result = await generateAIJsonWithFallback<{ items: GeneratedVocabItem[] }>(
    prompt,
    () => ({
      items:
        fallbackPool.length > 0
          ? fallbackPool
          : shuffleArray(EXTRA_RANDOM_CAMBRIDGE_POOL).slice(0, count),
    })
  );

  const validItems =
    Array.isArray(result.items) && result.items.length > 0
      ? result.items
      : shuffleArray(EXTRA_RANDOM_CAMBRIDGE_POOL).slice(0, count);

  return NextResponse.json({
    items: validItems,
    source: result._meta?.source || "cambridge-bank",
  });
}
