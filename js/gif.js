class BW { constructor() { this.a = new Uint8Array(1 << 20); this.n = 0; }
  b(v) { if (this.n >= this.a.length) { const t = new Uint8Array(this.a.length * 2); t.set(this.a); this.a = t; } this.a[this.n++] = v; }
  w16(v) { this.b(v & 255); this.b(v >> 8 & 255); } s(str) { for (let i = 0; i < str.length; i++) this.b(str.charCodeAt(i)); }
  out() { return this.a.slice(0, this.n); } }
function lzw(bw, idx, minSize) {
  bw.b(minSize);
  const clear = 1 << minSize, eoi = clear + 1; let next = eoi + 1, size = minSize + 1, cur = 0, shift = 0, bn = 0;
  const blk = new Uint8Array(255);
  const byte = v => { blk[bn++] = v; if (bn === 255) { bw.b(255); for (let i = 0; i < 255; i++) bw.b(blk[i]); bn = 0; } };
  const emit = code => { cur |= code << shift; shift += size; while (shift >= 8) { byte(cur & 255); cur >>>= 8; shift -= 8; } };
  let table = new Map(); emit(clear); let ib = idx[0];
  for (let i = 1; i < idx.length; i++) {
    const k = idx[i], key = (ib << 8) | k, c = table.get(key);
    if (c === undefined) { emit(ib); if (next === 4096) { emit(clear); next = eoi + 1; size = minSize + 1; table = new Map(); } else { if (next >= (1 << size)) size++; table.set(key, next++); } ib = k; }
    else ib = c;
  }
  emit(ib); emit(eoi); if (shift > 0) byte(cur & 255);
  if (bn > 0) { bw.b(bn); for (let i = 0; i < bn; i++) bw.b(blk[i]); }
  bw.b(0);
}
function encodeGIF(w, h, pal, frames, delay) {
  let bits = 1; while ((1 << bits) < pal.length) bits++;
  const bw = new BW(); bw.s('GIF89a'); bw.w16(w); bw.w16(h); bw.b(0x80 | ((bits - 1) << 4) | (bits - 1)); bw.b(0); bw.b(0);
  for (let i = 0; i < (1 << bits); i++) { const c = pal[i] || [0, 0, 0]; bw.b(c[0]); bw.b(c[1]); bw.b(c[2]); }
  bw.b(0x21); bw.b(0xFF); bw.b(11); bw.s('NETSCAPE2.0'); bw.b(3); bw.b(1); bw.w16(0); bw.b(0);
  for (const fr of frames) { bw.b(0x21); bw.b(0xF9); bw.b(4); bw.b(0); bw.w16(delay); bw.b(0); bw.b(0);
    bw.b(0x2C); bw.w16(0); bw.w16(0); bw.w16(w); bw.w16(h); bw.b(0); lzw(bw, fr, Math.max(2, bits)); }
  bw.b(0x3B); return bw.out();
}
async function buildGif(onProgress) {
  const N = 12, SC = 3, c = document.createElement('canvas'); c.width = CW; c.height = CH; const x = c.getContext('2d');
  const map = new Map(), pal = [], frames = [];
  const nearest = (r, g, b) => { let bi = 0, bd = 1e9; pal.forEach((p, i) => { const d = (p[0] - r) ** 2 + (p[1] - g) ** 2 + (p[2] - b) ** 2; if (d < bd) { bd = d; bi = i; } }); return bi; };
  for (let f = 0; f < N; f++) {
    drawCard(x, f); const d = x.getImageData(0, 0, CW, CH).data; const small = new Uint8Array(CW * CH);
    for (let i = 0, j = 0; i < d.length; i += 4, j++) { const key = d[i] << 16 | d[i + 1] << 8 | d[i + 2]; let ix = map.get(key);
      if (ix === undefined) { if (pal.length < 256) { ix = pal.length; pal.push([d[i], d[i + 1], d[i + 2]]); } else ix = nearest(d[i], d[i + 1], d[i + 2]); map.set(key, ix); } small[j] = ix; }
    const big = new Uint8Array(CW * SC * CH * SC); const BWd = CW * SC;
    for (let yy = 0; yy < CH; yy++) { const rowS = new Uint8Array(BWd); for (let xx = 0; xx < CW; xx++) rowS.fill(small[yy * CW + xx], xx * SC, xx * SC + SC); for (let s = 0; s < SC; s++) big.set(rowS, (yy * SC + s) * BWd); }
    frames.push(big); onProgress && onProgress(f + 1, N); await new Promise(r => setTimeout(r, 0));
  }
  return encodeGIF(CW * SC, CH * SC, pal, frames, 12);
}
async function saveGif() {
  const btn = $('save'), st = $('st'); btn.disabled = true;
  try {
    const bytes = await buildGif((i, n) => { st.textContent = `Đang tạo GIF… ${i}/${n}`; });
    const blob = new Blob([bytes], { type: 'image/gif' });
    const fname = `thiep-cuoi-${slug(CONFIG.groom)}-${slug(CONFIG.bride)}.gif`;
    const touch = matchMedia('(pointer: coarse)').matches;
    showGifImage(blob);
    if (touch) st.textContent = 'Nhấn giữ ảnh để lưu GIF, rồi đăng lên mạng xã hội thôi!';
    else { downloadBlob(blob, fname); st.textContent = 'Đã tải thiệp về máy. Đăng lên mạng xã hội thôi!'; }
  } catch (e) { st.textContent = 'Không tạo được GIF trên thiết bị này. Hãy chụp màn hình thiệp nhé.'; }
  btn.disabled = false;
}
function downloadBlob(blob, fname) {
  const url = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = url; a.download = fname; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
function showGifImage(blob) {
  const r = new FileReader();
  r.onload = () => { if (!$('cardView')) return; clearInterval(cardTimer); const img = document.createElement('img'); img.src = r.result; img.alt = 'Thiệp cưới dạng GIF'; img.id = 'cardView'; img.style.userSelect = 'auto'; img.style.webkitTouchCallout = 'default'; $('cardView').replaceWith(img); };
  r.readAsDataURL(blob);
}
