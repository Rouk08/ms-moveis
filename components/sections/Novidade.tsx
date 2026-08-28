import Link from "next/link";
import { Droplet, Flame, Bug, Wrench, MessageCircle, Sparkles } from "lucide-react";
import { company, novidade } from "@/lib/data";
import AnimatedSection from "@/components/AnimatedSection";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  droplet: Droplet,
  flame: Flame,
  bug: Bug,
  wrench: Wrench,
};

export default function Novidade() {
  return (
    <section className="bg-charcoal-900 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-wood-500/15 px-4 py-1.5 text-sm font-semibold text-wood-300">
            <Sparkles size={15} />
            {novidade.badge}
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-semibold text-white">
            {novidade.title}
          </h2>
          <p className="mt-5 text-charcoal-200 leading-relaxed">
            {novidade.description}
          </p>
        </AnimatedSection>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {novidade.features.map((feature, index) => {
            const Icon = ICONS[feature.icon];
            return (
              <AnimatedSection key={feature.title} delay={index * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-wood-500/20 text-wood-300">
                    <Icon size={20} />
                  </span>
                  <p className="mt-4 font-semibold text-white">
                    {feature.title}
                  </p>
                  <p className="mt-1.5 text-sm text-charcoal-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection delay={0.2} className="mt-10 text-center">
          <Link
            href={`https://wa.me/${company.whatsapp.raw}?text=${encodeURIComponent(
              novidade.ctaMessage
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-wood-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-wood-600 transition-colors"
          >
            <MessageCircle size={18} />
            {novidade.ctaLabel}
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
