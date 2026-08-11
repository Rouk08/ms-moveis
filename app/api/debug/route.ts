import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

async function handler() {
  const session = await auth();
  return NextResponse.json({ session });
}

export const GET = handler;
export const POST = handler;
