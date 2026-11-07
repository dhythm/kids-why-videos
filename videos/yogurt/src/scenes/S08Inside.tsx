import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { DotsBg } from "../components/Backgrounds";
import { Unchi } from "../components/Body";
import { Crowd, Fiber } from "../components/Microbes";
import { Cabbage, Carrot, INK, Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S08_DURATION = DURATIONS[7];

const ASK = 20; // なにで できている？
const PARTS = 150; // おみず、のこりの はんぶんは さいきん
const GROW = 360; // ふんわり おおきく

// びんの おおきさ
const BX = 760;
const BW = 400;
const BTOP = 330;
const BH = 620;

export const S08Inside: React.FC = () => {
  const f = useCurrentFrame();
  const water = ip(f, [PARTS + 10, PARTS + 60], [0, 0.75]);
  const solid = ip(f, [PARTS + 90, PARTS + 130], [0, 1]);
  const toGrow = ip(f, [GROW - 15, GROW + 5], [0, 1]);
  const grow = ip(f, [GROW + 50, GROW + 120], [0, 1]);
  const bottom = BTOP + BH;
  const wy = bottom - BH * water;
  const solidH = BH * 0.25 * solid;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <g opacity={1 - toGrow}>
          <DotsBg color="#fff6e0" dot="#ffeecb" />
          <Unchi
            x={1380}
            y={600}
            s={1.4 * pop(f, ASK)}
            frame={f}
            mood={f < PARTS ? "wow" : "smile"}
          />
          <Sfx
            text="？"
            x={1560}
            y={330}
            start={ASK + 20}
            end={PARTS}
            size={150}
            color="#ff8fa3"
          />
          {/* なかみの びん */}
          <g opacity={pop(f, PARTS)}>
            <rect
              x={BX - BW / 2}
              y={wy}
              width={BW}
              height={bottom - wy}
              fill="#7cc8ff"
            />
            {solid > 0 ? (
              <g>
                <rect
                  x={BX - BW / 2}
                  y={wy - solidH}
                  width={BW / 2}
                  height={solidH}
                  fill="#ffc9d3"
                />
                <rect
                  x={BX}
                  y={wy - solidH}
                  width={BW / 2}
                  height={solidH}
                  fill="#c9a37a"
                />
                <Crowd
                  frame={f}
                  count={5}
                  seed="c08"
                  s={0.2}
                  area={[
                    BX - BW / 2 + 30,
                    wy - solidH + 30,
                    BW / 2 - 60,
                    solidH - 60,
                  ]}
                  show={solid}
                />
              </g>
            ) : null}
            <rect
              x={BX - BW / 2}
              y={BTOP}
              width={BW}
              height={BH}
              rx={20}
              fill="none"
              stroke={INK}
              strokeWidth={10}
            />
          </g>
          <Pill
            text="おみず"
            x={BX}
            y={bottom - BH * 0.33}
            s={pop(f, PARTS + 40)}
            size={64}
            color="#ffffff"
            frame={f}
          />
          <Pill
            text="さいきん"
            x={BX - BW / 2 - 150}
            y={BTOP + BH * 0.13}
            s={pop(f, PARTS + 130)}
            size={56}
            color="#ffc9d3"
            frame={f}
          />
          <Pill
            text="のこりかす"
            x={BX + BW / 2 + 170}
            y={BTOP + BH * 0.13}
            s={pop(f, PARTS + 140)}
            size={56}
            color="#e8d3b8"
            frame={f}
          />
        </g>
        {/* やさいで ふんわり */}
        <g opacity={toGrow}>
          <DotsBg color="#effbe6" dot="#dcf3cd" />
          <Cabbage x={300} y={330} s={0.9 * pop(f, GROW)} />
          <Carrot x={300} y={720} s={0.9 * pop(f, GROW + 8)} rot={-20} />
          <Fiber x={640} y={520} s={pop(f, GROW + 20)} />
          <Crowd
            frame={f}
            count={16}
            seed="c08b"
            s={0.32}
            area={[820, 200, 300, 640]}
            show={ip(f, [GROW + 30, GROW + 90], [0.2, 1])}
          />
          <Unchi
            x={1440}
            y={600}
            s={0.75 + grow * 0.55}
            frame={f}
            mood="smile"
          />
          <Sfx
            text="ふんわり"
            x={1460}
            y={260}
            start={GROW + 70}
            end={S08_DURATION}
            size={110}
            color="#ffffff"
          />
        </g>
      </svg>
      <Caption
        text="うんちの なかみは？"
        start={ASK + 5}
        end={PARTS + 5}
        position="top"
        size={96}
      />
      <Caption
        text="おみず と さいきん"
        start={PARTS + 60}
        end={GROW - 15}
        position="top"
        size={96}
        color="#ffe14d"
      />
      <Caption
        text="きんが ふえると おおきく"
        start={GROW + 10}
        end={S08_DURATION}
        position="bottom"
        size={84}
      />
    </AbsoluteFill>
  );
};
