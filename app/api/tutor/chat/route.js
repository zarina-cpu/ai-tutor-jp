import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getEntitlements } from "@/lib/data";
import { geminiReady, tutorChat } from "@/lib/gemini";

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  const entitlements = await getEntitlements(user.id);
  if (!entitlements.canPractice) {
    return NextResponse.json({ error: "Дневные 10 минут закончились. Pro снимает лимит." }, { status: 403 });
  }
  if (!geminiReady()) {
    return NextResponse.json({ error: "Добавьте GEMINI_API_KEY в .env.local" }, { status: 503 });
  }
  const { messages, level } = await request.json();
  const text = await tutorChat({ messages, level: level || "N5", pro: entitlements.pro });
  return NextResponse.json({ text });
}
