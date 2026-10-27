#!/usr/bin/env node
// The reviewer-facing script file for the /lam-video flow: kichban/<group>/<occupation>/kichban_<name>_final.md.
// storyboard.json stays the source of truth; this file is a plain-Vietnamese view of it
// that a non-technical reviewer can edit and approve.
//
//   node scripts/kichban.mjs render <storyboard.json> <kichban.md> [--history "<text>"] [--clear-feedback] [--reset-approval]
//       Write the file from the storyboard. Keeps the reviewer-owned sections of an existing file
//       (Ghi chú của Claude, Ý kiến của người duyệt, Lịch sử chỉnh sửa, Duyệt) unless reset.
//   node scripts/kichban.mjs diff <storyboard.json> <kichban.md> [--json]
//       Report the reviewer's text edits, comments and approval state.
//   node scripts/kichban.mjs apply <storyboard.json> <kichban.md>
//       Copy edited text (title, message, closing question, per-scene Lời đọc / Chữ trên màn hình /
//       Hình ảnh / Âm thanh) into storyboard.json, then validate. Refuses when the scene count differs.
//   node scripts/kichban.mjs open [--reveal] <file.md|file.mp4>
//       Open a repo file for the reviewer: .md in VS Code, .mp4 in the default player;
//       --reveal selects the file in Explorer instead.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve, relative, extname, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";
import { validate } from "./validate-storyboard.mjs";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const FIELDS = [
  { key: "narration", label: "Lời đọc" },
  { key: "onScreenText", label: "Chữ trên màn hình" },
  { key: "visual", label: "Hình ảnh" },
  { key: "sound", label: "Âm thanh" },
];
const EMPTY = "(không có)";
const NONE_YET = "(Chưa có.)";
const KEPT_SECTIONS = ["Ghi chú của Claude", "Ý kiến của người duyệt", "Lịch sử chỉnh sửa", "Duyệt"];
const FEEDBACK_PLACEHOLDER = "_(Viết góp ý ở đây, mỗi ý một dòng. Ví dụ: \"Cảnh 3 dài quá\", \"Dùng mở đầu dự phòng số 1\".)_";
const DEFAULT_SECTIONS = {
  "Ghi chú của Claude": "(Không có.)",
  "Ý kiến của người duyệt": FEEDBACK_PLACEHOLDER,
  "Lịch sử chỉnh sửa": "",
  "Duyệt": "- [ ] Tôi đã đọc kỹ và duyệt kịch bản này\n- Người duyệt:\n- Ngày:",
};
// Vietnamese names for hook pattern ids (.claude/skills/career-hook/hook-patterns.md).
const HOOK_NAMES = {
  "in-medias-res": "Vào thẳng sự cố",
  "oddly-specific": "Chi tiết lạ mà cụ thể",
  "curiosity-question": "Câu hỏi gợi tò mò",
  "pov-stakes": "Đặt người xem vào vai",
  "countdown": "Đồng hồ đếm ngược",
  "myth-vs-reality": "Tưởng là… hoá ra…",
  "result-first": "Cho xem kết quả trước",
  "relatable": "Điều học sinh từng gặp",
  "wrong-move": "Làm sai trước mắt người xem",
};
const RESEARCH_STATUS = {
  verified: "✅ Đã kiểm chứng",
  simulation: "🎭 Tình huống giả lập",
  unverified: "⚠️ Chưa kiểm chứng",
};

const norm = (s) => String(s ?? "").normalize("NFC").replace(/\s+/g, " ").trim();
const secs = (n) => String(Math.round(n * 10) / 10).replace(".", ",");
const today = () => new Date().toISOString().slice(0, 10);
const cell = (s) => norm(s).replace(/\|/g, "\\|");

// ---------- parse ----------

function sections(md) {
  // Split on "## " headings; returns [{ title, body }] with body lines verbatim.
  const out = [];
  let cur = { title: "", lines: [] };
  for (const line of md.split(/\r?\n/)) {
    const h = /^##\s+(.+?)\s*$/.exec(line);
    if (h) {
      out.push(cur);
      cur = { title: h[1].normalize("NFC"), lines: [] };
    } else cur.lines.push(line);
  }
  out.push(cur);
  return out.map((s) => ({ title: s.title, body: s.lines.join("\n").replace(/^\n+|\n+$/g, "") }));
}

const sectionBody = (parts, title) => parts.find((s) => s.title === title)?.body;
const textLines = (body) =>
  (body ?? "").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith(">") && !/^_\(.*\)_$/.test(l));

const FIELD_RE = new RegExp(
  String.raw`^\s*(?:[-*+]\s+)?(?:\*\*|__)?\s*(${FIELDS.map((f) => f.label).join("|")})\s*:?\s*(?:\*\*|__)?\s*:?\s*(.*)$`,
  "iu",
);

export function parse(md) {
  const parts = sections(md.normalize("NFC"));
  const titleLine = /^#\s+(.+)$/m.exec(parts[0].body)?.[1] ?? "";
  const title = norm(titleLine.replace(/^Kịch bản\s*:\s*/iu, ""));

  const scenes = [];
  let scene = null;
  let field = null;
  for (const line of (sectionBody(parts, "Kịch bản từng cảnh") ?? "").split("\n")) {
    const h = /^###\s*Cảnh\s*(\d+)/iu.exec(line);
    if (h) {
      scene = { n: Number(h[1]) };
      scenes.push(scene);
      field = null;
      continue;
    }
    if (!scene) continue;
    const f = FIELD_RE.exec(line);
    if (f) {
      field = FIELDS.find((x) => x.label.toLowerCase() === f[1].toLowerCase()).key;
      scene[field] = f[2];
    } else if (/^\s*[-*+]\s/.test(line) || /^#/.test(line)) field = null;
    else if (field && line.trim()) scene[field] += " " + line.trim();
  }
  for (const s of scenes) for (const { key } of FIELDS) if (s[key] !== undefined) {
    s[key] = norm(s[key]);
    if (s[key] === EMPTY) s[key] = "";
  }

  const approval = sectionBody(parts, "Duyệt") ?? "";
  return {
    title,
    learningObjective: norm(textLines(sectionBody(parts, "Thông điệp chính")).join(" ")),
    closingQuestion: norm(textLines(sectionBody(parts, "Câu hỏi cuối video")).join(" ")),
    scenes,
    feedback: textLines(sectionBody(parts, "Ý kiến của người duyệt")).map((l) => l.replace(/^[-*+]\s+/, "")),
    approval: {
      ticked: /^\s*[-*+]\s*\[[xX]\]/m.test(approval),
      reviewer: norm(/Người duyệt[ \t]*:[ \t]*(.*)$/imu.exec(approval)?.[1]),
      date: norm(/Ngày[ \t]*:[ \t]*(.*)$/imu.exec(approval)?.[1]),
    },
    kept: Object.fromEntries(KEPT_SECTIONS.map((t) => [t, sectionBody(parts, t)])),
  };
}

// ---------- render ----------

export function render(doc, existing, { history, clearFeedback, resetApproval } = {}) {
  const kept = { ...DEFAULT_SECTIONS };
  if (existing) for (const t of KEPT_SECTIONS) if (existing.kept[t] !== undefined) kept[t] = existing.kept[t];
  if (clearFeedback) kept["Ý kiến của người duyệt"] = DEFAULT_SECTIONS["Ý kiến của người duyệt"];
  if (resetApproval) kept["Duyệt"] = DEFAULT_SECTIONS["Duyệt"];
  if (history) {
    const prev = kept["Lịch sử chỉnh sửa"] === NONE_YET ? "" : kept["Lịch sử chỉnh sửa"];
    kept["Lịch sử chỉnh sửa"] = [prev, `- ${today()}: ${history}`].filter(Boolean).join("\n");
  }

  const appr = parse(`## Duyệt\n${kept["Duyệt"]}`).approval;
  const status =
    doc.status === "published" ? "Đã đăng" :
    doc.status === "approved" ? `Đã duyệt${appr.reviewer ? ` bởi ${appr.reviewer}` : ""}${appr.date ? `, ngày ${appr.date}` : ""}` :
    "Chờ bạn đọc và duyệt";

  const scenes = doc.scenes ?? [];
  const out = [
    `# Kịch bản: ${norm(doc.title)}`,
    "",
    `> **Trạng thái:** ${status}`,
    ">",
    "> **Cách sửa:** sửa thẳng phần chữ sau **Lời đọc**, **Chữ trên màn hình**, **Hình ảnh** và **Âm thanh**. Góp ý khác thì ghi vào mục **Ý kiến của người duyệt**. Thời gian và giọng đọc thì Claude tự canh.",
    ">",
    "> **Xong thì:** bấm Ctrl+S để lưu, rồi nhắn Claude \"đã sửa\". Khi đồng ý toàn bộ, tick ô ở mục **Duyệt**, ghi tên, lưu, rồi nhắn \"đã duyệt\".",
    "",
    "## Thông điệp chính",
    "",
    norm(doc.learningObjective),
    "",
    "## Câu hỏi cuối video",
    "",
    norm(doc.closingQuestion),
    "",
    "## Kịch bản từng cảnh",
    "",
    `Video dài khoảng ${secs(doc.durationSeconds ?? 0)} giây, gồm ${scenes.length} cảnh.`,
  ];
  scenes.forEach((s, i) => {
    const end = (s.start ?? 0) + (s.duration ?? 0);
    const tag = i === 0 ? " · mở đầu" : i === scenes.length - 1 ? " · kết" : "";
    out.push("", `### Cảnh ${i + 1} · ${secs(s.start ?? 0)}–${secs(end)} giây${tag}`, "");
    for (const { key, label } of FIELDS) out.push(`- **${label}:** ${norm(s[key]) || EMPTY}`);
    if (s.voice) out.push(`- Giọng đọc riêng cho cảnh này: giọng có sẵn tên "${s.voice}"`);
  });

  const h = doc.hook;
  if (h && typeof h === "object") {
    out.push("", "## Mở đầu dự phòng", "");
    out.push(`Mở đầu đang dùng: **${HOOK_NAMES[h.pattern] ?? h.pattern}**. Nó gợi cho người xem câu hỏi: ${norm(h.promise)}`);
    const alts = Array.isArray(h.alternatives) ? h.alternatives : [];
    if (alts.length) {
      out.push("", "Nếu muốn đổi, ghi vào mục Ý kiến, ví dụ \"dùng mở đầu dự phòng số 1\".", "");
      alts.forEach((a, i) => {
        const m = /^([a-z-]+):\s*(.*)$/.exec(a);
        out.push(m && HOOK_NAMES[m[1]] ? `${i + 1}. *${HOOK_NAMES[m[1]]}:* ${norm(m[2])}` : `${i + 1}. ${norm(a)}`);
      });
    }
  }

  const research = (doc.research ?? []).filter((r) => norm(r.claim));
  if (research.length) {
    out.push("", "## Thông tin trong video và nguồn", "");
    out.push("Claude đã tự mở từng nguồn để kiểm tra. Thông tin chưa kiểm chứng sẽ không được dùng trong video đăng lên.", "");
    out.push("| # | Thông tin | Trạng thái | Nguồn |", "|---|---|---|---|");
    research.forEach((r, i) => {
      const src = /^https?:\/\//.test(r.sourceUrl ?? "") ? `[mở nguồn](${r.sourceUrl})` : "—";
      out.push(`| ${i + 1} | ${cell(r.claim)} | ${RESEARCH_STATUS[r.status] ?? r.status} | ${src} |`);
    });
  }

  for (const t of KEPT_SECTIONS) out.push("", `## ${t}`, "", kept[t] || NONE_YET);
  return out.join("\n") + "\n";
}

// ---------- diff / apply ----------

function changes(doc, k) {
  const list = [];
  for (const key of ["title", "learningObjective", "closingQuestion"])
    if (k[key] && norm(doc[key]) !== k[key]) list.push({ where: key, key, from: norm(doc[key]), to: k[key] });
  const scenes = doc.scenes ?? [];
  if (k.scenes.length === scenes.length)
    k.scenes.forEach((ks, i) => {
      for (const { key } of FIELDS)
        if (ks[key] !== undefined && norm(scenes[i][key]) !== ks[key])
          list.push({ where: `scene ${i + 1} (${scenes[i].id})`, scene: i, key, from: norm(scenes[i][key]), to: ks[key] });
    });
  return list;
}

function report(doc, k, asJson) {
  const scenes = doc.scenes ?? [];
  const r = {
    structural: k.scenes.length !== scenes.length ? { kichban: k.scenes.length, storyboard: scenes.length } : null,
    changes: changes(doc, k),
    feedback: k.feedback,
    approval: k.approval,
    storyboardStatus: doc.status,
  };
  if (asJson) return JSON.stringify(r, null, 2);
  const lines = [];
  lines.push(r.structural
    ? `STRUCTURAL: kichban has ${r.structural.kichban} scenes, storyboard has ${r.structural.storyboard}. Per-scene edits are not compared.`
    : "Structure: same scenes.");
  lines.push(r.changes.length ? "Edits:" : "Edits: none.");
  for (const c of r.changes) lines.push(`  ${c.where} ${c.key}:\n    - ${JSON.stringify(c.from)}\n    + ${JSON.stringify(c.to)}`);
  lines.push(r.feedback.length ? "Reviewer comments:" : "Reviewer comments: none.");
  for (const f of r.feedback) lines.push(`  - ${f}`);
  const a = r.approval;
  lines.push(`Approval box: ${a.ticked ? "TICKED" : "not ticked"}; reviewer: ${a.reviewer || "—"}; date: ${a.date || "—"}. Storyboard status: ${doc.status}.`);
  return lines.join("\n");
}

function apply(doc, k) {
  if (k.scenes.length !== (doc.scenes ?? []).length)
    return { error: `kichban has ${k.scenes.length} scenes, storyboard has ${doc.scenes.length}: a structural change. Edit storyboard.json by hand.` };
  const list = changes(doc, k);
  const stale = [];
  const sound = [];
  for (const c of list) {
    if (c.scene === undefined) doc[c.key] = c.to;
    else {
      doc.scenes[c.scene][c.key] = c.to;
      if (c.key === "narration" && typeof doc.scenes[c.scene].ttsNarration === "string") stale.push(c.where);
      if (c.key === "sound") sound.push(c.where);
    }
  }
  return { list, stale, sound };
}

// ---------- open ----------

function open(file, reveal) {
  const abs = resolve(file);
  const rel = relative(REPO, abs);
  if (rel.startsWith("..") || isAbsolute(rel)) throw new Error(`refusing to open a file outside the repo: ${abs}`);
  if (!existsSync(abs)) throw new Error(`no such file: ${abs}`);
  const ext = extname(abs).toLowerCase();
  if (![".md", ".mp4"].includes(ext)) throw new Error("only .md and .mp4 files can be opened");
  const win = process.platform === "win32";
  const run = (cmd, args, opts = {}) => spawn(cmd, args, { detached: true, stdio: "ignore", ...opts }).unref();
  if (reveal) {
    if (win) run("explorer.exe", [`/select,"${abs}"`], { windowsVerbatimArguments: true });
    else run(process.platform === "darwin" ? "open" : "xdg-open", process.platform === "darwin" ? ["-R", abs] : [dirname(abs)]);
  } else if (ext === ".md") {
    if (win) run("cmd.exe", ["/d", "/s", "/c", `code -r "${abs}"`], { windowsVerbatimArguments: true });
    else run("code", ["-r", abs]);
  } else if (win) run("cmd.exe", ["/d", "/s", "/c", `start "" "${abs}"`], { windowsVerbatimArguments: true });
  else run(process.platform === "darwin" ? "open" : "xdg-open", [abs]);
  console.log(`opened ${rel}`);
}

// ---------- main ----------

function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  const flag = (name) => rest.includes(name);
  const opt = (name) => { const i = rest.indexOf(name); return i >= 0 ? rest[i + 1] : undefined; };
  const optValues = new Set(["--history"].map(opt).filter(Boolean));
  const pos = rest.filter((a) => !a.startsWith("--") && !optValues.has(a));

  if (cmd === "open") {
    try {
      open(pos[0] ?? "", flag("--reveal"));
      return 0;
    } catch (e) {
      console.error(e.message);
      return 1;
    }
  }
  const [sbPath, mdPath] = pos;
  if (!["render", "diff", "apply"].includes(cmd) || !sbPath || !mdPath) {
    console.error("usage: kichban.mjs render|diff|apply <storyboard.json> <kichban.md> | open [--reveal] <file>");
    return 1;
  }
  const doc = JSON.parse(readFileSync(sbPath, "utf8"));
  const existing = existsSync(mdPath) ? parse(readFileSync(mdPath, "utf8")) : null;

  if (cmd === "render") {
    mkdirSync(dirname(mdPath), { recursive: true });
    writeFileSync(mdPath, render(doc, existing, {
      history: opt("--history"), clearFeedback: flag("--clear-feedback"), resetApproval: flag("--reset-approval"),
    }));
    console.log(`wrote ${mdPath}`);
    return 0;
  }
  if (!existing) { console.error(`no such file: ${mdPath}`); return 1; }
  if (cmd === "diff") {
    console.log(report(doc, existing, flag("--json")));
    return 0;
  }
  const res = apply(doc, existing);
  if (res.error) { console.error(res.error); return 3; }
  if (!res.list.length) { console.log("No text edits to apply."); return 0; }
  writeFileSync(sbPath, JSON.stringify(doc, null, 2) + "\n");
  console.log(`Applied ${res.list.length} edit(s) to ${sbPath}:`);
  for (const c of res.list) console.log(`  ${c.where} ${c.key}`);
  for (const w of res.stale) console.log(`  STALE ttsNarration in ${w}: rewrite it to match the new narration.`);
  for (const w of res.sound) console.log(`  SOUND changed in ${w}: update its sfx cues to match.`);
  const { errors, warnings } = validate(doc);
  for (const e of errors) console.log(`  ERROR ${e}`);
  for (const w of warnings) console.log(`  WARN  ${w}`);
  return errors.length ? 2 : 0;
}

process.exitCode = main();
