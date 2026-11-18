import React from "react";

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

/** こうえん */
export const ParkBg: React.FC<{ frame: number }> = ({ frame }) => (
  <g>
    <rect width={1920} height={1080} fill="#bfe8ff" />
    {[0, 1, 2].map((i) => (
      <g
        key={i}
        transform={`translate(${((i * 700 + frame * 0.4) % 2300) - 200} ${330 + (i % 2) * 90}) scale(${0.8 + (i % 2) * 0.3})`}
        opacity={0.9}
      >
        <ellipse cx={0} cy={20} rx={150} ry={40} fill="#fff" />
        <circle cx={-60} cy={0} r={50} fill="#fff" />
        <circle cx={10} cy={-20} r={65} fill="#fff" />
        <circle cx={75} cy={5} r={45} fill="#fff" />
      </g>
    ))}
    <ellipse cx={960} cy={1120} rx={1500} ry={380} fill="#9bd97c" />
    <ellipse cx={300} cy={1150} rx={900} ry={330} fill="#86cc68" />
  </g>
);

/** からだの そと（うえ）と なか（した）。splitY が ひふの たかさ */
export const BodyBg: React.FC<{ splitY: number; frame: number }> = ({
  splitY,
  frame,
}) => (
  <g>
    <rect width={1920} height={splitY} fill="#d4f0ff" />
    <rect y={splitY} width={1920} height={1080 - splitY} fill="#ffd6d6" />
    {new Array(9).fill(0).map((_, i) => (
      <circle
        key={i}
        cx={(i * 431 + 120) % 1920}
        cy={splitY + 110 + ((i * 197 + frame * 0.5) % (1080 - splitY - 80))}
        r={18 + (i % 3) * 10}
        fill="#ffe6e6"
        opacity={0.8}
      />
    ))}
  </g>
);
