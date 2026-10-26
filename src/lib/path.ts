import { getPointAtLength } from "@remotion/paths";

type XY = { x: number; y: number };

/** パス上の点（とれない ときは はじまりの点で かわりにする） */
export function pointAt(d: string, length: number): XY {
  const p = getPointAtLength(d, length) ?? getPointAtLength(d, 0);
  return p ? { x: p.x, y: p.y } : { x: 0, y: 0 };
}
