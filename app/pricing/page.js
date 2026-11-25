import { PricingToggle } from "@/components/pricing-toggle";

export default function PricingPage() {
  return (
    <main className="px-6 py-10">
      <h1 className="font-script text-5xl">Тарифы</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <article className="border border-[#0D3837]/20 p-6 dark:border-[#FDB4E5]/20">
          <h2 className="font-script text-3xl">Free</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6">
            <li>10 минут практики в день, сброс в полдень</li>
            <li>5 новых уроков за учебный день</li>
            <li>Начальный этап: N5 и N4</li>
            <li>Хирагана, катакана, квизы, грамматика, правописание</li>
          </ul>
        </article>
        <article className="border border-[#D745A8] p-6">
          <h2 className="font-script text-3xl">Pro</h2>
          <ul className="mt-4 space-y-2 text-sm leading-6">
            <li>Без лимита времени и уроков</li>
            <li>Произношение, speaking, listening</li>
            <li>Кандзи и разбор ошибок</li>
            <li>Продвинутый N3–N2 и эксперт N1</li>
          </ul>
          <div className="mt-6">
            <PricingToggle />
          </div>
        </article>
      </div>
    </main>
  );
}
