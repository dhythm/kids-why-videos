/**
 * かわの ながれ（りょうは どこでも おなじ）。
 * はばが せまい ところほど、おなじ りょうで ながく すすむ = はやく ながれる。
 */

/** x = 0..width の はばを たしていった ひょう（ながれた りょう → x の ため） */
export function areaTable(
  halfWidth: (x: number) => number,
  width: number,
): number[] {
  const table = [0];
  for (let x = 1; x <= width; x++) {
    table.push(table[x - 1] + halfWidth(x));
  }
  return table;
}

/** ながれた りょう a のとき、x は どこか（にぶん たんさく） */
export function xAtArea(table: number[], a: number): number {
  const last = table.length - 1;
  if (a <= 0) {
    return 0;
  }
  if (a >= table[last]) {
    return last;
  }
  let lo = 0;
  let hi = last;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (table[mid] < a) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return hi;
}
