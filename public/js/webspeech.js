let cachedVoices = []
function getVoices() {
  const synth = window.speechSynthesis
  cachedVoices = synth.getVoices() || []
  return cachedVoices
}

function speakText(text, opts) {
  const o = opts || {}
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = o.lang || 'en-GB'
  utter.rate = o.rate || 1
  utter.pitch = o.pitch || 1
  if (o.voiceName) {
    const voices = cachedVoices.length ? cachedVoices : getVoices()
    const v = voices.find(v => v.name === o.voiceName)
    if (v) utter.voice = v
  }
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utter)
}

function startRecognition(opts) {
  const o = opts || {}
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SR) return { stop: () => {}, unsupported: true }
  const rec = new SR()
  rec.lang = o.lang || 'en-GB'
  rec.interimResults = !!o.interim
  rec.continuous = false
  rec.onresult = (e) => {
    const t = Array.from(e.results).map(r => r[0].transcript).join(' ')
    o.onResult && o.onResult(t)
  }
  rec.onend = () => o.onEnd && o.onEnd()
  rec.start()
  return { stop: () => rec.stop(), unsupported: false }
}

window.speechSynthesis.onvoiceschanged = () => { cachedVoices = getVoices() }
window.IELTS_SPEECH = { speakText, startRecognition, getVoices }
