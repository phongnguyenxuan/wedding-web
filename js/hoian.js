/* ================== HỘI AN: PHỐ ĐÈN LỒNG BÊN SÔNG HOÀI ==================
   Bố cục (toạ độ màn hình, camera đứng yên ở chương này) – theo ảnh chụp phố cổ lúc lên đèn:
   - trời: giờ xanh, xanh coban thẫm; mái nhà & tán cây phía xa in bóng
   - bờ bên kia: dãy nhà tường vàng rêu phong (HA_HOUSES), mái ngói âm dương, tầng trên ban công gỗ / cửa chớp xanh /
     mặt tiền gỗ ô vuông treo đèn tròn trắng; tầng trệt cửa hàng mở toang sáng đèn, biển sơn mài chữ vàng, hàng đèn lồng
     lụa dưới hiên; phố ven sông HA_ST..HA_KE có người đội nón lá đi dạo, cô bán hoa đạp xe, xe đạp dựng
   - sông HA_W0..HA_W1: soi bóng dãy nhà thành mảng vàng, vệt đèn lồng lấp loá, ghe gỗ của các cô bán hoa đăng, hoa đăng trôi
   - bờ gần: kè đá, lối đi lát đá, cột đèn lồng, xe nước Mót (HA_CART) có chị bán hàng & giàn hoa giấy */
const HA_ST = 160, HA_KE = 168, HA_W0 = 172, HA_W1 = 216, HA_CART = 290, HA_POSTS = [130, 452];
/* [x, rộng, kiểu, lệch cao, biển hiệu] – a ban công gỗ cửa lá sách, b cửa sổ chớp xanh, c mặt tiền gỗ ô vuông, d nhà một tầng tường cao */
const HA_HOUSES = [[-8, 64, 'b', 4, 'LỤA'], [56, 80, 'a', -2, 'ĐÈN LỒNG'], [136, 66, 'd', 0, 'TRÀ'], [202, 98, 'c', -6, 'MAY ĐO'], [300, 66, 'a', 2, 'GỐM'], [366, 52, 'd', 3, 'TRANH'], [418, 70, 'b', -3, 'CÀ PHÊ']];
/* đèn lồng lụa [màu, sáng] – đỏ là chủ đạo như ảnh */
const HA_LC = [['#d9263a', '#ff7a7a'], ['#e8590c', '#ffa94d'], ['#f2b705', '#ffe28a'], ['#d9263a', '#ff7a7a'], ['#e64980', '#ffa8c8'], ['#2f9e44', '#8ce99a'], ['#d9263a', '#ff7a7a'], ['#1c7ed6', '#74c0fc']];
const haEave = ([, , t, dy]) => (t === 'd' ? 110 : 86) + dy + 12;
const HA_LAMPS = [], HA_GLOBES = [];   // [x, y, k]: đèn lồng dưới hiên, đèn tròn trắng tầng trên
HA_HOUSES.forEach((h, k) => { const [x, w, t, , name] = h, cx = x + (w >> 1), half = name.length * 3 + 10;
  for (let lx = x + 4; lx < x + w - 8; lx += 10) if (Math.abs(lx + 3 - cx) > half) HA_LAMPS.push([lx, 134, k * 5 + (lx + 14) % 7]);
  if (t === 'a' || t === 'c') for (let gx = x + 7; gx < x + w - 5; gx += 9) HA_GLOBES.push([gx, haEave(h) + 3, gx]); });
const HA_STREAK = [...HA_LAMPS.map(([x, , k]) => [x + 3, HA_LC[k % 8][1], 2]), ...HA_GLOBES.map(([x]) => [x, '#fff3d6', 1])];
/* hoa đăng trôi: [lệch, y mặt nước, tốc độ, k] */
const HA_FLOAT = Array.from({ length: 15 }, (_, i) => [rnd(i * 3.3 + 1) * (W + 60), 182 + Math.floor(rnd(i * 7.1 + 2) * 32), 1.2 + rnd(i * 1.9) * 2.2, i]);
/* ghe đậu giữa sông như ảnh: x, mặt nước, hướng, áo người chèo */
const HA_BOATS = [{ x: 24, y: 204, d: 1, shirt: '#f1f3f5', k: 0 }, { x: 78, y: 209, d: 1, shirt: '#3d6a9a', k: 1 }, { x: 128, y: 201, d: -1, shirt: '#6b8f3a', k: 2 }];

function haSky(id) {
  ditherInto(id, W, ['#060e30', '#0a1844', '#10235c', '#173174', '#20408c', '#2b4f9e'], 0, 120);
  ditherInto(id, W, ['#2b4f9e', '#3558a4'], 120, HA_W0); ditherInto(id, W, ['#05181e', '#05181e'], HA_W0, H);
}

/* mái ngói âm dương nhìn chính diện: dải ngói ống dọc, hàng ngói ngang, rêu, bờ nóc vểnh hai đầu đao.
   R(màu, x, y, w, h) vẽ vào canvas đích – dùng chung cho nhà phố cổ (vẽ sẵn) và mái xe nước Mót (vẽ mỗi khung) */
function haRoof(R, x0, x1, y0, y1, k) {
  for (let y = y0; y < y1; y++) { const ins = Math.round((y1 - 1 - y) / (y1 - y0) * 3), a = x0 - 3 + ins, b = x1 + 3 - ins, row = (y - y0) % 4 === 3;
    R(row ? '#2a2220' : '#3a2f2b', a, y, b - a, 1);
    for (let x = a; x < b - 2; x += 3) { R(row ? '#4a3c36' : '#56463e', x, y, 1, 1); R('#221a18', x + 2, y, 1, 1); } }
  for (let i = 0; i < (x1 - x0) / 5; i++) if (rnd(k * 13 + i) > .65) R(i % 2 ? '#3f4a2c' : '#4e5a34', x0 + Math.floor(rnd(k * 7 + i) * (x1 - x0)), y0 + 2 + Math.floor(rnd(k * 5 + i) * (y1 - y0 - 3)), 2, 1);   // rêu
  R('#4a3c36', x0, y0 - 2, x1 - x0, 2); R('#6a5a50', x0, y0 - 2, x1 - x0, 1);   // bờ nóc
  R('#4a3c36', x0 - 2, y0 - 3, 3, 2); R('#4a3c36', x1 - 1, y0 - 3, 3, 2); R('#6a5a50', x0 - 3, y0 - 4, 2, 1); R('#6a5a50', x1 + 1, y0 - 4, 2, 1);   // đầu đao vểnh
  R('#5a4a40', x0 - 3, y1 - 1, x1 - x0 + 6, 1); R('#16100e', x0 - 3, y1, x1 - x0 + 6, 1);   // mép ngói, bóng dưới hiên
}
/* lan can gỗ ban công: tay vịn, song tiện, hoa văn chữ công */
function haRail(R, a, b, y) {
  R('#8a5a2a', a, y, b - a, 1); R('#5a3418', a, y + 6, b - a, 1);
  for (let x = a + 1; x < b - 2; x += 4) { R('#6b3f1c', x, y + 1, 1, 5); R('#6b3f1c', x + 1, y + 3, 3, 1); R('#9a6a3a', x + 2, y + 2, 1, 1); R('#9a6a3a', x + 2, y + 4, 1, 1); }
}
/* hàng hoá trong cửa hàng tầng trệt theo biển hiệu */
function haGoods(R, ox, oy, ow, oh, name, k) {
  const r = i => rnd(k * 23 + i), back = oy + oh;
  if (name === 'ĐÈN LỒNG') for (let j = 0; j < 3; j++) for (let i = ox + 5; i < ox + ow - 6; i += 5) { const c = HA_LC[Math.floor(r(i + j * 50) * 8)][0]; R(c, i, oy + 4 + j * 6, 4, 3); R('#ffe8a3', i + 1, oy + 4 + j * 6, 1, 1); }
  else if (name === 'MAY ĐO' || name === 'LỤA') { for (let i = ox + 5; i < ox + ow - 5; i += 3) R(['#c92a2a', '#1971c2', '#2f9e44', '#e64980', '#f08c00', '#7048e8', '#f1f3f5'][Math.floor(r(i) * 7)], i, oy + 3, 2, 10 + Math.floor(r(i + 9) * 6));
    for (const mx of [ox + 6, ox + ow - 13]) { R('#3a2a2a', mx + 2, oy + 3, 3, 3); R(name === 'LỤA' ? '#f08c00' : '#e64980', mx, oy + 6, 7, 8); R(name === 'LỤA' ? '#c2410c' : '#a61e4d', mx + 1, oy + 14, 5, 5); R('#3a2a2a', mx + 3, oy + 19, 1, oh - 19); } }   // ma-nơ-canh mặc áo dài
  else if (name === 'TRÀ' || name === 'CÀ PHÊ') for (let i = ox + 9; i < ox + ow - 10; i += 15) { R('#7a3e1a', i, back - 8, 9, 2); R('#7a3e1a', i + 1, back - 6, 1, 6); R('#7a3e1a', i + 7, back - 6, 1, 6); R('#ffffff', i + 3, back - 10, 2, 2); R('#5a2a12', i - 4, back - 13, 3, 3); R('#5a2a12', i - 4, back - 10, 3, 10); }   // bàn trà, khách ngồi
  else if (name === 'GỐM') for (let j = 0; j < 2; j++) { R('#7a4520', ox + 4, oy + 9 + j * 8, ow - 8, 1); for (let i = ox + 6; i < ox + ow - 8; i += 6) { const c = ['#b0603a', '#2f6f9a', '#5a8a5a', '#c9a27a'][Math.floor(r(i + j) * 4)]; R(c, i, oy + 4 + j * 8, 4, 5); R(c, i + 1, oy + 3 + j * 8, 2, 1); } }
  else if (name === 'TRANH') for (let i = ox + 5; i < ox + ow - 9; i += 11) { R('#5a3418', i, oy + 4, 9, 11); R(['#4dabf7', '#ffd43b', '#e64980', '#51cf66'][Math.floor(r(i) * 4)], i + 1, oy + 5, 7, 9); R('#e9b84a', i + 1, oy + 10, 7, 4); }
  if (k % 2) { const px = ox + (ow >> 1) + 6; R('#5a2a12', px, back - 14, 4, 4); R(['#e03131', '#1971c2', '#f1f3f5'][k % 3], px - 1, back - 10, 6, 7); R('#5a2a12', px, back - 3, 4, 3); }   // người bán trong cửa hàng
}
function haHouse(R, h, k) {
  const [x, w, t, dy, name] = h, two = t !== 'd', eave = haEave(h), ridge = eave - 12, x1 = x + w, wall = ['#e0a538', '#e6ae40', '#d99e34'][k % 3];
  // tường vàng rêu phong, chân tường ẩm mốc
  R(wall, x, eave, w, HA_ST - eave); R('#a87424', x, eave, 1, HA_ST - eave); R('#f2c460', x + 1, eave, 1, HA_ST - eave);
  for (let i = 0; i < 14; i++) R(i % 3 ? '#c99030' : '#b8822a', x + 2 + Math.floor(rnd(k * 31 + i) * (w - 6)), eave + 2 + Math.floor(rnd(k * 17 + i * 3) * (HA_ST - eave - 6)), 2 + (i % 3), 1 + (i % 2));
  R('#a07a34', x, HA_ST - 5, w, 5); for (let i = 0; i < w; i += 3) if (rnd(k * 9 + i) > .5) R('#7a6a30', x + i, HA_ST - 6 - Math.floor(rnd(i + k) * 3), 2, 2);
  haRoof(R, x + 3, x1 - 3, ridge, eave, k);
  if (two) {
    const u0 = eave + 2, u1 = 124;
    if (t === 'a') {
      R('#3a200e', x + 4, u0, w - 8, u1 - u0);
      const n = Math.floor((w - 10) / 10), m = (w - 10 - n * 10) >> 1;
      for (let i = 0; i < n; i++) { const dx = x + 5 + m + i * 10;
        if ((i + k) % 3 === 1) { R('#ffcf72', dx + 1, u0 + 2, 8, u1 - u0 - 3); R('#f2a24a', dx + 1, u1 - 7, 8, 6); R('#7a4520', dx, u0 + 2, 1, u1 - u0 - 3); }   // cửa mở, đèn trong nhà
        else { R('#7a4520', dx, u0 + 2, 9, u1 - u0 - 3); for (let yy = u0 + 3; yy < u1 - 1; yy += 2) R('#5a3014', dx + 1, yy, 7, 1); R('#9a5a2a', dx + 4, u0 + 2, 1, u1 - u0 - 3); } }   // cửa lá sách
      R('#4a2a14', x + 3, u0, 2, u1 - u0); R('#4a2a14', x1 - 5, u0, 2, u1 - u0);
      haRail(R, x + 2, x1 - 2, u1 - 6);
    } else if (t === 'b') {
      for (const wx of [x + Math.round(w * .25) - 5, x + Math.round(w * .75) - 5]) { const wy = u0 + 4, lit = rnd(k * 5 + wx) > .3;
        R('#f2e2b0', wx - 1, wy - 1, 12, 15); R(lit ? '#ffcf72' : '#3a2a2a', wx, wy, 10, 13); if (lit) R('#f2a24a', wx, wy + 8, 10, 5); R('#5a3014', wx + 4, wy, 2, 13); R('#5a3014', wx, wy + 6, 10, 1);
        for (const sx of [wx - 5, wx + 11]) { R('#2f6f9a', sx, wy - 1, 4, 15); for (let yy = wy; yy < wy + 13; yy += 2) R('#24587a', sx, yy, 4, 1); R('#4a8fbf', sx, wy - 1, 4, 1); }   // cửa chớp xanh mở
        R('#c9b48a', wx - 2, wy + 13, 14, 1); for (let i = 0; i < 6; i++) R(i % 2 ? '#2b8a3e' : '#e64980', wx - 1 + i * 2, wy + 11 - (i % 2), 2, 2); }   // bậu cửa, chậu hoa
    } else {
      R('#5a3418', x + 2, u0, w - 4, u1 - u0); R('#7a4a22', x + 2, u0, w - 4, 1);
      for (let wx = x + 6; wx < x1 - 16; wx += 16) { R('#2a1608', wx - 1, u0 + 2, 14, 12); R('#ffd27a', wx, u0 + 3, 12, 10); R('#f2a24a', wx, u0 + 9, 12, 4);
        for (let i = 3; i < 12; i += 3) R('#5a3418', wx + i, u0 + 3, 1, 10); for (let j = 3; j < 10; j += 3) R('#5a3418', wx, u0 + 3 + j, 12, 1); }   // cửa sổ ô vuông
      haRail(R, x + 2, x1 - 2, u1 - 6);
    }
    haRoof(R, x + 1, x1 - 1, 126, 131, k + 20);   // mái hiên tầng trệt
  } else {
    for (let i = x + 8; i < x1 - 10; i += 12) { R('#b07a26', i, eave + 5, 7, 7); R('#7a4a1a', i + 1, eave + 6, 5, 5); R(wall, i + 3, eave + 6, 1, 5); R(wall, i + 1, eave + 8, 5, 1); }   // ô thoáng
    for (let i = 0; i < 40; i++) { const px = x + 2 + Math.floor(rnd(k * 41 + i) * 26), py = eave - 2 + Math.floor(rnd(k * 43 + i) * (6 + (i % 4) * 5)); R(i < 14 ? '#2b6a3a' : ['#d6336c', '#f06595', '#c2255c', '#ff8fab'][i % 4], px, py, 2, 2); }   // hoa giấy rủ từ mái
    R('#3a2210', x + 1, 129, w - 2, 2);
  }
  // tầng trệt: xà gỗ, cửa hàng mở sáng đèn, cửa xếp, cột gỗ, bậc thềm
  const oy = 133, ox = x + 6, ow = w - 12, oh = HA_ST - 2 - oy;
  R('#3a2210', x, 131, w, 2); R('#ffd889', ox, oy, ow, oh); R('#f6b85c', ox, oy + 8, ow, oh - 8); R('#e8973e', ox, oy + 16, ow, oh - 16);
  haGoods(R, ox, oy, ow, oh, name, k);
  R('#7a4520', ox, oy, 3, oh); R('#7a4520', ox + ow - 3, oy, 3, oh); for (let yy = oy + 3; yy < oy + oh; yy += 4) { R('#5a3014', ox, yy, 3, 1); R('#5a3014', ox + ow - 3, yy, 3, 1); }
  for (const px of ow > 70 ? [x + 1, x + (w >> 1) - 1, x1 - 4] : [x + 1, x1 - 4]) { R('#4a2a14', px, 131, 3, HA_ST - 131); R('#6b3f1c', px, 131, 1, HA_ST - 131); }
  R('#8a7a66', x, HA_ST - 2, w, 2); R('#a89880', x, HA_ST - 2, w, 1);
}
function haBike(R, x, b, col) {   // xe đạp dựng trước cửa
  for (const wx of [x, x + 9]) { R('#1b1b2f', wx + 1, b - 5, 3, 1); R('#1b1b2f', wx + 1, b - 1, 3, 1); R('#1b1b2f', wx, b - 4, 1, 3); R('#1b1b2f', wx + 4, b - 4, 1, 3); }
  R(col, x + 3, b - 4, 8, 1); R(col, x + 5, b - 7, 1, 3); R(col, x + 10, b - 7, 1, 3); R('#3b2a2a', x + 4, b - 8, 3, 1); R('#adb5bd', x + 9, b - 8, 3, 1); R('#a0784c', x + 11, b - 8, 4, 3);
}

/* ---- lớp tĩnh vẽ sẵn: mái & cây phía xa, dãy nhà, phố ven sông, kè đá ---- */
let haFarC = null;
function haFar() {
  if (haFarC) return haFarC;
  const c = document.createElement('canvas'); c.width = W; c.height = HA_W0; const g = c.getContext('2d'), R = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), w, h); };
  for (const [x, w, y] of [[10, 56, 90], [148, 44, 102], [262, 64, 84], [372, 50, 104], [430, 40, 92]]) { for (let r = 0; r < 8; r++) R('#14245c', x - r, y + r, w + r * 2, 1); R('#1c3070', x, y, w, 1); R('#14245c', x - 8, y + 8, w + 16, 40); }
  for (const [x, y, r] of [[96, 92, 12], [112, 84, 9], [190, 98, 10], [352, 92, 13], [366, 100, 9], [470, 96, 11]]) for (let j = -r; j <= r; j++) { const ww = Math.floor(Math.sqrt(r * r - j * j)); R('#0f1c4c', x - ww, y + j, ww * 2 + 1, 1); }
  HA_HOUSES.forEach((h, k) => haHouse(R, h, k));
  // phố ven sông lát đá, vũng sáng hắt ra từ cửa hàng
  R('#4e4034', 0, HA_ST, W, HA_KE - HA_ST); for (let x = 0; x < W; x += 9) R('#3e3228', x, HA_ST, 1, HA_KE - HA_ST); R('#3e3228', 0, HA_ST + 4, W, 1);
  g.globalAlpha = .2; for (const [x, w] of HA_HOUSES) for (let y = HA_ST; y < HA_KE; y++) { const s = y - HA_ST; R('#ffcf7a', x + 5 - s, y, w - 10 + s * 2, 1); } g.globalAlpha = 1;
  for (const [x, col] of [[34, '#2b6a8a'], [186, '#c92a2a'], [341, '#2f9e44']]) haBike(R, x, HA_ST + 7, col);
  for (const px of [120, 294, 412]) { R('#a0522d', px - 2, HA_ST - 1, 5, 4); for (let j = -4; j <= 4; j++) { const ww = Math.floor(Math.sqrt(16 - j * j)); R(j < 0 ? '#3f8a4a' : '#2b6a3a', px - ww, HA_ST - 6 + j, ww * 2 + 1, 1); } }   // chậu cây
  // kè đá bờ bên kia
  R('#6e6456', 0, HA_KE, W, HA_W0 - HA_KE); R('#a0947e', 0, HA_KE, W, 1); for (let x = 5; x < W; x += 14) R('#4e463c', x, HA_KE + 1, 1, 3); R('#2e2822', 0, HA_W0 - 1, W, 1);
  return haFarC = c;
}

/* đèn lồng lụa tròn: chóp & đáy thếp vàng, tua rua; x, y = chóp đèn */
function haLan(x, y, [c, c2], k) {
  x += Math.round(Math.sin(time * 1.7 + k * 1.3) * .7);
  fr('#2a1a10', x + 3, y - 2, 1, 2); fr('#b8862a', x + 1, y, 5, 1);
  fr(c, x, y + 1, 7, 1); fr(c, x - 1, y + 2, 9, 3); fr(c, x, y + 5, 7, 1); fr(c2, x + 1, y + 2, 2, 3); fr(c2, x + 1, y + 1, 1, 1);
  fr('#b8862a', x + 1, y + 6, 5, 1); fr(c, x + 3, y + 7, 1, 2);
}
/* hoa đăng: đế giấy đỏ, cánh giấy vàng sáng nến, bóng & vệt sáng dưới nước */
function haFloat(x, y, k, mine) {
  x = Math.round(x); y = Math.round(y + Math.sin(time * 1.6 + k) * .6); const base = k % 4 === 1 ? '#e64980' : '#d9263a';
  ctx.globalAlpha = .3; fr(base, x, y + 1, 7, 1); fr('#ffd98a', x + 2, y + 2, 3, 1); fr('#ffd98a', x + 3, y + 3, 1, 2 + (Math.floor(time * 5 + k) % 3)); ctx.globalAlpha = 1;
  glow(x + 3, y - 3, mine ? 9 : 6, '#ffc94a', .16 + Math.sin(time * 7 + k * 2) * .04);
  fr(base, x, y - 1, 7, 2); fr('#8a1a2a', x, y, 7, 1);
  fr('#ffd43b', x, y - 4, 7, 3); fr('#fff3bf', x + 1, y - 4, 5, 2); fr('#ffe066', x, y - 5, 1, 1); fr('#ffe066', x + 3, y - 5, 1, 1); fr('#ffe066', x + 6, y - 5, 1, 1);
  fr(Math.floor(time * 9 + k) % 3 ? '#ffffff' : '#ffe8a3', x + 3, y - 4, 1, 1);
  if (mine && Math.floor(time * 3) % 3 === 0) { fr('#ffffff', x + 3, y - 10, 1, 3); fr('#ffffff', x + 2, y - 9, 3, 1); }
}
/* ghe gỗ hai đầu vểnh: cô bán hoa đăng ngồi đuôi ghe đội nón lá, khoang chở rổ hoa đăng & túi đỏ; flip = bóng dưới nước */
function haBoat(o, x, y, flip) {
  x = Math.round(x); y = Math.round(y + Math.sin(sceneT * 1.3 + o.k * 2) * .7);
  const L = 46, P = (i, j, w, h, c) => fr(c, o.d > 0 ? x + i : x + L - i - w, flip ? y - j - h + 1 : y + j, w, h);
  P(7, -2, L - 14, 1, '#1e1008');
  for (let i = 0; i < L; i++) { const e = Math.min(i, L - 1 - i), r = e < 7 ? Math.round((7 - e) ** 2 / 10) : 0, d = e < 5 ? 1 + (e >> 1) : 4;
    P(i, -r - 1, 1, 1, '#9a6a3a'); P(i, -r, 1, d, '#4e2f1a'); P(i, -r + d - 1, 1, 1, '#2a180c'); }
  for (let i = 12; i < L - 12; i += 9) P(i, -2, 2, 1, '#7a4a22');
  for (let n = 0; n < 5; n++) { const i = 10 + n * 3; P(i, -4, 2, 2, n % 2 ? '#ffd43b' : '#d9263a'); P(i, -5, 2, 1, '#fff3bf'); }   // rổ hoa đăng
  P(27, -5, 4, 3, '#e03131'); P(28, -6, 2, 1, '#c92a2a');
  const i = L - 14, sk = '#e8b48a', st = Math.sin(sceneT * 1.5 + o.k);
  P(i, -8, 5, 6, o.shirt); P(i + 4, -8, 1, 6, 'rgba(0,0,0,.25)'); P(i + 1, -10, 3, 2, sk);
  P(i - 2, -11, 9, 1, '#c9b07a'); P(i - 1, -12, 7, 1, '#e3d0a0'); P(i, -13, 5, 1, '#efe0b8'); P(i + 1, -14, 3, 1, '#f6ecd0'); P(i + 2, -15, 1, 1, '#f6ecd0');   // nón lá
  if (o.row) { const tx = Math.round(st * 3); P(i - 2, -7, 3, 1, o.shirt); for (let s = 0; s < 9; s++) P(i - 3 + Math.round(s * (tx - 4) / 9), -7 + s, 1, 1, '#8a6238'); }   // mái chèo
  else { P(i - 3, -7, 4, 1, o.shirt); P(i - 4, -7, 1, 1, sk); P(i - 7, -9, 3, 2, '#ffd43b'); P(i - 7, -10, 3, 1, '#fff3bf'); if (!flip) glow(x + (o.d > 0 ? i - 6 : L - i + 5), y - 9, 5, '#ffc94a', .2); }   // chìa hoa đăng mời khách
}
function haRipples() {
  for (let y = HA_W0 + 1, r = 0; y < HA_W1; y += 2, r++) for (let i = 0; i < 7; i++) { const len = 4 + Math.floor(rnd(r * 7 + i + 90) * 12), x = ((rnd(r * 9 + i + 90) * W + sceneT * (3 + r % 3) * (r % 2 ? 1 : -1)) % (W + 20) + W + 20) % (W + 20) - 10;
    ctx.globalAlpha = .5; fr(i % 4 ? '#03141a' : '#1d5a64', x, y, len, 1); }
  ctx.globalAlpha = 1;
}

/* ---- toàn cảnh ---- */
function haScene() {
  for (let i = 0; i < 26; i++) { if ((Math.floor(time * 2) + i * 3) % 11 === 0) continue; fr(i % 4 ? '#3a5aa8' : '#9ab4f0', Math.floor(rnd(i + 7) * W), 17 + Math.floor(rnd(i + 70) * 56), 1, 1); }
  ctx.drawImage(haFar(), 0, 0);
  for (const [x, w, , , name] of HA_HOUSES) { const s = pixText(name, 12, '#f2c14e'), pw = s.width + 2, px = x + ((w - pw) >> 1); fr('#c99a2a', px - 1, 133, pw + 2, 10); fr('#1b120c', px, 134, pw, 8); ctx.drawImage(s, px + 1, 131); }   // biển sơn mài
  for (const [x, y, k] of HA_GLOBES) { fr('#2a1a10', x - 4, y - 3, 9, 1); glow(x, y, 4, '#ffe8a8', .16 + Math.sin(time * 3 + k) * .03); pixCircle(x, y, 1, '#fff6dc'); }
  for (const [x, y, k] of HA_LAMPS) { glow(x + 3, y + 4, 9, '#ffb04a', .12 + Math.sin(time * 5 + k) * .03); haLan(x, y, HA_LC[k % 8], k); }
  // phố ven sông: người đội nón lá đi dạo, khách đứng xem hàng, cô bán hoa đạp xe
  walker(loopX(9, 40, W + 60) - 10, 153, '#e9ecef', 0); walker(W - loopX(7, 260, W + 60), 154, '#4dabf7', 2); walker(loopX(6, 330, W + 60) - 10, 154, '#ff8fab', 4);
  hnPerson(98, 167, '#ffd43b', '#2b1b17', 1); hnPerson(252, 167, '#f1f3f5', '#7a4a22', 2); hnPerson(260, 167, '#e64980', '#2b1b17', 3); hnPerson(452, 167, '#51cf66', '#2b1b17', 5);
  hnVeh({ t: 'bike', w: 24, k: 2 }, W - loopX(11, 120, W + 120) + 20, HA_ST + 8, -1, false);
  // sông Hoài: soi bóng phố đèn, gợn sóng, vệt đèn lồng
  fr('#05181e', 0, HA_W0, W, HA_W1 - HA_W0); dnMirror(HA_W0, HA_W1, .72, .95);
  ctx.globalAlpha = .16; fr('#0b5560', 0, HA_W0, W, HA_W1 - HA_W0); ctx.globalAlpha = 1;
  haRipples(); dnStreaks(HA_W0 + 2, HA_W1, HA_STREAK);
  // hoa đăng & ghe: xa trước, gần sau
  const fl = HA_FLOAT.map(([off, y, sp, k]) => [loopX(sp, off, W + 60) - 10, y, k]);
  for (const [x, y, k] of fl) if (y < 199) haFloat(x, y, k);
  const row = { d: -1, shirt: '#c92a2a', k: 3, row: 1 }, rx = W - loopX(5, 200, W + 140) + 20;
  for (const [o, x] of [[row, rx], ...HA_BOATS.map(o => [o, o.x])]) { const y = o.row ? 192 : o.y; ctx.globalAlpha = .22; haBoat(o, x, y + 3, true); ctx.globalAlpha = 1; haBoat(o, x, y, false); }
  for (const [x, y, k] of fl) if (y >= 199) haFloat(x, y, k);
  if (props.lantern) haFloat(props.lantern.x, props.lantern.y, 99, true);
  // kè đá bờ gần
  fr('#5a5248', 0, HA_W1, W, GY - HA_W1); fr('#8a806e', 0, HA_W1, W, 1); fr('#3a342c', 0, GY - 1, W, 1); for (let x = 6; x < W; x += 16) fr('#46403a', x, HA_W1 + 1, 1, GY - HA_W1 - 2);
  // dây đèn lồng giăng ngang trên đầu
  tiles(160, .8, (x, k) => { for (let i = 0; i < 160; i += 2) fr('#1a1430', x + i, 20 + Math.round(Math.sin(i / 160 * Math.PI) * 10), 2, 1);
    for (let i = 0; i < 6; i++) { const lx = x + 10 + i * 25, ly = 22 + Math.round(Math.sin((i * 25 + 13) / 160 * Math.PI) * 10); glow(lx + 3, ly + 4, 8, '#ffb04a', .14); haLan(lx, ly, HA_LC[(i + k * 3) % 8], i + k); } });
}

/* ---- bờ gần: lối đi lát đá, cột đèn lồng, xe nước Mót ---- */
let haWalkC = null;
function haGround() {
  if (!haWalkC) { const c = document.createElement('canvas'); c.width = W; c.height = H - GY; const g = c.getContext('2d'), R = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y - GY, w, h); };
    const rows = [GY, 226, 231, 237, 244, 252, H];
    for (let b = 0; b < rows.length - 1; b++) { const ya = rows[b], yb = rows[b + 1], sp = 14 + b * 5;
      for (let x = -((b % 2) * (sp >> 1)), n = 0; x < W; x += sp, n++) { const v = rnd(n * 7.3 + b * 31.1); R(v > .66 ? '#74665a' : v > .33 ? '#6a5c4e' : '#625446', x, ya, sp, yb - ya); R('#7e705f', x + 1, ya + 1, sp - 2, 1); if (v > .85) R('#5a4e42', x + 3, ya + 2, 3, 1); R('#3e342c', x, ya, 1, yb - ya); }
      R('#3e342c', 0, yb - 1, W, 1); }
    R('#9a8e7a', 0, GY, W, 1); haWalkC = c; }
  ctx.drawImage(haWalkC, 0, GY);
  for (const px of HA_POSTS) ellipseGlow(px + 1, GY + 6, 28, 4, '#ffb04a', .08);
  ellipseGlow(HA_CART + 30, GY + 5, 42, 4, '#ffd98a', .07);
  for (const px of HA_POSTS) haPost(px);
  haCart();
}
function haPost(px) {
  fr('#2a1a10', px, GY - 60, 3, 60); fr('#4a2e1a', px, GY - 60, 1, 60); fr('#2a1a10', px - 2, GY - 4, 7, 4);
  fr('#2a1a10', px - 11, GY - 60, 25, 2); fr('#c99a2a', px, GY - 63, 3, 3);
  for (const [dx, k] of [[-11, 0], [8, 2]]) { glow(px + dx + 3, GY - 51, 10, '#ffb04a', .16 + Math.sin(time * 5 + k) * .03); haLan(px + dx, GY - 56, HA_LC[k], k + 9); }
}
/* xe nước Mót: mái ngói nhỏ phủ hoa giấy, đèn lồng vàng, chị bán hàng tạp dề xanh, quầy gỗ biển trắng chữ đen,
   bình trà thảo mộc đá lạnh, chồng cốc giấy, rổ búp sen; props.serve > 0: chị chìa hai cốc Mót ra mời */
function haCart() {
  const x = HA_CART, b = GY, R = (c, xx, yy, w, h) => fr(c, xx, yy, w, h), sv = props.serve > 0;
  for (const px of [x + 2, x + 57]) { fr('#4a2a14', px, b - 66, 3, 62); fr('#6b3f1c', px, b - 66, 1, 62); }
  haRoof(R, x - 1, x + 63, b - 74, b - 66, 7);
  for (let i = 0; i < 60; i++) { const hang = i > 34, px = x - 6 + Math.floor(rnd(i * 2.3 + 5) * (hang ? 12 : 34)), py = b - 80 + Math.floor(rnd(i * 4.1 + 5) * (hang ? 34 : 12));
    fr(i % 5 < 2 ? (i % 2 ? '#2b6a3a' : '#3f8a4a') : ['#d6336c', '#f06595', '#c2255c', '#ff8fab'][i % 4], px, py, 2, 2); }   // giàn hoa giấy
  for (const [lx, k] of [[x + 12, 40], [x + 44, 41]]) { glow(lx + 3, b - 59, 10, '#ffd98a', .18 + Math.sin(time * 5 + k) * .03); haLan(lx, b - 64, ['#f2b705', '#ffe28a'], k); }
  // chị bán hàng đứng sau quầy
  const vx = x + 34, vy = b - 54, talk = sv && Math.floor(time * 8) % 2;
  fr('#2b1b17', vx + 7, vy - 3, 4, 3); fr(OUT, vx - 1, vy - 1, 12, 11); fr('#f5c29a', vx, vy, 10, 9); fr('#2b1b17', vx, vy, 10, 3); fr('#2b1b17', vx, vy + 3, 1, 3); fr('#2b1b17', vx + 9, vy + 3, 1, 3);
  fr(OUT, vx + 2, vy + 5, 1, 2); fr(OUT, vx + 7, vy + 5, 1, 2); fr('#ff8fa3', vx + 1, vy + 7, 1, 1); fr('#ff8fa3', vx + 8, vy + 7, 1, 1); fr('#c2410c', vx + 4, vy + 7, 2, talk ? 2 : 1);
  fr(OUT, vx - 3, vy + 9, 16, 13); fr('#ffffff', vx - 2, vy + 10, 14, 12); fr('#2f9e44', vx + 1, vy + 12, 8, 10); fr('#51cf66', vx + 1, vy + 12, 8, 1);
  if (sv) { fr(OUT, vx - 21, vy + 11, 20, 4); fr('#ffffff', vx - 20, vy + 12, 19, 2); fr('#f5c29a', vx - 22, vy + 12, 2, 2);
    for (const cx of [vx - 33, vx - 26]) motCup((c, r, w, h, col) => fr(col, cx + c, vy + 7 + r, w, h), 1, 1); }   // chìa hai cốc Mót
  else { const st = Math.round(Math.sin(time * 3) * 1.5); fr('#ffffff', vx + 11, vy + 12, 3, 6); fr('#f5c29a', vx + 11 + st, vy + 18, 2, 2); }
  // mặt quầy: bình trà thảo mộc, chồng cốc, rổ búp sen
  const jx = x + 7; fr('#cfd8dc', jx - 1, b - 48, 14, 15); fr('#b4532a', jx, b - 44, 12, 10); fr('#e8885a', jx + 1, b - 44, 2, 10); fr('#8a3a1a', jx + 10, b - 44, 2, 10); fr('#e9f2f5', jx, b - 47, 12, 3); fr('#868e96', jx + 1, b - 50, 10, 2);
  for (const [ix, iy] of [[3, -43], [7, -41], [5, -38]]) fr('#ffe0cc', jx + ix, b + iy, 2, 2); fr('#a9c25a', jx + 9, b - 46, 1, 9); fr('#a9c25a', jx + 2, b - 46, 1, 6);   // đá viên, cây sả
  for (let i = 0; i < 4; i++) { fr(OUT, x + 22, b - 36 - i * 2, 7, 1); fr('#ffffff', x + 23, b - 37 - i * 2, 5, 2); }
  fr('#a0784c', x + 48, b - 38, 13, 5); for (let i = 0; i < 13; i += 3) fr('#8a6238', x + 48 + i, b - 37, 2, 3);
  for (const [lx, ly] of [[49, -42], [53, -44], [57, -41]]) { fr('#2f9e44', x + lx - 1, b + ly + 2, 5, 1); fr('#f06595', x + lx, b + ly, 3, 3); fr('#ffc9de', x + lx, b + ly, 1, 1); fr('#f783ac', x + lx + 1, b + ly - 1, 1, 1); }
  // quầy gỗ, biển trắng chữ đen, bánh xe
  fr('#5a3418', x - 2, b - 33, 66, 3); fr('#8a5a2a', x - 2, b - 33, 66, 1); fr('#6b3f1c', x, b - 30, 62, 24); fr('#4a2a14', x, b - 8, 62, 2);
  fr('#f4ecd8', x + 6, b - 28, 50, 16); fr('#d9cfb8', x + 6, b - 13, 50, 1);
  const t1 = pixText('MÓT', 16, '#1b1b2f'); ctx.drawImage(t1, x + 31 - (t1.width >> 1), b - 30);
  for (const lx of [x + 10, x + 47]) { fr('#2f9e44', lx - 1, b - 17, 7, 1); fr('#f06595', lx, b - 20, 5, 3); fr('#f783ac', lx + 1, b - 22, 3, 2); fr('#ffc9de', lx + 2, b - 23, 1, 1); }   // búp sen hai bên chữ
  for (const wx of [x + 11, x + 51]) { pixCircle(wx, b - 5, 5, '#2a1a10'); pixCircle(wx, b - 5, 3, '#6b3f1c'); fr('#2a1a10', wx - 1, b - 6, 2, 2); }
  // bảng giá & chậu cây bên cạnh
  fr('#5a3418', x + 66, b - 22, 2, 22); fr('#5a3418', x + 78, b - 22, 2, 22); fr('#8a5a2a', x + 64, b - 30, 18, 14); fr('#2b2b2b', x + 65, b - 29, 16, 12); const t3 = pixText('25K', 12, '#f1f3f5'); ctx.drawImage(t3, x + 73 - (t3.width >> 1), b - 32);
  fr('#a0522d', x + 88, b - 9, 10, 9); fr('#c0623a', x + 88, b - 9, 10, 1);
  for (const [dx, dy, r] of [[-3, -16, 5], [4, -20, 6], [1, -12, 5], [7, -13, 4]]) pixCircle(x + 93 + dx, b + dy, r, r > 5 ? '#2b8a3e' : '#2f9e44');
  for (const [dx, dy] of [[-4, -19], [5, -23], [8, -15], [0, -14]]) fr('#69db7c', x + 93 + dx, b + dy, 2, 1);
}
/* hai cốc chạm nhau: loé sáng tại chỗ hai miệng cốc gặp nhau (trước mặt chú rể, cột 21 hàng -3) */
function haClink() { const [x0, y0] = handPt(actors.groom, 0, 0); burst(x0 + 21 + cam, y0 - 3, ['#ffffff', '#fff3bf', '#ffd43b', '#ffc9de'], 14, 55, .5); sfx('ting'); }
function haUpdate(dt) {
  if (props.lantern) { props.lantern.x += 8 * dt; props.lantern.y = Math.max(193, props.lantern.y - 2.6 * dt); }   // hoa đăng trôi dần ra giữa sông
}
