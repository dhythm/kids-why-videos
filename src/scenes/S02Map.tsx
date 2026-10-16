import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { BodyMap, Organ, ORGANS, pointOnTract } from "../components/BodyMap";
import { Bus } from "../components/Food";
import { Caption, FONT } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S02_DURATION = 600;

const DRAW_START = 25;
const DRAW_END = 165;
const LABEL_START = 190;
const LABEL_EVERY = 28;
const UNROLL = 360;

const LABELS: Record<Organ, { text: string; x: number; y: number }> = {
  mouth: { text: "くち", x: 640, y: 300 },
  esophagus: { text: "しょくどう", x: 640, y: 450 },
  stomach: { text: "いぶくろ", x: 1320, y: 520 },
  small: { text: "しょうちょう", x: 1340, y: 760 },
  large: { text: "だいちょう", x: 560, y: 760 },
};

export const S02Map: React.FC = () => {
  const f = useCurrentFrame();
  const draw = ip(f, [DRAW_START, DRAW_END], [0, 1], Easing.inOut(Easing.sin));
  const ball = pointOnTract(draw);
  const highlight: Partial<Record<Organ, number>> = {};
  ORGANS.forEach((o, i) => {
    const s = LABEL_START + i * LABEL_EVERY;
    highlight[o] =
      ip(f, [s, s + 10], [0, 1]) *
      ip(f, [s + LABEL_EVERY + 10, s + LABEL_EVERY + 20], [1, 0.25]);
  });
  const mapOut = ip(f, [UNROLL, UNROLL + 30], [1, 0]);
  const lineGrow = ip(
    f,
    [UNROLL + 20, UNROLL + 110],
    [0, 1],
    Easing.inOut(Easing.cubic),
  );
  const busIn = ip(
    f,
    [UNROLL + 100, UNROLL + 150],
    [-1800, 0],
    Easing.out(Easing.back(1.2)),
  );
  const LINE_W = 1500;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#e8f6ff, #fff3d6)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {mapOut > 0 ? (
          <g
            opacity={mapOut}
            transform={`translate(960 540) scale(${0.95 + mapOut * 0.05}) translate(-960 -540)`}
          >
            <BodyMap frame={f} draw={draw} highlight={highlight} />
            {/* たびする ごはんつぶ */}
            {f >= DRAW_START && f <= DRAW_END + 10 ? (
              <g transform={`translate(${ball.x} ${ball.y})`}>
                <circle r={26} fill="#fff59d" opacity={0.6} />
                <circle
                  r={15}
                  fill="#ffffff"
                  stroke="#2b2b4a"
                  strokeWidth={4}
                />
              </g>
            ) : null}
            {ORGANS.map((o, i) => {
              const l = LABELS[o];
              const s = pop(f, LABEL_START + i * LABEL_EVERY, 16);
              return s > 0 ? (
                <g
                  key={o}
                  transform={`translate(${l.x} ${l.y + Math.sin(f * 0.1 + i) * 6}) scale(${s})`}
                >
                  <rect
                    x={-l.text.length * 30 - 30}
                    y={-45}
                    width={l.text.length * 60 + 60}
                    height={90}
                    rx={45}
                    fill="#ffffff"
                    stroke="#2b2b4a"
                    strokeWidth={5}
                  />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56 }}
                    fill="#2b2b4a"
                  >
                    {l.text}
                  </text>
                </g>
              ) : null;
            })}
          </g>
        ) : null}
        {/* まっすぐ のばすと… */}
        {f >= UNROLL + 20 ? (
          <g>
            <rect x={-20} y={820} width={1960} height={300} fill="#bfe3a5" />
            <rect x={-20} y={810} width={1960} height={24} fill="#8ac06b" />
            <path
              d={`M 210 370 L ${210 + LINE_W * lineGrow} 370`}
              stroke="#ff9fb2"
              strokeWidth={60}
              strokeLinecap="round"
            />
            <path
              d={`M 210 370 L ${210 + LINE_W * lineGrow} 370`}
              stroke="#ff7096"
              strokeWidth={60}
              strokeLinecap="round"
              strokeDasharray="10 40"
              strokeDashoffset={-f * 3}
              opacity={0.6}
            />
            <g transform={`translate(${busIn} 0)`}>
              <Bus x={190} y={810} w={1540} frame={f} />
            </g>
          </g>
        ) : null}
      </svg>
      <Caption
        text="ながーい トンネル"
        start={30}
        end={LABEL_START - 10}
        position="top"
        size={96}
      />
      <Caption
        text="バスくらい ながい！"
        start={UNROLL + 140}
        end={S02_DURATION}
        position="top"
        size={110}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
