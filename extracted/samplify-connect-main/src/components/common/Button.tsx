
import React from 'react';
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    iconPosition = 'left',
    children,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 active:scale-[0.98]";
    
    const variants = {
      primary: "bg-medical-500 text-white hover:bg-medical-600 focus:ring-medical-500",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-secondary",
      outline: "bg-transparent border border-medical-500 text-medical-500 hover:bg-medical-50 focus:ring-medical-500",
      ghost: "bg-transparent hover:bg-secondary text-foreground hover:text-foreground focus:ring-secondary",
    };
    
    const sizes = {
      sm: "text-sm px-3 py-1.5 rounded-lg",
      md: "text-base px-4 py-2 rounded-xl",
      lg: "text-lg px-6 py-3 rounded-2xl",
    };

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          isLoading && "opacity-70 cursor-not-allowed",
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
        ) : icon && iconPosition === 'left' ? (
          <span className="mr-2">{icon}</span>
        ) : null}
        
        {children}
        
        {!isLoading && icon && iconPosition === 'right' ? (
          <span className="ml-2">{icon}</span>
        ) : null}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
