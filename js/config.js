/* ================== CẤU HÌNH – sửa phần này cho đám cưới của bạn ================== */
/*
 * memories: 8 kỷ niệm, theo thứ tự 8 chương (Hà Nội → Nam Định → Hòa Bình → Đà Nẵng →
 * Hội An → Đà Lạt → Quy Nhơn → Phú Quốc).
 * Mỗi mục có thể là một chuỗi (chỉ chú thích) hoặc { caption, photo }.
 * Ảnh đặt trong thư mục assets/photos/, nên dùng ảnh ngang tỉ lệ 4:3, khoảng 400×300px.
 */
const CONFIG = {
  groom: 'Phong',
  bride: 'Trang',
  wedding: {
    groom: { label: 'nhà trai', time: '10:00, Chủ nhật 20/12/2026', address: 'Số 12 ngõ 45 phố Hoa Sữa, phường Láng, Hà Nội' },
    bride: { label: 'nhà gái',  time: '09:00, Thứ bảy 19/12/2026',  address: 'Thôn Đông, xã Yên Thường, huyện Gia Lâm, Hà Nội' }
  },
  // 4 người bạn đi tắm thác Hòa Bình cùng hai đứa: 3 nam (người lộn nhào, người quay phim, người "thả bom") + 1 nữ
  friends: ['Tuấn', 'Hùng', 'Dũng', 'Linh'],
  memories: [
    { caption: 'Bún riêu Hàng Mã, quán quen của hai đứa', photo: '' },
    { caption: 'Nam Định, nhà thờ đổ bên biển',          photo: '' },
    { caption: 'Hòa Bình, cú nhảy thác của cả hội',     photo: '' },
    { caption: 'Đà Nẵng, đêm rồng phun lửa',             photo: '' },
    { caption: 'Hội An, chiếc hoa đăng đầu tiên',        photo: '' },
    { caption: 'Đà Lạt, sữa đậu nành nóng & tiếng hát rong', photo: '' },
    { caption: 'Quy Nhơn, tấm ảnh đẹp nhất',             photo: '' },
    { caption: 'Phú Quốc, ngày em nói đồng ý',           photo: '' }  // ví dụ: photo: 'assets/photos/phuquoc.jpg'
  ]
};
