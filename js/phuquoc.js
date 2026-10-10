/* ================== PHÚ QUỐC: VINWONDERS LÚC HOÀNG HÔN ==================
   Bố cục (toạ độ màn hình, camera đứng yên ở chương này) – theo ảnh toàn cảnh VinWonders Phú Quốc lúc mặt trời lặn:
   - trời 0..PQ_HZ: xanh xám trên cao → tím nhạt → cam đào → vàng rực sát chân trời, quầng sáng quanh mặt trời (PQ_SUNX);
     mây tích xám tím viền cam trôi chậm (PQ_CLOUDS), dải mây sẫm mỏng vắt ngang mặt trời (PQ_STREAK); mặt trời lặn dần sau rặng cây
   - lớp xa vẽ sẵn (pqFar): rặng cây chân trời, toà nhà mái ngọc + lâu đài nhỏ phía phải, núi đá nhân tạo, làng châu Âu
     khung gỗ bên kia hồ (PQ_HOUSES) có tháp chuông, hai chòi mái lá; lâu đài cổ tích lớn bên trái (pqCastle): tháp giữa cao vút
     có ban công, mái đá xanh có cửa sổ mái, chóp nhọn xanh lam / hồng viền vàng, cánh nhà khung gỗ mái hồng, tháp tròn lỗ châu mai
   - hồ PQ_LAKE..PQ_BANK: trời soi ngược (pqSky), bóng làng + lâu đài lộn ngược, gợn sóng, vệt nắng lấp lánh, thuyền thiên nga
   - công viên nước bên phải (pqPark, x ≥ PQ_POOL): tháp trượt khung đỏ mái lá, máng trượt hở vàng cam, ống trượt xanh lá
     sọc tím có vòng lượn, bể bơi, chòi lá; người trượt xuống té nước (pqRiders)
   - bờ hồ PQ_BANK..GY (pqBank): lan can đá trắng, bồn hoa giấy, đèn đường cổ (PQ_LAMPS); dừa phía trước (PQ_PALMS)
   - lối dạo lát đá GY..H (pqWalk)
   Sau đoạn ngắm hoàng hôn, kịch bản chuyển cảnh ({ cut: ['pqdinner', …] }) sang quán vintage nhìn ra biển – xem phần cuối file. */
const PQ_HZ = 148, PQ_LAKE = 166, PQ_BANK = 196, PQ_SUNX = 262, PQ_POOL = 336;
const PQ_CLOUDS = [[0, 22, 110, 15, 1.1, 0], [190, 40, 70, 10, 1.6, 1], [330, 18, 130, 18, .9, 2], [90, 62, 56, 8, 2, 3], [420, 50, 84, 11, 1.3, 4]];   // [lệch, y, rộng, cao, tốc độ, hạt]
const PQ_STREAK = [[0, 112, 90], [140, 120, 60], [260, 106, 110], [380, 126, 70]];   // [lệch, y, dài]
const PQ_LAMPS = [40, 170, 286, 410];
const PQ_PALMS = [[-6, 104, 1, 0], [138, 92, 1, 1], [306, 110, 1, 2], [476, 100, -1, 3]];   // [x, cao, hướng nghiêng, hạt]
/* tường đá vàng cát [vừa, tối, sáng, rất tối]; chóp [tối, vừa, sáng, viền] */
const PQ_WALL = ['#c99a62', '#a87a4c', '#ebba7a', '#7a5638'];
const PQ_BLUE = ['#2b4486', '#3f62b0', '#86a6e0', '#f2c14e'], PQ_PINK = ['#7e2a52', '#b4447a', '#ec8ab0', '#f2c14e'], PQ_SPIRE = ['#1f2848', '#34406e', '#6a78a8', '#f2c14e'];
const PQ_FAR = ['#3a3e5e', '#4a5070', '#7a7a96', '#9a8a7a'], PQ_STRAW = ['#6a4a26', '#a8824a', '#e0b878', '#4a3218'];
/* ngọn chóp có cờ [x, y ngọn, màu cờ] – khớp với các pqCone trong pqCastle */
const PQ_FLAGS = [[76, 16, '#ff6b8b'], [21, 44, '#ffd43b'], [29, 46, '#ff6b8b'], [109, 40, '#ffd43b'], [99, 84, '#ffffff'], [57, 96, '#ff6b8b'], [150, 106, '#ffd43b']];
/* cửa sổ lâu đài sáng đèn, nhấp nháy nhẹ [x, y] (khung trên ~16px bị thanh HUD che, đừng đặt chi tiết quan trọng ở đó) */
const PQ_GLOW = [[20, 108], [20, 132], [72, 38], [44, 128], [64, 146], [98, 132], [118, 150], [138, 150]];
/* làng châu Âu bên kia hồ [x, rộng, cao tường, cao mái, màu tường, màu mái] */
const PQ_HOUSES = [[150, 18, 9, 10, 0, 0], [166, 14, 8, 8, 1, 1], [178, 20, 10, 11, 2, 0], [196, 16, 8, 9, 0, 2], [210, 20, 11, 12, 1, 0], [232, 14, 7, 8, 2, 1],
  [284, 18, 9, 10, 0, 0], [300, 22, 10, 12, 1, 2], [320, 16, 8, 9, 2, 0], [334, 20, 10, 10, 0, 1], [352, 14, 8, 8, 1, 0], [364, 18, 9, 10, 2, 2]];
const PQ_HWALL = [['#dcc6a2', '#b8a07e'], ['#e4cdb0', '#c2a68a'], ['#cdb8a0', '#a89680']], PQ_HROOF = [['#3e4262', '#62668a'], ['#5a3e58', '#82648a'], ['#6a4440', '#946a5e']];
/* máng trượt hở: bezier từ sàn tháp xuống bể */
const PQ_TX = 444, PQ_TT = 114, PQ_YS = [[PQ_TX - 1, PQ_TT + 3], [402, 112], [428, 182], [352, 186]];

function pqSky(id) {
  ditherInto(id, W, ['#3c4a7a', '#4e5e96', '#6e7aa8', '#9a98b6', '#c6a6a8', '#e6b28c', '#f8cc88', '#ffe2a0'], 0, PQ_HZ);
  ditherDisc(id, W, PQ_SUNX, PQ_HZ - 8, 18, 64, '#fff0bc', '#ffd890');   // quầng sáng quanh mặt trời
  ditherInto(id, W, ['#ffe2a0', '#f0be8e', '#c79aa8', '#9690b2', '#7480aa'], PQ_LAKE, PQ_BANK);   // mặt hồ: trời soi ngược
  ditherInto(id, W, ['#7480aa', '#7480aa'], PQ_BANK, H);
}
const pqCv = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
  return [c, (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, h); }]; };
const pqBez = (P, t) => { const u = 1 - t; return [0, 1].map(i => u * u * u * P[0][i] + 3 * u * u * t * P[1][i] + 3 * u * t * t * P[2][i] + t * t * t * P[3][i]); };

/* ---- mây tích: vẽ sẵn từng đám, đỉnh xám tím, bụng hứng nắng cam ---- */
const pqCloudC = {};
function pqCloud(w, h, k) {
  if (pqCloudC[k]) return pqCloudC[k];
  const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'), n = Math.max(3, w / 15 | 0), rr = w / n * .9;
  const lumps = Array.from({ length: n }, (_, i) => [w * (i + .5) / n + (rnd(k * 9 + i) - .5) * 8, h * (.4 + rnd(k * 5 + i) * .6)]);
  for (let x = 0; x < w; x++) {
    let lh = 0; for (const [cx, hh] of lumps) { const d = (x - cx) / rr; if (Math.abs(d) < 1) lh = Math.max(lh, hh * Math.sqrt(1 - d * d)); }
    lh *= Math.min(1, (x + 1) / (w * .12), (w - x) / (w * .12)); const top = Math.round(h - lh); if (top >= h - 1) continue;
    for (let y = top; y < h; y++) { const f = (y - top) / (h - top), th = (BAYER[y & 3][x & 3] + .5) / 16;
      g.fillStyle = y === top ? '#a6a2c0' : y === h - 1 ? '#ffd29a' : f > .78 ? (th < .5 ? '#f3b48a' : '#e0907a') : f > .6 ? (th < (f - .6) / .18 ? '#c07a84' : '#6c6a94') : y < top + 2 ? '#848aae' : '#5e6492';
      g.fillRect(x, y, 1, 1); } }
  return pqCloudC[k] = c;
}

/* ---- khối hình cơ bản ---- */
function pqCone(R, cx, top, base, hw, pal, tip = true) {   // chóp nhọn cổ tích: thân hơi lõm, sáng phía phải (hướng mặt trời), vảy ngói chấm
  const [dk, md, lt, rim] = pal;
  for (let y = top; y < base; y++) { const w = Math.round(hw * ((y - top + 1) / (base - top)) ** 1.4), l = cx - w, n = w * 2 + 1;
    R(dk, l, y, n, 1); if (n > 2) R(md, l + Math.ceil(n * .3), y, Math.ceil(n * .46), 1); if (n > 4) R(lt, l + Math.ceil(n * .74), y, Math.max(1, Math.floor(n * .18)), 1);
    if (n > 6 && (y - top) % 4 === 3) for (let x = l + 1 + ((y >> 2) & 1); x < l + n - 1; x += 3) R(dk, x, y, 1, 1); }
  R(rim, cx - hw - 1, base - 1, hw * 2 + 3, 2);
  if (tip) { R(rim, cx, top - 4, 1, 4); R(rim, cx - 1, top - 2, 3, 1); }
}
function pqWin(R, x, y, lit) { R('#3a2438', x - 1, y + 1, 4, 6); R('#3a2438', x, y, 2, 1); if (lit) { R('#ffcf6e', x, y + 1, 2, 5); R('#fff0b8', x, y + 2, 1, 2); } else R('#5a4060', x, y + 2, 2, 4); }
function pqTower(R, x, top, base, w, k, pal = PQ_WALL) {   // thân tháp tròn: tối trái, sáng phải, gờ vàng, cửa sổ vòm
  for (let i = 0; i < w; i++) { const u = (i + .5) / w; R(u < .15 ? pal[3] : u < .4 ? pal[1] : u > .8 ? pal[2] : pal[0], x + i, top, 1, base - top); }
  R('#f2c14e', x - 1, top, w + 2, 1);
  if (w >= 8) for (let y = top + 6, j = 0; y < base - 8; y += 12, j++) pqWin(R, x + (w >> 1) - 1, y, rnd(k * 7 + j) > .35);
}
function pqBlob(R, cx, cy, r, cols) {   // bụi cây tròn, sáng phía trên phải
  cx = Math.round(cx); cy = Math.round(cy);
  for (let y = -r; y <= r; y++) { const w = Math.floor(Math.sqrt(r * r - y * y)); for (let x = -w; x <= w; x++) { const d = (x * .6 - y * .8) / r + (rnd(cx * 3.1 + x * 7.3 + y * 1.9) - .5) * .5;
    R(d > .45 ? cols[2] : d > -.3 ? cols[1] : cols[0], cx + x, cy + y, 1, 1); } }
}
function pqDome(R, cx, cy, r, c1, c2) { for (let y = -r; y <= 0; y++) { const w = Math.floor(Math.sqrt(r * r - y * y)); R(c1, cx - w, cy + y, w * 2 + 1, 1); R(c2, cx + Math.ceil(w * .4), cy + y, Math.ceil(w * .5), 1); } }

/* ---- nhà khung gỗ kiểu châu Âu (xa, ngược sáng) ---- */
function pqHouse(R, x, w, wh, rh, wp, rp, k) {
  const base = PQ_LAKE - 1, top = base - wh, [wl, ws] = PQ_HWALL[wp], [rd, rl] = PQ_HROOF[rp], T = '#5a4032';
  R(wl, x, top, w, wh); R(ws, x, top, 2, wh); R(T, x, top, w, 1); R(T, x, top + (wh >> 1), w, 1); R(T, x, base - 1, w, 1);
  for (let i = 0; i < w; i += 4) R(T, x + i, top, 1, wh);
  for (let i = 1; i < w - 2; i += 4) { const lit = rnd(k * 3.3 + i) > .4; R(lit ? '#ffd27a' : '#6a5050', x + i + 1, top + 2, 2, 2);
    if (rnd(k * 1.7 + i) > .5) { R(T, x + i, top + (wh >> 1) + 1, 1, 1); R(T, x + i + 1, top + (wh >> 1) + 2, 1, 1); R(T, x + i + 2, top + (wh >> 1) + 3, 1, 1); }
    else R(lit ? '#ffc35e' : '#6a5050', x + i + 1, top + (wh >> 1) + 2, 2, 2); }
  if (k % 3 !== 1) {   // đầu hồi nhọn quay ra hồ
    const cx = x + w / 2; for (let j = 0; j < rh; j++) { const hw = Math.round((w / 2 + 1) * (j + 1) / rh); R(rd, cx - hw, top - rh + j, hw * 2, 1); R(rl, cx + hw - 2, top - rh + j, 2, 1); }
    R('#e8c890', Math.round(cx) - 1, top - rh + Math.round(rh * .55), 2, 2);   // ô cửa sổ áp mái
  } else {   // mái dốc chạy dọc, có cửa sổ mái
    for (let j = 0; j < rh; j++) { const ins = Math.round((rh - j) * .7); R(rd, x - 1 + ins, top - rh + j, w + 2 - ins * 2, 1); R(rl, x + w - ins - 1, top - rh + j, 1, 1); }
    R(wl, x + (w >> 1) - 2, top - (rh >> 1) - 1, 4, 3); R(rd, x + (w >> 1) - 3, top - (rh >> 1) - 2, 6, 1); R('#ffd27a', x + (w >> 1) - 1, top - (rh >> 1), 2, 1);
  }
  if (k % 2) { R('#6a4a40', x + w - 5, top - rh + 1, 2, rh - 2); R('#8a6a5a', x + w - 5, top - rh + 1, 2, 1); }   // ống khói
}

/* ---- lâu đài cổ tích (vẽ sẵn trong pqFar) ---- */
function pqCastle(R) {
  const L = PQ_LAKE;
  // tháp sau lưng mái
  pqTower(R, 24, 74, 150, 10, 1); pqCone(R, 29, 50, 74, 7, PQ_BLUE);
  pqTower(R, 104, 70, 150, 10, 2); pqCone(R, 109, 44, 70, 7, PQ_BLUE);
  // tháp giữa: thân dưới, ban công lỗ châu mai, thân trên, chóp đá sẫm, bốn chóp nhỏ ở góc ban công
  pqTower(R, 64, 54, 100, 24, 3); R('#8a6a48', 61, 52, 30, 3); R('#b08a5a', 61, 52, 30, 1); for (let x = 61; x < 91; x += 4) R('#8a6a48', x, 49, 2, 3);
  pqTower(R, 68, 32, 52, 16, 4); pqWin(R, 72, 38, 1); pqWin(R, 79, 38, 0);
  pqCone(R, 76, 20, 32, 9, PQ_SPIRE); pqCone(R, 62, 40, 50, 2, PQ_SPIRE); pqCone(R, 90, 40, 50, 2, PQ_SPIRE);
  // mái đá xanh lớn: mặt trước hình thang, vảy ngói, sườn phải hứng nắng, nóc + mái hiên viền vàng
  for (let y = 72; y < 112; y++) { const f = (y - 72) / 40, l = Math.round(58 - f * 28), r = Math.round(96 + f * 28);
    R('#2c3a64', l, y, r - l, 1); R('#3b4c80', l + Math.round((r - l) * .3), y, Math.round((r - l) * .45), 1); R('#6476a8', r - 4, y, 4, 1); R('#1e284a', l, y, 2, 1);
    if (y % 4 === 3) for (let x = l + 2 + ((y >> 2) & 1); x < r - 2; x += 3) R('#26335a', x, y, 2, 1); }
  R('#f2c14e', 57, 71, 40, 1); R('#f2c14e', 29, 112, 96, 1);
  for (const dx of [44, 70, 100]) { R(PQ_WALL[2], dx, 96, 6, 7); R(PQ_WALL[1], dx, 96, 2, 7); for (let j = 0; j < 4; j++) R('#2c3a64', dx - 1 + j, 95 - j, 8 - j * 2, 1); R('#ffcf6e', dx + 2, 98, 2, 4); }   // cửa sổ mái
  // thân chính: tường đá có mạch, chân tường sẫm
  R(PQ_WALL[0], 34, 113, 88, L - 113); R(PQ_WALL[1], 34, 113, 3, L - 113); R(PQ_WALL[2], 118, 113, 4, L - 113);
  for (let y = 119; y < L - 4; y += 7) R('#b88a58', 37, y, 81, 1); R(PQ_WALL[3], 34, L - 4, 88, 4);
  for (let x = 40; x < 116; x += 9) { pqWin(R, x, 122, rnd(x * 1.3) > .3); pqWin(R, x, 140, rnd(x * 2.1) > .4); }
  R('#3a2438', 72, 150, 10, L - 150); R('#3a2438', 73, 148, 8, 2); R('#ffb85a', 74, 151, 6, L - 155); R('#ffe0a0', 75, 152, 2, 6);   // cổng vòm sáng đèn
  // tháp nhỏ trên góc mái
  pqTower(R, 30, 100, 116, 6, 5); pqCone(R, 33, 84, 100, 5, PQ_BLUE); pqTower(R, 119, 98, 116, 6, 6); pqCone(R, 122, 82, 98, 5, PQ_BLUE);
  // tháp lớn phía trước bên trái, tháp chóp xanh giữa, tháp chóp hồng
  pqTower(R, 10, 96, L, 22, 7); pqCone(R, 21, 48, 96, 14, PQ_BLUE);
  pqTower(R, 50, 122, L, 14, 8); pqCone(R, 57, 100, 122, 9, PQ_BLUE);
  pqTower(R, 92, 118, L, 14, 9); pqCone(R, 99, 88, 118, 10, PQ_PINK);
  // cánh nhà khung gỗ mái hồng
  R('#f0e0c0', 106, 142, 46, L - 142); R('#d8c4a0', 106, 142, 3, L - 142); const T = '#5a3a2a';
  for (const y of [142, 152, L - 2]) R(T, 106, y, 46, 1); for (let x = 106; x < 152; x += 6) R(T, x, 142, 1, L - 142);
  for (let x = 106; x < 148; x += 6) for (let i = 0; i < 5; i++) { R(T, x + 1 + i, 143 + i * 2, 1, 2); }
  for (let x = 108; x < 150; x += 12) { R('#3a2438', x + 2, 155, 4, 6); R('#ffcf6e', x + 3, 156, 2, 4); }
  for (let y = 118; y < 142; y++) { const w = Math.round(26 * (y - 117) / 24); R(PQ_PINK[0], 129 - w, y, w * 2 + 1, 1); R(PQ_PINK[1], 129 - Math.round(w * .5), y, Math.round(w * 1.1) + 1, 1); R(PQ_PINK[2], 129 + Math.round(w * .65), y, Math.max(1, Math.round(w * .25)), 1);
    R('#f2c14e', 129 - w - 1, y, 1, 1); R('#f2c14e', 129 + w + 1, y, 1, 1); }
  R('#f0e0c0', 125, 128, 8, 10); R(T, 125, 128, 8, 1); R(T, 128, 128, 1, 10); R('#ffcf6e', 126, 130, 2, 3); R('#ffcf6e', 130, 130, 2, 3); R('#f2c14e', 102, 141, 52, 1);
  pqTower(R, 146, 132, L, 8, 10); pqCone(R, 150, 110, 132, 7, PQ_PINK);
  // tháp tròn lỗ châu mai ngoài cùng bên trái
  pqTower(R, -2, 140, L, 18, 11); for (let x = -2; x < 16; x += 5) R(PQ_WALL[0], x, 136, 3, 4); R(PQ_WALL[3], -2, 140, 18, 1);
  // vườn cây nhiệt đới che chân lâu đài
  for (let i = 0; i < 26; i++) pqBlob(R, rnd(i * 4.7) * 168, L - 3 - rnd(i * 2.3) * 7, 3 + (rnd(i * 6.1) * 4 | 0), ['#2a4232', '#3e5e3a', '#6e8a48']);
}

/* ---- lớp xa tĩnh: rặng cây, nhà xa, núi đá, làng bên kia hồ, lâu đài ---- */
let pqFarC = null;
function pqFar() {
  if (pqFarC) return pqFarC;
  const [c, R] = pqCv();
  for (let x = 0; x < W; x++) { const t = PQ_HZ - 2 - Math.round(Math.abs(Math.sin(x * .21)) * 3 + rnd(Math.floor(x / 5) * 2.9) * 4); R('#4a4e60', x, t, 1, PQ_LAKE - t); R('#806c72', x, t, 1, 1); }   // rặng cây chân trời
  // toà nhà mái ngọc ba vòm + lâu đài nhỏ phía phải (mờ trong nắng chiều)
  R('#7aa2a2', 380, PQ_HZ - 12, 92, 14); R('#4f7a84', 380, PQ_HZ - 13, 92, 2); for (let x = 383; x < 470; x += 5) R(rnd(x) > .5 ? '#ffe0a0' : '#4f6a70', x, PQ_HZ - 8, 2, 2);
  for (const dx of [392, 426, 458]) pqDome(R, dx, PQ_HZ - 14, 6, '#4f8088', '#7ab0b0');
  for (const [tx, tt, w] of [[404, PQ_HZ - 26, 6], [414, PQ_HZ - 34, 7], [425, PQ_HZ - 24, 6]]) { pqTower(R, tx, tt, PQ_HZ + 2, w, tx, ['#9a90a8', '#7e7690', '#c0b0b8', '#6a6278']); pqCone(R, tx + (w >> 1), tt - 16, tt, (w >> 1) + 2, PQ_FAR); }
  // núi đá nhân tạo: sườn trái hứng nắng, bụi cây bám đá
  for (let x = 286; x < 352; x++) { const d = Math.abs(x - 316) / 34, top = Math.round(PQ_HZ - 34 * (1 - d) ** .9 - rnd(Math.floor(x / 3)) * 3 + 2);
    for (let y = top; y < PQ_HZ + 4; y++) { const n = rnd(x * 1.7 + y * 3.1); R(x < 316 ? (n > .7 ? '#c49a80' : '#a8806a') : (n > .7 ? '#8a6a62' : '#76585a'), x, y, 1, 1); } R('#e0b894', x, top, 1, 1); }
  for (let i = 0; i < 6; i++) pqBlob(R, 296 + rnd(i * 3.3) * 46, PQ_HZ - 16 + rnd(i * 5.9) * 14, 2, ['#3a4a3a', '#566a44', '#7e8a52']);
  // làng châu Âu, tháp chuông, chòi lá giữa hồ
  pqTower(R, 226, PQ_LAKE - 34, PQ_LAKE - 1, 7, 12, ['#d8c4a4', '#b8a080', '#efdcbc', '#8a7460']); pqCone(R, 229, PQ_LAKE - 50, PQ_LAKE - 34, 5, PQ_FAR); R('#ffd27a', 228, PQ_LAKE - 29, 2, 2);
  PQ_HOUSES.forEach(([x, w, wh, rh, wp, rp], k) => pqHouse(R, x, w, wh, rh, wp, rp, k));
  for (const hx of [250, 272]) { R('#4a3424', hx - 8, PQ_LAKE - 7, 1, 6); R('#4a3424', hx + 8, PQ_LAKE - 7, 1, 6); R('#6a5040', hx - 9, PQ_LAKE - 2, 19, 1); pqCone(R, hx, PQ_LAKE - 17, PQ_LAKE - 6, 11, PQ_STRAW, false); }
  for (let i = 0; i < 30; i++) { const x = 140 + rnd(i * 2.7) * 340; if (Math.abs(x - 261) < 22) continue; pqBlob(R, x, PQ_LAKE - 3 - rnd(i * 8.1) * 3, 2 + (rnd(i * 4.4) * 3 | 0), ['#2e4436', '#46603e', '#7a8a50']); }   // cây ven hồ
  R('#b8a088', 0, PQ_LAKE - 1, W, 1); R('#8a7468', 0, PQ_LAKE, W, 1);   // kè bên kia hồ
  pqCastle(R);
  return pqFarC = c;
}

/* ---- công viên nước (vẽ sẵn): bể bơi, chòi lá, tháp trượt, máng hở, ống xoắn ---- */
let pqParkC = null;
function pqPark() {
  if (pqParkC) return pqParkC;
  const [c, R] = pqCv();
  // bể bơi xanh, thành bể lát gạch trắng
  for (let y = 182; y < PQ_BANK; y++) R(y < 184 ? '#8fe0f0' : y % 3 ? '#2f9ec8' : '#46b4d8', PQ_POOL, y, W - PQ_POOL, 1);
  R('#f1f3f5', PQ_POOL, 180, W - PQ_POOL, 2); R('#c5ccd4', PQ_POOL, 182, W - PQ_POOL, 1); R('#f1f3f5', PQ_POOL, 180, 2, PQ_BANK - 180);
  // chòi lá chân đỏ cạnh bể
  for (const px of [312, 334]) R('#a8321f', px, 160, 2, PQ_BANK - 160);
  R('#c43a2a', 309, 176, 30, 2); for (let x = 310; x < 338; x += 3) R('#e8a060', x, 171, 1, 5); R('#e8a060', 309, 170, 30, 1);
  pqCone(R, 324, 140, 161, 16, PQ_STRAW, false); for (let x = 309; x < 340; x += 2) R('#4a3218', x, 161, 1, 1 + (x % 3));
  // tháp trượt khung đỏ: cột, xà, giằng chéo, cầu thang, sàn, mái lá
  for (const px of [PQ_TX, PQ_TX + 8, PQ_TX + 16, PQ_TX + 23]) { R('#8a2a1a', px, PQ_TT, 2, PQ_BANK - PQ_TT); R('#d9482f', px + 1, PQ_TT, 1, PQ_BANK - PQ_TT); }
  for (let y = PQ_TT + 12; y < PQ_BANK - 4; y += 14) { R('#c43a2a', PQ_TX, y, 25, 2); for (let i = 0; i < 13; i++) { R('#8a2a1a', PQ_TX + 1 + Math.round(i * 22 / 12), y + 1 + i, 1, 1); } }
  for (let y = PQ_TT + 6; y < PQ_BANK - 6; y += 4) { const sx = PQ_TX + 2 + ((y >> 2) % 4) * 5; R('#f08c30', sx, y, 5, 1); }
  R('#c43a2a', PQ_TX - 3, PQ_TT - 1, 31, 3); R('#e8a060', PQ_TX - 3, PQ_TT - 6, 31, 1); for (let x = PQ_TX - 3; x < PQ_TX + 28; x += 4) R('#e8a060', x, PQ_TT - 6, 1, 5);
  for (const px of [PQ_TX - 2, PQ_TX + 25]) R('#8a2a1a', px, PQ_TT - 10, 2, 9);
  pqCone(R, PQ_TX + 12, PQ_TT - 28, PQ_TT - 8, 20, PQ_STRAW, false); for (let x = PQ_TX - 8; x < PQ_TX + 33; x += 2) R('#4a3218', x, PQ_TT - 8, 1, 1 + (x % 3));
  // ống trượt xoắn xanh lá sọc tím: đoạn thẳng từ tháp → vòng lượn → xuống bể
  const pts = [], [cx, cy, r] = [370, 140, 13];   // vòng lượn đặt bên trái máng vàng cho khỏi bị che
  for (let i = 0; i <= 50; i++) pts.push([PQ_TX - 1 + (cx - PQ_TX + 1) * i / 50, PQ_TT + 28 + (cy - r - PQ_TT - 28) * i / 50]);
  for (let i = 1; i <= 84; i++) { const a = -Math.PI / 2 - i / 84 * Math.PI * 3; pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  for (let i = 1; i <= 34; i++) pts.push([cx + 8 * i / 34, cy + r + (186 - cy - r) * i / 34]);
  for (let i = 0; i < pts.length; i++) { const [x, y] = pts[i], g = Math.floor(i / 5) % 2;   // ống tròn 7px: viền tối, thân, ánh sáng trên
    R(g ? '#4a2a7a' : '#2a6a2a', x - 3, y - 3, 7, 7); R(g ? '#8a46c4' : '#5ec24a', x - 2, y - 3, 5, 6); R(g ? '#c49af0' : '#b6f08a', x - 1, y - 3, 3, 1); }
  for (const [x, y] of [[cx - r, cy + 3], [cx + r - 1, cy + 3], [420, 136]]) R('#5a3a8a', x, y, 2, PQ_BANK - y);   // trụ đỡ ống
  // máng trượt hở vàng cam, trụ đỡ
  for (let t = 0; t <= 1; t += .2) { const [x, y] = pqBez(PQ_YS, t); if (t > 0 && t < 1) R('#9a3a2a', x, y + 3, 2, PQ_BANK - y - 3); }
  for (let t = 0; t <= 1; t += .003) { const [x, y] = pqBez(PQ_YS, t); R('#c2410c', x - 3, y + 1, 7, 2); R('#ff922b', x - 3, y - 1, 7, 2); R('#ffd43b', x - 2, y - 1, 5, 1); }
  return pqParkC = c;
}

/* ---- bờ hồ: kè, lan can đá trắng, bồn hoa giấy, đèn đường cổ (vẽ sẵn) ---- */
let pqBankC = null;
function pqBank() {
  if (pqBankC) return pqBankC;
  const [c, R] = pqCv();
  for (let y = PQ_BANK + 3; y < GY; y++) for (let x = 0; x < W; x++) R((BAYER[y & 3][x & 3] + .5) / 16 < .5 ? '#3a5634' : '#44623a', x, y, 1, 1);
  R('#efdcc0', 0, PQ_BANK, W, 1); R('#d2b896', 0, PQ_BANK + 1, W, 1); R('#a88a72', 0, PQ_BANK + 2, W, 1);
  for (let i = 0; i < 64; i++) pqBlob(R, rnd(i * 3.7) * W, PQ_BANK + 9 + rnd(i * 5.1) * 9, 3 + (rnd(i * 2.3) * 4 | 0), ['#2c4a30', '#4a7038', '#8aa858']);
  const FL = [['#c2255c', '#f06595'], ['#d6336c', '#faa2c1'], ['#e03131', '#ff8787'], ['#f59f00', '#ffd43b'], ['#f8f0e0', '#ffffff']];
  for (let i = 0; i < 150; i++) { const [a, b] = FL[i % 5 < 3 ? i % 3 : i % 5], x = rnd(i * 6.1) * W, y = PQ_BANK + 5 + rnd(i * 9.7) * 15; R(a, x, y, 2, 2); R(b, x, y, 1, 1); }   // hoa giấy, dâm bụt
  // lan can đá trắng bên hồ (công viên nước có thành bể riêng)
  const RW = 300; R('#fbf1e2', 0, PQ_BANK - 9, RW, 2); R('#cdb9a0', 0, PQ_BANK - 7, RW, 1);
  for (let x = 1; x < RW; x += 4) { R('#eadcc6', x, PQ_BANK - 6, 2, 6); R('#c4ad94', x + 1, PQ_BANK - 6, 1, 6); R('#fbf4e8', x, PQ_BANK - 4, 1, 2); }
  for (let x = 0; x < RW; x += 44) { R('#fbf1e2', x, PQ_BANK - 12, 5, 12); R('#cdb9a0', x + 4, PQ_BANK - 11, 1, 11); R('#fffaf0', x, PQ_BANK - 13, 5, 1); }
  // đèn đường cổ: chân, cột, cổ, lồng đèn
  for (const lx of PQ_LAMPS) { const D = '#2a2a3a', G = GY - 1;
    R(D, lx - 2, G - 4, 6, 4); R('#4a4a5e', lx - 2, G - 4, 6, 1); R(D, lx, G - 42, 2, 38); R('#5a5a70', lx + 1, G - 42, 1, 38);
    R(D, lx - 3, G - 44, 8, 2); R(D, lx - 2, G - 51, 6, 7); R('#ffe7a0', lx - 1, G - 50, 4, 5); R('#fffbe0', lx, G - 49, 1, 3); R(D, lx - 3, G - 53, 8, 2); R('#f2c14e', lx, G - 56, 2, 3); }
  return pqBankC = c;
}

/* ---- lối dạo lát đá (vẽ sẵn) ---- */
let pqWalkC = null;
function pqWalk() {
  if (pqWalkC) return pqWalkC;
  const [c, R] = pqCv(), rows = [GY, 225, 229, 234, 240, 247, 255, H];
  for (let b = 0; b < rows.length - 1; b++) { const ya = rows[b], yb = rows[b + 1];
    for (let y = ya; y < yb; y++) { const sp = (y - 196) * .5, off = (b % 2) * sp / 2;
      for (let x = 0; x < W; x++) { const u = (x - 240 - off) / sp, k = Math.floor(u), n = rnd(k * 5.3 + b * 17.9), th = (BAYER[y & 3][x & 3] + .5) / 16;
        R(y === ya ? '#c99c7e' : (u - k) * sp < 1 ? '#cfa486' : n > .8 ? '#f5d9ba' : n > .5 ? (th < .5 ? '#ecc9a6' : '#e6c19e') : n > .2 ? '#e9c6a3' : '#dfb896', x, y, 1, 1); } } }
  R('#f6e0c4', 0, GY, W, 1); R('#b8957a', 0, GY + 1, W, 1);
  for (let i = 0; i < 26; i++) { const x = rnd(i * 4.3) * W, y = GY + 4 + rnd(i * 7.9) * (H - GY - 6); R(i % 3 ? '#f06595' : '#faa2c1', x, y, 2, 1); R('#c2255c', x + 1, y, 1, 1); }   // cánh hoa giấy rụng
  return pqWalkC = c;
}

/* ---- phần động ---- */
function pqPalm(x, base, h, lean, k) {   // dừa: thân cong có ngấn, mép phải hứng nắng; tàu lá rủ có lá chét
  const sw = Math.sin(time * 1.1 + k) * 2, tx = i => x + Math.round(Math.sin(i / h * 1.3) * 12 * lean + sw * (i / h) ** 2);
  for (let i = 0; i < h; i++) { const xx = tx(i), w = i < 8 ? 6 : 5, ring = i % 5 === 0; fr(ring ? '#4a3428' : '#7a5a44', xx, base - i, w, 1); fr(ring ? '#6a4a34' : '#b08660', xx + w - 2, base - i, 2, 1); }
  const cx = tx(h) + 2, cy = base - h;
  for (let a = 0; a < 9; a++) { const ang = -Math.PI * 1.05 + a * Math.PI * 1.1 / 8 + Math.sin(time * 1.6 + a + k) * .05, len = 24 + (a % 3) * 5, col = a >= 6 ? '#6f8f46' : a <= 1 ? '#22402e' : '#2f5a38';
    for (let r = 2; r < len; r++) { const px = cx + Math.round(Math.cos(ang) * r), py = cy + Math.round(Math.sin(ang) * r * .55 + r * r / 60);
      fr(col, px, py, 2, 1); if (r % 3 === 0 && r > 4) { const lf = Math.round((1 - r / len) * 4) + 1; fr(col, px, py + 1, 1, lf); } } }
  fr('#3a2a1e', cx - 2, cy, 6, 4); fr('#5a4a2a', cx - 1, cy + 2, 2, 2); fr('#5a4a2a', cx + 2, cy + 3, 2, 2);
}
function pqSwan(x, y) {   // thuyền đạp vịt thiên nga trên hồ
  x = Math.round(x); y = Math.round(y + Math.sin(sceneT * 1.4) * .6);
  fr('#c8b0c0', x, y + 3, 12, 1); fr('#f8f0ea', x, y, 11, 3); fr('#ffffff', x + 1, y, 6, 1); fr('#f8f0ea', x - 1, y - 2, 4, 2); fr('#e8d8dc', x + 9, y - 1, 2, 1);
  fr('#f8f0ea', x + 1, y - 7, 2, 5); fr('#f8f0ea', x, y - 8, 3, 2); fr('#ff922b', x - 1, y - 7, 1, 1); fr('#1b1b2f', x + 1, y - 8, 1, 1);
  fr('#ff8fa3', x + 5, y - 3, 3, 3); fr('#4dabf7', x + 8, y - 3, 2, 3);   // hai người ngồi đạp
}
function pqRiders() {   // người trượt máng vàng, té nước xuống bể
  for (let k = 0; k < 2; k++) { const t = (sceneT * .14 + k * .5) % 1, [ex, ey] = PQ_YS[3];
    if (t < .55) { const [x, y] = pqBez(PQ_YS, (t / .55) ** 1.6); fr('#f5c29a', x - 1, y - 5, 3, 2); fr(k ? '#ff6b6b' : '#4dabf7', x - 1, y - 3, 3, 2); }
    else if (t < .72) { const s = (t - .55) / .17; for (let i = 0; i < 7; i++) { const a = Math.PI * (.15 + i * .7 / 6); fr(i % 2 ? '#ffffff' : '#c5f6fa', ex - 4 + Math.cos(a) * s * 12, ey - Math.sin(a) * s * 14 + s * s * 12, 2, 2); } } }
}
function pqScene() {
  const sy = PQ_HZ - 18 + Math.min(14, sceneT * .45);   // mặt trời lặn dần sau rặng cây
  ctx.drawImage(sun(9, 24, '#fff8dc', '#ffe39a'), PQ_SUNX - 24, Math.round(sy) - 24);
  for (const [off, y, w, h, sp, k] of PQ_CLOUDS) ctx.drawImage(pqCloud(w, h, k), Math.round(loopX(sp, off, W + w + 80) - w), y);
  ctx.globalAlpha = .75; for (const [off, y, len] of PQ_STREAK) { const x = Math.round(loopX(.7, off, W + len + 80) - len); fr('#7a5a7c', x, y, len, 1); fr('#a06a7a', x + 8, y + 1, len - 16, 1); } ctx.globalAlpha = 1;
  for (let b = 0; b < 4; b++) bird(loopX(9 + b * 2, b * 130, W + 140) - 30, 62 + b * 9 + Math.sin(sceneT * 1.3 + b) * 3, '#3a3450', b);
  ctx.drawImage(pqFar(), 0, 0);
  for (const [x, y, col] of PQ_FLAGS) { const f = Math.floor(time * 5 + x) % 2; fr(col, x + 1, y, 4, 1); fr(col, x + 1, y + 1, f ? 5 : 3, 1); if (f) fr(col, x + 4, y - 1, 2, 1); }   // cờ đuôi nheo bay trên ngọn chóp
  for (let i = 0; i < PQ_GLOW.length; i++) glow(PQ_GLOW[i][0] + 1, PQ_GLOW[i][1] + 3, 3, '#ffd98a', .14 + Math.sin(time * 3 + i * 1.7) * .04);
  // mặt hồ: bóng làng + lâu đài lộn ngược, gợn sóng, vệt nắng, thuyền thiên nga
  ctx.save(); ctx.globalAlpha = .4; ctx.translate(0, PQ_LAKE * 2); ctx.scale(1, -1); ctx.drawImage(pqFar(), 0, PQ_LAKE - 26, W, 26, 0, PQ_LAKE - 26, W, 26); ctx.restore();
  waves(PQ_LAKE + 2, PQ_BANK - 6, ['#f6d2a0', '#a69ac0', '#ffe7b0'], 4, 51);
  for (let y = PQ_LAKE + 1; y < PQ_BANK - 4; y += 2) { const w = 6 + (y - PQ_LAKE) * .6; fr(y % 4 ? '#fff1c0' : '#ffd88a', PQ_SUNX - w / 2 + Math.round(Math.sin(time * 3 + y) * 2), y, w, 1); }
  sparkles(PQ_LAKE + 2, PQ_BANK - 6, 14, 41, '#fff3bf');
  pqSwan(150 + Math.sin(sceneT * .09) * 60, PQ_LAKE + 14);
  ctx.drawImage(pqPark(), 0, 0); pqRiders();
  ctx.drawImage(pqBank(), 0, 0, W, GY, 0, 0, W, GY);
  for (const lx of PQ_LAMPS) glow(lx + 1, GY - 48, 9, '#ffd98a', .16 + Math.sin(time * 7 + lx) * .02);
  for (const [x, h, lean, k] of PQ_PALMS) pqPalm(x, GY - 1, h, lean, k);
}
function pqGround() { ctx.drawImage(pqWalk(), 0, GY, W, H - GY, 0, GY, W, H - GY); }

/* ================== PHÚ QUỐC: QUÁN VINTAGE BUỔI TỐI, TRỜI MƯA NÊN NGỒI TRONG NHÀ (theme 'pqdinner') ==================
   Cảnh thứ hai của chương 8, nơi cầu hôn. Camera đứng yên, toạ độ màn hình:
   - ngoài trời (chỉ lộ qua MỘT cửa sổ vòm lớn PQR_WIN sau bàn chính, kính từ pqrWinTop(x) tới PQR_WY[1]): biển phía đông về đêm
     (không ráng chiều), mưa lất phất, mặt biển từ PQR_HZ, bãi cát ướt từ PQR_BEACH; ngoài bãi có dây đèn treo võng giữa các cột
     (PQR_POLES) soi bóng xuống cát ướt, dừa đen đung đưa nhẹ (pqrPalm); giọt nước chảy trên kính
   - trong quán (pqrFront, khoét lỗ ở ô kính), phong cách vintage: trần gỗ sẫm có dầm (khung trên ~16px bị HUD che), giấy dán tường
     hoa văn quả trám xanh rêu, nẹp treo tranh, rèm nhung đỏ đô buộc dây vàng, ốp gỗ chân tường PQR_WAIN..PQR_FLOOR,
     sàn gỗ + thảm Ba Tư dưới bàn chính (pqrFloor, phần dưới GY vẽ ở pqrGround)
     · tường trái: ảnh cũ ngả màu sepia, đồng hồ treo tường, kệ gỗ (radio cổ, sách, lọ hoa khô), máy hát gramophone trên tủ thấp
       (nốt nhạc bay lên từ loa kèn, vẽ ở pqrScene)
     · tường phải: tranh cổ động du lịch, tủ rượu sau quầy, quầy bar gỗ sẫm viền đồng, đèn bàn ngân hàng chụp xanh
     · đèn: bóng Edison dây tóc thả trần (PQR_LAMPS [x, y bóng]), đèn tường chụp hoa tulip hai bên cửa sổ (PQR_SCONCE)
   - bàn khách bên trái (PQR_GT, ghế PQR_GC = tâm người ngồi x + 6), bàn chính hai đứa giữa cảnh (PQR_T, ghế PQR_C);
     anh phục vụ đứng ở quầy (x ≈ 446)
   - props.pqrDish: món tôm hùm đã dọn ra đĩa; props.pqrDim: tắt đèn, chỉ còn vùng sáng quanh hai đứa (PQR_SPOT) + ánh nến;
     props.pqrConf: số giây còn rắc pháo giấy (thay cho pháo hoa vì đang ở trong nhà) */
const PQR_HZ = 84, PQR_BEACH = 130, PQR_WAIN = 164, PQR_FLOOR = 200, PQR_WY = [44, 148];
const PQR_WIN = [174, 148], PQR_SCONCE = [148, 348], PQR_LAMPS = [[111, 80], [248, 64], [404, 60]], PQR_SPOT = [200, GY - 20];
const PQR_POLES = [6, 92, 178, 264, 350, 436, 522];   // cột dây đèn ngoài bãi
const PQR_PALMS = [[196, 56, -1], [308, 48, .8]];   // [x, chiều cao, hướng nghiêng] – dừa ngoài cửa sổ
/* mép trên ô kính tại cột x: cửa sổ vòm thấp, đỉnh vòm ở giữa (PQR_WY[0]), hai mép thấp hơn 16px */
function pqrWinTop(x) { const [wx, ww] = PQR_WIN, u = (x - wx - ww / 2) / (ww / 2); return Math.round(PQR_WY[0] + 16 * (1 - Math.sqrt(Math.max(0, 1 - u * u)))); }
const PQR_T = [230, 36], PQR_C = [214, 282], PQR_GT = [118, 22], PQR_GC = 102;

function pqrSky(id) {   // trời đêm mưa lất phất + biển phía đông, chỉ lộ ra qua cửa kính
  ditherInto(id, W, ['#0e121c', '#141a28', '#1a2132', '#20283a', '#262f44'], 0, PQR_HZ);
  ditherInto(id, W, ['#1c2840', '#182238', '#141c30', '#111828'], PQR_HZ, PQR_BEACH);
  ditherInto(id, W, ['#141824', '#141824'], PQR_BEACH, H);
}

/* ---- đảo xa mờ trong mưa, bãi cát ướt (vẽ sẵn) ---- */
let pqrBackC = null;
function pqrBack() {
  if (pqrBackC) return pqrBackC;
  const [c, R] = pqCv();
  const isle = (x0, x1, h) => { for (let x = x0; x < x1; x++) { const u = (x - x0) / (x1 - x0), t = Math.round(PQR_HZ - h * Math.sin(u * Math.PI) ** .7 - rnd(Math.floor(x / 4) * 1.3) * 2);
    R('#181e2c', x, t, 1, PQR_HZ - t + 1); R('#222a3c', x, t, 1, 1); } };
  isle(140, 230, 7); isle(380, 470, 5);
  for (let y = PQR_BEACH; y < PQR_WY[1] + 4; y++) for (let x = 0; x < W; x++) R((BAYER[y & 3][x & 3] + .5) / 16 < (y - PQR_BEACH) / 18 ? '#2e2a32' : '#24242e', x, y, 1, 1);
  return pqrBackC = c;
}

/* ---- sàn gỗ bóng trong nhà: ván ngang, mạch nối dọc theo phối cảnh (vẽ sẵn, PQR_FLOOR..H) ---- */
let pqrFloorC = null;
function pqrFloor() {
  if (pqrFloorC) return pqrFloorC;
  const [c, R] = pqCv(), rows = [PQR_FLOOR, 203, 207, 211, 216, GY, 227, 233, 240, 248, 257, H];
  for (let b = 0; b < rows.length - 1; b++) { const ya = rows[b], yb = rows[b + 1], base = b % 2 ? '#7a4c2c' : '#6e4426';
    for (let y = ya; y < yb; y++) { const sp = (y - 150) * .9, off = (b * 37) % 23;
      for (let x = 0; x < W; x++) { const u = (x - 240 + off) / sp, k = Math.floor(u), n = rnd(k * 3.1 + b * 11.7 + Math.floor(x / 3) * .01), th = (BAYER[y & 3][x & 3] + .5) / 16;
        R(y === ya ? '#3e2414' : (u - k) * sp < 1 ? '#4a2c18' : n > .85 ? '#8a5a36' : rnd(x * .7 + y * 13.1) > .93 ? '#5e3a20' : th < .25 ? '#82522f' : base, x, y, 1, 1); } } }
  // thảm Ba Tư dưới bàn chính (hình thang theo phối cảnh): viền vàng, viền xanh than, nền đỏ đô, hoa văn quả trám giữa, tua hai đầu
  const RY0 = 205, RY1 = 238, MX = 248, MY = 221;
  for (let y = RY0; y < RY1; y++) { const t = (y - RY0) / (RY1 - RY0), xl = Math.round(180 - t * 12), xr = Math.round(316 + t * 12);
    for (let x = xl; x < xr; x++) { const dx = Math.min(x - xl, xr - 1 - x), dy = Math.min(y - RY0, RY1 - 1 - y), m = Math.abs(x - MX) / 46 + Math.abs(y - MY) / 11;
      R(dx < 2 || dy < 1 ? '#b08a3a' : dx < 6 || dy < 3 ? ((x + y) % 4 ? '#24305a' : '#c9a227') : m < .55 ? ((x + y) % 3 ? '#24305a' : '#e8d8b0') : m < .68 ? '#c9a227' : m < 1 ? '#5a1418' : (x % 8 === 0 && y % 4 === 1) ? '#e8d8b0' : '#7a1e22', x, y, 1, 1); }
    if (y % 2 === 0) { R('#e8d8b0', xl - 2, y, 2, 1); R('#e8d8b0', xr, y, 2, 1); } }
  for (let i = 0; i < 30; i++) { const x = rnd(i * 5.3) * W, y = GY + 3 + rnd(i * 8.9) * (H - GY - 6); R(i % 3 ? '#c92a2a' : '#f06595', x, y, 2, 1); R('#8a1c2a', x + 1, y, 1, 1); }   // cánh hồng rơi trên sàn
  return pqrFloorC = c;
}

/* ---- dừa ngoài cửa kính: in bóng đen, thân và tàu lá ngả theo gió (sw) ---- */
function pqrPalm(x, base, h, lean, sw) {
  const tx = i => x + Math.round(Math.sin(i / h * 1.3) * 10 * lean + sw * 4 * (i / h) ** 2);
  for (let i = 0; i < h; i++) fr(i % 5 ? '#0c1018' : '#141a26', tx(i), base - i, i < 8 ? 5 : 4, 1);
  const cx = tx(h) + 2, cy = base - h;
  for (let a = 0; a < 9; a++) { const ang = -Math.PI * 1.05 + a * Math.PI * 1.1 / 8 + sw * .25 + Math.sin(time * 7 + a) * .04, len = 22 + (a % 3) * 5;
    for (let r = 2; r < len; r++) { const px = cx + Math.round(Math.cos(ang) * r), py = cy + Math.round(Math.sin(ang) * r * .55 + r * r / 60);
      fr('#0a0e16', px, py, 2, 1); if (r % 3 === 0 && r > 4) fr('#0a0e16', px, py + 1, 1, Math.round((1 - r / len) * 4) + 1); } }
}

/* ---- trong quán vintage (vẽ sẵn, ô kính để trống) ---- */
const PQR_GRAM = [44, GY - 60];   // miệng loa kèn máy hát – nốt nhạc bay lên từ đây
const pqrDisc = (R, cx, cy, r, col) => { for (let y = -r; y <= r; y++) { const w = Math.floor(Math.sqrt(r * r - y * y)); R(col, cx - w, cy + y, w * 2 + 1, 1); } };
function pqrFrame(R, x, y, w, h, frame, hi) { R(OUT, x - 1, y - 1, w + 2, h + 2); R(frame, x, y, w, h); R(hi, x, y, w, 1); R(hi, x, y, 1, h); R('#2a1a0c', x + 2, y + 2, w - 4, h - 4); }
let pqrFrontC = null;
function pqrFront() {
  if (pqrFrontC) return pqrFrontC;
  const [c, R] = pqCv(), g = c.getContext('2d'), [wy0, wy1] = PQR_WY, [wx, ww] = PQR_WIN, WR = wx + ww;
  // trần gỗ sẫm có dầm, phào chỉ
  for (let y = 16; y < 30; y++) R(y % 4 === 3 ? '#1e1208' : '#2e1c0e', 0, y, W, 1);
  for (let x = 30; x < W; x += 70) { R('#1a0e06', x, 16, 10, 14); R('#3e2614', x + 1, 16, 2, 14); }
  R('#5a3a20', 0, 30, W, 3); R('#8a5a32', 0, 30, W, 1); R('#2a180c', 0, 33, W, 1);
  // giấy dán tường hoa văn quả trám: nền xanh rêu sẫm, nét hoa văn sáng hơn, nhuỵ vàng đồng; sáng dần xuống dưới
  for (let y = 34; y < PQR_WAIN; y++) for (let x = 0; x < W; x++) { const lx = x % 12, ly = (y - 34) % 14, d = Math.abs(lx - 6) * 7 + Math.abs(ly - 7) * 6, th = (BAYER[y & 3][x & 3] + .5) / 16;
    R((lx === 5 || lx === 6) && (ly === 6 || ly === 7) ? '#8a7442' : d >= 36 && d < 44 ? '#3c5a46' : th < (y - 34) / 160 + .3 ? '#2c4636' : '#263c2e', x, y, 1, 1); }
  R('#3a2414', 0, 40, W, 2); R('#8a5a32', 0, 40, W, 1);   // nẹp treo tranh
  // ốp gỗ chân tường: nẹp trên, các ô pa-nô nổi, len chân tường
  R('#4a2c16', 0, PQR_WAIN, W, PQR_FLOOR - PQR_WAIN); R('#a8703e', 0, PQR_WAIN, W, 1); R('#7a4e2a', 0, PQR_WAIN + 1, W, 2); R('#2a180c', 0, PQR_WAIN + 3, W, 1);
  for (let x = 6; x < W; x += 40) { R('#3a2210', x, PQR_WAIN + 8, 32, 22); R('#5a3a20', x + 1, PQR_WAIN + 9, 30, 20); R('#6a4628', x + 1, PQR_WAIN + 9, 30, 1); R('#3a2210', x + 4, PQR_WAIN + 12, 24, 14); R('#52341c', x + 5, PQR_WAIN + 13, 22, 12); }
  R('#2a180c', 0, PQR_FLOOR - 3, W, 3);
  g.drawImage(pqrFloor(), 0, PQR_FLOOR, W, GY - PQR_FLOOR, 0, PQR_FLOOR, W, GY - PQR_FLOOR);

  // ---- cửa sổ vòm duy nhất: khoét kính, kính ám xanh + vệt phản chiếu, khung vòm dày, song chia ô, bậu cửa
  for (let x = wx; x < WR; x++) { const t = pqrWinTop(x); g.clearRect(x, t, 1, wy1 - t); R('rgba(150,175,215,.08)', x, t, 1, wy1 - t); }
  for (let i = 0; i < 34; i++) { R('rgba(255,255,255,.06)', wx + 14 + i, wy0 + 60 - i, 2, 1); R('rgba(255,255,255,.04)', wx + 96 + i, wy0 + 90 - i, 3, 1); }
  for (let x = wx - 6; x < WR + 6; x++) { const t = pqrWinTop(Math.min(WR - 1, Math.max(wx, x))); R('#3a2210', x, t - 6, 1, 6); R('#7a4e2a', x, t - 6, 1, 1); R('#5a3a20', x, t - 2, 1, 1); }
  R('#3a2210', wx - 6, pqrWinTop(wx), 6, wy1 - pqrWinTop(wx)); R('#7a4e2a', wx - 6, pqrWinTop(wx), 1, wy1 - pqrWinTop(wx));
  R('#3a2210', WR, pqrWinTop(WR - 1), 6, wy1 - pqrWinTop(WR - 1));
  for (const f of [.25, .5, .75]) { const mx = Math.round(wx + ww * f) - 1, t = pqrWinTop(mx); R('#3a2210', mx, t, 3, wy1 - t); R('#6a4628', mx, t, 1, wy1 - t); }
  R('#3a2210', wx, wy0 + 40, ww, 3); R('#6a4628', wx, wy0 + 40, ww, 1);
  for (let x = wx; x < WR; x++) { const t = pqrWinTop(x); if (t < wy0 + 40) R('#3a2210', x, t + Math.round((wy0 + 40 - t) * .5), 1, 1); }   // đố cong trong lòng vòm
  R('#4a2c16', wx - 10, wy1, ww + 20, 6); R('#a8703e', wx - 10, wy1, ww + 20, 1); R('#2a180c', wx - 9, wy1 + 6, ww + 18, 1);
  // rèm nhung đỏ đô hai bên, dây buộc vàng, thanh treo đồng có núm
  for (const [cx, dir] of [[wx - 22, 1], [WR + 6, -1]]) for (let y = wy0 - 10; y < PQR_WAIN + 6; y++) {
    const tie = wy0 + 76, pinch = y < tie ? Math.round((y - wy0 + 10) / (tie - wy0 + 10) * 6) : Math.max(0, 6 - Math.round((y - tie) * .7)), w0 = 16 - pinch, x0 = dir > 0 ? cx : cx + 16 - w0;
    for (let i = 0; i < w0; i++) R(i % 4 === 0 ? '#3e0c16' : i % 4 === 1 ? '#6a1626' : i % 4 === 2 ? '#8a2032' : '#6a1626', x0 + i, y, 1, 1);
    if (Math.abs(y - tie) < 2) { R('#e0b050', x0, y, w0, 1); if (y === tie) R('#e0b050', dir > 0 ? x0 + w0 : x0 - 2, y, 2, 4); } }
  R('#8a6a1a', wx - 26, wy0 - 12, ww + 52, 2); R('#e0b050', wx - 26, wy0 - 12, ww + 52, 1); pqrDisc(R, wx - 27, wy0 - 11, 2, '#c9a227'); pqrDisc(R, WR + 26, wy0 - 11, 2, '#c9a227');
  // đèn tường chụp hoa tulip hai bên cửa sổ
  for (const sx of PQR_SCONCE) { R('#8a6a1a', sx - 3, 104, 7, 3); R('#c9a227', sx, 94, 2, 10); R('#c9a227', sx - 2, 94, 6, 1);
    for (let j = 0; j < 8; j++) { const w = 3 + Math.round(j * .7); R(j < 3 ? '#fff0c0' : '#e8b860', sx + 1 - w, 85 + j, w * 2, 1); } R('#c08a3a', sx - 5, 92, 12, 1); }

  // ---- tường trái: ảnh cũ sepia, đồng hồ, kệ gỗ (radio, sách, lọ hoa khô), máy hát trên tủ thấp
  pqrFrame(R, 14, 52, 30, 22, '#a8863a', '#e0c070'); R('#c8a878', 17, 55, 24, 16); R('#b09068', 17, 66, 24, 5);
  pqrDisc(R, 25, 62, 3, '#6a4a2a'); R('#6a4a2a', 22, 65, 7, 6); pqrDisc(R, 33, 62, 3, '#6a4a2a'); R('#6a4a2a', 30, 65, 7, 6); R('#f1e3c8', 28, 67, 2, 4);   // ảnh cưới xưa của ông bà
  pqrFrame(R, 54, 48, 18, 26, '#3a2414', '#6a4628'); R('#d8c098', 57, 51, 12, 20); pqrDisc(R, 63, 58, 3, '#7a5a3a'); R('#7a5a3a', 59, 62, 8, 9);   // chân dung
  pqrFrame(R, 116, 50, 22, 16, '#a8863a', '#e0c070'); R('#c8a878', 119, 53, 16, 10); for (let i = 0; i < 16; i++) R('#8a6a48', 119 + i, 63 - Math.round(Math.abs(Math.sin(i * .4)) * 6), 1, Math.round(Math.abs(Math.sin(i * .4)) * 6)); // phong cảnh núi
  pqrDisc(R, 92, 66, 10, '#8a6a1a'); pqrDisc(R, 92, 66, 9, '#c9a227'); pqrDisc(R, 92, 66, 7, '#f1e3c8');   // đồng hồ treo tường: viền đồng, mặt ngà, 7 giờ 30
  for (const [dx, dy] of [[0, -6], [6, 0], [0, 6], [-6, 0]]) R('#3a2414', 92 + dx, 66 + dy, 1, 1);
  line(92, 66, 89, 70, (x, y) => R('#1b1b1f', x, y, 1, 1)); line(92, 66, 92, 72, (x, y) => R('#1b1b1f', x, y, 1, 1)); R('#c92a2a', 91, 65, 2, 2);
  R('#5a3a20', 18, 104, 118, 3); R('#8a5a32', 18, 104, 118, 1); for (const bx of [26, 124]) { R('#3a2414', bx, 107, 2, 6); R('#3a2414', bx - 2, 107, 2, 2); }   // kệ gỗ
  R(OUT, 23, 89, 24, 16); R('#7a4a22', 24, 90, 22, 14); R('#9a6232', 24, 90, 22, 1); R('#c9a878', 26, 92, 11, 10); for (let x = 27; x < 37; x += 2) R('#a8865a', x, 92, 1, 10);   // radio cổ
  pqrDisc(R, 41, 95, 2, '#f1e3c8'); R('#c92a2a', 41, 94, 1, 2); pqrDisc(R, 40, 100, 1, '#3a2414'); pqrDisc(R, 43, 100, 1, '#3a2414');
  [[56, 12, '#7a1e22'], [59, 10, '#2a4460'], [62, 11, '#3a5a2a'], [65, 9, '#8a6a2a'], [68, 12, '#5a2a4a']].forEach(([x, h, col]) => { R(OUT, x - 1, 104 - h - 1, 4, h + 1); R(col, x, 104 - h, 2, h); R('#c9a227', x, 104 - h + 2, 2, 1); });   // sách
  R(OUT, 101, 95, 8, 9); R('#c8d8d0', 102, 96, 6, 8); R('#e8f0ec', 102, 96, 1, 6); for (const [dx, dy, col] of [[-2, -6, '#c89a5a'], [2, -9, '#e0b878'], [5, -5, '#b07a4a'], [0, -3, '#a8865a']]) { R('#7a6a3a', 104 + Math.sign(dx), 95 + Math.round(dy / 2), 1, -Math.round(dy / 2)); R(col, 104 + dx, 95 + dy, 2, 2); }   // lọ hoa khô
  // tủ thấp + máy hát gramophone loa kèn đồng
  R(OUT, 9, GY - 25, 40, 25); R('#3e2412', 10, GY - 24, 38, 24); R('#6a4424', 8, GY - 26, 42, 3); R('#9a6a3a', 8, GY - 26, 42, 1);
  for (const dy of [-17, -9]) { R('#2a180c', 12, GY + dy, 34, 1); pqrDisc(R, 29, GY + dy + 4, 1, '#c9a227'); }
  R('#2a180c', 11, GY - 2, 3, 2); R('#2a180c', 44, GY - 2, 3, 2);
  R(OUT, 13, GY - 33, 26, 8); R('#6a3a1a', 14, GY - 32, 24, 6); R('#9a5a2a', 14, GY - 32, 24, 1); R('#c9a227', 14, GY - 28, 24, 1);
  R('#141418', 13, GY - 35, 26, 2); R('#2a2a30', 15, GY - 35, 22, 1); R('#c92a2a', 24, GY - 35, 4, 1);
  line(36, GY - 38, 30, GY - 35, (x, y) => R('#c9a227', x, y, 1, 1)); R('#8a6a1a', 35, GY - 39, 3, 2);
  for (let t = 0; t <= 1; t += .02) { const cx = Math.round(20 + t * 24), cy = Math.round(GY - 36 - t * 24), r = Math.round(1 + t ** 2.4 * 10); pqrDisc(R, cx, cy, r, '#a8862a'); if (r > 2) pqrDisc(R, cx + 1, cy - 1, r - 2, '#d8b450'); }
  pqrDisc(R, PQR_GRAM[0], PQR_GRAM[1], 8, '#5a4410'); pqrDisc(R, PQR_GRAM[0] + 1, PQR_GRAM[1] + 1, 5, '#2a1e08'); R('#f0d878', PQR_GRAM[0] - 6, PQR_GRAM[1] - 9, 8, 1);

  // ---- tường phải: tranh cổ động du lịch, tủ rượu sau quầy, quầy bar gỗ sẫm viền đồng, đèn bàn ngân hàng
  pqrFrame(R, 358, 56, 34, 46, '#2a180c', '#5a3a20'); R('#e8d4a8', 360, 58, 30, 42); pqrDisc(R, 375, 72, 6, '#e8590c'); R('#e8d4a8', 360, 79, 30, 2);
  for (let y = 80; y < 92; y++) R(y % 3 ? '#2a6a9a' : '#4a8aba', 360, y, 30, 1); R('#3a2a1e', 370, 86, 12, 2); R('#3a2a1e', 375, 74, 1, 12); for (let j = 0; j < 9; j++) R('#ffffff', 376, 76 + j, Math.ceil(j * .6), 1);
  R('#7a1e22', 364, 94, 22, 2); R('#7a1e22', 368, 97, 14, 1);
  const BB = 400; R('#1e1208', BB, 74, W - BB, PQR_WAIN - 74); R('#5a3a20', BB - 2, 72, W - BB + 2, 3); R('#8a5a32', BB - 2, 72, W - BB + 2, 1);   // tủ rượu: khung, gương mờ, hai đợt kệ
  R('#2e2a30', BB + 3, 78, W - BB - 6, PQR_WAIN - 82);
  for (const sy of [104, 130, 156]) { R('#6a4424', BB + 2, sy, W - BB - 4, 2); R('#9a6a3a', BB + 2, sy, W - BB - 4, 1); }
  const BOT = ['#2b8a3e', '#a61e1e', '#c2410c', '#e9ecef', '#5a2a4a', '#8a6a2a', '#1c4a6a'];
  for (const sy of [104, 130]) for (let i = 0; i < 10; i++) { const x = BB + 6 + i * 7, h = 9 + Math.floor(rnd(sy + i * 3.1) * 6), col = BOT[Math.floor(rnd(sy * 2 + i) * BOT.length)];
    R(OUT, x - 1, sy - h - 1, 5, h + 1); R(col, x, sy - h, 3, h); R('rgba(255,255,255,.35)', x, sy - h + 2, 1, h - 4); R(OUT, x, sy - h - 4, 3, 3); R(col, x + 1, sy - h - 4, 1, 3); R('#f1e3c8', x, sy - Math.round(h / 2), 3, 2); }
  const BX = 418, BT = GY - 38;
  R(OUT, BX - 3, BT - 1, W - BX + 3, 1); R('#2e1c0e', BX - 2, BT, W - BX + 2, 4); R('#5a3a20', BX - 2, BT, W - BX + 2, 1); R('#c9a227', BX - 2, BT + 3, W - BX + 2, 1);
  R('#3a2210', BX, BT + 4, W - BX, GY - BT - 4);
  for (let x = BX + 3; x < W - 4; x += 20) { R('#2a180c', x, BT + 8, 16, 22); R('#4a2c16', x + 1, BT + 9, 14, 20); R('#5a3a20', x + 1, BT + 9, 14, 1); }
  R('#c9a227', BX, GY - 7, W - BX, 1); R('#8a6a1a', BX, GY - 6, W - BX, 1); for (let x = BX + 8; x < W; x += 22) R('#8a6a1a', x, GY - 6, 1, 6);   // thanh gác chân bằng đồng
  for (const x of [424, 430]) { R('#dee2e6', x, BT - 6, 4, 1); R('#a61e3a', x, BT - 5, 4, 2); R('#dee2e6', x + 1, BT - 3, 2, 1); R('#dee2e6', x + 2, BT - 2, 1, 2); }
  R('#8a6a1a', 454, BT - 1, 10, 1); R('#c9a227', 458, BT - 9, 2, 8);   // đèn bàn ngân hàng: chân đồng, chụp thuỷ tinh xanh lá
  for (let j = 0; j < 5; j++) { R('#1e5a32', 451 - j, BT - 14 + j, 16 + j * 2, 1); R('#4a9a5a', 452 - j, BT - 14 + j, 4, 1); } R('#fff0b0', 448, BT - 9, 22, 1);
  return pqrFrontC = c;
}

/* ---- đồ đạc vẽ mỗi khung (nến lung linh) ---- */
function pqrCandle(x, ty, k) {   // ty = mặt bàn
  R0('#c9a227', x - 1, ty - 1, 4, 1); R0('#fff3d6', x, ty - 7, 2, 6); R0('#e9dcc0', x + 1, ty - 7, 1, 6);
  const f = Math.floor(time * 8 + k * 3) % 3; R0('#ff922b', x, ty - 9, 2, 2); R0('#ffd43b', x + (f === 1 ? 1 : 0), ty - 10 - (f === 2 ? 1 : 0), 1, 2);
  glow(x + 1, ty - 9, 8, '#ffd98a', .16 + Math.sin(time * 9 + k) * .04);
}
const R0 = (col, x, y, w, h) => fr(col, Math.round(x - cam), y, w, h);
function pqrChair(cx) {   // ghế gỗ uốn kiểu cổ: tựa lưng đan mây giữa hai cột gỗ sẫm, đệm nhung đỏ đô, chân trước
  const dk = '#2e1c0e', md = '#6a4424', lt = '#c8a068';
  R0(dk, cx - 12, GY - 28, 2, 28); R0(dk, cx + 10, GY - 28, 2, 28); R0(md, cx - 12, GY - 30, 24, 3); R0(lt, cx - 11, GY - 30, 22, 1);
  for (let y = GY - 27; y < GY - 11; y++) for (let x = cx - 10; x < cx + 10; x++) R0((x + y) % 3 ? md : (x - y) % 3 ? lt : dk, x, y, 1, 1);
  R0('#8a2032', cx - 12, GY - 11, 24, 2); R0('#5a1420', cx - 12, GY - 9, 24, 1); R0(md, cx - 12, GY - 8, 24, 2);
  R0(dk, cx - 11, GY - 6, 2, 6); R0(dk, cx + 9, GY - 6, 2, 6);
}
function pqrTable(x0, w) {   // bàn trải khăn trắng, mặt bàn ở GY - 16
  const ty = GY - 16;
  R0('#2e2018', x0 + (w >> 1) - 6, GY - 2, 12, 2);
  R0('#fffaf0', x0 - 1, ty, w + 2, 1); R0('#ece3d4', x0 - 1, ty + 1, w + 2, 2);
  for (let y = ty + 3; y < GY - 3; y++) { R0('#f4ede2', x0, y, w, 1); R0('#ffffff', x0, y, 1, 1); R0('#d2c6b2', x0 + w - 3, y, 3, 1); for (let c = 5; c < w - 4; c += 7) R0('#ddd2c0', x0 + c + ((y >> 2) & 1), y, 1, 1); }
  for (let c = 0; c < w; c++) R0(c % 4 < 2 ? '#ddd2c0' : '#f4ede2', x0 + c, GY - 3, 1, 1);
  return ty;
}
function pqrPlate(x, ty, food) {
  R0('#aeb4c0', x, ty, 9, 1); R0('#ffffff', x + 1, ty - 1, 7, 1);
  if (food) { R0('#e8590c', x + 2, ty - 2, 5, 1); R0('#ff922b', x + 2, ty - 3, 4, 1); R0('#fff3bf', x + 3, ty - 3, 1, 1); R0('#c2410c', x + 6, ty - 3, 1, 1); R0('#51cf66', x + 1, ty - 2, 1, 1); }   // tôm hùm nướng bổ đôi
}
function pqrGlass(x, ty, col) { R0('#e9ecef', x - 1, ty - 8, 4, 1); R0(col, x - 1, ty - 7, 4, 2); R0('#ffffff', x - 1, ty - 7, 1, 1); R0('#ced4da', x, ty - 5, 2, 1); R0('#dee2e6', x, ty - 4, 1, 3); R0('#dee2e6', x - 1, ty - 1, 3, 1); }
function pqrFurniture() {
  pqrChair(PQR_GC); pqrChair(PQR_C[0]); pqrChair(PQR_C[1]);
  // bàn khách: ly nước cam, đĩa, một ngọn nến
  const [gx, gw] = PQR_GT, gty = pqrTable(gx, gw); pqrGlass(gx + 3, gty, '#ffa94d'); pqrPlate(gx + 12, gty, false); pqrCandle(gx + 8, gty, 3);
  // bàn chính: hai đĩa, hai ly vang, hai cây nến, bình hoa hồng ở giữa
  const [tx, tw] = PQR_T, ty = pqrTable(tx, tw);
  pqrPlate(tx + 1, ty, props.pqrDish); pqrPlate(tx + tw - 10, ty, props.pqrDish);
  pqrGlass(tx + 12, ty, '#a61e3a'); pqrGlass(tx + tw - 13, ty, '#a61e3a');
  R0('#a5d8ff', tx + 17, ty - 4, 3, 4); R0('#e7f5ff', tx + 17, ty - 4, 1, 3); R0('#2f9e44', tx + 18, ty - 10, 1, 6); R0('#40c057', tx + 19, ty - 8, 1, 1);
  R0('#a61e1e', tx + 17, ty - 13, 3, 3); R0('#ff6b6b', tx + 17, ty - 13, 2, 1); R0('#e03131', tx + 18, ty - 12, 1, 1);
  pqrCandle(tx + 14, ty, 0); pqrCandle(tx + 21, ty, 1);
}

/* ---- phần động ---- */
function pqrScene() {
  const [wy0, wy1] = PQR_WY;
  ctx.drawImage(pqrBack(), 0, 0);
  // biển đêm lặng, gợn sóng nhỏ, bọt sóng vỗ bờ
  waves(PQR_HZ + 2, PQR_BEACH - 2, ['#2a3650', '#34405c', '#1e2840'], 3, 77);
  for (let i = 0; i < 14; i++) { const x = Math.round(((rnd(i * 2.1) * W + sceneT * 5 * (i % 2 ? 1 : -1)) % W + W) % W); fr('#7a88a8', x, PQR_BEACH - 1 + (i % 2), 6 + (i % 4) * 2, 1); }
  for (const [x, h, lean] of PQR_PALMS) pqrPalm(x, wy1 + 4, h, lean, Math.sin(time * .9 + x) * .25);
  // dây đèn treo võng giữa các cột ngoài bãi, bóng đèn soi xuống cát ướt
  for (let p = 0; p < PQR_POLES.length; p++) { const px = PQR_POLES[p]; fr('#0c0e16', px, 98, 2, wy1 - 98 + 4); fr('#1a1e2a', px - 1, 97, 4, 1);
    if (p === PQR_POLES.length - 1) break; const nx = PQR_POLES[p + 1];
    for (let x = px + 1; x < nx; x++) { const u = (x - px) / (nx - px), y = Math.round(99 + Math.sin(u * Math.PI) * 9); fr('#0c0e16', x, y, 1, 1);
      if ((x - px) % 9 === 4) { const on = .5 + .5 * Math.sin(time * 1.5 + x * .7); fr(on > .25 ? '#ffe0a0' : '#e8b860', x, y + 1, 2, 2); glow(x + 1, y + 2, 4, '#ffd98a', .18 + on * .06);
        ctx.globalAlpha = .28; fr('#ffd98a', x, PQR_BEACH + 3 + ((y + x) % 3), 2, 1); fr('#ffd98a', x, PQR_BEACH + 7 + (x % 3), 1, 2); ctx.globalAlpha = 1; } } }
  // mưa lất phất: hạt mảnh, thưa, hơi xiên
  ctx.globalAlpha = .35; for (let i = 0; i < 70; i++) { const x = Math.round(((rnd(i * 1.3) * (W + 20) - sceneT * 18) % (W + 20) + W + 20) % (W + 20)) - 10, y = wy0 + Math.round((rnd(i * 2.7) * 104 + sceneT * 170) % 104);
    fr('#9aa8c8', x, y, 1, 3); } ctx.globalAlpha = 1;
  ctx.drawImage(pqrFront(), 0, 0);
  // giọt nước chảy trên kính
  const [wx, ww] = PQR_WIN;
  for (let i = 0; i < 9; i++) { const dx = wx + 2 + Math.floor(rnd(i * 3.1) * (ww - 4)), t = pqrWinTop(dx), dy = t + Math.floor((sceneT * (6 + rnd(i) * 14) + rnd(i * 5.3) * 104) % (wy1 - t - 3));
    ctx.globalAlpha = .25; fr('#c8d4f0', dx, Math.max(t, dy - 7), 1, dy - Math.max(t, dy - 7)); ctx.globalAlpha = .7; fr('#c8d4f0', dx, dy, 1, 2); fr('#ffffff', dx, dy, 1, 1); }
  ctx.globalAlpha = .4; for (let i = 0; i < 14; i++) { const x = wx + Math.floor(rnd(37 + i) * ww), t = pqrWinTop(x); fr('#b8c4e0', x, t + Math.floor(rnd(53 + i) * (wy1 - t)), 1, 1); } ctx.globalAlpha = 1;
  // nốt nhạc bay lên từ loa kèn máy hát
  for (let k = 0; k < 3; k++) { const t = (sceneT * .45 + k / 3) % 1, x = Math.round(PQR_GRAM[0] + 4 + t * 22 + Math.sin(t * 7 + k) * 3), y = Math.round(PQR_GRAM[1] - 6 - t * 44);
    ctx.globalAlpha = Math.min(1, (1 - t) * 1.6); fr('#f1e3c8', x, y, 2, 2); fr('#f1e3c8', x + 1, y - 5, 1, 5); fr('#f1e3c8', x + 2, y - 5, 2, 1); if (k % 2) { fr('#f1e3c8', x + 4, y - 1, 2, 2); fr('#f1e3c8', x + 5, y - 5, 1, 4); } ctx.globalAlpha = 1; }
  // bóng Edison thả trần, đèn tường tulip, đèn bàn ngân hàng (tắt dần khi props.pqrDim)
  const dim = 1 - (props.pqrDimA || 0) * 1.4;
  for (const [lx, ly] of PQR_LAMPS) { fr('#1b1b1f', lx, 33, 1, ly - 37); fr('#8a6a1a', lx - 1, ly - 4, 3, 3); fr('#c9a227', lx - 1, ly - 4, 1, 3);
    fr(OUT, lx - 3, ly - 1, 7, 7); fr(dim > 0 ? '#c88a3a' : '#4a3a2a', lx - 2, ly - 1, 5, 6); fr(dim > 0 ? '#e8a850' : '#5a4632', lx - 2, ly, 1, 4);
    const fil = dim > 0 ? '#fff4c0' : '#a8602a'; fr(fil, lx, ly, 1, 3); fr(fil, lx - 1, ly + 2, 1, 1); fr(fil, lx + 1, ly + 2, 1, 1);   // dây tóc
    if (dim > 0) { glow(lx, ly + 2, 7, '#ffcf7a', (.22 + Math.sin(time * 5 + lx) * .02) * dim); glow(lx, ly + 2, 22, '#ffb860', .08 * dim); } }
  if (dim > 0) { for (const sx of PQR_SCONCE) glow(sx + 1, 88, 14, '#ffd98a', .16 * dim); glow(459, GY - 44, 12, '#d8f0a0', .14 * dim); }
}
function pqrGround() { ctx.drawImage(pqrFloor(), 0, GY, W, H - GY, 0, GY, W, H - GY); pqrFurniture(); }
const PQR_CONF = ['#ff6b8b', '#ffd43b', '#74c0fc', '#b197fc', '#69db7c', '#ffffff'];
function pqrUpdate(dt) {
  const to = props.pqrDim ? .62 : 0, a = props.pqrDimA || 0; props.pqrDimA = a + Math.sign(to - a) * Math.min(Math.abs(to - a), dt * .9);
  if (props.pqrConf > 0) { props.pqrConf -= dt;   // pháo giấy rơi lả tả từ trần
    for (let i = 0; i < 3; i++) particles.push({ x: 60 + Math.random() * 360, y: 34, vx: (Math.random() - .5) * 24, vy: 15 + Math.random() * 25, life: 3.2, max: 3.2, col: PQR_CONF[Math.floor(Math.random() * PQR_CONF.length)], sz: Math.random() < .5 ? 2 : 1, g: 8 }); }
}
/* bắn pháo giấy: hai ống pháo ở bàn khách và quầy bar nổ tung lên */
function pqrPoppers() { for (const [x, d] of [[PQR_GC + 4, 1], [440, -1]]) for (let i = 0; i < 30; i++) particles.push({ x, y: GY - 30, vx: d * (40 + Math.random() * 70), vy: -110 - Math.random() * 90, life: 1.8, max: 1.8, col: PQR_CONF[i % PQR_CONF.length], sz: Math.random() < .4 ? 2 : 1, g: 160 });
  props.pqrConf = 3.5; sfx('boom'); }
/* tắt đèn: phủ tối toàn cảnh trừ vùng elip quanh hai đứa (mép mềm), rồi thắp lại ánh nến trên các bàn */
function pqrOverlay() {
  ctx.globalAlpha = .05; fr('#ffb070', 0, 0, W, H); ctx.globalAlpha = 1;
  const a = props.pqrDimA || 0; if (a < .01) return;
  const [cx, cy] = PQR_SPOT, rx = 64, ry = 52, D = '#07061a';
  for (let y = 16; y < H - 14; y++) { const d = (y - cy) / ry, w = Math.abs(d) < 1 ? Math.round(rx * Math.sqrt(1 - d * d)) : 0;
    ctx.globalAlpha = a; if (!w) { fr(D, 0, y, W, 1); continue; }
    fr(D, 0, y, cx - w, 1); fr(D, cx + w, y, W - cx - w, 1);
    const e = Math.min(w, 10); ctx.globalAlpha = a * .5; fr(D, cx - w, y, e, 1); fr(D, cx + w - e, y, e, 1); ctx.globalAlpha = a * .2; fr(D, cx - w + e, y, e, 1); fr(D, cx + w - e * 2, y, e, 1); }
  ctx.globalAlpha = 1;
  const ty = GY - 16; pqrCandle(PQR_GT[0] + 8, ty, 3); pqrCandle(PQR_T[0] + 14, ty, 0); pqrCandle(PQR_T[0] + 21, ty, 1);
}
