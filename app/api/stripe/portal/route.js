import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getSubscription } from "@/lib/data";
import { getStripe, stripeReady } from "@/lib/stripe";

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  if (!stripeReady()) {
    return NextResponse.json({ error: "Добавьте STRIPE_SECRET_KEY в .env.local" }, { status: 503 });
  }
  const sub = await getSubscription(user.id);
  if (!sub?.stripeCustomerId) {
    return NextResponse.json({ error: "Сначала оформите подписку" }, { status: 400 });
  }
  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const portal = await getStripe().billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${origin}/studio/billing`,
  });
  return NextResponse.json({ url: portal.url });
}
