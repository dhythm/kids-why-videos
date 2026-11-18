import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Finger, NoseWall } from "../components/Hanaji";
import { Kid, Sparkle } from "../components/Kid";
import { Cross, Heart, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S08_DURATION = DURATIONS[7];

const LID = 20; // かさぶたの ふた
const TOUCH = 180; // さわると とれちゃう
const REST = 320; // そーっと

export const S08After: React.FC = () => {
  const f = useCurrentFrame();
  const toRest = ip(f, [REST - 10, REST + 10], [0, 1]);
  const poke = ip(f, [TOUCH + 10, TOUCH + 45], [0, 1]);
  const wobble = ip(f, [TOUCH + 40, TOUCH + 55], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toRest}>
          <DotsBg color="#fff0f0" dot="#ffe0e0" />
          <NoseWall id="s08wall" x={960} y={680} w={1100} h={560} s={pop(f, LID, 20)} frame={f} tear={1} clot={1} wobble={wobble} />
          <Pill text="ふた" x={960} y={470} s={pop(f, LID + 60) * ip(f, [TOUCH - 10, TOUCH], [1, 0])} size={64} color="#ffe14d" frame={f} />
          {f > LID + 50 && f < TOUCH
            ? [0, 1, 2].map((i) => (
                <Sparkle
                  key={i}
                  x={780 + i * 180}
                  y={520 + (i % 2) * 60}
                  s={pop(f, LID + 50 + i * 6, 12) * (0.8 + 0.2 * Math.sin(f * 0.3 + i))}
                />
              ))
            : null}
          {f >= TOUCH ? (
            <g>
              <Finger
                x={1000 + Math.sin(f * 0.6) * 10 * wobble}
                y={300 + poke * 290}
                s={1.1}
                rot={180}
              />
              <Cross x={1420} y={500} s={pop(f, TOUCH + 55) * 0.9} />
            </g>
          ) : null}
          <Sfx text="ぐらぐら" x={520} y={480} start={TOUCH + 45} end={REST - 10} size={110} color="#ffffff" />
        </g>
        <g opacity={toRest}>
          <DotsBg color="#fff3e0" dot="#ffe6c4" />
          <Kid x={960} y={690} s={1.15} frame={f} />
          <Heart x={1340} y={520 + Math.sin(f * 0.1) * 10} s={pop(f, REST + 30) * 1.2} />
          <Heart x={600} y={600 + Math.cos(f * 0.1) * 10} s={pop(f, REST + 45) * 0.8} />
          <Sfx text="そーっ" x={1430} y={800} start={REST + 40} end={S08_DURATION} size={110} color="#ffffff" rotate={-4} />
        </g>
      </svg>
      <Caption text="かさぶたの ふた" start={LID + 20} end={TOUCH - 12} position="top" size={104} />
      <Caption text="とれちゃう！" start={TOUCH + 50} end={REST - 12} position="top" size={110} color="#ffc4c4" />
      <Caption text="そーっと" start={REST + 20} end={S08_DURATION} position="top" size={120} color="#ffe14d" />
    </AbsoluteFill>
  );
};
