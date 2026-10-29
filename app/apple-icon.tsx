import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f0e8" }}>
        <svg width="120" height="120" viewBox="0 0 32 32">
          <path d="M5 9.5 L13.2 24 L18.6 14.4" fill="none" stroke="#121416" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18.6 14.4 L22 8.4 L27 6" fill="none" stroke="#e4572e" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
