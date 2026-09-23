/**
 * SDK nói chuyện với portal CenStu (`game.censtu.com`).
 *
 * 🔴 NGUỒN GỐC của hợp đồng này KHÔNG phải file này. Bản chính tắc sống ở repo CENSTU:
 *    `fe-censtu/shared/src/types/troChoiNhung.ts`  (`TinNhanTuGame`, `docTinNhanTuGame`)
 * Đây là bản CHÉP (theo `typing-10-fingers/src/censtu/sdk.ts` và `kid-vocab/src/censtu/sdk.ts`) —
 * game ở repo riêng nên không `import` được từ `@censtu/shared`. Đổi hợp đồng thì đổi ở đó TRƯỚC,
 * rồi chép lại sang đây.
 *
 * Quy trình triển khai + lý do repo riêng: `CENSTU:docs/games/trien-khai-game.md`.
 *
 * 🔴 Chỗ canh hai bản lệch nhau KHÔNG phải kiểu — nó là test Playwright của portal bắn một message
 * THẬT. Đổi tên một `loai` ở đây mà quên phía kia thì cả hai bên vẫn build sạch, và triệu chứng là
 * màn chờ của portal không bao giờ tắt.
 */

/** Origin của portal. Mọi message gửi đi phải nêu nó TƯỜNG MINH, không dùng `'*'`. */
const PORTAL_ORIGIN = 'https://game.censtu.com';

/**
 * Chế độ chơi — mỗi mini-game trong trang "Games" là một chế độ; một lượt chơi tới màn
 * "Well done!" là một ván.
 *
 * 🔴 Chỉ chế độ có mốc bắt đầu/kết thúc THẬT mới nằm ở đây. Các trang Phase 2/3/5 chỉ để bấm
 * nghe âm, không có câu trả lời nào ⇒ không phải ván, chỉ phát `censtu:san-sang`.
 */
export const CHE_DO = {
  QUIZ_PHASE_2: 'quiz-phase-2',
  GHEP_CAP: 'ghep-cap',
  DANH_VAN_PHASE_2: 'danh-van-phase-2',
  DOC_TU_PHASE_3: 'doc-tu-phase-3',
  DANH_VAN_PHASE_3: 'danh-van-phase-3',
  DANH_VAN_PHASE_5: 'danh-van-phase-5',
  DOC_TU_PHASE_5: 'doc-tu-phase-5',
};

/**
 * Game có đang chạy trong khung nhúng của portal không.
 *
 * Export vì giao diện cũng cần biết: thanh về kho và chân trang chỉ có nghĩa khi chạy độc lập.
 *
 * 🔴 Kiểm trước khi gửi, vì game **cũng chạy độc lập** ở `phonics.censtu.com`. Không có cha thì
 * `parent === window`, tức game tự bắn message cho chính mình.
 */
export function dangNhungTrongPortal() {
  return typeof window !== 'undefined' && window.parent !== window;
}

function gui(tin) {
  if (!dangNhungTrongPortal()) return;

  /*
   * `targetOrigin` tường minh, KHÔNG `'*'` — với `'*'` thì bất kỳ trang nào đang nhúng game này
   * cũng đọc được nội dung message. Trình duyệt tự bỏ message khi origin của cha không khớp.
   */
  window.parent.postMessage(tin, PORTAL_ORIGIN);
}

/** Game đã tải xong và chơi được. Portal tắt màn chờ ở đây — gọi nó MỘT lần lúc app mount. */
export function baoSanSang() {
  gui({ loai: 'censtu:san-sang' });
}

/** Người chơi vừa trả lời lượt đầu tiên của một ván. */
export function baoBatDauVan(cheDo) {
  gui({ loai: 'censtu:bat-dau-van', cheDo });
}

/**
 * Ván kết thúc.
 *
 * 🔴 `bangChung` là thứ BE dùng để TÍNH LẠI — đừng gửi điểm đã tính sẵn. Nhật ký trả lời kèm mốc
 * thời gian cho biết đây là một bé đang bấm hay một vòng lặp.
 *
 * @param {string} cheDo một giá trị của {@link CHE_DO}
 * @param {{q: string, a: string, ok: boolean, t: number}[]} traLoi
 */
export function baoKetThucVan(cheDo, traLoi) {
  gui({ loai: 'censtu:ket-thuc-van', cheDo, bangChung: { traLoi } });
}
