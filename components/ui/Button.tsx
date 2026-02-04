
import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-display font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 uppercase tracking-wider',
  {
    variants: {
      variant: {
        primary: 'bg-brand-600 text-white hover:bg-brand-500 shadow-neon hover:shadow-neon-strong',
        secondary: 'bg-surface-highlight text-white border border-border-highlight hover:border-brand-500',
        outline: 'border-2 border-brand-500 text-brand-400 bg-transparent hover:bg-brand-500/10',
        ghost: 'text-secondary hover:text-white hover:bg-surface-highlight',
        danger: 'bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-12 px-6 text-sm',
        lg: 'h-14 px-8 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  // Explicitly defined to fix "Property does not exist" errors
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processando...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
