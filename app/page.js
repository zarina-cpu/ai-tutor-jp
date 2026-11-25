import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HIRAGANA } from "@/lib/curriculum";

export default function HomePage() {
  return (
    <main className="px-6 py-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <div>
          <p className="kana-hero">あ</p>
          <h1 className="mt-6 max-w-xl font-script text-5xl leading-tight">Тетрадь японского с живым репетитором</h1>
          <p className="mt-4 max-w-lg text-sm leading-7">
            Ироха ведёт от хираганы и катаканы через грамматику N5–N4. Pro открывает кандзи, речь, слух и уровни N3–N1.
            Бесплатные десять минут и пять уроков обновляются каждый день в полдень.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/register">Начать с азбуки</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/pricing">Сравнить тарифы</Link>
            </Button>
          </div>
        </div>
        <aside className="self-start border-l border-[#0D3837]/30 pl-4 dark:border-[#FDB4E5]/30">
          <p className="font-display text-2xl text-[#D745A8]">Iroha</p>
          <p className="mt-2 text-xs leading-5">N5 → N4 → N3 → N2 → N1</p>
        </aside>
      </div>
      <section className="mt-16">
        <h2 className="font-script text-3xl">Первые знаки</h2>
        <div className="mt-4 flex flex-wrap gap-6">
          {HIRAGANA.slice(0, 5).map((item) => (
            <div key={item.glyph}>
              <p className="text-4xl">{item.glyph}</p>
              <p className="font-display text-xl text-[#00856E]">{item.romaji}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
