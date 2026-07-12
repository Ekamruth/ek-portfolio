/*
 * Procedural chiptune engine — WebAudio only, no assets, no IP.
 * Ambient: a slow A-minor pentatonic arpeggio (square) over a triangle pad
 * and sparse noise hats. SFX: short synthesized blips.
 * Muted by default; start() must be called from a user gesture.
 */

let ctx = null
let master = null
let seqTimer = null
let step = 0
const beatListeners = new Set()

const BPM = 92
const STEP_S = 60 / BPM / 2 // 8th notes

// A-minor pentatonic-ish, two octaves
const BASS = [110, 110, 0, 82.4, 110, 0, 98, 0, 110, 110, 0, 82.4, 130.8, 0, 98, 0]
const LEAD = [0, 440, 523.25, 0, 659.25, 0, 587.33, 523.25, 0, 440, 0, 392, 0, 523.25, 440, 0]

function ensureCtx() {
  if (ctx) return
  ctx = new (window.AudioContext || window.webkitAudioContext)()
  master = ctx.createGain()
  master.gain.value = 0
  master.connect(ctx.destination)
}

function blip(freq, { type = 'square', dur = 0.12, vol = 0.16, slide = 0, delay = 0 } = {}) {
  if (!ctx || master.gain.value === 0) return
  const t0 = ctx.currentTime + delay
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq + slide), t0 + dur)
  g.gain.setValueAtTime(vol, t0)
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur)
  osc.connect(g)
  g.connect(master)
  osc.start(t0)
  osc.stop(t0 + dur + 0.02)
}

function hat(delay = 0, vol = 0.05) {
  if (!ctx || master.gain.value === 0) return
  const t0 = ctx.currentTime + delay
  const len = 0.04
  const buf = ctx.createBuffer(1, ctx.sampleRate * len, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length)
  const src = ctx.createBufferSource()
  src.buffer = buf
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 6000
  const g = ctx.createGain()
  g.gain.value = vol
  src.connect(hp)
  hp.connect(g)
  g.connect(master)
  src.start(t0)
}

function tick() {
  const i = step % 16
  if (BASS[i]) blip(BASS[i], { type: 'triangle', dur: 0.22, vol: 0.24 })
  if (LEAD[i] && step % 32 >= 16) blip(LEAD[i], { type: 'square', dur: 0.14, vol: 0.09 })
  if (i % 4 === 2) hat(0, 0.09)
  beatListeners.forEach((fn) => fn(i))
  step++
}

export const chiptune = {
  start() {
    ensureCtx()
    if (ctx.state === 'suspended') ctx.resume()
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(1.0, ctx.currentTime, 0.3)
    if (!seqTimer) seqTimer = setInterval(tick, STEP_S * 1000)
  },
  stop() {
    if (!ctx) return
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.15)
    if (seqTimer) {
      clearInterval(seqTimer)
      seqTimer = null
    }
  },
  onBeat(fn) {
    beatListeners.add(fn)
    return () => beatListeners.delete(fn)
  },
  sfx: {
    footstep: () => blip(90, { type: 'triangle', dur: 0.05, vol: 0.09, slide: -30 }),
    xpTick: () => blip(880, { dur: 0.07, vol: 0.12, slide: 220 }),
    questClear: () => {
      blip(523.25, { dur: 0.1, vol: 0.2 })
      blip(659.25, { dur: 0.1, vol: 0.2, delay: 0.09 })
      blip(783.99, { dur: 0.16, vol: 0.2, delay: 0.18 })
    },
    dialogueBlip: () => blip(620 + Math.random() * 120, { dur: 0.03, vol: 0.07 }),
    levelUp: () => {
      ;[523.25, 659.25, 783.99, 1046.5].forEach((f, i) =>
        blip(f, { dur: 0.14, vol: 0.22, delay: i * 0.11 }),
      )
    },
  },
}
