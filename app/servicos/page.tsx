import type { Metadata } from "next";
import Link from "next/link";
import { services } from "@/lib/data";
import ServiceCard from "@/components/ServiceCard";
import AnimatedSection from "@/components/AnimatedSection";
import Breadcrumb from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Serviços de Móveis Planejados",
  description:
    "Conheça os serviços de móveis planejados e sob medida da MS Móveis: cozinhas, quartos, salas, banheiros, home office e projetos comerciais em Gaspar, Blumenau e Brusque.",
  alternates: {
    canonical: "/servicos",
  },
};

export default function ServicosPage() {
  return (
    <>
      <section className="pt-36 pb-20 sm:pt-40 sm:pb-24 bg-charcoal-50/40">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Breadcrumb items={[{ label: "Início", href: "/" }, { label: "Serviços" }]} />
          </div>
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-wood-600 mb-3">
            Nossos serviços
          </span>
          <h1 className="text-4xl sm:text-5xl font-semibold text-charcoal-800">
            Móveis planejados sob medida para cada ambiente
          </h1>
          <p className="mt-5 text-lg text-charcoal-500 leading-relaxed">
            Da cozinha ao escritório comercial, desenvolvemos projetos
            personalizados que aproveitam cada detalhe do seu espaço em
            Gaspar, Blumenau, Brusque e Vale do Itajaí.
          </p>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <AnimatedSection key={service.slug} delay={(index % 3) * 0.1}>
                <ServiceCard service={service} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-charcoal-800">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Não encontrou o que precisa?
          </h2>
          <p className="text-charcoal-300 text-lg leading-relaxed mb-9">
            Também desenvolvemos projetos sob medida para necessidades
            específicas. Fale com a nossa equipe e conte a sua ideia.
          </p>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-wood-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-wood-600 transition-colors"
          >
            Fale com a nossa equipe
          </Link>
        </div>
      </section>
    </>
  );
}
