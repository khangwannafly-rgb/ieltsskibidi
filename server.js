import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { GoogleGenerativeAI } from '@google/generative-ai'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(process.cwd(), 'public')))

const DATA_DIR = path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json')
fs.mkdirSync(DATA_DIR, { recursive: true })
for (const file of [USERS_FILE, PROGRESS_FILE]) {
  if (!fs.existsSync(file)) fs.writeFileSync(file, JSON.stringify([]))
}

function readJSON(file) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')) } catch { return [] }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

const genAIKey = process.env.GEMINI_API_KEY || ''
const genAI = new GoogleGenerativeAI(genAIKey)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' })

const TEMPLATES = {
  writing: ({ prompt, essay }) =>
    `Role: IELTS examiner.\nTask: Score and feedback.\nPrompt: ${prompt}\nEssay:\n${essay}\nOutput JSON keys: band_overall, task_response, coherence, lexical_resource, grammar_range_accuracy, suggestions[3].`,
  speaking: ({ question, transcript }) =>
    `Role: IELTS examiner.\nTask: Evaluate speaking.\nQuestion: ${question}\nTranscript:\n${transcript}\nOutput JSON: fluency, lexical_resource, grammar, pronunciation, band_range, suggestions[3].`,
  reading: ({ passage, answers }) =>
    `Role: IELTS tutor.\nTask: Explain answers.\nPassage:\n${passage}\nAnswers:\n${JSON.stringify(answers)}\nOutput JSON: per_question[{id,correct,explain}], summary.`,
  vocabulary: ({ word, level }) =>
    `Role: IELTS tutor.\nTask: Practice word.\nWord: ${word}\nLevel: ${level}\nOutput JSON: examples[3], cloze_questions[5].`,
  listening: ({ transcript, answers }) =>
    `Role: IELTS tutor.\nTask: Listening check.\nTranscript:\n${transcript}\nAnswers:\n${JSON.stringify(answers)}\nOutput JSON: per_question[{id,correct,explain}], tips[3].`
}

const PROMPT_TEMPLATES = {
  speaking: ({ level = 'CEFR-B2' }) =>
    `Generate ONE authentic IELTS Speaking Part 2 cue card question for ${level}, random topic, British Council/Cambridge style. Return JSON {"question":"..."} only.`,
  writing_task1: ({ level = 'CEFR-B2' }) =>
    `Generate ONE authentic IELTS Academic Writing Task 1 prompt (visual data description) for ${level}, random chart/graph/table, British Council/Cambridge style. Return JSON {"prompt":"..."} only.`,
  writing_task2: ({ level = 'CEFR-B2' }) =>
    `Generate ONE authentic IELTS Writing Task 2 essay prompt for ${level}, random theme, British Council/Cambridge style (opinion/discussion/problem-solution). Return JSON {"prompt":"..."} only.`,
  reading: ({ level = 'CEFR-B2' }) =>
    `Generate an authentic IELTS-style reading passage (200-250 words) for ${level}, random theme, British Council/Cambridge style, and 5 questions (mix MCQ/short/TrueFalse) WITH answer keys. Return JSON {"passage":"...", "questions":[{"id":1,"type":"MCQ","question":"...","options":["A","B","C","D"],"answer":"A"}]}.`,
  listening: ({ level = 'CEFR-B2' }) =>
    `Generate an authentic IELTS-style listening transcript (140-180 words) for ${level}, random theme, British Council/Cambridge style, and 5 comprehension questions WITH answer keys. Return JSON {"transcript":"...", "questions":[...]} .`,
  vocabulary: ({ level = 'CEFR-B2' }) =>
    `Suggest one useful academic word for ${level} with brief definition, typical in IELTS contexts. Return JSON {"word":"...", "definition":"..."} .`
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization || ''
  const token = h.startsWith('Bearer ') ? h.slice(7) : null
  if (!token) return res.status(401).json({ error: 'no_token' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    req.user = { id: payload.uid }
    next()
  } catch {
    res.status(401).json({ error: 'invalid_token' })
  }
}

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'invalid_input' })
  const users = readJSON(USERS_FILE)
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'user_exists' })
  const hash = await bcrypt.hash(password, 10)
  const user = { id: `u_${Date.now()}`, email, passwordHash: hash, createdAt: new Date().toISOString() }
  users.push(user)
  writeJSON(USERS_FILE, users)
  res.json({ ok: true, userId: user.id })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body
  const users = readJSON(USERS_FILE)
  const user = users.find(u => u.email === email)
  if (!user) return res.status(404).json({ error: 'not_found' })
  const ok = await bcrypt.compare(password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'invalid_credentials' })
  const token = jwt.sign({ uid: user.id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })
  res.json({ ok: true, token })
})

app.post('/api/progress', authMiddleware, (req, res) => {
  const { skill, score, details } = req.body
  const progress = readJSON(PROGRESS_FILE)
  const entry = { id: `p_${Date.now()}`, userId: req.user.id, skill, score, details, createdAt: new Date().toISOString() }
  progress.push(entry)
  writeJSON(PROGRESS_FILE, progress)
  res.json({ ok: true, entry })
})

app.get('/api/progress', authMiddleware, (req, res) => {
  const progress = readJSON(PROGRESS_FILE).filter(p => p.userId === req.user.id)
  res.json({ ok: true, items: progress })
})

app.post('/api/tutor', async (req, res) => {
  const { skill, payload } = req.body
  if (!skill || !TEMPLATES[skill]) return res.status(400).json({ error: 'invalid_skill' })
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'missing_api_key' })
  try {
    const prompt = TEMPLATES[skill](payload || {})
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    let data
    try { data = JSON.parse(text) } catch { data = { text } }
    res.json({ ok: true, data })
  } catch (e) {
    const err = { code: e?.status, message: e?.message }
    res.status(500).json({ ok: false, error: 'gemini_error', ...err })
  }
})

app.post('/api/prompt', async (req, res) => {
  const { skill, options } = req.body
  if (!skill || !PROMPT_TEMPLATES[skill]) return res.status(400).json({ error: 'invalid_skill' })
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'missing_api_key' })
  try {
    const prompt = PROMPT_TEMPLATES[skill](options || {})
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    let data
    try { data = JSON.parse(text) } catch { data = { text } }
    res.json({ ok: true, data })
  } catch (e) {
    const err = { code: e?.status, message: e?.message }
    res.status(500).json({ ok: false, error: 'gemini_error', ...err })
  }
})

app.get('/api/gemini-test', async (req, res) => {
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ ok: false, error: 'missing_api_key' })
  try {
    const result = await model.generateContent('ping')
    const text = result.response.text()
    res.json({ ok: true, sample: text })
  } catch (e) {
    res.status(500).json({ ok: false, error: 'gemini_error', code: e?.status, message: e?.message })
  }
})

app.get('/api/models', async (req, res) => {
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ ok: false, error: 'missing_api_key' })
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    const r = await fetch(url)
    const j = await r.json()
    res.json({ ok: true, models: j.models || j })
  } catch (e) {
    res.status(500).json({ ok: false, error: 'gemini_error', code: e?.status, message: e?.message })
  }
})
app.get('/api/health', (req, res) => {
  const aiReady = !!process.env.GEMINI_API_KEY
  res.json({ ok: true, ai_ready: aiReady })
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running on http://localhost:' + (process.env.PORT || 3000))
})
