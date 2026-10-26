# Third-party skills

These skill folders are copied from public repositories, pinned to one commit, and reviewed in full before they were added. Each folder keeps its upstream `LICENSE`.

The only change from upstream is an **"In this repo (majors-video)"** note inserted under each `SKILL.md` heading. It states the project rules (HyperFrames' GSAP contract, the channel motion language in `assets/style.json`).

They are not auto-updated. To update one:
1. Diff the new upstream version against the commit below.
2. Read every changed file.
3. Re-apply the note.
4. Update the commit in this table.

| Skill folder | Upstream | Commit (date) | License |
|---|---|---|---|
| `gsap-core/`, `gsap-timeline/`, `gsap-plugins/` | https://github.com/greensock/gsap-skills (`skills/<name>/`) — official GreenSock skills | `aed9cfd3277740755f6bfc1155c7aa645403b760` (2026-04-21) | MIT |
| `animation-principles/`, `motion-art-direction/` | https://github.com/iart-ai/motion-design-skills (`skills/<name>/`) | `3c129f769d90a1328c209c386492333c9ac62312` (2026-06-22) | MIT |

Deliberately not added (reviewed 2026-10-23):
- the other GSAP skills (ScrollTrigger, React, frameworks, utils, performance), which are web-only;
- iart-ai's video packs (explainer, captions, short-form), which render with Remotion and overlap the `career-*` skills;
- freshtechbro/claudedesignskills, which is mostly 3D and scroll effects;
- dylantarre/animation-principles, 144 skills already covered by `animation-principles`.
