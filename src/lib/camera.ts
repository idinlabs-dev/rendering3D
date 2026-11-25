import { Easing } from "remotion";
import { useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";

export type CamKey = {
  f: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const ease = Easing.inOut(Easing.cubic);

export const sampleCam = (keys: CamKey[], frame: number) => {
  if (frame <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame <= b.f) {
      const t = ease((frame - a.f) / (b.f - a.f));
      const v3 = (
        x: [number, number, number],
        y: [number, number, number],
      ) =>
        [lerp(x[0], y[0], t), lerp(x[1], y[1], t), lerp(x[2], y[2], t)] as [
        number,
        number,
        number,
      ];
      return { f: frame, pos: v3(a.pos, b.pos), look: v3(a.look, b.look), fov: lerp(a.fov, b.fov, t) };
    }
  }
  return keys[keys.length - 1];
};

export const CameraRig: React.FC<{ keys: CamKey[]; frame: number }> = ({
  keys,
  frame,
}) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const k = sampleCam(keys, frame);
  camera.position.set(...k.pos);
  camera.fov = k.fov;
  camera.lookAt(...k.look);
  camera.updateProjectionMatrix();
  return null;
};

// Satu gerakan kamera kontinu 15 detik: wide istana -> teras -> singgasana.
// f0: establishing, f150: teras & atap, f300: singgasana, f449: mahkota.
export const CAM_KEYS: CamKey[] = [
  { f: 0, pos: [26, 13, 32], look: [0, 5, 0], fov: 50 },
  { f: 150, pos: [17, 10, 24], look: [0, 4.5, 0], fov: 44 },
  { f: 300, pos: [8, 6, 12], look: [0, 4.2, 2], fov: 38 },
  { f: 449, pos: [4.2, 4.8, 7], look: [0, 4.2, 2.6], fov: 32 },
];
