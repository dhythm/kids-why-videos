import type { Hair } from "./Person";

type Look = {
  shirt: string;
  pants: string;
  hair: Hair;
  hairColor: string;
  skin?: string;
  hearingAid?: boolean;
};

/** しゅじんこう（ほいくえんで 手話を ならった こ） */
export const ME: Look = {
  shirt: "#ffd166",
  pants: "#3a86ff",
  hair: "short",
  hairColor: "#5b3a29",
};

/** みみが きこえない ともだち */
export const FRIEND: Look = {
  shirt: "#7bd389",
  pants: "#8e6bd6",
  hair: "bob",
  hairColor: "#3b2a22",
  skin: "#f6cfa8",
};

/** すこし きこえる ともだち（ほちょうき） */
export const FRIEND2: Look = {
  shirt: "#ff9ec4",
  pants: "#5b6ee1",
  hair: "spiky",
  hairColor: "#2f2f3f",
  hearingAid: true,
};

export const MOM: Look = {
  shirt: "#ff8a65",
  pants: "#4a5a8a",
  hair: "long",
  hairColor: "#4a2e20",
};

export const TEACHER: Look = {
  shirt: "#7ec8e3",
  pants: "#3d4a6b",
  hair: "bun",
  hairColor: "#3a2a20",
  skin: "#f3c9a0",
};

export const DAD: Look = {
  shirt: "#9b8cff",
  pants: "#3d3d5c",
  hair: "short",
  hairColor: "#2a2a3a",
};
