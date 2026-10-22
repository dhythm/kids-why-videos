// 背景・字幕・見出しなど、どのシーンでも使う部品
import { ReactNode } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
// macOS 標準の 丸ゴシック（Google Fonts の 日本語は ファイル数が 多く レンダーが 落ちるため）
export const fontFamily = '"Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN", "Hiragino Sans", sans-serif';

export const GROUND_Y = 880;

export function usePop(start: number, damping = 11) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - start, fps, config: { damping, stiffness: 160 } });
}

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill="#fff" opacity={0.95}>
      <ellipse cx={0} cy={0} rx={70} ry={38} />
      <ellipse cx={55} cy={-18} rx={55} ry={45} />
      <ellipse cx={110} cy={2} rx={62} ry={34} />
    </g>
  );
}

export function Scenery({ sky = ["#7CCBFF", "#DDF4FF"], ground = "#EDB56A", scroll = 0 }: {
  sky?: [string, string] | string[];
  ground?: string;
  scroll?: number;
}) {
  const frame = useCurrentFrame();
  const drift = (frame * 0.6) % 2400;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={sky[0]} />
          <stop offset="1" stopColor={sky[1]} />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#sky)" />
      <g transform={`translate(1700 170) rotate(${frame * 0.4})`}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={-8} y={-150} width={16} height={46} rx={8} fill="#FFD54A" transform={`rotate(${i * 30})`} />
        ))}
        <circle r={90} fill="#FFC928" />
      </g>
      <Cloud x={((300 - drift + 2400) % 2400) - 200} y={170} s={1.1} />
      <Cloud x={((1200 - drift + 2400) % 2400) - 200} y={110} s={0.8} />
      <Cloud x={((2000 - drift + 2400) % 2400) - 200} y={260} s={0.7} />
      <path d={`M 0 ${GROUND_Y - 90} Q 380 ${GROUND_Y - 210} 760 ${GROUND_Y - 90} T 1520 ${GROUND_Y - 90} T 2300 ${GROUND_Y - 90} V 1080 H 0 Z`} fill="#A8D47E" />
      <rect y={GROUND_Y} width={1920} height={1080 - GROUND_Y} fill={ground} />
      <rect y={GROUND_Y} width={1920} height={10} fill="#C98F45" />
      {Array.from({ length: 14 }, (_, i) => {
        const x = (((i * 160 - scroll) % 2240) + 2240) % 2240 - 160;
        return (
          <g key={i} transform={`translate(${x} ${GROUND_Y + 60 + (i % 3) * 45})`} fill="#C98F45">
            <ellipse rx={26} ry={8} />
          </g>
        );
      })}
    </svg>
  );
}

export function Subtitle({ text, start }: { text: string; start: number }) {
  const s = usePop(start, 14);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 34,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${(1 - s) * 40}px)`,
        opacity: s,
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: 54,
          color: "#3A2A1E",
          background: "rgba(255,255,255,0.94)",
          border: "6px solid #F29A4A",
          borderRadius: 40,
          padding: "14px 44px",
          maxWidth: 1700,
          textAlign: "center",
          lineHeight: 1.35,
        }}
      >
        {text}
      </div>
    </div>
  );
}

export function Badge({ children, start, color = "#FF7043" }: { children: ReactNode; start: number; color?: string }) {
  const s = usePop(start, 9);
  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        top: 60,
        fontFamily,
        fontWeight: 800,
        fontSize: 64,
        color: "#fff",
        background: color,
        padding: "16px 46px",
        borderRadius: 60,
        boxShadow: "0 10px 0 rgba(0,0,0,0.15)",
        transform: `scale(${s}) rotate(${interpolate(s, [0, 1], [-20, -4])}deg)`,
        transformOrigin: "left center",
      }}
    >
      {children}
    </div>
  );
}

export function Label({
  children, x, y, start, color = "#3A2A1E", bg = "#FFF6D6", size = 52,
}: {
  children: ReactNode; x: number; y: number; start: number; color?: string; bg?: string; size?: number;
}) {
  const s = usePop(start, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${s})`,
        fontFamily,
        fontWeight: 800,
        fontSize: size,
        color,
        background: bg,
        border: `5px solid ${color}`,
        borderRadius: 30,
        padding: "8px 30px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </div>
  );
}
