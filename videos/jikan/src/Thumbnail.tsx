import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "./components/Caption";
import { DotsBg } from "./components/Backgrounds";
import { Kid, Sparkle } from "./components/Kid";
import { ClockChar, TimeBar } from "./components/Jikan";
import { INK } from "./components/Things";

const Title: React.FC<{ text: string; y: number; color: string }> = ({ text, y, color }) => (
  <text
    x={960}
    y={y}
    textAnchor="middle"
    dominantBaseline="middle"
    style={{ fontFamily: FONT, fontWeight: 800, fontSize: 170 }}
    fill={color}
    stroke="#ffffff"
    strokeWidth={34}
    paintOrder="stroke"
    strokeLinejoin="round"
  >
    {text}
  </text>
);

/** サムネイル（SVG で えがいた もの） */
export const Thumbnail: React.FC = () => (
  <AbsoluteFill>
    <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
      <DotsBg color="#bfe8ff" dot="#d6f1ff" />
      <ellipse cx={960} cy={1150} rx={1300} ry={330} fill="#fff6e0" />
      <Kid x={270} y={810} s={1.1} frame={0} mood="wow" />
      <ClockChar x={1560} y={700} s={1.5} frame={0} angle={60} />
      <TimeBar x={620} y={880} total={4} size={150} used={2.5} frame={0} />
      <Sparkle x={1130} y={730} s={1.3} />
      <Sparkle x={690} y={740} s={0.9} color="#ffffff" />
      <rect x={0} y={0} width={1920} height={1080} fill="none" stroke={INK} strokeWidth={0} />
      <Title text="あそぶ じかんは" y={190} color="#2f6fed" />
      <Title text="どこに いったの？" y={420} color="#ff7a1a" />
    </svg>
  </AbsoluteFill>
);
