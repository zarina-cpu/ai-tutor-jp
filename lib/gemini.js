import { GoogleGenAI } from "@google/genai";
import { GEMINI_MODEL } from "./config";

export function geminiReady() {
  return Boolean(process.env.GEMINI_API_KEY);
}

function client() {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
}

const TUTOR_SYSTEM = `Ты — Ироха, персональный репетитор японского языка.
Объясняй по-русски. Примеры давай по-японски с фуриганой или ромадзи в скобках.
Держись уровня ученика (N5–N1).
Если тариф Free, не уходи в кандзи, speaking и разбор произношения: мягко предложи Pro.
Будь конкретным, без воды. Исправляй ошибки прямо.`;

export async function tutorChat({ messages, level, pro }) {
  if (!geminiReady()) {
    throw new Error("Нет GEMINI_API_KEY");
  }
  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: message.content }],
  }));
  const response = await client().models.generateContent({
    model: GEMINI_MODEL,
    contents,
    config: {
      systemInstruction: `${TUTOR_SYSTEM}\nУровень: ${level}. Тариф: ${pro ? "Pro" : "Free"}.`,
      thinkingConfig: { thinkingLevel: "low" },
    },
  });
  return response.text || "";
}

export async function gradeAnswer({ prompt, answer, expected }) {
  if (!geminiReady()) {
    const ok = answer.trim() === expected.trim();
    return {
      correct: ok,
      comment: ok ? "Верно." : `Ожидалось: ${expected}`,
    };
  }
  const response = await client().models.generateContent({
    model: GEMINI_MODEL,
    contents: `Задание: ${prompt}\nОтвет ученика: ${answer}\nЭталон: ${expected}\nВерни JSON {"correct":boolean,"comment":"по-русски"}`,
    config: {
      systemInstruction: TUTOR_SYSTEM,
      thinkingConfig: { thinkingLevel: "minimal" },
      responseMimeType: "application/json",
    },
  });
  try {
    return JSON.parse(response.text || "{}");
  } catch {
    return { correct: false, comment: response.text || "Не разобрала ответ." };
  }
}

export async function reviewAudio({ base64, mimeType, task }) {
  if (!geminiReady()) {
    throw new Error("Нет GEMINI_API_KEY");
  }
  const response = await client().models.generateContent({
    model: GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          { text: task },
          { inlineData: { mimeType: mimeType || "audio/webm", data: base64 } },
        ],
      },
    ],
    config: {
      systemInstruction: TUTOR_SYSTEM,
      thinkingConfig: { thinkingLevel: "low" },
    },
  });
  return response.text || "";
}

export async function explainMistakes(items) {
  if (!geminiReady()) {
    throw new Error("Нет GEMINI_API_KEY");
  }
  const response = await client().models.generateContent({
    model: GEMINI_MODEL,
    contents: `Разбери ошибки ученика и дай короткий план исправления:\n${JSON.stringify(items)}`,
    config: {
      systemInstruction: TUTOR_SYSTEM,
      thinkingConfig: { thinkingLevel: "low" },
    },
  });
  return response.text || "";
}
