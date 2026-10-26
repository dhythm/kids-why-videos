import React from "react";
import { random } from "remotion";

/* ---------- かお（共通） ---------- */
export const Face: React.FC<{
  r: number;
  frame: number;
  mood?: "smile" | "wow" | "sleep";
  blinkOffset?: number;
}> = ({ r, frame, mood = "smile", blinkOffset = 0 }) => {
  // 約3秒ごとにまばたき
  const cycle = (frame + blinkOffset) % 90;
  const blink = cycle > 84 ? 0.15 : 1;
  const eyeX = r * 0.32;
  const eyeY = -r * 0.1;
  const eyeR = r * 0.09;
  return (
    <g>
      {mood === "sleep" ? (
        <>
          <path
            d={`M ${-eyeX - eyeR} ${eyeY} q ${eyeR} ${eyeR} ${eyeR * 2} 0`}
            stroke="#2b2b4a"
            strokeWidth={r * 0.04}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M ${eyeX - eyeR} ${eyeY} q ${eyeR} ${eyeR} ${eyeR * 2} 0`}
            stroke="#2b2b4a"
            strokeWidth={r * 0.04}
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <ellipse
            cx={-eyeX}
            cy={eyeY}
            rx={eyeR * 0.8}
            ry={eyeR * blink}
            fill="#2b2b4a"
          />
          <ellipse
            cx={eyeX}
            cy={eyeY}
            rx={eyeR * 0.8}
            ry={eyeR * blink}
            fill="#2b2b4a"
          />
          <circle
            cx={-eyeX + eyeR * 0.25}
            cy={eyeY - eyeR * 0.35}
            r={eyeR * 0.25 * blink}
            fill="#fff"
          />
          <circle
            cx={eyeX + eyeR * 0.25}
            cy={eyeY - eyeR * 0.35}
            r={eyeR * 0.25 * blink}
            fill="#fff"
          />
        </>
      )}
      <ellipse
        cx={-r * 0.5}
        cy={r * 0.15}
        rx={r * 0.12}
        ry={r * 0.07}
        fill="#ff8fa3"
        opacity={0.7}
      />
      <ellipse
        cx={r * 0.5}
        cy={r * 0.15}
        rx={r * 0.12}
        ry={r * 0.07}
        fill="#ff8fa3"
        opacity={0.7}
      />
      {mood === "wow" ? (
        <ellipse
          cx={0}
          cy={r * 0.22}
          rx={r * 0.09}
          ry={r * 0.12}
          fill="#2b2b4a"
        />
      ) : (
        <path
          d={`M ${-r * 0.16} ${r * 0.15} Q 0 ${r * 0.32} ${r * 0.16} ${r * 0.15}`}
          stroke="#2b2b4a"
          strokeWidth={r * 0.05}
          fill="none"
          strokeLinecap="round"
        />
      )}
    </g>
  );
};

/* ---------- ちきゅう ---------- */
export const Earth: React.FC<{
  x: number;
  y: number;
  r: number;
  frame: number;
  face?: boolean;
  mood?: "smile" | "wow" | "sleep";
  spin?: number;
}> = ({ x, y, r, frame, face = true, mood, spin = 0.4 }) => {
  const id = `earth-${Math.round(x)}-${Math.round(y)}-${Math.round(r)}`;
  const shift = ((frame * spin) % 200) / 100; // -1..1 の大陸スクロール
  const land = (ox: number) => (
    <g transform={`translate(${ox * r} 0)`}>
      <path
        d={`M ${-0.7 * r} ${-0.5 * r} q ${0.3 * r} ${-0.3 * r} ${0.5 * r} ${-0.05 * r} q ${0.15 * r} ${0.3 * r} ${-0.1 * r} ${0.45 * r} q ${-0.3 * r} ${0.15 * r} ${-0.45 * r} ${-0.1 * r} z`}
        fill="#5ccf6b"
      />
      <path
        d={`M ${0.2 * r} ${-0.2 * r} q ${0.35 * r} ${-0.1 * r} ${0.5 * r} ${0.2 * r} q ${0.05 * r} ${0.45 * r} ${-0.3 * r} ${0.55 * r} q ${-0.25 * r} ${-0.2 * r} ${-0.2 * r} ${-0.75 * r} z`}
        fill="#5ccf6b"
      />
      <path
        d={`M ${-0.55 * r} ${0.35 * r} q ${0.2 * r} ${-0.05 * r} ${0.3 * r} ${0.15 * r} q ${-0.05 * r} ${0.2 * r} ${-0.3 * r} ${0.1 * r} z`}
        fill="#5ccf6b"
      />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={id}>
          <circle r={r} />
        </clipPath>
        <radialGradient id={`${id}-g`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#6fc3ff" />
          <stop offset="100%" stopColor="#1f6fd1" />
        </radialGradient>
      </defs>
      <circle r={r * 1.12} fill="#7fd0ff" opacity={0.25} />
      <circle r={r} fill={`url(#${id}-g)`} />
      <g clipPath={`url(#${id})`}>
        {land(-shift * 2)}
        {land(-shift * 2 + 2)}
        {land(-shift * 2 - 2)}
        <ellipse
          cx={-0.2 * r}
          cy={-0.85 * r}
          rx={0.6 * r}
          ry={0.2 * r}
          fill="#fff"
          opacity={0.9}
        />
        <ellipse
          cx={0.1 * r}
          cy={0.92 * r}
          rx={0.6 * r}
          ry={0.15 * r}
          fill="#fff"
          opacity={0.9}
        />
      </g>
      {face ? <Face r={r} frame={frame} mood={mood} /> : null}
    </g>
  );
};

/* ---------- つき ---------- */
export const Moon: React.FC<{
  x: number;
  y: number;
  r: number;
  frame: number;
  face?: boolean;
  mood?: "smile" | "wow" | "sleep";
}> = ({ x, y, r, frame, face = true, mood }) => {
  const id = `moon-${Math.round(x)}-${Math.round(y)}-${Math.round(r)}`;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <radialGradient id={`${id}-g`} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#fff8d6" />
          <stop offset="100%" stopColor="#e4cf7a" />
        </radialGradient>
      </defs>
      <circle r={r * 1.25} fill="#fff6c2" opacity={0.18} />
      <circle r={r} fill={`url(#${id}-g)`} />
      <circle cx={-0.45 * r} cy={-0.45 * r} r={0.16 * r} fill="#d6bf63" />
      <circle cx={0.5 * r} cy={-0.5 * r} r={0.1 * r} fill="#d6bf63" />
      <circle cx={0.62 * r} cy={0.45 * r} r={0.14 * r} fill="#d6bf63" />
      <circle cx={-0.2 * r} cy={0.62 * r} r={0.09 * r} fill="#d6bf63" />
      {face ? <Face r={r} frame={frame} mood={mood} blinkOffset={40} /> : null}
    </g>
  );
};

/* ---------- ほし ---------- */
export const Stars: React.FC<{
  frame: number;
  count?: number;
  scrollY?: number;
  scrollX?: number;
  opacity?: number;
  seed?: string;
}> = ({
  frame,
  count = 140,
  scrollY = 0,
  scrollX = 0,
  opacity = 1,
  seed = "s",
}) => {
  const stars = [];
  for (let i = 0; i < count; i++) {
    const bx = random(`${seed}x${i}`) * 1920;
    const by = random(`${seed}y${i}`) * 1080;
    const depth = 0.3 + random(`${seed}d${i}`) * 0.7;
    const x = (((bx + scrollX * depth) % 1920) + 1920) % 1920;
    const y = (((by + scrollY * depth) % 1080) + 1080) % 1080;
    const tw = 0.5 + 0.5 * Math.sin(frame * 0.08 + i * 1.7);
    const big = random(`${seed}b${i}`) > 0.9;
    stars.push(
      big ? (
        <path
          key={i}
          d={`M ${x} ${y - 10} L ${x + 3} ${y - 3} L ${x + 10} ${y} L ${x + 3} ${y + 3} L ${x} ${y + 10} L ${x - 3} ${y + 3} L ${x - 10} ${y} L ${x - 3} ${y - 3} Z`}
          fill="#fff7b0"
          opacity={(0.5 + tw * 0.5) * opacity}
        />
      ) : (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={1.5 + depth * 2}
          fill="#fff"
          opacity={(0.3 + tw * 0.7) * opacity}
        />
      ),
    );
  }
  return <g>{stars}</g>;
};

/* ---------- うちゅうひこうし ---------- */
export const Astronaut: React.FC<{
  x: number;
  y: number;
  scale?: number;
  frame: number;
  rotate?: number;
  wave?: boolean;
  suitColor?: string;
}> = ({
  x,
  y,
  scale = 1,
  frame,
  rotate = 0,
  wave = false,
  suitColor = "#ffffff",
}) => {
  const armSwing = wave ? Math.sin(frame * 0.3) * 25 : 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {/* バックパック */}
      <rect x={-48} y={-10} width={96} height={80} rx={18} fill="#cfd8e6" />
      {/* あし */}
      <rect
        x={-34}
        y={70}
        width={26}
        height={44}
        rx={12}
        fill={suitColor}
        stroke="#b8c4d6"
        strokeWidth={3}
      />
      <rect
        x={8}
        y={70}
        width={26}
        height={44}
        rx={12}
        fill={suitColor}
        stroke="#b8c4d6"
        strokeWidth={3}
      />
      <ellipse cx={-21} cy={116} rx={18} ry={9} fill="#7a8599" />
      <ellipse cx={21} cy={116} rx={18} ry={9} fill="#7a8599" />
      {/* からだ */}
      <rect
        x={-40}
        y={0}
        width={80}
        height={84}
        rx={28}
        fill={suitColor}
        stroke="#b8c4d6"
        strokeWidth={3}
      />
      <rect x={-18} y={22} width={36} height={22} rx={6} fill="#ff6b6b" />
      {/* うで */}
      <g transform={`rotate(${-20 + armSwing} -38 14)`}>
        <rect
          x={-62}
          y={8}
          width={26}
          height={56}
          rx={13}
          fill={suitColor}
          stroke="#b8c4d6"
          strokeWidth={3}
        />
      </g>
      <g transform={`rotate(${wave ? -150 + armSwing : 20} 38 14)`}>
        <rect
          x={36}
          y={8}
          width={26}
          height={56}
          rx={13}
          fill={suitColor}
          stroke="#b8c4d6"
          strokeWidth={3}
        />
      </g>
      {/* ヘルメット */}
      <circle
        cx={0}
        cy={-38}
        r={50}
        fill={suitColor}
        stroke="#b8c4d6"
        strokeWidth={3}
      />
      <ellipse cx={0} cy={-36} rx={36} ry={30} fill="#ffd9b8" />
      <g transform="translate(0 -36)">
        <Face r={34} frame={frame} />
      </g>
      <ellipse cx={0} cy={-36} rx={38} ry={32} fill="#9fdcff" opacity={0.25} />
      <ellipse
        cx={-16}
        cy={-54}
        rx={12}
        ry={6}
        fill="#fff"
        opacity={0.7}
        transform="rotate(-25 -16 -54)"
      />
    </g>
  );
};

/* ---------- けむり・くも ---------- */
export const Puff: React.FC<{
  x: number;
  y: number;
  r: number;
  color?: string;
  opacity?: number;
}> = ({ x, y, r, color = "#ffffff", opacity = 1 }) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <circle cx={-r * 0.6} cy={r * 0.15} r={r * 0.65} fill={color} />
    <circle cx={r * 0.6} cy={r * 0.2} r={r * 0.6} fill={color} />
    <circle cx={0} cy={-r * 0.2} r={r * 0.8} fill={color} />
  </g>
);

export const Cloud: React.FC<{
  x: number;
  y: number;
  s: number;
  opacity?: number;
}> = ({ x, y, s, opacity = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <ellipse cx={0} cy={20} rx={150} ry={40} fill="#fff" />
    <circle cx={-60} cy={0} r={50} fill="#fff" />
    <circle cx={10} cy={-20} r={65} fill="#fff" />
    <circle cx={75} cy={5} r={45} fill="#fff" />
  </g>
);
