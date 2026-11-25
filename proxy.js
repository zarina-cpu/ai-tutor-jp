import { createNeonAuth } from "@neon/auth/next/server";

function neonAuthReady() {
  return Boolean(process.env.NEON_AUTH_BASE_URL && process.env.NEON_AUTH_COOKIE_SECRET);
}

export default async function proxy(request) {
  if (!neonAuthReady()) {
    return;
  }
  const auth = createNeonAuth({
    baseUrl: process.env.NEON_AUTH_BASE_URL,
    cookies: { secret: process.env.NEON_AUTH_COOKIE_SECRET },
  });
  return auth.middleware({
    loginUrl: "/login",
    publicRoutes: ["/", "/login", "/register", "/pricing", "/api/health", "/api/stripe"],
  })(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
