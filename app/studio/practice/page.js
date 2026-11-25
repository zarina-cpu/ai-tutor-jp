import { Paywall } from "@/components/paywall";
import { PracticeTimer } from "@/components/practice-timer";
import { TutorChat } from "@/components/tutor-chat";
import { requireUser } from "@/components/require-user";
import { FREE_DAILY_SECONDS } from "@/lib/config";
import { getEntitlements } from "@/lib/data";

export default async function PracticePage() {
  const user = await requireUser();
  const entitlements = await getEntitlements(user.id);
  if (!entitlements.canPractice) {
    return <Paywall title="Минуты на сегодня кончились" body="Free даёт 10 минут до полудня. Pro снимает лимит." />;
  }

  return (
    <main className="space-y-6">
      <h1 className="font-script text-5xl">Репетитор</h1>
      <PracticeTimer
        initialSecondsUsed={entitlements.secondsUsed}
        secondsLeft={entitlements.secondsLeft === Infinity ? 0 : entitlements.secondsLeft}
        pro={entitlements.pro}
        dailyLimit={FREE_DAILY_SECONDS}
      />
      <TutorChat level="N5" />
    </main>
  );
}
