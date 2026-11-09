import { test } from "node:test";
import assert from "node:assert/strict";
import { beadChain, sagFor, threadPath, threadWidth } from "./strings.ts";

const near = (a: number, b: number, eps = 1e-6) =>
  assert.ok(Math.abs(a - b) < eps, `${a} ≒ ${b}`);

test("sagFor: いとが ぴんと はっていると たるまない", () => {
  assert.equal(sagFor(100, 100), 0);
  assert.equal(sagFor(150, 100), 0);
});

test("sagFor: いとが ながいほど ふかく たるむ", () => {
  const a = sagFor(100, 120);
  const b = sagFor(100, 160);
  assert.ok(a > 0);
  assert.ok(b > a);
  // ほうぶつせんの ちかい: sqrt(3/8 * d * (L - d))
  near(a, Math.sqrt((3 / 8) * 100 * 20));
});

test("sagFor: きょりが 0 でも こわれない", () => {
  near(sagFor(0, 80), 0);
});

test("threadWidth: のびると ほそく なる（でも 0 には ならない）", () => {
  assert.equal(threadWidth(50, 100, 10), 10); // のびて いない
  near(threadWidth(400, 100, 10), 5); // 4ばい のびると はんぶん
  assert.ok(threadWidth(1e9, 100, 10) >= 1);
});

test("threadPath: りょうはしを とおり、まんなかが たるむ 2じ ベジェ", () => {
  // まんなかが sag だけ さがるように、せいぎょてんは 2*sag
  assert.equal(
    threadPath({ x: 0, y: 0 }, { x: 100, y: 0 }, 10),
    "M 0 0 Q 50 20 100 0",
  );
});

test("beadChain: かずと まわりの かんかくが ただしい", () => {
  const beads = beadChain(5, { x: 10, y: 20 }, 30, 0, 0);
  assert.equal(beads.length, 5);
  assert.deepEqual(
    beads.map((b) => b.x),
    [10, 40, 70, 100, 130],
  );
  assert.ok(beads.every((b) => b.y === 20));
});

test("beadChain: なみの おおきさで うえしたに ゆれる", () => {
  const beads = beadChain(8, { x: 0, y: 0 }, 20, 15, 0);
  const ys = beads.map((b) => b.y);
  assert.ok(Math.max(...ys) <= 15 + 1e-9);
  assert.ok(Math.min(...ys) >= -15 - 1e-9);
  assert.ok(Math.max(...ys) - Math.min(...ys) > 10);
});
