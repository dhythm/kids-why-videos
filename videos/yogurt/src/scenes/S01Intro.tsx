import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { BathBg, KitchenBg } from "../components/Backgrounds";
import { Spoon, Toilet, YogurtCup } from "../components/Microbes";
import { Unchi } from "../components/Body";
import { Arrow } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S01_DURATION = DURATIONS[0];

const EAT = 30; // あさごはんに ヨーグルト
const TOILET = 160; // すっきり！
const ASK = 320; // どうして？

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  const toBath = ip(f, [TOILET - 14, TOILET + 6], [0, 1]);
  const toAsk = ip(f, [ASK - 10, ASK + 10], [0, 1]);
  // スプーンを くちへ はこぶ（3かい）
  const cyc = ((f - EAT) % 40) / 40;
  const eating = f > EAT && f < TOILET - 20;
  const lift = eating ? Math.sin(cyc * Math.PI) : 0;
  const spoonX = 1080 - lift * 230;
  const spoonY = 590 - lift * 170;
  const chew = eating && cyc > 0.45 && cyc < 0.6;
  const poo = pop(f, TOILET + 50, 20);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {/* あさごはん */}
        <g opacity={1 - toBath}>
          <KitchenBg />
          <Kid
            x={760}
            y={600}
            s={1.05}
            frame={f}
            mood={chew ? "wow" : "smile"}
          />
          <YogurtCup x={1160} y={760} s={1 * pop(f, EAT - 20)} />
          <Spoon
            x={spoonX}
            y={spoonY}
            rot={-30 - lift * 30}
            full={lift > 0.1}
            s={pop(f, EAT)}
          />
          <Sfx
            text="ぱくっ"
            x={560}
            y={300}
            start={EAT + 20}
            end={TOILET - 20}
            size={90}
            color="#ffffff"
          />
        </g>
        {/* トイレ */}
        <g opacity={toBath * (1 - toAsk)}>
          <BathBg />
          <Toilet x={760} y={760} s={1.1} />
          <Kid
            x={1200}
            y={640}
            s={1}
            frame={f}
            armUp={ip(f, [TOILET + 40, TOILET + 60], [0, 1])}
          />
          <Unchi x={760} y={560} s={0.9 * poo} frame={f} mood="smile" />
          {f > TOILET + 60
            ? [0, 1, 2, 3].map((i) => (
                <Sparkle
                  key={i}
                  x={760 + Math.cos(i * 1.6) * 210}
                  y={540 + Math.sin(i * 1.6) * 130}
                  s={
                    pop(f, TOILET + 60 + i * 5, 12) *
                    (0.9 + 0.2 * Math.sin(f * 0.3 + i))
                  }
                />
              ))
            : null}
          <Sfx
            text="すっきり！"
            x={1240}
            y={240}
            start={TOILET + 50}
            end={ASK - 10}
            size={120}
          />
        </g>
        {/* どうして？ */}
        <g opacity={toAsk}>
          <rect width={1920} height={1080} fill="#fff6e0" />
          <YogurtCup x={520} y={780} s={1.3 * pop(f, ASK)} />
          <Arrow x1={760} y1={600} x2={760 + 380 * pop(f, ASK + 20)} y2={600} />
          <Unchi x={1380} y={600} s={1.1 * pop(f, ASK + 30)} frame={f} />
          <Sfx
            text="？"
            x={960}
            y={420}
            start={ASK + 40}
            end={S01_DURATION}
            size={220}
            color="#ff8fa3"
          />
        </g>
      </svg>
      <Caption
        text="ヨーグルト"
        start={EAT + 5}
        end={TOILET - 20}
        position="top"
        size={100}
      />
      <Caption
        text="どうして？"
        start={ASK + 30}
        end={S01_DURATION}
        position="top"
        size={110}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
