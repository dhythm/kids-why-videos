import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { Arrow, INK, LAND, Moon, SEA, Whirl } from "../components/Things";
import { ip, pop } from "../lib/anim";

export const S10_DURATION = 560;

const MOON = 30; // おつきさまが ひっぱって
const FAST = 150; // せまい ところを はやく
const SPIN = 275; // くるっ！
const BYE = 460;

const Card: React.FC<{ x: number; s: number; children: React.ReactNode }> = ({
  x,
  s,
  children,
}) =>
  s > 0 ? (
    <g transform={`translate(${x} 560) scale(${s})`}>
      <rect
        x={-230}
        y={-230}
        width={460}
        height={460}
        rx={60}
        fill="#ffffff"
        stroke={INK}
        strokeWidth={8}
      />
      {children}
    </g>
  ) : null;

export const S10Recap: React.FC = () => {
  const f = useCurrentFrame();
  const recap = ip(f, [BYE - 20, BYE], [1, 0]);
  const bye = ip(f, [BYE - 10, BYE + 10], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#fff6dc" />
        {recap > 0 ? (
          <g opacity={recap}>
            <Card x={380} s={pop(f, MOON, 18)}>
              <Moon x={0} y={0} s={1.2} frame={f} />
            </Card>
            <Arrow x1={640} y1={560} x2={700} y2={560} width={20} />
            <Card x={960} s={pop(f, FAST, 18)}>
              <rect
                x={-200}
                y={-200}
                width={400}
                height={400}
                rx={40}
                fill={SEA}
              />
              <path
                d="M -200 -200 L 200 -200 L 200 -110 Q 0 -20 -200 -110 Z"
                fill={LAND}
                stroke={INK}
                strokeWidth={6}
              />
              <path
                d="M -200 200 L 200 200 L 200 110 Q 0 20 -200 110 Z"
                fill={LAND}
                stroke={INK}
                strokeWidth={6}
              />
              {[-30, 30].map((y, i) => {
                const k = ((f * 0.04 + i * 0.5) % 1) * 300 - 150;
                return (
                  <Arrow
                    key={i}
                    x1={k - 80}
                    y1={y}
                    x2={k + 60}
                    y2={y}
                    color="#ffffff"
                    width={14}
                  />
                );
              })}
            </Card>
            <Arrow x1={1220} y1={560} x2={1280} y2={560} width={20} />
            <Card x={1540} s={pop(f, SPIN, 18)}>
              <rect
                x={-200}
                y={-200}
                width={400}
                height={400}
                rx={40}
                fill={SEA}
              />
              <Whirl x={0} y={0} r={170} frame={f} face speed={6} />
            </Card>
            <Sfx
              text="くるっ！"
              x={1540}
              y={290}
              start={SPIN + 10}
              end={BYE}
              size={110}
              color="#ffe14d"
            />
          </g>
        ) : null}

        {bye > 0 ? (
          <g opacity={bye}>
            <rect width={1920} height={1080} fill="#bfe9ff" />
            <rect y={620} width={1920} height={460} fill={SEA} />
            <Whirl
              x={1250}
              y={800}
              r={300}
              frame={f}
              squash={0.42}
              face
              mood="smile"
              arms={5}
            />
            <path
              d="M -20 1100 L -20 760 Q 220 700 440 750 Q 640 800 760 1100 Z"
              fill={LAND}
              stroke={INK}
              strokeWidth={7}
            />
            <Kid
              x={380}
              y={590}
              s={0.9}
              frame={f}
              armUp={0.5 + 0.35 * Math.sin(f * 0.25)}
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <Sparkle
                key={i}
                x={300 + i * 330}
                y={260 + (i % 2) * 120}
                s={
                  pop(f, BYE + 10 + i * 5, 12) *
                  (0.7 + 0.3 * Math.sin(f * 0.2 + i))
                }
              />
            ))}
          </g>
        ) : null}
      </svg>
      <Caption
        text="うずしおの ひみつ"
        start={5}
        end={MOON + 60}
        position="top"
        size={100}
        color="#ffe14d"
      />
      <Caption
        text="またね！"
        start={BYE + 10}
        end={S10_DURATION}
        position="top"
        size={140}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
