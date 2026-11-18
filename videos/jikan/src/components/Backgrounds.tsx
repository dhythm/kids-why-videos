import React from "react";
import { INK } from "./Things";

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

/** おへや（あさ / よる）。まどの そとに おひさま か おつきさま */
export const RoomBg: React.FC<{ frame: number; night?: boolean }> = ({
  frame,
  night = false,
}) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#39407a" : "#ffe9c9"} />
    <rect y={800} width={1920} height={280} fill={night ? "#2a2f5e" : "#e9b98a"} />
    <rect y={792} width={1920} height={16} fill={night ? "#20244c" : "#c9935f"} />
    {/* まど */}
    <g transform="translate(250 330)">
      <rect
        x={-150}
        y={-150}
        width={300}
        height={300}
        rx={24}
        fill={night ? "#141a45" : "#bfe8ff"}
        stroke={INK}
        strokeWidth={10}
      />
      {night ? (
        <>
          <path
            d="M 20 -80 A 62 62 0 1 0 70 30 A 48 48 0 1 1 20 -80 Z"
            fill="#ffe680"
          />
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={-95 + i * 45}
              cy={-70 + ((i * 67) % 150)}
              r={6}
              fill="#fff"
              opacity={0.6 + 0.4 * Math.sin(frame * 0.12 + i * 2)}
            />
          ))}
        </>
      ) : (
        <g transform={`translate(40 -30) rotate(${frame * 0.5})`}>
          {new Array(8).fill(0).map((_, i) => (
            <rect
              key={i}
              x={-7}
              y={-92}
              width={14}
              height={30}
              rx={7}
              fill="#ffb703"
              transform={`rotate(${i * 45})`}
            />
          ))}
          <circle r={52} fill="#ffd60a" />
        </g>
      )}
      <line x1={0} y1={-150} x2={0} y2={150} stroke={INK} strokeWidth={8} />
      <line x1={-150} y1={0} x2={150} y2={0} stroke={INK} strokeWidth={8} />
    </g>
  </g>
);
