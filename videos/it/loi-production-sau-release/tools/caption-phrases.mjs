#!/usr/bin/env node
// Regroups the captions at natural Vietnamese phrase breaks. The faceless-explainer grouping
// caps fast speech at two syllables, which splits words such as "lịch | sử" and "ly trà |
// sữa". Each scene's narration is phrased by hand below ("/" marks a caption break); the word
// timings stay those of captions.mjs. Rewrites caption_groups.json and the GROUPS array in
// compositions/captions.html (its DOM is built from that array at runtime).
// A scene whose phrasing no longer matches its words keeps the default grouping, with a warning.
//
//   node tools/caption-phrases.mjs      (run from the HyperFrames project root, after captions.mjs build)

import { readFileSync, writeFileSync } from "node:fs";

const PHRASES = {
  hook: "Mười phút / sau khi phát hành… / hàng trăm khách / không thanh toán được!",
  escalate: "Vừa phát hành / năm tính năng, / khách hàng lớn / đã báo lên tận sếp.",
  meeting: "Cả nhóm / im phăng phắc, / ly trà sữa / còn chưa kịp uống.",
  boss: "“Khách lớn / đang chờ đấy. / Cho em mười phút / xem lại code vừa gộp!”",
  mitigate: "“Cứ quay về / bản cũ đã, / để khách thanh toán / lại được ngay. / Sửa lỗi tính sau!”",
  "works-locally": "Ơ kìa, / trên máy mình / vẫn chạy ngon lành… / Đoạn này hôm trước / mình làm đúng rồi / mà nhỉ? / Hay ai sửa đè lên?",
  hunt: "Bản cũ chạy lại rồi, / giờ đi tìm lỗi. / Lục từng / yêu cầu gộp code, / dò lịch sử… / mười phút / thành nửa tiếng, / vẫn bí!",
  discover: "Ai viết dòng này vậy? / Trời ơi… / là mình!",
  "own-it": "Mình báo ngay: / “Lỗi do em, / em tìm ra rồi ạ!”",
  "fix-check": "Mình sửa xong, / nhờ chị Mai thử lại…",
  "qc-ok": "“Ngon lành rồi em ơi!”",
  release: "Phát hành lại xong. / Tối đó về muộn / một chút, / nhưng không ai / phải gánh một mình.",
  postmortem: "Đầu tuần sau, / cả nhóm rút kinh nghiệm: / tìm cách để lỗi / không lặp lại, / chứ không / tìm người để trách.",
  question: "Nếu là bạn, / bạn sẽ nhận lỗi ngay, / hay đợi sửa xong / mới nói?",
};
const TAIL_PAD = 0.12; // as captions.mjs

const SB = JSON.parse(readFileSync("../../../content/it/loi-production-sau-release/storyboard.json", "utf8"));
const CG = JSON.parse(readFileSync("caption_groups.json", "utf8"));
const r3 = (n) => Math.round(n * 1000) / 1000;
const norm = (s) => String(s).normalize("NFC").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");

// words per frame, in order, from the default groups
const byFrame = new Map();
for (const g of CG.groups) for (const w of g.words) {
  if (!byFrame.has(g.frame)) byFrame.set(g.frame, []);
  byFrame.get(g.frame).push({ ...w, frame: g.frame });
}

const groups = [];
let phrased = 0;
for (const [frame, words] of [...byFrame].sort((a, b) => a[0] - b[0])) {
  const id = SB.scenes[frame - 1]?.id, spec = PHRASES[id];
  const chunks = spec ? spec.split(" / ").map((c) => c.split(/\s+/).filter((t) => norm(t))) : null;
  const flat = chunks ? chunks.flat() : [];
  const ok = chunks && flat.length === words.length && flat.every((t, i) => norm(t) === norm(words[i].text));
  if (!ok) {
    console.warn(`caption-phrases: frame ${frame} (${id}) keeps the default grouping: phrasing does not match the words`);
    for (const g of CG.groups.filter((x) => x.frame === frame)) groups.push(g.words.map((w) => ({ ...w, frame })));
    continue;
  }
  let k = 0;
  for (const c of chunks) { groups.push(words.slice(k, k + c.length)); k += c.length; }
  phrased++;
}

const out = groups.map((ws, gi) => {
  const next = groups[gi + 1];
  let end = r3(ws[ws.length - 1].end + TAIL_PAD);
  if (next && next[0].start < end) end = r3(next[0].start);
  return {
    id: `caption-group-${gi}`, frame: ws[0].frame, start: r3(ws[0].start), end,
    text: ws.map((w) => w.text).join(" "),
    words: ws.map((w, wi) => ({ id: `caption-word-${gi}-${wi}`, text: w.text, start: w.start, end: w.end })),
  };
});
writeFileSync("caption_groups.json", JSON.stringify({ ...CG, groups: out }, null, 2));

const html = readFileSync("compositions/captions.html", "utf8");
const re = /var GROUPS = \[.*?\];\n/s;
if (!re.test(html)) throw new Error("caption-phrases: no GROUPS array in compositions/captions.html");
writeFileSync("compositions/captions.html", html.replace(re, () => `var GROUPS = ${JSON.stringify(out).replace(/</g, "\\u003c")};\n`));
console.log(`caption-phrases: ${out.length} groups (was ${CG.groups.length}); ${phrased}/${byFrame.size} frames phrased by hand`);
