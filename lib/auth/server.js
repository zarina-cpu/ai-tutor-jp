import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { hashPassword, verifyPassword } from "./password";
import { readStore, withStore } from "../local-store";

export function neonAuthEnabled() {
  return Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET);
}

let neonAuth;

export async function getNeonAuth() {
  if (!neonAuthEnabled()) return null;
  if (!neonAuth) {
    const { createNeonAuth } = await import("@neon/auth/next/server");
    neonAuth = createNeonAuth({
      baseUrl: process.env.NEON_AUTH_BASE_URL,
      cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET },
    });
  }
  return neonAuth;
}

export async function neonAuthHandler() {
  const auth = await getNeonAuth();
  if (!auth) {
    return null;
  }
  return auth.handler();
}

export async function getSessionUser() {
  const auth = await getNeonAuth();
  if (auth) {
    const { data: session } = await auth.getSession();
    if (!session?.user) return null;
    return {
      id: session.user.id,
      email: session.user.email || "",
      name: session.user.name || session.user.email || "ученик",
    };
  }

  const jar = await cookies();
  const token = jar.get("iroha_session")?.value;
  if (!token) return null;
  const store = await readStore();
  const session = store.sessions.find((item) => item.token === token);
  if (!session) return null;
  const user = store.users.find((item) => item.id === session.userId);
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name };
}

export async function registerLocalUser({ email, password, name }) {
  return withStore(async (store) => {
    if (store.users.some((user) => user.email === email)) {
      throw new Error("Этот адрес уже занят");
    }
    const user = {
      id: randomUUID(),
      email,
      name: name || email.split("@")[0],
      passwordHash: await hashPassword(password),
    };
    store.users.push(user);
    const token = randomUUID();
    store.sessions.push({ token, userId: user.id });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  });
}

export async function loginLocalUser({ email, password }) {
  return withStore(async (store) => {
    const user = store.users.find((item) => item.email === email);
    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      throw new Error("Неверная почта или пароль");
    }
    const token = randomUUID();
    store.sessions.push({ token, userId: user.id });
    return { token, user: { id: user.id, email: user.email, name: user.name } };
  });
}

export async function signOutUser() {
  const auth = await getNeonAuth();
  if (auth?.signOut) {
    await auth.signOut();
  }
  await clearLocalSession();
}

export async function clearLocalSession() {
  const jar = await cookies();
  const token = jar.get("iroha_session")?.value;
  if (token) {
    await withStore(async (store) => {
      store.sessions = store.sessions.filter((item) => item.token !== token);
    });
  }
  jar.delete("iroha_session");
}

export const sessionCookie = {
  name: "iroha_session",
  options: {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  },
};
