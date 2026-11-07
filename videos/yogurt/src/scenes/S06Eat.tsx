import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { ColonBg } from "../components/Backgrounds";
import { Bifido, Crowd, Fiber, Native, SourDrop } from "../components/Microbes";
import { Bean, Cabbage, Carrot, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S06_DURATION = DURATIONS[5];

const ASK = 20; // なにを たべるのかな？
const FOOD = 130; // しょくもつせんい
const MUNCH = 320; // もぐもぐ → さくさん

// たべる きんたち と すじの いち
const EATERS = [
  { x: 420, y: 620, k: -1 },
  { x: 800, y: 760, k: 0 },
  { x: 1150, y: 600, k: 3 },
  { x: 1520, y: 760, k: -1 },
];

export const S06Eat: React.FC = () => {
  const f = useCurrentFrame();
  const fall = ip(f, [FOOD + 30, FOOD + 110], [0, 1]);
  const eaten = ip(f, [MUNCH, MUNCH + 70], [0, 1]);
  const chomp = f > MUNCH && f < MUNCH + 90 ? Math.abs(Math.sin(f * 0.45)) : 0;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <ColonBg frame={f} />
        <Crowd
          frame={f}
          count={14}
          seed="c06"
          s={0.32}
          opacity={0.55}
          area={[40, 140, 1840, 300]}
        />
        {/* やさい → こまかい すじ */}
        <g opacity={1 - ip(f, [FOOD + 20, FOOD + 40], [0, 1])}>
          <Cabbage x={640} y={260} s={0.8 * pop(f, FOOD)} />
          <Carrot x={960} y={270} s={0.75 * pop(f, FOOD + 6)} rot={20} />
          <Bean x={1280} y={270} s={1.6 * pop(f, FOOD + 12)} />
        </g>
        {EATERS.map((e, i) => {
          const fy = 200 + (e.y - 110 - 200) * fall;
          return (
            <Fiber
              key={`f${i}`}
              x={e.x + 10}
              y={fy}
              s={0.9 * pop(f, FOOD + 25 + i * 4) * (1 - eaten)}
              rot={i * 25 - 30}
            />
          );
        })}
        {EATERS.map((e, i) =>
          e.k < 0 ? (
            <Bifido
              key={i}
              x={e.x}
              y={e.y + chomp * 14}
              s={0.9 * pop(f, ASK + i * 5)}
              frame={f + i * 13}
              mood={chomp > 0.7 ? "wow" : "smile"}
            />
          ) : (
            <Native
              key={i}
              x={e.x}
              y={e.y + chomp * 14}
              s={0.9 * pop(f, ASK + i * 5)}
              frame={f + i * 13}
              kind={e.k}
              mood={chomp > 0.7 ? "wow" : "smile"}
            />
          ),
        )}
        {f < FOOD
          ? EATERS.map((e, i) => (
              <Sfx
                key={`q${i}`}
                text="？"
                x={e.x + 60}
                y={e.y - 140}
                start={ASK + 20 + i * 6}
                end={FOOD}
                size={80}
                color="#ffffff"
              />
            ))
          : null}
        {/* さくさん など */}
        {EATERS.map((e, i) =>
          [0, 1].map((j) => (
            <SourDrop
              key={`d${i}${j}`}
              x={e.x - 50 + j * 100}
              y={
                e.y -
                150 -
                ip(
                  f,
                  [MUNCH + 50 + i * 6, MUNCH + 110 + i * 6],
                  [0, 60 + j * 30],
                )
              }
              s={0.8 * pop(f, MUNCH + 50 + i * 6 + j * 8)}
              frame={f + i * 5}
            />
          )),
        )}
        <Pill
          text="しょくもつせんい"
          x={960}
          y={950}
          s={pop(f, FOOD + 60) * (1 - ip(f, [MUNCH - 10, MUNCH], [0, 1]))}
          size={60}
          color="#d6f5c6"
          frame={f}
        />
        <Pill
          text="さくさん など"
          x={960}
          y={950}
          s={pop(f, MUNCH + 70)}
          size={60}
          color="#fff3a8"
          frame={f}
        />
        <Sfx
          text="もぐもぐ"
          x={1480}
          y={420}
          start={MUNCH + 5}
          end={MUNCH + 90}
          size={96}
        />
      </svg>
      <Caption
        text="なにを たべるの？"
        start={ASK + 5}
        end={FOOD + 10}
        position="top"
        size={96}
      />
      <Caption
        text="やさいや まめの すじ"
        start={FOOD + 25}
        end={MUNCH - 10}
        position="top"
        size={90}
        color="#ffe14d"
      />
      <Caption
        text="たべて つくる"
        start={MUNCH + 10}
        end={S06_DURATION}
        position="top"
        size={96}
      />
    </AbsoluteFill>
  );
};
