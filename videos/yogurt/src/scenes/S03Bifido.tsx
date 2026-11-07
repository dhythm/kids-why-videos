import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, FONT, Sfx } from "../components/Caption";
import { Sparkle } from "../components/Kid";
import { DotsBg } from "../components/Backgrounds";
import { Baby, Bifido } from "../components/Microbes";
import { INK, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S03_DURATION = DURATIONS[2];

const HELLO = 20; // ビフィズスきん
const SHAPE = 120; // Y の かたち
const DARK = 300; // くうきが にがて
const BABY = 450; // あかちゃん

export const S03Bifido: React.FC = () => {
  const f = useCurrentFrame();
  const toDark = ip(f, [DARK - 10, DARK + 10], [0, 1]);
  const toBaby = ip(f, [BABY - 10, BABY + 10], [0, 1]);
  const yShow = pop(f, SHAPE + 30, 20);
  // くうき から にげて、くらい ほうへ
  const run = ip(f, [DARK + 50, DARK + 110], [0, 1]);
  const bx = 760 + run * 560;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {/* しょうかい */}
        <g opacity={1 - toDark}>
          <DotsBg color="#e8f0ff" dot="#d4e2ff" />
          <Bifido
            x={yShow > 0 ? 760 : 960}
            y={580}
            s={2.3 * pop(f, HELLO)}
            frame={f}
          />
          <Pill
            text="ビフィズスきん"
            x={yShow > 0 ? 760 : 960}
            y={920}
            s={pop(f, HELLO + 20)}
            size={72}
            color="#cfe0ff"
            frame={f}
          />
          {yShow > 0 ? (
            <g transform={`translate(1360 560) scale(${yShow})`}>
              <text
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontFamily: FONT, fontWeight: 800, fontSize: 420 }}
                fill="#7aa7ff"
                stroke={INK}
                strokeWidth={16}
                paintOrder="stroke"
              >
                Y
              </text>
            </g>
          ) : null}
          <Sfx
            text="＝"
            x={1080}
            y={560}
            start={SHAPE + 40}
            end={DARK - 10}
            size={140}
            color="#ffffff"
            rotate={0}
          />
          {f > HELLO + 15
            ? [0, 1, 2].map((i) => (
                <Sparkle
                  key={i}
                  x={(yShow > 0 ? 760 : 960) + Math.cos(i * 2.1 + 0.5) * 300}
                  y={540 + Math.sin(i * 2.1 + 0.5) * 230}
                  s={
                    pop(f, HELLO + 15 + i * 5, 12) *
                    (0.8 + 0.2 * Math.sin(f * 0.3 + i))
                  }
                />
              ))
            : null}
        </g>
        {/* くうきが にがて */}
        <g opacity={toDark * (1 - toBaby)}>
          <rect width={1920} height={1080} fill="#e9f7ff" />
          <path
            d="M 1080 0 Q 1000 540 1080 1080 L 1920 1080 L 1920 0 Z"
            fill="#3a2550"
          />
          {new Array(8).fill(0).map((_, i) => (
            <g
              key={i}
              transform={`translate(${160 + (i % 4) * 200} ${200 + Math.floor(i / 4) * 520 + Math.sin(f * 0.08 + i) * 30})`}
            >
              <circle
                r={50}
                fill="#ffffff"
                stroke="#9fd3f5"
                strokeWidth={6}
                opacity={0.9}
              />
            </g>
          ))}
          <Pill
            text="くうき"
            x={430}
            y={540}
            s={pop(f, DARK + 15)}
            size={60}
            color="#ffffff"
            frame={f}
          />
          <Bifido
            x={bx}
            y={560}
            s={1.5}
            frame={f}
            mood={run < 1 ? "wow" : "smile"}
          />
          {run >= 1
            ? [0, 1, 2, 3].map((i) => (
                <circle
                  key={i}
                  cx={1450 + Math.cos(i * 1.7) * 280}
                  cy={560 + Math.sin(i * 1.7) * 300}
                  r={6}
                  fill="#fff7b0"
                  opacity={0.5 + 0.5 * Math.sin(f * 0.15 + i)}
                />
              ))
            : null}
          <Sfx
            text="にがて〜"
            x={760}
            y={330}
            start={DARK + 30}
            end={DARK + 100}
            size={90}
            color="#9fd3f5"
          />
          <Sfx
            text="ほっ"
            x={1460}
            y={330}
            start={DARK + 115}
            end={BABY - 10}
            size={100}
          />
        </g>
        {/* あかちゃん */}
        <g opacity={toBaby}>
          <DotsBg color="#fff0f6" dot="#ffe0ec" />
          <Baby x={960} y={620} s={1.25 * pop(f, BABY)} frame={f} />
          {new Array(7).fill(0).map((_, i) => (
            <Bifido
              key={i}
              x={960 + Math.cos(i * 0.9) * 110}
              y={680 + Math.sin(i * 0.9) * 140}
              s={0.42 * pop(f, BABY + 20 + i * 4)}
              frame={f + i * 9}
              rot={i * 50}
            />
          ))}
        </g>
      </svg>
      <Caption
        text="ビフィズスきん"
        start={HELLO + 5}
        end={SHAPE - 5}
        position="top"
        size={100}
      />
      <Caption
        text="Yの かたち！"
        start={SHAPE + 30}
        end={DARK - 10}
        position="top"
        size={100}
        color="#ffe14d"
      />
      <Caption
        text="くうきが にがて"
        start={DARK + 10}
        end={BABY - 10}
        position="top"
        size={96}
      />
      <Caption
        text="あかちゃんに いっぱい"
        start={BABY + 10}
        end={S03_DURATION}
        position="top"
        size={96}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
