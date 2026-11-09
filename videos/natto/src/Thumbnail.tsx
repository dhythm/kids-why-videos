import React from "react";
import { AbsoluteFill } from "remotion";
import { Kid } from "./components/Kid";
import { FONT } from "./components/Caption";
import { INK } from "./components/Things";
import {
  Chopsticks,
  NattoBowl,
  NattoKin,
  StickyThread,
} from "./components/Natto";

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
      <rect width={1920} height={1080} fill="#fff4dc" />
      {new Array(8).fill(0).map((_, i) => (
        <rect key={i} x={i * 260 - 40} y={0} width={130} height={1080} fill="#ffeac2" />
      ))}
      <ellipse cx={960} cy={1030} rx={1100} ry={170} fill="#e3a868" />

      <Kid x={520} y={760} s={0.85} frame={10} mood="wow" armUp={0.6} />
      <NattoBowl x={1380} y={880} s={1.1} foam={0.5} stir={0.6} />
      {[-2, -1, 0, 1, 2].map((i) => (
        <StickyThread
          key={i}
          a={{ x: 1380 + i * 60, y: 850 }}
          b={{ x: 1470 + i * 5, y: 560 }}
          length={360}
          base={7}
        />
      ))}
      <Chopsticks x={1470} y={560} s={0.7} rot={26} />
      <NattoKin x={1000} y={620} s={0.75} frame={10} rot={-12} />

      <Title text="なっとうは どうして" x={960} y={190} size={130} color="#c27a3a" />
      <Title text="ネバネバ？" x={960} y={370} size={170} color="#4f8fff" />
    </svg>
  </AbsoluteFill>
);
