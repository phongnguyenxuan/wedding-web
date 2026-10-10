/* ================== VẼ (nền dithering, ánh sáng) ================== */
const rnd = i => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
function fr(c, x, y, w, h) { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); }
function tiles(step, f, fn) { const o = cam * f; for (let k = Math.max(0, Math.floor(o / step) - 1); k * step - o < W + step; k++) fn(Math.round(k * step - o), k); }
function pixCircle(cx, cy, r, c) { for (let y = -r; y <= r; y++) { const w = Math.floor(Math.sqrt(r * r - y * y)); fr(c, cx - w, cy + y, w * 2 + 1, 1); } }
function glow(cx, cy, r, c, a) { ctx.globalAlpha = a; pixCircle(cx, cy, r, c); ctx.globalAlpha = a * .8; pixCircle(cx, cy, Math.round(r * .6), c); ctx.globalAlpha = 1; }
function hexRGB(h) { const n = parseInt(h.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; }
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];
function ditherInto(id, w, stops, y0, y1) {
  const cols = stops.map(hexRGB), n = cols.length - 1;
  for (let y = y0; y < y1; y++) { const t = (y - y0) / Math.max(1, y1 - y0 - 1) * n, i = Math.min(n - 1, Math.floor(t)), f = t - i;
    for (let x = 0; x < w; x++) { const c = f > (BAYER[y & 3][x & 3] + .5) / 16 ? cols[i + 1] : cols[i], p = (y * w + x) * 4; id.data[p] = c[0]; id.data[p + 1] = c[1]; id.data[p + 2] = c[2]; id.data[p + 3] = 255; } }
}
function ditherDisc(id, w, cx, cy, r0, r1, colIn, colOut) {
  const a = hexRGB(colIn), b = hexRGB(colOut);
  for (let y = cy - r1; y <= cy + r1; y++) for (let x = cx - r1; x <= cx + r1; x++) { if (x < 0 || y < 0 || x >= w || y >= H) continue;
    const d = Math.hypot(x - cx, y - cy); if (d > r1) continue; const t = d <= r0 ? 0 : (d - r0) / (r1 - r0), th = (BAYER[y & 3][x & 3] + .5) / 16, p = (y * w + x) * 4;
    const c = t < th * .6 ? a : t < th ? b : null; if (c) { id.data[p] = c[0]; id.data[p + 1] = c[1]; id.data[p + 2] = c[2]; } }
}
const skies = {};
function sky(theme) {
  if (skies[theme]) return skies[theme];
  const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); const id = x.createImageData(W, H);
  tripSky(theme, id);
  if (theme === 'office') ditherInto(id, W, ['#fdf4e3', '#f5e6c8', '#ead6b0'], 0, H);
  if (theme === 'chat') ditherInto(id, W, ['#ffd9ec', '#fcc9e3', '#efc6f2', '#dccbff', '#cfd8ff'], 0, H);
  if (theme === 'street') { ditherInto(id, W, ['#15132e', '#2a2350', '#553068', '#94446d', '#d4616a', '#f39a64'], 0, 170); ditherInto(id, W, ['#f39a64', '#f39a64'], 170, H); }
  if (theme === 'village') { ditherInto(id, W, ['#5aa9f0', '#8cc6ff', '#bfe0ff', '#e6f4ff'], 0, 170); ditherInto(id, W, ['#e6f4ff', '#e6f4ff'], 170, H); ditherDisc(id, W, 380, 54, 14, 40, '#fffbe0', '#fff3b0'); }
  if (theme === 'sunset') { ditherInto(id, W, ['#2e1a5e', '#5a2a8a', '#a33a8e', '#e0577e', '#ff8a6b', '#ffb86b', '#ffe08a'], 0, GY); ditherDisc(id, W, 330, 176, 30, 70, '#fff6c4', '#ffd48a'); }
  x.putImageData(id, 0, 0);
  if (theme === 'street') { x.fillStyle = '#fff'; for (let i = 0; i < 40; i++) x.fillRect(Math.floor(rnd(i) * W), Math.floor(rnd(i + 50) * 70), 1, 1); }
  return skies[theme] = c;
}
function cloud(x, y, s, a, b, c2) { fr(c2, x + 4 * s, y + 5 * s, 30 * s, 5 * s); fr(b, x + 6 * s, y, 12 * s, 6 * s); fr(b, x + 14 * s, y - 4 * s, 12 * s, 8 * s); fr(b, x, y + 3 * s, 36 * s, 5 * s); fr(a, x + 8 * s, y + 1 * s, 8 * s, 2 * s); fr(a, x + 16 * s, y - 3 * s, 8 * s, 2 * s); }

function drawBg(theme) {
  ctx.drawImage(sky(theme), 0, 0);
  if (drawTrip(theme)) return;
  if (theme === 'office') {
    fr('#d9c49e', 0, 0, W, 10); fr('#c4ab86', 0, 10, W, 2);
    tiles(24, .35, x => fr('#e3cfa9', x, 176, 1, GY - 176)); fr('#cdb48a', 0, 176, W, 3); fr('#b39668', 0, 179, W, 1);
    tiles(210, .35, (x, k) => {
      fr('#5e4430', x + 28, 36, 76, 70); fr('#7a5c43', x + 30, 38, 72, 66);
      fr('#9fd7f3', x + 33, 41, 66, 60); fr('#c7ebfb', x + 33, 41, 66, 26);
      for (let b = 0; b < 6; b++) { const bh = 12 + Math.floor(rnd(k * 7 + b) * 22); fr('#86b9d6', x + 34 + b * 11, 101 - bh, 10, bh); fr('#a9d2e8', x + 35 + b * 11, 103 - bh, 2, 2); }
      fr('#7a5c43', x + 64, 41, 3, 60); fr('#7a5c43', x + 33, 70, 66, 3); fr('#ffffff', x + 38, 46, 2, 10); fr('#ffffff', x + 42, 44, 2, 5);
      fr('#5e4430', x + 26, 104, 80, 4);
      ctx.globalAlpha = .1; ctx.fillStyle = '#fffbe6'; ctx.beginPath(); ctx.moveTo(x + 33, 104); ctx.lineTo(x + 99, 104); ctx.lineTo(x + 150, GY); ctx.lineTo(x + 70, GY); ctx.fill(); ctx.globalAlpha = 1;
    });
    tiles(260, .6, x => { fr('#3a2a20', x + 60, 12, 1, 30); fr('#f08c00', x + 52, 42, 18, 3); fr('#d9730d', x + 50, 45, 22, 6); fr('#a85a0a', x + 50, 50, 22, 1); glow(x + 61, 54, 10, '#fff3bf', .35); });
    tiles(300, .8, (x, k) => {
      fr('#7a4f2c', x + 40, GY - 44, 110, 3); fr('#c8915f', x + 40, GY - 47, 110, 3); fr('#a47148', x + 42, GY - 41, 4, 41); fr('#a47148', x + 144, GY - 41, 4, 41);
      fr('#2f3238', x + 70, GY - 78, 40, 28); fr('#4dabf7', x + 72, GY - 76, 36, 24); fr('#a5d8ff', x + 72, GY - 76, 36, 3);
      for (let l = 0; l < 4; l++) fr(['#ffd43b', '#b2f2bb', '#ffffff', '#ffc9c9'][l], x + 75, GY - 70 + l * 5, 8 + Math.floor(rnd(k + l) * 18), 2);
      fr('#2f3238', x + 86, GY - 50, 8, 3); fr('#e9ecef', x + 120, GY - 54, 8, 7); fr('#ced4da', x + 127, GY - 52, 2, 3);
      fr('#b24a22', x + 176, GY - 20, 18, 20); fr('#d4602f', x + 178, GY - 20, 6, 20); fr('#8a3717', x + 176, GY - 20, 18, 2);
      for (let l = 0; l < 7; l++) { const a = l / 6 * Math.PI; fr(l % 2 ? '#2f9e44' : '#51cf66', x + 185 + Math.round(Math.cos(a) * 12) - 3, GY - 30 - Math.round(Math.sin(a) * 14), 6, 8); }
      fr('#495057', x + 50, GY - 24, 22, 4); fr('#343a40', x + 48, GY - 44, 4, 24); fr('#343a40', x + 60, GY - 20, 2, 20);
    });
    ctx.globalAlpha = .42; fr('#f3e2c2', 0, 12, W, GY - 12); ctx.globalAlpha = 1;
  } else if (theme === 'chat') {
    tiles(300, .12, (x, k) => cloud(x + 30, 30 + rnd(k) * 50, 2, '#ffffff', '#fdf0ff', '#ead6ff'));
    tiles(200, .3, (x, k) => cloud(x + 20, 90 + rnd(k + 3) * 40, 1, '#ffffff', '#fff5fb', '#f3dcf5'));
    tiles(120, .5, (x, k) => { const y = 40 + rnd(k + 9) * 100 + Math.sin(time * 2 + k) * 4; ctx.drawImage(S.heart, x + 30, Math.round(y)); });
    tiles(170, .65, (x, k) => { const y = 60 + rnd(k + 20) * 90 + Math.sin(time * 1.5 + k * 2) * 3; fr('#ffffff', x + 50, y, 26, 14); fr('#ffffff', x + 54, y + 14, 4, 3); for (let d = 0; d < 3; d++) fr((Math.floor(time * 3) % 3) === d ? '#ff6b9d' : '#e8b4d0', x + 56 + d * 6, y + 6, 3, 3); });
    tiles(60, .25, (x, k) => { if ((Math.floor(time * 2) + k) % 5 === 0) { const y = 10 + rnd(k) * 120; fr('#ffffff', x + 10, y, 1, 5); fr('#ffffff', x + 8, y + 2, 5, 1); } });
  } else if (theme === 'street') {
    tiles(40, .08, (x, k) => { const h = 20 + Math.floor(rnd(k) * 30); fr('#2a2248', x, 170 - h, 38, h); if (k % 2) fr('#ffcf6b', x + 8, 170 - h + 6, 2, 2); });
    fr('#223a5c', 0, 170, W, 22);
    for (let y = 172; y < 192; y += 3) tiles(30, .18, (x, k) => fr('#3d5f8c', x + ((k * 7 + Math.floor(time * 6)) % 20), y, 8, 1));
    tiles(700, .18, x => { const bx = x + 250; for (let i = 0; i < 60; i++) { const h = Math.round(Math.sin(i / 59 * Math.PI) * 12); fr('#e8590c', bx + i, 160 - h, 1, 4); fr('#7a2d3a', bx + i, 176 + h, 1, 2); } fr('#c92a2a', bx - 2, 160, 64, 3); for (let i = 0; i < 64; i += 10) fr('#a61e1e', bx - 2 + i, 160, 3, 12); });
    tiles(66, .5, (x, k) => { const h = 76 + Math.floor(rnd(k) * 50), pal = [['#f2c14e', '#d9a53a', '#f8d77e'], ['#e8a33d', '#c9862a', '#f3c070'], ['#e9b872', '#c99a58', '#f5d19d']][k % 3];
      fr(pal[0], x, GY - h, 62, h); fr(pal[1], x, GY - h, 4, h); fr(pal[2], x + 58, GY - h, 4, h);
      fr('#5a3a28', x - 2, GY - h - 4, 66, 4); fr('#7a5038', x - 2, GY - h - 4, 66, 1);
      for (let y = GY - h + 8, f = 0; y < GY - 26; y += 22, f++) { const lit = rnd(k * 9 + f) > .45;
        fr('#2b6b3a', x + 10, y, 12, 14); fr('#3a8a4c', x + 11, y + 1, 5, 12); fr(lit ? '#ffe29a' : '#3b2e3a', x + 26, y + 1, 10, 12); fr('#2b6b3a', x + 38, y, 12, 14); fr('#3a8a4c', x + 45, y + 1, 5, 12);
        fr('#3b2a2a', x + 6, y + 14, 50, 2); for (let r = 0; r < 50; r += 4) fr('#3b2a2a', x + 6 + r, y + 10, 1, 4); }
      if (k % 2) { const sc = ['#e03131', '#1c7ed6', '#f08c00'][k % 3]; fr(sc, x + 8, GY - 30, 46, 10); fr('#ffffff', x + 14, GY - 26, 34, 2); glow(x + 31, GY - 25, 18, sc, .12); }
    });
    tiles(190, .85, x => { fr('#2c2c3a', x + 20, GY - 72, 3, 72); fr('#2c2c3a', x + 20, GY - 72, 12, 2); fr('#ffe29a', x + 28, GY - 70, 6, 4); glow(x + 31, GY - 66, 22, '#ffd98a', .16); });
  } else if (theme === 'village') {
    tiles(260, .06, (x, k) => cloud(x + 40, 30 + rnd(k) * 40, 1, '#ffffff', '#f8fbff', '#dbe9f7'));
    tiles(6, .08, (x, k) => { const h = 50 + Math.round(Math.sin(k * .15) * 18 + Math.sin(k * .41) * 8); fr('#9cc3d4', x, 170 - h, 6, h); fr('#b8d6e3', x, 170 - h, 6, 2); });
    tiles(6, .18, (x, k) => { const h = 26 + Math.round(Math.sin(k * .22 + 1) * 12 + Math.sin(k * .7) * 4); fr('#5fae74', x, 176 - h, 6, h); fr('#7cc68f', x, 176 - h, 6, 2); });
    fr('#8ad29a', 0, 176, W, GY - 176);
    for (let y = 178, r = 0; y < GY; y += 7, r++) { fr(r % 2 ? '#b8ecc2' : '#6fc285', 0, y, W, 2); tiles(40, .35 + r * .06, (x, k) => fr('#c9ecff', x + (k * 13) % 30, y + 3, 12, 1)); }
    tiles(330, .55, x => { const hx = x + 60;
      fr('#f3e3c3', hx, GY - 44, 70, 44); fr('#d9c49e', hx, GY - 44, 6, 44); fr('#6b4226', hx + 28, GY - 28, 14, 28); fr('#8a5a36', hx + 30, GY - 26, 10, 26); fr('#5a3a1a', hx + 8, GY - 30, 12, 10); fr('#5a3a1a', hx + 50, GY - 30, 12, 10);
      for (let i = 0; i < 12; i++) fr(['#d4602f', '#b24a22', '#8a3717'][i % 3], hx - 12 + i * 2, GY - 64 + i, 94 - i * 4 + 0, 2);
      fr('#8a3717', hx - 14, GY - 44, 98, 3); fr('#e07a4a', hx - 10, GY - 64, 30, 1); });
    tiles(180, .72, x => { for (let s = 0; s < 4; s++) { const sx = x + 120 + s * 6, h = 60 + s * 10 - (s === 3 ? 22 : 0);
      fr(['#2b8a3e', '#37a14a', '#2f9e44', '#1f6e30'][s], sx, GY - h, 3, h); for (let y = GY - h + 4; y < GY; y += 10) fr('#1a5a28', sx, y, 3, 1);
      fr('#51cf66', sx - 6, GY - h, 8, 3); fr('#40c057', sx + 2, GY - h + 4, 8, 3); } });
    for (let b = 0; b < 2; b++) { const bx = ((time * 22 + b * 170) % (W + 60)) - 30, by = 60 + b * 18 + Math.round(Math.sin(time * 3 + b) * 3), f = Math.floor(time * 6 + b) % 2;
      fr('#ffffff', bx, by, 6, 2); fr('#ffffff', bx + (f ? 1 : 2), by - (f ? 3 : 1), 2, f ? 3 : 1); fr('#ffffff', bx + 4, by - (f ? 2 : 0), 2, 2); fr('#f08c00', bx + 6, by, 2, 1); }
  } else {
    tiles(8, .08, (x, k) => { const h = 34 + Math.round(Math.sin(k * .2) * 10 + rnd(k) * 3); fr('#6d3fa3', x, GY - h, 8, h); fr('#8a52b8', x, GY - h, 8, 1); });
    tiles(8, .22, (x, k) => { const h = 18 + Math.round(Math.sin(k * .3 + 2) * 8); fr('#46287a', x, GY - h, 8, h); fr('#e0577e', x, GY - h, 8, 1); });
    tiles(240, .15, (x, k) => { fr('#ff9fb2', x + 20, 90 + rnd(k) * 40, 80, 3); fr('#ffc2cf', x + 30, 89 + rnd(k) * 40, 40, 1); });
    tiles(90, .6, (x, k) => { for (let i = 0; i < 90; i += 2) fr('#3b2a4a', x + i, 22 + Math.round(Math.sin(i / 90 * Math.PI) * 8), 2, 1);
      const lx = x + 42, ly = 34 + Math.round(Math.sin(time * 2 + k) * 1);
      glow(lx + 6, ly + 8, 16, '#ffb86b', .2); fr('#3b2a4a', lx + 5, ly - 4, 1, 4); fr('#ffd43b', lx + 1, ly, 10, 2); fr('#c92a2a', lx - 1, ly + 2, 14, 12); fr('#e8364f', lx + 2, ly + 2, 8, 12); fr('#ff8787', lx + 3, ly + 3, 2, 9); fr('#ffd43b', lx + 1, ly + 14, 10, 2); fr('#ffd43b', lx + 5, ly + 16, 2, 4); });
    for (let i = 0; i < 14; i++) { const fx = (rnd(i) * W + Math.sin(time * .7 + i) * 20) | 0, fy = (120 + rnd(i + 30) * 90 + Math.sin(time + i * 2) * 8) | 0; if ((Math.floor(time * 3) + i) % 4) { fr('#fff3bf', fx, fy, 1, 1); ctx.globalAlpha = .3; fr('#fff3bf', fx - 1, fy - 1, 3, 3); ctx.globalAlpha = 1; } }
  }
}
function drawGround(theme) {
  for (const g of L.solids) {
    const x = Math.round(g.x - cam); if (x > W || x + g.w < 0) continue; const w = g.w; if (drawTripGround(g, x, w, theme)) continue;
    if (theme === 'office') { fr('#9a6134', x, g.y, w, H - g.y); for (let yy = g.y + 7, r = 0; yy < H; yy += 9, r++) { fr(r % 2 ? '#a86d3f' : '#8f5a2f', x, yy, w, 8); fr('#6b4226', x, yy + 8, w, 1); for (let xx = g.x + (r % 3) * 17 + 20; xx < g.x + w; xx += 52) fr('#6b4226', xx - cam, yy, 1, 8); }
      fr('#c08552', x, g.y, w, 6); fr('#dba577', x, g.y, w, 1); fr('#7a4f2c', x, g.y + 6, w, 1); }
    else if (theme === 'chat') { fr('#ffc2dc', x, g.y + 4, w, H - g.y); for (let yy = g.y + 10; yy < H; yy += 4) for (let xx = (yy >> 2) % 2 * 4; xx < w; xx += 8) fr('#ffb0d0', x + xx, yy, 2, 2);
      for (let xx = 0; xx < w; xx += 12) { fr('#ffffff', x + xx, g.y, 12, 3); fr('#ffe3ef', x + xx + 2, g.y - 2, 8, 2); } fr('#ff9ec4', x, g.y + 4, w, 1); }
    else if (theme === 'street') { fr('#8a9199', x, g.y, w, H - g.y); for (let yy = g.y + 8, r = 0; yy < H; yy += 12, r++) { fr('#6c737a', x, yy, w, 1); for (let xx = g.x + (r % 2) * 12; xx < g.x + w; xx += 24) fr('#6c737a', xx - cam, yy, 1, 12); for (let xx = g.x + 5 + (r * 7) % 20; xx < g.x + w; xx += 37) fr('#b0b7bf', xx - cam, yy + 4, 5, 1); }
      fr('#ced4da', x, g.y, w, 6); fr('#f1f3f5', x, g.y, w, 1); fr('#5c636a', x, g.y + 6, w, 2); }
    else if (theme === 'village') { fr('#9c6b45', x, g.y, w, H - g.y); for (let yy = g.y + 12; yy < H; yy += 6) for (let xx = g.x + (yy * 7) % 23; xx < g.x + w; xx += 29) { fr('#7a5134', xx - cam, yy, 3, 2); fr('#c08a5b', xx - cam + 9, yy + 2, 2, 1); }
      fr('#51cf66', x, g.y, w, 6); fr('#8ce99a', x, g.y, w, 1); fr('#2f9e44', x, g.y + 6, w, 2); for (let xx = g.x + 3; xx < g.x + w - 2; xx += 11) fr((xx >> 2) % 2 ? '#69db7c' : '#2f9e44', xx - cam, g.y - 2, 1, 2); }
    else { fr('#3e2750', x, g.y, w, H - g.y); for (let yy = g.y + 12; yy < H; yy += 7) for (let xx = g.x + (yy * 5) % 19; xx < g.x + w; xx += 23) fr('#553569', xx - cam, yy, 3, 2);
      fr('#e8779c', x, g.y, w, 5); fr('#ffb3c9', x, g.y, w, 1); fr('#a8416b', x, g.y + 5, w, 2); for (let xx = g.x + 4; xx < g.x + w - 2; xx += 13) { fr('#ff8fb1', xx - cam, g.y - 2, 1, 2); if (xx % 3 === 0) fr('#ffd43b', xx - cam + 5, g.y - 1, 2, 1); } }
  }
}
function ds(img, x, y, flip) { ctx.drawImage(flip ? flipped(img) : img, Math.round(x - cam), Math.round(y)); }
/* Vẽ nhân vật; drop = hạ phần đầu 1px (thở, gật đầu, nói), cut = hàng tách đầu/thân trên sprite.
   Khi lật, độ lệch tính theo bề rộng ảnh để trục đối xứng luôn ở x + 6. */
function drawBody(img, x, y, face, drop, cut = 17) {
  const src = face < 0 ? flipped(img) : img, dx = Math.round(x - (face < 0 ? img.width - 18 : 5) - cam), dy = Math.round(y + 30 - (img.height - 1));
  if (!drop) { ctx.drawImage(src, dx, dy); return; }
  ctx.drawImage(src, 0, cut, src.width, src.height - cut, dx, dy + cut, src.width, src.height - cut);
  ctx.drawImage(src, 0, 0, src.width, cut, dx, dy + 1, src.width, cut);
}
function drawChar(img, x, y, face) { drawBody(img, x, y, face, false); }
function drawParticles() { for (const q of particles) fr(q.col, q.x - cam, q.y, q.sz, q.sz); }
function drawRain() { ctx.fillStyle = 'rgba(200,220,255,.55)'; for (const d of rain) { ctx.fillRect(Math.round(d.x), Math.round(d.y), 1, 6); } ctx.fillStyle = 'rgba(220,235,255,.7)'; for (const s of splashes) ctx.fillRect(Math.round(s.x), Math.round(s.y), s.w, 1); }
let splashes = [];
function updateFx(dt) {
  for (const q of particles) { q.x += q.vx * dt; q.y += q.vy * dt; q.vy += q.g * dt; q.life -= dt; }
  particles = particles.filter(q => q.life > 0);
  splashes.forEach(s => s.t -= dt); splashes = splashes.filter(s => s.t > 0);
  if (weather.rain) { if (rain.length < 140) rain.push({ x: Math.random() * (W + 60), y: -Math.random() * H });
    for (const d of rain) { d.y += 330 * dt; d.x -= 45 * dt; if (d.y > GY - 2) { if (Math.random() < .5) splashes.push({ x: d.x - 1, y: GY - 1, w: 3, t: .12 }); d.y = -6; d.x = Math.random() * (W + 60); } } }
}
