import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg, KitchenBg } from "../components/Backgrounds";
import { Chopsticks, NattoBowl, StickyThread } from "../components/Natto";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S01_DURATION = DURATIONS[0];

const STIR = 30; // ぐるぐる まぜる
const PULL = 150; // のびーる！
const ASK = 320; // どうして？

const BOWL = { x: 1180, y: 700 };

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  const toAsk = ip(f, [ASK - 10, ASK + 10], [0, 1]);
  // まぜている あいだは おはしの さきが わを えがく
  const stirring = f > STIR && f < PULL;
  const ang = stirring ? (f - STIR) * 0.28 : (PULL - STIR) * 0.28;
  const lift = ip(f, [PULL, PULL + 70], [0, 1]);
  const tipX = BOWL.x + Math.cos(ang) * 90 * (1 - lift) + lift * 160;
  const tipY = BOWL.y - 10 + Math.sin(ang) * 22 * (1 - lift) - lift * 330;
  const threads = [
    { dx: -60, l: 520 },
    { dx: 20, l: 560 },
    { dx: 90, l: 500 },
    { dx: -10, l: 600 },
  ];
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toAsk}>
          <KitchenBg />
          <Kid
            x={600}
            y={600}
            s={1.05}
            frame={f}
            mood={f > PULL + 40 ? "wow" : "smile"}
            armUp={ip(f, [PULL + 40, PULL + 60], [0, 0.5])}
          />
          <NattoBowl
            x={BOWL.x}
            y={BOWL.y}
            s={pop(f, 5, 20)}
            stir={ang * 0.5}
            foam={ip(f, [STIR, PULL], [0, 0.4])}
          />
          {threads.map((t, i) => (
            <StickyThread
              key={i}
              a={{ x: BOWL.x + t.dx, y: BOWL.y - 30 }}
              b={{ x: tipX + (i - 1.5) * 6, y: tipY }}
              length={t.l}
              opacity={ip(f, [PULL + 5, PULL + 20], [0, 1])}
              base={7}
            />
          ))}
          <Chopsticks
            x={tipX}
            y={tipY}
            s={pop(f, STIR - 15)}
            rot={18 - lift * 10}
          />
          <Sfx
            text="ぐるぐる"
            x={1500}
            y={330}
            start={STIR + 10}
            end={PULL}
            size={96}
            color="#ffffff"
          />
          <Sfx
            text="のびーる！"
            x={1560}
            y={260}
            start={PULL + 40}
            end={ASK - 10}
            size={120}
          />
          {f > PULL + 50
            ? [0, 1, 2].map((i) => (
                <Sparkle
                  key={i}
                  x={tipX - 120 + i * 120}
                  y={tipY + 90 + (i % 2) * 60}
                  s={pop(f, PULL + 50 + i * 6, 12) * (0.8 + 0.2 * Math.sin(f * 0.3 + i))}
                  color="#ffffff"
                />
              ))
            : null}
        </g>
        <g opacity={toAsk}>
          <DotsBg color="#fff6e0" dot="#ffe8bd" />
          <NattoBowl x={960} y={720} s={1.3 * pop(f, ASK)} stir={f * 0.02} foam={0.4} />
          {[-1, 0, 1].map((i) => (
            <StickyThread
              key={i}
              a={{ x: 960 + i * 80, y: 690 }}
              b={{ x: 960 + i * 200, y: 380 + Math.abs(i) * 60 + Math.sin(f * 0.1 + i) * 15 }}
              length={420}
              opacity={ip(f, [ASK + 20, ASK + 35], [0, 1])}
            />
          ))}
          <Sfx
            text="？"
            x={1500}
            y={460}
            start={ASK + 30}
            end={S01_DURATION}
            size={240}
            color="#ff8fa3"
          />
          <Sfx
            text="？"
            x={420}
            y={520}
            start={ASK + 40}
            end={S01_DURATION}
            size={170}
            color="#7fc8ff"
            rotate={10}
          />
        </g>
      </svg>
      <Caption text="なっとう" start={STIR} end={PULL + 30} position="top" size={110} />
      <Caption
        text="どうして ネバネバ？"
        start={ASK + 25}
        end={S01_DURATION}
        position="top"
        size={110}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
