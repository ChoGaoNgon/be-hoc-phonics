#!/usr/bin/env node
/**
 * Kiểm mọi file âm mà các trang Phase 2/3/5 gọi có THẬT trong git, đúng từng chữ hoa/thường.
 *
 *   node scripts/kiem-am-thanh.mjs
 *
 * 🔴 Vì sao phải có: máy chủ tĩnh (Cloudflare) phân biệt hoa/thường, còn ổ đĩa macOS thì không.
 * Code gọi `/sounds/Phase5/ay.m4a` trong khi file tên `Ay.m4a` ⇒ `npm start` trên Mac vẫn phát
 * bình thường, nhưng bản deploy trả về `index.html` (SPA fallback, mã 200) thay cho file âm, và bấm
 * vào thẻ thì im lặng — không lỗi nào hiện ra ngoài console. Nên đối chiếu với `git ls-files`
 * (giữ nguyên hoa/thường), không với `fs.existsSync` (trên Mac cũng không phân biệt).
 */

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const TRANG = ['src/components/PhaseTwo.js', 'src/components/PhaseThree.js', 'src/components/PhaseFive.js'];
const coTrongGit = new Set(execSync('git ls-files public/sounds', { encoding: 'utf8' }).split('\n').filter(Boolean));

const thieu = [];
let dem = 0;
for (const trang of TRANG) {
  const nguon = readFileSync(trang, 'utf8');
  const mau = nguon.match(/new Audio\(`\/sounds\/(.*?)\$\{sound\.sound\}\.m4a`\)/);
  if (!mau) {
    thieu.push(`${trang}: không tìm thấy dòng \`new Audio(...)\` — script cần cập nhật theo code`);
    continue;
  }
  for (const [, am] of nguon.matchAll(/sound:\s*"([^"]+)"/g)) {
    dem++;
    const tep = `public/sounds/${mau[1]}${am}.m4a`;
    if (!coTrongGit.has(tep)) thieu.push(`${trang}: gọi ${tep} — không có file đúng tên này trong git`);
  }
}

if (thieu.length) {
  console.log('✗ Thiếu file âm (đúng hoa/thường):');
  thieu.forEach((t) => console.log(`  - ${t}`));
  process.exit(1);
}
console.log(`✓ ${dem} âm, file nào cũng có đúng tên trong git.`);
