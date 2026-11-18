import { test } from "node:test";
import assert from "node:assert/strict";
import { brickFill, painLevel, woundColor } from "./wound.ts";

test("brickFill: なおる まえは あなが あいた まま", () => {
  assert.deepEqual(brickFill(4, 0), [0, 0, 0, 0]);
});

test("brickFill: なおりきったら ぜんぶ ふさがる", () => {
  assert.deepEqual(brickFill(5, 1), [1, 1, 1, 1, 1]);
});

test("brickFill: りょうはしから まんなかへ じゅんに ふさがる", () => {
  const half = brickFill(4, 0.5);
  assert.equal(half[0], 1);
  assert.equal(half[3], 1);
  assert.equal(half[1], 0);
  assert.equal(half[2], 0);
  const odd = brickFill(5, 0.5);
  assert.ok(odd[0] >= odd[1] && odd[1] >= odd[2], "はしの ほうが さきに うまる");
  assert.deepEqual(odd, [...odd].reverse(), "ひだりと みぎは おなじ");
});

test("brickFill: なおるほど ふえる（へらない）・はんいの そとは まるめる", () => {
  let prev = brickFill(6, 0);
  for (let h = 0.1; h <= 1.0001; h += 0.1) {
    const cur = brickFill(6, h);
    cur.forEach((v, i) => assert.ok(v >= prev[i] - 1e-9));
    prev = cur;
  }
  assert.deepEqual(brickFill(3, -1), [0, 0, 0]);
  assert.deepEqual(brickFill(3, 2), [1, 1, 1]);
  assert.deepEqual(brickFill(0, 0.5), []);
});

test("woundColor: あかい きず → ピンクの あたらしい ひふ → まわりと おなじ ひふ", () => {
  assert.equal(woundColor(0), "#e5484d");
  assert.equal(woundColor(0.6), "#ffb3a8");
  assert.equal(woundColor(1), "#ffd9b8");
});

test("painLevel: なおるほど いたみの おしらせは ちいさくなり、なおったら 0", () => {
  assert.equal(painLevel(0), 1);
  assert.equal(painLevel(1), 0);
  assert.ok(painLevel(0.3) > painLevel(0.6));
  assert.equal(painLevel(-1), 1);
  assert.equal(painLevel(3), 0);
});
