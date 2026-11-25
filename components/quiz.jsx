"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Quiz({ questions, onFinished }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState(null);
  const question = questions[index];

  if (!question) {
    return (
      <div>
        <p>
          Квиз: {score} из {questions.length}
        </p>
      </div>
    );
  }

  function choose(optionIndex) {
    if (picked !== null) return;
    setPicked(optionIndex);
    const correct = optionIndex === question.answer;
    const nextScore = score + (correct ? 1 : 0);
    if (correct) setScore(nextScore);
    window.setTimeout(() => {
      const next = index + 1;
      if (next >= questions.length && onFinished) {
        onFinished(nextScore, questions.length);
      }
      setIndex(next);
      setPicked(null);
    }, 400);
  }

  return (
    <div className="space-y-3">
      <p>{question.prompt}</p>
      <div className="flex flex-col gap-2">
        {question.options.map((option, optionIndex) => (
          <Button
            key={option}
            variant={picked === optionIndex ? "stamp" : "outline"}
            onClick={() => choose(optionIndex)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
