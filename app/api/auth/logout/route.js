import { NextResponse } from "next/server";
import { signOutUser } from "@/lib/auth/server";

export async function POST(request) {
  await signOutUser();
  const accept = request.headers.get("accept") || "";
  const response = accept.includes("text/html")
    ? NextResponse.redirect(new URL("/", request.url), 303)
    : NextResponse.json({ ok: true });
  response.cookies.delete("iroha_session");
  return response;
}
