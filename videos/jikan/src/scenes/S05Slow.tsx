import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { RoomBg } from "../components/Backgrounds";
import { blockX, Door, RiceBowl, Shirt, Shower, TimeBar, ToyTower } from "../components/Jikan";
import { INK, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S05_DURATION = DURATIONS[4];

const ROLL = 20; // きがえの とちゅうで ごろごろ
const LOOK = 150; // ごはんの とちゅうで よそみ
const ONE = 285; // たった ひとつ
const WASHED = ROLL + 34; // シャワーは さっと おわる

const BAR = { x: 420, y: 930 };
const lin = (t: number): number => t;

export const S05Slow: React.FC = () => {
  const f = useCurrentFrame();
  const used =
    ip(f, [ROLL - 10, WASHED], [0, 0.6], lin) +
    ip(f, [WASHED, LOOK], [0, 1.9], lin) +
    ip(f, [LOOK, ONE + 45], [0, 2.5], lin);
  const look = ip(f, [LOOK + 25, LOOK + 55], [0, 1]);
  const mark = BAR.x + 3 * 164 - 7; // さっきは ここまで
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <RoomBg frame={f} />
        {f < WASHED ? (
          <>
            <Shower x={990} y={610} s={1.5} frame={f} />
            <Kid x={700} y={640} s={0.9} frame={f} shirt="#c9b8f0" />
          </>
        ) : null}
        {f >= WASHED && f < LOOK ? (
          <>
            <Shirt x={1240} y={620} s={1.4 * pop(f, WASHED, 10)} rot={Math.sin(f * 0.1) * 4} color="#ffd166" />
            <Kid x={620 + Math.sin((f - WASHED) * 0.09) * 50} y={728} s={0.9} frame={f} rotate={90 + Math.sin((f - WASHED) * 0.18) * 14} shirt="#c9b8f0" />
          </>
        ) : null}
        {f >= LOOK && f < ONE ? (
          <>
            <ToyTower x={1480} y={650} s={0.95} rot={Math.sin(f * 0.3) * 5 * look} face frame={f} />
            {[0, 1, 2].map((i) => (
              <Sparkle key={i} x={1330 + i * 150} y={400 + (i % 2) * 60} s={look * (0.7 + 0.3 * Math.sin(f * 0.3 + i * 2))} />
            ))}
            <RiceBowl x={980} y={650} s={1.4} eaten={ip(f, [LOOK, ONE], [0, 0.45], lin)} />
            <line x1={790} y1={470} x2={790 + 520 * look} y2={500} stroke={INK} strokeWidth={7} strokeLinecap="round" strokeDasharray="2 18" opacity={look} />
            <Kid x={640 + look * 70} y={640} s={0.9} frame={f} mood="wow" rotate={look * 6} shirt="#ffd166" />
          </>
        ) : null}
        {f >= ONE ? (
          <>
            {f < ONE + 48 ? <RiceBowl x={980} y={650} s={1.4} eaten={ip(f, [ONE, ONE + 45], [0.45, 1], lin)} /> : null}
            <Kid x={700} y={640} s={0.9} frame={f} mood={f < ONE + 60 ? "wow" : "sad"} shirt="#ffd166" />
          </>
        ) : null}
        <Sfx text="ごろごろ" x={1240} y={400} start={WASHED + 8} end={LOOK - 10} size={104} color="#ffffff" />
        <Sfx text="ちらっ" x={1130} y={400} start={LOOK + 30} end={ONE - 10} size={110} />
        <Door x={1570} y={900} s={0.6} />
        <TimeBar x={BAR.x} y={BAR.y} used={used} frame={f} glow={ip(f, [ONE + 55, ONE + 70], [0, 1])} />
        <line x1={mark} y1={845} x2={mark} y2={1020} stroke="#3ecf8e" strokeWidth={10} strokeLinecap="round" strokeDasharray="4 20" />
        <Sfx text="ぱくっ" x={blockX(3, BAR.x)} y={790} start={214} end={256} size={74} color="#ff8fa3" />
        <Sfx text="ぱくっ" x={blockX(4, BAR.x)} y={790} start={270} end={ONE + 40} size={74} color="#ff8fa3" />
        <Pill text="たった ひとつ" x={blockX(5, BAR.x) - 40} y={790} s={pop(f, ONE + 60)} size={46} color="#fff3a8" frame={f} />
      </svg>
      <Caption text="ごろごろ…" start={WASHED + 8} end={LOOK - 10} position="top" size={110} />
      <Caption text="よそみ…" start={LOOK + 10} end={ONE - 10} position="top" size={110} />
      <Caption text="あそぶのは ひとつ だけ" start={ONE + 20} end={S05_DURATION} position="top" size={92} color="#ffe14d" />
    </AbsoluteFill>
  );
};
