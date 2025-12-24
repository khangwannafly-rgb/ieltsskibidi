const state = { token: null, chart: null, recCtrl: null }

function $(id) { return document.getElementById(id) }
function setText(id, text) { $(id).textContent = typeof text === 'string' ? text : JSON.stringify(text, null, 2) }

async function post(url, body, auth = true) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth && state.token) headers['Authorization'] = 'Bearer ' + state.token
  const r = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) })
  return r.json()
}
async function get(url, auth = true) {
  const headers = {}
  if (auth && state.token) headers['Authorization'] = 'Bearer ' + state.token
  const r = await fetch(url, { headers })
  return r.json()
}

document.querySelectorAll('nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(s => s.classList.add('hidden'))
    document.getElementById(btn.dataset.tab).classList.remove('hidden')
  })
})

function loadToken() {
  const t = localStorage.getItem('token')
  if (t) { state.token = t; setText('auth-status', 'logged in') }
}

function populateVoices() {
  const sel = $('speaking-voice')
  sel.innerHTML = ''
  const voices = window.IELTS_SPEECH.getVoices()
  voices.forEach(v => {
    const opt = document.createElement('option')
    opt.value = v.name
    opt.textContent = `${v.name} (${v.lang})`
    sel.appendChild(opt)
  })
}

async function refreshProgress() {
  if (!state.token) return
  const res = await get('/api/progress')
  if (!res.ok) return
  renderProgressTable(res.items)
  renderChart(res.items)
}

function renderProgressTable(items) {
  const tbody = document.querySelector('#progress-table tbody')
  tbody.innerHTML = ''
  items.slice().reverse().forEach(it => {
    const tr = document.createElement('tr')
    const t = new Date(it.createdAt).toLocaleString()
    tr.innerHTML = `<td>${t}</td><td>${it.skill}</td><td>${it.score ?? ''}</td>`
    tbody.appendChild(tr)
  })
}

function renderChart(items) {
  const ctx = $('progress-chart')
  const skills = ['vocabulary', 'reading', 'writing', 'speaking', 'listening']
  const colors = {
    vocabulary: '#10b981', reading: '#f59e0b', writing: '#3b82f6', speaking: '#ef4444', listening: '#8b5cf6'
  }
  const datasets = skills.map(s => {
    const data = items.filter(i => i.skill === s && typeof i.score === 'number')
      .map(i => ({ x: new Date(i.createdAt), y: i.score }))
    return { label: s, data, borderColor: colors[s], tension: 0.3 }
  })
  if (state.chart) { state.chart.destroy() }
  state.chart = new Chart(ctx, {
    type: 'line',
    data: { datasets },
    options: {
      parsing: false,
      scales: {
        x: { type: 'time', time: { unit: 'day' } },
        y: { min: 0, max: 9 }
      }
    }
  })
}

$('register').onclick = async () => {
  const email = $('email').value, password = $('password').value
  const res = await post('/api/auth/register', { email, password }, false)
  setText('auth-status', res.ok ? 'registered' : res.error)
}
$('login').onclick = async () => {
  const email = $('email').value, password = $('password').value
  const res = await post('/api/auth/login', { email, password }, false)
  if (res.ok) { state.token = res.token; localStorage.setItem('token', res.token); setText('auth-status', 'logged in'); refreshProgress() }
  else setText('auth-status', res.error)
}
$('logout').onclick = () => {
  state.token = null
  localStorage.removeItem('token')
  setText('auth-status', '')
}

$('vocab-generate').onclick = async () => {
  const word = $('word').value, level = $('level').value
  const res = await post('/api/tutor', { skill: 'vocabulary', payload: { word, level } }, false)
  setText('vocab-output', res.data || res.error)
  if (state.token) await post('/api/progress', { skill: 'vocabulary', score: null, details: res.data })
  try {
    const ex = res?.data?.examples
    if (Array.isArray(ex) && ex.length) {
      window.IELTS_SPEECH.speakText(ex[0], { lang: 'en-GB', voiceName: $('speaking-voice').value })
    }
  } catch {}
}
$('vocab-suggest').onclick = async () => {
  const level = $('level').value
  const res = await post('/api/prompt', { skill: 'vocabulary', options: { level } }, false)
  const w = res?.data?.word
  if (w) $('word').value = w
  setText('vocab-output', res.data || res.error)
}

$('reading-explain').onclick = async () => {
  let answers
  try { answers = JSON.parse($('reading-answers').value || '[]') } catch { answers = [] }
  const res = await post('/api/tutor', {
    skill: 'reading',
    payload: { passage: $('reading-passage').value, answers }
  }, false)
  setText('reading-output', res.data || res.error)
  if (state.token) await post('/api/progress', { skill: 'reading', score: null, details: res.data })
}
$('reading-generate').onclick = async () => {
  const res = await post('/api/prompt', { skill: 'reading' }, false)
  const p = res?.data?.passage
  if (p) $('reading-passage').value = p
  setText('reading-output', res.data || res.error)
}

$('writing-eval').onclick = async () => {
  const res = await post('/api/tutor', {
    skill: 'writing',
    payload: { prompt: $('writing-prompt').value, essay: $('writing-essay').value }
  }, false)
  setText('writing-output', res.data || res.error)
  if (state.token) await post('/api/progress', { skill: 'writing', score: res?.data?.band_overall || null, details: res.data })
}
$('writing-generate').onclick = async () => {
  const type = $('writing-type').value
  const res = await post('/api/prompt', { skill: type }, false)
  const p = res?.data?.prompt
  if (p) $('writing-prompt').value = p
  setText('writing-output', res.data || res.error)
}

$('speaking-start').onclick = async () => {
  const q = $('speaking-question').value
  window.IELTS_SPEECH.speakText(q, { lang: 'en-GB', voiceName: $('speaking-voice').value })
  state.recCtrl = window.IELTS_SPEECH.startRecognition({
    lang: 'en-GB',
    onResult: async (t) => {
      setText('speaking-transcript', t)
      const res = await post('/api/tutor', { skill: 'speaking', payload: { question: q, transcript: t } }, false)
      setText('speaking-output', res.data || res.error)
      if (state.token) await post('/api/progress', { skill: 'speaking', score: null, details: res.data })
    }
  })
}
$('speaking-generate').onclick = async () => {
  const res = await post('/api/prompt', { skill: 'speaking' }, false)
  const q = res?.data?.question
  if (q) $('speaking-question').value = q
  setText('speaking-output', res.data || res.error)
}
$('speaking-stop').onclick = () => {
  if (state.recCtrl && state.recCtrl.stop) state.recCtrl.stop()
}

$('listening-speak').onclick = () => {
  const transcript = $('listening-transcript').value || 'Sample listening text.'
  window.IELTS_SPEECH.speakText(transcript, { lang: 'en-GB', voiceName: $('speaking-voice').value })
}
$('listening-explain').onclick = async () => {
  let answers
  try { answers = JSON.parse($('listening-answers').value || '[]') } catch { answers = [] }
  const res = await post('/api/tutor', { skill: 'listening', payload: { transcript: $('listening-transcript').value, answers } }, false)
  setText('listening-output', res.data || res.error)
  if (state.token) await post('/api/progress', { skill: 'listening', score: null, details: res.data })
}
$('listening-generate').onclick = async () => {
  const res = await post('/api/prompt', { skill: 'listening' }, false)
  const t = res?.data?.transcript
  if (t) $('listening-transcript').value = t
  setText('listening-output', res.data || res.error)
}

window.addEventListener('load', () => {
  loadToken()
  populateVoices()
  $('refresh-progress').onclick = refreshProgress
  if (state.token) refreshProgress()
})
