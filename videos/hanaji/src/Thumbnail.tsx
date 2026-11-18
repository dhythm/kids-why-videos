import React from "react";
import { AbsoluteFill } from "remotion";
import { FONT } from "./components/Caption";
import { DotsBg } from "./components/Backgrounds";
import { Fixer, SideHead } from "./components/Hanaji";
import { Sparkle } from "./components/Kid";

const Title: React.FC<{ text: string; y: number; color: string }> = ({ text, y, color }) => (
  <text
    x={960}
    y={y}
    textAnchor="middle"
    dominantBaseline="middle"
    style={{ fontFamily: FONT, fontWeight: 800, fontSize: 180 }}
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
      <ellipse cx={960} cy={1180} rx={1300} ry={330} fill="#fff6e0" />
      <SideHead x={1240} y={800} s={1.05} frame={0} mood="wow" bleed={1} />
      <Fixer x={430} y={800} s={1.7} frame={0} carry />
      <Sparkle x={700} y={640} s={1.2} />
      <Sparkle x={1680} y={620} s={1.0} color="#ffffff" />
      <Title text="はなぢは" y={170} color="#e5484d" />
      <Title text="どうして でるの？" y={390} color="#2f6fed" />
    </svg>
  </AbsoluteFill>
);
