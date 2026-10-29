import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import {
  Adult,
  BeerMug,
  DiningBg,
  JuiceGlass,
  Table,
  WineGlass,
} from "../components/Home";
import {
  BeerBottle,
  Grape,
  Pill,
  Rice,
  SakeBottle,
  WineBottle,
  Yeast,
} from "../components/Things";
import { Kid, Sparkle } from "../components/Kid";
import { Caption, Sfx } from "../components/Caption";
import { ip, pop } from "../lib/anim";

export const S10_DURATION = 620;

const YEAST = 90;
const DRINK = 150;
const PARTY = 330;
const CHEERS = 420;

const Arrow: React.FC<{ x: number; y: number; p: number }> = ({ x, y, p }) =>
  p > 0 ? (
    <path
      d={`M ${x} ${y} L ${x + 110 * p} ${y} M ${x + 110 * p - 30} ${y - 30} L ${x + 110 * p} ${y} L ${x + 110 * p - 30} ${y + 30}`}
      stroke="#ff7b54"
      strokeWidth={18}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  ) : null;

export const S10Recap: React.FC = () => {
  const f = useCurrentFrame();
  const recap = ip(f, [PARTY - 20, PARTY], [1, 0]);
  const party = ip(f, [PARTY - 10, PARTY + 10], [0, 1]);
  const raise = ip(
    f,
    [CHEERS - 25, CHEERS],
    [0, 0.42],
    Easing.out(Easing.back(1.4)),
  );
  const kidArm = ip(f, [CHEERS - 25, CHEERS], [0, 0.5]);
  const kidX = 960;
  const kidY = 700;
  const kidS = 1.05;

  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        {/* ふりかえり */}
        {recap > 0 ? (
          <g opacity={recap}>
            <rect width={1920} height={1080} fill="#fff6dc" />
            <Rice x={250} y={500} s={0.7 * pop(f, 30, 16)} frame={f} />
            <Grape x={250} y={800} s={0.6 * pop(f, 45, 16)} frame={f} />
            <Arrow x={460} y={640} p={ip(f, [YEAST - 30, YEAST], [0, 1])} />
            <Yeast
              x={820}
              y={640}
              s={1.8 * pop(f, YEAST, 18)}
              frame={f}
              chew={1}
            />
            <Pill
              text="こうぼ"
              x={820}
              y={870}
              s={pop(f, YEAST + 10, 16)}
              frame={f}
            />
            <Arrow x={1080} y={640} p={ip(f, [DRINK - 30, DRINK], [0, 1])} />
            <g transform={`translate(1360 850) scale(${pop(f, DRINK, 16)})`}>
              <SakeBottle s={0.7} />
            </g>
            <g
              transform={`translate(1540 850) scale(${pop(f, DRINK + 6, 16)})`}
            >
              <WineBottle s={0.72} />
            </g>
            <g
              transform={`translate(1720 850) scale(${pop(f, DRINK + 12, 16)})`}
            >
              <BeerBottle s={0.75} />
            </g>
            <Pill
              text="おさけ"
              x={1540}
              y={940}
              s={pop(f, DRINK + 20, 16)}
              frame={f}
              color="#ffe14d"
            />
          </g>
        ) : null}

        {/* みんなで かんぱい */}
        {party > 0 ? (
          <g opacity={party}>
            <DiningBg frame={f} />
            <Adult
              x={500}
              y={640}
              s={1.1}
              frame={f}
              variant="papa"
              raise={raise}
              hold={<BeerMug frame={f} s={0.8} />}
            />
            <Adult
              x={1420}
              y={640}
              s={1.1}
              frame={f}
              variant="mama"
              flip
              raise={raise}
              hold={
                <g transform="translate(0 40)">
                  <WineGlass s={0.7} />
                </g>
              }
            />
            <Kid
              x={kidX}
              y={kidY}
              s={kidS}
              frame={f}
              armUp={kidArm}
              mood={f >= CHEERS ? "wow" : "smile"}
            />
            <g
              transform={`translate(${kidX + 120 * kidS + kidArm * 40} ${kidY + 20 - kidArm * 90})`}
            >
              <JuiceGlass s={0.75} />
            </g>
            <Table />
            {f >= CHEERS
              ? new Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Sparkle
                      key={i}
                      x={960 + Math.cos(i * 0.8) * (500 + (i % 2) * 200)}
                      y={420 + Math.sin(i * 0.8) * 260}
                      s={
                        pop(f, CHEERS + i * 4, 12) *
                        (0.8 + Math.sin(f * 0.2 + i) * 0.3)
                      }
                      color={["#ffe14d", "#ffb3d1", "#9fe7ff"][i % 3]}
                    />
                  ))
              : null}
            <Sfx
              text="かんぱーい！"
              x={960}
              y={240}
              start={CHEERS}
              end={S10_DURATION}
              size={130}
            />
          </g>
        ) : null}
      </svg>
      <Caption
        text="ふりかえり"
        start={10}
        end={YEAST - 5}
        position="top"
        size={100}
      />
      <Caption
        text="こうぼ さん が たべて"
        start={YEAST + 5}
        end={DRINK - 5}
        position="top"
        size={96}
      />
      <Caption
        text="おさけ が できる"
        start={DRINK + 5}
        end={PARTY - 25}
        position="top"
        size={100}
        color="#ffe14d"
      />
      <Caption
        text="こどもは ジュースで！"
        start={CHEERS + 80}
        end={S10_DURATION}
        position="bottom"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
