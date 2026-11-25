import Link from "next/link";

const LINKS = [
  ["Сегодня", "/studio"],
  ["Путь", "/studio/path"],
  ["Кана", "/studio/kana"],
  ["Кандзи", "/studio/kanji"],
  ["Репетитор", "/studio/practice"],
  ["Произношение", "/studio/pronunciation"],
  ["Speaking", "/studio/speaking"],
  ["Listening", "/studio/listening"],
  ["Ошибки", "/studio/mistakes"],
  ["Оплата", "/studio/billing"],
];

export function StudioNav() {
  return (
    <nav className="flex flex-col gap-2 text-sm">
      {LINKS.map(([label, href]) => (
        <Link key={href} href={href} className="border-l-2 border-transparent pl-3 hover:border-[#D745A8] hover:text-[#00856E]">
          {label}
        </Link>
      ))}
    </nav>
  );
}
