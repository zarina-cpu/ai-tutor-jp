import { AudioPractice } from "@/components/audio-practice";
import { Paywall } from "@/components/paywall";
import { requireUser } from "@/components/require-user";
import { getEntitlements } from "@/lib/data";

export default async function PronunciationPage() {
  const user = await requireUser();
  const entitlements = await getEntitlements(user.id);
  if (!entitlements.pro) {
    return <Paywall title="Произношение в Pro" body="Запись уходит в gemini-3.5-flash-lite. Модель отвечает текстом." />;
  }
  return (
    <main className="space-y-6">
      <h1 className="font-script text-5xl">Произношение</h1>
      <p className="max-w-xl text-sm leading-6">Прочитайте あいうえお, затем とうきょう.</p>
      <AudioPractice
        endpoint="/api/tutor/pronunciation"
        task="Проверь произношение слогов и долготы гласных."
      />
    </main>
  );
}
