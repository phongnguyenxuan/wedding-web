# Thiệp cưới 32-bit – Phong & Trang

Thiệp cưới dạng game pixel: khách nhập tên, xem hành trình 8 chặng của cô dâu chú rể
(Hà Nội → Phú Quốc), rồi nhận thiệp mời mang tên mình và lưu thành ảnh GIF.

Web tĩnh thuần HTML/CSS/JS, không cần cài đặt hay build.

## Cấu trúc

```
wedding-web/
├── index.html          Trang chính (khung HTML + nạp CSS/JS)
├── css/style.css       Giao diện
├── assets/
│   ├── favicon.svg
│   └── photos/         Ảnh kỷ niệm thật (tuỳ chọn)
├── js/                 Nạp theo đúng thứ tự trong index.html
│   ├── config.js       ★ Tên, giờ, địa chỉ, kỷ niệm – sửa ở đây
│   ├── core.js         Hằng số, canvas, biến dùng chung
│   ├── sprites.js      Nhân vật & đồ vật pixel art
│   ├── audio.js        Hiệu ứng âm thanh (WebAudio)
│   ├── render.js       Vẽ nền, dithering, mặt đất, hạt hiệu ứng
│   ├── actors.js       Diễn viên, biểu cảm, điện thoại
│   ├── scenes.js       Bản đồ Việt Nam & bối cảnh 8 thành phố
│   ├── namdinh.js      Cảnh Nam Định: nhà thờ đổ Hải Lý lúc hoàng hôn, cát ướt soi bóng
│   ├── hoabinh.js      Cảnh Hòa Bình: tắm thác giữa rừng, cả hội nhảy thác từ mỏm đá
│   ├── danang.js       Cảnh Đà Nẵng: cầu Rồng phun lửa/phun nước, sông Hàn soi bóng, Cầu Tình Yêu
│   ├── hoian.js        Cảnh Hội An: phố cổ tường vàng lên đèn, ghe nón lá & hoa đăng trên sông, xe nước Mót
│   ├── chapters.js     Kịch bản 8 chương (lời thoại)
│   ├── story.js        Động cơ kịch bản & vòng lặp game
│   ├── ui.js           Hộp thoại, banner, menu, RSVP
│   ├── card.js         Vẽ thiệp mời
│   ├── gif.js          Mã hoá & lưu GIF
│   └── main.js         Điều khiển & khởi động
├── tools/sprites.html  Trang dev xem mọi khung hình nhân vật
└── backup/index.single-file.html   Bản gốc 1 file (để đối chiếu)
```

## Tuỳ chỉnh

- **Thông tin cưới:** sửa `js/config.js` (tên, giờ, địa chỉ nhà trai / nhà gái).
- **Bạn bè đi tắm thác (chương Hòa Bình):** sửa tên 4 người trong `friends` ở `js/config.js`
  (thứ tự: người lộn nhào, người quay phim, người "thả bom", bạn nữ).
- **Ảnh kỷ niệm:** chép ảnh vào `assets/photos/` rồi điền `photo: 'assets/photos/ten-anh.jpg'`
  cho chương tương ứng trong `config.js`. Nên dùng ảnh ngang 4:3, ~400×300px, dung lượng nhỏ.
- **Lời thoại & hành động:** sửa `js/chapters.js`. Ngoài lời thoại còn có lệnh tư thế, ví dụ
  `{ pose: ['bride', 'eat'] }` (ngồi ăn bún), `drink`, `offer`, `mot` (hút nước Mót), `cheer` (cụng ly), `wave`, `cam` (chụp ảnh), `vsign`, `clap`,
  `pray`, `cold`, `point`, `giggle`, `kneel`; `{ pose: ['bride', null] }` để đứng bình thường.
  Khi nhân vật nói, tay tự khoa theo lời, người nghe quay về phía người nói và gật gù.
- **Nhân vật:** pixel art và khớp tay nằm trong `js/sprites.js` (`HEAD`, `TORSO`, `BRIDE`, `ARMS` tay trước,
  `BACK` tay sau). Phong cách: nhìn thẳng, đầu vuông, viền đậm, đổ bóng phẳng (mẫu: `tools/style-reference.png`).
  Khi đi bộ nhân vật chuyển sang nhìn nghiêng (`SIDE_HEAD`, `SIDE_TORSO`, `SIDE_BRIDE`, `SIDE_ARMS`); kính của chú rể
  bật bằng `glasses: 1` trong `LOOK`. Xem animation phóng to ở `tools/anim.html?scene=walk` / `?scene=eat`.
  Mở `tools/sprites.html` qua server cục bộ để xem mọi khung hình phóng to
  (thêm `?scale=8&only=tay` để lọc).
- **Tiêu đề trang / mô tả khi chia sẻ link:** sửa thẻ `<title>` và `<meta>` trong `index.html`.

## Chạy thử

Mở thẳng `index.html` bằng trình duyệt là chạy được. Hoặc chạy server cục bộ:

```bash
python -m http.server 8000
```

rồi mở http://localhost:8000

## Đưa lên mạng

Upload nguyên thư mục (trừ `backup/` nếu muốn) lên bất kỳ hosting tĩnh nào:

- **Netlify Drop:** kéo thả thư mục vào https://app.netlify.com/drop
- **GitHub Pages:** đẩy lên repo, bật Pages ở nhánh `main`
- **Vercel / Cloudflare Pages:** tạo project mới, không cần lệnh build, thư mục xuất là `/`
