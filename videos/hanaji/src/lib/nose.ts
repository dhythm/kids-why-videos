import { mix } from "./color.ts";

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

export const BLOOD = "#e5484d";
export const SCAB = "#9c4a3c";
export const MEMBRANE = "#ffb3c1";
export const COLD_AIR = "#7fc8ff";
export const WARM_AIR = "#ffb347";

/**
 * はなぢの いきおい（0..1）。
 * tear: かべの やぶれ（0 = やぶれていない、1 = やぶれた）
 * clot: ちが かたまって できた ふた（0 = まだ、1 = ふさがった）
 */
export function bleedLevel(tear: number, clot: number): number {
  return clamp01(tear) * (1 - clamp01(clot));
}

/** あなを ふさぐ ふたの かけらが、どれだけ できているか。りょうはしから まんなかへ */
export function plugFill(count: number, clot: number): number[] {
  const rings = Math.ceil(count / 2);
  const c = clamp01(clot);
  return Array.from({ length: count }, (_, i) => {
    const ring = Math.min(i, count - 1 - i);
    return clamp01(c * rings - ring);
  });
}

/** とけいの ながい はりの かくど（ど）。minutes ふん たった とき */
export function clockAngle(minutes: number): number {
  return minutes * 6;
}

/** はなを とおる くうきの いろ（warmth: 0 = つめたい、1 = あたたまった） */
export function airColor(warmth: number): string {
  return mix(COLD_AIR, WARM_AIR, warmth);
}
