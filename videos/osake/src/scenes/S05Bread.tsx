import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Bread, Bubble, Yeast } from "../components/Things";
import { Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S05_DURATION = 440;

const RISE = 60;
const INSIDE = 230;
const BAKE = 330;

export const S05Bread: React.FC = () => {
  const f = useCurrentFrame();
  const rise = ip(f, [RISE, INSIDE - 20], [0, 1], Easing.inOut(Easing.quad));
  const baked = ip(f, [BAKE, BAKE + 50], [0, 1]);
  const cut = ip(f, [INSIDE, INSIDE + 20, BAKE - 10, BAKE], [0, 1, 1, 0]);
  const h = 60 + rise * 120;
  const w = 150 + rise * 60;
  const S = 1.5;

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#fff0e0" />
        {new Array(12).fill(0).map((_, i) => (
          <rect
            key={i}
            x={i * 170}
            y={0}
            width={85}
            height={860}
            fill="#ffe6cc"
          />
        ))}
        <rect y={860} width={1920} height={220} fill="#8fd3c7" />
        <rect y={860} width={1920} height={26} fill="#6bbfb2" />
        {/* まないた */}
        <rect
          x={520}
          y={830}
          width={880}
          height={50}
          rx={20}
          fill="#e0b07a"
          stroke="#2b2b4a"
          strokeWidth={6}
        />

        <Bread x={960} y={840} s={S} rise={rise} baked={baked} frame={f} />

        {/* なかの あわ（だんめん） */}
        {cut > 0 ? (
          <g opacity={cut}>
            {new Array(14).fill(0).map((_, i) => {
              const bx = 960 + ((i % 7) - 3) * w * 0.27 * S;
              const by = 840 - (i < 7 ? 0.45 : 0.95) * h * S;
              return (
                <Bubble
                  key={i}
                  x={bx + Math.sin(f * 0.1 + i) * 5}
                  y={by}
                  r={(16 + (i % 3) * 8) * (1 + Math.sin(f * 0.15 + i) * 0.1)}
                />
              );
            })}
          </g>
        ) : null}

        {/* こうぼさんが ふーっと あわを いれる */}
        {f < BAKE
          ? [0, 1].map((i) => {
              const x = i === 0 ? 330 : 1590;
              return (
                <g key={i} opacity={ip(f, [BAKE - 20, BAKE], [1, 0])}>
                  <Yeast
                    x={x}
                    y={620}
                    s={1.1 * pop(f, 10 + i * 8, 16)}
                    frame={f}
                    seed={i * 3}
                    chew={0.6}
                  />
                  {f > RISE
                    ? [0, 1, 2].map((k) => {
                        const tt = ((f + k * 20) % 60) / 60;
                        const dir = i === 0 ? 1 : -1;
                        return (
                          <Bubble
                            key={k}
                            x={x + dir * (90 + tt * 300)}
                            y={620 + Math.sin(tt * 6 + k) * 30 + tt * 80}
                            r={12 + k * 4}
                            opacity={1 - tt}
                          />
                        );
                      })
                    : null}
                </g>
              );
            })
          : null}

        {f >= BAKE + 40
          ? [0, 1, 2, 3, 4].map((i) => (
              <Sparkle
                key={i}
                x={960 + Math.cos(i * 1.25) * 420}
                y={520 + Math.sin(i * 1.9) * 200}
                s={
                  pop(f, BAKE + 40 + i * 4, 12) *
                  (0.9 + Math.sin(f * 0.2 + i) * 0.2)
                }
              />
            ))
          : null}

        <Sfx
          text="ぷくーっ"
          x={1300}
          y={420}
          start={RISE + 30}
          end={INSIDE - 5}
          size={120}
          color="#ffffff"
        />
        <Sfx
          text="ふわふわ！"
          x={1480}
          y={340}
          start={BAKE + 40}
          end={S05_DURATION}
          size={110}
        />
      </svg>
      <Caption
        text="パン も こうぼ さん！"
        start={15}
        end={INSIDE - 5}
        position="top"
        size={100}
      />
      <Caption
        text="あわ で ふくらむ"
        start={INSIDE + 5}
        end={S05_DURATION}
        position="top"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
