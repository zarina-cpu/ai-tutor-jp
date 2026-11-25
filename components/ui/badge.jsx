import { cn } from "@/lib/utils";

function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center border border-[#00856E] px-2 py-0.5 text-xs text-[#00856E] dark:border-[#FDB4E5] dark:text-[#FDB4E5]",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
