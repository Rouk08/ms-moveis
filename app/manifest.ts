import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MS Móveis - Ponto",
    short_name: "Ponto",
    description: "Registro de ponto dos colaboradores da MS Móveis Sob Medida.",
    start_url: "/ponto",
    scope: "/ponto",
    display: "standalone",
    orientation: "portrait",
    background_color: "#f6f5f4",
    theme_color: "#b3763a",
    lang: "pt-BR",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
