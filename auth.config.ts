import type { NextAuthConfig } from "next-auth";
import type { Role } from "@/lib/generated/prisma/enums";

// Config "leve", sem Prisma/bcrypt — usada pelo middleware (roda em Edge
// Runtime, não pode importar drivers de banco de dados Node-only). O
// provider de fato (Credentials + Prisma) é adicionado só em lib/auth.ts,
// que roda nas rotas de API (Node.js runtime).
export const authConfig = {
  // Necessário atrás de proxy reverso (Nginx): sem isso o Auth.js pode
  // rejeitar/perder a sessão em requisições POST (Server Actions) mesmo
  // com a sessão válida em GETs normais.
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
