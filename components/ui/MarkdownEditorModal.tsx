
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import Button from './Button';

interface MarkdownEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  initialContent: string;
  title: string;
}

const MarkdownEditorModal: React.FC<MarkdownEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialContent,
  title
}) => {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent, isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-4xl bg-white dark:bg-[#121212] rounded-2xl shadow-2xl flex flex-col h-[80vh] md:h-[85vh] overflow-hidden border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#121212]">
              <h3 className="font-bold text-lg dark:text-white flex items-center gap-2">
                <span className="text-primary">#</span> Edit {title}
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
            
            <div className="flex-1 p-0 overflow-hidden relative bg-gray-50 dark:bg-[#0A0A0A]">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full p-6 resize-none outline-none bg-transparent font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-200"
                placeholder="# Markdown Content..."
                autoFocus
              />
            </div>

            <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-end gap-3 bg-white dark:bg-[#121212]">
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button onClick={() => { onSave(content); onClose(); }} icon={<Save size={16} />}>
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MarkdownEditorModal;
