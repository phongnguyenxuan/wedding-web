/* ================== HÒA BÌNH: TẮM THÁC GIỮA RỪNG ==================
   Bố cục (toạ độ màn hình, camera đứng yên ở chương này) – thác nhiều tầng trên các bậc đá vôi:
   - nền nhiều lớp kiểu parallax: núi đá vôi xa, núi gần, dải rừng, vài cây lớn hai bên – sương trôi giữa các lớp
   - giữa khung là thác trên cùng (xa nhất) trắng xoá đổ qua vách đá vôi phủ rêu nhô lên khỏi rừng
   - bậc trên (y 123..137) và bậc giữa (y 145..163): mặt đá vôi vàng nâu có nước tràn mỏng,
     mỗi bậc đổ xuống bằng một "rèm nước" thấp; tầng cuối là rèm nước rộng (y 166..201) đổ xuống vực xanh ngọc
   - bên phải bụi lau cao trên vách đá
   - mặt phẳng nhân vật: bãi sỏi bên trái (x < 100, mặt đất GY) dốc dần xuống hồ, hồ sâu tới HB_POOL;
     bên phải ba bậc đá: đá kê (cao 12), bậc giữa (34), mỏm nhảy (58)
   - nhân vật có a.lift: + đứng trên đá, − chìm dưới nước; mặt nước phía trước (hbFront) phủ mờ phần người chìm */
const HB_WL = 226, HB_POOL = 304, HB_PT = 199;   // mặt nước phía trước, mép phải hồ, mép trên vực nước phía sau
const hbFriends = () => (CONFIG.friends && CONFIG.friends.length >= 4 ? CONFIG.friends : ['Tuấn', 'Hùng', 'Dũng', 'Linh']);
const hbEdge = y => 100 + (y - GY) * 1.3;   // mép bãi sỏi, ngập dần dưới nước
/* độ cao mặt đứng theo tâm người (cx = a.x + 6) */
function hbBase(cx) {
  if (cx < 100) return 0;
  if (cx < HB_POOL - 4) return Math.max(-18, -(cx - 100) / 1.3);
  return cx < 330 ? 12 : cx < 352 ? 34 : 58;
}
const hbRTop = x => x < 330 ? 210 : x < 352 ? 188 : x < 404 ? 164 : 150;   // mặt trên các bậc đá

/* ---- tiện ích vẽ sẵn ---- */
const HB_RGB = {}, hbRGB = h => HB_RGB[h] || (HB_RGB[h] = hexRGB(h));
const hbDith = (x, y) => (BAYER[y & 3][x & 3] + .5) / 16;
function hbVN(x, y, s, k = 0) {   // nhiễu giá trị (value noise) mượt
  const X = x / s, Y = y / s, i = Math.floor(X), j = Math.floor(Y), fx = X - i, fy = Y - j, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), h = (a, b) => rnd(a * 57.3 + b * 131.7 + k * 17.1);
  return h(i, j) * (1 - u) * (1 - v) + h(i + 1, j) * u * (1 - v) + h(i, j + 1) * (1 - u) * v + h(i + 1, j + 1) * u * v;
}
function hbCanvas(w, h) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), id = g.createImageData(w, h), D = id.data;
  const put = (x, y, col) => { x = Math.round(x); y = Math.round(y); if (x < 0 || y < 0 || x >= w || y >= h) return; const p = (y * w + x) * 4, v = hbRGB(col); D[p] = v[0]; D[p + 1] = v[1]; D[p + 2] = v[2]; D[p + 3] = 255; };
  const R = (col, x, y, ww, hh) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); };
  return { c, g, put, R, done: () => { g.putImageData(id, 0, 0); return c; } };
}
/* khối kiểu pixel art (tán lá, bụi cây, rêu, đá tảng): viền lượn thành múi chùm lá, các mảng màu phẳng chồng lệch dần
   về phía nắng (trên-trái), viền tối, không dither. cols = [viền, mảng tối, …, mảng sáng];
   o.bump = độ sâu múi (≈0 cho đá tròn trơn), o.line = vẽ viền, o.tuft = điểm thêm chùm lá nhỏ */
function hbClump(put, cx, cy, rx, ry, cols, k = 0, o = {}) {
  cx = Math.round(cx); cy = Math.round(cy); rx = Math.max(2, Math.round(rx)); ry = Math.max(2, Math.round(ry));
  const bump = o.bump ?? .16, line = o.line ?? true, nl = Math.max(4, Math.round((rx + ry) / 3.5)), ph = rnd(k + .5) * 6.28, sh = cols.slice(1), nb = sh.length;
  const inside = (x, y, b) => { const f = b / nb, s = 1 - f * .95, X = (x + f * .3 * rx) / (rx * s), Y = (y + f * .55 * ry) / (ry * s), r = 1 - bump + bump * Math.abs(Math.sin(Math.atan2(Y, X) * nl / 2 + ph + b * 1.9)); return X * X + Y * Y <= r * r; };
  const ww = rx * 2 + 3, M = new Int8Array(ww * (ry * 2 + 3)).fill(-1), at = (x, y) => (Math.abs(x) > rx + 1 || Math.abs(y) > ry + 1) ? -1 : M[(y + ry + 1) * ww + x + rx + 1];
  for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) { let b = -1; for (let i = 0; i < nb && inside(x, y, i); i++) b = i; M[(y + ry + 1) * ww + x + rx + 1] = b; }
  for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) { const b = at(x, y); if (b < 0) continue;
    put(cx + x, cy + y, line && (at(x - 1, y) < 0 || at(x + 1, y) < 0 || at(x, y - 1) < 0 || at(x, y + 1) < 0) ? cols[0] : sh[b]); }
  if (o.tuft === false) return;
  for (let i = 0; i < rx * ry / 70; i++) {   // chùm lá nhỏ: vệt sáng hình vòm, hai chân tối
    const x = Math.round((rnd(i * 3.7 + k) - .5) * rx * 1.5), y = Math.round((rnd(i * 5.3 + k + 9) - .5) * ry * 1.5), b = at(x, y);
    if (b < 1 || b >= nb - 1 || at(x - 1, y + 1) !== b || at(x + 2, y + 1) !== b) continue;
    put(cx + x, cy + y, sh[b + 1]); put(cx + x + 1, cy + y, sh[b + 1]); put(cx + x - 1, cy + y + 1, sh[b - 1]); put(cx + x + 2, cy + y + 1, sh[b - 1]);
  }
}
const HB_LIME = ['#4a3f2e', '#66573f', '#857455', '#a6936d', '#c5b288', '#e0d0a6'];   // đá vôi vàng nâu
const HB_MOSS = ['#1f3f22', '#2f5a2a', '#43772f', '#5f9638', '#80b545', '#a6d35a'];
const HB_BTREE = ['#2b4f30', '#3b6a3e', '#4d8049', '#649858'];   // vài cây lớn phía sau: viền + 3 mảng
/* đá vôi tô mảng phẳng (không dither): nhiễu tần số thấp lượng tử thành vài bậc màu */
const hbLime = (x, y, k, b = 0) => HB_LIME[Math.max(0, Math.min(5, Math.floor((hbVN(x, y, 9, k) * .8 + hbVN(x, y, 4, k + 1) * .2) * 5 + b)))];
/* các đoạn thác: x, y đầu, y cuối, bề rộng, độ lệch ngang, tốc độ chảy, kiểu (0 dòng thác · 1 rèm nước tràn bậc) */
const HB_FALLS = [
  // thác trên cùng (xa nhất): dòng nhỏ bên trái mỏm rêu + dòng chính trắng xoá loe ra khi đổ qua đá
  [200, 52, 127, 9, -6, 36, 0], [238, 42, 92, 42, 4, 40, 0], [236, 92, 127, 58, -6, 46, 0],
  // tầng hai: rèm nước thấp tràn khỏi bậc trên
  [190, 137, 151, 36, 0, 46, 1], [232, 136, 151, 58, 0, 46, 1], [296, 137, 151, 40, 0, 46, 1],
  // tầng cuối: rèm nước rộng đổ xuống vực, các mỏm đá nhô chia thành nhiều mảng
  [26, 166, 201, 36, -2, 62, 1], [70, 166, 201, 54, -2, 66, 1], [132, 166, 201, 98, 0, 70, 1], [236, 166, 201, 60, 2, 66, 1], [302, 166, 201, 40, 2, 62, 1]];

/* cây đa kiểu pixel art, vẽ theo ô 2×2 px cho ra chất pixel to: tán bẹt rộng ghép từ nhiều khối lá vuông vức, mỗi khối chia dải màu
   phẳng (vàng chanh phía trên, xanh giữa, xanh đậm phía dưới), dải sẫm dọc đáy tán; thân nâu loang mảng sáng tối, cành chĩa xiên,
   rễ phụ rủ thành mành. x, cy = tâm tán (px), base = chân thân (px), s = nửa bề rộng tán (ô), k = hạt ngẫu nhiên */
const HB_TREE = ['#09491f', '#0d5f2c', '#17883b', '#9dcb48'], HB_BARK = ['#4b260e', '#8e521f', '#d08a48'];
/* các khối lá theo bội số s: [tâm x, tâm y, bán kính x, bán kính y, ngưỡng sáng, ngưỡng tối] (ngưỡng theo toạ độ dọc −1..1 trong khối)
   – khối sau trước, khối trước sau (khối sau cùng che lên trên): lõi tán lấp kẽ, hai khối đỉnh gần như sáng cả, hai khối hông, khối giữa sẫm, ba khối nhỏ phía trước */
const HB_LOBES = [[0, .08, .78, .3, -.6, .3], [-.19, -.24, .38, .23, .5, 2], [.42, -.2, .28, .18, .3, 2], [-.66, .16, .34, .27, -.15, .4], [.72, .2, .28, .23, -.1, .45],
  [0, .29, .4, .21, -.8, .15], [-.38, .25, .15, .1, .25, 2], [.33, .24, .16, .11, .25, 2], [.6, .37, .12, .09, .2, 2]];
function hbTree(put, x, cy, base, s, k) {
  const P = (bx, by, c) => { const px = x + bx * 2, py = cy + by * 2; put(px, py, c); put(px + 1, py, c); put(px, py + 1, c); put(px + 1, py + 1, c); };
  const L = HB_LOBES.map(([u, v, rx, ry, a, b], i) => [(u + (rnd(k * 31 + i) - .5) * .08) * s, (v + (rnd(k * 31 + i + 20) - .5) * .08) * s, rx * s, ry * s, a, b]);
  const own = (bx, by) => { for (let i = L.length - 1; i >= 0; i--) { const [lx, ly, rx, ry] = L[i]; if (Math.abs((bx - lx) / rx) ** 3 + Math.abs((by - ly) / ry) ** 3 <= 1) return i; } return -1; };
  // tán lá: dải màu theo độ cao trong khối (nghiêng nhẹ – sáng lệch về trái), nhiễu cho mép dải gãy khúc kiểu pixel
  const R = Math.ceil(s * 1.1), shade = new Map();
  for (let by = -R; by <= R; by++) for (let bx = -R; bx <= R; bx++) { const o = own(bx, by); if (o < 0) continue;
    const [lx, ly, rx, ry, lit, dk] = L[o], v = (by - ly) / ry + (bx - lx) / rx * .25 + (hbVN(bx, by, 2, k) - .5) * .5;
    let c = v < lit ? 3 : v > dk ? 1 : 2;
    if (c === 2 && rnd(bx * 7.3 + by * 3.1 + k) > .95) c = rnd(bx + by * 9 + k) > .5 ? 3 : 1;   // đốm lá lẻ
    if (own(bx, by + 1) > o || own(bx, by + 2) > o) c = 1;                         // bóng sẫm ngay trên khối phía trước
    let d = 0; while (d < 3 && own(bx, by + d + 1) >= 0) d++;
    if (d < 1) c = 0; else if (d < 3 && c > 1) c = 1; else if (own(bx - 1, by) < 0 && c === 2) c = 1;   // dải sẫm dọc đáy tán, mép trái tối
    shade.set(bx + ',' + by, c); P(bx, by, HB_TREE[c]); }
  // thân: thuôn dần lên trên, hơi uốn, mảng nâu sáng/vừa/sẫm loang chéo; cột trái luôn sẫm
  const b0 = Math.round((base - cy) / 2), tb = Math.round(s * .4), w0 = Math.max(3, Math.round(s * .3)), w1 = Math.max(2, Math.round(s * .2));
  let top = 0;
  for (let by = b0; by >= tb; by--) { const t = (b0 - by) / (b0 - tb), w = Math.round(w0 + (w1 - w0) * t), xo = Math.round(Math.sin(t * 2.4 + k) * 1.3) - (w >> 1);
    for (let i = 0; i < w; i++) { const bx = xo + i, n = hbVN(bx * 1.3 + by * .7, by * .5, 1.6, k + 5);
      P(bx, by, HB_BARK[i === 0 ? (n > .75 ? 1 : 0) : n > .6 ? 2 : n > .38 ? 1 : 0]); }
    top = xo + (w >> 1); }
  // cành: chĩa xiên lên trái, vươn gần ngang sang phải – chỉ lộ ra trên phần tán sẫm phía dưới
  const branch = (bx, by, c) => { const sh = shade.get(bx + ',' + by); if (sh == null || sh < 2) P(bx, by, c); };
  for (let j = 1; j <= Math.round(s * .35); j++) { const by = tb + 3 - j; branch(top - j, by, HB_BARK[0]); branch(top - j, by + 1, HB_BARK[j % 3 ? 0 : 1]); }
  for (let j = 1; j <= Math.round(s * .45); j++) { const by = tb + 2 - (j >> 1); branch(top + j, by, HB_BARK[0]); branch(top + j, by + 1, HB_BARK[j % 3 ? 1 : 0]); }
  // rễ phụ rủ xuống từ đáy tán (tránh chỗ thân), vài dây võng nối nhau thành mành
  const vines = [];
  for (let bx = -Math.round(s * .9); bx <= Math.round(s * .9); bx++) {
    if (rnd(bx * 3.1 + k * 7) < .62 || Math.abs(bx - top) <= w1 + 1) continue;
    let yb = 0; while (yb < R && own(bx, yb) >= 0) yb++; if (own(bx, yb - 1) < 0) continue;
    const len = 3 + Math.floor(rnd(bx * 7.7 + k) * s * .8), c = HB_TREE[rnd(bx * 5.3 + k) > .5 ? 1 : 2];
    for (let j = 0; j < len; j++) P(bx, yb + j, c);
    vines.push([bx, yb, yb + len - 1]); }
  for (let i = 1; i < vines.length; i++) { const [xa, ya, ea] = vines[i - 1], [xb, yb, eb] = vines[i], gap = xb - xa;
    if (gap < 2 || gap > 7 || rnd(xa * 2.9 + k) < .45) continue;
    const y0 = Math.max(ya, yb) + 1 + Math.floor(rnd(xa + k * 3) * (Math.min(ea, eb) - Math.max(ya, yb)) * .6);
    for (let bx = xa + 1; bx < xb; bx++) { const y = y0 + Math.round(Math.sin((bx - xa) / gap * Math.PI) * (1 + gap * .2)); if (y <= Math.min(ea, eb) + 2) P(bx, y, HB_TREE[2]); } }
}

/* ---- nền nhiều lớp kiểu parallax: núi đá vôi xa → núi gần → dải rừng → vài cây lớn phía sau.
   Mỗi lớp một canvas riêng (rộng hơn khung HB_LM px mỗi bên để lắc không hở mép) để chèn sương trôi, chim bay vào giữa ---- */
const HB_LM = 8;
let hbLayersC = null;
function hbLayers() {
  if (hbLayersC) return hbLayersC;
  const layer = () => { const L = hbCanvas(W + HB_LM * 2, H); return { done: L.done, put: (x, y, c) => L.put(x + HB_LM, y, c) }; };
  // núi đá vôi (kiểu Hòa Bình): các khối tháp sườn dốc đỉnh tròn, tô phẳng – sáng mép trái, tối mép phải, vân dọc
  const karst = (towers, [base, lit, dark, streak], k) => { const { put, done } = layer(), T = [], o = HB_LM + 2;
    for (let x = -o; x < W + o + 2; x++) { let t = H; for (const [cx, ty, w] of towers) { const p = ((x - cx) / w) ** 2; t = Math.min(t, ty + 70 * p * p); } T[x + o] = Math.round(t + hbVN(x, 0, 4, k) * 2); }
    const tp = x => T[x + o];
    for (let x = -HB_LM; x < W + HB_LM; x++) for (let y = Math.max(16, tp(x)); y < H; y++)
      put(x, y, y === tp(x) || tp(x - 1) > y || tp(x - 2) > y ? lit : tp(x + 1) > y || tp(x + 2) > y || tp(x + 3) > y ? dark : hbVN(x, y * .2, 3, k + 1) > .7 ? streak : base);
    return done(); };
  // dải rừng xa: hàng tán cây tròn chồng lên nhau, mỗi tán sáng viền trên-trái, tối nửa dưới-phải, không viền đen
  const forest = (y0, step, rr, [base, lit, dark], k) => { const { put, done } = layer(), cs = [];
    for (let x = -12 - HB_LM, i = 0; x < W + 24 + HB_LM; x += step, i++) cs.push([x + (rnd(i + k) - .5) * step * .5, y0 + rnd(i * 1.7 + k) * 12, rr * (.8 + rnd(i * 2.3 + k) * .5)]);
    const own = (x, y) => { let o = y > y0 + 16 ? -2 : -1, oy = -1e9; cs.forEach(([cx, cy, r], i) => { if (cy > oy && (x - cx) ** 2 + (y - cy) ** 2 <= r * r) { o = i; oy = cy; } }); return o; };
    for (let x = -HB_LM; x < W + HB_LM; x++) for (let y = Math.floor(y0 - rr * 1.4); y < H; y++) { const o = own(x, y); if (o === -1) continue;
      const c = cs[o]; put(x, y, o >= 0 && own(x - 1, y - 2) !== o ? lit : o >= 0 && y - c[1] > c[2] * .3 && x - c[0] > -c[2] * .3 ? dark : base); }
    return done(); };
  // vài cây đa lớn phía sau, đứng hai bên thác – lớp gần nhất của nền: [tâm tán x, tâm tán y, nửa bề rộng tán (ô), hạt]
  const trees = () => { const { put, done } = layer();
    for (const [x, cy, s, k] of [[34, 68, 24, 1], [124, 92, 14, 2], [384, 88, 14, 3], [452, 64, 24, 4]]) hbTree(put, x, cy, 150, s, k);
    return done(); };
  return hbLayersC = [
    karst([[20, 46, 24], [88, 30, 30], [160, 50, 22], [232, 26, 34], [318, 44, 24], [392, 28, 32], [462, 42, 26]], ['#c4dccb', '#d9eadc', '#b2cfbb', '#bad5c2'], 1),
    karst([[-6, 60, 26], [58, 52, 24], [128, 72, 22], [350, 66, 24], [420, 54, 28], [486, 64, 22]], ['#93bba0', '#acd0b3', '#7fa98d', '#88b296'], 2),
    forest(98, 16, 13, ['#6a9a6c', '#82b37f', '#588a5e'], 3),
    trees()];
}
/* giữa các lớp nền: dải sương trôi ngang (lớp xa trôi chậm hơn lớp gần) và chim bay xa */
function hbAir(i) {
  const [y, spd, a] = [[64, 2, .14], [96, 3.5, .12], [128, 5, .1]][i];
  for (let k = 0; k < 3; k++) ellipseGlow(loopX(spd, k * 190 + i * 70, W + 240) - 80, y + k * 5, 72, 6, '#ffffff', a);
  if (i === 0) for (let k = 0; k < 3; k++) { const bx = Math.round(loopX(9, k * 14 + (k % 2) * 6, W + 120) - 30), by = 52 + k * 4 + (k % 2) * 3, f = Math.floor(time * 5 + k) % 2;
    fr('#5c7468', bx - 2, by - f, 2, 1); fr('#5c7468', bx, by, 1, 1); fr('#5c7468', bx + 1, by - f, 2, 1); }
}

/* ---- vách thác trên, các bậc đá vôi ---- */
let hbLandC = null; const HB_WATER = [];   // toạ độ (x, y) các điểm nước tràn trên bậc đá, để vẽ vệt chảy
function hbLand() {
  if (hbLandC) return hbLandC;
  const { put, done } = hbCanvas(W, H);
  // vách thác trên: khối đá vôi sừng sững nhô lên khỏi rừng – vân đá dọc, viền tối, sáng mép trái, thảm rêu rủ trên đỉnh
  const cl = y => 186 + Math.round(Math.sin(y * .11) * 4 + (y < 62 ? (62 - y) * .9 : 0)), cr = y => 316 + Math.round(Math.sin(y * .09 + 2) * 4 - (y < 62 ? (62 - y) * .7 : 0));
  const ct = x => 38 + Math.round(Math.sin(x * .21) * 1.5 + hbVN(x, 0, 6, 7) * 5), inC = (x, y) => y >= ct(x) && y < 131 && x >= cl(y) && x < cr(y);
  for (let x = 170; x < 330; x++) { const drip = hbVN(x, 2, 2, 8) > .5 ? 3 + Math.floor(hbVN(x, 3, 2, 9) * 7) : 3;
    for (let y = 30; y < 131; y++) { if (!inC(x, y)) continue;
      const d = y - ct(x), v = hbVN(x, y * .22, 4, 3); let c;
      if (!inC(x - 1, y) || !inC(x + 1, y) || !inC(x, y - 1)) c = '#3a3226';
      else if (d < 3) c = HB_MOSS[4 - d];
      else if (d < drip) c = d === drip - 1 ? HB_MOSS[1] : HB_MOSS[2];
      else { c = HB_LIME[Math.max(0, Math.min(5, Math.floor((v * .75 + hbVN(x, y, 7, 4) * .25) * 4) + (x - cl(y) < 3 ? 2 : 0) - (cr(y) - x < 5 ? 1 : 0)))];
        if (v > .74) c = HB_LIME[0];   // khe nứt dọc
        const m = hbVN(x, y, 6, 12) + (x < 238 ? .12 : 0); if (m > .62) c = HB_MOSS[m > .72 ? 4 : m > .67 ? 3 : 2]; }
      put(x, y, c); } }
  for (const [x, y, rx, ry, k] of [[210, 36, 13, 7, 40], [302, 34, 14, 8, 41]]) hbClump(put, x, y, rx, ry, HB_BTREE, k, { tuft: false });   // bụi cây trên đỉnh vách
  hbClump(put, 222, 90, 13, 34, HB_MOSS.slice(0, 5), 7);   // mỏm rêu ngăn hai dòng thác trên
  /* bậc đá vôi: mép sau lượn sóng, mặt có vũng nước tràn xanh ngọc xen gờ đá & bụi cỏ, gờ trước sáng, vách trước tối */
  const terr = (x0, x1, yb0, yf, y2, k) => { for (let x = x0; x < x1; x++) {
    const e = Math.min(x - x0, x1 - x), yb = yb0 + Math.round(Math.sin(x * .07 + k) * 1.5 + Math.sin(x * .19 + k) + (e < 12 ? (12 - e) * .7 : 0));
    for (let y = yb; y < y2; y++) { let c;
      if (y === yb) c = hbLime(x, y, k, 1.6);
      else if (y < yf) { const rim = hbVN(x, y * 2.4, 6, k + 3) + (e < 8 ? .3 : 0);
        if (rim > .64) c = hbLime(x, y, k, .9 + (rim > .7 ? .6 : 0)); else if (rim > .59) c = '#d9cfa8';
        else { c = ['#93cdb6', '#a9d8c4', '#c0e3d3', '#d9efe4'][Math.min(3, Math.floor((y - yb) / (yf - yb) * 3.2 + hbDith(x, y)))]; HB_WATER.push(x, y); } }
      else if (y < yf + 2) c = hbLime(x, y, k, 1.8);
      else c = hbLime(x, y, k, y > y2 - 4 ? -1.6 : -.9);
      put(x, y, c); } }
    for (let i = 0; i < (x1 - x0) / 9; i++) { const x = x0 + 10 + Math.floor(rnd(i * 7 + k) * (x1 - x0 - 20)), y = yb0 + 2 + Math.floor(rnd(i * 5 + k + 1) * (yf - yb0 - 4));   // bụi cỏ mọc trên gờ đá
      if (hbVN(x, y * 2.4, 6, k + 3) < .64) continue; for (let j = 0; j < 4; j++) { put(x + j - 1, y - (j % 2 ? 2 : 1), j % 2 ? '#80b545' : '#5f9638'); put(x + j - 1, y, '#43772f'); } } };
  terr(144, 356, 122, 135, 154, 5); terr(10, 450, 144, 162, 168, 8);
  for (let x = 0; x < W; x++) for (let y = 166; y < 205; y++) {   // vách cuối sau rèm nước: vệt nước loang, rêu ở chân
    let c = hbLime(x, y, 9, -1.1 + (y < 170 ? .8 : 0)); if (hbVN(x * 2, y * .15, 3, 14) > .64) c = '#3f3528';
    if (y > 190 && hbVN(x, y, 5, 15) > .5) c = HB_MOSS[1 + Math.floor(hbVN(x, y, 3, 16) * 3)]; put(x, y, c); }
  return hbLandC = done();
}

let hbRaysC = null;
function hbRays() {   // vệt nắng xiên xuống thung thác
  if (hbRaysC) return hbRaysC;
  const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d'); g.fillStyle = '#fff6cf';
  for (const [x0, w] of [[150, 18], [214, 10], [262, 24], [330, 12]]) { g.beginPath(); g.moveTo(x0, 16); g.lineTo(x0 + w, 16); g.lineTo(x0 + w * 3 + 90, HB_WL); g.lineTo(x0 + 84, HB_WL); g.fill(); }
  return hbRaysC = c;
}

/* ---- thác nước: dải vân nước cuộn sẵn, mỗi khung cuộn xuống theo từng hàng ---- */
const hbTexC = [];
function hbTex(k) {   // k = 1: rèm nước, lác đác chỗ mỏng lộ đá phía sau
  if (hbTexC[k]) return hbTexC[k];
  const { put, done } = hbCanvas(200, 64), C = ['#ffffff', '#f3faf6', '#dcefe5', '#bcdccd', '#93c3b0', '#7a8f72'];
  for (let x = 0; x < 200; x++) { const y0 = Math.floor(rnd(x + 1 + k * 300) * 64), sp = x % 7 === 3 || x % 11 === 5 ? 4.6 : 1.8;
    for (let k2 = 0, s = 0; k2 < 64; s++) { const len = 2 + Math.floor(rnd(x * 7 + s * 13 + k) * 10), c = k && rnd(x * 13 + s * 7) < .05 ? C[5] : C[Math.min(4, Math.floor(rnd(x * 3 + s * 5 + 1 + k) * sp))];
      for (let i = 0; i < len && k2 < 64; i++, k2++) put(x, (y0 + k2) % 64, c); } }
  return hbTexC[k] = done();
}
function hbFalls() {
  HB_FALLS.forEach(([x, y0, y1, w, dx, sp, kind], s) => {
    const T = hbTex(kind), off = Math.floor(sceneT * sp), sx = (s * 23) % (200 - w);
    for (let y = y0; y < y1; y++) {
      const lx = Math.round(x + dx * (y - y0) / (y1 - y0)), j = rnd(y * .7 + s * 13 + Math.floor(sceneT * 9)) < .25 ? 1 : 0;   // mép nước lăn tăn
      ctx.drawImage(T, sx, (((y - off) % 64) + 64) % 64, w, 1, lx - j, y, w + j * 2, 1);
      fr('#ffffff', lx - j, y, 1, 1); ctx.globalAlpha = .7; fr('#7fb39e', lx + w + j - 1, y, 1, 1); ctx.globalAlpha = 1;   // sáng mép trái, tối mép phải
    }
    if (kind) { fr('#ffffff', x, y0 - 1, w, 1); for (let i = 0; i < w; i += 3) if (rnd(i + s * 9 + Math.floor(sceneT * 6)) > .5) fr('#e6f5ec', x + i, y0 - 2, 2, 1); }   // nước uốn qua gờ đá
  });
}
function hbFoam() {   // nước đập xuống bậc đá: bọt trắng + bụi nước bắn ra
  HB_FALLS.forEach(([x, y0, y1, w, dx], s) => {
    if (y1 >= 196) return; const lx = x + dx, f = Math.floor(sceneT * 10);
    for (let i = 0; i < w / 2 + 3; i++) fr(rnd(i + f) < .6 ? '#ffffff' : '#dcefe5', lx - 3 + rnd(i * 5.3 + s + f) * (w + 6), y1 - 3 + rnd(i * 2.7 + f + s * 3) * 5, 2, 2);
    ctx.globalAlpha = .45; for (let i = 0; i < 4; i++) { const p = (sceneT * 1.8 + i / 4 + s * .3) % 1, side = i % 2 ? 1 : -1; fr('#ffffff', lx + (side > 0 ? w : 0) + side * p * 9, y1 - 2 - Math.sin(p * Math.PI) * 6, 1, 1); } ctx.globalAlpha = 1;
  });
}
/* nước tràn trên mặt bậc đá: vệt sáng trôi dần về phía gờ trước, lấp lánh */
function hbTerraces() {
  const n = HB_WATER.length >> 1;
  for (let i = 0; i < 110; i++) { const k = Math.floor(rnd(i + 40) * n) * 2, x = HB_WATER[k], y = HB_WATER[k + 1] + Math.floor((sceneT * 3 + rnd(i)) % 3);
    ctx.globalAlpha = .7; fr('#ffffff', x, y, 2 + (i % 3), 1); }
  for (let i = 0; i < 40; i++) { const k = Math.floor(rnd(i + 90 + Math.floor(sceneT * 4) * 3.1) * n) * 2; ctx.globalAlpha = .9; fr('#ffffff', HB_WATER[k], HB_WATER[k + 1], 1, 1); }
  ctx.globalAlpha = 1;
  hbFoam();
}
function hbGrass() {   // bụi lau cao trên vách đá bên phải, đung đưa theo gió
  for (let i = 0; i < 16; i++) { const bx = 404 + rnd(i + 700) * 74, h = 30 + rnd(i + 730) * 58, lean = (rnd(i + 760) - .5) * 1.2, col = ['#5f9638', '#80b545', '#a6d35a', '#4a7d2e'][i % 4], sw = Math.sin(time * 1.3 + i * .7) * 2.5;
    for (let j = 0; j < h; j++) { const t = j / h; fr(col, bx + lean * j * .4 + sw * t * t, 152 - j, t > .7 ? 1 : 2, 1); }
    if (i % 3 === 0) { const tx = bx + lean * h * .4 + sw; fr('#e9e2c4', tx - 1, 152 - h - 3, 2, 4); }   // bông lau
  }
}

/* ---- vực nước phía sau ---- */
let hbPoolC = null, hbPoolFC = null;
function hbGrad(h, stops) { const c = document.createElement('canvas'); c.width = W; c.height = h; const g = c.getContext('2d'), id = g.createImageData(W, h); ditherInto(id, W, stops, 0, h); g.putImageData(id, 0, 0); return c; }
function hbPoolBack() {
  ctx.drawImage(hbPoolC || (hbPoolC = hbGrad(HB_WL - HB_PT, ['#e8f5ee', '#b5dfcc', '#93cdb6', '#7dbea6', '#6cb09a'])), 0, HB_PT);
  for (let i = 0; i < 44; i++) { const r = i % 7, dir = rnd(i + 3) < .5 ? -1 : 1, x = ((rnd(i + 7) * W + sceneT * (6 + r) * dir) % W + W) % W;   // gợn sóng loang ra
    ctx.globalAlpha = .55; fr(r < 2 ? '#ffffff' : '#c6e9d8', x, 205 + r * 3, 3 + Math.floor(rnd(i + 11) * 6), 1); }
  ctx.globalAlpha = 1;
  HB_FALLS.forEach(([x, y0, y1, w, dx], s) => { if (y1 < 196) return; const lx = x + dx, f = Math.floor(sceneT * 8);   // bọt trắng sủi dưới chân rèm nước
    for (let i = 0; i < w + 8; i++) fr(rnd(i + f) < .5 ? '#ffffff' : '#e3f3ea', lx - 4 + rnd(i * 5.1 + s * 17 + f) * (w + 8), 196 + rnd(i * 3.3 + f + s) * 8, 2 + (i % 3 ? 0 : 1), 2);
    ellipseGlow(lx + (w >> 1), 199, Math.round(w * .55 + 4), 4 + Math.round(Math.sin(sceneT * 2 + s) * 1.2), '#ffffff', .2); });
  const p = (sceneT % 9) / .8;   // thỉnh thoảng có cá nhảy lên
  if (p < 1) { const fx = Math.round(112 + p * 18), fy = Math.round(216 - Math.sin(p * Math.PI) * 11); fr('#dfe7ee', fx, fy, 4, 2); fr('#8a9aa8', fx, fy + 1, 4, 1); fr('#dfe7ee', fx - 2, fy - (p < .5 ? 1 : -1), 2, 2); }
  else if (p < 1.6) { ctx.globalAlpha = 1.6 - p; fr('#ffffff', 108, 216, 3, 1); fr('#ffffff', 128, 216, 4, 1); ctx.globalAlpha = 1; }
  for (let i = 0; i < 4; i++) { const mx = loopX(3 + i, i * 130, W + 160) - 60;   // hơi nước bay ngang chân thác
    ellipseGlow(mx, 186 + i * 4 + Math.round(Math.sin(sceneT + i) * 3), 34, 6, '#ffffff', .07); }
}

/* ---- đá: ba bậc đá vôi bên phải (mặt phẳng nhân vật) + đá tảng sau bãi sỏi ---- */
let hbRocksC = null;
function hbRocks() {
  if (hbRocksC) return hbRocksC;
  const { put, done } = hbCanvas(W, H), steps = [298, 330, 352, 404];
  // khối đá xếp chồng kiểu pixel art: chia ô Voronoi, mỗi tảng tô phẳng một màu – mép trên-trái bắt nắng, mép dưới-phải đổ bóng, viền khe đậm
  const seeds = []; for (let i = 0; i < 46; i++) { const s = [300 + rnd(i + 500) * 184, 150 + rnd(i + 540) * 110, rnd(i + 580)];
    if (seeds.every(o => ((o[0] - s[0]) * .7) ** 2 + (o[1] - s[1]) ** 2 > 81)) seeds.push(s); }   // bỏ tâm quá sát nhau (tảng vụn thành vệt đen)
  const near = (x, y) => { let d1 = 1e9, d2 = 1e9, c = null;
    for (const s of seeds) { const dd = ((x - s[0]) * .7) ** 2 + (y - s[1]) ** 2; if (dd < d1) { d2 = d1; d1 = dd; c = s; } else if (dd < d2) d2 = dd; }
    return [c, Math.sqrt(d2) - Math.sqrt(d1)]; };
  const stepK = x => steps.reduce((m, s) => x >= s ? x - s : m, 99), topY = x => { const k = stepK(x); return hbRTop(x) + (k < 3 ? [2, 1, 0][k] : 0); };
  const moss = (x, y) => y < HB_WL - 6 && hbVN(x, y * .6, 8, 25) > .7;   // mảng rêu bám kẽ đá
  for (let x = 298; x < W; x++) {
    const k = stepK(x), t = topY(x), mTop = hbVN(x, 0, 6, 23) > .45, drip = mTop ? 3 + Math.floor(hbVN(x, 1, 2, 24) * 5) : 0;
    for (let y = t; y < H; y++) {
      const [c1, e] = near(x, y), d = y - t;
      let i = c1[2] < .45 ? 2 : 3;                                          // mỗi tảng một tông
      if (near(x - 1, y - 3)[0] !== c1 && y - 3 >= topY(x - 1)) i++;          // mép trên-trái bắt nắng
      else if (near(x + 2, y + 2)[0] !== c1) i--;                          // mép dưới-phải đổ bóng
      if (y >= HB_WL - 2) i -= 2; else if (d > 40) i--;                    // chìm dưới nước / sâu trong bóng
      if (k < 3 && d > 1) i += 2 - k;                                       // mặt đá quay về phía nắng
      let col = e < 1.1 ? '#2f2820' : HB_LIME[Math.max(0, Math.min(5, i))];
      if (d < 3) col = mTop ? HB_MOSS[4 - d] : ['#e9dcb6', '#d0be94', '#a6936d'][d];   // mặt trên: thảm rêu / đá sáng
      else if (d < drip) col = d === drip - 1 ? HB_MOSS[1] : HB_MOSS[2];   // rêu rủ xuống mép đá
      else if (e >= 1.1 && moss(x, y)) col = moss(x, y - 1) ? HB_MOSS[2] : HB_MOSS[4];
      if (y >= HB_WL - 2 && y <= HB_WL) col = '#4f7a3a';                   // ngấn rêu chân nước
      put(x, y, col);
    }
  }
  for (const s of seeds) { if (s[2] < .55) continue; const x = Math.round(s[0] - 2), y = Math.round(s[1]);   // vết nứt nhỏ trên mặt tảng
    if (y < topY(x) + 4 || y > HB_WL - 6) continue; for (let j = 0; j < 4; j++) { put(x + j, y + (j >> 1), '#3d3428'); put(x + j, y + (j >> 1) + 1, HB_LIME[4]); } }
  for (let x = 352; x < 404; x++) if (rnd(x + 400) > .55) put(x, 163, '#a6d35a');   // cỏ non trên mỏm nhảy
  for (const [x, y] of [[340, 186], [312, 208]]) for (let i = 0; i < 5; i++) { const a = -1.4 + i * .7; for (let r = 1; r < 6; r++) put(x + Math.cos(a) * r, y - Math.sin(Math.abs(a) + .4) * r * .8 + r * r * .06, r < 4 ? '#4a8a3a' : '#74a85c'); }   // dương xỉ
  for (const [cx, cy, rx, ry] of [[22, 208, 24, 13], [68, 214, 20, 9], [98, 219, 12, 5]]) {   // đá tảng sau bãi sỏi
    hbClump(put, cx, cy, rx, ry, ['#3a3024', '#6a5a42', '#8a7656', '#b09c72', '#d6c39a'], cx, { bump: .04, tuft: false });
    for (let x = -rx + 4; x < rx - 4; x++) if (hbVN(cx + x, 0, 4, cx) > .45) put(cx + x, cy - Math.round(ry * Math.sqrt(1 - (x / rx) ** 2)) + 1, '#80b545');
  }
  return hbRocksC = done();
}

/* ---- bãi sỏi bên trái + đồ đạc của cả hội ---- */
let hbBankC = null;
function hbBank() {
  if (hbBankC) return hbBankC;
  const { put, R, done } = hbCanvas(W, H), P = ['#ddd2b6', '#c7b998', '#ad9f80', '#93866a', '#7a6e56', '#615746'];
  for (let y = GY; y < H; y++) for (let x = 0; x < hbEdge(y); x++) { const wet = x > hbEdge(y) - 12 || y > 244 ? 1.4 : 0; put(x, y, P[Math.min(5, Math.floor(hbVN(x, y, 3, 2) * 3 + hbDith(x, y) + .4 + wet))]); }
  const PEB = [['#ece6d6', '#bdb5a2'], ['#c9bc9c', '#968a6c'], ['#a3aaa0', '#76807a'], ['#d0b090', '#9c7e60'], ['#b5ab92', '#857c66']];
  for (let i = 0; i < 150; i++) { const y = GY + 1 + Math.floor(rnd(i + 900) * 32), x = Math.floor(rnd(i + 950) * (hbEdge(y) - 3)), rx = 1 + Math.floor(rnd(i + 990) * 3), [c, s] = PEB[i % 5];
    for (let xx = -rx; xx <= rx; xx++) { put(x + xx, y, c); put(x + xx, y + 1, s); } put(x - rx + 1, y, '#f6f2e8'); }
  for (let x = 0; x < 100; x++) put(x, GY, rnd(x) > .5 ? '#e6dfcc' : '#cfc6b0');
  hbBankC = done();
  // ba lô cam, chai nước, nón lá, khăn tắm kẻ sọc, dép tông
  R('#862e0c', 3, 207, 14, 15); R('#f76707', 4, 208, 12, 13); R('#ffa94d', 4, 208, 12, 1); R('#c2410c', 6, 213, 8, 1); R('#c2410c', 7, 214, 6, 5); R('#ffa94d', 7, 214, 6, 1); R('#343a40', 8, 205, 4, 2); R('#343a40', 14, 209, 1, 10);
  R('#1864ab', 19, 212, 3, 1); R('#a5d8ff', 18, 213, 5, 9); R('#e7f5ff', 19, 214, 1, 6); R('#4dabf7', 18, 217, 5, 2);
  R('#c9a95a', 24, 220, 12, 2); R('#e9d8a6', 25, 218, 10, 2); R('#f1e3c8', 27, 216, 6, 2); R('#f6ead0', 29, 215, 2, 1);
  for (let x = 48; x < 82; x++) { const c = ['#ff6b6b', '#ffffff', '#4dabf7'][(x >> 2) % 3]; R(c, x, 219, 1, 3); } R('#c92a2a', 48, 219, 34, 1);
  for (const [x, c] of [[86, '#ff8fab'], [91, '#ff8fab'], [60, '#ffd43b'], [65, '#ffd43b']]) { R(c, x, 220, 4, 2); R('#343a40', x + 1, 220, 2, 1); }
  return hbBankC;
}

/* ---- sinh vật: bướm trên bãi sỏi, chuồn chuồn trên mặt hồ ---- */
function hbLife() {
  for (let i = 0; i < 3; i++) butterfly(30 + i * 26 + Math.sin(sceneT * 1.7 + i * 2) * 14, 186 + Math.sin(sceneT * 2.6 + i) * 8, ['#ffd43b', '#ffffff', '#4dabf7'][i]);
  const dx = Math.round(190 + Math.sin(sceneT * .45) * 70 + (Math.floor(sceneT * .9) % 2 ? 6 : 0)), dy = Math.round(188 + Math.sin(sceneT * 1.9) * 6), wf = Math.floor(time * 24) % 2;
  fr('#1c7ed6', dx, dy, 7, 1); fr('#4dabf7', dx + 5, dy - 1, 2, 2); ctx.globalAlpha = .6; fr('#e7f5ff', dx + 1, dy - 2 - wf, 3, 1); fr('#e7f5ff', dx + 1, dy + 1 + wf, 3, 1); ctx.globalAlpha = 1;
}

function hbScene() {
  // các lớp nền xa → gần, lắc nhẹ kiểu camera lia chậm: lấy mặt phẳng nhân vật làm mốc đứng yên,
  // lớp càng xa càng lệch nhiều (như khi camera lia, tiền cảnh trôi nhanh còn núi xa gần như đứng yên)
  const Ly = hbLayers(), sx = Math.sin(sceneT * .37) * 5 + Math.sin(sceneT * .13) * 2, sy = Math.sin(sceneT * .29 + 1) * 1.5;
  [1, .75, .5, .3].forEach((f, i) => { ctx.drawImage(Ly[i], Math.round(sx * f) - HB_LM, Math.round(sy * f)); if (i < 3) hbAir(i); });
  ctx.drawImage(hbLand(), 0, 0); hbFalls(); hbTerraces(); hbGrass();
  ctx.globalAlpha = .07 + Math.sin(sceneT * .6) * .02; ctx.drawImage(hbRays(), 0, 0); ctx.globalAlpha = 1;
  hbPoolBack(); ctx.drawImage(hbRocks(), 0, 0); hbLife();
}
function hbSky(id) { ditherInto(id, W, ['#dcefee', '#e8f4ea', '#f3f8e4'], 0, 70); ditherInto(id, W, ['#f3f8e4', '#cfe3d0'], 70, H); }   // trời sáng mờ hơi nước
/* lượt vẽ mặt đất (trước nhân vật): đáy hồ phía trước + bãi sỏi */
function hbGround() {
  const x1 = HB_POOL - 2;
  ctx.drawImage(hbPoolFC || (hbPoolFC = hbGrad(30, ['#6db39a', '#5aa28a', '#4a907a', '#3b7d6a'])), 0, 0, x1, 30, 0, HB_WL, x1, 30);
  ctx.globalAlpha = .35; for (let i = 0; i < 26; i++) { const y = HB_WL + 3 + (i % 9) * 3, x = 100 + ((rnd(i + 20) * 200 + Math.sin(sceneT * .8 + i) * 8) % 200), len = 3 + (i % 4); fr('#a6e0c6', x, y, len, 1); fr('#a6e0c6', x + len, y + 1, 2, 1); } ctx.globalAlpha = 1;   // vân nắng dưới đáy
  ctx.drawImage(hbBank(), 0, 0);
}
/* lượt vẽ sau nhân vật: mặt nước phía trước, gợn sóng, cột nước bắn, bụi nước, lá rủ khung hình */
function hbRing(cx, rx, ry, a, col = '#eefaf3') { ctx.globalAlpha = a; for (let i = 0; i < 28; i++) { const t = i / 28 * Math.PI * 2; fr(col, cx + Math.cos(t) * rx, HB_WL + Math.sin(t) * ry, 1, 1); } ctx.globalAlpha = 1; }
function hbFront() {
  const x1 = HB_POOL - 2;
  for (let y = HB_WL; y < H - 14; y++) { const xl = Math.max(0, Math.floor(hbEdge(y)) - 3); ctx.globalAlpha = Math.min(.96, .74 + (y - HB_WL) * .02); fr(['#86c8ae', '#6cb79c', '#579f88', '#468a76'][Math.min(3, (y - HB_WL) >> 3)], xl, y, x1 - xl, 1); }
  ctx.globalAlpha = 1;
  for (let x = Math.floor(hbEdge(HB_WL)); x < x1; x++) { const n = rnd(x * .37 + Math.floor(sceneT * 3) * 7.1); fr(n > .85 ? '#ffffff' : n > .45 ? '#d8f3e6' : '#a6dcc6', x, HB_WL, 1, 1); }
  for (const a of Object.values(actors)) { const cx = Math.round(a.x + 6);   // gợn quanh người đang bơi, vệt sóng khi bơi
    if (a.air || (a.lift || 0) > -6 || cx < 100 || cx > x1) continue;
    hbRing(cx, 11 + Math.sin(time * 3 + a.x) * 1.5, 2, .55);
    if (a.target != null) { ctx.globalAlpha = .5; for (let k = 1; k < 4; k++) fr('#e0f6ea', cx - a.face * (8 + k * 5), HB_WL + (k % 2 ? -1 : 1) * Math.ceil(k / 2), 4, 1); ctx.globalAlpha = 1; }
  }
  for (const s of props.hbSpl || []) {   // cột nước + vòng sóng loang
    const big = s.big ? 1.8 : 1;
    if (s.t < .6) { const h = Math.sin(s.t / .6 * Math.PI) * 30 * big, n = Math.round(6 * big);   // vương miện nước: các cột nước toả ra hai bên, viền xanh cho nổi trên nền rèm thác trắng
      for (let k = -n; k <= n; k++) { const ch = Math.round(h * (1 - (k / n) ** 2 * .7) * (.7 + rnd(k + s.x) * .3)), x = Math.round(s.x + k * (1.6 + s.t * 4));
        fr('#4f9e86', x - 1, HB_WL - ch, 1, ch); fr(k % 2 ? '#ffffff' : '#d2efe2', x, HB_WL - ch, 2, ch); fr('#ffffff', x, HB_WL - ch - 3, 2, 2); fr('#4f9e86', x, HB_WL - ch - 1, 2, 1); }
      if (s.big) { const ph = Math.round(h * 1.3); fr('#4f9e86', s.x - 4, HB_WL - ph, 9, ph); fr('#ffffff', s.x - 3, HB_WL - ph, 7, ph); fr('#d8f5e8', s.x + 1, HB_WL - ph + 2, 2, ph - 2); } }   // cột nước giữa khi "thả bom"
    if (s.t < 1.2) { ctx.globalAlpha = (1 - s.t / 1.2) * .8; ellipseGlow(Math.round(s.x), HB_WL, Math.round((8 + s.t * 18) * big), 3, '#ffffff', .8); ctx.globalAlpha = 1; }
    hbRing(s.x, (10 + s.t * 34) * big, 2 + s.t * 2, (1 - s.t / 2.4) * .8); if (s.t > .4) hbRing(s.x, (s.t - .4) * 30 * big, 1.5 + s.t, (1 - s.t / 2.4) * .6);
  }
  ctx.globalAlpha = .35; for (let i = 0; i < 24; i++) fr('#ffffff', 20 + ((rnd(i + 300) * 400 - sceneT * 10) % 400 + 400) % 400, 110 + (rnd(i + 340) * 120 + sceneT * (90 + rnd(i) * 50)) % 120, 1, 2); ctx.globalAlpha = 1;   // bụi nước li ti quanh thác
}

/* ---- vật lý: leo bậc đá, bơi, nhảy thác ---- */
const HB_JS = 1.4;   // nhịp nhảy: tua nhanh cả cú bay (vận tốc × S, trọng lực × S²) – quỹ đạo giữ nguyên, thời gian bay ngắn lại
function hbJump(n, o) {
  const a = actors[n]; if (!a) return;
  a.target = null; a.pose = null; a.face = o.vx < 0 ? -1 : 1; a.air = { ...o, vx: o.vx * HB_JS, vy: o.vy * HB_JS, t: 0 }; sfx('jump');
}
function hbSplash(x, big) {
  (props.hbSpl = props.hbSpl || []).push({ x, t: 0, big }); sfx(big ? 'bigsplash' : 'splash');
  for (let i = 0; i < (big ? 80 : 36); i++) particles.push({ x: x + (Math.random() - .5) * 14, y: HB_WL - 2, vx: (Math.random() - .5) * (big ? 220 : 120), vy: -(big ? 160 : 110) - Math.random() * (big ? 240 : 150), life: .9 + Math.random() * .5, max: 1.4, col: ['#ffffff', '#d2efe2', '#8fcdb5'][i % 3], sz: i % 3 ? 2 : 1, g: 520 });
  if (big) for (const a of Object.values(actors)) { const d = a.x + 6 - x; if (!a.air && !a.dunk && Math.abs(d) < 80 && (a.lift || 0) < -6) a.dunk = { v: 70, vx: Math.sign(d) * 18 }; }   // sóng đẩy người xung quanh dập dềnh
}
function hbUpdate(dt) {
  const spl = props.hbSpl = props.hbSpl || []; for (const s of spl) s.t += dt; while (spl.length && spl[0].t > 2.4) spl.shift();
  for (const a of Object.values(actors)) {
    let cx = a.x + 6; const base = hbBase(cx); if (a.lift == null) a.lift = base;
    if (a.air) {   // đang bay: quán tính ngang + trọng lực, lộn nhào nếu có
      const A = a.air; A.t += dt; a.x += A.vx * dt; a.lift += A.vy * dt; A.vy -= 900 * HB_JS * HB_JS * dt; a.noShadow = true; cx = a.x + 6;
      if (A.flip) a.spin = Math.min(1, A.t * HB_JS / .62);
      if (A.hearts && Math.random() < dt * 12) particles.push({ x: cx, y: GY - a.lift - 24, vx: (Math.random() - .5) * 20, vy: 20, life: .7, max: .7, col: Math.random() < .5 ? '#ff6b8b' : '#ff9eb0', sz: 2, g: 0 });
      if (a.lift < -4 && cx < HB_POOL) { hbSplash(cx, A.big); a.spin = null; a.air = null; a.dunk = { v: A.vy * .5 / HB_JS, vx: A.vx * .25 / HB_JS, to: A.to }; }
      continue;
    }
    if (a.dunk) {  // chìm xuống rồi nổi lên dập dềnh (lò xo tắt dần)
      const D = a.dunk; D.v += ((base - a.lift) * 95 - D.v * 9) * dt;   // lò xo cứng hơn: chìm rồi nổi lên nhanh
      a.lift += D.v * dt; a.x += D.vx * dt; D.vx *= Math.exp(-3 * dt); a.noShadow = true;
      if (a.lift < -30 && Math.random() < .5) particles.push({ x: cx + (Math.random() - .5) * 10, y: HB_WL + 6 + Math.random() * 18, vx: 0, vy: -22, life: .5, max: .5, col: '#e0f6ea', sz: 1, g: -30 });
      if (Math.abs(D.v) < 10 && Math.abs(base - a.lift) < 2) { a.dunk = null; if (D.to != null) a.target = D.to; }
      continue;
    }
    const tg = base + (base < -15 ? Math.sin(time * 2.2 + a.name.length) : 0), st = 220 * dt;   // bám mặt đá / nổi dập dềnh
    a.lift += Math.max(-st, Math.min(st, tg - a.lift));
    a.spd = base < -2 ? 64 : base > 0 ? 84 : 76;   // bơi / leo đá / đi trên sỏi
    a.noShadow = cx > 100 && cx < HB_POOL;
    if (a.noShadow && a.target != null && base < -8 && Math.random() < dt * 9) particles.push({ x: cx + a.face * 8, y: HB_WL - 2, vx: a.face * 20 + (Math.random() - .5) * 20, vy: -40 - Math.random() * 30, life: .4, max: .4, col: '#eefaf3', sz: 1, g: 300 });   // tay quạt nước
  }
}
