import React from "react";
import { Audio } from "@remotion/media";
import { interpolate, interpolateColors, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Tank, TankItem, TankSounds, T_IMPACT } from "./Tank";
import { Apple, Daikon, Onion, Pepper, Potato, Veg } from "./veg";
import { Arrow, BLUE, Chip, FONT, Label, rand, RED, usePop } from "./parts";

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 1920 1080" width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {children}
    </svg>
  );
}

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const impact = (delay: number) => Math.round(delay + T_IMPACT);

// 1. なんで？
export function Intro() {
  const items: TankItem[] = [
    { kind: "apple", x: 210, delay: 15, mode: "float", expr: "happy" },
    { kind: "pepper", x: 470, delay: 40, mode: "float", expr: "happy" },
    { kind: "potato", x: 760, delay: 65, mode: "sink", expr: "wow" },
    { kind: "daikon", x: 1010, delay: 90, mode: "sink", s: 0.9, expr: "wow" },
  ];
  return (
    <>
      <Stage>
        <Tank x={360} y={250} w={1200} h={560} items={items} />
        <Chip x={360 + 340} y={290} text="うかぶ！" color={BLUE} start={impact(40) + 20} />
        <Chip x={360 + 885} y={620} text="しずむ…" color={RED} start={impact(90) + 25} />
      </Stage>
      <TankSounds items={items} />
    </>
  );
}

// 2. おもさで きまる？
export function Weight() {
  const left: TankItem[] = [{ kind: "apple", x: 350, delay: 40, mode: "float", s: 1.5, expr: "happy" }];
  const right: TankItem[] = [{ kind: "potato", x: 350, delay: 150, mode: "sink", s: 0.45, expr: "wow" }];
  return (
    <>
      <Stage>
        <Label x={510} y={215} text="大きくて おもい リンゴ" size={46} start={10} />
        <Label x={1410} y={215} text="小さくて かるい かけら" size={46} start={130} />
        <Tank x={160} y={280} w={700} h={520} items={left} />
        <Tank x={1060} y={280} w={700} h={520} items={right} />
        <Chip x={510} y={720} text="うかぶ" color={BLUE} start={impact(40) + 25} size={50} />
        <Chip x={1410} y={560} text="しずむ" color={RED} start={impact(150) + 30} size={50} />
      </Stage>
      <TankSounds items={left} />
      <TankSounds items={right} />
    </>
  );
}

// 3. 浮力
export function Buoyancy() {
  const frame = useCurrentFrame();
  const items: TankItem[] = [{ kind: "apple", x: 500, delay: 10, mode: "float", s: 1.2, expr: "happy" }];
  const down = interpolate(frame, [60, 90], [0, 1], clamp);
  const pulse = 1 + 0.06 * Math.sin(frame * 0.25);
  return (
    <>
      <Stage>
        <Tank x={460} y={250} w={1000} h={560} items={items} />
        <Arrow x1={1180} y1={330} x2={1180} y2={500} color={RED} progress={down} />
        <Label x={1215} y={430} text="おもさ" color={RED} size={46} start={60} anchor="start" />
        <g transform={`translate(960 640) scale(${pulse}) translate(-960 -640)`}>
          {[880, 960, 1040].map((x, i) => (
            <Arrow key={i} x1={x} y1={790} x2={x} y2={610} color={BLUE} progress={interpolate(frame, [100 + i * 8, 140 + i * 8], [0, 1], clamp)} />
          ))}
        </g>
        <Label x={1075} y={720} text="浮力（ふりょく）" color={BLUE} size={44} start={290} anchor="start" />
        <Label x={1090} y={775} text="水が おしかえす力" color={BLUE} size={36} start={300} anchor="start" />
      </Stage>
      <TankSounds items={items} />
    </>
  );
}

function Balance({ cx, kind, angleTo, start, verdict, color }: { cx: number; kind: "apple" | "potato"; angleTo: number; start: number; verdict: string; color: string }) {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [start, start + 40], [0, angleTo], clamp) + (frame > start ? 1.2 * Math.sin((frame - start) * 0.2) * Math.exp(-(frame - start) / 30) : 0);
  const rad = (a * Math.PI) / 180;
  const L = 280;
  const py = 300;
  const ends = [-1, 1].map((d) => ({ x: cx + d * L * Math.cos(rad), y: py + d * L * Math.sin(rad) }));
  const hang = 170;
  return (
    <g>
      <path d={`M${cx - 70},760 L${cx + 70},760 L${cx + 20},740 L${cx + 14},${py} L${cx - 14},${py} L${cx - 20},740Z`} fill="#90a4ae" />
      <line x1={ends[0].x} y1={ends[0].y} x2={ends[1].x} y2={ends[1].y} stroke="#607d8b" strokeWidth={18} strokeLinecap="round" />
      <circle cx={cx} cy={py} r={18} fill="#455a64" />
      {ends.map((e, i) => (
        <g key={i}>
          <line x1={e.x - 70} y1={e.y + hang} x2={e.x} y2={e.y} stroke="#78909c" strokeWidth={4} />
          <line x1={e.x + 70} y1={e.y + hang} x2={e.x} y2={e.y} stroke="#78909c" strokeWidth={4} />
          <path d={`M${e.x - 110},${e.y + hang} L${e.x + 110},${e.y + hang} Q${e.x},${e.y + hang + 50} ${e.x - 110},${e.y + hang}Z`} fill="#b0bec5" />
          {i === 0 ? (
            <g transform={`translate(${e.x} ${e.y + hang - (kind === "apple" ? 70 : 58)}) scale(0.95)`}>
              <Veg kind={kind} expr={kind === "apple" ? "happy" : "wow"} />
            </g>
          ) : (
            <g transform={`translate(${e.x} ${e.y + hang - 66})`}>
              <rect x={-70} y={-62} width={140} height={128} rx={36} fill="#4fc3f7" opacity={0.85} stroke="#0288d1" strokeWidth={4} />
              <text x={0} y={18} textAnchor="middle" fontSize={56} fontWeight={700} fill="#fff" fontFamily={FONT}>
                水
              </text>
            </g>
          )}
        </g>
      ))}
      <Label x={ends[1].x} y={ends[1].y + hang + 70} text="おなじ大きさの水" size={36} color="#0277bd" start={start - 30} />
      <Chip x={cx} y={860 - 40} text={verdict} color={color} start={start + 45} size={42} />
    </g>
  );
}

// 4. ルール
export function Rule() {
  return (
    <Stage>
      <Balance cx={500} kind="apple" angleTo={11} start={90} verdict="水より かるい → うかぶ" color={BLUE} />
      <Balance cx={1420} kind="potato" angleTo={-11} start={190} verdict="水より おもい → しずむ" color={RED} />
    </Stage>
  );
}

const APPLE_PATH = "M0,-55 C35,-80 85,-55 80,0 C78,50 40,85 0,70 C-40,85 -78,50 -80,0 C-85,-55 -35,-80 0,-55Z";

// 5. リンゴの中身
export function AppleScene() {
  const frame = useCurrentFrame();
  const p = usePop(5);
  const sweep = interpolate(frame, [245, 305], [0, 90], clamp);
  const bubbles = Array.from({ length: 70 }, (_, i) => {
    const r = Math.sqrt(rand(i)) * 62;
    const t = rand(i + 100) * Math.PI * 2;
    return { x: Math.cos(t) * r, y: Math.sin(t) * r * 0.95 + 5, s: 2 + rand(i + 200) * 3.5, at: 50 + i * 2 };
  }).filter((b) => Math.hypot(b.x, b.y - 5) > 18);
  const pie = (deg: number) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return `M0,0 L0,-200 A200,200 0 0 1 ${200 * Math.cos(a)},${200 * Math.sin(a)}Z`;
  };
  return (
    <Stage>
      <g transform={`translate(560 545) scale(${3.0 * p})`}>
        <path d={APPLE_PATH} fill="#fff4d6" stroke="#e53935" strokeWidth={5} />
        <path d="M0,-55 Q4,-78 12,-92" stroke="#6d4c41" strokeWidth={5} fill="none" strokeLinecap="round" />
        <path d="M0,-25 L10,-6 L28,0 L10,8 L0,30 L-10,8 L-28,0 L-10,-6Z" fill="#f3e0a8" />
        <ellipse cx={-6} cy={-2} rx={3} ry={6} fill="#5d4037" />
        <ellipse cx={6} cy={-2} rx={3} ry={6} fill="#5d4037" />
        {bubbles.map((b, i) => {
          const s = interpolate(frame, [b.at, b.at + 8], [0, 1], clamp);
          return <circle key={i} cx={b.x} cy={b.y} r={b.s * s} fill="#b3e5fc" stroke="#29b6f6" strokeWidth={0.8} />;
        })}
      </g>
      <Label x={560} y={225} text="リンゴを 切ってみると…" size={44} start={10} />
      <Label x={560} y={835} text="水色の つぶ ＝ 空気の すきま（イメージ）" size={34} color="#0277bd" start={120} />
      <g transform="translate(1380 470)" opacity={interpolate(frame, [200, 215], [0, 1], clamp)}>
        <circle r={200} fill="#ffe9a8" stroke="#fff" strokeWidth={8} />
        <path d={pie(sweep)} fill="#4fc3f7" stroke="#fff" strokeWidth={8} />
        <text x={-30} y={70} textAnchor="middle" fontSize={44} fontWeight={700} fill="#8d6e00" fontFamily={FONT}>
          なかみ
        </text>
        <text x={95} y={-75} textAnchor="middle" fontSize={44} fontWeight={700} fill="#fff" fontFamily={FONT} opacity={sweep / 90}>
          空気
        </text>
      </g>
      <Label x={1380} y={240} text="リンゴの 約4分の1 は 空気" size={44} start={255} />
      <Chip x={1380} y={760} text="水より かるい → うかぶ" color={BLUE} start={380} size={42} />
    </Stage>
  );
}

const PEPPER_PATH = "M-62,-40 C-84,10 -62,72 -22,76 C-8,82 8,82 22,76 C62,72 84,10 62,-40 C42,-62 20,-46 0,-56 C-20,-46 -42,-62 -62,-40Z";

// 6. ピーマン
export function PepperScene() {
  const frame = useCurrentFrame();
  const p = usePop(5);
  const items: TankItem[] = [{ kind: "pepper", x: 360, delay: 60, mode: "float", s: 1.2, expr: "happy" }];
  return (
    <>
      <Stage>
        <g transform={`translate(520 520) scale(${3 * p})`}>
          <path d={PEPPER_PATH} fill="#43a047" stroke="#1b5e20" strokeWidth={3} />
          <path d={PEPPER_PATH} fill="#d7f1ff" transform="scale(0.84) translate(0 4)" />
          <path d="M-9,-54 L-7,-80 Q0,-92 12,-86 L9,-54Z" fill="#2e7d32" />
          <ellipse cx={0} cy={-34} rx={16} ry={11} fill="#f1f8e9" />
          {[-12, -4, 4, 12, -8, 8, 0].map((x, i) => (
            <ellipse key={i} cx={x} cy={-22 + (i > 3 ? 7 : 0)} rx={3.5} ry={2.6} fill="#fff8e1" stroke="#e0d6a8" strokeWidth={0.6} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <circle key={i} cx={-30 + i * 15} cy={30 + 12 * Math.sin(frame * 0.1 + i)} r={5} fill="none" stroke="#81d4fa" strokeWidth={1.5} />
          ))}
        </g>
        <Label x={520} y={255} text="なかは からっぽ" size={46} start={10} />
        <Label x={520} y={560} text="空気" size={60} color="#0277bd" start={40} />
        <Tank x={1000} y={280} w={720} h={520} items={items} />
        <g transform={`translate(1500 195) scale(${usePop(120)})`}>
          <circle r={42} fill="none" stroke="#fff" strokeWidth={26} />
          <circle r={42} fill="none" stroke="#ef5350" strokeWidth={26} strokeDasharray="33 33" />
        </g>
        <Label x={1440} y={210} text="うきわ みたい！" size={44} start={120} anchor="end" />
      </Stage>
      <TankSounds items={items} />
    </>
  );
}

const POTATO_PATH = "M-88,-8 C-88,-56 -30,-66 10,-60 C62,-54 92,-30 90,6 C88,46 40,62 -6,60 C-56,58 -88,36 -88,-8Z";

// 7. ジャガイモ
export function PotatoScene() {
  const frame = useCurrentFrame();
  const p = usePop(5);
  const grains: { x: number; y: number; at: number }[] = [];
  let n = 0;
  for (let gy = -52; gy <= 52; gy += 9) {
    for (let gx = -84; gx <= 86; gx += 10) {
      const x = gx + (rand(n) - 0.5) * 4 + (Math.abs(gy / 9) % 2) * 5;
      const y = gy + (rand(n + 50) - 0.5) * 4;
      if ((x / 84) ** 2 + ((y - 1) / 56) ** 2 < 0.9) grains.push({ x, y, at: 40 + rand(n + 9) * 150 });
      n++;
    }
  }
  const items: TankItem[] = [{ kind: "potato", x: 360, delay: 220, mode: "sink", s: 1.2, expr: "wow" }];
  return (
    <>
      <Stage>
        <g transform={`translate(520 520) scale(${3.1 * p})`}>
          <path d={POTATO_PATH} fill="#fff1bf" stroke="#a1825f" strokeWidth={4} />
          {grains.map((g, i) => {
            const s = interpolate(frame, [g.at, g.at + 8], [0, 1], clamp);
            return <ellipse key={i} cx={g.x} cy={g.y} rx={4.6 * s} ry={3.8 * s} fill="#fffdf5" stroke="#d9c38a" strokeWidth={0.8} />;
          })}
        </g>
        <Label x={520} y={255} text="ジャガイモの なか" size={46} start={10} />
        <Chip x={520} y={800} text="でんぷん が ぎっしり" color="#a1662f" start={120} size={42} />
        <Tank x={1000} y={280} w={720} h={520} items={items} />
        <Chip x={1360} y={220} text="水より おもい → しずむ" color={RED} start={impact(220) + 40} size={40} />
      </Stage>
      <TankSounds items={items} />
    </>
  );
}

// 8. 大根
export function DaikonScene() {
  const frame = useCurrentFrame();
  const p = usePop(5);
  const items: TankItem[] = [{ kind: "daikon", x: 400, delay: 120, mode: "sink", s: 1.2, sinkTau: 32, expr: "wow" }];
  return (
    <>
      <Stage>
        <g transform={`translate(520 520) scale(${p})`}>
          <circle r={210} fill="#fbfbf4" stroke="#d6d6c8" strokeWidth={10} />
          <circle r={150} fill="none" stroke="#ecebdc" strokeWidth={4} />
          {Array.from({ length: 36 }, (_, i) => {
            const a = (i / 36) * Math.PI * 2;
            return <line key={i} x1={Math.cos(a) * 20} y1={Math.sin(a) * 20} x2={Math.cos(a) * 200} y2={Math.sin(a) * 200} stroke="#efeee2" strokeWidth={3} />;
          })}
          {Array.from({ length: 160 }, (_, i) => {
            const r = Math.sqrt(rand(i + 7)) * 195;
            const a = rand(i + 300) * Math.PI * 2;
            const s = interpolate(frame, [30 + i * 0.8, 38 + i * 0.8], [0, 1], clamp);
            return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={4 * s} fill="#e6e4cf" />;
          })}
        </g>
        <Label x={520} y={255} text="大根の 切り口" size={46} start={10} />
        <Chip x={520} y={800} text="なかみが ぎゅっ！" color="#7c8a3a" start={70} size={42} />
        <Tank x={1000} y={280} w={720} h={520} items={items} />
        <Chip x={1360} y={220} text="ほんのすこし おもい → しずむ" color={RED} start={impact(120) + 70} size={36} />
      </Stage>
      <TankSounds items={items} />
    </>
  );
}

// 9. そだつ ばしょ
export function GroundScene() {
  const frame = useCurrentFrame();
  const pops = [usePop(15), usePop(35), usePop(95), usePop(115), usePop(225)];
  const GY = 540;
  const sway = (i: number) => 2 * Math.sin(frame * 0.07 + i);
  return (
    <Stage>
      <rect x={0} y={GY} width={1920} height={540} fill="#a1785a" />
      <rect x={0} y={GY} width={1920} height={18} fill="#7cb342" />
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} cx={rand(i) * 1920} cy={GY + 40 + rand(i + 40) * 240} r={4 + rand(i + 80) * 5} fill="#8a6447" />
      ))}
      <g transform={`translate(300 ${GY}) scale(${pops[0]}) translate(-300 ${-GY})`}>
        <rect x={286} y={300} width={30} height={GY - 300} fill="#795548" />
        <circle cx={300} cy={260} r={135} fill="#66bb6a" />
        <circle cx={230} cy={300} r={80} fill="#4caf50" />
        <g transform={`translate(345 ${330 + sway(1)}) scale(0.6)`}>
          <Apple expr="happy" />
        </g>
        <g transform={`translate(230 ${250 + sway(2)}) scale(0.45)`}>
          <Apple expr="none" />
        </g>
      </g>
      <g transform={`translate(620 ${GY}) scale(${pops[1]}) translate(-620 ${-GY})`}>
        <path d={`M620,${GY} Q610,420 630,300`} stroke="#388e3c" strokeWidth={10} fill="none" />
        <ellipse cx={575} cy={360} rx={50} ry={20} fill="#4caf50" transform="rotate(-25 575 360)" />
        <ellipse cx={680} cy={330} rx={50} ry={20} fill="#66bb6a" transform="rotate(25 680 330)" />
        <g transform={`translate(660 ${440 + sway(3)}) scale(0.6) rotate(10)`}>
          <Pepper expr="happy" />
        </g>
      </g>
      <g transform={`translate(1000 ${GY}) scale(${pops[2]}) translate(-1000 ${-GY})`}>
        <path d={`M1000,${GY} L1000,470`} stroke="#388e3c" strokeWidth={8} />
        <ellipse cx={970} cy={470} rx={36} ry={16} fill="#4caf50" transform="rotate(-20 970 470)" />
        <ellipse cx={1030} cy={460} rx={36} ry={16} fill="#66bb6a" transform="rotate(20 1030 460)" />
        <path d={`M1000,${GY} Q980,590 960,620 M1000,${GY} Q1030,610 1060,680`} stroke="#d7ccc8" strokeWidth={4} fill="none" />
        <g transform="translate(960 650) scale(0.7)">
          <Potato expr="wow" />
        </g>
        <g transform="translate(1075 700) scale(0.5)">
          <Potato expr="none" />
        </g>
      </g>
      <g transform={`translate(1290 640) scale(${1.15 * pops[3]}) rotate(90)`}>
        <Daikon expr="wow" />
      </g>
      <g transform={`translate(1680 ${GY - 20}) scale(${0.8 * pops[4]})`}>
        <Onion />
      </g>
      <Chip x={560} y={190} text="土の上で そだつ → うきやすい" color={BLUE} start={50} size={40} />
      <Chip x={1000} y={812} text="土の中で そだつ → しずみやすい" color={RED} start={130} size={38} />
      <Label x={1660} y={330} text="れいがい：たまねぎ" size={46} color="#6d4c41" start={230} />
      <Label x={1660} y={392} text="うく ことも おおい" size={40} color="#6d4c41" start={240} />
    </Stage>
  );
}

// 10. しおみず実験
export function Experiment() {
  const frame = useCurrentFrame();
  const riseAt = 335;
  const items: TankItem[] = [{ kind: "potato", x: 400, delay: 10, mode: "rise", riseAt, s: 1.2, expr: "wow" }];
  const water = interpolateColors(frame, [110, 290], ["#4fc3f7", "#a7dcef"]);
  const shaking = frame > 100 && frame < 290;
  const tilt = shaking ? 140 + 12 * Math.sin(frame * 0.9) : interpolate(frame, [70, 100], [0, 140], clamp);
  const p = usePop(60);
  return (
    <>
      <Stage>
        <Tank x={560} y={280} w={800} h={520} items={items} waterColor={water} />
        <g transform={`translate(1000 150) scale(${p * interpolate(frame, [300, 315], [1, 0], clamp)}) rotate(${frame > 290 ? interpolate(frame, [290, 310], [140, 0], clamp) : tilt})`}>
          <rect x={-55} y={-80} width={110} height={150} rx={28} fill="#fff" stroke="#90a4ae" strokeWidth={5} />
          <rect x={-40} y={-112} width={80} height={36} rx={10} fill="#cfd8dc" />
          <text x={0} y={18} textAnchor="middle" fontSize={44} fontWeight={700} fill="#455a64" fontFamily={FONT}>
            しお
          </text>
        </g>
        {Array.from({ length: 90 }, (_, i) => {
          const t0 = 110 + i * 2;
          const t = frame - t0;
          if (t < 0 || t > 30) return null;
          const x = 1000 + (rand(i) - 0.5) * 160;
          const y = 260 + t * 9;
          if (y > 280 + 156 + 60) return null;
          return <rect key={i} x={x} y={y} width={12} height={12} fill="#fff" stroke="#90a4ae" strokeWidth={2} transform={`rotate(45 ${x} ${y})`} />;
        })}
        <Label x={1410} y={560} text="しおみずは" size={46} start={200} anchor="start" />
        <Label x={1410} y={620} text="ふつうの水より" size={46} start={205} anchor="start" />
        <Label x={1410} y={680} text="おもい" size={46} start={210} anchor="start" />
        <Chip x={1220} y={330} text="うかんだ！" color={BLUE} start={riseAt + 50} size={52} />
      </Stage>
      <TankSounds items={items} />
      <Sequence from={riseAt + 40} durationInFrames={20} layout="none">
        <Audio src={staticFile("pop.mp3")} volume={0.8} />
      </Sequence>
    </>
  );
}

// 11. まとめ
export function Summary() {
  const frame = useCurrentFrame();
  const l = usePop(60);
  const r = usePop(170);
  return (
    <Stage>
      <Label x={960} y={200} text="おなじ大きさの水と くらべて…" size={54} start={10} />
      <g transform={`translate(530 540) scale(${l})`}>
        <rect x={-390} y={-270} width={780} height={540} rx={50} fill="#e1f5fe" stroke="#4fc3f7" strokeWidth={8} />
        <text x={0} y={-180} textAnchor="middle" fontSize={64} fontWeight={700} fill={BLUE} fontFamily={FONT}>
          かるい → うかぶ
        </text>
        <g transform={`translate(-140 ${10 + 6 * Math.sin(frame * 0.1)})`}>
          <Apple expr="happy" />
        </g>
        <g transform={`translate(140 ${10 + 6 * Math.sin(frame * 0.1 + 1)})`}>
          <Pepper expr="happy" />
        </g>
        <text x={0} y={200} textAnchor="middle" fontSize={50} fontWeight={700} fill="#0277bd" fontFamily={FONT}>
          空気が たくさん
        </text>
      </g>
      <g transform={`translate(1390 540) scale(${r})`}>
        <rect x={-390} y={-270} width={780} height={540} rx={50} fill="#fbe9e7" stroke="#ff8a65" strokeWidth={8} />
        <text x={0} y={-180} textAnchor="middle" fontSize={64} fontWeight={700} fill={RED} fontFamily={FONT}>
          おもい → しずむ
        </text>
        <g transform="translate(-150 20) scale(0.9)">
          <Potato expr="wow" />
        </g>
        <g transform="translate(170 20) scale(0.75)">
          <Daikon expr="wow" />
        </g>
        <text x={0} y={200} textAnchor="middle" fontSize={50} fontWeight={700} fill="#bf360c" fontFamily={FONT}>
          なかみが ぎっしり
        </text>
      </g>
    </Stage>
  );
}
