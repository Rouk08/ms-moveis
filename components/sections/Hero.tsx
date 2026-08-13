"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import { company } from "@/lib/data";

export default function Hero() {
  return (
    <section id="inicio" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80&auto=format&fit=crop"
          alt="Cozinha planejada em madeira clara, exemplo de móveis sob medida MS Móveis"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/85 via-charcoal-900/60 to-charcoal-900/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-wood-200 backdrop-blur-sm">
            Marcenaria sob medida em Gaspar/SC
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight">
            Móveis Planejados em Gaspar e Blumenau, do Projeto 3D à
            Instalação
          </h1>
          <p className="mt-6 text-lg text-charcoal-100 leading-relaxed max-w-xl">
            Projetamos e fabricamos móveis planejados para cozinhas, quartos,
            salas e ambientes comerciais em Gaspar, Blumenau, Brusque e Vale
            do Itajaí — com projeto 3D personalizado e acabamento impecável.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-4">
            <Link
              href={`https://wa.me/${company.whatsapp.raw}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-wood-500 px-7 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-wood-600 transition-colors"
            >
              <MessageCircle size={18} />
              Solicitar Orçamento
            </Link>
            <Link
              href="/#portfolio"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-colors"
            >
              Ver Portfólio
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
