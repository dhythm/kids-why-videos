import { test } from "node:test";
import assert from "node:assert/strict";
import { pushedX, squeezeAt, wavePosition } from "./peristalsis.ts";

test("squeezeAt: なみの まんなかで いちばん つよく しぼる", () => {
  assert.equal(squeezeAt(500, 500, 100), 1);
});

test("squeezeAt: なみから はなれるほど よわく、とおくでは ほぼ 0", () => {
  const near = squeezeAt(550, 500, 100);
  const far = squeezeAt(900, 500, 100);
  assert.ok(near > 0 && near < 1);
  assert.ok(far < 0.01);
  // ひだりと みぎで おなじ
  assert.equal(squeezeAt(450, 500, 100), near);
});

test("wavePosition: なみは ひだりから みぎへ すすみ、くりかえす", () => {
  // period フレームで from → to。つぎの ぶんは また from から
  assert.equal(wavePosition(0, 0, 100, -200, 1800), -200);
  assert.equal(wavePosition(50, 0, 100, -200, 1800), 800);
  assert.equal(wavePosition(100, 0, 100, -200, 1800), -200);
  assert.equal(wavePosition(150, 0, 100, -200, 1800), 800);
});

test("wavePosition: はじまる まえは from に いる", () => {
  assert.equal(wavePosition(-30, 0, 100, -200, 1800), -200);
});

test("pushedX: なみが うしろから くると、なみの すこし まえへ おされる", () => {
  // なみ: 0f から 100f で -200 → 1800（1f で 20 すすむ）
  const opts = {
    start: 0,
    period: 100,
    from: -200,
    to: 1800,
    gap: 150,
    maxX: 1600,
  };
  // まだ なみが とおくに いる（10f: なみ 0、うんち 400）→ うごかない
  assert.equal(pushedX(10, 400, opts), 400);
  // 40f: なみ 600 → うんちは 600 + 150 = 750 まで おされる
  assert.equal(pushedX(40, 400, opts), 750);
  // なみが もどっても（110f: なみ 0）うんちは もどらない
  assert.equal(pushedX(110, 400, opts), pushedX(99, 400, opts));
});

test("pushedX: maxX より さきへは いかない", () => {
  const opts = {
    start: 0,
    period: 100,
    from: -200,
    to: 1800,
    gap: 150,
    maxX: 1000,
  };
  assert.equal(pushedX(95, 400, opts), 1000);
});

test("pushedX: はじまる まえは もとの いち", () => {
  const opts = {
    start: 50,
    period: 100,
    from: -200,
    to: 1800,
    gap: 150,
    maxX: 1600,
  };
  assert.equal(pushedX(20, 400, opts), 400);
});
