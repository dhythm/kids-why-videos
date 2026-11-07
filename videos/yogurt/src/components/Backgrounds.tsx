import React from "react";

/** だいちょうの なか（ピンクの ひだ） */
export const ColonBg: React.FC<{ frame: number; dark?: number }> = ({
  frame,
  dark = 0,
}) => (
  <g>
    <rect width={1920} height={1080} fill="#ffc9d3" />
    {new Array(7).fill(0).map((_, i) => {
      const x = i * 320 - 60 + Math.sin(frame * 0.03 + i) * 10;
      return (
        <path
          key={i}
          d={`M ${x} -20 Q ${x + 90} 540 ${x} 1100`}
          stroke="#ffb0bf"
          strokeWidth={70}
          fill="none"
          strokeLinecap="round"
        />
      );
    })}
    <rect width={1920} height={60} fill="#f497ab" />
    <rect y={1020} width={1920} height={60} fill="#f497ab" />
    {dark > 0 ? (
      <rect width={1920} height={1080} fill="#2b1a3a" opacity={dark} />
    ) : null}
  </g>
);

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

/** トイレの へや（タイル） */
export const BathBg: React.FC = () => (
  <g>
    <rect width={1920} height={1080} fill="#dff3ff" />
    {new Array(12).fill(0).map((_, i) => (
      <path
        key={`v${i}`}
        d={`M ${i * 170} 0 L ${i * 170} 1080`}
        stroke="#c4e6fb"
        strokeWidth={6}
      />
    ))}
    {new Array(7).fill(0).map((_, i) => (
      <path
        key={`h${i}`}
        d={`M 0 ${i * 170} L 1920 ${i * 170}`}
        stroke="#c4e6fb"
        strokeWidth={6}
      />
    ))}
    <rect x={0} y={860} width={1920} height={220} fill="#a8d8f0" />
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
