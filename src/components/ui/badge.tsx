import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center gap-1.5 whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "border border-border bg-surface-2 text-muted-foreground",
      outline: "border border-border bg-background text-foreground",
      secondary: "border border-blue-200 bg-blue-50 text-blue-800",
      warning: "border border-amber-200 bg-amber-50 text-amber-800",
      success: "border border-emerald-200 bg-emerald-50 text-emerald-800",
      danger: "border border-red-200 bg-red-50 text-red-800",
      accent: "border border-accent/30 bg-accent/10 text-accent"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

export interface BadgeProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
