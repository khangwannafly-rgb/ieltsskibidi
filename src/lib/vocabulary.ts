export type VocabTopic =
  | "Environment"
  | "Technology"
  | "Education"
  | "Urbanisation"
  | "Economy & Society"
  | "Academic Task 1"
  | "Saved from Tests";

export interface VocabItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  level: "C1" | "C2";
  topic: VocabTopic;
  meaning: string;
  collocations: string[];
  example: string;
  synonyms: string[];
  status: "learning" | "mastered";
  isCustom?: boolean;
}

const VOCAB_STORAGE_KEY = "ielts_skibidi_vocab_v1";

export const INITIAL_ACADEMIC_VOCAB: VocabItem[] = [
  // Environment
  {
    id: "voc_1",
    word: "anthropogenic",
    phonetic: "/ˌæn.θrə.pəˈdʒen.ɪk/",
    partOfSpeech: "adjective",
    level: "C2",
    topic: "Environment",
    meaning: "Gây ra bởi tác động của con người (đặc biệt là ô nhiễm, biến đổi khí hậu)",
    collocations: [
      "anthropogenic climate change",
      "anthropogenic greenhouse gas emissions",
      "anthropogenic pressures on ecosystems",
    ],
    example:
      "Empirical evidence overwhelmingly indicates that contemporary global warming is primarily anthropogenic in nature.",
    synonyms: ["human-induced", "man-made"],
    status: "learning",
  },
  {
    id: "voc_2",
    word: "ecological degradation",
    phonetic: "/ˌiː.kəˈlɒdʒ.ɪ.kəl ˌdeɡ.rəˈdeɪ.ʃən/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Environment",
    meaning: "Sự suy thoái hệ sinh thái",
    collocations: [
      "accelerate ecological degradation",
      "halt ecological degradation",
      "irreversible ecological degradation",
    ],
    example:
      "Unchecked industrial expansion often comes at the expense of severe ecological degradation.",
    synonyms: ["environmental deterioration", "habitat destruction"],
    status: "learning",
  },
  {
    id: "voc_3",
    word: "decarbonisation",
    phonetic: "/ˌdiː.kɑː.bən.aɪˈzeɪ.ʃən/",
    partOfSpeech: "noun",
    level: "C1",
    topic: "Environment",
    meaning: "Quá trình cắt giảm lượng khí thải carbon",
    collocations: [
      "rapid decarbonisation of the power grid",
      "decarbonisation strategy",
      "incentivise industrial decarbonisation",
    ],
    example:
      "Government subsidies for solar and wind power are indispensable for the rapid decarbonisation of the national energy grid.",
    synonyms: ["carbon reduction", "clean-energy transition"],
    status: "learning",
  },
  {
    id: "voc_4",
    word: "biodiversity loss",
    phonetic: "/ˌbaɪ.əʊ.daɪˈvɜː.sə.ti lɒs/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Environment",
    meaning: "Sự suy giảm đa dạng sinh học",
    collocations: [
      "mitigate biodiversity loss",
      "unprecedented biodiversity loss",
      "curb habitat fragmentation and biodiversity loss",
    ],
    example:
      "Deforestation in tropical basins has triggered unprecedented biodiversity loss over the past four decades.",
    synonyms: ["species depletion", "ecological impoverishment"],
    status: "learning",
  },

  // Technology
  {
    id: "voc_5",
    word: "ubiquitous",
    phonetic: "/juːˈbɪk.wɪ.təs/",
    partOfSpeech: "adjective",
    level: "C1",
    topic: "Technology",
    meaning: "Phổ biến ở khắp mọi nơi cùng một lúc",
    collocations: [
      "ubiquitous connectivity",
      "become increasingly ubiquitous",
      "ubiquitous smart devices",
    ],
    example:
      "Algorithmic recommendation engines have become ubiquitous in shaping modern media consumption.",
    synonyms: ["omnipresent", "pervasive", "all-pervasive"],
    status: "learning",
  },
  {
    id: "voc_6",
    word: "algorithmic bias",
    phonetic: "/ˌæl.ɡəˈrɪð.mɪk ˈbaɪ.əs/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Technology",
    meaning: "Sự thiên vị của thuật toán (do dữ liệu huấn luyện lệch lạc)",
    collocations: [
      "perpetuate algorithmic bias",
      "mitigate algorithmic bias",
      "scrutinise automated systems for algorithmic bias",
    ],
    example:
      "Without rigorous regulatory oversight, automated recruitment tools risk perpetuating algorithmic bias against minority applicants.",
    synonyms: ["systematic AI distortion", "computational prejudice"],
    status: "learning",
  },
  {
    id: "voc_7",
    word: "technological obsolescence",
    phonetic: "/ˌtek.nəˈlɒdʒ.ɪ.kəl ˌɒb.səlˈes.əns/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Technology",
    meaning: "Sự lỗi thời về công nghệ",
    collocations: [
      "planned obsolescence",
      "accelerate technological obsolescence",
      "electronic waste from rapid obsolescence",
    ],
    example:
      "Shortened product lifecycles and planned technological obsolescence have exacerbated the global electronic waste crisis.",
    synonyms: ["outdatedness", "rapid depreciation"],
    status: "learning",
  },
  {
    id: "voc_8",
    word: "democratise access",
    phonetic: "/dɪˈmɒk.rə.taɪz ˈæk.ses/",
    partOfSpeech: "verb phrase",
    level: "C1",
    topic: "Technology",
    meaning: "Bình đẳng hóa / phổ cập quyền tiếp cận cho mọi người",
    collocations: [
      "democratise access to higher education",
      "democratise access to specialised knowledge",
    ],
    example:
      "Open-source learning platforms have democratised access to ivy-league coursework for students in developing nations.",
    synonyms: ["broaden accessibility", "universalise access"],
    status: "learning",
  },

  // Education
  {
    id: "voc_9",
    word: "pedagogical",
    phonetic: "/ˌped.əˈɡɒdʒ.ɪ.kəl/",
    partOfSpeech: "adjective",
    level: "C2",
    topic: "Education",
    meaning: "Thuộc về phương pháp sư phạm / giảng dạy",
    collocations: [
      "pedagogical framework",
      "innovative pedagogical approaches",
      "pedagogical efficacy",
    ],
    example:
      "Shifting from rote memorisation to inquiry-based learning requires a fundamental pedagogical overhaul.",
    synonyms: ["instructional", "educational", "didactic"],
    status: "learning",
  },
  {
    id: "voc_10",
    word: "holistic development",
    phonetic: "/həʊˈlɪs.tɪk dɪˈvel.əp.mənt/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Education",
    meaning: "Sự phát triển toàn diện (cả trí tuệ, thể chất và cảm xúc)",
    collocations: [
      "foster holistic development",
      "prioritise a child's holistic development",
      "holistic curriculum",
    ],
    example:
      "Extracurricular arts and team sports are vital for fostering the holistic development of adolescents.",
    synonyms: ["well-rounded growth", "comprehensive maturation"],
    status: "learning",
  },
  {
    id: "voc_11",
    word: "rote memorisation",
    phonetic: "/rəʊt ˌmem.ə.raɪˈzeɪ.ʃən/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Education",
    meaning: "Học vẹt / ghi nhớ máy móc không qua tư duy phản biện",
    collocations: [
      "rely on rote memorisation",
      "discourage rote memorisation",
      "move beyond exam-oriented rote memorisation",
    ],
    example:
      "Excessive reliance on standardised testing often incentivises rote memorisation at the expense of creative problem-solving.",
    synonyms: ["mechanical learning", "cramming"],
    status: "learning",
  },
  {
    id: "voc_12",
    word: "cognitive plasticity",
    phonetic: "/ˈkɒɡ.nə.tɪv plæsˈtɪs.ə.ti/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Education",
    meaning: "Tính linh hoạt / khả năng thích ứng của nhận thức não bộ",
    collocations: [
      "enhance cognitive plasticity",
      "high cognitive plasticity in early childhood",
    ],
    example:
      "Neuroscientific studies demonstrate that bilingualism significantly enhances cognitive plasticity and executive control.",
    synonyms: ["neural adaptability", "mental flexibility"],
    status: "learning",
  },

  // Urbanisation
  {
    id: "voc_13",
    word: "urban sprawl",
    phonetic: "/ˈɜː.bən sprɔːl/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Urbanisation",
    meaning: "Sự đô thị hóa tự phát tràn lan ra vùng ngoại ô",
    collocations: [
      "uncontrolled urban sprawl",
      "curb urban sprawl",
      "encroach on agricultural land through urban sprawl",
    ],
    example:
      "Uncontrolled urban sprawl has lengthened daily commuting times and encroached upon fertile agricultural belts.",
    synonyms: ["suburban expansion", "metropolitan dispersion"],
    status: "learning",
  },
  {
    id: "voc_14",
    word: "gentrification",
    phonetic: "/ˌdʒen.trɪ.fɪˈkeɪ.ʃən/",
    partOfSpeech: "noun",
    level: "C2",
    topic: "Urbanisation",
    meaning: "Sự chỉnh trang đô thị làm tăng giá thuê nhà và đẩy cư dân thu nhập thấp ra ngoài",
    collocations: [
      "rapid neighbourhood gentrification",
      "displacement caused by gentrification",
    ],
    example:
      "While inner-city revitalisation attracts commercial investment, it frequently triggers gentrification that displaces long-standing working-class communities.",
    synonyms: ["urban upscale redevelopment", "socio-spatial displacement"],
    status: "learning",
  },
  {
    id: "voc_15",
    word: "civic infrastructure",
    phonetic: "/ˈsɪv.ɪk ˈɪn.frəˌstrʌk.tʃər/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Urbanisation",
    meaning: "Cơ sở hạ tầng dân sinh đô thị (giao thông, y tế, công viên, cấp thoát nước)",
    collocations: [
      "overburdened civic infrastructure",
      "modernise aging civic infrastructure",
      "invest in resilient civic infrastructure",
    ],
    example:
      "Rapid rural-to-urban migration has placed immense strain on the metropolis's aging civic infrastructure.",
    synonyms: ["municipal facilities", "public utilities"],
    status: "learning",
  },

  // Economy & Society
  {
    id: "voc_16",
    word: "socio-economic disparity",
    phonetic: "/ˌsəʊ.si.əʊ.iː.kəˈnɒm.ɪk dɪˈspær.ə.ti/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Economy & Society",
    meaning: "Sự chênh lệch / bất bình đẳng về kinh tế - xã hội",
    collocations: [
      "widen socio-economic disparities",
      "bridge the socio-economic disparity",
      "entrenched socio-economic disparity",
    ],
    example:
      "Unequal access to digital tools threatens to widen existing socio-economic disparities between urban and rural populations.",
    synonyms: ["wealth inequality", "income polarization"],
    status: "learning",
  },
  {
    id: "voc_17",
    word: "demographic shift",
    phonetic: "/ˌdem.əˈɡræf.ɪk ʃɪft/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Economy & Society",
    meaning: "Sự dịch chuyển nhân khẩu học (ví dụ: già hóa dân số)",
    collocations: [
      "profound demographic shift",
      "ageing demographic shift",
      "adapt pension systems to demographic shifts",
    ],
    example:
      "Many industrialised nations are grappling with a profound demographic shift characterised by declining fertility rates and an ageing workforce.",
    synonyms: ["population restructuring", "generational transition"],
    status: "learning",
  },
  {
    id: "voc_18",
    word: "double-edged sword",
    phonetic: "/ˌdʌb.əl.edʒd ˈsɔːd/",
    partOfSpeech: "idiom / noun phrase",
    level: "C1",
    topic: "Economy & Society",
    meaning: "Con dao hai lưỡi (vừa có lợi ích lớn vừa tiềm ẩn hệ lụy)",
    collocations: [
      "prove to be a double-edged sword",
      "act as a double-edged sword for local economies",
    ],
    example:
      "International mass tourism acts as a double-edged sword, generating vital foreign revenue while eroding indigenous cultural traditions.",
    synonyms: ["mixed blessing", "paradoxical phenomenon"],
    status: "learning",
  },
  {
    id: "voc_19",
    word: "catalyst",
    phonetic: "/ˈkæt.əl.ɪst/",
    partOfSpeech: "noun",
    level: "C1",
    topic: "Economy & Society",
    meaning: "Chất xúc tác / động lực thúc đẩy sự thay đổi nhanh chóng",
    collocations: [
      "serve as a catalyst for innovation",
      "potent catalyst for social reform",
    ],
    example:
      "The global pandemic served as an unexpected catalyst for the widespread adoption of flexible remote-working arrangements.",
    synonyms: ["impetus", "stimulus", "driving force"],
    status: "learning",
  },

  // Academic Task 1 (Data, Trends, Maps & Processes)
  {
    id: "voc_20",
    word: "witness a pronounced surge",
    phonetic: "/ˈwɪt.nəs ə prəˈnaʊnst sɜːdʒ/",
    partOfSpeech: "verb phrase",
    level: "C1",
    topic: "Academic Task 1",
    meaning: "Chứng kiến một mức tăng vọt rõ rệt (dùng cho biểu đồ Line/Bar/Table)",
    collocations: [
      "witnessed a pronounced surge from 15% to 48%",
      "experienced a pronounced upward trajectory",
    ],
    example:
      "Solar energy generation witnessed a pronounced surge between 2015 and 2025, overtaking coal as the primary power source.",
    synonyms: ["skyrocketed", "experienced a steep escalation"],
    status: "learning",
  },
  {
    id: "voc_21",
    word: "plateau",
    phonetic: "/ˈplæt.əʊ/",
    partOfSpeech: "verb / noun",
    level: "C1",
    topic: "Academic Task 1",
    meaning: "Chững lại và giữ ở mức ổn định sau khi tăng",
    collocations: [
      "plateaued at approximately 60 million",
      "reached a plateau during the final decade",
    ],
    example:
      "Following a decade of steady growth, broadband subscription rates plateaued at roughly 88% in the final three years of the survey.",
    synonyms: ["levelled off", "stabilised"],
    status: "learning",
  },
  {
    id: "voc_22",
    word: "undergo extensive redevelopment",
    phonetic: "/ˌʌn.dəˈɡəʊ ɪkˈsten.sɪv ˌriː.dɪˈvel.əp.mənt/",
    partOfSpeech: "verb phrase",
    level: "C1",
    topic: "Academic Task 1",
    meaning: "Trải qua quá trình quy hoạch / cải tạo quy mô lớn (dùng cho bài Map)",
    collocations: [
      "the harbour area underwent extensive redevelopment",
      "underwent a complete spatial transformation",
    ],
    example:
      "Overall, the coastal town underwent extensive redevelopment over the thirty-year period, transitioning from a fishing port into a commercial resort.",
    synonyms: ["was substantially modernised", "experienced radical transformation"],
    status: "learning",
  },
  {
    id: "voc_23",
    word: "cyclical / linear process",
    phonetic: "/ˈsɪk.lɪ.kəl / ˈlɪn.i.ər ˈprəʊ.ses/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Academic Task 1",
    meaning: "Quy trình tuần hoàn khép kín / Quy trình tuyến tính theo từng bước (bài Process)",
    collocations: [
      "comprises a six-stage linear process",
      "operates as a continuous cyclical process",
    ],
    example:
      "Overall, the production of recycled glass bottles is a seven-stage linear process that begins with waste collection and culminates in retail distribution.",
    synonyms: ["sequential manufacturing procedure", "multi-stage workflow"],
    status: "learning",
  },
  {
    id: "voc_24",
    word: "inversely proportional",
    phonetic: "/ɪnˈvɜːs.li prəˈpɔː.ʃən.əl/",
    partOfSpeech: "adjective phrase",
    level: "C2",
    topic: "Academic Task 1",
    meaning: "Tỷ lệ nghịch (khi nhóm A tăng thì nhóm B giảm tương ứng)",
    collocations: [
      "inversely proportional to household income",
      "exhibited an inversely proportional relationship",
    ],
    example:
      "Across all surveyed age brackets, time spent watching traditional television was inversely proportional to daily usage of streaming platforms.",
    synonyms: ["negatively correlated", "moved in opposite directions"],
    status: "learning",
  },
];

export function loadVocabVault(): VocabItem[] {
  if (typeof window === "undefined") return INITIAL_ACADEMIC_VOCAB;
  try {
    const raw = localStorage.getItem(VOCAB_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(INITIAL_ACADEMIC_VOCAB));
      return INITIAL_ACADEMIC_VOCAB;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_ACADEMIC_VOCAB;
    }
    return parsed;
  } catch {
    return INITIAL_ACADEMIC_VOCAB;
  }
}

export function saveVocabVault(items: VocabItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("vocab-updated"));
  } catch (e) {
    console.error("Failed to save vocabulary vault:", e);
  }
}

export function addWordToVault(partial: {
  word: string;
  meaning?: string;
  example?: string;
  topic?: VocabTopic;
  level?: "C1" | "C2";
  partOfSpeech?: string;
  collocations?: string[];
}): { added: boolean; item: VocabItem } {
  const cleanWord = partial.word.trim();
  const current = loadVocabVault();
  const existing = current.find((v) => v.word.toLowerCase() === cleanWord.toLowerCase());
  if (existing) {
    return { added: false, item: existing };
  }

  const newItem: VocabItem = {
    id: "voc_custom_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
    word: cleanWord,
    phonetic: "/IELTS Academic Term/",
    partOfSpeech: partial.partOfSpeech || "academic phrase",
    level: partial.level || "C1",
    topic: partial.topic || "Saved from Tests",
    meaning:
      partial.meaning?.trim() ||
      "Cụm từ học thuật được lưu trực tiếp từ đề thi IELTS SKIBIDI để ôn tập.",
    collocations:
      partial.collocations && partial.collocations.length > 0
        ? partial.collocations
        : [cleanWord],
    example:
      partial.example?.trim() ||
      `Using "${cleanWord}" accurately in Academic Writing and Speaking helps elevate Lexical Resource to Band 7.5+.`,
    synonyms: [],
    status: "learning",
    isCustom: true,
  };

  const next = [newItem, ...current];
  saveVocabVault(next);
  return { added: true, item: newItem };
}

export function toggleVocabStatus(id: string): VocabItem[] {
  const current = loadVocabVault();
  const next = current.map((item) =>
    item.id === id
      ? { ...item, status: item.status === "mastered" ? ("learning" as const) : ("mastered" as const) }
      : item
  );
  saveVocabVault(next);
  return next;
}

export function removeVocabItem(id: string): VocabItem[] {
  const current = loadVocabVault();
  const next = current.filter((item) => item.id !== id);
  saveVocabVault(next);
  return next;
}
