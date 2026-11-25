import { PortalButton } from "@/components/portal-button";
import { PricingToggle } from "@/components/pricing-toggle";
import { requireUser } from "@/components/require-user";
import { getSubscription } from "@/lib/data";

export default async function BillingPage() {
  const user = await requireUser();
  const sub = await getSubscription(user.id);
  return (
    <main className="space-y-6">
      <h1 className="font-script text-5xl">Оплата</h1>
      <p className="text-sm">
        Статус: {sub?.status || "free"}. Интервал: {sub?.interval || "—"}.
      </p>
      <PricingToggle />
      <PortalButton />
    </main>
  );
}
