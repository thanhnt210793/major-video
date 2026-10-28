---
name: career-build
description: Build and render the animated video for an approved Career POV storyboard. Scaffolds the HyperFrames project in videos/<slug>, writes BRIEF.md, and runs the HyperFrames faceless-explainer workflow with this repo's content rules, 2D POV style and VieNeu narration. Use after /career-script is approved, or to resume or revise a video build.
argument-hint: <slug>
---

# Career POV — build with HyperFrames (pipeline steps 4, 5, 8)

Slug: $ARGUMENTS. The content source of truth is `content/<slug>/storyboard.json`. The HyperFrames project lives in `videos/<slug>/`.

## Preconditions — stop if any fail

- `content/<slug>/storyboard.json` has `"status": "approved"`, and `node scripts/validate-storyboard.mjs content/<slug>/storyboard.json` passes.
- `ffmpeg -version` works. If not, a terminal opened before FFmpeg was installed needs restarting.
- `npx hyperframes doctor --json` shows FFmpeg, FFprobe and Chrome as ok. The whisper-cpp entry is ok only when `HYPERFRAMES_WHISPER_PATH` is set. Docker, Kokoro and MusicGen are optional and unused here.

## 1. Scaffold (only if `videos/<slug>/hyperframes.json` is missing)

```bash
npx hyperframes init "videos/<slug>" --non-interactive --example=blank --skill=faceless-explainer
```

`init` refuses a non-empty directory, so never create `videos/<slug>/` beforehand. `HYPERFRAMES_SKIP_SKILLS=1` is set in `.claude/settings.json`: the HyperFrames skills come from the plugin, so don't run `npx hyperframes skills …` / `npx skills add`.

## 2. Write `videos/<slug>/BRIEF.md` straight after init

```markdown
---
workflow: faceless-explainer
flow: automation
storyboard: yes
message: "<storyboard.json learningObjective>"
destination: tiktok-youtube-shorts
aspect: 1080x1920
language: vi
audience: "Học sinh THCS/THPT đang tìm hiểu nghề nghiệp"
length: <durationSeconds>s
angle: narrative
narration: yes
vo_mode: verbatim
---

## Intent
POV 2D career-guidance short: the viewer is the <career> in <situation>. <one line on tone>.

## Assets
- ../../../content/<slug>/storyboard.json — approved scenes, narration, on-screen text, visuals, SFX cues. Source of truth.
- assets/<file>.svg — <shared 2D asset copied from repo assets/2d/, which scene>

## Customizations
- Narration is pre-generated with VieNeu-TTS by /career-voiceover (Vietnamese); do not run audio.mjs generate.

## Notes
- VO_MODE verbatim: SCRIPT.md frame N narration = storyboard.json scenes[N-1].narration, unchanged.
- Fictional educational simulation; add no factual claims beyond the storyboard.
```

`flow: automation` + `storyboard: yes` gives collaborative mode: the plan, the sketches and the pre-render preview all wait for the user.

## 3. Run the faceless-explainer workflow, with these project overrides

Load `/hyperframes:faceless-explainer` and follow its steps. The workflow finds `BRIEF.md` and asks no brief questions. Where this list conflicts with the workflow, this list wins.

- **Step 0.** Show `npx hyperframes auth status`. A HeyGen sign-in is optional, because narration is local. Continue offline unless the user wants HeyGen BGM/SFX.
- **Step 1.** The "user input" is the approved storyboard. Set:
  - `visible-text.txt` to the content of `content/<slug>/script.md`.
  - `user_script.txt` to each scene's `narration`, one per line, in order.
  - `tokens.json` `colors` to the hex values in `assets/style.json` `palette`, and `fonts` to `["Be Vietnam Pro"]`. While `style.json` has `"approved": false`, show the palette, its `usage` notes and the font to the user and get their OK or changes first, then set `approved: true`. Every video reuses these values.
  - Copy the needed weights from `assets/fonts/be-vietnam-pro/` into `videos/<slug>/assets/fonts/` and reference them with `@font-face`. Lint rejects a named `font-family` that has no local font file.
- **Step 3.**
  - `STORYBOARD.md` frames map 1:1 to storyboard.json scenes, in order: frame N = `scenes[N-1]`, with the same duration as the starting estimate.
  - `SCRIPT.md` narration is verbatim.
  - On-screen copy comes from `onScreenText`.
  - Do not reorder, merge or drop scenes. A structural change means going back to `/career-script` for re-approval.
- **Step 3.1.** Do **not** run `audio.mjs` generate: Kokoro has no Vietnamese voice. Run `/career-voiceover <slug>` instead. It writes `audio_meta.json` in the same contract. Skip `fetch-sfx` unless the user is signed in to HeyGen and wants catalog SFX; local SFX come from `/career-voiceover`.
- **Steps 4–5 (visual style).** Follow the 2D POV conventions in CLAUDE.md:
  - Illustrated hands in the foreground, and consistent hands, devices, palette and viewpoint across frames.
  - Subtle parallax and push-ins, with motion that serves the content.
  - **Motion language.** Apply `assets/style.json` → `motion` everywhere: eases, timing unit, stagger, intensity, transitions and rules. Write it once into the project's `## Video direction` so every frame uses the same values.
    - For judgement (what moves, what holds, restraint), use `motion-art-direction`.
    - For craft (anticipation, follow-through, arcs, timing), use `animation-principles`.
    - For the GSAP API (DrawSVG, MorphSVG, MotionPath, SplitText, CustomWiggle), use `gsap-core`, `gsap-timeline` and `gsap-plugins`, always inside HyperFrames' GSAP contract.
  - **One hero per frame.** In `STORYBOARD.md`, every frame names:
    - its hero: the one thing the eye follows;
    - its support: what helps the hero land;
    - its texture: quiet ambient life.
  - **Something changes every 5–8 s:** a push-in, a camera move, a new element, or a UI state change. A frame longer than ~8 s needs a second beat. This keeps viewers past the hook.
  - **Start from the shared art.** Check `assets/2d/README.md` and its layer recipes before drawing anything.
    - Copy what fits into `videos/<slug>/assets/2d/` and list it in BRIEF `## Assets`.
    - New reusable art goes back into `assets/2d/`, with an entry in its README, in `preview.html` and in `assets/LICENSES.md`.
    - Art for a single career group goes in `assets/2d/<group>/`.
  - **Search the registry before hand-building.** For any UI moment, run `npx hyperframes catalog --query "<English description>"`. Install what fits with `npx hyperframes add <name>`; the `hyperframes-registry` skill covers the wiring.
    - Restyle it to the palette, Be Vietnam Pro (JetBrains Mono for code) and Vietnamese text. Most items read their fonts from CSS variables such as `--font-body`; point those at the local `@font-face`. Lint rejects fonts like Inter that have no local file.
    - Matches for POV scenes, tested on 2026-10-23:
      - `chat-message`, `notification-pileup` and `press-ripple` come with their own GSAP timelines.
      - Also worth a look: `message-thread-reveal`, `code-typing`, `agent-cursor`, `success-check`, `confetti`, `hw-box-label`, `svg-line-draw-loader`, `macos-notification`.
      - `terminal-simulator` is only a static skeleton; the hand-built terminal in `videos/it/dev-local-port-bug` is richer.
    - Skip WebGL, WebGPU, 3D and shader items, because they break the flat 2D look.
    - List the items you used in BRIEF `## Assets`. Their license (Apache-2.0) is already in `assets/LICENSES.md`.
  - **Brief the frame workers.** When faceless-explainer dispatches one sub-agent per frame (Step 5), each brief includes:
    - the `motion` block from `style.json`;
    - that frame's hero, support and texture;
    - the `assets/2d` files and registry items it should use;
    - for frame 1, the hook rules below.
  - Frame 1 is the hook. Build it to "The first second on screen" in `.claude/skills/career-hook/hook-patterns.md`:
    - Frame 0 is fully composed, with no fade from black.
    - The hook moment is visible and readable on a phone by 1.0 s.
    - The on-screen text is up at 0.0–0.3 s.
    - Narration starts within ~0.2 s, with one SFX accent.

    Before the preview approval, run `npx hyperframes snapshot --at 0,0.5,1,2 --no-end --describe false` and check those four frames against scene 1's `visual`.
  - `audio.mjs sync-durations` may lengthen frames to fit the real narration. If the total leaves 30–70 s, or drifts more than ~1 s from `durationSeconds`, tighten the narration via `/career-script`. Then update the timings in storyboard.json so it matches the build.
- **Step 6 (render).** Render only after the user approves the Studio preview. Name outputs `renders/<name>-<YYYYMMDD>-<n>.mp4` (`<name>` is the slug without its group) so each QA report maps to one render. `--quality draft` is for iteration.

## 4. After the render

- Run `/career-qa <slug> videos/<slug>/renders/<file>.mp4`.
- Log the animation time and the number of renders with `/career-log <slug>`.
- Never run `npx hyperframes publish`, `cloud …`, `lambda …` or `feedback` without the user's explicit OK. They upload content or send reports to public channels.
