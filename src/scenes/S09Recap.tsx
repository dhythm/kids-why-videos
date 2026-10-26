import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import { EGG_D, Egg, Yolk } from "../components/Farm";
import { Caption, FONT } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S09_DURATION = 620;

const SWEEP = 40;
const SWEEP_END = 330;
const DAYS = 350;

/** 1にち（24じかん）の うちわけ */
const STEPS = [
  { label: "しろみ", hours: 3.5, color: "#bfe3ff" },
  { label: "かわ", hours: 1.5, color: "#d7c4ff" },
  { label: "から", hours: 19, color: "#ffd59e" },
];

const R = 210;

function arc(a0: number, a1: number, r: number): string {
  const p = (a: number) => [Math.sin(a) * r, -Math.cos(a) * r];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1}`;
}

const Icon: React.FC<{ i: number; f: number }> = ({ i, f }) => {
  if (i === 0) {
    return (
      <g>
        <path
          d={EGG_D}
          fill="#ffffff"
          stroke="#2b2b4a"
          strokeWidth={4}
          opacity={0.9}
        />
        <Yolk x={0} y={12} r={28} face={false} />
      </g>
    );
  }
  if (i === 1) {
    return (
      <g>
        <path d={EGG_D} fill="#efe6ff" stroke="#9b7bff" strokeWidth={6} />
        <Yolk x={0} y={12} r={28} face={false} />
      </g>
    );
  }
  return <Egg x={0} y={0} s={1} face frame={f} />;
};

export const S09Recap: React.FC = () => {
  const f = useCurrentFrame();
  const sweep = ip(f, [SWEEP, SWEEP_END], [0, 1], Easing.inOut(Easing.sin));
  const move = ip(f, [DAYS - 10, DAYS + 25], [0, 1]);
  const cx = 960 - move * 450;
  const cy = 640;
  const sc = 1 - move * 0.3;
  let acc = 0;
  const night = sweep > 0.25 && sweep < 0.85;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(#fff6dc, #ffe1ec)" }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {new Array(16).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={(random(`rx${i}`) * 1920 + f * 0.3) % 1920}
            cy={random(`ry${i}`) * 1080}
            r={10 + random(`rr${i}`) * 22}
            fill={["#ffd6a5", "#ffc8dd", "#cdeac0"][i % 3]}
            opacity={0.5}
          />
        ))}
        <g transform={`translate(${cx} ${cy}) scale(${sc * pop(f, 0, 20)})`}>
          <circle r={R} fill="#ffffff" stroke="#2b2b4a" strokeWidth={8} />
          {STEPS.map((st, i) => {
            const a0 = (acc / 24) * Math.PI * 2;
            acc += st.hours;
            const a1 = (acc / 24) * Math.PI * 2;
            const shown = Math.min(a1, Math.max(a0, sweep * Math.PI * 2));
            const mid = (a0 + a1) / 2;
            return (
              <g key={st.label}>
                {shown > a0 + 0.001 ? (
                  <path
                    d={arc(a0, shown, R - 40)}
                    stroke={st.color}
                    strokeWidth={64}
                    fill="none"
                  />
                ) : null}
                <g
                  transform={`translate(${Math.sin(i === 2 ? Math.PI * 1.1 : mid) * (R + 115)} ${-Math.cos(i === 2 ? Math.PI * 1.1 : mid) * (R + 115)}) scale(${pop(f, SWEEP + (a0 / (Math.PI * 2)) * (SWEEP_END - SWEEP), 16)})`}
                >
                  <Icon i={i} f={f} />
                  <text
                    y={100}
                    textAnchor="middle"
                    style={{ fontFamily: FONT, fontWeight: 800, fontSize: 52 }}
                    fill="#2b2b4a"
                    stroke="#ffffff"
                    strokeWidth={10}
                    paintOrder="stroke"
                  >
                    {st.label}
                  </text>
                </g>
              </g>
            );
          })}
          {/* はり */}
          <g transform={`rotate(${sweep * 360})`}>
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={-R + 30}
              stroke="#2b2b4a"
              strokeWidth={14}
              strokeLinecap="round"
            />
          </g>
          <circle
            r={70}
            fill={night ? "#2a2f6b" : "#ffd23f"}
            stroke="#2b2b4a"
            strokeWidth={6}
          />
          {night ? (
            <path
              d="M 12 -40 A 42 42 0 1 0 30 30 A 32 32 0 1 1 12 -40 Z"
              fill="#fff59d"
            />
          ) : (
            <circle r={36} fill="#fff3a6" />
          )}
          {/* きみ（スタート） */}
          <g transform={`translate(-150 ${-R - 30}) scale(${pop(f, 20, 16)})`}>
            <Yolk x={0} y={0} r={45} frame={f} />
          </g>
        </g>

        {/* まいにち ひとつ */}
        {[0, 1, 2].map((i) => {
          const st = DAYS + 30 + i * 45;
          const x = 1150 + i * 270;
          return (
            <g
              key={i}
              transform={`translate(${x} 600) scale(${pop(f, st, 16)})`}
            >
              <g transform="translate(0 -170)">
                {new Array(8).fill(0).map((_, k) => (
                  <rect
                    key={k}
                    x={-5}
                    y={-80}
                    width={10}
                    height={26}
                    rx={5}
                    fill="#ffd23f"
                    transform={`rotate(${k * 45 + f * 0.5})`}
                  />
                ))}
                <circle
                  r={50}
                  fill="#ffd23f"
                  stroke="#ffb627"
                  strokeWidth={6}
                />
              </g>
              <Egg x={0} y={60} s={1.3} face frame={f + i * 20} />
            </g>
          );
        })}
      </svg>
      <Caption
        text="きみ → しろみ → かわ → から"
        start={SWEEP}
        end={SWEEP_END - 5}
        position="top"
        size={84}
      />
      <Caption
        text="ぜんぶで いちにち くらい"
        start={SWEEP_END}
        end={DAYS + 20}
        position="top"
        size={92}
        color="#ffe14d"
      />
      <Caption
        text="だから いちにち ひとつ"
        start={DAYS + 25}
        end={S09_DURATION}
        position="top"
        size={92}
      />
    </AbsoluteFill>
  );
};
