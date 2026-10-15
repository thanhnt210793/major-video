---
name: career-qa
description: Pre-publish gate for a rendered Career POV video — strict storyboard validation, a fresh independent fact-check, whole-video render QA, and the plan's §9 publish checklist. Use after every render that might be published, and before telling the user a video is ready.
argument-hint: <slug> <path/to/render.mp4>
---

# Career POV — QA and publish gate (pipeline step 8, plan §9)

Arguments: $ARGUMENTS

## 1. Content gate

```bash
node scripts/validate-storyboard.mjs content/<slug>/storyboard.json --strict
```

`--strict` turns scenes that cite `unverified` research into errors. This must pass.

## 2. Independent checks — launch in parallel

- `render-qa` agent: the MP4 plus `content/<slug>/storyboard.json`. It writes `content/<slug>/qa/<render-stem>/qa-report.md` and contact sheets.
- `fact-checker` agent: a fresh run on the storyboard, because sources can change or disappear between script approval and publishing.

Also confirm that the last `build-audio-meta.mjs` run for this render had no unresolved `MISMATCH` lines (re-run it if unsure).

## 3. Publish checklist

Write `content/<slug>/qa/<render-stem>/publish-checklist.md` covering every item in `ai-career-pov-2d-pipeline.md` §9. Each item is one of:
- ✅ verified by Claude, with evidence (a command output, a frame file, or a fact-check row)
- ❌ failing, with the fix
- 👤 needs a human: watching the full video on a phone, TTS pronunciation, music/narration balance, SFX timing, overall feel, and whether the video could be mistaken for real footage

Never mark a 👤 item as ✅.

## 4. Verdict

- Report blocking failures first, then the 👤 list for the user.
- "Ready to publish" requires zero ❌ and the user's confirmation of the 👤 items.
- When the user confirms they have published, set `"status": "published"` in `storyboard.json` and record the platform URLs with `/career-log <slug>`.
- The source, manifests, assets and final render must all stay in the repo (plan §5 step 8). Don't delete intermediate renders without asking.
