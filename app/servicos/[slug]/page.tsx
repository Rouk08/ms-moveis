import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
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
                  alt={`${service.title} sob medida — MS Móveis, Gaspar/SC`}
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
            Fale com a nossa equipe e solicite um orçamento sem compromisso
            para o seu projeto sob medida.
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
