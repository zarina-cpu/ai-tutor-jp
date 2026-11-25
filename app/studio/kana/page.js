import { KanaGrid } from "@/components/kana-grid";
import { HIRAGANA, KATAKANA } from "@/lib/curriculum";

export default function KanaPage() {
  return (
    <main className="space-y-12">
      <h1 className="font-script text-5xl">Азбука</h1>
      <p className="max-w-xl text-sm leading-6">
        Таблица годзюон не тратит минуты практики. Тренажёр в уроках N5 уже считает квоту.
      </p>
      <KanaGrid title="Хирагана" items={HIRAGANA} />
      <KanaGrid title="Катакана" items={KATAKANA} />
    </main>
  );
}
