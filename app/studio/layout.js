import { StudioNav } from "@/components/studio-nav";
import { requireUser } from "@/components/require-user";

export const dynamic = "force-dynamic";

export default async function StudioLayout({ children }) {
  await requireUser();
  return (
    <div className="grid gap-8 px-6 py-8 lg:grid-cols-[12rem_minmax(0,1fr)]">
      <StudioNav />
      <div>{children}</div>
    </div>
  );
}
