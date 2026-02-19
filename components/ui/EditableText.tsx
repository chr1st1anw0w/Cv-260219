
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Check, X, Loader2, ChevronDown, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateAIResponse } from '../../services/aiService';

import HighlightedText from './HighlightedText';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  isEditing: boolean;
  className?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  multiline?: boolean;
}

const AI_TEMPLATES = [
    { 
        label: "Professional Polish", 
        icon: Sparkles,
        prompt: "Rewrite the following text to be more professional, impactful, and result-oriented using active verbs. Keep the meaning but improve the tone." 
    },
    { 
        label: "Resume Summary (ATS)", 
        icon: Wand2,
        prompt: "Rewrite this as an ATS-friendly professional summary. Focus on keywords, hard skills, and standard industry terminology. Keep it concise." 
    },
    { 
        label: "Resume Summary (Brand)", 
        icon: Wand2,
        prompt: "Rewrite this summary to emphasize personal brand, leadership, and unique value proposition. Use an executive, confident tone." 
    },
    { 
        label: "Experience Bullet (Impact)", 
        icon: Wand2,
        prompt: "Rewrite this resume bullet point to focus on IMPACT. Start with a strong action verb, and where possible, suggest where numbers could be added (use [X] as placeholder)." 
    },
    { 
        label: "Quantify Suggestions", 
        icon: Sparkles,
        prompt: "Analyze this text and identify areas where specific metrics, percentages, or dollar amounts would strengthen the claim. Rewrite it with placeholders like [increased by X%] and ask me to fill them." 
    },
    { 
        label: "Shorten for Mobile", 
        icon: Check,
        prompt: "Rewrite this text to be punchy and concise, suitable for quick scanning on a mobile device, without losing the core achievement." 
    }
];

const EditableText: React.FC<EditableTextProps> = ({ 
  value, 
  onSave, 
  isEditing, 
  className = '', 
  tag: Tag = 'span',
  multiline = false
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [selection, setSelection] = useState<{start: number, end: number, text: string} | null>(null);
  const [showAiMenu, setShowAiMenu] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Auto-resize textarea
  useEffect(() => {
    if (isEditing && multiline && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [localValue, isEditing, multiline]);

  const handleBlur = () => {
    // Small delay to allow clicking AI buttons before blur hides controls
    setTimeout(() => {
        setIsFocused(false);
        if (!aiSuggestion && !showAiMenu) {
             if (localValue !== value) {
                onSave(localValue);
             }
        }
    }, 200);
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      const target = e.currentTarget;
      if (target.selectionStart !== target.selectionEnd) {
          setSelection({
              start: target.selectionStart || 0,
              end: target.selectionEnd || 0,
              text: localValue.substring(target.selectionStart || 0, target.selectionEnd || 0)
          });
      } else {
          setSelection(null);
      }
  };

  const triggerAiOptimization = async (templateIndex: number = 0) => {
      const textToOptimize = selection ? selection.text : localValue;
      const template = AI_TEMPLATES[templateIndex];
      
      if (!textToOptimize.trim()) return;
      setLoadingAi(true);
      setShowAiMenu(false);
      
      try {
          const data = await generateAIResponse({
              prompt: `${template.prompt}\n\nInput Text: \"${textToOptimize}\"\n\nOutput ONLY the rewritten text. No explanations.`,
              model: 'gemini-3-flash-preview'
          });
          if (data.text) {
              setAiSuggestion(data.text.trim());
          }
      } catch (error) {
          console.error("AI Error", error);
          setAiSuggestion("Error connecting to AI.");
      } finally {
          setLoadingAi(false);
      }
  };

  const applySuggestion = () => {
      if (aiSuggestion) {
          if (selection) {
              // Replace only selected text
              const newValue = localValue.substring(0, selection.start) + aiSuggestion + localValue.substring(selection.end);
              setLocalValue(newValue);
              onSave(newValue);
              setSelection(null);
          } else {
              // Replace full text
              setLocalValue(aiSuggestion);
              onSave(aiSuggestion);
          }
          setAiSuggestion(null);
      }
  };

  if (isEditing) {
    return (
        <div ref={wrapperRef} className={`relative group/edit w-full ${Tag === 'span' ? 'inline-block' : 'block'}`}>
            {multiline ? (
                <textarea
                ref={textareaRef}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onFocus={() => setIsFocused(true)}
                onSelect={handleSelect}
                className={`w-full bg-yellow-50 dark:bg-yellow-900/20 border-b-2 border-primary outline-none resize-none transition-all rounded px-1 ${className}`}
                style={{ minHeight: '1.5em' }}
                />
            ) : (
                <input
                ref={inputRef}
                type="text"
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                onFocus={() => setIsFocused(true)}
                onSelect={handleSelect}
                className={`bg-yellow-50 dark:bg-yellow-900/20 border-b-2 border-primary outline-none w-full min-w-[50px] transition-all rounded px-1 ${className}`}
                />
            )}

            {/* AI Trigger Button */}
            <AnimatePresence>
                {(isFocused || selection) && !aiSuggestion && (
                    <div className={`absolute z-20 ${selection ? '-top-10 right-0' : '-top-3 -right-3'}`}>
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onMouseDown={(e) => { e.preventDefault(); setShowAiMenu(!showAiMenu); }}
                            className="bg-primary text-black p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-1"
                            title="AI Assistant"
                        >
                            {loadingAi ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                            {selection && <span className="text-[10px] font-bold pr-1">AI</span>}
                            <ChevronDown size={10} />
                        </motion.button>

                        {/* AI Templates Menu - Responsive: Bottom Sheet on Mobile, Dropdown on Desktop */}
                        {showAiMenu && (
                            <>
                                {/* Mobile Backdrop */}
                                <div 
                                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
                                    onClick={(e) => { e.stopPropagation(); setShowAiMenu(false); }} 
                                />
                                
                                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-card-dark rounded-t-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] border-t border-gray-100 dark:border-gray-800 z-40 md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-1 md:w-48 md:rounded-lg md:shadow-xl md:border md:p-0 md:overflow-hidden animate-slide-up md:animate-none">
                                    <div className="flex justify-between items-center mb-3 md:hidden">
                                        <span className="text-xs font-bold uppercase text-gray-500">AI Optimize</span>
                                        <button onClick={() => setShowAiMenu(false)}><X size={16}/></button>
                                    </div>
                                    <div className="space-y-1 md:space-y-0">
                                        {AI_TEMPLATES.map((template, index) => (
                                            <button
                                                key={index}
                                                onMouseDown={(e) => { e.preventDefault(); triggerAiOptimization(index); }}
                                                className="w-full text-left px-3 py-3 md:py-2 text-sm md:text-[10px] hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0 flex items-center gap-3 md:gap-2 rounded-xl md:rounded-none"
                                            >
                                                <div className="p-1.5 bg-primary/10 rounded-full md:p-0 md:bg-transparent text-primary md:text-gray-500">
                                                    <template.icon size={14} className="md:w-3 md:h-3" />
                                                </div>
                                                {template.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </AnimatePresence>

            {/* AI Suggestion Popover - Responsive */}
            <AnimatePresence>
                {aiSuggestion && (
                    <>
                        <div 
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                            onClick={(e) => { e.stopPropagation(); setAiSuggestion(null); }} 
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="fixed bottom-4 left-4 right-4 z-50 md:absolute md:left-0 md:right-auto md:top-full md:mt-2 md:w-full md:min-w-[280px] bg-white dark:bg-gray-800 rounded-xl shadow-2xl md:shadow-xl border border-primary/50 p-4 md:p-3"
                        >
                            <div className="flex items-start gap-3 md:gap-2">
                                <Sparkles size={20} className="text-primary shrink-0 mt-0.5 md:w-4 md:h-4" />
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <p className="text-[10px] uppercase font-bold text-gray-400">
                                            {selection ? 'Suggestion for Selection' : 'AI Suggestion'}
                                        </p>
                                        <button onClick={() => setAiSuggestion(null)} className="md:hidden text-gray-400"><X size={16}/></button>
                                    </div>
                                    <div className="p-3 md:p-2 bg-gray-50 dark:bg-black/30 rounded-lg border border-gray-100 dark:border-gray-700 mb-4 md:mb-3 max-h-[40vh] overflow-y-auto">
                                        <p className="text-sm md:text-xs text-gray-800 dark:text-gray-200 font-medium whitespace-pre-wrap">{aiSuggestion}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onMouseDown={(e) => { e.preventDefault(); applySuggestion(); }}
                                            className="flex-1 bg-primary text-black text-sm md:text-xs font-bold py-2.5 md:py-1.5 rounded-lg flex items-center justify-center gap-1.5 hover:bg-primary-hover shadow-lg md:shadow-none"
                                        >
                                            <Check size={14} /> Apply Change
                                        </button>
                                        <button 
                                            onMouseDown={(e) => { e.preventDefault(); setAiSuggestion(null); }}
                                            className="bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-red-500 px-4 py-2 md:px-3 md:py-1.5 rounded-lg transition-colors hidden md:block"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {/* Triangle Arrow (Desktop only) */}
                            <div className="absolute bottom-full left-4 -mb-[1px] border-8 border-transparent border-b-white dark:border-b-gray-800 hidden md:block"></div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
  }

  return (
    <Tag className={`${className} cursor-text border border-transparent hover:border-dashed hover:border-gray-300 dark:hover:border-gray-700 rounded px-0.5 -mx-0.5 transition-colors`}>
      <HighlightedText text={value} />
    </Tag>
  );
};

export default EditableText;
