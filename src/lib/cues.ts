export type NarrationLine = {
  id: string;
  scene: number;
  at: number;
  text: string;
};
export type VoiceManifest = Record<string, { duration: number; hash: string }>;
export type Cue = { id: string; from: number; frames: number };

/** 各シーンが ぜんたいの なんフレームめから はじまるか（トランジションで かさなる） */
export function sceneStarts(durations: number[], transition: number): number[] {
  const starts: number[] = [];
  let t = 0;
  for (const d of durations) {
    starts.push(t);
    t += d - transition;
  }
  return starts;
}

/** ナレーションの せりふを ぜんたいの タイムラインに ならべる */
export function buildCues(
  lines: NarrationLine[],
  manifest: VoiceManifest,
  durations: number[],
  transition: number,
  fps: number,
): Cue[] {
  const starts = sceneStarts(durations, transition);
  return lines.map((l) => {
    const m = manifest[l.id];
    if (!m) {
      throw new Error(
        `ナレーション音声がありません: ${l.id}（scripts/generate-voiceover.ts を実行してください）`,
      );
    }
    return {
      id: l.id,
      from: starts[l.scene] + l.at,
      frames: Math.ceil(m.duration * fps),
    };
  });
}

/** ナレーション中は BGM を ちいさく（前後 10 フレームで なめらかに） */
export function bgmVolume(
  frame: number,
  cues: Cue[],
  base: number,
  ducked: number,
  ramp = 10,
): number {
  let duck = 0;
  for (const c of cues) {
    const start = c.from;
    const end = c.from + c.frames;
    let k = 0;
    if (frame >= start && frame <= end) {
      k = 1;
    } else if (frame > start - ramp && frame < start) {
      k = (frame - (start - ramp)) / ramp;
    } else if (frame > end && frame < end + ramp) {
      k = 1 - (frame - end) / ramp;
    }
    duck = Math.max(duck, k);
  }
  return base + (ducked - base) * duck;
}
