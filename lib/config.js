export const BRAND = {
  name: "Ироха",
  latin: "Iroha",
};

export const PRACTICE_RESET_TZ =
  process.env.PRACTICE_RESET_TZ || "Asia/Yekaterinburg";

export const FREE_DAILY_SECONDS = 10 * 60;
export const FREE_DAILY_LESSONS = 5;

export const STRIPE_PRICES = {
  monthly: {
    amountUsd: 12,
    priceId: process.env.STRIPE_PRICE_MONTHLY || "",
  },
  yearly: {
    amountUsd: 96,
    priceId: process.env.STRIPE_PRICE_YEARLY || "",
  },
};

export const GEMINI_MODEL = "gemini-3.5-flash-lite";
