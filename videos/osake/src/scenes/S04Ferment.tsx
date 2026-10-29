import React from "react";
import { AbsoluteFill, interpolateColors, useCurrentFrame } from "remotion";
import {
  Barrel,
  Bubble,
  DayNight,
  Pill,
  Sugar,
  Yeast,
} from "../components/Things";
import { Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S04_DURATION = 500;

const NAME = 230;
const DAYS = 4;

export const S04Ferment: React.FC = () => {
  const f = useCurrentFrame();
  // ひにちが すすむ（ひる → よる を くりかえす）
  const t = ip(f, [20, NAME + 40], [0, DAYS], (x) => x);
  const day = Math.min(DAYS, Math.floor(t) + 1);
  const night = (1 - Math.cos(t * Math.PI * 2)) / 2;
  const sky = interpolateColors(night, [0, 1], ["#bfe9ff", "#2c3570"]);
  const liquid = interpolateColors(t, [0, DAYS], ["#f7f1df", "#ffcf5c"]);
  // まどの なかの あまい つぶが へっていく
  const sugarLeft = ip(f, [20, NAME + 20], [6, 0], (x) => x);

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill={sky} />
        <rect y={860} width={1920} height={220} fill="#a0673d" />
        <rect y={860} width={1920} height={24} fill="#c9844f" />
        <DayNight x={1650} y={460} t={t} />
        <Pill
          text={`${day}にちめ`}
          x={1650}
          y={540}
          s={pop(f, 25, 14)}
          frame={f}
          color="#ffe14d"
        />

        <g transform="translate(600 900)">
          <Barrel s={1.25} frame={f} bubbling={1} liquid={liquid} />
        </g>

        {/* たるの なかを のぞく まど */}
        <g transform="translate(1110 580)" opacity={pop(f, 40, 18)}>
          <path
            d="M -240 40 L -350 120"
            stroke="#2b2b4a"
            strokeWidth={6}
            strokeDasharray="14 12"
          />
          <circle r={250} fill={liquid} stroke="#2b2b4a" strokeWidth={10} />
          <circle r={250} fill="#fff" opacity={0.35} />
          {[0, 1, 2].map((i) => (
            <Yeast
              key={i}
              x={-120 + i * 120}
              y={i === 1 ? 60 : -20}
              s={0.75}
              frame={f}
              chew={1}
              seed={i * 2}
            />
          ))}
          {new Array(6)
            .fill(0)
            .map((_, i) =>
              i < sugarLeft ? (
                <Sugar
                  key={i}
                  x={-150 + (i % 3) * 150 + Math.sin(f * 0.05 + i) * 10}
                  y={i < 3 ? -150 : 160}
                  s={0.8 * Math.min(1, sugarLeft - i)}
                  rot={f * 1.5 + i * 30}
                />
              ) : null,
            )}
          {new Array(8).fill(0).map((_, i) => {
            const k = ((f + i * 17) % 80) / 80;
            return (
              <Bubble
                key={`b${i}`}
                x={-160 + i * 45 + Math.sin(f * 0.1 + i) * 8}
                y={140 - k * 340}
                r={10 + (i % 3) * 5}
                opacity={1 - k}
              />
            );
          })}
        </g>

        {f >= NAME && f < NAME + 60
          ? [0, 1, 2, 3, 4].map((i) => (
              <Sparkle
                key={i}
                x={600 + Math.cos(i * 1.3) * 300}
                y={420 + Math.sin(i * 2.1) * 120}
                s={
                  pop(f, NAME + 5 + i * 4, 12) *
                  ip(f, [NAME + 40, NAME + 60], [1, 0])
                }
              />
            ))
          : null}

        <Sfx
          text="ぷくぷく"
          x={300}
          y={330}
          start={30}
          end={NAME - 10}
          size={100}
          color="#ffffff"
        />
      </svg>
      <Caption
        text="なんにちも ぷくぷく"
        start={20}
        end={NAME - 5}
        position="top"
        size={96}
      />
      <Caption
        text="はっこう"
        start={NAME + 5}
        end={S04_DURATION}
        position="top"
        size={130}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
