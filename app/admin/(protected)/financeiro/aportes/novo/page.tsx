import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NovoAporteForm from "@/components/admin/NovoAporteForm";

export default function NovoAportePage() {
  return (
    <div className="max-w-xl">
      <Link
        href="/admin/financeiro/aportes"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para aportes
      </Link>

      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">
        Novo aporte
      </h1>
      <p className="text-sm text-charcoal-500 mb-6">
        Registre uma entrada de capital de um sócio na empresa.
      </p>

      <NovoAporteForm />
    </div>
  );
}
