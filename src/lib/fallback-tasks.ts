import { roundBand } from "./ai-response";

// ============================================================================
// 1. READING PASSAGES (Chuẩn Cambridge IELTS Academic - 3 Passages)
// ============================================================================

const READING_PASSAGES = [
  {
    id: "reading-1",
    section: "Reading Passage 1",
    title: "The Rise of Vertical Farming in Urban Centres",
    subtitle: "Can multi-storey indoor agriculture feed the megacities of the 21st century?",
    difficulty_estimate_band: 6.5,
    passage: `## Paragraph A
By the year 2050, nearly 80% of the Earth's population will reside in urban centres. Applying the most conservative estimates to current demographic trends, the human population will increase by about three billion people during the interim. An estimated one billion hectares of new land — roughly 20% more land than is represented by the country of Brazil — will be needed to grow enough food to feed them, if traditional farming practices continue as they are practised today.

## Paragraph B
At present, throughout the world, over 80% of the land that is suitable for raising crops is in use. Historically, some 15% of that has been laid waste by poor management practices. What can be done to ensure enough food for the world's population to live on? The concept of indoor farming is not new, since hothouse production of tomatoes and other produce has been in vogue for some time. What is new is the urgent need to scale up this technology to accommodate another three billion people. Many believe an entirely new approach to indoor farming is required, employing cutting-edge technologies. One such proposal is for the "Vertical Farm".

## Paragraph C
The concept is of multi-storey buildings in which food crops are grown in environmentally controlled conditions. Situated in the heart of urban centres, they would drastically reduce the amount of transportation required to bring food to consumers. Vertical farms would need to be efficient, cheap to construct and safe to operate. If successfully implemented, proponents claim, vertical farms offer the promise of urban renewal, sustainable production of a safe and varied food supply (through year-round production of all crops), and the eventual repair of ecosystems that have been sacrificed for horizontal farming.

## Paragraph D
It took humans 10,000 years to learn how to grow most of the crops we now take for granted. Along the way, we despoiled most of the land we worked, often turning verdant, natural ecozones into semi-arid deserts. Within that same time frame, we evolved into an urban species, in which 60% of the human population now lives vertically in cities. This means that, for the majority, we humans have shelter from the elements, yet we subject our food-bearing plants to the rigours of the great outdoors and can do no more than hope for a good weather year. However, more often than not now, due to a rapidly changing climate, that is not what happens. Massive floods, long droughts, hurricanes and severe monsoons take their toll each year, destroying millions of tons of valuable crops.

## Paragraph E
The supporters of vertical farming claim many potential advantages for the system. For instance, crops would be produced all year round, as they would be kept in artificially controlled, optimum growing conditions. There would be no weather-related crop failures due to droughts, floods or pests. All the food could be grown organically, eliminating the need for herbicides, pesticides and fertilisers. The system would greatly reduce the incidence of many infectious diseases that are acquired at the agricultural interface. Although the system would consume energy, it would return energy to the grid via methane generation from composting non-edible parts of plants. It would also dramatically reduce fossil fuel use, by cutting out the need for tractors, ploughs and shipping.

## Paragraph F
A major drawback of vertical farming, however, is that the plants would require artificial light. Without it, those plants nearest the windows would be exposed to more sunlight and grow more quickly, reducing the efficiency of the system. Single-storey greenhouses have the benefit of natural overhead light; even so, many still need artificial lighting. A multi-storey facility with no natural overhead light would require far more. Generating enough light could be prohibitively expensive, unless cheap, renewable energy is available, and this appears to be rather a future aspiration than a likelihood for the near future.

## Paragraph G
One variation on vertical farming that has been developed is to grow plants in stacked trays that move on rails. Moving the trays allows the plants to get enough sunlight. This system is already in operation, and works well within a single-storey greenhouse with light reaching it from above: it is not certain, however, that it can be made to work without that overhead natural light. Ultimately, while vertical farming may not wholly replace traditional agriculture, it is widely regarded as a vital component of future urban food security.`,
    questions: [
      { id: 1, type: "FILL", group: "Questions 1–5: Sentence Completion", instruction: "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer.", word_limit: "NO MORE THAN TWO WORDS", question: "Some food plants, including ______, are already grown indoors." },
      { id: 2, type: "FILL", group: "Questions 1–5: Sentence Completion", word_limit: "NO MORE THAN TWO WORDS", question: "Vertical farms would be located in ______, meaning that there would be less need to take them long distances to customers." },
      { id: 3, type: "FILL", group: "Questions 1–5: Sentence Completion", word_limit: "NO MORE THAN TWO WORDS", question: "Vertical farms could use methane from plants and animals to produce ______." },
      { id: 4, type: "FILL", group: "Questions 1–5: Sentence Completion", word_limit: "NO MORE THAN TWO WORDS", question: "The consumption of ______ would be cut because agricultural vehicles would be unnecessary." },
      { id: 5, type: "FILL", group: "Questions 1–5: Sentence Completion", word_limit: "NO MORE THAN TWO WORDS", question: "The fact that vertical farms would need ______ light is a disadvantage." },
      { id: 6, type: "TFN", group: "Questions 6–10: True / False / Not Given", instruction: "Do the following statements agree with the information given in Reading Passage 1?\nTRUE — if the statement agrees with the information\nFALSE — if the statement contradicts the information\nNOT GIVEN — if there is no information on this", question: "Methods for predicting the Earth's population have recently changed." },
      { id: 7, type: "TFN", group: "Questions 6–10: True / False / Not Given", question: "Human beings are responsible for some of the destruction to food-producing land." },
      { id: 8, type: "TFN", group: "Questions 6–10: True / False / Not Given", question: "The crops produced in vertical farms will depend on the season." },
      { id: 9, type: "TFN", group: "Questions 6–10: True / False / Not Given", question: "Some damage to food crops is caused by climate change." },
      { id: 10, type: "TFN", group: "Questions 6–10: True / False / Not Given", question: "Fertilisers will be needed for certain crops in vertical farms." },
      {
        id: 11,
        type: "HEAD",
        group: "Questions 11–13: Matching Information & Multiple Choice",
        instruction: "Choose the correct paragraph or letter for questions 11–13.",
        question: "Which paragraph mentions a system of movable trays already used in single-storey greenhouses?",
        options: ["Paragraph C", "Paragraph E", "Paragraph F", "Paragraph G"],
      },
      {
        id: 12,
        type: "HEAD",
        group: "Questions 11–13: Matching Information & Multiple Choice",
        question: "Which paragraph explains why multi-storey buildings cannot rely on window light alone?",
        options: ["Paragraph B", "Paragraph D", "Paragraph E", "Paragraph F"],
      },
      {
        id: 13,
        type: "MCQ",
        group: "Questions 11–13: Matching Information & Multiple Choice",
        question: "What is the writer's main conclusion about vertical farming?",
        options: [
          "A. It will completely replace horizontal farming by 2050",
          "B. It is too dangerous to construct in densely populated cities",
          "C. It will likely complement traditional agriculture as part of urban food security",
          "D. It can only succeed in countries with tropical climates",
        ],
      },
    ],
    answers: [
      { id: 1, correct_answer: "tomatoes", explanation: "Paragraph B: 'hothouse production of tomatoes and other produce has been in vogue for some time.'" },
      { id: 2, correct_answer: "urban centres", explanation: "Paragraph C: 'Situated in the heart of urban centres, they would drastically reduce the amount of transportation required...'" },
      { id: 3, correct_answer: "energy", explanation: "Paragraph E: 'it would return energy to the grid via methane generation from composting non-edible parts of plants.'" },
      { id: 4, correct_answer: "fossil fuel / fossil fuels", explanation: "Paragraph E: 'It would also dramatically reduce fossil fuel use, by cutting out the need for tractors, ploughs and shipping.'" },
      { id: 5, correct_answer: "artificial", explanation: "Paragraph F: 'A major drawback of vertical farming, however, is that the plants would require artificial light.'" },
      { id: 6, correct_answer: "Not Given", explanation: "Paragraph A chỉ nêu ước tính dân số vào năm 2050, không đề cập việc phương pháp dự đoán gần đây có thay đổi hay không." },
      { id: 7, correct_answer: "True", explanation: "Paragraph B & D: 'some 15% of that has been laid waste by poor management practices' và 'Along the way, we despoiled most of the land we worked'." },
      { id: 8, correct_answer: "False", explanation: "Paragraph C & E nêu rõ cây trồng được sản xuất quanh năm ('year-round production of all crops')." },
      { id: 9, correct_answer: "True", explanation: "Paragraph D: 'due to a rapidly changing climate... Massive floods, long droughts... destroying millions of tons of valuable crops.'" },
      { id: 10, correct_answer: "False", explanation: "Paragraph E: 'All the food could be grown organically, eliminating the need for herbicides, pesticides and fertilisers.'" },
      { id: 11, correct_answer: "Paragraph G", explanation: "Paragraph G: 'One variation on vertical farming that has been developed is to grow plants in stacked trays that move on rails.'" },
      { id: 12, correct_answer: "Paragraph F", explanation: "Paragraph F: 'Without it, those plants nearest the windows would be exposed to more sunlight and grow more quickly, reducing the efficiency of the system.'" },
      { id: 13, correct_answer: "C. It will likely complement traditional agriculture as part of urban food security", explanation: "Paragraph G: 'while vertical farming may not wholly replace traditional agriculture, it is widely regarded as a vital component of future urban food security.'" },
    ],
  },
  {
    id: "reading-2",
    section: "Reading Passage 2",
    title: "The Cognitive Architecture of Decision Fatigue",
    subtitle: "Why making too many choices depletes executive function and alters human judgement",
    difficulty_estimate_band: 7.0,
    passage: `## Paragraph A
Every day, the average adult in an industrialised society makes ribuan of discrete choices — from trivial selections about wardrobe and breakfast to high-stakes judgements concerning financial investments or medical treatment. For decades, classical economists assumed that expanding the number of options available to consumers was inherently beneficial. Yet contemporary research in behavioural psychology and cognitive neuroscience suggests that the human capacity for rational deliberation is a finite resource. When subjected to a prolonged stream of choices, individuals experience a measurable deterioration in self-control and analytical reasoning known as "decision fatigue".

## Paragraph B
The term was popularised by social psychologist Roy Baumeister, whose laboratory experiments demonstrated that acts of volition draw upon a shared pool of mental energy. In one landmark study, participants who were asked to make a series of consumer choices among dozens of household items subsequently persisted for significantly less time on an unsolvable geometric puzzle than a control group who had merely contemplated the same items without choosing. Baumeister termed this state "ego depletion", proposing that executive function operates much like a muscle that becomes exhausted through repeated exertion.

## Paragraph C
Perhaps the most striking real-world evidence of decision fatigue emerged from an analysis of over 1,100 judicial parole hearings conducted by Danziger, Levav and Avnaim-Pesso. The researchers tracked rulings made by experienced judges throughout the working day, which was divided into three sessions separated by a morning snack break and a lunch break. At the beginning of each session, the probability of a favourable parole ruling stood at approximately 65%. As each session wore on, however, the rate of favourable decisions declined steadily towards zero, only to rebound sharply to 65% immediately following a meal and rest break.

## Paragraph D
When mentally depleted, the brain adopts two distinct energy-saving shortcuts. The first is impulsive reckless behaviour: acting without weighing long-term consequences, which explains why supermarkets place confectionery at checkout counters where shoppers' willpower is at its lowest ebb. The second, and far more pervasive, shortcut is decision avoidance — defaulting to the status quo because rejecting change carries a lower immediate cognitive risk than approving a novel course of action. In the judicial study, denying parole preserved the existing state of affairs and required less mental effort than evaluating the risks of release.

## Paragraph E
Neuroimaging studies have linked these behavioural shifts to altered activity within the prefrontal cortex (PFC), the brain region responsible for executive control, and the amygdala, which processes emotional salience. Under conditions of cognitive overload, functional connectivity between the ventromedial prefrontal cortex and the amygdala weakens. As a result, top-down regulatory control diminishes while reward-seeking and risk-averse impulses become amplified.

## Paragraph F
Critics of the ego-depletion model, notably psychologist Carol Dweck and her colleagues, have argued that mental fatigue is moderated by an individual's beliefs about willpower. In cross-cultural experiments, subjects who viewed mental stamina as an abundant, self-renewing resource showed far less performance decline after demanding tasks than those who believed willpower is strictly limited. Nevertheless, even Dweck's findings acknowledge that after prolonged multi-hour cognitive strain, physiological factors such as blood glucose fluctuations and neural adenosine accumulation eventually constrain performance across all groups.`,
    questions: [
      {
        id: 1,
        type: "HEAD",
        group: "Questions 1–4: Matching Researchers",
        instruction: "Look at the following statements (Questions 1–4) and the list of researchers below. Match each statement with the correct researcher, A, B, C, or D.",
        box_title: "List of Researchers",
        box_items: [
          "A. Classical Economists",
          "B. Roy Baumeister",
          "C. Danziger, Levav and Avnaim-Pesso",
          "D. Carol Dweck",
        ],
        question: "Mental stamina is influenced by whether a person believes willpower is limited or abundant.",
        options: ["A. Classical Economists", "B. Roy Baumeister", "C. Danziger, Levav and Avnaim-Pesso", "D. Carol Dweck"],
      },
      {
        id: 2,
        type: "HEAD",
        group: "Questions 1–4: Matching Researchers",
        question: "Having a wider range of choices is always advantageous for decision-makers.",
        options: ["A. Classical Economists", "B. Roy Baumeister", "C. Danziger, Levav and Avnaim-Pesso", "D. Carol Dweck"],
      },
      {
        id: 3,
        type: "HEAD",
        group: "Questions 1–4: Matching Researchers",
        question: "Self-control functions like a physical muscle that becomes tired after repeated use.",
        options: ["A. Classical Economists", "B. Roy Baumeister", "C. Danziger, Levav and Avnaim-Pesso", "D. Carol Dweck"],
      },
      {
        id: 4,
        type: "HEAD",
        group: "Questions 1–4: Matching Researchers",
        question: "Courtroom rulings become progressively less favourable as a working session continues without a break.",
        options: ["A. Classical Economists", "B. Roy Baumeister", "C. Danziger, Levav and Avnaim-Pesso", "D. Carol Dweck"],
      },
      {
        id: 5,
        type: "YNN",
        group: "Questions 5–9: Yes / No / Not Given",
        instruction: "Do the following statements agree with the claims of the writer in Reading Passage 2?\nYES — if the statement agrees with the claims of the writer\nNO — if the statement contradicts the claims of the writer\nNOT GIVEN — if it is impossible to say what the writer thinks about this",
        question: "In Baumeister's experiment, both groups of participants spent the same amount of time attempting the geometric puzzle.",
      },
      { id: 6, type: "YNN", group: "Questions 5–9: Yes / No / Not Given", question: "Judges were significantly more likely to grant parole immediately after returning from a meal break." },
      { id: 7, type: "YNN", group: "Questions 5–9: Yes / No / Not Given", question: "Experienced judges are completely aware of how hunger affects their legal objectivity." },
      { id: 8, type: "YNN", group: "Questions 5–9: Yes / No / Not Given", question: "Decision avoidance is more widespread than impulsive behaviour when people are mentally exhausted." },
      { id: 9, type: "YNN", group: "Questions 5–9: Yes / No / Not Given", question: "Carol Dweck proved that physiological tiredness never affects people who believe willpower is unlimited." },
      { id: 10, type: "FILL", group: "Questions 10–13: Summary Completion", instruction: "Complete the summary below. Choose NO MORE THAN TWO WORDS from the passage for each answer.", word_limit: "NO MORE THAN TWO WORDS", question: "Supermarkets place sweet products near ______ where customers' self-control is weakest." },
      { id: 11, type: "FILL", group: "Questions 10–13: Summary Completion", word_limit: "NO MORE THAN TWO WORDS", question: "When tired, people often prefer the ______ rather than taking the risk of making a change." },
      { id: 12, type: "FILL", group: "Questions 10–13: Summary Completion", word_limit: "NO MORE THAN TWO WORDS", question: "Brain scans show reduced connectivity between the prefrontal cortex and the ______ during cognitive overload." },
      { id: 13, type: "FILL", group: "Questions 10–13: Summary Completion", word_limit: "NO MORE THAN TWO WORDS", question: "Over long periods of strain, physical changes such as shifts in ______ and adenosine levels limit performance." },
    ],
    answers: [
      { id: 1, correct_answer: "D. Carol Dweck", explanation: "Paragraph F: 'Carol Dweck and her colleagues, have argued that mental fatigue is moderated by an individual's beliefs about willpower.'" },
      { id: 2, correct_answer: "A. Classical Economists", explanation: "Paragraph A: 'classical economists assumed that expanding the number of options available to consumers was inherently beneficial.'" },
      { id: 3, correct_answer: "B. Roy Baumeister", explanation: "Paragraph B: 'Baumeister termed this state ego depletion, proposing that executive function operates much like a muscle...'" },
      { id: 4, correct_answer: "C. Danziger, Levav and Avnaim-Pesso", explanation: "Paragraph C: nghiên cứu của Danziger, Levav và Avnaim-Pesso trên hơn 1.100 phiên xét xử ân xá." },
      { id: 5, correct_answer: "No", explanation: "Paragraph B: nhóm phải đưa ra lựa chọn bỏ cuộc sớm hơn đáng kể ('persisted for significantly less time') so với nhóm đối chứng." },
      { id: 6, correct_answer: "Yes", explanation: "Paragraph C: tỷ lệ phán quyết thuận lợi bật tăng trở lại mức 65% ngay sau giờ nghỉ ăn trưa." },
      { id: 7, correct_answer: "Not Given", explanation: "Bài đọc chỉ thống kê số liệu phán quyết của thẩm phán, không đề cập việc họ có tự nhận thức được sự thiên lệch đó hay không." },
      { id: 8, correct_answer: "Yes", explanation: "Paragraph D: 'The second, and far more pervasive, shortcut is decision avoidance'." },
      { id: 9, correct_answer: "No", explanation: "Paragraph F: ngay cả nghiên cứu của Dweck cũng thừa nhận sau nhiều giờ căng thẳng, các yếu tố sinh lý vẫn giới hạn hiệu suất của mọi nhóm." },
      { id: 10, correct_answer: "checkout counters", explanation: "Paragraph D: 'supermarkets place confectionery at checkout counters where shoppers' willpower is at its lowest ebb.'" },
      { id: 11, correct_answer: "status quo", explanation: "Paragraph D: 'defaulting to the status quo because rejecting change carries a lower immediate cognitive risk'." },
      { id: 12, correct_answer: "amygdala", explanation: "Paragraph E: 'functional connectivity between the ventromedial prefrontal cortex and the amygdala weakens.'" },
      { id: 13, correct_answer: "blood glucose", explanation: "Paragraph F: 'physiological factors such as blood glucose fluctuations and neural adenosine accumulation'." },
    ],
  },
  {
    id: "reading-3",
    section: "Reading Passage 3",
    title: "Deciphering the Indus Valley Script: Between Symbol and Language",
    subtitle: "Why one of antiquity's most widespread writing systems continues to defy cryptographers and linguists",
    difficulty_estimate_band: 7.5,
    passage: `## Paragraph A
Across the alluvial plains of the Indus River and its tributaries, the Harappan civilisation flourished between 2600 and 1900 BCE, encompassing an area larger than ancient Egypt and Mesopotamia combined. Archaeological excavations at urban centres such as Mohenjo-daro, Harappa, and Dholavira have yielded over four thousand inscribed artefacts — predominantly steatite stamp seals, copper tablets, and pottery shards. Despite a century of intensive scholarship since Sir John Marshall first announced the discovery of the civilisation in 1924, the script carved onto these objects remains undeciphered.

## Paragraph B
Several formidable obstacles explain why the Indus script has resisted every attempt at translation. Foremost among them is the complete absence of a bilingual inscription. Whereas Jean-François Champollion unlocked Egyptian hieroglyphs using the Rosetta Stone — which preserved the same decree in Greek and Egyptian — and Henry Rawlinson deciphered cuneiform via the trilingual Behistun Inscription, no comparable artefact linking Harappan signs to a known ancient language such as Akkadian or Old Persian has ever been unearthed.

## Paragraph C
Compounding this difficulty is the extreme brevity of the surviving inscriptions. The average Indus text contains barely five signs, and the longest known inscription — found on a copper plate — comprises just thirty-four symbols. Because the texts are so short, epigraphers lack the extended grammatical contexts needed to identify verb conjugations, pronouns, or syntactic clauses. Most scholars agree that the small square seals were used in trade and administration, pressed into wet clay to secure bundles of merchandise exported as far as the Persian Gulf.

## Paragraph D
In 2004, historian Steve Farmer, computationalba linguist Richard Sproat, and Indologist Michael Witzel published a provocative thesis arguing that the Indus signs do not encode spoken language at all. Pointing to the lack of long narrative texts on monuments or walls, they compared the symbols to medieval European heraldic crests, highway traffic signs, or Near Eastern deity emblems. According to their non-linguistic model, the seals merely combined clan badges, religious totems, and commodities in a loose symbolic repertoire.

## Paragraph E
However, a team of computer scientists led by Rajesh Rao and Nisha Yadav countered this claim by applying Markov chain analysis and conditional entropy — mathematical tools from information theory — to the sequence of signs. Their statistical study revealed that Indus inscriptions exhibit rigid positional rules: certain symbols consistently appear at the beginning of a line, while others cluster at the end, mirroring the syntactic constraints of natural human languages such as Sumerian, Old Tamil, and Sanskrit, and differing sharply from random or purely decorative iconographies.

## Paragraph F
Among linguists who accept that the script represents a spoken tongue, fierce debate persists regarding which language family it belongs to. Epigrapher Iravatham Mahadevan and Indologist Asko Parpola have long championed a Dravidian hypothesis, noting that pockets of Brahui — a Dravidian language — still survive near the Indus basin and that recurring fish-shaped signs may function as homophones for stars and deities in proto-Dravidian. Conversely, other researchers have proposed affinities with early Indo-Aryan or an extinct linguistic isolate that left no modern descendants.`,
    questions: [
      {
        id: 1,
        type: "HEAD",
        group: "Questions 1–6: Matching Headings",
        instruction: "Reading Passage 3 has six paragraphs, A–F. Choose the correct heading for each paragraph from the list of headings below.",
        box_title: "List of Headings",
        box_items: [
          "i. Mathematical evidence of linguistic structure in sign sequences",
          "ii. The geographic scale of the civilisation and discovery of its artefacts",
          "iii. Competing theories on the ancestral language family behind the script",
          "iv. How extreme shortness of texts limits grammatical analysis",
          "v. A controversial claim that the symbols are non-linguistic emblems",
          "vi. Why the lack of a multi-language artefact blocks translation",
          "vii. How climate change caused the collapse of Harappan trade",
        ],
        question: "Paragraph A",
        options: ["i", "ii", "iii", "iv", "v", "vi", "vii"],
      },
      { id: 2, type: "HEAD", group: "Questions 1–6: Matching Headings", question: "Paragraph B", options: ["i", "ii", "iii", "iv", "v", "vi", "vii"] },
      { id: 3, type: "HEAD", group: "Questions 1–6: Matching Headings", question: "Paragraph C", options: ["i", "ii", "iii", "iv", "v", "vi", "vii"] },
      { id: 4, type: "HEAD", group: "Questions 1–6: Matching Headings", question: "Paragraph D", options: ["i", "ii", "iii", "iv", "v", "vi", "vii"] },
      { id: 5, type: "HEAD", group: "Questions 1–6: Matching Headings", question: "Paragraph E", options: ["i", "ii", "iii", "iv", "v", "vi", "vii"] },
      { id: 6, type: "HEAD", group: "Questions 1–6: Matching Headings", question: "Paragraph F", options: ["i", "ii", "iii", "iv", "v", "vi", "vii"] },
      {
        id: 7,
        type: "HEAD",
        group: "Questions 7–10: Summary Completion (Word Bank)",
        instruction: "Complete the summary using the list of words, A–F, below.",
        box_title: "Word Bank (A–F)",
        box_items: [
          "A. bilingual",
          "B. brevity",
          "C. entropy",
          "D. heraldry",
          "E. commerce",
          "F. homophones",
        ],
        question: "Unlike Egyptian hieroglyphs, the Indus script cannot be compared against a known tongue because archaeologists have never found a ______ monument.",
        options: ["A. bilingual", "B. brevity", "C. entropy", "D. heraldry", "E. commerce", "F. homophones"],
      },
      {
        id: 8,
        type: "HEAD",
        group: "Questions 7–10: Summary Completion (Word Bank)",
        question: "Furthermore, the remarkable ______ of the inscriptions — averaging just five characters — prevents scholars from identifying complex sentence structures.",
        options: ["A. bilingual", "B. brevity", "C. entropy", "D. heraldry", "E. commerce", "F. homophones"],
      },
      {
        id: 9,
        type: "HEAD",
        group: "Questions 7–10: Summary Completion (Word Bank)",
        question: "Most experts believe the carved stone seals were primarily used in regional ______ to mark goods.",
        options: ["A. bilingual", "B. brevity", "C. entropy", "D. heraldry", "E. commerce", "F. homophones"],
      },
      {
        id: 10,
        type: "HEAD",
        group: "Questions 7–10: Summary Completion (Word Bank)",
        question: "Farmer, Sproat, and Witzel argued that the symbols functioned more like medieval ______ than a true phonetic writing system.",
        options: ["A. bilingual", "B. brevity", "C. entropy", "D. heraldry", "E. commerce", "F. homophones"],
      },
      {
        id: 11,
        type: "YNN",
        group: "Questions 11–13: Yes / No / Not Given",
        instruction: "Do the following statements agree with the claims of the writer in Reading Passage 3?",
        question: "The longest discovered Indus inscription contains more than one hundred symbols.",
      },
      { id: 12, type: "YNN", group: "Questions 11–13: Yes / No / Not Given", question: "Rajesh Rao's team found that the ordering of Indus signs resembles the patterns of natural human languages." },
      { id: 13, type: "YNN", group: "Questions 11–13: Yes / No / Not Given", question: "All contemporary linguists now agree that the Indus script belongs to the Dravidian family." },
    ],
    answers: [
      { id: 1, correct_answer: "ii", explanation: "Paragraph A giới thiệu quy mô lãnh thổ rộng lớn của nền văn minh Harappa và hơn 4.000 hiện vật khắc chữ được khai quật." },
      { id: 2, correct_answer: "vi", explanation: "Paragraph B giải thích rào cản lớn nhất là thiếu văn bia song ngữ (bilingual inscription) như Rosetta Stone." },
      { id: 3, correct_answer: "iv", explanation: "Paragraph C nhấn mạnh độ ngắn cực đoan (extreme brevity) trung bình chỉ 5 ký tự khiến khó phân tích ngữ pháp." },
      { id: 4, correct_answer: "v", explanation: "Paragraph D trình bày giả thuyết gây tranh cãi của Farmer, Sproat & Witzel rằng các ký hiệu chỉ là biểu tượng phi ngôn ngữ." },
      { id: 5, correct_answer: "i", explanation: "Paragraph E nêu nghiên cứu toán học (Markov chain & conditional entropy) chứng minh quy tắc vị trí giống ngôn ngữ tự nhiên." },
      { id: 6, correct_answer: "iii", explanation: "Paragraph F bàn về cuộc tranh luận giữa giả thuyết ngữ hệ Dravidian, Indo-Aryan và ngôn ngữ biệt lập." },
      { id: 7, correct_answer: "A. bilingual", explanation: "Paragraph B: 'Foremost among them is the complete absence of a bilingual inscription.'" },
      { id: 8, correct_answer: "B. brevity", explanation: "Paragraph C: 'Compounding this difficulty is the extreme brevity of the surviving inscriptions.'" },
      { id: 9, correct_answer: "E. commerce", explanation: "Paragraph C: 'the small square seals were used in trade and administration, pressed into wet clay to secure bundles of merchandise'." },
      { id: 10, correct_answer: "D. heraldry", explanation: "Paragraph D: 'they compared the symbols to medieval European heraldic crests'." },
      { id: 11, correct_answer: "No", explanation: "Paragraph C: văn bản dài nhất từng tìm thấy chỉ có 34 ký hiệu ('comprises just thirty-four symbols')." },
      { id: 12, type: "YNN", correct_answer: "Yes", explanation: "Paragraph E: 'mirroring the syntactic constraints of natural human languages'." },
      { id: 13, correct_answer: "No", explanation: "Paragraph F: 'fierce debate persists regarding which language family it belongs to'." },
    ],
  },
  {
    id: "reading-4",
    section: "Reading Passage 2",
    title: "Deep-Sea Hydrothermal Vents and Chemosynthetic Life",
    subtitle: "How volcanic fissures on the ocean floor overturned a fundamental law of biology",
    difficulty_estimate_band: 7.0,
    passage: `## Paragraph A
Until the late twentieth century, a foundational axiom of biology held that all complex life on Earth ultimately depends on sunlight. Through photosynthesis, surface plants and marine phytoplankton convert solar radiation into organic carbon, forming the base of both terrestrial and oceanic food webs. The abyssal seafloor — lying more than two thousand metres beneath the waves in perpetual darkness and near-freezing temperatures — was consequently assumed to be a biological desert, capable of sustaining only sparse scavengers feeding on organic detritus drifting down from above.

## Paragraph B
That paradigm was shattered in February 1977, when geologists aboard the deep-submergence vehicle Alvin descended two and a half kilometres into the Galápagos Rift in the eastern Pacific Ocean. Expecting to find barren volcanic basalt, the expedition led by Jack Corliss and Robert Ballard instead encountered towering mineral chimneys spewing superheated, mineral-laden water at temperatures exceeding 350 degrees Celsius. Clustering around these "black smokers" were dense, thriving colonies of giant tube worms, blind white crabs, ghostly octopuses, and beds of oversized clams.

## Paragraph C
The mystery of how such a high-biomass ecosystem could flourish without sunlight was solved by microbiologist Holger Jannasch and his colleagues. Water samples revealed that the vent plumes were rich in hydrogen sulphide, a compound toxic to most surface organisms. Specialised extremophile bacteria living inside the vents oxidise this hydrogen sulphide using dissolved oxygen from seawater, releasing chemical energy to synthesise organic compounds from carbon dioxide — a process termed chemosynthesis.

## Paragraph D
Perhaps the most remarkable adaptation among vent fauna is exemplified by Riftia pachyptila, the giant tube worm that can grow up to two metres in length. Adult tube worms possess no mouth, gut, or digestive tract whatsoever. Instead, their bodies contain a specialised organ called the trophosome, packed with billions of symbiotic chemosynthetic bacteria that make up nearly half of the worm's weight. Bright red plumes at the tip of the worm absorb hydrogen sulphide, oxygen, and carbon dioxide from the water and transport them via a unique haemoglobin molecule to the bacteria, which in turn nourish their host.

## Paragraph E
Because individual hydrothermal vents are geologically ephemeral — often choking off within a few decades as tectonic plates shift and volcanic conduits cool — vent species face a constant existential challenge: colonising new vents tens or hundreds of kilometres away across inhospitable seafloor. Marine biologists Lauren Mullineaux and Cindy Van Dover demonstrated that many vent organisms overcome this barrier by releasing millions of microscopic buoyant larvae that ride deep-ocean currents until chemical cues signal the presence of an active plume.

## Paragraph F
Beyond revolutionising marine ecology, the discovery of hydrothermal ecosystems has reshaped astrobiology. Scientists at NASA and the European Space Agency now regard deep-sea vents as the closest terrestrial analogue to subsurface oceans on icy moons such as Jupiter's Europa and Saturn's Enceladus. Furthermore, biochemists led by Nick Lane and William Martin have proposed that alkaline hydrothermal vents — whose porous mineral walls naturally generate proton gradients — may have served as the cradle where the very first living cells emerged on primordial Earth four billion years ago.`,
    questions: [
      {
        id: 1,
        type: "HEAD",
        group: "Questions 1–4: Matching Sentence Endings",
        instruction: "Complete each sentence with the correct ending, A–F, below.",
        box_title: "List of Sentence Endings (A–F)",
        box_items: [
          "A. rely on microscopic larvae carried by deep-water currents.",
          "B. lack a digestive system and depend on internal bacteria for food.",
          "C. believed the deep ocean floor could only support a few scavengers.",
          "D. convert toxic hydrogen sulphide into organic nutrients without light.",
          "E. remain active for millions of years without changing temperature.",
          "F. may resemble environments found beneath the ice of distant moons.",
        ],
        question: "Before 1977, mainstream biologists",
        options: ["A", "B", "C", "D", "E", "F"],
      },
      { id: 2, type: "HEAD", group: "Questions 1–4: Matching Sentence Endings", question: "Chemosynthetic bacteria inside hydrothermal plumes", options: ["A", "B", "C", "D", "E", "F"] },
      { id: 3, type: "HEAD", group: "Questions 1–4: Matching Sentence Endings", question: "Adult giant tube worms (Riftia pachyptila)", options: ["A", "B", "C", "D", "E", "F"] },
      { id: 4, type: "HEAD", group: "Questions 1–4: Matching Sentence Endings", question: "To survive when a volcanic fissure cools down, vent species", options: ["A", "B", "C", "D", "E", "F"] },
      {
        id: 5,
        type: "FILL",
        group: "Questions 5–9: Note Completion",
        instruction: "Complete the notes below. Choose ONE WORD AND/OR A NUMBER from the passage for each answer.",
        word_limit: "ONE WORD AND/OR A NUMBER",
        question: "The 1977 Galápagos Rift dive used a submersible named ______.",
      },
      { id: 6, type: "FILL", group: "Questions 5–9: Note Completion", word_limit: "ONE WORD AND/OR A NUMBER", question: "Water emerging from 'black smokers' can reach temperatures above ______ degrees Celsius." },
      { id: 7, type: "FILL", group: "Questions 5–9: Note Completion", word_limit: "ONE WORD AND/OR A NUMBER", question: "Inside the giant tube worm, symbiotic bacteria live in an organ called the ______." },
      { id: 8, type: "FILL", group: "Questions 5–9: Note Completion", word_limit: "ONE WORD AND/OR A NUMBER", question: "The worm's red plumes use a special ______ molecule to deliver gases to the bacteria." },
      { id: 9, type: "FILL", group: "Questions 5–9: Note Completion", word_limit: "ONE WORD AND/OR A NUMBER", question: "Alkaline vents naturally create ______ gradients across their porous mineral walls." },
      {
        id: 10,
        type: "MCQ",
        group: "Questions 10–13: Multiple Choice",
        instruction: "Choose the correct letter, A, B, C, or D.",
        question: "Why was the 1977 Galápagos Rift discovery so surprising to scientists?",
        options: [
          "A. They had expected the volcanic rock to be completely devoid of abundant animal life",
          "B. They found green plants performing photosynthesis at a depth of 2,500 metres",
          "C. The water at the bottom of the rift was frozen solid",
          "D. They discovered sunken ships from ancient civilisations",
        ],
      },
      {
        id: 11,
        type: "MCQ",
        group: "Questions 10–13: Multiple Choice",
        question: "What problem do hydrothermal vent communities face over time?",
        options: [
          "A. Commercial fishing trawlers destroy the mineral chimneys",
          "B. Individual vents eventually become inactive due to tectonic shifts",
          "C. Sunlight penetrates the deep water during summer months",
          "D. Symbiotic bacteria escape into the upper atmosphere",
        ],
      },
      {
        id: 12,
        type: "MCQ",
        group: "Questions 10–13: Multiple Choice",
        question: "Why are space agencies interested in hydrothermal vents?",
        options: [
          "A. Vent minerals can be mined to build spacecraft",
          "B. They provide a model for how life might exist in underground oceans on icy moons",
          "C. They prove that oxygen is not needed by giant tube worms",
          "D. They emit radio signals that can be detected from orbit",
        ],
      },
      {
        id: 13,
        type: "MCQ",
        group: "Questions 10–13: Multiple Choice",
        question: "According to Nick Lane and William Martin, what role might alkaline vents have played?",
        options: [
          "A. Causing the extinction of early marine reptiles",
          "B. Cooling down the Earth's molten core",
          "C. Serving as the environment where the earliest living cells originated",
          "D. Producing atmospheric ozone four billion years ago",
        ],
      },
    ],
    answers: [
      { id: 1, correct_answer: "C", explanation: "Paragraph A: 'assumed to be a biological desert, capable of sustaining only sparse scavengers'." },
      { id: 2, correct_answer: "D", explanation: "Paragraph C: 'Specialised extremophile bacteria... oxidise this hydrogen sulphide... to synthesise organic compounds'." },
      { id: 3, correct_answer: "B", explanation: "Paragraph D: 'Adult tube worms possess no mouth, gut, or digestive tract whatsoever... packed with billions of symbiotic chemosynthetic bacteria'." },
      { id: 4, correct_answer: "A", explanation: "Paragraph E: 'releasing millions of microscopic buoyant larvae that ride deep-ocean currents'." },
      { id: 5, correct_answer: "Alvin", explanation: "Paragraph B: 'geologists aboard the deep-submergence vehicle Alvin descended...'" },
      { id: 6, correct_answer: "350", explanation: "Paragraph B: 'at temperatures exceeding 350 degrees Celsius.'" },
      { id: 7, correct_answer: "trophosome", explanation: "Paragraph D: 'their bodies contain a specialised organ called the trophosome'." },
      { id: 8, correct_answer: "haemoglobin", explanation: "Paragraph D: 'transport them via a unique haemoglobin molecule to the bacteria'." },
      { id: 9, correct_answer: "proton", explanation: "Paragraph F: 'whose porous mineral walls naturally generate proton gradients'." },
      { id: 10, correct_answer: "A. They had expected the volcanic rock to be completely devoid of abundant animal life", explanation: "Paragraph B: 'Expecting to find barren volcanic basalt... instead encountered... dense, thriving colonies'." },
      { id: 11, correct_answer: "B. Individual vents eventually become inactive due to tectonic shifts", explanation: "Paragraph E: 'often choking off within a few decades as tectonic plates shift and volcanic conduits cool'." },
      { id: 12, correct_answer: "B. They provide a model for how life might exist in underground oceans on icy moons", explanation: "Paragraph F: 'closest terrestrial analogue to subsurface oceans on icy moons such as Jupiter's Europa and Saturn's Enceladus.'" },
      { id: 13, correct_answer: "C. Serving as the environment where the earliest living cells originated", explanation: "Paragraph F: 'may have served as the cradle where the very first living cells emerged on primordial Earth'." },
    ],
  },
];

let readingCursor = 0;
export function getFallbackReadingTask(targetScore = 6.5, requestedSection?: string) {
  let pool = READING_PASSAGES;
  if (requestedSection && requestedSection !== "all") {
    const filtered = READING_PASSAGES.filter((p) => p.section.toLowerCase().includes(requestedSection.toLowerCase()));
    if (filtered.length > 0) pool = filtered;
  }
  const item = pool[readingCursor % pool.length];
  readingCursor++;
  return { ...item, difficulty_estimate_band: targetScore };
}

// ============================================================================
// 2. LISTENING SECTIONS (Chuẩn Cambridge IELTS - Part 1, 2, 3, 4)
// ============================================================================

const LISTENING_SECTIONS = [
  {
    section_type: "Part 1",
    context: "A student calling Westside Community Centre to enquire about evening language classes",
    instruction: "Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
    transcript: `Receptionist: Good morning, Westside Community Centre. How can I help you today?

Caller: Hello! I'm calling to ask about your evening language courses starting next month.

Receptionist: Certainly. Which language are you interested in? We currently offer Spanish, Japanese, and Italian.

Caller: I'd like to join the Japanese class for beginners, please.

Receptionist: Great choice. The Beginner Japanese course runs on Tuesday and Thursday evenings from six thirty to eight thirty.

Caller: That suits my schedule well. Who is the tutor for that class?

Receptionist: The tutor is Mrs Tanaka. Have you got that? That's spelled T-A-N-A-K-A. She's a native speaker with ten years of teaching experience.

Caller: Wonderful. And which room is the class held in?

Receptionist: It's on the second floor, in Room 214, right next to the library.

Caller: How much does the twelve-week course cost?

Receptionist: The standard fee is 180 pounds, but if you have a student card, there's a reduced rate of 145 pounds. That includes the workbook, though you'll need to buy your own dictionary.

Caller: I'm a university student, so I qualify for the discount! What is the maximum number of students in the group?

Receptionist: We cap all our language classes at 12 students so everyone gets plenty of speaking practice.

Caller: Perfect. When is the deadline for registration?

Receptionist: You need to register by the 15th of October. You can pay online or at the reception desk on Bridge Street.

Caller: Can I get there by bus from the station?

Receptionist: Yes, take bus number 49 and get off opposite the cinema. There's also a free car park behind the building if you drive.`,
    questions: [
      { id: 1, type: "FILL", word_limit: "ONE WORD", question: "Language chosen by caller: ______" },
      { id: 2, type: "FILL", word_limit: "ONE WORD", question: "Days of classes: Tuesday and ______" },
      { id: 3, type: "FILL", word_limit: "ONE WORD", question: "Name of tutor: Mrs ______" },
      { id: 4, type: "FILL", word_limit: "A NUMBER", question: "Classroom number: Room ______" },
      { id: 5, type: "FILL", word_limit: "A NUMBER", question: "Discounted price for students: £______" },
      { id: 6, type: "FILL", word_limit: "ONE WORD", question: "Item NOT included in the course fee: a ______" },
      { id: 7, type: "FILL", word_limit: "A NUMBER", question: "Maximum class size: ______ students" },
      { id: 8, type: "FILL", word_limit: "ONE WORD OR A NUMBER", question: "Registration deadline: ______ October" },
      { id: 9, type: "MCQ", question: "Where is the community centre located?", options: ["A. Station Road", "B. Bridge Street", "C. Cinema Avenue"] },
      { id: 10, type: "FILL", word_limit: "A NUMBER", question: "Bus number from the station: ______" },
    ],
    answers: [
      { id: 1, correct_answer: "Japanese", explanation: "Caller: 'I'd like to join the Japanese class for beginners, please.'" },
      { id: 2, correct_answer: "Thursday", explanation: "Receptionist: 'The Beginner Japanese course runs on Tuesday and Thursday evenings...'" },
      { id: 3, correct_answer: "Tanaka", explanation: "Receptionist: 'The tutor is Mrs Tanaka. That's spelled T-A-N-A-K-A.'" },
      { id: 4, correct_answer: "214", explanation: "Receptionist: 'It's on the second floor, in Room 214, right next to the library.'" },
      { id: 5, correct_answer: "145", explanation: "Receptionist: 'if you have a student card, there's a reduced rate of 145 pounds.'" },
      { id: 6, correct_answer: "dictionary", explanation: "Receptionist: 'That includes the workbook, though you'll need to buy your own dictionary.'" },
      { id: 7, correct_answer: "12 / twelve", explanation: "Receptionist: 'We cap all our language classes at 12 students...'" },
      { id: 8, correct_answer: "15th / 15", explanation: "Receptionist: 'You need to register by the 15th of October.'" },
      { id: 9, correct_answer: "B. Bridge Street", explanation: "Receptionist: 'You can pay online or at the reception desk on Bridge Street.'" },
      { id: 10, correct_answer: "49", explanation: "Receptionist: 'Yes, take bus number 49 and get off opposite the cinema.'" },
    ],
  },
  {
    section_type: "Part 2",
    context: "A guide giving an orientation talk to visitors at the newly reopened Riverside Heritage Park",
    instruction: "Questions 1–6: Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer. Questions 7–10: Choose the correct letter, A, B, or C.",
    transcript: `Guide: Good morning everyone, and welcome to Riverside Heritage Park. My name is Clara, and before you set off to explore our newly restored grounds, I'd like to give you some practical information about today's visit.

Guide: First of all, the park was originally established in 1884 as a private botanical estate by a local shipping merchant. After two years of conservation work, we reopened to the public last month.

Guide: As you walk along the main path from the entrance gate, the first building on your left is the Glasshouse, which houses our collection of rare orchids and ferns. Please note that the humidity inside is kept high, and photography with a flash is strictly prohibited as it damages sensitive plant species.

Guide: Just beyond the Glasshouse, you'll cross the old suspension bridge over the river. It's made of wrought iron and can only hold twenty-five people at a time, so please follow the marshal's instructions if it's busy.

Guide: On the eastern side of the river, you'll find the old Watermill. Demonstrations of flour grinding take place twice a day, at eleven o'clock in the morning and three fifteen in the afternoon. Each demonstration lasts about twenty minutes and is free of charge.

Guide: For families with children, our Woodland Discovery Trail starts behind the Watermill. Children can pick up a free activity booklet from the kiosk there and collect stamps at six checkpoints along the trail to win a wooden badge.

Guide: If you'd like refreshments, the Orchard Café serves hot lunches until two thirty, and light snacks until five. Finally, if you wish to buy souvenirs, local honey and organic seeds are on sale in the gift shop next to the main exit.`,
    questions: [
      { id: 1, type: "FILL", word_limit: "A NUMBER", question: "Year the park was originally founded: ______" },
      { id: 2, type: "FILL", word_limit: "ONE WORD", question: "Rare plants in the Glasshouse include ferns and ______" },
      { id: 3, type: "FILL", word_limit: "ONE WORD", question: "Visitors must not use a camera ______ inside the Glasshouse." },
      { id: 4, type: "FILL", word_limit: "A NUMBER", question: "Maximum capacity of the suspension bridge: ______ people" },
      { id: 5, type: "FILL", word_limit: "ONE WORD", question: "Children completing the Woodland Trail receive a wooden ______." },
      { id: 6, type: "FILL", word_limit: "ONE WORD", question: "Special local product sold in the gift shop: ______ and organic seeds" },
      { id: 7, type: "MCQ", question: "How long was the park closed for conservation work?", options: ["A. One month", "B. Two years", "C. Ten years"] },
      { id: 8, type: "MCQ", question: "When does the afternoon demonstration at the Watermill begin?", options: ["A. 11:00 am", "B. 2:30 pm", "C. 3:15 pm"] },
      { id: 9, type: "MCQ", question: "Where does the Woodland Discovery Trail start?", options: ["A. Behind the Watermill", "B. Opposite the Glasshouse", "C. Next to the main exit"] },
      { id: 10, type: "MCQ", question: "Until what time does the Orchard Café serve hot lunches?", options: ["A. 2:00 pm", "B. 2:30 pm", "C. 5:00 pm"] },
    ],
    answers: [
      { id: 1, correct_answer: "1884", explanation: "Guide: 'the park was originally established in 1884 as a private botanical estate'" },
      { id: 2, correct_answer: "orchids", explanation: "Guide: 'houses our collection of rare orchids and ferns.'" },
      { id: 3, correct_answer: "flash", explanation: "Guide: 'photography with a flash is strictly prohibited'" },
      { id: 4, correct_answer: "25 / twenty-five", explanation: "Guide: 'can only hold twenty-five people at a time'" },
      { id: 5, correct_answer: "badge", explanation: "Guide: 'collect stamps at six checkpoints along the trail to win a wooden badge.'" },
      { id: 6, correct_answer: "honey", explanation: "Guide: 'local honey and organic seeds are on sale in the gift shop'" },
      { id: 7, correct_answer: "B. Two years", explanation: "Guide: 'After two years of conservation work, we reopened to the public last month.'" },
      { id: 8, correct_answer: "C. 3:15 pm", explanation: "Guide: 'at eleven o'clock in the morning and three fifteen in the afternoon.'" },
      { id: 9, correct_answer: "A. Behind the Watermill", explanation: "Guide: 'our Woodland Discovery Trail starts behind the Watermill.'" },
      { id: 10, correct_answer: "B. 2:30 pm", explanation: "Guide: 'the Orchard Café serves hot lunches until two thirty'" },
    ],
  },
  {
    section_type: "Part 3",
    context: "Two environmental science students, Liam and Maya, discussing their dissertation project with their supervisor, Dr Patel",
    instruction: "Questions 1–5: Choose the correct letter, A, B, or C. Questions 6–10: Complete the summary below. Write ONE WORD ONLY for each answer.",
    transcript: `Dr Patel: Come in, Liam and Maya. Let's review the progress on your joint research project on urban microplastics. How did the initial water sampling go last week?

Maya: Well, Dr Patel, we collected samples from all eight sites along the canal, though it took longer than expected because the filtration pump kept clogging with sediment after heavy rain.

Liam: Initially we thought we'd have to discard Tuesday's samples, but once we switched to a two-stage steel mesh filter, the flow rate stabilised and the data turned out to be very consistent.

Dr Patel: Good problem-solving. And what did the microscope analysis show?

Maya: That was the surprising part. We assumed plastic packaging from nearby supermarkets would be the main pollutant, but over seventy percent of the particles were actually synthetic fibres shed from washing clothes.

Dr Patel: That aligns with recent European studies. Did you notice any variation between the residential zone and the industrial park?

Liam: Definitely. Fibre concentration peaked near the storm drains in the residential district, whereas the industrial section contained more tyre dust washed off the ring road.

Dr Patel: For your final report, I suggest cutting the section on historical canal construction—it's interesting, but it distracts from your core quantitative findings. Instead, expand your methodology chapter to explain how you prevented airborne contamination in the lab.

Maya: Right, we wore cotton lab coats and kept petri dishes covered in glass enclosures. We'll document that protocol in detail.

Dr Patel: Excellent. Also, make sure your bar charts compare seasonal rainfall against particle density, and submit the draft by Friday so I can give feedback before the departmental seminar.`,
    questions: [
      { id: 1, type: "MCQ", question: "Why did the water sampling take longer than planned?", options: ["A. Bad weather prevented access to the canal", "B. Mud and sediment blocked the equipment", "C. Some sample bottles were damaged in transit"] },
      { id: 2, type: "MCQ", question: "What was the most common type of microplastic found in the samples?", options: ["A. Supermarket food packaging", "B. Synthetic clothing fibres", "C. Industrial plastic pellets"] },
      { id: 3, type: "MCQ", question: "What pollutant was particularly common in the industrial zone?", options: ["A. Tyre dust from road traffic", "B. Paint flakes from boats", "C. Agricultural fertiliser"] },
      { id: 4, type: "MCQ", question: "Which section does Dr Patel advise the students to remove from their report?", options: ["A. The literature review", "B. The history of the canal", "C. The statistical appendix"] },
      { id: 5, type: "MCQ", question: "When must the students submit their draft report?", options: ["A. Tuesday", "B. Thursday", "C. Friday"] },
      { id: 6, type: "FILL", word_limit: "ONE WORD ONLY", question: "The students solved the clogging issue by using a two-stage ______ mesh filter." },
      { id: 7, type: "FILL", word_limit: "ONE WORD ONLY", question: "Fibre pollution was highest near the storm ______ in the housing area." },
      { id: 8, type: "FILL", word_limit: "ONE WORD ONLY", question: "Dr Patel wants more detail on how the team avoided airborne ______ in the laboratory." },
      { id: 9, type: "FILL", word_limit: "ONE WORD ONLY", question: "To avoid shedding synthetic fibres in the lab, the students wore ______ coats." },
      { id: 10, type: "FILL", word_limit: "ONE WORD ONLY", question: "The charts should compare particle density with seasonal ______." },
    ],
    answers: [
      { id: 1, correct_answer: "B. Mud and sediment blocked the equipment", explanation: "Maya: 'the filtration pump kept clogging with sediment after heavy rain.'" },
      { id: 2, correct_answer: "B. Synthetic clothing fibres", explanation: "Maya: 'over seventy percent of the particles were actually synthetic fibres shed from washing clothes.'" },
      { id: 3, correct_answer: "A. Tyre dust from road traffic", explanation: "Liam: 'the industrial section contained more tyre dust washed off the ring road.'" },
      { id: 4, correct_answer: "B. The history of the canal", explanation: "Dr Patel: 'I suggest cutting the section on historical canal construction'" },
      { id: 5, correct_answer: "C. Friday", explanation: "Dr Patel: 'submit the draft by Friday so I can give feedback'" },
      { id: 6, correct_answer: "steel", explanation: "Liam: 'once we switched to a two-stage steel mesh filter'" },
      { id: 7, correct_answer: "drains", explanation: "Liam: 'Fibre concentration peaked near the storm drains in the residential district'" },
      { id: 8, correct_answer: "contamination", explanation: "Dr Patel: 'explain how you prevented airborne contamination in the lab.'" },
      { id: 9, correct_answer: "cotton", explanation: "Maya: 'we wore cotton lab coats and kept petri dishes covered'" },
      { id: 10, correct_answer: "rainfall", explanation: "Dr Patel: 'make sure your bar charts compare seasonal rainfall against particle density'" },
    ],
  },
  {
    section_type: "Part 4",
    context: "A university lecture on the history and acoustic design of ancient Greek theatres",
    instruction: "Complete the lecture notes below. Write ONE WORD ONLY for each answer.",
    transcript: `Lecturer: Welcome back to our module on classical architecture. Today we are examining the remarkable acoustic engineering of ancient Greek theatres, particularly the famous theatre at Epidaurus, built in the fourth century BC.

Lecturer: For centuries, visitors have marvelled at how an actor speaking in a normal voice on the circular stage — known as the orchestra — can be heard clearly by up to fourteen thousand spectators sitting in the highest stone rows, over sixty metres away.

Lecturer: Early historians attributed this phenomenon to prevailing wind direction or the use of masks that acted as megaphones. However, modern acoustic research conducted at the Georgia Institute of Technology revealed that the secret actually lies in the geometry and material of the limestone seating rows.

Lecturer: The stepped rows of stone seats form a corrugated surface that acts as an acoustic trap. Specifically, the seats filter out low-frequency background noise, such as the rustling of trees and the murmur of the crowd, frequencies below five hundred hertz.

Lecturer: At the same time, the stone rows reflect high-frequency sound waves from the actor's voice back towards the audience. Although removing low frequencies slightly thins the voice, the human brain automatically reconstructs the missing fundamental tones through a neurological process called virtual pitch.

Lecturer: Another crucial factor was the steep slope of the seating tiers. Architects increased the angle of the upper section to thirty-four degrees, ensuring an unobstructed line of sight and direct sound propagation to the back rows.

Lecturer: Attempts to replicate these acoustics in modern theatres often fail because contemporary designers add soft cushions to the seats, which absorb sound energy rather than reflecting it. Furthermore, urban traffic noise today is far louder than the natural environment of ancient Greece.`,
    questions: [
      { id: 1, type: "FILL", word_limit: "ONE WORD ONLY", question: "The circular stage area of the Greek theatre was called the ______." },
      { id: 2, type: "FILL", word_limit: "ONE WORD ONLY", question: "Early historians believed actors' ______ helped amplify their voices." },
      { id: 3, type: "FILL", word_limit: "ONE WORD ONLY", question: "Researchers discovered the acoustic effect comes from the ______ seats." },
      { id: 4, type: "FILL", word_limit: "ONE WORD ONLY", question: "The corrugated rows filter out low-frequency background ______." },
      { id: 5, type: "FILL", word_limit: "ONE WORD ONLY", question: "The listener's ______ fills in the missing low tones via 'virtual pitch'." },
      { id: 6, type: "FILL", word_limit: "ONE WORD ONLY", question: "The steep ______ of the upper tiers improved both sightlines and sound." },
      { id: 7, type: "FILL", word_limit: "ONE WORD ONLY", question: "Modern theatres lose acoustic clarity when soft ______ are placed on seats." },
      { id: 8, type: "FILL", word_limit: "ONE WORD ONLY", question: "Modern urban ______ creates much louder low-frequency interference." },
      { id: 9, type: "MCQ", question: "How many spectators could the theatre at Epidaurus accommodate?", options: ["A. 4,000", "B. 14,000", "C. 40,000"] },
      { id: 10, type: "MCQ", question: "What frequency threshold is filtered out by the stone seating?", options: ["A. Below 50 Hz", "B. Below 500 Hz", "C. Above 5,000 Hz"] },
    ],
    answers: [
      { id: 1, correct_answer: "orchestra", explanation: "'the circular stage — known as the orchestra'" },
      { id: 2, correct_answer: "masks", explanation: "'Early historians attributed this phenomenon to prevailing wind direction or the use of masks'" },
      { id: 3, correct_answer: "limestone / stone", explanation: "'the secret actually lies in the geometry and material of the limestone seating rows.'" },
      { id: 4, correct_answer: "noise", explanation: "'the seats filter out low-frequency background noise'" },
      { id: 5, correct_answer: "brain", explanation: "'the human brain automatically reconstructs the missing fundamental tones'" },
      { id: 6, correct_answer: "slope / angle", explanation: "'Another crucial factor was the steep slope of the seating tiers.'" },
      { id: 7, correct_answer: "cushions", explanation: "'contemporary designers add soft cushions to the seats, which absorb sound energy'" },
      { id: 8, correct_answer: "traffic", explanation: "'urban traffic noise today is far louder than the natural environment of ancient Greece.'" },
      { id: 9, correct_answer: "B. 14,000", explanation: "'heard clearly by up to fourteen thousand spectators'" },
      { id: 10, correct_answer: "B. Below 500 Hz", explanation: "'frequencies below five hundred hertz.'" },
    ],
  },
  {
    section_type: "Part 1",
    context: "A customer calling Greenwheels Insurance to report a damaged commuter bicycle and arrange a repair",
    instruction: "Complete the form and table below. Write ONE WORD AND/OR A NUMBER for each answer.",
    transcript: `Agent: Good afternoon, Greenwheels Cycle Insurance. My name is Marcus. How can I assist you today?

Customer: Hi Marcus. I need to make a claim for my commuter bike. It was damaged yesterday evening when I hit a pothole onerton Road.

Agent: I'm sorry to hear that. Let's pull up your policy first. Could you give me your surname and policy reference number?

Customer: Sure, my surname is Henderson — that's H-E-N-D-E-R-S-O-N. And the policy number is GW-7492.

Agent: Thank you, Ms Henderson. I see you have our Gold Cover plan for a Trek hybrid bicycle. Which parts of the bicycle were damaged in the incident?

Customer: The front wheel rim is badly bent, and the gear cable snapped completely when the bike fell onto the pavement. Thankfully, the carbon frame itself isn't cracked.

Agent: Right, I've noted a bent front wheel and a broken gear cable. Which authorised repair workshop would you like to take it to?

Customer: The closest one to my office is Velofix Workshop on Market Street.

Agent: Velofix is on our approved partner list, so we can settle the bill with them directly. What is the estimated cost of the repairs?

Customer: Their mechanic inspected it this morning and quoted 115 pounds in total, including labour.

Agent: Under your Gold Cover policy, there is a standard excess fee of 25 pounds that you pay to the shop, and we cover the remaining 90 pounds. Also, while your bike is being repaired, you're entitled to a free replacement hire bike for up to five days.

Customer: Oh, that's really helpful! Where can I collect the hire bike?

Agent: From the cycle hub at Central Station, right next to Platform 4. Just bring your driver's licence as photo ID.`,
    questions: [
      { id: 1, type: "FILL", word_limit: "ONE WORD", question: "Claimant's surname: Ms ______" },
      { id: 2, type: "FILL", word_limit: "ONE WORD AND/OR A NUMBER", question: "Policy reference number: GW-______" },
      { id: 3, type: "FILL", word_limit: "ONE WORD", question: "Damaged component 1: bent front ______" },
      { id: 4, type: "FILL", word_limit: "ONE WORD", question: "Damaged component 2: snapped ______ cable" },
      { id: 5, type: "FILL", word_limit: "ONE WORD", question: "Part of the bike that was NOT damaged: the carbon ______" },
      { id: 6, type: "FILL", word_limit: "ONE WORD", question: "Repair shop location: Velofix Workshop on ______ Street" },
      { id: 7, type: "FILL", word_limit: "A NUMBER", question: "Total repair quote from mechanic: £______" },
      { id: 8, type: "FILL", word_limit: "A NUMBER", question: "Policy excess paid by customer: £______" },
      { id: 9, type: "FILL", word_limit: "A NUMBER", question: "Maximum duration for free hire bike: ______ days" },
      { id: 10, type: "FILL", word_limit: "ONE WORD", question: "Document required to collect hire bike: driver's ______" },
    ],
    answers: [
      { id: 1, correct_answer: "Henderson", explanation: "Customer: 'my surname is Henderson — that's H-E-N-D-E-R-S-O-N.'" },
      { id: 2, correct_answer: "7492", explanation: "Customer: 'the policy number is GW-7492.'" },
      { id: 3, correct_answer: "wheel / rim", explanation: "Customer: 'The front wheel rim is badly bent'" },
      { id: 4, correct_answer: "gear", explanation: "Customer: 'and the gear cable snapped completely'" },
      { id: 5, correct_answer: "frame", explanation: "Customer: 'Thankfully, the carbon frame itself isn't cracked.'" },
      { id: 6, correct_answer: "Market", explanation: "Customer: 'Velofix Workshop on Market Street.'" },
      { id: 7, correct_answer: "115", explanation: "Customer: 'quoted 115 pounds in total'" },
      { id: 8, correct_answer: "25", explanation: "Agent: 'there is a standard excess fee of 25 pounds'" },
      { id: 9, correct_answer: "5 / five", explanation: "Agent: 'free replacement hire bike for up to five days.'" },
      { id: 10, correct_answer: "licence / license", explanation: "Agent: 'Just bring your driver's licence as photo ID.'" },
    ],
  },
  {
    section_type: "Part 2",
    context: "A head librarian explaining the new ground-floor layout of Oakwood Central Library after renovation",
    instruction: "Questions 1–5: Label the floor plan below. Choose the correct letter, A–F, for each room. Questions 6–10: Choose the correct letter, A, B, or C.",
    box_title: "Oakwood Library Ground Floor Plan (Rooms A–F)",
    box_items: [
      "Room A: Immediately to the left of the Main Entrance, facing the street",
      "Room B: In the north-west corner, past Room A and opposite the lift",
      "Room C: Directly ahead of the Central Information Desk, overlooking the garden",
      "Room D: To the right of the Main Entrance, beside the self-service kiosks",
      "Room E: In the south-east corner, accessed via the quiet corridor",
      "Room F: Next to the garden exit at the far eastern end of the building",
    ],
    transcript: `Librarian: Welcome everyone to the reopening of Oakwood Central Library. Before we tour the building, please look at the ground-floor plan on your handout so I can explain where our new facilities are located.

Librarian: As you step through the Main Entrance at the south of the building, you'll see the Central Information Desk straight in front of you. Immediately to your left, in Room A facing the street, we've opened our new Soundproof Podcast Studio, which residents can book for recording interviews.

Librarian: If you continue walking north past Room A towards the north-west corner, opposite the passenger lift, you'll reach Room B. This space now houses our Local History Archive, including rare nineteenth-century town maps and parish newspapers.

Librarian: Looking straight ahead from the Central Information Desk towards the glass wall overlooking the courtyard garden, Room C is our expanded Children's Reading Zone, complete with acoustic ceiling panels so story-time sessions don't disturb other visitors.

Librarian: Now, going back to the Main Entrance and turning right past the self-service return kiosks, Room D is the Digital Makerspace, equipped with 3D printers and coding workstations.

Librarian: Finally, if you walk down the quiet corridor to the south-east corner, Room E has been converted into the Silent Study Hall for university and exam students. And right next to the garden exit at the far eastern end, Room F is our new Community Café.

Librarian: Please remember that library membership cards are free for all borough residents. Standard book loans last for three weeks, while DVDs and audio equipment can be borrowed for seven days. Late returns are no longer charged daily fines for children's books, though adult loans incur a small fee of twenty pence per day. On Saturdays, the library closes at six o'clock instead of eight.`,
    questions: [
      { id: 1, type: "MCQ", question: "Soundproof Podcast Studio", options: ["Room A", "Room B", "Room C", "Room D", "Room E", "Room F"] },
      { id: 2, type: "MCQ", question: "Local History Archive", options: ["Room A", "Room B", "Room C", "Room D", "Room E", "Room F"] },
      { id: 3, type: "MCQ", question: "Children's Reading Zone", options: ["Room A", "Room B", "Room C", "Room D", "Room E", "Room F"] },
      { id: 4, type: "MCQ", question: "Digital Makerspace (3D Printers)", options: ["Room A", "Room B", "Room C", "Room D", "Room E", "Room F"] },
      { id: 5, type: "MCQ", question: "Silent Study Hall", options: ["Room A", "Room B", "Room C", "Room D", "Room E", "Room F"] },
      { id: 6, type: "MCQ", question: "Which room is now the Community Café?", options: ["A. Room B", "B. Room D", "C. Room F"] },
      { id: 7, type: "MCQ", question: "Why were acoustic panels installed in the Children's Reading Zone?", options: ["A. To improve the sound of films", "B. To prevent noise from disturbing other library users", "C. To keep the room warmer in winter"] },
      { id: 8, type: "MCQ", question: "How long can members borrow standard books for?", options: ["A. Seven days", "B. Two weeks", "C. Three weeks"] },
      { id: 9, type: "MCQ", question: "What policy change has been made regarding late returns?", options: ["A. Fines have been abolished for children's books", "B. All late fees have doubled", "C. Membership cards are cancelled after three late returns"] },
      { id: 10, type: "MCQ", question: "What time does the library close on Saturdays?", options: ["A. 5:00 pm", "B. 6:00 pm", "C. 8:00 pm"] },
    ],
    answers: [
      { id: 1, correct_answer: "Room A", explanation: "'Immediately to your left, in Room A facing the street, we've opened our new Soundproof Podcast Studio'" },
      { id: 2, correct_answer: "Room B", explanation: "'towards the north-west corner, opposite the passenger lift, you'll reach Room B. This space now houses our Local History Archive'" },
      { id: 3, correct_answer: "Room C", explanation: "'overlooking the courtyard garden, Room C is our expanded Children's Reading Zone'" },
      { id: 4, correct_answer: "Room D", explanation: "'turning right past the self-service return kiosks, Room D is the Digital Makerspace'" },
      { id: 5, correct_answer: "Room E", explanation: "'in the south-east corner, Room E has been converted into the Silent Study Hall'" },
      { id: 6, correct_answer: "C. Room F", explanation: "'next to the garden exit at the far eastern end, Room F is our new Community Café.'" },
      { id: 7, correct_answer: "B. To prevent noise from disturbing other library users", explanation: "'complete with acoustic ceiling panels so story-time sessions don't disturb other visitors.'" },
      { id: 8, correct_answer: "C. Three weeks", explanation: "'Standard book loans last for three weeks'" },
      { id: 9, correct_answer: "A. Fines have been abolished for children's books", explanation: "'Late returns are no longer charged daily fines for children's books'" },
      { id: 10, correct_answer: "B. 6:00 pm", explanation: "'On Saturdays, the library closes at six o'clock instead of eight.'" },
    ],
  },
  {
    section_type: "Part 3",
    context: "Two psychology students, Hannah and Ben, planning a cognitive experiment on background music and memory recall",
    instruction: "Questions 1–5: Match each musical condition with the students' observation, A–E. Questions 6–10: Complete the flow-chart below. Write ONE WORD AND/OR A NUMBER for each answer.",
    box_title: "Observations / Experimental Findings (A–E)",
    box_items: [
      "A. Significantly disrupted reading comprehension due to competing verbal lyrics",
      "B. Produced the highest spatial memory scores among introverted participants",
      "C. Caused listeners' attention to wander because the tempo was too slow",
      "D. Improved mood before the test but did not change accuracy rates",
      "E. Created physiological stress and raised heart rate during complex maths tasks",
    ],
    transcript: `Hannah: Hi Ben, have you finished analysing the pilot data from our psychology experiment on how different types of background sound affect working memory?

Ben: Yes, I ran the statistical tests last night, and the differences across the five sound conditions are fascinating. Let's go through them before we design the main trial.

Hannah: Great. What happened with Condition 1, the pop songs with vocal lyrics?

Ben: Just as Baddeley's phonological loop theory predicts, songs with vocal lyrics seriously disrupted reading comprehension because participants' brains were processing the sung words at the same time as the text. That matches Observation A.

Hannah: And what about Condition 2, the fast-tempo heavy percussion tracks?

Ben: Wearing heart-rate monitors showed that fast percussion actually triggered physiological stress and elevated heart rates when students tried to solve multi-step maths problems — so that's Observation E.

Hannah: Interesting. How did Condition 3, the classical string quartets at moderate tempo, perform?

Ben: That was the most positive finding. Classical strings produced the highest spatial memory scores, especially among introverted participants — Observation B.

Hannah: What about Condition 4, the ambient nature sounds like rainfall?

Ben: Surprisingly, ambient rain made participants' attention wander because the rhythm was too slow and monotonous, which is Observation C. And finally, Condition 5 — listening to upbeat jazz before the test — improved participants' mood beforehand, though it didn't actually change their accuracy rates, which is Observation D.

Hannah: That's a super clear pattern. Now let's finalise the 5-step procedure for next week's main experiment. In Step 1, we need to recruit 60 volunteers from the undergraduate database.

Ben: Right, and in Step 2, every volunteer completes a short hearing screening and a personality questionnaire.

Hannah: Then in Step 3, participants wear noise-cancelling headphones and memorise a list of twenty abstract nouns.

Ben: In Step 4, we introduce a five-minute distraction task where they solve simple puzzles so they can't rehearse the words silently. Finally, in Step 5, we measure both their recall accuracy and their response speed in milliseconds.`,
    questions: [
      { id: 1, type: "MCQ", question: "Condition 1: Pop songs with vocal lyrics", options: ["A", "B", "C", "D", "E"] },
      { id: 2, type: "MCQ", question: "Condition 2: Fast-tempo heavy percussion", options: ["A", "B", "C", "D", "E"] },
      { id: 3, type: "MCQ", question: "Condition 3: Classical string quartets", options: ["A", "B", "C", "D", "E"] },
      { id: 4, type: "MCQ", question: "Condition 4: Ambient nature sounds (rainfall)", options: ["A", "B", "C", "D", "E"] },
      { id: 5, type: "MCQ", question: "Condition 5: Upbeat jazz played prior to testing", options: ["A", "B", "C", "D", "E"] },
      { id: 6, type: "FILL", word_limit: "A NUMBER", question: "Step 1: Recruit ______ undergraduate volunteers from the university database." },
      { id: 7, type: "FILL", word_limit: "ONE WORD", question: "Step 2: Administer a hearing check and a ______ questionnaire." },
      { id: 8, type: "FILL", word_limit: "ONE WORD", question: "Step 3: Volunteers use noise-cancelling ______ while memorising twenty abstract nouns." },
      { id: 9, type: "FILL", word_limit: "ONE WORD", question: "Step 4: Complete a 5-minute distraction task solving ______ to prevent silent rehearsal." },
      { id: 10, type: "FILL", word_limit: "ONE WORD", question: "Step 5: Record recall accuracy and response ______ in milliseconds." },
    ],
    answers: [
      { id: 1, correct_answer: "A", explanation: "Ben: 'songs with vocal lyrics seriously disrupted reading comprehension... Observation A.'" },
      { id: 2, correct_answer: "E", explanation: "Ben: 'fast percussion actually triggered physiological stress and elevated heart rates... Observation E.'" },
      { id: 3, correct_answer: "B", explanation: "Ben: 'Classical strings produced the highest spatial memory scores, especially among introverted participants — Observation B.'" },
      { id: 4, correct_answer: "C", explanation: "Ben: 'ambient rain made participants' attention wander because the rhythm was too slow... Observation C.'" },
      { id: 5, correct_answer: "D", explanation: "Ben: 'improved participants' mood beforehand, though it didn't actually change their accuracy rates, which is Observation D.'" },
      { id: 6, correct_answer: "60 / sixty", explanation: "Hannah: 'In Step 1, we need to recruit 60 volunteers'" },
      { id: 7, correct_answer: "personality", explanation: "Ben: 'completes a short hearing screening and a personality questionnaire.'" },
      { id: 8, correct_answer: "headphones", explanation: "Hannah: 'participants wear noise-cancelling headphones'" },
      { id: 9, correct_answer: "puzzles", explanation: "Ben: 'where they solve simple puzzles so they can't rehearse the words'" },
      { id: 10, correct_answer: "speed", explanation: "Ben: 'measure both their recall accuracy and their response speed in milliseconds.'" },
    ],
  },
  {
    section_type: "Part 4",
    context: "An agricultural economics lecture on the history, botany, and global trade of saffron",
    instruction: "Complete the lecture notes below. Write ONE WORD AND/OR A NUMBER for each answer.",
    transcript: `Lecturer: Good morning. In today's lecture on high-value agricultural commodities, we are examining saffron — weight for weight, the world's most expensive spice, derived from the autumn-flowering plant Crocus sativus.

Lecturer: Botanically, Crocus sativus is a sterile triploid plant, meaning it cannot produce fertile seeds in the wild. Instead, farmers must propagate it entirely by digging up, dividing, and replanting its underground bulbs, known as corms, every summer.

Lecturer: Archaeological frescoes on the Greek island of Santorini indicate that saffron has been harvested for over three thousand five hundred years. In ancient Minoan and Persian societies, it was prized not only as a culinary seasoning but also as a royal yellow dye for silk garments and a medicinal treatment for eye inflammation.

Lecturer: Why does saffron command prices exceeding five thousand dollars per kilogram? The explanation lies in the extraordinary labour intensity of harvesting. Each purple crocus flower produces only three crimson stigmas — the thread-like female reproductive parts that constitute commercial saffron.

Lecturer: It takes approximately one hundred and fifty thousand flowers to yield just one kilogram of dried saffron threads. Moreover, the flowers must be picked by hand at dawn before intense sunlight causes the petals to wilt and the aromatic oils to evaporate.

Lecturer: Chemically, three compounds define saffron's quality: crocin gives the spice its golden-yellow colour, picrocrocin provides its distinctive bitter taste, and safranal — which develops during the drying process — creates its hay-like aroma.

Lecturer: Because of its high market value, adulteration has plagued the saffron trade for centuries. Dishonest merchants historically mixed genuine threads with safflower petals, beetroot fibres, or even turmeric powder to increase weight. Today, researchers in Denmark and Spain are trialling automated indoor hydroponic systems using robotic cameras to harvest the delicate stigmas, though traditional open-field farming in Iran still accounts for nearly ninety percent of global output.`,
    questions: [
      { id: 1, type: "FILL", word_limit: "ONE WORD", question: "Because Crocus sativus is sterile, it cannot reproduce via ______." },
      { id: 2, type: "FILL", word_limit: "ONE WORD", question: "Farmers propagate the plant by dividing its underground ______." },
      { id: 3, type: "FILL", word_limit: "ONE WORD", question: "In ancient Persia, saffron was used as a yellow ______ for luxury fabrics." },
      { id: 4, type: "FILL", word_limit: "A NUMBER", question: "Each crocus blossom contains only ______ red stigmas." },
      { id: 5, type: "FILL", word_limit: "A NUMBER", question: "About ______ flowers are required to produce 1 kg of dried saffron." },
      { id: 6, type: "FILL", word_limit: "ONE WORD", question: "Harvesting must take place at ______ to protect the aromatic oils from sunlight." },
      { id: 7, type: "FILL", word_limit: "ONE WORD", question: "The chemical picrocrocin is responsible for saffron's ______ flavour." },
      { id: 8, type: "FILL", word_limit: "ONE WORD", question: "Aroma compound 'safranal' is formed during the ______ stage." },
      { id: 9, type: "FILL", word_limit: "ONE WORD", question: "Fraudulent sellers sometimes add beetroot fibres or ______ powder to fake saffron." },
      { id: 10, type: "FILL", word_limit: "ONE WORD", question: "Scientists are testing indoor ______ systems with robotics to automate harvesting." },
    ],
    answers: [
      { id: 1, correct_answer: "seeds", explanation: "'meaning it cannot produce fertile seeds in the wild.'" },
      { id: 2, correct_answer: "corms / bulbs", explanation: "'replanting its underground bulbs, known as corms'" },
      { id: 3, correct_answer: "dye", explanation: "'as a royal yellow dye for silk garments'" },
      { id: 4, correct_answer: "3 / three", explanation: "'Each purple crocus flower produces only three crimson stigmas'" },
      { id: 5, correct_answer: "150,000 / 150000", explanation: "'It takes approximately one hundred and fifty thousand flowers to yield just one kilogram'" },
      { id: 6, correct_answer: "dawn", explanation: "'the flowers must be picked by hand at dawn'" },
      { id: 7, correct_answer: "bitter", explanation: "'picrocrocin provides its distinctive bitter taste'" },
      { id: 8, correct_answer: "drying", explanation: "'safranal — which develops during the drying process'" },
      { id: 9, correct_answer: "turmeric", explanation: "'mixed genuine threads with safflower petals, beetroot fibres, or even turmeric powder'" },
      { id: 10, correct_answer: "hydroponic", explanation: "'trialling automated indoor hydroponic systems'" },
    ],
  },
];

let listeningCursor = 0;
export function getFallbackListeningTask(targetScore = 6.5, requestedPart?: number) {
  let pool = LISTENING_SECTIONS;
  if (requestedPart && requestedPart >= 1 && requestedPart <= 4) {
    const filtered = LISTENING_SECTIONS.filter((s) => s.section_type === `Part ${requestedPart}`);
    if (filtered.length > 0) pool = filtered;
  }
  const item = pool[listeningCursor % pool.length];
  listeningCursor++;
  return { ...item, difficulty_estimate_band: targetScore };
}

// ============================================================================
// 3. WRITING TASKS (Đủ 7 dạng biểu đồ Task 1 & 5 dạng luận Task 2 + Bài mẫu Band 8.5)
// ============================================================================

const WRITING_TASK1_LIST = [
  {
    task_type: "task1",
    sub_type: "line",
    question: "The line graph below shows the percentage of households with access to high-speed broadband internet in three countries between 2010 and 2025.",
    instructions: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    min_words: 150,
    structure_tips: {
      introduction: "Paraphrase câu hỏi (1–2 câu): nêu loại biểu đồ (line graph), đối tượng (% hộ gia đình có internet tốc độ cao), 3 quốc gia và giai đoạn 2010–2025.",
      overview: "Overview (2–3 câu, bắt buộc để đạt Band 6.0+ TA): nêu xu hướng tăng rõ rệt ở cả 3 nước; Hàn Quốc luôn cao nhất, còn Việt Nam có tốc độ tăng trưởng mạnh nhất.",
      body_paragraph_1: "Body 1: So sánh số liệu năm 2010 và giai đoạn 2010–2015 (Hàn Quốc xuất phát ở mức 78%, gấp gần 2 lần Anh 45% và hơn 6 lần Việt Nam 12%).",
      body_paragraph_2: "Body 2: Phân tích giai đoạn 2015–2025 khi khoảng cách thu hẹp mạnh (Việt Nam tăng vọt lên 88%, Anh đạt 93% và Hàn Quốc tiệm cận 98%).",
    },
    vocabulary_hints: [
      { word: "upward trajectory", meaning: "xu hướng tăng trưởng", usage: "All three nations experienced a clear upward trajectory over the 15-year period." },
      { word: "narrow the gap", meaning: "thu hẹp khoảng cách", usage: "Vietnam narrowed the gap with the UK significantly between 2015 and 2025." },
      { word: "outpace", meaning: "tăng nhanh hơn / vượt tốc", usage: "Growth in broadband adoption in Vietnam outpaced that of the other two countries." },
    ],
    sample_answer: `The line graph compares the proportion of households connected to high-speed broadband internet in South Korea, the United Kingdom, and Vietnam over a 15-year period from 2010 to 2025.

Overall, broadband penetration rose substantially in all three countries throughout the period shown. While South Korea consistently maintained the highest coverage, Vietnam recorded the most dramatic growth, considerably narrowing the gap with the other two nations by 2025.

In 2010, there was a marked disparity in internet access among the three countries. South Korea led by a wide margin, with 78% of households having high-speed connections, compared with just under half (45%) in the UK and a mere 12% in Vietnam. Over the following five years, coverage in the UK climbed steeply to 68%, whereas Vietnam's figure more than tripled to 38%, and South Korea saw a more moderate rise to 86%.

Between 2015 and 2025, broadband access in all three nations converged towards near-universal levels. Vietnam's household penetration surged to 72% in 2020 and reached 88% by 2025. Similarly, the UK rose steadily to 93% in 2025, finishing only five percentage points behind South Korea, which peaked at 98%.`,
    chart_data: {
      type: "line" as const,
      title: "Household High-Speed Broadband Penetration (%)",
      labels: ["2010", "2015", "2020", "2025"],
      datasets: [
        { label: "South Korea", data: [78, 86, 94, 98] },
        { label: "United Kingdom", data: [45, 68, 85, 93] },
        { label: "Vietnam", data: [12, 38, 72, 88] },
      ],
    },
  },
  {
    task_type: "task1",
    sub_type: "bar",
    question: "The bar chart below shows the percentage of electricity generated from renewable sources in four countries in 2010, 2018, and 2025.",
    instructions: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    min_words: 150,
    structure_tips: {
      introduction: "Paraphrase đề bài: biểu đồ cột so sánh tỷ lệ điện sản xuất từ năng lượng tái tạo tại 4 quốc gia vào 3 mốc năm 2010, 2018 và 2025.",
      overview: "Overview: tỷ trọng điện tái tạo tăng ở cả 4 nước; Na Uy luôn đứng đầu với cách biệt lớn, trong khi Đức có mức tăng điểm phần trăm ấn tượng nhất.",
      body_paragraph_1: "Body 1: Phân tích 2 quốc gia dẫn đầu là Na Uy và Đức qua 3 mốc thời gian.",
      body_paragraph_2: "Body 2: So sánh xu hướng tăng của Úc và Nhật Bản từ mức xuất phát thấp năm 2010.",
    },
    vocabulary_hints: [
      { word: "account for", meaning: "chiếm (tỷ lệ)", usage: "Renewables accounted for 62% of Germany's electricity generation by 2025." },
      { word: "threefold increase", meaning: "tăng gấp 3 lần", usage: "Australia witnessed a more than threefold increase over the period." },
      { word: "remain dominant", meaning: "duy trì vị trí dẫn đầu", usage: "Norway remained dominant throughout the entire timeframe." },
    ],
    sample_answer: `The bar chart illustrates the proportion of total electricity produced from renewable energy in Norway, Germany, Australia, and Japan in 2010, 2018, and 2025.

Overall, every country experienced an upward trend in renewable electricity generation across the three years. Norway generated by far the highest share of clean electricity throughout, whereas Germany achieved the largest percentage-point increase.

In Norway, renewables already supplied 95% of electricity in 2010, and this figure edged up to 97% in 2018 before reaching 99% in 2025. Germany started at a much lower 17% in 2010, but its renewable share more than doubled to 38% by 2018 and climbed further to 62% in 2025.

By contrast, Australia and Japan had comparatively modest proportions in 2010, at 11% and 10% respectively. However, Australia's figure rose sharply to 21% in 2018 and 39% in 2025. Japan's growth was more gradual, increasing to 17% in 2018 and 28% by the end of the period.`,
    chart_data: {
      type: "bar" as const,
      title: "Share of Electricity from Renewable Sources (%)",
      labels: ["Norway", "Germany", "Australia", "Japan"],
      datasets: [
        { label: "2010", data: [95, 17, 11, 10] },
        { label: "2018", data: [97, 38, 21, 17] },
        { label: "2025", data: [99, 62, 39, 28] },
      ],
    },
  },
  {
    task_type: "task1",
    sub_type: "pie",
    question: "The pie chart below shows the breakdown of average household expenditure across six categories in the United Kingdom in 2024.",
    instructions: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    min_words: 150,
    structure_tips: {
      introduction: "Paraphrase câu hỏi: biểu đồ tròn thể hiện tỷ trọng chi tiêu trung bình của các hộ gia đình tại Anh theo 6 nhóm danh mục trong năm 2024.",
      overview: "Overview: Nhà ở & Năng lượng (Housing & Utilities) cùng Thực phẩm (Food) chiếm hơn một nửa tổng ngân sách gia đình, trong khi Giáo dục & Giải trí chiếm tỷ trọng nhỏ nhất.",
      body_paragraph_1: "Body 1: Phân tích 3 khoản chi lớn nhất (Housing & Utilities 32%, Food & Groceries 21%, Transport 17%).",
      body_paragraph_2: "Body 2: So sánh 3 khoản chi còn lại (Leisure & Culture 13%, Healthcare 10%, Clothing & Other 7%).",
    },
    vocabulary_hints: [
      { word: "constitute the largest share", meaning: "chiếm tỷ trọng lớn nhất", usage: "Housing and utilities constituted the largest share of household budgets at 32%." },
      { word: "combined total", meaning: "tổng cộng gộp lại", usage: "Housing and food accounted for a combined total of 53% of all spending." },
      { word: "allocate to", meaning: "phân bổ cho", usage: "Only 7% of the average budget was allocated to clothing and miscellaneous goods." },
    ],
    sample_answer: `The pie chart illustrates how average households in the United Kingdom distributed their expenditure across six major spending categories in 2024.

Overall, essential living costs — namely housing, food, and transport — dominated household budgets, accounting for exactly70% of total spending. By contrast, clothing and miscellaneous items represented the smallest proportion of expenditure.

Housing and utilities constituted by far the largest single expense, consuming nearly a third (32%) of the average family budget. Food and groceries ranked second at 21%, meaning that basic shelter and nutrition together absorbed more than half of all household income. Transport was the third most significant outlay, taking up 17% of total expenditure.

Turning to the remaining categories, British households devoted 13% of their spending to leisure and cultural activities, which was slightly higher than the 10% spent on healthcare services. Finally, clothing and other goods accounted for the smallest slice of the chart at just 7%, less than a quarter of the amount spent on housing.`,
    chart_data: {
      type: "pie" as const,
      title: "UK Average Household Expenditure Breakdown (%)",
      labels: ["Housing & Utilities", "Food & Groceries", "Transport", "Leisure & Culture", "Healthcare", "Clothing & Other"],
      datasets: [{ label: "Share of Spending (%)", data: [32, 21, 17, 13, 10, 7] }],
    },
  },
  {
    task_type: "task1",
    sub_type: "table",
    question: "The table below gives information about the underground railway systems in five major cities in terms of year opened, network length, and annual passenger numbers.",
    instructions: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    min_words: 150,
    structure_tips: {
      introduction: "Paraphrase đề bài: bảng số liệu so sánh hệ thống tàu điện ngầm tại 5 thành phố lớn dựa trên 3 tiêu chí (năm khai trương, tổng chiều dài tuyến và lượng hành khách mỗi năm).",
      overview: "Overview: các hệ thống lâu đời hơn (London, Paris, Tokyo) nhìn chung có quy mô lớn hơn và phục vụ nhiều hành khách hơn đáng kể so với các hệ thống mới (Kyoto, Los Angeles); trong đó Tokyo đông khách nhất còn London dài nhất.",
      body_paragraph_1: "Body 1: Phân tích 3 mạng lưới lâu đời và quy mô lớn (London mở năm 1863 dài 394 km; Paris 1900; Tokyo 1927 dẫn đầu tuyệt đối với 1.928 triệu lượt khách/năm).",
      body_paragraph_2: "Body 2: Đối chiếu 2 hệ thống mới xây dựng cuối thế kỷ 20 (Kyoto 1981 chỉ dài 11 km với 45 triệu khách; Los Angeles 2001 dài 28 km với 50 triệu khách).",
    },
    vocabulary_hints: [
      { word: "oldest and most extensive", meaning: "lâu đời và rộng lớn nhất", usage: "London boasts the oldest and most extensive underground network in the table." },
      { word: "carry / serve passengers", meaning: "vận chuyển / phục vụ hành khách", usage: "Tokyo's metro system serves nearly two billion passengers annually." },
      { word: "pale in comparison", meaning: "nhỏ bé hơn hẳn khi so sánh", usage: "The newer networks in Kyoto and Los Angeles pale in comparison to Tokyo." },
    ],
    sample_answer: `The table compares the underground rail networks of five metropolitan areas — London, Paris, Tokyo, Kyoto, and Los Angeles — across three indicators: date of inauguration, total route length, and yearly passenger volume.

Overall, the older subway systems in London, Paris, and Tokyo are substantially longer and transport far more commuters than the more recently constructed networks in Kyoto and Los Angeles. Notably, London possesses the longest track network, whereas Tokyo handles the highest number of passengers.

Inaugurated in 1863, the London Underground is the oldest system in the group and also the most extensive, spanning 394 kilometres and serving 775 million passengers per year. Paris, which opened its metro in 1900, has roughly half the route length of London (199 km) yet carries considerably more travellers, at 1,191 million annually. Tokyo's network, opened in 1927 with 155 km of track, is the busiest of all five cities, transporting 1,928 million commuters each year.

By contrast, the two newest systems are much smaller in both scale and ridership. Kyoto's underground, opened in 1981, consists of just 11 kilometres of track and serves 45 million passengers annually, closely followed by the 2001 Los Angeles system with 28 kilometres and 50 million riders.`,
    chart_data: {
      type: "table" as const,
      title: "Comparison of Five Underground Railway Networks",
      labels: ["London", "Paris", "Tokyo", "Kyoto", "Los Angeles"],
      datasets: [
        { label: "Year Opened", data: [1863, 1900, 1927, 1981, 2001] },
        { label: "Route Length (km)", data: [394, 199, 155, 11, 28] },
        { label: "Passengers / Year (Millions)", data: [775, 1191, 1928, 45, 50] },
      ],
    },
  },
  {
    task_type: "task1",
    sub_type: "process",
    question: "The diagram below illustrates the industrial process by which used glass bottles are recycled into new glass containers.",
    instructions: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    min_words: 150,
    structure_tips: {
      introduction: "Paraphrase đề bài: sơ đồ quy trình (process diagram) mô tả các bước tái chế chai thủy tinh đã qua sử dụng thành các sản phẩm chai lọ mới.",
      overview: "Overview: đây là một quy trình khép kín (cyclical process) gồm 6 giai đoạn chính, bắt đầu từ việc thu gom chai cũ của người tiêu dùng, qua xử lý nhiệt ở lò nung và kết thúc bằng việc phân phối chai mới trở lại siêu thị.",
      body_paragraph_1: "Body 1: Mô tả giai đoạn thu gom và sơ chế (Bước 1–3: thu gom tại điểm tập kết -> rửa sạch bằng nước áp lực cao -> phân loại theo màu sắc Xanh, Nâu, Trong suốt và nghiền thành mảnh vụn 'cullet').",
      body_paragraph_2: "Body 2: Mô tả giai đoạn nung chảy và tạo hình (Bước 4–6: trộn mảnh thủy tinh với cát silica và nung ở 1.500°C -> đúc khuôn thổi thành chai mới -> kiểm định chất lượng, đóng gói và vận chuyển tới siêu thị).",
    },
    vocabulary_hints: [
      { word: "cyclical process", meaning: "quy trình tuần hoàn khép kín", usage: "Glass recycling is a six-stage cyclical process that transforms waste into new containers." },
      { word: "high-pressure water jets", meaning: "vòi phun nước áp lực cao", usage: "Collected bottles are sterilised using high-pressure water jets to remove labels." },
      { word: "molten glass", meaning: "thủy tinh nóng chảy", usage: "The furnace heats the mixture to 1,500°C until it turns into molten glass." },
    ],
    sample_answer: `The diagram depicts the step-by-step industrial process of recycling discarded glass bottles into brand-new glass containers.

Overall, glass recycling is a six-stage cyclical process that begins with the collection of used bottles from consumers and culminates in the delivery of newly moulded glass products to retail outlets. The process involves three main phases: sorting and cleaning, crushing and melting, and moulding and distribution.

In the initial stage, used glass bottles are deposited by consumers into public recycling bins and transported by lorry to a treatment plant. Once there, the bottles are thoroughly washed with high-pressure water jets to remove impurities and paper labels. Subsequently, the clean bottles are sorted optically into three colour categories — green, brown, and clear — before being mechanically crushed into small glass fragments known as cullet.

During the second half of the process, this crushed glass is mixed with small quantities of raw silica sand and fed into a furnace heated to 1,500 degrees Celsius. The resulting molten glass is then poured into automated moulds and blown into new bottle shapes. Finally, after cooling and passing quality inspection, the new bottles are filled with beverages and distributed to supermarkets, where the cycle begins anew.`,
    chart_data: {
      type: "process" as const,
      title: "The Industrial Glass Bottle Recycling Process (6 Stages)",
      description: "A cyclical 6-stage industrial process transforming consumer waste glass into new commercial bottles via sterilisation, optical colour sorting, high-temperature smelting (1,500°C), and automated moulding.",
      labels: [
        "Stage 1: Collection from public bins & transport to plant",
        "Stage 2: High-pressure washing & label removal",
        "Stage 3: Colour sorting (Green / Brown / Clear) & crushing into cullet",
        "Stage 4: Mixing with silica sand & melting in furnace at 1,500°C",
        "Stage 5: Pouring molten glass into moulds & cooling",
        "Stage 6: Quality check, filling & delivery to supermarkets",
      ],
    },
  },
  {
    task_type: "task1",
    sub_type: "map",
    question: "The maps below show the changes that have taken place in the coastal town of Seaville between 1995 and the present day.",
    instructions: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    min_words: 150,
    structure_tips: {
      introduction: "Paraphrase đề bài: hai bản đồ mô tả sự thay đổi quy hoạch đô thị của thị trấn ven biển Seaville từ năm 1995 đến hiện tại.",
      overview: "Overview: Seaville đã chuyển dịch hoàn toàn từ một làng chài và nông nghiệp yên bình thành một khu nghỉ dưỡng du lịch hiện đại, với việc thay thế cảng cá, đất nông nghiệp và rừng cây bằng khách sạn, sân golf và bến du thuyền.",
      body_paragraph_1: "Body 1: Mô tả các thay đổi ở khu vực ven biển phía Nam và phía Tây (Cảng cá cũ bị phá bỏ để xây Bến du thuyền Marina; Chợ cá ven biển biến thành chuỗi Nhà hàng hải sản; khu căn hộ nghỉ dưỡng mọc lên).",
      body_paragraph_2: "Body 2: Mô tả các thay đổi ở khu vực đất liền phía Bắc và phía Đông (Đất nông nghiệp và khu rừng phía Đông Bắc bị giải tỏa hoàn toàn để nhường chỗ cho Sân golf 18 lỗ và Sân quần vợt; quán cà phê giữ nguyên nhưng mở rộng).",
    },
    vocabulary_hints: [
      { word: "undergo a complete transformation", meaning: "trải qua sự lột xác hoàn toàn", usage: "Seaville has undergone a complete transformation from a fishing village into a tourist resort." },
      { word: "demolish to make way for", meaning: "phá bỏ để nhường chỗ cho", usage: "The old fish market was demolished to make way for waterfront seafood restaurants." },
      { word: "replace with", meaning: "thay thế bằng", usage: "Farmland in the north-east was replaced with an 18-hole golf course." },
    ],
    sample_answer: `The two maps illustrate the urban redevelopment of the coastal town of Seaville between 1995 and the present day.

Overall, Seaville has undergone a dramatic transformation over the period, evolving from a traditional fishing and farming community into a modern tourist-oriented resort. This shift has involved the removal of agricultural land, woodland, and fishing infrastructure in favour of leisure facilities and holiday accommodation.

Along the southern coastline, the traditional fishing port that existed in 1995 has been dismantled and replaced with a modern yacht marina. Immediately north of the beach, the old fish market on the western side of the main road has been demolished to make way for a row of waterfront seafood restaurants, while the small row of local shops adjacent to it has been converted into holiday apartments. The hotel and café in the south-east corner have remained in their original locations, although the hotel has been expanded with a new car park.

Significant changes have also occurred inland. In the north-west, the residential housing estate has doubled in size. Meanwhile, the large expanse of farmland and the forest park in the north-east have been completely cleared to construct an 18-hole golf course and public tennis courts.`,
    chart_data: {
      type: "map" as const,
      title: "Urban Redevelopment of Seaville (1995 vs. Present Day)",
      description: "Comparison of Seaville's layout in 1995 and today: the southern fishing port and fish market were replaced by a yacht marina and restaurants, while north-eastern farmland and woodland were cleared for a golf course and tennis courts.",
      labels: [
        "South Coast: 1995 Fishing Port → Present Yacht Marina",
        "South-West Road: 1995 Fish Market & Shops → Seafood Restaurants & Holiday Apartments",
        "North-West Zone: Residential Housing expanded from 6 to 14 blocks",
        "North-East Zone: 1995 Farmland & Forest Park → 18-Hole Golf Course & Tennis Courts",
        "South-East Corner: Hotel & Seaside Café retained (new car park added to Hotel)",
      ],
    },
  },
  {
    task_type: "task1",
    sub_type: "multiple",
    question: "The bar chart below shows the percentage of employees working remotely in four industries in 2019 and 2024, and the table shows the main benefits reported by remote workers in 2024.",
    instructions: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
    min_words: 150,
    structure_tips: {
      introduction: "Paraphrase cả 2 biểu đồ: biểu đồ cột thể hiện tỷ lệ nhân sự làm việc từ xa ở 4 ngành năm 2019 và 2024; bảng số liệu thống kê các lợi ích chính mà người làm từ xa ghi nhận năm 2024.",
      overview: "Overview (kết hợp cả 2 biểu đồ): Tỷ lệ làm việc từ xa tăng mạnh ở cả 4 ngành (cao nhất ở IT & Software); đồng thời, việc tiết kiệm thời gian đi lại và cân bằng công việc - cuộc sống là 2 lợi ích được đánh giá cao nhất.",
      body_paragraph_1: "Body 1 (Phân tích Bar Chart): IT & Software tăng từ 34% lên 76%; Finance tăng gấp hơn 3 lần từ 18% lên 58%; Education và Manufacturing tăng nhẹ hơn do đặc thù công việc trực tiếp.",
      body_paragraph_2: "Body 2 (Phân tích Table): 84% người lao động đánh giá cao việc không mất thời gian đi lại (No daily commute), 78% chọn linh hoạt giờ giấc, tiếp theo là tiết kiệm chi phí (65%) và giảm căng thẳng (52%).",
    },
    vocabulary_hints: [
      { word: "surge dramatically", meaning: "tăng vọt mạnh mẽ", usage: "Remote working surged dramatically across all four sectors between 2019 and 2024." },
      { word: "cite as the primary benefit", meaning: "nêu là lợi ích hàng đầu", usage: "Eliminating the daily commute was cited as the primary benefit by 84% of respondents." },
      { word: "lag behind", meaning: "đứng sau / thấp hơn", usage: "Manufacturing lagged behind the other sectors due to the need for on-site machinery." },
    ],
    sample_answer: `The bar chart compares the proportion of staff working remotely across four sectors in 2019 and 2024, while the accompanying table lists the principal advantages identified by remote employees in 2024.

Overall, remote work adoption rose substantially in all four industries over the five-year period, with the IT sector recording the highest proportion in both years. Furthermore, the elimination of daily commuting and greater schedule flexibility were perceived as the most significant benefits of working from home.

Looking at the bar chart, IT and Software led remote adoption in 2019 at 34%, and this figure more than doubled to 76% by 2024. Finance and Banking experienced an even steeper relative increase, surging more than threefold from 18% to 58%. By contrast, Education and Manufacturing saw lower rates of remote work; Education rose from 9% to 28%, whereas Manufacturing remained the lowest, climbing from just 4% in 2019 to 12% in 2024.

According to the table, the vast majority of remote workers in 2024 (84%) cited the absence of a daily commute as a major advantage, closely followed by flexible working hours at 78%. Cost savings on transport and meals were reported by 65% of workers, while just over half (52%) highlighted reduced workplace stress.`,
    chart_data: {
      type: "multiple" as const,
      title: "Remote Work Adoption (2019 vs 2024) & Reported Benefits",
      description: "Combined analysis of remote work trends across four major industries and survey results on employee satisfaction factors.",
      charts: [
        {
          type: "bar" as const,
          title: "Share of Employees Working Remotely by Industry (%)",
          labels: ["IT & Software", "Finance", "Education", "Manufacturing"],
          datasets: [
            { label: "2019", data: [34, 18, 9, 4] },
            { label: "2024", data: [76, 58, 28, 12] },
          ],
        },
        {
          type: "table" as const,
          title: "Main Benefits Reported by Remote Workers in 2024 (%)",
          labels: ["No daily commute", "Flexible working hours", "Lower transport & meal costs", "Reduced workplace stress"],
          datasets: [{ label: "Percentage of Respondents (%)", data: [84, 78, 65, 52] }],
        },
      ],
    },
  },
];

const WRITING_TASK2_LIST = [
  {
    task_type: "task2",
    sub_type: "discussion",
    essay_type: "Discussion + Opinion",
    question: "Some people believe that university students should be required to attend classes in person, while others think that online learning should be an optional alternative for all courses. Discuss both views and give your own opinion.",
    instructions: "Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
    min_words: 250,
    structure_tips: {
      introduction: "Paraphrase 2 luồng quan điểm (bắt buộc học trực tiếp vs. cho phép học trực tuyến tùy chọn) và nêu rõ Thesis Statement (ví dụ: ủng hộ mô hình kết hợp tùy theo đặc thù môn học).",
      body_1: "Thân bài 1 (Lợi ích của học trực tiếp): Tương tác học thuật tức thì, thảo luận nhóm sâu sắc, rèn kỹ năng giao tiếp và bắt buộc đối với các môn thí nghiệm/thực hành.",
      body_2: "Thân bài 2 (Lợi ích của học trực tuyến tùy chọn + Quan điểm cá nhân): Tăng khả năng tiếp cận cho sinh viên đi làm thêm hoặc ở xa, tiết kiệm chi phí đi lại, xem lại bài giảng linh hoạt.",
      conclusion: "Kết bài: Tóm tắt lại 2 góc nhìn và khẳng định lại giải pháp cân bằng (lí thuyết có thể linh hoạt online, thực hành & thảo luận bắt buộc trực tiếp).",
    },
    vocabulary_hints: [
      { word: "face-to-face interaction", meaning: "tương tác trực tiếp", usage: "Face-to-face interaction fosters deeper academic debate among peers." },
      { word: "self-directed learning", meaning: "tự học có định hướng", usage: "Online modules encourage self-directed learning and schedule flexibility." },
      { word: "blended curriculum", meaning: "chương trình học kết hợp", usage: "A blended curriculum combines the strengths of physical and virtual classrooms." },
    ],
    sample_answer: `In recent years, the rapid expansion of digital education platforms has sparked debate over whether university attendance should remain mandatory or become optional through online alternatives. While compulsory in-person classes foster indispensable social and practical skills, I believe universities should adopt a flexible hybrid policy that allows online attendance for theoretical lectures.

On the one hand, proponents of mandatory physical attendance argue that university education extends far beyond the passive transmission of information. In a lecture hall or seminar room, students engage in spontaneous debates, interpret non-verbal cues, and build professional networks with peers and faculty. Furthermore, disciplines such as medicine, chemistry, and engineering rely heavily on laboratory equipment and supervised clinical practice that cannot be replicated virtually. Without compulsory attendance, younger undergraduates may also struggle with procrastination and social isolation.

On the other hand, offering online learning as an option addresses the diverse realities of modern students. Rising tuition fees and living costs force many undergraduates to work part-time or commute long distances. Recorded or live-streamed lectures enable these individuals to balance employment and family responsibilities without sacrificing their academic progress. Moreover, digital lectures allow students to pause and review complex concepts at their own pace, which can actually enhance comprehension in large foundational courses.

In conclusion, although physical presence is vital for hands-on training and collaborative seminars, requiring attendance for every single lecture is unnecessarily rigid. Universities should therefore permit optional online participation for standard lectures while maintaining compulsory in-person sessions for laboratories and small-group tutorials.`,
  },
  {
    task_type: "task2",
    sub_type: "opinion",
    essay_type: "Opinion (Agree / Disagree)",
    question: "Governments should spend more money on railways rather than roads. To what extent do you agree or disagree with this statement?",
    instructions: "Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
    min_words: 250,
    structure_tips: {
      introduction: "Paraphrase đề bài về phân bổ ngân sách giao thông (đường sắt vs. đường bộ) và nêu rõ mức độ đồng tình (ví dụ: đồng tình phần lớn ở các đô thị lớn nhưng vẫn cần duy trì đường bộ).",
      body_1: "Thân bài 1 (Lý do ưu tiên đường sắt): Sức chở lớn giúp giảm ùn tắc triệt để, giảm phát thải khí nhà kính và độ an toàn cao.",
      body_2: "Thân bài 2 (Vai trò không thể thay thế của đường bộ): Đường bộ vẫn thiết yếu cho vùng nông thôn, vận chuyển hàng hóa chặng cuối (last-mile delivery) và xe cấp cứu.",
      conclusion: "Kết bài: Khẳng định chính phủ nên ưu tiên tăng tỷ trọng đầu tư cho đường sắt đồng thời bảo trì mạng lưới đường bộ hiện có.",
    },
    vocabulary_hints: [
      { word: "mass transit infrastructure", meaning: "hạ tầng giao thông công cộng sức chở lớn", usage: "Investing in mass transit infrastructure is the most effective way to curb urban congestion." },
      { word: "carbon footprint", meaning: "lượng khí thải carbon", usage: "Electric rail networks have a significantly lower carbon footprint per passenger than private cars." },
      { word: "last-mile connectivity", meaning: "kết nối chặng cuối", usage: "Well-maintained roads remain indispensable for last-mile connectivity in rural regions." },
    ],
    sample_answer: `As urban populations swell and environmental concerns intensify, how governments allocate transport budgets between railways and roads has become a pressing policy question. I largely agree that a greater share of public funding should be directed towards rail networks, although investment in road maintenance cannot be neglected entirely.

There are compelling environmental and economic reasons to prioritise rail infrastructure. Firstly, modern urban metro systems and high-speed intercity trains can transport thousands of passengers simultaneously, alleviating the chronic traffic congestion that paralyses major metropolitan areas. Expanding highways, by contrast, often induces further car ownership and only provides temporary relief. Secondly, electrified rail networks produce far fewer greenhouse gas emissions per passenger kilometre than petrol or diesel vehicles, making rail investment essential for meeting national climate targets.

Nevertheless, it would be impractical to divert funds away from roads altogether. Unlike railways, which operate along fixed corridors between populous hubs, road networks provide door-to-door accessibility. Remote rural communities, agricultural producers, and last-mile logistics depend almost exclusively on highways and local roads. Even in cities with extensive subway systems, buses, ambulances, and freight lorries require safe, well-surfaced roads to function effectively.

In conclusion, while roads remain vital for regional connectivity and essential services, I believe governments should prioritise railway expansion in their capital budgets, as rail transport offers a far more sustainable and scalable solution to modern mobility challenges.`,
  },
  {
    task_type: "task2",
    sub_type: "advantages",
    essay_type: "Advantages vs. Disadvantages",
    question: "In many countries, an increasing number of people are choosing to live alone in single-person households rather than with family or flatmates. Do the advantages of this trend outweigh the disadvantages?",
    instructions: "Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
    min_words: 250,
    structure_tips: {
      introduction: "Paraphrase xu hướng sống độc thân/hộ gia đình 1 người tại các đô thị và nêu rõ quan điểm: dù mang lại sự tự chủ cá nhân, những bất lợi về tài chính, tâm lý và môi trường vẫn lớn hơn.",
      body_1: "Thân bài 1 (Lợi ích của việc sống một mình): Quyền tự quyết tuyệt đối về không gian, lịch trình sinh hoạt, rèn tính tự lập và không gian yên tĩnh để phát triển sự nghiệp.",
      body_2: "Thân bài 2 (Tại sao bất lợi vượt trội hơn): Gánh nặng chi phí thuê nhà & hóa đơn không được chia sẻ, nguy cơ cô lập xã hội/cô đơn kéo dài, và gia tăng áp lực lên quỹ nhà ở đô thị cũng như tiêu thụ năng lượng bình quân đầu người.",
      conclusion: "Kết bài: Khẳng định lại mặc dù sống một mình đem lại sự tự do, các hệ lụy kinh tế và xã hội của xu hướng này vẫn nặng nề hơn.",
    },
    vocabulary_hints: [
      { word: "personal autonomy", meaning: "quyền tự chủ cá nhân", usage: "Living alone grants young professionals unprecedented personal autonomy." },
      { word: "financial burden", meaning: "gánh nặng tài chính", usage: "Bearing the full cost of rent and utilities creates a heavy financial burden." },
      { word: "social isolation", meaning: "sự cô lập xã hội", usage: "Prolonged solitary living can heighten the risk of social isolation and anxiety." },
    ],
    sample_answer: `Across the developed and developing world alike, demographic shifts and rising incomes have led to a surge in single-person households. While living alone undeniably offers greater personal freedom, I believe the economic, psychological, and environmental drawbacks of this trend outweigh its benefits.

Admittedly, residing by oneself provides several attractive advantages. Foremost among these is complete personal autonomy. Individuals who live alone can organise their daily routines, diet, and domestic environment without having to compromise with family members or flatmates. For ambitious professionals and creative workers, a quiet, distraction-free home can also boost productivity and serve as a sanctuary from workplace stress. Additionally, managing a household independently cultivates self-reliance and financial discipline.

Despite these merits, the disadvantages for both individuals and wider society are far more pronounced. From an economic perspective, solo dwellers must shoulder the entire cost of rent, utilities, and household appliances without the economies of scale enjoyed by multi-person households, leaving them with less disposable income and savings. Psychologically, humans are inherently social creatures; extensive public health research links prolonged solitary living to higher rates of loneliness, depression, and delayed medical assistance during emergencies. Finally, at a societal level, the proliferation of one-person flats exacerbates urban housing shortages and increases per-capita energy and water consumption.

In conclusion, although living alone affords enviable independence and privacy, its financial strain, mental health risks, and environmental inefficiency make it a largely unfavourable demographic trend.`,
  },
  {
    task_type: "task2",
    sub_type: "problem_solution",
    essay_type: "Causes & Solutions",
    question: "Studies show that young people today spend significantly less time reading books for pleasure than previous generations, and their attention spans are becoming shorter. What are the main causes of this problem, and what measures can be taken to address it?",
    instructions: "Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
    min_words: 250,
    structure_tips: {
      introduction: "Paraphrase hiện tượng giới trẻ ít đọc sách và giảm khả năng tập trung sâu; nêu khái quát nguyên nhân (thuật toán video ngắn & áp lực học tập) và giải pháp từ gia đình và nhà trường.",
      body_1: "Thân bài 1 (Nguyên nhân): Sự thống trị của các nền tảng video ngắn (TikTok, Reels, Shorts) kích thích dopamine tức thời khiến não bộ ngại đọc văn bản dài; cộng thêm lịch học thêm dày đặc.",
      body_2: "Thân bài 2 (Giải pháp): Trường học thiết lập giờ đọc sách không thiết bị điện tử (screen-free reading hours) với sách tự chọn; phụ huynh làm gương và giới hạn thời gian dùng mạng xã hội trước khi ngủ.",
      conclusion: "Kết bài: Tóm tắt lại nguyên nhân công nghệ và khẳng định sự phối hợp giữa gia đình - nhà trường sẽ khôi phục thói quen đọc sâu.",
    },
    vocabulary_hints: [
      { word: "instant gratification", meaning: "sự thỏa mãn tức thì", usage: "Short-form video algorithms condition the brain to expect instant gratification." },
      { word: "sustained concentration", meaning: "sự tập trung duy trì lâu dài", usage: "Reading a novel requires sustained concentration that many teenagers now struggle to maintain." },
      { word: "screen-free zones", meaning: "không gian không màn hình điện tử", usage: "Parents should establish screen-free zones and bedtime reading routines at home." },
    ],
    sample_answer: `In the digital era, educators and psychologists have raised alarm over the sharp decline in recreational book reading among youth, accompanied by a noticeable erosion of sustained attention spans. This essay will examine the technological and educational roots of this phenomenon and propose practical remedies for parents and schools.

The primary driver of declining reading habits is the pervasive influence of algorithm-driven social media and short-form video platforms. Applications such as TikTok and Instagram Reels deliver rapid bursts of visual stimulation and instant dopamine rewards every few seconds. When young brains become accustomed to this effortless gratification, engaging with a printed book — which demands patience, imagination, and sustained concentration — feels slow and unrewarding by comparison. A secondary cause is the intense academic pressure in many school systems, where students associate reading solely with textbook memorisation and standardized tests rather than enjoyment.

Addressing this issue requires coordinated action from both families and educational institutions. At home, parents should model positive reading behaviour and enforce "screen-free" hours, particularly before bedtime, replacing smartphone scrolling with twenty minutes of quiet reading. Schools, meanwhile, ought to reform their literacy programmes by introducing dedicated recreational reading periods where students can choose books aligned with their personal interests — whether science fiction, biographies, or graphic novels — without the pressure of graded book reports. Local libraries can also organise interactive book clubs to make reading a social activity for teenagers.

In conclusion, while the rise of hyper-stimulating digital media has undermined young people's capacity for deep reading, deliberate boundaries on screen time and more engaging school reading initiatives can effectively rebuild their focus and love of literature.`,
  },
  {
    task_type: "task2",
    sub_type: "two_part",
    essay_type: "Two-Part Direct Question",
    question: "More and more qualified professionals are choosing to work as independent freelancers or contractors rather than taking permanent full-time jobs with a single company. Why is this happening? Is this a positive or negative development for workers?",
    instructions: "Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.",
    min_words: 250,
    structure_tips: {
      introduction: "Paraphrase xu hướng lao động chất lượng cao chuyển sang làm freelancer thay vì nhân viên biên chế cố định; trả lời ngắn gọn cả 2 câu hỏi (do công nghệ số & nhu cầu tự chủ; đây là xu hướng tích cực nếu biết quản trị rủi ro).",
      body_1: "Thân bài 1 (Trả lời câu hỏi 1 — Tại sao điều này xảy ra?): Nền tảng làm việc đám mây cho phép cộng tác toàn cầu; người lao động muốn thoát khỏi văn hóa làm việc cứng nhắc và đa dạng hóa nguồn thu nhập.",
      body_2: "Thân bài 2 (Trả lời câu hỏi 2 — Tích cực hay tiêu cực?): Mang lại quyền kiểm soát sự nghiệp và thu nhập cao hơn cho người có chuyên môn giỏi, dù cần lưu ý rủi ro thiếu phúc lợi bảo hiểm/lương hưu cố định.",
      conclusion: "Kết bài: Khẳng định lại sự phát triển của công nghệ và khát vọng tự do là động lực chính, và đây nhìn chung là bước tiến tích cực cho lực lượng lao động tri thức.",
    },
    vocabulary_hints: [
      { word: "career autonomy", meaning: "tự chủ trong sự nghiệp", usage: "Skilled specialists increasingly prioritise career autonomy over traditional job security." },
      { word: "cloud-based collaboration", meaning: "cộng tác trên nền tảng đám mây", usage: "Cloud-based collaboration tools allow freelancers to serve clients across continents." },
      { word: "income volatility", meaning: "sự biến động thu nhập", usage: "Independent contractors must manage income volatility and fund their own pensions." },
    ],
    sample_answer: `Traditional lifetime employment with a single corporation is increasingly giving way to independent contracting and freelancing among skilled professionals. This shift is driven by technological connectivity and changing attitudes towards work-life balance, and I consider it a predominantly positive development for capable workers.

Two main factors explain why professionals are leaving conventional payroll roles. Firstly, advances in cloud computing and digital communication platforms have removed geographical barriers, enabling software engineers, designers, consultants, and translators to market their expertise to clients worldwide from home. Secondly, younger generations value autonomy and variety far more than their parents did. After witnessing corporate layoffs during economic downturns, many professionals realise that relying on a single employer offers an illusion of security, whereas maintaining a portfolio of clients provides both creative fulfilment and resilience.

For qualified individuals, this transition brings substantial benefits that outweigh its risks. Admittedly, freelancers forfeit employer-sponsored perks such as paid sick leave, holiday pay, and automatic pension contributions, and they must contend with occasional income volatility. However, independent specialists can command higher hourly rates, select projects that match their skills, and design their schedules around family or personal pursuits. Free from office politics and rigid hierarchies, freelancers often experience higher job satisfaction and faster professional growth.

In conclusion, the rise of independent knowledge work stems from digital globalisation and a desire for self-determination. Provided that freelancers plan prudently for healthcare and retirement, this trend represents an empowering evolution in modern employment.`,
  },
];

let writing1Cursor = 0;
let writing2Cursor = 0;
export function getFallbackWritingTask(type: "task1" | "task2", targetScore = 6.5, subType?: string) {
  if (type === "task1") {
    let pool = WRITING_TASK1_LIST;
    if (subType && subType !== "all") {
      const filtered = WRITING_TASK1_LIST.filter((t) => t.sub_type === subType || t.chart_data.type === subType);
      if (filtered.length > 0) pool = filtered;
    }
    const item = pool[writing1Cursor % pool.length];
    writing1Cursor++;
    return { ...item, difficulty_estimate_band: targetScore };
  }
  let pool = WRITING_TASK2_LIST;
  if (subType && subType !== "all") {
    const filtered = WRITING_TASK2_LIST.filter((t) => t.sub_type === subType);
    if (filtered.length > 0) pool = filtered;
  }
  const item = pool[writing2Cursor % pool.length];
  writing2Cursor++;
  return { ...item, difficulty_estimate_band: targetScore };
}

// ============================================================================
// 4. SPEAKING TASKS (12 Chủ đề đa dạng Part 1, 2, 3 + Bài mẫu Band 8.0)
// ============================================================================

const SPEAKING_PART1_LIST = [
  {
    part: 1,
    topic: "Work, Study & Daily Routine",
    questions: [
      "Do you work or are you a student at the moment?",
      "What part of your study or work do you find most interesting?",
      "What is your favourite part of the day, and why?",
      "Do you prefer to study or work in the morning or in the evening?",
    ],
    sample_answers: [
      "I'm currently a final-year undergraduate majoring in computer science. My coursework mainly revolves around software engineering and data analysis.",
      "What fascinates me most is solving real-world problems through code — seeing an application I built actually help users is incredibly rewarding.",
      "I'm definitely a morning person. Between 6 and 9 a.m., the house is quiet and my mind feels sharpest, so I can get a lot done without distractions.",
      "I much prefer the morning for demanding analytical tasks, whereas I save lighter administrative work or reading for the evening.",
    ],
    examiner_notes: "Part 1 (4–5 phút): Trả lời trực tiếp trong 2–3 câu cho mỗi câu hỏi. Tránh trả lời quá ngắn (1 câu) hoặc học thuộc lòng máy móc.",
  },
  {
    part: 1,
    topic: "Hometown & Accommodation",
    questions: [
      "Where is your hometown located, and what is it known for?",
      "Has your hometown changed much over the past ten years?",
      "What kind of accommodation do you live in at present?",
      "What would you like to improve about the area where you live?",
    ],
    sample_answers: [
      "I come from Da Nang, a vibrant coastal city in central Vietnam. It's widely known for its sandy beaches, iconic bridges, and relaxed pace of life.",
      "Tremendously. Over the last decade, new tech parks, high-rise apartments, and wider coastal boulevards have transformed it into a modern urban hub.",
      "At the moment, I live with my family in a three-storey terraced house in a quiet residential neighbourhood about fifteen minutes from the city centre.",
      "If I could change one thing, I'd add more shaded public parks and dedicated cycling lanes so residents could exercise outdoors more safely.",
    ],
    examiner_notes: "Part 1: Kết hợp các thì hiện tại đơn, hiện tại hoàn thành ('Over the last decade, it has transformed...') và câu điều kiện để nâng điểm GRA.",
  },
  {
    part: 1,
    topic: "Technology, Apps & Social Media",
    questions: [
      "What is the most useful mobile app you use every day?",
      "Do you think people spend too much time looking at screens nowadays?",
      "How has technology changed the way you keep in touch with friends?",
      "Is there a piece of technology you would like to learn how to use better?",
    ],
    sample_answers: [
      "Without a doubt, it's Notion. I use it every single morning to organise my university lectures, track project deadlines, and jot down vocabulary.",
      "Yes, to a large extent. Whether on the bus or in cafés, many people are glued to short-form videos, which often comes at the expense of genuine face-to-face conversation.",
      "Messaging apps and video calls have made staying in touch effortless, especially with friends studying abroad, though I still value meeting up in person over coffee.",
      "I'm really keen to master data visualisation tools and AI prompt engineering, as both are becoming indispensable in my field.",
    ],
    examiner_notes: "Part 1: Sử dụng các cụm Idiomatic tự nhiên như 'Without a doubt', 'glued to screens', 'comes at the expense of' để đạt điểm Lexical Resource 7.5+.",
  },
  {
    part: 1,
    topic: "Reading, Music & Leisure Time",
    questions: [
      "Do you prefer reading printed books or e-books on a screen?",
      "What kind of music do you usually listen to when you want to relax?",
      "How do you usually spend your weekends?",
      "Have your leisure activities changed since you were a child?",
    ],
    sample_answers: [
      "I still gravitate towards physical paperbacks whenever I read for pleasure. Holding a real book and turning the pages helps me disconnect from digital screens.",
      "When I need to unwind or focus on studying, I usually put on instrumental lo-fi beats or classical piano, because music with lyrics tends to distract me.",
      "On Saturdays I normally catch up on coursework and go for a late-afternoon run, while Sundays are reserved for family meals and preparing for the week ahead.",
      "Quite a lot. As a child I spent hours playing outdoor team sports, whereas nowadays my hobbies are more low-key, such as photography, cooking, and reading.",
    ],
    examiner_notes: "Part 1: Khi câu hỏi có 'Do you prefer A or B?' hoặc 'Have your... changed?', hãy dùng cấu trúc đối lập (whereas, while, used to).",
  },
];

const SPEAKING_PART2_LIST = [
  {
    part: 2,
    topic: "A useful skill you learned outside school",
    task: "Describe a practical skill that you learned outside of school or university.",
    bullets: [
      "what the skill is and when you learned it",
      "how you learned it and who helped you",
      "why you decided to learn this skill",
      "and explain how this skill has helped you in your daily life",
    ],
    preparation_time: "1 minute",
    speaking_time: "1–2 minutes",
    sample_answers: [
      "I'd like to talk about cooking traditional Vietnamese meals, a skill I picked up during my first year living away from home. Initially, I relied on takeaway food, which quickly became both expensive and unhealthy. Determined to change, I started calling my mother on video chat every weekend while watching culinary channels online. Within a few months, I mastered essential techniques like balancing flavours, stir-frying, and meal-prepping for the week. Today, cooking not only saves me a considerable amount of money and keeps my diet nutritious, but it also serves as a wonderful way to unwind after a stressful day of studying.",
    ],
    examiner_notes: "Part 2 (Long Turn): Tận dụng 1 phút chuẩn bị để ghi nhanh từ khóa cho 4 gợi ý trên Cue Card. Nói liên tục từ 1 phút 30 giây đến 2 phút.",
  },
  {
    part: 2,
    topic: "A book or article that influenced your thinking",
    task: "Describe a book or an article you read that changed your perspective on a topic.",
    bullets: [
      "what the book or article was about",
      "why you decided to read it",
      "what new ideas or insights you gained from it",
      "and explain how it influenced your behaviour or way of thinking",
    ],
    preparation_time: "1 minute",
    speaking_time: "1–2 minutes",
    sample_answers: [
      "One book that profoundly reshaped my mindset is 'Thinking, Fast and Slow' by Nobel laureate Daniel Kahneman. A university lecturer recommended it to me when I was struggling with making objective decisions under pressure. The book explains how human thought is governed by two systems: System 1, which is fast, intuitive, and prone to cognitive biases, and System 2, which is slower, deliberate, and analytical. Reading it made me realise how often I jumped to conclusions based on first impressions. Since then, whenever I face an important academic or financial choice, I consciously slow down and write out the evidence before deciding.",
    ],
    examiner_notes: "Part 2: Sử dụng các cụm từ chuyển ý mạch lạc (Initially, What struck me most was..., Since then...) để giữ sự trôi chảy.",
  },
  {
    part: 2,
    topic: "A memorable building or architectural landmark",
    task: "Describe an impressive building or historical monument you have visited.",
    bullets: [
      "where this building is located and when you visited it",
      "what its architectural style and appearance look like",
      "what the building is used for today",
      "and explain why it left such a strong impression on you",
    ],
    preparation_time: "1 minute",
    speaking_time: "1–2 minutes",
    sample_answers: [
      "I'd love to describe the Hanoi Opera House, a breathtaking architectural landmark that I visited last autumn during a cultural trip to the capital. Modelled after the Palais Garnier in Paris and completed in 1911, the building exemplifies French neoclassical architecture, featuring ivory-washed columns, ornate iron balconies, and a steeply pitched slate roof. Inside, the main auditorium is adorned with crystal chandeliers and crimson velvet seating, hosting everything from symphony concerts to traditional Vietnamese folk operas. What left a lasting impression on me was how harmoniously this century-old European structure blends into the bustling tree-lined avenues of modern Hanoi, standing as a living bridge between history and contemporary art.",
    ],
    examiner_notes: "Part 2: Với chủ đề địa điểm/kiến trúc, hãy sử dụng các tính từ miêu tả thị giác mạnh (breathtaking, neoclassical, ivory-washed, ornate).",
  },
  {
    part: 2,
    topic: "A difficult problem you solved as part of a team",
    task: "Describe a time when you worked with a group of people to solve a challenging problem.",
    bullets: [
      "what the project or problem was",
      "who was in your team and what role you played",
      "what obstacles you encountered along the way",
      "and explain how you felt when the problem was finally resolved",
    ],
    preparation_time: "1 minute",
    speaking_time: "1–2 minutes",
    sample_answers: [
      "A memorable example of teamwork occurred last semester during a 48-hour university hackathon. Four of us teamed up to build a mobile app that helps visually impaired commuters navigate city bus routes using voice guidance. I was responsible for the backend API and real-time GPS integration. Just six hours before the final presentation, our map server crashed repeatedly due to rate-limiting errors. Instead of panicking, we divided the debugging tasks: while two teammates optimised the voice interface, my partner and I implemented a local caching layer that cut API requests by eighty percent. When our live demo worked flawlessly in front of the judges and won second prize, I felt an overwhelming sense of pride in our collective resilience.",
    ],
    examiner_notes: "Part 2: Kể chuyện theo trình tự Situation -> Complication (sự cố bất ngờ) -> Resolution (cách giải quyết) -> Reflection (bài học/cảm xúc).",
  },
];

const SPEAKING_PART3_LIST = [
  {
    part: 3,
    topic: "Practical Skills, Education & Technology",
    questions: [
      "Which practical life skills do you think schools should teach children besides academic subjects?",
      "Why do some adults find it harder to acquire new skills than young children?",
      "How has digital technology changed the way people learn practical skills today?",
      "In the future, do you think interpersonal skills or technical skills will be more valued in the workplace?",
    ],
    sample_answers: [
      "Beyond core academic subjects, schools ought to teach financial literacy, basic first aid, and critical media literacy. Many young adults graduate knowing advanced calculus yet struggle to manage a monthly budget or evaluate online misinformation.",
      "I think the main barrier for adults is psychological rather than cognitive. Adults often have entrenched habits, tighter schedules, and a greater fear of making mistakes in front of others, whereas children approach learning with natural curiosity and less self-consciousness.",
      "Digital platforms have democratised skill acquisition. Anyone with an internet connection can now access step-by-step video tutorials, interactive coding sandboxes, or AI tutors on demand, although learners still need strong self-discipline to move beyond passive watching.",
      "As artificial intelligence automates routine technical tasks, interpersonal skills such as empathy, negotiation, and cross-cultural leadership will likely command a higher premium, though a solid foundation in technical literacy will remain essential.",
    ],
    examiner_notes: "Part 3 (4–5 phút): Trả lời ở tầm khái quát xã hội (không chỉ nói về bản thân), đưa ra nguyên nhân - hệ quả và ví dụ minh họa.",
  },
  {
    part: 3,
    topic: "Urban Architecture, Heritage & Modern Cities",
    questions: [
      "Should governments preserve old historical buildings or replace them with modern high-rise developments?",
      "How does the design of public spaces, such as parks and squares, affect residents' mental well-being?",
      "Why do many modern cities around the world look increasingly similar to one another?",
      "How might climate change influence the way homes and offices are designed in the next fifty years?",
    ],
    sample_answers: [
      "I believe urban planners should strike a balance through adaptive reuse. Historic landmarks anchor a city's cultural identity and attract tourism, so demolishing them is short-sighted; however, dilapidated non-heritage structures can be redeveloped into energy-efficient housing.",
      "Well-designed green spaces act as the lungs and social glue of a metropolis. Access to shaded parks, pedestrian plazas, and waterfront walkways reduces urban cortisol levels, encourages physical exercise, and fosters spontaneous community interaction.",
      "Globalisation and cost efficiency are the primary culprits. Steel-and-glass skyscrapers are cheaper to engineer using standardised blueprints than vernacular architecture, leading to a homogenised skyline from London to Shanghai.",
      "Future buildings will need to prioritise passive cooling, flood resilience, and net-zero energy. We will likely see widespread vertical forests, solar-generating glass facades, and elevated ground floors in coastal cities.",
    ],
    examiner_notes: "Part 3: Sử dụng từ vựng học thuật về đô thị (adaptive reuse, cultural identity, homogenised skyline, passive cooling).",
  },
  {
    part: 3,
    topic: "Decision-Making, Media & Consumer Behaviour",
    questions: [
      "Why do people sometimes make poor decisions even when they have access to plenty of information?",
      "How does advertising influence the choices consumers make in their everyday lives?",
      "Should parents allow young children to make their own decisions, or guide them strictly?",
      "Do you think artificial intelligence will eventually make important life or policy decisions better than humans?",
    ],
    sample_answers: [
      "Paradoxically, information overload often paralyses rational judgement. When confronted with dozens of conflicting reviews or options, people experience decision fatigue and fall back on emotional biases or impulse.",
      "Modern advertising rarely sells just a product; it sells an aspirational lifestyle. By leveraging social proof, scarcity cues, and targeted algorithms, brands subtly manufacture desires consumers didn't know they had.",
      "A gradual transfer of autonomy works best. Letting children choose their hobbies or clothes builds confidence and accountability, whereas high-stakes matters concerning health, safety, and education still require parental guardrails.",
      "AI excels at processing vast datasets to optimise logistics or medical diagnostics, but public policy and life choices involve ethical trade-offs and human empathy that algorithms cannot genuinely comprehend.",
    ],
    examiner_notes: "Part 3: Cấu trúc trả lời điểm cao: Point (Luận điểm trực tiếp) -> Explanation (Giải thích cơ chế) -> Example/Contrast (Ví dụ hoặc góc nhìn đối lập).",
  },
  {
    part: 3,
    topic: "Teamwork, Leadership & Workplace Culture",
    questions: [
      "What qualities make someone an effective team leader in the modern workplace?",
      "Do people work more creatively alone or when brainstorming in a group?",
      "Why do conflicts sometimes arise within project teams, and how should they be handled?",
      "Has remote working made collaboration easier or more difficult for companies?",
    ],
    sample_answers: [
      "An effective modern leader needs emotional intelligence and clarity of vision rather than authoritarian control. Listening actively, delegating according to each member's strengths, and shielding the team from unnecessary bureaucracy are crucial.",
      "It depends on the stage of the creative process. Initial deep thinking often happens best in solitude without peer pressure, whereas refining and stress-testing those ideas benefits enormously from diverse group feedback.",
      "Team friction usually stems from ambiguous role boundaries or mismatched communication styles. Addressing disagreements early through transparent, objective dialogue prevents professional debate from turning into personal resentment.",
      "It's a double-edged sword: digital tools make asynchronous document sharing seamless across time zones, yet spontaneous whiteboard brainstorming and trust-building are noticeably harder through a webcam.",
    ],
    examiner_notes: "Part 3: Thể hiện tư duy phản biện đa chiều ('It depends on the stage...', 'It's a double-edged sword...') để ghi điểm Fluency & Coherence.",
  },
];

let sp1 = 0, sp2 = 0, sp3 = 0;
export function getFallbackSpeakingTask(part: number, targetScore = 6.5, requestedTopic?: string) {
  const matchTopic = <T extends { topic: string }>(list: T[], cursor: number) => {
    if (requestedTopic && requestedTopic !== "all") {
      const found = list.find((item) => item.topic.toLowerCase().includes(requestedTopic.toLowerCase()));
      if (found) return found;
    }
    return list[cursor % list.length];
  };

  if (part === 2) {
    const item = matchTopic(SPEAKING_PART2_LIST, sp2++);
    return { ...item, difficulty_estimate_band: targetScore };
  }
  if (part === 3) {
    const item = matchTopic(SPEAKING_PART3_LIST, sp3++);
    return { ...item, difficulty_estimate_band: targetScore };
  }
  const item = matchTopic(SPEAKING_PART1_LIST, sp1++);
  return { ...item, difficulty_estimate_band: targetScore };
}

// ============================================================================
// 5. HEURISTIC SCORING FALLBACK (Khi chưa cấu hình GEMINI_API_KEY)
// ============================================================================

export function scoreWritingFallback(essay: string, task_type: "task1" | "task2") {
  const words = essay.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const minWords = task_type === "task1" ? 150 : 250;
  const firstKey = task_type === "task1" ? "task_achievement" : "task_response";

  const sentences = essay.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const paragraphs = essay.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, "")).filter(Boolean));
  const lexicalDiversity = wordCount > 0 ? uniqueWords.size / wordCount : 0;
  const avgWordLen = wordCount > 0 ? words.reduce((s, w) => s + w.replace(/[^a-zA-Z]/g, "").length, 0) / wordCount : 0;
  const connectors = (essay.match(/\b(however|moreover|furthermore|therefore|consequently|nevertheless|overall|in addition|on the other hand|while|whereas|although|in conclusion|for instance|for example)\b/gi) || []).length;

  const lengthRatio = Math.min(1.15, wordCount / minWords);
  const firstScore = roundBand(Math.min(8.5, Math.max(4.0, 5.0 * lengthRatio + (paragraphs.length >= 3 ? 1.5 : 0.5))));
  const ccScore = roundBand(Math.min(8.5, Math.max(4.0, 5.0 + (paragraphs.length >= 4 ? 1.0 : 0.3) + Math.min(1.5, connectors * 0.3))));
  const lrScore = roundBand(Math.min(8.5, Math.max(4.5, 4.5 + lexicalDiversity * 3 + (avgWordLen >= 5 ? 1.0 : 0.4))));
  const graScore = roundBand(Math.min(8.5, Math.max(4.5, 5.0 + (sentences.length >= 8 ? 1.0 : 0.3) + (/,|;|which|that|because|although/i.test(essay) ? 1.0 : 0.2))));

  const criteria_scores: Record<string, number> = {
    [firstKey]: firstScore,
    coherence_and_cohesion: ccScore,
    lexical_resource: lrScore,
    grammatical_range_and_accuracy: graScore,
  };
  const overall_band = roundBand((firstScore + ccScore + lrScore + graScore) / 4);

  // Build sentence-level revisions from the candidate's actual essay sentences
  const rawSentences = (essay.match(/[^.!?]+[.!?]*/g) || [])
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 5);

  const upgradeSentenceToC1 = (sent: string, idx: number) => {
    let improved = sent
      .replace(/\ba lot of\b/gi, "a substantial proportion of")
      .replace(/\bmany people\b/gi, "a growing number of individuals")
      .replace(/\bvery important\b/gi, "of paramount importance")
      .replace(/\bimportant\b/gi, "pivotal")
      .replace(/\bi think\b/gi, "From an objective standpoint, it is evident that")
      .replace(/\bin my opinion\b/gi, "It can be persuasively argued that")
      .replace(/\bincreased a lot\b/gi, "witnessed a pronounced surge")
      .replace(/\bdecreased a lot\b/gi, "experienced a marked decline")
      .replace(/\bgood\b/gi, "beneficial")
      .replace(/\bbad\b/gi, "detrimental")
      .replace(/\bbig\b/gi, "considerable")
      .replace(/\bhelp\b/gi, "facilitate");

    if (improved === sent) {
      const clean = sent.replace(/[.!?]+$/, "");
      const lowered = clean.charAt(0).toLowerCase() + clean.slice(1);
      if (idx === 0) {
        improved =
          task_type === "task1"
            ? `Overall, the provided data illustrates that ${lowered}, highlighting a significant structural shift over the surveyed period.`
            : `From a broader socio-economic perspective, ${lowered}, which warrants careful consideration from policymakers.`;
      } else if (idx === 1) {
        improved = `Furthermore, empirical evidence suggests that ${lowered}, thereby reinforcing the central argument.`;
      } else {
        improved = `Consequently, not only does this trend reshape contemporary practices, but ${lowered}.`;
      }
    }

    const criteriaCycle = [
      {
        criterion: "LR (Lexical Resource · C1/C2)",
        explanation:
          "Nâng cấp các từ vựng thông dụng sang cụm từ học thuật (Academic Collocations C1–C2) để tăng độ chính xác và trang trọng.",
      },
      {
        criterion: "GRA (Grammatical Range · Band 8.0+)",
        explanation:
          "Mở rộng cấu trúc câu bằng mệnh đề quan hệ / mệnh đề phân từ giúp tăng điểm Grammatical Range and Accuracy.",
      },
      {
        criterion: "CC (Coherence & Cohesion)",
        explanation:
          "Bổ sung từ nối học thuật (Academic Discourse Markers) để liên kết luận điểm chặt chẽ với câu trước đó.",
      },
    ];
    const meta = criteriaCycle[idx % criteriaCycle.length];
    return {
      original: sent,
      improved,
      criterion: meta.criterion,
      explanation: meta.explanation,
    };
  };

  const generatedRevisions = rawSentences.slice(0, 4).map((s, i) => upgradeSentenceToC1(s, i));

  const lexical_upgrades =
    task_type === "task1"
      ? [
          {
            original: "increased / went up",
            upgrade: "witnessed a pronounced surge",
            meaning: "Chứng kiến một mức tăng vọt rõ rệt (Band 8.0+ Task 1)",
          },
          {
            original: "stayed the same",
            upgrade: "plateaued / remained relatively static",
            meaning: "Chững lại và giữ ở mức ổn định",
          },
          {
            original: "changed a lot (Map/Process)",
            upgrade: "underwent extensive redevelopment",
            meaning: "Trải qua quá trình quy hoạch / cải tạo quy mô lớn",
          },
        ]
      : [
          {
            original: "very important / necessary",
            upgrade: "indispensable / of paramount importance",
            meaning: "Đóng vai trò thiết yếu, không thể tách rời (C1/C2)",
          },
          {
            original: "have both good and bad sides",
            upgrade: "act as a double-edged sword",
            meaning: "Đóng vai trò như con dao hai lưỡi (vừa có lợi vừa có hại)",
          },
          {
            original: "cause big problems",
            upgrade: "exacerbate socio-economic disparities",
            meaning: "Làm trầm trọng thêm sự bất bình đẳng kinh tế - xã hội",
          },
        ];

  return {
    overall_band,
    criteria_scores,
    criteria_feedback: {
      [firstKey]: wordCount < minWords
        ? `Bài viết hiện có ${wordCount}/${minWords} từ. Theo tiêu chí IELTS chính thức, bài viết thiếu độ dài sẽ bị trừ điểm ở tiêu chí này.`
        : `Độ dài bài viết đạt chuẩn (${wordCount} từ), chia thành ${paragraphs.length} đoạn văn rõ ràng.`,
      coherence_and_cohesion: connectors >= 3
        ? `Sử dụng hiệu quả các từ nối học thuật (${connectors} lần) giúp liên kết ý mạch lạc.`
        : "Cần bổ sung thêm các linking devices (Overall, However, Furthermore, Consequently...) và câu chủ đề rõ ràng ở đầu mỗi đoạn thân bài.",
      lexical_resource: `Tỷ lệ đa dạng từ vựng đạt ${(lexicalDiversity * 100).toFixed(0)}%. Hãy tránh lặp từ và ưu tiên dùng academic collocations.`,
      grammatical_range_and_accuracy: "Kết hợp câu đơn và câu phức. Lưu ý kiểm tra dấu câu, mạo từ (a/an/the) và sự hòa hợp chủ ngữ - động từ.",
    },
    strengths: [
      wordCount >= minWords ? `Đạt yêu cầu số từ tối thiểu của IELTS (${wordCount}/${minWords} từ).` : "Có định hướng trả lời câu hỏi đề bài.",
      paragraphs.length >= 3 ? `Cấu trúc chia đoạn rõ ràng (${paragraphs.length} đoạn).` : "Diễn đạt ý tưởng mạch lạc.",
    ],
    key_improvements: [
      wordCount < minWords
        ? `Đảm bảo viết tối thiểu ${minWords} từ (Task 1: 150+ từ, Task 2: 250+ từ).`
        : (task_type === "task1" ? "Đảm bảo đoạn Overview nêu bật 2 xu hướng tổng quát mà không đưa số liệu chi tiết." : "Mỗi đoạn thân bài cần 1 câu Topic Sentence rõ ràng kèm giải thích và ví dụ cụ thể."),
      "Kết hợp linh hoạt mệnh đề quan hệ, mệnh đề phân từ và cấu trúc so sánh học thuật.",
      "Xem phần So sánh & Nâng cấp câu trực quan (In-line Diff C1/C2) bên dưới để học cách Paraphrase đạt Band 8.0+.",
    ],
    revisions: generatedRevisions,
    lexical_upgrades,
    word_count: wordCount,
    min_words: minWords,
  };
}

export function scoreSpeakingFallback(transcript: string) {
  const words = transcript.replace(/Q\d+:.*\n/g, "").trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, "")).filter(Boolean));
  const connectors = (transcript.match(/\b(actually|personally|in my opinion|for example|moreover|however|because|as a result|to be honest)\b/gi) || []).length;

  const fc = roundBand(Math.min(8.0, Math.max(4.5, 4.5 + Math.min(2.5, wordCount / 50) + Math.min(1.0, connectors * 0.3))));
  const lr = roundBand(Math.min(8.0, Math.max(4.5, 4.5 + Math.min(2.5, uniqueWords.size / 35))));
  const gra = roundBand(Math.min(8.0, Math.max(4.5, 5.0 + (/because|which|although|if|when|since/i.test(transcript) ? 1.5 : 0.5))));
  const pr = roundBand((fc + lr + gra) / 3);
  const overallBand = roundBand((fc + lr + gra + pr) / 4);

  return {
    overallBand,
    criteria: {
      fluency_and_coherence: {
        score: fc,
        feedback: `Câu trả lời có tổng cộng ${wordCount} từ. Hãy duy trì mạch nói tự nhiên và dùng thêm các discourse markers (Well, Actually, From my perspective...).`,
      },
      lexical_resource: {
        score: lr,
        feedback: `Sử dụng ${uniqueWords.size} từ vựng khác nhau. Có thể nâng band bằng cách paraphrase từ khóa trong câu hỏi của giám khảo.`,
      },
      grammatical_range_and_accuracy: {
        score: gra,
        feedback: "Nên kết hợp linh hoạt các thì (hiện tại hoàn thành, quá khứ, điều kiện) và câu phức.",
      },
      pronunciation: {
        score: pr,
        feedback: "Chú ý trọng âm từ, ngữ điệu lên xuống tự nhiên và phát âm rõ âm cuối (ending sounds).",
      },
    },
    strengths: [
      "Trả lời trực tiếp và bám sát chủ đề câu hỏi.",
      wordCount >= 60 ? "Độ dài câu trả lời tốt, có mở rộng ý và giải thích." : "Diễn đạt ý chính rõ ràng.",
    ],
    improvements: [
      "Áp dụng cấu trúc A-R-E-A (Answer → Reason → Example → Alternative) để mở rộng câu trả lời tự nhiên.",
      "Mẹo: Điền GEMINI_API_KEY vào file .env.local để nhận phân tích chi tiết từng câu từ AI Gemini.",
    ],
    lexical_upgrades: [
      { original: "very important", upgrade: "plays a pivotal role" },
      { original: "I like it a lot", upgrade: "I am particularly fond of it" },
      { original: "help me relax", upgrade: "allow me to unwind and recharge" },
    ],
    transcript,
  };
}
