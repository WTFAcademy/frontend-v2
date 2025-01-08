import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-wtf-brand-1 text-wtf-content-white hover:bg-wtf-brand-1/90 disabled:bg-wtf-brand-1/50",
        destructive:
          "bg-wtf-function-errorBg text-wtf-function-error hover:bg-red-300 disabled:bg-wtf-function-errorBg/50",
        outline:
          "border border-wtf-border-outline bg-background hover:bg-accent hover:text-accent-foreground disabled:bg-background/50",
        secondary:
          "bg-wtf-function-brandBg text-wtf-function-link hover:bg-wtf-function-brandBg/80 disabled:bg-wtf-function-brandBg/50",
        ghost: "hover:bg-accent hover:text-accent-foreground disabled:bg-transparent",
        link: "text-primary underline-offset-4 hover:underline disabled:no-underline",
        success:
          "bg-wtf-function-successBg text-wtf-function-success hover:bg-green-300 hover:text-green-700 disabled:bg-wtf-function-successBg/50",
        normal: "bg-wtf-background-block hover:bg-wtf-background-block/80 disabled:bg-wtf-background-block/50"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-10 px-4",
        xl: "h-12 px-8 py-3",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          disabled && "pointer-events-none opacity-50"
        )}
        ref={ref}
        {...props}
        disabled={disabled}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
