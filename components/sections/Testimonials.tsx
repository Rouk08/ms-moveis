import TestimonialCarousel from "@/components/TestimonialCarousel";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";

export default function Testimonials() {
  return (
    <section id="depoimentos" className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Depoimentos"
          title="Quem já sentiu a diferença de um móvel sob medida"
        />
        <AnimatedSection>
          <TestimonialCarousel />
        </AnimatedSection>
      </div>
    </section>
  );
}
