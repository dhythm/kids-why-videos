export type Pt = { x: number; y: number };
/** ての いち（からだの まんなか きじゅん）と、てくびの かたむき（ど） */
export type HandPose = { x: number; y: number; rot: number };

/**
 * 2ほんの ぼう（うで・まえうで）で、かたから てまで とどく ひじの いちを もとめる。
 * bend: 1 / -1 で ひじが まがる がわを えらぶ。とどかない ときは まっすぐ のばす。
 */
export function solveElbow(
  shoulder: Pt,
  hand: Pt,
  upper: number,
  fore: number,
  bend: 1 | -1,
): Pt {
  const dx = hand.x - shoulder.x;
  const dy = hand.y - shoulder.y;
  const d = Math.hypot(dx, dy);
  if (d < 1e-6) {
    return { x: shoulder.x, y: shoulder.y + upper };
  }
  const ux = dx / d;
  const uy = dy / d;
  const reach = Math.min(d, upper + fore);
  // かたから ひじまでの、かた→て の むきに そった ながさ
  const a = (upper * upper - fore * fore + reach * reach) / (2 * reach);
  const h = Math.sqrt(Math.max(0, upper * upper - a * a));
  // ひだりまわりに 90ど まわした むき（bend=1 で y が ふえる がわ: x→y）
  const px = -uy * bend;
  const py = ux * bend;
  return {
    x: shoulder.x + ux * a + px * h,
    y: shoulder.y + uy * a + py * h,
  };
}

export function lerpPose(a: HandPose, b: HandPose, p: number): HandPose {
  return {
    x: a.x + (b.x - a.x) * p,
    y: a.y + (b.y - a.y) * p,
    rot: a.rot + (b.rot - a.rot) * p,
  };
}

/** からだの まんなか きじゅんの かたの いちと、うでの ながさ */
export const SHOULDER_L: Pt = { x: -60, y: -42 };
export const SHOULDER_R: Pt = { x: 60, y: -42 };
export const UPPER = 95;
export const FORE = 90;

/**
 * かた → ひじ → て の いちを きめる。
 * - て が とどかない ところに あっても、うでを のばさずに て を かたの ほうへ ひきもどす
 * - て を たかく あげるほど、ひじを そとがわへ なめらかに まわす
 *   （うらがえる とちゅうは ひじが てまえに くる かんじで、みじかく みえる）
 */
export function armJoints(
  shoulder: Pt,
  hand: Pt,
  upper: number,
  fore: number,
  bend: 1 | -1,
): { elbow: Pt; hand: Pt } {
  const dx = hand.x - shoulder.x;
  const dy = hand.y - shoulder.y;
  const d = Math.hypot(dx, dy);
  const max = upper + fore;
  const h = d > max ? { x: shoulder.x + (dx / d) * max, y: shoulder.y + (dy / d) * max } : hand;
  // かたより 40 うえ〜140 うえ で、ひじの がわを bend → -bend へ
  const raise = Math.min(1, Math.max(0, (shoulder.y - h.y - 40) / 100));
  const side = 1 - 2 * (raise * raise * (3 - 2 * raise)); // 1 → -1
  const full = solveElbow(shoulder, h, upper, fore, bend);
  // かた→て の せんの うえの ひじの あし（ここから よこに どれだけ でるか を side で かえる）
  const hd = Math.hypot(h.x - shoulder.x, h.y - shoulder.y);
  if (hd < 1e-6) {
    return { elbow: full, hand: h };
  }
  const ux = (h.x - shoulder.x) / hd;
  const uy = (h.y - shoulder.y) / hd;
  const a = (full.x - shoulder.x) * ux + (full.y - shoulder.y) * uy;
  const foot = { x: shoulder.x + ux * a, y: shoulder.y + uy * a };
  return {
    elbow: { x: foot.x + (full.x - foot.x) * side, y: foot.y + (full.y - foot.y) * side },
    hand: h,
  };
}
