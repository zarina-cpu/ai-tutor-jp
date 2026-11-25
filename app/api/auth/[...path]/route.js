import { neonAuthEnabled, neonAuthHandler } from "@/lib/auth/server";
import { NextResponse } from "next/server";

function bind(method) {
  return async (request, context) => {
    if (!neonAuthEnabled()) {
      return NextResponse.json(
        { error: "Neon Auth не настроен, используйте /login" },
        { status: 501 },
      );
    }
    const handler = await neonAuthHandler();
    return handler[method](request, context);
  };
}

export const GET = bind("GET");
export const POST = bind("POST");
export const PUT = bind("PUT");
export const PATCH = bind("PATCH");
export const DELETE = bind("DELETE");
