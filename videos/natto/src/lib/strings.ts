/** ネバネバの いと・くさりの かたちを けいさんする */

export type XY = { x: number; y: number };

/**
 * ながさ length の いとを、きょり dist だけ はなれた 2てんに かけたときの たるみ。
 * あさい ほうぶつせんの ちかい（L ≒ d + 8s²/3d）から s = sqrt(3/8 · d · (L − d))。
 * ぴんと はって いれば 0。
 */
export function sagFor(dist: number, length: number): number {
  if (dist >= length) {
    return 0;
  }
  return Math.sqrt((3 / 8) * Math.max(dist, 0) * (length - dist));
}

/** のびるほど ほそく なる いとの ふとさ（かさが かわらない として √ で ほそく する） */
export function threadWidth(dist: number, rest: number, base: number): number {
  if (dist <= rest) {
    return base;
  }
  return Math.max(1, base * Math.sqrt(rest / dist));
}

/** a から b へ、まんなかが sag だけ したに たるむ いとの パス */
export function threadPath(a: XY, b: XY, sag: number): string {
  const cx = (a.x + b.x) / 2;
  const cy = (a.y + b.y) / 2 + sag * 2;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

/** よこに ならんで なみうつ たまの くさり（グルタミンさんの くさり） */
export function beadChain(
  count: number,
  start: XY,
  spacing: number,
  wave: number,
  phase: number,
): XY[] {
  const out: XY[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      x: start.x + i * spacing,
      y: start.y + Math.sin(i * 0.9 + phase) * wave,
    });
  }
  return out;
}
