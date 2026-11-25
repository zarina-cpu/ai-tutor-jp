"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/session")
      .then((response) => response.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <header className="notebook-rule flex items-center justify-between gap-4 px-6 py-4">
      <Link href="/" className="flex items-baseline gap-3">
        <span className="font-display text-3xl text-[#D745A8]">Iroha</span>
        <span className="font-script text-2xl">Ироха</span>
      </Link>
      <nav className="flex flex-wrap items-center gap-3 text-sm">
        <Link href="/pricing" className="hover:text-[#00856E]">
          Тарифы
        </Link>
        {user ? (
          <>
            <Link href="/studio" className="hover:text-[#00856E]">
              Студия
            </Link>
            <form action="/api/auth/logout" method="post">
              <button type="submit" className="hover:text-[#00856E]">
                Выйти
              </button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login">Вход</Link>
            <Link href="/register">Регистрация</Link>
          </>
        )}
        <ThemeToggle />
      </nav>
    </header>
  );
}
