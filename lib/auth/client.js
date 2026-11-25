"use client";

export function createAuthClient() {
  return {
    async signInEmail({ email, password, name, mode }) {
      const response = await fetch(
        mode === "register" ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        },
      );
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Не удалось войти");
      }
      return payload;
    },
    async signOut() {
      await fetch("/api/auth/logout", { method: "POST" });
    },
  };
}
