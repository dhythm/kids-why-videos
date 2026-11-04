/**
 * くものすの かたち（まんなか = 0,0）。
 * わく（たかっけい）→ まんなかから のびる たていと → そとから うちへ ぐるぐるの よこいと。
 */
export type Pt = { x: number; y: number };

/** まんなかから angle の むきに のばした せんが、わく（polygon）に あたる ところ */
export function rayToPolygon(angle: number, polygon: Pt[]): Pt {
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);
  let best = Infinity;
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    const ex = b.x - a.x;
    const ey = b.y - a.y;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-12) {
      continue;
    }
    // まんなか + t*(dx,dy) = a + u*(e)
    const t = (a.x * ey - a.y * ex) / den;
    const u = (a.x * dy - a.y * dx) / den;
    if (t > 0 && u >= -1e-9 && u <= 1 + 1e-9 && t < best) {
      best = t;
    }
  }
  if (!Number.isFinite(best)) {
    throw new Error("わくが まんなかを かこんでいません");
  }
  return { x: dx * best, y: dy * best };
}

/** n ほんの たていとの さき（みぎ から とけいまわりに ならべる） */
export function radialEnds(n: number, polygon: Pt[], offset = 0): Pt[] {
  return Array.from({ length: n }, (_, i) =>
    rayToPolygon(offset + (i / n) * Math.PI * 2, polygon),
  );
}

/**
 * よこいと: たていとの うえを そとから うちへ ぐるぐる。
 * outer / inner は たていとの ながさに たいする わりあい。
 */
export function spiralPoints(
  ends: Pt[],
  outer: number,
  inner: number,
  turns: number,
): Pt[] {
  const n = ends.length;
  const total = n * turns;
  const pts: Pt[] = [];
  for (let i = 0; i <= total; i++) {
    const k = outer + (inner - outer) * (i / total);
    const e = ends[i % n];
    pts.push({ x: e.x * k, y: e.y * k });
  }
  return pts;
}

export function pathLength(pts: Pt[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return len;
}

/** せんを とちゅう（0..1）まで かく ための てん */
export function partialPath(pts: Pt[], t: number): Pt[] {
  if (t >= 1) {
    return pts;
  }
  const target = pathLength(pts) * Math.max(0, t);
  const out: Pt[] = [pts[0]];
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (acc + seg >= target) {
      const k = seg === 0 ? 0 : (target - acc) / seg;
      if (k > 0) {
        out.push({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
      }
      return out;
    }
    acc += seg;
    out.push(b);
  }
  return out;
}

export function toPathD(pts: Pt[]): string {
  return pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");
}
