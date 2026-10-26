import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Earth, Moon, Stars } from "../components/Characters";
import { Rocket } from "../components/Rocket";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop, quadBezier } from "../lib/anim";

export const S01_DURATION = 350;

export const S01Intro: React.FC = () => {
  const f = useCurrentFrame();
  // カメラがゆっくり寄る
  const cam = ip(f, [0, S01_DURATION], [1.08, 1], Easing.out(Easing.quad));
  const earthS = pop(f, 10, 24);
  const moonS = pop(f, 40, 24);
  // ロケットが ぐるっと まわって とうじょう
  const t = ip(f, [70, 190], [0, 1], Easing.inOut(Easing.quad));
  const p =
    t < 0.5
      ? quadBezier(t * 2, [200, 1250], [600, 300], [1000, 560])
      : quadBezier((t - 0.5) * 2, [1000, 560], [1400, 820], [960, 700]);
  const settle = ip(f, [190, 230], [0, 1]);
  const rx = f < 190 ? p.x : 960;
  const ry = f < 190 ? p.y : 700 + Math.sin(f * 0.08) * 14;
  const rot =
    f < 190 ? p.angle : (1 - settle) * p.angle + Math.sin(f * 0.06) * 4;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(#0b1240, #2a1b6b)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g transform={`translate(960 540) scale(${cam}) translate(-960 -540)`}>
          <Stars frame={f} scrollX={f * 0.6} />
          <g
            transform={`translate(380 780) scale(${earthS}) rotate(${Math.sin(f * 0.04) * 4})`}
          >
            <Earth x={0} y={0} r={250} frame={f} />
          </g>
          <g
            transform={`translate(1560 300) scale(${moonS}) rotate(${Math.sin(f * 0.05 + 1) * 6})`}
          >
            <Moon x={0} y={0} r={150} frame={f} />
          </g>
          {f > 70 ? (
            <Rocket
              x={rx}
              y={ry}
              rotate={rot}
              scale={0.85}
              frame={f}
              flame={0.7 + Math.sin(f * 0.3) * 0.1}
            />
          ) : null}
          <Sfx
            text="びゅーん"
            x={1300}
            y={820}
            start={110}
            end={180}
            size={100}
          />
          {/* ハートとキラキラ */}
          {[0, 1, 2].map((i) => {
            const s = pop(f, 230 + i * 8, 14);
            return (
              <g
                key={i}
                transform={`translate(${1250 + i * 70} ${420 - i * 40 + Math.sin(f * 0.1 + i) * 10}) scale(${s})`}
              >
                <path
                  d="M 0 -24 L 7 -7 L 24 0 L 7 7 L 0 24 L -7 7 L -24 0 L -7 -7 Z"
                  fill="#ffe14d"
                />
              </g>
            );
          })}
        </g>
      </svg>
      <Caption
        text="ロケットで つきへ いこう！"
        start={210}
        end={S01_DURATION}
        position="top"
        align="left"
        size={92}
      />
    </AbsoluteFill>
  );
};
