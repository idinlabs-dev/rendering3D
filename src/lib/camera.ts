import { Easing } from "remotion";
import { useThree } from "@react-three/fiber";
import type { PerspectiveCamera } from "three";

export type CamKey = {
  f: number;
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
};

export type Shot = {
  name: string;
  from: number;
  to: number;
  keys: CamKey[];
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

export const CameraRig: React.FC<{ shots: Shot[]; frame: number }> = ({
  shots,
  frame,
}) => {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const shot =
    shots.find((s) => frame >= s.from && frame < s.to) ??
    shots[shots.length - 1];
  const local = frame - shot.from;
  const k = sampleCam(shot.keys, local);
  // Handheld breath (ala Taj Mahal §1c): napas halus, bukan guncangan.
  const breathY = Math.sin(frame * 0.0567) * 0.05;
  const breathRoll = Math.sin(frame * 0.03) * 0.0018;
  camera.position.set(k.pos[0], k.pos[1] + breathY, k.pos[2]);
  camera.fov = k.fov;
  camera.lookAt(...k.look);
  camera.rotation.z += breathRoll;
  camera.updateProjectionMatrix();
  return null;
};

// Cut list 4 shot bernama (ala Wind-Up 10 shot / Taj 6 beat) — BUKAN 1 dolly.
// Shot 1 "Fajar di Pakuan" f0-90: establishing push-in, FOV lebar.
// Shot 2 "Singgasana" f90-210: orbit pelan mengelilingi singgasana/mahkota, FOV 38.
// Shot 3 "Mahkota" f210-330: crane naik + reveal kompleks, lalu hold di puncak.
// Shot 4 "Kemewahan" f330-450: slow push-in ke mahkota, FOV mengecil 44->36.
export const SHOTS: Shot[] = [
  {
    name: "Fajar di Pakuan",
    from: 0,
    to: 90,
    keys: [
      { f: 0, pos: [30, 15, 38], look: [0, 5, 0], fov: 50 },
      { f: 90, pos: [24, 12, 30], look: [0, 5, 0], fov: 46 },
    ],
  },
  {
    name: "Singgasana",
    from: 90,
    to: 210,
    keys: [
      { f: 0, pos: [10, 6.2, 11], look: [0, 4.2, 2.2], fov: 38 },
      { f: 60, pos: [2, 6.5, 13], look: [0, 4.2, 2.2], fov: 38 },
      { f: 120, pos: [-8, 6.2, 10], look: [0, 4.2, 2.2], fov: 38 },
    ],
  },
  {
    name: "Mahkota",
    from: 210,
    to: 330,
    keys: [
      { f: 0, pos: [6, 3.5, 11], look: [0, 6, 0], fov: 44 },
      { f: 60, pos: [12, 9, 18], look: [0, 4.5, 0], fov: 44 },
      { f: 90, pos: [18, 16, 24], look: [0, 4, 0], fov: 44 },
      { f: 120, pos: [18, 16, 24], look: [0, 4, 0], fov: 44 },
    ],
  },
  {
    name: "Kemewahan",
    from: 330,
    to: 450,
    keys: [
      { f: 0, pos: [8, 6.5, 12], look: [0, 4.5, 2.2], fov: 44 },
      { f: 120, pos: [6, 6, 9.5], look: [0, 4.5, 2.2], fov: 36 },
    ],
  },
];
