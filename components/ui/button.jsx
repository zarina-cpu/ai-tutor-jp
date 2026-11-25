import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-none border border-transparent px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00856E] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[#00856E] text-white hover:bg-[#0D3837]",
        stamp: "bg-[#D745A8] text-white hover:bg-[#00856E]",
        outline: "border-[#0D3837] text-[#222327] hover:bg-[#FDB4E5]/40 dark:border-[#FDB4E5] dark:text-[#F8F1F5]",
        ghost: "hover:bg-[#FDB4E5]/30",
        link: "underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
