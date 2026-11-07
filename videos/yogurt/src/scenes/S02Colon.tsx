import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, FONT } from "../components/Caption";
import { BodyMap } from "../components/Body";
import { ColonBg } from "../components/Backgrounds";
import { Crowd } from "../components/Microbes";
import { Kid } from "../components/Kid";
import { Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S02_DURATION = DURATIONS[1];

const LOOK = 20; // だいちょうを のぞいてみよう
const ZOOM = 105;
const MANY = 130; // さいきんが いっぱい
const SAME = 360; // からだの さいぼうと おなじくらい

// だいちょうの まんなか（BodyMap の ざひょう）
const CX = 862;
const CY = 740;

export const S02Colon: React.FC = () => {
  const f = useCurrentFrame();
  const draw = ip(f, [LOOK, LOOK + 50], [0, 1]);
  const zoom = ip(f, [ZOOM, ZOOM + 40], [0, 1]);
  const lens = ip(f, [ZOOM + 10, ZOOM + 50], [0, 1200]);
  const same = ip(f, [SAME - 15, SAME + 5], [0, 1]);
  const sc = 1 + zoom * 5;
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <defs>
          <clipPath id="lens02">
            <circle cx={960} cy={540} r={lens} />
          </clipPath>
        </defs>
        <rect width={1920} height={1080} fill="#fff6e0" />
        <g
          transform={`translate(${CX * (1 - sc) + (960 - CX) * zoom} ${CY * (1 - sc) + (540 - CY) * zoom}) scale(${sc})`}
          opacity={1 - ip(f, [ZOOM + 30, ZOOM + 45], [0, 1])}
        >
          <BodyMap
            frame={f}
            draw={draw}
            highlight={{ large: ip(f, [LOOK + 50, LOOK + 65], [0, 1]) }}
          />
        </g>
        {f < LOOK + 50 + 40 && f > LOOK + 55 ? (
          <Pill
            text="だいちょう"
            x={1350}
            y={770}
            s={pop(f, LOOK + 55)}
            size={64}
            color="#ffd8a8"
            frame={f}
          />
        ) : null}
        {/* だいちょうの なか */}
        {lens > 0 ? (
          <g clipPath="url(#lens02)" opacity={1 - same}>
            <ColonBg frame={f} />
            <Crowd
              frame={f}
              count={38}
              seed="c02"
              s={0.55}
              show={ip(f, [ZOOM + 20, MANY + 120], [0.1, 1])}
              area={[60, 120, 1800, 860]}
            />
          </g>
        ) : null}
        {/* おなじくらい */}
        {same > 0 ? (
          <g opacity={same}>
            <rect width={1920} height={1080} fill="#fff6e0" />
            <Kid x={480} y={640} s={1.1 * pop(f, SAME)} frame={f} mood="wow" />
            <Pill
              text="からだの さいぼう"
              x={480}
              y={950}
              s={pop(f, SAME + 10)}
              size={56}
              color="#ffe3cf"
              frame={f}
            />
            <text
              x={960}
              y={600}
              textAnchor="middle"
              fontSize={200}
              fontWeight={800}
              fontFamily={FONT}
              fill="#ff8fa3"
              stroke="#2b2b4a"
              strokeWidth={10}
              paintOrder="stroke"
              opacity={pop(f, SAME + 25)}
            >
              ≒
            </text>
            <Crowd
              frame={f}
              count={26}
              seed="c02b"
              s={0.42}
              area={[1220, 300, 520, 520]}
              show={ip(f, [SAME + 10, SAME + 50], [0, 1])}
            />
            <Pill
              text="さいきん"
              x={1480}
              y={950}
              s={pop(f, SAME + 20)}
              size={56}
              color="#ffc9d3"
              frame={f}
            />
          </g>
        ) : null}
      </svg>
      <Caption
        text="おなかの なかを のぞいてみよう"
        start={LOOK}
        end={ZOOM + 10}
        position="top"
        size={84}
      />
      <Caption
        text="ちいさな いきもの「さいきん」"
        start={MANY + 20}
        end={SAME - 15}
        position="top"
        size={84}
        color="#ffe14d"
      />
      <Caption
        text="おなじくらい いる！"
        start={SAME + 20}
        end={S02_DURATION}
        position="top"
        size={96}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
