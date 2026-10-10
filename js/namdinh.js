/* ================== NAM ĐỊNH: NHÀ THỜ ĐỔ HẢI LÝ LÚC HOÀNG HÔN ==================
   Bố cục (toạ độ màn hình, camera đứng yên ở chương này):
   - trời 0..177: xanh → vàng → hồng; trăng non, sao đầu hôm, mây mỏng ửng hồng, diều
   - biển xa 177..ND_R: thuyền đánh cá, cọc đăng đáy, vệt nắng lấp lánh
   - kè đá dọc bờ (mặt kè y = 186): nhà tôn, nhà ống, phi lao, cột điện, máy xúc, bạt xanh, khối bê tông,
     khách tham quan; nhà thờ đổ đứng ở đầu kè, chân tháp ở ND_R
   - từ ND_R trở xuống: cát ướt soi bóng mọi thứ phía trên (gương nén 1/2, gợn lăn tăn),
     sóng bạc đầu tràn chéo vào bờ từ bên phải; bóng cô dâu chú rể cũng in xuống cát */
const ND_R = 199, ND_CH_X = 244;
const ND_LAMPS = [[63, 170], [238, 170]], ND_WIN = [[4, 177, 5, 4], [36, 162, 5, 6], [46, 173, 5, 6]];
const ND_WISP = [[0, 52, 70, 1, 1.6], [180, 40, 46, 1, 1.2], [320, 66, 58, 1, 2], [40, 124, 64, 0, 2.6], [200, 138, 40, 0, 3], [300, 118, 80, 0, 2.2], [420, 150, 52, 0, 3.4], [120, 160, 38, 0, 4], [360, 166, 30, 0, 4.4]];
const ndWire = (x0, y0, x1, y1, s) => x => { const t = (x - x0) / (x1 - x0); return Math.round(y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * s); };
const ND_WIRE = ndWire(59, 153, 143, 155, 6);
function ndSeg(x0, y0, x1, y1, c, w = 1) { const n = Math.max(1, Math.round(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)))); for (let i = 0; i <= n; i++) fr(c, x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, w, w); }

/* trời: gọi từ tripSky, vẽ thẳng vào ImageData */
function ndSky(id) {
  ditherInto(id, W, ['#3d7cc4', '#5a95d2', '#8bb8e0', '#bcd6e4', '#e5e2c4', '#f5d29e', '#f3b58c', '#e89d96'], 0, 177);
  ditherDisc(id, W, 420, 176, 10, 74, '#fff0c4', '#fad5a0');   // quầng sáng mặt trời vừa lặn
  ditherInto(id, W, ['#b3a3bd', '#8f9fc4', '#7690bb'], 177, ND_R); ditherInto(id, W, ['#7690bb', '#7690bb'], ND_R, H);
  const c = hexRGB('#f6f1da');   // trăng lưỡi liềm
  for (let y = -6; y <= 6; y++) for (let x = -6; x <= 6; x++) { if (x * x + y * y > 30 || (x - 2) ** 2 + (y + 1) ** 2 <= 24) continue; const p = ((40 + y) * W + 70 + x) * 4; id.data[p] = c[0]; id.data[p + 1] = c[1]; id.data[p + 2] = c[2]; }
}

/* ---- nhà thờ đổ (vẽ sẵn một lần, các ô cửa để trống cho thấy trời phía sau) ---- */
let ndChC = null;
function ndChurch() {
  if (ndChC) return ndChC;
  const c = document.createElement('canvas'); c.width = 112; c.height = 118; const g = c.getContext('2d');
  const R = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); }, cut = (x, y, w, h) => g.clearRect(x, y, w, h), fill = col => (x, y, w, h) => R(col, x, y, w, h);
  const arch = (fn, cx, y, w, h, ah) => { for (let j = 0; j < h; j++) { const t = Math.min(1, (j + 1) / ah), hw = Math.max(1, Math.round(w / 2 * (1 - (1 - t) * (1 - t)))); fn(cx - hw, y + j, hw * 2, 1); } };   // vòm nhọn kiểu gothic
  const B = '#9a4530', BL = '#bd613c', BH = '#d77a4c', BD = '#6c2e20', BM = '#86402b', DK = '#3e1a14', PL = '#b6a294', PD = '#998678', PH = '#d0bfb0';
  // gian giữa đổ nát bên trái tháp: tường vữa xám, mép trên vỡ lởm chởm
  const top = x => 62 + Math.round((72 - x) * .2 + Math.abs(Math.sin(x * .7)) * 3 + rnd(x + 7) * 2);
  for (let x = 1; x < 74; x++) { const t = top(x); R(PL, x, t, 1, 118 - t); R(B, x, t, 1, 2); if (rnd(x + 3) > .6) R(BD, x, t + 2, 1, 1); }
  R(PD, 1, 104, 73, 14); for (let y = 105; y < 118; y += 3) for (let x = 2 + (y % 2) * 2; x < 73; x += 6) R('#8a786c', x, y, 2, 1);   // chân tường loang ẩm
  for (const [x, y, w, h] of [[4, 76, 9, 10], [27, 98, 11, 7], [49, 70, 6, 9], [58, 100, 10, 8], [16, 108, 8, 6]]) { R(B, x, y, w, h); for (let yy = y + 1; yy < y + h; yy += 2) R(BM, x, yy, w, 1); R(BD, x, y + h, w, 1); }   // mảng vữa bong, gạch trơ ra
  for (const px of [12, 32, 52]) { const t = top(px) + 1; R(PD, px, t, 4, 118 - t); R(PH, px + 3, t, 1, 118 - t); R(BL, px, t, 4, 1); }   // trụ áp tường
  for (const cx of [23, 43, 63]) { arch(fill(BD), cx, 79, 10, 26, 6); arch(cut, cx, 80, 8, 25, 5); R(PH, cx - 5, 105, 10, 1); }   // cửa sổ vòm nhọn thủng
  for (let x = 2; x < 72; x += 5) if (rnd(x + 40) > .45) { const t = top(x); R('#5f7d3a', x, t - 1, 2, 1); R('#7a9a48', x + 1, t - 2, 1, 1); }   // cỏ dại trên đỉnh tường
  for (let i = 0; i < 16; i++) R(i % 3 ? B : BD, 2 + Math.floor(rnd(i + 70) * 70), 114 + Math.floor(rnd(i + 90) * 3), 2 + (i % 3), 2);   // gạch vụn
  R('#5a4a48', 71, 60, 3, 58);   // bóng tháp đổ lên tường
  // thân tháp chuông + hai trụ góc
  R(B, 74, 12, 32, 106); R(B, 72, 6, 6, 112); R(B, 102, 6, 6, 112);
  for (let y = 8; y < 118; y += 3) { R(BM, 72, y, 36, 1); for (let x = 72 + ((y / 3) & 1) * 3; x < 108; x += 6) R(BM, x, y + 1, 1, 2); }   // mạch vữa
  R(BD, 72, 6, 1, 112); R(BM, 73, 6, 1, 112); R(DK, 78, 8, 1, 110); R(DK, 101, 8, 1, 110);
  R(BL, 104, 6, 2, 112); R(BH, 106, 6, 1, 112); R(BL, 98, 12, 3, 106); R(BM, 79, 12, 4, 106);   // phía đón nắng chiều / phía khuất
  R(B, 73, 2, 4, 4); R(BD, 73, 2, 1, 4); R(B, 74, 0, 2, 2); R(B, 103, 3, 4, 3); R(BH, 105, 3, 1, 3); R(B, 104, 1, 2, 2);   // chóp trụ góc (bên phải đã gãy)
  R(BL, 71, 6, 8, 1); R(BL, 101, 6, 8, 1);
  for (const y of [40, 72]) { R(BH, 71, y, 38, 1); R(BL, 71, y + 1, 38, 1); R(DK, 71, y + 2, 38, 1); }   // gờ tường
  for (let x = 79; x < 101; x += 3) R(BD, x, 16, 2, 2);   // hàng răng cưa dưới đỉnh
  [2, 0, 0, 1, 3, 2, 0, 0, 0, 1, 4, 5, 3, 1, 0, 0, 1, 0, 2, 3, 1, 0].forEach((d, i) => d && cut(79 + i, 12, 1, d));   // đỉnh sứt mẻ
  // tầng chuông: ô vòm nhọn thủng, còn sót thanh chớp
  arch(fill(BL), 90, 18, 14, 21, 8); arch(fill(DK), 90, 19, 12, 20, 7); arch(cut, 90, 20, 10, 19, 7); R(BD, 85, 30, 3, 1); R(BD, 94, 26, 2, 1);
  // tầng giữa: cửa sổ thủng giữa hai ô vòm mù
  for (const cx of [82, 98]) { arch(fill(BL), cx, 49, 6, 18, 4); arch(fill(DK), cx, 50, 4, 17, 3); }
  arch(fill(BH), 90, 45, 12, 25, 6); arch(fill(BD), 90, 46, 10, 24, 5); arch(cut, 90, 48, 6, 22, 4);
  // cổng vòm lớn dưới chân tháp, nhìn xuyên ra biển
  arch(fill(BH), 90, 76, 24, 42, 12); arch(fill(BL), 90, 77, 22, 41, 11); arch(fill(BD), 90, 79, 20, 39, 10); arch(cut, 90, 81, 16, 37, 9);
  // phong hoá: gạch rơi, vệt ố, vữa sót, vết nứt, rêu cỏ và một bụi cây con mọc trên đỉnh
  for (const [x, y] of [[84, 58], [97, 66], [76, 90], [104, 100], [80, 24], [99, 34], [75, 50], [103, 82]]) R(DK, x, y, 2, 1);
  g.globalAlpha = .35; for (const [x, y, h] of [[82, 42, 9], [95, 43, 6], [88, 74, 5], [76, 74, 10], [104, 42, 7]]) R(DK, x, y + 3, 1, h); g.globalAlpha = 1;
  for (const [x, y] of [[76, 60], [100, 96], [83, 104]]) { R(PH, x, y, 2, 2); R(PL, x + 1, y + 2, 2, 1); }
  for (let i = 0; i < 8; i++) R(DK, 99 - i + (i >> 2), 47 + i * 2, 1, 2);
  for (let i = 0; i < 6; i++) R(DK, 82 + (i & 1), 92 + i * 2, 1, 2);
  for (const [x, y] of [[74, 39], [80, 39], [99, 39], [106, 71], [72, 71], [86, 71]]) { R('#5f7d3a', x, y, 3, 1); R('#7a9a48', x + 1, y - 1, 1, 1); }
  R('#3f5a2a', 94, 10, 1, 4); R('#55743a', 91, 7, 7, 3); R('#6f8f48', 92, 6, 4, 1); R('#7a9a48', 96, 8, 2, 1);
  return ndChC = c;
}

/* ---- lớp cảnh xa tĩnh: phi lao, cột điện, nhà ven kè, bạt, khối bê tông, kè đá, nhà thờ ---- */
let ndLandC = null;
function ndLand() {
  if (ndLandC) return ndLandC;
  const c = document.createElement('canvas'); c.width = W; c.height = ND_R; const g = c.getContext('2d'), R = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, h); };
  // hàng phi lao ngược sáng
  for (const [x, h] of [[12, 48], [26, 58], [62, 50], [74, 42], [94, 36], [130, 30]]) {
    R('#2e2a36', x, 186 - h * .3, 1, h * .3);
    for (let i = 0; i < h * .8; i++) { const y = 186 - h + i, w = Math.round(1 + Math.sin(i / (h * .8) * Math.PI * .95) * (3 + h * .08) + ((i * 7) % 5 === 0 ? 1 : 0));
      R(i % 5 === 0 ? '#566683' : '#3d4a60', x - w, y, w * 2 + 1, 1); if (i % 4 === 2) { R('#33405a', x - w, y + 1, 1, 3); R('#33405a', x + w, y + 1, 1, 2); } }
  }
  // cột điện & dây điện võng
  for (const [x, y] of [[58, 150], [142, 152]]) { R('#3a3644', x, y, 2, 186 - y); R('#3a3644', x - 4, y + 3, 10, 1); R('#d6d0da', x - 4, y + 2, 1, 1); R('#d6d0da', x + 5, y + 2, 1, 1); }
  for (let x = 59; x < 143; x++) { R('#2e2a36', x, ND_WIRE(x), 1, 1); R('#2e2a36', x, ND_WIRE(x) + 3, 1, 1); }
  for (let x = 40; x < 58; x++) R('#2e2a36', x, 153 + Math.round((58 - x) * .4), 1, 1);
  // nhà tôn: tường vữa, mái tôn có sóng, lưới phơi trước cửa
  R('#c6b6a8', 0, 174, 30, 12); R('#a8988c', 28, 174, 2, 12); for (let i = 0; i < 5; i++) R(i ? '#6d7488' : '#8c93a6', 0, 169 + i, 31, 1); for (let x = 1; x < 31; x += 3) R('#596078', x, 170, 1, 4);
  R('#4a3a3a', 18, 178, 5, 8); R('#6b5a4a', 3, 176, 7, 6); R('#ffd98a', 4, 177, 5, 4);
  for (let y = 181; y < 186; y++) for (let x = 2 + (y & 1); x < 16; x += 2) R('#5f7d6c', x, y, 1, 1); R('#ff922b', 6, 181, 2, 1);
  // nhà ống hai tầng: bồn nước, ban công, cửa xanh
  R('#e2d3c0', 32, 158, 24, 28); R('#c4b4a2', 32, 158, 2, 28); R('#f0e6d8', 31, 156, 26, 2); R('#b8bec6', 46, 150, 7, 6); R('#d8dde2', 46, 150, 7, 1); R('#8a8f98', 47, 156, 1, 1); R('#8a8f98', 51, 156, 1, 1);
  R('#3d4a63', 46, 162, 5, 6); R('#3d4a63', 36, 173, 5, 6); for (const [x, y, w, h] of ND_WIN.slice(1)) { R('#6b5a4a', x - 1, y - 1, w + 2, h + 2); R('#ffd98a', x, y, w, h); R('#e9b860', x, y + (h >> 1), w, 1); }
  R('#8a7a6a', 33, 170, 22, 1); for (let x = 33; x < 55; x += 2) R('#8a7a6a', x, 168, 1, 2); R('#e64980', 37, 167, 2, 1); R('#2f9e44', 37, 168, 2, 1); R('#e64980', 50, 167, 1, 1);
  R('#2b6cb0', 41, 178, 6, 8); R('#4c8ae0', 41, 178, 1, 8);
  // đống bạt xanh, bạt cam che vật liệu
  for (let j = 0; j < 7; j++) { const hw = 4 + j * 1.3; R(j < 2 ? '#5c95e6' : j === 6 ? '#22549e' : '#2f6fd0', 84 - hw, 179 + j, hw * 2, 1); } R('#d9d2c0', 80, 180, 1, 6); R('#d9d2c0', 88, 181, 1, 5);
  for (let j = 0; j < 4; j++) R(j ? '#d9661f' : '#f08a3c', 95 - j, 182 + j, 6 + j * 2, 1);
  // khối bê tông chờ kè
  for (const [x, y] of [[146, 180], [154, 180], [162, 180], [150, 174], [158, 174]]) { R('#a9a5b0', x, y, 7, 6); R('#cdc8d2', x, y, 7, 1); R('#7f7b89', x + 6, y + 1, 1, 5); }
  // kè đá: lối đi bê tông trên mặt, mái đá hộc phía trước
  R('#958f9c', 0, 186, 366, 2); R('#c4bdc6', 0, 186, 366, 1); R('#575262', 0, 188, 366, 11);
  for (let i = 0; i < 92; i++) { const x = Math.floor(i * 4.05 + rnd(i + 11) * 3) - 2, y = 188 + ((i * 5) % 3) * 3 + Math.floor(rnd(i + 31) * 2), w = 4 + Math.floor(rnd(i + 51) * 4), h = 3 + Math.floor(rnd(i + 71) * 2);
    if (x > 364) continue; R(['#6e6a78', '#7e7988', '#686374', '#8c8696'][i % 4], x, y, w, h); R('#a39dac', x + 1, y, w - 2, 1); R('#3f3a4a', x, y + h, w, 1); }
  R('#4b5a48', 0, 197, 366, 2); for (let x = 0; x < 366; x += 3) if (rnd(x + 300) > .5) R('#5f7a4a', x, 196, 2, 1);   // rêu chân kè
  for (const [x] of ND_LAMPS) { R('#3a3644', x, 168, 1, 18); R('#3a3644', x - 3, 168, 4, 1); R('#fff3bf', x - 4, 169, 2, 1); }   // cột đèn ven kè
  // nhà thờ đổ
  g.drawImage(ndChurch(), ND_CH_X, ND_R - 118);
  // bao cát, đá hộc chèn quanh chân tháp
  for (const [x, y] of [[300, 193], [307, 193], [303, 190]]) { R('#c2ad86', x, y, 7, 3); R('#d8c6a0', x, y, 7, 1); R('#9c8a66', x + 3, y + 1, 1, 2); }
  for (let i = 0; i < 18; i++) { const x = 314 + i * 3.4 + Math.floor(rnd(i + 200) * 3), h = 3 + Math.floor(rnd(i + 220) * 5); R(['#6e6a78', '#7e7988', '#686374', '#8c8696'][i % 4], x, ND_R - h, 5, h); R('#a39dac', x + 1, ND_R - h, 3, 1); }
  return ndLandC = c;
}

/* ---- người tí hon trên kè: trả về toạ độ bàn tay ---- */
function ndFolk(x, b, o) {
  x = Math.round(x); const t = time + (o.k || 0), Lg = o.kid ? 2 : 3, T = o.kid ? 3 : 4, sk = '#dcae8c', f = o.f || 1, hair = o.h || '#2b1b17';
  const walk = o.pose === 'carry' ? Math.floor(t * 4) % 2 : 0, hip = o.pose === 'sit' ? b - 1 : b - Lg, ty = hip - T, hy = ty - 3, hx = f > 0 ? x + 3 : x - 1;
  if (o.pose === 'sit') { const sw = Math.floor(t * 1.6) % 2; fr(o.p, x, hip, 3, 1); fr(o.p, x + 1, hip + 1, 1, 3 - sw); fr(o.p, x + 2, hip + 1, 1, 2 + sw); }   // ngồi mép kè đung đưa chân
  else { fr(o.p, x + walk, hip, 1, Lg); fr(o.p, x + 2 - walk, hip, 1, Lg); }
  fr(o.s, x, ty, 3, T); if (o.ao) fr(o.s, x, hip, 3, 2);
  fr(sk, x, hy, 3, 3); fr(hair, x, hy, 3, 1); fr(hair, f > 0 ? x : x + 2, hy + 1, 1, o.ao ? 3 : 1);
  if (o.hat) { fr('#e9d8a6', x - 1, hy, 5, 1); fr('#f1e3c8', x, hy - 1, 3, 1); fr('#f6ead0', x + 1, hy - 2, 1, 1); }
  if (o.pose === 'phone') { fr(o.s, hx, ty - 2, 1, 3); fr('#1b1b2f', hx, ty - 4, 1, 2); if (t % 5 < .12) glow(hx, ty - 4, 4, '#ffffff', .7); return [hx, ty - 4]; }
  if (o.pose === 'wave') { const u = Math.floor(t * 4) % 2; fr(o.s, hx, ty - 2 + u, 1, 3 - u); fr(sk, hx + (u ? 0 : f), ty - 3 + u, 1, 1); }
  if (o.pose === 'kite') { fr(o.s, hx, ty - 2, 1, 2); fr(sk, hx, ty - 3, 1, 1); return [hx, ty - 3]; }
  if (o.pose === 'hold') fr(sk, hx, ty + 2, 1, 1);
  if (o.pose === 'carry') { fr('#8a6238', x - 6, ty, 15, 1); for (const bx of [x - 6, x + 7]) { fr('#8a7a5a', bx + 1, ty + 1, 1, 3); fr('#a0784c', bx - 1, ty + 4, 5, 3); fr(bx < x ? '#ffa94d' : '#51cf66', bx, ty + 3, 3, 1); } }   // gánh hàng rong
  if (o.pose === 'fish') { const tx = hx + 14 * f, tyy = ty - 9 + Math.round(Math.sin(t * 2) * .6); ndSeg(hx, ty + 1, tx, tyy, '#6b5a4a');
    for (let i = 1; i < 12; i++) if (i % 2) fr('#e9e3ee', tx + (6 * f) * i / 12, tyy + (ND_R - 2 - tyy) * i / 12 + Math.sin(i / 12 * Math.PI) * 2, 1, 1); fr('#ff6b6b', tx + 6 * f, ND_R - 3, 1, 1); }
  return [hx, ty];
}
function ndKite([hx, hy]) {
  const kx = Math.round(126 + Math.sin(sceneT * .7) * 7), ky = Math.round(70 + Math.sin(sceneT * 1.1) * 4);
  for (let i = 1; i < 48; i += 2) { const u = i / 48; fr('#e6dbe2', hx + (kx + 3 - hx) * u, hy + (ky + 6 - hy) * u + Math.sin(u * Math.PI) * 8, 1, 1); }   // dây diều võng
  for (let i = 0; i < 12; i++) fr(i % 4 === 3 ? '#ffd43b' : '#ff8fab', kx + 3 - i * 1.4, ky + 7 + i * 1.3 + Math.sin(time * 4 - i * .7) * 2, i % 4 === 3 ? 2 : 1, 1);   // đuôi diều bay theo gió
  [1, 3, 5, 7, 5, 3, 1].forEach((w, j) => { const a = kx + 3 - (w >> 1); fr('#e03131', a, ky + j, Math.ceil(w / 2), 1); if (w > 1) fr('#ffd43b', a + Math.ceil(w / 2), ky + j, w >> 1, 1); });
  fr('#7a4a2a', kx + 3, ky + 1, 1, 5);
}
function ndFlag(x, top) {   // cờ đỏ sao vàng bay về phía đất liền
  fr('#cfc9d4', x, top, 1, 186 - top); fr('#ffd43b', x, top - 1, 1, 1);
  for (let i = 0; i < 9; i++) fr('#da2c38', x - 1 - i, top + 1 + Math.round(Math.sin(time * 5 - i * .8) * .8), 1, 6);
  const wv = Math.round(Math.sin(time * 5 - 4 * .8) * .8); fr('#ffd43b', x - 6, top + 3 + wv, 3, 1); fr('#ffd43b', x - 5, top + 2 + wv, 1, 3);
}
function ndDigger(x, b) {   // máy xúc đang gia cố kè
  const a = (Math.sin(sceneT * .7) + 1) / 2;
  fr('#2b2833', x, b - 4, 22, 4); fr('#4a4655', x + 1, b - 4, 20, 1); for (let i = 0; i < 5; i++) fr('#6b6676', x + 2 + ((i * 4 + Math.floor(sceneT * 2)) % 20), b - 2, 2, 1);
  fr('#c4561c', x + 2, b - 11, 17, 7); fr('#f08a3c', x + 2, b - 11, 17, 1); fr('#8a3a12', x + 2, b - 5, 17, 1); fr('#5a5664', x + 1, b - 10, 3, 5);
  fr('#c4561c', x + 11, b - 18, 7, 7); fr('#f08a3c', x + 11, b - 18, 7, 1); fr('#36405a', x + 12, b - 17, 5, 4); fr('#f4c6b0', x + 16, b - 17, 1, 3); fr('#2b2833', x + 5, b - 15, 1, 4);
  const ex = x + 30, ey = Math.round(b - 26 + a * 4), kx = Math.round(x + 37 - a * 3), ky = Math.round(b + 3 - a * 16);
  ndSeg(x + 17, b - 9, ex, ey, '#d9661f', 2); ndSeg(x + 18, b - 7, ex - 2, ey + 4, '#3a3640'); ndSeg(ex, ey, kx, ky, '#d9661f', 2);
  fr('#3a3640', kx - 1, ky, 5, 3); fr('#3a3640', kx, ky + 3, 1, 1); fr('#3a3640', kx + 3, ky + 3, 1, 1);
  if (a < .2) for (let i = 0; i < 3; i++) fr('#8c8696', kx - 2 + i * 3, ky + 3 + ((Math.floor(time * 8) + i) % 3), 1, 1);   // đá vụn rơi khỏi gầu
  for (let i = 0; i < 3; i++) { const p = (sceneT * .7 + i / 3) % 1; ctx.globalAlpha = .4 * (1 - p); fr('#8f8a9c', x + 5 + p * 6, b - 17 - p * 14, 2 + Math.round(p * 2), 2 + Math.round(p * 2)); } ctx.globalAlpha = 1;
}
function ndBoatFar(x, y, lit) { x = Math.round(x); y = Math.round(y + Math.sin(sceneT * 1.4 + x) * .5);
  fr('#3e3f5e', x, y, 12, 2); fr('#3e3f5e', x + 1, y + 2, 10, 1); fr('#4b4c6e', x + 3, y - 3, 5, 3); fr('#3e3f5e', x + 8, y - 7, 1, 7); fr('#3e3f5e', x + 4, y - 5, 1, 2);
  if (lit && Math.floor(time * 2 + x) % 3) fr('#ffe08a', x + 8, y - 8, 1, 1); }
function ndWisp(x, y, len, hi) { x = Math.round(x); const [a, b, c] = hi ? ['#a9b9d2', '#c8d2e0', '#e6c2c4'] : ['#f6c9b4', '#fbe2c6', '#e7a7a6'];
  fr(a, x, y, len, 1); fr(b, x + 4, y - 1, Math.round(len * .5), 1); fr(c, x + 6, y + 1, len - 10, 1); fr(a, x + len - 8, y - 1, 12, 1); }

/* ---- sinh hoạt trên kè & bầu trời (vẽ trước khi soi gương nên đều có bóng dưới cát) ---- */
function ndLife() {
  for (const [x, y] of ND_LAMPS) glow(x - 3, y, 7, '#ffd98a', .2 + Math.sin(time * 7 + x) * .02);
  for (const [x, y, w, h] of ND_WIN) glow(x + (w >> 1), y + (h >> 1), 5, '#ffd98a', .12);
  for (const bx of [96, 101]) { const by = ND_WIRE(bx), hb = Math.floor(time * .8 + bx) % 6 === 0 ? 1 : 0; fr('#2e2a36', bx, by - 3, 3, 3); fr('#2e2a36', bx + 2, by - 4 + hb, 2, 2); }   // chim sẻ đậu dây điện
  ndDigger(102, 186);
  const u = (sceneT * .018) % 2; ndFolk(14 + 214 * (u < 1 ? u : 2 - u), 186, { s: '#7b5ea7', p: '#343a40', hat: 1, pose: 'carry', k: 3, f: u < 1 ? 1 : -1 });
  ndKite(ndFolk(176, 186, { s: '#ff922b', p: '#1c7ed6', kid: 1, pose: 'kite', k: 1, f: -1 }));
  ndFlag(188, 160);
  ndFolk(194, 186, { s: '#f8f9fa', p: '#f8f9fa', ao: 1, pose: 'phone', k: 2 });   // cô áo dài trắng chụp ảnh
  ndFolk(201, 186, { s: '#4dabf7', p: '#495057', pose: 'wave', k: 4 });
  ndFolk(211, 186, { s: '#e64980', p: '#343a40', h: '#3b2a2a', ao: 1, pose: 'hold', k: 5 }); ndFolk(215, 186, { s: '#51cf66', p: '#495057', pose: 'hold', k: 6, f: -1 });
  ndFolk(226, 189, { s: '#ffd43b', p: '#1864ab', pose: 'sit', k: 7 });
  ndFolk(358, 192, { s: '#868e96', p: '#343a40', hat: 1, pose: 'fish', k: 8 });   // người câu cá trên mỏm đá
  // mòng biển đậu chóp tháp, vài con lượn quanh tháp, đàn chim bay về tổ
  const hb = Math.floor(time * .7) % 5 === 0 ? 1 : 0; fr('#f1f3f5', 346, 79, 5, 2); fr('#9aa2ad', 346, 79, 3, 1); fr('#1b1b2f', 345, 79, 1, 1); fr('#ffffff', 350, 77 + hb, 2, 2); fr('#ffd43b', 352, 78 + hb, 1, 1); fr('#e8890c', 348, 81, 1, 1);
  for (let i = 0; i < 3; i++) { const a = sceneT * .6 + i * 2.1; bird(334 + Math.cos(a) * 28 - 3, 68 + Math.sin(a) * 8, '#3e3f5e', i); }
  for (let i = 0; i < 4; i++) bird(loopX(10 + i * 3, i * 140, W + 80), 96 + i * 13 + Math.sin(sceneT * 2 + i) * 3, '#3e3f5e', i + 5);
  const fx = loopX(7, 260, W + 160) - 60; for (const [dx, dy] of [[0, 0], [-5, -3], [-10, -6], [-5, 3], [-10, 6], [-15, -9], [-15, 9]]) { const f = Math.floor(time * 6 + dx) % 2; fr('#4b4c6e', fx + dx, 52 + dy, 3, 1); fr('#4b4c6e', fx + dx - 1, 51 + dy - f, 1, 1); fr('#4b4c6e', fx + dx + 3, 51 + dy - f, 1, 1); }
}

/* ---- cát ướt: soi gương mọi thứ phía trên ND_R ---- */
function ndMirror() {
  const y1 = H - 14; fr('#86706a', 0, ND_R, W, y1 - ND_R);
  for (let y = ND_R; y < y1; y++) { const d = y - ND_R, sh = Math.round(Math.sin(y * 1.3 + sceneT * 2.2) * (.4 + d / 26));
    ctx.globalAlpha = .8 - d * .006; ctx.drawImage(cv, 0, ND_R - 1 - d * 2, W, 1, sh, y, W, 1); }
  ctx.globalAlpha = 1;
}
let ndSandC = null;
function ndSand() {   // lớp phủ cát: càng gần càng nhiều cát khô, hạt cát, vệt cát khô, gợn cát, vỏ sò, rong biển
  if (ndSandC) return ndSandC;
  const h = H - ND_R, c = document.createElement('canvas'); c.width = W; c.height = h; const g = c.getContext('2d'), id = g.createImageData(W, h), D = id.data;
  const put = (x, y, col, a) => { if (x < 0 || x >= W || y < 0 || y >= h) return; const p = (y * W + x) * 4, v = hexRGB(col); D[p] = v[0]; D[p + 1] = v[1]; D[p + 2] = v[2]; D[p + 3] = a; };
  for (let y = 0; y < h; y++) for (let x = 0; x < W; x++) { const th = (BAYER[y & 3][x & 3] + .5) / 16, n = rnd(x * 7.3 + y * 131.1);
    if (n < .025) put(x, y, '#c4ab95', 150); else if (n > .975) put(x, y, '#463640', 120); else if (y / h * .55 > th) put(x, y, '#5b4651', 70 + y); }
  for (let y = 2; y < h; y += 2) for (let i = 0; i < 6; i++) { if (rnd(y * 13 + i) > .5) continue; const x0 = Math.floor(rnd(y * 17 + i) * W), len = 4 + Math.floor(rnd(y * 19 + i) * 14); for (let k = 0; k < len; k++) put(x0 + k, y, '#a58b78', 80 + y); }
  for (let y = 26; y < h; y += 5) for (let x = 0; x < W; x++) if ((x + y * 3) % 11 < 6) put(x, y + Math.round(Math.sin(x * .3 + y)), '#6d5560', 60);
  for (let i = 0; i < 44; i++) { const x = Math.floor(rnd(i + 600) * W), y = 3 + Math.floor(rnd(i + 650) * (h - 4)), col = ['#f4efe7', '#f2cfc6', '#d7d2dc', '#efe3c8'][i % 4]; put(x, y, col, 255); if (i % 3) put(x + 1, y, col, 255); put(x, y + 1, '#4a3a44', 150); }
  for (let i = 0; i < 8; i++) { const x = Math.floor(rnd(i + 820) * W), y = 6 + Math.floor(rnd(i + 840) * (h - 8)); for (let k = 0; k < 4; k++) put(x + k, y + (k & 1), '#3f5a3a', 220); }
  g.putImageData(id, 0, 0); return ndSandC = c;
}
function ndPools() {   // vũng nước đọng lấp loáng
  for (const [cx, cy, rx, ry] of [[160, 208, 14, 1], [58, 244, 22, 2], [318, 250, 30, 2], [262, 232, 16, 1]]) {
    ctx.globalAlpha = .2; for (let y = -ry; y <= ry; y++) { const w = Math.round(rx * Math.sqrt(1 - (y / (ry + .5)) ** 2)); fr('#eef0fa', cx - w, cy + y, w * 2 + 1, 1); }
    ctx.globalAlpha = .7; fr('#ffffff', cx + Math.round(Math.sin(time * 1.5 + cx) * rx * .5) - 2, cy, 4, 1); ctx.globalAlpha = 1; }
}

/* ---- sóng tràn chéo vào bờ: dâng nhanh, rút chậm, để lại ngấn bọt và mặt cát bóng nước ---- */
const ndWash = () => { const ph = (sceneT / 5) % 1; return [ph, ph < .3 ? 18 * Math.sin(ph / .3 * Math.PI / 2) : 18 * Math.cos((ph - .3) / .7 * Math.PI / 2)]; };
const ndEdge = (x, x0) => ND_R + (x - x0) * .34 + Math.sin(x * .19 + sceneT * 2.4) * 1.2;
function ndSurf() {
  const [ph, wash] = ndWash(), x0 = 362 - wash, y1 = H - 14, fade = ph > .3 ? 1 - (ph - .3) / .7 : 0;
  for (let x = Math.floor(x0); x < W; x++) {
    const e = Math.round(ndEdge(x, x0)), em = Math.round(ND_R + (x - 344) * .34);
    if (em > e + 1 && em < y1) { ctx.globalAlpha = .16; fr('#e8edf6', x, e + 1, 1, em - e); ctx.globalAlpha = .35; fr('#4f3d48', x, em + 1, 1, 1); if (fade && rnd(x * .37) > .55) { ctx.globalAlpha = fade; fr('#f1f5fb', x, em, 1, 1); } ctx.globalAlpha = 1; }
    if (e <= ND_R) continue; const b = Math.min(e, y1), dep = b - ND_R;
    fr('#7d93bb', x, ND_R, 1, dep); fr('#91a7cb', x, Math.max(ND_R, b - 7), 1, Math.min(dep, 7));
    for (let k = 1; k < 5; k++) { const y = Math.round(e - (k * 8 - (sceneT * 5) % 8)); if (y <= ND_R || y >= y1) continue; if (rnd(((x + k * 37) / 3 | 0) + Math.floor(sceneT * 5 / 8 + k) * 13) > .42) fr(k < 2 ? '#f1f5fb' : '#cbd8ec', x, y, 1, 1); }
    if (e >= y1) continue;
    fr('#ffffff', x, e - 1, 1, 2); const n = rnd(x * 1.7 + Math.floor(sceneT * 3)); if (n > .45) fr('#ffffff', x, e - 3, 1, 2); if (n > .75) fr('#e3ebf6', x, e - 5, 1, 1); if (rnd(x * 3.1 + Math.floor(sceneT * 4)) > .8) fr('#f1f5fb', x, e + 1, 1, 1);
  }
  for (let i = 0; i < 14; i++) { const p = Math.floor(time * 5 + i * 3.7) % 7; if (p > 1) continue; const x = 372 + Math.floor(rnd(i + 700) * 106), y = ND_R + 1 + Math.floor(rnd(i + 760) * 16);
    if (y < ndEdge(x, x0) - 3) { fr('#ffffff', x, y, 1, 1); if (!p) { fr('#ffffff', x - 1, y, 3, 1); fr('#ffffff', x, y - 1, 1, 3); } } }
}
function ndClammer() {   // người cào ngao lội nước, thúng nổi bên cạnh
  const x = Math.round(418 + Math.sin(sceneT * .12) * 12), y = 211, r = Math.round(Math.sin(sceneT * 2.2) * 2), bob = Math.round(Math.sin(sceneT * 1.8));
  fr('#6b5236', x - 14, y - 3 + bob, 8, 3); fr('#8a7250', x - 15, y - 4 + bob, 10, 1); fr('#e9dcc4', x - 12, y - 5 + bob, 2, 1); fr('#d8c8a8', x - 9, y - 5 + bob, 2, 1);
  fr('#3b4a6b', x, y - 5, 2, 5); fr('#3b4a6b', x + 3, y - 5, 2, 5); fr('#5f86b8', x, y - 11, 5, 6); fr('#4a6e9c', x, y - 11, 1, 6); fr('#d6a27c', x + 3, y - 14, 3, 3);
  fr('#e9d8a6', x, y - 15, 9, 1); fr('#f1e3c8', x + 2, y - 16, 5, 1); fr('#f6ead0', x + 4, y - 17, 1, 1);
  ndSeg(x + 4, y - 9, x + 8 + r, y - 6, '#5f86b8'); fr('#d6a27c', x + 8 + r, y - 7, 2, 2); ndSeg(x + 9 + r, y - 6, x + 18 + r, y + 1, '#8a6238'); fr('#5a4636', x + 17 + r, y, 3, 2);
  ctx.globalAlpha = .7; const w = Math.floor(sceneT * 2) % 3; fr('#eef3fa', x - 2 - w, y, 9 + w * 2, 1); fr('#eef3fa', x + 15 + r, y + 2, 6, 1); fr('#eef3fa', x - 16 - w, y + bob, 12 + w * 2, 1); ctx.globalAlpha = 1;
}

/* ---- bãi cát phía sau lối đi: thuyền nan sơn xanh có mắt, ông lão vá lưới, biển tên ---- */
let ndBoatC = null;
function ndBoatImg() {
  if (ndBoatC) return ndBoatC;
  const c = document.createElement('canvas'); c.width = 50; c.height = 15; const g = c.getContext('2d'), R = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  R('#6b4a2a', 31, 0, 1, 8); R('#e03131', 32, 0, 4, 3); R('#ffd43b', 33, 1, 1, 1);
  R('#4f6e5e', 10, 4, 18, 4); R('#6f8f7d', 12, 3, 13, 2); for (let i = 0; i < 4; i++) R('#ff922b', 12 + i * 4, 4 + (i % 2), 2, 2); R('#8a6238', 4, 5, 26, 1);
  [[2, 47], [1, 48], [2, 47], [3, 46], [4, 45], [6, 43], [9, 40], [13, 36]].forEach(([a, b], j) => R(['#e9ecef', '#2a6db5', '#2a6db5', '#2a6db5', '#c92a2a', '#5a2a1a', '#4a2214', '#3a1a10'][j], a, 7 + j, b - a + 1, 1));
  R('#2a6db5', 45, 3, 4, 5); R('#e9ecef', 45, 3, 4, 1); R('#2a6db5', 0, 5, 3, 3); R('#e9ecef', 0, 5, 3, 1);
  for (let x = 8; x < 40; x += 7) R('#1f5a99', x, 9, 1, 3); R('#ffffff', 40, 9, 4, 2); R('#1b1b2f', 42, 9, 1, 2);   // đường ván, mắt thuyền
  const f = document.createElement('canvas'); f.width = 50; f.height = 15; const fg = f.getContext('2d'); fg.scale(1, -1); fg.drawImage(c, 0, -15);
  return ndBoatC = [c, f];
}
function ndBeach() {
  const [bc, bf] = ndBoatImg(); ctx.globalAlpha = .22; ctx.drawImage(bf, 16, 215, 50, 7); ctx.globalAlpha = 1; ctx.drawImage(bc, 16, 200);
  for (let y = 211; y < 215; y++) for (let x = 70 + (y & 1); x < 102; x += 2) fr(y === 211 ? '#7e9a88' : '#5f7a6a', x, y, 1, 1); fr('#ff922b', 72, 212, 2, 2); fr('#ff922b', 98, 211, 2, 2);
  const hx = Math.round(Math.sin(time * 3) * 1.5);
  fr('#3b4a6b', 84, 211, 6, 2); fr('#b08a62', 80, 204, 5, 7); fr('#957250', 80, 204, 1, 7); fr('#d6a27c', 81, 201, 4, 3);
  fr('#e9d8a6', 79, 200, 8, 1); fr('#f1e3c8', 81, 199, 4, 1); fr('#f6ead0', 82, 198, 2, 1);
  fr('#b08a62', 85, 206, 3, 1); fr('#d6a27c', 87 + hx, 207, 2, 2); fr('#e9ecef', 89 + hx, 206, 1, 2);
  fr('#4a3020', 123, 204, 2, 13); fr('#4a3020', 143, 204, 2, 13); fr('#2e1e14', 117, 194, 34, 13); fr('#8a5a36', 118, 195, 32, 11); fr('#a87048', 118, 195, 32, 1);
  const t = pixText('Hải Lý', 12, '#fff3bf'); ctx.drawImage(t, 134 - (t.width >> 1), 192);
}

/* ---- toàn cảnh ---- */
function ndScene() {
  for (let i = 0; i < 14; i++) if ((Math.floor(time * 1.5) + i * 5) % 9) fr(i % 4 ? '#e9eefc' : '#fff3bf', Math.floor(rnd(i + 500) * W), 17 + Math.floor(rnd(i + 540) * 46), 1, 1);
  for (const [off, y, len, hi, sp] of ND_WISP) ndWisp(loopX(sp, off, W + 160) - 60, y, len, hi);
  fr('#e2c0c4', 0, 177, W, 1); waves(179, ND_R, ['#a6b6d6', '#c9cde2', '#6a82b0'], 4, 61);
  for (let i = 0; i < 26; i++) { const p = Math.floor(time * 4 + i * 2.3) % 6; if (p > 2) continue; fr(p ? '#ffe7c2' : '#fff6e0', 360 + Math.floor(rnd(i + 900) * 110) - p, 178 + Math.floor(rnd(i + 950) * 20), 2 + p * 2, 1); }   // vệt nắng chiều trên mặt biển
  for (let i = 0; i < 9; i++) { const sx = 376 + i * 11 + (i % 2) * 3, tp = 180 + (i % 3); fr('#4a4058', sx, tp, 1, 191 - tp); if (i < 8) for (let j = 0; j < 10; j += 2) fr('#7a7090', sx + 1 + j, tp + 3 + (j >> 2), 1, 1); }   // cọc đăng đáy
  ndBoatFar(392, 175, 1); ndBoatFar(440, 176, 1); ndBoatFar(loopX(1.4, 380, W + 80), 174, 0);
  ctx.drawImage(ndLand(), 0, 0); ndLife();
  ndMirror(); ctx.drawImage(ndSand(), 0, ND_R); ndPools();
  ndSurf(); ndClammer(); ndBeach();
}
/* lối đi trước mặt: dấu chân, cua ma và lỗ cua, mòng biển kiếm ăn */
function ndGround() {
  for (const p of props.ndPrints || []) { const a = Math.max(0, .6 - p.t * .015); if (!a) continue; ctx.globalAlpha = a; fr('#3a2834', p.x - cam, GY + (p.s ? 1 : 3), 2, 1); } ctx.globalAlpha = 1;
  for (const c of props.ndCrabs || []) { const hx = Math.round(c.hx - cam); fr('#3a2a34', hx, c.y, 3, 1); fr('#b59a86', hx - 2, c.y, 1, 1); fr('#b59a86', hx + 4, c.y - 1, 1, 1);
    if (c.hide <= 0) { const x = Math.round(c.x - cam), y = c.y; fr('#e9d6b8', x, y - 2, 5, 2); fr('#cdb593', x, y - 1, 5, 1); for (const lx of [-1, 1, 3, 5]) fr('#cdb593', x + lx, y, 1, 1); fr('#1b1b2f', x + 1, y - 3, 1, 1); fr('#1b1b2f', x + 3, y - 3, 1, 1); } }
  const gx = 318 + Math.sin(sceneT * .25) * 26, d = Math.cos(sceneT * .25) > 0 ? 1 : -1, peck = Math.floor(sceneT * 1.3) % 3 === 0;
  ctx.globalAlpha = .25; ndGull(gx - cam, 238, d, peck, true); ctx.globalAlpha = 1; ndGull(gx - cam, 238, d, peck, false);
}
function ndGull(x, y, d, peck, flip) {
  x = Math.round(x); const P = (i, j, w, h, c) => fr(c, d > 0 ? x + i : x - i - w + 1, flip ? y - j - h : y + j, w, h);
  P(0, -2, 1, 2, '#e8890c'); P(2, -2, 1, 2, '#e8890c'); P(-3, -6, 7, 4, '#f8f9fa'); P(-2, -7, 5, 2, '#adb5bd'); P(-4, -6, 2, 2, '#1b1b2f'); P(-1, -3, 4, 1, '#dee2e6');
  if (peck) { P(4, -5, 3, 3, '#ffffff'); P(7, -4, 2, 1, '#ffd43b'); P(5, -5, 1, 1, '#1b1b2f'); }
  else { P(3, -9, 3, 3, '#ffffff'); P(3, -7, 2, 2, '#ffffff'); P(5, -8, 1, 1, '#1b1b2f'); P(6, -8, 2, 1, '#ffd43b'); P(7, -7, 1, 1, '#e03131'); }
}
/* bóng cô dâu chú rể in xuống cát ướt: so ảnh trước/sau khi vẽ nhân vật để lấy đúng điểm ảnh của họ */
function ndMirrorActors(draw) {
  const n = H - 15 - GY, y0 = GY - n + 1, A = ctx.getImageData(0, y0, W, n).data; draw();
  const B = ctx.getImageData(0, y0, W, n).data, G = ctx.getImageData(0, GY + 1, W, n), D = G.data;
  for (let r = 0; r < n; r++) { const gr = n - 1 - r, a = .34 - gr * .006, sh = Math.round(Math.sin(gr * 1.1 + time * 3) * Math.min(1.5, gr / 12));
    for (let x = 0; x < W; x++) { const p = (r * W + x) * 4; if (A[p] === B[p] && A[p + 1] === B[p + 1] && A[p + 2] === B[p + 2]) continue;
      const tx = x + sh; if (tx < 0 || tx >= W) continue; const q = (gr * W + tx) * 4;
      D[q] += (B[p] * .9 - D[q]) * a; D[q + 1] += (B[p + 1] * .85 - D[q + 1]) * a; D[q + 2] += (B[p + 2] * .95 - D[q + 2]) * a; } }
  ctx.putImageData(G, 0, GY + 1);
}
function ndUpdate(dt) {
  const pr = props.ndPrints = props.ndPrints || [];
  for (const a of Object.values(actors)) { if (a._pl == null || a.target == null || a.hop) { a._pl = a.x; continue; }
    if (Math.abs(a.x - a._pl) >= 6) { a._pl = a.x; a._ps = !a._ps; pr.push({ x: Math.round(a.x + 5), s: a._ps, t: 0 }); } }
  for (const p of pr) p.t += dt; if (pr.length > 90) pr.shift();
  const cr = props.ndCrabs = props.ndCrabs || [[110, 207], [292, 214], [272, 244], [40, 250]].map(([x, y]) => ({ x, y, hx: x, d: 1, run: 0, hide: 0 }));
  for (const c of cr) { if (c.hide > 0) { c.hide -= dt; continue; }
    if (c.run > 0) c.run -= dt; else if (Math.random() < .006) { c.run = .4 + Math.random() * .6; c.d = Math.random() < .5 ? -1 : 1; }
    c.x += c.d * (c.run > 0 ? 46 : 3) * dt; if (Math.abs(c.x - c.hx) > 30) c.d = Math.sign(c.hx - c.x);
    if (c.run <= 0 && Math.abs(c.x - c.hx) < 2 && Math.random() < .004) c.hide = 2 + Math.random() * 3; }
  const [ph] = ndWash();   // sóng đập vào chân kè tung bọt
  if (ph > .22 && ph < .3 && !props.ndSpl) { props.ndSpl = 1; for (let i = 0; i < 14; i++) particles.push({ x: cam + 352 + Math.random() * 14, y: 194 + Math.random() * 3, vx: (Math.random() - .5) * 34, vy: -35 - Math.random() * 55, life: .8 + Math.random() * .4, max: 1.2, col: i % 3 ? '#ffffff' : '#dfe8f3', sz: i % 4 ? 1 : 2, g: 150 }); }
  if (ph > .5) props.ndSpl = 0;
}
