import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Clock, SideHead } from "../components/Hanaji";
import { Arrow, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S06_DURATION = DURATIONS[5];

const SIT = 20; // すわって したを むく
const PINCH = 170; // やわらかい ところを つまむ
const WAIT = 310; // くちで いき・じゅっぷん

export const S06Stop: React.FC = () => {
  const f = useCurrentFrame();
  const tilt = ip(f, [SIT + 60, SIT + 90], [0, -16]);
  const pinch = ip(f, [PINCH + 40, PINCH + 65], [0, 1]);
  const arrow = pop(f, SIT + 55) * ip(f, [PINCH - 15, PINCH], [1, 0]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DotsBg color="#e9f7e4" dot="#d7efcf" />
        {/* いす */}
        <rect x={980} y={930} width={420} height={200} rx={40} fill="#c98f5a" stroke="#2b2b4a" strokeWidth={8} />
        <rect x={1300} y={640} width={110} height={460} rx={40} fill="#c98f5a" stroke="#2b2b4a" strokeWidth={8} />
        <SideHead
          x={1020}
          y={560}
          s={0.92}
          frame={f}
          mood={f >= WAIT ? "breathe" : f > PINCH + 60 ? "smile" : "ouch"}
          tilt={tilt}
          bleed={1}
          pinch={pinch}
        />
        <Arrow x1={520} y1={430} x2={520 - 40 * arrow} y2={430 + 200 * arrow} color="#3a86ff" width={22} />
        <Sfx text="ぎゅっ" x={480} y={470} start={PINCH + 60} end={WAIT - 10} size={130} color="#ffffff" />
        <Pill text="やわらかい ところ" x={400} y={840} s={pop(f, PINCH + 20) * ip(f, [WAIT - 15, WAIT], [1, 0])} size={50} color="#ffe6cf" frame={f} />
        <Clock x={420} y={600} s={0.95 * pop(f, WAIT + 30)} minutes={ip(f, [WAIT + 45, WAIT + 150], [0, 10], (t) => t)} />
        <Pill text="くちで すー はー" x={390} y={910} s={pop(f, WAIT + 10)} size={50} color="#d9f0ff" frame={f} />
      </svg>
      <Caption text="すこし したを むく" start={SIT + 20} end={PINCH - 12} position="top" size={100} />
      <Caption text="ぎゅっと つまむ" start={PINCH + 20} end={WAIT - 12} position="top" size={104} color="#ffe14d" />
      <Caption text="じゅっぷん まつ" start={WAIT + 30} end={S06_DURATION} position="top" size={104} />
    </AbsoluteFill>
  );
};
