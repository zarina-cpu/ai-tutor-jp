import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }) {
  return (
    <input
      type={type}
      className={cn(
        "h-10 w-full border border-[#0D3837]/30 bg-transparent px-3 text-sm outline-none focus-visible:border-[#00856E] dark:border-[#FDB4E5]/40",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
