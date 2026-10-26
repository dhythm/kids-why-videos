import React from "react";
import { getLength } from "@remotion/paths";
import { pointAt } from "../lib/path";
import { Face } from "./Characters";

/**
 * からだの ちず（しょうかかん）。画面 1920x1080 の まんなかに からだ。
 * ※ からだの ひだり（いぶくろ）は 見る人から みて みぎ。
 */
export const ORGAN_PATHS = {
  mouth: "M 960 300 L 960 330",
  esophagus: "M 960 330 C 960 400 975 450 990 500",
  stomach:
    "M 990 500 C 1000 470 1090 470 1100 530 C 1110 600 1060 640 1000 630 C 980 628 975 650 990 660",
  small:
    "M 990 660 C 1060 670 1060 700 990 705 C 900 710 900 735 990 740 C 1060 745 1060 770 990 775 C 900 780 900 805 990 810 C 1050 815 1000 840 900 845 C 870 846 860 840 850 840",
  large:
    "M 850 840 L 850 690 Q 850 660 880 660 L 1080 660 Q 1110 660 1110 690 L 1110 840 Q 1110 880 1040 885 L 960 890 L 960 940",
} as const;

export type Organ = keyof typeof ORGAN_PATHS;
export const ORGANS: Organ[] = [
  "mouth",
  "esophagus",
  "stomach",
  "small",
  "large",
];

export const FULL_PATH = ORGANS.map((o, i) =>
  i === 0 ? ORGAN_PATHS[o] : ORGAN_PATHS[o].replace(/^M [\d.]+ [\d.]+ /, ""),
).join(" ");
export const FULL_LENGTH = getLength(FULL_PATH);

export function pointOnTract(t: number): { x: number; y: number } {
  return pointAt(FULL_PATH, Math.max(0, Math.min(1, t)) * FULL_LENGTH);
}

const ORGAN_COLOR: Record<Organ, string> = {
  mouth: "#ff6b6b",
  esophagus: "#ff9f1c",
  stomach: "#ff5d8f",
  small: "#ffb627",
  large: "#a0673a",
};

export const BodyMap: React.FC<{
  frame: number;
  draw: number; // 0..1 くだを かく
  highlight?: Partial<Record<Organ, number>>;
  opacity?: number;
}> = ({ frame, draw, highlight = {}, opacity = 1 }) => {
  const len = FULL_LENGTH;
  return (
    <g opacity={opacity}>
      {/* からだ */}
      <rect
        x={740}
        y={380}
        width={440}
        height={560}
        rx={190}
        fill="#ffe3cf"
        stroke="#2b2b4a"
        strokeWidth={6}
      />
      <rect
        x={672}
        y={420}
        width={70}
        height={330}
        rx={35}
        fill="#ffe3cf"
        stroke="#2b2b4a"
        strokeWidth={6}
        transform="rotate(12 707 420)"
      />
      <rect
        x={1178}
        y={420}
        width={70}
        height={330}
        rx={35}
        fill="#ffe3cf"
        stroke="#2b2b4a"
        strokeWidth={6}
        transform="rotate(-12 1213 420)"
      />
      <rect x={930} y={330} width={60} height={70} fill="#ffe3cf" />
      <circle
        cx={960}
        cy={230}
        r={135}
        fill="#ffe3cf"
        stroke="#2b2b4a"
        strokeWidth={6}
      />
      <path
        d="M 825 220 Q 830 80 960 92 Q 1090 80 1095 220 Q 1040 160 960 165 Q 880 160 825 220 Z"
        fill="#5b3a29"
      />
      <g transform="translate(960 230)">
        <Face
          r={110}
          frame={frame}
          mood={draw > 0 && draw < 1 ? "wow" : "smile"}
        />
      </g>
      {/* くだ（したじ） */}
      <path
        d={FULL_PATH}
        stroke="#f2b8c0"
        strokeWidth={34}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.6}
      />
      {/* くだ（いろつき・かいていく） */}
      {(Object.keys(ORGAN_PATHS) as Organ[]).map((o) => (
        <path
          key={o}
          d={ORGAN_PATHS[o]}
          stroke={ORGAN_COLOR[o]}
          strokeWidth={26 + (highlight[o] ?? 0) * 14}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />
      ))}
      {/* かくまでは かくす */}
      <path
        d={FULL_PATH}
        stroke="#ffe3cf"
        strokeWidth={60}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={-len * draw}
      />
      {/* ひかる ところ */}
      {(Object.keys(ORGAN_PATHS) as Organ[]).map((o) =>
        (highlight[o] ?? 0) > 0 ? (
          <path
            key={`h${o}`}
            d={ORGAN_PATHS[o]}
            stroke="#fff59d"
            strokeWidth={60}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={(highlight[o] ?? 0) * 0.55}
          />
        ) : null,
      )}
    </g>
  );
};
