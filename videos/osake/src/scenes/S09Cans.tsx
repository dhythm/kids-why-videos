import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Adult, Can, DiningBg, Table } from "../components/Home";
import { Kid } from "../components/Kid";
import { Caption, FONT } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S09_DURATION = 500;

const MARK = 120;
const ASK = 230;
const ANSWER = ASK + 120;

export const S09Cans: React.FC = () => {
  const f = useCurrentFrame();
  const move = ip(f, [ASK - 20, ASK + 10], [0, 1], Easing.inOut(Easing.quad));
  const canS = 1.3 - move * 0.55;
  const leftX = 760 - move * 400;
  const rightX = 1160 - move * 560;
  const canY = 900 - move * 110;
  const glow = f >= MARK && f < ASK ? 0.6 + Math.sin(f * 0.25) * 0.4 : 0;
  const people = pop(f, ASK, 20);
  const nod = f >= ANSWER ? Math.sin((f - ANSWER) * 0.25) * 6 : 0;

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <DiningBg frame={f} />
        {people > 0 ? (
          <>
            <Kid
              x={1080}
              y={720}
              s={1.05 * people}
              frame={f}
              mood={f < ANSWER ? "wow" : "smile"}
            />
            <g transform={`rotate(${nod} 1560 640)`}>
              <Adult
                x={1560}
                y={640}
                s={1.1 * people}
                frame={f}
                variant="mama"
                flip
              />
            </g>
          </>
        ) : null}
        <Table />

        {/* そっくりな かん */}
        <g
          transform={`translate(${leftX} ${canY}) rotate(${Math.sin(f * 0.08) * 3})`}
        >
          <Can s={canS} color="#ffb347" fruit="orange" />
        </g>
        <g
          transform={`translate(${rightX} ${canY}) rotate(${Math.sin(f * 0.08 + 1) * 3})`}
        >
          <Can s={canS} color="#ffa94d" fruit="orange" osake markGlow={glow} />
        </g>

        {/* どっち？ */}
        {f < ASK
          ? [0, 1].map((i) => (
              <g
                key={i}
                transform={`translate(${760 + i * 400} ${380 + Math.sin(f * 0.12 + i) * 12}) scale(${pop(f, 20 + i * 10, 16) * ip(f, [ASK - 20, ASK], [1, 0])})`}
              >
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontFamily: FONT, fontWeight: 800, fontSize: 150 }}
                  fill="#ff5d8f"
                  stroke="#2b2b4a"
                  strokeWidth={12}
                  paintOrder="stroke"
                >
                  ?
                </text>
              </g>
            ))
          : null}

        {/* きいてみる ふきだし（こども → ママ の こたえ） */}
        {f >= ASK + 30 ? (
          <g
            transform={
              f < ANSWER
                ? `translate(1260 380) scale(${pop(f, ASK + 30, 16)})`
                : `translate(1290 400) scale(${pop(f, ANSWER, 16)})`
            }
          >
            <path
              d="M -190 -90 Q -190 -140 -140 -140 L 140 -140 Q 190 -140 190 -90 L 190 30 Q 190 80 140 80 L -40 80 L -90 140 L -80 80 L -140 80 Q -190 80 -190 30 Z"
              fill="#fff"
              stroke="#2b2b4a"
              strokeWidth={8}
              transform={f < ANSWER ? undefined : "scale(-1 1)"}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              y={-30}
              style={{ fontFamily: FONT, fontWeight: 800, fontSize: 56 }}
              fill="#2b2b4a"
            >
              {f < ANSWER ? "これ のめる？" : "それは おさけ"}
            </text>
          </g>
        ) : null}
      </svg>
      <Caption
        text="ジュース みたいな おさけ も"
        start={15}
        end={ASK - 5}
        position="top"
        size={84}
      />
      <Caption
        text="のむ まえに きいてね"
        start={ASK + 5}
        end={S09_DURATION}
        position="top"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
