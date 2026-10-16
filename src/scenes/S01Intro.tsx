import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import { Kid, Onigiri, Sparkle, Unchi } from "../components/Food";
import { Caption, FONT, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S01_DURATION = 560;

const BITES = [45, 85, 125];
const EATEN = 160;
const QUESTION = 185;
const REVEAL = 360;

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  const bites = BITES.filter((b) => f >= b).length;
  const chewing = f > 40 && f < EATEN + 20;
  const mood = chewing
    ? Math.floor(f / 6) % 2 === 0
      ? "wow"
      : "smile"
    : "smile";
  // おにぎりを くちへ はこぶ
  const near = BITES.some((b) => f > b - 12 && f < b + 6);
  const oniX = 1200 - (near ? 90 : 0);
  const oniY = 560 - (near ? 140 : 0);
  const oniS = f < EATEN ? 1 : ip(f, [EATEN, EATEN + 15], [1, 0]);

  // ごはんが おなかへ（ひかる つぶ）
  const swallowT = ip(
    f,
    [EATEN, EATEN + 40],
    [0, 1],
    Easing.inOut(Easing.quad),
  );
  const kidShift = ip(
    f,
    [REVEAL - 20, REVEAL + 20],
    [0, -380],
    Easing.inOut(Easing.cubic),
  );

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#fff3d6, #ffe1ec)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {/* はいけいの みずたま */}
        {new Array(20).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={
              (random(`ix${i}`) * 1920 + f * (0.2 + random(`iv${i}`) * 0.5)) %
              1920
            }
            cy={random(`iy${i}`) * 1080}
            r={12 + random(`ir${i}`) * 28}
            fill={["#ffd6a5", "#ffc8dd", "#cdeac0"][i % 3]}
            opacity={0.6}
          />
        ))}
        {/* テーブル */}
        <rect x={-20} y={860} width={1960} height={260} fill="#e0a96d" />
        <rect x={-20} y={860} width={1960} height={22} fill="#c98b4f" />

        <g transform={`translate(${kidShift} 0)`}>
          <Kid
            x={960}
            y={600 + Math.sin(f * 0.08) * 6}
            s={1.5}
            frame={f}
            mood={mood}
            tummyGlow={
              f > EATEN + 20 && f < REVEAL ? 0.5 + Math.sin(f * 0.2) * 0.3 : 0
            }
          />
          {f < EATEN + 15 ? (
            <Onigiri
              x={oniX}
              y={oniY}
              s={0.85 * oniS * pop(f, 5, 20)}
              frame={f}
              bites={bites}
              rotate={-10}
            />
          ) : null}
          {/* のみこんだ ごはんつぶ */}
          {f >= EATEN && f < EATEN + 45 ? (
            <circle
              cx={960}
              cy={ip(swallowT, [0, 1], [400, 620])}
              r={18}
              fill="#ffffff"
              stroke="#2b2b4a"
              strokeWidth={4}
            />
          ) : null}
          {/* はてな */}
          {f >= QUESTION && f < REVEAL + 10
            ? [0, 1, 2].map((i) => (
                <g
                  key={i}
                  transform={`translate(${1230 + i * 90} ${330 - i * 60 + Math.sin(f * 0.12 + i) * 14}) scale(${pop(f, QUESTION + 10 + i * 12, 16)}) rotate(${Math.sin(f * 0.1 + i) * 12})`}
                >
                  <text
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontFamily: FONT,
                      fontWeight: 800,
                      fontSize: 130 + i * 20,
                    }}
                    fill="#ff5d8f"
                    stroke="#2b2b4a"
                    strokeWidth={12}
                    paintOrder="stroke"
                  >
                    ?
                  </text>
                </g>
              ))
            : null}
        </g>

        {/* うんち とうじょう */}
        {f >= REVEAL ? (
          <g>
            <g
              transform={`translate(1260 640) scale(${pop(f, REVEAL + 10, 24)})`}
            >
              <circle
                r={260}
                fill="#fff59d"
                opacity={0.5 + Math.sin(f * 0.15) * 0.1}
              />
              {new Array(12).fill(0).map((_, i) => (
                <rect
                  key={i}
                  x={-8}
                  y={-330}
                  width={16}
                  height={60}
                  rx={8}
                  fill="#ffd23f"
                  transform={`rotate(${i * 30 + f * 0.8})`}
                />
              ))}
            </g>
            <Unchi
              x={1260}
              y={660 + Math.sin(f * 0.15) * 10}
              s={1.4 * pop(f, REVEAL + 15, 22)}
              frame={f}
              squash={1 + Math.sin(f * 0.25) * 0.05}
            />
            {[0, 1, 2, 3].map((i) => (
              <Sparkle
                key={i}
                x={1260 + Math.cos(i * 1.7) * 230}
                y={600 + Math.sin(i * 2.3) * 200}
                s={
                  pop(f, REVEAL + 30 + i * 6, 14) *
                  (0.8 + Math.sin(f * 0.2 + i) * 0.2)
                }
              />
            ))}
          </g>
        ) : null}
        <Sfx
          text="もぐもぐ"
          x={1400}
          y={280}
          start={50}
          end={EATEN + 10}
          size={110}
        />
        <Sfx
          text="ぽんっ！"
          x={1650}
          y={330}
          start={REVEAL + 15}
          end={REVEAL + 90}
          size={120}
        />
      </svg>
      <Caption
        text="いただきまーす！"
        start={10}
        end={EATEN - 30}
        position="top"
        size={100}
      />
      <Caption
        text="ごはんは どこへ？"
        start={QUESTION + 10}
        end={REVEAL - 10}
        position="top"
        align="left"
        size={96}
      />
      <Caption
        text="うんちに なるの!?"
        start={REVEAL + 40}
        end={S01_DURATION}
        position="top"
        align="right"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
