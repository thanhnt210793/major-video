#!/usr/bin/env node
// Writes STORYBOARD.md and SCRIPT.md for "loi-production-sau-release" from the approved
// storyboard.json (frames map 1:1 to scenes; narration verbatim; durations unchanged).
//
//   node tools/gen-docs.mjs        (run from the HyperFrames project root)

import { readFileSync, writeFileSync } from "node:fs";

const SB = JSON.parse(readFileSync("../../../content/it/loi-production-sau-release/storyboard.json", "utf8"));
const id = (s, i) => `${String(i + 1).padStart(2, "0")}-${s.id}`;
const t = (n) => String(Math.round(n * 100) / 100);

// title, hero (what the eye follows), support, texture, poster time
const DESIGN = {
  hook: ["Không mã là không thanh toán", "thông báo đỏ \"Thanh toán thất bại\" cạnh ô mã giảm giá trống", "nhãn \"Thứ Sáu · 16:45\", đẩy máy quay vào", "hai tay POV trên bàn phím, tường văn phòng", 1.2],
  escalate: ["Báo lên tận sếp", "thẻ cảnh báo tự động bay về góc thành ô đỏ đếm đơn lỗi", "tin nhắn của sếp, chữ \"10 phút sau khi phát hành\"", "tin nhắn dồn lên, pháo giấy của tin phát hành", 3.2],
  meeting: ["Họp gấp", "khung họp của sếp, máy quay đẩy chậm vào", "tay POV với ly trà sữa rồi rụt về, \"17:00 · Họp gấp\"", "khung nhỏ của cả nhóm, micro tắt, ô đỏ 87", 2.4],
  boss: ["Hạn mười phút", "khuôn mặt sếp gần kín màn hình, vòng sáng \"đang nói\", đẩy nhanh vào ở chữ \"mười phút\"", "chữ nhỏ \"Tích tắc… tích tắc…\" và ô cam \"Hạn: 10 phút\"", "tay POV siết mép bàn, ô đỏ 112", 2.6],
  mitigate: ["Quay về bản cũ trước", "anh Quân giơ tay chốt", "thanh \"Đang quay về bản cũ…\" lớn giữa màn hình rồi thu về góc", "chị Mai bên cạnh, nhãn tên anh Quân", 4.4],
  "works-locally": ["Tự nói một mình", "lần lượt: màn hình chia đôi tick/X → đoạn code với dấu \"?\" → cú liếc sang bàn bên", "chữ \"Cùng thao tác, khác kết quả\"", "ô đỏ mờ 140 → 163, thanh quay về bản cũ gần nửa", 5.4],
  hunt: ["Mười phút thành nửa tiếng", "lần lượt: bộ đếm dừng → danh sách pull request → màn hình thay đổi → kết quả tìm kiếm → tay che mặt", "ô \"Hạn: 10 phút\" hiện lại rồi bị gạch đỏ, chữ \"17:05 → 17:35 · vẫn chưa ra\", đồng hồ nhảy", "ly trà sữa tan dần, con trỏ bấm lia lịa", 5.6],
  discover: ["Trời ơi… là mình!", "chú thích \"minh · thứ Ba\" phóng to cạnh dòng code tô đỏ", "chữ \"Ô mã để trống → dòng này báo lỗi\", giọt mồ hôi", "cột tên người viết lướt qua, dòng log mờ", 5.2],
  "own-it": ["Báo ngay, không giấu", "xoay ghế sang đồng nghiệp ngay khi nói", "anh Quân gật đầu, chị Mai giơ điện thoại kiểm thử", "tay POV hơi run", 1.6],
  "fix-check": ["Thử lại", "điện thoại kiểm thử của chị Mai, ngón tay bấm Thanh toán", "dòng code đã sửa sáng xanh", "vòng xoay chờ", 4.6],
  "qc-ok": ["Ngon lành rồi em ơi!", "chị Mai giơ ngón cái, cười", "điện thoại \"Thanh toán thành công\" kèm dấu tick", "chữ \"Kiểm thử: Đạt\"", 1.6],
  release: ["Cả nhóm cùng xử lý", "cả nhóm đập tay", "\"Phát hành bản sửa\" kèm tick, cụm chat có lời cảm ơn của sếp", "cửa sổ trời tối 18:45, ly trà sữa tan đá", 3.4],
  postmortem: ["Họp rút kinh nghiệm", "dòng \"Ai viết dòng này?\" bị gạch đi trên màn hình phòng họp", "anh Quân chỉ vào màn hình, dòng thay thế, sticker \"Không phải bản kiểm điểm đâu!\"", "cả nhóm quanh bàn gật gù, ly trà sữa mới, nhãn \"Sáng thứ Hai\"", 4.8],
  question: ["Bạn sẽ làm gì?", "thẻ câu hỏi giữa màn hình", "chữ \"Bạn sẽ làm gì? Bình luận nhé!\"", "bàn làm việc buổi sáng, màn hình chạy ổn", 2.6],
};

const sb = [];
sb.push("---", "format: 1080x1920", `duration: ${t(SB.durationSeconds)}s`, `message: "${SB.learningObjective.replaceAll('"', "'")}"`,
  "arc: Lỗi → Báo lên sếp → Họp gấp → Sếp ra hạn mười phút → Quay về bản cũ → Tự nói một mình → Mười phút thành nửa tiếng → Thì ra là mình → Báo ngay → Thử lại → Đạt → Phát hành lại → Họp rút kinh nghiệm → Câu hỏi",
  "audience: Học sinh THCS/THPT", "mode: autonomous", "music: none", "---", "");
sb.push("## Video direction", "",
  "- **Bảng màu (frame.md, assets/style.json):** nền #0F1E33, navy nhạt #1B2E4A, chữ #F5EFE4, nhấn #14B8A6; cảnh báo #F2A93B, lỗi #E5534B, thành công #3FB68B.",
  "- **Bộ dùng chung (tools/gen-frames.mjs):** một thế giới rộng 2400 px gồm bàn của nhân vật (màn hình, bàn phím, chuột, ly trà sữa), và bên phải là bàn chị Mai có anh Quân đứng cạnh. Máy quay lia ngang giữa hai vị trí (x = 0 và 1320), tường di chuyển 55% để tạo parallax, nhòe nhẹ khi lia. Tay POV nằm ở lớp riêng. Nội dung màn hình (trang thanh toán, chat, họp online, trình soạn thảo, xem lịch sử, tài liệu) là HTML trong khung màn hình. Riêng khung 13 là phòng họp của nhóm: tài liệu rút kinh nghiệm chiếu trên màn hình lớn trên tường, anh Quân đứng cạnh, chị Mai và hai đồng nghiệp ngồi quanh bàn (nhìn từ phía sau), tay POV đặt trên cuốn sổ.",
  "- **Ô đỏ \"Đơn thanh toán lỗi\":** một widget ở lớp màn hình, góc trên bên phải (vùng an toàn). Xuất hiện từ khung 2; số chỉ tăng đều; từ khung 5 có thanh tiến trình bên dưới, từ khung 6 mờ còn khoảng 70%. Đầu khung 7 (bản cũ chạy lại xong) số dừng ở 463, chuyển xám kèm dấu tick rồi ẩn.",
  "- **Chuyển động (assets/style.json → motion):** easing đuôi dài, đơn vị thời gian 0,4 s. Mỗi phần tử hiện đúng lúc lời dẫn nhắc tới (theo thời điểm từng chữ trong audio_meta.json). Mỗi khung chỉ một thứ chính. Không áp dụng overshoot cho số hay thông tin. Lớp phủ của khung trước được mang sang đầu khung sau rồi mờ dần, nên không có gì biến mất đột ngột ở chỗ cắt.",
  "- **Không có:** 3D, ảnh thật, emoji (dấu tick, X, giọt mồ hôi vẽ bằng SVG), thương hiệu thật.",
  "- **Thời lượng:** lấy từ storyboard.json; không chạy sync-durations.", "");
SB.scenes.forEach((s, i) => {
  const [title, hero, support, texture, poster] = DESIGN[s.id];
  sb.push(`## Frame ${i + 1} — ${title}`, "",
    `- scene: ${s.visual.split(/[.;]/)[0]}`,
    `- duration: ${t(s.duration)}s`,
    `- poster: ${poster}`,
    "- transition_in: cut",
    "- status: animated",
    `- voiceover: "${s.narration.replaceAll('"', "'")}"`,
    `- src: compositions/frames/${id(s, i)}.html`,
    "- blueprint: compose",
    `- hero: ${hero}`,
    `- support: ${support}`,
    `- texture: ${texture}`,
    `- sfx: ${s.sfx.join(", ") || "(không)"}`,
    s.voice ? `- voice: ${s.voice}` : "- voice: Hải Đăng",
    "", `Hình ảnh: ${s.visual}`, "", `Chữ trên màn hình: ${s.onScreenText || "(không)"}`, "", `Âm thanh: ${s.sound ?? "(không)"}`, "");
});
writeFileSync("STORYBOARD.md", sb.join("\n"));

const sc = [];
sc.push("# SCRIPT — loi-production-sau-release", "",
  "**Voice:** Hải Đăng (người kể) · Thiền Tâm Đức (sếp) · Thái Sơn (anh Quân) · Trúc Ly (chị Mai). VieNeu-TTS 3.8.3, v3 Turbo, giọng có sẵn.",
  "**Voice direction:** Vừa kịch tính vừa hài hước. Người kể nhanh hơn 6%, chọn lượt lên xuống giọng nhiều nhất. Cảnh 3 và 9 thêm vang phòng; cảnh 4 như qua loa máy tính; cảnh 6 như nghĩ thầm; cảnh 8 bản diễn.", "",
  "Lời dẫn khóa theo storyboard.json (VO_MODE verbatim); âm thanh đã tạo sẵn: assets/voice/NN.wav (tools/make-voice.mjs).", "", "---", "");
SB.scenes.forEach((s, i) => {
  sc.push(`## Line ${i + 1} — ${DESIGN[s.id][0]} (Frame ${i + 1})`, "", `**Time:** ${t(s.start)} – ${t(s.start + s.duration)}s`, "", `    ${s.narration}`, "");
});
writeFileSync("SCRIPT.md", sc.join("\n"));
console.log("wrote STORYBOARD.md and SCRIPT.md:", SB.scenes.length, "frames,", SB.durationSeconds, "s");
