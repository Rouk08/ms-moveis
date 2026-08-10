import Timeline from "@/components/Timeline";
import SectionHeading from "@/components/SectionHeading";

export default function Process() {
  return (
    <section id="processo" className="py-24 sm:py-28 bg-charcoal-50/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Como trabalhamos"
          title="Do primeiro contato à instalação"
          description="Um processo transparente, pensado para você acompanhar cada etapa do seu móvel planejado."
        />
        <Timeline />
      </div>
    </section>
  );
}
