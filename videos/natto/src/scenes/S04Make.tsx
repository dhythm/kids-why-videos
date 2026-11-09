import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Arrow, Pill } from "../components/Things";
import {
  NattoKin,
  Soybean,
  SteamPot,
  WarmBox,
  WaterBowl,
} from "../components/Natto";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S04_DURATION = DURATIONS[3];

const SOAK = 130; // みずに つける
const STEAM = 175; // むす
const SPRINKLE = 225; // なっとうきんを ぱらぱら
const WARM = 330; // あったかい へやで いちにち

const PX = [270, 750, 1200, 1640]; // 4つの ばしょ

export const S04Make: React.FC = () => {
  const f = useCurrentFrame();
  const dim = (start: number) => 0.45 + 0.55 * ip(f, [start, start + 10], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DotsBg color="#fff1e6" dot="#ffe1cc" />
        <g opacity={dim(SOAK)}>
          <WaterBowl x={PX[0]} y={560} s={pop(f, SOAK)} />
          <Pill text="みずに つける" x={PX[0]} y={800} s={0.75 * pop(f, SOAK + 10)} size={56} color="#d6efff" frame={f} />
        </g>
        <Arrow x1={PX[0] + 160} y1={560} x2={PX[0] + 160 + 120 * pop(f, STEAM - 10)} y2={560} />
        <g opacity={dim(STEAM)}>
          <SteamPot x={PX[1]} y={580} s={pop(f, STEAM)} frame={f} />
          <Pill text="むす" x={PX[1]} y={800} s={0.75 * pop(f, STEAM + 10)} size={56} color="#e3e8f5" frame={f} />
        </g>
        <Arrow x1={PX[1] + 200} y1={560} x2={PX[1] + 200 + 90 * pop(f, SPRINKLE - 10)} y2={560} />
        <g opacity={dim(SPRINKLE)}>
          {[-70, 0, 70, -35, 35].map((bx, i) => (
            <Soybean key={i} x={PX[2] + bx} y={620 - (i > 2 ? 50 : 0)} s={0.9 * pop(f, SPRINKLE + i * 3)} />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const t = ip(f, [SPRINKLE + 10 + i * 8, SPRINKLE + 50 + i * 8], [0, 1]);
            return (
              <NattoKin
                key={i}
                x={PX[2] - 100 + i * 40}
                y={330 + t * 250}
                s={0.18 * pop(f, SPRINKLE + 10 + i * 8, 8)}
                frame={f + i * 9}
                rot={i * 60}
              />
            );
          })}
          <Sfx text="ぱらぱら" x={PX[2]} y={290} start={SPRINKLE + 10} end={WARM} size={70} color="#ffffff" />
          <Pill text="なっとうきん" x={PX[2]} y={800} s={0.75 * pop(f, SPRINKLE + 20)} size={56} color="#c9f7e4" frame={f} />
        </g>
        <Arrow x1={PX[2] + 160} y1={560} x2={PX[2] + 160 + 80 * pop(f, WARM - 10)} y2={560} />
        <g opacity={dim(WARM)}>
          <WarmBox x={PX[3]} y={570} s={0.85 * pop(f, WARM)} frame={f}>
            {[-50, 0, 50, -25, 25].map((bx, i) => (
              <Soybean
                key={i}
                x={bx}
                y={i > 2 ? -10 : 30}
                s={0.75}
                natto={ip(f, [WARM + 40, WARM + 140], [0, 1])}
                film={ip(f, [WARM + 60, WARM + 150], [0, 0.8])}
              />
            ))}
          </WarmBox>
          <Pill text="いちにち くらい" x={PX[3]} y={800} s={0.75 * pop(f, WARM + 15)} size={56} color="#ffe0a8" frame={f} />
          <Sfx text="ぽかぽか" x={PX[3]} y={300} start={WARM + 20} end={S04_DURATION} size={76} />
        </g>
      </svg>
      <Caption text="なっとうの つくりかた" start={10} end={S04_DURATION} position="top" size={92} />
    </AbsoluteFill>
  );
};
