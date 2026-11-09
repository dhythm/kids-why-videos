import { test } from "node:test";
import assert from "node:assert/strict";
import { mix } from "./color.ts";

test("mix: 0 なら a、1 なら b、0.5 なら まんなか", () => {
  assert.equal(mix("#000000", "#ffffff", 0), "#000000");
  assert.equal(mix("#000000", "#ffffff", 1), "#ffffff");
  assert.equal(mix("#000000", "#ff0080", 0.5), "#800040");
});

test("mix: はんいの そとは はしに そろえる", () => {
  assert.equal(mix("#102030", "#405060", -1), "#102030");
  assert.equal(mix("#102030", "#405060", 2), "#405060");
});
