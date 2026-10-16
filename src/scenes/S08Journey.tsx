import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Astronaut, Earth, Moon, Stars } from "../components/Characters";
import { Rocket } from "../components/Rocket";
import { Caption, FONT, Sfx } from "../components/Caption";
import { ip, pop, quadBezier } from "../lib/anim";

export const S08_DURATION = 560;

const TRAVEL_END = 290;
const INSIDE = 300;

const Sun: React.FC<{
  x: number;
  y: number;
  s: number;
  n: number;
  frame: number;
}> = ({ x, y, s, n, frame }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${frame * 1.5})`}>
    {new Array(10).fill(0).map((_, i) => (
      <rect
        key={i}
        x={-8}
        y={-92}
        width={16}
        height={30}
        rx={8}
        fill="#ffb703"
        transform={`rotate(${i * 36})`}
      />
    ))}
    <circle r={58} fill="#ffd23f" stroke="#2b2b4a" strokeWidth={5} />
    <g transform={`rotate(${-frame * 1.5})`}>
      <text
        textAnchor="middle"
        dominantBaseline="central"
        style={{ fontFamily: FONT, fontWeight: 800, fontSize: 80 }}
        fill="#2b2b4a"
      >
        {n}
      </text>
    </g>
  </g>
);

export const S08Journey: React.FC = () => {
  const f = useCurrentFrame();
  const t = ip(f, [20, TRAVEL_END], [0, 1], Easing.inOut(Easing.sin));
  const p = quadBezier(t, [420, 640], [960, 330], [1500, 640]);
  const insideT = ip(
    f,
    [INSIDE - 20, INSIDE + 20],
    [0, 1],
    Easing.inOut(Easing.cubic),
  );
  const days = [0.2, 0.55, 0.9].map((d) => d * TRAVEL_END + 20);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#0b1240, #24166a)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <Stars frame={f} scrollX={-f * 2} seed="j" />
        {/* ===== たび ===== */}
        <g
          opacity={1 - insideT}
          transform={`translate(960 540) scale(${1 + insideT * 2}) translate(-960 -540)`}
        >
          <Earth x={220} y={700} r={150} frame={f} />
          <Moon
            x={1720}
            y={700}
            r={100}
            frame={f}
            mood={t > 0.85 ? "wow" : "smile"}
          />
          <path
            d="M 420 640 Q 960 330 1500 640"
            stroke="#ffffff"
            strokeWidth={5}
            strokeDasharray="8 18"
            strokeDashoffset={-f * 2}
            fill="none"
            opacity={0.5}
          />
          <Rocket
            x={p.x}
            y={p.y}
            rotate={p.angle}
            scale={0.32}
            stagesLeft={1}
            frame={f}
            flame={0.25 + Math.sin(f * 0.4) * 0.05}
          />
          {days.map((d, i) => (
            <Sun
              key={i}
              x={660 + i * 300}
              y={200 + Math.sin(f * 0.08 + i) * 10}
              s={pop(f, d, 18)}
              n={i + 1}
              frame={f}
            />
          ))}
        </g>
        {/* ===== うちゅうせんの なか ===== */}
        {f >= INSIDE - 20 ? (
          <g opacity={insideT}>
            <circle
              cx={960}
              cy={560}
              r={420}
              fill="#1b2050"
              stroke="#c9d3e6"
              strokeWidth={50}
            />
            <circle
              cx={960}
              cy={560}
              r={420}
              fill="none"
              stroke="#2b2b4a"
              strokeWidth={8}
            />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <circle
                key={i}
                cx={960 + Math.cos((i * Math.PI) / 4) * 420}
                cy={560 + Math.sin((i * Math.PI) / 4) * 420}
                r={12}
                fill="#8a93ad"
              />
            ))}
            <clipPath id="porthole">
              <circle cx={960} cy={560} r={396} />
            </clipPath>
            <g clipPath="url(#porthole)">
              <rect x={540} y={140} width={840} height={840} fill="#e8eef9" />
              {[0, 1, 2].map((i) => (
                <Astronaut
                  key={i}
                  x={760 + i * 200 + Math.sin(f * 0.04 + i * 2) * 40}
                  y={560 + Math.sin(f * 0.05 + i * 1.3) * 90}
                  rotate={f * (i === 1 ? -1 : 0.8) + i * 60}
                  scale={0.95}
                  frame={f + i * 30}
                  wave={i === 2}
                />
              ))}
              {/* ふわふわ うかぶ みず と パン */}
              <g
                transform={`translate(${880 + Math.sin(f * 0.06) * 60} ${330 + Math.cos(f * 0.05) * 40})`}
              >
                <circle r={34} fill="#7fd0ff" opacity={0.9} />
                <circle cx={-10} cy={-10} r={9} fill="#ffffff" opacity={0.8} />
              </g>
              <g
                transform={`translate(${1150 + Math.cos(f * 0.05) * 50} ${800 + Math.sin(f * 0.07) * 40}) rotate(${f * 2})`}
              >
                <rect
                  x={-45}
                  y={-30}
                  width={90}
                  height={60}
                  rx={20}
                  fill="#f4c27a"
                  stroke="#8d5a3b"
                  strokeWidth={5}
                />
              </g>
            </g>
          </g>
        ) : null}
        <Sfx
          text="ふわふわ〜"
          x={1520}
          y={260}
          start={INSIDE + 40}
          end={S08_DURATION}
          size={100}
          color="#bde7ff"
        />
      </svg>
      <Caption
        text="つきまで みっか かかるよ"
        start={40}
        end={INSIDE - 25}
        position="bottom"
        size={90}
      />
      <Caption
        text="うちゅうでは ふわふわ"
        start={INSIDE + 60}
        end={S08_DURATION}
        position="bottom"
        size={90}
      />
    </AbsoluteFill>
  );
};
