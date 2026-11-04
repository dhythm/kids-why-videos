import { test } from "node:test";
import assert from "node:assert/strict";
import { lerpPose, solveElbow } from "./arm.ts";

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);

test("solveElbow: ひじは かたから うでの ながさ、てから まえうでの ながさの ところ", () => {
  const s = { x: 0, y: 0 };
  const h = { x: 100, y: 0 };
  const e = solveElbow(s, h, 80, 80, 1);
  assert.ok(Math.abs(dist(s, e) - 80) < 1e-6);
  assert.ok(Math.abs(dist(e, h) - 80) < 1e-6);
});

test("solveElbow: bend の むきで ひじの まがる がわが かわる", () => {
  const s = { x: 0, y: 0 };
  const h = { x: 100, y: 0 };
  const down = solveElbow(s, h, 80, 80, 1);
  const up = solveElbow(s, h, 80, 80, -1);
  assert.ok(down.y > 0);
  assert.ok(up.y < 0);
  assert.ok(Math.abs(down.x - up.x) < 1e-6);
});

test("solveElbow: てが とおすぎる ときは まっすぐ のばす（NaN に ならない）", () => {
  const e = solveElbow({ x: 0, y: 0 }, { x: 500, y: 0 }, 80, 80, 1);
  assert.ok(Math.abs(e.x - 80) < 1e-6);
  assert.ok(Math.abs(e.y) < 1e-6);
});

test("solveElbow: てが かたと おなじ ところでも NaN に ならない", () => {
  const e = solveElbow({ x: 10, y: 10 }, { x: 10, y: 10 }, 80, 80, 1);
  assert.ok(Number.isFinite(e.x) && Number.isFinite(e.y));
});

test("lerpPose: p=0 で a、p=1 で b、まんなかは あいだ", () => {
  const a = { x: 0, y: 0, rot: 0 };
  const b = { x: 100, y: 50, rot: 90 };
  assert.deepEqual(lerpPose(a, b, 0), a);
  assert.deepEqual(lerpPose(a, b, 1), b);
  assert.deepEqual(lerpPose(a, b, 0.5), { x: 50, y: 25, rot: 45 });
});

import { armJoints, FORE, SHOULDER_L, SHOULDER_R, UPPER } from "./arm.ts";

test("armJoints: とどかない てでも、うでと まえうでの ながさは かわらない（のびない）", () => {
  const j = armJoints(SHOULDER_R, { x: 600, y: -42 }, UPPER, FORE, -1);
  assert.ok(Math.abs(dist(SHOULDER_R, j.elbow) - UPPER) < 1e-6);
  assert.ok(Math.abs(dist(j.elbow, j.hand) - FORE) < 1e-6);
  // て は かたの ほうへ ひきもどされる
  assert.ok(j.hand.x < 600);
});

test("armJoints: とどく ときは て の いちは そのまま", () => {
  const h = { x: 0, y: 0 };
  const j = armJoints(SHOULDER_L, h, UPPER, FORE, 1);
  assert.deepEqual(j.hand, h);
  assert.ok(Math.abs(dist(SHOULDER_L, j.elbow) - UPPER) < 1e-6);
});

test("armJoints: てを あげていく とちゅうで ひじが いっきに とばない（なめらか）", () => {
  let prev = armJoints(SHOULDER_L, { x: 0, y: 40 }, UPPER, FORE, 1).elbow;
  // のびきる ちょくぜん（とどく ぎりぎり）は どんな IK でも ひじが はやく うごくので のぞく
  for (let y = 39; y >= -195; y--) {
    const e = armJoints(SHOULDER_L, { x: 0, y }, UPPER, FORE, 1).elbow;
    assert.ok(dist(prev, e) < 8, `y=${y} で ひじが ${dist(prev, e).toFixed(1)} とんだ`);
    prev = e;
  }
});
