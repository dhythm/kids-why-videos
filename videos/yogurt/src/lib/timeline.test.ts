import { test } from "node:test";
import assert from "node:assert/strict";
import { linesOverrunningScene } from "./timeline.ts";
import { DURATIONS } from "./durations.ts";
import narration from "../narration.json" with { type: "json" };
import manifest from "../voiceover-manifest.json" with { type: "json" };

const line = (id: string, scene: number, at: number) => ({
  id,
  scene,
  at,
  text: "",
});

test("linesOverrunningScene: シーンの なかで おわる せりふは だいじょうぶ", () => {
  const out = linesOverrunningScene(
    [line("a", 0, 10)],
    { a: { duration: 1, hash: "" } },
    [100],
    30,
    20,
  );
  assert.deepEqual(out, []);
});

test("linesOverrunningScene: つぎの シーンへの きりかえに かかる せりふを みつける", () => {
  // シーン 100f、きりかえ 20f → 80f までに おわってほしい。10 + 75 = 85 で はみだす
  const out = linesOverrunningScene(
    [line("a", 0, 10), line("b", 0, 0)],
    { a: { duration: 2.5, hash: "" }, b: { duration: 1, hash: "" } },
    [100],
    30,
    20,
  );
  assert.deepEqual(out, [{ id: "a", over: 5 }]);
});

test("linesOverrunningScene: おんせいが まだ ない せりふは とばす", () => {
  const out = linesOverrunningScene([line("a", 0, 90)], {}, [100], 30, 20);
  assert.deepEqual(out, []);
});

test("いまの 台本: どの せりふも じぶんの シーンの なかで おわる", () => {
  assert.deepEqual(
    linesOverrunningScene(narration, manifest, DURATIONS, 30, 20),
    [],
  );
});
