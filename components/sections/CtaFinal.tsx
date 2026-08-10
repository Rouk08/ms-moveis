import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import { company } from "@/lib/data";
import AnimatedSection from "@/components/AnimatedSection";

export default function CtaFinal() {
  return (
    <section className="py-24 sm:py-28 bg-charcoal-800">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <AnimatedSection>
          <h2 className="text-3xl sm:text-4xl font-semibold text-white">
            Pronto para transformar seu espaço?
          </h2>
          <p className="mt-5 text-lg text-charcoal-300 leading-relaxed max-w-2xl mx-auto">
            Fale agora com a nossa equipe e solicite um orçamento sem
            compromisso para o seu móvel planejado sob medida.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`https://wa.me/${company.whatsapp.raw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-wood-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-wood-600 transition-colors"
            >
              <MessageCircle size={18} />
              Chamar no WhatsApp
            </Link>
            <Link
              href="/contato"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              <Phone size={18} />
              Preencher Formulário
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
