import { interpolate, useCurrentFrame } from "remotion";

// Tanpa @remotion/google-fonts: fonts.gstatic.com diblokir di sandbox ini
// (ERR_SSL_PROTOCOL_ERROR) dan font web tidak dijamin ada di runner Actions.
// Pakai stack serif/sans sistem — DejaVu/Noto ada di Ubuntu lokal & runner.
const playfair = "Georgia, 'Noto Serif', 'DejaVu Serif', serif";
const inter = "'Noto Sans', 'DejaVu Sans', sans-serif";

const Caption: React.FC<{ from: number; to: number; text: string }> = ({
  from,
  to,
  text,
}) => {
  const frame = useCurrentFrame();
  if (frame < from || frame >= to) return null;
  const opacity = interpolate(
    frame,
    [from, from + 12, to - 12, to],
    [0, 1, 1, 0],
  );
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: "9%",
        textAlign: "center",
        opacity,
      }}
    >
      <span
        style={{
          fontFamily: inter,
          fontWeight: 600,
          fontSize: 52,
          color: "#FFF7E0",
          textShadow: "0 3px 12px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.9)",
          letterSpacing: 0.5,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const titleOpacity = interpolate(frame, [385, 405, 440, 450], [0, 1, 1, 0.4]);
  const showTitle = frame >= 385;

  return (
    <>
      <Caption from={15} to={140} text="Pakuan Pajajaran — ibu kota Kerajaan Sunda" />
      <Caption from={165} to={290} text="Emas, sutra, dan permata menghiasi istana" />
      <Caption from={315} to={380} text="Di singgasana ini, sang raja memerintah" />
      {showTitle && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "30%",
            textAlign: "center",
            opacity: titleOpacity,
          }}
        >
          <div
            style={{
              fontFamily: playfair,
              fontWeight: 900,
              fontSize: 150,
              lineHeight: 1,
              color: "#F2C94C",
              textShadow: "0 6px 30px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.9)",
              letterSpacing: 6,
            }}
          >
            KEMEWAHAN
          </div>
          <div
            style={{
              fontFamily: playfair,
              fontWeight: 700,
              fontSize: 62,
              color: "#FFF7E0",
              textShadow: "0 4px 20px rgba(0,0,0,0.85)",
              letterSpacing: 14,
              marginTop: 18,
            }}
          >
            KERAJAAN PAJAJARAN
          </div>
          <div
            style={{
              width: 220,
              height: 3,
              background: "#F2C94C",
              margin: "26px auto 0",
            }}
          />
          <div
            style={{
              fontFamily: inter,
              fontWeight: 600,
              fontSize: 38,
              color: "#FFE9B8",
              textShadow: "0 2px 10px rgba(0,0,0,0.85)",
              marginTop: 22,
              letterSpacing: 2,
            }}
          >
            Pakuan Pajajaran • Tanah Sunda
          </div>
        </div>
      )}
    </>
  );
};
