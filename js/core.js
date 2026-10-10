/* ================== HẰNG SỐ & BIẾN ================== */
const W = 480, H = 270, GY = 222, GRAV = 1350;
const cv = document.getElementById('game'), ctx = cv.getContext('2d', { willReadFrequently: true });   // cảnh Nam Định đọc lại điểm ảnh mỗi khung để soi bóng
ctx.imageSmoothingEnabled = false;
const $ = id => document.getElementById(id);
const stage = $('stage'), app = $('app'), modal = $('modal');
let guest = { gender: 'm', name: '', side: 'bride' };
let time = 0, cam = 0, mode = 'idle', L = null;
let particles = [], rain = [];
