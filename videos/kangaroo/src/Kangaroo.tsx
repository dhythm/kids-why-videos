// カンガルーのキャラクター（右向き）。原点は足が地面につく位置。
import { HopPose } from "./motion";

const FUR = "#D9884A";
const FUR_DARK = "#B8672F";
const BELLY = "#F7D6AE";
const LINE = "#6B3A1E";
const GLOW = "#FFE14D";

type Props = {
  pose?: HopPose;
  tail?: number; // しっぽの角度（+ で上がる）
  lean?: number; // からだの前傾（度）
  highlight?: "leg" | "tail" | null;
  glow?: number; // ハイライトの強さ 0..1
  spring?: number | null; // すじ（ばね）を表示するときの伸び 0..1
  blink?: boolean;
};

export function Spring({
  x1, y1, x2, y2, coils = 7, width = 22, color = "#E53935",
}: {
  x1: number; y1: number; x2: number; y2: number; coils?: number; width?: number; color?: string;
}) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const pts: string[] = [`${x1},${y1}`];
  const steps = coils * 2;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const side = i % 2 === 0 ? -1 : 1;
    pts.push(`${x1 + dx * t + nx * width * side},${y1 + dy * t + ny * width * side}`);
  }
  pts.push(`${x2},${y2}`);
  return (
    <g>
      <polyline points={pts.join(" ")} fill="none" stroke="#fff" strokeWidth={14} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
    </g>
  );
}

function Leg({ color, glow }: { color: string; glow: number }) {
  const stroke = glow > 0 ? GLOW : LINE;
  const sw = 5 + glow * 9;
  return (
    <g stroke={stroke} strokeWidth={sw} strokeLinejoin="round">
      {/* すね */}
      <path d="M 25 -100 L 60 -72 L -22 -6 L -50 -24 Z" fill={color} />
      {/* ながい あし */}
      <path d="M -54 -26 C -56 -4, -34 0, -6 0 L 102 0 C 114 0, 114 -16, 100 -18 L -18 -26 Z" fill={color} />
      {/* ふともも */}
      <ellipse cx={-5} cy={-92} rx={64} ry={54} transform="rotate(-15 -5 -92)" fill={color} />
    </g>
  );
}

export function Kangaroo({
  pose = { y: 0, crouch: 0, extend: 0 },
  tail = 0,
  lean = 0,
  highlight = null,
  glow = 0,
  spring = null,
  blink = false,
}: Props) {
  const { crouch, extend } = pose;
  const sx = 1 + 0.1 * crouch - 0.04 * extend;
  const sy = 1 - 0.14 * crouch + 0.06 * extend;
  const legRot = 38 * extend - 8 * crouch;
  const bodyDrop = 22 * crouch;
  const legGlow = highlight === "leg" ? glow : 0;
  const tailGlow = highlight === "tail" ? glow : 0;
  // すじは かかとから ひざの うらへ。着地で のびる
  const springTop = { x: 2 - 10 * (spring ?? 0), y: -112 - 26 * (spring ?? 0) };

  return (
    <g transform={`translate(0 ${pose.y}) scale(${sx} ${sy}) rotate(${lean})`}>
      {/* しっぽ */}
      <g transform={`rotate(${tail - 4 * crouch + 10 * extend} -30 -100)`}>
        <path
          d="M -20 -128 C -95 -112, -165 -62, -232 -12 C -240 -5, -233 4, -222 1 C -152 -28, -82 -54, -2 -78 Z"
          fill={FUR}
          stroke={tailGlow > 0 ? GLOW : LINE}
          strokeWidth={5 + tailGlow * 10}
          strokeLinejoin="round"
        />
      </g>
      {/* おくの あし */}
      <g transform={`translate(14 -4) rotate(${legRot} -10 -95)`}>
        <Leg color={FUR_DARK} glow={0} />
      </g>
      <g transform={`translate(0 ${bodyDrop})`}>
        {/* からだ */}
        <ellipse cx={25} cy={-178} rx={74} ry={110} transform="rotate(18 25 -178)" fill={FUR} stroke={LINE} strokeWidth={5} />
        <ellipse cx={48} cy={-168} rx={42} ry={80} transform="rotate(18 48 -168)" fill={BELLY} />
        {/* おなかの ふくろ */}
        <path d="M 22 -140 Q 50 -112 84 -128" fill="none" stroke={FUR_DARK} strokeWidth={5} strokeLinecap="round" />
        {/* うで */}
        <path d="M 88 -222 Q 120 -198 122 -168" fill="none" stroke={LINE} strokeWidth={22} strokeLinecap="round" />
        <path d="M 88 -222 Q 120 -198 122 -168" fill="none" stroke={FUR_DARK} strokeWidth={13} strokeLinecap="round" />
        {/* あたま */}
        <g transform="translate(82 -300)">
          <ellipse cx={-28} cy={-44} rx={13} ry={36} transform="rotate(-28 -28 -44)" fill={FUR_DARK} stroke={LINE} strokeWidth={5} />
          <ellipse cx={-8} cy={-48} rx={15} ry={40} transform="rotate(-16 -8 -48)" fill={FUR} stroke={LINE} strokeWidth={5} />
          <ellipse cx={-7} cy={-52} rx={7} ry={26} transform="rotate(-16 -7 -52)" fill="#F4A7A0" />
          <ellipse cx={0} cy={0} rx={46} ry={38} fill={FUR} stroke={LINE} strokeWidth={5} />
          <ellipse cx={46} cy={12} rx={34} ry={23} fill={FUR} stroke={LINE} strokeWidth={5} />
          <ellipse cx={30} cy={8} rx={30} ry={20} fill={FUR} />
          <ellipse cx={77} cy={5} rx={9} ry={7} fill="#3B2314" />
          {blink ? (
            <path d="M 14 -8 Q 22 -2 30 -8" fill="none" stroke="#3B2314" strokeWidth={5} strokeLinecap="round" />
          ) : (
            <g>
              <circle cx={22} cy={-8} r={8} fill="#3B2314" />
              <circle cx={25} cy={-11} r={3} fill="#fff" />
            </g>
          )}
          <circle cx={14} cy={14} r={9} fill="#F4A7A0" opacity={0.7} />
          <path d="M 52 24 Q 62 31 72 24" fill="none" stroke="#3B2314" strokeWidth={4} strokeLinecap="round" />
        </g>
      </g>
      {/* てまえの あし */}
      <g transform={`rotate(${legRot} -10 -95)`}>
        <Leg color={FUR} glow={legGlow} />
        {spring !== null && <Spring x1={-50} y1={-22} x2={springTop.x - 40} y2={springTop.y + 20} coils={6} width={14} />}
      </g>
    </g>
  );
}
