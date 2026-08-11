import type { Metadata } from "next";
import { Sofa } from "lucide-react";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Login | Painel Admin",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-charcoal-50/40 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-charcoal-100 bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-wood-500 text-white">
            <Sofa size={20} />
          </span>
          <h1 className="mt-4 text-xl font-semibold text-charcoal-800">
            Painel Admin
          </h1>
          <p className="mt-1 text-sm text-charcoal-500">
            MS Móveis Sob Medida
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
