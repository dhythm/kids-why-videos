import type { NarrationLine, VoiceManifest } from "./cues.ts";

export type Overrun = { id: string; over: number };

/**
 * せりふが じぶんの シーンの なかで おわるか しらべる。
 * つぎの シーンへの きりかえ（transition フレーム）に かかる せりふを、はみだした フレーム数と いっしょに かえす。
 */
export function linesOverrunningScene(
  lines: NarrationLine[],
  manifest: VoiceManifest,
  durations: number[],
  fps: number,
  transition: number,
): Overrun[] {
  const out: Overrun[] = [];
  for (const l of lines) {
    const m = manifest[l.id];
    if (!m) {
      continue;
    }
    const end = l.at + Math.ceil(m.duration * fps);
    const limit = durations[l.scene] - transition;
    if (end > limit) {
      out.push({ id: l.id, over: end - limit });
    }
  }
  return out;
}
