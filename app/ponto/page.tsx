import type { Metadata } from "next";
import { Sofa } from "lucide-react";
import PontoKioskForm from "@/components/PontoKioskForm";

export const metadata: Metadata = {
  title: "Ponto",
  robots: { index: false, follow: false },
};

export default function PontoPage() {
  return (
    <div className="min-h-screen bg-charcoal-50/30 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-wood-500 text-white">
            <Sofa size={24} />
          </span>
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
