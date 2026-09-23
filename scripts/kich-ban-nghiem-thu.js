/**
 * Kịch bản nghiệm thu cho `kiem-nhung.mjs` của skill `censtu-them-game`:
 *
 *   npm run build
 *   node ~/.claude/skills/censtu-them-game/scripts/kiem-nhung.mjs --dist ./build \
 *     --kich-ban ./scripts/kich-ban-nghiem-thu.js --ghi-message /tmp/message.json
 *
 * File này là THÂN của một hàm async chạy ở trang cha (portal giả lập), khổ 1366×768. Có sẵn:
 * `doi(ms)`, `khung`, `D()` (document của game), `nut(nhãn)`, `doMan(tên)`.
 *
 * Lái MỘT ván thật của cả bảy mini-game, đo mọi màn chính, rồi KHẲNG ĐỊNH (không chỉ nhìn):
 *   - mỗi chế độ phát đúng cặp `bat-dau-van` / `ket-thuc-van`;
 *   - Quiz Phase 2 chơi HAI ván liền qua nút "Play again" ⇒ ván thứ hai có đúng 5 lượt đúng, không
 *     cộng dồn 10 của ván trước (ca đối chứng: bỏ `batDauLai()` + `ketThuc()` tự xoá thì phải đỏ).
 */

const cho = async (dk, ten) => {
  for (let i = 0; i < 80 && !dk(); i++) await doi(150);
  if (!dk()) throw new Error(`không thấy: ${ten}`);
};
const tatCa = (sel) => [...D().querySelectorAll(sel)];
const denLink = async (duoi) => {
  const a = tatCa('a').find((x) => x.pathname.endsWith(duoi));
  if (!a) throw new Error(`không có link tới ${duoi}`);
  a.click();
  await doi(300);
};
const veGames = async () => {
  const b = tatCa('.back-to-games-btn')[0];
  if (!b) throw new Error('không có nút "Back to Games"');
  b.click();
  await cho(() => tatCa('.games-button').length, 'trang Games');
};
const xong = () => D().body.textContent.includes('Well done');

// Quiz & Reading: bấm lần lượt từng phương án tới khi game báo đúng, rồi "Next".
const choiQuiz = async (ten) => {
  for (let cau = 0; cau < 10 && !xong(); cau++) {
    if (cau === 0) doMan(`${ten} — đang hỏi`);
    for (const o of tatCa('.quiz-options .sound')) {
      o.click();
      await doi(60);
      if (D().querySelector('.quiz-tip')?.textContent.includes('Correct')) break;
    }
    if (cau === 0) doMan(`${ten} — đã trả lời`);
    nut('Next').click();
    await doi(120);
  }
  await cho(xong, `${ten}: màn Well done`);
  doMan(`${ten} — kết thúc`);
};

// Spelling: với mỗi ô trống, thử từng thẻ âm tới khi ô được lấp.
const choiDanhVan = async (ten) => {
  for (let tu = 0; tu < 5 && !xong(); tu++) {
    if (tu === 0) doMan(`${ten} — đang hỏi`);
    const soO = () => tatCa('.quiz-options .sound p').length;
    const daLap = () => tatCa('.quiz-options .sound p').filter((p) => p.textContent !== '_').length;
    while (daLap() < soO()) {
      const truoc = daLap();
      for (const the of tatCa('.spelling-sounds .sound')) {
        the.click();
        await doi(40);
        if (daLap() > truoc) break;
      }
      if (daLap() === truoc) throw new Error(`${ten}: không thẻ nào lấp được ô tiếp theo`);
    }
    await cho(() => !nut('Next').disabled, `${ten}: nút Next bật`);
    if (tu === 0) doMan(`${ten} — đã đánh vần xong`);
    nut('Next').click();
    await doi(120);
  }
  await cho(xong, `${ten}: màn Well done`);
  doMan(`${ten} — kết thúc`);
};

// Matching: cặp chữ ↔ hình lấy từ bảng `sounds` trong MatchingGame.js.
const CAP = { h: 'hat', f: 'frog', g: 'guitar', c: 'cat', t: 'tap', s: 'sun', p: 'penguin', u: 'umbrella', b: 'bin', e: 'egg', r: 'rat', a: 'ant' };
const choiGhepCap = async () => {
  doMan('Matching — đang chơi');
  const the = tatCa('.sound-card');
  const chu = the.filter((x) => x.querySelector('.front p'));
  for (const c of chu) {
    const icon = CAP[c.querySelector('.front p').textContent];
    const hinh = the.find((x) => x.querySelector('.front img')?.getAttribute('src').endsWith(`/${icon}.png`));
    c.click();
    await doi(80);
    hinh.click();
    await doi(1150); // game tự úp cặp đang mở sau 1000ms; lật tiếp trước đó thì bị bỏ qua
  }
  await cho(xong, 'Matching: màn Well done');
  doMan('Matching — kết thúc');
};

// ---------------------------------------------------------------------------------------------

await cho(() => D()?.querySelector('.home-section'), 'trang chủ');
doMan('Trang chủ');
await denLink('/phaseTwo');
await cho(() => tatCa('.sound').length, 'trang Phase 2');
doMan('Phase 2 — bảng âm');
khung.contentWindow.history.back();
await cho(() => D().querySelector('.home-section'), 'trang chủ (quay lại)');

await denLink('/games');
await cho(() => tatCa('.games-button').length, 'trang Games');
doMan('Games');

await denLink('/phaseTwoQuiz');
await choiQuiz('Quiz Phase 2');
nut('Play again').click(); // ván thứ hai — đường vào thứ hai của ván mới
await doi(200);
await choiQuiz('Quiz Phase 2 (ván 2)');
await veGames();

await denLink('/matchingGame');
await choiGhepCap();
await veGames();

for (const [duoi, ten] of [['/spellingGame', 'Spelling'], ['/spellingGame2', 'Spelling 2'], ['/spellingGame3', 'Spelling 3']]) {
  await denLink(duoi);
  await choiDanhVan(ten);
  await veGames();
}

for (const [duoi, ten] of [['/readingGame', 'Reading'], ['/readingGame2', 'Reading 2']]) {
  await denLink(duoi);
  await choiQuiz(ten);
  await veGames();
}

// --- Khẳng định ---
await doi(300);
const ket = window.batDuoc.filter((m) => m.tin?.loai === 'censtu:ket-thuc-van');
const bat = window.batDuoc.filter((m) => m.tin?.loai === 'censtu:bat-dau-van');
const CAN = ['quiz-phase-2', 'ghep-cap', 'danh-van-phase-2', 'danh-van-phase-3', 'danh-van-phase-5', 'doc-tu-phase-3', 'doc-tu-phase-5'];
for (const c of CAN) {
  const k = ket.filter((m) => m.tin.cheDo === c).length;
  const b = bat.filter((m) => m.tin.cheDo === c).length;
  const mong = c === 'quiz-phase-2' ? 2 : 1;
  if (k !== mong || b !== mong) throw new Error(`${c}: bat-dau-van ${b}, ket-thuc-van ${k} — mong ${mong}/${mong}`);
}
const dungMoiVan = ket.filter((m) => m.tin.cheDo === 'quiz-phase-2').map((m) => m.tin.bangChung.traLoi.filter((l) => l.ok).length);
if (dungMoiVan.join() !== '5,5') throw new Error(`Quiz Phase 2: số lượt đúng mỗi ván ${dungMoiVan} — mong 5,5 (nhật ký không reset?)`);
const capDung = ket.find((m) => m.tin.cheDo === 'ghep-cap').tin.bangChung.traLoi.filter((l) => l.ok).length;
if (capDung !== 6) throw new Error(`Matching: ${capDung} cặp đúng — mong 6`);
