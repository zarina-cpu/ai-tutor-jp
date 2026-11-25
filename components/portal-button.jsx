"use client";

import { Button } from "@/components/ui/button";

export function PortalButton() {
  async function open() {
    const response = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    window.alert(data.error || "Портал Stripe недоступен");
  }

  return (
    <Button type="button" variant="outline" onClick={open}>
      Портал Stripe
    </Button>
  );
}
