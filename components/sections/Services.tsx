import { services } from "@/lib/data";
import ServiceCard from "@/components/ServiceCard";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";

export default function Services() {
  return (
    <section id="servicos" className="py-24 sm:py-28 bg-charcoal-50/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Nossos serviços"
          title="Móveis planejados para cada ambiente"
          description="Do projeto à instalação, criamos soluções sob medida que aproveitam cada detalhe do seu espaço, residencial ou comercial."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <AnimatedSection key={service.slug} delay={(index % 3) * 0.1}>
              <ServiceCard service={service} />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
