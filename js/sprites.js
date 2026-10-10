/* ================== SPRITES (20x32, nhìn thẳng, viền đậm, đổ bóng phẳng) ================== */
const OUT = '#1e1626';
function sprC(rows, colors) {
  const h = rows.length, w = Math.max(...rows.map(r => r.length));
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d');
  rows.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const ch = row[i]; if (ch === '.' || !colors[ch]) continue; x.fillStyle = colors[ch]; x.fillRect(i, j, 1, 1); } });
  return c;
}
function outline(src, col = OUT) {
  const w = src.width, h = src.height, c = document.createElement('canvas'); c.width = w + 2; c.height = h + 2;
  const x = c.getContext('2d'), d = src.getContext('2d').getImageData(0, 0, w, h).data;
  const op = (i, j) => i >= 0 && j >= 0 && i < w && j < h && d[(j * w + i) * 4 + 3] > 0;
  x.fillStyle = col;
  for (let j = -1; j <= h; j++) for (let i = -1; i <= w; i++) if (!op(i, j) && (op(i-1,j)||op(i+1,j)||op(i,j-1)||op(i,j+1))) x.fillRect(i + 1, j + 1, 1, 1);
  x.drawImage(src, 1, 1); return c;
}
const flipCache = new Map();
function flipped(c) {
  if (flipCache.has(c)) return flipCache.get(c);
  const f = document.createElement('canvas'); f.width = c.width; f.height = c.height;
  const x = f.getContext('2d'); x.scale(-1, 1); x.drawImage(c, -c.width, 0); flipCache.set(c, f); return f;
}
const BLANK = '....................';
/* Phong cách: nhìn thẳng (mắt lệch 1px về hướng đi), đầu vuông to, viền đậm (k), tô bóng phẳng sáng trái – tối phải.
   Bảng chữ: a b c = da sáng/vừa/tối · F f g = cẳng tay (da, hoặc tay áo vest) · 1 2 3 = tóc · e mắt · m M miệng · u má
   T U V = áo sáng/vừa/tối · X Y Z = quần · S Q = giày · K G = thắt lưng/khoá · R nơ · k nét viền trong */
/* Đầu nam 14 hàng: tóc mái lệch, tai hai bên, mắt chấm 1x2 (cột 8 & 13), miệng (cột 9-12, hàng 10-11) */
const HEAD = [
  '......21122222......',
  '.....2111222223.....',
  '....211222222223....',
  '....222222222233....',
  '....22aaab222233....',
  '....2aaabbbbbbc3....',
  '...b2aabbbbbbbc3c...',
  '...bbabbebbbbebcc...',
  '...cbabbebbbbebcc...',
  '....babubbbbbbuc....',
  '....bbbbbmbbmbbc....',
  '....bbbbbbmmbbcc....',
  '.....cbbbbbbbcc.....',
  '.....kkkkkkkkkk.....'];
/* Thân nam 7 hàng: tay áo ngắn, hai tay buông dọc thân, nét viền trong tách tay khỏi thân (cột 4 & 15) */
const TORSO = [
  '....TTTTTVVTTTUU....',
  '..TTTTTTTTTTTTTUUV..',
  '..TUkTTTTTTTUUVkUV..',
  '..FfkTTTTTTTUUVkfg..',
  '..FfkTTTTTTTUUVkfg..',
  '.aabkTTTTTTTUUVkbbc.',
  '.bcckVVVVVVVVVVkccc.'];
/* bỏ tay trước (vẽ riêng theo khớp) / bỏ thêm tay sau – tính từ hàng thứ 3 của thân */
const noFront = rows => rows.map((r, i) => i >= 2 ? r.slice(0, 16) + '....' : r);
const noBack = rows => rows.map((r, i) => i >= 2 ? '....' + r.slice(4) : r);
const TORSO_ARM = noFront(TORSO);
const TORSO_ARM_FREE = noBack(TORSO_ARM);
const BELT = '.....KKKKGGKKKK.....';
const HIP = '.....XYYYYYYYYZ.....', LEG = '.....XYYZ..XYYZ.....';
/* Sinh khung chân đi bộ theo khớp [hông, gối, cổ chân] (cột, hàng; hàng 0 = thắt lưng, 1 = hông).
   Chân xa vẽ trước, tối màu; chân gần vẽ sau, sáng màu, có nét viền tách hai chân. Giày 5px mũi hướng về phía đi. */
function walkLegs(n, far, near) {
  const rows = [BELT, HIP].concat(Array(n - 2).fill(BLANK)), key = (x, y) => x + ',' + y, farSet = new Set(), nearSet = new Set();
  const leg = (chain, cols, shoe, set) => {
    const pts = [];
    for (let i = 0; i < chain.length - 1; i++) line(chain[i][0], chain[i][1], chain[i + 1][0], chain[i + 1][1], (x, y) => pts.push([x, y]));
    for (const [x, y] of pts) cols.forEach((c, i) => { plot(rows, x + i, y, c); set.add(key(x + i, y)); });
    const [ax, ay] = chain[chain.length - 1];
    for (let i = 0; i < 5; i++) { plot(rows, ax + i, ay + 1, shoe[0]); plot(rows, ax + i, ay + 2, shoe[1]); set.add(key(ax + i, ay + 1)); set.add(key(ax + i, ay + 2)); }
  };
  leg(far, ['Y', 'Z', 'Z', 'Z'], ['Q', 'Q'], farSet);
  leg(near, ['X', 'Y', 'Y', 'Z'], ['S', 'Q'], nearSet);
  for (const s of nearSet) { const [x, y] = s.split(',').map(Number);
    for (const [i, j] of [[1, 0], [-1, 0], [0, 1]]) if (farSet.has(key(x + i, y + j)) && !nearSet.has(key(x + i, y + j)) && y + j > 1) plot(rows, x + i, y + j, 'k'); }
  return rows;
}
/* chu kỳ 4 khung: bước (hông hạ 1px, 8 hàng) → chụm chân nhấc chân kia (9 hàng) → bước chân kia → chụm.
   Bàn chân chạm đất ở cột 13 (trước) → 8 (trụ) → 3 (sau): mỗi khung lùi 5px, nên actors.js đổi khung sau mỗi 5px đi được
   (STEP_PX). Với tốc độ đi 75px/s và bước mô phỏng 1/60s, mỗi khung kéo dài đúng 4 tick → 15 khung/giây đều nhịp. */
const STEP_PX = { m: 5, f: 5 };
const STRIDE_B = [[6, 2], [5, 3], [3, 5]], STRIDE_F = [[9, 2], [11, 3], [13, 5]], SUPPORT = [[8, 2], [8, 4], [8, 6]], PASS = [[6, 2], [7, 4], [4, 5]];
const LEGS = {
  idle: [BELT, HIP, LEG, LEG, LEG, LEG, LEG, '....SSSSS..SSSSS....', '....QQQQQ..QQQQQ....'],
  run1: walkLegs(8, STRIDE_B, STRIDE_F),
  run2: walkLegs(9, PASS, SUPPORT),
  run3: walkLegs(8, STRIDE_F, STRIDE_B),
  run4: walkLegs(9, SUPPORT, PASS),
  jump: [BELT, HIP, '.....XYYZ..XYYYYZ...', '.....XYYZ..XYYYYZ...', '.....XYYZ....SSSSS..', '.....XYYZ....QQQQQ..', '....SSSSS...........', '....QQQQQ...........', BLANK],
  /* ngồi ghế nhựa thấp nhìn thẳng: đùi (lòng) rộng, hai gối nhô sang hai bên, ống chân thẳng xuống (7 hàng, người hạ 2px) */
  seat: [BELT, '....XYYYYYYYYYYZ....', '...XYYYZ....XYYYZ...', '....XYYZ....XYYZ....', '....XYYZ....XYYZ....', '...SSSSS....SSSSS...', '...QQQQQ....QQQQQ...']
};
/* quỳ một gối (chân sau nằm trên đất) */
const KNEEL = [BELT, '.....XYYYYYYYYYYYZ..', '...QSXYYZ.....XYYZ..', '..QQQQQQQ....QSSSSS.'];
/* ngồi xếp bằng trên chiếu */
const SIT = ['...XYYYYYYYYYYYYZ...', '..XYYYYZZZZZYYYYYZ..', '..SSSQZZZZZZZZQSSS..'];
/* Nữ 25 hàng: tóc dài ôm mặt + nơ (R), khuyên tai (G), má hồng (u), váy chữ A chấm bi, eo nơ (R), viền ren (w).
   Vùng mặt trùng toạ độ với đầu nam để dùng chung biểu cảm. */
const BRIDE = [
  '......2112222RR.RR..',
  '.....21112222RRRRR..',
  '....211222222RR2RR..',
  '...21122222222233...',
  '...222aaab2222233...',
  '...22aaabbbbbbc23...',
  '...22aabbbbbbbc23...',
  '...22abbebbbbeb23...',
  '...22abbebbbbeb23...',
  '...22abubbbbbbu23...',
  '...2GbbbbmbbmbcG3...',
  '...22bbbbbmmbbc23...',
  '...22cbbbbbbbcc23...',
  '...22kkkkkkkkkk23...',
  '...2TTTTTVVTTTUU3...',
  '..TTTTTTTTTTTTTUUV..',
  '..FfkTTTTTTTUUVkfg..',
  '..FfkTTTTTTTUUVkfg..',
  '.aabkTTTTTTTUUVkbbc.',
  '.bcckRRRRRRRRRRkccc.',
  '....TUUTUUUUTUUV....',
  '...TUUUUUTUUUUUUV...',
  '...TUTUUUUUUTUUUV...',
  '..TUUUUTUUUUUUTUUV..',
  '..wVwVwVwVwVwVwVwV..'];
const BTORSO_ARM = noFront(BRIDE.slice(14, 20));
const BTORSO_ARM_FREE = noBack(BTORSO_ARM);
const BLEGS = {
  idle: ['.......bc..bc.......', '.......bc..bc.......', '......SSS..SSS......', '......QQQ..QQQ......'],
  /* bước 3 hàng (người hạ 1px) · chụm 4 hàng; chân xa tối (c, Q), chân gần sáng (b, S) */
  /* bàn chân chạm đất ở cột 14 (trước) → 9 (trụ) → 4 (sau): mỗi khung lùi 5px = quãng người đi được (cùng nhịp chú rể) */
  walk1: ['....cc........bc....', '....QQQ.......SSS...', '....QQQ.......QQQ...'],
  walk2: ['.......ccbc.........', '....QQQ..bc.........', '.........SSS........', '.........QQQ........'],
  walk3: ['....bc........cc....', '....SSS.......QQQ...', '....QQQ.......QQQ...'],
  walk4: ['.......bccc.........', '....SSS..cc.........', '.........QQQ........', '.........QQQ........'],
  jump: ['.......bc..bc.......', '......SSS..SSS......', '......QQQ..QQQ......', BLANK]
};
/* nữ ngồi ghế nhựa thấp: váy phủ lòng, gối khép, ống chân thẳng xuống (7 hàng, người hạ 2px) */
const BSEAT = ['...TUUUUUTUUUUUUV...', '..TUUTUUUUUUTUUUUV..', '..wVwVwVwVwVwVwVwV..', '.......bc..bc.......', '.......bc..bc.......', '......SSS..SSS......', '......QQQ..QQQ......'];
/* ---- Nhìn nghiêng (dùng khi đi bộ), quay mặt sang phải; lật ảnh khi đi sang trái ----
   Mặt: mắt cột 13 (hàng 7-8), mũi nhô cột 16 (hàng 8), miệng cột 13-14 (hàng 10-11), tai cột 7 (hàng 6-8). */
const SIDE_HEAD = [
  '......21122222......',
  '.....2111222222.....',
  '....211222222222....',
  '...3222222222222....',
  '...32222222aaaab....',
  '...322222aaaaaab....',
  '...3222cbbaabbbb....',
  '...3222cbbabbebb....',
  '...3222cbbabbebbb...',
  '...32cbbbbbbbubbc...',
  '....cbbbbbbbbmmb....',
  '....ccbbbbbbbbbc....',
  '.....ccbbbbbbbc.....',
  '......kkkkkkkk......'];
const SIDE_TORSO = [
  '......TTTTTTTU......',
  '.....TTTTTTTTUV.....',
  '.....TTTTTTTTUV.....',
  '.....TTTTTTTTUV.....',
  '.....TTTTTTTTUV.....',
  '.....TTTTTTTTUV.....',
  '.....VVVVVVVVVV.....'];
const SIDE_BELT = '.....KKKKKKKKGK.....';
/* cô dâu nghiêng: nơ sau gáy, tóc dài xoã sau lưng, khuyên tai, váy chữ A */
const SIDE_BRIDE = [
  '......21122222......',
  '..RR.2111222222.....',
  '..RRR11222222222....',
  '..RR222222222222....',
  '..32222222222aab....',
  '..322222222aaaab....',
  '..32222cbbaabbbb....',
  '..32222cbbabbebb....',
  '..32222cbbabbebbb...',
  '..32222cbbbbbubbc...',
  '..32222Gbbbbbmmb....',
  '..32222cbbbbbbbc....',
  '..322222cbbbbbc.....',
  '..3222kkkkkkkk......',
  '..322.TTTTTTTU......',
  '..32.TTTTTTTTUV.....',
  '...3.TTTTTTTTUV.....',
  '.....TTTTTTTTUV.....',
  '.....TTTTTTTTUV.....',
  '...RRRRRRRRRRRR.....',
  '....TUUTUUUUUUV.....',
  '....TUUUUUTUUUUV....',
  '...TUUTUUUUUUTUUV...',
  '...TUUUUUTUUUUUUV...',
  '..wVwVwVwVwVwVwVwV..'];
/* tay khi đi nhìn nghiêng: vai ở cột 9; tay gần vẽ đè lên thân, tay xa chỉ lộ ra phía sau / phía trước thân */
const SIDE_ARMS = {
  swingF: { near: [[9, 1], [10, 3], [12, 5]], far: [[8, 1], [6, 3], [3, 5]] },
  swingB: { near: [[9, 1], [8, 3], [6, 5]], far: [[8, 1], [11, 3], [14, 5]] },
  rest:   { near: [[9, 1], [9, 3], [9, 5]], far: null }
};
const SKIN = { a:'#ffe0c2', b:'#f5c29a', c:'#d99a72', F:'#ffe0c2', f:'#f5c29a', g:'#d99a72', e:'#1b1b2f', m:'#b5534a', w:'#ffffff', M:'#6e2230', P:'#ff8fa3', G:'#f2b134', K:'#3b2a2a', k:OUT, o:'#3d3a52' };
/* tóc + kính của chú rể / tóc cô dâu dùng chung cho mọi bộ đồ; sleeves = áo dài tay (cẳng tay F f g cùng màu áo) */
const GROOM_BASE = { ...SKIN, glasses: 1, u:'#f5c29a', 1:'#4a4a6a', 2:'#2b2b42', 3:'#17172a' };
const BRIDE_BASE = { ...SKIN, u:'#ff9e9e', 1:'#5a4658', 2:'#2b1f2b', 3:'#170f17' };
const sleeves = (T, U, V) => ({ T, U, V, F: T, f: U, g: V });
const LOOK = {
  /* chương 1 Hà Nội: áo thun trắng + quần lửng jean (shorts: 2) */
  groom:    { ...SKIN, glasses: 1, shorts: 2, u:'#f5c29a', 1:'#4a4a6a', 2:'#2b2b42', 3:'#17172a', T:'#ffffff', U:'#e3e8f4', V:'#aab3cf', X:'#6f8cff', Y:'#3b5bdb', Z:'#263a94', S:'#f1f3f5', Q:'#9aa3ad' },
  groomWed: { ...SKIN, glasses: 1, u:'#f5c29a', 1:'#4a4a6a', 2:'#2b2b42', 3:'#17172a', T:'#5d6270', U:'#3a3f4a', V:'#22252d', F:'#5d6270', f:'#3a3f4a', g:'#22252d', X:'#4a4f5a', Y:'#30343d', Z:'#1c1f25', S:'#3a3f4a', Q:'#16181d' },
  guestM:   { ...SKIN, shorts: 2, u:'#f5c29a', 1:'#9a6a48', 2:'#6b4226', 3:'#472b18', T:'#7ee08d', U:'#40c057', V:'#2b8a3e', X:'#86a8ea', Y:'#4c6ef5', Z:'#3246b0', S:'#ff8787', Q:'#c92a2a' },
  father:   { ...SKIN, u:'#f5c29a', m:'#8a8f96', 1:'#f1f3f5', 2:'#ced4da', 3:'#868e96', T:'#c9925f', U:'#8d5a2b', V:'#5e3a1a', X:'#7b828a', Y:'#495057', Z:'#343a40', S:'#343a40', Q:'#1b1b2f' },
  bride:    { ...SKIN, u:'#ff9e9e', 1:'#5a4658', 2:'#2b1f2b', 3:'#170f17', R:'#ff6b8b', T:'#fff3a3', U:'#ffd43b', V:'#d9a200', S:'#ffffff', Q:'#c5ccd4' },
  brideWed: { ...SKIN, u:'#ff9e9e', 1:'#5a4658', 2:'#2b1f2b', 3:'#170f17', R:'#ffffff', T:'#ffffff', U:'#eef0f4', V:'#c3c9d4', S:'#ffffff', Q:'#c5ccd4' },
  guestF:   { ...SKIN, u:'#ff9e9e', 1:'#b06a45', 2:'#7a3e22', 3:'#4e2512', R:'#ffd43b', T:'#ffd6e7', U:'#ff8fb8', V:'#d6457a', S:'#ffffff', Q:'#c5ccd4' },
  /* đồ bơi (chương Hòa Bình): nam cởi trần + quần đùi, chân trần; nữ đồ bơi liền váy */
  groomSwim:{ ...SKIN, glasses: 1, u:'#f5c29a', 1:'#4a4a6a', 2:'#2b2b42', 3:'#17172a', T:'#f5c29a', U:'#e6ad85', V:'#d99a72', K:'#1864ab', G:'#ffffff', X:'#74c0fc', Y:'#1c7ed6', Z:'#1864ab', S:'#f5c29a', Q:'#d99a72' },
  brideSwim:{ ...SKIN, u:'#ff9e9e', 1:'#5a4658', 2:'#2b1f2b', 3:'#170f17', R:'#ffffff', T:'#ffa8a8', U:'#ff6b6b', V:'#c92a2a', S:'#f5c29a', Q:'#d99a72' },
  frM1:     { ...SKIN, a:'#efc39c', b:'#d9a077', c:'#b97c55', F:'#efc39c', f:'#d9a077', g:'#b97c55', u:'#d9a077', 1:'#3a3a3a', 2:'#1b1b1b', 3:'#0d0d0d', T:'#d9a077', U:'#c98d65', V:'#b97c55', K:'#a61e1e', G:'#ffffff', X:'#ff8787', Y:'#e03131', Z:'#a61e1e', S:'#d9a077', Q:'#b97c55' },
  frM2:     { ...SKIN, u:'#f5c29a', 1:'#9a6a48', 2:'#6b4226', 3:'#472b18', T:'#fff3bf', U:'#ffe066', V:'#f2b134', K:'#2b8a3e', G:'#ffffff', X:'#8ce99a', Y:'#2f9e44', Z:'#1f6e30', S:'#f5c29a', Q:'#d99a72' },
  frM3:     { ...SKIN, u:'#f5c29a', 1:'#c08a4a', 2:'#8a5a2a', 3:'#5a3a1a', T:'#f5c29a', U:'#e6ad85', V:'#d99a72', K:'#c2410c', G:'#ffffff', X:'#ffc078', Y:'#f76707', Z:'#c2410c', S:'#f5c29a', Q:'#d99a72' },
  frF:      { ...SKIN, u:'#ff9e9e', 1:'#a0623a', 2:'#6b3a1e', 3:'#45230f', R:'#ffd43b', T:'#a5b4fc', U:'#5c7cfa', V:'#3b5bdb', S:'#f5c29a', Q:'#d99a72' },
  /* nhóm hát rong Đà Lạt (js/dalat.js): mũ len (hat: H sáng · I sẫm · J vành gấp · W quả bông), áo khoác dày;
     người hát chính mặc áo khoác xanh lá kiểu xe ôm công nghệ (grab: N = dải chữ V sẫm) */
  busker:   { ...SKIN, hat: 1, grab: 1, u:'#f5c29a', 1:'#3a2a20', 2:'#2a1c14', 3:'#160e0a', H:'#ffd43b', I:'#f2b134', J:'#c98a0a', W:'#fff3bf', T:'#3ccf5a', U:'#25ad42', V:'#1a8a34', N:'#0e6624', X:'#748ffc', Y:'#4c6ef5', Z:'#3246b0', S:'#f1f3f5', Q:'#9aa3ad' },
  guitarist:{ ...SKIN, hat: 1, u:'#f5c29a', 1:'#3a2a20', 2:'#2a1c14', 3:'#160e0a', H:'#ff8787', I:'#e03131', J:'#a61e1e', W:'#ffffff', T:'#69a86a', U:'#3e7e44', V:'#285a2e', X:'#5c636a', Y:'#3d4248', Z:'#25282c', S:'#a0784c', Q:'#6b4a2a' },
  /* anh phục vụ nhà hàng Phú Quốc: sơ mi trắng, gi lê đen (waiter: N = gi lê), nơ cổ đen, quần âu, giày đen */
  waiter:   { ...SKIN, waiter: 1, u:'#f5c29a', 1:'#2e2a2a', 2:'#1b1818', 3:'#0d0b0b', T:'#ffffff', U:'#e9ecef', V:'#adb5bd', N:'#2b2b36', X:'#3a3a46', Y:'#26262f', Z:'#15151b', S:'#34343e', Q:'#111116' },
  /* ---- trang phục theo chương: mỗi màn hai nhân vật chính mặc một bộ khác (chương 1 Hà Nội dùng groom/bride, chương 3 đồ bơi).
     Cờ trang phục xử lý trong dress(): stripe · jacket · scarf (nam) / skirt · pants · hat · nonla (nữ) · shorts 1 = quần short, 2 = quần lửng;
     trousers: cô dâu mặc quần thay váy (chân X Y Z, giày S Q, thắt lưng K G) ---- */
  // ch2 Nam Định: áo thun kẻ sọc ngang (N O = sọc) + quần lửng kaki · áo tím oải hương + quần jean ống suông, giày trắng
  groomND:  { ...GROOM_BASE, stripe: 1, shorts: 2, T:'#ffffff', U:'#e9ecef', V:'#adb5bd', N:'#2f4b8a', O:'#1c2f5e', X:'#e3c79a', Y:'#c9a26b', Z:'#9a7444', S:'#f1f3f5', Q:'#9aa3ad' },
  brideND:  { ...BRIDE_BASE, trousers: 1, R:'#ffffff', T:'#e5dbff', U:'#b197fc', V:'#7950f2', K:'#6b4226', X:'#9cbcf0', Y:'#5c86cc', Z:'#3a5f9e', S:'#ffffff', Q:'#c5ccd4' },
  // ch4 Đà Nẵng: sơ mi jean dài tay + quần đen · váy xanh bạc hà
  groomDN:  { ...GROOM_BASE, ...sleeves('#9cc3e8', '#5b8fc4', '#3a6596'), X:'#5c636a', Y:'#2f3338', Z:'#16181d', S:'#f1f3f5', Q:'#9aa3ad' },
  brideDN:  { ...BRIDE_BASE, R:'#ffffff', T:'#c3fae8', U:'#38d9a9', V:'#0ca678', S:'#ffffff', Q:'#c5ccd4' },
  // ch5 Hội An: sơ mi lanh màu kem + quần lửng nâu · áo dài hồng phấn dài tay, quần trắng (pants: 4 5), nón lá (nonla: 6 7 8)
  groomHA:  { ...GROOM_BASE, shorts: 2, T:'#fff8e6', U:'#f0e2c0', V:'#c9b48a', X:'#a07a5a', Y:'#7a5236', Z:'#523420', S:'#6b4226', Q:'#3d2414' },
  brideHA:  { ...BRIDE_BASE, nonla: 1, pants: 1, ...sleeves('#ffe3ec', '#fcc2d7', '#f06595'), R:'#fcc2d7', 4:'#ffffff', 5:'#dee2e6', 6:'#f8e9c0', 7:'#e0c68a', 8:'#b08d55', S:'#ffffff', Q:'#c5ccd4' },
  // ch6 Đà Lạt: áo khoác dạ màu bò mở vạt (jacket: N = áo len trong) + khăn len đỏ (scarf: D E), giày bốt ·
  //            mũ len hồng có quả bông, áo len kem dài tay, quần jean sẫm, bốt nâu
  groomDL:  { ...GROOM_BASE, jacket: 1, scarf: 1, ...sleeves('#d9a066', '#b07a3c', '#7d5222'), N:'#5c636a', D:'#ff6b6b', E:'#c92a2a', X:'#5c6b8a', Y:'#38445e', Z:'#232b3d', S:'#6b4226', Q:'#3d2414' },
  brideDL:  { ...BRIDE_BASE, hat: 1, trousers: 1, ...sleeves('#fff4e0', '#f0d9b5', '#c9a87a'), H:'#ffc9de', I:'#f783ac', J:'#d6336c', W:'#ffffff', R:'#c9a87a', K:'#5a3a1a', X:'#6b7088', Y:'#454a60', Z:'#2a2e3e', S:'#8a5a2a', Q:'#5a3a1a' },
  // ch7 Quy Nhơn: áo thun san hô + quần short xanh rêu, dép nâu · áo trắng + quần short jean, nơ xanh, giày trắng
  groomQN:  { ...GROOM_BASE, shorts: 1, T:'#ffc9c9', U:'#ff8787', V:'#e03131', X:'#a9b86a', Y:'#7d8c3e', Z:'#56622a', S:'#8a5a2a', Q:'#5a3a1a' },
  brideQN:  { ...BRIDE_BASE, trousers: 1, shorts: 1, R:'#339af0', T:'#ffffff', U:'#f1f3f5', V:'#ced4da', K:'#ffffff', X:'#a5c8f5', Y:'#5c8fd6', Z:'#3a68ad', S:'#ffffff', Q:'#c5ccd4' },
  // ch8 Phú Quốc (hoàng hôn + bữa tối cầu hôn): vest xanh than mở vạt, sơ mi trắng, quần be · váy dạ tiệc đỏ, nơ và thắt lưng vàng
  groomPQ:  { ...GROOM_BASE, jacket: 1, ...sleeves('#4a5b94', '#2f3d6b', '#1c2747'), N:'#ffffff', X:'#efe3c8', Y:'#cdb98f', Z:'#9e8c66', S:'#7a4a2a', Q:'#4a2a14' },
  bridePQ:  { ...BRIDE_BASE, R:'#ffd43b', T:'#ff8787', U:'#e03131', V:'#a61e1e', S:'#f03e3e', Q:'#a61e1e' },
  // khách ở bữa tối Phú Quốc (place 'guestPQ' → guestMPQ / guestFPQ theo giới tính): sơ mi xanh nhạt + quần ghi · váy tím
  guestMPQ: { ...SKIN, u:'#f5c29a', 1:'#9a6a48', 2:'#6b4226', 3:'#472b18', T:'#e7f5ff', U:'#a5d8ff', V:'#4dabf7', X:'#868e96', Y:'#5c636a', Z:'#3d4248', S:'#343a40', Q:'#1b1b2f' },
  guestFPQ: { ...SKIN, u:'#ff9e9e', 1:'#b06a45', 2:'#7a3e22', 3:'#4e2512', R:'#ffffff', T:'#d0bfff', U:'#9775fa', V:'#6741d9', S:'#ffffff', Q:'#c5ccd4' }
};
const FEMALE = new Set(['bride', 'brideWed', 'guestF', 'brideSwim', 'frF', 'brideND', 'brideDN', 'brideHA', 'brideDL', 'brideQN', 'bridePQ', 'guestFPQ']);
/* bộ đồ theo chương (dùng cho trang tools/sprites.html) */
const OUTFITS = ['groom', 'bride', 'groomND', 'brideND', 'groomDN', 'brideDN', 'groomHA', 'brideHA', 'groomDL', 'brideDL', 'groomQN', 'brideQN', 'groomPQ', 'bridePQ', 'guestMPQ', 'guestFPQ'];
const IP = { k:'#1b1b2f', r:'#e8364f', d:'#a61e3a', p:'#ff9eb0', w:'#ffffff', y:'#ffd43b', Y:'#d99e00', o:'#f08c00', n:'#b07a4f', N:'#6b4226',
  g:'#51cf66', G:'#2b8a3e', s:'#dee2e6', S:'#9aa3ad', K:'#495057', b:'#339af0', B:'#1864ab', c:'#fff3d6', t:'#e7d3b5', l:'#a5d8ff' };
const S = {};
function char(rows, look, post) { const c = sprC(rows, LOOK[look]); if (post) post(c.getContext('2d')); return outline(c); }
/* vest cưới: cổ áo sơ mi trắng + cà vạt đỏ giữa ngực (hàng 16 = vai) */
function suit(x) { x.fillStyle = '#ffffff'; x.fillRect(8, 16, 4, 1); x.fillRect(9, 17, 2, 1); x.fillStyle = '#e03131'; x.fillRect(9, 17, 2, 3); x.fillStyle = '#a61e3a'; x.fillRect(9, 20, 2, 1); }
/* khăn voan: vẽ phía SAU nhân vật nên chỉ lộ ra hai bên đầu và vai */
function veil(x) { x.globalCompositeOperation = 'destination-over'; x.fillStyle = '#dde1e7'; x.fillRect(1, 5, 18, 21); x.fillStyle = '#f8f9fa'; x.fillRect(2, 4, 16, 20); x.globalCompositeOperation = 'source-over'; }
function setC(r, i, ch) { while (r.length <= i) r += '.'; return r.slice(0, i) + ch + r.slice(i + 1); }
const shiftRow = (r, d) => d > 0 ? '.' + r.slice(0, -1) : r.slice(1) + '.';
/* Biểu cảm: n thường · b chớp mắt · t nói · h cười híp mắt + má hồng · o ngạc nhiên */
function faceRows(rows, v) {
  rows = rows.slice();
  const put = (r, ...cs) => { for (let i = 0; i < cs.length; i += 2) rows[r] = setC(rows[r], cs[i], cs[i + 1]); };
  if (v === 'b') put(7, 8, 'b', 13, 'b');                                                   // nhắm mắt
  if (v === 't' || v === 'o') { put(10, 9, 'b', 10, 'M', 11, 'M', 12, 'b'); put(11, 10, 'M', 11, 'M'); }   // há miệng
  if (v === 'o') put(5, 8, '3', 13, '3');                                                   // nhướn mày
  if (v === 'h' || v === 'H') {                                                             // mắt cười ^ ^, má hồng, nhe răng
    put(8, 7, 'e', 8, 'b', 9, 'e', 12, 'e', 13, 'b', 14, 'e'); put(9, 7, 'P', 14, 'P');
    put(10, 9, 'M', 10, 'w', 11, 'w', 12, 'M'); put(11, 10, 'M', 11, 'M');
    if (v === 'H') put(11, 9, 'M', 10, 'm', 11, 'm', 12, 'M');
  }
  return rows;
}
/* Kính tròn gọng mảnh (o): mỗi tròng là vòng 4x4 khuyết góc quanh mắt (cột 6-9 & 12-15, hàng 6-9), tròng trong suốt.
   Cầu kính + càng kính ở hàng 7. Má hồng (khi cười) dời ra ngoài gọng. */
function glassesRows(rows, v) {
  rows = rows.slice();
  const put = (r, c, ch) => { rows[r] = setC(rows[r], c, ch); };
  for (const x0 of [6, 12]) { put(6, x0 + 1, 'o'); put(6, x0 + 2, 'o'); put(9, x0 + 1, 'o'); put(9, x0 + 2, 'o'); for (const r of [7, 8]) { put(r, x0, 'o'); put(r, x0 + 3, 'o'); } }
  put(7, 10, 'o'); put(7, 11, 'o'); put(7, 4, 'o'); put(7, 5, 'o');
  if (v === 'h' || v === 'H') { put(9, 6, 'P'); put(9, 15, 'P'); }
  return rows;
}
/* biểu cảm cho đầu nhìn nghiêng (mắt cột 13, miệng cột 13-14) */
function sideFaceRows(rows, v) {
  rows = rows.slice();
  const put = (r, ...cs) => { for (let i = 0; i < cs.length; i += 2) rows[r] = setC(rows[r], cs[i], cs[i + 1]); };
  if (v === 'b') put(7, 13, 'b');
  if (v === 't' || v === 'o') put(10, 13, 'M', 14, 'M'), put(11, 13, 'M', 14, 'M');
  if (v === 'o') put(6, 13, '3');
  if (v === 'h' || v === 'H') { put(8, 12, 'e', 13, 'b', 14, 'e'); put(9, 13, 'P'); put(10, 13, 'M', 14, 'w'); put(11, 13, 'M', 14, 'M'); if (v === 'H') put(11, 14, 'm'); }
  return rows;
}
/* kính nhìn nghiêng: tròng tròn khuyết góc (cột 11-15, hàng 6-9), mắt ở giữa có da hai bên; càng kính kéo về tai */
function sideGlassesRows(rows) {
  rows = rows.slice();
  const put = (r, c) => { rows[r] = setC(rows[r], c, 'o'); };
  for (const c of [12, 13, 14]) { put(6, c); put(9, c); }
  for (const r of [7, 8]) { put(r, 11); put(r, 15); }
  for (let c = 8; c < 11; c++) put(7, c);
  return rows;
}
/* mũ len (LOOK.hat): 4 hàng tóc trên cùng thành mũ đan sọc dọc, hàng thứ 4 là vành gấp; quả bông 2x2 trên đỉnh đầu */
function hatRows(rows) { rows = rows.slice(); for (let r = 0; r < 4; r++) rows[r] = rows[r].replace(/[123]/g, (ch, i) => r === 3 ? 'J' : i % 2 ? 'I' : 'H'); return rows; }
function pompom(rows, top) { for (const r of [top - 2, top - 1]) for (const c of [9, 10]) plot(rows, c, r, 'W'); }
/* áo khoác xe ôm công nghệ (LOOK.grab): cổ đứng, khoá kéo giữa, dải chữ V sẫm (N) ngang bụng, chữ logo trắng trên ngực trái.
   Chỉ tô lên ô đang là màu áo (T/U/V) của thân, vẽ trước tay nên tay vẫn đè lên áo; ty = hàng vai */
function grabRows(rows, ty) {
  const put = (c, r, ch) => { if (rows[r] && 'TUV'.includes(rows[r][c])) rows[r] = setC(rows[r], c, ch); };
  for (let c = 7; c < 13; c++) if (rows[ty - 1][c] === 'k') rows[ty - 1] = setC(rows[ty - 1], c, c === 7 ? 'T' : c === 12 ? 'V' : 'U');   // cổ áo đứng
  for (let c = 5; c < 15; c++) { const r = ty + 5 - Math.floor(Math.abs(c - 9.5) / 2); put(c, r, 'N'); put(c, r + 1, 'N'); put(c, r - 1, 'V'); }
  for (let r = ty + 1; r < ty + 7; r++) put(10, r, 'N');                                                                                  // khoá kéo
  for (const [c, r] of [[11, 1], [12, 1], [13, 1], [11, 2], [13, 2], [14, 2]]) { const y = ty + r; if (rows[y] && 'TUV'.includes(rows[y][c])) rows[y] = setC(rows[y], c, 'w'); }   // logo
}
/* đồng phục phục vụ (LOOK.waiter), chỉ khi nhìn thẳng: hai vạt gi lê (N) hai bên ngực, nơ cổ ở hàng vai; ty = hàng vai */
function waiterRows(rows, ty) {
  for (let r = ty + 1; r < ty + 7; r++) for (const c of [5, 6, 7, 12, 13, 14]) if (rows[r] && 'TUV'.includes(rows[r][c])) rows[r] = setC(rows[r], c, 'N');
  plot(rows, 8, ty, 'N'); plot(rows, 9, ty, 'k'); plot(rows, 10, ty, 'k'); plot(rows, 11, ty, 'N');
}
/* nón lá (LOOK.nonla): chóp nhọn 3 hàng trên đỉnh đầu, vành rộng phủ 3 hàng tóc trên cùng; nửa trái sáng, nửa phải tối, vành sẫm */
function nonLa(rows, top) {
  [[9, 10], [8, 11], [6, 13], [4, 15], [2, 17], [1, 18]].forEach(([c0, c1], i) => {
    for (let c = c0; c <= c1; c++) plot(rows, c, top - 3 + i, i === 5 ? '8' : i === 4 && c % 3 === 0 ? '7' : c < 10 ? '6' : '7');
  });
}
/* khăn len quàng cổ (LOOK.scarf): vòng khăn sọc đan thay hàng cổ, vắt qua vai, một đuôi khăn thòng trước ngực; ty = hàng vai */
function scarfRows(rows, ty) {
  for (let c = 6; c < 14; c++) plot(rows, c, ty - 1, c % 2 ? 'E' : 'D');
  for (let c = 7; c < 13; c++) plot(rows, c, ty, 'D');
  for (let r = ty + 1; r < ty + 5; r++) { plot(rows, 11, r, 'D'); plot(rows, 12, r, 'E'); }
  plot(rows, 11, ty + 5, 'E'); plot(rows, 12, ty + 5, 'E');
}
/* nữ mặc quần (LOOK.trousers): bỏ chân váy, ghép khung chân nam (đi bộ walkN → runN). Hàng eo nữ làm thắt lưng nên bỏ hàng
   thắt lưng của chân nam và thêm một hàng hông, để tổng chiều cao bằng đúng thân váy + chân nữ ở mọi tư thế */
const F_RUN = { walk1: 'run1', walk2: 'run2', walk3: 'run3', walk4: 'run4' };
function trouserRows(legs) { const lg = LEGS[F_RUN[legs] || legs] || LEGS.idle; return [HIP].concat(lg.slice(1)); }
/* Cờ trang phục trong LOOK (gọi sau khi ghép thân, trước khi vẽ tay; ty = hàng vai, thắt lưng nam ở ty + 7, eo nữ ở top + 19):
   nữ – skirt (chân váy A B C khác màu áo) · pants (quần dưới váy, 4 5 thay da chân) · hat (mũ len) · nonla (nón lá 6 7 8);
   nam – stripe (áo kẻ ngang N O) · jacket (áo khoác mở vạt, N = áo trong, chỉ khi nhìn thẳng) · scarf (khăn D E);
   cả hai – shorts (1 = quần short trên gối, 2 = quần lửng qua gối; phần chân dưới ống quần để trần) */
function dress(rows, L, kind, top, ty, legs, side) {
  const swap = (r0, r1, map) => { for (let r = r0; r < r1 && r < rows.length; r++) rows[r] = rows[r].replace(/./g, ch => map[ch] || ch); };
  if (L.shorts) { const belt = kind === 'f' ? top + 19 : ty + 7; swap(belt + (legs === 'seat' ? 2 : 3) + L.shorts + (kind === 'f' ? 1 : 0), rows.length, { X: 'a', Y: 'b', Z: 'c' }); }
  if (kind === 'f') {
    const legRow = top + (legs === 'seat' ? 23 : 25);
    if (L.skirt) swap(top + 20, legRow, { T: 'A', U: 'B', V: 'C' });
    if (L.pants) swap(legRow, rows.length, { b: '4', c: '5' });
    if (L.hat || L.nonla) swap(top, top + 4, { R: '.' });                  // bỏ nơ cài tóc
    if (L.hat) { rows.splice(top, 4, ...hatRows(rows.slice(top, top + 4))); pompom(rows, top); }
    if (L.nonla) nonLa(rows, top);
    return;
  }
  if (L.stripe) for (const r of [1, 3, 5]) swap(ty + r, ty + r + 1, { T: 'N', U: 'N', V: 'O' });
  if (L.jacket && !side) for (const [r, c0, c1] of [[0, 8, 11], [1, 8, 11], [2, 9, 10], [3, 9, 10], [4, 9, 10]])
    for (let c = c0 - 1; c <= c1 + 1; c++) if ('TUV'.includes(rows[ty + r][c])) rows[ty + r] = setC(rows[ty + r], c, c < c0 || c > c1 ? 'V' : 'N');
  if (L.scarf) scarfRows(rows, ty);
}
/* váy đung đưa ngược chiều bước chân */
function brideRows(v, legKey) { const r = faceRows(BRIDE, v); const d = legKey === 'walk1' ? -1 : legKey === 'walk3' ? 1 : 0; if (d) for (let i = 23; i < 25; i++) r[i] = shiftRow(r[i], d); return r; }

/* ---- Tay theo khớp: [vai, khuỷu, bàn tay] tính theo toạ độ thân (cột, hàng; hàng 0 = vai, số âm = ngang đầu) ---- */
/* tay trước (bên phải ảnh, vai ở cột 16) */
const ARMS = {
  swingF: [[16, 1], [17, 3], [18, 4]],   // đi bộ: tay trước vung về phía trước (tay sau vung ra sau)
  swingB: [[16, 1], [16, 3], [15, 5]],   // đi bộ: tay trước vung ra sau (tay sau vung lên trước)
  jump:   [[16, 1], [18, -1], [19, -4]],
  talk1:  [[16, 1], [17, 3], [19, 2]],   // khoa tay khi nói
  talk2:  [[16, 1], [18, 2], [20, 0]],
  point:  [[16, 1], [18, 1], [21, 0]],   // chỉ tay
  wave1:  [[16, 1], [19, 0], [20, -6]],  // vẫy tay
  wave2:  [[16, 1], [20, -1], [22, -5]],
  hold:   [[16, 1], [17, 3], [15, 4]],   // cầm đũa ở miệng bát / cầm cốc trước ngực
  lift:   [[16, 1], [18, 1], [14, -2]],  // đưa đũa / cốc lên miệng
  cup:    [[16, 1], [17, 4], [15, 6]],   // cầm cốc Mót thấp trước bụng
  sip:    [[16, 1], [18, 3], [13, 3]],   // nâng cốc Mót sát cằm, ngậm ống hút
  toast:  [[16, 1], [19, 0], [21, -1]],  // giơ cốc cụng ly
  cam:    [[16, 1], [18, -1], [17, -5]], // cầm máy ảnh
  vsign:  [[16, 1], [18, -1], [19, -4]], // giơ chữ V cạnh má (ngón tay tới ngang mắt)
  clap1:  [[16, 1], [17, 3], [10, 3]],   // vỗ tay / chắp tay
  clap2:  [[16, 1], [17, 3], [13, 2]],
  cross:  [[16, 1], [16, 4], [6, 4]],    // khoanh tay vì lạnh
  mouth:  [[16, 1], [16, 3], [11, -3]],  // che miệng cười
  ring:   [[16, 1], [19, 1], [21, 0]],   // chìa hộp nhẫn
  sing:   [[16, 1], [18, 3], [14, 0]],   // cầm micro ngang cằm (đầu micro sát miệng, không che mắt)
  strum1: [[16, 1], [18, 3], [14, 4]],   // ngồi ôm đàn: tay trước quạt dây trên thùng đàn (lên · xuống)
  strum2: [[16, 1], [18, 4], [14, 6]]
};
/* tay vung ngược chân: chân gần bước lên trước (run1/walk1) thì tay trước vung ra sau */
const WALK_ARM = { run1: 'swingB', run3: 'swingF', walk1: 'swingB', walk3: 'swingF' };
/* tay sau (bên trái ảnh, vai ở cột 2) – chỉ các tư thế cần cả hai tay */
const BACK = {
  swingF: [[2, 1], [1, 3], [0, 4]],
  swingB: [[2, 1], [2, 3], [3, 5]],
  clap1: [[2, 1], [2, 3], [8, 3]],
  clap2: [[2, 1], [2, 3], [5, 2]],
  cross: [[2, 1], [3, 3], [13, 3]],
  strum1: [[2, 1], [1, 3], [0, 1]],      // tay sau bấm phím trên cần đàn
  strum2: [[2, 1], [1, 3], [0, 1]]
};
function plot(rows, x, y, ch) { if (y >= 0 && y < rows.length && x >= 0) rows[y] = setC(rows[y], x, ch); }
function line(x0, y0, x1, y1, fn) {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy;
  for (;;) { fn(x0, y0); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
}
/* Một cánh tay dày 2px: bắp tay = tay áo (T/V), cẳng tay (f/g), bàn tay 2x2; cẳng + bàn tay có nét viền trong (k)
   để tách khỏi thân / mặt khi đưa ra trước người. */
function drawLimb(rows, chain, ty) {
  const pts = chain.map(([x, y]) => [x, y + ty]), up = [], low = [];
  line(pts[0][0], pts[0][1], pts[1][0], pts[1][1], (x, y) => up.push([x, y]));
  line(pts[1][0], pts[1][1], pts[2][0], pts[2][1], (x, y) => low.push([x, y]));
  const [hx, hy] = pts[2], key = (x, y) => x + ',' + y, own = new Set(), upper = new Set();
  for (const [x, y] of up) for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) upper.add(key(x + i, y + j));
  for (const [x, y] of low) for (const [i, j] of [[0, 0], [1, 0], [0, 1], [1, 1]]) own.add(key(x + i, y + j));
  for (const [x, y] of up) { plot(rows, x, y + 1, 'V'); plot(rows, x + 1, y + 1, 'V'); }
  for (const [x, y] of up) { plot(rows, x, y, 'T'); plot(rows, x + 1, y, 'T'); }
  for (const s of own) { const [x, y] = s.split(',').map(Number); for (const [i, j] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const n = key(x + i, y + j); if (!own.has(n) && !upper.has(n) && rows[y + j] && rows[y + j][x + i] && rows[y + j][x + i] !== '.') plot(rows, x + i, y + j, 'k'); } }
  for (const [x, y] of low) { plot(rows, x, y + 1, 'g'); plot(rows, x + 1, y + 1, 'g'); }
  for (const [x, y] of low) { plot(rows, x, y, 'f'); plot(rows, x + 1, y, 'f'); }
  plot(rows, hx, hy, 'a'); plot(rows, hx + 1, hy, 'b'); plot(rows, hx, hy + 1, 'b'); plot(rows, hx + 1, hy + 1, 'c');
  return [hx, hy];
}
/* tay xa khi nhìn nghiêng: tối màu, nằm SAU thân (chỉ tô vào ô trống) */
function drawFarLimb(rows, chain, ty) {
  const pts = chain.map(([x, y]) => [x, y + ty]), back = (x, y, ch) => { if (rows[y] && rows[y][x] === '.') plot(rows, x, y, ch); };
  for (let s = 0; s < 2; s++) line(pts[s][0], pts[s][1], pts[s + 1][0], pts[s + 1][1], (x, y) => { const ch = s ? 'g' : 'V'; back(x, y, ch); back(x + 1, y, ch); back(x, y + 1, ch); back(x + 1, y + 1, ch); });
  const [hx, hy] = pts[2]; back(hx, hy, 'b'); back(hx + 1, hy, 'c'); back(hx, hy + 1, 'c'); back(hx + 1, hy + 1, 'c');
}
function drawArm(rows, pose, ty) {
  if (BACK[pose]) drawLimb(rows, BACK[pose], ty);
  const [hx, hy] = drawLimb(rows, ARMS[pose], ty);
  if (pose === 'vsign') { plot(rows, hx, hy - 1, 'b'); plot(rows, hx - 1, hy - 2, 'a'); plot(rows, hx + 1, hy - 1, 'b'); plot(rows, hx + 2, hy - 2, 'a'); }   // hai ngón 2px
}
/* Ghép một khung hình nhân vật (có bộ nhớ đệm).
   kind: 'm' (nam) | 'f' (nữ); legs: idle/run1-3/walk1-2/jump/seat/kneel/floor; arm: null hoặc khoá trong ARMS; face: n/b/t/h/H/o */
const SPR = new Map();
/* hàng trên cùng của đầu: ngồi ghế hạ 2px, khung bước chân hạ 1px (nhún người khi đi) */
function bodyTop(kind, legs) {
  if (kind === 'f') return legs === 'seat' ? 5 : legs === 'walk1' || legs === 'walk3' ? 4 : 3;
  return legs === 'kneel' ? 7 : legs === 'floor' ? 0 : legs === 'seat' ? 4 : legs === 'run1' || legs === 'run3' ? 3 : 2;
}
function torsoRow(kind, legs) { return bodyTop(kind, legs) + 14; }
function body(look, kind, legs, arm, face) {
  const key = look + '|' + kind + '|' + legs + '|' + arm + '|' + face; let c = SPR.get(key); if (c) return c;
  let rows; const top = bodyTop(kind, legs), ty = top + 14, free = arm && BACK[arm];
  if (/^(run|walk)\d$/.test(legs)) {                                       // đang đi: vẽ nhìn nghiêng
    if (kind === 'f') {
      const b = sideFaceRows(SIDE_BRIDE, face), d = legs === 'walk1' ? -1 : legs === 'walk3' ? 1 : 0;
      if (LOOK[look].trousers) rows = Array(top).fill(BLANK).concat(b.slice(0, 19), SIDE_BELT, trouserRows(legs));
      else {
        if (d) for (let i = 23; i < 25; i++) b[i] = shiftRow(b[i], d);
        rows = Array(top).fill(BLANK).concat(b, BLEGS[legs]);
      }
    } else {
      let head = sideFaceRows(SIDE_HEAD, face); if (LOOK[look].glasses) head = sideGlassesRows(head); if (LOOK[look].hat) head = hatRows(head);
      rows = Array(top).fill(BLANK).concat(head, SIDE_TORSO, LEGS[legs].map((r, i) => i ? r : SIDE_BELT));
      if (LOOK[look].hat) pompom(rows, top);
    }
    rows = rows.map(r => r.padEnd(24, '.'));
    dress(rows, LOOK[look], kind, top, ty, legs, true);
    if (LOOK[look].grab) grabRows(rows, ty);
    const sa = SIDE_ARMS[arm] || SIDE_ARMS.rest;
    if (sa.far) drawFarLimb(rows, sa.far, ty);
    drawLimb(rows, sa.near, ty);
    c = outline(sprC(rows, LOOK[look])); SPR.set(key, c); return c;
  }
  if (kind === 'f') {
    const b = brideRows(face, legs);
    if (arm) b.splice(14, 6, ...(free ? BTORSO_ARM_FREE : BTORSO_ARM));
    if (LOOK[look].trousers) b[19] = setC(setC(b[19].replace(/R/g, 'K'), 9, 'G'), 10, 'G');   // dải nơ eo thành thắt lưng có khoá
    rows = Array(top).fill(BLANK).concat(LOOK[look].trousers ? b.slice(0, 20).concat(trouserRows(legs))
      : legs === 'seat' ? b.slice(0, 20).concat(BSEAT) : b.concat(BLEGS[legs] || BLEGS.idle));
  } else {
    const torso = arm ? (free ? TORSO_ARM_FREE : TORSO_ARM) : TORSO;
    const lg = legs === 'kneel' ? KNEEL : legs === 'floor' ? SIT : LEGS[legs] || LEGS.idle;
    let head = LOOK[look].glasses ? glassesRows(faceRows(HEAD, face), face) : faceRows(HEAD, face); if (LOOK[look].hat) head = hatRows(head);
    rows = Array(top).fill(BLANK).concat(head, torso, lg);
    if (LOOK[look].hat) pompom(rows, top);
  }
  rows = rows.map(r => r.padEnd(24, '.'));
  dress(rows, LOOK[look], kind, top, ty, legs, false);
  if (LOOK[look].grab) grabRows(rows, ty);
  if (LOOK[look].waiter) waiterRows(rows, ty);
  if (arm) drawArm(rows, arm, ty);
  c = outline(sprC(rows, LOOK[look])); SPR.set(key, c); return c;
}
function buildVariants() { SPR.clear(); }
/* danh sách khung hình cho trang tools/sprites.html */
function spriteCatalog() {
  const out = [], faces = ['n', 'b', 't', 'h', 'H', 'o'];
  for (const f of faces) out.push(['mặt|' + f, body('groom', 'm', 'idle', null, f)]);
  for (const f of faces) out.push(['mặt|nữ ' + f, body('bride', 'f', 'idle', null, f)]);
  for (const k of ['idle', 'run1', 'run2', 'run3', 'run4', 'jump', 'seat', 'kneel']) out.push(['chân|nam ' + k, body('groom', 'm', k, WALK_ARM[k] || null, 'n')]);
  for (const k of ['idle', 'walk1', 'walk2', 'walk3', 'walk4', 'jump', 'seat']) out.push(['chân|nữ ' + k, body('bride', 'f', k, WALK_ARM[k] || null, 'n')]);
  for (const a in ARMS) out.push(['tay nam|' + a, body('groom', 'm', a === 'ring' ? 'kneel' : 'idle', a, 'n')]);
  for (const a in ARMS) out.push(['tay nữ|' + a, body('bride', 'f', 'idle', a, 'n')]);
  for (const l of OUTFITS) { const k = FEMALE.has(l) ? 'f' : 'm'; out.push(['đồ|' + l, body(l, k, 'idle', null, 'n')]); out.push(['đồ|' + l + ' đi', body(l, k, k === 'f' ? 'walk1' : 'run1', 'swingB', 'n')]); }
  for (const l of ['guestM', 'guestF', 'father', 'waiter']) out.push(['khách|' + l, l === 'guestF' ? body(l, 'f', 'idle', 'wave1', 'h') : body(l, 'm', l === 'father' ? 'floor' : 'idle', l === 'father' ? null : 'clap1', 'h')]);
  return out;
}
function buildSprites() {
  const top = [BLANK, BLANK].concat(HEAD, TORSO);
  S.groomWed = char([BLANK, BLANK].concat(glassesRows(HEAD, 'n'), TORSO, LEGS.idle), 'groomWed', suit);
  S.guestM = char(top.concat(LEGS.idle), 'guestM');
  const btop = [BLANK, BLANK, BLANK].concat(BRIDE);
  S.brideWed = char(btop.concat(BLEGS.idle), 'brideWed', veil);
  S.guestF = char(btop.concat(BLEGS.idle), 'guestF');
  const it = rows => outline(sprC(rows, IP));
  S.heart = it(['.rrr...rrr.','rpwrr.rrrrr','rwprrrrrrrd','rprrrrrrrrd','rrrrrrrrrrd','.rrrrrrrrd.','..rrrrrrd..','...rrrrd...','....rrd....','.....d.....']);
  S.coffee = it(['......kk....','.....kk.....','.swwwwwwwws.','sswwwwwwwwss','.tnnnnnnnnt.','.tnNNnnnnnt.','.tncccccNnt.','.tnnnnnnnnt.','..nNnnnnnn..','..nnnnnnNn..','..nnnnnnnn..','...nnnnnn...']);
  S.flower = it(['...pp..rr.....','..pwpprrdr.pp.','..pppprrrrpwpp','.rr.pp.rrdpppp','rwrrggrrg..pp.','rrrdgGgggrr...','.rdgGggGgrwr..','...gGggGg.rrd.','....GggG......','.....yyy......','....yYyyY.....','.....yYy......','......gG......','......gG......','......gG......','.......G......']);
  S.umbrella = it(['........k.........','.....rrrrrrrr.....','...rrpwrrrrrrrr...','..rpwrrrrrrrrrrd..','.rprrrrrrrrrrrrrd.','rrrrrrrrrrrrrrrrdd','d.d..d..k..d..d..d','........k.........','........k.........','........k.........','........k.........','......k.k.........','.......k..........']);
  S.ring = it(['....wlw.....','...w.l.w....','....www.....','.....Y......','.rrrrrrrrrr.','rpwrrrrrrrrd','rrrrrrrrrrrd','dddddYYddddd','rrrrrrrrrrrd','rrrrrrrrrrrd','.dddddddddd.']);
  S.paper = it(['...wwwwwwwwwww..','..wwwwwwwwwwwwsS','..wKKKKKKKKKwwsS','..wwwwwwwwwwwwsS','..wKKKKKKwwwwwsS','.wwwwwwwwwwwwwsS','.wwkkwwwwkkwwwsS','.wwwkkwwkkwwwwsS','.wwwkkwwkkwwwwsS','.wwwwwwwwwwwwwsS','.wwwwkkkkkwwwwsS','.sssssssssssssSS','..SSSSSSSSSSSSS.']);
  S.seen = it(['...ssssssssssss...','.sswwsssssssssssS.','sswsssssssssssssSS','sssssssssbsssssbSS','ssssssssbsssssbsSS','sssbsssbsbsssbssSS','ssssbsbsssbsbsssSS','sssssbsssssbssssSS','ssssssssssssssssSS','.ssssssssssssssSS.','..sSSSSSSSSSSSSS..','..sS..............','.sS...............','sS................']);
  S.ask = it(['...wwwwwwwwww...','.wwwwwwrrrwwwww.','wwwwwwrrrrrwwwws','wwwwwrrwwwrrwwws','wwwwwwwwwwrrwwws','wwwwwwwwwrrwwwws','wwwwwwwwrrwwwwws','wwwwwwwwrrwwwwws','wwwwwwwwwwwwwwws','wwwwwwwwrrwwwwws','.wwwwwwwrrwwwws.','..sssssssssssss.','..ws............','.ws.............','ws..............']);
  S.moto = it(['................KK........','...............KsK........','......nnnnnn...KK.........','.....nNNNNNNn..rK.........','....rrrrrrrrrrrrrr........','...rpwrrrrrrrrrrrrr.......','..rrrrrrrrrrrrrrrrrry.....','..drrrrrrrrrrrrrrrrrrd....','..dddddrrrrrrrrrrddddd....','...KKK..ddddddd...KKK.....','..KsSSK..........KsSSK....','.KsSKSSK........KsSKSSK...','.KSKkKSK........KSKkKSK...','.KSSKSSK........KSSKSSK...','..KSSSK..........KSSSK....','...KKK............KKK.....']);
  S.puppy = it(['...........NN.....','..........NnnN.NN.','..........nnnnNnnN','..........nnnnnnkn','.N........nnnnnnnk','Nn........nnnnnnn.','.nn.....nnnnnnnp..','..nnnnnnnnnnnnn...','..nnnnnnnnnnnnn...','..nnnnnnnnnnnn....','..nN.nN....nN.nN..','..nN.nN....nN.nN..','..KK.KK....KK.KK..']);
  S.cup = it(['.wwwww.','wsssssw','wwwwwww.','.wwwww.'].map(r => r.slice(0, 7)));
}
