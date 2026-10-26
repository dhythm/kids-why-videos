"""やさしい BGM（自作の合成音）を生成する。"""
import sys, wave
from pathlib import Path
import numpy as np

SR = 44100
BPM = 104
BEAT = 60 / BPM
LENGTH = float(sys.argv[1]) if len(sys.argv) > 1 else 100.0

def pluck(freq: float, dur: float) -> np.ndarray:
    t = np.arange(int(SR * dur)) / SR
    tone = sum(np.sin(2 * np.pi * freq * k * t) / k**1.6 for k in range(1, 5))
    return tone * np.exp(-t * 5.5) * np.minimum(1, t * 200)

def note(n: int) -> float:  # MIDI番号 → Hz
    return 440 * 2 ** ((n - 69) / 12)

# C - G - Am - F のコード進行、1小節4拍
chords = [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]]
melody = [72, 74, 76, 79, 76, 74, 72, 74,  71, 72, 74, 71, 67, 69, 71, 74,
          72, 71, 69, 72, 76, 74, 72, 69,  69, 72, 77, 76, 74, 72, 74, 72]

out = np.zeros(int(SR * (LENGTH + 2)))
def add(sig: np.ndarray, start: float, gain: float) -> None:
    i = int(start * SR)
    j = min(len(out), i + len(sig))
    if i < len(out):
        out[i:j] += sig[: j - i] * gain

t, bar = 0.0, 0
while t < LENGTH:
    ch = chords[bar % 4]
    for b in range(4):
        add(pluck(note(ch[0] - 12), BEAT * 2), t + b * BEAT, 0.22)          # ベース
        for k, n in enumerate(ch):                                          # 和音のアルペジオ
            add(pluck(note(n), BEAT), t + b * BEAT + (k + 1) * BEAT / 4, 0.09)
    for k in range(8):                                                      # メロディ（8分音符）
        add(pluck(note(melody[(bar % 4) * 8 + k]), BEAT), t + k * BEAT / 2, 0.13)
    t += BEAT * 4
    bar += 1

out = out[: int(SR * LENGTH)]
fade = int(SR * 2)
out[-fade:] *= np.linspace(1, 0, fade)
out = out / np.max(np.abs(out)) * 0.8
dst = Path(__file__).resolve().parent.parent / "public/sfx/bgm.wav"
with wave.open(str(dst), "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
print("書き出し:", dst)
