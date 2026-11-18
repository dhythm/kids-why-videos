import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg, ParkBg } from "../components/Backgrounds";
import { Bandage, Knee } from "../components/Bansoko";
import { INK } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S01_DURATION = DURATIONS[0];

const FALL = 30; // ころんだ！
const STICK = 190; // ぺたっ
const ASK = 310; // なんの ため？

const ZOOM = { x: 1330, y: 640 };

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  const toAsk = ip(f, [ASK - 10, ASK + 10], [0, 1]);
  const stuck = f >= STICK + 25;
  const fly = ip(f, [STICK, STICK + 25], [0, 1]);
  const zoom = pop(f, FALL + 25, 20);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <defs>
          <clipPath id="s01zoom">
            <circle cx={ZOOM.x} cy={ZOOM.y} r={300} />
          </clipPath>
        </defs>
        <g opacity={1 - toAsk}>
          <ParkBg frame={f} />
          <Kid
            x={520}
            y={700}
            s={1.1}
            frame={f}
            rotate={ip(f, [FALL - 12, FALL], [0, -8]) + ip(f, [FALL, FALL + 14], [0, 8])}
            mood={f < FALL ? "smile" : stuck ? "smile" : "ouch"}
            scrape={f > FALL}
            patch={pop(f, STICK + 25, 12)}
          />
          {/* ひざを おおきく みる まる */}
          <g
            transform={`translate(${ZOOM.x} ${ZOOM.y}) scale(${zoom}) translate(${-ZOOM.x} ${-ZOOM.y})`}
          >
            <line
              x1={600}
              y1={830}
              x2={1060}
              y2={740}
              stroke={INK}
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray="2 16"
            />
            <circle cx={ZOOM.x} cy={ZOOM.y} r={300} fill="#fff8ec" />
            <g clipPath="url(#s01zoom)">
              <Knee
                x={ZOOM.x + 20}
                y={ZOOM.y - 20}
                s={0.95}
                heal={0}
                blood={stuck ? 0 : pop(f, FALL + 50)}
              />
              <Bandage
                x={ZOOM.x + 20 + (1 - fly) * 500}
                y={ZOOM.y - 20 - (1 - fly) * 420}
                s={f >= STICK ? 1 : 0}
                rot={-16 + (1 - fly) * 70}
              />
            </g>
            <circle
              cx={ZOOM.x}
              cy={ZOOM.y}
              r={300}
              fill="none"
              stroke={INK}
              strokeWidth={10}
            />
          </g>
          <Sfx text="どてっ" x={420} y={330} start={FALL} end={FALL + 70} size={110} color="#ffffff" />
          <Sfx text="ぺたっ" x={1700} y={330} start={STICK + 25} end={ASK - 10} size={110} />
        </g>
        <g opacity={toAsk}>
          <DotsBg color="#fff6e0" dot="#ffe8bd" />
          <Bandage
            x={960}
            y={640}
            s={2.3 * pop(f, ASK)}
            rot={-10 + Math.sin(f * 0.08) * 5}
            face
            frame={f}
          />
          <Sfx text="？" x={1560} y={420} start={ASK + 30} end={S01_DURATION} size={240} color="#ff8fa3" />
          <Sfx text="？" x={360} y={470} start={ASK + 40} end={S01_DURATION} size={170} color="#7fc8ff" rotate={10} />
        </g>
      </svg>
      <Caption text="いたい！" start={FALL + 10} end={STICK - 10} position="top" size={110} />
      <Caption text="ばんそうこう" start={STICK + 20} end={ASK - 10} position="top" size={110} />
      <Caption text="なんの ため？" start={ASK + 25} end={S01_DURATION} position="top" size={110} color="#ffe14d" />
    </AbsoluteFill>
  );
};
