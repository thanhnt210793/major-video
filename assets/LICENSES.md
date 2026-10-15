# Shared asset license ledger

Every shared asset needs a row in this ledger before any video uses it. Videos copy assets from here into `videos/<slug>/assets/` and record them in `content/<slug>/audio-manifest.json` (audio) or the video's BRIEF `## Assets` (visuals).

Layout:
- `2d/` — reusable SVG: `hands/`, `devices/`, `backgrounds/`, `icons/`, `ui/` (including the loading / warning / success / error states)
- `audio/music/`, `audio/sfx/` — license-checked music beds and sound effects
- `fonts/` — local font files with Vietnamese support (HyperFrames lint requires a local `@font-face`)
- `style.json` — the channel palette, fonts and narrator voice, created on the first `/career-build` and `/career-voiceover`

| File | Type | Author / source | Source URL | License | Attribution required | Platform limits | Added |
|---|---|---|---|---|---|---|---|
| `fonts/be-vietnam-pro/BeVietnamPro-{Regular,Medium,SemiBold,Bold,ExtraBold}.ttf` | font | The Be Vietnam Pro Project Authors (via google/fonts) | https://github.com/google/fonts/tree/main/ofl/bevietnampro | SIL OFL 1.1 (`fonts/be-vietnam-pro/OFL.txt`) | No for use in videos; keep OFL.txt with redistributed font files | None | 2026-10-15 |
