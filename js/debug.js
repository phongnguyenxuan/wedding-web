/* ================== DEBUG: CHỌN MÀN ================== */
/*
 * Bật bằng cách thêm ?debug vào URL (vd. index.html?debug). Có thể kèm ?debug=3 để vào thẳng màn 3.
 * Phím tắt: 1–9 nhảy màn · [ / ] màn trước / sau · R chơi lại màn · F tua nhanh (x1 → x3 → x6)
 */
(() => {
  const q = new URLSearchParams(location.search);
  if (!q.has('debug')) return;
  const SPEEDS = [1, 3, 6];
  const bar = document.createElement('div'); bar.id = 'debug';
  bar.innerHTML = `<b>DEBUG</b>
    <button type="button" data-d="prev" title="Màn trước ( [ )">◀</button>
    <select aria-label="Chọn màn">${CHAPTERS.map((C, i) => `<option value="${i}">${i + 1}. ${esc(CITIES[C.city][0])} – ${esc(C.title)}</option>`).join('')}</select>
    <button type="button" data-d="next" title="Màn sau ( ] )">▶</button>
    <button type="button" data-d="go" title="Chơi lại màn (R)">↻</button>
    <button type="button" data-d="speed" title="Tua nhanh (F)">x1</button>
    <button type="button" data-d="card" title="Mở thiệp">Thiệp</button>`;
  document.body.append(bar);
  const sel = bar.querySelector('select'), spdBtn = bar.querySelector('[data-d="speed"]');
  const go = i => { i = (i + CHAPTERS.length) % CHAPTERS.length; sel.value = i; jumpChapter(i); };
  const cur = () => mode === 'scene' ? chapter : +sel.value;
  const speed = () => { timeScale = SPEEDS[(SPEEDS.indexOf(timeScale) + 1) % SPEEDS.length]; spdBtn.textContent = 'x' + timeScale; };
  sel.onchange = () => go(+sel.value);
  bar.onclick = e => { const d = e.target.dataset.d; if (!d) return;
    if (d === 'prev') go(cur() - 1); else if (d === 'next') go(cur() + 1); else if (d === 'go') go(cur());
    else if (d === 'speed') speed(); else if (d === 'card') { if (!guest.name) guest.name = 'Khách'; closeModal(); openCard(); }
    e.target.blur(); };
  // giữ ô chọn khớp với màn đang chạy (khi kịch bản tự sang màn tiếp)
  setInterval(() => { if (mode === 'scene' && +sel.value !== chapter) sel.value = chapter; }, 300);
  addEventListener('keydown', e => {
    if (e.target.closest && e.target.closest('input, textarea, select') || e.ctrlKey || e.metaKey || e.altKey) return;
    const n = +e.key;
    if (n >= 1 && n <= CHAPTERS.length) go(n - 1);
    else if (e.key === '[') go(cur() - 1);
    else if (e.key === ']') go(cur() + 1);
    else if (e.code === 'KeyR') go(cur());
    else if (e.code === 'KeyF') speed();
  });
  const start = parseInt(q.get('debug'), 10);
  if (start >= 1 && start <= CHAPTERS.length) setTimeout(() => go(start - 1));
})();
