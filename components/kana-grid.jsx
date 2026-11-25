export function KanaGrid({ items, title }) {
  return (
    <section>
      <h2 className="font-script text-3xl">{title}</h2>
      <div className="mt-4 grid grid-cols-5 gap-px bg-[#0D3837]/20 dark:bg-[#FDB4E5]/20">
        {items.map((item) => (
          <div key={item.glyph} className="bg-[#F8F1F5] p-3 dark:bg-[#0D3837]">
            <p className="text-2xl">{item.glyph}</p>
            <p className="font-display text-lg text-[#D745A8]">{item.romaji}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
