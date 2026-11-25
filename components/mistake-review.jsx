"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function MistakeReview() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  async function run() {
    setError("");
    const response = await fetch("/api/tutor/mistakes", { method: "POST" });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Не удалось разобрать");
      return;
    }
    setText(data.text);
  }

  return (
    <div className="space-y-3">
      <Button type="button" onClick={run}>
        Разобрать ошибки
      </Button>
      {error ? <p className="text-sm text-[#D745A8]">{error}</p> : null}
      {text ? <p className="max-w-2xl text-sm leading-6 whitespace-pre-wrap">{text}</p> : null}
    </div>
  );
}
