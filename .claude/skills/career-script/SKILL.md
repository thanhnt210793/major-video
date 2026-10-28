---
name: career-script
description: Start a new Career POV video — narrow the career to one concrete situation, research and fact-check it, and write the Vietnamese script plus content/<slug>/storyboard.json for human approval. Use whenever the user wants a new video, career, topic or POV scenario, before any animation work. Ends at the approval gate.
argument-hint: <career or POV scenario>
---

# Career POV — research and script (pipeline steps 1–3)

This is the entry point for every new video in this repo. Do not start HyperFrames (`/hyperframes`, `/faceless-explainer`) for a new video until this skill's approval gate is passed.

Topic: $ARGUMENTS

## 0. Set up

- Pick the career group from `content/nhom-nganh.json`. A video spanning several groups goes in `tongquan`. If none fits, ask the user before adding a group there.
- Pick a short ASCII kebab-case name for the situation, e.g. `junior-dev-production-bug`.
- The slug is `<group>/<name>`, e.g. `it/junior-dev-production-bug`, and the video lives in `content/<slug>/`.
- If the group is marked `safetySensitive`, apply the safety rules in step 2 and in CLAUDE.md from the start.
- If `content/<slug>/storyboard.json` already exists, resume: read it and `content/<slug>/script.md`, and continue from the first unfinished step.
- Otherwise copy [storyboard.template.json](storyboard.template.json) to `content/<slug>/storyboard.json`.

## 1. Narrow the topic

One career, one concrete situation that can be shown in about 45 s. If the request is broad ("nghề lập trình viên"), propose 2–3 specific situations and let the user choose. Fill `title`, `learningObjective` (one sentence), and `closingQuestion`.

## 2. Research (plan §5 step 2)

- Find authoritative sources: training institutions, professional associations, manufacturer or technical documentation, government or labour statistics, practitioner interviews. Prefer Vietnamese sources for claims about Vietnam.
- Every factual statement the video will make gets a `research[]` entry: `id` (`fact-001`…), `claim`, `sourceUrl`, `accessedAt` (YYYY-MM-DD), `status`, `confidence` (high/medium/low), `notes`.
- `status`: `verified` only if you opened the page this session and it supports the claim as worded; `simulation` for fictional story elements; `unverified` for anything else. Never invent or guess a URL.
- Safety-sensitive careers: no dangerous procedures, and nothing a viewer could read as full instructions.

## 3. Write the storyboard

Fill the seven template scenes (0–4 hook, 4–11 POV action starts, 11–19 observe the problem, 19–28 analyze/fix, 28–37 result/check, 37–42 takeaway, 42–45 question). Timings may shift, but scenes must stay contiguous and total 30–70 s.

Write scenes 2..N first, then scene 1 last with the `career-hook` skill (load it with the Skill tool). The hook is drawn from the story's strongest moment. In draft mode the skill applies its top candidate, adds the `hook` object to the storyboard, and writes the runner-ups to `content/<slug>/hook-options.md`.

Per scene:
- `narration`: one idea, natural spoken Vietnamese with correct diacritics. This text is also the caption text.
- `ttsNarration` (optional): the same words spelled for VieNeu-TTS — numbers as words ("hai mươi tư phần trăm"), acronyms the Vietnamese way ("ô e xê đê" for OECD). The voice must sound fully Vietnamese, so use `<en>…</en>` only for an English word Vietnamese speakers really say in English, and prefer a Vietnamese word. It must not change the meaning.
- `onScreenText`: short and readable on a phone. It complements the narration rather than repeating it.
- `visual`: what the viewer sees from the first-person view (hands, device, UI state, motion).
- `assets`: SVG names, reusing files from `assets/2d/` where possible.
- `sfx`: short cue names (`keyboard-typing`, `notification`…).
- `sound` (optional): the scene's sound design in plain Vietnamese for the reviewer: effects, mood, and when they hit ("tiếng tin nhắn dồn dập", "tiếng tim đập to dần"). The kichban file shows it as **Âm thanh**, and the reviewer can edit it; keep `sfx` in step with it.
- `factIds`: links to `research[]`.

The PostToolUse hook validates `storyboard.json` on every edit. You can also run `node scripts/validate-storyboard.mjs content/<slug>/storyboard.json` yourself. Fix all errors.

## 4. Write `content/<slug>/script.md` for the reviewer

This is the human-readable review copy, generated from `storyboard.json` (the JSON stays the source of truth). Write it — and the storyboard's `visual`, `format` and research `claim`/`notes` text — in Vietnamese. It contains:
1. Audience and learning objective.
2. Claims table: id, claim, source, status.
3. Scene table: time, narration, on-screen text, visual, assets, SFX, animation notes.
4. Hook: the chosen pattern, frame 0, the promise and its payoff scene, plus the two runner-ups from `hook-options.md`.
5. TTS pronunciation notes.
6. Uncertain claims to verify or remove.

## 5. Independent review

Launch the `fact-checker` and `vi-script-reviewer` agents in parallel on `content/<slug>/storyboard.json`. Apply every must-fix item. If wording changes affect a claim, re-run `fact-checker` on that claim. Copy any unresolved items into `script.md` under "Open issues".

## 6. Approval gate — stop here

Present the following:
- the path to `script.md`
- the scene table
- the hook and its two runner-ups, so the user can swap before approving
- the claims and their statuses
- the open issues

Ask the user to approve or request changes. Only after an explicit approval:
1. Set `"status": "approved"` in `storyboard.json`.
2. Add `Approved by <name> on <date>` to `script.md`.
3. Log the research and script time with `/career-log <slug>`.

Then suggest `/career-build <slug>`. Never set `approved` on your own judgment.
