import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Astronaut, Cloud } from "../components/Characters";
import { Rocket } from "../components/Rocket";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S03_DURATION = 570;

const CREW = 50;
const FUEL = 210;
const BIG = 400;

const House: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect
      x={-40}
      y={-50}
      width={80}
      height={50}
      fill="#ffd6a5"
      stroke="#2b2b4a"
      strokeWidth={4}
    />
    <path
      d="M -50 -48 L 0 -90 L 50 -48 Z"
      fill="#ef476f"
      stroke="#2b2b4a"
      strokeWidth={4}
    />
    <rect x={-10} y={-28} width={20} height={28} fill="#8d5a3b" />
  </g>
);

export const S03Parts: React.FC = () => {
  const f = useCurrentFrame();
  const enter = ip(f, [0, 40], [700, 0], Easing.out(Easing.back(1.4)));
  const crewHL =
    ip(f, [CREW, CREW + 15], [0, 1]) *
    ip(f, [FUEL - 15, FUEL], [1, 0]) *
    (0.7 + Math.sin(f * 0.25) * 0.3);
  const fuelOn = f >= FUEL - 5;
  const fuel: [number, number, number] = [
    ip(f, [FUEL + 10, FUEL + 70], [0, 1]),
    ip(f, [FUEL + 60, FUEL + 110], [0, 1]),
    ip(f, [FUEL + 100, FUEL + 140], [0, 1]),
  ];
  const bigT = ip(f, [BIG, BIG + 60], [0, 1], Easing.inOut(Easing.cubic));
  const rScale = 1.35 - bigT * 0.35;
  const rx = 760 + bigT * -60;
  const groundY = 1200 - bigT * 240;
  const ry = 600 + bigT * 80;
  const sway = Math.sin(f * 0.05) * 2;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#7ccfff, #d9f2ff)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <Cloud x={300 + f * 0.4} y={200} s={0.9} />
        <Cloud x={1500 - f * 0.3} y={150} s={0.7} />
        <Cloud x={1700 - f * 0.2} y={420} s={0.5} opacity={0.8} />
        {/* じめん */}
        <rect x={0} y={groundY} width={1920} height={400} fill="#7bd389" />
        <g transform={`translate(0 ${enter})`}>
          <Rocket
            x={rx}
            y={ry}
            scale={rScale}
            rotate={sway}
            frame={f}
            fuel={fuelOn ? fuel : undefined}
            highlight={{ capsule: crewHL }}
          />
        </g>
        {/* のる ひと */}
        {f > CREW && f < FUEL ? (
          <>
            {[0, 1, 2].map((i) => (
              <Astronaut
                key={i}
                x={1200 + i * 220}
                y={560 + Math.sin(f * 0.12 + i) * 16}
                scale={
                  pop(f, CREW + 10 + i * 10, 18) *
                  ip(f, [FUEL - 15, FUEL], [1, 0]) *
                  1.3
                }
                frame={f + i * 20}
                wave={i === 1}
                rotate={Math.sin(f * 0.08 + i) * 5}
              />
            ))}
            <path
              d={`M ${1130 - Math.sin(f * 0.2) * 10} 330 Q 1000 250 ${rx + 80} ${ry - 368 * rScale + 40}`}
              stroke="#ffe14d"
              strokeWidth={10}
              fill="none"
              strokeDasharray="20 16"
              strokeDashoffset={f * 2}
              opacity={ip(f, [CREW + 30, CREW + 45], [0, 1])}
            />
          </>
        ) : null}
        {/* ねんりょう タンク */}
        {f >= FUEL && f < BIG ? (
          <g opacity={ip(f, [BIG - 15, BIG], [1, 0])}>
            {[0, 1, 2].map((i) => {
              const s = pop(f, FUEL + i * 12, 16);
              return (
                <g
                  key={i}
                  transform={`translate(${1250 + i * 190} ${560 + Math.sin(f * 0.1 + i) * 14}) scale(${s})`}
                >
                  <rect
                    x={-55}
                    y={-90}
                    width={110}
                    height={170}
                    rx={24}
                    fill="#ffffff"
                    stroke="#2b2b4a"
                    strokeWidth={6}
                  />
                  <rect
                    x={-40}
                    y={-60 + 120 * (1 - fuel[i])}
                    width={80}
                    height={120 * fuel[i]}
                    rx={10}
                    fill={["#ff9f1c", "#3a86ff", "#2ec4b6"][i]}
                  />
                  <rect
                    x={-20}
                    y={-108}
                    width={40}
                    height={22}
                    rx={6}
                    fill="#59607a"
                  />
                </g>
              );
            })}
            <Sfx
              text="ごくごく"
              x={1440}
              y={330}
              start={FUEL + 20}
              end={BIG - 20}
              size={100}
            />
          </g>
        ) : null}
        {/* くらべっこ */}
        {f >= BIG ? (
          <g opacity={ip(f, [BIG + 30, BIG + 60], [0, 1])}>
            <House x={1080} y={groundY + 2} s={0.75} />
            <Astronaut
              x={1200}
              y={groundY - 22}
              scale={0.18}
              frame={f}
              wave
              suitColor="#ffd166"
            />
            {/* たかさの やじるし */}
            <g opacity={ip(f, [BIG + 70, BIG + 90], [0, 1])}>
              <line
                x1={rx - 210}
                y1={ry - 360 * rScale}
                x2={rx - 210}
                y2={groundY}
                stroke="#2b2b4a"
                strokeWidth={8}
              />
              <path
                d={`M ${rx - 210} ${ry - 360 * rScale - 10} l -22 36 l 44 0 z`}
                fill="#2b2b4a"
              />
              <path
                d={`M ${rx - 210} ${groundY + 10} l -22 -36 l 44 0 z`}
                fill="#2b2b4a"
              />
            </g>
          </g>
        ) : null}
        <Sfx
          text="でっかーい！"
          x={1450}
          y={430}
          start={BIG + 90}
          end={S03_DURATION}
          size={120}
        />
      </svg>
      <Caption
        text="ここに のるよ"
        start={CREW + 20}
        end={FUEL - 10}
        position="top"
        align="right"
        size={96}
      />
      <Caption
        text="ねんりょう いっぱい！"
        start={FUEL + 30}
        end={BIG - 10}
        position="top"
        align="right"
        size={96}
      />
    </AbsoluteFill>
  );
};
