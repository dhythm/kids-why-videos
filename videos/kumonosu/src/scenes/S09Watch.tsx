import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption } from "../components/Caption";
import { Garden, Moorings, Pill, Spider, WEB_C } from "../components/Things";
import { Web } from "../components/Web";
import { ip, pop } from "../lib/anim";

export const S09_DURATION = 420;

const DEW = 20; // あさつゆ キラキラ
const GENTLE = 210; // こわさないで そーっと

export const S09Watch: React.FC = () => {
  const f = useCurrentFrame();
  const sun = ip(f, [0, 120], [0.4, 1]);
  const tiptoe = Math.abs(Math.sin(f * 0.12)) * -10;
  const kidX = ip(f, [GENTLE, GENTLE + 160], [80, 300]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <Garden frame={f} sky="#ffe8cc" sun={sun} />
        <Moorings />
        <Web x={WEB_C.x} y={WEB_C.y} frame={f} dew={ip(f, [DEW, DEW + 60], [0, 1])} />
        <Spider x={WEB_C.x} y={WEB_C.y + 10} s={0.5} frame={f} mood="sleep" />
        {f > DEW + 40
          ? [0, 1, 2, 3, 4, 5, 6].map((i) => (
              <Sparkle
                key={i}
                x={WEB_C.x + Math.cos(i * 0.9) * (180 + (i % 3) * 90)}
                y={WEB_C.y + Math.sin(i * 0.9) * (150 + (i % 3) * 80)}
                s={0.4 + 0.6 * Math.max(0, Math.sin(f * 0.09 + i * 1.7))}
                color="#ffffff"
              />
            ))
          : null}
        {f >= GENTLE ? <Kid x={kidX} y={800 + tiptoe} s={0.72} frame={f} mood="smile" /> : null}
        <Pill text="こわさないでね" x={1500} y={900} s={pop(f, GENTLE + 60, 18)} size={52} frame={f} color="#ffffff" />
      </svg>
      <Caption text="キラキラ" start={DEW + 30} end={GENTLE - 5} position="top" size={120} color="#fff38a" />
      <Caption text="そーっと 見てね" start={GENTLE + 5} end={S09_DURATION} position="top" size={100} />
    </AbsoluteFill>
  );
};
