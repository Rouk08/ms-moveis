import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NovoOrcamentoForm from "@/components/admin/NovoOrcamentoForm";

export default function NovoOrcamentoPage() {
  return (
    <div className="max-w-xl">
      <Link
        href="/admin/orcamentos"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para orçamentos
      </Link>

      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">
        Novo orçamento
      </h1>
      <p className="text-sm text-charcoal-500 mb-6">
        Cadastre um orçamento recebido por telefone ou outro canal.
      </p>

      <NovoOrcamentoForm />
    </div>
  );
}
