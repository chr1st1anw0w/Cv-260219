
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div 
      className={`
        bg-white/80 dark:bg-[#1E1E1E]/80 
        backdrop-blur-xl 
        border border-white/40 dark:border-white/10 
        shadow-soft dark:shadow-none
        rounded-3xl 
        transition-all duration-300 hover:shadow-lg
        ${noPadding ? 'p-0' : 'p-6'} 
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassCard;
