"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Wallet,
  Mail,
  LogOut,
  Sofa,
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
  {
    href: "/admin/usuarios",
    label: "Usuários",
    icon: Users,
    adminOnly: true,
  },
];

const comingSoonItems = [{ label: "E-mail", icon: Mail }];

export default function Sidebar({ userName, userRole }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-charcoal-100 bg-white">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-charcoal-100">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-wood-500 text-white">
          <Sofa size={18} />
        </span>
        <div>
          <p className="font-heading font-semibold text-charcoal-800 leading-tight">
            MS Móveis
          </p>
          <p className="text-xs text-charcoal-400">Painel Admin</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems
          .filter((item) => !item.adminOnly || userRole === "ADMIN")
          .map((item) => {
            const Icon = item.icon;
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
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

        <div className="pt-2">
          {comingSoonItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-charcoal-300 cursor-not-allowed"
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} />
                  {item.label}
                </span>
                <span className="text-[10px] uppercase tracking-wide bg-charcoal-100 text-charcoal-400 rounded-full px-2 py-0.5">
                  Em breve
                </span>
              </div>
            );
          })}
        </div>
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
  );
}
