"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium tracking-tight shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]",
  {
    variants: {
      variant: {
        default: "bg-white/5 text-foreground",
        cyan: "bg-[rgba(0,240,255,0.12)] text-[color:var(--primary)] shadow-[inset_0_0_0_1px_rgba(0,240,255,0.22)]",
        orange:
          "bg-[rgba(255,107,0,0.12)] text-[color:var(--secondary)] shadow-[inset_0_0_0_1px_rgba(255,107,0,0.22)]",
        gray: "bg-white/[0.06] text-muted-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
        yellow:
          "bg-[rgba(255,214,102,0.12)] text-[rgba(255,214,102,0.95)] shadow-[inset_0_0_0_1px_rgba(255,214,102,0.22)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
