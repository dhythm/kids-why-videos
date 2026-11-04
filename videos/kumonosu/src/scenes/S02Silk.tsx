import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { Arrow, INK, Pill, Spider } from "../components/Things";
import { ip, pop } from "../lib/anim";

export const S02_DURATION = 480;

const SILK_T = 20; // くもの いとで できている
const BUTT = 140; // おしりの さきから
const LIQUID = 270; // とろとろ → いと

// くもは よこむき（あたまが ひだり、おしりが みぎ）
const SX = 640;
const SY = 560;
const S = 2.2;

export const S02Silk: React.FC = () => {
  const f = useCurrentFrame();
  const pull = ip(f, [BUTT + 20, BUTT + 120], [0, 1]);
  // rotate(-90) で おしりの さき（0,140）が みぎを むく → いとは みぎへ のびる
  const tipR = { x: SX + 140 * S, y: SY };
  const len = pull * 620;
  const wave = ip(f, [LIQUID + 60, LIQUID + 120], [1, 0]);
  const pts: string[] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const xx = tipR.x + t * len;
    const yy = tipR.y + Math.sin(t * 12 - f * 0.3) * 18 * wave * t;
    pts.push(`${xx.toFixed(1)} ${yy.toFixed(1)}`);
  }
  const cut = ip(f, [LIQUID, LIQUID + 20], [0, 1]);
  const ping = pop(f, LIQUID + 130, 16);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#fff6dc" />
        {new Array(20).fill(0).map((_, i) => (
          <circle key={i} cx={(i % 5) * 420 + (Math.floor(i / 5) % 2) * 210} cy={Math.floor(i / 5) * 290 + 90} r={18} fill="#ffe7a8" />
        ))}
        {len > 4 ? (
          <path d={`M ${pts.join(" L ")}`} stroke="#ffffff" strokeWidth={14} fill="none" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px rgba(80,80,140,0.6))" }} />
        ) : null}
        <Spider x={SX} y={SY} s={S} rotate={-90} frame={f} />
        {/* からだの なかの とろとろ（きりくち） */}
        {cut > 0 ? (
          <g opacity={cut}>
            <ellipse cx={SX + 70 * S} cy={SY} rx={48 * S} ry={40 * S} fill="#ffffff" stroke={INK} strokeWidth={6} strokeDasharray="18 12" />
            {[0, 1, 2, 3, 4].map((i) => (
              <circle
                key={i}
                cx={SX + 70 * S + Math.cos(f * 0.08 + i * 1.3) * 50}
                cy={SY + Math.sin(f * 0.1 + i * 2) * 40}
                r={20 + 6 * Math.sin(f * 0.12 + i)}
                fill="#bfe6ff"
                stroke="#6fb8e6"
                strokeWidth={4}
              />
            ))}
          </g>
        ) : null}
        {pull > 0.05 && f < LIQUID ? <Arrow x1={tipR.x + 40} y1={SY - 110} x2={tipR.x + 240} y2={SY - 110} /> : null}
        <Pill text="とろとろ" x={SX + 70 * S} y={SY - 230} s={pop(f, LIQUID + 10, 16)} frame={f} color="#bfe6ff" />
        <Pill text="ぴーん！" x={1560} y={SY - 140} s={ping} frame={f} color="#ffe14d" />
        <Sfx text="にゅーっ" x={1450} y={SY + 160} start={BUTT + 30} end={LIQUID - 5} size={100} color="#ffffff" rotate={-6} />
      </svg>
      <Caption text="くもの いと" start={SILK_T + 5} end={BUTT - 5} position="top" size={110} color="#ffe14d" />
      <Caption text="おしりから いと！" start={BUTT + 5} end={LIQUID - 5} position="top" size={100} />
      <Caption text="ほそくて じょうぶ" start={LIQUID + 140} end={S02_DURATION} position="bottom" size={90} />
    </AbsoluteFill>
  );
};
