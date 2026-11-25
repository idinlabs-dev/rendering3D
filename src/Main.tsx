import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { CameraRig, CAM_KEYS } from "./lib/camera";
import { Palace } from "./scene/Palace";
import { Captions } from "./ui/Captions";

export const Main: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: "#241536" }}>
      <ThreeCanvas
        width={width}
        height={height}
        shadows
        camera={{ fov: 50, position: [30, 16, 38] }}
      >
        <ambientLight intensity={0.75} />
        <hemisphereLight args={["#FFE3B3", "#3E5C33", 0.5]} />
        <directionalLight
          position={[14, 22, 12]}
          intensity={2.4}
          color="#FFE3B3"
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <directionalLight position={[-10, 8, 18]} intensity={0.9} color="#FFE9C4" />
        <CameraRig keys={CAM_KEYS} frame={frame} />
        <Palace frame={frame} />
      </ThreeCanvas>

      <Captions />

      <Audio src={staticFile("gamelan.wav")} volume={0.9} />
    </AbsoluteFill>
  );
};
