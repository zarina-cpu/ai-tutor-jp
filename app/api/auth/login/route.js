import { NextResponse } from "next/server";
import { loginLocalUser, neonAuthEnabled, sessionCookie } from "@/lib/auth/server";

export async function POST(request) {
  if (neonAuthEnabled()) {
    return NextResponse.json({ error: "Вход идёт через Neon Auth" }, { status: 400 });
  }
  const body = await request.json();
  try {
    const { token, user } = await loginLocalUser(body);
    const response = NextResponse.json({ user });
    response.cookies.set(sessionCookie.name, token, sessionCookie.options);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
