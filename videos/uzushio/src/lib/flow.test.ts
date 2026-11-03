import { test } from "node:test";
import assert from "node:assert/strict";
import { areaTable, xAtArea } from "./flow.ts";

test("areaTable: はばを x ごとに たしていく", () => {
  assert.deepEqual(
    areaTable(() => 2, 3),
    [0, 2, 4, 6],
  );
});

test("xAtArea: おなじ はばなら りょうに ひれいした ところ", () => {
  const t = areaTable(() => 1, 100);
  assert.equal(xAtArea(t, 0), 0);
  assert.equal(xAtArea(t, 50), 50);
  assert.equal(xAtArea(t, 100), 100);
});

test("xAtArea: せまい ところは おなじ りょうで ながく すすむ（=はやい）", () => {
  // 0〜50 は はば 2、50〜100 は はば 1
  const t = areaTable((x) => (x <= 50 ? 2 : 1), 100);
  const wide = xAtArea(t, 40) - xAtArea(t, 20);
  const narrow = xAtArea(t, 140) - xAtArea(t, 120);
  assert.ok(narrow > wide * 1.5, `narrow=${narrow} wide=${wide}`);
});

test("xAtArea: はんいの そとは はしに そろえる", () => {
  const t = areaTable(() => 1, 10);
  assert.equal(xAtArea(t, -5), 0);
  assert.equal(xAtArea(t, 99), 10);
});
