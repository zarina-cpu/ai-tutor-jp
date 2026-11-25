import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Paywall({ title, body }) {
  return (
    <div className="border border-[#D745A8] p-6">
      <h2 className="font-script text-3xl">{title}</h2>
      <p className="mt-3 max-w-xl text-sm leading-6">{body}</p>
      <Button asChild className="mt-5" variant="stamp">
        <Link href="/pricing">Открыть Pro</Link>
      </Button>
    </div>
  );
}
