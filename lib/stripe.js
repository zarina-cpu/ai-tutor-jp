import Stripe from "stripe";
import { STRIPE_PRICES } from "./config";

export function stripeReady() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripe() {
  if (!stripeReady()) return null;
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export function priceForInterval(interval) {
  return interval === "year" ? STRIPE_PRICES.yearly : STRIPE_PRICES.monthly;
}
