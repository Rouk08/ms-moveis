import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-sm">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {index > 0 && (
              <ChevronRight size={14} className="text-charcoal-300 shrink-0" />
            )}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-charcoal-500 hover:text-wood-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? "text-charcoal-700 font-medium" : "text-charcoal-500"}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
