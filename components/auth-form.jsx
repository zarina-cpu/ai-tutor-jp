"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAuthClient } from "@/lib/auth/client";

export function AuthForm({ mode, neon = false }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const name = String(form.get("name") || "");
    try {
      if (neon) {
        const { createAuthClient: createNeon } = await import("@neon/auth/next");
        const client = createNeon();
        const result =
          mode === "register"
            ? await client.signUp.email({ email, password, name, callbackURL: "/studio" })
            : await client.signIn.email({ email, password, callbackURL: "/studio" });
        if (result.error) throw new Error(result.error.message || "Не удалось войти");
        if (result.data?.redirect) return;
      } else {
        await createAuthClient().signInEmail({ email, password, name, mode });
      }
      router.push("/studio");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex max-w-sm flex-col gap-4">
      {mode === "register" ? (
        <div className="space-y-1">
          <Label htmlFor="name">Имя</Label>
          <Input id="name" name="name" required />
        </div>
      ) : null}
      <div className="space-y-1">
        <Label htmlFor="email">Почта</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="password">Пароль</Label>
        <Input id="password" name="password" type="password" minLength={6} required />
      </div>
      {error ? <p className="text-sm text-[#D745A8]">{error}</p> : null}
      <Button type="submit" disabled={pending}>
        {mode === "register" ? "Создать тетрадь" : "Войти"}
      </Button>
    </form>
  );
}
