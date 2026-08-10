"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { company } from "@/lib/data";

export default function WhatsAppButton() {
  const message = encodeURIComponent(
    "Olá! Vim pelo site da MS Móveis Sob Medida e gostaria de solicitar um orçamento."
  );

  return (
    <motion.a
      href={`https://wa.me/${company.whatsapp.raw}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20"
    >
      <MessageCircle size={28} fill="white" className="text-[#25D366]" />
    </motion.a>
  );
}
