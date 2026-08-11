"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { PortfolioItem } from "@/lib/data";

type GalleryGridProps = {
  items: PortfolioItem[];
};

export default function GalleryGrid({ items }: GalleryGridProps) {
  const categories = useMemo(
    () => Array.from(new Set(items.map((item) => item.category))),
    [items]
  );
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const [selected, setSelected] = useState<PortfolioItem | null>(null);

  const filteredItems =
    activeCategory === "Todos"
      ? items
      : items.filter((item) => item.category === activeCategory);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {["Todos", ...categories].map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === category
                ? "bg-wood-500 text-white"
                : "bg-white text-charcoal-600 border border-charcoal-200 hover:bg-charcoal-50"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <button
            key={item.title}
            type="button"
            onClick={() => setSelected(item)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-charcoal-100 text-left"
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
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal-900/90 p-4 sm:p-8"
            onClick={() => setSelected(null)}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Fechar"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X size={20} />
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <Image
                  src={selected.image}
                  alt={`${selected.title} — projeto de ${selected.category.toLowerCase()} sob medida MS Móveis`}
                  fill
                  sizes="90vw"
                  className="object-contain bg-charcoal-900"
                />
              </div>
              <div className="mt-4 text-center">
                <span className="text-xs font-semibold uppercase tracking-widest text-wood-300">
                  {selected.category}
                </span>
                <p className="text-white font-heading font-semibold text-lg">
                  {selected.title}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
