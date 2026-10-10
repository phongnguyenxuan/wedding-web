/* ================== QUY NHƠN: LÀNG CHÀI NHƠN HẢI ==================
   Bố cục (toạ độ màn hình, camera đứng yên ở chương này) – theo ảnh bờ kè bích hoạ làng chài Nhơn Hải buổi sáng:
   - trời 0..QN_HZ: xanh trong, nhạt dần về chân trời, mây ti mỏng trôi ngang (QN_WISP), mòng biển
   - biển QN_HZ..QN_SAND: xanh lam ngoài khơi, ngọc lam sát bờ; hòn Khô nhỏ ngoài xa; núi đá phủ cây bụi bên phải (qnTop),
     chân núi đá tảng sóng vỗ; tàu cá vỏ xanh viền đỏ/vàng, cabin trắng, mắt thuyền ở mũi đậu kín vịnh (QN_BOATS: xa nhỏ, gần to),
     thuyền thúng sát bờ (QN_BASKETS), một chiếc thúng có ngư dân chèo, ca nô chạy ngang kéo vệt bọt
   - bọt sóng + dải cát QN_SAND..QN_WALL
   - bờ kè QN_WALL..QN_WALK: mép kè sơn trắng xanh, tường bích hoạ biển (qnMural): phao cứu sinh, ca nô trắng, hai mô tô nước
     chở khách tung bọt trắng, bãi cát cam, rong biển, san hô ống tím, hai bạn nhỏ lặn biển áo vàng (một đứng, một lộn đầu chân nhái đỏ),
     san hô não xanh, san hô quạt vàng, san hô nhánh đỏ, cá nhỏ, bong bóng nước
   - vỉa hè lát gạch đỏ QN_WALK..QN_CURB (nhân vật đứng ở GY): đống lưới, thùng xốp đựng cá, thuyền thúng dựng nghiêng vào kè,
     xe máy dựng; bó vỉa xi măng, đường nhựa có vạch qua đường (QN_ZEBRA)
   - đường ở gần camera hơn vỉa hè: xe máy cỡ người thật chạy qua (QN_ROAD_V, qnTraffic) vẽ đè lên chân nhân vật, gọi từ tripOverlay */
const QN_HZ = 112, QN_SAND = 166, QN_WALL = 172, QN_MT = 175, QN_MB = 205, QN_WALK = 207, QN_CURB = 232, QN_ROAD = 238;
/* tàu cá [vỏ, viền mạn, cabin, mái, vỏ tối] */
const QN_HULL = [['#2a64c8', '#e03131', '#f1f3f5', '#1c4f9c', '#1d4a96'], ['#1f7fc4', '#ffd43b', '#e9f4ff', '#e03131', '#155f96'], ['#2b8a8a', '#f1f3f5', '#ffffff', '#1c7ed6', '#1f6666'],
  ['#f1f3f5', '#1c7ed6', '#ffffff', '#4dabf7', '#c9d1d8'], ['#3a5fd0', '#2f9e44', '#ffe8a3', '#c92a2a', '#2a46a0'], ['#c92a2a', '#1c7ed6', '#f1f3f5', '#495057', '#962020']];
/* [x, mặt nước, dài, màu, hướng] – xa (nhỏ, sát chân trời) → gần (to) */
const QN_BOATS = [
  [18, 117, 7, 0, 1], [46, 119, 9, 3, -1], [80, 116, 6, 1, 1], [104, 121, 8, 0, -1], [198, 118, 7, 2, 1], [230, 116, 6, 0, 1], [258, 120, 9, 4, -1], [290, 117, 7, 1, 1],
  [330, 121, 8, 3, 1], [356, 123, 9, 0, -1], [388, 122, 8, 5, 1], [414, 124, 7, 1, -1], [442, 123, 9, 0, 1], [468, 125, 7, 2, -1],
  [10, 132, 14, 0, 1], [62, 128, 12, 2, -1], [126, 135, 16, 1, 1], [172, 129, 13, 0, 1], [228, 133, 15, 3, -1], [300, 130, 12, 4, 1], [340, 137, 16, 0, -1], [398, 131, 14, 1, 1], [448, 136, 15, 5, -1],
  [28, 150, 24, 0, 1], [150, 147, 20, 1, -1], [270, 152, 26, 0, 1], [372, 148, 22, 2, -1], [432, 155, 20, 3, 1]];
/* thuyền thúng [x, mặt nước, rộng, màu, có người] */
const QN_BASKETS = [[88, 154, 9, '#2f4f7a', 1], [106, 157, 8, '#4a3424', 0], [194, 153, 10, '#1f5f7a', 0], [214, 156, 8, '#3a5a8a', 1], [318, 155, 9, '#4a3424', 0], [336, 158, 8, '#2f4f7a', 0], [404, 156, 10, '#1f6fae', 1], [462, 154, 8, '#4a3424', 0]];
const QN_WISP = [[0, 30, 70, 1.5], [180, 44, 50, 1], [320, 26, 90, 2], [90, 62, 40, .8], [400, 74, 60, 1.2]];
const QN_ZEBRA = [[240, 3], [245, 4], [251, 5]];   // vạch qua đường [y, dày]
/* xe máy cỡ người thật (qnBike): body [sáng, vừa, tối]; riders [lệch x, lệch y, kiểu người] – người sau vẽ trước.
   Kiểu người: fem, helmet [sáng, vừa, vành], mask (khẩu trang), shirt/pants [sáng, vừa, tối], long (áo dài tay chống nắng), shoes, hug (ôm eo người lái) */
const QN_ROAD_V = [
  { k: 0, sp: 34, off: 200, span: 1250, dir: 1, base: 250, load: 'fish', body: ['#74c0fc', '#1c7ed6', '#1864ab'],   // cô bán cá chạy Wave chở thùng xốp
    riders: [[9, 2, { fem: 1, helmet: ['#fff3bf', '#ffd43b', '#d99e00'], mask: '#a5d8ff', long: 1, shirt: ['#ffd6e7', '#ff8fb8', '#d6457a'], pants: ['#8a7a9a', '#5c4a6a', '#3e3050'], shoes: ['#a0784c', '#6b4a2a'] }]] },
  { k: 1, sp: 46, off: 760, span: 1350, dir: -1, base: 255, scooter: 1, body: ['#ff8787', '#e03131', '#a61e1e'],   // đôi bạn trẻ chạy xe ga
    riders: [[1, 1, { fem: 1, hug: 1, helmet: ['#ffdeeb', '#ff8fab', '#d6336c'], shirt: ['#fff3a3', '#ffd43b', '#d9a200'], pants: ['#f8f9fa', '#dee2e6', '#adb5bd'], shoes: ['#ffffff', '#c5ccd4'] }],
             [9, 2, { helmet: ['#ffffff', '#dee2e6', '#868e96'], shirt: ['#a5d8ff', '#4dabf7', '#1c7ed6'], pants: ['#6f8cff', '#3b5bdb', '#263a94'], shoes: ['#f1f3f5', '#9aa3ad'] }]] }];
const QN_PARK = { k: 'p', parked: 1, body: ['#8ce99a', '#2f9e44', '#1f6e30'], riders: [] };   // xe Wave dựng trên vỉa hè

function qnSky(id) {
  ditherInto(id, W, ['#3d8be0', '#5aa2ea', '#7fb9f1', '#a6d0f6', '#cfe6f9'], 0, QN_HZ);
  ditherInto(id, W, ['#3b86bf', '#4a98c8', '#58aacd', '#69bccf', '#86d0d3', '#a8e0d8'], QN_HZ, QN_SAND);
  ditherInto(id, W, ['#a8e0d8', '#a8e0d8'], QN_SAND, H);
}
/* canvas phụ cao h, toạ độ y tuyệt đối tính từ y0 */
const qnCv = (h, y0 = 0) => { const c = document.createElement('canvas'); c.width = W; c.height = h; const g = c.getContext('2d');
  return [c, (col, x, y, w, hh) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y) - y0, w, hh); }]; };
/* lưới ký tự → canvas, tự viền màu out; vflip = lộn ngược (người lặn chúc đầu) */
function qnGrid(rows, pal, out, vflip) {
  const h = rows.length, w = rows[0].length, c = document.createElement('canvas'); c.width = w + 2; c.height = h + 2; const g = c.getContext('2d');
  const ch = (x, y) => y >= 0 && y < h && x >= 0 && x < w ? rows[vflip ? h - 1 - y : y][x] : '.', on = (x, y) => ch(x, y) !== '.';
  for (let y = -1; y <= h; y++) for (let x = -1; x <= w; x++) {
    const col = on(x, y) ? pal[ch(x, y)] : out && (on(x - 1, y) || on(x + 1, y) || on(x, y - 1) || on(x, y + 1)) ? out : null;
    if (col) { g.fillStyle = col; g.fillRect(x + 1, y + 1, 1, 1); } }
  return c;
}

/* ---- lớp xa tĩnh: hòn Khô, núi đá bên phải, đá tảng chân núi (vẽ sẵn một lần) ---- */
const qnTop = x => { const t = Math.min(1, Math.max(0, (x - 316) / 164)); return Math.round(QN_HZ + 5 - 56 * (1 - (1 - t) ** 1.8) - Math.sin(x * .085) * 2.5 * t - Math.sin(x * .23 + 1) * 1.2 * t); };
let qnFarC = null;
function qnFar() {
  if (qnFarC) return qnFarC;
  const [c, R] = qnCv(QN_HZ + 10), base = QN_HZ + 6;
  for (let x = 132; x < 176; x++) { const hh = Math.round(5 * Math.sin(Math.PI * (x - 132) / 44) ** .7 + (x > 148 && x < 158 ? 2 : 0)); R('#7fa3bb', x, QN_HZ - hh, 1, hh); R('#97b8cc', x, QN_HZ - hh, 1, 1); }   // hòn Khô ngoài khơi
  for (let x = 316; x < W; x++) { const top = qnTop(x); if (top >= base) continue;
    const sl = qnTop(x + 2) - qnTop(x - 2), lit = sl < -1, shade = sl > 0;   // sườn quay sang trái hứng nắng
    for (let y = top; y < base; y++) { const f = (y - top) / (base - top), n1 = rnd(Math.floor(x / 4) * 3.7 + Math.floor(y / 3) * 11.1), n2 = rnd(x * 1.3 + y * 7.9);
      const veg = n1 * .6 + (1 - f) * .6 + n2 * .15 > .62 && !(rnd(Math.floor(x / 6) * 2.3) > .8 && f > .35);   // khe đá trơ dọc sườn
      let col = veg ? (n2 > .82 ? '#4e6e2a' : lit ? (n2 > .4 ? '#86a845' : '#7a9c40') : shade ? '#5c7e32' : '#6a8c38')
                    : (n2 > .78 ? '#8f7350' : lit ? (n2 > .35 ? '#d2b483' : '#c6a674') : shade ? '#a08058' : '#b8976a');
      if (y === top) col = veg ? '#a2bf5a' : '#e0c898';
      R(col, x, y, 1, 1); } }
  for (let i = 0; i < 13; i++) { const rx = 318 + i * 12 + Math.floor(rnd(i * 4.1) * 6), rw = 5 + Math.floor(rnd(i * 2.9) * 5), rh = 3 + Math.floor(rnd(i * 6.3) * 3), ry = base + 1 - rh;   // đá tảng chân núi
    R('#5e5040', rx, ry, rw, rh); R('#8c7a64', rx, ry, rw - 1, rh - 1); R('#b0a088', rx + 1, ry, rw - 3, 1); }
  return qnFarC = c;
}

/* ---- tàu cá: vẽ theo hướng sang phải, gốc (x, y) = đuôi tàu, mặt nước ---- */
function qnBoat(x, y, len, p, d, k) {
  const [hull, trim, cab, roof, dark] = QN_HULL[p], h = Math.max(2, Math.round(len / 7)), ch = Math.max(1, Math.round(len / 8)), cw = Math.max(2, Math.round(len * .32)), ci = Math.round(len * .12);
  x = Math.round(x); y = Math.round(y + Math.sin(sceneT * 1.3 + k * 1.7) * (len > 12 ? .9 : .5));
  const P = (i, j, w, hh, c) => fr(c, d > 0 ? x + i : x + len - i - w, y + j, w, hh);
  ctx.globalAlpha = .3; P(1, 0, len - 2, 1, dark); if (len > 12) { ctx.globalAlpha = .15; P(3, 1, len - 6, 1, dark); } ctx.globalAlpha = 1;   // bóng dưới nước
  for (let r = 0; r < h; r++) { const a = Math.round(r * .5), b = len - Math.round(r * 1.3); P(a, r - h, b - a, 1, r === 0 ? trim : r === h - 1 ? dark : hull); }
  const bw = Math.max(1, Math.round(len * .18)); P(len - bw, -h - 1, bw, 1, trim); if (len >= 18) P(len - 2, -h - 2, 2, 1, trim);   // mũi tàu cong vểnh
  if (len >= 16) { P(len - 5, 1 - h, 2, 1, '#ffffff'); P(len - 4, 1 - h, 1, 1, '#1b1b2f'); }   // mắt thuyền
  P(ci, -h - ch, cw, ch, cab); P(ci - 1, -h - ch - 1, cw + 2, 1, roof);
  if (len >= 14) for (let i = ci + 1; i < ci + cw - 1; i += 3) P(i, -h - ch + (ch > 2 ? 1 : 0), 1, 1, '#2a3b55');
  if (len >= 10) { const mi = Math.round(len * .62), mh = Math.round(len * .5); P(mi, -h - mh, 1, mh, '#6b5a4a');
    if (len >= 14) { const fl = Math.floor(time * 4 + k) % 2; P(mi + 1, -h - mh, 2, 1, '#e03131'); P(mi + 1, 1 - h - mh, fl ? 2 : 1, 1, '#e03131'); }   // cờ bay
    if (len >= 20) { P(ci + 2, -h - ch - 4, 1, 3, '#adb5bd'); P(ci + 1, -h - ch - 4, 3, 1, '#adb5bd');   // ăng-ten bộ đàm
      const fx = mi - 5, bob = Math.floor(sceneT * 1.5 + k) % 3 === 0 ? 1 : 0;   // ngư dân đội nón lá trên boong
      P(fx, -h - 4 + bob, 3, 4 - bob, ['#ff922b', '#f1f3f5', '#4dabf7'][k % 3]); P(fx + 1, -h - 5 + bob, 1, 1, '#f5c29a'); P(fx - 1, -h - 6 + bob, 5, 1, '#e9d8a6'); P(fx, -h - 7 + bob, 3, 1, '#f1e3c8'); } }
}
/* thuyền thúng nhìn ngang; row = ngư dân đang chèo */
function qnBasket(x, y, w, col, man, k, row) {
  x = Math.round(x); y = Math.round(y + Math.sin(sceneT * 1.9 + k * 2.3) * .7);
  ctx.globalAlpha = .3; fr(col, x + 1, y, w - 2, 1); ctx.globalAlpha = 1;
  if (man) { const m = x + (w >> 1) - 1, st = row ? Math.floor(sceneT * 2 + k) % 2 : 0;
    if (row) { fr('#8a6238', m + 3 + st, y - 6 + st, 1, 8); fr('#f5c29a', m + 2 + st, y - 5 + st, 1, 1); }   // mái chèo
    fr(['#4dabf7', '#ff8787', '#f1f3f5', '#ffd43b'][k % 4], m, y - 6, 3, 4); fr('#f5c29a', m + 1, y - 7, 1, 1); fr('#d9c48a', m - 1, y - 8, 5, 1); fr('#e9d8a6', m, y - 9, 3, 1); fr('#f1e3c8', m + 1, y - 10, 1, 1); }
  fr('#2b2420', x, y - 3, w, 1); fr(col, x, y - 2, w, 1); fr(col, x + 1, y - 1, w - 2, 1); fr('#ffffff', x + 1, y - 2, 1, 1);
}
/* ca nô chạy sang phải kéo vệt bọt trắng */
function qnSpeed(x, y) {
  x = Math.round(x); y = Math.round(y + Math.sin(sceneT * 7) * .5); const f = Math.floor(time * 8);
  for (let i = 1; i < 42; i++) { if (rnd(i * 3.1 + f) < i / 55) continue; ctx.globalAlpha = Math.max(0, .85 - i / 48); fr('#ffffff', x - i, y - 1 + (i % 3 ? 0 : 1) + (i > 18 ? Math.round(Math.sin(i * .7 + sceneT * 3)) : 0), 1, 1); }
  ctx.globalAlpha = 1;
  fr('#ffffff', x, y - 3, 15, 1); fr('#ffffff', x + 13, y - 4, 4, 1); fr('#1c7ed6', x + 1, y - 2, 15, 1); fr('#dee2e6', x + 2, y - 1, 12, 1);
  fr('#9ad0f0', x + 10, y - 6, 2, 3); fr('#ff922b', x + 4, y - 6, 2, 3); fr('#f5c29a', x + 4, y - 7, 2, 1); fr('#ffd43b', x + 7, y - 6, 2, 3); fr('#f5c29a', x + 7, y - 7, 2, 1); fr('#2b1b17', x + 7, y - 8, 2, 1);
  if (f % 2) { fr('#ffffff', x + 17, y - 3, 1, 1); fr('#ffffff', x + 16, y - 5, 1, 1); } else fr('#ffffff', x + 18, y - 2, 1, 1);   // bọt tung ở mũi
}

/* ---- tường bích hoạ ---- */
const QN_DIVER = [
  '........hhhh.t.......', '.......hhhhhht.......', '.......hmmmmht.......', '.......smmmms........', '........ssss.........',
  'ss......yyyy......ss.', '.sss..yyyyyyyy..sss..', '...sssyyyyyyyysss....', '......yyyyyyyy.......', '......yyyyyyyy.......', '......YyyyyyyY.......',
  '......nnnnnnnn.......', '......nnnnnnnn.......', '......sss..sss.......', '......sss...sss......', '.....sss.....sss.....', '.....ss.......ss.....',
  '....fff.......fff....', '....ffff.......fff...', '...ffff.........fff..', '...fFf...........fF..'];
const QN_JET = [
  '.......hh..hh.........', '.......ss..ss.........', '......ooo.ooo.........', '......ooo.ooosss......', '......ooo.ooo..k......',
  '...kkkkkkkkkkkkkk.....', '.rrrrrrrrrrrrrrrrrrr..', 'rrrrrrrWWWWWWrrrrrrrrr', '.RRRRRRRRRRRRRRRRRRR..', '...wwwwwwwwwwwwwwww...'];
const QN_INK = '#1d2c55';   // nét viền sơn
let qnMuralC = null;
function qnMural() {
  if (qnMuralC) return qnMuralC;
  const [c, R] = qnCv(QN_WALK - QN_WALL, QN_WALL), g = c.getContext('2d'), img = (cv, x, y) => g.drawImage(cv, x, y - QN_WALL);
  // nền biển sơn: sáng ở trên, sẫm dần xuống dưới, vệt cọ quét ngang
  const st = ['#a8cdf0', '#7fb0e6', '#5a8fd8', '#3f74c4', '#2f5fb2', '#27509e'].map(hexRGB), n = st.length - 1;
  for (let y = QN_MT; y < QN_MB; y++) for (let x = 0; x < W; x++) {
    const t = Math.min(n - .001, Math.max(0, (y - QN_MT) / (QN_MB - QN_MT - 1) * n + (rnd(Math.floor(x / 9) * 5.1 + y * 1.7) - .5) * .55)), i = Math.floor(t), cc = t - i > (BAYER[y & 3][x & 3] + .5) / 16 ? st[i + 1] : st[i];
    R(`rgb(${cc})`, x, y, 1, 1); }
  for (const y of [177, 179, 181]) for (let x = 0; x < W; x += 5) if (rnd(x * .7 + y) > .5) R('#eaf4ff', x, y + Math.round(Math.sin(x * .2)), 3 + Math.floor(rnd(x + y * 3) * 6), 1);   // gợn sóng mặt biển
  // bãi cát cam dốc từ trái xuống giữa tường, viền bọt trắng
  for (let x = 0; x < 262; x++) { const top = Math.round(196 + x * .03 + Math.sin(x * .07) * 1.2 + Math.max(0, x - 225) * .22); if (top >= QN_MB) continue;
    R('#f4f8ff', x, top, 1, 1); R('#e0a060', x, top + 1, 1, 1); for (let y = top + 2; y < QN_MB; y++) R(rnd(x * 2.1 + y * 5.3) > .7 ? '#b55a22' : '#c96a2c', x, y, 1, 1); }
  // phao cứu sinh treo đầu tường
  for (let y = -6; y <= 6; y++) for (let x = -6; x <= 6; x++) { const d = Math.hypot(x, y); if (d > 6.2 || d < 2.4) continue;
    R(d > 5.4 || d < 3.1 ? '#5a1e1e' : (Math.atan2(y, x) + Math.PI + .4) % (Math.PI / 2) < Math.PI / 4 ? '#f8f9fa' : '#e03131', 11 + x, 185 + y, 1, 1); }
  R('#e9ecef', 11, 177, 1, 2);
  // ca nô trắng
  for (let r = 0; r < 5; r++) R(r === 0 ? '#ffffff' : r === 4 ? '#aab6c2' : '#e9eef3', 22 + r, 189 + r, 42 - r * 3, 1);
  R(QN_INK, 21, 188, 44, 1); R('#3b6fc8', 24, 191, 34, 1);
  R('#dfe5ea', 28, 184, 24, 1); R('#f4f6f8', 30, 185, 20, 3); for (let x = 31; x < 48; x += 4) R('#2c3e5a', x, 186, 3, 1); R('#9ad0f0', 50, 186, 2, 2);
  R('#ffffff', 52, 187, 9, 1); for (let x = 53; x < 61; x += 3) R('#ffffff', x, 186, 1, 1);
  for (let x = 6; x < 22; x++) if (rnd(x * 4.3) > .35) R('#ffffff', x, 192 + (x % 3 ? 0 : 1), 1, 1);
  // bọt trắng tung sau mô tô nước
  for (let y = 182; y < 199; y++) for (let x = 84; x < 156; x++) { const a = x < 120 ? ((x - 100) / 16) ** 2 + ((y - 191) / 3) ** 2 : ((x - 136) / 18) ** 2 + ((y - 190) / 7) ** 2, th = (BAYER[y & 3][x & 3] + .5) / 16;
    if (a < 1 - th * .6) R(a < .45 ? '#ffffff' : '#d6e8fb', x, y, 1, 1); }
  img(qnGrid(QN_JET, { r: '#d9483b', R: '#a8302a', w: '#f4f6f8', W: '#ff8a7a', o: '#f08c00', s: '#f2b98e', h: '#2b1b17', k: '#2a2a3a' }, QN_INK), 102, 180);
  img(qnGrid(QN_JET, { r: '#c92a3a', R: '#8a1e2a', w: '#f4f6f8', W: '#ff6b7a', o: '#ffd43b', s: '#f2b98e', h: '#2b1b17', k: '#2a2a3a' }, QN_INK), 150, 183);
  // rong biển, san hô ống tím
  for (const sx of [236, 241, 268, 273]) for (let i = 0; i < 9 + (sx % 4); i++) { const px = sx + Math.round(Math.sin(i * .6 + sx) * 1.2); R('#2f9e44', px, QN_MB - 1 - i, 1, 1); if (i % 2) R('#51cf66', px + 1, QN_MB - 1 - i, 1, 1); }
  for (const [x, h] of [[245, 9], [249, 14], [253, 17], [257, 12], [261, 8]]) { const t = QN_MB - h; R(QN_INK, x - 1, t - 1, 5, h + 1); R('#c24a8a', x, t, 1, h); R('#a83a72', x + 1, t, 1, h); R('#7a2456', x + 2, t, 1, h); R('#e07ab0', x, t, 3, 1); R('#5a1840', x + 1, t, 1, 1); }
  // hai bạn nhỏ lặn biển
  img(qnGrid(QN_DIVER, { h: '#2b1b17', m: '#a5e0f5', s: '#f2b98e', y: '#f5c330', Y: '#d49a1a', n: '#2a3f8f', f: '#f1f5f8', F: '#b8c6d2', t: '#ff7a1a' }, QN_INK), 280, 176);
  img(qnGrid(QN_DIVER, { h: '#2b1b17', m: '#a5e0f5', s: '#f2b98e', y: '#f5c330', Y: '#d49a1a', n: '#2a3f8f', f: '#e8443a', F: '#b02a24', t: '#ff7a1a' }, QN_INK, true), 384, 177);
  // san hô não xanh: vòm lưới đa giác
  const dome = (cx, rx, ry) => { for (let y = QN_MB - ry; y < QN_MB; y++) for (let x = cx - rx; x <= cx + rx; x++) { const e = ((x - cx) / rx) ** 2 + ((y - QN_MB) / ry) ** 2; if (e > 1 || x < 0 || x >= W) continue;
    const mesh = (x + y) % 5 === 0 || (x - y + 500) % 5 === 0, hi = x - cx < -rx * .2 && y - QN_MB < -ry * .45;
    R(e > .84 ? '#1f4f3e' : mesh ? '#245c46' : hi ? '#6fb07a' : rnd(x * 3.1 + y * 1.7) > .5 ? '#3f8a5e' : '#4a9866', x, y, 1, 1); } };
  dome(346, 22, 18); dome(474, 14, 12);
  // san hô quạt vàng & san hô nhánh đỏ
  for (let a = -2.6; a <= -.55; a += .16) { const len = 11 + Math.floor(rnd(a * 9) * 4); for (let i = 2; i < len; i++) R(i % 4 ? '#e8a822' : '#f5c842', 418 + Math.round(Math.cos(a) * i), QN_MB - 1 + Math.round(Math.sin(a) * i), 1, 1); }
  for (const r of [5, 8, 11]) for (let a = -2.6; a <= -.55; a += .08) R('#f5c842', 418 + Math.round(Math.cos(a) * r), QN_MB - 1 + Math.round(Math.sin(a) * r), 1, 1);
  const branch = (x, y, a, len, d) => { for (let i = 0; i < len; i++) { const px = Math.round(x + Math.cos(a) * i), py = Math.round(y + Math.sin(a) * i); R('#c92a3a', px, py, 2, 1); R('#ff6b6b', px, py, 1, 1); }
    if (d) { const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len; branch(ex, ey, a - .5, len * .72, d - 1); branch(ex, ey, a + .45, len * .7, d - 1); } };
  branch(434, QN_MB - 1, -1.8, 6, 3); branch(441, QN_MB - 1, -1.3, 6, 3);
  // cá nhỏ, bong bóng
  for (const [x, y, col, d] of [[72, 182, '#ff922b', 1], [214, 180, '#ffd43b', -1], [228, 186, '#ff922b', -1], [372, 181, '#ffd43b', 1], [458, 184, '#ff6b6b', -1], [196, 199, '#ffd43b', 1], [318, 197, '#ff922b', -1]]) {
    R(col, x, y, 3, 2); R(col, d > 0 ? x - 2 : x + 4, y - 1, 1, 1); R(col, d > 0 ? x - 2 : x + 4, y + 2, 1, 1); R(col, d > 0 ? x - 1 : x + 3, y, 1, 2); R(QN_INK, d > 0 ? x + 2 : x, y, 1, 1); }
  for (const [x, y, big] of [[298, 177, 0], [300, 180, 1], [296, 184, 0], [394, 200, 1], [399, 197, 0], [402, 201, 0], [356, 182, 0]]) {
    if (big) { R('#d8ecff', x + 1, y, 1, 1); R('#d8ecff', x, y + 1, 1, 1); R('#d8ecff', x + 2, y + 1, 1, 1); R('#d8ecff', x + 1, y + 2, 1, 1); } else R('#d8ecff', x, y, 1, 1); }
  // khe co giãn, vết bẩn chân tường, sơn tróc
  for (let x = 96; x < W; x += 96) for (let y = QN_MT; y < QN_MB; y++) if (y % 3) R('rgba(20,40,90,.45)', x, y, 1, 1);
  for (let x = 0; x < W; x++) for (let y = QN_MB - 4; y < QN_MB; y++) if (rnd(x * 1.9 + y * 3.7) > .82 - (y - QN_MB + 4) * .08) R('rgba(40,50,60,.35)', x, y, 1, 1);
  for (let i = 0; i < 24; i++) R('#c8d4de', Math.floor(rnd(i * 7.3) * W), QN_MT + 2 + Math.floor(rnd(i * 3.9) * 24), 1 + (i % 2), 1);
  // mép kè trên & chân kè
  R('#f6f9fb', 0, QN_WALL, W, 1); R('#e3edf3', 0, QN_WALL + 1, W, 1); R('#b4cddd', 0, QN_WALL + 2, W, 1); R('#5a7fae', 0, QN_MT, W, 1);
  for (let x = 0; x < W; x += 3) if (rnd(x * 2.7) > .7) R('#c9d6de', x, QN_WALL + 1, 2, 1);
  R('#8a96a0', 0, QN_MB, W, 1); R('#646e78', 0, QN_MB + 1, W, 1);
  return qnMuralC = c;
}

/* ---- vỉa hè gạch đỏ (phối cảnh), bó vỉa, đường nhựa: một canvas từ QN_WALK xuống đáy ---- */
let qnWalkC = null;
function qnWalk() {
  if (qnWalkC) return qnWalkC;
  const [c, R] = qnCv(H - QN_WALK, QN_WALK), rows = [QN_WALK, 210, 213, 217, 221, 226, QN_CURB];
  for (let b = 0; b < rows.length - 1; b++) { const ya = rows[b], yb = rows[b + 1];
    for (let y = ya; y < yb; y++) { const sp = (y - 190) * .45, off = (b % 2) * sp / 2;
      for (let x = 0; x < W; x++) { const u = (x - 240 - off) / sp, k = Math.floor(u), n = rnd(k * 7.7 + b * 31.3), th = (BAYER[y & 3][x & 3] + .5) / 16;
        R(y === ya ? '#d9a08a' : (u - k) * sp < 1 ? '#cf927c' : y === ya + 1 && b > 1 ? '#c96650'
          : n > .8 ? '#a54434' : n > .55 ? (th < .5 ? '#bb5640' : '#b3503b') : n > .2 ? '#b4513d' : '#c05c45', x, y, 1, 1); } } }
  for (let x = 0; x < W; x++) if (rnd(x * 3.3) > .6) R('#c9a487', x, QN_WALK, 1, 1);   // cát bụi bám chân kè
  // bó vỉa xi măng
  R('#ece6da', 0, QN_CURB, W, 1); R('#d6cfc2', 0, QN_CURB + 1, W, 1); R('#bdb6a8', 0, QN_CURB + 2, W, 3); R('#7a756c', 0, QN_CURB + 5, W, 1);
  for (let x = 20; x < W; x += 34) R('#9a9386', x, QN_CURB + 2, 1, 3);
  for (let i = 0; i < 18; i++) R(i % 3 ? '#a8a194' : '#c8c1b4', Math.floor(rnd(i * 5.7) * W), QN_CURB + 2 + (i % 3), 2 + (i % 2), 1);
  // đường nhựa, rãnh sát bó vỉa, vạch qua đường
  for (let y = QN_ROAD; y < H; y++) for (let x = 0; x < W; x++) { const n = rnd(x * 1.7 + y * 9.1), th = (BAYER[y & 3][x & 3] + .5) / 16;
    R(y < QN_ROAD + 2 ? (n > .5 ? '#8a857a' : '#938e83') : n > .88 ? '#b8b3a8' : n < .1 ? '#8c877c' : th < .5 ? '#a39e93' : '#9f9a8f', x, y, 1, 1); }
  for (const [y0, t] of QN_ZEBRA) for (let y = y0; y < y0 + t; y++) for (let x = Math.round(232 - (y - QN_ROAD) * 2); x < W; x++) if (rnd(x * 2.3 + y * 4.1) < .93) R(y === y0 ? '#f6f5f0' : '#e8e6de', x, y, 1, 1);
  for (const [x, y] of [[118, 233], [121, 234], [306, 233], [388, 239], [64, 242]]) { R('#b08a50', x, y, 2, 1); R('#8a6a3a', x + 1, y, 1, 1); }   // lá khô
  return qnWalkC = c;
}

/* ---- đồ nghề trên vỉa hè: lưới, thùng xốp, thuyền thúng dựng nghiêng vào kè (vẽ sẵn) ---- */
let qnGearC = null;
function qnGear() {
  if (qnGearC) return qnGearC;
  const [c, R] = qnCv(GY - QN_WALL, QN_WALL);
  for (let x = 6; x < 44; x++) { const h = Math.round(9 * Math.sin(Math.PI * (x - 6) / 38) ** .7);   // đống lưới cước xanh
    for (let y = 219 - h; y < 219; y++) R((x + y * 2) % 3 === 0 ? '#1f6e30' : x > 30 && y > 214 ? '#1c7ed6' : rnd(x * 1.3 + y * 2.9) > .5 ? '#2f9e44' : '#37b24d', x, y, 1, 1);
    if (x % 5 === 2) R(x % 10 === 2 ? '#ff922b' : '#f1f3f5', x, 218 - h, 2, 2); }
  for (const [x, y] of [[18, 210], [20, 211], [23, 211], [25, 210], [24, 209], [19, 209]]) R('#ffd43b', x, y, 1, 1);   // cuộn dây thừng
  for (const [x, y, w] of [[46, 213, 14], [48, 207, 12]]) { R('#adb5bd', x - 1, y - 1, w + 2, 7); R('#f8f9fa', x, y, w, 6); R('#ffffff', x, y, w, 1); R('#dee2e6', x, y + 5, w, 1); R('#1c7ed6', x + (w >> 1) - 1, y, 2, 6); }   // thùng xốp
  R('#ced4da', 51, 205, 3, 2); R('#74c0fc', 54, 205, 2, 1); R('#ced4da', 55, 204, 1, 2);   // đuôi cá thò ra
  const cx = 75, cy = 207, r = 11;   // thuyền thúng phết dầu rái, vành tre
  for (let y = cy - r - 1; y <= cy + r + 1; y++) for (let x = cx - r - 1; x <= cx + r + 1; x++) { const d = Math.hypot(x - cx, y - cy); if (d > r + 1) continue;
    R(d > r ? '#1e1612' : d > r - 2 ? (x - cx + y - cy < -4 ? '#c9a06a' : '#a0784c') : x - cx + y - cy < -9 && rnd(x * 3 + y) > .4 ? '#5e4c3c' : ((x >> 1) + (y >> 1)) % 2 ? '#3a2c22' : '#4a3a2c', x, y, 1, 1); }
  R('#8a6238', cx - 1, cy - r + 2, 2, r * 2 - 4); R('#8a6238', cx - r + 2, cy - 1, r * 2 - 4, 2);   // nẹp tre chữ thập
  return qnGearC = c;
}

/* ---- xe máy cỡ người thật ----
   Người lái dựng từ đầu & thân nhìn nghiêng của sprites.js (cùng nét viền, cùng tỉ lệ với nhân vật chính), đội mũ bảo hiểm,
   ngồi: đùi nằm ngang trên yên, cẳng chân thả xuống gác chân. Hàng 21 = thắt lưng, thân bắt đầu hàng 14. */
const QN_SEAT_LEGS = ['.....XYYYYYYYYYYYZ..', '.....XYYYYYYYYYYYYZ.', '..............XYYZ..', '..............XYYZ..', '..............XYYZ..', '..............XYYZ..', '..............XYYZ..', '.............SSSSSS.', '.............QQQQQQ.'];
function qnRider(o) {
  let head = (o.fem ? SIDE_BRIDE.slice(0, 14) : SIDE_HEAD).map(r => r.replace(/R/g, '.'));
  head = head.map((r, j) => j < 5 ? r.replace(/[123]/g, j < 2 ? 'H' : j < 4 ? 'I' : 'J') : r);   // mũ bảo hiểm trùm phần tóc trên
  for (let c = 10; c < 17; c++) head[4] = setC(head[4], c, 'J');   // vành mũ che trán
  head[1] = setC(setC(head[1], 8, 'h'), 9, 'h');
  for (let r = 7; r < 12; r++) head[r] = setC(head[r], 9, 'k');   // quai mũ
  if (o.mask) for (let r = 9; r < 12; r++) for (let c = 10; c < 17; c++) if (head[r][c] && head[r][c] !== '.') head[r] = setC(head[r], c, 'W');
  const rows = head.concat(SIDE_TORSO, [SIDE_BELT], QN_SEAT_LEGS).map(r => r.padEnd(24, '.'));
  if (!o.hug) drawFarLimb(rows, [[8, 1], [11, 4], [16, 4]], 14);
  drawLimb(rows, o.hug ? [[9, 1], [12, 4], [15, 5]] : [[9, 1], [12, 4], [17, 3]], 14);   // tay nắm ghi-đông / ôm eo
  const hair = o.fem ? ['#5a4658', '#2b1f2b', '#170f17'] : ['#4a4a6a', '#2b2b42', '#17172a'], [T, U, V] = o.shirt, [X, Y, Z] = o.pants, [Hh, I, J] = o.helmet;
  return outline(sprC(rows, { ...SKIN, u: o.fem ? '#ff9e9e' : '#f5c29a', 1: hair[0], 2: hair[1], 3: hair[2], H: Hh, I, J, h: '#ffffff', W: o.mask || '#fff',
    T, U, V, ...(o.long ? { F: T, f: U, g: V } : {}), X, Y, Z, S: o.shoes[0], Q: o.shoes[1] }));
}
/* xe nhìn sang phải, toạ độ xe: mặt đất hàng 47, bánh sau tâm (9, 40), bánh trước (38, 40); canvas chừa lề QB_OX/QB_OY cho thùng hàng, gương */
const QB_W = 60, QB_H = 52, QB_OX = 9, QB_OY = 4, QB_CACHE = {};
function qnBike(v, spin, bob) {
  const key = v.k + '|' + spin + '|' + bob; if (QB_CACHE[key]) return QB_CACHE[key];
  const c = document.createElement('canvas'); c.width = QB_W; c.height = QB_H; const g = c.getContext('2d'), [b0, b1, b2] = v.body, sc = v.scooter;
  const F = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x + QB_OX, y + QB_OY, w, h); };
  const disc = (cx, cy, r0, r1, col) => { for (let y = -Math.ceil(r1); y <= r1; y++) for (let x = -Math.ceil(r1); x <= r1; x++) { const d = Math.hypot(x, y); if (d >= r0 && d <= r1) F(col, cx + x, cy + y, 1, 1); } };
  const seg = (x0, y0, x1, y1, col, w = 1) => line(x0, y0, x1, y1, (x, y) => F(col, x, y, w, w));
  const wheel = (cx, r) => { const cy = 47 - r; disc(cx, cy, r - 1.5, r + .5, '#1b1b2f'); disc(cx, cy, 0, r - 1.5, '#868e96'); disc(cx, cy, r - 2.5, r - 1.5, '#495057');
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + spin * .63; seg(cx, cy, Math.round(cx + Math.cos(a) * (r - 2.5)), Math.round(cy + Math.sin(a) * (r - 2.5)), '#dee2e6'); }   // mâm đúc 5 chấu
    disc(cx, cy, 0, 1.2, '#343a40'); F('#4a4a5a', cx - 3, cy - r, 3, 1); };
  if (v.load === 'fish') { F('#495057', -2, 23, 12, 1);   // baga + hai thùng xốp chằng dây
    for (const y of [17, 11]) { F('#f8f9fa', -8, y, 16, 6); F('#ffffff', -8, y, 16, 1); F('#dee2e6', -8, y + 5, 16, 1); F('#1c7ed6', -2, y, 2, 6); }
    seg(-8, 12, 7, 22, '#ffd43b'); F('#adb5bd', -6, 9, 2, 2); F('#74c0fc', -4, 10, 1, 1); F('#adb5bd', 4, 10, 3, 1); }
  wheel(9, sc ? 6 : 7);
  if (!sc) { F('#5c636a', 15, 32, 11, 7); for (let y = 33; y < 38; y += 2) F('#868e96', 16, y, 9, 1); F('#343a40', 15, 38, 11, 1); seg(9, 40, 18, 37, '#343a40', 2); }   // máy lộ, xích
  for (let r = 25; r < (sc ? 38 : 32); r++) { const xa = 2 + Math.round(Math.max(0, r - 28) * .5), xb = 26 - Math.round((r - 25) * (sc ? .15 : .3)); F(r === 25 ? b0 : r > (sc ? 35 : 30) ? b2 : b1, xa, r, xb - xa, 1); }   // ốp thân sau
  F(b0, 3, 26, 1, sc ? 8 : 4); F('#e03131', 1, 25, 3, 2); F('#ff8787', 1, 25, 1, 1); F('#f1f3f5', -1, 29, 4, 3); F('#343a40', 0, 30, 2, 1);   // đèn hậu, biển số
  F('#2a2a3a', 4, 22, 22, 3); F('#4a4a5a', 5, 22, 20, 1); F('#2a2a3a', 25, 23, 2, 2);   // yên
  if (sc) { F('#adb5bd', 2, 36, 11, 2); F('#f1f3f5', 3, 36, 8, 1); } else { F('#adb5bd', 1, 39, 18, 3); F('#f1f3f5', 2, 39, 15, 1); F('#495057', 0, 39, 1, 3); F('#868e96', 8, 39, 6, 1); }   // ống xả
  if (sc) { F(b2, 22, 37, 11, 2); F(b1, 22, 36, 11, 1); } else { F(b2, 24, 31, 8, 3); F(b1, 24, 31, 8, 1); }   // sàn để chân / gầm xe số
  F('#343a40', sc ? 14 : 20, 35, 5, 1);   // gác chân
  wheel(38, sc ? 6 : 7);
  seg(34, 20, 38, 40, '#ced4da'); seg(35, 20, 39, 40, '#868e96');   // phuộc
  F(b1, 33, sc ? 33 : 31, 11, 2); F(b0, 34, sc ? 33 : 31, 9, 1);   // chắn bùn trước
  for (let r = 17; r < (sc ? 37 : 35); r++) { const xa = 30 - Math.round((r - 17) * .2), xb = 34 - Math.round((r - 17) * .1); F(r > 32 ? b2 : b1, xa, r, xb - xa, 1); F(b0, xa, r, 1, 1); }   // ốp đầu che chân
  F(b1, 30, 13, 8, 6); F(b0, 30, 13, 8, 1); F(b2, 30, 18, 8, 1); F('#fff3bf', 37, 14, 2, 3); F('#ffffff', 38, 14, 1, 1); F('#ffa94d', 36, 17, 2, 1);   // đầu đèn
  F('#868e96', 31, 7, 1, 6); F('#343a40', 30, 5, 3, 2); F('#adb5bd', 30, 5, 1, 1);   // gương
  for (const [dx, dy, o] of v.riders) { if (!o.img) o.img = qnRider(o); g.drawImage(o.img, QB_OX + dx - 1, QB_OY + dy - 1 + bob); }
  seg(28, 19, 31, 17, '#868e96'); F('#2a2a3a', 28, 19, 2, 2);   // ghi-đông, tay nắm
  if (v.parked) seg(20, 40, 17, 47, '#495057');   // chân chống
  return QB_CACHE[key] = outline(c);
}
/* x = mép trái canvas trên màn hình, base = hàng mặt đất */
function qnDrawBike(v, x, base, dir) {
  x = Math.round(x); const moving = !v.parked, spin = moving ? Math.floor(time * 12 + v.k) % 2 : 0, bob = moving && Math.floor(time * 3 + v.k * 1.3) % 4 === 0 ? 1 : 0, img = qnBike(v, spin, bob);
  ctx.globalAlpha = .22; fr('#1b1b2f', x + QB_OX - 2, base - 1, 48, 2); ctx.globalAlpha = 1;   // bóng xe
  ctx.drawImage(dir > 0 ? img : flipped(img), x, base - (47 + QB_OY + 1));
  if (moving) for (let n = 0; n < 3; n++) { const e = (time * 1.6 + n / 3 + v.k * .3) % 1, z = 2 + Math.round(e * 3), px = dir > 0 ? x + QB_OX + 1 : x + QB_W - QB_OX;   // khói ống xả
    ctx.globalAlpha = .3 * (1 - e); fr('#ced4da', px - dir * (2 + e * 16) - (z >> 1), base - 8 - e * 4, z, z); }
  ctx.globalAlpha = 1;
}
/* xe chạy trên đường: mỗi xe giữ quãng đã chạy lx (âm = chưa vào khung, quá W + 10 = đã ra khỏi khung, chạy hết span thì quay vòng).
   props.qnHold (lúc chụp ảnh): xe chưa vào khung chờ ngoài lề, xe đang tới gần hai nhân vật tăng ga chạy qua nhanh;
   kịch bản chờ qnRoadClear() rồi mới tạo dáng, nên không xe nào che lúc bấm máy */
const qnRoad = () => props.qnRoad || (props.qnRoad = QN_ROAD_V.map(v => ({ v, lx: v.off % v.span - QB_W - 10 })));
const qnBikeX = r => r.v.dir > 0 ? r.lx : W - r.lx - QB_W;   // mép trái canvas trên màn hình
function qnZone() { const xs = ['groom', 'bride'].filter(n => actors[n]).map(n => actors[n].x); return [Math.min(...xs) - 24, Math.max(...xs) + 30]; }
const QB_GATE = -QB_W - 2;   // lx từ đây trở lên là xe đã ló vào khung
const qnAhead = (r, a, b) => r.lx >= QB_GATE && r.lx <= W + 10 && (r.v.dir > 0 ? qnBikeX(r) <= b : qnBikeX(r) + QB_W + 2 >= a);   // đang trong khung, chưa chạy qua chỗ hai đứa
/* đường trống: không còn xe nào trong khung mà chưa chạy qua chỗ hai đứa (xe chờ ngoài lề hoặc đã chạy qua thì không tính) */
function qnRoadClear() { const [a, b] = qnZone(); return !qnRoad().some(r => qnAhead(r, a, b)); }
function qnUpdate(dt) {
  const [a, b] = qnZone();
  for (const r of qnRoad()) { const v = r.v;
    if (props.qnHold && r.lx < QB_GATE && r.lx + v.sp * dt >= QB_GATE) continue;   // chờ ngoài khung
    r.lx += (props.qnHold && qnAhead(r, a, b) ? 110 : v.sp) * dt;
    if (r.lx > v.span - QB_W - 10) r.lx -= v.span; }
}
/* vẽ SAU nhân vật vì đường ở gần camera hơn vỉa hè */
function qnTraffic() { for (const r of qnRoad()) if (r.lx <= W + 10) qnDrawBike(r.v, qnBikeX(r), r.v.base, r.v.dir); }

/* ---- toàn cảnh ---- */
function qnScene() {
  for (const [off, y, len, sp] of QN_WISP) { const x = Math.round(loopX(sp, off, W + 220) - 70);   // mây ti
    ctx.globalAlpha = .5; fr('#ffffff', x, y, len, 1); ctx.globalAlpha = .3; fr('#ffffff', x + 8, y - 1, len * .55 | 0, 1); fr('#ffffff', x - 6, y + 1, len * .7 | 0, 1); ctx.globalAlpha = 1; }
  for (let b = 0; b < 3; b++) bird(loopX(10 + b * 3, b * 170, W + 120), 34 + b * 13 + Math.sin(sceneT * 1.5 + b) * 3, '#ffffff', b);   // mòng biển
  ctx.drawImage(qnFar(), 0, 0);
  waves(122, 162, ['#c6eef2', '#e9fbfc', '#9fd8e0'], 8, 77); sparkles(116, 160, 28, 19);
  for (let x = 316; x < W; x += 2) if (rnd(x * 1.3 + Math.floor(time * 3)) > .55) fr('#ffffff', x, QN_HZ + 6 + ((x >> 2) % 2), 2, 1);   // sóng vỗ chân núi
  // tàu thuyền: vẽ từ xa tới gần
  const list = [...QN_BOATS.map((b, k) => [b[1], () => qnBoat(b[0], b[1], b[2], b[3], b[4], k)]), ...QN_BASKETS.map((b, k) => [b[1], () => qnBasket(b[0], b[1], b[2], b[3], b[4], k)]),
    [141, () => qnSpeed(loopX(26, 100, W + 600) - 60, 141)], [158, () => qnBasket(W - loopX(5, 160, W + 80) - 10, 158, 10, '#3a2c22', 1, 2, true)]];
  for (const [, f] of list.sort((a, b) => a[0] - b[0])) f();
  // bọt sóng, cát ướt, cát khô
  const fy = 161 + Math.round(Math.sin(sceneT * 1.1) * 1.5);
  fr('#d6c59a', 0, fy + 2, W, QN_WALL - fy - 2); fr('#efe0bc', 0, 167, W, QN_WALL - 167); for (let x = 3; x < W; x += 11) fr('#dccb9f', x, 168 + (x % 3), 2, 1);
  fr('#e6f7f5', 0, fy + 1, W, 1); for (let x = 0; x < W; x += 6) { const h = 1 + ((x * 7 + Math.floor(sceneT * 4)) % 3 ? 0 : 1); fr('#ffffff', x, fy - h + 1, 5, h); }
  ctx.drawImage(qnMural(), 0, QN_WALL);
  ctx.drawImage(qnWalk(), 0, 0, W, GY - QN_WALK, 0, QN_WALK, W, GY - QN_WALK);
  ctx.drawImage(qnGear(), 0, QN_WALL); qnDrawBike(QN_PARK, 414, 219, -1);
}
function qnGround() { ctx.drawImage(qnWalk(), 0, GY - QN_WALK, W, H - GY, 0, GY, W, H - GY); }
