import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { company, services } from "@/lib/data";
import AnimatedSection from "@/components/AnimatedSection";

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

      {services.map((service, index) => {
        const Icon = service.icon;
        const reversed = index % 2 === 1;

        return (
          <section
            key={service.slug}
            id={service.slug}
            className="scroll-mt-24 py-20 sm:py-24 border-b border-charcoal-100 last:border-b-0"
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  reversed ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                <AnimatedSection>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                    <Image
                      src={service.image}
                      alt={`${service.title} sob medida — MS Móveis, Gaspar/SC`}
                      fill
                      sizes="(max-width: 1024px) 90vw, 45vw"
                      className="object-cover"
                    />
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={0.15}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-wood-100 text-wood-600">
                    <Icon size={24} />
                  </span>
                  <h2 className="mt-5 text-2xl sm:text-3xl font-semibold text-charcoal-800">
                    {service.title}
                  </h2>
                  <p className="mt-4 text-charcoal-500 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="mt-6 space-y-3">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-sm text-charcoal-600">
                        <CheckCircle2 size={20} className="shrink-0 text-moss-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`https://wa.me/${company.whatsapp.raw}?text=${encodeURIComponent(
                      `Olá! Tenho interesse em ${service.title.toLowerCase()} e gostaria de solicitar um orçamento.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-wood-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 transition-colors"
                  >
                    <MessageCircle size={16} />
                    Solicitar orçamento para {service.title.toLowerCase()}
                  </Link>
                </AnimatedSection>
              </div>
            </div>
          </section>
        );
      })}

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
