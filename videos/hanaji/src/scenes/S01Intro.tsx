import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { FrontNose, SideHead } from "../components/Hanaji";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S01_DURATION = DURATIONS[0];

const DRIP = 30; // たらーり
const NAME = 175; // これは はなぢ
const ASK = 300; // どうして でるの？

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  const toAsk = ip(f, [ASK - 10, ASK + 10], [0, 1]);
  const bleed = ip(f, [DRIP, DRIP + 45], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toAsk}>
          <DotsBg color="#e3f4ff" dot="#cfe9fa" />
          <SideHead
            x={1080}
            y={640 + Math.sin(f * 0.08) * 6}
            frame={f}
            mood={f < DRIP + 15 ? "smile" : "wow"}
            bleed={bleed}
          />
          <Sfx text="たらーり" x={470} y={840} start={DRIP + 20} end={NAME - 10} size={110} color="#ff8f8f" />
          <Sfx text="！" x={1500} y={380} start={DRIP + 30} end={NAME - 10} size={220} color="#ffe14d" rotate={12} />
        </g>
        <g opacity={toAsk}>
          <DotsBg color="#fff6e0" dot="#ffe8bd" />
          <FrontNose x={960} y={610} s={2.3 * pop(f, ASK)} frame={f} bleed={1} rot={Math.sin(f * 0.08) * 4} />
          <Sfx text="？" x={1500} y={480} start={ASK + 30} end={S01_DURATION} size={240} color="#ff8fa3" />
          <Sfx text="？" x={420} y={520} start={ASK + 40} end={S01_DURATION} size={170} color="#7fc8ff" rotate={10} />
        </g>
      </svg>
      <Caption text="あれれ？" start={DRIP + 10} end={NAME - 10} position="top" size={110} />
      <Caption text="はなぢ" start={NAME + 10} end={ASK - 12} position="top" size={130} color="#ffb3b3" />
      <Caption text="どうして でるの？" start={ASK + 25} end={S01_DURATION} position="top" size={110} color="#ffe14d" />
    </AbsoluteFill>
  );
};
