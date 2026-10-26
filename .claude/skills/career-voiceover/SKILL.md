---
name: career-voiceover
description: Produce the audio layer for a Career POV video — Vietnamese narration with VieNeu-TTS, a licensed music bed and SFX — and write videos/<slug>/audio_meta.json (HyperFrames contract) plus content/<slug>/audio-manifest.json. Use at faceless-explainer Step 3.1, or whenever narration, voice, music or SFX change.
argument-hint: <slug> [--scene <id>]
---

# Career POV — narration, music, SFX (pipeline steps 6–7)

Slug and options: $ARGUMENTS

## Preconditions

- The storyboard is approved, and the `vi-script-reviewer` TTS notes have been applied to the scenes' `ttsNarration`.
- `videos/<slug>/hyperframes.json` exists. If not, run `/career-build` first.
- The tools are set up (CLAUDE.md → "Machine setup"):
  - `.venv-tts/Scripts/python -c "import vieneu"` works.
  - `HYPERFRAMES_WHISPER_PATH` is set. Check with `echo $HYPERFRAMES_WHISPER_PATH`. Without it, `npx hyperframes transcribe` silently skips and `build-audio-meta.mjs` stops with an error.

## 1. Voice

- Use **preset voices only**. The VieNeu v3 model card allows commercial use of preset-voice audio, and the preset speakers consented. Never clone a voice unless the speaker has given written consent, and record that consent in the audio manifest.
- If `assets/style.json` has `voice`, reuse it so the channel keeps one narrator.
- Otherwise:
  1. Point the user to `assets/voice-samples/`. It has the same test sentence in all 25 presets; the file name is the voice id. `--list-voices` shows each voice's gender, accent (Bắc/Trung/Nam) and style.
  2. Optionally, render this video's scene 1 in their 2–3 favourites with `--scene hook --out content/<slug>/audio/voice-samples/<id>`.
  3. Save the user's pick to `assets/style.json` `voice`.

## 2. Generate narration

```bash
.venv-tts/Scripts/python scripts/tts_vieneu.py content/<slug>/storyboard.json --out videos/<slug>/assets/voice --voice "<voice>"
```

This writes `01.wav`, `02.wav`, … (scene order = frame number) and `vieneu-run.json` (SDK version, voice, exact TTS text). To regenerate a single scene, add `--scene <id>`.

## 3. Music bed and SFX

- Only use files whose license you have recorded:
  - Shared tracks live in `assets/audio/music/` and `assets/audio/sfx/`, each with a row in `assets/LICENSES.md` (source URL, license, attribution, allowed platforms).
  - For a new track, the user supplies the file and its source page. Check that the license allows TikTok and YouTube use, then add the row.
  - Never fetch audio just because it is downloadable.
- Copy music into `videos/<slug>/assets/bgm/` and SFX into `videos/<slug>/assets/sfx/`.
- SFX follow the scenes' `sfx` cues and the plain-Vietnamese `sound` description the reviewer approved (what is heard, and when). Add entries to `audio_meta.json` `sfx[]` after step 4: `{ "frame": N, "file": "assets/sfx/<f>", "offset_s": <s>, "duration_s": <s>, "volume": 0.35 }`. Keep them subtle; notification sounds go only on real events.

## 4. Build `audio_meta.json`

```bash
node scripts/build-audio-meta.mjs --storyboard content/<slug>/storyboard.json --hyperframes videos/<slug> [--bgm assets/bgm/<file> --bgm-volume 0.15]
```

- Word timings come from `npx hyperframes transcribe` (whisper.cpp, `--language vi`); caption text always comes from `narration`.
- The default model is `large-v3-turbo`, about 30 s per scene on this machine. `--model small` is faster, but it mishears Vietnamese more often (in testing it heard "tìm" as "tiêm"), which produces false MISMATCH flags.
- **MISMATCH** lines mean the audio doesn't say the script. VieNeu can add words, especially after English (issue #213). Listen to those frames and regenerate them with `--scene`.
- `voice … > storyboard …` means the narration is longer than its scene. `sync-durations` will stretch that frame. Keep the total within 30–60 s (see `/career-build`).
- Music must stay under the narration. For ducking or a voiceover carve, use `/hyperframes:hyperframes-audio` rather than just lowering the volume.

## 5. Audio manifest — `content/<slug>/audio-manifest.json`

```json
{ "items": [
  { "type": "narration", "files": "videos/<slug>/assets/voice/*.wav", "source": "VieNeu-TTS v3 Turbo, SDK <version from vieneu-run.json>, preset voice <name>", "sourceUrl": "https://github.com/pnnbao97/VieNeu-TTS", "license": "Apache-2.0 (code and weights); preset-voice output allowed for commercial use per model card", "attribution": "not required in the audio; credit the project if redistributing the model", "notes": "" },
  { "type": "music", "file": "…", "source": "…", "sourceUrl": "…", "license": "…", "attribution": "…", "notes": "platform restrictions" },
  { "type": "sfx", "file": "…", "source": "…", "sourceUrl": "…", "license": "…", "attribution": "…", "notes": "" }
] }
```

Copy the license details from `assets/LICENSES.md`; don't paraphrase them from memory.

## 6. Hand back

Report the per-frame durations and any mismatches. Tell the user what still needs their ears, because Claude can't verify these: pronunciation of names and English terms, music vs narration balance, and SFX timing. Log the number of TTS characters (VieNeu runs locally, so the cost is $0) with `/career-log <slug>`.
