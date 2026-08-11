"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { testimonials } from "@/lib/data";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function TestimonialCarousel() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = () => {
    setIndex((current) => (current - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const testimonial = testimonials[index];

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="relative overflow-hidden rounded-2xl bg-wood-50 px-6 py-10 sm:px-12 sm:py-14 text-center">
        <Quote className="mx-auto text-wood-300" size={36} />
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <p className="mt-6 text-lg sm:text-xl leading-relaxed text-charcoal-700">
              &ldquo;{testimonial.text}&rdquo;
            </p>
            <div className="mt-6 flex items-center justify-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  className={
                    i < testimonial.rating
                      ? "fill-wood-500 text-wood-500"
                      : "fill-charcoal-200 text-charcoal-200"
                  }
                />
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-wood-500 text-sm font-semibold text-white">
                {initials(testimonial.name)}
              </span>
              <div className="text-left">
                <p className="font-heading font-semibold text-charcoal-800">
                  {testimonial.name}
                </p>
                <p className="text-sm text-charcoal-500">
                  {testimonial.location}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        type="button"
        onClick={prev}
        aria-label="Depoimento anterior"
        className="absolute left-0 sm:-left-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-charcoal-700 shadow-md hover:bg-wood-500 hover:text-white transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Próximo depoimento"
        className="absolute right-0 sm:-right-5 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white text-charcoal-700 shadow-md hover:bg-wood-500 hover:text-white transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      <div className="mt-6 flex items-center justify-center gap-2">
        {testimonials.map((item, i) => (
          <button
            key={item.name}
            type="button"
            aria-label={`Ver depoimento de ${item.name}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-wood-500" : "w-2 bg-charcoal-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
