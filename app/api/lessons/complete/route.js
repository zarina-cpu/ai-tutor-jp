import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { addMistake, saveProgress } from "@/lib/data";

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  const { slug, score, total } = await request.json();
  await saveProgress(user.id, slug, score);
  if (score < total) {
    await addMistake(user.id, {
      source: "quiz",
      prompt: slug,
      answer: `${score}/${total}`,
      correction: "Повторите квиз урока",
    });
  }
  return NextResponse.json({ ok: true });
}
