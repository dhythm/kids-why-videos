import React from "react";
import {
  AbsoluteFill,
  Easing,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import {
  CameraRig,
  Earth3D,
  Lights,
  Moon3D,
  Rocket3D,
  StarField3D,
} from "../three/Toys";
import { Caption, Sfx } from "../components/Caption";
import { ip } from "../lib/anim";

export const S07_DURATION = 540;

const TLI = 330; // つきへ むかう かそく
const ORBIT_R = 4.6;
const TILT = 0.35;
const MOON_POS = new THREE.Vector3(20, 5, -16);

type V3 = THREE.Vector3;

function orbitAngle(fr: number): number {
  return -Math.PI / 2 + fr * ((Math.PI * 2.4) / TLI);
}

function orbitPos(a: number): V3 {
  return new THREE.Vector3(
    ORBIT_R * Math.cos(a),
    0,
    ORBIT_R * Math.sin(a),
  ).applyAxisAngle(new THREE.Vector3(1, 0, 0), TILT);
}

const P0 = orbitPos(orbitAngle(TLI));
const VEL0 = orbitPos(orbitAngle(TLI) + 0.01)
  .sub(P0)
  .normalize();
const P1 = P0.clone().add(VEL0.clone().multiplyScalar(9));
const P2 = MOON_POS.clone().add(new THREE.Vector3(-2.5, 0, 1.5));

function bezier(t: number): V3 {
  const u = 1 - t;
  return P0.clone()
    .multiplyScalar(u * u)
    .add(P1.clone().multiplyScalar(2 * u * t))
    .add(P2.clone().multiplyScalar(t * t));
}

function travelT(fr: number): number {
  return ip(fr, [TLI, S07_DURATION + 40], [0, 0.85], Easing.in(Easing.quad));
}

/** フレーム → ロケットの いち */
function rocketPos(fr: number): V3 {
  return fr < TLI ? orbitPos(orbitAngle(fr)) : bezier(travelT(fr));
}

function rocketRotation(fr: number): [number, number, number] {
  const p = rocketPos(fr);
  const next = rocketPos(fr + 1);
  const dir = next.sub(p);
  if (dir.lengthSq() < 1e-8) {
    return [0, 0, 0];
  }
  const q = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.normalize(),
  );
  const e = new THREE.Euler().setFromQuaternion(q);
  return [e.x, e.y, e.z];
}

export const S07EarthOrbit: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const p = rocketPos(f);
  const rot = rocketRotation(f);
  const flame = f < TLI ? 0 : ip(f, [TLI, TLI + 15], [0, 1.2]);

  // てんてんの きせき
  const trail = [];
  for (let i = 1; i <= 26; i++) {
    const fr = f - i * 4;
    if (fr < 0) {
      break;
    }
    const tp = rocketPos(fr);
    trail.push(
      <mesh key={i} position={[tp.x, tp.y, tp.z]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshBasicMaterial color="#ffe14d" transparent opacity={1 - i / 27} />
      </mesh>,
    );
  }

  // カメラ: ちきゅうを ぐるっと → うしろに ひいて つきへの みちを みせる
  const ang = ip(f, [0, TLI], [0, 0.8], Easing.inOut(Easing.sin));
  const pull = ip(
    f,
    [TLI - 20, S07_DURATION],
    [0, 1],
    Easing.inOut(Easing.cubic),
  );
  const camA: [number, number, number] = [
    Math.sin(ang) * 13,
    5,
    Math.cos(ang) * 13,
  ];
  const camB: [number, number, number] = [-6, 9, 22];
  const camPos: [number, number, number] = [
    camA[0] + (camB[0] - camA[0]) * pull,
    camA[1] + (camB[1] - camA[1]) * pull,
    camA[2] + (camB[2] - camA[2]) * pull,
  ];
  const look: [number, number, number] = [7 * pull, 1.5 * pull, -6 * pull];

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at 50% 40%, #1a2470, #05061a)",
      }}
    >
      <ThreeCanvas width={width} height={height}>
        <CameraRig position={camPos} lookAt={look} fov={45} />
        <Lights />
        <StarField3D />
        <Earth3D frame={f} radius={3} />
        <Moon3D
          frame={f}
          radius={2}
          position={[MOON_POS.x, MOON_POS.y, MOON_POS.z]}
        />
        {trail}
        <Rocket3D
          frame={f}
          stagesLeft={1}
          flame={flame}
          position={[p.x, p.y, p.z]}
          rotation={rot}
          scale={0.3}
        />
      </ThreeCanvas>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", width: "100%", height: "100%" }}
      >
        <Sfx
          text="びゅーん！"
          x={1350}
          y={820}
          start={TLI + 10}
          end={TLI + 110}
        />
      </svg>
      <Caption
        text="ちきゅうを ぐるっと"
        start={30}
        end={TLI - 10}
        position="top"
        size={96}
      />
      <Caption
        text="つきへ しゅっぱつ！"
        start={TLI + 60}
        end={S07_DURATION}
        position="top"
        size={100}
        color="#ffe14d"
      />
    </AbsoluteFill>
  );
};
