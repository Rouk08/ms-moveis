import { portfolio } from "@/lib/data";
import GalleryGrid from "@/components/GalleryGrid";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";

export default function Gallery() {
  return (
    <section id="portfolio" className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Portfólio"
          title="Projetos que já transformamos"
          description="Uma amostra de móveis planejados e sob medida entregues em Gaspar, Blumenau, Brusque e região."
        />
        <AnimatedSection>
          <GalleryGrid items={portfolio} />
        </AnimatedSection>
      </div>
    </section>
  );
}
