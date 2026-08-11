import { Layers } from "lucide-react";
import { materialCategories } from "@/lib/data";
import SectionHeading from "@/components/SectionHeading";
import AnimatedSection from "@/components/AnimatedSection";

export default function Partners() {
  return (
    <section className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Materiais e acabamentos"
          title="Qualidade que você sente no toque"
          description="Trabalhamos só com materiais e acabamentos de procedência, selecionados para durar."
        />
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
          {materialCategories.map((material, index) => (
            <AnimatedSection key={material.title} delay={(index % 3) * 0.08}>
              <div className="h-full rounded-2xl border border-charcoal-100 bg-white p-6 text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-wood-100 text-wood-600">
                  <Layers size={20} />
                </span>
                <p className="mt-4 font-semibold text-charcoal-800">
                  {material.title}
                </p>
                <p className="mt-1.5 text-sm text-charcoal-500 leading-relaxed">
                  {material.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
