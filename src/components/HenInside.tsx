import React from "react";
import { random } from "remotion";
import { DUCT_PATH, DUCT_SEGMENTS, GUT_PATH, OVARY, VENT } from "./Farm";

const INK = "#2b2b4a";

/** にわとりの おなかの なか（Hen の inside に わたす・ローカル座標） */
export const HenInside: React.FC<{
  frame: number;
  colored?: number; // 0..1 へやごとに いろを つける
  gut?: number; // 0..1 うんちの みち を みせる
  gutClosed?: number; // 0..1 うんちの みち が おやすみ
  ovary?: number; // 0..1
  ventGlow?: number;
}> = ({
  frame,
  colored = 0,
  gut = 0,
  gutClosed = 0,
  ovary = 1,
  ventGlow = 0,
}) => {
  const balls = [
    [0, 0, 26],
    [-30, -18, 14],
    [28, -22, 16],
    [-22, 22, 11],
    [30, 18, 12],
    [2, -36, 9],
    [-40, 6, 8],
    [44, -2, 7],
  ];
  return (
    <g>
      {/* うんちの みち */}
      {gut > 0 ? (
        <g opacity={gut}>
          <path
            d={GUT_PATH}
            stroke={INK}
            strokeWidth={34}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={GUT_PATH}
            stroke="#c68b59"
            strokeWidth={24}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      ) : null}
      {/* たまごの トンネル */}
      <path
        d={DUCT_PATH}
        stroke={INK}
        strokeWidth={38}
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={DUCT_PATH}
        stroke="#ff9eb5"
        strokeWidth={28}
        fill="none"
        strokeLinecap="round"
      />
      {colored > 0
        ? DUCT_SEGMENTS.map((sg) => (
            <path
              key={sg.key}
              d={sg.d}
              stroke={sg.color}
              strokeWidth={28}
              fill="none"
              opacity={colored}
            />
          ))
        : null}
      {/* うんちの みち は おやすみ（とおせんぼ） */}
      {gut > 0 && gutClosed > 0 ? (
        <g transform={`translate(-95 110) scale(${gutClosed})`}>
          <circle r={32} fill="#ff4d6d" stroke={INK} strokeWidth={5} />
          <path
            d="M -13 -13 L 13 13 M 13 -13 L -13 13"
            stroke="#ffffff"
            strokeWidth={8}
            strokeLinecap="round"
          />
        </g>
      ) : null}
      {/* きみの へや */}
      <g transform={`translate(${OVARY.x} ${OVARY.y}) scale(${ovary})`}>
        <ellipse
          cx={0}
          cy={0}
          rx={62}
          ry={52}
          fill="#ffd9e2"
          stroke={INK}
          strokeWidth={4}
        />
        {balls.map(([bx, by, r], i) => (
          <circle
            key={i}
            cx={bx}
            cy={by + Math.sin(frame * 0.1 + i) * 1.5}
            r={r}
            fill={i === 0 ? "#ffc93c" : "#ffe08a"}
            stroke={INK}
            strokeWidth={3}
          />
        ))}
      </g>
      {/* おしりの あな */}
      <circle
        cx={VENT.x}
        cy={VENT.y}
        r={16 + ventGlow * 10}
        fill="#fff59d"
        opacity={ventGlow * (0.6 + 0.4 * Math.sin(frame * 0.3))}
      />
      <circle cx={VENT.x} cy={VENT.y} r={9} fill={INK} />
      {/* ちいさな きらきら */}
      {new Array(6).fill(0).map((_, i) => (
        <circle
          key={i}
          cx={-120 + random(`hi${i}`) * 240}
          cy={-100 + random(`hj${i}`) * 200}
          r={3}
          fill="#fff"
          opacity={0.5 + 0.5 * Math.sin(frame * 0.1 + i)}
        />
      ))}
    </g>
  );
};
