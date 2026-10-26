import React from "react";
import { AbsoluteFill, Easing, random, useCurrentFrame } from "remotion";
import { DUCT_PATH, Hen, OVARY, VENT, Yolk } from "../components/Farm";
import { HenInside } from "../components/HenInside";
import { Tag } from "../components/Tag";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";
import { pointAt } from "../lib/path";
import { getLength } from "@remotion/paths";

export const S02_DURATION = 540;

const XRAY = 45;
const OVARY_AT = 160;
const TRIP = 320;
const TRIP_END = 470;

const HX = 820;
const HY = 660;
const HS = 1.6;
const DUCT_LEN = getLength(DUCT_PATH);

const world = (p: { x: number; y: number }) => ({
  x: HX + p.x * HS,
  y: HY + p.y * HS,
});

export const S02Map: React.FC = () => {
  const f = useCurrentFrame();
  const xray = ip(f, [XRAY, XRAY + 30], [0, 1]);
  const tripT = ip(f, [TRIP, TRIP_END], [0, 1], Easing.inOut(Easing.sin));
  const yolkP = pointAt(DUCT_PATH, tripT * DUCT_LEN);
  const o = world(OVARY);
  const v = world(VENT);

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 55%, #fff6e0, #ffd6e5)",
      }}
    >
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {/* はいけいの みずたま */}
        {new Array(18).fill(0).map((_, i) => (
          <circle
            key={i}
            cx={
              (random(`mx${i}`) * 1920 + f * (0.2 + random(`mv${i}`) * 0.4)) %
              1920
            }
            cy={random(`my${i}`) * 1080}
            r={10 + random(`mr${i}`) * 24}
            fill={["#ffd6a5", "#ffc8dd", "#fff1a8"][i % 3]}
            opacity={0.6}
          />
        ))}
        {/* むしめがねの ひかり */}
        {f >= XRAY - 10 && f < XRAY + 45 ? (
          <circle
            cx={HX}
            cy={HY}
            r={ip(f, [XRAY - 10, XRAY + 40], [0, 900])}
            fill="none"
            stroke="#fff59d"
            strokeWidth={60}
            opacity={ip(f, [XRAY + 10, XRAY + 45], [0.9, 0])}
          />
        ) : null}
        <g
          transform={`translate(${HX} ${HY}) scale(${pop(f, 0, 22)}) translate(${-HX} ${-HY})`}
        >
          <Hen
            x={HX}
            y={HY + Math.sin(f * 0.06) * 6}
            s={HS}
            frame={f}
            sitting
            xray={xray}
            mood={f > XRAY && f < XRAY + 60 ? "wow" : "smile"}
            inside={
              <>
                <HenInside
                  frame={f}
                  ventGlow={ip(f, [TRIP_END - 20, TRIP_END + 10], [0, 1])}
                  ovary={
                    1 +
                    (f > OVARY_AT && f < TRIP
                      ? Math.sin((f - OVARY_AT) * 0.25) * 0.06
                      : 0)
                  }
                />
                {f >= TRIP && f < TRIP_END + 20 ? (
                  <Yolk x={yolkP.x} y={yolkP.y} r={20} frame={f} />
                ) : null}
              </>
            }
          />
        </g>
        <Tag
          text="きみの へや"
          x={1520}
          y={560}
          toX={o.x + 60}
          toY={o.y}
          start={OVARY_AT + 10}
          color="#ffe08a"
        />
        <Tag
          text="ながーい トンネル"
          x={1460}
          y={880}
          toX={world({ x: 0, y: 72 }).x}
          toY={world({ x: 0, y: 72 }).y}
          start={TRIP + 20}
          color="#ffb3c6"
        />
        <Tag
          text="おしりの あな"
          x={330}
          y={910}
          toX={v.x}
          toY={v.y}
          start={TRIP_END - 10}
          color="#fff59d"
        />
        <Sfx
          text="すけすけ〜"
          x={1500}
          y={260}
          start={XRAY + 10}
          end={OVARY_AT - 10}
          size={100}
          color="#bfe3ff"
        />
        <Sfx
          text="ころころ"
          x={1480}
          y={260}
          start={TRIP + 10}
          end={TRIP_END}
          size={100}
        />
      </svg>
      <Caption
        text="おなかの なか を みてみよう"
        start={10}
        end={OVARY_AT - 5}
        position="top"
        align="left"
        size={80}
      />
      <Caption
        text="きみ が そだつ へや"
        start={OVARY_AT + 5}
        end={TRIP - 5}
        position="top"
        align="left"
        size={80}
      />
      <Caption
        text="トンネル を とおって おしりへ"
        start={TRIP + 5}
        end={S02_DURATION}
        position="top"
        align="left"
        size={76}
      />
    </AbsoluteFill>
  );
};
