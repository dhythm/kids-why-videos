import { Easing, interpolate } from "remotion";

export const FPS = 30;
export const W = 1920;
export const H = 1080;

const clampOpts = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

/** クランプ付き interpolate（イージング指定可） */
export function ip(
  frame: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
): number {
  return interpolate(frame, input, output, { ...clampOpts, easing });
}

/** ぽよん、と出てくるスケール（0 → 1 少しオーバーシュート） */
export function pop(frame: number, start: number, duration = 18): number {
  return interpolate(frame, [start, start + duration], [0, 1], {
    ...clampOpts,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
}

/** フェードイン・アウト */
export function fadeInOut(
  frame: number,
  start: number,
  end: number,
  fade = 12,
): number {
  if (end - start <= fade * 2) {
    return 0;
  }
  return interpolate(
    frame,
    [start, start + fade, end - fade, end],
    [0, 1, 1, 0],
    clampOpts,
  );
}

/** 2次ベジェ曲線上の点と接線角度 */
export function quadBezier(
  t: number,
  p0: [number, number],
  p1: [number, number],
  p2: [number, number],
): { x: number; y: number; angle: number } {
  const u = 1 - t;
  const x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0];
  const y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1];
  const dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0]);
  const dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1]);
  return { x, y, angle: headingDeg(dx, dy) };
}

/** 進行方向ベクトル → ロケットの回転角（ロケットは上向きが 0deg） */
export function headingDeg(dx: number, dy: number): number {
  return (Math.atan2(dy, dx) * 180) / Math.PI + 90;
}

/** 決定的な揺れ（シェイク） */
export function shake(frame: number, amount: number): [number, number] {
  return [
    Math.sin(frame * 2.3) * amount + Math.sin(frame * 5.1) * amount * 0.5,
    Math.cos(frame * 2.9) * amount + Math.sin(frame * 4.3) * amount * 0.5,
  ];
}
