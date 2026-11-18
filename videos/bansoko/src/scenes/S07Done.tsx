import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Bandage, Knee, SoggyPatch } from "../components/Bansoko";
import { Sparkle } from "../components/Kid";
import { Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S07_DURATION = DURATIONS[6];

const SKIN_T = 20; // あたらしい ひふ = からだの ばんそうこう
const BYE = 180; // もう はらなくて だいじょうぶ
const SOGGY = 290; // ずっと はると…

const K = { x: 700, y: 660 };

export const S07Done: React.FC = () => {
  const f = useCurrentFrame();
  const toSoggy = ip(f, [SOGGY - 12, SOGGY + 8], [0, 1]);
  const lift = ip(f, [SKIN_T + 15, SKIN_T + 50], [0, 1]);
  const away = ip(f, [BYE + 10, BYE + 70], [0, 1]);
  const peel = ip(f, [SOGGY + 105, SOGGY + 130], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toSoggy}>
          <DotsBg color="#fff6e0" dot="#ffe8bd" />
          <Knee x={K.x} y={K.y} s={0.9} heal={0.7} />
          {f > SKIN_T + 50
            ? [0, 1, 2, 3].map((i) => (
                <Sparkle
                  key={i}
                  x={K.x + Math.cos(i * 1.57 + 0.6) * 120}
                  y={K.y + Math.sin(i * 1.57 + 0.6) * 100}
                  s={pop(f, SKIN_T + 50 + i * 6, 12) * (0.8 + 0.25 * Math.sin(f * 0.3 + i))}
                  color="#ffffff"
                />
              ))
            : null}
          <Bandage
            x={K.x + lift * 620 + away * 700}
            y={K.y - lift * 130 - away * 700 + Math.sin(f * 0.12) * 10 * lift}
            s={0.9 + lift * 0.5}
            rot={-16 + lift * 10 + Math.sin(f * 0.3) * 12 * (f > BYE ? 1 : 0)}
            face={lift > 0.9}
            frame={f}
          />
          <Pill text="あたらしい ひふ" x={K.x} y={430} s={pop(f, SKIN_T + 60) * (f < BYE ? 1 : 0)} size={56} color="#ffe6cf" frame={f} />
          <Sfx text="ばいばい" x={1380} y={820} start={BYE + 15} end={SOGGY - 15} size={110} />
        </g>
        <g opacity={toSoggy}>
          <DotsBg color="#f3ecff" dot="#e6dcff" />
          <Knee x={K.x} y={K.y} s={0.9} heal={1} />
          <SoggyPatch x={K.x} y={K.y} s={0.9 * (peel > 0 ? 1 : 0)} itch={ip(f, [SOGGY + 135, SOGGY + 160], [0, 1])} />
          <Bandage
            x={K.x + peel * 560}
            y={K.y - peel * 60}
            s={0.9}
            rot={-16 + peel * 40}
          />
          <Sfx text="むれむれ" x={1380} y={420} start={SOGGY + 25} end={SOGGY + 105} size={100} color="#ffffff" />
          <Pill text="ふやける" x={1380} y={760} s={pop(f, SOGGY + 130)} size={60} color="#ffffff" frame={f} />
          <Pill text="かゆい" x={1380} y={900} s={pop(f, SOGGY + 155)} size={60} color="#ffe0e0" frame={f} />
        </g>
      </svg>
      <Caption text="からだの ばんそうこう" start={SKIN_T + 70} end={BYE - 10} position="top" size={88} />
      <Caption text="もう いらない！" start={BYE + 5} end={SOGGY - 15} position="top" size={110} color="#ffe14d" />
      <Caption text="ずっと はると…" start={SOGGY + 15} end={S07_DURATION} position="top" size={100} />
    </AbsoluteFill>
  );
};
