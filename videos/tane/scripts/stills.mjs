// つかいかた: node scripts/stills.mjs <outDir> <CompId:frame,frame> ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition, openBrowser } from "@remotion/renderer";
import path from "node:path";

const [outDir, ...specs] = process.argv.slice(2);
if (!outDir || specs.length === 0) {
  console.error("usage: node scripts/stills.mjs <outDir> <CompId:f1,f2> ...");
  process.exit(1);
}
try {
  const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
  const browser = await openBrowser("chrome", { chromiumOptions: { gl: "angle" } });
  for (const spec of specs) {
    const [id, frames] = spec.split(":");
    const composition = await selectComposition({ serveUrl, id, puppeteerInstance: browser, timeoutInMilliseconds: 120000 });
    for (const fr of frames.split(",").map(Number)) {
      const output = path.join(outDir, `${id}_${fr}.png`);
      await renderStill({ composition, serveUrl, frame: fr, output, scale: 0.5, puppeteerInstance: browser, chromiumOptions: { gl: "angle" }, timeoutInMilliseconds: 120000 });
      console.log("ok", output);
    }
  }
  await browser.close({ silent: true });
} catch (e) {
  console.error("still render failed:", e);
  process.exit(1);
}
