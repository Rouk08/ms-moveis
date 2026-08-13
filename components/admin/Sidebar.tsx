"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Wallet,
  IdCard,
  Mail,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { logoutAction } from "@/lib/actions/auth";
import type { Role } from "@/lib/generated/prisma/enums";

type SidebarProps = {
  userName: string;
  userRole: Role;
};

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/orcamentos", label: "Orçamentos", icon: FileText },
  { href: "/admin/financeiro", label: "Financeiro", icon: Wallet },
  { href: "/admin/rh", label: "RH", icon: IdCard, adminOnly: true },
  { href: "/admin/email", label: "E-mail", icon: Mail },
  {
    href: "/admin/usuarios",
    label: "Usuários",
    icon: Users,
    adminOnly: true,
  },
];

export default function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const visibleItems = navItems.filter(
    (item) => !item.adminOnly || userRole === "ADMIN"
  );

  return (
    <>
      <header className="flex items-center justify-between border-b border-charcoal-100 bg-white px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Image
            src="/logo.jpg"
            alt="MS Móveis"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <p className="font-heading font-semibold text-charcoal-800">
            MS Móveis
          </p>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={mobileOpen}
          className="text-charcoal-700"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-charcoal-900/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-charcoal-100 bg-white transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hidden items-center gap-2 border-b border-charcoal-100 px-6 py-5 lg:flex">
          <Image
            src="/logo.jpg"
            alt="MS Móveis"
            width={36}
            height={36}
            className="h-9 w-9 rounded-full object-cover"
          />
          <div>
            <p className="font-heading font-semibold text-charcoal-800 leading-tight">
              MS Móveis
            </p>
            <p className="text-xs text-charcoal-400">Painel Admin</p>
          </div>
        </div>

        <div className="px-3 pt-3">
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-charcoal-400 hover:bg-charcoal-50 hover:text-charcoal-600 transition-colors"
          >
            <ExternalLink size={14} />
            Ver site
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-wood-50 text-wood-700"
                    : "text-charcoal-600 hover:bg-charcoal-50"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-charcoal-100 p-4">
          <p className="px-2 text-sm font-medium text-charcoal-700 truncate">
            {userName}
          </p>
          <p className="px-2 text-xs text-charcoal-400 mb-3">
            {userRole === "ADMIN" ? "Administrador" : "Equipe"}
          </p>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium text-charcoal-500 hover:bg-charcoal-50 hover:text-charcoal-700 transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
