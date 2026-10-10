/* ================== ĐỘNG CƠ KỊCH BẢN ================== */
let script = [], si = 0, blocking = null, chapter = 0, dlgT = 0, fadeA = 0, fadeDir = 0, fadeCb = null;
function fadeTo(cb) { fadeDir = 1; fadeCb = cb; }
function startGame() { chapter = 0; fireworks = 0; startChapter(0); }
function startChapter(i) {
  chapter = i; sceneT = 0; const C = CHAPTERS[i]; $('memory').classList.remove('on');
  mode = 'scene'; actors = {}; props = {}; particles = []; rain = []; splashes = []; phone = { on: false, msgs: [], typing: false }; weather = { rain: false, shelter: false };
  L = { theme: C.theme, solids: [{ x: -200, y: GY, w: 4000, h: 80 }], plats: [] };
  cam = 0; camTarget = 0; camFollow = null;
  $('lvlName').textContent = CITIES[C.city][0] + ' – ' + C.title;
  script = C.build().map(norm); si = 0; blocking = null; nextStep();
}
function stopStory(keepScene) {
  script = []; si = 0; blocking = null; dlg = null; $('dialog').hidden = true; $('banner').hidden = true; if (!keepScene) mode = 'idle';
  // huỷ banner/chuyển cảnh đang chờ để callback cũ không chạy tiếp kịch bản mới
  clearTimeout(bnTimer); $('banner').classList.remove('withmap'); mapAnim = null; fadeCb = null; fadeDir = 0; fadeA = 0;
}
// debug: nhảy thẳng tới một màn (js/debug.js)
function jumpChapter(i) {
  if (!guest.name) guest.name = 'Khách';
  closeModal(); stopStory(true); fireworks = 0; flashA = 0; startChapter(i);
}
const norm = s => Array.isArray(s) ? { say: s } : s;
function nextStep() { while (si < script.length) { const b = exec(script[si++]); if (b) { blocking = b; return; } } }
function resume() { blocking = null; nextStep(); }
function exec(s) {
  if (s.place) { const [n, spr, x, f] = s.place; addActor(n, spr, x, f); return null; }
  if (s.title) { const C = CHAPTERS[chapter]; mapAnim = { to: C.city, t: 0 }; $('banner').classList.add('withmap'); showBanner(CITIES[C.city][0], C.title, '', () => { mapAnim = null; $('banner').classList.remove('withmap'); resume(); }, 1500); return { t: 'cb' }; }
  if (s.say) { const [w, t] = typeof s.say === 'function' ? s.say() : s.say; dialog([[nm(w), t]], resume); dlg.speaker = { G: 'groom', B: 'bride', P: 'guest', F: 'father' }[w] || (actors[w] ? w : null); dlgT = 0; return { t: 'cb' }; }
  if (s.walk) { const [n, x, async] = s.walk; actors[n].target = x; return async ? null : { t: 'walk', a: n }; }
  if (s.camTo != null) { camFollow = null; camTarget = s.camTo; return null; }
  if (s.follow) { camFollow = s.follow; return null; }
  if (s.emote) { const a = actors[s.emote[0]]; a.emote = s.emote[1]; a.emoteT = 2.2; if (s.emote[1] === 'heart') sfx('heart'); return null; }
  if (s.pose) { const [n, p] = s.pose; setPose(actors[n], p); return null; }
  if (s.face) { const [n, f] = s.face; actors[n].face = f; return null; }
  if (s.jump) { actors[s.jump].hopV = -220; sfx('jump'); return null; }
  if (s.fn) { s.fn(); return null; }
  if (s.wait) return { t: 'wait', left: s.wait };
  if (s.until) return s.until() ? null : { t: 'until', f: s.until };
  if (s.chat) { phone.typing = false; phone.msgs.push({ me: !!s.chat[0], t: s.chat[1] }); sfx('blip'); return { t: 'wait', left: 1.0 }; }
  if (s.typing) { phone.typing = true; return { t: 'wait', left: s.typing }; }
  if (s.banner) { showBanner('', s.banner, '', resume); return { t: 'cb' }; }
  if (s.rsvp) { askRsvp(); return { t: 'cb' }; }
  if (s.memory != null) { showMemory(CONFIG.memories[s.memory]); return { t: 'wait', left: 1.0 }; }
  // chuyển cảnh ngay trong chương: tối màn → dọn cảnh cũ, đổi theme, hiện tên cảnh mới (không chặn) rồi chạy tiếp
  if (s.cut) { const [theme, name] = s.cut; fadeTo(() => { const city = CITIES[CHAPTERS[chapter].city][0];
      sceneT = 0; actors = {}; props = {}; particles = []; L.theme = theme; cam = camTarget = 0; camFollow = null;
      $('lvlName').textContent = city + ' – ' + name; showBanner(city, name, '', null, 1600); resume(); });
    return { t: 'cb' }; }
  if (s.end) { fadeTo(() => chapter + 1 < CHAPTERS.length ? startChapter(chapter + 1) : null); return { t: 'cb' }; }
  return null;
}
function updateStory(dt) {
  if (blocking && blocking.t === 'walk' && actors[blocking.a].target == null) resume();
  else if (blocking && blocking.t === 'wait' && (blocking.left -= dt) <= 0) resume();
  else if (blocking && blocking.t === 'until' && blocking.f()) resume();
  if (dlg) { if (dlg.shown < dlg.full.length) { const n0 = Math.floor(dlg.shown); dlg.shown = Math.min(dlg.full.length, dlg.shown + dt * 38); if (Math.floor(dlg.shown) !== n0) $('dlgTxt').textContent = dlg.full.slice(0, Math.floor(dlg.shown)); if (Math.floor(dlg.shown / 4) !== Math.floor(n0 / 4)) sfx('tick'); }
    else { dlgT += dt; if (dlgT > Math.min(2.0, Math.max(1.0, dlg.full.length * .028))) { dlgT = 0; advance(); } } }
  if (fireworks > 0) { fireworks -= dt; fwNext -= dt; if (fwNext <= 0) { fwNext = .3 + Math.random() * .3;
    const cols = [['#ffd43b', '#fff3bf', '#ffa94d'], ['#ff6b8b', '#ffffff', '#ffc2d1'], ['#74c0fc', '#ffffff', '#d0ebff'], ['#b197fc', '#ffd43b', '#ffffff']][Math.floor(Math.random() * 4)];
    burst(cam + 60 + Math.random() * 360, 30 + Math.random() * 90, cols, 40, 110, 1.3, 45); sfx('boom'); } }
  if (fadeDir) { fadeA += fadeDir * dt * 3; if (fadeDir > 0 && fadeA >= 1) { fadeA = 1; fadeDir = -1; const c = fadeCb; fadeCb = null; c && c(); } if (fadeDir < 0 && fadeA <= 0) { fadeA = 0; fadeDir = 0; } }
}

/* ================== VÒNG LẶP ================== */
let last = 0, acc = 0, timeScale = 1;   // timeScale: tua nhanh khi debug
function loop(t) {
  const dt = Math.min(.1, (t - last) / 1000 || 0); last = t; acc += dt * timeScale;
  while (acc >= 1 / 60) { step(1 / 60); acc -= 1 / 60; }
  render(); requestAnimationFrame(loop);
}
function step(dt) {
  time += dt; sceneT += dt; updateActors(dt); updateStory(dt); tripUpdate(dt); if (mapAnim) mapAnim.t += dt;
  updateFx(dt);
}
function render() {
  // vẽ với camera làm tròn: nền và nhân vật cùng làm tròn theo một gốc, không rung lệch nhau 1px
  if (mode === 'scene') { const camF = cam; cam = Math.round(cam); try { renderScene(); } finally { cam = camF; } }
  else { L = L || { solids: [], plats: [] }; cam = time * 20 % 2000; drawBg('sunset'); fr('#3e2750', 0, GY, W, H - GY); fr('#e8779c', 0, GY, W, 5); }
  fr('#000000', 0, 0, W, 16); fr('#000000', 0, H - 14, W, 14);
  if (fadeA > 0) { ctx.globalAlpha = Math.min(1, fadeA); fr('#000000', 0, 0, W, H); ctx.globalAlpha = 1; }
}
function renderScene() {
  drawBg(L.theme); drawGround(L.theme); drawHanoiStall();
  if (L.theme === 'namdinh') ndMirrorActors(drawActors); else drawActors();
  if (L.theme === 'hoabinh') hbFront();   // mặt nước phía trước che phần người chìm dưới nước
  drawParticles(); if (weather.rain) drawRain(); drawPhone(); tripOverlay();
  if (L.theme === 'phuquoc') { ctx.globalAlpha = .08; fr('#ff8a3d', 0, 0, W, H); ctx.globalAlpha = 1; }
}
