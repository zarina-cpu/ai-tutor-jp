"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TutorChat({ level }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Я Ироха. Напишите фразу, вопрос по грамматике или слово для разбора.",
    },
  ]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function send(event) {
    event.preventDefault();
    if (!text.trim()) return;
    const next = [...messages, { role: "user", content: text.trim() }];
    setMessages(next);
    setText("");
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, level }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Репетитор молчит");
      setMessages([...next, { role: "assistant", content: data.text }]);
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {messages.map((message, index) => (
          <p key={index} className={message.role === "assistant" ? "max-w-2xl" : "max-w-2xl text-[#00856E]"}>
            {message.content}
          </p>
        ))}
      </div>
      {error ? <p className="text-sm text-[#D745A8]">{error}</p> : null}
      <form onSubmit={send} className="flex gap-2">
        <Input value={text} onChange={(event) => setText(event.target.value)} placeholder="Спросите Ироху" />
        <Button type="submit" disabled={pending}>
          Отправить
        </Button>
      </form>
    </div>
  );
}
