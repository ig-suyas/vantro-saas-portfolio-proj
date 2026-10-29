import { ImageResponse } from "next/og";

export const alt = "Vantro: call the quarter with a number you can defend. Concept project.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  const pts = Array.from({ length: 41 }, (_, i) => {
    const t = i / 40;
    return [560 + t * 560, 520 - (0.42 * t + 0.58 * Math.pow(t, 2.1)) * 330] as const;
  });
  const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const band =
    pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${(y - Math.pow(i / 40, 1.3) * 30).toFixed(1)}`).join(" ") +
    " " +
    [...pts].reverse().map(([x, y], i) => `L${x.toFixed(1)} ${(y + Math.pow((40 - i) / 40, 1.3) * 36).toFixed(1)}`).join(" ") +
    " Z";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f3f0e8", padding: 72, color: "#121416", position: "relative" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", top: 0, left: 0 }}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1="560" x2="1130" y1={190 + i * 66} y2={190 + i * 66} stroke="#121416" strokeOpacity="0.08" />
          ))}
          <path d={band} fill="#2e5a4c" fillOpacity="0.16" />
          <path d={d} fill="none" stroke="#e4572e" strokeWidth="6" strokeLinecap="round" />
        </svg>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 40, fontWeight: 600 }}>
          <svg width="52" height="52" viewBox="0 0 32 32">
            <path d="M5 9.5 L13.2 24 L18.6 14.4" fill="none" stroke="#121416" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.6 14.4 L22 8.4 L27 6" fill="none" stroke="#e4572e" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Vantro
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 620 }}>
          <div style={{ fontSize: 68, lineHeight: 1.02, letterSpacing: -1.5, fontWeight: 600 }}>Call the quarter with a number you can defend.</div>
          <div style={{ marginTop: 28, fontSize: 26, color: "#565b57" }}>Revenue forecasting for B2B sales teams Â· Concept project</div>
        </div>
      </div>
    ),
    size,
  );
}
