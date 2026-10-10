/* ================== DIỄN VIÊN & HIỆU ỨNG ================== */
let actors = {}, camTarget = 0, camFollow = null, props = {}, phone = { on: false, msgs: [], typing: false }, weather = { rain: false, shelter: false };
function burst(x, y, cols, n, spd = 60, life = .5, g = 0) {
  for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = spd * (.4 + Math.random() * .8);
    particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life, max: life, col: cols[i % cols.length], sz: Math.random() < .3 ? 2 : 1, g }); }
}
function heartRain(x) { for (let i = 0; i < 14; i++) particles.push({ x: x + (Math.random() - .5) * 40, y: GY - 40 - Math.random() * 20, vx: (Math.random() - .5) * 20, vy: -30 - Math.random() * 40, life: 1.4, max: 1.4, col: ['#ff6b8b', '#ffd43b', '#ff9eb0'][i % 3], sz: 2 + (i % 2), g: 0 }); }
function addActor(name, spr, x, face = 1) { actors[name] = { name, spr, x, face, vis: true, target: null, spd: 95, hop: 0, hopV: 0, anim: 0, emote: null, emoteT: 0, pose: null, poseT: 0 }; }
/* Tư thế (pose): eat · sit · drink · offer · wave · cam · vsign · clap · pray · cold · point · giggle · kneel */
function setPose(a, p) { a.pose = p; a.poseT = 0; }
const actorLook = a => a.spr === 'guest' ? (guest.gender === 'm' ? 'guestM' : 'guestF') : a.spr;
const actorKind = a => { const l = actorLook(a); return l === 'bride' || l === 'guestF' ? 'f' : 'm'; };
const actorSeed = a => a.name.length * 1.7;
const GESTURES = ['talk1', 'talk2', 'talk2', 'talk1', null, 'talk1', 'point', 'talk2'];
/* Chọn khung hình: chân, tay, nét mặt theo tư thế + trạng thái hội thoại */
function actorFrame(a) {
  const look = actorLook(a), kind = actorKind(a), seed = actorSeed(a), T = a.poseT;
  const speaking = !!(dlg && dlg.speaker === a.name), talking = speaking && dlg.shown < dlg.full.length;
  const mouth = talking && Math.floor(time * 9) % 2, blink = ((time + seed) % 3.4) < .13;
  let legs = 'idle', arm = null, face = mouth ? 't' : blink ? 'b' : 'n';
  if (!mouth && a.emote === 'heart') face = 'h';
  if (!mouth && a.emote === '!') face = 'o';
  const F = () => ({ look, kind, legs, arm, face });
  if (a.spr === 'father') { legs = 'floor'; return F(); }
  if (a.hop < 0) { legs = 'jump'; arm = 'jump'; if (!mouth) face = 'H'; return F(); }
  if (a.target != null) {
    if (kind === 'f') { const w = Math.floor(a.anim / 9) % 2; legs = w ? 'walk1' : 'walk2'; arm = w ? 'swingF' : 'swingB'; }
    else { const k = Math.floor(a.anim / 10) % 4; legs = ['run1', 'run2', 'run3', 'run2'][k]; arm = ['swingF', null, 'swingB', null][k]; }
    return F();
  }
  switch (a.pose) {
    case 'kneel': legs = 'kneel'; arm = 'ring'; return F();
    case 'eat': { legs = 'seat'; const ph = (T + seed) % 2.8;
      if (speaking) arm = 'hold';
      else if (ph < 1.1) arm = 'hold';                                         // cầm bát, thổi cho nguội
      else if (ph < 1.8) { arm = 'lift'; face = ph > 1.3 ? 't' : 'n'; }        // gắp bún lên, há miệng
      else { arm = 'hold'; face = Math.floor(T * 6) % 2 ? 'H' : 'h'; }        // nhai ngon lành
      return F(); }
    case 'sit': legs = 'seat'; break;
    case 'drink': arm = T % 3 < 1.2 ? 'hold' : 'lift'; if (arm === 'lift') face = 'b'; else if (!mouth) face = 'h'; return F();
    case 'offer': arm = 'point'; return F();
    case 'wave': arm = Math.floor(T * 6) % 2 ? 'wave1' : 'wave2'; if (!mouth) face = 'h'; return F();
    case 'cam': arm = 'cam'; return F();
    case 'vsign': arm = 'vsign'; if (!mouth) face = 'H'; return F();
    case 'clap': arm = Math.floor(T * 7) % 2 ? 'clap1' : 'clap2'; if (!mouth) face = 'H'; return F();
    case 'pray': arm = 'clap1'; face = 'b'; return F();
    case 'cold': arm = 'cross'; return F();
    case 'point': arm = 'point'; return F();
    case 'giggle': arm = 'mouth'; if (!mouth && face !== 'o') face = 'h'; return F();
  }
  if (talking) arm = GESTURES[Math.floor((time + seed) * 2.4) % GESTURES.length];   // vừa nói vừa khoa tay
  return F();
}
function actorImg(a) { const f = actorFrame(a); a._f = f; return body(f.look, f.kind, f.legs, f.arm, f.face); }
/* đạo cụ cần người đang đứng yên quay về phía người nói */
const TURNABLE = new Set([null, 'wave', 'clap', 'giggle']);
function updateActors(dt) {
  const sp = dlg && dlg.speaker && actors[dlg.speaker];
  for (const a of Object.values(actors)) {
    a.poseT += dt;
    if (a.target != null) { const d = a.target - a.x, st = a.spd * dt; if (Math.abs(d) <= st) { a.x = a.target; a.target = null; } else { a.x += Math.sign(d) * st; a.face = Math.sign(d); a.anim += st; } }
    if (a.hopV || a.hop < 0) { a.hopV += 900 * dt; a.hop += a.hopV * dt; if (a.hop >= 0) { a.hop = 0; a.hopV = 0; } }
    if (a.emoteT > 0) { a.emoteT -= dt; if (a.emoteT <= 0) a.emote = null; }
    if (sp && a !== sp && a.target == null && a.spr !== 'father' && TURNABLE.has(a.pose) && Math.abs(sp.x - a.x) > 6) a.face = Math.sign(sp.x - a.x);
    if (a.pose === 'cold' && Math.random() < dt * 1.6) { const [mx, my] = handPt(a, 15, -4); particles.push({ x: mx + cam + a.face * 2, y: my, vx: a.face * 8, vy: -6, life: .7, max: .7, col: '#ffffff', sz: 2, g: 0 }); }
  }
  if (camFollow && actors[camFollow]) camTarget = actors[camFollow].x - W * .4;
  cam += (Math.max(0, camTarget) - cam) * Math.min(1, dt * 3);
}
/* Toạ độ màn hình của một điểm trên sprite (cột, hàng theo thân) – dùng để gắn đạo cụ vào tay */
function handPt(a, col, row) {
  const f = a._f || actorFrame(a), ty = torsoRow(f.kind, f.legs), top = a._top != null ? a._top : GY - 33;
  const sx = a.face > 0 ? a.x - 4 + col : a.x + 16 - col;
  return [Math.round(sx - cam), top + 1 + ty + row + (row < 0 && a._drop ? 1 : 0)];
}
function steam(x, y, k) { ctx.globalAlpha = .55; for (let i = 0; i < 2; i++) { const t = (time * 1.4 + i * .5 + k) % 1, yy = Math.round(y - t * 7), xx = x + i * 3 + Math.round(Math.sin(time * 4 + i * 2 + k) * 1); fr('#ffffff', xx, yy, 1, 2); } ctx.globalAlpha = 1; }
function drawBowl(cx, y, k) {
  const x = Math.round(cx) - 4;
  fr(OUT, x - 1, y - 1, 11, 6); fr('#ffffff', x, y, 9, 4); fr('#e8590c', x + 1, y, 7, 1); fr('#f59f00', x + 2, y, 2, 1); fr('#c2410c', x + 5, y, 1, 1); fr('#51cf66', x + 6, y, 1, 1);
  fr('#4dabf7', x, y + 2, 9, 1); fr('#dee2e6', x + 1, y + 3, 7, 1); fr(OUT, x + 2, y + 4, 5, 1); fr('#ffffff', x + 3, y + 4, 3, 1);
  steam(x + 2, y - 2, k);
}
function drawCup(x, y, k, hot) { x = Math.round(x); fr(OUT, x - 1, y - 1, 5, 7); fr('#fff3d6', x, y, 3, 5); fr('#f1e3c8', x, y + 3, 3, 2); fr('#ffffff', x, y, 1, 2); if (hot) steam(x, y - 2, k); }
function drawProps(a) {
  const f = a._f; if (!f) return; const dir = a.face, k = actorSeed(a);
  if (a.pose === 'eat') {
    const [bx, by] = handPt(a, 13, 3), [bx2] = handPt(a, 14, 3); drawBowl((bx + bx2) / 2, by + 1, k);
    if (f.arm === 'lift') {            // đũa đưa lên miệng, sợi bún thòng xuống
      const [hx, hy] = handPt(a, 16, -3), ph = ((a.poseT + k) % 2.8 - 1.1) / .7, len = Math.max(0, Math.round(5 * (1 - ph)));
      for (let i = 0; i < 5; i++) fr('#8a5a2a', hx + dir * (1 - i), hy - i, 1, 1);
      const [mx, my] = handPt(a, 14, -4); for (let i = 0; i < len; i++) { fr('#fff3d6', mx + (i % 2), my + i, 1, 1); fr('#fff3d6', mx + dir + ((i + 1) % 2), my + i, 1, 1); }
    } else {                           // đũa cắm trong bát
      const [hx, hy] = handPt(a, 16, 3); for (let i = 0; i < 6; i++) fr('#8a5a2a', hx + dir * (i >> 1), hy + 1 - i, 1, 1);
    }
  }
  if (a.pose === 'drink' || a.pose === 'offer') {
    const [col, row] = f.arm === 'lift' ? [16, -4] : f.arm === 'point' ? [19, -2] : [16, 0], [cx, cy] = handPt(a, col, row);
    drawCup(cx - (dir > 0 ? 0 : 2), cy, k, f.arm !== 'lift');
  }
  if (a.pose === 'cam') {
    const [cx, cy] = handPt(a, 18, -8), x = dir > 0 ? cx - 3 : cx - 4;
    fr(OUT, x - 1, cy - 1, 9, 7); fr('#343a40', x, cy, 7, 5); fr('#868e96', x + 1, cy, 2, 1); fr('#e03131', x + (dir > 0 ? 5 : 1), cy - 1, 1, 1);
    fr('#1b1b2f', x + (dir > 0 ? 4 : 1), cy + 1, 2, 3); fr('#74c0fc', x + (dir > 0 ? 5 : 1), cy + 2, 1, 1);
  }
  if (a.pose === 'kneel') {
    const [hx0, hy] = handPt(a, 21, 0), [hx1] = handPt(a, 22, 0), hx = Math.min(hx0, hx1) + (a.face > 0 ? -2 : -10);
    ctx.drawImage(S.ring, hx, hy - 12); glow(hx + 7, hy - 6, 12, '#fff3bf', .2 + Math.sin(time * 5) * .05);
    if (Math.floor(time * 3) % 3 === 0) { fr('#ffffff', hx + 10, hy - 15, 1, 3); fr('#ffffff', hx + 9, hy - 14, 3, 1); }
  }
}
function drawEmote(a, img) {
  if (!a.emote) return;
  const seat = a.pose === 'eat' || a.pose === 'sit' ? 2 : 0, x = Math.round(a.x - cam + 1), y = Math.round(GY - 30 + a.hop - 26 - Math.sin(time * 5) * 1.5 + (a.spr === 'father' ? 8 : 0) + (a.pose === 'kneel' ? 5 : 0) + seat);
  if (a.emote === 'heart') { ctx.drawImage(S.heart, x, y + 2); return; }
  if (a.emote === 'sweat') { fr('#74c0fc', x + 15, y + 12, 3, 4); fr('#74c0fc', x + 16, y + 10, 1, 2); fr('#ffffff', x + 15, y + 13, 1, 1); return; }
  fr(OUT, x - 1, y - 1, 15, 14); fr('#ffffff', x, y, 13, 12); fr(OUT, x + 2, y + 13, 3, 2); fr('#ffffff', x + 3, y + 12, 1, 1);
  if (a.emote === '!') { fr('#e8364f', x + 5, y + 2, 3, 6); fr('#e8364f', x + 5, y + 9, 3, 2); }
  if (a.emote === '?') { fr('#1c7ed6', x + 4, y + 2, 5, 2); fr('#1c7ed6', x + 8, y + 3, 2, 3); fr('#1c7ed6', x + 6, y + 5, 2, 2); fr('#1c7ed6', x + 6, y + 9, 2, 2); }
  if (a.emote === '...') for (let d = 0; d < 3; d++) fr((Math.floor(time * 3) % 3) >= d ? '#495057' : '#ced4da', x + 2 + d * 4, y + 5, 2, 2);
}
function drawActors() {
  const list = Object.values(actors).filter(a => a.vis);
  ctx.globalAlpha = .22; for (const a of list) { const sx = Math.round(a.x - cam + 6), sc = a.hop < 0 ? Math.max(.4, 1 + a.hop / 40) : 1, w = Math.round(16 * sc); fr('#1b1b2f', sx - (w >> 1), GY - 1, w, 2); fr('#1b1b2f', sx - (w >> 1) + 3, GY + 1, w - 6, 1); } ctx.globalAlpha = 1;
  const sp = dlg && dlg.speaker;
  for (const a of list) {
    const img = actorImg(a), f = a._f;
    if (a.spr === 'father') { fr('#c9a26b', a.x - 12 - cam, GY - 3, 42, 3); fr('#e0bf85', a.x - 12 - cam, GY - 3, 42, 1); ds(a.face < 0 ? flipped(img) : img, a.x - 4, GY - img.height + 1); ds(S.cup, a.x - 14, GY - 7); continue; }
    const moving = a.target != null, seed = actorSeed(a), bob = moving ? -(Math.floor(a.anim / (a.spr === 'guest' ? 6 : 10)) % 2) : 0;
    const still = !moving && a.hop === 0 && a.pose !== 'kneel';
    const talking = sp === a.name && dlg.shown < dlg.full.length;
    const breathe = Math.floor((time + a.name.length) * 1.1) % 2;
    const nod = sp && sp !== a.name && ((time + seed) % 1.9) < .22;           // người nghe gật gù
    const laugh = f.face === 'H' && Math.floor(time * 8) % 2;                // cười rung vai
    const drop = still && (talking ? Math.floor(time * 4.5 + seed) % 2 : nod || laugh || breathe);
    const shiver = a.pose === 'cold' ? (Math.floor(time * 20) % 2) : 0;      // run lập cập
    const y = GY - 30 + a.hop + bob;
    a._top = Math.round(y + 30 - (img.height - 1)); a._drop = !!drop;
    drawBody(img, a.x + shiver, y, a.face, drop, torsoRow(f.kind, f.legs) + 1);
    drawProps(a);
  }
  for (const a of list) drawEmote(a);
  if (props.earphones) { const x = Math.round(props.earphones - cam); fr('#ffffff', x, GY - 4, 4, 4); fr('#ffffff', x + 9, GY - 4, 4, 4); fr('#dee2e6', x + 3, GY - 2, 7, 1); fr(OUT, x, GY - 1, 13, 1); }
  if (weather.shelter && actors.groom && actors.bride) { const mx = (actors.groom.x + actors.bride.x) / 2; ds(S.umbrella, mx - 3, GY - 50); }
}
const pbuf = new Map();
function phoneText(str, color) { return pixText(str, 16, color); }
function drawPhone() {
  if (!phone.on) return;
  const x0 = 250, y0 = 22, w = 170, h = 214;
  fr('#1b1b2f', x0 - 3, y0 - 3, w + 6, h + 6); fr('#2b2b42', x0 - 1, y0 - 1, w + 2, h + 2); fr('#f8f0ff', x0 + 4, y0 + 16, w - 8, h - 26);
  fr('#ff8fb8', x0 + 4, y0 + 16, w - 8, 18); ctx.drawImage(phoneText(CONFIG.bride, '#ffffff'), x0 + 28, y0 + 14); pixCircle(x0 + 16, y0 + 25, 5, '#ffe0c2'); fr('#2b1f2b', x0 + 11, y0 + 19, 11, 4);
  fr('#495057', x0 + w / 2 - 12, y0 + 5, 24, 3);
  let y = y0 + h - 16; const maxW = w - 50;
  const items = phone.msgs.slice(-6).reverse();
  if (phone.typing) { const bx = x0 + 10; y -= 16; fr('#ffffff', bx, y, 30, 13); for (let d = 0; d < 3; d++) fr((Math.floor(time * 4) % 3) === d ? '#ff6b9d' : '#ced4da', bx + 6 + d * 7, y + 5, 3, 3); y -= 4; }
  for (const m of items) {
    const lines = wrapText(m.t, maxW, 16, m.me ? '#ffffff' : '#3a1d2e');
    const bw = Math.max(...lines.map(l => l.width)) + 10, bh = lines.length * 14 + 9;
    y -= bh; if (y < y0 + 38) break;
    const bx = m.me ? x0 + w - 10 - bw : x0 + 10;
    fr(m.me ? '#4dabf7' : '#ffffff', bx, y, bw, bh); fr(m.me ? '#339af0' : '#e9ddf2', bx, y + bh - 1, bw, 1);
    lines.forEach((l, i) => ctx.drawImage(l, bx + 5, y + 3 + i * 14));
    y -= 5;
  }
}
