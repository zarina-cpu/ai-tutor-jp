import { AudioPractice } from "@/components/audio-practice";
import { Paywall } from "@/components/paywall";
import { requireUser } from "@/components/require-user";
import { getEntitlements } from "@/lib/data";

export default async function SpeakingPage() {
  const user = await requireUser();
  const entitlements = await getEntitlements(user.id);
  if (!entitlements.pro) {
    return <Paywall title="Speaking в Pro" body="Скажите фразу в микрофон — Ироха разберёт её по-русски." />;
  }
  return (
    <main className="space-y-6">
      <h1 className="font-script text-5xl">Speaking</h1>
      <p className="max-w-xl text-sm leading-6">Скажите: コーヒーをください.</p>
      <AudioPractice
        endpoint="/api/tutor/pronunciation"
        task="Ученик говорит японскую фразу. Оцени fluency и грамматику по-русски."
      />
    </main>
  );
}
