import { AuthForm } from "@/components/auth-form";
import { neonAuthEnabled } from "@/lib/auth/server";

export default function RegisterPage() {
  const neon = neonAuthEnabled();
  return (
    <main className="px-6 py-10">
      <h1 className="font-script text-5xl">Регистрация</h1>
      <p className="mt-3 max-w-md text-sm leading-6">
        {neon
          ? "Аккаунт создаётся в Neon Auth."
          : "Без облака можно заниматься сразу: квота Free считается на этом устройстве."}
      </p>
      <div className="mt-8">
        <AuthForm mode="register" neon={neon} />
      </div>
    </main>
  );
}
