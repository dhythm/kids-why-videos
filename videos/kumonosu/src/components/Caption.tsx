import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/MPLUSRounded1c";

const { fontFamily } = loadFont("normal", {
  weights: ["800"],
  ignoreTooManyRequestsWarning: true,
});

export const FONT = fontFamily;

/**
 * 大きな ひらがな のことば。start〜end のあいだ ぽよんと出て、ゆらゆら動く。
 * position: 画面の上 or 下（中央寄せで重ならないよう flex で配置）
 */
export const Caption: React.FC<{
  text: string;
  start: number;
  end: number;
  position?: "top" | "bottom" | "center";
  size?: number;
  color?: string;
  align?: "center" | "left" | "right";
}> = ({
  text,
  start,
  end,
  position = "top",
  size = 96,
  color = "#ffffff",
  align = "center",
}) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end) {
    return null;
  }
  const inP = interpolate(frame, [start, start + 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const outP = interpolate(frame, [end - 10, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const chars = Array.from(text);
  return (
    <AbsoluteFill
      style={{
        justifyContent:
          position === "top"
            ? "flex-start"
            : position === "bottom"
              ? "flex-end"
              : "center",
        alignItems:
          align === "left"
            ? "flex-start"
            : align === "right"
              ? "flex-end"
              : "center",
        padding: "90px 120px",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          fontFamily,
          fontWeight: 800,
          fontSize: size,
          color,
          letterSpacing: "0.04em",
          scale: String(inP * outP),
          opacity: outP,
          background: "rgba(20, 24, 60, 0.55)",
          borderRadius: 999,
          padding: `${size * 0.18}px ${size * 0.6}px`,
          WebkitTextStroke: `${Math.max(4, size * 0.06)}px #2b2b4a`,
          paintOrder: "stroke fill",
          whiteSpace: "nowrap",
          display: "flex",
        }}
      >
        {chars.map((c, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              translate: `0px ${Math.sin((frame - start) * 0.15 + i * 0.6) * size * 0.06}px`,
              whiteSpace: "pre",
            }}
          >
            {c}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/** ぽよんと出てくる ぎおんご（絵のそばに置く・SVG内） */
export const Sfx: React.FC<{
  text: string;
  x: number;
  y: number;
  start: number;
  end: number;
  size?: number;
  color?: string;
  rotate?: number;
}> = ({
  text,
  x,
  y,
  start,
  end,
  size = 110,
  color = "#ffe14d",
  rotate = -8,
}) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end) {
    return null;
  }
  const s = interpolate(frame, [start, start + 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.8, 0.64, 1),
  });
  const o = interpolate(frame, [end - 10, end], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wob = Math.sin((frame - start) * 0.25) * 4;
  return (
    <g
      transform={`translate(${x} ${y}) rotate(${rotate + wob}) scale(${s})`}
      opacity={o}
    >
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fontFamily, fontWeight: 800, fontSize: size }}
        fill={color}
        stroke="#2b2b4a"
        strokeWidth={size * 0.12}
        paintOrder="stroke"
        strokeLinejoin="round"
      >
        {text}
      </text>
    </g>
  );
};
