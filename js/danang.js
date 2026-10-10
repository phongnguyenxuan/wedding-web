/* ================== ĐÀ NẴNG: CẦU RỒNG ĐÊM CUỐI TUẦN ==================
   Bố cục (toạ độ màn hình, camera đứng yên ở chương này):
   - trời 0..DN_BANK: đêm đen thẫm như ảnh chụp cầu Rồng, ửng tím đèn phố sát chân trời; trăng, sao mờ, máy bay hạ cánh
   - bờ xa (chân y = DN_BANK): bán đảo Sơn Trà (tượng Phật Bà, vòm radar), phố ven sông, trung tâm hành chính, vòng quay Sun Wheel
   - nước xa DN_BANK..DN_WL: cầu Rồng vắt ngang (mặt cầu DN_DECK): thân rồng thép vàng khía đốt, mào vảy trên lưng, một nhịp vòm lớn
     có dây treo trắng, luồn xuống gầm (gầm hắt đỏ cam) rồi ngóc lên thành đầu rồng sát mặt cầu; gầm cầu đèn xanh dương hình mắt,
     trụ hắt xanh, cột đèn trắng cao; đầu rồng phun lửa chéo lên trời kèm khói, rồi phun nước (props.fire, props.dnWater)
   - nước gần DN_WL..DN_WALK: đèn cầu kéo thành vệt màu dọc trên mặt sông, du thuyền sông Hàn
   - lối đi Cầu Tình Yêu từ DN_WALK trở xuống: lan can khoá tình yêu, đèn trái tim, đá lát phối cảnh */
const DN_BANK = 150, DN_DECK = 158, DN_WL = 178, DN_WALK = 207, DN_HX = 318, DN_HY = 118;
const DN_MOON = [150, 40], DN_MOUTH = [DN_HX + 47, DN_HY + 12], DN_FDIR = [.91, -.42];   // miệng rồng & hướng phun (chéo lên phải)
/* thân rồng: [x đầu, x cuối, biên độ] – dương = vòm trên mặt cầu, âm = lượn xuống dưới gầm */
const DN_SEG = [[-40, 30, -9], [30, 222, 46], [222, 316, -10]];
/* [viền, tối, giữa, sáng, loá]: thép vàng dưới đèn hắt; đoạn luồn dưới gầm ửng đỏ cam */
const DN_GOLD = ['#3e2306', '#b86e0c', '#eea21c', '#ffd040', '#fff2b0'], DN_UNDER = ['#3a0e10', '#a82a14', '#e2561e', '#ff8a3a', '#ffd0a0'];
const DN_PIERS = [-2, 100, 200, 288, 400];
const DN_LAMPS = [12, 44, 76, 108, 140, 172, 204, 236, 268, 300, 388, 420, 452];
const DN_WISP = [[0, 30, 64, 1.2], [200, 58, 40, .9], [330, 24, 52, 1.5], [90, 76, 34, 1.1]];
/* phố bên kia sông: [x, rộng, cao, kiểu] – 0 nhà cửa sổ ô, 1 kính dải dọc, 2 hai tầng bậc, 3 khách sạn vương miện đèn, 4 trung tâm hành chính */
const DN_BLD = [[0, 18, 22, 0], [16, 14, 30, 0], [28, 20, 18, 2], [46, 16, 26, 0], [60, 22, 20, 0], [80, 12, 34, 1], [90, 20, 46, 0], [108, 14, 38, 2], [120, 24, 62, 3], [142, 16, 44, 1],
  [156, 20, 30, 0], [174, 18, 52, 0], [190, 12, 40, 1], [202, 18, 92, 4], [220, 16, 48, 0], [234, 24, 36, 2], [256, 14, 64, 1], [268, 20, 44, 0], [286, 18, 30, 0], [302, 26, 56, 3],
  [326, 16, 38, 0], [340, 22, 28, 0], [360, 14, 22, 0], [372, 24, 16, 2], [394, 20, 12, 0]];
const DN_BEACON = [], DN_CROWN = [];
let DN_AC = null;
const dnMt = x => 46 * Math.exp(-(((x - 446) / 40) ** 2)) + 14 * Math.exp(-(((x - 392) / 22) ** 2)) + 6 * Math.exp(-(((x - 470) / 30) ** 2)) + 4;   // dáng Sơn Trà

/* trời: gọi từ tripSky, vẽ thẳng vào ImageData */
function dnSky(id) {
  ditherInto(id, W, ['#020309', '#04060f', '#060918', '#0a0e22', '#12132c', '#1e1736', '#2c1a3c'], 0, DN_BANK); ditherInto(id, W, ['#05070f', '#05070f'], DN_BANK, H);
  const [mx, my] = DN_MOON; ditherDisc(id, W, mx, my, 8, 18, '#0f1430', '#0a0e22');   // quầng trăng mờ
  const put = (x, y, col) => { const p = (y * W + x) * 4, c = hexRGB(col); id.data[p] = c[0]; id.data[p + 1] = c[1]; id.data[p + 2] = c[2]; };
  for (let y = -7; y <= 7; y++) for (let x = -7; x <= 7; x++) { const d = x * x + y * y; if (d > 52) continue;
    put(mx + x, my + y, d > 40 && x + y > 2 ? '#d9cfae' : (x + 3) ** 2 + (y - 1) ** 2 < 6 || (x - 3) ** 2 + (y + 3) ** 2 < 3 || (x - 1) ** 2 + (y - 4) ** 2 < 2 ? '#e6dcbc' : '#fff6da'); }   // trăng rằm, vài vết sẫm
}

/* ---- lớp xa tĩnh: Sơn Trà, phố ven sông, bờ kè xa (vẽ sẵn một lần) ---- */
let dnFarC = null;
function dnFar() {
  if (dnFarC) return dnFarC;
  const c = document.createElement('canvas'); c.width = W; c.height = DN_BANK + 1; const g = c.getContext('2d'), R = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, h); };
  // bán đảo Sơn Trà: đồi rừng tối, viền núi ửng trăng, đường đèo lấp lánh
  for (let x = 330; x < W; x++) { const top = Math.round(DN_BANK - dnMt(x)); R('#12173d', x, top, 1, DN_BANK - top); R('#262f62', x, top, 1, 1);
    for (let y = top + 2; y < DN_BANK; y += 2) if (rnd(x * 3.1 + y * 7.7) > .72) R('#0c1031', x, y + (x & 1), 1, 1); }
  for (let i = 0; i < 40; i++) { const t = i / 39, x = Math.round(476 - t * 92 + Math.sin(t * 9) * 8), y = Math.round(DN_BANK - dnMt(x) * (.35 + t * .3) + 2); if (i % 2) R('#e8b85a', x, y, 1, 1); }
  const by = Math.round(DN_BANK - dnMt(400));   // tượng Phật Bà Quán Thế Âm chùa Linh Ứng
  R('#8a8578', 397, by - 2, 7, 2); R('#cfc6b0', 398, by - 3, 5, 1); R('#efe8d6', 399, by - 12, 3, 9); R('#d6cdb6', 401, by - 11, 1, 8); R('#efe8d6', 398, by - 6, 1, 3); R('#f6f0e0', 400, by - 14, 1, 2); R('#efe8d6', 399, by - 13, 3, 1);
  const ry = Math.round(DN_BANK - dnMt(446)); R('#9aa3c8', 446, ry - 7, 1, 4); R('#c8cfe8', 443, ry - 3, 7, 3); R('#e6ebfa', 444, ry - 4, 5, 1); R('#8a93b8', 443, ry - 1, 7, 1);   // vòm radar đỉnh núi
  // phố ven sông
  for (const [x, w, h, t] of DN_BLD) { const top = 146 - h, lit = (xx, yy) => rnd(xx * 1.7 + yy * 3.3);
    if (t === 2) { R('#141a40', x + 3, top - 8, w - 6, 8); R('#262f62', x + 3, top - 8, w - 6, 1); for (let xx = x + 5; xx < x + w - 4; xx += 3) if (lit(xx, top) > .5) R('#ffcf6e', xx, top - 5, 1, 1); }
    if (t === 3) { R('#1f2756', x - 1, top - 3, w + 2, 3); R('#3a4274', x + (w >> 1), top - 14, 1, 11); DN_CROWN.push([x - 1, top - 3, w + 2]); DN_BEACON.push([x + (w >> 1), top - 15]); }
    if (t === 4) {   // trung tâm hành chính: thân gân dọc, đỉnh thuôn tròn, chóp ăng-ten
      const cols = []; for (let i = 0; i < w; i++) { const u = (i + .5) / w * 2 - 1, ct = top + Math.round((1 - Math.sqrt(1 - u * u)) * 14); cols.push(ct); R(i % 2 ? '#121a44' : '#1c2a5e', x + i, ct, 1, 146 - ct); R('#2c3a74', x + i, ct, 1, 1); }
      R('#3a4274', x + (w >> 1), top - 12, 1, 12); DN_BEACON.push([x + (w >> 1), top - 13]); DN_AC = { x, cols }; continue; }
    R('#141a40', x, top, w, h); R('#1f2756', x, top, 1, h); R('#0b0f2c', x + w - 1, top, 1, h); R('#262f62', x, top, w, 1);
    if (t === 1) { R('#17204c', x + 1, top + 1, w - 2, h - 1); for (let xx = x + 2; xx < x + w - 1; xx += 3) for (let yy = top + 2; yy < 145; yy++) { const n = rnd(xx * 7.1 + (yy >> 2) * 13.3); R(n > .6 ? '#8cc4ff' : n > .35 ? '#2c4a8a' : '#1f2f66', xx, yy, 1, 1); } }
    else for (let yy = top + 3; yy < 143; yy += 3) for (let xx = x + 2; xx < x + w - 2; xx += 3) { const n = lit(xx, yy); if (n > .62) R(n > .92 ? '#fff1c4' : n > .8 ? '#bfe3ff' : '#ffcf6e', xx, yy, 2, 1); else if (n < .14) R('#2a3268', xx, yy, 2, 1); }
    if (h > 40 && t !== 3) DN_BEACON.push([x + (w >> 1), top - 1]);
    if (t === 0 && h < 34 && x % 3 === 0) { R('#3a4274', x + 3, top - 4, 5, 4); R('#4a5284', x + 3, top - 4, 5, 1); }   // bồn nước, tum thang
  }
  // hàng cây & đèn đường Bạch Đằng, bờ kè xa
  for (let x = 2; x < W; x += 9) { const r = 2 + (x % 3); for (let j = -r; j <= 0; j++) R('#0d1636', x - r + Math.abs(j) - 1, 145 + j, (r - Math.abs(j)) * 2 + 3, 1); }
  R('#090c26', 0, 146, W, 5); R('#1c2152', 0, 146, W, 1); for (let x = 5; x < W; x += 12) { R('#3a3f6e', x, 143, 1, 3); R('#ffe6a8', x, 142, 2, 1); }
  return dnFarC = c;
}

/* ---- phố sống động: đèn báo không lưu, vương miện LED, mặt dựng LED trung tâm hành chính ---- */
function dnCity() {
  DN_BEACON.forEach(([x, y], i) => { if (Math.floor(time * 1.1 + i * .37) % 2) { fr('#ff3b3b', x, y, 1, 1); glow(x, y, 2, '#ff3b3b', .25); } });
  DN_CROWN.forEach(([x, y, w], i) => { const c = ['#ff6bd6', '#5fd3ff', '#ffd43b', '#8cf0be'][(Math.floor(sceneT / 3) + i) % 4]; fr(c, x, y, w, 1); ctx.globalAlpha = .6; fr(c, x, y + 2, w, 1); ctx.globalAlpha = 1; });
  if (DN_AC) { const s = Math.floor(sceneT * 18); DN_AC.cols.forEach((ct, i) => { if (i % 2) return; for (let y = ct + 1; y < 145; y++) { const k = (y + s) % 22; if (k < 5) fr(k < 2 ? '#c9f2ff' : '#5fd3ff', DN_AC.x + i, y, 1, 1); } }); }
}
/* vòng quay Sun Wheel: vành LED chạy đuổi, cabin, đồng hồ ở trục */
function dnWheel() {
  const cx = 52, cy = 98, R = 28, a0 = sceneT * .12, pal = ['#ff6bd6', '#ffd43b', '#5fd3ff'];
  ndSeg(cx, cy, cx - 15, 146, '#262b56', 2); ndSeg(cx, cy, cx + 15, 146, '#262b56', 2); ndSeg(cx - 9, 126, cx + 9, 126, '#262b56');
  for (let i = 0; i < 16; i++) { const a = a0 + i / 16 * Math.PI * 2; ndSeg(cx, cy, cx + Math.cos(a) * R, cy + Math.sin(a) * R, '#20254c'); }
  const n = Math.round(R * Math.PI * 2), s = Math.floor(sceneT * 8);
  for (let i = 0; i < n; i++) { const a = a0 + i / n * Math.PI * 2, x = Math.round(cx + Math.cos(a) * R), y = Math.round(cy + Math.sin(a) * R), k = (i + s) % 9; fr(k < 6 ? pal[Math.floor((i + s) / 9) % 3] : '#2a2f5a', x, y, 1, 1); }
  for (let i = 0; i < 16; i++) { const a = a0 + i / 16 * Math.PI * 2, x = Math.round(cx + Math.cos(a) * R), y = Math.round(cy + Math.sin(a) * R); fr('#3a3f6e', x - 1, y + 1, 3, 3); fr(i % 3 ? '#ffd98a' : '#bfe3ff', x, y + 2, 1, 1); }
  pixCircle(cx, cy, 3, '#2a2f5a'); pixCircle(cx, cy, 2, '#e9ecef'); fr('#1b1b2f', cx, cy - 2, 1, 2); fr('#1b1b2f', cx, cy, 2, 1);
  glow(cx, cy, R + 2, pal[Math.floor(sceneT / 2) % 3], .035);
}

/* ---- mặt nước: soi gương mọi thứ phía trên y0 (nén 1/2, gợn sóng ngang) ---- */
/* k = hệ số nén: 2 = bóng thu ngắn (nước xa), < 1 = bóng kéo dài thành vệt dọc như ảnh chụp phơi sáng lâu */
function dnMirror(y0, y1, a, k) {
  for (let y = y0; y < y1; y++) { const d = y - y0, sh = Math.round(Math.sin(y * 2.1 + sceneT * 2.6) * (.6 + d / 10) + Math.sin(y * .7 - sceneT * 1.3) * .8);
    ctx.globalAlpha = Math.max(.2, a - d * .008) * (y % 2 ? .82 : 1); ctx.drawImage(cv, 0, y0 - 1 - Math.floor(d * k), W, 1, sh, y, W, 1); }
  ctx.globalAlpha = 1;
}
function dnRipples(y0, y1, seed) {   // gợn sóng sẫm trôi chậm cắt vụn vệt sáng
  for (let y = y0 + 1, r = 0; y < y1; y += 2, r++) for (let i = 0; i < 8; i++) { const len = 4 + Math.floor(rnd(seed + r * 7 + i) * 12), x = ((rnd(seed + r * 9 + i) * W + sceneT * (3 + r % 3) * (r % 2 ? 1 : -1)) % (W + 20) + W + 20) % (W + 20) - 10;
    ctx.globalAlpha = .55; fr(i % 4 ? '#03050d' : '#1a2350', x, y, len, 1); }
  ctx.globalAlpha = 1;
}
/* vệt sáng dọc lấp loá dưới mỗi nguồn sáng: [x, màu, bề rộng] */
function dnStreaks(y0, y1, list) {
  const fl = Math.floor(time * 6);
  for (const [x, col, w] of list) for (let y = y0; y < y1; y++) { const n = rnd(x * 3.7 + y * 11.3 + fl); if (n < .18 + (y - y0) / (y1 - y0) * .32) continue;
    ctx.globalAlpha = .85 - (y - y0) / (y1 - y0) * .4; fr(col, x + Math.round(Math.sin(y * 1.7 + sceneT * 3) * (1 + (y - y0) / 12)), y, w, 1); }
  ctx.globalAlpha = 1;
}

/* ---- cầu Rồng ---- */
const dnBodyY = x => { for (const [a, b, A] of DN_SEG) if (x < b) return DN_DECK + 2 - A * Math.sin(Math.PI * Math.max(0, x - a) / (b - a)); const t = Math.min(1, (x - 316) / 20); return DN_DECK + 2 - 9 * t * t; };
const dnHot = () => props.fire > 0 || props.dnWater > 0;
/* đầu rồng nhìn sang phải, mõm hếch, há miệng: dựng từ các mảng đa giác rồi tự viền, tự đổ sáng tối như đèn hắt từ trên xuống.
   M thép vàng, K sừng, R khoang miệng, r họng (bừng sáng khi phun lửa) */
const DN_HEAD = { w: 54, h: 38, parts: [
  ['M', [[16, 9], [18, 14], [3, 7]]], ['M', [[14, 13], [15, 19], [0, 13]]], ['M', [[13, 18], [14, 24], [1, 21]]], ['M', [[12, 23], [14, 29], [2, 29]]], ['M', [[13, 28], [15, 34], [5, 36]]],   // bờm lửa
  ['K', [[19, 9], [22, 7], [11, 1], [5, 0], [9, 3]]], ['K', [[16, 11], [18, 9], [6, 5], [1, 6], [6, 8]]],   // sừng
  ['M', [[12, 38], [25, 38], [27, 29], [31, 23], [18, 19], [12, 27]]],   // cổ
  ['M', Array.from({ length: 16 }, (_, i) => [22 + Math.cos(i / 16 * Math.PI * 2) * 10, 17 + Math.sin(i / 16 * Math.PI * 2) * 10])],   // sọ
  ['R', [[26, 16], [50, 7], [50, 20], [27, 23]]], ['r', [[29, 18], [40, 15], [40, 20], [29, 21]]],   // khoang miệng, họng
  ['M', [[27, 22], [44, 20], [48, 22], [45, 25], [31, 29], [24, 27]]],   // hàm dưới
  ['M', [[21, 10], [34, 6], [46, 1], [51, 1], [53, 5], [49, 9], [37, 13], [26, 17]]],   // hàm trên
  ['M', [[30, 27], [37, 26], [28, 34]]], ['M', [[37, 25], [44, 23], [40, 31]]], ['M', [[20, 24], [26, 25], [15, 31]]]] };   // râu cằm nhọn, vây má
const dnHeadC = {};
function dnHead(hot) {
  if (dnHeadC[hot]) return dnHeadC[hot];
  const { w, h, parts } = DN_HEAD, t = document.createElement('canvas'); t.width = w; t.height = h; const tg = t.getContext('2d'), G = Array.from({ length: h }, () => Array(w).fill(''));
  for (const [k, pts] of parts) { tg.clearRect(0, 0, w, h); tg.fillStyle = '#fff'; tg.beginPath(); pts.forEach(([x, y], i) => i ? tg.lineTo(x, y) : tg.moveTo(x, y)); tg.closePath(); tg.fill();
    const d = tg.getImageData(0, 0, w, h).data; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (d[(y * w + x) * 4 + 3] > 120) G[y][x] = k; }
  const at = (x, y) => (G[y] && G[y][x]) || '', open = (x, y) => { const v = at(x, y); return !v || v === 'O'; };
  for (const [x, y] of [[30, 16], [30, 17], [36, 14], [36, 15], [42, 12], [42, 13], [47, 10], [33, 20], [33, 19], [40, 19], [40, 18], [45, 19]]) if (G[y][x]) G[y][x] = 'W';   // nanh
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (G[y][x] === 'M' && [[0, 1], [0, -1], [1, 0]].some(([a, b]) => at(x + a, y + b) === 'R' || at(x + a, y + b) === 'r')) G[y][x] = 'P';   // viền môi sẫm
  for (const [x, y, k] of [[24, 8, 'H'], [25, 7, 'H'], [26, 7, 'H'], [27, 7, 'H'], [28, 7, 'H'], [29, 8, 'H'], [25, 9, 'P'], [26, 9, 'P'], [27, 9, 'P'], [28, 9, 'P'], [29, 9, 'P'],
    [26, 10, 'W'], [27, 10, 'W'], [28, 10, 'E'], [26, 11, 'W'], [27, 11, 'E'], [28, 11, 'E'], [25, 10, 'P'], [25, 11, 'P'], [50, 3, 'P'], [51, 3, 'P']]) G[y][x] = k;   // mày, mắt, lỗ mũi
  const O = []; for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!G[y][x] && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => { const v = at(x + a, y + b); return v && v !== 'O'; })) O.push([x, y]);
  for (const [x, y] of O) G[y][x] = 'O';
  const S = G.map(r => r.slice());
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const v = G[y][x];
    if (v === 'M') S[y][x] = open(x, y - 1) ? 'H' : open(x, y - 2) ? 'L' : open(x, y + 1) || open(x - 1, y) ? 'D' : x < 30 && y > 18 && y % 3 === 0 && (x + y) % 4 === 0 ? 'D' : 'M';   // vảy ở cổ
    if (v === 'K') S[y][x] = open(x, y - 1) ? 'H' : open(x, y + 1) ? 'M' : 'L'; }
  const r = DN_GOLD, pal = { O: r[0], D: r[1], M: r[2], L: r[3], H: r[4], P: '#7a3a08', W: '#fff8e6', E: '#1b1b2f', R: hot ? '#e8590c' : '#5a0c14', r: hot ? '#fff3bf' : '#b02020' };
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d');
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const p = pal[S[y][x]]; if (p) { g.fillStyle = p; g.fillRect(x, y, 1, 1); } }
  return dnHeadC[hot] = c;
}
const DN_CARS = [[34, 0, 1, 'car', '#e03131'], [22, 160, 1, 'moto', '#4dabf7'], [40, 300, 1, 'car', '#f1f3f5'], [26, 80, -1, 'moto', '#ffd43b'], [36, 240, -1, 'car', '#1c7ed6'], [30, 420, -1, 'car', '#adb5bd'], [20, 380, 1, 'moto', '#ff8fab']];
function dnCars() {
  for (const [sp, off, d, t, col] of DN_CARS) { const lx = loopX(sp, off, W + 80), x = Math.round(d > 0 ? lx : W - lx), P = (i, j, w, h, c) => fr(c, d > 0 ? x + i : x - i - w + 1, j, w, h);
    if (t === 'car') { P(0, 154, 8, 3, col); P(2, 152, 4, 2, col); P(3, 152, 2, 1, '#9ad0ff'); P(8, 155, 1, 1, '#fff3bf'); P(-1, 155, 1, 1, '#ff4d4d'); ctx.globalAlpha = .18; P(9, 154, 8, 3, '#fff3bf'); ctx.globalAlpha = 1; }
    else { P(0, 156, 4, 1, '#1b1b2f'); P(1, 154, 3, 2, '#495057'); P(1, 152, 2, 2, col); P(4, 155, 1, 1, '#fff3bf'); P(-1, 155, 1, 1, '#ff4d4d'); } }
}
function dnBridge() {
  // trụ cầu: bê tông hắt đèn xanh dương
  for (const x of DN_PIERS) { glow(x + 6, 172, 12, '#2f5bff', .14); fr('#16204e', x, 166, 12, DN_WL - 166); fr('#3556d8', x + 1, 166, 2, DN_WL - 166); fr('#24369a', x + 3, 166, 3, DN_WL - 166); fr('#0d1236', x + 10, 166, 2, DN_WL - 166); fr('#4a6cff', x, 166, 12, 1); }
  // dây treo trắng trong lòng vòm
  for (const [a, b, A] of DN_SEG) if (A > 0) for (let x = a + 6; x < b - 4; x += 5) { const y = Math.round(dnBodyY(x)) + 5; if (DN_DECK - y > 2) { fr('#9aa3d0', x, y, 1, DN_DECK - y); fr('#e6ebff', x, y, 1, 1); } }
  // cột đèn trắng cao trên cầu
  for (const x of DN_LAMPS) { fr('#3a3f62', x, 141, 1, 17); fr('#3a3f62', x - 1, 141, 3, 1); fr('#ffffff', x, 140, 1, 1); fr('#e8eeff', x - 1, 142, 3, 1); glow(x, 141, 4, '#dfe6ff', .18); }
  dnCars();
  // gầm cầu: mỗi nhịp một vệt đèn xanh dương hình mắt
  for (let i = 0; i < DN_PIERS.length; i++) { const a = DN_PIERS[i] + 13, b = (DN_PIERS[i + 1] ?? W + 60) - 1;
    for (let x = Math.max(0, a); x < Math.min(W, b); x++) { const d = Math.round(Math.sin(Math.PI * (x - a) / (b - a)) ** .6 * 5);
      fr('#1d2fa0', x, DN_DECK + 7, 1, d + 1); if (d > 1) fr('#3a62ff', x, DN_DECK + 7, 1, d - 1); if (d > 3) fr('#9fb6ff', x, DN_DECK + 7, 1, d - 3); }
    ellipseGlow(Math.round((a + b) / 2), DN_DECK + 9, Math.round((b - a) / 2), 4, '#2f5bff', .1); }
  // thân rồng: ống thép vàng khía đốt, mào vảy trên lưng; đoạn luồn dưới gầm ửng đỏ cam
  for (const [a, b, A] of DN_SEG) if (A < 0) ellipseGlow(Math.round((a + b) / 2), DN_DECK + 10, Math.round((b - a) / 2) + 6, 6, '#ff5a1e', .16);
  const s = Math.floor(sceneT * 24); let yp = dnBodyY(-1);
  for (let x = 0; x <= 338; x++) { const yc = dnBodyY(x), top = Math.round(Math.min(yc, yp)) - 4, bot = Math.round(Math.max(yc, yp)) + 3, r = yc > DN_DECK + 4 ? DN_UNDER : DN_GOLD; yp = yc;
    fr(r[0], x, top, 1, bot - top + 1); fr(r[2], x, top + 1, 1, bot - top - 1); fr(r[4], x, top + 1, 1, 1); fr(r[3], x, top + 2, 1, 2); fr(r[1], x, bot - 2, 1, 2);
    if (x % 4 === 0) fr(r[1], x, top + 3, 1, bot - top - 4); else if (x % 4 === 1) fr(r[3], x, top + 3, 1, bot - top - 5);   // khía đốt
    if (yc < DN_DECK - 2) { const hh = [1, 2, 3, 2, 0][x % 5]; if (hh) { fr(r[0], x, top - hh - 1, 1, 1); fr(hh > 2 ? r[4] : r[3], x, top - hh, 1, hh); } }   // mào vảy
    if ((x + s) % 22 === 0) fr('#ffffff', x, top + 1, 1, 1); }
  // mặt cầu: lan can, dầm biên tối, hàng đèn vàng nhỏ
  for (let x = 0; x < W; x += 6) fr('#3a3f62', x, 155, 1, 3); fr('#4a5078', 0, 155, W, 1);
  fr('#6a7098', 0, DN_DECK, W, 1); fr('#141830', 0, DN_DECK + 1, W, 5); fr('#0b0d1e', 0, DN_DECK + 6, W, 1); for (let x = 4; x < W; x += 12) fr('#1c2142', x, DN_DECK + 1, 1, 5);
  for (let x = 1; x < W; x += 3) fr('#ffe6a8', x, DN_DECK + 3, 1, 1);
  // đầu rồng, râu bay theo gió
  const r = DN_GOLD;
  for (let i = 0; i < 12; i++) fr(r[3], DN_HX + 44 - i, DN_HY + 26 + Math.round(i * .5 + Math.sin(sceneT * 3 - i * .45) * 1.2), 1, 1);   // râu cằm bay
  glow(DN_HX + 26, DN_HY + 18, 18, '#ffb02e', props.fire > 0 ? .09 : .05);
  ctx.drawImage(dnHead(props.fire > 0), DN_HX, DN_HY);
  if (props.fire > 0) dnFire();
}
/* luồng lửa pixel phun chéo lên trời: lõi trắng, vàng, cam, mép đỏ lởm chởm; dài dần lúc mới phun, co về miệng lúc tắt */
const dnFireLen = () => Math.min(84, (2.2 - props.fire) * 210);
function dnFire() {
  const f = props.fire, len = dnFireLen(), st = f < .35 ? (.35 - f) / .35 * len : 0, [mx, my] = DN_MOUTH, [ux, uy] = DN_FDIR, fl = Math.floor(time * 20);
  glow(Math.round(mx + ux * len * .55), Math.round(my + uy * len * .55), Math.round(len * .22) + 5, '#ff922b', .06); glow(mx, my, 7, '#ffd43b', .2);
  for (let i = st; i < len; i += .7) { const hw = Math.min(9, 1.2 + i * .15), wob = Math.sin(i * .2 - time * 16) * (i / 22);
    for (let j = -hw; j <= hw; j += .8) { const n = rnd(Math.floor(i) * 13.1 + Math.floor(j) * 7.3 + fl), e = Math.abs(j) / hw + n * .35 + i / len * .3; if (e > 1.15 || (i > len * .7 && n > .5)) continue;
      fr(e < .45 ? '#fffbe6' : e < .7 ? '#ffe066' : e < .95 ? '#ff922b' : '#e8590c', mx + ux * i - uy * (j + wob), my + uy * i + ux * (j + wob), 1, 1); } }
}

/* ---- du thuyền sông Hàn: P lật dọc khi vẽ bóng dưới nước ---- */
function dnBoat(x, y, d, sc, flip) {
  x = Math.round(x); y = Math.round(y + Math.sin(sceneT * 1.6 + x * .05) * .6); const Lw = sc ? 30 : 44, P = (i, j, w, h, c) => fr(c, d > 0 ? x + i : x + Lw - i - w, flip ? y - j - h + 1 : y + j, w, h);
  P(0, 0, Lw, 1, '#e9ecef'); P(1, 1, Lw - 3, 3, '#1c2340'); P(3, 4, Lw - 8, 1, '#141a33'); P(Lw - 2, 0, 2, 2, '#e9ecef'); P(Lw - 3, 2, 2, 1, '#1c2340');
  const cw = sc ? 20 : 32; P(4, -5, cw, 5, '#e9ecef'); for (let i = 6; i < cw + 2; i += 4) P(i, -4, 3, 3, Math.floor(time * .5 + i) % 7 ? '#ffd98a' : '#fff3bf');
  if (!sc) { P(9, -9, 22, 4, '#dee2e6'); for (let i = 11; i < 29; i += 4) P(i, -8, 2, 2, '#ffe8a3'); P(7, -10, 26, 1, '#c92a2a'); P(20, -18, 1, 8, '#adb5bd'); }
  else { P(6, -7, 14, 2, '#c92a2a'); P(12, -12, 1, 5, '#adb5bd'); }
  const mt = sc ? -12 : -18, mxx = sc ? 12 : 20, s = Math.floor(time * 3);   // dây đèn màu từ cột xuống mũi & đuôi
  for (const [ex, ey] of [[0, -1], [Lw - 1, -1]]) for (let k = 1; k < 9; k++) { const u = k / 9; P(Math.round(mxx + (ex - mxx) * u), Math.round(mt + (ey - mt) * u + Math.sin(u * Math.PI) * 2), 1, 1, ['#ff6b6b', '#ffd43b', '#51cf66', '#4dabf7', '#ff8fab'][(k + s) % 5]); }
}
function dnBoats() {
  const a = loopX(7, 60, W + 160) - 60, b = W - loopX(5, 200, W + 140) + 30;
  for (const [x, y, d, sc] of [[b, 186, -1, 1], [a, 197, 1, 0]]) { ctx.globalAlpha = .25; dnBoat(x, y + 6, d, sc, true); ctx.globalAlpha = 1; dnBoat(x, y, d, sc, false); ellipseGlow(Math.round(x + (sc ? 15 : 22)), y + 4, sc ? 18 : 26, 2, '#ffd98a', .06); }
}

/* ---- Cầu Tình Yêu: lan can khoá tình yêu, cột đá, đèn trái tim ---- */
const DN_HEART = ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'];
let dnRailC = null;
function dnRail() {
  if (dnRailC) return dnRailC;
  const y0 = 170, c = document.createElement('canvas'); c.width = W; c.height = DN_WALK + 2 - y0; const g = c.getContext('2d'), R = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y - y0, w, h); };
  for (let x = 0; x < W; x += 3) R('#3c4068', x, 198, 1, 8);   // song chắn
  R('#4a4f78', 0, 205, W, 1); R('#cfd4f0', 0, 196, W, 1); R('#9aa0c8', 0, 197, W, 1); R('#5a5f88', 0, 198, W, 1);   // tay vịn
  for (let x = 1; x < W; x += 3) for (let y = 199; y < 205; y += 3) { const n = rnd(x * 2.3 + y * 5.1), near = Math.abs(x - 240) < 150 ? .45 : .75; if (n > near) { const col = ['#e03131', '#ff8fab', '#ffd43b', '#ced4da', '#4dabf7', '#e64980'][Math.floor(n * 97) % 6]; R(col, x - 1, y + 1, 2, 2); R('#868e96', x - 1, y, 1, 1); } }   // ổ khoá tình yêu
  for (let i = 0; i < 12; i++) { const x = 8 + i * 40;   // cột đá
    R('#5a5f85', x - 1, 193, 7, 2); R('#8a90b8', x - 1, 193, 7, 1); R('#4a4f75', x, 195, 5, 12); R('#6a7098', x, 195, 1, 12); R('#33375a', x + 4, 195, 1, 12);
    if (i % 2) continue; R('#2a2e4e', x + 2, 180, 1, 13); R('#4a4f78', x + 2, 180, 1, 1);   // cột đèn trái tim
    DN_HEART.forEach((row, j) => { for (let k = 0; k < 7; k++) if (row[k] === '#') R(j < 2 && k < 3 ? '#ffc2cf' : j > 3 ? '#d6336c' : '#ff4d6d', x - 1 + k, 174 + j, 1, 1); }); }
  R('#5a5f85', 0, DN_WALK, W, 1); R('#2a2e4e', 0, DN_WALK + 1, W, 1);
  return dnRailC = c;
}

/* ---- toàn cảnh ---- */
function dnScene() {
  for (let i = 0; i < 40; i++) { const x = Math.floor(rnd(i + 300) * W), y = 17 + Math.floor(rnd(i + 380) * 100); if (Math.hypot(x - DN_MOON[0], y - DN_MOON[1]) < 12) continue;
    const p = Math.floor(time * 2 + i * 1.7) % 9; if (p === 0) continue; fr(i % 3 ? '#4a5070' : '#9aa0c0', x, y, 1, 1); }
  for (const [off, y, len, sp] of DN_WISP) { const x = Math.round(loopX(sp, off, W + 160) - 60); fr('#0e1226', x, y, len, 1); fr('#161a34', x + 5, y - 1, len >> 1, 1); fr('#0b0e20', x + 8, y + 1, len - 12, 1); }
  { const x = Math.round(loopX(12, 140, W + 200) - 80), y = 30 + Math.round(x * .05); fr('#8a93b8', x, y, 7, 1); fr('#8a93b8', x, y - 1, 1, 1); fr('#8a93b8', x + 3, y + 1, 2, 1);   // máy bay hạ cánh sân bay Đà Nẵng
    fr(Math.floor(time * 2) % 2 ? '#ff4d4d' : '#5a2030', x + 2, y + 1, 1, 1); if (Math.floor(time * 1.3) % 3 === 0) { fr('#ffffff', x + 6, y, 1, 1); glow(x + 6, y, 2, '#ffffff', .3); } }
  const by = Math.round(DN_BANK - dnMt(400)); glow(400, by - 8, 7, '#fff3d6', .16);
  ctx.drawImage(dnFar(), 0, 0); dnCity(); dnWheel();
  { const ry = Math.round(DN_BANK - dnMt(446)); if (Math.floor(time * .9) % 2) { fr('#ff3b3b', 446, ry - 8, 1, 1); glow(446, ry - 8, 2, '#ff3b3b', .3); } }
  fr('#06081a', 0, DN_BANK + 1, W, DN_WL - DN_BANK - 1); dnMirror(DN_BANK + 1, DN_WL, .55, 2); dnRipples(DN_BANK + 1, DN_WL, 11);
  dnBridge();
  // nước gần: bóng cầu kéo dài thành vệt màu – xanh dưới gầm & trụ, vàng dưới vòm rồng, đỏ cam chỗ rồng luồn, trắng dưới cột đèn
  fr('#04050d', 0, DN_WL, W, DN_WALK - DN_WL); dnMirror(DN_WL, DN_WALK, .85, .9); dnRipples(DN_WL, DN_WALK, 47);
  const st = [...DN_LAMPS.map(x => [x, '#eef2ff', 1]), ...DN_PIERS.map(x => [x + 2, '#3a62ff', 4]), ...DN_SEG.filter(s => s[2] < 0).map(([a, b]) => [Math.round((a + b) / 2) - 2, '#ff6a2a', 3]),
    [70, '#ffd040', 1], [104, '#ffc030', 2], [146, '#ffd040', 1], [186, '#ffc030', 2], [DN_HX + 22, '#ffd040', 2], [DN_HX + 34, '#ffb02e', 1]];
  if (props.fire > 0) { const l = dnFireLen(); st.push([DN_MOUTH[0] + Math.round(l * .4), '#ffd43b', 3], [DN_MOUTH[0] + Math.round(l * .7), '#ff922b', 4], [DN_MOUTH[0] + Math.round(l * .9), '#e8590c', 2]); ellipseGlow(DN_MOUTH[0] + 30, DN_WL + 10, 44, 6, '#ff922b', .12); }
  dnStreaks(DN_WL, DN_WALK, st);
  dnBoats();
  ctx.drawImage(dnRail(), 0, 170);
  for (let i = 0; i < 12; i += 2) { const x = 8 + i * 40 + 2, fl = .22 + Math.sin(time * 4 + i) * .04; glow(x, 176, 7, '#ff6b8b', fl); fr('#ffe3ea', x - 1, 175, 1, 1); }
  for (let i = 0; i < 5; i++) { const p = Math.floor(time * 3 + i * 4.1) % 11; if (p) continue; fr('#ffffff', 40 + Math.floor(rnd(i + Math.floor(time * 3 / 11)) * 400), 201 + (i % 2) * 3, 1, 1); }   // ổ khoá loé sáng
  if (dnHot()) { ctx.globalAlpha = props.fire > 0 ? .05 : .025; fr(props.fire > 0 ? '#ff7a2a' : '#7cc4ff', 0, 0, W, DN_WALK); ctx.globalAlpha = 1; }
}
/* lối đi lát đá phối cảnh, vũng sáng hồng dưới đèn trái tim */
let dnWalkC = null;
function dnGround() {
  if (!dnWalkC) { const y0 = DN_WALK + 2, c = document.createElement('canvas'); c.width = W; c.height = H - y0; const g = c.getContext('2d'), R = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y - y0, w, h); };
    const rows = [y0, 213, 219, 226, 234, 243, 253, H];
    for (let b = 0; b < rows.length - 1; b++) { const ya = rows[b], yb = rows[b + 1];
      for (let y = ya; y < yb; y++) { const r = (y - 150) / 57, sp = 16 * r, off = (b % 2) * sp / 2;
        for (let x = 0; x < W; x++) { const u = (x - 240 - off) / sp, k = Math.floor(u), fx = u - k, n = rnd(k * 7.7 + b * 31.3), th = (BAYER[y & 3][x & 3] + .5) / 16;
          R(fx * sp < 1 ? '#262946' : y === ya ? '#4a4f75' : n > .66 ? (th < .5 ? '#3c4166' : '#383d61') : n > .33 ? '#363a5c' : (th < .3 ? '#363a5c' : '#32365a'), x, y, 1, 1); } }
      R('#262946', 0, yb - 1, W, 1); }
    dnWalkC = c; }
  ctx.drawImage(dnWalkC, 0, DN_WALK + 2);
  for (let i = 0; i < 12; i += 2) ellipseGlow(8 + i * 40 + 2, DN_WALK + 5, 18, 3, '#ff6b8b', .06);
}
function dnUpdate(dt) {
  const [mx, my] = [DN_MOUTH[0] + cam, DN_MOUTH[1]], [ux, uy] = DN_FDIR;
  if (props.fire > 0) { props.fire -= dt; if (props.fire <= 0) props.dnWater = 2.6;
    const l = dnFireLen();
    for (let i = 0; i < 3; i++) { const k = (.4 + Math.random() * .6) * l; particles.push({ x: mx + ux * k, y: my + uy * k + (Math.random() - .5) * 8, vx: 50 + Math.random() * 80, vy: -30 - Math.random() * 40, life: .5 + Math.random() * .3, max: .8, col: ['#ffd43b', '#ff922b', '#f03e3e', '#fff3bf'][i + (Math.random() < .5 ? 1 : 0)], sz: Math.random() < .3 ? 2 : 1, g: -40 }); }
    if (l > 40 && Math.random() < .5) particles.push({ x: mx + ux * l + (Math.random() - .5) * 10, y: my + uy * l - 4, vx: 6 + Math.random() * 14, vy: -14 - Math.random() * 14, life: 1.6 + Math.random() * .8, max: 2.4, col: ['#2a2a34', '#3a3640', '#4a4450'][Math.floor(Math.random() * 3)], sz: 2 + (Math.random() < .5 ? 1 : 0), g: -4 }); }   // khói đen bốc lên
  if (props.dnWater > 0) { props.dnWater -= dt;   // phun nước sau màn phun lửa: tia nước vồng lên rồi rơi xuống sông
    for (let i = 0; i < 5; i++) particles.push({ x: mx + Math.random() * 3, y: my - 1 + Math.random() * 3, vx: 70 + Math.random() * 80, vy: -70 - Math.random() * 40, life: 1 + Math.random() * .4, max: 1.4, col: ['#e7f5ff', '#a5d8ff', '#ffffff', '#74c0fc'][i % 4], sz: i % 3 ? 1 : 2, g: 150 }); }
}
