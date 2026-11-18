import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Maru, SideHead, Tissue } from "../components/Hanaji";
import { Cross, Drop } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S07_DURATION = DURATIONS[6];

const UP = 20; // うえを むくのは やめよう
const FLOW = 110; // のどに ながれる
const SPIT = 240; // のまないで ぺっ

export const S07Dont: React.FC = () => {
  const f = useCurrentFrame();
  const tilt = ip(f, [UP, UP + 25], [0, 30]) + ip(f, [SPIT - 15, SPIT + 10], [0, -46]);
  const back = ip(f, [FLOW, FLOW + 75], [0, 1]) * ip(f, [SPIT - 5, SPIT + 20], [1, 0]);
  const bad = ip(f, [SPIT - 15, SPIT], [1, 0]);
  const spit = ip(f, [SPIT + 40, SPIT + 62], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DotsBg color="#eef0ff" dot="#dfe3fb" />
        <SideHead
          x={820}
          y={620}
          s={0.95}
          frame={f}
          mood={f >= SPIT + 10 ? (spit > 0 && spit < 1 ? "wow" : "smile") : f > FLOW + 30 ? "sick" : "ouch"}
          tilt={tilt}
          inside={ip(f, [UP + 15, UP + 35], [0, 1]) * ip(f, [SPIT, SPIT + 20], [1, 0.0])}
          bloodBack={back}
          bleed={f >= SPIT ? 0.8 : 0}
        />
        <Cross x={1430} y={560} s={pop(f, UP + 40) * bad * 1.5} />
        <Sfx text="うえっ" x={1430} y={860} start={FLOW + 55} end={SPIT - 15} size={120} color="#b9c4ff" />
        {/* ぺっ */}
        <Tissue x={470} y={930} s={1.5 * pop(f, SPIT + 20)} rot={-6} />
        {spit > 0 && spit < 1 ? <Drop x={640 - spit * 150} y={760 + spit * spit * 130} s={0.6} /> : null}
        {spit >= 1 ? <ellipse cx={490} cy={925} rx={34} ry={22} fill="#e5484d" /> : null}
        <Sfx text="ぺっ" x={300} y={700} start={SPIT + 45} end={S07_DURATION} size={130} color="#ffffff" />
        <Maru x={1430} y={560} s={pop(f, SPIT + 62) * 1.5} />
      </svg>
      <Caption text="うえは むかない" start={UP + 15} end={FLOW - 10} position="top" size={104} />
      <Caption text="のどに ながれる" start={FLOW + 15} end={SPIT - 15} position="top" size={104} color="#c9d1ff" />
      <Caption text="のまないで ぺっ" start={SPIT + 20} end={S07_DURATION} position="top" size={104} color="#ffe14d" />
    </AbsoluteFill>
  );
};
