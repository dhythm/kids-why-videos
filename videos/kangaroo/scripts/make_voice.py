"""ナレーション音声を生成し、長さを src/timeline.json に書き出す。

  ELEVENLABS_API_KEY=... python3 scripts/make_voice.py            # ElevenLabs（Eleven v4）
  python3 scripts/make_voice.py --engine say                       # macOS の say（Kyoko）
"""
import argparse, hashlib, json, os, subprocess, sys, time, urllib.error, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FPS = 30
GAP = 0.35      # 文と文のあいだ（秒）
SCENE_PAD = 0.8  # シーン末尾の余白（秒）
CACHE = ROOT / "public/voice/.cache.json"

ELEVEN_MODEL = "eleven_v4"
ELEVEN_VOICE = "fUjY9K2nAIwlALOwSiwc"  # Yui - 明るく やさしい 日本語の 女性ナレーション
ELEVEN_SETTINGS = {"stability": 0.5, "similarity_boost": 0.75, "style": 0.3, "use_speaker_boost": True}

def duration(path: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                          "-of", "csv=p=0", str(path)], capture_output=True, text=True, check=True)
    return float(out.stdout.strip())

def to_wav(src: Path, wav: Path) -> None:
    # 前後の無音を削って 48kHz の wav に
    trim = "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-af", trim, "-ar", "48000", str(wav)], check=True)
    src.unlink()

def say_tts(text: str, wav: Path) -> None:
    aiff = wav.with_suffix(".aiff")
    subprocess.run(["say", "-v", "Kyoko", "-r", "155", "-o", str(aiff), text], check=True)
    to_wav(aiff, wav)

def eleven_tts(text: str, wav: Path, key: str, prev: str | None, nxt: str | None) -> None:
    body = {"text": text, "model_id": ELEVEN_MODEL, "language_code": "ja", "voice_settings": ELEVEN_SETTINGS}
    # 前後の文を渡すと、つながりの自然な抑揚になる
    if prev: body["previous_text"] = prev
    if nxt: body["next_text"] = nxt
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVEN_VOICE}?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), method="POST",
        headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=120) as res:
                mp3 = wav.with_suffix(".mp3")
                mp3.write_bytes(res.read())
            to_wav(mp3, wav)
            return
        except urllib.error.HTTPError as e:
            detail = e.read().decode(errors="replace")[:300]
            if e.code in (429, 500, 502, 503) and attempt < 2:
                time.sleep(3 * (attempt + 1))
                continue
            sys.exit(f"ElevenLabs エラー {e.code}: {detail}")
        except urllib.error.URLError as e:
            if attempt < 2:
                time.sleep(3)
                continue
            sys.exit(f"ElevenLabs に接続できません: {e.reason}")

def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--engine", choices=["eleven", "say"], default="eleven")
    args = ap.parse_args()
    key = os.environ.get("ELEVENLABS_API_KEY", "")
    if args.engine == "eleven" and not key:
        sys.exit("ELEVENLABS_API_KEY が 未設定です")

    scenes = json.loads((ROOT / "scripts/narration.json").read_text())
    out_dir = ROOT / "public/voice"
    cache = json.loads(CACHE.read_text()) if CACHE.exists() else {}
    flat = [line.get("tts", line["say"]) for s in scenes for line in s["lines"]]
    timeline, idx = [], 0
    for scene in scenes:
        t = 0.6
        lines = []
        for i, line in enumerate(scene["lines"]):
            name = f"{scene['id']}_{i}"
            wav = out_dir / f"{name}.wav"
            text = line.get("tts", line["say"]) if args.engine == "eleven" else line["say"]
            settings = [ELEVEN_MODEL, ELEVEN_VOICE, ELEVEN_SETTINGS] if args.engine == "eleven" else ["say"]
            digest = hashlib.sha256(json.dumps([text, settings], ensure_ascii=False).encode()).hexdigest()
            if cache.get(name) != digest or not wav.exists():
                print("生成:", name, text)
                if args.engine == "eleven":
                    eleven_tts(text, wav, key, flat[idx - 1] if idx else None, flat[idx + 1] if idx + 1 < len(flat) else None)
                else:
                    say_tts(text, wav)
                cache[name] = digest
                CACHE.write_text(json.dumps(cache, indent=1))
            idx += 1
            d = duration(wav)
            lines.append({"file": f"voice/{name}.wav", "sub": line["sub"],
                          "from": round(t * FPS), "frames": round(d * FPS)})
            t += d + GAP
        timeline.append({"id": scene["id"], "frames": round((t - GAP + SCENE_PAD) * FPS), "lines": lines})
    (ROOT / "src/timeline.json").write_text(json.dumps(timeline, ensure_ascii=False, indent=1))
    for s in timeline:
        print(s["id"], round(s["frames"] / FPS, 1))
    print("合計", round(sum(s["frames"] for s in timeline) / FPS, 1), "秒")

if __name__ == "__main__":
    main()
