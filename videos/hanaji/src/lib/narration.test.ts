import { test } from "node:test";
import assert from "node:assert/strict";
import { spokenText } from "./narration.ts";

test("spokenText: tts が なければ text を よむ", () => {
  assert.equal(spokenText({ text: "またね！" }), "またね！");
});

test("spokenText: tts が あれば そちらを よむ（よみまちがい たいさく）", () => {
  assert.equal(spokenText({ text: "はなから", tts: "鼻から" }), "鼻から");
});

test("spokenText: からの tts は つかわない", () => {
  assert.equal(spokenText({ text: "はなから", tts: "  " }), "はなから");
});
