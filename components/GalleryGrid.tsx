import Image from "next/image";
import type { PortfolioItem } from "@/lib/data";

type GalleryGridProps = {
  items: PortfolioItem[];
};

export default function GalleryGrid({ items }: GalleryGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item.title}
          className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-charcoal-100"
        >
          <Image
            src={item.image}
            alt={`${item.title} — projeto de ${item.category.toLowerCase()} sob medida MS Móveis`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/0 to-charcoal-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-x-0 bottom-0 p-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-xs font-semibold uppercase tracking-widest text-wood-300">
              {item.category}
            </span>
            <p className="text-white font-heading font-semibold">
              {item.title}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
