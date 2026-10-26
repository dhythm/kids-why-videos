import React, { useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

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

export const Toon: React.FC<{
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
