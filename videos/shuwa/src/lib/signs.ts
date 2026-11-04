import { lerpPose, type HandPose } from "./arm.ts";

/**
 * 手話の うごき。いちは からだの まんなか（おなか）きじゅん。
 * l = がめんの ひだりがわの て（その人の みぎて）、r = がめんの みぎがわの て。
 * rot = ゆびさきの むき（0 = うえ、90 = みぎ、-90 = ひだり）
 */
export type Shape = "flat" | "edge" | "fist" | "point" | "two";
export type Pose = {
  l: HandPose;
  r: HandPose;
  lShape: Shape;
  rShape: Shape;
  /** 0..1 うなずき */
  nod: number;
};
export type Sign = { len: number; at: (t: number) => Pose };

const BLEND = 12; // きをつけ から てを だす / もどす フレーム

export const REST: Pose = {
  l: { x: -92, y: 125, rot: 185 },
  r: { x: 92, y: 125, rot: 175 },
  lShape: "flat",
  rShape: "flat",
  nod: 0,
};

/** 0→1 の なめらかな すすみ（a〜b の あいだ） */
export function step(t: number, a: number, b: number): number {
  const k = Math.min(1, Math.max(0, (t - a) / (b - a)));
  return k * k * (3 - 2 * k);
}

export function signLength(s: Sign): number {
  return s.len;
}

/** t フレームめの すがた。はじめと おわりは きをつけ に なめらかに つながる */
export function poseAt(s: Sign, t: number): Pose {
  if (t <= 0 || t >= s.len) {
    return REST;
  }
  const env = Math.min(step(t, 0, BLEND), 1 - step(t, s.len - BLEND, s.len));
  const p = s.at(t);
  if (env >= 1) {
    return p;
  }
  return {
    l: lerpPose(REST.l, p.l, env),
    r: lerpPose(REST.r, p.r, env),
    lShape: env > 0.5 ? p.lShape : REST.lShape,
    rShape: env > 0.5 ? p.rShape : REST.rShape,
    nod: p.nod * env,
  };
}

/** うごいていない ときの すがた（ずっと おなじ） */
export function hold(p: Pose, len = 99999): Sign {
  return { len, at: () => p };
}

/**
 * ありがとう: よこにした ひだりての こうに、たてにした みぎてを のせて、うえに あげる（おじぎ しながら）
 */
export const ARIGATOU: Sign = {
  len: 75,
  at: (t) => {
    const lift = step(t, 26, 46);
    return {
      r: { x: 35, y: 45, rot: -90 },
      l: { x: 12, y: 3 - lift * 55, rot: 0 },
      rShape: "edge",
      lShape: "edge",
      nod: step(t, 26, 40) - step(t, 50, 62),
    };
  },
};

/**
 * こんにちは: ひとさしゆびと なかゆびを おでこに あてる（ひる）→
 * りょうての ひとさしゆびを むかいあわせて、おじぎ させる（あいさつ）
 */
export const KONNICHIWA: Sign = {
  len: 115,
  at: (t) => {
    if (t < 50) {
      return {
        l: { x: -5, y: -212, rot: 0 },
        r: REST.r,
        lShape: "two",
        rShape: REST.rShape,
        nod: 0,
      };
    }
    const bow = step(t, 68, 82) - step(t, 96, 106);
    return {
      l: { x: -55, y: -10, rot: bow * 50 },
      r: { x: 55, y: -10, rot: -bow * 50 },
      lShape: "point",
      rShape: "point",
      nod: bow,
    };
  },
};

/** うれしい: りょうてを むねの まえで こうごに うえ・したに うごかす */
export const URESHII: Sign = {
  len: 120,
  at: (t) => {
    const w = Math.sin(t * 0.32) * 26;
    return {
      l: { x: -38, y: -20 + w, rot: 80 },
      r: { x: 38, y: -20 - w, rot: -80 },
      lShape: "flat",
      rShape: "flat",
      nod: 0,
    };
  },
};

/** 手話: りょうての ひとさしゆびを むかいあわせて、こうごに くるくる まわす */
export function shuwaSign(len: number): Sign {
  return {
    len,
    at: (t) => {
      const a = t * 0.28;
      return {
        l: { x: -40 + Math.cos(a) * 22, y: -15 + Math.sin(a) * 22, rot: 90 },
        r: {
          x: 40 + Math.cos(a + Math.PI) * 22,
          y: -15 + Math.sin(a + Math.PI) * 22,
          rot: -90,
        },
        lShape: "point",
        rShape: "point",
        nod: 0,
      };
    },
  };
}

/** てを ふる（がめんの みぎがわの て） */
export function waveSign(len: number): Sign {
  return {
    len,
    at: (t) => ({
      l: REST.l,
      r: { x: 140, y: -190, rot: Math.sin(t * 0.45) * 28 },
      lShape: REST.lShape,
      rShape: "flat",
      nod: 0,
    }),
  };
}

/** おしゃべり（いろんな かたちで てを うごかす）。seed で ひとりずつ ちがう うごきに */
export function chatSign(len: number, seed = 0): Sign {
  const shapes: Shape[] = ["flat", "point", "fist", "two", "flat"];
  return {
    len,
    at: (t) => {
      const a = t * 0.12 + seed * 1.7;
      const k = Math.floor((t + seed * 13) / 22);
      return {
        l: {
          x: -58 + Math.sin(a * 1.3) * 20,
          y: -20 + Math.cos(a) * 25,
          rot: 20 + Math.sin(a * 0.9) * 40,
        },
        r: {
          x: 58 + Math.cos(a * 1.1) * 20,
          y: -30 + Math.sin(a * 1.4) * 25,
          rot: -20 - Math.cos(a * 0.8) * 40,
        },
        lShape: shapes[k % shapes.length],
        rShape: shapes[(k + 2) % shapes.length],
        nod: Math.max(0, Math.sin(a * 0.7)) * 0.3,
      };
    },
  };
}
