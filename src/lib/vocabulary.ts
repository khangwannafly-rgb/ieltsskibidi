export type VocabTopic =
  | "Environment"
  | "Technology"
  | "Education"
  | "Urbanisation"
  | "Economy & Society"
  | "Health & Psychology"
  | "Crime & Law"
  | "Media & Culture"
  | "Science & Innovation"
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
  masteryLevel?: 0 | 1 | 2 | 3;
  reviewCount?: number;
  lastReviewedAt?: string;
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

  // Health & Psychology
  {
    id: "voc_25",
    word: "sedentary lifestyle",
    phonetic: "/ˈsed.ən.tər.i ˈlaɪf.staɪl/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Health & Psychology",
    meaning: "Lối sống ít vận động, ngồi nhiều (nguyên nhân gây bệnh mãn tính)",
    collocations: [
      "lead an increasingly sedentary lifestyle",
      "combat the prevalence of a sedentary lifestyle",
      "adverse repercussions of a sedentary lifestyle",
    ],
    example:
      "The shift towards desk-bound occupations has led millions of urban residents to adopt an increasingly sedentary lifestyle.",
    synonyms: ["physical inactivity", "desk-bound routine"],
    status: "learning",
  },
  {
    id: "voc_26",
    word: "cognitive resilience",
    phonetic: "/ˈkɒɡ.nə.tɪv rɪˈzɪl.jəns/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Health & Psychology",
    meaning: "Khả năng phục hồi nhận thức và tâm lý trước áp lực hoặc lão hóa",
    collocations: [
      "bolster cognitive resilience",
      "foster psychological and cognitive resilience",
      "preserve cognitive resilience in later life",
    ],
    example:
      "Lifelong bilingualism has been clinically shown to bolster cognitive resilience against age-related neurological decline.",
    synonyms: ["mental fortitude", "neuroplastic adaptability"],
    status: "learning",
  },
  {
    id: "voc_27",
    word: "preventative healthcare",
    phonetic: "/prɪˈven.tə.tɪv ˈhelθ.keər/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Health & Psychology",
    meaning: "Y tế dự phòng (phòng bệnh trước khi phát sinh thay vì chỉ điều trị)",
    collocations: [
      "allocate funding to preventative healthcare",
      "prioritise preventative healthcare over curative medicine",
      "nationwide preventative healthcare campaigns",
    ],
    example:
      "Allocating state budgets to preventative healthcare is far more cost-effective than subsidising late-stage clinical interventions.",
    synonyms: ["prophylactic medicine", "early-stage health intervention"],
    status: "learning",
  },
  {
    id: "voc_28",
    word: "chronic sleep deprivation",
    phonetic: "/ˈkrɒn.ɪk sliːp ˌdep.rɪˈveɪ.ʃən/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Health & Psychology",
    meaning: "Tình trạng thiếu ngủ mãn tính kéo dài",
    collocations: [
      "suffer from chronic sleep deprivation",
      "exacerbate chronic sleep deprivation among adolescents",
    ],
    example:
      "Excessive late-night screen exposure has triggered an epidemic of chronic sleep deprivation among secondary school students.",
    synonyms: ["persistent insomnia", "prolonged sleep deficit"],
    status: "learning",
  },

  // Crime & Law
  {
    id: "voc_29",
    word: "recidivism",
    phonetic: "/rɪˈsɪd.ɪ.vɪ.zəm/",
    partOfSpeech: "noun",
    level: "C2",
    topic: "Crime & Law",
    meaning: "Tình trạng tái phạm tội sau khi đã chấp hành án",
    collocations: [
      "curb recidivism rates",
      "high rate of juvenile recidivism",
      "vocational rehabilitation to reduce recidivism",
    ],
    example:
      "Correctional systems that focus on vocational rehabilitation rather thanpurely punitive measures consistently achieve lower recidivism rates.",
    synonyms: ["reoffending", "relapse into crime"],
    status: "learning",
  },
  {
    id: "voc_30",
    word: "deterrent",
    phonetic: "/dɪˈter.ənt/",
    partOfSpeech: "noun",
    level: "C1",
    topic: "Crime & Law",
    meaning: "Biện pháp răn đe, ngăn chặn hành vi phạm pháp",
    collocations: [
      "act as a potent deterrent against",
      "serve as aeffective legal deterrent",
      "question the efficacy of capital punishment as a deterrent",
    ],
    example:
      "Strict financial penalties can act as a potent deterrent against corporate environmental negligence.",
    synonyms: ["disincentive", "preventative measure"],
    status: "learning",
  },
  {
    id: "voc_31",
    word: "social reintegration",
    phonetic: "/ˈsəʊ.ʃəl ˌriː.ɪn.tɪˈɡreɪ.ʃən/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Crime & Law",
    meaning: "Sự tái hòa nhập cộng đồng cho người từng lầm lỡ",
    collocations: [
      "facilitate the smooth social reintegration of ex-offenders",
      "barriers to social reintegration",
    ],
    example:
      "Providing stable employment opportunities is paramount to facilitating the social reintegration of former offenders.",
    synonyms: ["rehabilitation into society", "community assimilation"],
    status: "learning",
  },
  {
    id: "voc_32",
    word: "regulatory oversight",
    phonetic: "/ˈreɡ.jə.lə.tər.i ˈəʊ.və.saɪt/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Crime & Law",
    meaning: "Sự giám sát và quản lý theo quy định pháp luật",
    collocations: [
      "stringent regulatory oversight",
      "evade regulatory oversight",
      "subject AI deployment to rigorous regulatory oversight",
    ],
    example:
      "Without stringent regulatory oversight, commercial data brokers may exploit consumer privacy with impunity.",
    synonyms: ["statutory supervision", "institutional monitoring"],
    status: "learning",
  },

  // Media & Culture
  {
    id: "voc_33",
    word: "cultural homogenisation",
    phonetic: "/ˈkʌl.tʃər.əl həˌmɒdʒ.ə.naɪˈzeɪ.ʃən/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Media & Culture",
    meaning: "Sự đồng nhất hóa văn hóa (làm phai nhạt bản sắc riêng của từng địa phương)",
    collocations: [
      "accelerate global cultural homogenisation",
      "threaten indigenous traditions through cultural homogenisation",
    ],
    example:
      "Critics contend that the global dominance of Western entertainment conglomerates accelerates cultural homogenisation.",
    synonyms: ["cultural standardisation", "erosion of cultural diversity"],
    status: "learning",
  },
  {
    id: "voc_34",
    word: "echo chamber",
    phonetic: "/ˈek.əʊ ˌtʃeɪm.bər/",
    partOfSpeech: "noun phrase",
    level: "C1",
    topic: "Media & Culture",
    meaning: "Buồng vang thông tin (môi trường mạng chỉ lặp lại các quan điểm giống nhau)",
    collocations: [
      "ideological echo chambers on social media",
      "entrench polarisation within digital echo chambers",
    ],
    example:
      "Personalised news feeds inadvertently trap users inside ideological echo chambers, stifling constructive public discourse.",
    synonyms: ["information bubble", "filter bubble"],
    status: "learning",
  },
  {
    id: "voc_35",
    word: "intangible cultural heritage",
    phonetic: "/ɪnˈtæn.dʒə.bəl ˈkʌl.tʃər.əl ˈher.ɪ.tɪdʒ/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Media & Culture",
    meaning: "Di sản văn hóa phi vật thể (phong tục, nghệ thuật truyền thống, ngôn ngữ)",
    collocations: [
      "safeguard intangible cultural heritage",
      "revitalise endangered intangible cultural heritage",
    ],
    example:
      "Digital archiving offers a viable avenue to safeguard intangible cultural heritage for future generations.",
    synonyms: ["ancestral traditions", "non-material heritage"],
    status: "learning",
  },
  {
    id: "voc_36",
    word: "sensationalism",
    phonetic: "/senˈseɪ.ʃən.əl.ɪ.zəm/",
    partOfSpeech: "noun",
    level: "C1",
    topic: "Media & Culture",
    meaning: "Xu hướng giật gân câu khách trên truyền thông báo chí",
    collocations: [
      "resort to media sensationalism",
      "prioritise sensationalism over journalistic integrity",
    ],
    example:
      "Driven by advertising revenue, many online outlets prioritise sensationalism over objective investigative reporting.",
    synonyms: ["yellow journalism", "fear-mongering"],
    status: "learning",
  },

  // Science & Innovation
  {
    id: "voc_37",
    word: "paradigm shift",
    phonetic: "/ˈpær.ə.daɪm ʃɪft/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Science & Innovation",
    meaning: "Sự thay đổi mang tính bước ngoặt trong tư duy hoặc phương thức hoạt động",
    collocations: [
      "catalyse a fundamental paradigm shift",
      "usher in a paradigm shift in medical diagnostics",
    ],
    example:
      "Generative artificial intelligence has catalysed a fundamental paradigm shift in how scientific research is synthesised.",
    synonyms: ["revolutionary transformation", "sea change"],
    status: "learning",
  },
  {
    id: "voc_38",
    word: "empirical scrutiny",
    phonetic: "/ɪmˈpɪr.ɪ.kəl ˈskruː.tɪ.ni/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Science & Innovation",
    meaning: "Sự kiểm chứng, thẩm định khắt khe dựa trên bằng chứng thực nghiệm",
    collocations: [
      "withstand rigorous empirical scrutiny",
      "subject a hypothesis to empirical scrutiny",
    ],
    example:
      "Any newly proposed pharmaceutical treatment must withstand rigorous empirical scrutiny before receiving clinical approval.",
    synonyms: ["experimental verification", "scientific validation"],
    status: "learning",
  },
  {
    id: "voc_39",
    word: "ethical quandary",
    phonetic: "/ˈeθ.ɪ.kəl ˈkwɒn.drɪ/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Science & Innovation",
    meaning: "Tình thế tiến thoái lưỡng nan về mặt đạo đức (trong khoa học, y sinh)",
    collocations: [
      "pose a profound ethical quandary",
      "navigate complex ethical quandaries in gene editing",
    ],
    example:
      "Advances in human embryonic gene editing pose a profound ethical quandary for international bioethicists.",
    synonyms: ["moral dilemma", "bioethical predicament"],
    status: "learning",
  },
  {
    id: "voc_40",
    word: "planned obsolescence",
    phonetic: "/plænd ˌɒb.səlˈes.əns/",
    partOfSpeech: "noun phrase",
    level: "C2",
    topic: "Science & Innovation",
    meaning: "Chiến lược lỗi thời có tính toán (sản xuất đồ nhanh hỏng để kích cầu mua mới)",
    collocations: [
      "curb corporate planned obsolescence",
      "electronic waste driven by planned obsolescence",
    ],
    example:
      "Right-to-repair legislation aims to curb corporate planned obsolescence and extend the lifespan of consumer electronics.",
    synonyms: ["built-in obsolescence", "premature product replacement"],
    status: "learning",
  },
  {
    id: "voc_41",
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
    status: "learning",
  },
  {
    id: "voc_42",
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
    status: "learning",
  },
  {
    id: "voc_43",
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
    status: "learning",
  },
  {
    id: "voc_44",
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
    status: "learning",
  },
  {
    id: "voc_45",
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
    status: "learning",
  },
  {
    id: "voc_46",
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
    status: "learning",
  },
  {
    id: "voc_47",
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
    status: "learning",
  },
  {
    id: "voc_48",
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
    status: "learning",
  },
];

export function shuffleArray<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function loadVocabVault(): VocabItem[] {
  if (typeof window === "undefined") return INITIAL_ACADEMIC_VOCAB;
  try {
    const raw = localStorage.getItem(VOCAB_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(INITIAL_ACADEMIC_VOCAB));
      return INITIAL_ACADEMIC_VOCAB;
    }
    const parsed = JSON.parse(raw) as VocabItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_ACADEMIC_VOCAB;
    }

    // Tự động hợp nhất các từ học thuật C1-C2 mới bổ sung vào kho lưu trữ hiện có
    const existingWords = new Set(parsed.map((item) => item.word.toLowerCase()));
    const missingBuiltins = INITIAL_ACADEMIC_VOCAB.filter(
      (builtin) => !existingWords.has(builtin.word.toLowerCase())
    );
    if (missingBuiltins.length > 0) {
      const merged = [...parsed, ...missingBuiltins];
      localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(merged));
      return merged;
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
  phonetic?: string;
  meaning?: string;
  example?: string;
  topic?: VocabTopic;
  level?: "C1" | "C2";
  partOfSpeech?: string;
  collocations?: string[];
  synonyms?: string[];
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
    phonetic: partial.phonetic || "/IELTS Academic Term/",
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
    synonyms: partial.synonyms || [],
    status: "learning",
    isCustom: true,
  };

  const next = [newItem, ...current];
  saveVocabVault(next);
  return { added: true, item: newItem };
}

export function addBatchToVault(batch: Partial<VocabItem>[]): {
  addedItems: VocabItem[];
  allItems: VocabItem[];
} {
  const current = loadVocabVault();
  const existingWords = new Set(current.map((v) => v.word.toLowerCase()));
  const addedItems: VocabItem[] = [];

  for (const item of batch) {
    const cleanWord = item.word?.trim();
    if (!cleanWord || existingWords.has(cleanWord.toLowerCase())) continue;
    existingWords.add(cleanWord.toLowerCase());
    addedItems.push({
      id: "voc_rnd_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      word: cleanWord,
      phonetic: item.phonetic || "/Academic IPA/",
      partOfSpeech: item.partOfSpeech || "noun phrase",
      level: item.level === "C2" ? "C2" : "C1",
      topic: (item.topic as VocabTopic) || "Economy & Society",
      meaning: item.meaning || "Thuật ngữ học thuật nâng cao chuẩn IELTS Band 8.0+",
      collocations:
        Array.isArray(item.collocations) && item.collocations.length > 0
          ? item.collocations
          : [cleanWord],
      example:
        item.example ||
        `Incorporating "${cleanWord}" strengthens lexical precision in academic discourse.`,
      synonyms: Array.isArray(item.synonyms) ? item.synonyms : [],
      status: "learning",
      isCustom: true,
    });
  }

  const next = [...addedItems, ...current];
  saveVocabVault(next);
  return { addedItems, allItems: next };
}

export function toggleVocabStatus(id: string): VocabItem[] {
  const current = loadVocabVault();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    const isNowMastered = item.status !== "mastered";
    return {
      ...item,
      status: isNowMastered ? ("mastered" as const) : ("learning" as const),
      masteryLevel: isNowMastered ? (3 as const) : (1 as const),
      reviewCount: (item.reviewCount || 0) + 1,
      lastReviewedAt: new Date().toISOString(),
    };
  });
  saveVocabVault(next);
  return next;
}

export function gradeVocabReview(
  id: string,
  rating: "hard" | "good" | "easy"
): VocabItem[] {
  const current = loadVocabVault();
  const next = current.map((item) => {
    if (item.id !== id) return item;
    const prevLevel = item.masteryLevel ?? (item.status === "mastered" ? 3 : 0);
    let nextLevel: 0 | 1 | 2 | 3 = 1;
    if (rating === "hard") {
      nextLevel = 1;
    } else if (rating === "good") {
      nextLevel = Math.min(3, Math.max(2, prevLevel + 1)) as 0 | 1 | 2 | 3;
    } else {
      nextLevel = 3;
    }
    return {
      ...item,
      masteryLevel: nextLevel,
      status: nextLevel >= 3 ? ("mastered" as const) : ("learning" as const),
      reviewCount: (item.reviewCount || 0) + 1,
      lastReviewedAt: new Date().toISOString(),
    };
  });
  saveVocabVault(next);
  return next;
}

export function removeVocabItem(id: string): VocabItem[] {
  const current = loadVocabVault();
  const next = current.filter((item) => item.id !== id);
  saveVocabVault(next);
  return next;
}
