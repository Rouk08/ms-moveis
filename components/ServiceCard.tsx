import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/data";

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;

  return (
    <div className="group h-full flex flex-col rounded-2xl border border-charcoal-100 bg-white p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-wood-100 text-wood-600 group-hover:bg-wood-500 group-hover:text-white transition-colors duration-300">
        <Icon size={24} />
      </span>
      <h3 className="mt-6 text-xl font-semibold text-charcoal-800">
        {service.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-charcoal-500 flex-1">
        {service.shortDescription}
      </p>
      <Link
        href={`/servicos#${service.slug}`}
        className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-wood-600 hover:text-wood-700 transition-colors"
      >
        Saiba mais
        <ArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
