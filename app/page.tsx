import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Stats from "@/components/sections/Stats";
import Services from "@/components/sections/Services";
import Gallery from "@/components/sections/Gallery";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import CtaFinal from "@/components/sections/CtaFinal";

export const metadata: Metadata = {
  title: "MS Móveis Sob Medida | Móveis Planejados em Gaspar/SC",
  description:
    "Móveis planejados e sob medida em Gaspar/SC. Cozinhas, quartos, salas, banheiros, home office e projetos comerciais para Gaspar, Blumenau, Brusque e Vale do Itajaí. Projeto 3D grátis.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Stats />
      <Services />
      <Gallery />
      <Process />
      <Testimonials />
      <CtaFinal />
    </>
  );
}
