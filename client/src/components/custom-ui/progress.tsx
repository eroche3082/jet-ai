import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva(
  "relative h-2 w-full overflow-hidden rounded-full bg-gray-800",
  {
    variants: {
      variant: {
        default: "bg-gray-800",
        blue: "bg-gray-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const progressIndicatorVariants = cva(
  "h-full w-full flex-1 bg-primary transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary",
        blue: "bg-[#4a89dc]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CustomProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants> {
  value: number
  indicatorVariant?: VariantProps<typeof progressIndicatorVariants>["variant"]
}

const CustomProgress = React.forwardRef<HTMLDivElement, CustomProgressProps>(
  ({ className, value, variant, indicatorVariant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        className={cn(progressVariants({ variant }), className)}
        {...props}
      >
        <div
          className={cn(progressIndicatorVariants({ variant: indicatorVariant }))}
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        />
      </div>
    )
  }
)
CustomProgress.displayName = "CustomProgress"

export { CustomProgress }