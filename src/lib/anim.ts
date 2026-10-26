import { Easing, interpolate } from "remotion";

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

/** 決定的な揺れ（シェイク） */
export function shake(frame: number, amount: number): [number, number] {
  return [
    Math.sin(frame * 2.3) * amount + Math.sin(frame * 5.1) * amount * 0.5,
    Math.cos(frame * 2.9) * amount + Math.sin(frame * 4.3) * amount * 0.5,
  ];
}
