
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  children?: React.ReactNode;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  "aria-label"?: string; // Pro Max Rule #40
};

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  children, 
  className = '', 
  icon,
  loading,
  "aria-label": ariaLabel,
  ...props 
}) => {
  // Pro Max Rule #28: Visible Focus States
  // Pro Max Rule #22: Touch Target Size (min-h-[44px])
  const baseStyles = "relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]";
  
  const variants = {
    primary: "bg-primary text-black hover:bg-primary-hover shadow-lg shadow-primary/20",
    secondary: "bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary",
    outline: "border-2 border-primary text-primary hover:bg-primary/10",
    ghost: "bg-transparent text-text-secondary-light dark:text-text-secondary-dark hover:text-text-light dark:hover:text-text-dark hover:bg-gray-100 dark:hover:bg-gray-800"
  };

  // Ensure icon-only buttons have an aria-label
  if (!children && !ariaLabel) {
    console.warn("UI/UX Pro Max Warning: Icon-only button missing aria-label");
  }

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98, y: 0 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading}
      aria-label={ariaLabel || (typeof children === 'string' ? children : 'Button')}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {children}
          {icon && <span className="text-lg">{icon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;
