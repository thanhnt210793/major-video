#!/usr/bin/env node
// Writes content/it/loi-production-sau-release/script.md (the reviewer-approved script as a readable
// summary) from storyboard.json, which stays the source of truth.
//
//   node tools/gen-script-md.mjs        (run from the HyperFrames project root)

import { readFileSync, writeFileSync } from "node:fs";
const dir = "../../../content/it/loi-production-sau-release";
const sb = JSON.parse(readFileSync(`${dir}/storyboard.json`, "utf8"));
const n = (x) => String(Math.round(x * 10) / 10).replace(".", ",");
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const STATUS = { verified: "đã kiểm chứng", simulation: "tình huống giả lập", unverified: "chưa kiểm chứng" };

const out = [];
out.push(`# ${sb.title}`, "");
out.push("Bản tổng hợp được tạo từ `storyboard.json`; tệp JSON vẫn là nguồn chính. Trạng thái: **đã duyệt** (người duyệt đồng ý qua chat ngày 27/10/2026). Bản người duyệt đọc ở `kichban/it/1-lap-trinh-vien/kichban_loi-production-sau-release_final.md`.", "");
out.push("## 1. Đối tượng và mục tiêu", "");
out.push("- **Đối tượng:** học sinh THCS/THPT tò mò về nghề lập trình.");
out.push(`- **Mục tiêu:** ${sb.learningObjective}`);
out.push(`- **Định dạng:** ${n(sb.durationSeconds)} giây, ${sb.width}×${sb.height}, ${sb.scenes.length} cảnh. ${sb.format}`);
out.push(`- **Câu hỏi kết:** ${sb.closingQuestion}`, "");
out.push("## 2. Các thông tin cần kiểm chứng", "");
out.push("| Mã | Nội dung | Nguồn | Trạng thái |", "|---|---|---|---|");
for (const r of sb.research) {
  const st = STATUS[r.status] + (r.status === "verified" ? ` (${r.confidence})` : "");
  out.push(`| ${r.id} | ${cell(r.claim)} | ${r.sourceUrl || "—"} | ${st} |`);
}
out.push("", "## 3. Kịch bản từng cảnh", "");
out.push("| Thời gian (giây) | Lời đọc | Chữ trên màn hình | Hình ảnh | Âm thanh | Hiệu ứng (mã) |", "|---|---|---|---|---|---|");
for (const s of sb.scenes) {
  out.push(`| ${n(s.start)}–${n(s.start + s.duration)} | ${cell(s.narration)}${s.voice ? ` _(giọng ${s.voice})_` : ""} | ${cell(s.onScreenText)} | ${cell(s.visual)} | ${cell(s.sound) || "—"} | ${(s.sfx || []).join(", ") || "—"} |`);
}
const h = sb.hook;
out.push("", "## 4. Mở đầu", "");
out.push(`- **Mẫu đã chọn:** ${h.pattern} (Vào thẳng sự cố), phương án B người duyệt chọn sau bản xem thử 1.`);
out.push("- **Khung đầu:** trang thanh toán Giỏ Hời giữa Siêu Sale, các thông báo đỏ \"Thanh toán thất bại\" chồng lên nhau, viền đỏ nhấp nháy, ô đếm đơn lỗi đang chạy, tất cả có từ giây 0.");
out.push(`- **Điều hứa hẹn:** ${h.promise} Cảnh trả lời: \`${h.payoffSceneId}\`.`);
out.push(`- **Hai phương án dự phòng:** ${h.alternatives.join(" · ")} (chi tiết trong \`hook-options.md\`).`, "");
out.push("## 5. Giọng đọc và phát âm", "");
out.push("- **Dàn giọng** (người duyệt chọn qua video nghe thử `audio/thu-giong/nghe-thu-giong.mp4`, 26/10): người kể Hải Đăng (giọng kênh); sếp Thiền Tâm Đức (cảnh boss, lọc như qua loa máy tính); anh Quân Thái Sơn (cảnh mitigate, tự nói câu chốt); chị Mai Trúc Ly (cảnh qc-ok, như video it/dev-local-port-bug).");
out.push("- **Xử lý giọng người kể** (tools/make-voice.mjs): mỗi cảnh tạo 5 lượt đọc, chọn lượt lên xuống giọng nhiều nhất mà Whisper vẫn nghe đúng, rồi đọc nhanh hơn 6%. Cảnh meeting và own-it thêm vang phòng nhẹ; cảnh works-locally nhỏ hơn 1 dB như nghĩ thầm. Cảnh discover dùng bản diễn 3C: ngừng sau \"vậy?\" cho tiếng đĩa rít, rồi \"Trời ơi… là mình!\" và tiếng \"tèn tèn ten\".");
out.push("- **Khi dựng, dùng lại đúng các lượt đọc người duyệt đã nghe** trong `content/it/loi-production-sau-release/audio/thu-giong/raw/`: `2B.wav` (mitigate), `3-take1.wav` (discover), `4-take1-trim.wav` (meeting: `4-take1.wav` cắt từ 1,08 s, bỏ câu \"Sếp gọi họp gấp.\"; nghe lại xem \"Cả nhóm…\" có tròn như đầu câu không). Không tạo lại các cảnh này; các cảnh khác tạo mới bằng `tts_vieneu.py`. Câu của sếp (`1A.wav`) được thay ở vòng góp ý video 4 (28/10), nên cảnh boss tạo mới cùng giọng Thiền Tâm Đức.");
out.push("- Số đọc bằng chữ: \"năm tính năng\" viết sẵn bằng chữ; \"10 phút\", giờ và số trong bộ đếm chỉ hiện trên màn hình.");
out.push("- Câu trích lời ở cảnh own-it, boss, mitigate và qc-ok có bản đọc (ttsNarration) bỏ ngoặc kép; own-it dùng dấu chấm thay dấu hai chấm để có khoảng ngừng.");
out.push("- Cảnh discover: dấu \"…\" luôn dính vào chữ đứng trước (\"tuần…\", \"ơi…\"), không đứng riêng, để phụ đề khớp từng chữ.");
out.push("- Cảnh hunt (28/10): lượt đọc sôi động nhất đọc nhầm \"bản\" thành \"bạn\", nên dùng lượt 4, lượt duy nhất đọc đúng cả \"bản cũ\" và \"gộp\". Bản đọc có dấu \"!\" sau \"Bản cũ chạy lại rồi\" để có khoảng ngừng.");
out.push("- Cảnh own-it (28/10): dùng lại lượt đọc cũ, cắt từ 2,98 s để bỏ đoạn tự nói \"Tim đập thình thịch… Hay là lặng lẽ sửa cho xong? Không!\" theo góp ý của người duyệt.");
out.push("- Cảnh boss (28/10): chọn lượt 1 trong 5, ngắn nhất và Whisper nghe đúng lời nhất; \"code\" đọc kiểu Việt (\"cốt\").");
out.push("- Không đọc tên lệnh, đoạn code hay ký hiệu; chúng chỉ hiện trên màn hình. Dấu tick, dấu X và giọt mồ hôi vẽ bằng SVG, không dùng emoji.", "");
out.push("## 6. Điểm còn chưa chắc chắn", "");
out.push("- fact-001: video chỉ thể hiện \"khôi phục dịch vụ trước\" bằng quyết định của anh Quân, không nói đó là quy luật chung của mọi công ty.");
out.push("- fact-007: nguồn là The Twelve-Factor App, một phương pháp luận nổi tiếng, không phải tổ chức tiêu chuẩn (độ tin cậy trung bình).");
out.push("- Chuyện về muộn không có nguồn, nên chỉ là chi tiết trong truyện; video không nói làm IT là phải tăng ca hay làm cuối tuần (báo cáo viết vào đầu tuần sau).");
out.push("- Đoạn code và tên người dùng \"minh\" là hư cấu để minh hoạ.");
out.push("- Hiệu ứng âm thanh và nhạc nền: tất cả là CC0 (Freesound, Kenney, OpenGameArt), ghi trong `assets/LICENSES.md` và `audio-manifest.json`. Nhạc: căng thẳng (cảnh 1–5) → hài hồi hộp (cảnh 6–7, tắt ngang ở \"vẫn bí!\") → không nhạc (cảnh 8–10) → vui (cảnh 11–14), luôn nhỏ hơn giọng đọc.");
out.push("- fact-009: hạn mười phút của sếp, số pull request #231–#235, +128 −46, 37 kết quả tìm kiếm và \"nửa tiếng\" ở cảnh hunt là hư cấu.", "");
out.push("## Vấn đề còn mở", "");
out.push("- Không còn.");
out.push("", "Approved by the reviewer (in chat) on 2026-10-27.");
writeFileSync(`${dir}/script.md`, out.join("\n") + "\n");
console.log("ok", sb.scenes.length, "scenes", sb.durationSeconds, "s");
