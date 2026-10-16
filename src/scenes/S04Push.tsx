import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import { Face, Puff } from "../components/Characters";
import { Rocket } from "../components/Rocket";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S04_DURATION = 680;

const RELEASE = 155;
const ROCKET_IN = 330;
const FIRE = 390;
const UP = 470;

const Arrow: React.FC<{
  x: number;
  y: number;
  dir: number;
  len: number;
  color: string;
  s: number;
}> = ({ x, y, dir, len, color, s }) => (
  <g transform={`translate(${x} ${y}) rotate(${dir}) scale(${s})`}>
    <rect
      x={0}
      y={-22}
      width={len - 50}
      height={44}
      rx={10}
      fill={color}
      stroke="#2b2b4a"
      strokeWidth={6}
    />
    <path
      d={`M ${len - 70} -60 L ${len + 10} 0 L ${len - 70} 60 Z`}
      fill={color}
      stroke="#2b2b4a"
      strokeWidth={6}
      strokeLinejoin="round"
    />
  </g>
);

/** ふうせん の いち（はなしたあと くねくね とんでいく） */
function balloonPos(f: number): { x: number; y: number; rot: number } {
  if (f < RELEASE) {
    return {
      x: 900,
      y: 560 + Math.sin(f * 0.08) * 12,
      rot: Math.sin(f * 0.05) * 4,
    };
  }
  const t = f - RELEASE;
  const x = 900 + t * 9 + t * t * 0.02;
  const y = 560 + Math.sin(t * 0.25) * 60 - t * 1.2;
  return { x, y, rot: Math.sin(t * 0.25) * 18 };
}

export const S04Push: React.FC = () => {
  const f = useCurrentFrame();
  const inflate =
    ip(f, [20, 110], [0.55, 1.05], Easing.out(Easing.quad)) +
    Math.sin(f * 0.3) * (f < 110 ? 0.01 : 0);
  const shrink = f < RELEASE ? 1 : ip(f, [RELEASE, RELEASE + 90], [1, 0.6]);
  const b = balloonPos(f);
  const balloonScale = pop(f, 0, 20) * inflate * shrink;

  const rocketEnter = ip(
    f,
    [ROCKET_IN, ROCKET_IN + 40],
    [1300, 0],
    Easing.out(Easing.back(1.3)),
  );
  const rise = f < UP ? 0 : (f - UP) * (f - UP) * 0.035;
  const flame = ip(f, [FIRE, FIRE + 15], [0, 1.1]);
  const rocketY =
    560 + rocketEnter - rise + (f > FIRE && f < UP ? Math.sin(f * 2.1) * 4 : 0);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#ffe8f1, #fff6d9)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {/* はいけいの もよう */}
        {new Array(18).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={(random(`bx${i}`) * 1920 + f * (0.3 + random(`bv${i}`))) % 1920}
            cy={random(`by${i}`) * 1080}
            r={10 + random(`br${i}`) * 26}
            fill={["#ffd1e1", "#d9f0ff", "#fff1a8"][i % 3]}
          />
        ))}

        {/* ===== ふうせん ===== */}
        {f < ROCKET_IN ? (
          <g>
            {/* ぷしゅー の くうき */}
            {f >= RELEASE
              ? new Array(16).fill(0).map((_, i) => {
                  const born = RELEASE + i * 6;
                  const age = f - born;
                  if (age < 0 || age > 45) {
                    return null;
                  }
                  const bp = balloonPos(born);
                  const k = age / 45;
                  return (
                    <Puff
                      key={i}
                      x={bp.x - 170 - age * 7}
                      y={bp.y + (random(`py${i}`) - 0.5) * 60 * k}
                      r={20 + k * 40}
                      color="#cfe9ff"
                      opacity={1 - k}
                    />
                  );
                })
              : null}
            <g
              transform={`translate(${b.x} ${b.y}) rotate(${b.rot}) scale(${balloonScale})`}
            >
              <path d="M -150 0 L -185 -22 L -185 22 Z" fill="#ef476f" />
              <ellipse
                cx={0}
                cy={0}
                rx={160}
                ry={125}
                fill="#ff6b8b"
                stroke="#2b2b4a"
                strokeWidth={6}
              />
              <ellipse
                cx={-40}
                cy={-60}
                rx={40}
                ry={18}
                fill="#ffffff"
                opacity={0.6}
                transform="rotate(-20 -40 -60)"
              />
              <g transform="translate(30 10)">
                <Face r={100} frame={f} mood={f >= RELEASE ? "wow" : "smile"} />
              </g>
            </g>
            {/* やじるし */}
            {f >= RELEASE + 20 && f < ROCKET_IN - 10 ? (
              <>
                <Arrow
                  x={760}
                  y={880}
                  dir={180}
                  len={300}
                  color="#7fd0ff"
                  s={pop(f, RELEASE + 20)}
                />
                <Arrow
                  x={1160}
                  y={880}
                  dir={0}
                  len={300}
                  color="#ff6b6b"
                  s={pop(f, RELEASE + 35)}
                />
              </>
            ) : null}
            <Sfx
              text="ふーっ"
              x={1200}
              y={280}
              start={25}
              end={110}
              size={110}
              color="#7fd0ff"
            />
            <Sfx
              text="ぷしゅーっ！"
              x={600}
              y={330}
              start={RELEASE}
              end={RELEASE + 90}
              size={120}
            />
          </g>
        ) : null}

        {/* ===== ロケット ===== */}
        {f >= ROCKET_IN ? (
          <g>
            {f >= FIRE
              ? new Array(24).fill(0).map((_, i) => {
                  const born = FIRE + i * 7;
                  const age = f - born;
                  if (age < 0 || age > 60) {
                    return null;
                  }
                  const k = age / 60;
                  const yBase =
                    560 +
                    300 -
                    (born >= UP ? (born - UP) * (born - UP) * 0.035 : 0);
                  return (
                    <Puff
                      key={i}
                      x={960 + (random(`rp${i}`) - 0.5) * 260 * k}
                      y={yBase + age * 6}
                      r={30 + k * 60}
                      color="#ffffff"
                      opacity={0.9 * (1 - k)}
                    />
                  );
                })
              : null}
            <Rocket x={960} y={rocketY} scale={0.9} frame={f} flame={flame} />
            {f >= FIRE + 10 ? (
              <Arrow
                x={1250}
                y={620}
                dir={90}
                len={280}
                color="#ff9f1c"
                s={
                  pop(f, FIRE + 10) *
                  ip(f, [S04_DURATION - 30, S04_DURATION], [1, 0])
                }
              />
            ) : null}
            {f >= UP ? (
              <Arrow
                x={670}
                y={760}
                dir={-90}
                len={420}
                color="#3a86ff"
                s={pop(f, UP)}
              />
            ) : null}
            <Sfx
              text="ぶわーっ"
              x={1460}
              y={840}
              start={FIRE + 10}
              end={S04_DURATION}
              size={110}
              color="#ff9f1c"
              rotate={8}
            />
            <Sfx
              text="びゅーん"
              x={400}
              y={470}
              start={UP + 10}
              end={S04_DURATION}
              size={110}
              color="#7fd0ff"
            />
          </g>
        ) : null}
      </svg>
      <Caption
        text="うしろに だすと まえに すすむ"
        start={RELEASE + 60}
        end={ROCKET_IN - 5}
        position="top"
        size={88}
      />
      <Caption
        text="したに だすと うえに すすむ！"
        start={UP + 60}
        end={S04_DURATION}
        position="top"
        size={88}
      />
    </AbsoluteFill>
  );
};
