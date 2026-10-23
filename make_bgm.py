"""子ども向け動画用の BGM を合成する（鉄琴メロディ・ウクレレ風コード・ベース・シェイカー）。"""
import sys
import wave
import numpy as np

SR = 44100
BPM = 100
BEAT = 60 / BPM
EIGHTH = BEAT / 2
BAR = BEAT * 4
LENGTH = float(sys.argv[2]) if len(sys.argv) > 2 else 150.0

CHORDS = {  # MIDI ノート
    "C": [60, 64, 67, 72], "Am": [57, 60, 64, 69], "F": [57, 60, 65, 69], "G": [55, 59, 62, 67],
}
ROOTS = {"C": 36, "Am": 33, "F": 41, "G": 43}
PROG = ["C", "Am", "F", "G", "C", "Am", "F", "G"]
MELODY = [
    [76, 79, 84, 79, 76, None, 74, None], [72, None, 76, None, 81, 79, 76, None],
    [72, 77, 81, None, 79, 77, 76, None], [74, None, 79, None, 83, None, 79, None],
    [84, None, 79, 76, 79, None, 84, None], [81, 79, 76, None, 72, None, 76, None],
    [77, None, 76, None, 74, None, 72, None], [74, 76, 79, None, 83, None, 86, None],
]

n = int(SR * LENGTH)
out = np.zeros(n)
rng = np.random.default_rng(7)

def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)

def add(start, sig):
    i = int(start * SR)
    if i >= n:
        return
    sig = sig[: n - i]
    out[i : i + len(sig)] += sig

def bell(m, amp):
    t = np.arange(int(SR * 1.2)) / SR
    f = hz(m)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 4) + 0.35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 9) + 0.12 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 16)
    return amp * s * np.minimum(1, t / 0.003)

def pluck(m, amp):
    t = np.arange(int(SR * 1.0)) / SR
    f = hz(m)
    s = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (3 + 2.2 * k)) / k for k in range(1, 7))
    return amp * s * np.minimum(1, t / 0.004)

def bass(m, amp):
    t = np.arange(int(SR * BEAT * 1.8)) / SR
    f = hz(m)
    s = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 2.2)
    return amp * s * np.minimum(1, t / 0.006)

def shaker(amp):
    t = np.arange(int(SR * 0.07)) / SR
    noise = rng.standard_normal(len(t))
    noise = np.diff(noise, prepend=0)  # 高域寄りにする
    return amp * noise * np.exp(-t * 60)

bar_i = 0
start = 0.0
while start < LENGTH:
    loop = bar_i // 8
    chord = PROG[bar_i % 8]
    for beat_t, a in ((0, 0.18), (BEAT * 1.5, 0.11), (BEAT * 2, 0.16), (BEAT * 3.5, 0.11)):
        for j, m in enumerate(CHORDS[chord]):
            add(start + beat_t + j * 0.012, pluck(m, a))
    add(start, bass(ROOTS[chord], 0.42))
    add(start + BEAT * 2, bass(ROOTS[chord] + (7 if chord != "F" else -5), 0.32))
    for k in range(8):
        add(start + k * EIGHTH, shaker(0.05 if k % 2 else 0.03))
    if loop % 2 == 0 or bar_i % 8 >= 4:  # 1 ループおきにメロディを半分休ませて単調さを減らす
        for k, m in enumerate(MELODY[bar_i % 8]):
            if m is not None:
                add(start + k * EIGHTH, bell(m, 0.16))
    bar_i += 1
    start += BAR

fade = int(SR * 3)
out[-fade:] *= np.linspace(1, 0, fade)
out /= np.max(np.abs(out)) * 1.12
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((out * 32767).astype(np.int16).tobytes())
