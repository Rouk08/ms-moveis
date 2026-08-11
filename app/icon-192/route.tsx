import { readFileSync } from "fs";
import { join } from "path";
import { ImageResponse } from "next/og";

export async function GET() {
  const logo = readFileSync(join(process.cwd(), "public/logo.jpg"));
  const logoSrc = `data:image/jpeg;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt="MS Móveis Sob Medida"
          width={192}
          height={192}
          style={{ objectFit: "cover" }}
        />
      </div>
    ),
    { width: 192, height: 192 }
  );
}
