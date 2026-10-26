# assets/2d — shared 2D library

Flat vector art in the channel palette, drawn in code. Positions are on the 1080×1920 video canvas unless a row says otherwise, so layers stack without moving them. Open [preview.html](preview.html) in a browser to see every piece and the layer recipes.

Reuse these before drawing new art: the videos stay consistent, and builds go faster.

## Using a file

- Copy what a video needs into `videos/<slug>/assets/2d/`, keeping the subfolder, and list it in `BRIEF.md` `## Assets`.
- **Static layer:** use `<img src="assets/2d/...">`.
- **Animated parts** (the ids below): inline the SVG markup in the frame HTML. Add the frame's prefix to every `id` and to every `url(#…)` that points at one, because frames share one document.
- Recolour only with `assets/style.json` palette values.
- **New reusable art:**
  1. Add it here and add a row below.
  2. Add a row to `assets/LICENSES.md`.
  3. Add it to `preview.html`.

  Art for a single career group goes in `2d/<group>/` (group ids in `content/nhom-nganh.json`).

## Layer recipes

**Office, looking at the monitor**, back to front:
1. `backgrounds/office-wall-wide.svg`, at `x = −camX × 0.55` (parallax)
2. `backgrounds/office-desk-band.svg`, at `x = −camX`
3. `devices/desktop-monitor.svg`. Screen content goes in x 68, y 258, 944×724.
4. `devices/keyboard-mouse.svg`
5. Props, e.g. `props/rubber-duck.svg` at x 838, y 1162
6. `hands/pov-hands-keyboard.svg` on its own foreground track

**Turning to a coworker:** pan `camX` from 0 to 1320. `characters/coworker-mai.svg` sits at world x 1220.

**Phone, at a study desk at night:**
1. `backgrounds/study-desk-night.svg`
2. `devices/smartphone.svg`. The screen is x 196, y 176, 688×1388, radius 74.
3. `hands/pov-hands-phone.svg`

## Catalogue

| File | Size and position | Animatable ids | Notes |
|---|---|---|---|
| `backgrounds/office-wall-wide.svg` | 2400×1920 world strip | — | Window and shelf with a plant; warm light from the top left |
| `backgrounds/office-desk-band.svg` | 2400×1920, desk from y 1150 | — | Desk top `#22344F`, edge `#2C4262` |
| `backgrounds/study-desk-night.svg` | 1080×2000, 80 px taller than the frame | — | For a slow upward drift; notebook and pencil on the desk |
| `devices/desktop-monitor.svg` | 1080×1920 layer | — | Monitor body x 50, y 240, 980×760 |
| `devices/keyboard-mouse.svg` | 1080×1920 layer | `key-<row>-<col>` (rows 0–3 × 14, `key-4-0` is the space bar) | Press a key: `scaleY` 0.85 for about 0.08 s |
| `devices/smartphone.svg` | 1080×1920 layer | — | Phone body x 170, y 150, 740×1440 |
| `hands/pov-hands-keyboard.svg` | 1080×2020 | `hand-l`, `hand-r` | Typing: small alternating `y` ±6 px. Idle: breathe ±3 px over about 3 s |
| `hands/pov-hands-phone.svg` | 1080×1920 | — | Thumbs over the phone's lower half |
| `characters/coworker-mai.svg` | 1280×1920, world x 1220–2500 | `mai-head`, `mai-eyes`, `mai-smile`, `mai-laugh` (starts hidden), `mai-thumb` (starts hidden) | Nod: rotate `mai-head` around svgOrigin 1860 820. Blink: `scaleY` on `mai-eyes` |
| `props/rubber-duck.svg` | 140×130 | `duck` | — |
| `icons/idea-bulb.svg` | 300×320 | `bulb` | Pop with the channel `pop` ease |
| `icons/arrow-curved.svg` | 120×160 | `arrow` | Draw it on with DrawSVG |
| `icons/success-tick.svg` | viewBox 24×24, shown at 130 px | `tick` | Could morph from an error mark with MorphSVG |
| `icons/career-groups/<key>.svg` | 24×24 line icons, stroke = `currentColor` | — | `edu` Giáo dục, `art` Nghệ thuật – Nhân văn, `soc` Khoa học xã hội – Báo chí, `bus` Kinh doanh – Luật, `nat` Khoa học tự nhiên – Toán, `ict` Công nghệ thông tin, `eng` Kỹ thuật – Xây dựng, `agr` Nông – Lâm – Thủy sản, Thú y, `hea` Sức khỏe & phúc lợi, `ser` Dịch vụ, `person` Người |

All pieces were extracted on 2026-10-23 from the frame generators of `videos/it/dev-local-port-bug` and `videos/tongquan/major-groups-salary-overview`, by running their original drawing functions. The extracted files match those renders.
