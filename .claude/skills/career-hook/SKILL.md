---
name: career-hook
description: Write or rework the opening 0–4 s of a Career POV video so viewers stop scrolling — mine the story for its strongest moment, generate hook candidates across proven patterns, gate them on honesty and payoff, score them, and write the winner into scene 1 of content/<slug>/storyboard.json with runner-ups for the user. Use when /career-script writes scene 1, when the user says an opening is weak, boring or slow, or to propose new hooks for an existing video.
argument-hint: <slug>
---

# Career POV — the hook (first 0–4 s)

Slug: $ARGUMENTS. Read [hook-patterns.md](hook-patterns.md) first. It has the patterns, the hard rules, the scoring rubric and a worked example.

On TikTok and Shorts the video autoplays in the feed. The first frame and the first spoken words decide whether anyone sees the rest. A hook here is three layers that land together in the first ~2 s:
- **Frame 0 visual:** what is on screen at 0.0 s, before anything animates.
- **On-screen text:** at most ~7 words, readable in under a second. It adds context or stakes (a time, a role, "POV: …"). It never repeats the narration.
- **Spoken line:** the first sentence of scene 1's `narration`.

Together the three layers make one **promise**, a question or a tension, and a named later scene pays it off.

## 0. Read and pick the mode

Read `content/<slug>/storyboard.json` (all scenes, `learningObjective` and `research[]`) and `content/<slug>/script.md`. If a render exists, also read the hook part of its latest `content/<slug>/qa/*/qa-report.md`.

| `status` | Mode |
|---|---|
| `draft` (normally called from `/career-script` step 3) | Apply the top candidate to scene 1 and list the runner-ups. The user chooses at the script approval gate. |
| `approved` | Proposal only. Write `hook-options.md` and stop for the user's pick. A pick changes approved content: set `status` back to `draft` and run the `/career-script` step 5 reviews and step 6 approval gate again. After re-approval, scene 1 narration is regenerated with `/career-voiceover` and the video is re-rendered. |
| `published` | Proposal only, as input for the next video or for a re-upload the user decides on. Never edit the storyboard. |

## 1. Mine the story for hook material

The hook comes from the story, so scenes 2..N are written first. From them, list:
- **The most surprising or concrete moment:** an exact error, a number, an object, a time.
- **The stakes:** what goes wrong if the problem isn't solved, and for whom.
- **The twist or skill the video teaches:** usually in the analyze, result or takeaway scene.
- **The latest point where the story can start:** begin inside the problem, not before it.

Note the scene id that pays off each item.

## 2. Generate 8–10 candidates

Use at least five different patterns. Write each candidate as:
- **Pattern id** from hook-patterns.md.
- **Frame 0 visual:** one sentence, from the POV. The problem, or a sign of it, is already visible or appears by 1.0 s.
- **On-screen text:** 7 words or fewer.
- **Spoken line,** in the narrator's `mình` voice, with its syllable count (one syllable per space-separated Vietnamese word).
  - The key word or turn lands within the first ~10 syllables.
  - The line fits the scene: at most ~4.5 syllables per second of scene `duration`.
- **SFX:** one accent cue on the hook moment.
- **Promise → payoff:** the promise, and the id of the scene that pays it off.
- **Facts:** any facts the line asserts, with their `research[]` ids, or "none".

## 3. Gate, then score

1. Drop every candidate that breaks a hard rule. Note the rule it broke.
2. Score the rest with the rubric: six criteria, 0–2 each.
3. A candidate is eligible with 9/12 or more and no 0 on "Khớp & trả lời".

If fewer than three are eligible, the situation probably lacks a hook-worthy moment. Say so, and propose a story change through `/career-script` instead of forcing clickbait.

## 4. Write `content/<slug>/hook-options.md`

Write this file in Vietnamese. It contains:
- The story material from step 1.
- The top 3 candidates, each with the three layers, the score per criterion, the promise and its payoff scene, and any risks.
- The dropped candidates, one line each with the rule they broke.
- If a render exists, the current hook as built: what frame 0 shows and when the problem appears, with its score. This gives a before/after comparison.

## 5. Apply

Apply the top candidate in draft mode, or the user's pick otherwise. Update scene 1 (`scenes[0]`):
- `narration`, plus `ttsNarration` when the line has numbers or acronyms.
- `onScreenText`.
- `visual`. Start with frame 0 explicitly ("Khung đầu tiên (0,0 s): …"), then describe the hook moment and when it happens.
- `sfx` and `factIds`.
- `duration`, only if needed. Scenes must stay contiguous, and they must still add up to `durationSeconds`.

Add the top-level `hook` object. `scripts/validate-storyboard.mjs` checks it:

```json
"hook": {
  "pattern": "in-medias-res",
  "promise": "Vì sao ứng dụng không chạy dù đã tắt hết từ thứ Sáu?",
  "payoffSceneId": "find",
  "alternatives": [
    "wrong-move: Chạy lại lần nữa… chắc nó tự hết lỗi nhỉ?",
    "result-first: Chị Mai chưa nói câu nào… mà mình đã sửa xong lỗi."
  ]
}
```

Some hooks change scene 2 as well. `result-first` needs a bridge line, and `wrong-move` can absorb a "retry" scene. Update scene 2 too, and present it as a structural change at the approval gate.

## 6. Check and hand back

- The PostToolUse hook validates the storyboard after each edit. Fix any errors.
- Run `vi-script-reviewer` on the storyboard. It scores scene 1 against hook-patterns.md. If the hook asserts any fact, also run `fact-checker` on those research ids.
- In draft mode, continue with `/career-script` step 4. In the other modes, show the top 3 candidates as a table and stop for the user's pick.
