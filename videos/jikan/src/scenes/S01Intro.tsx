import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg, RoomBg } from "../components/Backgrounds";
import { Car, ClockChar, Door, ToyTower } from "../components/Jikan";
import { ip, pop, shake } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S01_DURATION = DURATIONS[0];

const TIME = 130; // もう いく じかん
const YADA = 200; // やだやだ！
const ASK = 320; // どこに いったの？

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  const toAsk = ip(f, [ASK - 10, ASK + 10], [0, 1]);
  const [sx] = f >= YADA ? shake(f, 7) : [0];
  const ring = f >= TIME && f < YADA ? Math.sin(f * 1.6) * 8 : 0;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toAsk}>
          <RoomBg frame={f} />
          <ToyTower x={1010} y={640} s={1.05} rot={Math.sin(f * 0.1) * 2} />
          <Car x={1230 + (f < TIME ? Math.sin(f * 0.08) * 40 : 0)} y={745} s={0.8} />
          <Door x={1680} y={600} s={1.3 * pop(f, TIME)} open={ip(f, [TIME + 20, TIME + 45], [0, 0.6])} />
          <g transform={`rotate(${ring} 1400 430)`}>
            <ClockChar x={1400} y={430} s={0.72 * pop(f, TIME - 15)} frame={f} mood="wow" />
          </g>
          <Kid
            x={640 + sx}
            y={600}
            s={1.05}
            frame={f}
            mood={f < TIME ? "smile" : f < YADA ? "wow" : "ouch"}
            armUp={f < TIME ? 0.3 + 0.2 * Math.sin(f * 0.2) : f >= YADA ? 0.5 + 0.4 * Math.sin(f * 0.6) : 0}
          />
          <Sfx text="じりりり" x={1150} y={380} start={TIME} end={YADA - 10} size={84} color="#ffffff" />
          <Sfx text="やだやだ！" x={330} y={650} start={YADA + 5} end={ASK - 10} size={96} color="#7fc8ff" />
        </g>
        <g opacity={toAsk}>
          <DotsBg color="#fff6e0" dot="#ffe8bd" />
          <ClockChar x={960} y={650 + Math.sin(f * 0.08) * 10} s={1.9 * pop(f, ASK)} frame={f} />
          <Sfx text="？" x={1560} y={420} start={ASK + 30} end={S01_DURATION} size={240} color="#ff8fa3" />
          <Sfx text="？" x={360} y={470} start={ASK + 40} end={S01_DURATION} size={170} color="#7fc8ff" rotate={10} />
        </g>
      </svg>
      <Caption text="もっと あそびたい！" start={40} end={TIME - 5} position="top" size={100} />
      <Caption text="もう いく じかん" start={TIME + 5} end={YADA - 8} position="top" size={100} />
      <Caption text="あそぶ じかんは どこ？" start={ASK + 25} end={S01_DURATION} position="top" size={100} color="#ffe14d" />
    </AbsoluteFill>
  );
};
