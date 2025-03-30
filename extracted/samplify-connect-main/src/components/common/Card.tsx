
import React from 'react';
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'neomorph';
  isHoverable?: boolean;
  hasBorder?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', isHoverable = false, hasBorder = true, children, ...props }, ref) => {
    
    const variants = {
      default: "bg-white shadow-sm",
      glass: "glass",
      neomorph: "neomorph",
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-6 transition-all duration-300",
          variants[variant],
          isHoverable && "hover:shadow-md hover:translate-y-[-2px]",
          hasBorder && "border border-border/50",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
