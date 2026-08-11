import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import SiteChrome from "@/components/SiteChrome";
import { company } from "@/lib/data";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const siteUrl = "https://www.msmoveissobmedida.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "MS Móveis Sob Medida | Móveis Planejados em Gaspar/SC",
    template: "%s | MS Móveis Sob Medida",
  },
  description:
    "Móveis planejados e sob medida em Gaspar/SC. Cozinhas, quartos, salas, banheiros, home office e projetos comerciais para Gaspar, Blumenau, Brusque e Vale do Itajaí. Projeto 3D grátis.",
  keywords: [
    "móveis planejados Gaspar",
    "móveis sob medida Vale do Itajaí",
    "marcenaria Gaspar SC",
    "móveis planejados Blumenau",
    "móveis planejados Brusque",
    "cozinha planejada Gaspar",
    "marcenaria sob medida",
  ],
  authors: [{ name: company.name }],
  creator: company.name,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: company.name,
    title: "MS Móveis Sob Medida | Móveis Planejados em Gaspar/SC",
    description:
      "Móveis planejados e sob medida para todos os ambientes. Atendemos Gaspar, Blumenau, Brusque e Vale do Itajaí com projeto 3D personalizado e garantia.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Cozinha planejada MS Móveis Sob Medida",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MS Móveis Sob Medida | Móveis Planejados em Gaspar/SC",
    description:
      "Móveis planejados e sob medida para todos os ambientes. Atendemos Gaspar, Blumenau, Brusque e Vale do Itajaí.",
    images: [
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80&auto=format&fit=crop",
    ],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#b3763a",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: company.name,
  image:
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&q=80&auto=format&fit=crop",
  "@id": siteUrl,
  url: siteUrl,
  telephone: `+${company.phone.raw}`,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    addressRegion: company.address.state,
    postalCode: company.address.zip,
    addressCountry: "BR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -26.9308,
    longitude: -48.9589,
  },
  areaServed: company.serviceArea,
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
      ],
      opens: "08:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday"],
      opens: "08:00",
      closes: "12:00",
    },
  ],
  sameAs: [company.social.instagram, company.social.facebook],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-white text-charcoal-800">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
