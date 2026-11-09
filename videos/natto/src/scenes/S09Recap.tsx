import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Kid, Sparkle } from "../components/Kid";
import { Arrow } from "../components/Things";
import {
  Chain,
  Chopsticks,
  NattoBowl,
  NattoKin,
  Soybean,
  StickyThread,
} from "../components/Natto";
import { beadChain } from "../lib/strings";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S09_DURATION = DURATIONS[8];

const BEAN = 20; // だいずに なっとうきん
const CHAIN = 150; // たべて くさりを つくる
const BYE = 380; // またね！

export const S09Recap: React.FC = () => {
  const f = useCurrentFrame();
  const toBye = ip(f, [BYE - 10, BYE + 10], [0, 1]);
  const chomp = f > CHAIN && f < CHAIN + 80 ? Math.abs(Math.sin(f * 0.4)) : 0;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toBye}>
          <DotsBg color="#eef8e4" dot="#dcf0c8" />
          {/* 1. だいず + なっとうきん */}
          <Soybean x={330} y={600} s={2.6 * pop(f, BEAN)} />
          <NattoKin x={330} y={420} s={0.6 * pop(f, BEAN + 25)} frame={f} mood={chomp > 0.7 ? "wow" : "smile"} />
          <Arrow x1={560} y1={560} x2={560 + 180 * pop(f, CHAIN - 10)} y2={560} />
          {/* 2. くさり */}
          <g transform="translate(0 0)">
            <Chain points={beadChain(6, { x: 830, y: 560 }, 62, 22, f * 0.08)} r={26} frame={f} faces={false} show={ip(f, [CHAIN + 10, CHAIN + 70], [0, 1])} />
          </g>
          <Arrow x1={1220} y1={560} x2={1220 + 160 * pop(f, CHAIN + 80)} y2={560} />
          {/* 3. なっとう */}
          <NattoBowl x={1620} y={680} s={0.75 * pop(f, CHAIN + 95)} foam={0.5} stir={f * 0.02} />
          {[-1, 0, 1].map((i) => (
            <StickyThread key={i} a={{ x: 1620 + i * 50, y: 660 }} b={{ x: 1650, y: 400 }} length={320} base={5} opacity={ip(f, [CHAIN + 110, CHAIN + 120], [0, 1])} />
          ))}
          <Chopsticks x={1650} y={400} s={0.6 * pop(f, CHAIN + 105)} rot={16} />
          <Sfx text="ネバネバ！" x={1620} y={250} start={CHAIN + 130} end={BYE - 5} size={90} />
        </g>
        <g opacity={toBye}>
          <DotsBg color="#fff6e0" dot="#ffe8bd" />
          <NattoBowl x={1300} y={760} s={1.0 * pop(f, BYE)} foam={0.5} stir={f * 0.03} />
          <Kid x={700} y={620} s={1.05} frame={f} armUp={ip(f, [BYE + 60, BYE + 80], [0, 1])} />
          <NattoKin x={1300} y={420} s={0.7 * pop(f, BYE + 20)} frame={f} rot={Math.sin(f * 0.1) * 10} />
          {f > BYE + 80
            ? [0, 1, 2, 3].map((i) => (
                <Sparkle key={i} x={700 + Math.cos(i * 1.6) * 330} y={420 + Math.sin(i * 1.6) * 200} s={pop(f, BYE + 80 + i * 5, 12) * (0.9 + 0.2 * Math.sin(f * 0.3 + i))} />
              ))
            : null}
        </g>
      </svg>
      <Caption text="だいず ＋ なっとうきん" start={BEAN + 10} end={CHAIN - 5} position="top" size={92} />
      <Caption text="ネバネバの しょうたい" start={CHAIN + 10} end={BYE - 10} position="top" size={92} color="#ffe14d" />
      <Caption text="またね！" start={BYE + 90} end={S09_DURATION} position="top" size={130} color="#ffe14d" />
    </AbsoluteFill>
  );
};
