import type { Metadata, Viewport } from "next";
import Image from "next/image";
import PontoKioskForm from "@/components/PontoKioskForm";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";

export const metadata: Metadata = {
  title: "Ponto",
  robots: { index: false, follow: false },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Ponto",
  },
};

export const viewport: Viewport = {
  themeColor: "#b3763a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function PontoPage() {
  return (
    <div className="min-h-screen bg-charcoal-50/30 flex items-center justify-center p-6">
      <RegisterServiceWorker />
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8">
          <Image
            src="/logo.jpg"
            alt="MS Móveis"
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
          <p className="font-heading font-semibold text-xl text-charcoal-800">
            MS Móveis
          </p>
          <p className="text-sm text-charcoal-500">Registro de ponto</p>
        </div>

        <div className="rounded-2xl border border-charcoal-100 bg-white p-8 shadow-sm">
          <PontoKioskForm />
        </div>
      </div>
    </div>
  );
}
