import { Paywall } from "@/components/paywall";
import { requireUser } from "@/components/require-user";
import { KANJI_BY_LEVEL } from "@/lib/curriculum";
import { getEntitlements } from "@/lib/data";

export default async function KanjiPage() {
  const user = await requireUser();
  const entitlements = await getEntitlements(user.id);
  if (!entitlements.pro) {
    return <Paywall title="Кандзи в Pro" body="Наборы знаков по N5–N1 открываются вместе с безлимитным временем." />;
  }

  return (
    <main className="space-y-8">
      <h1 className="font-script text-5xl">Кандзи</h1>
      {Object.entries(KANJI_BY_LEVEL).map(([level, items]) => (
        <section key={level}>
          <h2 className="font-display text-2xl text-[#D745A8]">{level}</h2>
          <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
            {items.map((item) => (
              <div key={item.glyph} className="border border-[#0D3837]/20 p-3 dark:border-[#FDB4E5]/20">
                <p className="text-3xl">{item.glyph}</p>
                <p className="text-xs leading-5">{item.meaning}</p>
                <p className="text-xs">он {item.on} · кун {item.kun}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
