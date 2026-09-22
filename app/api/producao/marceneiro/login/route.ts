import { NextResponse } from "next/server";
import {
  MARCENEIRO_COOKIE,
  tokenMarceneiroEsperado,
  validarPinMarceneiro,
} from "@/lib/marceneiro-auth";

export async function POST(request: Request) {
  const body = await request.json();
  const pin = String(body.pin ?? "").trim();

  if (!validarPinMarceneiro(pin)) {
    return NextResponse.json({ error: "Código incorreto." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(MARCENEIRO_COOKIE, tokenMarceneiroEsperado(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 90,
    path: "/",
  });
  return response;
}
