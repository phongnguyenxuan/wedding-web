/* ================== SPRITES (32-bit: 20x32, đổ bóng 3 tông) ================== */
const OUT = '#2a1a2e';
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
/* Đầu nam: tóc có ánh sáng (1), lông mày (3), tai (c a), má (u) */
const HEAD = ['......222222211.....','....2222222211211...','...322222222221221..','..32222222222222221.','..32222222bb2222222.','..3222223bbbbbb222..','..322223abbbb33b22..','..32223cabbbwebbb...','..32223cabbbeebbb...','..3223.cbbbbbbbub...','...33..cbbbbbbmb....','........cbbbbbbb....','.........ccbbbb.....','..........cbb.......'];
/* Thân nam: cổ áo, hàng cúc */
const TORSO = ['.......VTTVTTT......','.....VVUUTUUUTTT....','....VVUUUUUVUUTTT...','....cVUUUUUUUUUTTa..','...ccVUUUUUVUUUTab..','...cc.VUUUUUUUUTbb..','......VVVVVVVVVV....'];
/* Thân nam không có tay trước (tay vẽ riêng theo khớp), tay sau giấu sau lưng */
const TORSO_ARM = ['.......VTTVTTT......','.....VVUUTUUUTTT....','....VVUUUUUVUUTTT...','....cVUUUUUUUUUUT...','...ccVUUUUUVUUUUT...','...cc.VUUUUUUUUUT...','......VVVVVVVVVV....'];
const TORSO_ARM_FREE = TORSO_ARM.map((r, i) => i >= 3 && i <= 5 ? r.replace(/c/g, '.') : r);
const BELT = '......KKKKKGKKK.....';
const LEGS = {
  idle: [BELT,'......ZYYX.ZYYX.....','......ZYYX.ZYYX.....','......ZYYX.ZYYX.....','......ZYYX.ZYYX.....','......ZYYX.ZYYX.....','......ZYYX.ZYYX.....','.....QSSS..QSSSS....','.....QQQQ..QQQQQ....'],
  run1: [BELT,'.....ZYYX..ZYYX.....','....ZYYX....ZYYX....','...ZYYX......ZYYX...','..ZYYX........ZYX...','.QSSX.........ZYX...','.QQQ.........QSSSS..','.............QQQQQ..',BLANK],
  run2: [BELT,'......ZYYYYYYX......','.......ZYYYYX.......','.......ZYYZYX.......','........ZYYYX.......','........ZYYXQSS.....','........ZYYXQQ......','.......QSSSS........','.......QQQQQ........'],
  run3: [BELT,'.....ZYYX..ZYYX.....','.....ZYYX...ZYYX....','....ZYYX.....ZYYX...','....ZYX.......ZYYX..','...QSSX.......ZYYX..','...QQQ.......QSSSSS.','.............QQQQQQ.',BLANK],
  jump: [BELT,'.....ZYYX..ZYYYX....','....ZYYX...ZYYX.....','...ZYYX....ZYX......','..QSSX....ZYYX......','..QQQ.....QSSSS.....','..........QQQQQ.....',BLANK,BLANK],
  /* ngồi ghế nhựa thấp: đùi đưa ra trước, ống chân thẳng xuống */
  seat: [BELT,'......ZYYYYYYYYYYX..','......ZZZZZZZZYYYX..','.............ZYYX...','.............ZYYX...','.............ZYYX...','.............ZYYX...','............QSSSSS..','............QQQQQQ..']
};
const KNEEL = ['......ZYYYYYYYYYX...','......ZYYYYYYYYYYX..','......ZYYYQSS..ZYX..','.....QQQQQQQ..QSSS..'];
const SIT = ['....ZYYYYYYYYYYYYX..','...ZYYYYYYYYYYYYYYX.','...QQQSS.....QSSQQ..'];
/* Nữ: tóc dài + nơ (R), khuyên tai (G), thắt lưng nơ (R), váy chấm bi (T), viền ren (w) */
const BRIDE = ['......222222211R....','....2222222211211RR.','...322222222221221..','..32222222222222221.','..32222222bb2222222.','..3222223bbbbbb222..','..322223abbbb33b22..','.322223cabbbwebbb...','.322223cabbbeebbb...','.32223.cbbbbbbbub...','.32223.Gbbbbbbmb....','.3223...cbbbbbbb....','.3223....ccbbbb.....','.3223.....cbb.......','.3223..VUUUUTT......','.323.VVUUUUUUTTT....','..3.VVUUUUUUUUTTa...','...cVUUUUUUUUUTTbb..','...cVUUUUUUUUUUTb...','...RRRRRRRRRRRRR....','....VUUTUUUUTUUUT...','...VUUUUUUUUUUUUTT..','...VUTUUUUTUUUUTUT..','..VVUUUUUUUUUUUUUTT.','..VwVwVwVwVwVwVwVwV.'];
const BTORSO_ARM = ['.3223..VUUUUTT......','.323.VVUUUUUUTTT....','..3.VVUUUUUUUUTT....','...cVUUUUUUUUUUT....','...cVUUUUUUUUUUT....','...RRRRRRRRRRRRR....'];
const BTORSO_ARM_FREE = BTORSO_ARM.map((r, i) => i >= 3 && i <= 4 ? setC(r, 3, '.') : r);
const BLEGS = {
  idle: ['.......cb...cb......','.......cb...cb......','......QSS..QSSS.....','......QQQ..QQQQ.....'],
  walk1: ['......cb.....cb.....','.....cb.......cb....','....QSS.......QSSS..','....QQQ.......QQQQ..'],
  walk2: ['........cbcb........','........cbcb........','.......QSSSSS.......','.......QQQQQQ.......'],
  jump: ['.......cb....cb.....','......QSS.....cb....','......QQQ.....QSS...','..............QQQ...']
};
/* nữ ngồi ghế: váy phủ lên đùi, chân thòng xuống trước */
const BSEAT = ['....VUUTUUUUTUUUUT..','...VUUUUUUUUUUUUUUT.','...VVwVwVwVwVwVUUUT.','..............VUUT..','..............VwVw..','..............cb....','..............cb....','.............QSSS...','.............QQQQ...'];
const SKIN = { a:'#ffe0c2', b:'#f5c29a', c:'#d99a72', e:'#1b1b2f', m:'#b5534a', w:'#ffffff', M:'#6e2230', P:'#ff8fa3', G:'#f2b134', K:'#3b2a2a' };
const LOOK = {
  groom:    { ...SKIN, u:'#f5c29a', 1:'#4a4a6a', 2:'#2b2b42', 3:'#17172a', T:'#ffffff', U:'#e3e8f4', V:'#aab3cf', X:'#6f8cff', Y:'#3b5bdb', Z:'#263a94', S:'#f1f3f5', Q:'#9aa3ad' },
  groomWed: { ...SKIN, u:'#f5c29a', 1:'#4a4a6a', 2:'#2b2b42', 3:'#17172a', T:'#5d6270', U:'#3a3f4a', V:'#22252d', X:'#4a4f5a', Y:'#30343d', Z:'#1c1f25', S:'#3a3f4a', Q:'#16181d' },
  guestM:   { ...SKIN, u:'#f5c29a', 1:'#9a6a48', 2:'#6b4226', 3:'#472b18', T:'#7ee08d', U:'#40c057', V:'#2b8a3e', X:'#86a8ea', Y:'#4c6ef5', Z:'#3246b0', S:'#ff8787', Q:'#c92a2a' },
  father:   { ...SKIN, u:'#f5c29a', m:'#8a8f96', 1:'#f1f3f5', 2:'#ced4da', 3:'#868e96', T:'#c9925f', U:'#8d5a2b', V:'#5e3a1a', X:'#7b828a', Y:'#495057', Z:'#343a40', S:'#343a40', Q:'#1b1b2f' },
  bride:    { ...SKIN, u:'#ff9e9e', 1:'#5a4658', 2:'#2b1f2b', 3:'#170f17', R:'#ff6b8b', T:'#fff3a3', U:'#ffd43b', V:'#d9a200', S:'#ffffff', Q:'#c5ccd4' },
  brideWed: { ...SKIN, u:'#ff9e9e', 1:'#5a4658', 2:'#2b1f2b', 3:'#170f17', R:'#ffffff', T:'#ffffff', U:'#eef0f4', V:'#c3c9d4', S:'#ffffff', Q:'#c5ccd4' },
  guestF:   { ...SKIN, u:'#ff9e9e', 1:'#b06a45', 2:'#7a3e22', 3:'#4e2512', R:'#ffd43b', T:'#ffd6e7', U:'#ff8fb8', V:'#d6457a', S:'#ffffff', Q:'#c5ccd4' }
};
const IP = { k:'#1b1b2f', r:'#e8364f', d:'#a61e3a', p:'#ff9eb0', w:'#ffffff', y:'#ffd43b', Y:'#d99e00', o:'#f08c00', n:'#b07a4f', N:'#6b4226',
  g:'#51cf66', G:'#2b8a3e', s:'#dee2e6', S:'#9aa3ad', K:'#495057', b:'#339af0', B:'#1864ab', c:'#fff3d6', t:'#e7d3b5', l:'#a5d8ff' };
const S = {};
function char(rows, look, post) { const c = sprC(rows, LOOK[look]); if (post) post(c.getContext('2d')); return outline(c); }
function suit(x) { x.fillStyle = '#ffffff'; x.fillRect(11, 16, 2, 1); x.fillRect(11, 17, 3, 1); x.fillStyle = '#e03131'; x.fillRect(12, 17, 1, 4); x.fillStyle = '#a61e3a'; x.fillRect(12, 20, 1, 1); }
function veil(x) { x.fillStyle = '#f8f9fa'; x.fillRect(0, 6, 2, 20); x.fillRect(2, 4, 1, 12); x.fillStyle = '#dde1e7'; x.fillRect(0, 22, 2, 5); x.fillRect(0, 10, 1, 3); }
function setC(r, i, ch) { while (r.length <= i) r += '.'; return r.slice(0, i) + ch + r.slice(i + 1); }
const shiftRow = (r, d) => d > 0 ? '.' + r.slice(0, -1) : r.slice(1) + '.';
/* Biểu cảm: n thường · b chớp mắt · t nói · h cười híp mắt + má hồng · o ngạc nhiên */
function faceRows(rows, v) {
  rows = rows.slice();
  if (v === 'b') { rows[7] = setC(setC(rows[7], 12, 'b'), 13, 'b'); }
  if (v === 't') { rows[10] = setC(rows[10], 13, 'm'); rows[11] = setC(setC(rows[11], 13, 'M'), 14, 'M'); }
  if (v === 'h' || v === 'H') { rows[7] = setC(setC(rows[7], 12, 'e'), 13, 'e'); rows[8] = setC(setC(setC(setC(rows[8], 11, 'e'), 12, 'b'), 13, 'b'), 14, 'e');
    rows[9] = setC(setC(rows[9], 14, 'P'), 15, 'P'); rows[10] = setC(setC(rows[10], 13, 'M'), 14, 'M'); if (v === 'H') rows[11] = setC(setC(rows[11], 13, 'M'), 14, 'm'); }
  if (v === 'o') { rows[7] = setC(rows[7], 14, 'e'); rows[10] = setC(setC(rows[10], 13, 'M'), 14, 'M'); rows[11] = setC(setC(rows[11], 13, 'M'), 14, 'M'); }
  return rows;
}
function brideRows(v, legKey) { const r = faceRows(BRIDE, v); const d = legKey === 'walk1' ? 1 : legKey === 'walk2' ? -1 : 0; if (d) for (let i = 22; i < 25; i++) r[i] = shiftRow(r[i], d); return r; }

/* ---- Tay theo khớp: [vai, khuỷu, bàn tay] tính theo toạ độ thân (cột, hàng; hàng 0 = vai, số âm = ngang đầu) ---- */
const ARMS = {
  swingF: [[14, 1], [16, 3], [17, 5]],   // đi bộ: tay đưa trước
  swingB: [[13, 1], [12, 3], [11, 5]],   // đi bộ: tay đưa sau
  jump:   [[14, 1], [16, 0], [17, -3]],
  talk1:  [[14, 1], [15, 3], [17, 2]],   // khoa tay khi nói
  talk2:  [[14, 1], [16, 2], [18, 0]],
  point:  [[14, 1], [16, 1], [19, 0]],   // chỉ tay
  wave1:  [[14, 1], [18, 0], [19, -7]],  // vẫy tay
  wave2:  [[14, 1], [19, -1], [21, -6]],
  hold:   [[14, 1], [15, 3], [16, 3]],   // cầm bát / cốc trước ngực
  lift:   [[14, 1], [16, 2], [16, -3]],  // đưa đũa / cốc lên miệng
  cam:    [[14, 1], [17, 1], [17, -5]],  // cầm máy ảnh
  vsign:  [[14, 1], [18, 0], [20, -7]],  // giơ chữ V
  clap1:  [[14, 1], [16, 3], [17, 1]],   // vỗ tay / chắp tay
  clap2:  [[14, 1], [17, 3], [19, 1]],
  cross:  [[14, 1], [15, 4], [10, 3]],   // khoanh tay vì lạnh
  mouth:  [[14, 1], [16, 2], [15, -3]],  // che miệng cười
  ring:   [[14, 1], [18, 1], [21, 0]]    // chìa hộp nhẫn
};
/* tay sau đưa ra trước người (cột, hàng theo thân) */
const BACK_HAND = { hold: [13, 3], lift: [13, 3], cam: [15, -5], clap1: [16, 2], clap2: [14, 2], cross: [11, 1], ring: [17, 2] };
function plot(rows, x, y, ch) { if (y >= 0 && y < rows.length && x >= 0) rows[y] = setC(rows[y], x, ch); }
function line(x0, y0, x1, y1, fn) {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1; let e = dx + dy;
  for (;;) { fn(x0, y0); if (x0 === x1 && y0 === y1) break; const e2 = 2 * e; if (e2 >= dy) { e += dy; x0 += sx; } if (e2 <= dx) { e += dx; y0 += sy; } }
}
function drawArm(rows, pose, ty) {
  const pts = ARMS[pose].map(([x, y]) => [x, y + ty]), seg = [];
  for (let i = 0; i < pts.length - 1; i++) line(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], (x, y) => seg.push([x, y]));
  const bh = BACK_HAND[pose];
  if (bh) { const [x, y] = [bh[0], bh[1] + ty]; plot(rows, x, y, 'b'); plot(rows, x + 1, y, 'c'); plot(rows, x, y + 1, 'c'); plot(rows, x + 1, y + 1, 'c'); }
  for (const [x, y] of seg) { plot(rows, x, y + 1, 'V'); plot(rows, x + 1, y + 1, 'V'); }
  for (const [x, y] of seg) { plot(rows, x, y, 'T'); plot(rows, x + 1, y, 'T'); }
  const [hx, hy] = pts[pts.length - 1];
  plot(rows, hx, hy, 'a'); plot(rows, hx + 1, hy, 'b'); plot(rows, hx, hy + 1, 'b'); plot(rows, hx + 1, hy + 1, 'c');
  if (pose === 'vsign') { plot(rows, hx, hy - 1, 'b'); plot(rows, hx - 1, hy - 2, 'b'); plot(rows, hx - 1, hy - 3, 'a'); plot(rows, hx + 1, hy - 1, 'b'); plot(rows, hx + 2, hy - 2, 'b'); plot(rows, hx + 2, hy - 3, 'a'); }
}
/* Ghép một khung hình nhân vật (có bộ nhớ đệm).
   kind: 'm' (nam) | 'f' (nữ); legs: idle/run1-3/walk1-2/jump/seat/kneel/floor; arm: null hoặc khoá trong ARMS; face: n/b/t/h/H/o */
const SPR = new Map();
function bodyTop(kind, legs) { return kind === 'f' ? 3 : legs === 'kneel' ? 7 : legs === 'floor' ? 0 : 2; }
function torsoRow(kind, legs) { return bodyTop(kind, legs) + 14; }
function body(look, kind, legs, arm, face) {
  const key = look + '|' + kind + '|' + legs + '|' + arm + '|' + face; let c = SPR.get(key); if (c) return c;
  let rows; const top = bodyTop(kind, legs), ty = top + 14, free = arm && BACK_HAND[arm];
  if (kind === 'f') {
    const b = brideRows(face, legs);
    if (arm) b.splice(14, 6, ...(free ? BTORSO_ARM_FREE : BTORSO_ARM));
    rows = Array(top).fill(BLANK).concat(legs === 'seat' ? b.slice(0, 20).concat(BSEAT) : b.concat(BLEGS[legs] || BLEGS.idle));
  } else {
    const torso = arm ? (free ? TORSO_ARM_FREE : TORSO_ARM) : TORSO;
    const lg = legs === 'kneel' ? KNEEL : legs === 'floor' ? SIT : LEGS[legs] || LEGS.idle;
    rows = Array(top).fill(BLANK).concat(faceRows(HEAD, face), torso, lg);
  }
  rows = rows.map(r => r.padEnd(24, '.'));
  if (arm) drawArm(rows, arm, ty);
  c = outline(sprC(rows, LOOK[look])); SPR.set(key, c); return c;
}
function buildVariants() { SPR.clear(); }
/* danh sách khung hình cho trang tools/sprites.html */
function spriteCatalog() {
  const out = [], faces = ['n', 'b', 't', 'h', 'H', 'o'];
  for (const f of faces) out.push(['mặt|' + f, body('groom', 'm', 'idle', null, f)]);
  for (const f of faces) out.push(['mặt|nữ ' + f, body('bride', 'f', 'idle', null, f)]);
  for (const k of ['idle', 'run1', 'run2', 'run3', 'jump', 'seat', 'kneel']) out.push(['chân|nam ' + k, body('groom', 'm', k, null, 'n')]);
  for (const k of ['idle', 'walk1', 'walk2', 'jump', 'seat']) out.push(['chân|nữ ' + k, body('bride', 'f', k, null, 'n')]);
  for (const a in ARMS) out.push(['tay nam|' + a, body('groom', 'm', a === 'ring' ? 'kneel' : 'idle', a, 'n')]);
  for (const a in ARMS) out.push(['tay nữ|' + a, body('bride', 'f', 'idle', a, 'n')]);
  for (const l of ['guestM', 'guestF', 'father']) out.push(['khách|' + l, l === 'guestF' ? body(l, 'f', 'idle', 'wave1', 'h') : body(l, 'm', l === 'father' ? 'floor' : 'idle', l === 'father' ? null : 'clap1', 'h')]);
  return out;
}
function buildSprites() {
  const top = [BLANK, BLANK].concat(HEAD, TORSO);
  S.groomWed = char(top.concat(LEGS.idle), 'groomWed', suit);
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
