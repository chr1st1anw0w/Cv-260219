
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  delay?: number;
  scrollTrigger?: boolean;
  variant?: 'classic' | 'glass';
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverEffect = false, 
  delay = 0, 
  scrollTrigger = false,
  variant = 'classic',
  ...props 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // Styles based on variant
  const classicStyles = "bg-card-light dark:bg-card-dark shadow-soft border border-gray-100 dark:border-gray-800";
  const glassStyles = "bg-white/80 dark:bg-[#1E1E1E]/80 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-lg";

  return (
    <motion.div
      ref={ref}
      style={scrollTrigger ? { y } : undefined}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={hoverEffect ? { 
        y: scrollTrigger ? 0 : -5, 
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" 
      } : {}}
      className={`rounded-3xl p-6 transition-colors ${variant === 'glass' ? glassStyles : classicStyles} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
