"""Generate per-scene Vietnamese narration with VieNeu-TTS.

Reads content/<slug>/storyboard.json and writes one WAV per narrated scene,
named by 1-based scene order (01.wav, 02.wav, ...) so it lines up with the
HyperFrames STORYBOARD.md frame numbers.

Each scene speaks `ttsNarration` when present (TTS-only spelling, <en>...</en>
tags), otherwise `narration`. Subtitles always come from `narration`.

Run with the project TTS venv (Python 3.12, see CLAUDE.md):
  .venv-tts/Scripts/python scripts/tts_vieneu.py --list-voices
  .venv-tts/Scripts/python scripts/tts_vieneu.py content/<slug>/storyboard.json \
      --out videos/<slug>/assets/voice --voice "<preset voice>" [--scene <id> ...]
"""

import argparse
import json
import sys
from datetime import datetime, timezone
from importlib.metadata import version
from pathlib import Path


def main():
    sys.stdout.reconfigure(encoding="utf-8")
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("storyboard", nargs="?", help="content/<slug>/storyboard.json")
    ap.add_argument("--out", help="output directory, normally videos/<slug>/assets/voice")
    ap.add_argument("--voice", help="preset voice name (see --list-voices)")
    ap.add_argument("--scene", action="append", default=[], help="only regenerate these scene ids (repeatable)")
    ap.add_argument("--list-voices", action="store_true", help="print the installed SDK's preset voices and exit")
    args = ap.parse_args()

    from vieneu import Vieneu

    tts = Vieneu()
    if args.list_voices:
        # [(label, voice_id)] — editors' picks first, marked ⭐; pass voice_id to --voice
        for label, voice_id in tts.list_preset_voices():
            print(f"{voice_id}\t{label}")
        return
    if not (args.storyboard and args.out and args.voice):
        ap.error("storyboard, --out and --voice are required unless --list-voices is given")

    doc = json.loads(Path(args.storyboard).read_text(encoding="utf-8"))
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    wanted = set(args.scene)

    run_log = out / "vieneu-run.json"
    log = json.loads(run_log.read_text(encoding="utf-8")) if run_log.exists() else {"scenes": {}}
    log.update(
        {
            "provider": "VieNeu-TTS",
            "sdkVersion": version("vieneu"),
            "voice": args.voice,
            "storyboard": str(Path(args.storyboard)),
            "updatedAt": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        }
    )

    for i, scene in enumerate(doc["scenes"], start=1):
        sid = scene["id"]
        if wanted and sid not in wanted:
            continue
        text = (scene.get("ttsNarration") or scene.get("narration") or "").strip()
        target = out / f"{i:02d}.wav"
        if not text:
            print(f"[{i:02d}] {sid}: no narration, skipped")
            target.unlink(missing_ok=True)
            log["scenes"].pop(f"{i:02d}", None)
            continue
        print(f"[{i:02d}] {sid}: {text}")
        audio = tts.infer(text, voice=args.voice)
        tts.save(audio, str(target))
        log["scenes"][f"{i:02d}"] = {"sceneId": sid, "ttsText": text, "file": target.name}

    run_log.write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"wrote {out} ({len(log['scenes'])} narrated scenes); log: {run_log}")


if __name__ == "__main__":
    main()
