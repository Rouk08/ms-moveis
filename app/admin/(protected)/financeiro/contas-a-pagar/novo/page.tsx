import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NovaContaPagarForm from "@/components/admin/NovaContaPagarForm";

export default function NovaContaPagarPage() {
  return (
    <div className="max-w-xl">
      <Link
        href="/admin/financeiro/contas-a-pagar"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-500 hover:text-charcoal-700 mb-6"
      >
        <ArrowLeft size={16} />
        Voltar para contas a pagar
      </Link>

      <h1 className="text-2xl font-semibold text-charcoal-800 mb-1">
        Nova conta a pagar
      </h1>
      <p className="text-sm text-charcoal-500 mb-6">
        Cadastre uma despesa a pagar.
      </p>

      <NovaContaPagarForm />
    </div>
  );
}
