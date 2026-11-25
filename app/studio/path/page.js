import Link from "next/link";
import { requireUser } from "@/components/require-user";
import { LESSONS, STAGES, lessonsForLevel } from "@/lib/curriculum";
import { getEntitlements } from "@/lib/data";

export default async function PathPage() {
  const user = await requireUser();
  const entitlements = await getEntitlements(user.id);

  return (
    <main>
      <h1 className="font-script text-5xl">Путь N5–N1</h1>
      <div className="mt-8 border-l-2 border-[#00856E] pl-6">
        {STAGES.map((stage) => (
          <section key={stage.id} className="mb-10">
            <h2 className="font-script text-3xl">
              {stage.title}
              {stage.requiresPro && !entitlements.pro ? " · Pro" : ""}
            </h2>
            {stage.levels.map((level) => (
              <div key={level} className="mt-4">
                <h3 className="font-display text-2xl text-[#D745A8]">{level}</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  {lessonsForLevel(level).map((lesson) => (
                    <li key={lesson.slug}>
                      <Link href={`/studio/lesson/${lesson.slug}`} className="hover:text-[#00856E]">
                        {lesson.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>
      <p className="sr-only">{LESSONS.length} уроков</p>
    </main>
  );
}
