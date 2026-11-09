import React from "react";

/** だいどころ（あさごはん） */
export const KitchenBg: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#fff1d6" />
    {new Array(8).fill(0).map((_, i) => (
      <rect
        key={i}
        x={i * 260 - 40}
        y={0}
        width={130}
        height={1080}
        fill="#ffe8bd"
      />
    ))}
    <rect x={0} y={760} width={1920} height={320} fill="#e3a868" />
    <rect x={0} y={740} width={1920} height={36} fill="#c98a4b" />
  </g>
);

/** やさしい みずたま もよう */
export const DotsBg: React.FC<{ color: string; dot: string }> = ({
  color,
  dot,
}) => (
  <g>
    <rect width={1920} height={1080} fill={color} />
    {new Array(24).fill(0).map((_, i) => (
      <circle
        key={i}
        cx={(i % 8) * 260 + (Math.floor(i / 8) % 2) * 130 + 60}
        cy={Math.floor(i / 8) * 380 + 140}
        r={28}
        fill={dot}
      />
    ))}
  </g>
);

/** けんびきょうで のぞいた ような まるい せかい（ふちは くらい） */
export const ZoomBg: React.FC<{ frame: number; color?: string }> = ({
  frame,
  color = "#fff4d8",
}) => (
  <g>
    <rect width={1920} height={1080} fill="#2b2b4a" />
    <circle cx={960} cy={540} r={900} fill={color} />
    {new Array(10).fill(0).map((_, i) => (
      <circle
        key={i}
        cx={(i * 397) % 1920}
        cy={((i * 233 + frame * 0.6) % 1180) - 50}
        r={14 + (i % 3) * 8}
        fill="#ffffff"
        opacity={0.35}
      />
    ))}
  </g>
);
