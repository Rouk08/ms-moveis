import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  try {
    const fs = await import("node:fs");
    fs.appendFileSync(
      "/tmp/layout-debug.log",
      `${new Date().toISOString()} session=${JSON.stringify(session)}\n`
    );
  } catch {}

  if (!session?.user) redirect("/admin/login");
  const user = session.user;

  return (
    <div className="flex min-h-screen bg-charcoal-50/30">
      <Sidebar
        userName={user?.name ?? user?.email ?? "Usuário"}
        userRole={user?.role ?? "MEMBER"}
      />
      <main className="flex-1 overflow-y-auto p-6 sm:p-8">{children}</main>
    </div>
  );
}
