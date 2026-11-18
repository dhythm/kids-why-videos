import { test } from "node:test";
import assert from "node:assert/strict";
import { choreFill, playCount, playLeft } from "./blocks.ts";

test("choreFill: したくを していない ときは、ぜんぶ あそぶ ブロック", () => {
  assert.deepEqual(choreFill(6, 0), [0, 0, 0, 0, 0, 0]);
});

test("choreFill: したくは ひだりから じゅんに ブロックを つかう", () => {
  assert.deepEqual(choreFill(6, 3), [1, 1, 1, 0, 0, 0]);
  assert.deepEqual(choreFill(4, 1.5), [1, 0.5, 0, 0]);
});

test("choreFill: ブロックの かずより おおくは つかえない（じかんは のびない）", () => {
  assert.deepEqual(choreFill(3, 5), [1, 1, 1]);
  assert.deepEqual(choreFill(3, -2), [0, 0, 0]);
  assert.deepEqual(choreFill(0, 2), []);
});

test("playLeft: のこった ブロックが あそぶ じかん", () => {
  assert.equal(playLeft(6, 3), 3);
  assert.equal(playLeft(6, 5), 1);
  assert.equal(playLeft(6, 4.5), 1.5);
});

test("playLeft: つかいすぎても 0 より へらない・つかわなければ ぜんぶ のこる", () => {
  assert.equal(playLeft(6, 9), 0);
  assert.equal(playLeft(6, -1), 6);
});

test("playLeft: したくに つかうほど あそぶ じかんは へる（あわせると いつも ぜんぶの かず）", () => {
  let prev = playLeft(6, 0);
  for (let used = 0.5; used <= 6; used += 0.5) {
    const cur = playLeft(6, used);
    assert.ok(cur < prev);
    const chore = choreFill(6, used).reduce((a, v) => a + v, 0);
    assert.equal(chore + cur, 6);
    prev = cur;
  }
});

test("playCount: まるごと のこった ブロックの かず（かけた ブロックは かぞえない）", () => {
  assert.equal(playCount(6, 3), 3);
  assert.equal(playCount(6, 4.2), 1);
  assert.equal(playCount(6, 6), 0);
  assert.equal(playCount(6, 8), 0);
});
