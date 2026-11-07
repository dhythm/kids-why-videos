/**
 * 腸の ぐにゅぐにゅ（ぜんどう うんどう）の けいさん。
 * しぼる ところ（なみ）が ひだりから みぎへ すすみ、なかの うんちを おしだす。
 */

/** x の ところが どれくらい しぼられているか（0..1）。なみの まんなか waveX で 1 */
export function squeezeAt(x: number, waveX: number, width: number): number {
  const d = (x - waveX) / width;
  return Math.exp(-d * d);
}

/** なみの いち。start フレームから period フレームごとに from → to を くりかえす */
export function wavePosition(
  frame: number,
  start: number,
  period: number,
  from: number,
  to: number,
): number {
  const t = frame - start;
  if (t <= 0) {
    return from;
  }
  const k = (t % period) / period;
  return from + (to - from) * k;
}

export type PushOptions = {
  start: number;
  period: number;
  from: number;
  to: number;
  gap: number; // なみの まんなかから どれだけ まえに うんちが いるか
  maxX: number;
};

/**
 * なみに おされた うんちの いち。
 * うしろから きた なみが うんちに おいつくと、なみの gap ぶん まえへ おしだす（もどらない）。
 */
export function pushedX(frame: number, startX: number, o: PushOptions): number {
  let x = startX;
  for (let t = o.start; t <= frame; t++) {
    const w = wavePosition(t, o.start, o.period, o.from, o.to);
    if (w < x && w + o.gap > x) {
      x = Math.min(o.maxX, w + o.gap);
    }
  }
  return x;
}
