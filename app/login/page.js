import { AuthForm } from "@/components/auth-form";
import { neonAuthEnabled } from "@/lib/auth/server";

export default function LoginPage() {
  const neon = neonAuthEnabled();
  return (
    <main className="px-6 py-10">
      <h1 className="font-script text-5xl">Вход</h1>
      <p className="mt-3 max-w-md text-sm leading-6">
        {neon
          ? "Сессия через Neon Auth. Если форма ниже не сработает, проверьте NEON_AUTH_BASE_URL."
          : "Локальная тетрадь: почта и пароль хранятся на этом компьютере, пока не подключён Neon Auth."}
      </p>
      <div className="mt-8">
        <AuthForm mode="login" neon={neon} />
      </div>
    </main>
  );
}
