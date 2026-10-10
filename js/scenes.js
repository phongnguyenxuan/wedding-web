/* ================== KỊCH BẢN ================== */
const nm = k => ({ G: CONFIG.groom, B: CONFIG.bride, P: guest.name, F: 'Bố ' + CONFIG.bride, '': '' }[k] ?? k);
/* ================== HÀNH TRÌNH: BẢN ĐỒ & BỐI CẢNH ================== */
const CITIES = { hanoi: ['Hà Nội', 105.85, 21.03], namdinh: ['Nam Định', 106.17, 20.42], hoabinh: ['Hòa Bình', 105.34, 20.82], danang: ['Đà Nẵng', 108.22, 16.05], hoian: ['Hội An', 108.33, 15.88], dalat: ['Đà Lạt', 108.44, 11.94], quynhon: ['Quy Nhơn', 109.22, 13.78], phuquoc: ['Phú Quốc', 103.97, 10.22] };
const VN = [[102.1,22.4],[103.5,22.7],[105.3,23.3],[106.7,22.9],[107.9,21.6],[106.7,20.7],[106.0,19.9],[105.8,19.1],[106.5,17.9],[107.2,16.9],[108.2,16.1],[108.9,15.2],[109.3,13.9],[109.4,12.6],[109.2,11.6],[108.4,11.0],[107.2,10.4],[106.7,9.6],[105.3,8.6],[104.8,8.8],[104.9,10.2],[105.1,10.6],[106.1,11.0],[106.8,11.8],[107.6,12.6],[107.6,14.0],[107.5,15.3],[106.7,16.3],[105.9,17.6],[105.1,18.6],[104.0,19.3],[104.2,20.0],[103.5,20.8],[102.9,21.3]];
let mapAnim = null, flashA = 0, sceneT = 0;
const MX = 48, MY = 42, MK = 11;
const mp = (lon, lat) => [MX + (lon - 102) * MK, MY + (23.4 - lat) * MK];
let mapC = null;
function mapBase() {
  if (mapC) return mapC; const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
  x.fillStyle = '#1b2a4a'; x.fillRect(MX - 14, MY - 14, 8.5 * MK + 28, 15.2 * MK + 28);
  x.fillStyle = '#243a63'; for (let yy = MY - 14; yy < MY + 15.2 * MK + 14; yy += 4) x.fillRect(MX - 14, yy, 8.5 * MK + 28, 1);
  x.beginPath(); VN.forEach(([lo, la], i) => { const [px, py] = mp(lo, la); i ? x.lineTo(px, py) : x.moveTo(px, py); }); x.closePath();
  x.fillStyle = '#51cf66'; x.fill(); x.lineWidth = 2; x.strokeStyle = '#2b8a3e'; x.stroke();
  const [px, py] = mp(103.97, 10.22); x.fillStyle = '#51cf66'; x.fillRect(Math.round(px) - 2, Math.round(py) - 4, 4, 8);
  const id = x.getImageData(0, 0, W, H); for (let i = 3; i < id.data.length; i += 4) id.data[i] = id.data[i] > 100 ? 255 : 0; x.putImageData(id, 0, 0);
  return mapC = c;
}
function drawMap() {
  if (!mapAnim) return; const m = mapAnim; ctx.drawImage(mapBase(), 0, 0);
  const order = CHAPTERS.map(c => c.city), k = order.indexOf(m.to);
  for (let i = 1; i <= k; i++) { const a = mp(...CITIES[order[i - 1]].slice(1)), b = mp(...CITIES[order[i]].slice(1)), steps = Math.max(6, Math.hypot(b[0] - a[0], b[1] - a[1]) / 4) | 0;
    const lim = i === k ? Math.min(1, m.t / .8) : 1;
    for (let s = 0; s <= steps * lim; s += 1) if (s % 2 === 0) fr('#ffd43b', a[0] + (b[0] - a[0]) * s / steps, a[1] + (b[1] - a[1]) * s / steps, 2, 2); }
  order.slice(0, k + 1).forEach((c, i) => { const [px, py] = mp(...CITIES[c].slice(1)); fr(i === k ? '#ff6b8b' : '#fff3bf', px - 2, py - 2, 5, 5); fr(OUT, px - 1, py - 1, 3, 3); });
  const [px, py] = mp(...CITIES[m.to].slice(1)); if (m.t > .9 && Math.floor(time * 4) % 2) ctx.drawImage(S.heart, Math.round(px - 6), Math.round(py - 16));
  if (k > 0 && m.t < .9) { const a = mp(...CITIES[order[k - 1]].slice(1)), b = mp(...CITIES[order[k]].slice(1)), f = m.t / .9, x = a[0] + (b[0] - a[0]) * f, y = a[1] + (b[1] - a[1]) * f;
    fr('#ffffff', x - 4, y - 1, 9, 3); fr('#ffffff', x - 1, y - 4, 3, 9); fr('#ffffff', x - 3, y + 3, 7, 1); fr('#1c7ed6', x - 1, y, 2, 1); }
  const lbl = pixText(CITIES[m.to][0], 16, '#ffffff'); ctx.drawImage(lbl, Math.round(px + 7), Math.round(py - 10));
}
function drawTripGround(g, x, w, theme) {
  if (theme === 'hanoi') {   // vỉa hè lát gạch, bó vỉa đá
    fr('#8b8580', x, g.y, w, H - g.y); const x0 = Math.max(g.x, cam - 16), x1 = Math.min(g.x + w, cam + W + 16);
    for (let yy = g.y + 4, r = 0; yy < H; yy += 7, r++) { fr('#6d6763', x, yy, w, 1);
      for (let xx = g.x + (r % 2) * 7 + Math.max(0, Math.floor((x0 - g.x) / 14)) * 14; xx < x1; xx += 14) { fr('#6d6763', xx - cam, yy, 1, 7); const n = rnd(xx * .37 + r * 17);
        if (n > .8) fr('#968f8a', xx - cam + 1, yy + 1, 13, 6); else if (n < .05) { fr('#5e5048', xx - cam + 1, yy + 1, 13, 6); fr('#4a3e36', xx - cam + 3, yy + 3, 4, 2); } else if (n < .1) fr('#c9a227', xx - cam + 4, yy + 3, 2, 1); } }
    fr('#d7d9dc', x, g.y, w, 2); fr('#a3a7ab', x, g.y + 2, w, 2); fr('#5c636a', x, g.y + 4, w, 1);
    return true;
  }
  if (theme === 'danang') { dnGround(); return true; }   // js/danang.js
  if (theme === 'hoian') { haGround(); return true; }   // js/hoian.js
  if (theme === 'dalat') { dlGround(); return true; }   // js/dalat.js
  if (theme === 'hoabinh') { hbGround(); return true; }   // js/hoabinh.js
  if (theme === 'namdinh') { ndGround(); return true; }   // cát ướt đã vẽ (soi gương) trong ndScene
  if (theme === 'quynhon') { qnGround(); return true; }   // js/quynhon.js
  if (theme === 'phuquoc') { pqGround(); return true; }   // js/phuquoc.js
  if (theme === 'pqdinner') { pqrGround(); return true; }   // quán vintage Phú Quốc (js/phuquoc.js)
  return false;
}
function drawHanoiStall() {
  if (L.theme !== 'hanoi') return;
  const X = v => Math.round(v - cam), fl = Math.sin(time * 9) * .02;
  // xe máy dựng trên vỉa hè
  hnVeh(HN_PARK[0], X(18), GY + 1, 1, false); hnVeh(HN_PARK[1], X(40), GY + 1, -1, false); hnVeh(HN_PARK[3], X(62), GY + 1, 1, false);
  // biển tên phố trên cột sơn đỏ trắng
  const px = X(186); for (let i = 0; i < 13; i++) fr(i % 2 ? '#e03131' : '#f1f3f5', px, GY - 78 + i * 6, 3, 6); fr('#5c636a', px - 1, GY - 1, 5, 1);
  fr('#f1f3f5', px - 26, GY - 105, 55, 30); fr('#1c4fa0', px - 25, GY - 104, 53, 28); fr('#3b6fc8', px - 25, GY - 104, 53, 1); fr('#163f80', px - 25, GY - 77, 53, 1);
  ctx.drawImage(pixText('PHỐ', 12, '#ffffff'), px - 23, GY - 106); const sn = pixText('HÀNG MÃ', 14, '#ffffff'); ctx.drawImage(sn, px + 2 - (sn.width >> 1), GY - 92);
  const sx = X(330);
  // chồng ghế nhựa xanh, cột & biển hiệu, bóng đèn
  for (let i = 0; i < 5; i++) fr(i % 2 ? '#1864ab' : '#1c7ed6', sx - 24, GY - 10 - i * 2, 11, 2); fr('#1864ab', sx - 23, GY - 8, 1, 8); fr('#1864ab', sx - 15, GY - 8, 1, 8);
  fr('#3b2a2a', sx - 8, GY - 62, 2, 62); fr('#3b2a2a', sx + 60, GY - 62, 2, 62);
  fr('#c92a2a', sx - 10, GY - 78, 74, 18); fr('#e8594a', sx - 10, GY - 78, 74, 1); fr('#a61e1e', sx - 10, GY - 62, 74, 2); const bt = pixText('BÚN RIÊU', 16, '#ffd43b'); ctx.drawImage(bt, sx + 27 - (bt.width >> 1), GY - 81);
  fr('#3b2a2a', sx + 26, GY - 60, 1, 5); fr('#fff3bf', sx + 25, GY - 55, 3, 3); glow(sx + 26, GY - 52, 22, '#ffd98a', .13 + fl);
  // cô bán hàng sau tủ kính, tay khuấy nồi
  const vx = sx + 8, vy = GY - 58, lb = Math.round(Math.sin(time * 2.4) * 1.5);
  fr(OUT, vx + 2, vy - 4, 6, 3); fr('#2b1b17', vx + 3, vy - 3, 4, 2); fr(OUT, vx - 1, vy - 1, 12, 11); fr('#f5c29a', vx, vy, 10, 9); fr('#2b1b17', vx, vy, 10, 3); fr('#2b1b17', vx, vy + 3, 1, 3); fr('#2b1b17', vx + 9, vy + 3, 1, 3);
  fr(OUT, vx + 2, vy + 5, 1, 2); fr(OUT, vx + 7, vy + 5, 1, 2); fr('#ff8fa3', vx + 1, vy + 7, 1, 1); fr('#ff8fa3', vx + 8, vy + 7, 1, 1); fr('#c2410c', vx + 4, vy + 7, 2, 1);
  fr(OUT, vx - 3, vy + 9, 17, 6); fr('#f783ac', vx - 2, vy + 10, 15, 5); fr('#4dabf7', vx + 1, vy + 11, 8, 4); fr('#f783ac', vx + 12, vy + 10 + lb, 14, 2); fr('#f5c29a', vx + 26, vy + 10 + lb, 2, 2);
  // nồi riêu cua trên bếp than tổ ong
  fr('#5c636a', sx + 39, GY - 12, 16, 12); fr('#495057', sx + 39, GY - 12, 16, 1); for (let i = 0; i < 3; i++) fr(Math.floor(time * 6 + i) % 3 ? '#e8590c' : '#ffa94d', sx + 42 + i * 4, GY - 7, 2, 2); glow(sx + 47, GY - 9, 9, '#ff922b', .18 + fl);
  fr('#868e96', sx + 37, GY - 30, 20, 18); fr('#ced4da', sx + 38, GY - 30, 18, 18); fr('#f1f3f5', sx + 39, GY - 29, 3, 16); fr('#adb5bd', sx + 52, GY - 29, 3, 16); fr('#f8f9fa', sx + 36, GY - 31, 22, 2);
  fr('#495057', sx + 34, GY - 27, 3, 2); fr('#495057', sx + 57, GY - 27, 3, 2); fr('#e8590c', sx + 38, GY - 32, 18, 1); fr('#ffa94d', sx + 40, GY - 33, 3, 1); fr('#ffa94d', sx + 48, GY - 33, 4, 1); fr('#51cf66', sx + 45, GY - 33, 1, 1); fr('#51cf66', sx + 53, GY - 33, 1, 1);
  fr('#adb5bd', sx + 34, vy + 11 + lb, 1, GY - 32 - vy - 11 - lb); fr('#adb5bd', sx + 34, GY - 33, 6, 1);   // muôi
  // tủ kính xe đẩy: đậu rán, cà chua, rau, bún
  fr('#adb5bd', sx - 2, GY - 44, 38, 20); fr('#cfe3ef', sx, GY - 42, 34, 16); fr('#ebf6fc', sx + 1, GY - 42, 2, 16); fr('#868e96', sx, GY - 34, 34, 1);
  fr('#2f9e44', sx + 4, GY - 38, 12, 3); for (let i = 0; i < 5; i++) fr('#69db7c', sx + 4 + i * 2 + (i % 2), GY - 39, 1, 1); fr('#f8f9fa', sx + 19, GY - 40, 12, 5); fr('#dee2e6', sx + 19, GY - 38, 12, 1);
  for (let i = 0; i < 4; i++) { fr('#f2c14e', sx + 3 + i * 4, GY - 31, 3, 3); fr('#d9a03a', sx + 3 + i * 4, GY - 29, 3, 1); } for (let i = 0; i < 3; i++) { fr('#e03131', sx + 20 + i * 4, GY - 31, 3, 3); fr('#ff8787', sx + 20 + i * 4, GY - 31, 1, 1); }
  fr('#ffffff', sx + 2, GY - 47, 10, 3); fr('#dee2e6', sx + 2, GY - 45, 10, 1); fr('#ffffff', sx + 3, GY - 49, 8, 2);   // chồng bát
  fr('#a0784c', sx + 27, GY - 48, 4, 4); fr('#e9d8a6', sx + 27, GY - 51, 1, 3); fr('#e9d8a6', sx + 29, GY - 52, 1, 4);   // ống đũa
  fr('#495057', sx, GY - 24, 34, 20); fr('#868e96', sx + 2, GY - 24, 30, 2); fr('#f03e3e', sx + 10, GY - 5, 14, 5); fr('#ff6b6b', sx + 10, GY - 5, 14, 1);
  for (const wx of [sx + 2, sx + 26]) { fr('#1b1b2f', wx, GY - 6, 6, 6); fr('#868e96', wx + 2, GY - 4, 2, 2); }
  fr('#3b2a2a', sx - 21, GY - 56, 1, 4); fr('#3b2a2a', sx - 13, GY - 56, 1, 4); fr('#f8f9fa', sx - 25, GY - 52, 17, 11); fr('#adb5bd', sx - 25, GY - 42, 17, 1); ctx.drawImage(pixText('40K', 12, '#c92a2a'), sx - 24, GY - 54);   // bảng giá
  // bàn nhựa thấp: bát bún, tương ớt, rau sống, đũa, giấy ăn, chanh, mắm tôm
  const tx = X(250); fr('#1c7ed6', tx, GY - 16, 36, 4); fr('#4dabf7', tx, GY - 16, 36, 1); fr('#1864ab', tx + 3, GY - 12, 3, 12); fr('#1864ab', tx + 30, GY - 12, 3, 12);
  fr('#e03131', tx + 15, GY - 19, 2, 3); fr('#2f9e44', tx + 18, GY - 18, 2, 2);
  fr('#a0784c', tx + 1, GY - 20, 3, 4); fr('#e9d8a6', tx + 1, GY - 23, 1, 3); fr('#e9d8a6', tx + 3, GY - 22, 1, 2); fr('#ffc9c9', tx + 32, GY - 20, 4, 4); fr('#ffffff', tx + 33, GY - 21, 2, 1);
  if (props.eating) { fr('#f8f9fa', tx + 8, GY - 17, 5, 1); fr('#82c91e', tx + 8, GY - 18, 2, 1); fr('#82c91e', tx + 11, GY - 18, 1, 1); fr('#f8f9fa', tx + 22, GY - 18, 4, 2); fr('#b07aa1', tx + 22, GY - 18, 4, 1); }
  // giá đèn ông sao, thùng hàng của cửa hàng bên cạnh
  const rx = X(404); fr('#adb5bd', rx, GY - 54, 2, 54); fr('#adb5bd', rx + 46, GY - 54, 2, 54); fr('#ced4da', rx - 2, GY - 55, 52, 2); fr('#ced4da', rx, GY - 30, 48, 1);
  for (let i = 0; i < 6; i++) { const hx = rx + 3 + i * 7, sw = Math.round(Math.sin(time * 1.8 + i) * 1), hy = GY - 51 + (i % 2) * 5; fr('#3b2a2a', hx + 3, GY - 53, 1, hy - GY + 53);
    if (i % 2) hnBall(SP(hx + 1 + sw, hy), 0, 0, ['#e03131', '#ff8fab', '#f08c00'][i % 3]); else star(hx + sw, hy, ['#e03131', '#ffd43b', '#ff8fab'][(i >> 1) % 3]); }
  for (let i = 0; i < 6; i++) { const mx = rx + 3 + i * 7; fr('#3b2a2a', mx + 3, GY - 29, 1, 2); fr(i % 2 ? '#f8f0e3' : '#ffd8a8', mx, GY - 27, 6, 7); fr('#1b1b2f', mx + 1, GY - 25, 1, 1); fr('#1b1b2f', mx + 4, GY - 25, 1, 1); fr('#ff6b6b', mx + 2, GY - 22, 2, 1); fr(HN_GOODS[i], mx, GY - 28, 6, 1); }
  for (const [bx, by, bw, bh] of [[452, 12, 20, 12], [455, 22, 15, 10]]) { const b = X(bx); fr('#c8a06a', b, GY - by, bw, bh); fr('#a07a48', b, GY - by + (bh >> 1), bw, 1); fr('#e9d8a6', b + (bw >> 1) - 1, GY - by, 2, bh); }
  const ted = X(457); fr('#f3d9c4', ted, GY - 31, 9, 9); fr('#f3d9c4', ted + 1, GY - 38, 7, 7); fr('#f3d9c4', ted, GY - 40, 2, 2); fr('#f3d9c4', ted + 7, GY - 40, 2, 2); fr('#1b1b2f', ted + 3, GY - 35, 1, 1); fr('#1b1b2f', ted + 6, GY - 35, 1, 1); fr('#3b2a2a', ted + 4, GY - 33, 2, 1); fr('#e03131', ted + 2, GY - 31, 5, 1);
  if (!props.eating) for (const bx of [tx + 5, tx + 21]) { fr('#ffffff', bx, GY - 21, 10, 5); fr('#e8590c', bx + 1, GY - 21, 8, 2); fr('#ffd8a8', bx + 3, GY - 22, 2, 1); fr('#51cf66', bx + 6, GY - 22, 2, 1); }
  for (const s of [228, 294]) { const x = Math.round(s - cam); fr('#e03131', x, GY - 7, 10, 3); fr('#ff6b6b', x, GY - 7, 10, 1); fr('#c92a2a', x + 1, GY - 4, 2, 4); fr('#c92a2a', x + 7, GY - 4, 2, 4); }   // ghế nhựa đỏ thấp
}
function tripSky(theme, id) {
  if (theme === 'hanoi') { ditherInto(id, W, ['#1a1838', '#35295a', '#6a3a6c', '#b05a6a', '#e08a6a'], 0, 160); ditherInto(id, W, ['#e08a6a', '#e08a6a'], 160, H); return true; }
  if (theme === 'namdinh') { ndSky(id); return true; }
  if (theme === 'hoabinh') { hbSky(id); return true; }
  if (theme === 'danang') { dnSky(id); return true; }
  if (theme === 'hoian') { haSky(id); return true; }
  if (theme === 'dalat') { dlSky(id); return true; }
  if (theme === 'quynhon') { qnSky(id); return true; }
  if (theme === 'phuquoc') { pqSky(id); return true; }
  if (theme === 'pqdinner') { pqrSky(id); return true; }
  return false;
}
/* ---- sprite phụ trợ ---- */
const sunCache = {};
function sun(r0, r1, cin, cout) {
  const key = [r0, r1, cin, cout].join(); if (sunCache[key]) return sunCache[key];
  const d = r1 * 2 + 1, c = document.createElement('canvas'); c.width = d; c.height = d; const x = c.getContext('2d'), id = x.createImageData(d, d), a = hexRGB(cin), b = hexRGB(cout);
  for (let y = 0; y < d; y++) for (let xx = 0; xx < d; xx++) { const dist = Math.hypot(xx - r1, y - r1); if (dist > r1) continue; const t = dist <= r0 ? 0 : (dist - r0) / (r1 - r0), th = (BAYER[y & 3][xx & 3] + .5) / 16, p = (y * d + xx) * 4;
    const col = t < th * .6 ? a : t < th ? b : null; if (col) { id.data[p] = col[0]; id.data[p + 1] = col[1]; id.data[p + 2] = col[2]; id.data[p + 3] = 255; } }
  x.putImageData(id, 0, 0); return sunCache[key] = c;
}
const loopX = (speed, off, span = W + 80) => ((((sceneT * speed + off) % span) + span) % span) - 40;
function bird(x, y, col, k) { const f = Math.floor(time * 5 + k) % 2; x = Math.round(x); y = Math.round(y); fr(col, x, y, 5, 1); fr(col, x - 2, y - (f ? 2 : 0), 2, 1); fr(col, x + 5, y - (f ? 2 : 0), 2, 1); if (f) { fr(col, x - 1, y - 1, 1, 1); fr(col, x + 5, y - 1, 1, 1); } }
function sparkles(y0, y1, n, seed, col = '#ffffff') { for (let i = 0; i < n; i++) { const ph = Math.floor(time * 5 + i * 3.7) % 9; if (ph > 1) continue; const x = Math.floor(rnd(seed + i) * W), y = y0 + Math.floor(rnd(seed + i + 50) * (y1 - y0)); fr(col, x, y, 1, 1); if (ph === 0) { fr(col, x - 1, y, 3, 1); fr(col, x, y - 1, 1, 3); } } }
function waves(y0, y1, cols, speed, seed) { for (let y = y0, r = 0; y < y1; y += 4, r++) { const len = 6 + Math.floor((y - y0) / 6), sp = speed * (0.4 + (y - y0) / (y1 - y0)); for (let i = 0; i < 9; i++) { const x = ((rnd(seed + r * 9 + i) * W + sceneT * sp * (r % 2 ? 1 : -.6)) % (W + 20) + W + 20) % (W + 20) - 10; fr(cols[(r + i) % cols.length], x, y + Math.round(Math.sin(sceneT * 2 + i) * .6), len, 1); } } }
/* ---- xe cộ phố Hà Nội ----
   Mọi xe vẽ theo hướng sang phải, gốc (x, base) = mép trái, đáy bánh xe; P(i, j…) tự lật khi dir < 0. */
function hnWheel(P, i, s, spin) { P(i, -s, s, s, '#1b1b2f'); P(i + 1, 1 - s, s - 2, s - 2, spin ? '#868e96' : '#5c636a'); if (s > 4) P(i + (s >> 1) - 1, -(s >> 1) - 1, 2, 2, '#ced4da'); }
function hnRing(P, i, spin) { const c = '#1b1b2f'; P(i + 1, -6, 4, 1, c); P(i + 1, -1, 4, 1, c); P(i, -5, 1, 4, c); P(i + 5, -5, 1, 4, c); P(i + 2, -4, 2, 2, '#868e96'); P(spin ? i + 1 : i + 4, spin ? -5 : -2, 1, 1, '#adb5bd'); }
/* người ngồi xe: i = mép trái thân, j = mặt yên. o: shirt, pants, skin, helmet, hair, non (nón lá), coi (mũ cối), mask, reach, ped
   boy phố: tank (áo ba lỗ, tay trần), cut (tóc ngắn dựng đứng, màu nhuộm), shades (kính đen), cheer (giơ tay hò hét),
            cap (mũ lưỡi trai), spear (vác phóng lợn: cán gỗ dài nghiêng về trước, lưỡi sắt trên đỉnh) */
function hnRider(P, i, j, o) {
  const sk = o.skin || '#f5c29a', pn = o.pants || '#343a40', r = o.reach || 4;
  let sx = null;   // sx(y): toạ độ x của cán phóng lợn tại hàng y
  if (o.spear) {
    const lean = 4 + Math.round(Math.sin(time * 3 + i) * 1.2), top = j - 34; sx = y => i + 3 + Math.round((j - 2 - y) / 32 * lean);
    for (let y = top; y <= j - 2; y++) { P(sx(y) - 1, y, 3, 1, '#1b1622'); P(sx(y), y, 1, 1, '#c08a52'); }   // cán gỗ viền tối cho nổi trên nền phố
    const tx = sx(top); P(tx - 2, top - 7, 5, 8, '#1b1622'); P(tx - 1, top - 9, 3, 2, '#1b1622');
    P(tx - 1, top, 3, 1, '#868e96'); P(tx - 1, top - 6, 3, 6, '#ced4da'); P(tx - 1, top - 6, 1, 6, '#ffffff'); P(tx, top - 8, 1, 2, '#e9ecef');
    if (Math.floor(time * 3 + i) % 7 === 0) P(tx, top - 5, 1, 1, '#ffffff');   // lưỡi loé sáng
  }
  P(i + 1, j - 1, 5, 2, pn); P(i + 5, j - 1, 2, o.ped ? 6 : 4, pn); P(i + 5, j + (o.ped ? 5 : 3), 3, 1, o.cut ? '#1c7ed6' : '#1b1b2f');
  P(i, j - 8, 5, 7, o.shirt); P(i, j - 8, 1, 7, 'rgba(0,0,0,.22)'); if (o.stripe) P(i, j - 5, 5, 1, o.stripe);
  if (o.tank) { P(i + 1, j - 8, 3, 1, sk); P(i + 1, j - 7, 1, 2, sk); }
  if (o.cheer) { const wv = Math.round(Math.sin(time * 12 + i)); P(i - 1, j - 13, 2, 6, sk); P(i - 1 + wv, j - 16, 2, 3, sk); P(i - 2 + wv, j - 17, 1, 1, sk); P(i + wv, j - 17, 1, 1, sk); }   // tay giơ sau gáy, vẫy
  else if (!o.spear) { P(i + 3, j - 6, r, 2, o.tank ? sk : o.shirt); P(i + 3 + r, j - 6, 1, 1, sk); }
  if (sx) { const hx = sx(j - 7); P(i + 2, j - 7, Math.max(1, hx - i - 2), 2, sk); P(hx, j - 8, 2, 3, sk); }   // tay nắm cán ngang ngực
  P(i + 1, j - 12, 4, 4, sk); P(i + 4, j - 11, 1, 1, '#1b1b2f'); if (o.mask) P(i + 3, j - 10, 2, 2, o.mask);
  if (o.shades) { P(i + 2, j - 11, 4, 1, '#1b1b2f'); P(i + 4, j - 11, 1, 1, '#4dabf7'); }
  if (o.cut) { P(i, j - 13, 5, 1, o.cut); P(i, j - 12, 2, 2, o.cut); P(i, j - 14, 1, 1, o.cut); P(i + 2, j - 15, 1, 2, o.cut); P(i + 4, j - 14, 1, 1, o.cut); }
  if (o.cap) { P(i, j - 14, 5, 2, o.cap); P(i + 5, j - 13, 2, 1, o.cap); P(i + 1, j - 14, 2, 1, 'rgba(255,255,255,.35)'); }
  if (o.hair) { P(i, j - 13, 5, 2, o.hair); P(i - 1, j - 12, 2, o.helmet ? 7 : 6, o.hair); }
  if (o.helmet) { P(i, j - 14, 6, 2, o.helmet); P(i, j - 12, 2, 3, o.helmet); P(i + 5, j - 12, 1, 1, '#1b1b2f'); P(i + 1, j - 14, 3, 1, 'rgba(255,255,255,.45)'); }
  if (o.non) { P(i - 2, j - 12, 9, 1, '#d9c48a'); P(i - 1, j - 13, 7, 1, '#e9d8a6'); P(i, j - 14, 5, 1, '#e9d8a6'); P(i + 1, j - 15, 3, 1, '#f1e3c8'); P(i + 2, j - 16, 1, 1, '#f1e3c8'); }
  if (o.coi) { P(i - 1, j - 12, 7, 1, '#4b5a2a'); P(i, j - 14, 6, 2, '#6b7a3a'); P(i + 1, j - 15, 4, 1, '#7d8c48'); }
}
function hnBall(P, i, j, c) { P(i + 1, j, 3, 1, '#ffd43b'); P(i, j + 1, 5, 3, c); P(i + 1, j + 1, 1, 2, 'rgba(255,255,255,.35)'); P(i + 1, j + 4, 3, 1, '#ffd43b'); P(i + 2, j + 5, 1, 2, '#ffd43b'); }
function hnStar5(P, i, j, c) { P(i + 2, j, 1, 1, c); P(i, j + 1, 5, 1, c); P(i + 1, j + 2, 3, 1, c); P(i + 1, j + 3, 1, 1, c); P(i + 3, j + 3, 1, 1, c); }
function hnLoad(P, v) {
  const L0 = v.load;
  if (L0 === 'boxes') { for (const [i, j, c] of [[-3, -15, '#c8a06a'], [-2, -22, '#d4ae78'], [-3, -29, '#c8a06a']]) { P(i, j, 9, 7, c); P(i, j + 3, 9, 1, '#a07a48'); P(i + 4, j, 1, 7, '#e9d8a6'); } P(2, -29, 1, 21, '#343a40'); }
  if (L0 === 'ship') { P(-1, -19, 8, 11, '#e8590c'); P(-1, -19, 8, 1, '#ff922b'); P(1, -15, 4, 2, '#fff3bf'); P(-1, -9, 8, 1, '#a63e09'); }
  if (L0 === 'gas') { P(0, -17, 5, 9, '#e03131'); P(1, -19, 3, 2, '#adb5bd'); P(0, -13, 5, 1, '#ffd43b'); P(1, -16, 1, 6, '#ff8787'); }
  if (L0 === 'lanterns') { P(2, -40, 1, 32, '#8a6238'); P(-4, -38, 13, 1, '#8a6238'); P(-4, -27, 13, 1, '#8a6238');
    for (let n = 0; n < 6; n++) { const sw = Math.round(Math.sin(time * 3 + n) * .7); if (n % 3 === 1) hnStar5(P, -4 + (n % 3) * 5 + sw, -36 + (n > 2 ? 11 : 0), '#ffd43b'); else hnBall(P, -4 + (n % 3) * 5 + sw, -37 + (n > 2 ? 11 : 0), ['#e03131', '#ff8fab', '#f08c00'][n % 3]); } }
  if (L0 === 'balloons') { P(1, -20, 1, 12, '#8a6238');
    for (let n = 0; n < 8; n++) { const bi = -6 + (n % 4) * 4 + Math.round(Math.sin(time * 1.8 + n) * 1), bj = -44 + (n >> 2) * 6 + (n % 2) * 2, c = ['#ff6b6b', '#ffd43b', '#4dabf7', '#ff8fab', '#51cf66', '#b197fc', '#ffffff', '#ff922b'][n];
      if (n > 3) P(bi + 2, bj + 5, 1, -20 - bj - 4, 'rgba(233,236,239,.35)'); P(bi, bj, 4, 4, c); P(bi + 1, bj + 4, 2, 1, c); P(bi + 1, bj + 1, 1, 1, 'rgba(255,255,255,.7)'); } }
  if (L0 === 'teddy') { const t = '#f3d9c4', d = '#dcb89c';   // gấu bông to ngồi sau như khách
    P(-1, -18, 10, 10, t); P(-1, -18, 1, 10, d); P(-2, -26, 3, 3, t); P(7, -26, 3, 3, t); P(-1, -25, 1, 1, '#e8a1a1'); P(8, -25, 1, 1, '#e8a1a1');
    P(-1, -25, 10, 8, t); P(-1, -25, 1, 8, d); P(2, -22, 1, 1, '#1b1b2f'); P(6, -22, 1, 1, '#1b1b2f'); P(3, -20, 3, 2, '#fff3e6'); P(4, -20, 1, 1, '#3b2a2a');
    P(1, -17, 6, 1, '#e03131'); P(3, -16, 2, 2, '#e03131'); P(8, -14, 3, 2, t); }
}
function hnVeh(v, x, base, dir, night = true, draw = null) {   // draw: thay P mặc định (vẽ vào canvas phụ để xoay xe bốc đầu)
  x = Math.round(x); base = Math.round(base); const w0 = v.w, P = draw || ((i, j, w, h, c) => w > 0 && h > 0 && fr(c, dir > 0 ? x + i : x + w0 - i - w, base + j, w, h));
  const spin = !v.parked && Math.floor(time * 12 + v.k) % 2, t = v.t; let hy = -9;
  if (t === 'moto') {
    const sc = v.scooter, b = v.body;
    if (v.load && v.load !== 'teddy') hnLoad(P, v);
    hnWheel(P, 1, 4, spin); hnWheel(P, 13, 4, spin);
    if (sc) { P(2, -8, 13, 3, b); P(3, -8, 9, 1, 'rgba(255,255,255,.3)'); P(3, -9, 7, 1, '#343a40'); P(12, -11, 3, 4, b); P(12, -12, 4, 1, '#adb5bd'); P(8, -5, 5, 1, '#495057'); P(1, -8, 2, 2, '#ff4d4d'); P(15, -10, 1, 2, '#fff3bf'); hy = -10; }
    else { P(3, -6, 11, 2, b); P(4, -8, 7, 2, '#343a40'); P(12, -10, 2, 6, b); P(11, -11, 4, 1, '#adb5bd'); P(1, -5, 4, 1, '#adb5bd'); P(2, -8, 2, 1, '#ff4d4d'); P(15, -9, 1, 2, '#fff3bf'); P(6, -5, 5, 2, '#495057'); }
    if (v.decal) { P(3, -6, 9, 1, v.decal); P(12, -9, 2, 1, v.decal); P(0, -6, 3, 1, '#ced4da'); P(-1, -7, 1, 2, '#ced4da'); }   // tem xe + ống xả độ chĩa lên
    if (v.parked) { P(5, -2, 1, 2, '#adb5bd'); P(13, -15, 1, 4, '#adb5bd'); if (v.hat) { P(11, -14, 4, 3, v.hat); P(12, -14, 2, 1, 'rgba(255,255,255,.4)'); } return; }
    const j = sc ? -9 : -8;
    if (v.load === 'teddy') hnLoad(P, v);
    if (v.pass2) hnRider(P, -2, j, { ...v.pass2, reach: 3 });   // kẹp ba, người cuối ngồi lòi ra sau đuôi xe
    if (v.pass) hnRider(P, 2, j, { ...v.pass, reach: 3 });
    hnRider(P, 6, j, v.rider);
    if (v.kid) { P(11, -16, 3, 5, v.kid); P(11, -19, 3, 3, '#f5c29a'); P(10, -20, 4, 2, '#ff8fab'); P(13, -18, 1, 1, '#1b1b2f'); }
    const e = Math.floor(time * 6 + v.k) % 5; if (!draw && e < 3) { ctx.globalAlpha = .3 - e * .08; P(-1 - e * 3, -5 - e, 1 + e, 1 + (e >> 1), '#ced4da'); ctx.globalAlpha = 1; }   // khói xe
  } else if (t === 'cyclo') {   // xích lô: khách ngồi trước, người đạp phía sau
    const ped = Math.floor(time * 4 + v.k) % 2;
    P(1, -7, 7, 7, '#1b1b2f'); P(2, -6, 5, 5, '#495057'); P(3, -5, 3, 3, '#1b1b2f'); P(ped ? 3 : 5, ped ? -6 : -2, 1, 1, '#adb5bd'); P(4, -4, 1, 1, '#ced4da');
    P(20, -5, 5, 5, '#1b1b2f'); P(21, -4, 3, 3, spin ? '#868e96' : '#495057');
    P(6, -5, 15, 1, '#adb5bd'); P(7, -12, 1, 7, '#adb5bd'); P(5, -12, 5, 1, '#343a40'); P(ped ? 8 : 10, -4, 2, 1, '#868e96');
    P(16, -9, 11, 3, '#343a40'); P(17, -11, 9, 2, '#c92a2a'); P(15, -17, 2, 9, '#343a40'); P(13, -20, 5, 4, '#212529'); P(13, -20, 5, 1, '#495057'); P(26, -6, 4, 1, '#adb5bd'); P(29, -9, 1, 4, '#adb5bd');
    hnRider(P, 18, -11, { shirt: '#f1f3f5', hair: '#f2c14e', skin: '#f8d5bd', pants: '#c9a87c', reach: 3 }); P(22, -17, 2, 2, '#343a40');
    hnRider(P, 4, -13, { shirt: '#868e96', coi: 1, reach: 9, ped, pants: '#495057' });
    return;
  } else if (t === 'bike') {    // xe đạp chở hoa, cô bán hàng đội nón lá
    const ped = Math.floor(time * 4 + v.k) % 2;
    P(-4, -12, 11, 6, '#8a6238'); P(-4, -10, 11, 1, '#6b4a2a'); P(-4, -8, 11, 1, '#6b4a2a');
    for (let n = 0; n < 16; n++) { const fi = -5 + (n * 5) % 13, fj = -19 + (n * 3) % 7; P(fi + 1, fj + 2, 1, -12 - fj - 2, '#2f9e44'); P(fi, fj, 2, 2, ['#ff6b8b', '#ffd43b', '#ffffff', '#e64980', '#ff922b'][n % 5]); }
    hnRing(P, 0, spin); hnRing(P, 16, spin);
    P(7, -8, 10, 1, '#2b6a8a'); P(3, -3, 15, 1, '#2b6a8a'); P(7, -11, 1, 8, '#2b6a8a'); P(17, -11, 1, 8, '#2b6a8a'); P(6, -12, 4, 1, '#343a40'); P(16, -12, 4, 1, '#adb5bd');
    P(18, -15, 5, 3, '#a0784c'); P(18, -16, 2, 1, '#ff8fab'); P(21, -16, 2, 1, '#ffd43b');
    hnRider(P, 8, -12, { shirt: '#ffc9c9', non: 1, reach: 6, ped, pants: '#5c4a6a' });
    return;
  } else if (t === 'taxi') {
    const b = v.body;
    P(2, -11, 36, 6, b); P(1, -9, 38, 4, b); P(9, -16, 20, 5, b); P(29, -15, 3, 4, b); P(7, -15, 2, 4, b); P(9, -17, 20, 1, 'rgba(255,255,255,.4)');
    P(10, -15, 8, 4, '#24304a'); P(19, -15, 9, 4, '#24304a'); P(29, -14, 2, 3, '#24304a'); P(8, -14, 1, 3, '#24304a'); P(11, -15, 2, 1, '#6d82b0'); P(20, -15, 2, 1, '#6d82b0');
    P(24, -14, 3, 3, '#3b2a2a'); P(18, -11, 1, 5, 'rgba(0,0,0,.25)'); P(1, -8, 38, 1, v.stripe); P(15, -19, 8, 2, '#ffd43b'); P(16, -19, 6, 1, '#fff3bf');
    P(0, -6, 40, 2, '#343a40'); P(31, -12, 2, 1, '#343a40');
    hnWheel(P, 5, 6, spin); hnWheel(P, 28, 6, spin); P(38, -10, 2, 2, '#fff3bf'); P(0, -10, 1, 2, '#ff4d4d'); hy = -10;
  } else if (t === 'bus') {
    P(2, -31, 85, 1, '#e9ecef'); P(1, -30, 87, 15, '#f2b705'); P(1, -15, 87, 9, '#d9480f'); P(1, -15, 87, 1, '#fff3bf'); P(1, -30, 1, 24, 'rgba(0,0,0,.2)');
    for (let i = 5, n = 0; i < 56; i += 10, n++) { P(i, -27, 8, 9, '#ffe8a3'); P(i, -27, 8, 1, '#f5c26b'); P(i, -22, 8, 1, '#c9a35a');
      if (rnd(n + v.k * 7) > .3) { const o = n % 3; P(i + 1 + o, -24, 3, 3, '#3b2a2a'); P(i + o, -21, 5, 3, '#5a4636'); } }
    P(57, -27, 8, 21, '#24304a'); P(60, -27, 1, 21, '#6d82b0'); P(67, -27, 9, 9, '#ffe8a3'); P(69, -24, 3, 3, '#3b2a2a');
    P(79, -28, 8, 14, '#24304a'); P(80, -27, 1, 12, '#6d82b0'); P(83, -24, 3, 3, '#3b2a2a'); P(76, -33, 11, 3, '#1b1b2f'); for (let d = 0; d < 4; d++) P(78 + d * 2, -32, 1, 1, '#ffa94d');
    P(6, -9, 14, 3, '#1b1b2f'); P(64, -9, 14, 3, '#1b1b2f'); P(0, -6, 89, 1, '#343a40');
    hnWheel(P, 8, 7, spin); hnWheel(P, 67, 7, spin); P(87, -10, 2, 3, '#fff3bf'); P(0, -12, 1, 3, '#ff4d4d'); hy = -10;
  }
  if (night) { ctx.globalAlpha = .13; P(w0, hy - 1, 12, 3, '#fff3bf'); P(w0 + 8, hy - 2, 16, 5, '#fff3bf'); ctx.globalAlpha = .08; P(w0 - 2, -2, 22, 2, '#fff3bf'); ctx.globalAlpha = .3; P(-2, hy, 3, 3, '#ff4d4d'); ctx.globalAlpha = 1; }
}
/* ---- boy phố bốc đầu ----
   Vẽ xe vào canvas phụ WL_W×WL_H (bánh sau chạm đất tại WL_PX, WL_PY) rồi tự xoay từng điểm ảnh quanh bánh sau
   theo láng giềng gần nhất, để xe nghiêng mà vẫn giữ nét pixel (ctx.rotate sẽ khử răng cưa mép hình). */
const WL_W = 64, WL_H = 60, WL_PX = 28, WL_PY = 56;   // đủ chỗ cho cán phóng lợn khi xe ngả ra sau
let wlSrc = null, wlDst = null;
function hnWheelieAng(v) {   // góc nhấc đầu (rad) theo chu kỳ v.wl = [giây, góc tối đa]
  const [per, A] = v.wl, p = ((sceneT + v.k * 1.7) % per + per) % per / per;
  const env = p < .2 ? 0 : p < .32 ? (p - .2) / .12 : p < .82 ? 1 : p < .9 ? 1 - (p - .82) / .08 : 0;
  return { a: Math.max(0, A * env * (1 + Math.sin(time * 6 + v.k) * .12 * env)), rising: p > .18 && p < .45 };
}
function hnWheelie(v, x, base, dir) {
  x = Math.round(x); base = Math.round(base);
  if (!wlSrc) { wlSrc = document.createElement('canvas'); wlSrc.width = WL_W; wlSrc.height = WL_H; wlDst = document.createElement('canvas'); wlDst.width = WL_W; wlDst.height = WL_H; }
  const sg = wlSrc.getContext('2d', { willReadFrequently: true }), { a, rising } = hnWheelieAng(v), co = Math.cos(a), si = Math.sin(a);
  sg.clearRect(0, 0, WL_W, WL_H);
  hnVeh(v, 0, 0, 1, false, (i, j, w, h, c) => { if (w > 0 && h > 0) { sg.fillStyle = c; sg.fillRect(WL_PX - 3 + i, WL_PY + j, w, h); } });
  const s = sg.getImageData(0, 0, WL_W, WL_H).data, out = new ImageData(WL_W, WL_H), d = out.data;
  for (let Y = 0; Y < WL_H; Y++) for (let X = 0; X < WL_W; X++) {
    const rx = X + .5 - WL_PX, ry = Y + .5 - WL_PY, sx = Math.floor(WL_PX + co * rx - si * ry), sy = Math.floor(WL_PY + si * rx + co * ry);
    if (sx < 0 || sy < 0 || sx >= WL_W || sy >= WL_H) continue;
    const p = (sy * WL_W + sx) * 4; if (!s[p + 3]) continue;
    const q = (Y * WL_W + (dir > 0 ? X : WL_W - 1 - X)) * 4; d[q] = s[p]; d[q + 1] = s[p + 1]; d[q + 2] = s[p + 2]; d[q + 3] = s[p + 3];
  }
  wlDst.getContext('2d').putImageData(out, 0, 0);
  ctx.drawImage(wlDst, dir > 0 ? x + 3 - WL_PX : x + v.w - WL_W + WL_PX - 3, base - WL_PY);
  // điểm (dx, dy) tính từ bánh sau, sau khi xoay → toạ độ màn hình
  const pv = dir > 0 ? x + 3 : x + v.w - 3, at = (dx, dy) => [pv + dir * (dx * co + dy * si), base - dx * si + dy * co];
  const [hx, hy] = at(12.5, -8.5), [tx, ty] = at(-.5, -7.5), [ex, ey] = at(-3, -6);
  ctx.globalAlpha = .1; for (const [t, z] of [[3, 2], [6, 3], [10, 4], [15, 5]]) fr('#fff3bf', hx + dir * co * t - (z >> 1), hy - si * t - (z >> 1), z, z); ctx.globalAlpha = 1;   // đèn pha chiếu chéo lên trời
  glow(Math.round(hx), Math.round(hy), 2, '#fff3bf', .5); glow(Math.round(tx), Math.round(ty), 2, '#ff4d4d', .35);
  for (let n = 0; n < 3; n++) {   // khói ống xả, càng bốc đầu càng dày
    const e = (time * (1.6 + a * 3) + n / 3 + v.k * .3) % 1, z = 2 + Math.round(e * (2 + a * 6));
    ctx.globalAlpha = (.14 + a * .4) * (1 - e); fr(n % 2 ? '#ced4da' : '#adb5bd', ex - dir * e * 16 - (z >> 1), ey - e * 5 - (z >> 1), z, z);
  }
  ctx.globalAlpha = 1;
  if (rising && v.shout) { const tx2 = Math.round(x + v.w / 2 - 14), ty2 = base - 58; ctx.drawImage(pixText('bừm bừm!', 12, '#1b1b2f'), tx2 + 1, ty2 + 1); ctx.drawImage(pixText('bừm bừm!', 12, '#ff922b'), tx2, ty2); }   // chỉ xe có shout mới hò hét, tránh chữ chồng nhau
}
/* dòng xe: lane 0 = làn xa chạy sang phải, lane 1 = làn gần chạy sang trái */
const HN_TRAFFIC = [
  { lane: 0, t: 'moto', sp: 46, off: 0, span: 760, dy: 1, body: '#e03131', rider: { shirt: '#f1f3f5', helmet: '#ffd43b' }, pass: { shirt: '#ff8fab', helmet: '#ffffff', hair: '#2b1b17' }, horn: 1 },
  { lane: 0, t: 'moto', sp: 42, off: 250, span: 760, dy: 0, body: '#495057', scooter: 1, rider: { shirt: '#2b9348', helmet: '#2b9348', stripe: '#b2f2bb' }, pass: { shirt: '#4dabf7', helmet: '#e9ecef' } },   // xe ôm công nghệ
  { lane: 0, t: 'cyclo', sp: 14, off: 120, span: 640, dy: 2 },
  { lane: 0, t: 'moto', sp: 37, off: 470, span: 760, dy: 2, body: '#1c7ed6', rider: { shirt: '#343a40', helmet: '#e03131' }, load: 'lanterns' },
  { lane: 0, t: 'bus', sp: 30, off: 900, span: 1700, dy: 0 },
  { lane: 0, t: 'moto', sp: 50, off: 600, span: 760, dy: 1, body: '#f783ac', scooter: 1, rider: { shirt: '#fff0f6', helmet: '#ffffff', hair: '#3b2a2a', mask: '#74c0fc' } },
  { lane: 0, t: 'moto', sp: 24, off: 380, span: 980, dy: 2, body: '#868e96', rider: { shirt: '#5c7cfa', coi: 1 }, load: 'balloons' },
  { lane: 0, t: 'moto', sp: 44, off: 820, span: 1200, dy: 1, body: '#fab005', scooter: 1, rider: { shirt: '#e64980', helmet: '#f1f3f5', hair: '#2b1b17' }, load: 'teddy' },
  { lane: 1, t: 'moto', sp: 40, off: 0, span: 780, dy: 1, body: '#2f9e44', rider: { shirt: '#1864ab', helmet: '#f1f3f5' }, pass: { shirt: '#f08c00', helmet: '#ff8fab', hair: '#2b1b17' }, kid: '#ffd43b', horn: 1 },
  { lane: 1, t: 'taxi', sp: 56, off: 320, span: 1100, dy: 0, body: '#f1f3f5', stripe: '#2b9348' },
  { lane: 1, t: 'bike', sp: 15, off: 220, span: 620, dy: 2 },
  { lane: 1, t: 'moto', sp: 52, off: 460, span: 780, dy: 1, body: '#343a40', rider: { shirt: '#e8590c', helmet: '#e8590c' }, load: 'ship' },
  { lane: 1, t: 'moto', sp: 35, off: 650, span: 860, dy: 2, body: '#c92a2a', rider: { shirt: '#495057', non: 1, mask: '#f1f3f5' }, load: 'boxes', horn: 1 },
  { lane: 1, t: 'moto', sp: 48, off: 150, span: 780, dy: 0, body: '#f1f3f5', scooter: 1, rider: { shirt: '#ffffff', helmet: '#1c7ed6' }, pass: { shirt: '#ffffff', helmet: '#ffd43b' } },   // học sinh áo trắng
  { lane: 1, t: 'moto', sp: 41, off: 980, span: 1300, dy: 1, body: '#1c7ed6', rider: { shirt: '#2b8a3e', helmet: '#343a40' }, load: 'gas' },
  // boy phố: tóc nhuộm, áo ba lỗ, kính đen, xe côn tay dán tem, thay nhau bốc đầu, vác phóng lợn
  { lane: 0, t: 'moto', sp: 62, off: 330, span: 1100, dy: 1, body: '#1c7ed6', decal: '#f1f3f5', wl: [5, .38], shout: 1, rider: { shirt: '#1c7ed6', stripe: '#f1f3f5', cap: '#1971c2', mask: '#1b1b2f', pants: '#1c7ed6' }, pass: { shirt: '#1b1b2f', tank: 1, cut: '#2b1b17', spear: 1 }, pass2: { shirt: '#f1f3f5', cap: '#1b1b2f', spear: 1, cheer: 1 } },   // kẹp ba
  { lane: 0, t: 'moto', sp: 62, off: 292, span: 1100, dy: 2, body: '#e03131', decal: '#ffd43b', wl: [4.2, .36], rider: { shirt: '#f1f3f5', tank: 1, cut: '#e9ecef', shades: 1, pants: '#1864ab' }, pass: { shirt: '#e03131', tank: 1, cut: '#ff922b', spear: 1 } },
  { lane: 1, t: 'moto', sp: 58, off: 560, span: 1000, dy: 0, body: '#94d82d', decal: '#1b1b2f', wl: [6, .46], shout: 1, rider: { shirt: '#f08c00', tank: 1, cut: '#ff6b6b', pants: '#343a40' }, pass: { shirt: '#1b1b2f', tank: 1, cut: '#ffd43b', shades: 1, spear: 1, cheer: 1 } },
].map((v, k) => ({ ...v, k, w: { moto: 18, cyclo: 30, bike: 24, taxi: 40, bus: 90 }[v.t] }));
const HN_PARK = [{ t: 'moto', w: 18, k: 0, parked: 1, body: '#e03131', hat: '#ffd43b' }, { t: 'moto', w: 18, k: 0, parked: 1, scooter: 1, body: '#f1f3f5', hat: '#ff8fab' }, { t: 'moto', w: 18, k: 0, parked: 1, scooter: 1, body: '#343a40' }, { t: 'moto', w: 18, k: 0, parked: 1, body: '#1c7ed6', hat: '#e9ecef' }];
function hnTraffic(lane, base) {
  for (const v of HN_TRAFFIC.filter(v => v.lane === lane).sort((a, b) => a.dy - b.dy)) {
    const lx = ((sceneT * v.sp + v.off) % v.span + v.span) % v.span - v.w - 30; if (lx > W + 30) continue;
    const x = lane ? W - lx - v.w : lx; if (v.wl) hnWheelie(v, x, base + v.dy, lane ? -1 : 1); else hnVeh(v, x, base + v.dy, lane ? -1 : 1);
    if (v.horn && (sceneT + v.k * 1.7) % 6 < .7) { const tx = Math.round(x + v.w / 2 - 8), ty = base + v.dy - 34; ctx.drawImage(pixText('bíp!', 12, '#1b1b2f'), tx + 1, ty + 1); ctx.drawImage(pixText('bíp!', 12, '#fff3bf'), tx, ty); }
  }
}
function walker(x, y, shirt, k) { x = Math.round(x); const st = Math.floor(sceneT * 6 + k) % 2; fr('#f1e3c8', x - 2, y, 9, 1); fr('#e3d0a8', x, y - 1, 5, 1); fr('#d9c49e', x + 1, y - 2, 3, 1); fr('#f5c29a', x + 1, y + 1, 3, 3); fr(shirt, x, y + 4, 5, 5); fr('#343a40', x + (st ? 0 : 1), y + 9, 2, 3); fr('#343a40', x + (st ? 3 : 2), y + 9, 2, 3); }
function butterfly(x, y, c) { const f = Math.floor(time * 10) % 2; fr(c, Math.round(x) - (f ? 2 : 1), Math.round(y), f ? 2 : 1, 2); fr(c, Math.round(x) + 1, Math.round(y), f ? 2 : 1, 2); fr('#1b1b2f', Math.round(x), Math.round(y), 1, 2); }
function lantern(x, y, c1, c2, sw) { const s = Math.round(Math.sin(time * 2 + x * .05) * sw); fr('#3b2a2a', x + 3, y - 3, 1, 3); fr('#ffd43b', x + s, y, 8, 1); fr(c1, x - 1 + s, y + 1, 10, 7); fr(c2, x + 1 + s, y + 2, 2, 5); fr('#ffd43b', x + s, y + 8, 8, 1); fr('#ffd43b', x + 3 + s, y + 9, 2, 2); }
/* ---- phố Hàng Mã ---- */
const HB = 186;   // chân dãy nhà / mép vỉa hè phía xa
const HN_HOUSE = [['#e9b872', '#c99a58', '#f5d19d'], ['#e8a33d', '#c9862a', '#f3c070'], ['#d9c3a0', '#b8a07e', '#eadbc0'], ['#c8d6a0', '#a8b680', '#dce6bc'], ['#e6c3c3', '#c9a0a0', '#f3dada']];
const HN_SHOP = [['HÀNG MÃ', '#c92a2a'], ['ĐÈN LỒNG', '#e03131'], ['ĐỒ CHƠI', '#1971c2'], ['TRUNG THU', '#e8590c'], ['MẶT NẠ', '#2b8a3e'], ['VÀNG MÃ', '#a61e4d']];
const HN_GOODS = ['#e03131', '#ffd43b', '#ff8fab', '#4dabf7', '#51cf66', '#f08c00', '#ffffff', '#b197fc'];
const STAR7 = ['...#...', '..###..', '#######', '.#####.', '..###..', '.##.##.', '##...##'], starCache = {};
function star(x, y, c) {   // đèn ông sao 7×7
  let s = starCache[c]; if (!s) { s = document.createElement('canvas'); s.width = s.height = 7; const g = s.getContext('2d'); g.fillStyle = c; STAR7.forEach((r, j) => { for (let i = 0; i < 7; i++) if (r[i] === '#') g.fillRect(i, j, 1, 1); }); g.fillStyle = '#fff3bf'; g.fillRect(3, 2, 1, 2); starCache[c] = s; }
  ctx.drawImage(s, Math.round(x), Math.round(y)); }
const SP = (x, y) => (i, j, w, h, c) => fr(c, x + i, y + j, w, h);   // vẽ hình xe/đèn tại toạ độ màn hình, không lật
function ellipseGlow(cx, cy, rx, ry, c, a) { for (const [k, al] of [[1, a], [.6, a * .8]]) { ctx.globalAlpha = al; const r2 = Math.round(ry * k); for (let y = -r2; y <= r2; y++) { const w = Math.round(rx * k * Math.sqrt(1 - (y / (r2 + .5)) ** 2)); fr(c, cx - w, cy + y, w * 2 + 1, 1); } } ctx.globalAlpha = 1; }
function hnPerson(x, b, shirt, hair, k) {   // người đứng xem hàng
  x = Math.round(x); const bob = Math.floor(time * 1.5 + k) % 4 === 0 ? 1 : 0;
  fr(hair, x + 1, b - 14 + bob, 4, 2); fr('#f5c29a', x + 1, b - 12 + bob, 4, 3); fr(hair, x + (k % 2 ? 0 : 4), b - 13 + bob, 1, 4); fr(shirt, x, b - 9, 6, 5); fr(shirt, x + (k % 2 ? 6 : -1), b - 8, 1, 3);
  fr('#343a40', x + 1, b - 4, 1, 4); fr('#343a40', x + 4, b - 4, 1, 4); }
function hnHouses() {
  tiles(66, .4, (x, k) => { const h = 84 + Math.floor(rnd(k) * 44), p = HN_HOUSE[k % 5], top = HB - h, gy = HB - 50, rf = k % 4;
    fr(p[0], x, top, 62, h); fr(p[1], x, top, 4, h); fr(p[2], x + 58, top, 4, h); fr('#4a3226', x - 2, top - 4, 66, 4); fr('#6b4a36', x - 2, top - 4, 66, 1);
    if (rf === 0) { fr('#868e96', x + 8, top - 14, 18, 10); fr('#ced4da', x + 9, top - 14, 16, 9); fr('#f1f3f5', x + 9, top - 14, 16, 2); fr('#adb5bd', x + 13, top - 14, 1, 9); fr('#adb5bd', x + 20, top - 14, 1, 9); fr('#495057', x + 10, top - 5, 1, 1); fr('#495057', x + 23, top - 5, 1, 1); }   // bồn nước inox
    if (rf === 1) { fr('#8a7e72', x + 6, top - 14, 22, 10); fr('#6b4a36', x + 4, top - 16, 26, 2); fr('#ffe29a', x + 10, top - 11, 4, 7); fr('#495057', x + 44, top - 28, 1, 24); fr('#495057', x + 38, top - 26, 13, 1); fr('#495057', x + 40, top - 22, 9, 1); fr('#495057', x + 42, top - 18, 5, 1); }   // tum + ăng-ten
    if (rf === 2) for (let i = 0; i < 9; i++) fr(i % 3 ? '#b24a22' : '#d4602f', x + 2 + i * 2, top - 5 - i, 58 - i * 4, 1);   // mái ngói
    if (rf === 3) { for (let i = 0; i < 5; i++) { fr('#a0522d', x + 5 + i * 10, top - 8, 6, 4); fr(i % 2 ? '#2f9e44' : '#51cf66', x + 4 + i * 10, top - 13, 8, 5); if (i % 2) fr('#e64980', x + 7 + i * 10, top - 13, 2, 1); } }   // vườn sân thượng
    for (let y = top + 8, n = 0; y < gy - 17; y += 22, n++) { const on = rnd(k * 9 + n) > .4 && !(Math.floor(time * .7 + k + n) % 13 === 0);
      fr('#2b5a38', x + 10, y, 12, 14); fr('#3a7a4c', x + 11, y + 1, 4, 12); fr(on ? '#ffe29a' : '#3b2e3a', x + 26, y + 1, 10, 12); if (on) fr('#fff3bf', x + 27, y + 2, 3, 3); fr('#2b5a38', x + 38, y, 12, 14); fr('#3a7a4c', x + 45, y + 1, 4, 12);
      fr('#3b2a2a', x + 6, y + 14, 50, 2); for (let r = 0; r < 50; r += 4) fr('#3b2a2a', x + 6 + r, y + 10, 1, 4);
      if ((k + n) % 3 === 0) { fr('#2f9e44', x + 8, y + 7, 6, 3); fr('#51cf66', x + 9, y + 6, 3, 2); fr('#e64980', x + 12, y + 6, 1, 1); }
      if ((k + n) % 4 === 1) { fr('#e9ecef', x + 44, y - 2, 10, 6); fr('#adb5bd', x + 44, y + 3, 10, 1); fr('#868e96', x + 46, y, 6, 1); }   // cục nóng điều hoà
      if ((k + n) % 5 === 2) { fr('#495057', x + 8, y - 3, 46, 1); const sw = Math.round(Math.sin(time * 2 + k) * 1); fr('#ff8fab', x + 14 + sw, y - 2, 5, 6); fr('#74c0fc', x + 24 + sw, y - 2, 6, 7); fr('#ffd43b', x + 34 + sw, y - 2, 4, 5); }
      if ((k + n) % 4 === 3) { const fw = Math.round(Math.sin(time * 3 + k)); fr('#adb5bd', x + 55, y - 8, 1, 22); fr('#da2c38', x + 56, y - 8, 10, 7); fr('#c92a2a', x + 60 + fw, y - 8, 1, 7); fr('#ffd43b', x + 60, y - 6, 2, 3); fr('#ffd43b', x + 59, y - 5, 4, 1); } }   // cờ đỏ sao vàng
    // tầng trệt: biển hiệu, mái bạt, cửa hàng đầy đèn lồng
    const [name, sc] = HN_SHOP[k % 6], closed = k % 5 === 3;
    fr(p[1], x, gy, 62, 50); fr(sc, x + 2, gy + 1, 58, 11); fr('rgba(255,255,255,.25)', x + 2, gy + 1, 58, 1); fr('rgba(0,0,0,.25)', x + 2, gy + 11, 58, 1);
    const tx = pixText(name, 13, '#ffe066'); ctx.drawImage(tx, x + 31 - (tx.width >> 1), gy - 1);
    fr('#1c5fa8', x + 52, gy - 6, 6, 4); fr('#f1f3f5', x + 53, gy - 5, 4, 1); fr('#f1f3f5', x + 54, gy - 4, 2, 1);   // biển số nhà
    for (let r = 0; r < 5; r++) for (let s = 0; s < 64 + r * 2; s += 4) fr((s >> 2) % 2 ? '#f1f3f5' : sc, x - 1 - r + s, gy + 12 + r, 4, 1);
    for (let s = 0; s < 70; s += 4) fr(sc, x - 5 + s, gy + 17, 2, 1);
    const iy = gy + 18, ix = x + 3;
    if (closed) { fr('#868e96', ix, iy, 56, 32); for (let yy = iy + 1; yy < HB - 3; yy += 2) fr('#6c737a', ix, yy, 56, 1); fr('#ffcf7a', ix, HB - 3, 56, 3); fr('#495057', ix + 26, HB - 7, 4, 2); }   // cửa cuốn kéo gần hết
    else {
      fr('#f2b45a', ix, iy, 56, 32); fr('#e09a3e', ix, iy + 20, 56, 12);
      for (let r = 0; r < 2; r++) { const sy = iy + 13 + r * 9; for (let i = 0; i < 13; i++) fr(HN_GOODS[(i * 3 + r + k) % 8], ix + 2 + i * 4, sy - 4, 3, 4); fr('#7a4a22', ix + 1, sy, 54, 1); }
      if (k % 2) { fr('#f3d9c4', ix + 44, iy + 22, 8, 9); fr('#f3d9c4', ix + 45, iy + 17, 6, 5); fr('#f3d9c4', ix + 44, iy + 16, 2, 2); fr('#f3d9c4', ix + 50, iy + 16, 2, 2); fr('#1b1b2f', ix + 46, iy + 19, 1, 1); fr('#1b1b2f', ix + 49, iy + 19, 1, 1); fr('#e03131', ix + 46, iy + 22, 4, 1); }   // gấu bông
      else for (let i = 0; i < 3; i++) { const mx = ix + 36 + i * 7; fr('#f8f0e3', mx, iy + 22, 6, 7); fr('#1b1b2f', mx + 1, iy + 24, 1, 1); fr('#1b1b2f', mx + 4, iy + 24, 1, 1); fr('#ff6b6b', mx + 1, iy + 26, 1, 1); fr('#ff6b6b', mx + 4, iy + 26, 1, 1); fr(HN_GOODS[i + 2], mx, iy + 21, 6, 1); }   // mặt nạ
      for (let i = 0; i < 6; i++) { const hx = ix + 2 + i * 9, hy = iy + 2 + (i % 2) * 4, sw = Math.round(Math.sin(time * 1.6 + i * 1.3 + k) * .7); fr('#3b2a2a', hx + 2, iy, 1, hy - iy);
        if ((i + k) % 3 === 1) star(hx - 1 + sw, hy, ['#e03131', '#ffd43b', '#ff8fab'][(i + k) % 3]); else hnBall(SP(hx + sw, hy), 0, 0, ['#e03131', '#ff8fab', '#e03131', '#f08c00'][(i + k) % 4]); }
      glow(x + 31, HB - 6, 26, '#ffcf7a', .09);
    }
    fr(p[1], x, gy + 12, 3, 38); fr(p[1], x + 59, gy + 12, 3, 38); });
}
/* vỉa hè phía xa: hàng hoá bày tràn, ghế nhựa, xe máy dựng, khách xem hàng */
function hnSpill() {
  fr('#7d7570', 0, HB, W, 8); fr('#948c86', 0, HB, W, 1); for (let x = 0; x < W; x += 12) fr('#6c6560', x, HB + 1, 1, 6); fr('#c4c7cb', 0, HB + 7, W, 1);
  tiles(66, .4, (x, k) => { const b = HB + 7;
    if (k % 5 === 3) { hnVeh(HN_PARK[k % 4], x + 10, b, k % 2 ? 1 : -1, false); hnVeh(HN_PARK[(k + 1) % 4], x + 34, b, 1, false); return; }
    fr('#c8a06a', x + 1, b - 7, 10, 7); fr('#a07a48', x + 1, b - 4, 10, 1); fr('#e9d8a6', x + 5, b - 7, 2, 7);
    if (k % 2) { fr('#d4ae78', x + 2, b - 13, 8, 6); fr('#a07a48', x + 2, b - 10, 8, 1); for (let i = 0; i < 3; i++) fr(HN_GOODS[(i + k) % 8], x + 3 + i * 2, b - 15, 2, 2); }
    for (let i = 0; i < 3; i++) fr('#1c7ed6', x + 13, b - 9 + i * 2, 7, 1); fr('#1864ab', x + 14, b - 6, 1, 6); fr('#1864ab', x + 18, b - 6, 1, 6);   // chồng ghế nhựa xanh
    if (k % 4 !== 2) { fr('#ced4da', x + 26, b - 30, 1, 30); fr('#ced4da', x + 52, b - 30, 1, 30); fr('#ced4da', x + 25, b - 30, 29, 1);   // giá treo đèn ông sao
      for (let i = 0; i < 4; i++) { const sx = x + 27 + i * 6, sy = b - 27 + (i % 2) * 3, sw = Math.round(Math.sin(time * 2 + i + k) * .7); fr('#3b2a2a', sx + 3, b - 29, 1, sy - b + 29); star(sx + sw, sy, HN_GOODS[(i + k) % 6]); }
      fr('#f8f9fa', x + 26, b - 10, 27, 1); fr('#adb5bd', x + 27, b - 9, 1, 9); fr('#adb5bd', x + 51, b - 9, 1, 9); for (let i = 0; i < 6; i++) fr(HN_GOODS[(i + k + 2) % 8], x + 27 + i * 4, b - 13, 3, 3); }
    else { fr('#f8f9fa', x + 26, b - 9, 26, 2); fr('#adb5bd', x + 27, b - 7, 1, 7); fr('#adb5bd', x + 50, b - 7, 1, 7); for (let i = 0; i < 4; i++) hnBall(SP(x + 27 + i * 6, b - 17), 0, 0, HN_GOODS[i]); }
    if (k % 3 === 1) hnPerson(x + 56, b, ['#ff8fab', '#4dabf7', '#f1f3f5', '#ffd43b'][k % 4], '#2b1b17', k);
  });
  // người đi bộ gánh hàng rong
  const gx = Math.round(loopX(8, 140, W + 120) - 20), gyb = HB - 5, st = Math.floor(sceneT * 4) % 2;
  fr('#8a6238', gx - 8, gyb + 4, 21, 1); for (const bx of [gx - 9, gx + 9]) { fr('#5a4636', bx + 3, gyb + 5, 1, 3); fr('#a0784c', bx, gyb + 8, 7, 3); fr('#ffa94d', bx + 1, gyb + 7, 2, 1); fr('#51cf66', bx + 4, gyb + 7, 2, 1); }
  fr('#f1e3c8', gx - 2, gyb, 9, 1); fr('#e3d0a8', gx, gyb - 1, 5, 1); fr('#d9c49e', gx + 1, gyb - 2, 3, 1); fr('#f5c29a', gx + 1, gyb + 1, 3, 3); fr('#7b5ea7', gx, gyb + 4, 5, 5); fr('#343a40', gx + (st ? 0 : 1), gyb + 9, 2, 3); fr('#343a40', gx + (st ? 3 : 2), gyb + 9, 2, 3);
}
/* cột điện, dây điện chằng chịt, cây sấu, đèn đường, đèn tín hiệu. pass 1 = vũng sáng đèn trên mặt đường */
function hnPoles(pass) {
  tiles(200, .5, (x, k) => { const px = x + 20, tx = x + 118;
    if (pass) { ellipseGlow(px + 17, 207, 34, 9, '#ffcf7a', .09); return; }
    const sw = Math.round(Math.sin(time * .8 + k) * 1);
    fr('#4a3a2e', tx, 126, 5, HB + 6 - 126); fr('#3a2c22', tx + 3, 126, 2, HB + 6 - 126); for (let y = 132; y < HB - 8; y += 7) fr('#3a2c22', tx + 1, y, 2, 1); fr('#e9ecef', tx, HB - 8, 5, 14); fr('#ced4da', tx + 3, HB - 8, 2, 14);   // thân cây quét vôi
    fr('#4a3a2e', tx - 6, 128, 7, 2); fr('#4a3a2e', tx + 4, 124, 8, 2);
    for (const [dx, dy, r, c] of [[-14, 114, 12, '#1d3626'], [4, 104, 15, '#1d3626'], [18, 116, 11, '#1d3626'], [-4, 124, 10, '#1d3626'], [12, 126, 9, '#1d3626'], [-10, 110, 8, '#2b5034'], [6, 100, 9, '#2b5034'], [16, 112, 7, '#2b5034'], [-12, 106, 4, '#46703a'], [0, 96, 5, '#46703a'], [-18, 116, 3, '#46703a']]) pixCircle(tx + 2 + dx + sw, dy, r, c);
    for (let i = 0; i < 10; i++) fr(i % 2 ? '#5f8f45' : '#3f6b34', tx - 20 + Math.floor(rnd(k * 11 + i) * 40) + sw, 92 + Math.floor(rnd(k * 13 + i) * 40), 2, 1);
    // cột điện bê tông
    fr('#8f8a84', px, 74, 4, HB + 6 - 74); fr('#a8a39c', px, 74, 1, HB + 6 - 74); fr('#6f6a64', px + 3, 74, 1, HB + 6 - 74);
    fr('#6f6a64', px - 9, 80, 22, 2); fr('#6f6a64', px - 6, 95, 16, 2); for (const ix of [-8, -3, 7, 11]) fr('#e9ecef', px + ix, 78, 1, 2);
    if (k % 2) { fr('#5c636a', px + 4, 98, 7, 13); fr('#7a8189', px + 5, 98, 2, 13); fr('#495057', px + 4, 101, 7, 1); fr('#495057', px + 4, 106, 7, 1); }   // bình biến áp
    for (const [cx, cy] of [[-8, 116], [-6, 120]]) { fr('#1b1622', px + cx, cy, 7, 1); fr('#1b1622', px + cx - 1, cy + 1, 1, 6); fr('#1b1622', px + cx + 7, cy + 1, 1, 6); fr('#1b1622', px + cx, cy + 7, 7, 1); }   // cuộn cáp
    for (let i = 0; i < 5; i++) { const ay = 138 + i * 7 + (k % 3); fr(['#f1f3f5', '#fff3bf', '#ffc9c9', '#d0ebff'][(i + k) % 4], px, ay, 4, 4); fr('#495057', px + 1, ay + 1, 2, 1); fr('#495057', px + 1, ay + 3, 1, 1); }   // tờ rơi "khoan cắt bê tông"
    // đèn đường
    fr('#5c636a', px + 4, 87, 14, 1); fr('#5c636a', px + 4, 88, 2, 2); fr('#495057', px + 14, 89, 7, 2); fr('#ffe8a3', px + 15, 91, 5, 1); glow(px + 17, 92, 7, '#ffcf7a', .35);
    ctx.globalAlpha = .045; for (let y = 93; y < HB + 8; y += 3) { const ww = 3 + Math.round((y - 93) * .32); fr('#ffcf7a', px + 17 - ww, y, ww * 2, 3); } ctx.globalAlpha = 1;
    if (k % 3 === 1) {   // đèn tín hiệu có đếm ngược
      const ph = (sceneT + 4) % 16, st = ph < 8 ? 2 : ph < 10 ? 1 : 0, left = Math.ceil((st === 2 ? 8 : st === 1 ? 10 : 16) - ph);
      fr('#1b1b2f', px - 6, 146, 6, 16); fr('#343a40', px - 6, 146, 6, 1);
      ['#ff4d4d', '#ffd43b', '#51cf66'].forEach((c, i) => { fr(st === i ? c : '#3a3340', px - 5, 147 + i * 5, 4, 4); if (st === i) glow(px - 3, 149 + i * 5, 6, c, .3); });
      fr('#1b1b2f', px - 15, 148, 8, 9); const d = pixText(String(left), 12, st === 2 ? '#51cf66' : st === 1 ? '#ffd43b' : '#ff4d4d'); ctx.drawImage(d, px - 11 - (d.width >> 1), 145);
    }
    // dây điện võng giữa các cột
    const ws = wireSpan(); ctx.drawImage(ws, px, 76); if (px - 200 > -200 && px < 200) ctx.drawImage(ws, px - 200, 76);
  });
}
let wireC = null;
function wireSpan() {   // một nhịp dây điện giữa hai cột (vẽ sẵn một lần): dây võng + dây kéo xiên vào nhà
  if (wireC) return wireC; const c = document.createElement('canvas'); c.width = 200; c.height = 80; const g = c.getContext('2d');
  g.fillStyle = '#1b1622';
  const line = (len, f) => { let py = f(0); for (let x = 0; x < len; x++) { const y = f(x); g.fillRect(x, Math.min(y, py), 1, Math.abs(y - py) + 1); py = y; } };
  for (const [y0, s] of [[3, 14], [4, 18], [5, 22], [18, 26], [19, 34], [21, 30], [28, 40], [32, 46]]) line(200, x => y0 + Math.round(Math.sin(x / 199 * Math.PI) * s));
  line(46, x => 24 + Math.round(x / 45 * 40 + Math.sin(x / 45 * Math.PI) * 6));
  return wireC = c;
}
function hnRoad() {
  const RT = HB + 8;
  fr('#2b2833', 0, RT, W, GY - RT); fr('#1f1c26', 0, RT, W, 1);
  tiles(32, .6, (x, k) => { for (let i = 0; i < 5; i++) fr(rnd(k * 4 + i) > .5 ? '#37333f' : '#232029', x + Math.floor(rnd(k * 7 + i) * 32), RT + 2 + Math.floor(rnd(k * 5 + i) * (GY - RT - 3)), 2, 1); });
  tiles(24, .6, x => fr('#bdb48a', x, 209, 10, 1));
  tiles(520, .6, x => { fr('#25222c', x + 40, RT + 3, 30, 4); fr('#302c38', x + 210, 214, 18, 3);
    fr('#3d3946', x + 130, 212, 16, 4); fr('#1b1822', x + 131, 213, 14, 1); fr('#1b1822', x + 131, 214, 14, 1); fr('#55505e', x + 130, 212, 16, 1);   // nắp cống
    for (let i = 0; i < 7; i++) fr('#cfc8b4', x + 330 + i * 7, RT + 1, 4, GY - RT - 2); });   // vạch qua đường
}
/* ---- bối cảnh ---- */
function drawTrip(theme) {
  if (theme === 'hanoi') {
    for (let i = 0; i < 25; i++) if ((Math.floor(time * 2) + i) % 7) fr('#fff3bf', Math.floor(rnd(i) * W), Math.floor(rnd(i + 40) * 60), 1, 1);
    hnHouses(); hnSpill(); hnPoles(0); hnRoad(); hnPoles(1);
    hnTraffic(0, 204); hnTraffic(1, 216);
    for (let i = 0; i < 4; i++) { const y = 26 + i * 7; tiles(160, .6, (x, k) => { for (let j = 0; j < 160; j += 2) fr('#241c2e', x + j, y + Math.round(Math.sin(j / 160 * Math.PI) * (6 + i * 2)), 2, 1); }); }
    tiles(120, .7, (x, k) => { for (let i = 0; i < 120; i += 2) fr('#2a1a2e', x + i, 40 + Math.round(Math.sin(i / 120 * Math.PI) * 10), 2, 1);
      for (let i = 0; i < 5; i++) { const lx = x + 12 + i * 22, ly = 44 + Math.round(Math.sin((i * 22 + 12) / 120 * Math.PI) * 10), fl = .15 + (Math.sin(time * 6 + i + k) + 1) * .04; glow(lx + 4, ly + 5, 9, '#ffb86b', fl); lantern(lx, ly, ['#e03131', '#ffd43b', '#e64980', '#f08c00', '#40c057'][(i + k) % 5], '#fff3bf', 1.5); } });
  } else if (theme === 'namdinh') {
    ndScene();   // js/namdinh.js
  } else if (theme === 'hoabinh') {
    hbScene();   // js/hoabinh.js
  } else if (theme === 'danang') {
    dnScene();   // js/danang.js
  } else if (theme === 'hoian') {
    haScene();   // js/hoian.js
  } else if (theme === 'dalat') {
    dlScene();   // js/dalat.js
  } else if (theme === 'quynhon') {
    qnScene();   // js/quynhon.js
  } else if (theme === 'phuquoc') {
    pqScene();   // js/phuquoc.js
  } else if (theme === 'pqdinner') {
    pqrScene();   // quán vintage Phú Quốc (js/phuquoc.js)
  } else return false;
  return true;
}
function tripUpdate(dt) {
  if (!L) return;
  if (L.theme === 'hanoi' && Math.random() < .3) { for (const b of props.eating ? [372] : [255, 271, 372]) if (Math.random() < .4) particles.push({ x: b + Math.random() * (b > 300 ? 12 : 6), y: GY - (b > 300 ? 34 : 23), vx: (Math.random() - .5) * 6, vy: -14 - Math.random() * 10, life: 1.1, max: 1.1, col: Math.random() < .5 ? '#ffffff' : '#e9ecef', sz: 2, g: 0 }); }
  if (L.theme === 'danang') dnUpdate(dt);
  if (L.theme === 'hoian') haUpdate(dt);
  if (L.theme === 'namdinh') ndUpdate(dt);
  if (L.theme === 'hoabinh') hbUpdate(dt);
  if (L.theme === 'dalat') dlUpdate(dt);
  if (L.theme === 'quynhon') qnUpdate(dt);
  if (L.theme === 'pqdinner') pqrUpdate(dt);
  if (flashA > 0) flashA -= dt * 2.2;
}
function tripOverlay() {
  if (L && L.theme === 'pqdinner') pqrOverlay();
  if (L && L.theme === 'dalat') dlOverlay();
  if (L && L.theme === 'quynhon') qnTraffic();
  if (L && L.theme === 'namdinh') { ctx.globalAlpha = .05; fr('#ff9a6b', 0, 0, W, H); ctx.globalAlpha = 1; }   // ánh hoàng hôn phủ ấm cả cảnh
  if (flashA > 0) { ctx.globalAlpha = Math.min(1, flashA); fr('#ffffff', 0, 0, W, H); ctx.globalAlpha = 1; }
  if (mapAnim) { ctx.globalAlpha = .6; fr('#1b1b2f', 0, 0, W, H); ctx.globalAlpha = 1; }
  drawMap();
}
