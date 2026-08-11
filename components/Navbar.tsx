"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { company } from "@/lib/data";

const navLinks = [
  { label: "Início", href: "/#inicio" },
  { label: "Sobre", href: "/#sobre" },
  { label: "Serviços", href: "/servicos" },
  { label: "Portfólio", href: "/#portfolio" },
  { label: "Depoimentos", href: "/#depoimentos" },
  { label: "Contato", href: "/contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-sm shadow-sm py-3"
          : "bg-white/0 py-5"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-heading text-xl font-semibold text-charcoal-800"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/logo.jpg"
            alt="MS Móveis"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
          MS Móveis
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-charcoal-600 hover:text-wood-600 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-400 hover:text-charcoal-600 transition-colors"
          >
            <Lock size={14} />
            Admin
          </Link>
          <Link
            href={`https://wa.me/${company.whatsapp.raw}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-wood-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-wood-600 transition-colors"
          >
            Solicitar Orçamento
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden text-charcoal-700"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white border-t border-charcoal-100"
          >
            <ul className="flex flex-col px-6 py-4 gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 text-base font-medium text-charcoal-700 hover:text-wood-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="pt-2">
                <Link
                  href={`https://wa.me/${company.whatsapp.raw}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMenuOpen(false)}
                  className="block text-center rounded-full bg-wood-500 px-5 py-3 text-sm font-semibold text-white hover:bg-wood-600 transition-colors"
                >
                  Solicitar Orçamento
                </Link>
              </li>
              <li className="pt-2 text-center">
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-charcoal-400 hover:text-charcoal-600 transition-colors"
                >
                  <Lock size={14} />
                  Admin
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
