import { Composition } from "remotion";
import { Main } from "./Main";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Pajajaran"
    component={Main}
    durationInFrames={450}
    fps={30}
    width={1920}
    height={1080}
  />
);
