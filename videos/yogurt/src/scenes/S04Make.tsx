import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { Sparkle } from "../components/Kid";
import { DotsBg } from "../components/Backgrounds";
import {
  Bifido,
  Bulgaricus,
  Jar,
  MilkCarton,
  SourDrop,
  Thermo,
  YogurtCup,
} from "../components/Microbes";
import { Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S04_DURATION = DURATIONS[3];

const MILK = 20; // ぎゅうにゅうに
const LAB = 80; // にゅうさんきんを いれて
const EAT = 160; // ぎゅうにゅうを たべて すっぱい にゅうさん
const THICK = 290; // とろーり
const BIFI = 420; // ビフィズスきん いり も

const JX = 960;
const JY = 940;

export const S04Make: React.FC = () => {
  const f = useCurrentFrame();
  const pour = ip(f, [MILK + 10, MILK + 70], [0, 1]);
  const tilt =
    ip(f, [MILK, MILK + 15], [0, 1]) *
    (1 - ip(f, [MILK + 70, MILK + 85], [0, 1]));
  const jump = ip(f, [LAB, LAB + 40], [0, 1]);
  const thick = ip(f, [THICK - 30, THICK + 20], [0, 1]);
  const toCup = ip(f, [BIFI - 15, BIFI + 5], [0, 1]);
  const chomp = f > EAT && f < THICK ? Math.abs(Math.sin(f * 0.4)) : 0;
  // きんが びんに とびこむ（ひだりうえ → なか）
  const fly = (sx: number, sy: number, ex: number, ey: number) => ({
    x: sx + (ex - sx) * jump,
    y: sy + (ey - sy) * jump - Math.sin(jump * Math.PI) * 220,
  });
  const b = fly(1500, 300, JX - 40, JY - 180);
  const t = fly(1650, 520, JX + 40, JY - 90);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toCup}>
          <DotsBg color="#fff8e8" dot="#ffeecb" />
          <MilkCarton x={500} y={660} s={pop(f, MILK - 15)} rot={tilt * 70} />
          {pour > 0 && pour < 1 ? (
            <path
              d={`M 700 520 Q 820 560 ${JX - 30} ${JY - 300 * pour}`}
              stroke="#ffffff"
              strokeWidth={34}
              strokeLinecap="round"
              fill="none"
            />
          ) : null}
          <Jar
            x={JX}
            y={JY}
            s={1.3}
            fill={pour * 0.82}
            thick={thick}
            frame={f}
          />
          {f >= LAB ? (
            <>
              <Bulgaricus
                x={b.x}
                y={b.y}
                s={0.65}
                frame={f}
                rot={jump * 20}
                mood={chomp > 0.6 ? "wow" : "smile"}
              />
              <Thermo
                x={t.x}
                y={t.y}
                s={0.6}
                frame={f}
                rot={-jump * 10}
                mood={chomp > 0.6 ? "wow" : "smile"}
              />
            </>
          ) : null}
          <Pill
            text="ぎゅうにゅう"
            x={500}
            y={760}
            s={pop(f, MILK + 10)}
            size={56}
            color="#ffffff"
            frame={f}
          />
          <Pill
            text="にゅうさんきん"
            x={1520}
            y={760}
            s={pop(f, LAB + 10) * (1 - ip(f, [EAT + 40, EAT + 50], [0, 1]))}
            size={56}
            color="#e3f5c8"
            frame={f}
          />
          {[0, 1, 2, 3, 4].map((i) => (
            <SourDrop
              key={i}
              x={JX - 120 + i * 60}
              y={
                JY -
                300 -
                (i % 2) * 70 -
                ip(f, [EAT + 30 + i * 10, EAT + 90 + i * 10], [0, 120])
              }
              s={
                0.9 *
                pop(f, EAT + 30 + i * 10) *
                (1 - ip(f, [THICK + 30, THICK + 45], [0, 1]))
              }
              frame={f}
            />
          ))}
          <Pill
            text="にゅうさん（すっぱい）"
            x={1450}
            y={420}
            s={pop(f, EAT + 60) * (1 - ip(f, [THICK + 30, THICK + 45], [0, 1]))}
            size={52}
            color="#fff3a8"
            frame={f}
          />
          <Sfx
            text="とろーり"
            x={1400}
            y={500}
            start={THICK + 20}
            end={BIFI - 10}
            size={110}
            color="#ffffff"
          />
        </g>
        {/* できあがり + ビフィズスきん いり */}
        <g opacity={toCup}>
          <DotsBg color="#eaf4ff" dot="#d8e9ff" />
          <YogurtCup x={760} y={860} s={1.6 * pop(f, BIFI)} />
          <Bifido
            x={1300}
            y={560}
            s={1.4 * pop(f, BIFI + 20)}
            frame={f}
            rot={-12}
          />
          <Pill
            text="ビフィズスきん いり"
            x={1300}
            y={860}
            s={pop(f, BIFI + 30)}
            size={56}
            color="#cfe0ff"
            frame={f}
          />
          {f > BIFI + 10
            ? [0, 1, 2].map((i) => (
                <Sparkle
                  key={i}
                  x={760 + Math.cos(i * 2.1) * 260}
                  y={600 + Math.sin(i * 2.1) * 200}
                  s={pop(f, BIFI + 10 + i * 5, 12)}
                />
              ))
            : null}
        </g>
      </svg>
      <Caption
        text="ヨーグルトの つくりかた"
        start={MILK}
        end={EAT - 5}
        position="top"
        size={90}
      />
      <Caption
        text="すっぱく なって かたまる"
        start={EAT + 5}
        end={BIFI - 15}
        position="top"
        size={90}
        color="#ffe14d"
      />
      <Caption
        text="ビフィズスきん いりも"
        start={BIFI + 10}
        end={S04_DURATION}
        position="top"
        size={96}
      />
    </AbsoluteFill>
  );
};
