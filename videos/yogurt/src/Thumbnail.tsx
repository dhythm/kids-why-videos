import React from "react";
import { AbsoluteFill } from "remotion";
import { Kid } from "./components/Kid";
import { FONT } from "./components/Caption";
import { INK } from "./components/Things";
import { Bifido, Bulgaricus, Thermo, YogurtCup } from "./components/Microbes";
import { Unchi } from "./components/Body";

const Title: React.FC<{
  text: string;
  x: number;
  y: number;
  size: number;
  color: string;
}> = ({ text, x, y, size, color }) => (
  <g>
    <text
      x={x + 8}
      y={y + 10}
      textAnchor="middle"
      style={{ fontFamily: FONT, fontWeight: 800, fontSize: size }}
      fill={INK}
      stroke={INK}
      strokeWidth={size * 0.2}
      strokeLinejoin="round"
    >
      {text}
    </text>
    <text
      x={x}
      y={y}
      textAnchor="middle"
      style={{ fontFamily: FONT, fontWeight: 800, fontSize: size }}
      fill={color}
      stroke="#ffffff"
      strokeWidth={size * 0.16}
      strokeLinejoin="round"
      paintOrder="stroke"
    >
      {text}
    </text>
  </g>
);

/** サムネイル（remotion still で かきだす） */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
      <rect width={1920} height={1080} fill="#eaf4ff" />
      {new Array(8).fill(0).map((_, i) => (
        <rect
          key={i}
          x={i * 260 - 40}
          y={0}
          width={130}
          height={1080}
          fill="#dcecff"
        />
      ))}
      <ellipse cx={960} cy={1010} rx={1100} ry={180} fill="#ffc9d3" />

      <YogurtCup x={380} y={960} s={1.5} />
      <Bifido x={640} y={620} s={0.95} frame={10} rot={12} />
      <Kid x={960} y={760} s={0.8} frame={10} mood="wow" armUp={0.6} />
      <Unchi x={1530} y={800} s={1.25} frame={10} />
      <Bulgaricus x={1320} y={530} s={0.6} frame={10} rot={-15} />
      <Thermo x={1700} y={540} s={0.55} frame={10} rot={12} />

      <Title text="ヨーグルトで" x={960} y={190} size={150} color="#4f8fff" />
      <Title
        text="うんち すっきり？"
        x={960}
        y={370}
        size={150}
        color="#c27a3a"
      />
    </svg>
  </AbsoluteFill>
);
