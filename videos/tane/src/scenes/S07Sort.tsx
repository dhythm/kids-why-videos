import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption } from "../components/Caption";
import {
  Cabbage,
  Carrot,
  Cucumber,
  Daikon,
  INK,
  Piman,
  Pill,
  Spinach,
  Tomato,
} from "../components/Things";
import { pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S07_DURATION = DURATIONS[6];

const LOOK = 20; // しらべてみよう
const MI = 110; // トマト、きゅうり、ピーマンは みを たべる
const MI_CUT = 200; // たねが ある
const HA = 280; // キャベツや ほうれんそうは はっぱ
const NE = 380; // にんじんや だいこんは ねっこ

const COLS = [
  { x: 360, title: "み", color: "#ff9a8a", bg: "#fff0ec" },
  { x: 960, title: "はっぱ", color: "#b6e59e", bg: "#eefbe6" },
  { x: 1560, title: "ねっこ", color: "#f3c98b", bg: "#fff5e3" },
];

export const S07Sort: React.FC = () => {
  const f = useCurrentFrame();
  const cut = f >= MI_CUT;
  const cutS = pop(f, MI_CUT, 14);
  const rowY = [470, 650, 830];
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#fffaf0" />
        {COLS.map((c, i) => {
          const s = pop(f, LOOK + 20 + i * 8);
          return (
            <g key={c.title} transform={`translate(${c.x} 640) scale(${s}) translate(${-c.x} -640)`}>
              <rect
                x={c.x - 270}
                y={300}
                width={540}
                height={700}
                rx={40}
                fill={c.bg}
                stroke={INK}
                strokeWidth={6}
              />
              <Pill text={c.title} x={c.x} y={300} s={1} size={80} color={c.color} frame={f} />
            </g>
          );
        })}

        {/* み */}
        <g>
          <Tomato x={250} y={rowY[0]} s={0.75 * pop(f, MI + 12)} />
          <Cucumber x={250} y={rowY[1]} s={0.55 * pop(f, MI + 30)} />
          <Piman x={250} y={rowY[2]} s={0.75 * pop(f, MI + 48)} />
          {cut ? (
            <>
              <Tomato x={470} y={rowY[0]} s={0.75 * cutS} cut />
              <Cucumber x={470} y={rowY[1]} s={0.85 * cutS} cut />
              <Piman x={470} y={rowY[2]} s={0.85 * cutS} cut />
            </>
          ) : null}
          <Pill text="たね ある！" x={360} y={960} s={pop(f, MI_CUT + 20)} size={48} color="#ffe14d" frame={f} />
        </g>

        {/* は */}
        <Cabbage x={960} y={510} s={1.05 * pop(f, HA + 10)} />
        <Spinach x={960} y={810} s={1.0 * pop(f, HA + 30)} />

        {/* ね */}
        <Carrot x={1440} y={660} s={1.05 * pop(f, NE + 15)} rot={-8} />
        <Daikon x={1680} y={650} s={0.95 * pop(f, NE + 40)} rot={6} />
      </svg>
      <Caption text="しらべてみよう！" start={LOOK + 5} end={MI - 5} position="top" size={96} color="#ffe14d" />
      <Caption text="みを たべる" start={MI + 10} end={HA - 5} position="top" size={86} />
      <Caption text="はっぱを たべる" start={HA + 5} end={NE - 5} position="top" size={86} />
      <Caption text="ねっこを たべる" start={NE + 5} end={S07_DURATION} position="top" size={86} />
    </AbsoluteFill>
  );
};
