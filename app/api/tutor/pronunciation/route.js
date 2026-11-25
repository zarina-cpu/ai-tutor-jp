import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { addMistake, isProUser } from "@/lib/data";
import { geminiReady, reviewAudio } from "@/lib/gemini";
import { storageReady, uploadObject } from "@/lib/storage";

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  if (!(await isProUser(user.id))) {
    return NextResponse.json({ error: "Произношение — в Pro" }, { status: 403 });
  }
  if (!geminiReady()) {
    return NextResponse.json({ error: "Добавьте GEMINI_API_KEY в .env.local" }, { status: 503 });
  }
  const { base64, mimeType, task } = await request.json();
  let audioKey = null;
  if (storageReady() && base64) {
    const buffer = Buffer.from(base64, "base64");
    audioKey = `pronunciation/${user.id}/${Date.now()}.webm`;
    await uploadObject(audioKey, buffer, mimeType || "audio/webm");
  }
  const text = await reviewAudio({
    base64,
    mimeType,
    task: task || "Оцени произношение японской фразы. Укажи ошибки ритма и гласных по-русски.",
  });
  await addMistake(user.id, {
    source: "pronunciation",
    prompt: task || "произношение",
    answer: "(аудио)",
    correction: text,
    audioKey,
  });
  return NextResponse.json({ text, audioKey });
}
