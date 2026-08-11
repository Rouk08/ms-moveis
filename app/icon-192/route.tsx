import { ImageResponse } from "next/og";

export async function GET() {
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
          fontSize: 84,
          fontWeight: 700,
          fontFamily: "sans-serif",
        }}
      >
        MS
      </div>
    ),
    { width: 192, height: 192 }
  );
}
