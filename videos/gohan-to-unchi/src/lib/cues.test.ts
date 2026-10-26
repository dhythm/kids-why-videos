import { test } from "node:test";
import assert from "node:assert/strict";
import { bgmVolume, buildCues, sceneStarts } from "./cues.ts";

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
