import { cn } from "@/lib/utils";

function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "border border-[#0D3837]/20 bg-[#F8F1F5]/70 p-5 dark:border-[#FDB4E5]/20 dark:bg-[#0D3837]",
        className,
      )}
      {...props}
    />
  );
}

export { Card };
