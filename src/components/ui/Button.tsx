import React from 'react';
import { cn } from '../../lib/utils';
import { motion, HTMLMotionProps } from 'motion/react';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  fullWidth?: boolean;
  children?: React.ReactNode; 
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  children, 
  variant = 'primary', 
  fullWidth, 
  className, 
  disabled,
  ...props 
}, ref) => {
  const baseStyles = "relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all duration-300 cursor-pointer overflow-hidden";
  
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 active:scale-[0.98]",
    secondary: "bg-[#1A1D2A] text-slate-300 hover:text-white border border-[#24283B] hover:border-indigo-500/50 hover:bg-[#24283B]",
    danger: "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white",
    ghost: "bg-transparent text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10"
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        fullWidth ? "w-full" : "",
        disabled ? "opacity-50 cursor-not-allowed saturate-0" : "",
        className
      )}
      {...props}
    >
      <div className="relative z-10 flex items-center gap-2">
        {children}
      </div>
    </motion.button>
  );
});

Button.displayName = 'Button';