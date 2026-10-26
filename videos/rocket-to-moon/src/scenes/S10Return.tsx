import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolateColors,
  random,
  useCurrentFrame,
} from "remotion";
import { Cloud, Earth, Moon, Stars } from "../components/Characters";
import { Rocket } from "../components/Rocket";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S10_DURATION = 700;

const REENTRY = 150;
const CHUTE = 285;
const SPLASH = 400;
const ENDING = 545;

/** カプセルだけ（ローカルの まんなか を 0 に） */
const CapsuleOnly: React.FC<{
  x: number;
  y: number;
  s: number;
  rot: number;
  frame: number;
}> = ({ x, y, s, rot, frame }) => (
  <g
    transform={`translate(${x} ${y}) rotate(${rot}) scale(${s}) translate(0 290)`}
  >
    <Rocket x={0} y={0} stagesLeft={0} frame={frame} />
  </g>
);

const Parachute: React.FC<{
  x: number;
  y: number;
  s: number;
  color: string;
  sway: number;
}> = ({ x, y, s, color, sway }) => (
  <g transform={`translate(${x} ${y}) rotate(${sway}) scale(${s})`}>
    <path
      d="M -110 0 Q 0 -140 110 0 Z"
      fill={color}
      stroke="#2b2b4a"
      strokeWidth={6}
    />
    <path d="M -37 0 Q 0 -120 37 0" fill="#ffffff" opacity={0.85} />
    <line x1={-110} y1={0} x2={0} y2={170} stroke="#2b2b4a" strokeWidth={3} />
    <line x1={110} y1={0} x2={0} y2={170} stroke="#2b2b4a" strokeWidth={3} />
    <line x1={0} y1={-20} x2={0} y2={170} stroke="#2b2b4a" strokeWidth={3} />
  </g>
);

export const S10Return: React.FC = () => {
  const f = useCurrentFrame();

  // ===== A: ちきゅうへ =====
  const earthGrow = ip(f, [0, REENTRY], [120, 520], Easing.in(Easing.quad));
  const shipX = ip(f, [0, REENTRY], [1600, 900]);

  // ===== B: おおきな ほのお → パラシュート =====
  const sky = ip(f, [REENTRY, CHUTE, CHUTE + 60], [0, 0.5, 1]);
  const skyTop = interpolateColors(
    sky,
    [0, 0.5, 1],
    ["#2a0f3d", "#ff7b39", "#58b9ff"],
  );
  const skyBot = interpolateColors(
    sky,
    [0, 0.5, 1],
    ["#7a1f3d", "#ffc15e", "#c9ecff"],
  );
  const heat =
    ip(f, [REENTRY, REENTRY + 20], [0, 1]) * ip(f, [CHUTE - 30, CHUTE], [1, 0]);
  const capY =
    f < CHUTE
      ? ip(f, [REENTRY, CHUTE], [200, 480])
      : f < SPLASH
        ? ip(f, [CHUTE, SPLASH], [480, 780], Easing.in(Easing.quad))
        : 780 + Math.sin((f - SPLASH) * 0.12) * 10;
  const chute = pop(f, CHUTE, 20);

  const endT = ip(f, [ENDING - 20, ENDING + 10], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        background:
          f < REENTRY
            ? "linear-gradient(#0b1240, #1d2a7a)"
            : `linear-gradient(${skyTop}, ${skyBot})`,
      }}
    >
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {f < REENTRY ? (
          <g>
            <Stars frame={f} scrollX={f * 3} seed="r" />
            <g
              transform={`translate(${ip(f, [0, REENTRY], [1750, 2100])} 200) scale(${ip(f, [0, REENTRY], [1, 0.4])})`}
            >
              <Moon x={0} y={0} r={70} frame={f} />
            </g>
            <Earth x={420} y={560} r={earthGrow} frame={f} />
            <g
              transform={`translate(${shipX} ${420 + Math.sin(f * 0.1) * 12}) rotate(-90) scale(0.4)`}
            >
              <Rocket x={0} y={0} stagesLeft={1} frame={f} flame={0.3} />
            </g>
          </g>
        ) : (
          <g>
            {/* くも が うえへ ながれる */}
            {[0, 1, 2, 3, 4].map((i) => (
              <Cloud
                key={i}
                x={200 + i * 380 + Math.sin(i) * 80}
                y={
                  ((((1200 - (f - REENTRY) * (f < CHUTE ? 8 : 3) - i * 260) %
                    1500) +
                    1500) %
                    1500) -
                  200
                }
                s={0.6 + random(`rc${i}`) * 0.5}
                opacity={0.4 + sky * 0.5}
              />
            ))}
            {/* うみ */}
            <g
              transform={`translate(0 ${ip(f, [CHUTE + 30, SPLASH], [400, 0], Easing.out(Easing.cubic))})`}
            >
              <rect x={0} y={830} width={1920} height={300} fill="#2f8cf0" />
              {[0, 1, 2].map((row) => (
                <path
                  key={row}
                  d={`M ${-200 + ((f * (2 + row)) % 200)} ${840 + row * 60} ${new Array(
                    14,
                  )
                    .fill(0)
                    .map(() => `q 50 -30 100 0 q 50 30 100 0`)
                    .join(" ")}`}
                  stroke="#ffffff"
                  strokeWidth={8}
                  fill="none"
                  opacity={0.5}
                />
              ))}
            </g>
            {/* ほのお（たいきけん とつにゅう） */}
            {heat > 0 ? (
              <g transform={`translate(960 ${capY})`} opacity={heat}>
                {[
                  { w: 190, d: 150, c: "#ff5d2a", o: 0.75, k: 1.3 },
                  { w: 140, d: 125, c: "#ffb627", o: 0.9, k: 1.9 },
                  { w: 100, d: 105, c: "#fff1b0", o: 0.9, k: 2.6 },
                ].map((l, i) => {
                  const w = l.w + Math.sin(f * l.k) * 10;
                  const tail = -380 - Math.sin(f * l.k * 0.7) * 30 + i * 90;
                  return (
                    <path
                      key={i}
                      d={`M ${-w} ${tail} Q ${-w} ${l.d} 0 ${l.d} Q ${w} ${l.d} ${w} ${tail} Q 0 ${tail + 160} ${-w} ${tail} Z`}
                      fill={l.c}
                      opacity={l.o}
                    />
                  );
                })}
              </g>
            ) : null}
            {f >= CHUTE ? (
              <>
                <Parachute
                  x={850}
                  y={capY - 230}
                  s={chute}
                  color="#ef476f"
                  sway={-12 + Math.sin(f * 0.05) * 4}
                />
                <Parachute
                  x={1070}
                  y={capY - 230}
                  s={chute}
                  color="#ff9f1c"
                  sway={12 + Math.sin(f * 0.05 + 1) * 4}
                />
                <Parachute
                  x={960}
                  y={capY - 270}
                  s={chute}
                  color="#3a86ff"
                  sway={Math.sin(f * 0.05 + 2) * 4}
                />
              </>
            ) : null}
            <CapsuleOnly
              x={960}
              y={capY}
              s={1.1}
              rot={Math.sin(f * 0.07) * 6}
              frame={f}
            />
            {/* しぶき */}
            {f >= SPLASH
              ? new Array(14).fill(0).map((_, i) => {
                  const age = f - SPLASH;
                  const ang = -Math.PI * (0.1 + 0.8 * random(`sp${i}`));
                  const v = 10 + random(`sv${i}`) * 8;
                  const x = 960 + Math.cos(ang) * v * age;
                  const y = 840 + Math.sin(ang) * v * age + 0.5 * age * age;
                  return y < 900 ? (
                    <circle key={i} cx={x} cy={y} r={14} fill="#bde7ff" />
                  ) : null;
                })
              : null}
            <Sfx
              text="あちちち！"
              x={1450}
              y={300}
              start={REENTRY + 15}
              end={CHUTE - 10}
              size={110}
              color="#ffe14d"
            />
            <Sfx
              text="ぱっ！"
              x={1400}
              y={260}
              start={CHUTE}
              end={CHUTE + 70}
              size={130}
              color="#ffffff"
            />
            <Sfx
              text="ざっぶーん"
              x={1400}
              y={600}
              start={SPLASH}
              end={ENDING - 10}
              size={110}
              color="#bde7ff"
            />
          </g>
        )}
        {/* ===== おしまい ===== */}
        {f >= ENDING - 20 ? (
          <g opacity={endT}>
            <rect x={0} y={0} width={1920} height={1080} fill="#0b1240" />
            <Stars frame={f} seed="e" />
            <g
              transform={`translate(560 620) scale(${pop(f, ENDING, 24)}) rotate(${Math.sin(f * 0.06) * 6})`}
            >
              <Earth x={0} y={0} r={200} frame={f} />
            </g>
            <g
              transform={`translate(1380 560) scale(${pop(f, ENDING + 10, 24)}) rotate(${Math.sin(f * 0.06 + 2) * 6})`}
            >
              <Moon x={0} y={0} r={140} frame={f} />
            </g>
            {/* ロケットが ぐるっと 8のじ */}
            {(() => {
              const a = (f - ENDING) * 0.045;
              const x = 970 + Math.sin(a) * 600;
              const y = 600 + Math.sin(a * 2) * 160;
              const dx = Math.cos(a) * 600;
              const dy = Math.cos(a * 2) * 320;
              const ang = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
              return (
                <Rocket
                  x={x}
                  y={y}
                  rotate={ang}
                  scale={0.22}
                  stagesLeft={1}
                  frame={f}
                  flame={0.6}
                />
              );
            })()}
          </g>
        ) : null}
      </svg>
      <Caption
        text="ちきゅうに かえろう"
        start={20}
        end={REENTRY - 5}
        position="top"
        size={96}
      />
      <Caption
        text="ただいま！"
        start={SPLASH + 15}
        end={ENDING - 25}
        position="top"
        size={130}
        color="#ffe14d"
      />
      <Caption
        text="またね！"
        start={ENDING + 40}
        end={S10_DURATION}
        position="top"
        size={150}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
