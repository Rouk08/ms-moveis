import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { company, services, portfolio } from "@/lib/data";
import AnimatedSection from "@/components/AnimatedSection";
import Breadcrumb from "@/components/Breadcrumb";
import SectionHeading from "@/components/SectionHeading";
import GalleryGrid from "@/components/GalleryGrid";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};

  return {
    title: service.title,
    description: `${service.shortDescription} Atendemos Gaspar, Blumenau, Brusque e Vale do Itajaí.`,
    alternates: {
      canonical: `/servicos/${service.slug}`,
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();

  const Icon = service.icon;
  const relatedProjects = portfolio.filter(
    (item) => item.category === service.portfolioCategory
  );

  const contatoWhatsapp = service.parceiro?.whatsapp ?? company.whatsapp;
  const ctaMensagem = service.parceiro
    ? `Olá! Vim pelo site da MS Móveis Sob Medida e tenho interesse em ${service.title.toLowerCase()}.`
    : `Olá! Tenho interesse em ${service.title.toLowerCase()} e gostaria de solicitar um orçamento.`;

  return (
    <>
      <section className="pt-32 pb-16 sm:pt-36 sm:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Início", href: "/" },
              { label: "Serviços", href: "/servicos" },
              { label: service.title },
            ]}
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={service.image}
                  alt={
                    service.parceiro
                      ? `${service.title} — em parceria com ${service.parceiro.empresa}`
                      : `${service.title} sob medida — MS Móveis, Gaspar/SC`
                  }
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                  priority
                />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-wood-100 text-wood-600">
                <Icon size={24} />
              </span>
              <h1 className="mt-5 text-3xl sm:text-4xl font-semibold text-charcoal-800">
                {service.title}
              </h1>
              <p className="mt-4 text-charcoal-500 leading-relaxed text-lg">
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

              {service.parceiro && (
                <div className="mt-6 rounded-xl border border-wood-200 bg-wood-50/60 p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-wood-700">
                    <ShieldCheck size={16} />
                    Serviço em parceria com {service.parceiro.empresa}
                  </p>
                  <p className="mt-2 text-sm text-charcoal-600">
                    {service.parceiro.nome} — {service.parceiro.cargo},{" "}
                    {service.parceiro.registro}
                  </p>
                  <p className="mt-1 text-xs text-charcoal-400">
                    O contato para este serviço é feito diretamente com o
                    engenheiro responsável.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    <a
                      href={`mailto:${service.parceiro.email}`}
                      className="inline-flex items-center gap-1.5 text-wood-700 hover:text-wood-800 transition-colors"
                    >
                      <Mail size={14} />
                      {service.parceiro.email}
                    </a>
                    <a
                      href={service.parceiro.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-wood-700 hover:text-wood-800 transition-colors"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              )}

              <Link
                href={`https://wa.me/${contatoWhatsapp.raw}?text=${encodeURIComponent(ctaMensagem)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-wood-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 transition-colors"
              >
                <MessageCircle size={16} />
                {service.parceiro
                  ? `Falar com ${service.parceiro.nome.split(" ")[0]} no WhatsApp`
                  : `Solicitar orçamento para ${service.title.toLowerCase()}`}
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {relatedProjects.length > 0 && (
        <section className="py-20 sm:py-24 bg-charcoal-50/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="Portfólio"
              title={`Projetos de ${service.title.toLowerCase()} que já entregamos`}
              description="Uma amostra de móveis planejados sob medida entregues em Gaspar, Blumenau, Brusque e região."
            />
            <AnimatedSection>
              <GalleryGrid items={relatedProjects} />
            </AnimatedSection>
          </div>
        </section>
      )}

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-charcoal-800 mb-4">
            Pronto para começar seu projeto de {service.title.toLowerCase()}?
          </h2>
          <p className="text-charcoal-500 text-lg leading-relaxed mb-9">
            {service.parceiro
              ? `Fale diretamente com ${service.parceiro.nome} e solicite uma avaliação sem compromisso para o seu projeto estrutural.`
              : "Fale com a nossa equipe e solicite um orçamento sem compromisso para o seu projeto sob medida."}
          </p>
          <Link
            href={
              service.parceiro
                ? `https://wa.me/${contatoWhatsapp.raw}?text=${encodeURIComponent(ctaMensagem)}`
                : "/contato"
            }
            target={service.parceiro ? "_blank" : undefined}
            rel={service.parceiro ? "noopener noreferrer" : undefined}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-wood-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-wood-600 transition-colors"
          >
            {service.parceiro
              ? `Falar com ${service.parceiro.nome.split(" ")[0]}`
              : "Fale com a nossa equipe"}
          </Link>
        </div>
      </section>
    </>
  );
}
