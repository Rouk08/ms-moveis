import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { company, differentiators } from "@/lib/data";
import AnimatedSection from "@/components/AnimatedSection";

export default function About() {
  return (
    <section id="sobre" className="py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <AnimatedSection>
          <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=900&q=80&auto=format&fit=crop"
              alt="Marceneiro finalizando móvel planejado sob medida"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <span className="inline-block text-sm font-semibold uppercase tracking-widest text-wood-600 mb-3">
            Sobre a MS Móveis
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold text-charcoal-800 mb-5">
            Mais de {company.yearsOfExperience} anos criando móveis
            planejados sob medida
          </h2>
          <p className="text-charcoal-500 text-lg leading-relaxed mb-6">
            A MS Móveis Sob Medida nasceu em Gaspar/SC com um propósito
            simples: transformar espaços por meio de móveis planejados que
            unem funcionalidade, design e a identidade de cada cliente. Hoje
            atendemos famílias e empresas de Gaspar, Blumenau, Brusque e todo
            o Vale do Itajaí, sempre com atenção aos detalhes que fazem a
            diferença no dia a dia.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {differentiators.map((item) => (
              <li key={item.title} className="flex gap-3">
                <CheckCircle2 size={22} className="shrink-0 text-moss-500 mt-0.5" />
                <div>
                  <p className="font-semibold text-charcoal-800">{item.title}</p>
                  <p className="text-sm text-charcoal-500 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </div>
    </section>
  );
}
