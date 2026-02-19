import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './ui/Button';
import { ArrowRight } from 'lucide-react';

interface LivePreviewProps {
  image: string;
  title: React.ReactNode;
  subtitle: string;
  link?: string;
  className?: string;
}

const LivePreview: React.FC<LivePreviewProps> = ({ image, title, subtitle, link, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-3xl overflow-hidden shadow-soft border border-gray-100 dark:border-gray-800 group cursor-pointer h-[300px] md:h-[400px] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => link && window.open(link, '_blank')}
    >
      <img 
        src={image} 
        alt="Project Preview" 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end">
        <h3 className="text-white text-2xl md:text-4xl font-bold leading-tight mb-4 max-w-2xl drop-shadow-lg">
            {title}
        </h3>
        
        {/* Hover Reveal Section */}
        <div className="relative overflow-hidden h-14">
             <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 50, opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex items-center gap-3 absolute bottom-0 left-0"
             >
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-4 py-2 rounded-full border border-white/30 font-medium">
                    {subtitle}
                </span>
                <Button variant="primary" className="!py-1.5 !px-4 !text-xs" icon={<ArrowRight size={14} />}>
                    View Project
                </Button>
             </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default LivePreview;