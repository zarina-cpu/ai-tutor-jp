"use client";

import { Button } from "@/components/ui/button";

export function ListenButton({ text }) {
  function speak() {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <Button type="button" variant="outline" onClick={speak}>
      Прослушать ja-JP
    </Button>
  );
}
