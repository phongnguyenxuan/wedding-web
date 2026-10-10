/* ================== GIAO DIỆN TRONG CẢNH ================== */
let tipTimer = 0;
function tip(t) { const e = $('tip'); e.textContent = t; e.classList.add('on'); clearTimeout(tipTimer); tipTimer = setTimeout(() => e.classList.remove('on'), 1600); }
let memTimer = 0;
function showMemory(mem) {
  const cap = typeof mem === 'string' ? mem : mem && mem.caption, photo = mem && typeof mem === 'object' ? mem.photo : '';
  $('memCap').textContent = cap || '';
  const ph = $('memPhoto'); ph.classList.toggle('has', !!photo); ph.style.backgroundImage = photo ? `url("${encodeURI(photo)}")` : '';
  const m = $('memory'); m.classList.add('on'); clearTimeout(memTimer); memTimer = setTimeout(() => m.classList.remove('on'), 2200); }
let bnTimer = 0;
function showBanner(n, t, h, done, dur = 1300) {
  $('bnN').textContent = n; $('bnT').textContent = t; $('bnH').textContent = h || ''; $('banner').hidden = false;
  clearTimeout(bnTimer); bnTimer = setTimeout(() => { $('banner').hidden = true; done && done(); }, dur);
}
let dlg = null;
function dialog(lines, done) { dlg = { lines, i: 0, done }; $('dialog').hidden = false; showLine(); }
function showLine() { $('dialog').classList.toggle('side', phone.on); const [who, txt] = dlg.lines[dlg.i]; $('dlgWho').textContent = who; dlg.full = txt; dlg.shown = 0; $('dlgTxt').textContent = ''; $('dialog').classList.toggle('narr', !who); sfx('blip'); dlgT = 0; }
function advance() {
  if (!dlg) return; if (dlg.shown < dlg.full.length) { dlg.shown = dlg.full.length; $('dlgTxt').textContent = dlg.full; dlgT = 0; return; } dlg.i++;
  if (dlg.i >= dlg.lines.length) { const d = dlg.done; dlg = null; $('dialog').hidden = true; d && d(); }
  else showLine();
}
$('dialog').addEventListener('pointerdown', e => { e.preventDefault(); advance(); });
$('toCard').onclick = () => { if (mode === 'idle') return; openCard(); };

/* ================== MODAL ================== */
function openModal(html) { modal.innerHTML = '<div class="panel">' + html + '</div>'; modal.hidden = false; }
function closeModal() { modal.hidden = true; modal.innerHTML = ''; }
function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
function spriteThumb(img, scale) { const c = document.createElement('canvas'); c.width = img.width * scale; c.height = img.height * scale; const x = c.getContext('2d'); x.imageSmoothingEnabled = false; x.drawImage(img, 0, 0, c.width, c.height); return c; }

function showMenu() {
  stopStory(); mode = 'idle'; fireworks = 0; $('lvlName').textContent = '';
  openModal(`
    <h1>${esc(CONFIG.groom)} &amp; ${esc(CONFIG.bride)}</h1>
    <p class="sub">Từ bát bún riêu Hàng Mã tới hoàng hôn Phú Quốc. Xem hành trình của hai đứa rồi nhận thiệp mời</p>
    <div class="field"><span>Bạn là</span><div class="row">
      <button type="button" class="choice" data-g="m" aria-pressed="${guest.gender === 'm'}"></button>
      <button type="button" class="choice" data-g="f" aria-pressed="${guest.gender === 'f'}"></button></div></div>
    <label class="field"><span>Tên của bạn (in trên thiệp)</span><input type="text" id="gname" maxlength="24" value="${esc(guest.name)}" autocomplete="nickname"></label>
    <div class="field"><span>Bạn là khách của</span><div class="row">
      <button type="button" class="choice" data-s="bride" aria-pressed="${guest.side === 'bride'}">Cô dâu ${esc(CONFIG.bride)}</button>
      <button type="button" class="choice" data-s="groom" aria-pressed="${guest.side === 'groom'}">Chú rể ${esc(CONFIG.groom)}</button></div></div>
    <p class="err" id="err"></p>
    <div class="actions"><button type="button" class="btn wide" id="go">Bắt đầu xem</button><button type="button" class="link" id="skip">Bỏ qua, xem thiệp ngay</button></div>`);
  const gb = modal.querySelectorAll('[data-g]');
  gb[0].append(spriteThumb(S.guestM, 3), 'Nam'); gb[1].append(spriteThumb(S.guestF, 3), 'Nữ');
  gb.forEach(b => b.onclick = () => { guest.gender = b.dataset.g; gb.forEach(x => x.setAttribute('aria-pressed', x === b)); });
  const sb = modal.querySelectorAll('[data-s]');
  sb.forEach(b => b.onclick = () => { guest.side = b.dataset.s; sb.forEach(x => x.setAttribute('aria-pressed', x === b)); });
  const read = () => { guest.name = $('gname').value.trim(); if (!guest.name) { $('err').textContent = 'Nhập tên để thiệp ghi đúng tên bạn.'; $('gname').focus(); return false; } return true; };
  $('go').onclick = () => { if (!read()) return; sfx('power'); closeModal(); startGame(); };
  $('skip').onclick = () => { if (!read()) return; closeModal(); openCard(); };
  $('gname').addEventListener('keydown', e => { if (e.key === 'Enter') $('go').click(); });
}

function askRsvp() {
  const W8 = CONFIG.wedding[guest.side];
  openModal(`<h2 style="text-align:center;font-size:34px;color:var(--red)">${esc(guest.name)} ơi, bạn sẽ đến chung vui cùng ${esc(CONFIG.groom)} &amp; ${esc(CONFIG.bride)} chứ?</h2>
    <p class="sub">${esc(W8.time)} tại ${esc(W8.label)}</p>
    <div class="actions" style="flex-direction:row;justify-content:center;flex-wrap:wrap">
    <button type="button" class="btn" data-y>Đồng ý</button><button type="button" class="btn" data-y>Có, đồng ý</button></div>`);
  modal.querySelectorAll('[data-y]').forEach(b => b.onclick = () => { sfx('yes'); closeModal(); openCard(); });
}
