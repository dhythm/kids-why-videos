import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person } from "../components/Person";
import { DAD, FRIEND, FRIEND2, MOM } from "../components/cast";
import { Caption, FONT } from "../components/Caption";
import { HandIcon, Heart, Pill } from "../components/Things";
import { INK } from "../components/Person";
import { ip, pop } from "../lib/anim";
import { chatSign, poseAt } from "../lib/signs";

export const S05_DURATION = 420;

const MADE = 20; // 聞こえない人たちが みんなで つくって、そだててきた
const SAME = 220; // 日本語や 英語と おなじように

const PEOPLE = [
  { x: 380, look: MOM, seed: 0 },
  { x: 760, look: FRIEND, seed: 2 },
  { x: 1160, look: DAD, seed: 4 },
  { x: 1540, look: FRIEND2, seed: 6 },
];

const Card: React.FC<{ x: number; s: number; title: string; children: React.ReactNode; color: string }> = ({ x, s, title, children, color }) =>
  s <= 0 ? null : (
    <g transform={`translate(${x} 560) scale(${s})`}>
      <rect x={-230} y={-230} width={460} height={460} rx={50} fill={color} stroke={INK} strokeWidth={8} />
      {children}
      <text y={170} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64 }} fill={INK}>
        {title}
      </text>
    </g>
  );

export const S05Language: React.FC = () => {
  const f = useCurrentFrame();
  const partA = ip(f, [SAME - 20, SAME], [1, 0]);
  const c1 = pop(f, SAME - 8, 18);
  const c2 = pop(f, SAME + 25, 18);
  const c3 = pop(f, SAME + 55, 18);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#fff4e8" />
        {new Array(12).fill(0).map((_, i) => (
          <Heart key={i} x={(i * 173 + 80) % 1920} y={1000 - ((f * 1.6 + i * 97) % 1100)} s={0.5 + (i % 3) * 0.2} color={i % 2 ? "#ffc2d4" : "#ffd9a8"} />
        ))}
        <g opacity={partA}>
          {PEOPLE.map((p, i) => (
            <Person key={i} x={p.x} y={650} s={0.95} frame={f} pose={poseAt(chatSign(9999, p.seed), f + 20)} mood={i % 2 ? "laugh" : "smile"} blinkOffset={i * 23} {...p.look} />
          ))}
        </g>
        {f >= SAME - 10 ? (
          <g>
            <Pill text="どれも ことば" x={960} y={180} s={pop(f, SAME + 100, 18)} frame={f} color="#ffe14d" size={70} />
            <Card x={400} s={c1} title="にほんご" color="#ffe0e6">
              <text y={-30} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 150 }} fill="#e63946">
                あいう
              </text>
            </Card>
            <Card x={960} s={c2} title="えいご" color="#e0f0ff">
              <text y={-30} textAnchor="middle" dominantBaseline="central" style={{ fontFamily: FONT, fontWeight: 800, fontSize: 150 }} fill="#3a86ff">
                ABC
              </text>
            </Card>
            <Card x={1520} s={c3} title="しゅわ" color="#e4f7dc">
              <HandIcon x={-50} y={10} s={1.05} rotate={-15 + Math.sin(f * 0.2) * 10} />
              <HandIcon x={60} y={10} s={1.05} rotate={15 - Math.sin(f * 0.2) * 10} />
            </Card>
          </g>
        ) : null}
      </svg>
      <Caption text="みんなで そだてた ことば" start={MADE + 15} end={SAME - 10} position="top" size={96} color="#ffe14d" />
    </AbsoluteFill>
  );
};
