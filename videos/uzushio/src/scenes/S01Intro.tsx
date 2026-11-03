import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Cloud } from "../components/Characters";
import { Caption, Sfx } from "../components/Caption";
import { INK, LAND, SEA, WaveLine, Whirl } from "../components/Things";
import { ip, pop } from "../lib/anim";

export const S01_DURATION = 520;

const LOOK = 30; // 見て見て！
const NAME = 170; // これは うずしお
const WHY = 360; // どうして？

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  const grow = ip(f, [LOOK, LOOK + 60], [0, 1]);
  const named = f >= NAME;
  const point = ip(f, [LOOK - 10, LOOK + 10], [0, 0.55]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#bfe9ff" />
        <Cloud x={1500 - f * 0.3} y={150} s={0.9} />
        <Cloud x={500 - f * 0.2} y={230} s={0.6} opacity={0.8} />
        <rect y={520} width={1920} height={560} fill={SEA} />
        <rect y={520} width={1920} height={10} fill="#ffffff" opacity={0.6} />
        <WaveLine y={600} frame={f} />
        <WaveLine y={980} frame={f + 40} opacity={0.4} />

        <Whirl
          x={1250}
          y={780}
          r={300 * grow}
          frame={f}
          squash={0.42}
          arms={5}
          face={named}
          mood={f >= WHY ? "wow" : "smile"}
        />

        {/* みさき */}
        <path
          d="M -20 1100 L -20 700 Q 200 640 420 690 Q 640 740 760 1100 Z"
          fill={LAND}
          stroke={INK}
          strokeWidth={7}
        />
        <Kid
          x={330}
          y={520}
          s={0.9}
          frame={f}
          armUp={point}
          mood={f >= WHY ? "wow" : "smile"}
        />

        <Sfx
          text="ぐるぐる"
          x={1250}
          y={470}
          start={LOOK + 20}
          end={NAME - 5}
          size={120}
          color="#ffffff"
        />
        <Sfx
          text="？？？"
          x={600}
          y={340}
          start={WHY + 10}
          end={S01_DURATION}
          size={110}
          color="#ff8fa3"
          rotate={10}
        />
        {f >= NAME && f < NAME + 50
          ? [0, 1, 2, 3].map((i) => (
              <Sparkle
                key={i}
                x={1250 + Math.cos(i * 1.6) * 260}
                y={680 + Math.sin(i * 2.3) * 110}
                s={
                  pop(f, NAME + i * 4, 12) *
                  ip(f, [NAME + 30, NAME + 50], [1, 0])
                }
              />
            ))
          : null}
      </svg>
      <Caption
        text="うずしお"
        start={NAME + 5}
        end={WHY - 5}
        position="top"
        size={140}
        color="#ffe14d"
      />
      <Caption
        text="どうして まわるの？"
        start={WHY + 5}
        end={S01_DURATION}
        position="top"
        size={100}
      />
    </AbsoluteFill>
  );
};
