import { test } from "node:test";
import assert from "node:assert/strict";
import { ARIGATOU, KONNICHIWA, poseAt, REST, signLength } from "./signs.ts";

test("poseAt: はじめと おわりは きをつけ（REST）", () => {
  const a = poseAt(ARIGATOU, 0);
  assert.deepEqual(a.l, REST.l);
  assert.deepEqual(a.r, REST.r);
  const z = poseAt(ARIGATOU, signLength(ARIGATOU));
  assert.deepEqual(z.l, REST.l);
});

test("poseAt: はじまる まえ・おわった あとも REST（マイナスでも こわれない）", () => {
  assert.deepEqual(poseAt(KONNICHIWA, -30).l, REST.l);
  assert.deepEqual(poseAt(KONNICHIWA, 9999).r, REST.r);
});

test("ありがとう: うえの てが したの てから うえへ あがる", () => {
  const touch = poseAt(ARIGATOU, 22);
  const lifted = poseAt(ARIGATOU, 50);
  assert.ok(lifted.l.y < touch.l.y - 50);
  // したの て（よこむき）は うごかない
  assert.equal(touch.r.y, lifted.r.y);
  assert.equal(lifted.lShape, "edge");
});

test("こんにちは: さいしょは おでこ、つぎに りょうての ひとさしゆびが おじぎ", () => {
  const hiru = poseAt(KONNICHIWA, 30);
  assert.equal(hiru.lShape, "two");
  assert.ok(hiru.l.y < -180);
  const bow = poseAt(KONNICHIWA, 85);
  assert.equal(bow.lShape, "point");
  assert.equal(bow.rShape, "point");
  // おたがいに むかって かたむく
  assert.ok(bow.l.rot > 20);
  assert.ok(bow.r.rot < -20);
});

import { chatSign, poseAt as poseAt2, shuwaSign, URESHII, waveSign } from "./signs.ts";
import { FORE, SHOULDER_L, SHOULDER_R, UPPER } from "./arm.ts";

test("どの 手話も、てが うでの とどく ところに ある", () => {
  const signs = [ARIGATOU, KONNICHIWA, URESHII, shuwaSign(200), waveSign(200), ...[0, 1, 2, 3, 4, 5, 6, 7, 8].map((s) => chatSign(400, s))];
  const reach = UPPER + FORE;
  for (const s of signs) {
    for (let t = 0; t <= s.len; t++) {
      const p = poseAt2(s, t);
      const dl = Math.hypot(p.l.x - SHOULDER_L.x, p.l.y - SHOULDER_L.y);
      const dr = Math.hypot(p.r.x - SHOULDER_R.x, p.r.y - SHOULDER_R.y);
      assert.ok(dl <= reach + 0.5, `l t=${t} ${dl.toFixed(1)}`);
      assert.ok(dr <= reach + 0.5, `r t=${t} ${dr.toFixed(1)}`);
    }
  }
});
