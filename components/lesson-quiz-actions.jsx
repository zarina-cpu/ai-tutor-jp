"use client";

import { Quiz } from "@/components/quiz";

export function LessonQuizActions({ slug, questions }) {
  async function onFinished(score, total) {
    await fetch("/api/lessons/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, score, total }),
    });
  }

  return <Quiz questions={questions} onFinished={onFinished} />;
}
