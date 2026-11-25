import { MistakeReview } from "@/components/mistake-review";
import { Paywall } from "@/components/paywall";
import { requireUser } from "@/components/require-user";
import { getEntitlements, listMistakes } from "@/lib/data";

export default async function MistakesPage() {
  const user = await requireUser();
  const entitlements = await getEntitlements(user.id);
  if (!entitlements.pro) {
    return <Paywall title="Разбор ошибок в Pro" body="Ироха соберёт квизы и речь в короткий план исправления." />;
  }
  const items = await listMistakes(user.id);
  return (
    <main className="space-y-6">
      <h1 className="font-script text-5xl">Ошибки</h1>
      <MistakeReview />
      <ul className="space-y-3 text-sm">
        {items.map((item) => (
          <li key={item.id} className="border-b border-[#0D3837]/20 py-2 dark:border-[#FDB4E5]/20">
            <p>{item.prompt}</p>
            <p className="text-[#00856E]">{item.answer}</p>
            {item.correction ? <p>{item.correction}</p> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
