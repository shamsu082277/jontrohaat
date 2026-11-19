import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline:
          "text-foreground border border-border",
        forest:
          "bg-brand-forest text-brand-cream border border-brand-forest/30",
        leaf:
          "bg-brand-leaf/15 text-brand-forest dark:text-brand-fresh border border-brand-leaf/30",
        harvest:
          "bg-brand-harvest/20 text-neutral-900 dark:text-brand-harvest border border-brand-harvest/40 font-medium",
        cream:
          "bg-brand-cream text-brand-forest border border-brand-fresh/30",
        available:
          "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30",
        unavailable:
          "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
