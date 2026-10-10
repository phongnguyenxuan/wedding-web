/* ================== ĐÀ LẠT: PHỐ ĐI BỘ ĐÊM & NHÓM HÁT RONG ==================
   Bố cục (toạ độ màn hình, camera đứng yên ở chương này) – theo ảnh khu Hòa Bình lúc lên đèn:
   - trời: giờ xanh, lam đậm; hai lớp đồi thông in bóng (dlRidge) có đèn nhà lấp lánh (DL_HLIGHTS), sương mỏng trôi ngang
   - dãy nhà, chân nhà ở DL_SB: nhà trái có biển quảng cáo dâu tây trên mái + bảng neon đỏ, nhà thấp biển vàng CÀ PHÊ,
     khách sạn trắng sáu tầng biển neon xanh, nhà xanh kiểu Pháp cửa vòm, nhà phải biển vàng ĐẶC SẢN; tầng trệt cửa hàng sáng đèn
   - quảng trường DL_SB..GY: vòng xuyến bãi cỏ có tượng đài (DL_ROUND), lều trắng bán dâu & mũ len, ô dù hồng bán đồ nướng,
     cột đèn nhỏ, xe máy dựng, đám đông áo khoác mũ len (DL_CROWD), cây thông lớn bên phải (DL_PINE)
   - hàng trước (cùng hàng nhân vật): lò bánh tráng nướng + xe sữa đậu nành (DL_CART) có cô bán hàng, cột đèn gang (DL_LAMP),
     nhóm hát rong: ca sĩ cầm micro & tay guitar ngồi thùng cajon (là diễn viên, pose 'sing' / 'guitar'), hộp đàn mở (DL_CASE),
     loa kéo đèn led (DL_AMP), bảng phấn
   Chữ trên biển hiệu vẽ mỗi khung (pixText) chứ không vẽ sẵn, vì font VT323 có thể nạp sau lớp tĩnh.
   props: song (0 nghỉ · 1 bài vui · 2 tình ca) · clapT (khán giả vỗ tay) · serve (cô bán sữa chìa hai ly) · cash · tip · notes */
const DL_SB = 172, DL_CART = 22, DL_LAMP = 142, DL_CASE = 330, DL_AMP = 420, DL_PINE = 446, DL_ROUND = 240;
const DL_JACKET = ['#e03131', '#1c7ed6', '#f08c00', '#2f9e44', '#f1f3f5', '#7048e8', '#e64980', '#495057', '#ffd43b', '#0ca678', '#a61e4d', '#343a40'];
const DL_HAT = ['#ff6b6b', '#ffd43b', '#f8f9fa', '#74c0fc', '#ff8fab', '#b197fc', '#69db7c'];
const DL_GOODS = ['#e03131', '#ffd43b', '#ff8fab', '#74c0fc', '#69db7c', '#f08c00', '#ffffff', '#b197fc'];
/* mặt tiền tầng trệt sáng đèn [x, rộng] – dùng cho vũng sáng hắt xuống quảng trường */
const DL_SHOPS = [[2, 88], [100, 48], [196, 70], [302, 44], [350, 44], [400, 80]];
const DL_TENTS = [[104, 'dâu'], [146, 'len']], DL_UMB = [[298, '#ff8fab'], [336, '#f1f3f5']], DL_FLAMPS = [92, 288];

function dlSky(id) {
  ditherInto(id, W, ['#0a1040', '#111a5e', '#18257e', '#21329a', '#2c40ae', '#3a4fbc', '#4a5cc4'], 0, 150);
  ditherInto(id, W, ['#4a5cc4', '#4a5cc4'], 150, H);
}
const dlRidge = (x, far) => far ? 84 + Math.round(Math.sin(x * .016 + 1) * 7 + Math.sin(x * .047) * 4) : 100 + Math.round(Math.sin(x * .022 + 3) * 6 + Math.sin(x * .058 + 2) * 3);
const DL_HLIGHTS = Array.from({ length: 54 }, (_, i) => { const x = Math.floor(rnd(i * 5.1 + 3) * W); return [x, dlRidge(x, 0) + 5 + Math.floor(rnd(i * 2.7 + 9) * 26), i]; });

/* ---- lớp tĩnh vẽ sẵn ---- */
const dlCanvas = h => { const c = document.createElement('canvas'); c.width = W; c.height = h; const g = c.getContext('2d'); return [c, g, (col, x, y, w, hh) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, hh); }]; };
let dlHillC = null;
function dlHills() {   // hai lớp đồi thông: đường đỉnh lượn sóng + ngọn thông răng cưa
  if (dlHillC) return dlHillC; const [c, , R] = dlCanvas(DL_SB);
  for (const far of [1, 0]) for (let x = 0; x < W; x++) { const s = x + (far ? 3 : 0), tr = Math.floor(s / 6), th = rnd(tr * 3.1 + far * 50) > .25 ? [0, 2, 4, 6, 3, 1][s % 6] * (far ? 1 : 1.4) : 0, top = dlRidge(x, far) - Math.round(th);
    R(far ? '#1f2a78' : '#151c56', x, top, 1, DL_SB - top); if (far && th > 3) R('#2a3688', x, top, 1, 1); }
  return dlHillC = c;
}
function dlWin(R, x, y, w, h, k) {   // cửa sổ: sáng vàng ấm / trắng / tối
  const v = rnd(k * 7.7 + 1.3); R('#3a3448', x - 1, y - 1, w + 2, h + 2); R('#d8ccb8', x - 2, y + h + 1, w + 4, 1);
  if (v < .62) { R(v < .3 ? '#fff1cf' : '#ffd98a', x, y, w, h); R(v < .3 ? '#ffe2a8' : '#f2b45a', x, y + h - 3, w, 3); R('#c9a06a', x, y, 2, h); } else R('#2a2a48', x, y, w, h);
  R('#3a3448', x + (w >> 1), y, 1, h);
}
function dlShop(R, x, w, k, aw) {   // tầng trệt mở cửa: kệ hàng (len, mứt, dâu), khách trong cửa hàng, mái hiên sọc
  const y = 148, h = DL_SB - y;
  R('#ffd889', x, y, w, h); R('#f6b85c', x, y + 8, w, h - 8); R('#e8973e', x, y + 17, w, h - 17);
  for (let r = 0; r < 2; r++) { const sy = y + 7 + r * 8; for (let i = x + 3; i < x + w - 5; i += 4) R(DL_GOODS[Math.floor(rnd(i * 1.3 + r * 9 + k) * 8)], i, sy - 4, 3, 4); R('#7a4a22', x + 2, sy, w - 4, 1); }
  for (let i = 0; i < 2; i++) { const px = x + 6 + Math.floor(rnd(k * 5 + i) * (w - 14)); R('#2b1b17', px + 1, y + 12, 4, 4); R(DL_JACKET[(k + i * 5) % 12], px, y + 16, 6, 8); }
  for (const px of [x, x + w - 2]) R('#5a4a40', px, y, 2, h);
  for (let s = 0; s < w + 4; s += 4) R((s >> 2) % 2 ? '#f1f3f5' : aw, x - 2 + s, y - 4, 4, 4); R('rgba(0,0,0,.25)', x - 2, y, w + 4, 1);
}
function dlBerry(R, x, y) {   // quả dâu tây trên biển quảng cáo
  R('#a61e1e', x, y + 2, 7, 5); R('#a61e1e', x + 1, y + 7, 5, 2); R('#a61e1e', x + 3, y + 9, 1, 1); R('#e03131', x + 1, y + 2, 5, 5); R('#e03131', x + 2, y + 7, 3, 1); R('#ff8787', x + 1, y + 2, 2, 2);
  for (const [i, j] of [[2, 4], [4, 3], [3, 6], [5, 5], [1, 6]]) R('#ffe066', x + i, y + j, 1, 1);
  R('#2b8a3e', x, y + 1, 7, 1); R('#51cf66', x + 2, y, 3, 1); R('#2b8a3e', x + 3, y - 1, 1, 1);
}
function dlBuildings(R) {
  // nhà xa lấp ló giữa các toà
  for (const [x, w, top] of [[146, 48, 112], [268, 36, 108], [392, 40, 98]]) { R('#2c3670', x, top, w, DL_SB - top); R('#38447e', x, top, w, 1);
    for (let i = 0; i < 9; i++) if (rnd(x + i * 7) > .4) R(rnd(x * 3 + i) > .5 ? '#ffd98a' : '#fff1cf', x + 3 + Math.floor(rnd(x + i * 3.1) * (w - 6)), top + 4 + Math.floor(rnd(x + i * 5.3) * 30), 2, 3); }
  // nhà trái: biển quảng cáo dâu tây trên mái, bảng neon, cửa hàng đặc sản
  R('#9c8a74', -6, 104, 102, DL_SB - 104); R('#b8a68e', -6, 104, 2, DL_SB - 104); R('#7a6a58', 93, 104, 3, DL_SB - 104); R('#5e5044', -8, 101, 106, 3); R('#7e7064', -8, 101, 106, 1);
  R('#2a1c24', 0, 106, 92, 14); R('#4a2a34', 0, 106, 92, 1);   // bảng neon ngay dưới gờ mái (mái bạt xe sữa che phần dưới mặt tiền)
  for (let i = 0; i < 5; i++) dlWin(R, 4 + i * 19, 124, 9, 9, i + 3);
  for (const lx of [16, 46, 76]) { R('#2a2a3a', lx, 94, 2, 7); R('#3a3a4e', lx - 3, 98, 8, 1); }
  R('#2a2a3a', 6, 60, 82, 35); R('#46465e', 6, 60, 82, 1); for (const sx of [20, 70]) { R('#2a2a3a', sx + 1, 55, 1, 5); R('#1b1b2f', sx - 1, 54, 5, 3); }
  const st = ['#17602e', '#2b8a3e', '#40c057', '#8ce99a'];
  for (let j = 0; j < 31; j++) { const t = j / 30 * 3, k = Math.min(2, Math.floor(t)), f = t - k; for (let i = 0; i < 78; i++) R(f > (BAYER[j & 3][i & 3] + .5) / 16 ? st[k + 1] : st[k], 8 + i, 62 + j, 1, 1); }
  dlBerry(R, 12, 70); dlBerry(R, 21, 75); dlBerry(R, 13, 81); R('#2b8a3e', 10, 90, 22, 2);
  dlShop(R, 2, 88, 0, '#e03131');
  // nhà thấp biển vàng
  R('#7a6a5e', 96, 124, 56, DL_SB - 124); R('#968676', 96, 124, 2, DL_SB - 124); R('#5e5044', 94, 121, 60, 3);
  R('#c99a00', 99, 127, 50, 17); R('#ffd43b', 100, 128, 48, 15); R('#fff3bf', 100, 128, 48, 1); R('#e0a800', 100, 142, 48, 1);
  dlShop(R, 100, 48, 2, '#2f9e44');
  // khách sạn trắng sáu tầng, biển neon trên mái
  const hx = 188, hw = 86;
  R('#cfc9c0', hx, 64, hw, DL_SB - 64); R('#e8e4dc', hx, 64, 3, DL_SB - 64); R('#a8a298', hx + hw - 4, 64, 4, DL_SB - 64); R('#8a847a', hx - 2, 61, hw + 4, 3); R('#b4aea4', hx - 2, 61, hw + 4, 1);
  R('#2a2a3a', 212, 58, 1, 3); R('#2a2a3a', 250, 58, 1, 3); R('#0d1a40', 202, 46, 58, 14); R('#2a3a6a', 202, 46, 58, 1); R('#2a3a6a', 202, 59, 58, 1);
  for (let f = 0; f < 6; f++) { const wy = 72 + f * 12; R('#b8b2a8', hx + 3, wy + 9, hw - 7, 1); for (let j = 0; j < 4; j++) dlWin(R, 196 + j * 19, wy, 10, 7, 20 + f * 4 + j); }
  R('#3a3448', hx + 4, 146, hw - 8, 26); for (const dx of [8, 48]) { R('#fff1cf', hx + dx, 150, 30, 22); R('#ffe2a8', hx + dx, 162, 30, 10); for (let i = 7; i < 30; i += 8) R('#8a7a6a', hx + dx + i, 150, 1, 22); }
  R('#2a2a3a', hx + 2, 143, hw - 4, 4); R('#c9a227', hx + 2, 146, hw - 4, 1);
  // nhà xanh kiểu Pháp: phào chỉ trắng, lan can mái, cửa sổ vòm có cửa chớp
  const bx = 298, bw = 100, TR = '#e9eef6';
  R('#6a90c4', bx, 76, bw, DL_SB - 76); R('#8ab0e0', bx, 76, 3, DL_SB - 76); R('#4c70a4', bx + bw - 4, 76, 4, DL_SB - 76);
  R(TR, bx - 2, 72, bw + 4, 4); R('#c4cede', bx - 2, 76, bw + 4, 1); R(TR, bx, 63, bw, 1); for (let i = 0; i < bw; i += 4) R(TR, bx + 1 + i, 64, 2, 8);
  for (let f = 0; f < 3; f++) { const wy = 84 + f * 15; R('#c4cede', bx, wy + 12, bw, 1);
    for (let j = 0; j < 5; j++) { const wx = 304 + j * 19, lit = rnd(f * 5.3 + j * 1.7 + 40) < .6;
      if (rnd(f * 3.1 + j + 70) > .55) { R('#2f6f5a', wx - 4, wy, 3, 10); R('#2f6f5a', wx + 9, wy, 3, 10); for (let yy = wy + 1; yy < wy + 10; yy += 2) { R('#245a48', wx - 4, yy, 3, 1); R('#245a48', wx + 9, yy, 3, 1); } }
      R(TR, wx - 1, wy - 1, 10, 12); R(lit ? '#ffd98a' : '#2a3a6a', wx, wy, 8, 10); if (lit) R('#f2b45a', wx, wy + 7, 8, 3);
      R(TR, wx, wy, 2, 1); R(TR, wx + 6, wy, 2, 1); R(TR, wx, wy + 1, 1, 1); R(TR, wx + 7, wy + 1, 1, 1); R('#c4cede', wx + 4, wy + 1, 1, 9); R('#c4cede', wx, wy + 5, 8, 1); R(TR, wx - 2, wy + 10, 12, 1); } }
  R('#f8f0e3', 305, 134, 38, 10); R('#f8f0e3', 353, 134, 38, 10); R('#c9b89a', 305, 143, 38, 1); R('#c9b89a', 353, 143, 38, 1);
  dlShop(R, 302, 44, 4, '#e03131'); dlShop(R, 350, 44, 5, '#1c7ed6');
  // nhà phải (khuất sau cây thông): biển vàng
  R('#8e7e6e', 398, 100, 88, DL_SB - 100); R('#5e5044', 396, 97, 90, 3); for (let i = 0; i < 4; i++) dlWin(R, 404 + i * 20, 106, 9, 10, 60 + i);
  R('#c99a00', 447, 124, 36, 18); R('#ffd43b', 448, 125, 34, 16); R('#fff3bf', 448, 125, 34, 1);
  dlShop(R, 400, 80, 6, '#2f9e44');
}
function dlRound(R) {   // vòng xuyến bãi cỏ, bồn hoa, tượng đài trên bệ ba tầng
  const cx = DL_ROUND, cy = 191, rx = 54, ry = 9;
  for (let j = -ry; j <= ry; j++) { const ww = Math.round(rx * Math.sqrt(1 - (j / (ry + .5)) ** 2)); R(j > 0 ? '#8a889e' : '#b4b2c4', cx - ww - 2, cy + j, ww * 2 + 5, 1); }
  for (let j = -ry + 1; j <= ry - 1; j++) { const ww = Math.round((rx - 3) * Math.sqrt(1 - (j / (ry - .5)) ** 2)); R(j < -3 ? '#2b6a34' : '#327a3c', cx - ww, cy + j, ww * 2 + 1, 1); }
  for (let i = 0; i < 70; i++) { const a = rnd(i * 2.1) * Math.PI * 2, rr = .5 + rnd(i * 3.7) * .42; R(DL_GOODS[i % 8 === 1 ? 2 : i % 8], cx + Math.round(Math.cos(a) * rx * rr), cy + Math.round(Math.sin(a) * ry * rr), 1, 1); }
  R('#5c6078', cx - 19, 179, 39, 10); R('#7c8098', cx - 18, 180, 37, 8); R('#a4a8bc', cx - 18, 180, 37, 1);
  R('#5c6078', cx - 12, 165, 25, 15); R('#868aa2', cx - 11, 166, 23, 14); R('#b0b4c6', cx - 11, 166, 23, 1); R('#6a6e88', cx + 8, 167, 4, 13);
  R('#5c6078', cx - 6, 149, 13, 17); R('#9498ae', cx - 5, 150, 11, 16); R('#c0c4d4', cx - 5, 150, 2, 16); R('#70748c', cx + 4, 150, 2, 16); R('#5c6078', cx - 8, 147, 17, 3); R('#c0c4d4', cx - 7, 148, 15, 1);
  // pho tượng: viền tối trước rồi tô sáng, một tay giơ cao ngọn đuốc
  const S1 = '#eceef6', S2 = '#a6aac0', D = '#3a3a52';
  for (const [x, y, w, h] of [[-3, 123, 7, 7], [-4, 128, 9, 12], [-4, 139, 9, 9], [3, 115, 4, 16], [-6, 129, 4, 10]]) R(D, cx + x, y, w, h);
  R(S1, cx - 2, 124, 5, 5); R(S2, cx + 2, 125, 1, 4); R(S1, cx - 3, 129, 7, 10); R(S2, cx + 2, 129, 2, 10); R(S1, cx - 3, 139, 3, 8); R(S2, cx + 1, 139, 3, 8);
  R(S1, cx + 4, 120, 2, 10); R('#ffe8a8', cx + 4, 116, 2, 3); R(S2, cx - 5, 130, 2, 8);
}
function dlStalls(R) {
  for (const [x, kind] of DL_TENTS) { const b = 202;   // lều trắng: mái chóp, diềm, chân sắt, bàn bày dâu / mũ len
    for (let j = 0; j < 8; j++) R(j % 2 ? '#e9ecef' : '#f8f9fa', x + 6 - j * 2, b - 31 + j, 14 + j * 4, 1);
    for (let s = 0; s < 38; s += 3) R((s / 3) % 2 ? '#f8f9fa' : '#c92a2a', x - 9 + s, b - 23, 3, 2);
    R('#adb5bd', x - 7, b - 21, 1, 21); R('#adb5bd', x + 29, b - 21, 1, 21); R('#3b2a2a', x + 12, b - 21, 1, 3);
    R('#8a5a2a', x - 6, b - 10, 36, 2); R(kind === 'dâu' ? '#1c7ed6' : '#c92a2a', x - 6, b - 8, 36, 7); R('rgba(0,0,0,.2)', x - 6, b - 3, 36, 1);
    if (kind === 'dâu') for (let i = 0; i < 6; i++) { const tx = x - 4 + i * 6; R('#2f9e44', tx, b - 13, 5, 3); R('#e03131', tx + 1, b - 14, 3, 2); R('#ff8787', tx + 1, b - 14, 1, 1); }   // hộp dâu tây
    else for (let i = 0; i < 7; i++) { const tx = x - 4 + i * 5, c = DL_HAT[i % 7]; R(c, tx, b - 14, 4, 4); R('#ffffff', tx + 1, b - 15, 2, 1); R('rgba(0,0,0,.2)', tx, b - 11, 4, 1); }   // mũ len xếp hàng
  }
  for (const [x, col] of DL_UMB) { const b = 202;   // ô dù bán đồ nướng
    for (let j = 0; j < 7; j++) { const ww = Math.round(Math.sqrt(1 - ((6 - j) / 7) ** 2) * 17); R(j % 2 ? col : '#ffffff', x - ww, b - 34 + j, ww * 2 + 1, 1); }
    for (let s = -17; s < 17; s += 4) R(col, x + s, b - 27, 3, 1); R('#868e96', x, b - 34, 1, 34);
    R('#495057', x - 12, b - 12, 24, 3); R('#343a40', x - 11, b - 9, 1, 9); R('#343a40', x + 10, b - 9, 1, 9);
    for (let i = 0; i < 6; i++) { R('#e9d8a6', x - 10 + i * 4, b - 16, 1, 4); R(i % 2 ? '#c2410c' : '#f08c00', x - 11 + i * 4, b - 15, 3, 2); }   // xiên nướng
  }
  for (let i = 0; i < 7; i++) { const sx = 286 + i * 10; R('#e03131', sx, 206, 6, 2); R('#c92a2a', sx + 1, 208, 1, 3); R('#c92a2a', sx + 4, 208, 1, 3); }   // ghế nhựa đỏ
  for (const x of DL_FLAMPS) { R('#1b1b2f', x, 160, 2, 26); R('#1b1b2f', x - 4, 160, 10, 1); R('#2b2b3a', x - 2, 184, 6, 2); for (const lx of [x - 5, x + 4, x - 1]) { R('#1b1b2f', lx, lx === x - 1 ? 153 : 157, 3, 1); R('#fff3d6', lx, lx === x - 1 ? 154 : 158, 3, 3); } }   // cột đèn nhỏ quảng trường
}
function dlPine(R) {   // cây thông lớn: thân nâu, tán xếp tầng rủ xuống, mép cành bắt ánh đèn phố
  const cx = DL_PINE;
  R('#2a1a12', cx - 3, 30, 7, 176); R('#3e2a1c', cx - 3, 30, 2, 176); for (let y = 36; y < 204; y += 5) R('#22140e', cx - 1 + (y % 3), y, 2, 1);
  R('#5a5470', cx - 10, 202, 21, 4); R('#7a7490', cx - 10, 202, 21, 1);
  for (let t = 0; t < 10; t++) { const ty = 8 + t * 16, hw = Math.min(54, 8 + t * 6);
    for (let j = 0; j < 15; j++) { const f = j / 14, ww = Math.round(hw * (.3 + .7 * f) + (rnd(t * 31 + j) - .5) * 6), dx = Math.round((rnd(t * 17 + j * 3) - .5) * 4), y = ty + j;
      R(j > 11 ? '#0b2418' : j < 3 ? '#1e5238' : '#143c2a', cx - ww + dx, y, ww * 2 + 1, 1);
      if (j % 3 === 1) { R('#2a6a46', cx - ww + dx + 2, y, 3, 1); R('#2a6a46', cx + ww + dx - 6, y, 4, 1); }
      if (t > 5 && j > 8 && rnd(t + j * 9) > .45) R('#5a7a34', cx - ww + dx + Math.floor(rnd(t * 3 + j) * ww * 2), y, 3, 1); }
    for (const s of [-1, 1]) { const ex = cx + s * hw; R('#143c2a', ex - 3, ty + 13, 6, 3); R('#0b2418', ex - 2, ty + 16, 4, 1); }
  }
}
let dlTownC = null;
function dlTown() {
  if (dlTownC) return dlTownC; const [c, g, R] = dlCanvas(GY);
  dlBuildings(R);
  // vỉa hè chân dãy nhà, mặt quảng trường lát đá, vũng sáng hắt ra từ cửa hàng
  R('#66627e', 0, DL_SB, W, 4); R('#8a86a2', 0, DL_SB, W, 1); R('#3a3854', 0, DL_SB + 4, W, GY - DL_SB - 4);
  for (let i = 0; i < 260; i++) R(rnd(i * 1.7) > .5 ? '#423f5e' : '#34324c', Math.floor(rnd(i * 3.9 + 1) * W), DL_SB + 5 + Math.floor(rnd(i * 2.3 + 7) * (GY - DL_SB - 6)), 2 + (i % 3), 1);
  g.globalAlpha = .12; for (const [x, w] of DL_SHOPS) for (let y = DL_SB + 4; y < DL_SB + 24; y++) { const s = (y - DL_SB) >> 1; R('#ffcf7a', x - s, y, w + s * 2, 1); } g.globalAlpha = 1;
  dlRound(R); dlStalls(R); dlPine(R);
  return dlTownC = c;
}

/* ---- người nhỏ ở quảng trường: áo khoác, nhiều người đội mũ len quả bông, quàng khăn.
   act: 'walk' bước đi · 'clap' vỗ tay · 'phone' giơ đèn điện thoại đung đưa · 'bob' nhún theo nhạc ---- */
function dlPerson(x, b, k, act) {
  x = Math.round(x); const jk = DL_JACKET[k % 12], sk = rnd(k * 1.3) > .8 ? '#d9a077' : '#f5c29a', hair = rnd(k * 2.1) > .8 ? '#7a4a22' : '#2b1b17', hat = rnd(k * 4.7) > .42 ? DL_HAT[k % 7] : null;
  const st = Math.floor(sceneT * 6 + k) % 2, bob = act === 'bob' ? Math.floor(sceneT * 3.4 + (k % 2)) % 2 : Math.floor(time * 1.3 + k) % 6 === 0 ? 1 : 0, y = b - bob, pants = ['#343a40', '#1864ab', '#495057', '#5c4a3a'][k % 4];
  if (act === 'walk') { fr(pants, x + (st ? 0 : 1), b - 4, 2, 4); fr(pants, x + (st ? 4 : 3), b - 4, 2, 4); }
  else { fr(pants, x + 1, b - 4, 1, 4); fr(pants, x + 4, b - 4, 1, 4); fr('#1b1b2f', x + 1, b - 1, 1, 1); fr('#1b1b2f', x + 4, b - 1, 1, 1); }
  fr(jk, x, y - 10, 6, 6); fr('rgba(0,0,0,.25)', x + 4, y - 10, 2, 6); fr('rgba(255,255,255,.22)', x + 1, y - 10, 1, 5);
  if (k % 4 === 1) fr(DL_HAT[(k + 3) % 7], x + 1, y - 10, 4, 1);   // khăn quàng
  if (act === 'clap') { if (Math.floor(time * 8 + k) % 2) { fr(jk, x + 1, y - 8, 4, 1); fr(sk, x + 2, y - 9, 2, 1); } else { fr(sk, x - 1, y - 8, 1, 1); fr(sk, x + 6, y - 8, 1, 1); } }
  if (act === 'phone') { const sw = Math.round(Math.sin(time * 2.2 + k) * 1.5); fr(jk, x + 5, y - 15, 1, 6); glow(x + 5 + sw, y - 17, 4, '#fff3d6', .25); fr('#1b1b2f', x + 5 + sw, y - 18, 2, 3); fr('#ffffff', x + 5 + sw, y - 18, 1, 1); }
  fr(sk, x + 1, y - 14, 4, 4); fr(hair, x + 1, y - 15, 4, 2); if (rnd(k * 2.9) > .55) { fr(hair, x, y - 14, 1, 4); fr(hair, x + 5, y - 14, 1, 3); }
  if (hat) { fr(hat, x + 1, y - 16, 4, 2); fr('rgba(0,0,0,.22)', x + 1, y - 15, 4, 1); fr('#ffffff', x + 2, y - 17, 2, 1); }
}
const DL_CROWD = (() => { const out = [];
  for (let i = 0; i < 80; i++) { const x = Math.floor(rnd(i * 3.17 + 1) * 500) - 10, b = 184 + Math.floor(rnd(i * 5.3 + 2) * 24);
    if (Math.abs(x - DL_ROUND) < 60 && b < 201) continue;   // bãi cỏ vòng xuyến
    out.push({ x, b, k: i, band: x > 284 && b > 194 }); }
  for (let i = 0; i < 26; i++) out.push({ x: 290 + Math.floor(rnd(i * 7.7 + 40) * 186), b: 198 + Math.floor(rnd(i * 2.9 + 41) * 12), k: 100 + i, band: true });   // khán giả quây quanh nhóm hát rong
  return out; })();
const DL_WALK = [[9, 0, 188, 200, 1], [7, 220, 190, 201, -1], [11, 400, 186, 202, 1], [6, 120, 193, 203, -1], [8, 330, 187, 204, -1]];   // tốc độ, lệch, chân, k, hướng

/* ---- toàn cảnh ---- */
function dlMist(y0, n, a, seed) {   // sương Đà Lạt: dải mờ dài trôi chậm
  ctx.globalAlpha = a;
  for (let i = 0; i < n; i++) { const w = 140 + Math.floor(rnd(i * 3.3 + seed) * 160), x = loopX(3 + i * 1.4, rnd(i + seed) * 900, W + w + 80) - w + 40, y = y0 + i * 10;
    fr('#c5d0f0', x, y, w, 4); fr('#c5d0f0', x + 24, y - 2, w - 48, 2); fr('#c5d0f0', x + 12, y + 4, w - 24, 2); }
  ctx.globalAlpha = 1;
}
function dlSign(s, size, col, cx, y, glowCol, a) {   // chữ biển hiệu căn giữa, quầng sáng chữ nhật phía sau
  const t = pixText(s, size, col), x = Math.round(cx - (t.width >> 1));
  if (glowCol) { ctx.globalAlpha = a; fr(glowCol, x - 2, y + 2, t.width + 4, size - 1); ctx.globalAlpha = 1; }
  ctx.drawImage(t, x, y);
}
function dlScene() {
  for (let i = 0; i < 24; i++) { if ((Math.floor(time * 2) + i * 3) % 13 === 0) continue; fr(i % 5 ? '#5a6ad0' : '#c8d0ff', Math.floor(rnd(i + 3) * W), 17 + Math.floor(rnd(i + 30) * 48), 1, 1); }
  ctx.drawImage(dlHills(), 0, 0);
  for (const [x, y, k] of DL_HLIGHTS) if ((Math.floor(time * 1.5) + k) % 9) fr(k % 3 ? '#ffd98a' : '#fff3d6', x, y, 1, 1);
  dlMist(86, 3, .1, 1);
  ctx.drawImage(dlTown(), 0, 0);
  // biển hiệu, neon (chập chờn), đèn chiếu
  const fl = Math.floor(time * 7) % 41;
  dlSign('DÂU TÂY', 16, '#ffffff', 60, 60, null); dlSign('ĐÀ LẠT', 12, '#ffe066', 60, 76, null);
  for (const sx of [21, 71]) glow(sx, 58, 5, '#fff3d6', .3);
  ctx.globalAlpha = .06; fr('#ffffff', 8, 62, 78, 31); ctx.globalAlpha = 1;
  if (fl !== 3 && fl !== 5) dlSign('ĐẶC SẢN ĐÀ LẠT', 12, '#ff8fa3', 46, 104, '#ff4d6d', .25);
  dlSign('KHÁCH SẠN', 12, '#a5f3ff', 231, 45, '#3bc9db', .2);
  dlSign('CÀ PHÊ', 16, '#5a2a12', 124, 124, null); ctx.globalAlpha = .1; fr('#ffd43b', 96, 124, 56, 23); ctx.globalAlpha = 1;
  dlSign('ĐẶC SẢN', 12, '#3a2a10', 465, 123, null); ctx.globalAlpha = .1; fr('#ffd43b', 444, 121, 42, 24); ctx.globalAlpha = 1;
  dlSign('ÁO LEN', 12, '#c92a2a', 324, 131, null); dlSign('MỨT', 12, '#7a3e1a', 372, 131, null);
  glow(DL_ROUND, 184, 12, '#ffe8a8', .1); glow(DL_ROUND + 5, 116, 4, '#ffd98a', .3 + Math.sin(time * 6) * .05);
  for (const [x] of DL_TENTS) glow(x + 13, 182, 11, '#ffd98a', .16 + Math.sin(time * 5 + x) * .02);
  for (const [x] of DL_UMB) glow(x, 188, 10, '#ff922b', .12 + Math.sin(time * 7 + x) * .03);
  for (const x of DL_FLAMPS) glow(x + 1, 157, 8, '#ffd98a', .2);
  dlMist(150, 2, .06, 7);
  // xe máy dựng trước cửa hàng, rồi đám đông theo chiều sâu
  for (const [x, i, d] of [[4, 0, 1], [24, 1, -1], [44, 3, 1], [404, 2, 1], [470, 0, -1]]) hnVeh(HN_PARK[i], x, 182, d, false);
  const clap = props.clapT > 0, list = DL_CROWD.map(p => [p.x, p.b, p.k, clap && (p.band || p.k % 3 === 0) ? 'clap' : p.band && props.song === 2 && p.k % 3 === 0 ? 'phone' : p.band && props.song ? 'bob' : null]);
  for (const [sp, off, b, k, d] of DL_WALK) { const lx = loopX(sp, off, W + 80); list.push([d > 0 ? lx : W - lx, b, k, 'walk']); }
  list.sort((a, b) => a[1] - b[1]); for (const p of list) dlPerson(...p);
}

/* ---- hàng trước: lối đi lát đá, lò bánh tráng, xe sữa đậu nành, cột đèn, đồ nghề nhóm hát rong ---- */
let dlWalkC = null;
function dlGround() {
  if (!dlWalkC) { const [c, , R0] = dlCanvas(H - GY), R = (col, x, y, w, h) => R0(col, x, y - GY, w, h), rows = [GY, 226, 231, 237, 244, 252, H];
    for (let b = 0; b < rows.length - 1; b++) { const ya = rows[b], yb = rows[b + 1], sp = 16 + b * 5;
      for (let x = -((b % 2) * (sp >> 1)), n = 0; x < W; x += sp, n++) { const v = rnd(n * 7.3 + b * 31.1); R(v > .66 ? '#4c4a64' : v > .33 ? '#46445e' : '#403e58', x, ya, sp, yb - ya); R('#5a5874', x + 1, ya + 1, sp - 2, 1); if (v > .85) R('#36344c', x + 3, ya + 2, 3, 1); R('#2c2a3e', x, ya, 1, yb - ya); }
      R('#2c2a3e', 0, yb - 1, W, 1); }
    R('#77738f', 0, GY, W, 1); dlWalkC = c; }
  ctx.drawImage(dlWalkC, 0, GY);
  ellipseGlow(DL_CART + 34, GY + 5, 46, 5, '#ffd98a', .08); ellipseGlow(DL_LAMP + 1, GY + 6, 30, 4, '#ffd98a', .1);
  ellipseGlow(392, GY + 5, 64, 6, props.song ? '#ffb4c8' : '#ffd98a', .07 + (props.song ? Math.sin(time * 4) * .015 : 0));
  dlGrill(); dlCart(); dlLamp(DL_LAMP); dlBand();
}
function dlGrill() {   // lò than nướng bánh tráng: bánh giòn phết trứng, hành lá, tương ớt
  const x = 2, b = GY;
  fr('#495057', x + 1, b - 12, 1, 12); fr('#495057', x + 12, b - 12, 1, 12); fr('#495057', x + 1, b - 4, 12, 1);
  fr(OUT, x - 1, b - 20, 16, 9); fr('#5c636a', x, b - 19, 14, 7); fr('#343a40', x, b - 13, 14, 1);
  for (let i = 0; i < 4; i++) fr(Math.floor(time * 6 + i) % 3 ? '#e8590c' : '#ffa94d', x + 1 + i * 3, b - 17, 2, 2);
  glow(x + 7, b - 19, 10, '#ff922b', .14 + Math.sin(time * 9) * .03); fr('#adb5bd', x - 1, b - 21, 16, 1);
  fr('#c27a3a', x, b - 24, 14, 3); fr('#f4c27a', x + 1, b - 25, 12, 2); fr('#ffd43b', x + 4, b - 24, 4, 1); fr('#51cf66', x + 9, b - 24, 1, 1); fr('#51cf66', x + 3, b - 25, 1, 1); fr('#e03131', x + 10, b - 25, 1, 1); fr('#e03131', x + 6, b - 25, 1, 1);
}
function dlCart() {   // xe sữa đậu nành nóng: mái bạt sọc, bóng đèn treo, nồi nhôm bốc hơi, tủ kính chai sữa, bảng đỏ chữ vàng
  const x = DL_CART, b = GY, sv = props.serve > 0, ln = dlg && dlg.lines[dlg.i], talk = ln && ln[0] === 'Cô bán sữa' && dlg.shown < dlg.full.length && Math.floor(time * 8) % 2;
  for (const px of [x + 1, x + 67]) { fr('#495057', px, b - 78, 2, 34); fr('#868e96', px, b - 78, 1, 34); }
  for (let i = 0; i < 76; i += 4) fr((i >> 2) % 2 ? '#f1f3f5' : '#e03131', x - 4 + i, b - 85, 4, 7);
  fr('#ff8787', x - 4, b - 85, 76, 1); for (let i = 0; i < 76; i += 4) fr((i >> 2) % 2 ? '#dee2e6' : '#c92a2a', x - 4 + i, b - 78, 3, 2);
  fr('#3b2a2a', x + 34, b - 76, 1, 5); fr('#fff3bf', x + 33, b - 71, 3, 3); glow(x + 34, b - 69, 14, '#ffd98a', .14 + Math.sin(time * 6) * .02);
  // cô bán hàng: mũ len hồng, áo phao xanh
  const vx = x + 42, vy = b - 66;
  fr(OUT, vx - 1, vy - 1, 12, 11); fr('#f5c29a', vx, vy, 10, 9); fr('#2b1b17', vx, vy + 2, 1, 4); fr('#2b1b17', vx + 9, vy + 2, 1, 4);
  fr(OUT, vx + 2, vy + 4, 1, 2); fr(OUT, vx + 7, vy + 4, 1, 2); fr('#ff8fa3', vx + 1, vy + 6, 1, 1); fr('#ff8fa3', vx + 8, vy + 6, 1, 1); fr('#c2410c', vx + 4, vy + 6, 2, talk ? 2 : 1);
  fr(OUT, vx - 1, vy - 5, 12, 6); fr('#f783ac', vx, vy - 4, 10, 3); for (let i = 0; i < 10; i += 2) fr('#e64980', vx + i, vy - 4, 1, 3); fr('#c2255c', vx, vy - 1, 10, 2);
  fr(OUT, vx + 3, vy - 8, 4, 4); fr('#fff0f6', vx + 4, vy - 7, 2, 2);
  fr(OUT, vx - 3, vy + 9, 16, 14); fr('#4dabf7', vx - 2, vy + 10, 14, 13); fr('#339af0', vx - 2, vy + 13, 14, 1); fr('#339af0', vx - 2, vy + 17, 14, 1); fr('#1c7ed6', vx + 4, vy + 10, 1, 13); fr('#ffffff', vx + 2, vy + 10, 6, 1);
  if (sv) { fr(OUT, vx + 11, vy + 11, 22, 4); fr('#4dabf7', vx + 12, vy + 12, 20, 2); fr('#f5c29a', vx + 32, vy + 12, 2, 2); drawCup(vx + 28, vy + 6, 1, true); drawCup(vx + 33, vy + 6, 2, true); }   // chìa hai ly sữa nóng
  else { const lb = Math.round(Math.sin(time * 2.6) * 1.5); fr(OUT, vx - 14, vy + 11 + lb, 12, 4); fr('#4dabf7', vx - 13, vy + 12 + lb, 11, 2); fr('#f5c29a', vx - 15, vy + 12 + lb, 2, 2); fr('#adb5bd', vx - 15, vy + 14 + lb, 1, b - 46 - vy - 14 - lb); }   // khuấy nồi
  // nồi nhôm trên mặt quầy, hơi bốc
  fr(OUT, x + 4, b - 63, 26, 20); fr(OUT, x + 5, b - 64, 24, 1); fr('#ced4da', x + 5, b - 62, 24, 18); fr('#f1f3f5', x + 7, b - 61, 3, 16); fr('#adb5bd', x + 23, b - 61, 4, 16); fr('#f8f9fa', x + 3, b - 63, 28, 2); fr('#868e96', x + 1, b - 58, 3, 2); fr('#868e96', x + 30, b - 58, 3, 2);
  fr('#495057', x + 9, b - 52, 16, 5); fr('#f8f9fa', x + 10, b - 51, 14, 3); const t0 = pixText('SỮA', 12, '#e03131'); ctx.drawImage(t0, x + 17 - (t0.width >> 1), b - 56);
  steam(x + 10, b - 66, 1); steam(x + 18, b - 66, 2); steam(x + 25, b - 65, 3);
  for (let i = 0; i < 5; i++) { fr(OUT, x + 31, b - 45 - i * 2, 7, 1); fr('#ffffff', x + 32, b - 46 - i * 2, 5, 2); }
  fr('#a0784c', x + 58, b - 50, 6, 6); fr('#e9d8a6', x + 59, b - 54, 1, 4); fr('#e9d8a6', x + 62, b - 53, 1, 3);   // ống ống hút
  // mặt quầy inox, tủ kính: chai sữa đậu nành, sữa bắp, khay bánh bao
  fr('#adb5bd', x - 2, b - 44, 72, 2); fr('#e9ecef', x - 2, b - 44, 72, 1);
  fr('#868e96', x, b - 42, 68, 18); fr('#cfe3ef', x + 1, b - 41, 66, 16); fr('#868e96', x + 1, b - 33, 66, 1);
  for (let i = 0; i < 10; i++) { const bx = x + 3 + i * 6, c = i % 3 === 2 ? '#ffe066' : '#f3e6b8'; fr(c, bx, b - 40, 4, 6); fr(i % 3 === 2 ? '#2f9e44' : '#ffffff', bx + 1, b - 41, 2, 1); }
  for (let i = 0; i < 6; i++) { fr('#ffffff', x + 5 + i * 10, b - 30, 7, 4); fr('#e9ecef', x + 5 + i * 10, b - 27, 7, 1); fr('#dee2e6', x + 8 + i * 10, b - 30, 1, 1); }
  ctx.globalAlpha = .5; fr('#ffffff', x + 2, b - 41, 2, 16); fr('#ffffff', x + 40, b - 41, 1, 16); ctx.globalAlpha = 1;
  fr('#a61e1e', x, b - 24, 68, 14); fr('#e03131', x + 1, b - 23, 66, 12); fr('#ff6b6b', x + 1, b - 23, 66, 1);
  const t1 = pixText('SỮA ĐẬU NÀNH', 12, '#ffe066'); ctx.drawImage(t1, x + 34 - (t1.width >> 1), b - 26);
  fr('#495057', x + 2, b - 10, 64, 2); fr('#343a40', x + 4, b - 8, 1, 4); fr('#343a40', x + 63, b - 8, 1, 4);
  for (const wx of [x + 10, x + 56]) { pixCircle(wx, b - 5, 5, '#1b1b2f'); pixCircle(wx, b - 5, 3, '#868e96'); fr('#1b1b2f', wx - 1, b - 6, 2, 2); }
  // bảng giá treo cột trái
  fr('#3b2a2a', x + 2, b - 72, 1, 3); fr(OUT, x - 5, b - 70, 15, 11); fr('#f8f9fa', x - 4, b - 69, 13, 9); const t2 = pixText('10K', 12, '#c92a2a'); ctx.drawImage(t2, x + 3 - (t2.width >> 1), b - 71);
}
function dlGlobe(x, y) {   // đèn lồng kính trên cột gang; x, y = đỉnh đèn
  glow(x + 2, y + 5, 12, '#ffd98a', .15 + Math.sin(time * 5 + x) * .02);
  fr('#1b1b2f', x, y, 5, 2); fr('#1b1b2f', x - 1, y + 2, 7, 1); fr('#fff3d6', x, y + 3, 5, 6); fr('#ffe8a8', x + 3, y + 3, 2, 6); fr('#ffffff', x + 1, y + 4, 1, 3); fr('#1b1b2f', x, y + 9, 5, 1); fr('#1b1b2f', x + 2, y + 10, 1, 1);
}
function dlLamp(px) {   // cột đèn gang kiểu Pháp: đế, thân có đai, hai tay cong treo đèn, đèn đỉnh
  const b = GY;
  fr(OUT, px - 4, b - 7, 11, 7); fr('#2b2b3a', px - 3, b - 6, 9, 6); fr('#3a3a50', px - 3, b - 6, 9, 1); fr('#1b1b2f', px - 1, b - 12, 5, 5);
  fr('#1b1b2f', px, b - 78, 3, 66); fr('#3a3a50', px, b - 78, 1, 66); for (const y of [b - 30, b - 56]) fr('#1b1b2f', px - 1, y, 5, 2);
  fr('#1b1b2f', px - 11, b - 74, 25, 2); for (const s of [-1, 1]) { fr('#1b1b2f', px + 1 + s * 7, b - 72, 1, 2); fr('#1b1b2f', px + 1 + s * 6, b - 70, 1, 1); }
  for (const [lx, ly] of [[px - 12, b - 72], [px + 11, b - 72], [px - 1, b - 88]]) dlGlobe(lx, ly);
}
function dlBand() {   // đồ nghề hát rong: dây micro, thùng cajon, loa kéo led nháy theo nhịp, hộp đàn nhận tiền góp, bảng phấn
  const b = GY, on = props.song > 0;
  for (let x = 374; x < DL_AMP + 3; x++) fr('#1b1b2f', x, b + 1 + Math.round(Math.sin((x - 374) / (DL_AMP + 3 - 374) * Math.PI) * 2), 1, 1);
  const cx = 398; fr(OUT, cx - 1, b - 10, 14, 10); fr('#c9904a', cx, b - 9, 12, 9); fr('#e0aa66', cx, b - 9, 12, 1); fr('#a0703a', cx + 9, b - 8, 3, 8); fr('#2a1a10', cx + 4, b - 6, 4, 3);
  const ax = DL_AMP, beat = on && Math.floor(sceneT * (props.song === 2 ? 2.8 : 3.6)) % 2, lc = on ? ['#ff6b8b', '#74c0fc', '#b197fc', '#69db7c'][Math.floor(sceneT * 1.5) % 4] : '#3a3a50';
  fr('#adb5bd', ax + 3, b - 38, 1, 10); fr('#adb5bd', ax + 12, b - 38, 1, 10); fr('#adb5bd', ax + 3, b - 39, 10, 1);
  fr(OUT, ax - 1, b - 29, 18, 28); fr('#2b2b3a', ax, b - 28, 16, 26); fr('#3a3a50', ax, b - 28, 16, 1); fr('#1b1b2f', ax + 1, b - 4, 14, 1);
  pixCircle(ax + 8, b - 23, 2, '#1b1b2f'); fr('#868e96', ax + 8, b - 23, 1, 1);
  if (on) glow(ax + 8, b - 12, 9, lc, .14);
  pixCircle(ax + 8, b - 12, 6, lc); pixCircle(ax + 8, b - 12, 5, '#1b1b2f'); pixCircle(ax + 8, b - 12, beat ? 3 : 2, '#495057'); fr('#868e96', ax + 7, b - 13, 2, 2);
  fr('#1b1b2f', ax + 1, b - 2, 4, 2); fr('#1b1b2f', ax + 11, b - 2, 4, 2);
  // hộp đàn mở nằm trên đất, lót nhung đỏ, tiền lẻ
  const gx = DL_CASE, gy = b + 2;
  fr(OUT, gx, gy, 25, 8); fr('#343a40', gx + 1, gy + 1, 23, 6); fr('#a61e3a', gx + 2, gy + 2, 21, 4); fr('#343a40', gx + 9, gy + 1, 3, 1); fr('#343a40', gx + 9, gy + 6, 3, 1);
  for (let i = 0; i < 3 + (props.cash || 0); i++) fr(['#74c0fc', '#ffd43b', '#b2f2bb', '#ff8787', '#69db7c'][i % 5], gx + 3 + (i * 7) % 17, gy + 2 + (i % 2) * 2, 4, 2);
  // bảng phấn chân chữ A
  const sx = 446; fr('#6b4a2a', sx + 1, b - 22, 2, 22); fr('#6b4a2a', sx + 23, b - 22, 2, 22); fr(OUT, sx - 1, b - 30, 28, 22); fr('#8a5a2a', sx, b - 29, 26, 20); fr('#2b3a2e', sx + 2, b - 27, 22, 16);
  const t1 = pixText('HÁT', 12, '#f8f9fa'), t2 = pixText('RONG', 12, '#ffd8a8'); ctx.drawImage(t1, sx + 13 - (t1.width >> 1), b - 31); ctx.drawImage(t2, sx + 13 - (t2.width >> 1), b - 24);
}

/* ---- nhạc nền 8-bit khi nhóm đang hát: hợp âm rải (tam giác) + giai điệu chọn từ nốt trong hợp âm, lặp lại mỗi 4 ô nhịp ---- */
const DL_SONGS = { 1: { bpm: 112, ch: [[48, 52, 55], [43, 47, 50], [45, 48, 52], [41, 45, 48]] }, 2: { bpm: 80, ch: [[45, 48, 52], [41, 45, 48], [48, 52, 55], [43, 47, 50]] } };
let dlMus = null;
function dlMusic() {
  const s = DL_SONGS[props.song]; if (!s || muted || !AC) { dlMus = null; return; }
  const now = AC.currentTime, e8 = 30 / s.bpm;
  if (!dlMus || dlMus.song !== props.song || dlMus.t < now - .2) dlMus = { song: props.song, t: now + .05, n: 0 };
  while (dlMus.t < now + .12) { const n = dlMus.n, c = s.ch[(n >> 3) % 4], st = n % 8;
    if (st % 4 === 0) pluck(c[0], dlMus.t, .8, .05); else pluck([0, c[1] + 12, c[2] + 12, c[1] + 12][st % 4], dlMus.t, .35, .028);
    if (st === 0 || st === 3 || st === 6 || (props.song === 2 && st === 4)) pluck(c[Math.floor(rnd((n % 32) * 1.37 + props.song * 9) * 3)] + 24, dlMus.t, e8 * 2.6, .016, 'square');
    dlMus.t += e8; dlMus.n++; }
}

/* ---- cập nhật & lớp phủ: nốt nhạc bay lên, tờ tiền chú rể thả vào hộp đàn ---- */
function dlTip() { const [hx, hy] = handPt(actors.groom, 21, 0); props.tip = { t: 0, x0: hx + cam, y0: hy }; sfx('blip'); }
function dlUpdate(dt) {
  if (props.clapT > 0) props.clapT -= dt;
  props.notes = props.notes || [];
  if (props.song) { props.noteT = (props.noteT || 0) - dt;
    if (props.noteT <= 0) { props.noteT = .4 + Math.random() * .35; const s = actors['Anh hát rong'], g = actors['Anh guitar'], fromS = Math.random() < .5;
      const [x, y] = fromS && s ? [s.x - 4, GY - 42] : g ? [g.x + 2, GY - 30] : [DL_AMP + 6, GY - 32];
      props.notes.push({ x, y, t: 0, k: Math.floor(Math.random() * 8), heart: props.song === 2 && Math.random() < .45 }); } }
  for (const n of props.notes) { n.t += dt; n.y -= 15 * dt; n.x += Math.sin(n.t * 3 + n.k) * 12 * dt - 6 * dt; }
  props.notes = props.notes.filter(n => n.t < 2.4);
  if (Math.random() < dt * 3) particles.push({ x: 9 + Math.random() * 4, y: GY - 26, vx: (Math.random() - .5) * 5, vy: -10 - Math.random() * 8, life: 1.2, max: 1.2, col: '#ced4da', sz: 2, g: 0 });   // khói lò bánh tráng
  if (props.tip) { const p = props.tip; p.t += dt;
    if (p.t >= .7 && !p.done) { p.done = 1; props.cash = (props.cash || 0) + 2; sfx('ting'); burst(DL_CASE + 12, GY + 4, ['#ffd43b', '#fff3bf', '#b2f2bb'], 10, 40, .5); }
    if (p.t > 1) props.tip = null; }
  dlMusic();
}
function dlNote(x, y, n) {
  x = Math.round(x); y = Math.round(y); const c = ['#ffffff', '#ffe066', '#ffc9de', '#a5d8ff'][n.k % 4];
  if (n.heart) { fr('#ff6b8b', x, y, 2, 1); fr('#ff6b8b', x + 3, y, 2, 1); fr('#ff6b8b', x, y + 1, 5, 2); fr('#ff6b8b', x + 1, y + 3, 3, 1); fr('#ff6b8b', x + 2, y + 4, 1, 1); fr('#ffc9de', x + 1, y + 1, 1, 1); return; }
  if (n.k % 2) { fr(c, x + 3, y, 1, 5); fr(c, x + 4, y + 1, 1, 1); fr(c, x + 5, y + 2, 1, 2); fr(c, x + 1, y + 4, 3, 2); }   // ♪
  else { fr(c, x + 2, y, 5, 1); fr(c, x + 2, y, 1, 5); fr(c, x + 6, y, 1, 5); fr(c, x, y + 4, 3, 2); fr(c, x + 4, y + 4, 3, 2); }   // ♫
}
function dlOverlay() {
  for (const n of props.notes || []) { ctx.globalAlpha = Math.max(0, Math.min(1, n.t * 3, (2.4 - n.t) * 1.5)); dlNote(n.x - cam, n.y, n); }
  ctx.globalAlpha = 1;
  if (props.tip && !props.tip.done) { const p = props.tip, f = Math.min(1, p.t / .7), tx = DL_CASE + 10, ty = GY + 3, x = Math.round(p.x0 + (tx - p.x0) * f - cam), y = Math.round(p.y0 + (ty - p.y0) * f - Math.sin(f * Math.PI) * 14), w = Math.floor(p.t * 12) % 2 ? 5 : 4;
    fr(OUT, x - 1, y - 1, w + 2, 5); fr('#69db7c', x, y, w, 3); fr('#2b8a3e', x + 1, y + 1, w - 2, 1); }
}
