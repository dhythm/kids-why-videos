import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Kid } from "../components/Kid";
import { Pill, Sun } from "../components/Things";
import {
  EmptyPlate,
  LabCoat,
  Microscope,
  NattoKin,
  NebaBlanket,
} from "../components/Natto";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S07_DURATION = DURATIONS[6];

const ASK = 20; // どうして つくるの？
const GUARD = 160; // じぶんを まもる
const STUDY = 400; // はかせが しらべちゅう

export const S07Why: React.FC = () => {
  const f = useCurrentFrame();
  const toStudy = ip(f, [STUDY - 12, STUDY + 8], [0, 1]);
  const wrap = pop(f, GUARD + 90, 24);
  const worried = f > GUARD + 20 && f < GUARD + 95;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toStudy}>
          <DotsBg color="#eaf6ff" dot="#d6ecff" />
          <Sun x={1560} y={260} s={0.9 * pop(f, GUARD + 15)} frame={f} />
          <EmptyPlate x={380} y={820} s={pop(f, GUARD + 50)} />
          <Pill text="からから" x={1560} y={470} s={0.8 * pop(f, GUARD + 25)} size={52} color="#ffe0a8" frame={f} />
          <Pill text="ごはん なし" x={380} y={940} s={0.8 * pop(f, GUARD + 55)} size={52} color="#ffffff" frame={f} />
          <NebaBlanket x={960} y={580} s={wrap} frame={f} />
          <NattoKin
            x={960}
            y={580 + Math.sin(f * 0.1) * 8}
            s={1.2 * pop(f, ASK)}
            frame={f}
            mood={worried ? "wow" : "smile"}
          />
          {f < GUARD
            ? [0, 1, 2].map((i) => (
                <Sfx key={i} text="？" x={760 + i * 200} y={400 - (i % 2) * 40} start={ASK + 20 + i * 6} end={GUARD} size={100} color="#ffffff" />
              ))
            : null}
          <Sfx text="ほっ" x={1230} y={410} start={GUARD + 110} end={STUDY - 10} size={90} color="#c9f7e4" />
          <Pill text="まもる？" x={960} y={850} s={pop(f, GUARD + 120)} size={64} color="#fff3a8" frame={f} />
        </g>
        <g opacity={toStudy}>
          <DotsBg color="#f4efff" dot="#e6dcff" />
          <Kid x={760} y={620} s={0.95} frame={f} mood="wow" />
          <LabCoat x={760} y={620} s={0.95} />
          <Microscope x={1180} y={830} s={1.3 * pop(f, STUDY + 10)} />
          <NattoKin x={1450} y={430} s={0.6 * pop(f, STUDY + 30)} frame={f} rot={-12} />
          <Sfx text="ふむふむ" x={420} y={300} start={STUDY + 30} end={S07_DURATION} size={90} color="#ffffff" />
        </g>
      </svg>
      <Caption text="なんの ため？" start={ASK + 5} end={GUARD - 5} position="top" size={100} />
      <Caption text="かんがえられている" start={GUARD + 20} end={STUDY - 10} position="top" size={90} color="#ffe14d" />
      <Caption text="しらべちゅう" start={STUDY + 20} end={S07_DURATION} position="top" size={100} />
    </AbsoluteFill>
  );
};
