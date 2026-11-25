import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { addPracticeSeconds } from "@/lib/data";

export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  const entitlements = await addPracticeSeconds(user.id, 10);
  return NextResponse.json(entitlements);
}
