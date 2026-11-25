import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { openLessonSlot } from "@/lib/data";

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  const { slug } = await request.json();
  const result = await openLessonSlot(user.id, slug);
  if (!result.ok) {
    return NextResponse.json(result, { status: 403 });
  }
  return NextResponse.json(result);
}
