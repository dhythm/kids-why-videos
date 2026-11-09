import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { BeanPod, INK, Pill } from "../components/Things";
import {
  Chopsticks,
  NattoBowl,
  NattoKin,
  Soybean,
  StickyThread,
} from "../components/Natto";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S02_DURATION = DURATIONS[1];

const SOY = 20; // もとは だいず
const PLAIN = 160; // にた だいずは ネバネバ しない
const WHO = 320; // だれが？

export const S02Soy: React.FC = () => {
  const f = useCurrentFrame();
  const toCompare = ip(f, [PLAIN - 12, PLAIN + 6], [0, 1]);
  const lift = ip(f, [PLAIN + 30, PLAIN + 80], [0, 1]);
  const who = pop(f, WHO + 10, 24);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DotsBg color="#eef8e4" dot="#dcf0c8" />
        {/* だいず と さや */}
        <g opacity={1 - toCompare}>
          <BeanPod x={560} y={560} s={1.6 * pop(f, SOY)} rot={-20} />
          <Soybean x={1100} y={560} s={3.2 * pop(f, SOY + 15)} />
          <Soybean x={1420} y={640} s={2.2 * pop(f, SOY + 22)} rot={40} />
          <Pill text="だいず" x={1220} y={860} s={pop(f, SOY + 30)} size={70} color="#fff3a8" frame={f} />
        </g>
        {/* くらべる: にた だいず と なっとう */}
        <g opacity={toCompare}>
          <NattoBowl x={560} y={760} s={0.95 * pop(f, PLAIN)} natto={0} />
          <Soybean x={560 + 40} y={760 - 330 * lift - 20} s={pop(f, PLAIN + 10)} />
          <Chopsticks x={560 + 40} y={760 - 330 * lift} s={0.8 * pop(f, PLAIN + 10)} rot={16} />
          <Sfx text="つるん" x={300} y={360} start={PLAIN + 70} end={WHO + 5} size={90} color="#ffffff" />
          <NattoBowl x={1360} y={760} s={0.95 * pop(f, PLAIN + 8)} foam={0.3} />
          {[-1, 0, 1].map((i) => (
            <StickyThread
              key={i}
              a={{ x: 1360 + i * 60, y: 730 }}
              b={{ x: 1400 + i * 6, y: 760 - 330 * lift - 10 }}
              length={420}
              opacity={ip(f, [PLAIN + 30, PLAIN + 40], [0, 1])}
              base={6}
            />
          ))}
          <Chopsticks x={1400} y={760 - 330 * lift} s={0.8 * pop(f, PLAIN + 18)} rot={16} />
          <Sfx text="ネバー" x={1660} y={360} start={PLAIN + 70} end={WHO + 5} size={90} />
          <g opacity={1 - ip(f, [WHO - 5, WHO + 10], [0, 1])}>
            <Pill text="にた だいず" x={560} y={990} s={pop(f, PLAIN + 20)} size={56} color="#fff3a8" frame={f} />
            <Pill text="なっとう" x={1360} y={990} s={pop(f, PLAIN + 26)} size={56} color="#ffd8a8" frame={f} />
          </g>
          {/* だれ？ かげの なっとうきん */}
          <g opacity={ip(f, [WHO, WHO + 15], [0, 1])}>
            <rect width={1920} height={1080} fill={INK} opacity={0.35} />
            <NattoKin x={960} y={560} s={1.6 * who} frame={f} color="#5a5a7a" mood="wow" />
            <Sfx text="？" x={1180} y={360} start={WHO + 25} end={S02_DURATION} size={200} color="#ffe14d" />
          </g>
        </g>
      </svg>
      <Caption text="なっとうの もと" start={SOY + 5} end={PLAIN - 12} position="top" size={100} />
      <Caption text="にた だいずは？" start={PLAIN + 10} end={WHO - 5} position="top" size={96} />
      <Caption text="だれが ネバネバに？" start={WHO + 15} end={S02_DURATION} position="top" size={100} color="#ffe14d" />
    </AbsoluteFill>
  );
};
