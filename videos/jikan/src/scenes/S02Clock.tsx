import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { ClockChar, Door } from "../components/Jikan";
import { INK, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S02_DURATION = DURATIONS[1];

const WALK = 20; // はりは すすむ
const WAIT = 130; // まって！
const FIX = 250; // いく じかんは うごかせない

const lin = (t: number): number => t;

export const S02Clock: React.FC = () => {
  const f = useCurrentFrame();
  const clockX = ip(f, [0, S02_DURATION], [520, 1360], lin);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DotsBg color="#e6f7ff" dot="#d2efff" />
        <line x1={120} y1={830} x2={1800} y2={830} stroke={INK} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 22" />
        <Door x={1660} y={640} s={1.22} />
        <Kid
          x={ip(f, [WAIT - 25, WAIT + 15], [-200, 300])}
          y={672}
          s={0.9}
          frame={f}
          mood="wow"
          armUp={f > WAIT ? 0.7 + 0.25 * Math.sin(f * 0.4) : 0}
        />
        <ClockChar x={clockX} y={645} s={1.15} frame={f} angle={f * 5} walk={1} />
        <Pill text="まって！" x={300} y={370} s={f < FIX - 10 ? pop(f, WAIT + 12) : 0} size={58} frame={f} />
        <Pill text="いく じかん" x={1660} y={370} s={pop(f, FIX + 10)} size={50} color="#fff3a8" frame={f} />
        <Sfx text="ちくたく" x={clockX + 40} y={400} start={WALK + 10} end={WAIT - 10} size={90} color="#ffffff" />
        <Sfx text="ぴたっ" x={1640} y={930} start={FIX + 50} end={S02_DURATION} size={96} />
      </svg>
      <Caption text="とけいは とまらない" start={WALK + 15} end={FIX - 12} position="top" size={100} />
      <Caption text="じかんは うごかせない" start={FIX + 20} end={S02_DURATION} position="top" size={96} color="#ffe14d" />
    </AbsoluteFill>
  );
};
