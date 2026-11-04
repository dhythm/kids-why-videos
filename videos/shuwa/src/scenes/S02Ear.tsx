import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Person } from "../components/Person";
import { FRIEND, FRIEND2, ME } from "../components/cast";
import { Caption } from "../components/Caption";
import { Bell, Bird, Bubble, BubbleText, Ear, Pill, SoundWaves } from "../components/Things";
import { ip, pop } from "../lib/anim";

export const S02_DURATION = 500;

const EAR = 20; // 耳で 音を 聞いているね
const SOUNDS = 140; // ことりの こえ、すずの 音、ともだちの こえ
const NOT = 290; // 聞こえない人や、すこししか 聞こえない人も

export const S02Ear: React.FC = () => {
  const f = useCurrentFrame();
  const earIn = pop(f, EAR, 22);
  const partA = ip(f, [NOT - 15, NOT + 5], [1, 0]);
  const partB = ip(f, [NOT, NOT + 20], [0, 1]);
  const bird = pop(f, SOUNDS + 5, 16);
  const bell = pop(f, SOUNDS + 40, 16);
  const pal = pop(f, SOUNDS + 72, 16);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <rect width={1920} height={1080} fill="#e3f4ff" />
        {new Array(18).fill(0).map((_, i) => (
          <circle key={i} cx={(i % 6) * 340 + 120} cy={Math.floor(i / 6) * 380 + 120} r={26} fill="#d0ecff" />
        ))}
        <g opacity={partA}>
          <Ear x={560} y={560} s={1.5 * earIn} />
          {/* なみは みみの ほうへ（ひだりむき） */}
          {bird > 0.9 ? <SoundWaves x={1280} y={260} frame={f} dir={160} reach={0.9} color="#f4a93a" /> : null}
          {bell > 0.9 ? <SoundWaves x={1320} y={560} frame={f + 20} dir={180} reach={0.9} color="#e9b400" /> : null}
          {pal > 0.9 ? <SoundWaves x={1260} y={850} frame={f + 40} dir={200} reach={0.9} color="#ff7b54" /> : null}
          <Bird x={1460} y={250} s={bird} frame={f} />
          <Bell x={1500} y={560} s={bell * 1.1} frame={f} />
          <g transform={`translate(1520 930) scale(${pal * 0.6})`}>
            <Person x={0} y={0} frame={f} mood="laugh" {...ME} />
          </g>
          <Bubble x={1330} y={720} w={260} h={110} s={pal} tail="right">
            <BubbleText text="あそぼ！" size={58} />
          </Bubble>
        </g>
        <g opacity={partB}>
          <Person x={640} y={640} s={1.15} frame={f} mood="smile" {...FRIEND} />
          <Person x={1280} y={640} s={1.15} frame={f} mood="smile" blinkOffset={30} {...FRIEND2} />
          <Pill text="きこえない" x={640} y={210} s={pop(f, NOT + 20, 18)} frame={f} color="#ffe14d" size={64} />
          <Pill text="すこし きこえる" x={1280} y={210} s={pop(f, NOT + 70, 18)} frame={f} color="#c6f0ff" size={64} />
          {/* ほちょうき を しめす */}
          {f > NOT + 90 ? (
            <circle cx={1280 + 108 * 1.15} cy={640 - 158 * 1.15} r={52} fill="none" stroke="#ff5d8f" strokeWidth={9} strokeDasharray="16 12" opacity={ip(f, [NOT + 90, NOT + 105], [0, 1])} />
          ) : null}
        </g>
      </svg>
      <Caption text="みみで きく" start={EAR + 10} end={SOUNDS - 5} position="top" size={110} color="#ffe14d" />
    </AbsoluteFill>
  );
};
