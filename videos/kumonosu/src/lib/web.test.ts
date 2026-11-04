import { test } from "node:test";
import assert from "node:assert/strict";
import {
  partialPath,
  pathLength,
  radialEnds,
  rayToPolygon,
  spiralPoints,
} from "./web.ts";

const SQUARE = [
  { x: -100, y: -100 },
  { x: 100, y: -100 },
  { x: 100, y: 100 },
  { x: -100, y: 100 },
];
const near = (a: number, b: number, eps = 1e-6) =>
  assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test("rayToPolygon: まんなかから みぎへ のばすと みぎの へんに あたる", () => {
  const p = rayToPolygon(0, SQUARE);
  near(p.x, 100);
  near(p.y, 0);
});

test("rayToPolygon: ななめ 45ど は かどに あたる", () => {
  const p = rayToPolygon(Math.PI / 4, SQUARE);
  near(p.x, 100);
  near(p.y, 100);
});

test("radialEnds: n ほんの たていとが わくの うえに ならぶ", () => {
  const ends = radialEnds(4, SQUARE);
  assert.equal(ends.length, 4);
  near(ends[0].x, 100);
  near(ends[1].y, 100);
  near(ends[2].x, -100);
  near(ends[3].y, -100);
});

test("spiralPoints: たていとの うえに のって、そとから うちへ ちいさく なる", () => {
  const ends = radialEnds(8, SQUARE);
  const pts = spiralPoints(ends, 0.9, 0.2, 3);
  assert.equal(pts.length, 8 * 3 + 1);
  for (let i = 0; i < pts.length; i++) {
    const e = ends[i % 8];
    // たていとの せんの うえ（まんなか → e の せん）
    const cross = pts[i].x * e.y - pts[i].y * e.x;
    near(cross, 0, 1e-6);
  }
  const r = (p: { x: number; y: number }) => Math.hypot(p.x, p.y);
  for (let i = 8; i < pts.length; i++) {
    assert.ok(r(pts[i]) < r(pts[i - 8]), `i=${i} が ちいさく なっていない`);
  }
});

test("pathLength: せんの ながさを たす", () => {
  near(
    pathLength([
      { x: 0, y: 0 },
      { x: 3, y: 4 },
      { x: 3, y: 10 },
    ]),
    11,
  );
});

test("partialPath: とちゅうまで かく（はんぶん なら まんなかで とまる）", () => {
  const pts = [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 10 },
  ];
  assert.deepEqual(partialPath(pts, 0), [{ x: 0, y: 0 }]);
  assert.deepEqual(partialPath(pts, 0.25), [
    { x: 0, y: 0 },
    { x: 5, y: 0 },
  ]);
  assert.deepEqual(partialPath(pts, 0.75), [
    { x: 0, y: 0 },
    { x: 10, y: 0 },
    { x: 10, y: 5 },
  ]);
  assert.deepEqual(partialPath(pts, 1), pts);
  assert.deepEqual(partialPath(pts, 2), pts);
});
