import React, { useLayoutEffect, useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { random } from "remotion";
import * as THREE from "three";

/* ---------- カメラ（フレームで動かす） ---------- */
export const CameraRig: React.FC<{
  position: [number, number, number];
  lookAt: [number, number, number];
  fov?: number;
}> = ({ position, lookAt, fov = 45 }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    camera.position.set(...position);
    camera.lookAt(new THREE.Vector3(...lookAt));
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }, [camera, position, lookAt, fov]);
  return null;
};

export const Lights: React.FC<{ intensity?: number }> = ({ intensity = 1 }) => (
  <>
    <ambientLight intensity={0.9 * intensity} />
    <directionalLight position={[6, 10, 8]} intensity={2.2 * intensity} />
    <directionalLight
      position={[-8, 3, -4]}
      intensity={0.6 * intensity}
      color="#9fc6ff"
    />
  </>
);

const Toon: React.FC<{
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
}> = ({ color, emissive, emissiveIntensity = 0 }) => (
  <meshToonMaterial
    color={color}
    emissive={emissive ?? "#000000"}
    emissiveIntensity={emissiveIntensity}
  />
);

/* ---------- ほのお ---------- */
export const Flame3D: React.FC<{
  frame: number;
  intensity: number;
  y?: number;
  radius?: number;
}> = ({ frame, intensity, y = 0, radius = 0.55 }) => {
  if (intensity <= 0.01) {
    return null;
  }
  const flick = 1 + Math.sin(frame * 1.7) * 0.12 + Math.sin(frame * 3.3) * 0.07;
  const len = 3 * intensity * flick;
  return (
    <group position={[0, y, 0]}>
      {[
        { r: radius * 1.2, l: len, c: "#ff5d2a", o: 0.85 },
        { r: radius * 0.85, l: len * 0.72, c: "#ffb627", o: 0.95 },
        { r: radius * 0.45, l: len * 0.45, c: "#fff6c9", o: 1 },
      ].map((p, i) => (
        <mesh key={i} position={[0, -p.l / 2, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[p.r, p.l, 24]} />
          <meshBasicMaterial
            color={p.c}
            transparent
            opacity={p.o * 0.75}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      <mesh position={[0, -len * 0.25, 0]} scale={[1, 1.6, 1]}>
        <sphereGeometry args={[radius * 1.6, 20, 20]} />
        <meshBasicMaterial
          color="#ff8a3d"
          transparent
          opacity={0.25}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <pointLight
        color="#ffaa33"
        intensity={30 * intensity}
        distance={12}
        position={[0, -1, 0]}
      />
    </group>
  );
};

/* ---------- 3D ロケット ----------
 * ローカル座標: y=0 が いちばん下（1だんめの下）
 * 1だんめ 0..2.2 / 2だんめ 2.2..3.6 / 3だんめ 3.6..4.6 / カプセル 4.6..6.0
 */
export const STAGE3D = {
  1: { y0: 0, h: 2.2, color: "#ff9f1c" },
  2: { y0: 2.2, h: 1.4, color: "#3a86ff" },
  3: { y0: 3.6, h: 1.0, color: "#2ec4b6" },
} as const;
const R = 0.7;

export const Stage3D: React.FC<{ stage: 1 | 2 | 3 }> = ({ stage }) => {
  const s = STAGE3D[stage];
  return (
    <group position={[0, s.y0, 0]}>
      <mesh position={[0, s.h / 2, 0]}>
        <cylinderGeometry args={[R, R, s.h, 32]} />
        <Toon color="#f7f7fb" />
      </mesh>
      <mesh position={[0, s.h / 2, 0]}>
        <cylinderGeometry args={[R + 0.02, R + 0.02, s.h * 0.3, 32]} />
        <Toon color={s.color} />
      </mesh>
      {/* ノズル */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.32, 0.5, 0.4, 24]} />
        <Toon color="#59607a" />
      </mesh>
      {stage === 1
        ? [0, 1, 2, 3].map((i) => (
            <mesh
              key={i}
              position={[
                Math.cos((i * Math.PI) / 2) * (R + 0.3),
                0.45,
                Math.sin((i * Math.PI) / 2) * (R + 0.3),
              ]}
              rotation={[0, -(i * Math.PI) / 2, 0]}
            >
              <boxGeometry args={[0.6, 0.9, 0.12]} />
              <Toon color="#ef476f" />
            </mesh>
          ))
        : null}
    </group>
  );
};

export const Capsule3D: React.FC = () => (
  <group position={[0, 4.6, 0]}>
    <mesh position={[0, 0.7, 0]}>
      <coneGeometry args={[R, 1.4, 32]} />
      <Toon color="#ef476f" />
    </mesh>
    {/* まど */}
    <mesh position={[0, 0.45, R * 0.62]} scale={[1, 1, 0.5]}>
      <sphereGeometry args={[0.2, 24, 24]} />
      <Toon color="#bde7ff" emissive="#7fd0ff" emissiveIntensity={0.3} />
    </mesh>
  </group>
);

export const Rocket3D: React.FC<{
  frame: number;
  stagesLeft?: 1 | 2 | 3;
  flame?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}> = ({
  frame,
  stagesLeft = 3,
  flame = 0,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
}) => {
  const stages = ([1, 2, 3] as const).filter((s) => s > 3 - stagesLeft);
  const lowest = stages[0];
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {stages.map((s) => (
        <Stage3D key={s} stage={s} />
      ))}
      <Capsule3D />
      <Flame3D frame={frame} intensity={flame} y={STAGE3D[lowest].y0 - 0.4} />
    </group>
  );
};

/* ---------- けむり ---------- */
export const Smoke3D: React.FC<{
  frame: number;
  start: number;
  count?: number;
  origin?: [number, number, number];
  spread?: number;
  seed?: string;
  rise?: number;
  color?: string;
  sizeMul?: number;
  life?: number;
}> = ({
  frame,
  start,
  count = 60,
  origin = [0, 0, 0],
  spread = 6,
  seed = "smoke",
  rise = 0.5,
  color = "#ffffff",
  sizeMul = 1,
  life = 100000,
}) => {
  if (frame < start) {
    return null;
  }
  const items = [];
  for (let i = 0; i < count; i++) {
    const born = start + random(`${seed}b${i}`) * 50;
    const age = frame - born;
    if (age < 0) {
      continue;
    }
    const ang = random(`${seed}a${i}`) * Math.PI * 2;
    const k = 1 - Math.exp(-age / 30);
    const dist = k * spread * (0.4 + random(`${seed}d${i}`) * 0.6);
    const fadeOut = Math.max(0, Math.min(1, (life - age) / 40));
    const size =
      (0.5 + k * (1.2 + random(`${seed}s${i}`) * 1.2)) * sizeMul * fadeOut;
    if (size <= 0.001) {
      continue;
    }
    items.push(
      <mesh
        key={i}
        position={[
          origin[0] + Math.cos(ang) * dist,
          origin[1] + k * rise * 3 + random(`${seed}y${i}`) * 0.6,
          origin[2] + Math.sin(ang) * dist * 0.8,
        ]}
        scale={size}
      >
        <icosahedronGeometry args={[1, 1]} />
        <Toon color={i % 3 === 0 ? "#e9ecf3" : color} />
      </mesh>,
    );
  }
  return <group>{items}</group>;
};

/* ---------- かお（3D） ---------- */
export const Face3D: React.FC<{ r: number; frame: number; z: number }> = ({
  r,
  frame,
  z,
}) => {
  const blink = frame % 90 > 84 ? 0.15 : 1;
  return (
    <group position={[0, 0, z]}>
      {[-1, 1].map((d) => (
        <mesh
          key={d}
          position={[d * r * 0.32, r * 0.08, 0]}
          scale={[0.8, blink, 0.4]}
        >
          <sphereGeometry args={[r * 0.1, 20, 20]} />
          <meshBasicMaterial color="#2b2b4a" />
        </mesh>
      ))}
      {[-1, 1].map((d) => (
        <mesh
          key={`c${d}`}
          position={[d * r * 0.5, -r * 0.15, -r * 0.03]}
          scale={[1.4, 0.8, 0.3]}
        >
          <sphereGeometry args={[r * 0.09, 16, 16]} />
          <meshBasicMaterial color="#ff8fa3" transparent opacity={0.8} />
        </mesh>
      ))}
      <mesh position={[0, -r * 0.18, 0]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[r * 0.13, r * 0.025, 8, 24, Math.PI]} />
        <meshBasicMaterial color="#2b2b4a" />
      </mesh>
    </group>
  );
};

/* ---------- ちきゅう ---------- */
export const Earth3D: React.FC<{
  frame: number;
  radius?: number;
  position?: [number, number, number];
  face?: boolean;
}> = ({ frame, radius = 3, position = [0, 0, 0], face = true }) => {
  const lands = useMemo(
    () =>
      new Array(14).fill(0).map((_, i) => ({
        lat: (random(`lat${i}`) - 0.5) * 2.2,
        lon: random(`lon${i}`) * Math.PI * 2,
        s: 0.35 + random(`ls${i}`) * 0.5,
      })),
    [],
  );
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <Toon color="#2f8cf0" />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial
          color="#8fd6ff"
          transparent
          opacity={0.18}
          side={THREE.BackSide}
        />
      </mesh>
      <group rotation={[0.3, frame * 0.01, 0]}>
        {lands.map((l, i) => {
          const x = Math.cos(l.lat) * Math.cos(l.lon) * radius;
          const y = Math.sin(l.lat) * radius;
          const z = Math.cos(l.lat) * Math.sin(l.lon) * radius;
          return (
            <mesh
              key={i}
              position={[x * 0.9, y * 0.9, z * 0.9]}
              scale={[l.s * radius, l.s * radius, l.s * radius]}
            >
              <sphereGeometry args={[0.32, 20, 20]} />
              <Toon color="#5ccf6b" />
            </mesh>
          );
        })}
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const lat = (random(`clat${i}`) - 0.5) * 2;
          const lon = random(`clon${i}`) * Math.PI * 2;
          const rr = radius * 1.04;
          return (
            <mesh
              key={`c${i}`}
              position={[
                Math.cos(lat) * Math.cos(lon) * rr,
                Math.sin(lat) * rr,
                Math.cos(lat) * Math.sin(lon) * rr,
              ]}
              scale={[radius * 0.25, radius * 0.06, radius * 0.25]}
            >
              <sphereGeometry args={[0.5, 16, 16]} />
              <Toon color="#ffffff" />
            </mesh>
          );
        })}
      </group>
      {face ? <Face3D r={radius} frame={frame} z={radius * 1.01} /> : null}
    </group>
  );
};

/* ---------- つき ---------- */
export const Moon3D: React.FC<{
  frame: number;
  radius?: number;
  position?: [number, number, number];
  face?: boolean;
}> = ({ frame, radius = 1.5, position = [0, 0, 0], face = true }) => {
  const craters = useMemo(
    () =>
      new Array(12).fill(0).map((_, i) => ({
        lat: (random(`mlat${i}`) - 0.5) * 2.6,
        lon: random(`mlon${i}`) * Math.PI * 2,
        s: 0.08 + random(`ms${i}`) * 0.14,
      })),
    [],
  );
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 64, 64]} />
        <Toon color="#f3e3a1" />
      </mesh>
      <group rotation={[0, frame * 0.006, 0]}>
        {craters.map((c, i) => {
          const x = Math.cos(c.lat) * Math.cos(c.lon) * radius;
          const y = Math.sin(c.lat) * radius;
          const z = Math.cos(c.lat) * Math.sin(c.lon) * radius;
          return (
            <mesh
              key={i}
              position={[x * 0.95, y * 0.95, z * 0.95]}
              scale={c.s * radius * 3}
            >
              <sphereGeometry args={[0.3, 16, 16]} />
              <Toon color="#d6bf63" />
            </mesh>
          );
        })}
      </group>
      {face ? <Face3D r={radius} frame={frame} z={radius * 1.01} /> : null}
    </group>
  );
};

/* ---------- ほし（3D のおく） ---------- */
export const StarField3D: React.FC<{ count?: number; radius?: number }> = ({
  count = 400,
  radius = 80,
}) => {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = random(`su${i}`) * 2 - 1;
      const th = random(`st${i}`) * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      arr[i * 3] = s * Math.cos(th) * radius;
      arr[i * 3 + 1] = u * radius;
      arr[i * 3 + 2] = s * Math.sin(th) * radius;
    }
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [count, radius]);
  return (
    <points geometry={geo}>
      <pointsMaterial color="#ffffff" size={0.45} sizeAttenuation />
    </points>
  );
};

/* ---------- つきの ちゃくりくき（3D） ---------- */
export const Lander3D: React.FC<{
  frame: number;
  flame?: number;
  legs?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  topOnly?: boolean;
}> = ({
  frame,
  flame = 0,
  legs = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  topOnly = false,
}) => {
  const spread = 0.9 + legs * 0.5;
  return (
    <group position={position} rotation={rotation} scale={scale}>
      {topOnly ? null : (
        <group>
          {/* した（きんいろ） */}
          <mesh position={[0, 1.2, 0]}>
            <boxGeometry args={[1.8, 0.9, 1.8]} />
            <Toon color="#f4c542" />
          </mesh>
          {[0, 1, 2, 3].map((i) => {
            const a = Math.PI / 4 + (i * Math.PI) / 2;
            const fx = Math.cos(a) * spread * 1.2;
            const fz = Math.sin(a) * spread * 1.2;
            const mx = Math.cos(a) * 0.8;
            const mz = Math.sin(a) * 0.8;
            const len = Math.hypot(fx - mx, 1.2, fz - mz);
            const dir = new THREE.Vector3(fx - mx, -1.2, fz - mz).normalize();
            const q = new THREE.Quaternion().setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              dir,
            );
            const e = new THREE.Euler().setFromQuaternion(q);
            return (
              <group key={i}>
                <mesh
                  position={[(fx + mx) / 2, 0.6, (fz + mz) / 2]}
                  rotation={[e.x, e.y, e.z]}
                >
                  <cylinderGeometry args={[0.06, 0.06, len, 8]} />
                  <Toon color="#9aa0b8" />
                </mesh>
                <mesh position={[fx, 0.05, fz]}>
                  <cylinderGeometry args={[0.25, 0.25, 0.08, 16]} />
                  <Toon color="#9aa0b8" />
                </mesh>
              </group>
            );
          })}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.25, 0.4, 0.35, 16]} />
            <Toon color="#59607a" />
          </mesh>
          <Flame3D
            frame={frame}
            intensity={flame * 0.5}
            y={0.4}
            radius={0.35}
          />
        </group>
      )}
      {/* うえ */}
      <group position={[0, topOnly ? 0 : 1.65, 0]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.8, 0.9, 1.1, 8]} />
          <Toon color="#dfe6f0" />
        </mesh>
        <mesh position={[0, 0.65, 0.78]} scale={[1, 1, 0.4]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <Toon color="#bde7ff" emissive="#7fd0ff" emissiveIntensity={0.3} />
        </mesh>
        <mesh position={[0.4, 1.45, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
          <Toon color="#2b2b4a" />
        </mesh>
        <mesh position={[0.4, 1.78, 0]}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <Toon color="#ef476f" />
        </mesh>
        {topOnly ? (
          <Flame3D frame={frame} intensity={flame * 0.5} y={0} radius={0.3} />
        ) : null}
      </group>
    </group>
  );
};

/* ---------- うちゅうせん（カプセル＋きかいせん＋ちゃくりくき） ---------- */
export const Ship3D: React.FC<{
  frame: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  withLander?: boolean;
  flame?: number;
}> = ({
  frame,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  withLander = true,
  flame = 0,
}) => (
  <group position={position} rotation={rotation} scale={scale}>
    {/* きかいせん */}
    <mesh position={[0, 0.8, 0]}>
      <cylinderGeometry args={[0.7, 0.7, 1.6, 32]} />
      <Toon color="#e9eef7" />
    </mesh>
    <mesh position={[0, 0.8, 0]}>
      <cylinderGeometry args={[0.72, 0.72, 0.4, 32]} />
      <Toon color="#2ec4b6" />
    </mesh>
    <mesh position={[0, -0.15, 0]}>
      <cylinderGeometry args={[0.3, 0.5, 0.35, 16]} />
      <Toon color="#59607a" />
    </mesh>
    <Flame3D frame={frame} intensity={flame} y={-0.35} radius={0.35} />
    {/* カプセル */}
    <group position={[0, -4.6 + 1.6, 0]}>
      <Capsule3D />
    </group>
    {withLander ? (
      <Lander3D
        frame={frame}
        position={[0, 3.0 + 1.5, 0]}
        rotation={[Math.PI, 0, 0]}
        scale={0.6}
        legs={0}
      />
    ) : null}
  </group>
);

/* ---------- うちゅうひこうし（3D） ---------- */
export const Astronaut3D: React.FC<{
  frame: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  wave?: number;
  squash?: number;
}> = ({
  frame,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  wave = 0,
  squash = 1,
}) => {
  const arm = wave > 0 ? -2.4 + Math.sin(frame * 0.35) * 0.4 * wave : -0.3;
  return (
    <group
      position={position}
      rotation={rotation}
      scale={[
        scale / Math.sqrt(squash),
        scale * squash,
        scale / Math.sqrt(squash),
      ]}
    >
      {/* あし */}
      {[-1, 1].map((d) => (
        <mesh key={d} position={[d * 0.18, 0.3, 0]}>
          <capsuleGeometry args={[0.14, 0.35, 6, 12]} />
          <Toon color="#ffffff" />
        </mesh>
      ))}
      {/* からだ */}
      <mesh position={[0, 0.9, 0]}>
        <capsuleGeometry args={[0.38, 0.45, 8, 16]} />
        <Toon color="#ffffff" />
      </mesh>
      <mesh position={[0, 0.95, 0.36]}>
        <boxGeometry args={[0.3, 0.18, 0.06]} />
        <Toon color="#ff6b6b" />
      </mesh>
      {/* せなか */}
      <mesh position={[0, 1.0, -0.42]}>
        <boxGeometry args={[0.6, 0.7, 0.25]} />
        <Toon color="#cfd8e6" />
      </mesh>
      {/* うで */}
      <group position={[-0.45, 1.15, 0]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.11, 0.35, 6, 12]} />
          <Toon color="#ffffff" />
        </mesh>
      </group>
      <group position={[0.45, 1.15, 0]} rotation={[0, 0, arm]}>
        <mesh position={[0, -0.25, 0]}>
          <capsuleGeometry args={[0.11, 0.35, 6, 12]} />
          <Toon color="#ffffff" />
        </mesh>
      </group>
      {/* ヘルメット */}
      <mesh position={[0, 1.65, 0]}>
        <sphereGeometry args={[0.42, 24, 24]} />
        <Toon color="#ffffff" />
      </mesh>
      <mesh position={[0, 1.65, 0.2]} scale={[1, 0.85, 0.6]}>
        <sphereGeometry args={[0.33, 24, 24]} />
        <Toon color="#ffd166" emissive="#ffb703" emissiveIntensity={0.25} />
      </mesh>
      <group position={[0, 1.65, 0.38]}>
        <Face3D r={0.3} frame={frame} z={0} />
      </group>
    </group>
  );
};

/* ---------- はた ---------- */
export const Flag3D: React.FC<{
  frame: number;
  position?: [number, number, number];
  up?: number;
}> = ({ frame, position = [0, 0, 0], up = 1 }) => (
  <group position={position} scale={[1, up, 1]}>
    <mesh position={[0, 1.2, 0]}>
      <cylinderGeometry args={[0.04, 0.04, 2.4, 8]} />
      <Toon color="#dfe6f0" />
    </mesh>
    <group
      position={[0.55, 2.05, 0]}
      rotation={[0, Math.sin(frame * 0.05) * 0.08, 0]}
    >
      <mesh>
        <boxGeometry args={[1.1, 0.7, 0.03]} />
        <Toon color="#ffffff" />
      </mesh>
      <mesh position={[0, 0, 0.03]} rotation={[0, 0, Math.PI / 2]}>
        <circleGeometry args={[0.25, 5]} />
        <meshBasicMaterial color="#ffd23f" />
      </mesh>
      <mesh position={[0, -0.3, 0.02]}>
        <boxGeometry args={[1.1, 0.1, 0.03]} />
        <Toon color="#ef476f" />
      </mesh>
      <mesh position={[0, 0.3, 0.02]}>
        <boxGeometry args={[1.1, 0.1, 0.03]} />
        <Toon color="#3a86ff" />
      </mesh>
    </group>
  </group>
);
