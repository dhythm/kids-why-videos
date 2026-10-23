"""ElevenLabs でナレーションを生成する。APIキーは環境変数 ELEVEN_API_KEY から読む。"""
import json, os, subprocess, sys, time, urllib.request, urllib.error

VOICE_ID = "fUjY9K2nAIwlALOwSiwc"  # Yui
MODEL_ID = "eleven_v4"

key = os.environ.get("ELEVEN_API_KEY")
if not key:
    sys.exit("ELEVEN_API_KEY が設定されていません")

scenes = json.load(open(sys.argv[1]))
only = set(sys.argv[2:])
durations = json.load(open("src/durations.json"))

def tts(text, prev_text, next_text):
    body = {"text": text, "model_id": MODEL_ID, "language_code": "ja",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75, "style": 0.3, "speed": 0.92}}
    if prev_text: body["previous_text"] = prev_text
    if next_text: body["next_text"] = next_text
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}?output_format=mp3_44100_128",
        data=json.dumps(body).encode(), headers={"xi-api-key": key, "Content-Type": "application/json"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=120) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            msg = e.read().decode(errors="replace")[:300]
            if e.code in (429, 500, 502, 503) and attempt < 2:
                time.sleep(3 * (attempt + 1)); continue
            sys.exit(f"HTTP {e.code}: {msg}")
        except urllib.error.URLError as e:
            if attempt < 2:
                time.sleep(3); continue
            sys.exit(f"通信エラー: {e}")

for i, s in enumerate(scenes):
    if only and s["id"] not in only:
        continue
    prev_t = scenes[i - 1]["say"] if i > 0 else None
    next_t = scenes[i + 1]["say"] if i + 1 < len(scenes) else None
    raw = f"public/voice/{s['id']}.raw.mp3"
    out = f"public/voice/{s['id']}.mp3"
    open(raw, "wb").write(tts(s["say"], prev_t, next_t))
    # 前後の無音を詰めて音量をそろえ、切れ目のプチノイズを防ぐため端をフェードする
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", raw, "-af",
                    "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-16:TP=-1.5,afade=t=in:d=0.03,areverse,afade=t=in:d=0.12,areverse",
                    "-ar", "44100", "-b:a", "160k", out], check=True)
    os.remove(raw)
    d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out],
                       capture_output=True, text=True, check=True).stdout
    durations[s["id"]] = round(float(d), 3)
    print(s["id"], durations[s["id"]], flush=True)

json.dump(durations, open("src/durations.json", "w"), indent=1)
print("total", round(sum(durations.values()), 2))
