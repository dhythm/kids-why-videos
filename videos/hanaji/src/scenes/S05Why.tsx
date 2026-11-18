import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Fixer, FrontNose, KneeScrape, NoseWall } from "../components/Hanaji";
import { Sparkle } from "../components/Kid";
import { Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S05_DURATION = DURATIONS[4];

const ASK = 20; // なんの ため？
const HURT = 135; // ちいさな けが
const SAME = 235; // ひざの すりきずと おなじ
const CLOT = 350; // かたまって ふた

const WX = 700;
const WY = 660;
const SPOT = [-150, 0, 150];

export const S05Why: React.FC = () => {
  const f = useCurrentFrame();
  const toHurt = ip(f, [HURT - 10, HURT + 10], [0, 1]);
  const knee = pop(f, SAME) * ip(f, [CLOT - 15, CLOT], [1, 0]);
  const go = ip(f, [CLOT + 30, CLOT + 70], [0, 1]);
  const clot = ip(f, [CLOT + 70, CLOT + 125], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toHurt}>
          <DotsBg color="#fff6e0" dot="#ffe8bd" />
          <FrontNose x={960} y={610} s={2.2 * pop(f, ASK)} frame={f} bleed={1} />
          <Sfx text="？" x={1500} y={480} start={ASK + 20} end={HURT} size={240} color="#ff8fa3" />
          <Sfx text="？" x={420} y={520} start={ASK + 30} end={HURT} size={170} color="#7fc8ff" rotate={10} />
        </g>
        <g opacity={toHurt}>
          <DotsBg color="#fff0f0" dot="#ffe0e0" />
          <NoseWall id="s05wall" x={WX} y={WY} w={980} h={560} frame={f} tear={1} clot={clot} />
          {/* ひざの すりきずと おなじ「けが」 */}
          <text
            x={1300}
            y={640}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={150 * knee}
            fontWeight={800}
            fill="#2b2b4a"
          >
            ＝
          </text>
          <KneeScrape x={1600} y={620} s={knee} />
          <Pill text="ひざの けが" x={1600} y={880} s={knee} size={52} color="#ffe6cf" frame={f} />
          {/* なおしやさんが ふたを つくる */}
          {SPOT.map((dx, i) => {
            const working = clot > 0 && clot < 1;
            return (
              <Fixer
                key={i}
                x={1500 + i * 130 + (WX + dx - 1500 - i * 130) * go}
                y={820 - go * 20 + Math.sin(f * (working ? 0.5 : 0.12) + i * 1.4) * (working ? 18 : 9)}
                s={0.95 * pop(f, CLOT + 10 + i * 8)}
                frame={f}
                carry={go > 0.3 && clot < 1}
                color={i === 1 ? "#ffd0e0" : "#ffffff"}
              />
            );
          })}
          <Sfx text="ぴたっ" x={WX} y={400} start={CLOT + 125} end={S05_DURATION} size={120} color="#ffffff" />
          <Pill text="ちの ふた" x={1560} y={560} s={pop(f, CLOT + 135)} size={64} color="#ffe14d" frame={f} />
          {f > CLOT + 130
            ? [0, 1, 2].map((i) => (
                <Sparkle
                  key={i}
                  x={1400 + i * 160}
                  y={400 + (i % 2) * 290}
                  s={pop(f, CLOT + 130 + i * 5, 12) * (0.9 + 0.2 * Math.sin(f * 0.3 + i))}
                />
              ))
            : null}
        </g>
      </svg>
      <Caption text="なんの ため？" start={ASK + 10} end={HURT - 12} position="top" size={110} color="#ffe14d" />
      <Caption text="ちいさな けが" start={HURT + 20} end={CLOT - 12} position="top" size={110} />
      <Caption text="かたまって ふた" start={CLOT + 20} end={S05_DURATION} position="top" size={104} color="#ffe14d" />
    </AbsoluteFill>
  );
};
