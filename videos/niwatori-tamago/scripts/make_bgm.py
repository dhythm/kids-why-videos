"""こども向け BGM を numpy だけで合成する。

つかいかた: python3 scripts/make_bgm.py public/bgm.wav

曲の構成（秒）は動画のシーンに合わせている:
  0     - 42.0  たのしい（はじまり〜おなかの ちず）
  42.0  - 90.0  はずむ（きみ〜しろみ〜うすい かわ）
  90.0  - 110.0 ふしぎ・キラキラ（よるの あいだに から を つくる）
  110.0 - 144.7 たのしい（ごはん つんつん〜おしりの あなへ）
  144.7 - 152.0 げんき いっぱい（ぽんっ！ うまれた）
  152.0 - 169.3 たのしい（ふりかえり）
  169.3 - 182.0 ふしぎ・キラキラ（ぬくぬく あたためる）
  182.0 - 190.6 たのしい（ぴよっ！〜すごいね）
"""

import sys
import wave

import numpy as np

SR = 44100
BPM = 112
BEAT = 60 / BPM
BAR = BEAT * 4
TOTAL = 193.4

rng = np.random.default_rng(7)


def midi_hz(m: float) -> float:
    return 440.0 * 2 ** ((m - 69) / 12)


class Track:
    def __init__(self, seconds: float):
        self.buf = np.zeros((int(seconds * SR) + SR * 4, 2))

    def add(self, t: float, sig: np.ndarray, gain: float = 1.0, pan: float = 0.0) -> None:
        i = int(t * SR)
        if i < 0 or i >= len(self.buf):
            return
        sig = sig[: len(self.buf) - i]
        left = np.cos((pan + 1) * np.pi / 4)
        right = np.sin((pan + 1) * np.pi / 4)
        self.buf[i : i + len(sig), 0] += sig * gain * left
        self.buf[i : i + len(sig), 1] += sig * gain * right


def tvec(dur: float) -> np.ndarray:
    return np.arange(int(dur * SR)) / SR


# ---------- がっき ----------
def marimba(m: float, dur: float = 0.6) -> np.ndarray:
    t = tvec(dur + 0.4)
    f = midi_hz(m)
    env = np.exp(-t * 6)
    sig = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t * 25)
    attack = np.minimum(1, t / 0.003)
    return sig * env * attack


def bell(m: float, dur: float = 1.5) -> np.ndarray:
    t = tvec(dur + 1.0)
    f = midi_hz(m)
    env = np.exp(-t * 2.2)
    sig = (
        np.sin(2 * np.pi * f * t)
        + 0.4 * np.sin(2 * np.pi * f * 2 * t) * np.exp(-t * 3)
        + 0.2 * np.sin(2 * np.pi * f * 3.01 * t) * np.exp(-t * 6)
    )
    return sig * env * np.minimum(1, t / 0.002)


def bass(m: float, dur: float) -> np.ndarray:
    t = tvec(dur)
    f = midi_hz(m)
    env = np.exp(-t * 3) * np.minimum(1, t / 0.005) * np.minimum(1, (dur - t) / 0.03)
    sig = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * f * 2 * t)
    return np.tanh(sig * 1.5) * env


def pad(ms: list[float], dur: float, bright: float = 0.4) -> np.ndarray:
    t = tvec(dur)
    out = np.zeros_like(t)
    for m in ms:
        for det in (-0.08, 0.0, 0.08):
            f = midi_hz(m + det)
            for h in range(1, 6):
                out += (bright ** (h - 1)) / h * np.sin(2 * np.pi * f * h * t + rng.random() * 6)
    att = min(0.8, dur / 3)
    env = np.minimum(1, t / att) * np.minimum(1, (dur - t) / att)
    return out * env / (len(ms) * 3)


def lead(m: float, dur: float) -> np.ndarray:
    """げんきな シンセ（はっしゃ用）"""
    t = tvec(dur + 0.1)
    f = midi_hz(m)
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(1, t / 0.3)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    sig = sum(np.sin(ph * h) / h * (0.7 ** (h - 1)) for h in range(1, 8))
    env = np.minimum(1, t / 0.01) * np.where(t < dur, 0.8 + 0.2 * np.exp(-t * 8), np.exp(-(t - dur) * 30))
    return sig * env


def kick() -> np.ndarray:
    t = tvec(0.35)
    f = 45 + 90 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)


def snare() -> np.ndarray:
    t = tvec(0.2)
    n = rng.standard_normal(len(t))
    n = np.diff(n, prepend=0)
    return (0.6 * n + 0.5 * np.sin(2 * np.pi * 190 * t)) * np.exp(-t * 22)


def shaker() -> np.ndarray:
    t = tvec(0.07)
    n = np.diff(rng.standard_normal(len(t)), prepend=0)
    return n * np.exp(-t * 60) * np.minimum(1, t / 0.01)


def crash(dur: float = 2.5) -> np.ndarray:
    t = tvec(dur)
    n = np.diff(rng.standard_normal(len(t)), prepend=0)
    return n * np.exp(-t * 1.8)


# ---------- がくふ ----------
C5, D5, E5, F5, G5, A5, B5, C6, D6 = 72, 74, 76, 77, 79, 81, 83, 84, 86
CHORDS = [  # C G Am F（ルート, こうせいおん）
    (48, [60, 64, 67]),
    (43, [59, 62, 67]),
    (45, [60, 64, 69]),
    (41, [60, 65, 69]),
]
PHRASE_A = [
    (0, E5, 0.5), (0.5, G5, 0.5), (1, C6, 0.5), (1.5, G5, 0.5), (2, A5, 1), (3, G5, 1),
    (4, F5, 0.5), (4.5, E5, 0.5), (5, D5, 0.5), (5.5, E5, 0.5), (6, G5, 1.5),
    (8, E5, 0.5), (8.5, A5, 0.5), (9, C6, 0.5), (9.5, B5, 0.5), (10, A5, 1), (11, E5, 1),
    (12, F5, 0.5), (12.5, A5, 0.5), (13, G5, 0.5), (13.5, F5, 0.5), (14, E5, 0.5), (14.5, D5, 0.5), (15, C5, 1),
]
PHRASE_B = [
    (0, G5, 0.5), (0.5, E5, 0.5), (1, G5, 0.5), (1.5, C6, 0.5), (2, D6, 1), (3, C6, 1),
    (4, B5, 0.5), (4.5, G5, 0.5), (5, A5, 0.5), (5.5, B5, 0.5), (6, D6, 1.5),
    (8, C6, 0.5), (8.5, B5, 0.5), (9, A5, 0.5), (9.5, E5, 0.5), (10, A5, 1), (11, C6, 1),
    (12, A5, 0.5), (12.5, G5, 0.5), (13, F5, 0.5), (13.5, D5, 0.5), (14, E5, 1), (15, C5, 1.5),
]
SPACE_CHORDS = [  # Fmaj7 Em7 Dm7 Cmaj7（ふわふわ）
    (41, [65, 69, 72, 76]),
    (40, [64, 67, 71, 74]),
    (38, [62, 65, 69, 72]),
    (36, [60, 64, 67, 71]),
]


def playful(tr: Track, t0: float, t1: float, energy: float) -> None:
    bar = 0
    while t0 + bar * BAR < t1 - 0.5:
        tb = t0 + bar * BAR
        root, chord = CHORDS[bar % 4]
        phrase = PHRASE_A if (bar // 4) % 2 == 0 else PHRASE_B
        # メロディ（イントロ 2小節は なし）
        if bar >= 2:
            for b, m, d in phrase:
                if (bar % 4) * 4 <= b < (bar % 4) * 4 + 4:
                    tt = tb + (b - (bar % 4) * 4) * BEAT
                    if tt < t1:
                        tr.add(tt, marimba(m, d * BEAT), 0.22 * energy, pan=0.15)
        # ぽんぽん ベース
        for k, off in enumerate([0, 1.5, 2, 3.5]):
            tr.add(tb + off * BEAT, bass(root + (12 if k == 3 else 0), BEAT * 0.9), 0.35)
        # うしろの コード（はずむ）
        for b in (1, 3):
            for m in chord:
                tr.add(tb + b * BEAT, marimba(m - 12, 0.3), 0.07, pan=-0.3)
        tr.add(tb, pad(chord, BAR), 0.05)
        # リズム
        for e in range(8):
            tr.add(tb + e * BEAT / 2, shaker(), 0.05 if e % 2 else 0.08, pan=0.4)
        if energy > 0.8:
            for b in (0, 2):
                tr.add(tb + b * BEAT, kick(), 0.35)
            for b in (1, 3):
                tr.add(tb + b * BEAT, snare(), 0.12)
        bar += 1


def launch(tr: Track, t0: float, t1: float) -> None:
    tr.add(t0, crash(3.5), 0.18)
    tr.add(t0, kick(), 0.5)
    bar = 0
    while t0 + bar * BAR < t1 - 0.5:
        tb = t0 + bar * BAR
        root, chord = CHORDS[bar % 4]
        phrase = PHRASE_A if (bar // 4) % 2 == 0 else PHRASE_B
        for b, m, d in phrase:
            if (bar % 4) * 4 <= b < (bar % 4) * 4 + 4:
                tt = tb + (b - (bar % 4) * 4) * BEAT
                if tt < t1:
                    tr.add(tt, lead(m, d * BEAT * 0.9), 0.07, pan=0.1)
                    tr.add(tt, marimba(m, d * BEAT), 0.12, pan=-0.1)
        for e in range(8):
            tr.add(tb + e * BEAT / 2, bass(root + (12 if e % 2 else 0), BEAT * 0.45), 0.3)
            tr.add(tb + e * BEAT / 2, shaker(), 0.07, pan=0.4)
        for b in range(4):
            tr.add(tb + b * BEAT, kick(), 0.4)
        for b in (1, 3):
            tr.add(tb + b * BEAT, snare(), 0.16)
        tr.add(tb, pad(chord, BAR, bright=0.55), 0.08)
        bar += 1


def space(tr: Track, t0: float, t1: float) -> None:
    bar = 0
    while t0 + bar * BAR * 2 < t1 - 1:
        tb = t0 + bar * BAR * 2
        root, chord = SPACE_CHORDS[bar % 4]
        length = min(BAR * 2, t1 - tb)
        tr.add(tb, pad(chord, length + 0.6, bright=0.3), 0.11)
        tr.add(tb, bass(root, length * 0.9), 0.18)
        notes = chord + [c + 12 for c in chord]
        order = [0, 2, 4, 6, 7, 5, 3, 1, 2, 4, 6, 7, 5, 3, 4, 6]
        for k, idx in enumerate(order):
            tt = tb + k * BEAT / 2
            if tt < t1:
                tr.add(tt, bell(notes[idx] + 12, 1.2), 0.06, pan=(-0.5 if k % 2 else 0.5))
        bar += 1


def reverb(x: np.ndarray, seconds: float = 2.2, wet: float = 0.22) -> np.ndarray:
    t = tvec(seconds)
    out = np.zeros_like(x)
    for ch in range(2):
        ir = rng.standard_normal(len(t)) * np.exp(-t * 3.2)
        ir /= np.sqrt((ir**2).sum())
        n = len(x) + len(ir)
        size = 1 << (n - 1).bit_length()
        y = np.fft.irfft(np.fft.rfft(x[:, ch], size) * np.fft.rfft(ir, size), size)[: len(x)]
        out[:, ch] = x[:, ch] + wet * y
    return out


def main(path: str) -> None:
    tr = Track(TOTAL)
    playful(tr, 0.0, 42.0, energy=0.7)
    playful(tr, 42.0, 90.0, energy=0.9)
    space(tr, 90.0, 110.0)
    playful(tr, 110.0, 144.7, energy=0.8)
    launch(tr, 144.7, 152.0)
    playful(tr, 152.0, 169.3, energy=0.8)
    space(tr, 169.3, 182.0)
    playful(tr, 182.0, 190.6, energy=0.9)
    # さいごの じゃーん
    tr.add(190.6, pad([60, 64, 67, 72], 2.7, bright=0.5), 0.14)
    tr.add(190.6, bell(84, 2.5), 0.15)
    tr.add(190.6, bass(36, 2.5), 0.3)

    mix = reverb(tr.buf[: int(TOTAL * SR)])
    # フェードイン・アウト
    n = len(mix)
    fade_in = np.minimum(1, np.arange(n) / (SR * 1.0))
    fade_out = np.minimum(1, (n - np.arange(n)) / (SR * 2.0))
    mix *= (fade_in * fade_out)[:, None]
    mix = np.tanh(mix * 1.2)
    mix *= 0.89 / np.max(np.abs(mix))

    data = (mix * 32767).astype(np.int16)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())
    print(f"wrote {path} ({n / SR:.1f}s)")


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("usage: python3 scripts/make_bgm.py <out.wav>", file=sys.stderr)
        sys.exit(1)
    try:
        main(sys.argv[1])
    except Exception as e:  # noqa: BLE001
        print(f"BGM generation failed: {e}", file=sys.stderr)
        sys.exit(1)
