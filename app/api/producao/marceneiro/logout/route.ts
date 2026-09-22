import { NextResponse } from "next/server";
import { MARCENEIRO_COOKIE } from "@/lib/marceneiro-auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(MARCENEIRO_COOKIE);
  return response;
}
