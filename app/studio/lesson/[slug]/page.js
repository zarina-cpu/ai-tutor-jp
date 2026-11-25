import { notFound } from "next/navigation";
import { LessonQuizActions } from "@/components/lesson-quiz-actions";
import { Paywall } from "@/components/paywall";
import { requireUser } from "@/components/require-user";
import { getLesson } from "@/lib/curriculum";
import { getEntitlements, openLessonSlot } from "@/lib/data";

export default async function LessonPage({ params }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  const user = await requireUser();
  const opened = await openLessonSlot(user.id, slug);
  const entitlements = opened.entitlements || (await getEntitlements(user.id, lesson));

  if (opened.reason === "pro" || entitlements.stageLocked) {
    return (
      <Paywall
        title="Этот уровень в Pro"
        body={`${lesson.level} относится к продвинутому или экспертному этапу.`}
      />
    );
  }
  if (opened.reason === "lessons") {
    return (
      <Paywall
        title="Пять уроков на сегодня уже открыты"
        body="Повторите уже начатые уроки или оформите Pro. Сброс в полдень."
      />
    );
  }

  return (
    <main className="max-w-2xl space-y-8">
      <p className="font-display text-2xl text-[#D745A8]">{lesson.level}</p>
      <h1 className="font-script text-5xl">{lesson.title}</h1>
      <p>{lesson.summary}</p>
      <section>
        <h2 className="font-script text-3xl">Грамматика</h2>
        <p className="mt-2 text-sm leading-6">{lesson.grammar}</p>
      </section>
      <section>
        <h2 className="font-script text-3xl">Правописание</h2>
        <p className="mt-2 text-sm leading-6">{lesson.spelling}</p>
      </section>
      <section>
        <h2 className="font-script text-3xl">Квиз</h2>
        <div className="mt-3">
          <LessonQuizActions slug={lesson.slug} questions={lesson.quiz} />
        </div>
      </section>
    </main>
  );
}
