import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Kid, Sparkle } from "../components/Kid";
import { Unchi } from "../components/Body";
import {
  Apple,
  Banana,
  Bifido,
  Bulgaricus,
  Native,
  Thermo,
  WaterGlass,
} from "../components/Microbes";
import { Bean, BeanPod, Cabbage, Carrot, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S10_DURATION = DURATIONS[9];

const FOOD = 20; // やさい・くだもの・まめ
const WATER = 250; // おみず
const MOVE = 330; // からだを うごかす
const BYE = 420; // またね！

export const S10Recap: React.FC = () => {
  const f = useCurrentFrame();
  const toBye = ip(f, [BYE - 15, BYE + 5], [0, 1]);
  const hop = (i: number) => Math.abs(Math.sin(f * 0.22 + i)) * -40;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toBye}>
          <DotsBg color="#effbe6" dot="#dcf3cd" />
          {/* 1. たべもの */}
          <g>
            <Cabbage x={250} y={520} s={0.75 * pop(f, FOOD + 40)} />
            <Carrot x={430} y={540} s={0.7 * pop(f, FOOD + 48)} rot={18} />
            <Banana x={300} y={720} s={0.9 * pop(f, FOOD + 70)} />
            <Apple x={500} y={730} s={0.8 * pop(f, FOOD + 78)} />
            <BeanPod x={360} y={880} s={0.8 * pop(f, FOOD + 100)} rot={-6} />
            <Bean x={540} y={880} s={1 * pop(f, FOOD + 106)} />
            <Bifido
              x={660}
              y={480}
              s={0.55 * pop(f, FOOD + 150)}
              frame={f}
              mood="wow"
            />
            <Pill
              text="やさい・くだもの・まめ"
              x={400}
              y={340}
              s={pop(f, FOOD + 30)}
              size={46}
              color="#d6f5c6"
              frame={f}
            />
          </g>
          {/* 2. おみず */}
          <WaterGlass x={960} y={820} s={1.4 * pop(f, WATER)} />
          <Pill
            text="おみず"
            x={960}
            y={340}
            s={pop(f, WATER + 10)}
            size={56}
            color="#d4ecff"
            frame={f}
          />
          {/* 3. うごく */}
          <Kid
            x={1580}
            y={640}
            s={0.95 * pop(f, MOVE)}
            frame={f}
            run={f > MOVE ? 1 : 0}
          />
          <Pill
            text="からだを うごかす"
            x={1580}
            y={340}
            s={pop(f, MOVE + 10)}
            size={50}
            color="#ffe3b0"
            frame={f}
          />
        </g>
        {/* みんなで またね */}
        <g opacity={toBye}>
          <DotsBg color="#fff0f6" dot="#ffe0ec" />
          <Bulgaricus x={330} y={640 + hop(0)} s={0.8} frame={f} />
          <Bifido x={640} y={600 + hop(1)} s={0.9} frame={f} />
          <Unchi
            x={960}
            y={620 + hop(2)}
            s={1.1 * pop(f, BYE)}
            frame={f}
            mood="wow"
          />
          <Native x={1280} y={600 + hop(3)} s={0.9} frame={f} kind={4} />
          <Thermo x={1600} y={640 + hop(4)} s={0.75} frame={f} />
          {f > BYE + 10
            ? [0, 1, 2, 3, 4].map((i) => (
                <Sparkle
                  key={i}
                  x={200 + i * 380}
                  y={330 + (i % 2) * 520}
                  s={
                    pop(f, BYE + 10 + i * 5, 12) *
                    (0.8 + 0.2 * Math.sin(f * 0.3 + i))
                  }
                />
              ))
            : null}
          <Sfx
            text="またね！"
            x={960}
            y={920}
            start={BYE + 120}
            end={S10_DURATION}
            size={140}
          />
        </g>
      </svg>
      <Caption
        text="いい うんちの ために"
        start={FOOD + 5}
        end={WATER - 10}
        position="top"
        size={90}
      />
      <Caption
        text="すっきり うんち！"
        start={BYE + 10}
        end={S10_DURATION}
        position="top"
        size={110}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
