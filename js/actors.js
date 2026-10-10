/* ================== DIỄN VIÊN & HIỆU ỨNG ================== */
let actors = {}, camTarget = 0, camFollow = null, props = {}, phone = { on: false, msgs: [], typing: false }, weather = { rain: false, shelter: false };
function burst(x, y, cols, n, spd = 60, life = .5, g = 0) {
  for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, v = spd * (.4 + Math.random() * .8);
    particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life, max: life, col: cols[i % cols.length], sz: Math.random() < .3 ? 2 : 1, g }); }
}
function heartRain(x) { for (let i = 0; i < 14; i++) particles.push({ x: x + (Math.random() - .5) * 40, y: GY - 40 - Math.random() * 20, vx: (Math.random() - .5) * 20, vy: -30 - Math.random() * 40, life: 1.4, max: 1.4, col: ['#ff6b8b', '#ffd43b', '#ff9eb0'][i % 3], sz: 2 + (i % 2), g: 0 }); }
function addActor(name, spr, x, face = 1) { actors[name] = { name, spr, x, face, vis: true, target: null, spd: 75, hop: 0, hopV: 0, anim: 0, emote: null, emoteT: 0, pose: null, poseT: 0 }; }
/* Tư thế (pose): eat · sit · drink · offer · mot · cheer · wave · cam · vsign · clap · pray · cold · point · giggle · kneel · sing · guitar */
function setPose(a, p) { a.pose = p; a.poseT = 0; }
const motPhase = a => (a.poseT + (actorKind(a) === 'f' ? 1.7 : 0)) % 3.4;   // chu kỳ hút nước Mót, hai người so le nhau
/* khách: 'guest' → guestM/guestF theo giới tính; 'guestPQ' → guestMPQ/guestFPQ (bộ đồ theo chương) */
const actorLook = a => /^guest/.test(a.spr) && !LOOK[a.spr] ? (guest.gender === 'm' ? 'guestM' : 'guestF') + a.spr.slice(5) : a.spr;
const actorKind = a => FEMALE.has(actorLook(a)) ? 'f' : 'm';
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
  if (a.air) { const p = a.air.pose || {}; legs = p.legs || 'jump'; arm = p.arm || 'jump'; if (!mouth) face = p.face || 'H'; return F(); }   // đang bay (nhảy thác)
  if (a.hop < 0) { legs = 'jump'; arm = 'jump'; if (!mouth) face = 'H'; return F(); }
  if (a.target != null) {
    const k = Math.floor(a.anim / STEP_PX[kind]) % 4;                      // 4 khung: bước · chụm · bước chân kia · chụm
    legs = (kind === 'f' ? 'walk' : 'run') + (k + 1); arm = WALK_ARM[legs] || null;
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
    case 'mot': { const ph = motPhase(a); arm = 'cup';                       // cầm cốc · ngậm ống hút nhắm mắt hút · cười híp mắt
      if (!speaking && ph >= 1.3 && ph < 2.5) { arm = 'sip'; face = 'b'; }
      else if (!speaking && ph >= 2.5 && !mouth) face = 'h';
      return F(); }
    case 'cheer': arm = 'toast'; if (!mouth) face = 'H'; return F();
    case 'wave': arm = Math.floor(T * 6) % 2 ? 'wave1' : 'wave2'; if (!mouth) face = 'h'; return F();
    case 'cam': arm = 'cam'; return F();
    case 'vsign': arm = 'vsign'; if (!mouth) face = 'H'; return F();
    case 'clap': arm = Math.floor(T * 7) % 2 ? 'clap1' : 'clap2'; if (!mouth) face = 'H'; return F();
    case 'pray': arm = 'clap1'; face = 'b'; return F();
    case 'cold': arm = 'cross'; return F();
    case 'point': arm = 'point'; return F();
    case 'giggle': arm = 'mouth'; if (!mouth && face !== 'o') face = 'h'; return F();
    case 'sing': arm = 'sing';                                                 // hát rong: miệng mấp máy theo nhịp, thỉnh thoảng nhắm mắt cười
      if (!speaking && props.song) face = Math.floor(time * 1.7) % 4 === 3 ? 'h' : Math.floor(time * 6.8) % 2 ? 't' : 'n';
      return F();
    case 'guitar': legs = 'seat'; arm = props.song && Math.floor(time * (props.song === 2 ? 5 : 7)) % 2 ? 'strum2' : 'strum1';
      if (!mouth && props.song && Math.floor(time * .8) % 3 === 2) face = 'h';
      return F();
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
    if (a.pose === 'cold' && Math.random() < dt * 1.6) { const [mx, my] = handPt(a, 12, -3); particles.push({ x: mx + cam + a.face * 2, y: my, vx: a.face * 8, vy: -6, life: .7, max: .7, col: '#ffffff', sz: 2, g: 0 }); }
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
/* cốc nước Mót: cốc giấy trắng thon đáy in chữ đen, cánh sen hồng úp trên nắp ngả ra ngoài, lá dứa, ống hút cỏ chĩa chéo
   về phía mặt (cột nhỏ). P(cột, hàng, w, h, màu) vẽ theo toạ độ của người cầm; c0, r0 = góc trên trái thân cốc;
   tea = số đốt ống hút đang có nước (dâng lên khi hút) */
function motCup(P, c0, r0, tea = 0) {
  P(c0 - 1, r0, 7, 8, OUT); P(c0, r0, 5, 6, '#ffffff'); P(c0 + 1, r0 + 6, 3, 1, '#e9ecef'); P(c0 + 4, r0, 1, 6, '#dee2e6'); P(c0, r0, 1, 6, '#f8f9fa');
  P(c0 + 1, r0 + 3, 3, 1, '#2b1f2b');                                                                      // chữ MÓT
  P(c0 + 5, r0 - 3, 1, 2, '#2f9e44'); P(c0 + 6, r0 - 5, 1, 2, '#51cf66');                                   // lá dứa
  P(c0 - 1, r0 - 1, 7, 1, '#c2255c'); P(c0, r0 - 2, 6, 1, '#f06595'); P(c0 + 2, r0 - 3, 4, 1, '#f783ac'); P(c0 + 3, r0 - 4, 2, 1, '#faa2c1');
  P(c0 + 1, r0 - 2, 1, 1, '#ffc9de'); P(c0 + 4, r0 - 4, 1, 1, '#ffe3ee');                                   // cánh sen
  [[1, -2], [0, -3], [-1, -4], [-1, -5]].forEach(([c, r], i) => P(c0 + c, r0 + r, 1, 1, i < tea ? '#7a2e10' : '#8a9a3a'));   // ống hút cỏ
}
const MOT_AT = { cup: [14, 4], sip: [12, 1], toast: [20, -3] };   // vị trí thân cốc theo tay: khi hút, đầu ống hút chạm miệng (cột 11, hàng -4)
function drawProps(a) {
  const f = a._f; if (!f) return; const dir = a.face, k = actorSeed(a);
  if (a.pose === 'eat') {
    // bát đặt trên lòng (giữa thân, ngang vạt áo); tay trái buông giữ thành bát
    const [bx, by] = handPt(a, 9, 5), [bx2] = handPt(a, 10, 5); drawBowl((bx + bx2) / 2, by, k);
    if (f.arm === 'lift') {            // tay phải đưa đũa tới miệng, sợi bún thòng từ miệng xuống bát rồi được húp dần
      const [hx, hy] = handPt(a, 14, -2), ph = ((a.poseT + k) % 2.8 - 1.1) / .7, len = Math.max(0, Math.round(8 * (1 - ph)));
      const [mx, my] = handPt(a, 11, -3), [mx2] = handPt(a, 10, -3), nx = Math.min(mx, mx2);
      for (let i = 0; i < len; i++) { fr('#fff3d6', nx + (i % 2), my + i, 1, 1); fr('#f1e3c8', nx + ((i + 1) % 2), my + i, 1, 1); }
      for (let i = 0; i < 3; i++) fr('#8a5a2a', hx - dir * (i + 1), hy - 1 - (i >> 1), 1, 1);   // đôi đũa nằm ngang tới khoé miệng
    } else {                           // tay phải cầm đũa gắp trong bát
      const [hx, hy] = handPt(a, 15, 4); for (let i = 0; i < 5; i++) fr('#8a5a2a', hx + dir * (1 - Math.floor(i * .75)), hy - 2 + i, 1, 1);
    }
  }
  if (a.pose === 'drink' || a.pose === 'offer') {
    const [col, row] = f.arm === 'lift' ? [11, -5] : f.arm === 'point' ? [21, -3] : [14, 0], [cx, cy] = handPt(a, col, row);
    drawCup(cx - (dir > 0 ? 0 : 2), cy, k, f.arm !== 'lift');
  }
  if (a.pose === 'mot' || a.pose === 'cheer') {
    const [c0, r0] = MOT_AT[f.arm] || MOT_AT.cup, [x0, y0] = handPt(a, 0, 0), tea = f.arm === 'sip' ? Math.min(4, Math.floor((motPhase(a) - 1.3) * 8)) : 0;
    motCup((c, r, w, h, col) => fr(col, dir > 0 ? x0 + c : x0 - c - w + 1, y0 + r, w, h), c0, r0, tea);
  }
  if (a.pose === 'cam') {
    const [cx, cy] = handPt(a, 15, -8), x = dir > 0 ? cx - 3 : cx - 4;
    fr(OUT, x - 1, cy - 1, 9, 7); fr('#343a40', x, cy, 7, 5); fr('#868e96', x + 1, cy, 2, 1); fr('#e03131', x + (dir > 0 ? 5 : 1), cy - 1, 1, 1);
    fr('#1b1b2f', x + (dir > 0 ? 4 : 1), cy + 1, 2, 3); fr('#74c0fc', x + (dir > 0 ? 5 : 1), cy + 2, 1, 1);
  }
  if (a.pose === 'sing' || a.pose === 'guitar') {
    const [x0, y0] = handPt(a, 0, 0), P = (c, r, w, h, col) => fr(col, dir > 0 ? x0 + c : x0 - c - w + 1, y0 + r, w, h);
    const hand = (c, r) => { P(c, r, 1, 1, '#ffe0c2'); P(c + 1, r, 1, 1, '#f5c29a'); P(c, r + 1, 1, 1, '#f5c29a'); P(c + 1, r + 1, 1, 1, '#d99a72'); };
    if (a.pose === 'sing') {   // micro cầm tay: đầu lưới sát miệng, cán đen thò dưới nắm tay
      P(12, -5, 5, 5, OUT); P(13, -4, 3, 3, '#adb5bd'); P(13, -4, 1, 1, '#f1f3f5'); P(15, -3, 1, 1, '#495057'); P(13, -2, 3, 1, '#868e96');
      P(13, 2, 4, 4, OUT); P(14, 2, 2, 3, '#1b1b2f');
    } else {                   // đàn guitar ôm trên đùi: cần chéo lên về phía tay sau, hai bàn tay vẽ đè lên đàn
      for (let i = 0; i <= 11; i++) { const c = 9 - i, r = 4 - Math.round(i * 4 / 11); P(c, r - 1, 1, 4, OUT); P(c, r, 1, 2, '#6b3f1c'); P(c, r, 1, 1, i % 3 ? '#a07a4c' : '#e9ecef'); }
      P(-6, -2, 5, 4, OUT); P(-5, -1, 3, 2, '#3a2210'); P(-5, -2, 1, 1, '#ced4da'); P(-3, -2, 1, 1, '#ced4da');
      const B = [[2, 11, 15], [3, 10, 16], [4, 10, 16], [5, 11, 15], [6, 10, 17], [7, 9, 17], [8, 9, 17], [9, 10, 16]];
      P(11, 1, 5, 1, OUT); P(10, 10, 7, 1, OUT); for (const [r, c0, c1] of B) P(c0 - 1, r, c1 - c0 + 3, 1, OUT);
      for (const [r, c0, c1] of B) { P(c0, r, c1 - c0 + 1, 1, '#c8752e'); P(c0, r, 2, 1, '#e8a55a'); P(c1 - 1, r, 2, 1, '#8a4a1a'); }
      P(12, 4, 2, 2, '#2a1a10'); P(11, 8, 5, 1, '#4a2a14'); P(13, 2, 1, 6, 'rgba(255,255,255,.35)');   // lỗ thoát âm, ngựa đàn, dây
      const [hc, hr] = ARMS[f.arm][2]; hand(hc, hr); hand(0, 1);
    }
  }
  if (a.pose === 'kneel') {
    const [hx0, hy] = handPt(a, 21, 0), [hx1] = handPt(a, 22, 0), hx = Math.min(hx0, hx1) + (a.face > 0 ? -2 : -10);
    ctx.drawImage(S.ring, hx, hy - 12); glow(hx + 7, hy - 6, 12, '#fff3bf', .2 + Math.sin(time * 5) * .05);
    if (Math.floor(time * 3) % 3 === 0) { fr('#ffffff', hx + 10, hy - 15, 1, 3); fr('#ffffff', hx + 9, hy - 14, 3, 1); }
  }
}
function drawEmote(a, img) {
  if (!a.emote) return;
  const seat = a.pose === 'eat' || a.pose === 'sit' ? 2 : 0, x = Math.round(a.x - cam + 1), y = Math.round(GY - 30 + a.hop - (a.lift || 0) - 26 - Math.sin(time * 5) * 1.5 + (a.spr === 'father' ? 8 : 0) + (a.pose === 'kneel' ? 5 : 0) + seat);
  if (a.emote === 'heart') { ctx.drawImage(S.heart, x, y + 2); return; }
  if (a.emote === 'sweat') { fr('#74c0fc', x + 15, y + 12, 3, 4); fr('#74c0fc', x + 16, y + 10, 1, 2); fr('#ffffff', x + 15, y + 13, 1, 1); return; }
  fr(OUT, x - 1, y - 1, 15, 14); fr('#ffffff', x, y, 13, 12); fr(OUT, x + 2, y + 13, 3, 2); fr('#ffffff', x + 3, y + 12, 1, 1);
  if (a.emote === '!') { fr('#e8364f', x + 5, y + 2, 3, 6); fr('#e8364f', x + 5, y + 9, 3, 2); }
  if (a.emote === '?') { fr('#1c7ed6', x + 4, y + 2, 5, 2); fr('#1c7ed6', x + 8, y + 3, 2, 3); fr('#1c7ed6', x + 6, y + 5, 2, 2); fr('#1c7ed6', x + 6, y + 9, 2, 2); }
  if (a.emote === '...') for (let d = 0; d < 3; d++) fr((Math.floor(time * 3) % 3) >= d ? '#495057' : '#ced4da', x + 2 + d * 4, y + 5, 2, 2);
}
function drawActors() {
  const list = Object.values(actors).filter(a => a.vis);
  ctx.globalAlpha = .22; for (const a of list) { if (a.noShadow) continue; const sx = Math.round(a.x - cam + 6), gy = GY - Math.round(a.lift || 0), sc = a.hop < 0 ? Math.max(.4, 1 + a.hop / 40) : 1, w = Math.round(16 * sc); fr('#1b1b2f', sx - (w >> 1), gy - 1, w, 2); fr('#1b1b2f', sx - (w >> 1) + 3, gy + 1, w - 6, 1); } ctx.globalAlpha = 1;
  const sp = dlg && dlg.speaker;
  for (const a of list) {
    const img = actorImg(a), f = a._f;
    if (a.spr === 'father') { fr('#c9a26b', a.x - 12 - cam, GY - 3, 42, 3); fr('#e0bf85', a.x - 12 - cam, GY - 3, 42, 1); ds(a.face < 0 ? flipped(img) : img, a.x - 4, GY - img.height + 1); ds(S.cup, a.x - 14, GY - 7); continue; }
    const moving = a.target != null, seed = actorSeed(a), bob = 0;           // nhún khi đi đã nằm sẵn trong khung chân
    const still = !moving && a.hop === 0 && a.pose !== 'kneel';
    const talking = sp === a.name && dlg.shown < dlg.full.length;
    const breathe = Math.floor((time + a.name.length) * 1.1) % 2;
    const nod = sp && sp !== a.name && ((time + seed) % 1.9) < .22;           // người nghe gật gù
    const laugh = f.face === 'H' && Math.floor(time * 8) % 2;                // cười rung vai
    const drop = still && (talking ? Math.floor(time * 4.5 + seed) % 2 : nod || laugh || breathe);
    const shiver = a.pose === 'cold' ? (Math.floor(time * 20) % 2) : 0;      // run lập cập
    const y = GY - 30 + a.hop + bob - Math.round(a.lift || 0);   // lift: đứng trên mỏm đá (+) / chìm dưới nước (−)
    a._top = Math.round(y + 30 - (img.height - 1)); a._drop = !!drop;
    if (a.spin != null) {   // lộn nhào: xoay ảnh theo bước 90° quanh tâm người
      const src = a.face < 0 ? flipped(img) : img, cx = Math.round(a.x - cam + 6), cy = Math.round(y + 30 - 15);
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.round(a.spin * 4) * Math.PI / 2 * a.face); ctx.drawImage(src, -(src.width >> 1), -(src.height >> 1) - 1); ctx.restore(); continue;
    }
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
