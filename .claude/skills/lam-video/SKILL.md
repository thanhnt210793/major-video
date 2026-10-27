---
name: lam-video
description: Guided, non-technical way to make a Career POV video. The person writes a rough idea or script in Vietnamese. Claude analyses it and suggests a focus, writes kichban/<group>/<occupation>/kichban_<name>_final.md for them to read, edit and approve, then builds the video, opens it, and revises it from their feedback. Use whenever someone pastes a rough video idea or script ("kịch bản", "ý tưởng video", "làm video về…"), asks for a video without naming a pipeline step, says "đã sửa" / "đã duyệt" about a kichban file, or gives feedback on a video they just watched.
argument-hint: <rough script or idea> | <slug to resume>
---

# Làm video — guided flow for a non-technical reviewer

Input: $ARGUMENTS

This skill puts the project pipeline behind seven plain steps:
`/career-script` → `/career-hook` → `/career-build` → `/career-voiceover` → `/career-qa` → `/career-log`

The reviewer only ever does four things:
1. writes the idea
2. reads and edits one script file
3. approves it
4. watches the video and says what to change

Every content and accuracy rule in CLAUDE.md still applies. Where this file differs from those skills, it wins only on what to show the reviewer and when to stop. The fact-checking, the licensing rules and the "only a human approves" rule never relax.

## Talking to the reviewer

- **Language and tone.** Vietnamese only, warm and short. Address them as "bạn".
- **No technical words.** Use these instead:

  | Instead of | Say |
  |---|---|
  | storyboard, JSON | kịch bản |
  | render | dựng video |
  | TTS | giọng đọc |
  | draft render | bản xem thử |
  | scene, frame | cảnh |

  Never show commands, logs, file trees or error output. Say what a problem means for the video.
- **Open files for them** with `node scripts/kichban.mjs open <file>` instead of giving a path. Any file you mention is a clickable link.
- **End every message with one line:** **Việc của bạn:** <the single next thing to do>, or "không cần làm gì, chờ mình khoảng N phút".
- **Warn before slow steps.** Before research, voice generation, building or rendering, say roughly how long it takes and that they can leave it running.
- **Few questions.** Ask at most three at a time. When the choices are clear, use AskUserQuestion with clickable options, recommended option first.
- **Don't ask the reviewer about channel-level settings.** Palette, font, narrator voice, music library and permissions belong to the channel owner. If one of them blocks the work, say plainly that the channel owner needs to look at it, and what exactly.
- **Permission prompts.** If a permission prompt is likely, warn them in one line what it is for. Example: "Máy sẽ hỏi cho phép dựng video, bạn bấm Yes."

## The kichban folder tree

```
kichban/
├─ KE-HOACH.md                     plan: every group × occupation, its video ideas and their status
├─ <group>/
│  ├─ top-5-nganh-hot.md           researched top-5 occupations of the group, with sources
│  ├─ <n>-<occupation>/            n = rank in top-5-nganh-hot.md, e.g. 1-ky-su-ai
│  │  ├─ KE-HOACH.md               that occupation: summary, video ideas, list of its videos
│  │  └─ kichban_<name>_final.md   one per video
│  └─ khac/                        videos in the group that fit none of the top 5
```

- **`<occupation>` in this file means that folder**, e.g. `1-ky-su-ai`. The video slug stays `<group>/<name>`; only the kichban file sits one level deeper.
- **To find a video's kichban file**, glob `kichban/<group>/*/kichban_<name>_final.md`.
- **Keep the plan current.** Whenever a video changes state (idea → kịch bản nháp → đã duyệt → đã có video → đã đăng), update its row in `kichban/KE-HOACH.md` and its line in the occupation's `KE-HOACH.md`. When an idea from a `KE-HOACH.md` becomes a video, link the row to its kichban file.

## Find where we are

If the input names a video, a kichban file, an occupation or an idea from `kichban/KE-HOACH.md`, or continues an earlier conversation, find its folder and go to the step that matches its state. People usually give only the name or a description, so search `content/*/<name>/`, the titles in `content/*/*/storyboard.json`, and `kichban/KE-HOACH.md`.

| State | Go to |
|---|---|
| No `content/<slug>/` yet | Step 1 |
| `storyboard.json` is `draft`, `kichban/<group>/<occupation>/kichban_<name>_final.md` exists | Step 4 |
| `approved`, no file in `videos/<slug>/renders/` | Step 5 |
| `approved`, a render exists | Step 6 |
| `published` | Tell them it is already posted. Changes mean a new video, starting at Step 1. |

## Step 1 — Nhận ý tưởng

- **Pick the career group** from `content/nhom-nganh.json`, e.g. `it` or `giaovien`.
  - An idea covering several groups goes in `tongquan`.
  - If no group fits, propose a new one to them in plain words, e.g. "nhóm Nông nghiệp", and add it to `nhom-nganh.json` only after they agree.
- **Pick the name:** short, Vietnamese without diacritics, kebab-case, e.g. `hoa-don-lech-1-dong`. The slug is `<group>/<name>`, e.g. `it/hoa-don-lech-1-dong`.
- **Pick the occupation folder** `kichban/<group>/<n>-<occupation>/` from the group's `top-5-nganh-hot.md`, or `khac/` if none of the five fits. Create `khac/` when first needed.
- **Tell them where it is filed** in one line, e.g. "Video này mình xếp vào nhóm Công nghệ thông tin, nghề Kỹ sư AI."
- **Save their message verbatim** to `content/<slug>/y-tuong-goc.md`, with the date. Later steps check against it so their intent isn't lost.
- **If the idea is only a career name** ("nghề y tá") or a whole field, Step 2 proposes concrete situations.

## Step 2 — Phân tích và gợi ý

Judge the idea against the channel:
- one career and one concrete situation
- 30–60 s
- a THCS/THPT audience
- a first-person POV
- facts kept separate from fiction
- safe content

Reply in chat with four short parts:

1. **Thông điệp chính:** your one-sentence reading of what viewers should take away.
2. **Điểm mạnh:** 1–3 bullets on what to keep.
3. **Nên chỉnh:** only what applies, each with a concrete suggestion.
   - Several ideas → pick one, and say which.
   - No concrete situation → 2–3 situations to choose from.
   - Too long for 60 s → what to cut.
   - Words a 12–18-year-old won't know → simpler words.
   - Facts that need a source (numbers, salaries, "most…") → say you will check them, and that anything unsourced gets cut or rephrased.
   - A weak opening → one hook idea, using the `/career-hook` patterns.
   - No closing question → a suggestion.
   - Safety or sensitive content → how to keep it safe.
4. **Hướng đi đề xuất:**
   - the situation
   - the story in 3–5 short lines: beginning → problem → how it's solved → lesson
   - the target length

If there are real choices (focus, situation, tone), ask with AskUserQuestion and wait. If the idea is already focused, say so and go straight to Step 3.

## Step 3 — Viết kịch bản

Tell them this takes about 10–20 minutes. Then run `/career-script` steps 0 and 2–5, with the agreed direction as the topic, since step 1 is done here. That covers:
- research and sources
- `/career-hook` for scene 1
- the `fact-checker` and `vi-script-reviewer` reviews

Keep their own words wherever they work. Change their wording only for a reason you can name (length, clarity, accuracy, pronunciation), and list each change in the notes below.

Then, instead of career-script's step 6:

1. Write the review file:

   ```bash
   node scripts/kichban.mjs render content/<slug>/storyboard.json kichban/<group>/<occupation>/kichban_<name>_final.md --history "Claude soạn bản đầu từ ý tưởng của bạn"
   ```

2. Fill its "Ghi chú của Claude" section (Edit) in plain Vietnamese:
   - what you changed from their idea, and why
   - any fact you could not verify, and what you did about it
   - any decision you need from them
3. Open the file:

   ```bash
   node scripts/kichban.mjs open kichban/<group>/<occupation>/kichban_<name>_final.md
   ```

4. In chat, give:
   - the length and the number of scenes
   - the 2–3 points worth their attention
   - how to review, in three lines:
     - Sửa thẳng chữ sau **Lời đọc**, **Chữ trên màn hình**, **Hình ảnh**, **Âm thanh**.
     - Góp ý khác ghi vào **Ý kiến của người duyệt**.
     - Đồng ý thì tick ô **Duyệt**, ghi tên, Ctrl+S, rồi nhắn "đã duyệt". Nếu chỉ sửa thì nhắn "đã sửa".

Stop and wait.

## Step 4 — Đọc góp ý và duyệt

When they say they are done:

```bash
node scripts/kichban.mjs diff content/<slug>/storyboard.json kichban/<group>/<occupation>/kichban_<name>_final.md
```

1. **Their edits.** Run `node scripts/kichban.mjs apply …` with the same two paths. Apply copies their edited text into `storyboard.json` and validates it. Then deal with the consequences:
   - Rewrite `ttsNarration` for every scene it reports as `STALE`.
   - If they changed the closing question, keep the last scene's narration consistent with it.
   - New facts go through research and `fact-checker`.
   - Run `vi-script-reviewer` on the changed scenes.
   - If apply refuses because scenes were added or removed, make that structural change in `storyboard.json` yourself, following career-script step 3.
   - Never silently rewrite their edits. If an edit causes a problem (too long for the scene, an unsourced fact, a word the voice will misread, a safety issue), explain it in one line and propose a fix. They decide.
2. **Their comments** in "Ý kiến của người duyệt":
   - Do what they ask. A story change goes back through the Step 3 checks.
   - Then re-render the file with `--clear-feedback` and a `--history` line saying what you did for each comment.
3. **Show them.** Re-render the file. The reviewer sections (notes, comments, history, approval) are kept. If anything changed, open the file and summarise the changes.
4. **Approval.** Approve only when all four are true:
   - The **Duyệt** box is ticked and a name is filled in, or they wrote "duyệt" / "đồng ý" in chat after seeing the latest version.
   - No comments are waiting.
   - No proposed fix is waiting for their answer.
   - Since they last saw the file, you changed only what they asked for.

   If you changed anything else after they ticked the box:
   1. Re-render with `--reset-approval`.
   2. Say what changed.
   3. Ask them to approve again.

   Once approved, run career-script step 6's approval actions:
   - set `"status": "approved"` in `storyboard.json`
   - add `Approved by <name> on <date>` to `script.md`
   - log the research and script time with `/career-log <slug>`

   Then re-render the file, so its status line reads "Đã duyệt".

Only the reviewer can approve. Never tick the box, or set `approved`, on your own judgement.

## Step 5 — Dựng video

Tell them this takes roughly 20–40 minutes and they can leave it running. Run `/career-build <slug>` with these extra overrides:

- **`BRIEF.md` uses `storyboard: no`** (autonomous mode). There are no plan or sketch checkpoints. Write your design decisions in the transcript; don't ask the reviewer.
- **Channel settings.** Use `assets/style.json` as it is, even if it still has `"approved": false`, and don't ask the reviewer about palette or font. Narration uses `style.json` `voice`. If there is no licensed music in `assets/audio/music/`, the video has narration only; tell the channel owner afterwards, not the reviewer.
- **Script approval is the go-ahead for review renders.** It answers faceless-explainer's render question; the channel owner set this flow up. Before each render:
  1. `lint` and `check` pass.
  2. You have looked at the snapshots, including the hook frames from career-build.

  Then render without asking:

  ```bash
  npx hyperframes render --output renders/<name>-<YYYYMMDD>-<n>.mp4
  ```

- **Check the render before they see it:**
  - the ffprobe format check
  - the 2 frames/s contact sheets
  - the hook strip

  The commands are in `.claude/agents/render-qa.md` §1–2. Fix anything clearly broken and render again before showing it: cut-off or wrong text, missing diacritics, black frames. The full `/career-qa` runs only at Step 7.

Then open the video:

```bash
node scripts/kichban.mjs open videos/<slug>/renders/<file>.mp4
```

Tell them what to watch for:
- whether the opening grabs attention
- whether the text is readable on a phone
- any word the voice says wrong
- whether the pace feels right

They can answer in ordinary words, for example "cảnh 3 chữ nhỏ quá", "giọng đọc sai chữ X", or "mở đầu chậm".

## Step 6 — Sửa theo góp ý

Sort each request and handle it like this:

| Kind | Example | What to do |
|---|---|---|
| Look and motion | "chữ to hơn", "đổi màu nền", "cảnh 2 nhanh quá" | Edit the compositions and re-render. No re-approval. |
| Pronunciation | "giọng đọc sai chữ X" | Fix the spelling in that scene's `ttsNarration`; the captions keep the correct text. Regenerate that scene with `/career-voiceover <slug> --scene <id>`, rebuild `audio_meta.json`, re-render. |
| Exact new words | "đổi câu cảnh 3 thành: …" | Their exact words are their approval of that change. Still check length, facts and pronunciation, and tell them if there's a problem. Apply to `storyboard.json`, re-render the kichban file with a `--history` line, regenerate that scene's voice, re-render. |
| Words you would have to write | "câu mở đầu chưa hay", "thêm một câu giải thích" | Propose the wording in chat, at most two options, and wait for their pick. Then handle it like exact new words. New facts need research and a fact-check first. |
| Story change | add or remove a scene, change the situation or the ending | Back to Steps 3–4: update `storyboard.json` and the kichban file, get re-approval, then rebuild. Tell them this costs a new round. |

- Batch every change from one message into a single re-render, named with the next `-<n>`.
- Log each round with `/career-log <slug>` (stage, number of renders).
- Open the new video and say what changed. If a request is unclear, ask about that one point and do the rest meanwhile.

## Step 7 — Chốt video

When they say it's done ("ok rồi", "chốt", "được rồi"):

1. **QA.** Run `/career-qa <slug> <latest render>`. Fix any blocking problems, re-render and re-open the video. Turn the 👤 items into a short checklist for them: watch the whole video on a phone, listen to the voice, check that the volume is even.
2. **Hand over the file.** When everything passes and they've confirmed the checklist, show the file in Explorer so they can upload it themselves:

   ```bash
   node scripts/kichban.mjs open --reveal videos/<slug>/renders/<file>.mp4
   ```

3. **Never upload or publish.** Never run `npx hyperframes publish`, `cloud`, `lambda` or `feedback`.
4. **After they post it.** When they say it's posted, `/career-qa` step 4 marks it published, and `/career-log` records the links. When they share views and comments later, `/career-log` records those too.
