import { test } from "node:test";
import assert from "node:assert/strict";
import { airColor, bleedLevel, clockAngle, plugFill } from "./nose.ts";

test("bleedLevel: やぶれて いなければ ちは でない", () => {
  assert.equal(bleedLevel(0, 0), 0);
  assert.equal(bleedLevel(0, 1), 0);
});

test("bleedLevel: やぶれた ぶんだけ でて、ふたが できるほど へる", () => {
  assert.equal(bleedLevel(1, 0), 1);
  assert.equal(bleedLevel(1, 1), 0);
  assert.equal(bleedLevel(0.5, 0), 0.5);
  assert.ok(bleedLevel(1, 0.3) > bleedLevel(1, 0.7));
});

test("bleedLevel: はんいの そとは まるめる", () => {
  assert.equal(bleedLevel(3, -1), 1);
  assert.equal(bleedLevel(-1, 0), 0);
  assert.equal(bleedLevel(1, 5), 0);
});

test("plugFill: ふたは りょうはしから まんなかへ じゅんに できる", () => {
  assert.deepEqual(plugFill(4, 0), [0, 0, 0, 0]);
  assert.deepEqual(plugFill(4, 1), [1, 1, 1, 1]);
  assert.deepEqual(plugFill(4, 0.5), [1, 0, 0, 1]);
  const odd = plugFill(5, 0.5);
  assert.deepEqual(odd, [...odd].reverse());
  assert.ok(odd[0] >= odd[1] && odd[1] >= odd[2]);
});

test("plugFill: かたまるほど ふえる（へらない）・はんいの そとは まるめる", () => {
  let prev = plugFill(6, 0);
  for (let c = 0.1; c <= 1.0001; c += 0.1) {
    const cur = plugFill(6, c);
    cur.forEach((v, i) => assert.ok(v >= prev[i] - 1e-9));
    prev = cur;
  }
  assert.deepEqual(plugFill(3, -1), [0, 0, 0]);
  assert.deepEqual(plugFill(3, 2), [1, 1, 1]);
  assert.deepEqual(plugFill(0, 0.5), []);
});

test("clockAngle: ながい はりは 60ぷんで ひとまわり", () => {
  assert.equal(clockAngle(0), 0);
  assert.equal(clockAngle(10), 60);
  assert.equal(clockAngle(15), 90);
  assert.equal(clockAngle(60), 360);
});

test("airColor: つめたい あお → あたたかい オレンジ", () => {
  assert.equal(airColor(0), "#7fc8ff");
  assert.equal(airColor(1), "#ffb347");
  assert.equal(airColor(-2), "#7fc8ff");
  assert.equal(airColor(9), "#ffb347");
});
