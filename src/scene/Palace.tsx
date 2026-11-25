import React, { useMemo } from "react";
import * as THREE from "three";
import { random } from "remotion";

const GOLD = "#C9A227";
const GOLD_LIGHT = "#E5C15A";
const RED = "#8B1E1E";
const RED_DARK = "#5E1414";
const STONE = "#7A6A58";
const STONE_DARK = "#5D5044";
const WOOD = "#4A3226";
const LEAF = "#2E6B34";
const LEAF_DARK = "#245628";
const PATH = "#CBB98A";

const makeSkyTexture = () => {
  const c = document.createElement("canvas");
  c.width = 16;
  c.height = 512;
  const g = c.getContext("2d")!;
  const grad = g.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, "#3B2A5E");
  grad.addColorStop(0.45, "#8A4A6B");
  grad.addColorStop(0.72, "#E08A4E");
  grad.addColorStop(1, "#F7C873");
  g.fillStyle = grad;
  g.fillRect(0, 0, 16, 512);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
};

// Atap limas bertingkat khas Sunda: piramida emas + lis atap merah gelap.
const RoofTier: React.FC<{ radius: number; height: number; y: number }> = ({
  radius,
  height,
  y,
}) => (
  <group position={[0, y, 0]}>
    <mesh position={[0, -0.12, 0]} castShadow receiveShadow>
      <boxGeometry args={[radius * 1.55, 0.14, radius * 1.55]} />
      <meshStandardMaterial color={RED_DARK} roughness={0.7} />
    </mesh>
    <mesh rotation={[0, Math.PI / 4, 0]} castShadow>
      <coneGeometry args={[radius, height, 4]} />
      <meshStandardMaterial color="#D4AF37" metalness={0.3} roughness={0.45} />
    </mesh>
  </group>
);

const Tree: React.FC<{ x: number; z: number; s?: number }> = ({
  x,
  z,
  s = 1,
}) => (
  <group position={[x, 0, z]} scale={s}>
    <mesh position={[0, 1.1, 0]} castShadow>
      <cylinderGeometry args={[0.2, 0.28, 2.2, 8]} />
      <meshStandardMaterial color={WOOD} roughness={0.9} />
    </mesh>
    <mesh position={[0, 2.9, 0]} castShadow>
      <sphereGeometry args={[1.35, 12, 10]} />
      <meshStandardMaterial color={LEAF} roughness={0.9} />
    </mesh>
    <mesh position={[0.7, 3.6, 0.3]} castShadow>
      <sphereGeometry args={[0.95, 12, 10]} />
      <meshStandardMaterial color={LEAF_DARK} roughness={0.9} />
    </mesh>
  </group>
);

const Banner: React.FC<{ x: number; z: number; frame: number }> = ({
  x,
  z,
  frame,
}) => {
  const wave = Math.sin(frame / 25 + x) * 0.12;
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 2.75, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 5.5, 8]} />
        <meshStandardMaterial color={GOLD} metalness={0.7} roughness={0.4} />
      </mesh>
      <mesh position={[0, 5.65, 0]}>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 4.1, 0]} rotation={[0, wave, 0]}>
        <planeGeometry args={[1.3, 2.6]} />
        <meshStandardMaterial color={RED} side={THREE.DoubleSide} roughness={0.8} />
      </mesh>
      <mesh position={[0, 4.1, -0.02]} rotation={[0, wave, 0]}>
        <planeGeometry args={[0.5, 0.5]} />
        <meshStandardMaterial color={GOLD_LIGHT} side={THREE.DoubleSide} metalness={0.8} roughness={0.35} />
      </mesh>
    </group>
  );
};

const Cloud: React.FC<{ x: number; y: number; z: number; s: number; frame: number }> = ({
  x,
  y,
  z,
  s,
  frame,
}) => {
  const drift = frame * 0.008;
  return (
    <group position={[x + drift, y, z]} scale={[s, s * 0.45, s]}>
      <mesh>
        <sphereGeometry args={[1.6, 12, 10]} />
        <meshStandardMaterial color="#FFF3DC" roughness={1} transparent opacity={0.92} />
      </mesh>
      <mesh position={[1.6, -0.15, 0.2]}>
        <sphereGeometry args={[1.1, 12, 10]} />
        <meshStandardMaterial color="#FFF3DC" roughness={1} transparent opacity={0.9} />
      </mesh>
      <mesh position={[-1.5, -0.2, -0.2]}>
        <sphereGeometry args={[1.0, 12, 10]} />
        <meshStandardMaterial color="#FFE9C4" roughness={1} transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

export const Palace: React.FC<{ frame: number }> = ({ frame }) => {
  const sky = useMemo(makeSkyTexture, []);
  const dust = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        x: (random("dx" + i) - 0.5) * 16,
        y: 3 + random("dy" + i) * 7,
        z: (random("dz" + i) - 0.5) * 12 + 1,
        r: 0.04 + random("dr" + i) * 0.05,
        p: random("dp" + i) * Math.PI * 2,
      })),
    [],
  );
  const crownSpin = frame * 0.002;

  return (
    <group>
      <fog attach="fog" args={["#E9A85C", 55, 115]} />

      {/* Langit fajar: bola besar, gradien di sisi dalam (fog dimatikan) */}
      <mesh>
        <sphereGeometry args={[130, 24, 16]} />
        <meshBasicMaterial map={sky} side={THREE.BackSide} fog={false} />
      </mesh>
      <mesh position={[-19, 16, -34]}>
        <sphereGeometry args={[2.4, 20, 16]} />
        <meshStandardMaterial color="#FFD27A" emissive="#FFC85E" emissiveIntensity={1.8} />
      </mesh>
      <mesh position={[-19, 16, -34]}>
        <sphereGeometry args={[4.2, 20, 16]} />
        <meshBasicMaterial color="#FFD27A" transparent opacity={0.22} />
      </mesh>

      {/* Gunung di kejauhan */}
      <mesh position={[-22, 0, -40]} castShadow={false}>
        <coneGeometry args={[16, 20, 6]} />
        <meshStandardMaterial color="#3A4A6B" roughness={1} flatShading />
      </mesh>
      <mesh position={[5, 0, -48]}>
        <coneGeometry args={[20, 24, 6]} />
        <meshStandardMaterial color="#33415E" roughness={1} flatShading />
      </mesh>
      <mesh position={[24, 0, -40]}>
        <coneGeometry args={[14, 17, 6]} />
        <meshStandardMaterial color="#46587A" roughness={1} flatShading />
      </mesh>

      {/* Tanah, bukit, jalan batu */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[160, 160]} />
        <meshStandardMaterial color="#4E8A41" roughness={1} />
      </mesh>
      <mesh position={[0, -2.4, 2]} scale={[26, 4, 20]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshStandardMaterial color="#45803A" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 12]} receiveShadow>
        <planeGeometry args={[3.2, 10]} />
        <meshStandardMaterial color={PATH} roughness={0.95} />
      </mesh>

      <Cloud x={-14} y={17} z={-24} s={2.2} frame={frame} />
      <Cloud x={8} y={19} z={-28} s={2.8} frame={frame} />
      <Cloud x={20} y={15} z={-20} s={1.8} frame={frame} />

      {/* Teras batu bertingkat */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[18, 1, 14]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[14, 1, 11]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[10.5, 1, 8.5]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>
      {/* Anak tangga depan */}
      <mesh position={[0, 2.83, 4.7]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.33, 0.9]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.5, 5.5]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.33, 0.9]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.17, 6.3]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.33, 0.9]} />
        <meshStandardMaterial color={STONE} roughness={0.9} />
      </mesh>

      {/* Lantai pendopo */}
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[9.5, 0.4, 7.5]} />
        <meshStandardMaterial color="#8A7458" roughness={0.85} />
      </mesh>

      {/* Kolom pendopo */}
      {([
        [-4, -3],
        [4, -3],
        [-4, 0],
        [4, 0],
        [-4, 3],
        [4, 3],
      ] as [number, number][]).map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 5.0, 0]} castShadow>
            <cylinderGeometry args={[0.24, 0.28, 3.2, 10]} />
            <meshStandardMaterial color={RED} roughness={0.6} />
          </mesh>
          <mesh position={[0, 6.65, 0]}>
            <boxGeometry args={[0.7, 0.18, 0.7]} />
            <meshStandardMaterial color={GOLD} metalness={0.8} roughness={0.35} />
          </mesh>
        </group>
      ))}

      {/* Atap emas bertingkat */}
      <RoofTier radius={6.0} height={1.7} y={7.45} />
      <RoofTier radius={4.4} height={1.5} y={9.05} />
      <RoofTier radius={2.9} height={1.4} y={10.4} />
      <mesh position={[0, 11.35, 0]}>
        <sphereGeometry args={[0.35, 12, 10]} />
        <meshStandardMaterial color={GOLD_LIGHT} metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 11.85, 0]}>
        <coneGeometry args={[0.16, 0.8, 8]} />
        <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* Singgasana di pendopo */}
      <mesh position={[0, 3.65, 2.2]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.5, 2.2]} />
        <meshStandardMaterial color={STONE_DARK} roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.05, 2.2]} castShadow>
        <boxGeometry args={[1.6, 0.35, 1.1]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[0, 4.9, 1.7]} castShadow>
        <boxGeometry args={[1.6, 1.6, 0.25]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.3} roughness={0.45} />
      </mesh>
      <mesh position={[0, 4.3, 2.2]}>
        <boxGeometry args={[1.4, 0.18, 0.95]} />
        <meshStandardMaterial color={RED} roughness={0.55} />
      </mesh>

      {/* Mahkota di atas singgasana, berputar pelan */}
      <group position={[0, 4.62, 2.2]} rotation={[0, crownSpin, 0]}>
        <mesh castShadow>
          <torusGeometry args={[0.45, 0.09, 10, 24]} />
          <meshStandardMaterial color={GOLD_LIGHT} metalness={0.95} roughness={0.2} />
        </mesh>
        {[0, 1, 2, 3, 4].map((k) => {
          const a = (k / 5) * Math.PI * 2;
          return (
            <mesh
              key={k}
              position={[Math.cos(a) * 0.45, 0.22, Math.sin(a) * 0.45]}
            >
              <coneGeometry args={[0.09, 0.3, 8]} />
              <meshStandardMaterial color={GOLD} metalness={0.9} roughness={0.3} />
            </mesh>
          );
        })}
        <mesh position={[0, 0.28, 0]}>
          <sphereGeometry args={[0.09, 10, 8]} />
          <meshStandardMaterial color="#C8102E" roughness={0.2} metalness={0.3} />
        </mesh>
      </group>

      {/* Harta: mangkuk emas kiri, permata kanan */}
      {[
        [-2.3, 2.7],
        [-1.7, 2.9],
        [-2.0, 2.3],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 4.05, z]} castShadow>
          <cylinderGeometry args={[0.32, 0.22, 0.28, 12]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.5} roughness={0.35} />
        </mesh>
      ))}
      {[
        [1.8, 2.7, "#C8102E"],
        [2.2, 2.5, "#1E5AA8"],
        [2.0, 2.95, "#1E7A46"],
        [2.5, 2.8, GOLD_LIGHT],
        [1.6, 3.0, "#7A3DB8"],
      ].map(([x, z, c], i) => (
        <mesh key={i} position={[x as number, 4.02, z as number]}>
          <sphereGeometry args={[0.16, 10, 8]} />
          <meshStandardMaterial color={c as string} roughness={0.15} metalness={0.4} />
        </mesh>
      ))}

      {/* Panji merah + umbul-umbul (digeser keluar dari jalur kamera) */}
      <Banner x={-7} z={4.5} frame={frame} />
      <Banner x={7} z={4.5} frame={frame} />
      {([
        [-5, 11, RED],
        [5, 11, GOLD],
        [-5, 14, GOLD],
        [5, 14, RED],
      ] as [number, number, string][]).map(([x, z, c], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 3.5, 0]}>
            <cylinderGeometry args={[0.05, 0.06, 7, 6]} />
            <meshStandardMaterial color={WOOD} roughness={0.9} />
          </mesh>
          <mesh
            position={[0, 5.8, 0]}
            rotation={[0, Math.sin(frame / 28 + i) * 0.15, 0]}
          >
            <planeGeometry args={[0.5, 3]} />
            <meshStandardMaterial color={c} side={THREE.DoubleSide} roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Pepohonan */}
      <Tree x={-9} z={-2} />
      <Tree x={-11} z={3} s={1.2} />
      <Tree x={9} z={-3} s={1.1} />
      <Tree x={11} z={2} />
      <Tree x={-7} z={6} s={0.9} />
      <Tree x={8} z={7} s={0.9} />

      {/* Debu emas melayang */}
      {dust.map((d, i) => (
        <mesh
          key={i}
          position={[
            d.x + Math.sin(frame / 30 + d.p) * 0.3,
            d.y + Math.sin(frame / 45 + d.p) * 0.4,
            d.z,
          ]}
        >
          <sphereGeometry args={[d.r, 6, 6]} />
          <meshStandardMaterial color={GOLD_LIGHT} emissive={GOLD} emissiveIntensity={0.9} />
        </mesh>
      ))}
    </group>
  );
};
