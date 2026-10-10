/* ================== THIỆP & GIF ================== */
const txtCache = new Map();
function pixText(str, size, color) {
  const key = str + '|' + size + '|' + color; if (txtCache.has(key)) return txtCache.get(key);
  const font = `${size}px "VT323", "Noto Sans", sans-serif`;
  const m = document.createElement('canvas').getContext('2d'); m.font = font;
  const w = Math.max(1, Math.ceil(m.measureText(str).width) + 2), h = Math.ceil(size * 1.4) + 2;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const x = c.getContext('2d'); x.font = font; x.textBaseline = 'top'; x.fillStyle = '#000'; x.fillText(str, 1, Math.round(size * .25));
  const id = x.getImageData(0, 0, w, h), [r, g, b] = hexRGB(color);
  for (let i = 0; i < id.data.length; i += 4) { if (id.data[i + 3] >= 110) { id.data[i] = r; id.data[i + 1] = g; id.data[i + 2] = b; id.data[i + 3] = 255; } else id.data[i + 3] = 0; }
  x.putImageData(id, 0, 0); txtCache.set(key, c); return c;
}
function fitText(str, maxW, size, color, min = 14) { let c = pixText(str, size, color); while (c.width > maxW && size > min) { size -= 2; c = pixText(str, size, color); } return c; }
function wrapText(str, maxW, size, color) {
  const words = str.split(' '), lines = []; let cur = '';
  for (const w of words) { const t = cur ? cur + ' ' + w : w; if (pixText(t, size, color).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
  if (cur) lines.push(cur); return lines.map(l => pixText(l, size, color));
}
function center(c, img, y) { c.drawImage(img, Math.round((CW - img.width) / 2), Math.round(y)); }
const CW = 320, CH = 400;
let cardBgC = null;
function cardBg() { if (cardBgC) return cardBgC; const c = document.createElement('canvas'); c.width = CW; c.height = CH; const x = c.getContext('2d'); const id = x.createImageData(CW, CH);
  ditherInto(id, CW, ['#fff8e6', '#fff1d8', '#ffe8de', '#ffdfe4'], 0, CH); x.putImageData(id, 0, 0); return cardBgC = c; }
function drawCard(c, f) {
  c.imageSmoothingEnabled = false;
  const red = '#d7263d', ink = '#3a1d2e', gold = '#f2b134';
  c.drawImage(cardBg(), 0, 0);
  c.fillStyle = '#b3202f'; c.fillRect(0, 0, CW, 10); c.fillRect(0, CH - 10, CW, 10); c.fillRect(0, 0, 10, CH); c.fillRect(CW - 10, 0, 10, CH);
  c.fillStyle = '#d7263d'; c.fillRect(0, 0, CW, 2); c.fillRect(0, 0, 2, CH);
  c.fillStyle = gold; c.fillRect(14, 14, CW - 28, 2); c.fillRect(14, CH - 16, CW - 28, 2); c.fillRect(14, 14, 2, CH - 28); c.fillRect(CW - 16, 14, 2, CH - 28);
  c.fillStyle = '#ffe08a'; c.fillRect(18, 18, CW - 36, 1); c.fillRect(18, 18, 1, CH - 36);
  for (let i = 6, k = 0; i < CW - 6; i += 14, k++) { c.fillStyle = (k + f) % 2 ? '#ffd43b' : '#ff9eb0'; c.fillRect(i, 4, 3, 3); c.fillRect(CW - i - 3, CH - 7, 3, 3); }
  for (let j = 6, k = 0; j < CH - 6; j += 14, k++) { c.fillStyle = (k + f) % 2 ? '#ff9eb0' : '#ffd43b'; c.fillRect(4, j, 3, 3); c.fillRect(CW - 7, CH - j - 3, 3, 3); }
  [[22, 22], [CW - 35, 22], [22, CH - 34], [CW - 35, CH - 34]].forEach(([x, y]) => c.drawImage(S.heart, x, y));
  center(c, pixText('囍', 38, red), 14);
  const gT = fitText(CONFIG.groom, 112, 34, red), bT = fitText(CONFIG.bride, 112, 34, red);
  const tw = gT.width + bT.width + 38, nx = Math.round((CW - tw) / 2);
  c.drawImage(gT, nx, 58); c.drawImage(S.heart, nx + gT.width + 6, 72, 26, 24); c.drawImage(bT, nx + gT.width + 38, 58);
  const base = 196;
  for (let k = 0; k < 6; k++) { const hx = 132 + k * 11, hy = base - 76 - ((f * 2 + k * 7) % 16); c.drawImage(S.heart, hx, hy); }
  c.fillStyle = '#51cf66'; c.fillRect(34, base, CW - 68, 3); c.fillStyle = '#2f9e44'; c.fillRect(34, base + 3, CW - 68, 1);
  for (let x = 38; x < CW - 38; x += 11) { c.fillStyle = (x >> 1) % 2 ? '#ff8fab' : '#ffd43b'; c.fillRect(x, base - 2, 3, 2); }
  const hop = f % 2 ? 3 : 0;
  c.drawImage(S.groomWed, 114, base - 67, 44, 68); c.drawImage(flipped(S.brideWed), 158, base - 67, 44, 68);
  c.drawImage(guest.gender === 'm' ? S.guestM : S.guestF, 48, base - 67 - hop, 44, 68);
  c.drawImage(S.flower, 238, base - 36 + (hop ? 0 : 1), 32, 36);
  let y = 202;
  center(c, pixText('Trân trọng kính mời', 22, ink), y); y += 24;
  center(c, fitText(guest.name || 'Bạn', CW - 56, 34, red), y); y += 38;
  const W8 = CONFIG.wedding[guest.side];
  center(c, pixText('tới dự lễ cưới tại ' + W8.label, 22, ink), y); y += 24;
  center(c, fitText(W8.time, CW - 56, 22, red), y); y += 25;
  let lines = wrapText(W8.address, CW - 56, 20, ink); if (lines.length > 2) lines = wrapText(W8.address, CW - 56, 18, ink);
  lines.slice(0, 2).forEach(l => { center(c, l, y); y += 19; });
  const hl = pixText('Hẹn gặp bạn ở tiệc cưới!', 20, '#7a5a66'), hx = Math.round((CW - hl.width - 16) / 2);
  const hy = Math.min(CH - 44, Math.max(y + 4, CH - 53)); c.drawImage(S.heart, hx, hy + 8); c.drawImage(hl, hx + 16, hy);
}

let cardTimer = 0;
async function openCard() {
  stopStory(true);
  try { await document.fonts.load('18px "VT323"', 'Trân trọng kính mời ễ ữ'); } catch (e) {}
  txtCache.clear();
  openModal(`<h2 style="text-align:center">Thiệp mời của ${esc(guest.name || 'bạn')}</h2>
    <canvas id="cardView" width="${CW}" height="${CH}"></canvas>
    <p class="status" id="st"></p>
    <div class="actions"><button type="button" class="btn wide" id="save">Lưu thiệp GIF</button><button type="button" class="btn alt wide" id="again">Xem lại</button></div>`);
  const cc = $('cardView').getContext('2d'); let f = 0;
  clearInterval(cardTimer); cardTimer = setInterval(() => { if (!$('cardView')) return clearInterval(cardTimer); drawCard(cc, f++ % 12); }, 120);
  drawCard(cc, 0);
  $('save').onclick = saveGif;
  $('again').onclick = () => { clearInterval(cardTimer); closeModal(); showMenu(); };
}
function slug(s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().replace(/[^a-z0-9]+/g, '-'); }
