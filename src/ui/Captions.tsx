import { interpolate, useCurrentFrame } from "remotion";

// Tanpa @remotion/google-fonts: fonts.gstatic.com diblokir di sandbox ini
// (ERR_SSL_PROTOCOL_ERROR) dan font web tidak dijamin ada di runner Actions.
// Pakai stack serif/sans sistem — DejaVu/Noto ada di Ubuntu lokal & runner.
const playfair = "Georgia, 'Noto Serif', 'DejaVu Serif', serif";
const inter = "'Noto Sans', 'DejaVu Sans', sans-serif";

// Subtitle = teks narasi yang sedang diucapkan (waktu = startFrame audio).
// Posisi bottom 14,5% supaya di atas letterbox (bar hitam 12vh).
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
        bottom: "14.5%",
        textAlign: "center",
        opacity,
        zIndex: 8,
      }}
    >
      <span
        style={{
          display: "inline-block",
          maxWidth: 1500,
          fontFamily: inter,
          fontWeight: 600,
          fontSize: 46,
          lineHeight: 1.35,
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
  // Judul masuk di AWAL (ala Taj: titleIn ~1 dtk, out ~6 dtk), di atas shot 1.
  const titleOpacity = interpolate(frame, [30, 48, 70, 88], [0, 1, 1, 0]);
  const showTitle = frame >= 30 && frame < 90;
  // End card di shot penutup.
  const endOpacity = interpolate(frame, [400, 415, 442, 450], [0, 1, 1, 0.4]);
  const showEnd = frame >= 400;

  return (
    <>
      <Caption
        from={12}
        to={188}
        text="Di jantung Tanah Sunda, berdirilah Pakuan, ibu kota Kerajaan Pajajaran."
      />
      <Caption
        from={191}
        to={312}
        text="Emas, sutra, dan permata menghiasi istana sang raja."
      />
      <Caption
        from={315}
        to={428}
        text="Di singgasana ini, kemewahan itu memerintah."
      />
      {showTitle && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "26%",
            textAlign: "center",
            opacity: titleOpacity,
            zIndex: 8,
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
        </div>
      )}
      {showEnd && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "30%",
            textAlign: "center",
            opacity: endOpacity,
            zIndex: 8,
          }}
        >
          <div
            style={{
              fontFamily: playfair,
              fontWeight: 900,
              fontSize: 110,
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
              fontSize: 48,
              color: "#FFF7E0",
              textShadow: "0 4px 20px rgba(0,0,0,0.85)",
              letterSpacing: 12,
              marginTop: 14,
            }}
          >
            KERAJAAN PAJAJARAN
          </div>
          <div
            style={{
              width: 220,
              height: 3,
              background: "#F2C94C",
              margin: "22px auto 0",
            }}
          />
          <div
            style={{
              fontFamily: inter,
              fontWeight: 600,
              fontSize: 32,
              color: "#FFE9B8",
              textShadow: "0 2px 10px rgba(0,0,0,0.85)",
              marginTop: 18,
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
