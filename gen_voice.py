import json, subprocess, sys
scenes = json.load(open(sys.argv[1]))
out = {}
for s in scenes:
    aiff = f"public/voice/{s['id']}.aiff"; m4a = f"public/voice/{s['id']}.mp3"
    subprocess.run(["say", "-v", "Kyoko", "-r", "155", "-o", aiff, s["say"]], check=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", aiff, "-ar", "44100", "-b:a", "160k", m4a], check=True)
    d = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", m4a], capture_output=True, text=True, check=True).stdout
    out[s["id"]] = round(float(d), 3)
    subprocess.run(["rm", aiff])
json.dump(out, open("src/durations.json", "w"), indent=1)
print(out, sum(out.values()))
