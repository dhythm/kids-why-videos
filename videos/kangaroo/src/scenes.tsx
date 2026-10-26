// 各シーン。frame は シーンの はじめからの フレーム数
import { Easing, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import { staticFile } from "remotion";
import { Kangaroo, Spring } from "./Kangaroo";
import { clamp01, hop, hopAtPhase, takeoffFrames } from "./motion";
import { Badge, fontFamily, GROUND_Y, Label, Scenery, usePop } from "./parts";

export type Line = { file: string; sub: string; from: number; frames: number };
export type SceneData = { id: string; frames: number; lines: Line[] };
type SceneProps = { scene: SceneData };

const clampOpt = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      {children}
    </svg>
  );
}

function Boings({ period, until, offset = 0, volume = 0.35 }: { period: number; until: number; offset?: number; volume?: number }) {
  return (
    <>
      {takeoffFrames(period, until, offset).map((f) => (
        <Sequence key={f} from={f} durationInFrames={15} layout="none">
          <Audio src={staticFile("sfx/boing.wav")} volume={volume} />
        </Sequence>
      ))}
    </>
  );
}

function Pop({ at }: { at: number }) {
  return (
    <Sequence from={at} durationInFrames={10} layout="none">
      <Audio src={staticFile("sfx/pop.wav")} volume={0.4} />
    </Sequence>
  );
}

function Chime({ at }: { at: number }) {
  return (
    <Sequence from={at} durationInFrames={30} layout="none">
      <Audio src={staticFile("sfx/chime.wav")} volume={0.35} />
    </Sequence>
  );
}

// 1. つかみ：はねて よこぎる
export function Intro({ scene }: SceneProps) {
  const frame = useCurrentFrame();
  const L = scene.lines;
  const period = 34;
  const x = interpolate(frame, [0, scene.frames], [-250, 2150]);
  const pose = hop(frame, period, 170);
  const title = usePop(L[1].from, 9);
  const q = Math.sin(frame / 6) * 10;
  return (
    <>
      <Scenery />
      <Stage>
        <g transform={`translate(${x} ${GROUND_Y}) scale(1.05)`}>
          <Kangaroo pose={pose} tail={6} />
        </g>
      </Stage>
      <div
        style={{
          position: "absolute",
          top: 120,
          width: "100%",
          textAlign: "center",
          fontFamily,
          fontWeight: 800,
          fontSize: 104,
          color: "#fff",
          WebkitTextStroke: "14px #E8702A",
          paintOrder: "stroke fill",
          transform: `scale(${title})`,
          lineHeight: 1.3,
        }}
      >
        カンガルーは どうして
        <br />
        ぴょんぴょん はねるの
        <span style={{ display: "inline-block", transform: `translateY(${q}px) rotate(${q}deg)` }}>？</span>
      </div>
      <Boings period={period} until={scene.frames} />
      <Pop at={L[1].from} />
    </>
  );
}

// 2. ひみつ1：ながくて つよい うしろあし と すじ
export function Legs({ scene }: SceneProps) {
  const frame = useCurrentFrame();
  const L = scene.lines;
  const zoom = interpolate(frame, [L[2].from - 10, L[2].from + 25], [1, 1.3], { ...clampOpt, easing: Easing.inOut(Easing.cubic) });
  const glow = frame >= L[1].from ? 0.5 + 0.5 * Math.sin(frame / 5) : 0;
  const springOn = frame >= L[2].from + 10;
  const stretch = springOn ? 0.5 + 0.5 * Math.sin((frame - L[2].from) / 7) : 0;
  const breathe = Math.sin(frame / 18) * 0.03;
  // 足元に ズーム
  const cx = 700;
  const cy = 1000;
  return (
    <>
      <Scenery />
      <Stage>
        <g transform={`translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})`}>
          <g transform={`translate(800 ${GROUND_Y}) scale(1.75)`}>
            <Kangaroo
              pose={{ y: 0, crouch: Math.max(0, breathe * 4) * 0.3 + (springOn ? stretch * 0.5 : 0), extend: 0 }}
              highlight={frame >= L[1].from ? "leg" : null}
              glow={glow}
              spring={springOn ? stretch : null}
              blink={frame % 90 > 84}
            />
          </g>
        </g>
      </Stage>
      <Badge start={L[0].from}>ひみつ その1</Badge>
      {frame >= L[1].from && frame < L[2].from && (
        <Label x={1350} y={560} start={L[1].from} color="#D84315">ながくて つよい！</Label>
      )}
      {frame >= L[2].from + 10 && (
        <Label x={1420} y={420} start={L[2].from + 10} color="#C62828">ゴムみたいに のびる すじ</Label>
      )}
      <Chime at={L[0].from} />
      <Pop at={L[1].from} />
      <Pop at={L[2].from + 10} />
    </>
  );
}

// 3. ばねの しくみ：のびて ためる → もどって ぽーん
export function SpringScene({ scene }: SceneProps) {
  const frame = useCurrentFrame();
  const L = scene.lines;
  const period = 70;
  const pose = hop(frame, period, 230);
  const energy = pose.crouch;
  const inAir = pose.y < -20;
  const tramp = frame >= L[2].from;
  const ball = pose;
  return (
    <>
      <Scenery />
      <Stage>
        <g transform={`translate(560 ${GROUND_Y}) scale(1.5)`}>
          <Kangaroo pose={pose} spring={pose.crouch} tail={4} />
        </g>
        {/* ちからメーター */}
        {!tramp && (
          <g transform="translate(1250 300)">
            <rect x={0} y={0} width={140} height={440} rx={30} fill="#fff" stroke="#6B3A1E" strokeWidth={8} />
            <rect x={14} y={14 + 412 * (1 - energy)} width={112} height={412 * energy} rx={20} fill="#FF7043" />
            <text x={70} y={510} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={48} fill="#3A2A1E">ちから</text>
          </g>
        )}
        {/* トランポリンと くらべる */}
        {tramp && (
          <g transform="translate(1440 820)" opacity={clamp01((frame - L[2].from) / 10)}>
            <path d={`M -170 0 Q 0 ${50 * ball.crouch} 170 0`} fill="none" stroke="#1E88E5" strokeWidth={18} strokeLinecap="round" />
            <line x1={-150} y1={0} x2={-180} y2={60} stroke="#555" strokeWidth={12} strokeLinecap="round" />
            <line x1={150} y1={0} x2={180} y2={60} stroke="#555" strokeWidth={12} strokeLinecap="round" />
            <circle cx={0} cy={-55 + ball.y + 40 * ball.crouch} r={55} fill="#FFCA28" stroke="#6B3A1E" strokeWidth={6} />
          </g>
        )}
        {inAir && pose.y > -120 && pose.extend > 0.5 && (
          <g transform="translate(560 860)">
            {[-60, -20, 20, 60].map((a) => (
              <line key={a} x1={0} y1={0} x2={Math.sin((a * Math.PI) / 180) * 140} y2={-Math.cos((a * Math.PI) / 180) * 40 + 10} stroke="#fff" strokeWidth={10} strokeLinecap="round" />
            ))}
          </g>
        )}
      </Stage>
      {energy > 0.35 && !tramp && (
        <Label x={1000} y={330} start={0} color="#C62828">ぎゅーっ ためる</Label>
      )}
      {inAir && !tramp && (
        <Label x={1000} y={330} start={0} color="#1565C0">ぽーん！</Label>
      )}
      {tramp && <Label x={1440} y={420} start={L[2].from + 5} color="#1565C0">トランポリンみたい！</Label>}
      <Boings period={period} until={scene.frames} volume={0.3} />
    </>
  );
}

// 4. ひみつ2：はやく しても つかう いきは ほぼ おなじ（Dawson & Taylor 1973：じそく9〜22キロ）
export function Energy({ scene }: SceneProps) {
  const frame = useCurrentFrame();
  const L = scene.lines;
  const speedAt = (f: number) =>
    interpolate(f, [L[1].from + 20, L[1].from + L[1].frames], [9, 22], clampOpt);
  // 速いほど 跳ぶ回数も 地面の流れも はやくなる
  let phase = 0;
  let scroll = 0;
  for (let f = 0; f < frame; f++) {
    const v = speedAt(f);
    phase += 1 / interpolate(v, [9, 22], [40, 27]);
    scroll += v * 1.6;
  }
  const speed = speedAt(frame);
  const pose = hopAtPhase(phase, 150);
  const meter = 0.5 + Math.sin(frame / 9) * 0.015;
  const showGraph = frame >= L[2].from;
  const draw = interpolate(frame, [L[2].from, L[2].from + 45], [0, 1], clampOpt);
  const cycle = frame >= L[3].from;
  return (
    <>
      <Scenery scroll={scroll} />
      <Stage>
        <g transform={`translate(${cycle ? 480 : 560} ${GROUND_Y}) scale(1.25)`}>
          <Kangaroo pose={pose} tail={8} spring={cycle ? pose.crouch : null} />
        </g>
        {/* はやさ */}
        <g transform="translate(1110 250)">
          <rect x={0} y={0} width={680} height={150} rx={30} fill="#fff" stroke="#1565C0" strokeWidth={8} />
          <text x={40} y={98} fontFamily={fontFamily} fontWeight={800} fontSize={50} fill="#1565C0">はやさ じそく</text>
          <text x={530} y={108} textAnchor="end" fontFamily={fontFamily} fontWeight={800} fontSize={96} fill="#1565C0">{Math.round(speed)}</text>
          <text x={545} y={98} fontFamily={fontFamily} fontWeight={800} fontSize={50} fill="#1565C0">キロ</text>
        </g>
        {/* つかう いき */}
        {!showGraph && (
          <g transform="translate(1110 440)">
            <rect x={0} y={0} width={680} height={150} rx={30} fill="#fff" stroke="#2E7D32" strokeWidth={8} />
            <text x={40} y={95} fontFamily={fontFamily} fontWeight={800} fontSize={50} fill="#2E7D32">つかう いき</text>
            <rect x={330} y={45} width={310} height={60} rx={30} fill="#E8F5E9" />
            <rect x={330} y={45} width={310 * meter} height={60} rx={30} fill="#43A047" />
          </g>
        )}
        {showGraph && !cycle && (
          <g transform="translate(1110 440)">
            <rect x={0} y={0} width={680} height={330} rx={30} fill="#fff" stroke="#2E7D32" strokeWidth={8} />
            <line x1={90} y1={260} x2={640} y2={260} stroke="#555" strokeWidth={6} />
            <line x1={90} y1={260} x2={90} y2={40} stroke="#555" strokeWidth={6} />
            <text x={365} y={312} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={34} fill="#555">はやさ（9 → 22キロ）</text>
            <text x={60} y={150} textAnchor="middle" fontFamily={fontFamily} fontWeight={800} fontSize={34} fill="#555" transform="rotate(-90 60 150)">いき</text>
            <line x1={110} y1={130} x2={110 + 510 * draw} y2={130} stroke="#43A047" strokeWidth={14} strokeLinecap="round" />
          </g>
        )}
        {cycle && (
          <g transform="translate(1450 600)">
            <g transform={`rotate(${Math.sin((frame - L[3].from) / 12) * 12})`}>
              <path d="M -170 0 A 170 170 0 0 1 150 -80" fill="none" stroke="#FF7043" strokeWidth={22} strokeLinecap="round" />
              <polygon points="170,-110 120,-95 165,-50" fill="#FF7043" />
              <path d="M 170 0 A 170 170 0 0 1 -150 80" fill="none" stroke="#1E88E5" strokeWidth={22} strokeLinecap="round" />
              <polygon points="-170,110 -120,95 -165,50" fill="#1E88E5" />
            </g>
            <Spring x1={0} y1={70} x2={0} y2={-70} coils={5} width={28} />
          </g>
        )}
      </Stage>
      <Badge start={L[0].from} color="#43A047">ひみつ その2</Badge>
      {showGraph && !cycle && draw >= 1 && (
        <Label x={1450} y={880} start={L[2].from + 45} color="#2E7D32" size={58}>ほとんど かわらない！</Label>
      )}
      {cycle && (
        <>
          <Label x={1730} y={560} start={L[3].from + 5} color="#D84315" size={48}>ためる</Label>
          <Label x={1170} y={660} start={L[3].from + 20} color="#1565C0" size={48}>つかう</Label>
        </>
      )}
      <Chime at={L[0].from} />
      <Pop at={L[2].from + 45} />
    </>
  );
}

// 5. ひみつ3：しっぽは 5ほんめの あし（ゆっくり あるく とき）
export function Tail({ scene }: SceneProps) {
  const frame = useCurrentFrame();
  const L = scene.lines;
  const period = 48;
  const p = (frame % period) / period;
  const step = Math.floor(frame / period);
  // まえ半分で からだを まえへ はこび、うしろ半分は とまる
  const move = p < 0.55 ? Easing.inOut(Easing.cubic)(p / 0.55) : 1;
  const x = 380 + (step + move) * 70;
  const lift = p < 0.55 ? Math.sin(Math.PI * (p / 0.55)) : 0;
  const glow = frame >= L[0].from + 15 ? 0.5 + 0.5 * Math.sin(frame / 5) : 0;
  const pushOn = frame >= L[1].from;
  const tailTipX = x - 300;
  return (
    <>
      <Scenery />
      <Stage>
        <g transform={`translate(${x} ${GROUND_Y - lift * 30}) scale(1.45)`}>
          <Kangaroo pose={{ y: 0, crouch: 0.6 - lift * 0.3, extend: lift * 0.25 }} lean={22} tail={-30 + lift * 4} highlight="tail" glow={glow} />
        </g>
        {pushOn && (
          <g transform={`translate(${tailTipX} ${GROUND_Y - 60})`} opacity={0.5 + 0.5 * lift}>
            <line x1={-80} y1={0} x2={60} y2={0} stroke="#E53935" strokeWidth={20} strokeLinecap="round" />
            <polygon points="100,0 50,-36 50,36" fill="#E53935" />
          </g>
        )}
      </Stage>
      <Badge start={L[0].from} color="#7E57C2">ひみつ その3</Badge>
      {frame >= L[0].from + 15 && (
        <Label x={Math.max(260, tailTipX)} y={GROUND_Y - 230} start={L[0].from + 15} color="#6A1B9A" size={56}>
          5ほんめの あし！
        </Label>
      )}
      {pushOn && (
        <>
          <Label x={1500} y={330} start={L[1].from + 10} color="#6A1B9A" size={50}>からだを ささえる</Label>
          <Label x={1500} y={460} start={L[1].from + 50} color="#E53935" size={50}>まえに おす</Label>
        </>
      )}
      <Chime at={L[0].from} />
      <Pop at={L[0].from + 15} />
    </>
  );
}

// オーストラリアの りんかく（けいど・いど の おおまかな てん）
const AUS: [number, number][] = [
  [113.5, -22], [114, -26], [115, -30], [115.2, -34], [118, -35], [121, -33.8], [124, -33.5], [126.5, -32.2],
  [129, -31.6], [131.5, -31.5], [134, -32.6], [135.8, -34.8], [137.6, -33], [138, -34.8], [139.5, -36.5], [140.5, -38],
  [143.5, -38.8], [146.4, -39.1], [148, -37.8], [150, -37.4], [150.8, -34.5], [152.5, -32], [153.6, -28.2],
  [153.1, -25.5], [151, -23.5], [149.2, -21.5], [146.3, -19], [145.5, -16.5], [145.4, -14.8], [143.6, -14.2],
  [142.5, -10.8], [141.6, -12.8], [141.5, -16.5], [139.2, -17.4], [137, -16], [135.5, -14.8], [136.8, -12.2],
  [133, -11.4], [131, -12.2], [130, -13.2], [129.5, -15], [127.8, -14.2], [125.5, -14.6], [123.6, -16.4],
  [122.2, -18], [121, -19.6], [118.8, -20.3], [116.7, -20.6], [114.6, -21.8],
];
const TAS: [number, number][] = [[144.7, -40.7], [146.6, -41.1], [148.3, -40.9], [148, -42.9], [146.8, -43.6], [145.3, -42.3]];
const toMap = ([lon, lat]: [number, number]) => [(lon - 112) * 19, (-9 - lat) * 19] as const;
const poly = (pts: [number, number][]) => pts.map((p) => toMap(p).join(",")).join(" ");

// 6. オーストラリア：ひろくて かわいている → とおくまで いく
export function Australia({ scene }: SceneProps) {
  const frame = useCurrentFrame();
  const L = scene.lines;
  const mapPop = usePop(0, 13);
  const travel = interpolate(frame, [L[1].from, L[1].from + L[1].frames + 10], [0, 1], clampOpt);
  const start = toMap([118.5, -24]);
  const end = toMap([146, -24]);
  const px = start[0] + (end[0] - start[0]) * travel;
  const arc = -Math.abs(Math.sin(travel * Math.PI * 9)) * 45;
  const py = start[1] + arc;
  const pose = travel > 0 && travel < 1 ? hop(frame, 22, 0) : { y: 0, crouch: 0, extend: 0 };
  const shimmer = Math.sin(frame / 4) * 4;
  return (
    <>
      <Scenery sky={["#FFC46B", "#FFF1C9"]} ground="#E8935A" />
      <Stage>
        <g transform={`translate(220 150) scale(${mapPop})`}>
          <polygon points={poly(AUS)} fill="#F0A060" stroke="#8D4A20" strokeWidth={8} strokeLinejoin="round" />
          <polygon points={poly(TAS)} fill="#F0A060" stroke="#8D4A20" strokeWidth={8} strokeLinejoin="round" />
          {/* かわいた ひびわれ */}
          {frame >= L[0].from + 60 &&
            [[300, 300], [430, 380], [250, 420], [520, 260]].map(([x, y], i) => (
              <path key={i} d={`M ${x} ${y} l 20 15 l -10 20 l 25 10 M ${x + 20} ${y + 15} l 25 -8`} fill="none" stroke="#8D4A20" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
            ))}
          {frame >= L[1].from && (
            <>
              <line x1={start[0]} y1={start[1]} x2={end[0]} y2={end[1]} stroke="#fff" strokeWidth={8} strokeDasharray="4 22" strokeLinecap="round" />
              {/* みず と くさ */}
              <g transform={`translate(${end[0] + 30} ${end[1] - 20}) scale(${popValue(frame, L[1].from + 20)})`}>
                <path d="M 0 -60 C 30 -20, 40 0, 40 15 A 40 40 0 0 1 -40 15 C -40 0, -30 -20, 0 -60 Z" fill="#29B6F6" stroke="#01579B" strokeWidth={6} />
              </g>
              <g transform={`translate(${end[0] - 60} ${end[1] + 60}) scale(${popValue(frame, L[1].from + 30)})`}>
                {[-24, 0, 24].map((dx) => (
                  <path key={dx} d={`M ${dx} 20 Q ${dx - 6} -15 ${dx + 10} -40`} fill="none" stroke="#43A047" strokeWidth={12} strokeLinecap="round" />
                ))}
              </g>
              <g transform={`translate(${px} ${py}) scale(0.32)`}>
                <Kangaroo pose={pose} tail={6} />
              </g>
            </>
          )}
        </g>
        {/* あつい ゆらゆら */}
        {[1300, 1500, 1700].map((x, i) => (
          <path key={x} d={`M ${x} 760 q 20 -30 0 -60 q -20 -30 0 -60`} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" opacity={0.6} transform={`translate(${shimmer * (i % 2 ? 1 : -1)} 0)`} />
        ))}
      </Stage>
      <Label x={1500} y={330} start={L[0].from + 20} color="#D84315" size={70}>ひろーい！</Label>
      {frame >= L[0].from + 60 && <Label x={1500} y={490} start={L[0].from + 60} color="#8D4A20" size={56}>かわいている</Label>}
      <Pop at={L[0].from + 20} />
      <Pop at={L[0].from + 60} />
    </>
  );
}

// 条件付きで 出す要素の ポップ（フックを 使わない版）
function popValue(frame: number, start: number) {
  return Easing.out(Easing.back(2.2))(clamp01((frame - start) / 14));
}

// 7. まとめ
export function Outro({ scene }: SceneProps) {
  const frame = useCurrentFrame();
  const L = scene.lines;
  const period = 30;
  const pose = hop(frame, period, 200);
  const cards = [
    { text: "あしの ばね", color: "#E53935", at: L[0].from },
    { text: "しっぽで ささえる", color: "#7E57C2", at: L[0].from + 40 },
    { text: "つかれにくい", color: "#43A047", at: L[0].from + 85 },
  ];
  const final = frame >= L[2].from;
  return (
    <>
      <Scenery />
      <Stage>
        <g transform={`translate(${final ? 960 : 1260} ${GROUND_Y}) scale(1.3)`}>
          <Kangaroo pose={pose} tail={8} blink={pose.y < -150} />
        </g>
        {final &&
          Array.from({ length: 26 }, (_, i) => {
            const t = frame - L[2].from;
            const x = (i * 263) % 1920;
            const y = ((t * (6 + (i % 5)) + i * 97) % 1100) - 60;
            const colors = ["#FF7043", "#FFCA28", "#42A5F5", "#66BB6A", "#AB47BC"];
            return <rect key={i} x={x} y={y} width={22} height={34} rx={6} fill={colors[i % 5]} transform={`rotate(${t * 8 + i * 40} ${x + 11} ${y + 17})`} />;
          })}
      </Stage>
      {!final &&
        cards.map((c, i) =>
          frame >= c.at ? (
            <Label key={c.text} x={520} y={260 + i * 150} start={c.at} color={c.color} size={64}>
              {c.text}
            </Label>
          ) : null,
        )}
      {final && (
        <div
          style={{
            position: "absolute",
            top: 110,
            width: "100%",
            textAlign: "center",
            fontFamily,
            fontWeight: 800,
            fontSize: 130,
            color: "#fff",
            WebkitTextStroke: "16px #E8702A",
            paintOrder: "stroke fill",
            transform: `scale(${popValue(frame, L[2].from)}) translateY(${pose.y * 0.15}px)`,
          }}
        >
          きみも ジャンプ！
        </div>
      )}
      {cards.map((c) => <Pop key={c.text} at={c.at} />)}
      <Chime at={L[2].from} />
      <Boings period={period} until={scene.frames} volume={0.25} />
    </>
  );
}
