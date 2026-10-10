/* ================== ĐIỀU KHIỂN ================== */
addEventListener('keydown', e => {
  if (!modal.hidden) return;
  if (dlg && (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyZ')) { e.preventDefault(); if (!e.repeat) advance(); }
});
stage.addEventListener('pointerdown', e => { if (dlg && !e.target.closest('button')) { e.preventDefault(); advance(); } });
function layout() {
  const cs = getComputedStyle(document.documentElement);
  const ah = innerHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 8;
  const w = Math.floor(Math.min(innerWidth - 8, ah * 16 / 9));
  stage.style.width = w + 'px'; stage.style.height = Math.floor(w * 9 / 16) + 'px';
  stage.style.fontSize = Math.max(12, Math.min(24, w / 40)) + 'px';
}
addEventListener('resize', layout);

/* ================== KHỞI ĐỘNG ================== */
buildSprites(); buildVariants(); layout(); showMenu(); requestAnimationFrame(loop);
if (document.fonts) document.fonts.load('16px "VT323"', 'Tin nhắn ễ ữ').then(() => txtCache.clear()).catch(() => {});
