// 跳ねる動きの計算（フレーム → ポーズ）

export type HopPose = { y: number; crouch: number; extend: number };

const GROUND_SHARE = 0.28; // 1回の跳躍のうち、地面にいる割合

// phase: 跳躍の進み具合（1 で 1回分）。小数部だけを使う
export function hopAtPhase(phase: number, height: number): HopPose {
  const p = phase - Math.floor(phase);
  if (p < GROUND_SHARE) {
    return { y: 0, crouch: Math.sin((Math.PI * p) / GROUND_SHARE), extend: 0 };
  }
  const q = (p - GROUND_SHARE) / (1 - GROUND_SHARE);
  return {
    y: -height * Math.sin(Math.PI * q),
    crouch: 0,
    extend: Math.pow(Math.sin(Math.PI * q), 0.6),
  };
}

export function hop(frame: number, period: number, height: number): HopPose {
  return hopAtPhase(frame / period, height);
}

// 跳び上がる瞬間のフレーム（効果音用）
export function takeoffFrames(period: number, until: number, offset = 0): number[] {
  const frames: number[] = [];
  for (let k = 0; ; k++) {
    const f = Math.round((k + GROUND_SHARE) * period) + offset;
    if (f >= until) break;
    if (f >= 0) frames.push(f);
  }
  return frames;
}

export function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}
