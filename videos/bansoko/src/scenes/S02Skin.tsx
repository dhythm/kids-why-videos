import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Caption, Sfx } from "../components/Caption";
import { BodyBg } from "../components/Backgrounds";
import { Germ, SkinWall } from "../components/Bansoko";
import { Pill } from "../components/Things";
import { ip, pop } from "../lib/anim";
import { DURATIONS } from "../lib/durations";

export const S02_DURATION = DURATIONS[1];

const WALL = 20; // ひふは かべ
const CUT = 140; // あなが あいた
const GERM = 270; // ばいきんが くる

const WALL_Y = 660;
const HOME = [380, 960, 1540];

export const S02Skin: React.FC = () => {
  const f = useCurrentFrame();
  const heal = 1 - ip(f, [CUT + 8, CUT + 30], [0, 1]);
  const go = ip(f, [GERM, GERM + 70], [0, 1]);
  const dive = ip(f, [GERM + 80, S02_DURATION - 20], [0, 1]);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%" }}>
        <BodyBg splitY={WALL_Y} frame={f} />
        <SkinWall y={WALL_Y} heal={heal} intact />
        {HOME.map((hx, i) => {
          const hop = Math.abs(Math.sin(f * 0.12 + i * 1.1)) * 130;
          const tx = 960 + (i - 1) * 190;
          const x = hx + (tx - hx) * go;
          const y =
            i === 1
              ? WALL_Y - 150 - hop * (1 - go) + dive * 150
              : WALL_Y - 150 - hop * (1 - go * 0.6);
          return (
            <Germ
              key={i}
              x={x}
              y={y}
              s={0.95 * pop(f, WALL + 30 + i * 10)}
              frame={f}
              rot={Math.sin(f * 0.1 + i) * 8}
              color={["#9b6bd6", "#6bbf8a", "#e58a4d"][i]}
            />
          );
        })}
        <Sfx text="ぽよん" x={1250} y={380} start={WALL + 60} end={CUT - 10} size={90} color="#ffffff" />
        <Sfx text="ずりっ！" x={960} y={900} start={CUT + 5} end={GERM - 20} size={130} color="#ff8fa3" />
        <Sfx text="しめしめ" x={1500} y={360} start={GERM + 50} end={S02_DURATION} size={90} color="#e9d8ff" />
        <Pill text="ひふ" x={240} y={840} s={pop(f, WALL + 20)} size={64} color="#ffe6cf" frame={f} />
        <Pill text="からだの なか" x={1500} y={930} s={pop(f, WALL + 50)} size={56} color="#ffffff" frame={f} />
        <Pill text="ばいきん" x={420} y={360} s={pop(f, GERM + 20)} size={60} color="#e9d8ff" frame={f} />
      </svg>
      <Caption text="ひふは かべ" start={WALL + 10} end={CUT - 10} position="top" size={110} />
      <Caption text="あなが あいた！" start={CUT + 25} end={GERM - 10} position="top" size={100} color="#ffe14d" />
    </AbsoluteFill>
  );
};
