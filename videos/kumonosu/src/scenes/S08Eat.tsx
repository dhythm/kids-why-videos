import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { Arrow, Heart, Pill, Spider } from "../components/Things";
import { Web } from "../components/Web";
import { ip, pop } from "../lib/anim";

export const S08_DURATION = 460;

const EAT = 20; // たべて げんき
const RECYCLE = 220; // ふるい す → たべる → あたらしい いと

const NODES = [
  { x: 520, y: 640, label: "ふるい す" },
  { x: 960, y: 360, label: "もぐもぐ" },
  { x: 1400, y: 640, label: "あたらしい いと" },
];

export const S08Eat: React.FC = () => {
  const f = useCurrentFrame();
  const part1 = ip(f, [RECYCLE - 20, RECYCLE], [1, 0]);
  const tummy = ip(f, [EAT + 40, EAT + 130], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#ffeef3" />
        {new Array(20).fill(0).map((_, i) => (
          <circle key={i} cx={(i % 5) * 420 + (Math.floor(i / 5) % 2) * 210} cy={Math.floor(i / 5) * 290 + 90} r={18} fill="#ffd6e2" />
        ))}
        {part1 > 0 ? (
          <g opacity={part1}>
            <Spider x={960} y={520} s={1.6} frame={f} tummy={tummy} mood={tummy > 0.9 ? "smile" : "wow"} />
            {[0, 1, 2].map((i) => (
              <Heart key={i} x={700 + i * 260} y={260 - ((f * 1.2 + i * 40) % 80)} s={pop(f, EAT + 120 + i * 8, 14) * 1.2} />
            ))}
            <Sfx text="もぐもぐ" x={1460} y={560} start={EAT + 30} end={RECYCLE} size={100} color="#ff8fa3" />
          </g>
        ) : null}
        {f >= RECYCLE ? (
          <g>
            {/* ふるい す（やぶれている） */}
            <g transform={`translate(${NODES[0].x} ${NODES[0].y}) scale(${pop(f, RECYCLE + 10, 18)})`}>
              <Web x={0} y={0} s={0.5} frame={f} radiiP={0.55} spiralP={0.45} width={7} radialColor="#9a9ab8" spiralColor="#9a9ab8" />
            </g>
            <g transform={`translate(${NODES[1].x} ${NODES[1].y}) scale(${pop(f, RECYCLE + 60, 18)})`}>
              <Spider x={0} y={-20} s={0.8} frame={f} tummy={0.6} />
            </g>
            <g transform={`translate(${NODES[2].x} ${NODES[2].y}) scale(${pop(f, RECYCLE + 120, 18)})`}>
              <Web x={0} y={0} s={0.5} frame={f} width={7} radialColor="#7f8fd6" spiralColor="#7f8fd6" />
              <Spider x={0} y={4} s={0.3} frame={f} />
            </g>
            {f > RECYCLE + 40 ? <Arrow x1={680} y1={480} x2={820} y2={360} /> : null}
            {f > RECYCLE + 100 ? <Arrow x1={1100} y1={360} x2={1240} y2={480} /> : null}
            {NODES.map((n, i) => (
              <Pill key={i} text={n.label} x={n.x} y={n.y + (i === 1 ? 200 : 270)} s={pop(f, RECYCLE + 20 + i * 55, 16)} size={52} frame={f} color={i === 2 ? "#ffe14d" : "#ffffff"} />
            ))}
          </g>
        ) : null}
      </svg>
      <Caption text="げんき いっぱい" start={EAT + 130} end={RECYCLE - 5} position="bottom" size={96} color="#ffe14d" />
      <Caption text="なんども つかう" start={RECYCLE + 180} end={S08_DURATION} position="top" size={92} />
    </AbsoluteFill>
  );
};
