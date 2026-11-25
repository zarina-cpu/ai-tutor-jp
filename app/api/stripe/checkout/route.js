import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth/server";
import { getSubscription, upsertSubscription } from "@/lib/data";
import { getStripe, priceForInterval, stripeReady } from "@/lib/stripe";

export async function POST(request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Нужен вход" }, { status: 401 });
  if (!stripeReady()) {
    return NextResponse.json(
      { error: "Добавьте STRIPE_SECRET_KEY и price id в .env.local" },
      { status: 503 },
    );
  }
  const { interval } = await request.json();
  const price = priceForInterval(interval);
  const stripe = getStripe();
  const existing = await getSubscription(user.id);
  let customerId = existing?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { userId: user.id },
    });
    customerId = customer.id;
    await upsertSubscription(user.id, { stripeCustomerId: customerId, status: "free" });
  }
  const origin = request.headers.get("origin") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const sessionConfig = {
    mode: "subscription",
    customer: customerId,
    success_url: `${origin}/studio/billing?ok=1`,
    cancel_url: `${origin}/pricing`,
    metadata: { userId: user.id },
  };
  if (price.priceId) {
    sessionConfig.line_items = [{ price: price.priceId, quantity: 1 }];
  } else {
    sessionConfig.line_items = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          recurring: { interval: interval === "year" ? "year" : "month" },
          unit_amount: price.amountUsd * 100,
          product_data: { name: "Ироха Pro" },
        },
      },
    ];
  }
  const session = await stripe.checkout.sessions.create(sessionConfig);
  return NextResponse.json({ url: session.url });
}
