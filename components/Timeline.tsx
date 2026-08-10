import { processSteps } from "@/lib/data";
import AnimatedSection from "@/components/AnimatedSection";

export default function Timeline() {
  return (
    <div className="relative">
      <div
        className="hidden lg:block absolute top-6 left-0 right-0 h-px bg-charcoal-200"
        aria-hidden
      />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-6">
        {processSteps.map((item, index) => (
          <AnimatedSection key={item.step} delay={index * 0.1} className="relative">
            <div className="flex lg:flex-col items-start lg:items-center gap-4 lg:gap-0 lg:text-center">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-wood-500 text-white font-heading font-semibold shadow-sm">
                {item.step}
              </span>
              <div className="lg:mt-5">
                <h3 className="text-lg font-semibold text-charcoal-800">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal-500">
                  {item.description}
                </p>
              </div>
            </div>
            {index < processSteps.length - 1 && (
              <div
                className="lg:hidden ml-6 mt-2 h-8 w-px bg-charcoal-200"
                aria-hidden
              />
            )}
          </AnimatedSection>
        ))}
      </div>
    </div>
  );
}
