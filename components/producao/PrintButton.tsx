"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print:hidden flex items-center gap-1.5 rounded-full border border-white/40 bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25"
    >
      <Printer size={15} />
      Imprimir / Salvar PDF
    </button>
  );
}
