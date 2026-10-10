/* ================== KỊCH BẢN HÀNH TRÌNH ================== */
/*
 * Lệnh kịch bản: place · walk · title · ['G'|'B'|'P', lời thoại] · emote · jump · wait · until (chờ tới khi hàm trả về true) · fn · memory · end
 * cut: [theme, tên cảnh] – chuyển cảnh trong cùng chương (tối màn, xoá hết diễn viên/đạo cụ, đổi theme)
 * pose: [tên, tư thế] – eat (ngồi ăn bún), sit, drink, offer (đưa cốc), mot (hút nước Mót), cheer (cụng ly Mót), wave, cam (chụp ảnh), vsign,
 *       clap, pray (chắp tay ước), cold (run vì lạnh), point, giggle (che miệng cười), kneel,
 *       sing (cầm micro hát), guitar (ngồi ôm đàn gảy theo props.song), null = đứng thường
 * face: [tên, 1 | -1] – quay phải / trái
 */
let fireworks = 0, fwNext = 0;
const CHAPTERS = [
  { city: 'hanoi', title: 'Bún riêu Hàng Mã', theme: 'hanoi', build: () => { const G = nm('G'), B = nm('B'); return [
    { place: ['guest', 'guest', 520, -1] }, { place: ['groom', 'groom', -40, 1] }, { place: ['bride', 'bride', -70, 1] },
    { title: 1 }, { walk: ['bride', 226, true] }, { walk: ['groom', 292] },
    { face: ['bride', 1] }, { face: ['groom', -1] }, { fn: () => { props.eating = true; } },
    { pose: ['bride', 'eat'] }, { pose: ['groom', 'eat'] }, { wait: 3 },
    { walk: ['guest', 338] }, { pose: ['guest', 'wave'] }, { wait: .8 },
    ['P', 'Lại bún riêu à? Tuần này lần thứ ba rồi đấy!'], { pose: ['guest', null] },
    { emote: ['bride', 'heart'] }, ['B', 'Bún riêu Hàng Mã thì ăn bao nhiêu cũng không chán!'], { wait: 1.6 },
    ['G', 'Ăn xong, mình đi du lịch nhé. Đi khắp Việt Nam!'],
    { pose: ['bride', null] }, { pose: ['groom', null] }, { fn: () => { props.eating = false; } }, { jump: 'bride' }, { pose: ['guest', 'clap'] },
    { memory: 0 }, { end: 1 }]; } },
  { city: 'namdinh', title: 'Nhà thờ đổ Hải Lý', theme: 'namdinh', build: () => [
    { place: ['groom', 'groomND', 20, 1] }, { place: ['bride', 'brideND', -10, 1] }, { title: 2 },
    { walk: ['bride', 190, true] }, { walk: ['groom', 220] }, { face: ['groom', -1] },
    { pose: ['bride', 'point'] }, ['B', 'Nhà thờ đổ giữa biển, vừa buồn vừa đẹp anh nhỉ.'],
    { pose: ['bride', 'cam'] }, { wait: .6 }, { fn: () => { flashA = .7; sfx('blip'); } }, { wait: .5 },
    ['G', 'Chụp xong mình đi ăn phở bò Nam Định nhé!'], { pose: ['bride', null] }, { emote: ['bride', 'heart'] },
    { memory: 1 }, { end: 1 }] },
  /* tắm thác cùng 4 người bạn (js/hoabinh.js): mỗi người một kiểu nhảy từ mỏm đá – lộn nhào, "thả bom", bịt mũi –
     cuối cùng hai đứa nắm tay nhảy cùng nhau. hbJump(tên, { vx, vy, flip, big, pose, hearts, to: chỗ bơi tới sau khi nổi lên }) */
  { city: 'hoabinh', title: 'Tắm thác giữa rừng', theme: 'hoabinh', build: () => { const [T1, T2, T3, T4] = hbFriends(); return [
    // các bạn tới trước, đã đứng sẵn trên các bậc đá (người nhảy đầu trên mỏm, người sau xếp hàng bậc dưới);
    // hai đứa và bạn quay phim từ bãi sỏi đi vào
    { place: [T1, 'frM1', 378, -1] }, { place: [T3, 'frM3', 336, -1] }, { place: [T4, 'frF', 310, -1] },
    { place: ['groom', 'groomSwim', 12, 1] }, { place: ['bride', 'brideSwim', -12, 1] }, { place: [T2, 'frM2', -40, 1] },
    { title: 3 },
    { walk: [T2, 34, true] }, { walk: ['bride', 176, true] }, { walk: ['groom', 198, true] }, { pose: [T2, 'cam'] },
    [T1, 'Xem tao lộn một vòng nhé!'],
    // người trước vừa rời mỏm thì người sau bước lên ngay, ai rơi xuống nước thì bơi dạt sang trái nhường chỗ đáp
    { fn: () => hbJump(T1, { vx: -140, vy: 250, flip: 1, to: 192 }) }, { walk: [T3, 378, true] }, { walk: [T4, 340, true] }, { wait: .5 },
    { emote: ['bride', '!'] }, { pose: ['bride', 'clap'] }, ['B', 'Đỉnh quá! Mười điểm!'], { pose: ['bride', null] },
    { walk: [T3, 378] }, { face: [T3, -1] }, [T3, 'Giờ đến màn "thả bom" nè!'],
    { fn: () => hbJump(T3, { vx: -150, vy: 210, big: 1, pose: { legs: 'seat', arm: 'cross', face: 'H' }, to: 216 }) }, { walk: [T4, 378, true] },
    { walk: ['groom', 364, true] }, { walk: ['bride', 376, true] }, { wait: .5 },
    { emote: ['groom', '!'] }, ['B', 'Ướt hết cả rồi!'],
    { walk: [T4, 378] }, { face: [T4, -1] },
    { fn: () => hbJump(T4, { vx: -150, vy: 200, pose: { arm: 'mouth', face: 'o' }, to: 150 }) }, [T4, 'Bịt mũi… nhảy nè!'],
    // hai đứa đứng sát nhau trên mỏm, nhảy cùng lúc với cùng một quỹ đạo nên bay song song như đang nắm tay
    { walk: ['groom', 364] }, { walk: ['bride', 376] }, { face: ['groom', -1] }, { face: ['bride', -1] },
    ['G', 'Đến lượt mình! Nắm chặt tay anh nhé!'], [T2, 'Một… hai… ba!'],
    { fn: () => { hbJump('groom', { vx: -150, vy: 230, hearts: 1 }); hbJump('bride', { vx: -150, vy: 230, hearts: 1, pose: { arm: 'point', face: 'H' } }); } }, { wait: .8 },
    { fn: () => heartRain(272) }, { emote: ['bride', 'heart'] }, { emote: ['groom', 'heart'] }, { pose: [T2, 'wave'] },
    ['G', 'Thác cao mấy, nắm tay em là anh nhảy được hết.'],
    { memory: 2 }, { end: 1 }]; } },
  { city: 'danang', title: 'Cầu Rồng', theme: 'danang', build: () => [
    { place: ['groom', 'groomDN', 20, 1] }, { place: ['bride', 'brideDN', -10, 1] }, { title: 4 },
    { walk: ['bride', 190, true] }, { walk: ['groom', 220] },
    { fn: () => { props.fire = 2.2; sfx('boom'); } }, { emote: ['bride', '!'] }, { pose: ['bride', 'point'] }, ['B', 'Rồng phun lửa kìa anh!'],
    { pose: ['bride', null] }, { face: ['groom', -1] }, ['G', 'Đẹp thật. Nhưng anh thích nhìn em hơn.'],
    { emote: ['bride', 'heart'] }, { pose: ['bride', 'giggle'] }, { wait: 1.2 }, { pose: ['bride', null] },
    { memory: 3 }, { end: 1 }] },
  /* phố cổ bên sông Hoài (js/hoian.js): ghé xe nước Mót, hai đứa hút ống hút so le nhau (pose 'mot') rồi cụng ly ('cheer');
     vừa nhâm nhi vừa thả hoa đăng ước nguyện. Đứng cách nhau 30px để hai cốc giơ ra chạm đúng miệng cốc */
  { city: 'hoian', title: 'Phố đèn lồng', theme: 'hoian', build: () => [
    { place: ['bride', 'brideHA', 20, 1] }, { place: ['groom', 'groomHA', -10, 1] }, { title: 5 },
    { walk: ['groom', 224, true] }, { walk: ['bride', 254] },
    { pose: ['bride', 'point'] }, ['B', 'Đến Hội An là phải uống nước Mót anh ạ!'], { pose: ['bride', null] },
    { fn: () => { props.serve = 1; sfx('blip'); } }, ['Chị bán Mót', 'Hai cốc Mót có cánh sen đây, mát lạnh luôn!'],
    { fn: () => { props.serve = 0; } }, { pose: ['bride', 'mot'] }, { pose: ['groom', 'mot'] }, { face: ['bride', -1] }, { wait: 3.4 },
    ['G', 'Thơm mùi thảo mộc, ngọt dịu. Ngon thật!'], { emote: ['bride', 'heart'] },
    ['B', 'Cụng ly nào! Chúc mình đi đâu cũng có nhau.'],
    { pose: ['groom', 'cheer'] }, { pose: ['bride', 'cheer'] }, { wait: .3 }, { fn: haClink }, { wait: 1.1 },
    { pose: ['groom', 'mot'] }, { pose: ['bride', 'mot'] },
    { fn: () => { props.lantern = { x: 236, y: 214 }; sfx('power'); } }, ['B', 'Thả hoa đăng rồi ước đi anh.'], { emote: ['groom', '...'] }, { wait: 1.6 },
    ['G', 'Anh ước năm nào cũng được cùng em đi khắp nơi thế này.'], { emote: ['bride', 'heart'] },
    { memory: 4 }, { end: 1 }] },
  /* phố đi bộ đêm khu Hòa Bình (js/dalat.js): nhóm hát rong đang hát (props.song), chú rể mua hai ly sữa đậu nành nóng
     ở xe đẩy, hết bài khán giả vỗ tay, anh hát rong tặng bài tình ca cho các cặp đôi; hai đứa lại gần nghe, chú rể góp tiền vào hộp đàn */
  { city: 'dalat', title: 'Phố đêm hát rong', theme: 'dalat', build: () => [
    { place: ['Anh hát rong', 'busker', 366, -1] }, { place: ['Anh guitar', 'guitarist', 398, -1] },
    { pose: ['Anh hát rong', 'sing'] }, { pose: ['Anh guitar', 'guitar'] }, { fn: () => { props.song = 1; } },
    { place: ['groom', 'groomDL', -10, 1] }, { place: ['bride', 'brideDL', -36, 1] }, { title: 6 },
    { walk: ['bride', 168, true] }, { walk: ['groom', 106] }, { face: ['groom', -1] }, { face: ['bride', -1] },
    { pose: ['bride', 'cold'] }, ['B', 'Đà Lạt về đêm lạnh quá anh ơi!'],
    ['G', 'Cô ơi, cho cháu hai ly sữa đậu nành nóng!'],
    { fn: () => { props.serve = 1; sfx('blip'); } }, ['Cô bán sữa', 'Có ngay! Sữa mới nấu, nóng hổi luôn nè.'],
    { fn: () => { props.serve = 0; } }, { walk: ['groom', 190] }, { face: ['groom', -1] }, { pose: ['groom', 'offer'] },
    ['G', 'Uống cho ấm này em.'],
    { pose: ['bride', 'drink'] }, { pose: ['groom', 'drink'] }, { emote: ['bride', 'heart'] }, { wait: 2.2 },
    // hết bài: khán giả vỗ tay, anh hát rong giới thiệu bài mới
    { fn: () => { props.song = 0; props.clapT = 1.8; sfx('clap'); } }, { pose: ['bride', null] }, { pose: ['groom', null] }, { wait: .8 },
    ['Anh hát rong', 'Cảm ơn mọi người! Bài tiếp theo xin tặng các cặp đôi đang nghe nhé!'],
    { face: ['bride', 1] }, { pose: ['bride', 'point'] }, ['B', 'Nhóm hát rong kìa anh, mình lại gần nghe đi!'], { pose: ['bride', null] },
    { fn: () => { props.song = 2; } }, { walk: ['bride', 296, true] }, { walk: ['groom', 272] }, { face: ['groom', 1] },
    { pose: ['bride', 'clap'] }, { wait: 3.2 }, { pose: ['bride', null] },
    ['G', 'Hát hay quá. Anh góp chút ủng hộ nhóm nhé.'],
    { walk: ['groom', 318] }, { face: ['groom', 1] }, { pose: ['groom', 'point'] }, { wait: .3 }, { fn: dlTip }, { wait: 1 }, { pose: ['groom', null] },
    ['Anh hát rong', 'Cảm ơn hai bạn! Chúc hai bạn đi đâu cũng có nhau!'],
    { face: ['groom', -1] }, { face: ['bride', 1] },
    ['G', 'Đà Lạt lạnh mấy, có em bên cạnh là anh thấy ấm rồi.'], { emote: ['bride', 'heart'] }, { emote: ['groom', 'heart'] }, { wait: 1.4 },
    { memory: 5 }, { end: 1 }] },
  /* làng chài Nhơn Hải (js/quynhon.js): cô dâu chạy tới bức tường bích hoạ, đứng cạnh hình bạn nhỏ lặn biển (x ≈ 290) tạo dáng,
     chú rể đứng trên vỉa hè chụp ảnh, sau lưng là vịnh đầy tàu cá và thuyền thúng */
  { city: 'quynhon', title: 'Làng chài Nhơn Hải', theme: 'quynhon', build: () => [
    { place: ['groom', 'groomQN', 20, 1] }, { place: ['bride', 'brideQN', -10, 1] }, { title: 7 },
    { fn: () => { actors.bride.spd = 130; } }, { walk: ['bride', 312, true] }, { walk: ['groom', 212] }, { jump: 'bride' },
    // từ lúc đứng vào chỗ tới khi bấm máy: xe ngoài đường nhường (props.qnHold), chờ đường trước hai đứa trống rồi mới tạo dáng
    { face: ['bride', -1] }, { fn: () => { props.qnHold = 1; } }, ['B', 'Làng chài Nhơn Hải đây rồi! Tàu cá với thuyền thúng kín cả vịnh anh ơi!'],
    ['G', 'Đứng trước bức tranh tường đi em, anh chụp cho một tấm.'], { until: qnRoadClear },
    { pose: ['groom', 'cam'] }, { pose: ['bride', 'vsign'] }, { wait: .9 },
    { fn: () => { flashA = 1; sfx('blip'); } }, { wait: .6 }, { pose: ['groom', null] }, { pose: ['bride', null] }, { fn: () => { props.qnHold = 0; } }, { emote: ['bride', 'heart'] },
    ['G', 'Biển xanh, thuyền thúng, tranh tường… mà đẹp nhất vẫn là em.'], { emote: ['groom', 'heart'] },
    { memory: 6 }, { end: 1 }] },
  /* hai cảnh: ngắm hoàng hôn ở VinWonders (js/phuquoc.js) rồi chuyển cảnh ({ cut }) sang nhà hàng buổi tối – trời đổ mưa nên ngồi trong nhà.
     Ở nhà hàng: khách ngồi bàn bên trái (ghế PQR_GC), hai đứa ngồi bàn chính (x 208 / 276 → ghế PQR_C), anh phục vụ ở quầy bar;
     tắt đèn (props.pqrDim) rồi chú rể ra quỳ bên trái ghế cô dâu (x 180, trong vùng sáng PQR_SPOT); cô dâu đồng ý thì bắn pháo giấy */
  { city: 'phuquoc', title: 'Hoàng hôn', theme: 'phuquoc', build: () => { const G = nm('G'), B = nm('B'); return [
    { place: ['bride', 'bridePQ', -10, 1] }, { place: ['groom', 'groomPQ', -40, 1] }, { title: 8 },
    { walk: ['groom', 205, true] }, { walk: ['bride', 238] }, { face: ['bride', -1] },
    { pose: ['bride', 'point'] }, ['B', 'Hoàng hôn Phú Quốc đẹp quá anh nhỉ.'], { pose: ['bride', null] },
    ['G', 'Mây kéo đến rồi, chắc tối nay mưa đấy. Anh đặt bàn ở một nhà hàng rồi, mình đi ăn tối nhé!'],
    { emote: ['bride', 'heart'] }, { wait: 1 },
    { cut: ['pqdinner', 'Bữa tối trong mưa'] },
    { place: ['guest', 'guestPQ', PQR_GC - 6, 1] }, { pose: ['guest', 'sit'] }, { place: ['Anh phục vụ', 'waiter', 446, -1] },
    { place: ['groom', 'groomPQ', -20, 1] }, { place: ['bride', 'bridePQ', -48, 1] },
    { walk: ['groom', PQR_C[1] - 6, true] }, { walk: ['bride', PQR_C[0] - 6] }, { wait: .6 },
    { face: ['bride', 1] }, { face: ['groom', -1] }, { pose: ['bride', 'sit'] }, { pose: ['groom', 'sit'] },
    ['B', 'Mưa lất phất thế này, ngồi trong nhà ngắm biển với dây đèn ngoài bãi lãng mạn ghê anh nhỉ!'],
    { walk: ['Anh phục vụ', 304] }, { face: ['Anh phục vụ', -1] }, { fn: () => { props.pqrDish = 1; sfx('blip'); } },
    ['Anh phục vụ', 'Tôm hùm nướng với vang đỏ của anh chị đây ạ. Chúc anh chị ngon miệng!'],
    { walk: ['Anh phục vụ', 446, true] }, { emote: ['bride', 'heart'] }, { wait: 2.2 }, { face: ['Anh phục vụ', -1] },
    ['G', 'Cảm ơn em đã đi cùng anh suốt chặng đường này.'],
    { fn: () => { props.pqrDim = 1; } }, { wait: 1 }, { emote: ['bride', '?'] }, ['B', 'Ơ… sao tắt hết đèn thế anh?'],
    { pose: ['groom', null] }, { walk: ['groom', 180] }, { face: ['groom', 1] }, { face: ['bride', -1] },
    ['G', 'Từ bát bún riêu Hàng Mã tới tận đây… anh muốn đi cùng em cả đời.'],
    { pose: ['groom', 'kneel'] }, { fn: () => { sfx('power'); } }, { wait: .6 },
    ['G', `${B} ơi, em đồng ý làm vợ anh nhé?`], { emote: ['bride', '!'] }, { pose: ['bride', 'giggle'] }, { wait: 1.2 },
    { pose: ['bride', null] }, { fn: () => { actors.bride.hopV = -220; sfx('yes'); } }, ['B', 'Em đồng ý!'],
    { pose: ['groom', null] }, { pose: ['guest', 'clap'] }, { pose: ['Anh phục vụ', 'clap'] },
    { fn: () => { props.pqrDim = 0; pqrPoppers(); heartRain(PQR_SPOT[0]); actors.groom.hopV = -200; } },
    { face: ['bride', -1] }, { emote: ['groom', 'heart'] }, { emote: ['bride', 'heart'] },
    ['Anh phục vụ', 'Chúc mừng anh chị! Trăm năm hạnh phúc nhé!'],
    { wait: .6 }, { banner: 'Cô ấy đã đồng ý!' }, { wait: 1.2 }, { rsvp: 1 }]; } }
];
