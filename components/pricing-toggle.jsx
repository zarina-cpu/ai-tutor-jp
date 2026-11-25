"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { STRIPE_PRICES } from "@/lib/config";

export function PricingToggle() {
  const [yearly, setYearly] = useState(false);
  const price = yearly ? STRIPE_PRICES.yearly.amountUsd : STRIPE_PRICES.monthly.amountUsd;

  async function checkout() {
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interval: yearly ? "year" : "month" }),
    });
    const data = await response.json();
    if (response.status === 401) {
      window.location.href = "/login";
      return;
    }
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    window.alert(data.error || "Stripe ещё не настроен");
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant={yearly ? "outline" : "default"} onClick={() => setYearly(false)}>
          Месяц · ${STRIPE_PRICES.monthly.amountUsd}
        </Button>
        <Button variant={yearly ? "default" : "outline"} onClick={() => setYearly(true)}>
          Год · ${STRIPE_PRICES.yearly.amountUsd}
        </Button>
      </div>
      <p className="text-sm">Сейчас: ${price} {yearly ? "в год" : "в месяц"}.</p>
      <Button variant="stamp" onClick={checkout}>
        Оформить Pro
      </Button>
    </div>
  );
}
