"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isChromeless = pathname?.startsWith("/admin") || pathname?.startsWith("/ponto");

  if (isChromeless) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
