const clamp = (v: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, v));

/**
 * じかんの ブロック。おでかけ・ねる じかんは きまっているので、ブロックの かず（total）は ふえない。
 * したくが ひだりから used こ ぶん（しょうすうも あり）を つかい、のこりが あそぶ じかん。
 * かえりち: ブロックごとに、したくが つかった わりあい（0..1）。
 */
export function choreFill(total: number, used: number): number[] {
  return Array.from({ length: Math.max(0, total) }, (_, i) =>
    clamp(used - i, 0, 1),
  );
}

/** あそぶ じかんに のこった ブロック（しょうすうも あり） */
export function playLeft(total: number, used: number): number {
  return total - clamp(used, 0, total);
}

/** まるごと のこった あそぶ ブロックの かず */
export function playCount(total: number, used: number): number {
  return Math.floor(playLeft(total, used));
}
