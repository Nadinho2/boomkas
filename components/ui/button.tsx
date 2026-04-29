"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_0_0_1px_rgba(0,240,255,0.25),0_10px_30px_rgba(0,240,255,0.15)] hover:shadow-[0_0_0_1px_rgba(0,240,255,0.35),0_12px_36px_rgba(0,240,255,0.22)] hover:brightness-110",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_0_0_1px_rgba(255,107,0,0.25),0_10px_30px_rgba(255,107,0,0.12)] hover:shadow-[0_0_0_1px_rgba(255,107,0,0.32),0_12px_36px_rgba(255,107,0,0.18)] hover:brightness-110",
        ghost:
          "bg-transparent text-foreground hover:bg-white/5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.22)]",
      },
      size: {
        sm: "h-10 px-4",
        md: "h-12 px-5",
        lg: "h-14 px-7 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

