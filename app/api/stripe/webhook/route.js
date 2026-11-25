import { NextResponse } from "next/server";
import { findUserIdByCustomer, upsertSubscription } from "@/lib/data";
import { getStripe, stripeReady } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request) {
  if (!stripeReady() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook не настроен" }, { status: 503 });
  }
  const stripe = getStripe();
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  async function applySubscription(subscription, userId) {
    if (!userId) return;
    const item = subscription.items?.data?.[0];
    await upsertSubscription(userId, {
      stripeCustomerId: String(subscription.customer),
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      interval: item?.plan?.interval || item?.price?.recurring?.interval || "month",
      currentPeriodEnd: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000)
        : null,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    if (session.subscription) {
      const subscription = await stripe.subscriptions.retrieve(session.subscription);
      await applySubscription(subscription, userId);
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object;
    const userId =
      subscription.metadata?.userId || (await findUserIdByCustomer(String(subscription.customer)));
    await applySubscription(subscription, userId);
  }

  return NextResponse.json({ received: true });
}
