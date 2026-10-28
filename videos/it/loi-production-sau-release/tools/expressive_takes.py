"""Livelier narration: for each scene, generate several VieNeu takes at a higher sampling
temperature and keep the most expressive one (largest pitch movement, in semitones), so the
narrator sounds less flat. Writes <out>/NN.wav (NN = 1-based scene order) plus takes-log.json.

Run with the project TTS venv from the repo root:
  .venv-tts/Scripts/python -I videos/it/loi-production-sau-release/tools/expressive_takes.py \
      content/it/loi-production-sau-release/storyboard.json content/it/loi-production-sau-release/audio/tts-raw \
      --voice "Hải Đăng" --takes 5 --temperature 1.0 --scene hook --scene escalate ...
"""

import argparse
import json
import sys
import wave
from pathlib import Path

import numpy as np

sys.stdout.reconfigure(encoding="utf-8")


def read_wav(path):
    with wave.open(str(path)) as w:
        sr, n, ch, sw = w.getframerate(), w.getnframes(), w.getnchannels(), w.getsampwidth()
        raw = w.readframes(n)
    a = np.frombuffer(raw, dtype={2: np.int16, 4: np.int32}[sw]).astype(np.float32)
    if ch > 1:
        a = a.reshape(-1, ch).mean(axis=1)
    return a / (np.abs(a).max() or 1.0), sr


def pitch_track(a, sr, lo=70, hi=320):
    """Rough F0 per 10 ms (autocorrelation on voiced, loud frames)."""
    win, hop = int(0.04 * sr), int(0.01 * sr)
    thr = 0.3 * np.sqrt(np.mean(a ** 2))
    out = []
    for s in range(0, len(a) - win, hop):
        x = a[s:s + win] * np.hanning(win)
        if np.sqrt(np.mean(x ** 2)) < thr:
            continue
        c = np.correlate(x, x, "full")[win - 1:]
        lag_lo, lag_hi = int(sr / hi), int(sr / lo)
        k = int(np.argmax(c[lag_lo:lag_hi])) + lag_lo
        if c[k] > 0.45 * c[0]:
            out.append(sr / k)
    return np.array(out)


def expressiveness(path):
    a, sr = read_wav(path)
    f0 = pitch_track(a, sr)
    if len(f0) < 20:
        return 0.0, 0.0, len(a) / sr
    st = 12 * np.log2(f0 / np.median(f0))
    st = st[np.abs(st) < 12]  # drop octave errors
    rng = float(np.percentile(st, 90) - np.percentile(st, 10))
    return float(np.std(st)), rng, len(a) / sr


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("storyboard")
    ap.add_argument("out")
    ap.add_argument("--voice", required=True)
    ap.add_argument("--takes", type=int, default=5)
    ap.add_argument("--temperature", type=float, default=1.0)
    ap.add_argument("--scene", action="append", default=[])
    ap.add_argument("--max-ratio", type=float, default=1.0, help="reject takes longer than this × scene duration")
    args = ap.parse_args()

    from vieneu import Vieneu

    doc = json.loads(Path(args.storyboard).read_text(encoding="utf-8"))
    out = Path(args.out)
    out.mkdir(parents=True, exist_ok=True)
    tmp = out / "_takes"
    tmp.mkdir(exist_ok=True)
    tts = Vieneu()
    log_path = out / "takes-log.json"
    log = json.loads(log_path.read_text(encoding="utf-8")) if log_path.exists() else {}

    for i, scene in enumerate(doc["scenes"], start=1):
        sid = scene["id"]
        if args.scene and sid not in args.scene:
            continue
        text = (scene.get("ttsNarration") or scene.get("narration") or "").strip()
        voice = scene.get("voice") or args.voice
        cands = []
        for k in range(args.takes):
            f = tmp / f"{i:02d}-t{k}.wav"
            tts.save(tts.infer(text, voice=voice, temperature=args.temperature), str(f))
            std, rng, dur = expressiveness(f)
            ok = dur <= scene["duration"] * args.max_ratio
            cands.append({"take": k, "file": f.name, "pitch_std_st": round(std, 2), "pitch_range_st": round(rng, 2), "duration_s": round(dur, 2), "fits": ok})
        pool = [c for c in cands if c["fits"]] or cands
        best = max(pool, key=lambda c: (c["pitch_std_st"] + 0.25 * c["pitch_range_st"], -c["duration_s"]))
        (out / f"{i:02d}.wav").write_bytes((tmp / best["file"]).read_bytes())
        log[f"{i:02d}"] = {"sceneId": sid, "voice": voice, "ttsText": text, "temperature": args.temperature, "chosen": best["take"], "candidates": cands}
        print(f"[{i:02d}] {sid}: take {best['take']}  pitch std {best['pitch_std_st']} st, range {best['pitch_range_st']} st, {best['duration_s']} s"
              f"  (others: {', '.join(str(c['pitch_std_st']) for c in cands if c is not best)})")
    log_path.write_text(json.dumps(log, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
