/* ================== ÂM THANH ================== */
let AC = null, muted = false;
function sfx(type) {
  if (muted) return;
  try {
    if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
    if (type === 'splash' || type === 'bigsplash') {   // tiếng nước: nhiễu trắng tắt dần
      const len = type === 'bigsplash' ? .7 : .45, t = AC.currentTime, b = AC.createBuffer(1, AC.sampleRate * len | 0, AC.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5);
      const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = b; f.type = 'lowpass'; f.frequency.setValueAtTime(type === 'bigsplash' ? 1400 : 2200, t);
      g.gain.setValueAtTime(type === 'bigsplash' ? .16 : .1, t); s.connect(f); f.connect(g); g.connect(AC.destination); s.start(t); return;
    }
    if (type === 'clap') {   // tràng pháo tay: nhiều tiếng vỗ ngắn rải rác, thưa dần
      const len = 1.6, t = AC.currentTime, b = AC.createBuffer(1, AC.sampleRate * len | 0, AC.sampleRate), d = b.getChannelData(0), n = AC.sampleRate * .02 | 0;
      for (let k = 0; k < 46; k++) { const at = Math.floor(Math.pow(Math.random(), 1.6) * (d.length - n)), amp = (1 - at / d.length) * (.4 + Math.random() * .6);
        for (let i = 0; i < n; i++) d[at + i] += (Math.random() * 2 - 1) * amp * Math.pow(1 - i / n, 3); }
      const s = AC.createBufferSource(), f = AC.createBiquadFilter(), g = AC.createGain(); s.buffer = b; f.type = 'bandpass'; f.frequency.setValueAtTime(1500, t); f.Q.setValueAtTime(.7, t);
      g.gain.setValueAtTime(.14, t); s.connect(f); f.connect(g); g.connect(AC.destination); s.start(t); return;
    }
    const P = { jump:[440,700,.12,'square'], heart:[880,1320,.07,'square'], hurt:[240,90,.22,'sawtooth'], stomp:[360,140,.12,'square'],
      power:[523,1046,.25,'triangle'], tick:[900,700,.02,'square'], yes:[660,1320,.4,'triangle'], boom:[160,40,.3,'sawtooth'], blip:[600,600,.04,'square'], ting:[1760,2640,.3,'triangle'] }[type];
    const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.type = P[3]; o.frequency.setValueAtTime(P[0], t); o.frequency.exponentialRampToValueAtTime(P[1], t + P[2]);
    g.gain.setValueAtTime(.05, t); g.gain.exponentialRampToValueAtTime(.001, t + P[2]);
    o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + P[2] + .02);
  } catch (e) {}
}
/* một nốt đàn (nhạc nền 8-bit, vd. nhóm hát rong Đà Lạt): midi → tần số, bật nhanh rồi tắt dần; when tính theo AC.currentTime */
function pluck(midi, when, dur = .5, vol = .04, type = 'triangle') {
  if (muted || !AC) return;
  try { const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.setValueAtTime(440 * Math.pow(2, (midi - 69) / 12), when);
    g.gain.setValueAtTime(.0001, when); g.gain.exponentialRampToValueAtTime(vol, when + .01); g.gain.exponentialRampToValueAtTime(.0005, when + dur);
    o.connect(g); g.connect(AC.destination); o.start(when); o.stop(when + dur + .02); } catch (e) {}
}
$('mute').onclick = () => { muted = !muted; $('mute').textContent = muted ? 'Âm: tắt' : 'Âm: bật'; };
