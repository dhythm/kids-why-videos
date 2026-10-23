import React from "react";
import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import scenesData from "../scenes.json";
import durations from "./durations.json";
import { FONT } from "./parts";
import { AppleScene, Buoyancy, DaikonScene, Experiment, GroundScene, Intro, PepperScene, PotatoScene, Rule, Summary, Weight } from "./scenes";

const VOICE_DELAY = 12;
const TAIL = 30;

const SCENES: { id: keyof typeof durations; title: string; color: string; Comp: () => React.ReactElement }[] = [
  { id: "intro", title: "うかぶ？ しずむ？", color: "#1e88e5", Comp: Intro },
  { id: "weight", title: "おもさで きまるの？", color: "#8e24aa", Comp: Weight },
  { id: "buoyancy", title: "水が おしかえす力", color: "#0288d1", Comp: Buoyancy },
  { id: "rule", title: "うく・しずむの ルール", color: "#f4511e", Comp: Rule },
  { id: "apple", title: "リンゴの ひみつ", color: "#e53935", Comp: AppleScene },
  { id: "pepper", title: "ピーマンの ひみつ", color: "#43a047", Comp: PepperScene },
  { id: "potato", title: "ジャガイモの ひみつ", color: "#a1662f", Comp: PotatoScene },
  { id: "daikon", title: "大根の ひみつ", color: "#7c8a3a", Comp: DaikonScene },
  { id: "ground", title: "そだつ ばしょ", color: "#6d4c41", Comp: GroundScene },
  { id: "experiment", title: "おうちで じっけん", color: "#00897b", Comp: Experiment },
  { id: "summary", title: "まとめ", color: "#1e88e5", Comp: Summary },
];

const subs = Object.fromEntries(scenesData.map((s) => [s.id, s.sub]));

const timeline = (() => {
  let from = 0;
  return SCENES.map((s) => {
    const len = Math.ceil(durations[s.id] * 30) + VOICE_DELAY + TAIL;
    const item = { ...s, from, len };
    from += len;
    return item;
  });
})();

export const TOTAL_FRAMES = timeline.reduce((a, s) => a + s.len, 0) + 30;

function SceneShell({ title, color, sub, len, children }: { title: string; color: string; sub: string; len: number; children: React.ReactNode }) {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 8, len - 8, len], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const subIn = interpolate(frame, [VOICE_DELAY - 6, VOICE_DELAY + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fade, fontFamily: FONT }}>
      {children}
      <div style={{ position: "absolute", top: 34, left: 48, background: color, color: "#fff", fontSize: 50, fontWeight: 700, padding: "14px 40px", borderRadius: 60, boxShadow: "0 6px 0 rgba(0,0,0,0.15)" }}>
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          left: 140,
          right: 140,
          bottom: 28,
          opacity: subIn,
          background: "rgba(255,255,255,0.94)",
          border: `6px solid ${color}`,
          borderRadius: 36,
          padding: "18px 30px",
          fontSize: 50,
          fontWeight: 700,
          lineHeight: 1.45,
          textAlign: "center",
          color: "#263238",
          whiteSpace: "pre-line",
        }}
      >
        {sub}
      </div>
    </AbsoluteFill>
  );
}

// ナレーション中は BGM を下げ、シーンの切れ目では少し上げて無音のすき間をつなぐ
const voiceSpans = timeline.map((s) => [s.from + VOICE_DELAY, s.from + VOICE_DELAY + durations[s.id] * 30] as const);
const BGM_LOW = 0.2;
const BGM_HIGH = 0.5;
const DUCK_RAMP = 10;

function bgmVolume(f: number) {
  const duck = Math.max(
    0,
    ...voiceSpans.map(([a, b]) => Math.min(1, (f - (a - DUCK_RAMP)) / DUCK_RAMP, (b + DUCK_RAMP - f) / DUCK_RAMP)),
  );
  const v = BGM_HIGH - (BGM_HIGH - BGM_LOW) * Math.min(1, duck);
  const fadeIn = Math.min(1, f / 20);
  const fadeOut = Math.min(1, (TOTAL_FRAMES - f) / 60);
  return v * Math.max(0, Math.min(fadeIn, fadeOut));
}

export function FloatSink() {
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #d9f2ff 0%, #f4fbff 55%, #fff8e5 100%)" }}>
      <Audio src={staticFile("bgm.mp3")} volume={bgmVolume} />
      {timeline.map(({ id, title, color, Comp, from, len }) => (
        <Sequence key={id} from={from} durationInFrames={len} name={id}>
          <SceneShell title={title} color={color} sub={subs[id]} len={len}>
            <Comp />
          </SceneShell>
          <Sequence from={VOICE_DELAY} layout="none">
            <Audio src={staticFile(`voice/${id}.mp3`)} />
          </Sequence>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
}

// still 確認用：各シーンの開始フレーム
export const SCENE_STARTS = Object.fromEntries(timeline.map((s) => [s.id, [s.from, s.len]]));
