import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { Garden, Moorings, Spider, WEB_C } from "../components/Things";
import { Web } from "../components/Web";
import { ip, pop } from "../lib/anim";

export const S01_DURATION = 500;

const LOOK = 30; // 見て見て！
const NAME = 190; // これは くものす
const WHY = 350; // どうやって？ なんのため？

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  const zoom = ip(f, [0, LOOK + 60], [1.25, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(960 540) scale(${zoom}) translate(-960 -540)`}>
          <Garden frame={f} />
          <Moorings />
          <Web x={WEB_C.x} y={WEB_C.y} frame={f} dew={ip(f, [LOOK, LOOK + 40], [0, 1])} />
          <Spider x={WEB_C.x} y={WEB_C.y + 10} s={0.55} frame={f} mood={f >= WHY ? "wow" : "smile"} />
        </g>
        <Kid x={300} y={790} s={0.75} frame={f} armUp={ip(f, [LOOK - 10, LOOK + 10], [0, 0.55])} mood={f >= WHY ? "wow" : "smile"} />
        {f >= LOOK && f < NAME
          ? [0, 1, 2, 3, 4].map((i) => (
              <Sparkle
                key={i}
                x={WEB_C.x + Math.cos(i * 1.3) * 300}
                y={WEB_C.y + Math.sin(i * 2.1) * 260}
                s={pop(f, LOOK + 10 + i * 6, 12) * (0.6 + 0.4 * Math.sin(f * 0.2 + i))}
              />
            ))
          : null}
        <Sfx text="キラキラ" x={1450} y={820} start={LOOK + 20} end={NAME - 5} size={100} color="#fff38a" />
        <Sfx text="？？？" x={560} y={480} start={WHY + 10} end={S01_DURATION} size={110} color="#ff8fa3" rotate={10} />
      </svg>
      <Caption text="くものす" start={NAME + 5} end={WHY - 5} position="top" size={140} color="#ffe14d" />
      <Caption text="どうやって？ なんのため？" start={WHY + 5} end={S01_DURATION} position="top" size={92} />
    </AbsoluteFill>
  );
};
