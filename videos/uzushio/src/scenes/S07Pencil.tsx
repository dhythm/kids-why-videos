import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Kid } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { Hand, PencilEnd, Pill, Whirl } from "../components/Things";
import { ip, pop } from "../lib/anim";

export const S07_DURATION = 520;

const TRY = 20; // えんぴつを はさんで
const SLIDE = 185; // まえと うしろに ずらして
const SAME = 300; // くるくる まわるね。おんなじ しくみ

const CX = 860;
const CY = 540;
const R = 70;

export const S07Pencil: React.FC = () => {
  const f = useCurrentFrame();
  const handsIn = pop(f, TRY + 10, 20);
  const amp = ip(f, [SLIDE, SLIDE + 30], [0, 150]);
  const d = Math.sin(Math.max(0, f - SLIDE) * 0.09) * amp;
  // ころがる: うえの てが みぎへ、したの てが ひだりへ → とけいまわり
  const rot = (d / R) * (180 / Math.PI);
  const same = pop(f, SAME + 70, 18);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#fff6dc" />
        {new Array(24).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={(i % 6) * 360 + (Math.floor(i / 6) % 2) * 180}
            cy={Math.floor(i / 6) * 300 + 90}
            r={20}
            fill="#ffe7a8"
          />
        ))}
        <g opacity={handsIn}>
          <Hand x={CX + d} y={CY - R - 70} />
          <PencilEnd x={CX} y={CY} r={R * handsIn} rot={rot} />
          <Hand x={CX - d} y={CY + R + 70} flip />
          {amp > 20 ? (
            <g
              stroke="#ff7b54"
              strokeWidth={12}
              strokeLinecap="round"
              fill="none"
            >
              <path
                d={`M ${CX - 120} ${CY - 250} l 240 0 m -30 -24 l 30 24 l -30 24`}
                opacity={d > 0 ? 1 : 0.25}
              />
              <path
                d={`M ${CX + 120} ${CY + 250} l -240 0 m 30 -24 l -30 24 l 30 24`}
                opacity={d > 0 ? 1 : 0.25}
              />
            </g>
          ) : null}
        </g>
        <Kid
          x={1620}
          y={640}
          s={0.75}
          frame={f}
          mood={f > SAME ? "wow" : "smile"}
          armUp={ip(f, [SAME + 70, SAME + 90], [0, 0.6])}
        />
        <Whirl x={1620} y={210} r={110 * same} frame={f} face speed={6} />
        <Pill
          text="おんなじ！"
          x={1240}
          y={210}
          s={same}
          frame={f}
          color="#ffe14d"
        />
        <Sfx
          text="くるくる"
          x={CX}
          y={900}
          start={SAME}
          end={S07_DURATION}
          size={120}
          color="#ff7b54"
          rotate={-4}
        />
      </svg>
      <Caption
        text="やってみよう！"
        start={TRY + 5}
        end={SAME - 5}
        position="top"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
