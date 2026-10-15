---
name: career-log
description: Record production effort, costs and post-publish metrics for a Career POV video in content/<slug>/production-log.md (plan §8, §5 step 9, §11), or summarize lessons across videos. Use when a production stage finishes, after publishing, when the user reports views or comments, or when asked how the channel or pipeline is doing.
argument-hint: <slug> [what to record] | summary
---

# Career POV — production and metrics log

Arguments: $ARGUMENTS

Only record numbers that the user gave or that you measured from files: renders on disk, TTS characters from `vieneu-run.json`, durations from ffprobe. Never estimate views, watch time or hours. Ask instead.

## `content/<slug>/production-log.md` format

Create the file if it doesn't exist, then append rows.

```markdown
# Production log — <title>

## Effort and cost
| Date | Stage | Hours | Renders | TTS chars | Tool cost (USD) | Notes |
|---|---|---|---|---|---|---|

Stages: research · script · assets · animation · audio · render-qa · publish.
Rework: record the share of the video redone because of visual or content errors in Notes (plan §8).

## Publishing
| Platform | URL | Published (date) | Render file |
|---|---|---|---|

## Metrics
| Date | Platform | Views | Avg watch time | Completion % | Likes | Comments | Shares |
|---|---|---|---|---|---|---|---|

## Viewer questions and misunderstandings
## Lessons learned
```

## `summary` — across all `content/*/production-log.md`

After every three published videos, answer the MVP questions in plan §11. Base each answer on the logs and say where data is missing:
- Is the 2D template consistent?
- Did viewers understand the job?
- Were facts and simulation kept clearly apart?
- What is the time and cost per video, and the trend from video 1 to 3?
- Which careers do viewers ask for next?

Also recommend whether a paid tool is justified (plan §8).
