import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { isProUser, listMistakes } from "@/lib/data";
import { explainMistakes, geminiReady } from "@/lib/gemini";

export async function POST() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  if (!(await isProUser(user.id))) {
    return NextResponse.json({ error: "Разбор ошибок — в Pro" }, { status: 403 });
  }
  if (!geminiReady()) {
    return NextResponse.json({ error: "Добавьте GEMINI_API_KEY в .env.local" }, { status: 503 });
  }
  const items = await listMistakes(user.id);
  const text = await explainMistakes(items.slice(-12));
  return NextResponse.json({ text });
}
