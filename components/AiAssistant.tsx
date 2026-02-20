import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, MessageSquare, Zap, Target, Search, FileText } from 'lucide-react';
import ResumeExpert from './ResumeExpert';
import { Language, ContentData } from '../types';

interface AiAssistantProps {
  language: Language;
  content: ContentData;
  fullContent: Record<Language, ContentData>;
  onContentUpdate: (newContent: any, description?: string) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({
  language,
  content,
  fullContent,
  onContentUpdate
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<'expert' | 'chat'>('expert');

  const handleUpdate = (section: string, value: any, shouldSync: boolean = true) => {
      // Helper for deep nested updates
      const newFullContent = JSON.parse(JSON.stringify(fullContent));
      const langData = newFullContent[language];

      const keys = section.split('.');
      let target = langData;
      for(let i=0; i<keys.length-1; i++) {
          if (!target[keys[i]]) target[keys[i]] = {};
          target = target[keys[i]];
      }
      target[keys[keys.length-1]] = value;

      onContentUpdate(newFullContent, `AI update: ${section}`);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 bg-primary text-black rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center group"
      >
        <Sparkles className="w-6 h-6 group-hover:animate-pulse" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white dark:border-black animate-bounce"></div>
      </motion.button>

      {/* Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-xl bg-background-light dark:bg-background-dark shadow-2xl z-[80] flex flex-col border-l border-gray-200 dark:border-gray-800"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-card-dark">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">AI Portfolio Copilot</h2>
                    <p className="text-xs text-gray-500">Intelligent optimization & strategy</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Mode Toggles */}
              <div className="px-6 py-4 flex gap-2">
                 <button
                    onClick={() => setActiveMode('expert')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeMode === 'expert' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                 >
                    <Target size={14} /> Resume Strategy
                 </button>
                 <button
                    onClick={() => setActiveMode('chat')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${activeMode === 'chat' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}
                 >
                    <MessageSquare size={14} /> AI Chat (Beta)
                 </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 pt-0 custom-scrollbar">
                {activeMode === 'expert' ? (
                  <ResumeExpert
                    content={content}
                    language={language}
                    onUpdate={handleUpdate}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                     <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                        <MessageSquare size={32} />
                     </div>
                     <div>
                        <h3 className="font-bold">AI Chat is coming soon</h3>
                        <p className="text-sm text-gray-500">Ask the AI to rewrite sections, translate, or suggest layouts.</p>
                     </div>
                  </div>
                )}
              </div>

              {/* Footer / Context Info */}
              <div className="p-4 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-gray-800">
                <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
                  Powered by Gemini 3.5 Pro & Stitch UI Engine
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiAssistant;
