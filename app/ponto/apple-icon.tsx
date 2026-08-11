import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#b3763a",
          color: "#ffffff",
          fontSize: 78,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        MS
      </div>
    ),
    size
  );
}
