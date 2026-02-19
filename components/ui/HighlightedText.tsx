
import React from 'react';

interface HighlightedTextProps {
  text: string;
  className?: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text, className = '' }) => {
  if (!text) return null;
  
  // Regex to split by markdown bold syntax **text**
  // Also supports simple numeric highlighting if needed, but primarily for **bold**
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          // Render Markdown Bold
          return (
            <strong key={index} className="font-extrabold text-black dark:text-white">
              {part.slice(2, -2)}
            </strong>
          );
        } else {
            return <span key={index}>{part}</span>;
        }
      })}
    </span>
  );
};

export default HighlightedText;
