import React, { useState } from 'react';
import { Reorder, useDragControls, motion, AnimatePresence } from 'framer-motion';
import { GripVertical, MoreHorizontal, Plus, FileText, Eye, EyeOff } from 'lucide-react';

interface SectionWrapperProps {
  value: string;
  isEditing: boolean;
  children: React.ReactNode;
  onAddBlock?: () => void;
  onToggleMarkdown?: () => void;
  title: string;
  isHidden?: boolean;
  onToggleVisibility?: () => void;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ 
  value, 
  isEditing, 
  children, 
  onAddBlock,
  onToggleMarkdown,
  title,
  isHidden = false,
  onToggleVisibility
}) => {
  const controls = useDragControls();
  const [menuOpen, setMenuOpen] = useState(false);

  // In View Mode, if hidden, return nothing
  if (!isEditing && isHidden) return null;

  return (
    <Reorder.Item
      value={value}
      dragListener={false} 
      dragControls={controls}
      className={`relative rounded-3xl transition-all ${
          isEditing 
          ? 'mb-8 ring-2 ring-dashed p-2 ' + (isHidden ? 'ring-gray-200 dark:ring-gray-800 bg-gray-50/50 opacity-60 grayscale' : 'ring-gray-200 dark:ring-gray-800') 
          : ''
      }`}
    >
      {isEditing && (
        <div className={`flex items-center justify-between mb-2 px-2 rounded-t-xl py-2 ${isHidden ? 'bg-transparent' : 'bg-gray-100 dark:bg-gray-800'}`}>
          
          {/* Drag Handle */}
          <div 
            className="flex items-center gap-2 cursor-grab active:cursor-grabbing text-gray-500 hover:text-primary touch-none"
            onPointerDown={(e) => controls.start(e)}
          >
            <GripVertical size={20} />
            <span className="text-xs font-bold uppercase tracking-wider">{title}</span>
            {isHidden && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">HIDDEN</span>}
            {!isHidden && <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-500 hidden md:inline-block">DRAG</span>}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            
            {/* Visibility Toggle */}
            {onToggleVisibility && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleVisibility();
                    }}
                    className={`p-1.5 rounded-lg border shadow-sm transition-colors flex items-center gap-1.5 ${
                        isHidden 
                        ? 'bg-red-50 text-red-500 border-red-200' 
                        : 'bg-white dark:bg-gray-700 hover:text-primary hover:bg-primary/10 border-gray-200 dark:border-gray-600'
                    }`}
                    title={isHidden ? "Show Section" : "Hide Section"}
                >
                    {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
            )}

            {onToggleMarkdown && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onToggleMarkdown();
                    }}
                    className="p-1.5 bg-white dark:bg-gray-700 hover:text-primary hover:bg-primary/10 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm transition-colors flex items-center gap-1.5"
                    title="Edit as Markdown"
                >
                    <FileText size={14} />
                    <span className="text-[10px] font-bold hidden sm:inline">MD</span>
                </button>
            )}

            <div className="relative">
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-1.5 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                    <MoreHorizontal size={20} className="text-gray-500" />
                </button>

                <AnimatePresence>
                    {menuOpen && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}></div>
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
                            >
                                {onAddBlock && (
                                    <button
                                        onClick={() => {
                                            onAddBlock();
                                            setMenuOpen(false);
                                        }}
                                        className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 text-primary-600 dark:text-primary border-b border-gray-100 dark:border-gray-700"
                                    >
                                        <Plus size={16} />
                                        Add New Block
                                    </button>
                                )}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {children}
    </Reorder.Item>
  );
};

export default SectionWrapper;