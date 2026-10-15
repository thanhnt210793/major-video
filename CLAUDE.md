# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

A semi-automated pipeline for 30–60 s vertical Vietnamese career-guidance videos ("Career POV") for TikTok and YouTube Shorts, aimed at secondary-school students (THCS/THPT). The full plan, in Vietnamese, is [ai-career-pov-2d-pipeline.md](ai-career-pov-2d-pipeline.md). Section numbers like "§9" below refer to it.

The stack:
- **HyperFrames** (HTML/CSS/SVG + GSAP → MP4; plugin `hyperframes@claude-plugins-official`) renders the video.
- **VieNeu-TTS** (local, Python) generates the Vietnamese narration.
- **FFmpeg** is used for media probing and QA.

Remotion is deliberately not used; do not add a second render path.

## Workflow — always go through the project skills

| Step | Skill | Output |
|---|---|---|
| 1–3 Topic, research, script | `/career-script <topic>` | `content/<slug>/storyboard.json`, `script.md` → **human approval gate** |
| 4–5, 8 Build and render | `/career-build <slug>` | `videos/<slug>/` HyperFrames project, renders |
| 6–7 Narration, music, SFX | `/career-voiceover <slug>` (called from build Step 3.1) | `videos/<slug>/audio_meta.json`, `content/<slug>/audio-manifest.json` |
| 8, §9 QA and publish gate | `/career-qa <slug> <mp4>` | `content/<slug>/qa/<render>/` |
| 9, §8, §11 Effort and metrics | `/career-log <slug>` | `content/<slug>/production-log.md` |

- A new video always starts with `/career-script`, even though the HyperFrames `/hyperframes` skill describes itself as the "mandatory entry point" for any video request. Animation work begins only after `storyboard.json` has `"status": "approved"`, and only the user can grant that approval.
- `/career-build` hands off to `/hyperframes:faceless-explainer` with a pre-written `BRIEF.md` and a list of project overrides. Those overrides win over the HyperFrames workflow (1:1 scene→frame mapping, verbatim narration, VieNeu instead of `audio.mjs` generate).
- Agents in `.claude/agents/`:
  - `fact-checker` — independent source verification, read-only
  - `vi-script-reviewer` — Vietnamese language, pacing and TTS readiness, read-only
  - `render-qa` — scans the whole MP4 with ffprobe/ffmpeg

## Layout and data flow

```
content/<slug>/storyboard.json   source of truth: scenes + research (schema = §7 + status, learningObjective, closingQuestion, optional ttsNarration)
content/<slug>/…                 script.md, audio-manifest.json, production-log.md, qa/
videos/<slug>/                   HyperFrames project created by `hyperframes init` (must not exist beforehand):
                                 BRIEF.md → STORYBOARD.md/SCRIPT.md → frame.md → compositions/ → renders/
assets/                          shared library; every file has a row in assets/LICENSES.md
  style.json                     channel palette, fonts, narrator voice (confirm with the user while "approved": false)
  fonts/be-vietnam-pro/          local Vietnamese font (OFL); HyperFrames lint needs a local @font-face
  voice-samples/                 one test sentence in each of the 25 VieNeu presets, for choosing the narrator (git-ignored)
  2d/  audio/music/  audio/sfx/  reusable SVGs and license-checked audio
scripts/validate-storyboard.mjs  schema and content-rule validator (also the PostToolUse hook on any storyboard.json)
scripts/tts_vieneu.py            storyboard.json → videos/<slug>/assets/voice/NN.wav (NN = 1-based scene order = frame number)
scripts/build-audio-meta.mjs     voice WAVs + Whisper timings → videos/<slug>/audio_meta.json (faceless-explainer contract)
```

Narration flows through three fields:
- Captions use `narration`.
- TTS speaks `ttsNarration` if present (it may contain `<en>…</en>` to force English pronunciation), otherwise `narration`.
- `build-audio-meta.mjs` takes word *timings* from Whisper but keeps the *text* from `narration`. It flags any scene whose audio doesn't match the script, because VieNeu can insert words (upstream issue #213).

## Commands

```bash
node scripts/validate-storyboard.mjs content/<slug>/storyboard.json [--strict]   # --strict: citing unverified research is an error (use before publish)
.venv-tts/Scripts/python scripts/tts_vieneu.py --list-voices
.venv-tts/Scripts/python scripts/tts_vieneu.py content/<slug>/storyboard.json --out videos/<slug>/assets/voice --voice "<preset>" [--scene <id>]
node scripts/build-audio-meta.mjs --storyboard content/<slug>/storyboard.json --hyperframes videos/<slug> [--bgm assets/bgm/<f> --bgm-volume 0.15] [--model small]   # default model large-v3-turbo

# inside videos/<slug>/  (package.json pins the CLI version; prefer `npx hyperframes@<pin>` or the npm scripts)
npx hyperframes lint              # fast check while authoring
npx hyperframes check             # final gate (lint + browser, layout, motion, contrast)
npx hyperframes snapshot --at 2,10,20
npx hyperframes preview --background
npx hyperframes render --quality draft --output renders/<slug>-<date>-<n>.mp4   # only after the user approves the preview
npx hyperframes doctor --json     # environment check
```

Run the `scripts/` and `.venv-tts` commands from the repo root. Run the `npx hyperframes` commands from inside `videos/<slug>/`.

## Machine setup (done on this machine on 2026-10-15; repeat on a new one)

All of these were verified with an end-to-end test: VieNeu narration → whisper timings → `audio_meta.json`, and a 1080×1920 30 fps draft render.

| Need | How |
|---|---|
| Node 22+ | Node 24 is installed |
| FFmpeg 9.0.2 | `winget install Gyan.FFmpeg` adds it to the user PATH (restart terminals/VS Code after installing) |
| Chrome | Uses the system Chrome; `npx hyperframes browser ensure` downloads one if needed |
| uv | `winget install astral-sh.uv` |
| `.venv-tts` with VieNeu 3.8.3 | `uv venv .venv-tts --python 3.12` then `uv pip install --python .venv-tts "vieneu==3.8.3"`. It must be Python 3.12, because VieNeu's dependencies have no Windows wheels for 3.14, the machine's default Python. Keep the version pinned, because the preset voices differ between SDK versions. Models download to `~/.cache/huggingface` on first use. |
| whisper.cpp (for `transcribe`) | HyperFrames would compile it, which needs cmake and MSVC. Instead, unzip the prebuilt `whisper-bin-x64.zip` from release `b5454` at github.com/ggml-org/whisper.cpp into `~/.cache/hyperframes/whisper/bin-b5454/`, then set `HYPERFRAMES_WHISPER_PATH` to its `Release/whisper-cli.exe` in `.claude/settings.local.json` (that file is machine-specific and git-ignored). Whisper models download to `~/.cache/hyperframes/whisper/models/`. |

The HyperFrames skills come from the plugin, and `HYPERFRAMES_SKIP_SKILLS=1` is set in `.claude/settings.json`. Don't run `npx hyperframes skills …` or `npx skills add`; they install duplicate global copies. The plugin's skills are version 0.8.61, while new projects pin the CLI at 0.8.159 or later.

## Content accuracy (hard rules)

- Every factual career claim lives in `storyboard.json` `research[]` with a source URL, access date, confidence and notes.
- Each claim's `status` is `verified` (you opened the source and it supports the claim as worded), `simulation` (a fictional story element), or `unverified`. A published video must never cite an `unverified` claim.
- Never invent citations, URLs or audio sources, and never mark something verified without evidence. Use documented placeholders instead.
- Scenarios are fictional educational simulations. Don't present them as the only way the job is done, or as full professional instructions. For safety-sensitive careers, don't depict dangerous procedures.

## Style and audio conventions

- The video is 1080×1920 at 30 fps, 30–60 s (the template is 45 s with 7 scenes). Each scene carries one idea, and the hook lands within the first 1–3 s.
- The visuals are 2D vector POV:
  - Illustrated hands in the foreground, and job UI (editors, dashboards, checklists).
  - Subtle parallax, push-ins, cursor movement and typing.
  - Hands, devices, viewpoint and palette (dark navy / teal / warm off-white, pinned in `assets/style.json`) stay consistent.
  - If a scene feels busy, simplify it rather than add more motion.
- No AI-generated or photoreal footage, and no 3D.
- On-screen Vietnamese must have correct diacritics and be readable on a phone. Fonts must support Vietnamese and ship locally.
- Narration uses VieNeu **preset voices only**. Cloning a voice requires the speaker's written consent, recorded in the manifest. Music sits under the narration, and SFX match on-screen actions.
- Every music, SFX and third-party visual asset needs its license recorded in `assets/LICENSES.md` and the video's audio manifest before it's used.
- Never run `npx hyperframes publish`, `cloud`, `lambda` or `feedback` without the user's explicit OK, because they upload content or post to public channels.
