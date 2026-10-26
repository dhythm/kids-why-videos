import React from "react";

export type VegKind = "apple" | "pepper" | "potato" | "daikon" | "onion";
export type Expr = "happy" | "wow" | "none";

export function Face({ expr, dy = 0 }: { expr: Expr; dy?: number }) {
  if (expr === "none") return null;
  return (
    <g transform={`translate(0 ${dy})`}>
      <ellipse cx={-20} cy={-4} rx={6} ry={8} fill="#2b2b2b" />
      <ellipse cx={20} cy={-4} rx={6} ry={8} fill="#2b2b2b" />
      <circle cx={-18} cy={-7} r={2.2} fill="#fff" />
      <circle cx={22} cy={-7} r={2.2} fill="#fff" />
      <ellipse cx={-34} cy={12} rx={9} ry={5} fill="#ff8a80" opacity={0.6} />
      <ellipse cx={34} cy={12} rx={9} ry={5} fill="#ff8a80" opacity={0.6} />
      {expr === "happy" ? (
        <path d="M-12,12 Q0,24 12,12" stroke="#2b2b2b" strokeWidth={4} fill="none" strokeLinecap="round" />
      ) : (
        <ellipse cx={0} cy={17} rx={6} ry={8} fill="#2b2b2b" />
      )}
    </g>
  );
}

export function Apple({ expr = "happy" }: { expr?: Expr }) {
  return (
    <g>
      <path d="M0,-55 C35,-80 85,-55 80,0 C78,50 40,85 0,70 C-40,85 -78,50 -80,0 C-85,-55 -35,-80 0,-55Z" fill="#e53935" stroke="#b71c1c" strokeWidth={3} />
      <ellipse cx={-42} cy={-28} rx={14} ry={22} fill="#fff" opacity={0.35} transform="rotate(25 -42 -28)" />
      <path d="M0,-55 Q4,-78 12,-92" stroke="#6d4c41" strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M8,-74 Q38,-102 64,-82 Q36,-62 8,-74Z" fill="#66bb6a" stroke="#2e7d32" strokeWidth={2} />
      <Face expr={expr} dy={8} />
    </g>
  );
}

export function Pepper({ expr = "happy" }: { expr?: Expr }) {
  return (
    <g>
      <path d="M-62,-40 C-84,10 -62,72 -22,76 C-8,82 8,82 22,76 C62,72 84,10 62,-40 C42,-62 20,-46 0,-56 C-20,-46 -42,-62 -62,-40Z" fill="#43a047" stroke="#1b5e20" strokeWidth={3} />
      <path d="M-30,-30 C-40,0 -35,40 -20,60" stroke="#81c784" strokeWidth={6} fill="none" opacity={0.6} strokeLinecap="round" />
      <path d="M-9,-54 L-7,-80 Q0,-92 12,-86 L9,-54Z" fill="#2e7d32" />
      <Face expr={expr} dy={10} />
    </g>
  );
}

export function Potato({ expr = "wow" }: { expr?: Expr }) {
  return (
    <g>
      <path d="M-88,-8 C-88,-56 -30,-66 10,-60 C62,-54 92,-30 90,6 C88,46 40,62 -6,60 C-56,58 -88,36 -88,-8Z" fill="#c9a06b" stroke="#8d6e4f" strokeWidth={3} />
      {[[-60, -30], [55, -25], [62, 30], [-50, 38], [10, -48]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={5} ry={3} fill="#8d6e4f" />
      ))}
      <Face expr={expr} dy={2} />
    </g>
  );
}

// 横向きの大根（左が葉っぱ側）
export function Daikon({ expr = "wow" }: { expr?: Expr }) {
  return (
    <g>
      <path d="M-112,-10 Q-170,-70 -205,-48 Q-165,-30 -112,-4Z" fill="#43a047" />
      <path d="M-112,0 Q-185,-15 -215,10 Q-170,18 -112,8Z" fill="#66bb6a" />
      <path d="M-112,8 Q-170,55 -200,50 Q-160,25 -112,14Z" fill="#388e3c" />
      <path d="M-112,-36 C-40,-42 40,-34 100,-9 C116,-3 116,3 100,9 C40,34 -40,42 -112,36 Q-124,0 -112,-36Z" fill="#fafaf5" stroke="#bdbdb0" strokeWidth={3} />
      <path d="M-112,-36 C-90,-38 -75,-38 -60,-39 L-60,39 C-75,38 -90,37 -112,36 Q-124,0 -112,-36Z" fill="#c5e1a5" opacity={0.8} />
      <Face expr={expr} dy={0} />
    </g>
  );
}

export function Onion() {
  return (
    <g>
      <path d="M0,-80 C10,-55 70,-40 70,10 C70,55 35,70 0,70 C-35,70 -70,55 -70,10 C-70,-40 -10,-55 0,-80Z" fill="#d9a55b" stroke="#9c6b2e" strokeWidth={3} />
      <path d="M-30,-20 Q-40,20 -25,55 M30,-20 Q40,20 25,55 M0,-55 L0,62" stroke="#b88440" strokeWidth={3} fill="none" opacity={0.7} />
      <path d="M0,-80 Q-4,-100 4,-112" stroke="#7cb342" strokeWidth={6} fill="none" strokeLinecap="round" />
    </g>
  );
}

export function Veg({ kind, expr }: { kind: VegKind; expr?: Expr }) {
  switch (kind) {
    case "apple":
      return <Apple expr={expr} />;
    case "pepper":
      return <Pepper expr={expr} />;
    case "potato":
      return <Potato expr={expr} />;
    case "daikon":
      return <Daikon expr={expr} />;
    case "onion":
      return <Onion />;
  }
}

// 物体の中心から下端までの距離（スケール 1 のとき）
export const halfHeight: Record<VegKind, number> = {
  apple: 72,
  pepper: 78,
  potato: 60,
  daikon: 38,
  onion: 70,
};
