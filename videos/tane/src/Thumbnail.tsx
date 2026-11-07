import React from "react";
import { AbsoluteFill } from "remotion";
import { Kid } from "./components/Kid";
import { FONT } from "./components/Caption";
import {
  INK,
  Negi,
  NegiBozu,
  PumpkinCut,
} from "./components/Things";

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
      <rect width={1920} height={1080} fill="#fff1d6" />
      {new Array(8).fill(0).map((_, i) => (
        <rect key={i} x={i * 260 - 40} y={0} width={130} height={1080} fill="#ffe8bd" />
      ))}
      <ellipse cx={960} cy={1000} rx={1100} ry={200} fill="#e3a868" />

      <PumpkinCut x={470} y={770} s={1.55} open={1} />
      <path d="M 1420 1000 L 1420 560" stroke="#4fae4a" strokeWidth={22} strokeLinecap="round" />
      <Negi x={1420} y={1010} s={0.9} green={260} />
      <NegiBozu x={1420} y={520} s={1.25} open={1} seeds={1} frame={0} />
      <Kid x={960} y={760} s={0.8} frame={10} mood="wow" armUp={0.6} />

      <Title text="かぼちゃには たね" x={960} y={190} size={150} color="#ff8c1a" />
      <Title text="ネギには？" x={960} y={370} size={150} color="#3d9a42" />
    </svg>
  </AbsoluteFill>
);
