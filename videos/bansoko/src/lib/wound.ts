import { mix } from "./color.ts";

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

export const WOUND_RED = "#e5484d";
export const NEW_SKIN = "#ffb3a8";
export const SKIN = "#ffd9b8";

/** あたらしい ひふが できあがる ころ（ここから さきは いろが なじむ だけ） */
const NEW_SKIN_AT = 0.6;

/**
 * きずの あなを ふさぐ ひふの ブロックが、どれだけ できているか（0..1 を ブロックごとに）。
 * heal: 0 = けがした ばかり、1 = なおった。りょうはしから まんなかへ じゅんに ふさがる。
 */
export function brickFill(count: number, heal: number): number[] {
  const rings = Math.ceil(count / 2);
  const h = clamp01(heal);
  return Array.from({ length: count }, (_, i) => {
    const ring = Math.min(i, count - 1 - i);
    return clamp01(h * rings - ring);
  });
}

/** きずの いろ: あか → ピンク（あたらしい ひふ）→ まわりの ひふ */
export function woundColor(heal: number): string {
  const h = clamp01(heal);
  return h <= NEW_SKIN_AT
    ? mix(WOUND_RED, NEW_SKIN, h / NEW_SKIN_AT)
    : mix(NEW_SKIN, SKIN, (h - NEW_SKIN_AT) / (1 - NEW_SKIN_AT));
}

/** いたみの おしらせの つよさ（1 = けがした ばかり、0 = なおった） */
export function painLevel(heal: number): number {
  return 1 - clamp01(heal);
}
