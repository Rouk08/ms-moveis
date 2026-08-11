import type { MetadataRoute } from "next";
import { services } from "@/lib/data";

const siteUrl = "https://www.msmoveissobmedida.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/servicos",
    "/contato",
    ...services.map((service) => `/servicos/${service.slug}`),
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
