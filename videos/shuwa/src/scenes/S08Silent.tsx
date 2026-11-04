import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { INK, Person } from "../components/Person";
import { FRIEND, ME } from "../components/cast";
import { Caption, Sfx } from "../components/Caption";
import { BigO, BigX, Eye, HandIcon, Train, WindowFrame } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { chatSign, poseAt } from "../lib/signs";

export const S08_DURATION = 380;

const EYES = 20; // 目で 見る ことばだから、音が なくても つたわる
const PLACES = 175; // うるさい ところや、まどの むこうにも

const chat = (f: number, seed: number) => poseAt(chatSign(9999, seed), f);

export const S08Silent: React.FC = () => {
  const f = useCurrentFrame();
  const partA = ip(f, [PLACES - 15, PLACES + 5], [1, 0]);
  const p1 = pop(f, PLACES + 5, 20);
  const p2 = pop(f, PLACES + 60, 20);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#e6fbf4" />
        <g opacity={partA}>
          {/* おと → ばつ */}
          <g transform={`translate(560 540) scale(${pop(f, EYES + 5, 18)})`}>
            <circle r={170} fill="#fff" stroke={INK} strokeWidth={9} />
            <g fill="#ff7b54" stroke={INK} strokeWidth={6}>
              <path d="M -10 50 L -10 -90 L 70 -110 L 70 30" fill="none" strokeWidth={14} stroke="#ff7b54" strokeLinejoin="round" />
              <ellipse cx={-40} cy={55} rx={38} ry={28} transform="rotate(-20 -40 55)" />
              <ellipse cx={40} cy={35} rx={38} ry={28} transform="rotate(-20 40 35)" />
            </g>
          </g>
          <BigX x={560} y={540} s={0.9} p={ip(f, [EYES + 40, EYES + 60], [0, 1])} />
          {/* め + て → まる */}
          <g transform={`translate(1360 540) scale(${pop(f, EYES + 70, 18)})`}>
            <circle r={170} fill="#fff" stroke={INK} strokeWidth={9} />
            <Eye x={0} y={-50} s={0.65} frame={f} />
            <HandIcon x={-45} y={95} s={0.55} rotate={-15} />
            <HandIcon x={45} y={95} s={0.55} rotate={15} />
          </g>
          <BigO x={1360} y={540} s={1.45} p={ip(f, [EYES + 95, EYES + 120], [0, 1])} />
        </g>
        {/* うるさい ところ */}
        <g transform={`translate(500 560) scale(${p1})`} opacity={p1 > 0 ? 1 : 0}>
          <rect x={-400} y={-360} width={800} height={700} rx={40} fill="#fff6dc" stroke={INK} strokeWidth={9} />
          <Train x={-380 + ((f * 6) % 120) - 60} y={-120} s={0.9} frame={f} />
          <g transform="translate(-150 180) scale(0.55)">
            <Person x={0} y={0} frame={f} pose={chat(f, 1)} mood="laugh" {...ME} />
          </g>
          <g transform="translate(150 180) scale(0.55)">
            <Person x={0} y={0} frame={f} pose={chat(f, 4)} mood="smile" {...FRIEND} />
          </g>
        </g>
        {p1 > 0.5 ? <Sfx text="ガタン ゴトン" x={500} y={250} start={PLACES + 10} end={S08_DURATION} size={80} color="#ff7b54" rotate={-5} /> : null}
        {/* まどの むこう */}
        <g transform={`translate(1420 560) scale(${p2})`} opacity={p2 > 0 ? 1 : 0}>
          <rect x={-400} y={-360} width={800} height={700} rx={40} fill="#e0f0ff" stroke={INK} strokeWidth={9} />
          <rect x={0} y={-360} width={400} height={700} rx={0} fill="#c9f0c0" />
          <g transform="translate(-200 170) scale(0.55)">
            <Person x={0} y={0} frame={f} pose={chat(f, 2)} mood="laugh" {...ME} />
          </g>
          <g transform="translate(200 170) scale(0.55)">
            <Person x={0} y={0} frame={f} pose={chat(f, 6)} mood="laugh" {...FRIEND} />
          </g>
          <WindowFrame x={0} y={-20} w={150} h={600} />
        </g>
      </svg>
      <Caption text="おとが なくても つたわる" start={EYES + 10} end={PLACES - 10} position="top" size={96} color="#ffe14d" />
    </AbsoluteFill>
  );
};
