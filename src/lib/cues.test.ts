import { test } from "node:test";
import assert from "node:assert/strict";
import {
  bgmVolume,
  buildCues,
  findOverlaps,
  sceneStarts,
  voicedLines,
} from "./cues.ts";

test("sceneStarts: トランジションぶん かさなって はじまる", () => {
  assert.deepEqual(sceneStarts([100, 200, 300], 20), [0, 80, 260]);
});

test("buildCues: シーンの はじまり + at で ぜんたいの フレームになる", () => {
  const cues = buildCues(
    [
      { id: "a", scene: 0, at: 10, text: "" },
      { id: "b", scene: 1, at: 5, text: "" },
    ],
    { a: { duration: 1, hash: "" }, b: { duration: 2, hash: "" } },
    [100, 200],
    20,
    30,
  );
  assert.deepEqual(cues, [
    { id: "a", from: 10, frames: 30 },
    { id: "b", from: 85, frames: 60 },
  ]);
});

test("buildCues: おんせいが ないと エラー", () => {
  assert.throws(
    () =>
      buildCues([{ id: "x", scene: 0, at: 0, text: "" }], {}, [100], 20, 30),
    /x/,
  );
});

test("bgmVolume: ナレーション中は ちいさく、それいがいは もとの おおきさ", () => {
  const cues = [{ id: "a", from: 100, frames: 60 }];
  assert.equal(bgmVolume(0, cues, 0.5, 0.2), 0.5);
  assert.equal(bgmVolume(130, cues, 0.5, 0.2), 0.2);
  assert.equal(bgmVolume(300, cues, 0.5, 0.2), 0.5);
  const mid = bgmVolume(95, cues, 0.5, 0.2);
  assert.ok(mid > 0.2 && mid < 0.5);
});

test("voicedLines: おんせいが ある せりふ だけ のこす（ナレーションは あとから いれる）", () => {
  const lines = [
    { id: "a", scene: 0, at: 0, text: "" },
    { id: "b", scene: 0, at: 10, text: "" },
  ];
  assert.deepEqual(
    voicedLines(lines, { b: { duration: 1, hash: "" } }).map((l) => l.id),
    ["b"],
  );
  assert.deepEqual(voicedLines(lines, {}), []);
});

test("findOverlaps: まえの せりふが おわる まえに つぎが はじまると みつける", () => {
  const cues = [
    { id: "a", from: 0, frames: 60 },
    { id: "b", from: 70, frames: 30 },
    { id: "c", from: 105, frames: 30 },
  ];
  // あいだを 10 フレーム あけたい: a→b は 10（OK）、b→c は 5（かぶり）
  assert.deepEqual(findOverlaps(cues, 10), [{ id: "b", next: "c", gap: 5 }]);
  assert.deepEqual(findOverlaps(cues, 0), []);
});

test("findOverlaps: じゅんばんが バラバラでも はじまり順で しらべる", () => {
  const cues = [
    { id: "b", from: 50, frames: 10 },
    { id: "a", from: 0, frames: 60 },
  ];
  assert.deepEqual(findOverlaps(cues, 0), [{ id: "a", next: "b", gap: -10 }]);
});
