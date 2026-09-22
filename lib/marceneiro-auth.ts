import { createHmac } from "crypto";

// Acesso simples, de dispositivo compartilhado (oficina), pro
// marceneiro acompanhar/marcar etapas de produção — não é login
// individual como o admin. Cookie assinado com o mesmo AUTH_SECRET já
// usado pelo Auth.js, então não precisa de tabela de sessão própria.
export const MARCENEIRO_COOKIE = "marceneiro_auth";

export function tokenMarceneiroEsperado(): string {
  const secret = process.env.AUTH_SECRET ?? "";
  return createHmac("sha256", secret).update("marceneiro").digest("hex");
}

export function validarPinMarceneiro(pin: string): boolean {
  const pinCorreto = process.env.MARCENEIRO_PIN ?? "";
  return pinCorreto.length > 0 && pin === pinCorreto;
}
