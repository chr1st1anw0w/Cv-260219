
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Briefcase } from 'lucide-react';
import { Experience } from '../types';
import HighlightedText from './ui/HighlightedText';

interface ExperienceItemProps {
  exp: Experience;
}

const ExperienceItem: React.FC<ExperienceItemProps> = ({ exp }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative pl-8 group">
      {/* Timeline Line */}
      <div className="absolute left-[5px] top-2 bottom-0 w-[0.5px] bg-gray-200 dark:bg-gray-800 group-last:bottom-auto group-last:h-full"></div>
      
      {/* Timeline Dot */}
      <div className={`absolute left-0 top-2 w-[11px] h-[11px] rounded-full border-2 border-white dark:border-black z-10 transition-colors duration-300 ${
        exp.isHighlight ? 'bg-primary shadow-glow' : 'bg-gray-200 dark:bg-gray-600 group-hover:bg-primary'
      }`}></div>

      <div 
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 group-hover:translate-x-1 transition-transform duration-300">
          <div>
            <h3 className="text-lg font-bold text-text-light dark:text-white group-hover:text-primary transition-colors">{exp.company}</h3>
            <p className={`${exp.isHighlight ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'} text-sm font-medium flex items-center gap-2`}>
               {exp.title}
            </p>
          </div>
          <span className="text-xs text-text-secondary-light dark:text-text-secondary-dark mt-1 md:mt-0 font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {exp.period}
          </span>
        </div>
        
        <div className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed mb-3">
          <HighlightedText text={exp.summary} />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50/50 dark:bg-black/20 rounded-xl p-4 mb-4 border border-gray-100 dark:border-gray-700">
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="text-sm text-text-secondary-light dark:text-text-secondary-dark flex items-start gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></span>
                       <HighlightedText text={achievement} />
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button className="text-xs font-bold text-primary flex items-center gap-1 hover:text-white transition-colors py-2">
          {isOpen ? 'Less' : 'More'} 
          <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
            <ChevronDown size={14} />
          </motion.span>
        </button>
      </div>
    </div>
  );
};

export default ExperienceItem;
