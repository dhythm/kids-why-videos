import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { BodyBg, DotsBg } from "../components/Backgrounds";
import { Bandage, Fixer, Germ, RoofBandage, SkinWall } from "../components/Bansoko";
import { Drop, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S04_DURATION = DURATIONS[3];

const ASK = 20; // なにを するの？
const ROOF = 130; // きずの やね
const MOIST = 340; // かわかさない

const WALL_Y = 660;
const PERIOD = 120;

export const S04Roof: React.FC = () => {
  const f = useCurrentFrame();
  const toRoof = ip(f, [ROOF - 12, ROOF + 8], [0, 1]);
  const heal = ip(f, [MOIST, S04_DURATION], [0.1, 0.8]);
  const roofIn = ip(f, [ROOF + 5, ROOF + 30], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toRoof}>
          <DotsBg color="#eaf6ff" dot="#d6ecff" />
          <Bandage x={960} y={640} s={2.2 * pop(f, 5)} rot={Math.sin(f * 0.08) * 6} face mood="wow" frame={f} />
          {[0, 1].map((i) => (
            <Sfx key={i} text="？" x={380 + i * 1160} y={460 - i * 40} start={ASK + 15 + i * 8} end={ROOF} size={190} color={i ? "#ff8fa3" : "#7fc8ff"} rotate={i ? -8 : 10} />
          ))}
        </g>
        <g opacity={toRoof}>
          <BodyBg splitY={WALL_Y} frame={f} />
          <SkinWall y={WALL_Y} heal={heal} />
          {/* やねの したは しっとり */}
          {[0, 1, 2].map((i) => (
            <Drop
              key={i}
              x={850 + i * 110}
              y={WALL_Y - 20 + Math.sin(f * 0.15 + i * 2) * 12}
              s={0.55 * pop(f, MOIST + 15 + i * 10)}
              color="#8fd6ff"
            />
          ))}
          {[0, 1, 2].map((i) => {
            const working = f > MOIST;
            return (
              <Fixer
                key={i}
                x={800 + i * 160}
                y={860 + Math.sin(f * (working ? 0.45 : 0.12) + i * 1.5) * (working ? 20 : 8)}
                s={0.95}
                frame={f}
                carry={working}
                color={i === 1 ? "#ffd0e0" : "#ffffff"}
              />
            );
          })}
          <RoofBandage x={960} y={WALL_Y - 66 - (1 - roofIn) * 500} s={f >= ROOF + 5 ? 1 : 0} />
          {/* ばいきんが おちてきて、やねで はねかえる */}
          {[0, 1, 2].map((i) => {
            const t = (((f - ROOF - 40 - i * 40) % PERIOD) + PERIOD) % PERIOD;
            if (f < ROOF + 40 + i * 40) {
              return null;
            }
            const hit = 34;
            const dir = i === 1 ? -1 : 1;
            const x0 = 820 + i * 140;
            const topY = WALL_Y - 250;
            const x = t < hit ? x0 : x0 + dir * (t - hit) * 9;
            const y = t < hit ? -120 + ((topY + 120) * t) / hit : topY - (t - hit) * 10 + (t - hit) ** 2 * 0.06;
            return (
              <Germ
                key={i}
                x={x}
                y={y}
                s={0.7}
                frame={f}
                rot={t < hit ? 0 : (t - hit) * 8 * dir}
                mood={t < hit ? "smile" : "wow"}
                color={["#9b6bd6", "#6bbf8a", "#e58a4d"][i]}
              />
            );
          })}
          <Sfx text="ぽよーん" x={1580} y={380} start={ROOF + 75} end={MOIST - 10} size={100} />
          <Pill text="しっとり" x={1500} y={860} s={pop(f, MOIST + 30)} size={60} color="#dff3ff" frame={f} />
          <Pill text="やね" x={420} y={520} s={pop(f, ROOF + 40)} size={64} color="#ffe6cf" frame={f} />
        </g>
      </svg>
      <Caption text="なにを するの？" start={ASK + 5} end={ROOF - 15} position="top" size={100} />
      <Caption text="きずの やね" start={ROOF + 20} end={MOIST - 10} position="top" size={110} color="#ffe14d" />
      <Caption text="かわかさない" start={MOIST + 20} end={S04_DURATION} position="top" size={100} />
    </AbsoluteFill>
  );
};
