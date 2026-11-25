import Link from "next/link";
import { PracticeTimer } from "@/components/practice-timer";
import { requireUser } from "@/components/require-user";
import { FREE_DAILY_SECONDS } from "@/lib/config";
import { getEntitlements, listProgress } from "@/lib/data";
import { LESSONS } from "@/lib/curriculum";
import { nextResetIso } from "@/lib/academic-day";
import { Badge } from "@/components/ui/badge";

export default async function StudioPage() {
  const user = await requireUser();
  const entitlements = await getEntitlements(user.id);
  const progress = await listProgress(user.id);
  const next = LESSONS.find((lesson) => !progress.some((row) => row.lessonSlug === lesson.slug)) || LESSONS[0];

  return (
    <main className="space-y-8">
      <div>
        <h1 className="font-script text-5xl">Сегодня</h1>
        <p className="mt-2 text-sm">
          {user.name}. Учебный день {entitlements.academicDay}. Сброс Free в полдень ({nextResetIso()}).
        </p>
      </div>
      <PracticeTimer
        initialSecondsUsed={entitlements.secondsUsed}
        secondsLeft={entitlements.secondsLeft === Infinity ? 0 : entitlements.secondsLeft}
        pro={entitlements.pro}
        dailyLimit={FREE_DAILY_SECONDS}
      />
      <p className="text-sm">
        Уроки сегодня: {entitlements.pro ? "без лимита" : `${entitlements.lessonSlugs.length} / 5`}
      </p>
      <div className="flex flex-wrap gap-2">
        <Badge>{entitlements.pro ? "Pro" : "Free"}</Badge>
        <Badge>Начальный открыт</Badge>
        {entitlements.pro ? <Badge>N3–N1</Badge> : <Badge>N3–N1 за Pro</Badge>}
      </div>
      <Link href={`/studio/lesson/${next.slug}`} className="inline-block border-b border-[#00856E] pb-1">
        Следующий урок: {next.title}
      </Link>
    </main>
  );
}
