import { useEffect } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { CameraRig, SHOTS } from "./lib/camera";
import { Palace } from "./scene/Palace";
import { Captions } from "./ui/Captions";

// Environment map (PMREM RoomEnvironment) + ACES — ala Fable-5 §2b.
// three 0.160 belum punya scene.environmentIntensity, jadi intensitas
// diatur per material (0.2 — "cukup untuk pantulan logam").
const EnvironmentMap: React.FC = () => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      const mat = mesh.material as THREE.MeshStandardMaterial | undefined;
      if (mat && "envMapIntensity" in mat) {
        mat.envMapIntensity = 0.2;
      }
    });
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.0;
    pmrem.dispose();
  }, [gl, scene]);
  return null;
};

const GRAIN_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")";

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // Fade from black 2 detik di awal, fade out 1,6 detik di akhir (ala Wind-Up).
  const fade = interpolate(
    frame,
    [0, 66, 402, 450],
    [1, 0, 0, 1],
  );
  // Grain bergerak: geser posisi tiap frame.
  const grainX = (frame * 7) % 300;
  const grainY = (frame * 13) % 300;

  return (
    <AbsoluteFill style={{ background: "#241536" }}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        camera={{ fov: 50, position: [30, 16, 38] }}
      >
        {/* Rig cahaya golden hour 3 titik (Fable-5 §2a) — TANPA ambientLight. */}
        <hemisphereLight args={["#FFE3B3", "#3E5C33", 0.7]} />
        <directionalLight
          position={[-22, 9, -26]}
          intensity={2.8}
          color="#FFD9A8"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[12, 8, 20]} intensity={0.55} color="#9FB4D8" />
        <CameraRig shots={SHOTS} frame={frame} />
        <Palace frame={frame} />
        <EnvironmentMap />
      </ThreeCanvas>

      <Captions />

      {/* Overlay film (Fable-5 §4): letterbox 12vh + vignette + grain. */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "12vh",
          background: "#000",
          zIndex: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "12vh",
          background: "#000",
          zIndex: 5,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 4,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 6,
          pointerEvents: "none",
          backgroundImage: GRAIN_SVG,
          backgroundPosition: `${grainX}px ${grainY}px`,
          opacity: 0.06,
        }}
      />
      {fade > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 7,
            background: "#000",
            opacity: fade,
          }}
        />
      )}

      {/* Gamelan di bawah narasi; narasi 3 kalimat mengikuti shot. */}
      <Audio src={staticFile("gamelan.wav")} volume={0.55} />
      <Audio src={staticFile("narasi1.mp3")} startFrom={12} volume={1} />
      <Audio src={staticFile("narasi2.mp3")} startFrom={191} volume={1} />
      <Audio src={staticFile("narasi3.mp3")} startFrom={315} volume={1} />
    </AbsoluteFill>
  );
};
