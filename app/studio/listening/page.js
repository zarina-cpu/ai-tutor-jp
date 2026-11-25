import { ListenButton } from "@/components/listen-button";
import { Paywall } from "@/components/paywall";
import { requireUser } from "@/components/require-user";
import { LESSONS } from "@/lib/curriculum";
import { getEntitlements } from "@/lib/data";

export default async function ListeningPage() {
  const user = await requireUser();
  const entitlements = await getEntitlements(user.id);
  if (!entitlements.pro) {
    return (
      <Paywall
        title="Listening в Pro"
        body="Фразы читает голос браузера ja-JP: модель не синтезирует звук."
      />
    );
  }
  return (
    <main className="space-y-6">
      <h1 className="font-script text-5xl">Listening</h1>
      <ul className="space-y-4">
        {LESSONS.slice(0, 8).map((lesson) => (
          <li key={lesson.slug} className="flex items-center justify-between gap-4 border-b border-[#0D3837]/20 py-3 dark:border-[#FDB4E5]/20">
            <span>{lesson.listening}</span>
            <ListenButton text={lesson.listening} />
          </li>
        ))}
      </ul>
    </main>
  );
}
