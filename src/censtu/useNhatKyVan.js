import { useCallback, useRef } from 'react';
import { baoBatDauVan, baoKetThucVan } from './sdk';

/**
 * Nhật ký một ván để nộp cho portal.
 *
 * Giữ trong `useRef`, không `useState`: nhật ký không hiện lên màn nào, và một lượt render mỗi cú
 * bấm là thừa.
 *
 * Mỗi lượt là `{ q, a, ok, t }`: `q` = đề (tên hình / từ đang hỏi), `a` = thứ bé bấm, `ok` = game
 * chấm đúng hay sai, `t` = mili giây kể từ lượt bấm ĐẦU TIÊN của ván.
 *
 * 🔴 Ván mới phải bắt đầu với nhật ký rỗng. Có ba đường vào: mở mini-game (component mount mới ⇒
 * ref mới), nút "Play again" (gọi `batDauLai`), và thoát giữa chừng (unmount ⇒ ván bỏ dở không
 * được nộp). `ketThuc` cũng tự xoá, nên quên `batDauLai` ở đâu đó vẫn không cộng dồn hai ván.
 *
 * @param {string} cheDo một giá trị của `CHE_DO` trong `./sdk`
 */
export function useNhatKyVan(cheDo) {
  const nhatKyRef = useRef([]);
  const mocDauRef = useRef(0);

  const ghi = useCallback(
    (q, a, ok) => {
      const now = performance.now();
      if (nhatKyRef.current.length === 0) {
        // Ván bắt đầu ở lượt bấm ĐẦU TIÊN, không phải lúc mở màn: vài giây bé nhìn hình trước đó
        // không thuộc thành tích.
        mocDauRef.current = now;
        baoBatDauVan(cheDo);
      }
      nhatKyRef.current.push({ q, a, ok, t: Math.round(now - mocDauRef.current) });
    },
    [cheDo],
  );

  /** Nộp ván. Gọi lặp là vô hại: lần sau thấy nhật ký rỗng và không gửi gì. */
  const ketThuc = useCallback(() => {
    if (nhatKyRef.current.length === 0) return;
    baoKetThucVan(cheDo, nhatKyRef.current);
    nhatKyRef.current = [];
  }, [cheDo]);

  const batDauLai = useCallback(() => {
    nhatKyRef.current = [];
  }, []);

  return { ghi, ketThuc, batDauLai };
}
