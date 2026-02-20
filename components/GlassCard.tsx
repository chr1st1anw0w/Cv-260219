
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
        bg-white/70 dark:bg-[#0D0D0D]/80
        backdrop-blur-xl 
        border border-black/5 dark:border-white/10
        shadow-soft dark:shadow-none
        rounded-2xl
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
