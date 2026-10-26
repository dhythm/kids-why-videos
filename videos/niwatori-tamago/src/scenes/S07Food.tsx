import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import { EGG_D, FarmBg, Grain, Hen } from "../components/Farm";
import { Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S07_DURATION = 500;

const PECK = 30;
const PECK_END = 230;
const MAKE = 250;

const GRAINS = new Array(14).fill(0).map((_, i) => ({
  x: 840 + random(`gx${i}`) * 200,
  y: 880 + random(`gy${i}`) * 50,
  kind: i % 3,
  eatenAt: PECK + 12 + i * 14,
}));

export const S07Food: React.FC = () => {
  const f = useCurrentFrame();
  const pecking = f >= PECK && f < PECK_END;
  const peck = pecking ? Math.max(0, Math.sin((f - PECK) * 0.45)) : 0;
  const make = ip(
    f,
    [MAKE + 30, MAKE + 170],
    [0, 1],
    Easing.inOut(Easing.quad),
  );
  const hx = ip(f, [PECK_END, MAKE + 10], [700, 560]);

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <FarmBg frame={f} />
        {GRAINS.map((g, i) =>
          f < g.eatenAt ? (
            <Grain
              key={i}
              x={g.x}
              y={g.y}
              s={1.6 * pop(f, i * 2, 12)}
              kind={g.kind}
            />
          ) : null,
        )}
        <Hen
          x={hx}
          y={700}
          s={1.0}
          frame={f}
          peck={peck}
          walk={f >= PECK_END && f < MAKE + 10 ? 1 : 0}
          mood="smile"
        />
        {/* おなかの なかで ひかる */}
        {f >= MAKE ? (
          <circle
            cx={hx - 10}
            cy={710}
            r={70}
            fill="#fff59d"
            opacity={pop(f, MAKE, 16) * (0.4 + Math.sin(f * 0.2) * 0.15)}
          />
        ) : null}
        {/* からの もとが たまごへ */}
        {f >= MAKE + 20
          ? new Array(16).fill(0).map((_, i) => {
              const period = 40;
              const t = ((f - MAKE - 20 + i * 5) % period) / period;
              const sx = hx;
              const sy = 700;
              const tx = 1400;
              const ty = 560;
              return (
                <g key={i} opacity={f < MAKE + 190 ? 1 - t * 0.3 : 0}>
                  <Grain
                    x={sx + (tx - sx) * t}
                    y={
                      sy +
                      (ty - sy) * t -
                      Math.sin(t * Math.PI) * 180 +
                      (random(`fy${i}`) - 0.5) * 60
                    }
                    s={0.9}
                    kind={2}
                  />
                </g>
              );
            })
          : null}
        {f >= MAKE + 10 ? (
          <g
            transform={`translate(1400 560) scale(${pop(f, MAKE + 10, 18) * 2.6})`}
          >
            <path
              d={EGG_D}
              fill="#ffffff"
              stroke="#2b2b4a"
              strokeWidth={4}
              strokeDasharray="10 8"
            />
            <clipPath id="eggfill">
              <path d={EGG_D} />
            </clipPath>
            <rect
              x={-60}
              y={62 - make * 130}
              width={120}
              height={130}
              fill="#fff1dc"
              clipPath="url(#eggfill)"
            />
            <path
              d={EGG_D}
              fill="none"
              stroke="#2b2b4a"
              strokeWidth={4}
              opacity={make}
            />
          </g>
        ) : null}
        {f >= MAKE + 180
          ? [0, 1, 2].map((i) => (
              <Sparkle
                key={i}
                x={1400 + Math.cos(i * 2.2) * 230}
                y={560 + Math.sin(i * 2.2) * 210}
                s={pop(f, MAKE + 180 + i * 6, 14)}
              />
            ))
          : null}
        <Sfx
          text="つんつん"
          x={1150}
          y={560}
          start={PECK + 5}
          end={PECK_END}
          size={110}
        />
        <Sfx
          text="もぐもぐ"
          x={420}
          y={360}
          start={MAKE}
          end={MAKE + 120}
          size={100}
        />
      </svg>
      <Caption
        text="ごはん を つんつん"
        start={15}
        end={MAKE - 5}
        position="top"
        size={92}
      />
      <Caption
        text="から の もと は ごはん！"
        start={MAKE + 5}
        end={S07_DURATION}
        position="top"
        size={92}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
