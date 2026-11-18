import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { NoseWall, SideHead } from "../components/Hanaji";
import { INK, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S02_DURATION = DURATIONS[1];

const TUNNEL = 20; // くうきの とおりみち
const WARM = 160; // あたためて しめらせる
const VESSEL = 330; // ちの みちが たくさん

export const S02Tunnel: React.FC = () => {
  const f = useCurrentFrame();
  const warm = ip(f, [WARM, WARM + 30], [0, 1]);
  const lens = pop(f, VESSEL + 10, 20);
  const pillsOut = ip(f, [VESSEL - 15, VESSEL], [1, 0]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DotsBg color="#eafaf4" dot="#d5f1e6" />
        <SideHead
          x={760}
          y={640}
          frame={f}
          inside={ip(f, [TUNNEL, TUNNEL + 25], [0, 1])}
          air={ip(f, [TUNNEL + 20, TUNNEL + 40], [0, 1])}
          warm={warm}
        />
        <Pill text="つめたい" x={250} y={900} s={pop(f, WARM + 5) * pillsOut} size={56} color="#cfeaff" frame={f} />
        <Pill text="あったかい" x={1330} y={520} s={pop(f, WARM + 45) * pillsOut} size={56} color="#ffe0b0" frame={f} />
        <Pill text="しっとり" x={1330} y={700} s={pop(f, WARM + 80) * pillsOut} size={56} color="#d9f0ff" frame={f} />
        {/* トンネルの かべを おおきく みる */}
        {lens > 0 ? (
          <g>
            <line
              x1={640}
              y1={632}
              x2={1060}
              y2={640}
              stroke={INK}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray="2 16"
              opacity={lens}
            />
            <circle cx={600} cy={630} r={46} fill="none" stroke={INK} strokeWidth={7} opacity={lens} />
            <NoseWall id="s02wall" x={1420} y={650} w={760} h={480} s={lens} frame={f} />
            <Pill text="ちの みち" x={1420} y={950} s={pop(f, VESSEL + 40)} size={60} color="#ffd0d0" frame={f} />
          </g>
        ) : null}
      </svg>
      <Caption text="くうきの トンネル" start={TUNNEL + 15} end={WARM - 10} position="top" size={104} />
      <Caption text="あたためる" start={WARM + 15} end={VESSEL - 12} position="top" size={110} color="#ffd9a0" />
      <Caption text="ちの みちが いっぱい" start={VESSEL + 20} end={S02_DURATION} position="top" size={96} color="#ffe14d" />
    </AbsoluteFill>
  );
};
