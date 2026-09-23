import { useEffect, useRef, useState } from 'react';
import { baoSanSang, dangNhungTrongPortal } from './sdk';

/**
 * Bọc cả app: báo portal đã sẵn sàng, và chọn bố cục theo chỗ đang chạy.
 *
 * - Chạy độc lập (`phonics.censtu.com`): thêm thanh về kho trò chơi ở đầu và chân trang ở cuối.
 * - Nhúng trong portal: ẩn cả hai. Class `nhung` trên `<html>` (gắn ở `index.js`, TRƯỚC lượt
 *   render đầu để khỏi nháy bố cục) gò app vào khung `100dvh − 44px` của portal — `App.css` § CENSTU.
 *
 * 🔴 Mọi liên kết ra ngoài dùng `target="_top"` — mặc định `_self` nạp trang đích VÀO TRONG khung game.
 */
const KhungCenstu = ({ children }) => {
  const [dangNhung] = useState(dangNhungTrongPortal);

  // Ref sống qua lượt gọi lặp — chặn `san-sang` bắn hai lần nếu về sau app bọc `StrictMode`.
  const daBaoRef = useRef(false);
  useEffect(() => {
    if (daBaoRef.current) return;
    daBaoRef.current = true;
    baoSanSang();
  }, []);

  return (
    <>
      {!dangNhung && (
        <a className="ve-kho" href="https://game.censtu.com" target="_top">
          ← Kho trò chơi CenStu
        </a>
      )}
      <div className="khung-chinh">{children}</div>
      {!dangNhung && (
        <p className="chan-trang">
          © {new Date().getFullYear()} • Phát hành bởi{' '}
          <a href="https://censtu.com" target="_top">
            censtu.com
          </a>
        </p>
      )}
    </>
  );
};

export default KhungCenstu;
