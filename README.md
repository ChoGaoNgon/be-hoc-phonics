# Bé học phonics

Bảng âm phonics tiếng Anh cho bé (Phase 2, 3, 5): bấm vào thẻ để nghe âm, và 7 mini-game luyện âm:
chọn âm đầu theo hình, lật thẻ ghép chữ với hình, đánh vần theo hình, đọc từ chọn hình.

## Công nghệ

React 17 · React Router · Create React App

## Cài đặt

Cần [Git](https://git-scm.com/downloads) và [Node.js](https://nodejs.org/en/download/).

```bash
npm install
npm start        # chạy dev
npm run build    # build ra build/
```

Thêm hoặc đổi tên file âm trong `public/sounds/` thì chạy `node scripts/kiem-am-thanh.mjs`: máy chủ deploy
phân biệt chữ hoa/thường trong tên file (macOS thì không), sai một chữ là thẻ bấm vào im lặng.

## 🎮 CenStu game portal

Game được nhúng vào kho trò chơi [game.censtu.com](https://game.censtu.com) và chạy độc lập ở
`https://phonics.censtu.com` (Cloudflare Workers, cấu hình ở `wrangler.jsonc`; build ra `build/`).

- `src/censtu/sdk.js` — hợp đồng `postMessage` với portal (bản chép; bản chính tắc ở repo CENSTU
  `fe-censtu/shared/src/types/troChoiNhung.ts`). Mỗi mini-game trong "Games" là một chế độ; một lượt
  chơi tới màn "Well done!" là một ván.
- `public/_headers` — chỉ `game.censtu.com` được nhúng game.
- `public/card-banner.html` — mặt thẻ 800×600 trên portal; `?the=1` chỉ vẽ tranh, không chữ.

Nghiệm thu và xuất ảnh thẻ (skill [`censtu-them-game`](https://github.com/ChoGaoNgon/skill-create-censtu-game)):

```bash
npm run build
node ~/.claude/skills/censtu-them-game/scripts/kiem-nhung.mjs --dist ./build \
  --kich-ban ./scripts/kich-ban-nghiem-thu.js
node ~/.claude/skills/censtu-them-game/scripts/xuat-anh-the.mjs --dist ./build --slug be-hoc-phonics
```

## Nguồn hình ảnh

Icon do [Freepik](https://www.flaticon.com/authors/freepik) thiết kế, lấy từ [Flaticon](https://www.flaticon.com)
(giấy phép miễn phí, bắt buộc ghi nguồn; dòng ghi nguồn trong app nằm cuối Trang chủ).

## Giấy phép

MIT, xem [LICENSE](LICENSE).
