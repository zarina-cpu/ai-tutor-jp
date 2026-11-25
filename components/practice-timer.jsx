"use client";

import { useEffect, useState } from "react";
import { formatMinutes } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export function PracticeTimer({ initialSecondsUsed, secondsLeft, pro, dailyLimit }) {
  const [used, setUsed] = useState(initialSecondsUsed);
  const [left, setLeft] = useState(secondsLeft);

  useEffect(() => {
    if (pro) return undefined;
    if (left <= 0) return undefined;
    const id = window.setInterval(async () => {
      const response = await fetch("/api/practice/heartbeat", { method: "POST" });
      const data = await response.json();
      setUsed(data.secondsUsed);
      setLeft(data.secondsLeft);
    }, 10000);
    return () => window.clearInterval(id);
  }, [pro, left]);

  if (pro) {
    return <p className="text-sm">Pro: время не ограничено.</p>;
  }

  const value = Math.min(100, (used / dailyLimit) * 100);
  return (
    <div className="space-y-2">
      <p className="text-sm">
        Сегодня {formatMinutes(used)} из {formatMinutes(dailyLimit)}. До полудня осталось{" "}
        {formatMinutes(Number.isFinite(left) ? left : 0)}.
      </p>
      <Progress value={value} />
    </div>
  );
}
