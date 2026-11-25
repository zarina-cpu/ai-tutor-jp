"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function AudioPractice({ endpoint, task }) {
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [recording, setRecording] = useState(false);

  async function record() {
    setError("");
    setNote("");
    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Нужен микрофон.");
      return;
    }
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = (event) => chunks.push(event.data);
    setRecording(true);
    recorder.start();
    await new Promise((resolve) => window.setTimeout(resolve, 4000));
    recorder.stop();
    await new Promise((resolve) => {
      recorder.onstop = resolve;
    });
    stream.getTracks().forEach((track) => track.stop());
    setRecording(false);
    const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
    const bytes = new Uint8Array(await blob.arrayBuffer());
    let binary = "";
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const base64 = btoa(binary);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ base64, mimeType: blob.type, task }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Не удалось разобрать запись");
      return;
    }
    setNote(data.text);
  }

  return (
    <div className="space-y-3">
      <Button type="button" onClick={record} disabled={recording}>
        {recording ? "Записываю 4 секунды…" : "Записать голос"}
      </Button>
      {error ? <p className="text-sm text-[#D745A8]">{error}</p> : null}
      {note ? <p className="max-w-2xl text-sm leading-6">{note}</p> : null}
    </div>
  );
}
