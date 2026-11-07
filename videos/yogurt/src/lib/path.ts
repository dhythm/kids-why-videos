import { getPointAtLength, getTangentAtLength } from "@remotion/paths";

type XY = { x: number; y: number };

/** パス上の点（とれない ときは はじまりの点で かわりにする） */
export function pointAt(d: string, length: number): XY {
  const p = getPointAtLength(d, length) ?? getPointAtLength(d, 0);
  return p ? { x: p.x, y: p.y } : { x: 0, y: 0 };
}

/** パス上の すすむ むき（たんいベクトル） */
export function tangentAt(d: string, length: number): XY {
  const t = getTangentAtLength(d, length);
  return t ? { x: t.x, y: t.y } : { x: 1, y: 0 };
}
