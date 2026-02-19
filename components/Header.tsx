
import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, LayoutTemplate, Check, Eye, Edit3, Palette, ChevronDown, Languages, MessageSquare, Undo, Redo, BarChart2, Sparkles, Sliders, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, ViewMode, CustomTheme } from '../types';
import { THEMES } from '../constants';

// View mode display configuration
const VIEW_MODE_CONFIG: Record<Exclude<ViewMode, 'admin'>, { label: string; icon?: React.ReactNode }> = {
  classic: { label: 'Classic Greyscale' },
  glass: { label: 'Glassmorphism' },
  dashboard: { label: 'Creative Dashboard', icon: <Layout size={12} /> },
  analytics: { label: 'Career Analytics', icon: <BarChart2 size={12} /> },
};

interface HeaderProps {
  toggleTheme: () => void;
  isDark: boolean;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  language: Language;
  toggleLanguage: () => void;
  isEditing: boolean;
  setIsEditing: (val: boolean) => void;
  onOpenStyleEditor: () => void;
  onOpenStyleConsultant?: () => void;
  customThemes?: CustomTheme[];
  activeTheme?: string;
  onApplyTheme?: (themeId: string) => void;
  enabledStyles?: ViewMode[];
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    toggleTheme,
    isDark,
    viewMode,
    setViewMode,
    language,
    toggleLanguage,
    isEditing,
    setIsEditing,
    onOpenStyleEditor,
    onOpenStyleConsultant,
    customThemes = [],
    activeTheme,
    onApplyTheme,
    enabledStyles = ['classic', 'glass', 'dashboard', 'analytics'],
    canUndo,
    canRedo,
    onUndo,
    onRedo
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    
    const handleClickOutside = (event: MouseEvent) => {
        if (themeRef.current && !themeRef.current.contains(event.target as Node)) {
            setThemeDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
        window.removeEventListener('scroll', handleScroll);
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isAdmin = viewMode === 'admin';
  const isGlass = viewMode === 'glass';
  const isAnalytics = viewMode === 'analytics';

  // Determine current active theme name
  let currentThemeName = "Classic";
  if (viewMode === 'glass') currentThemeName = "Glass";
  else if (viewMode === 'dashboard') currentThemeName = "Dashboard";
  else if (viewMode === 'analytics') currentThemeName = "Career Analytics";
  else if (viewMode === 'classic') {
      if (activeTheme && THEMES[activeTheme]) currentThemeName = THEMES[activeTheme].name;
      else if (activeTheme) {
          const custom = customThemes.find(c => c.id === activeTheme);
          if (custom) currentThemeName = custom.name;
      }
  }

  // Filter view modes for dropdown (exclude 'admin' — it has its own toggle button)
  const availableViewModes = (Object.keys(VIEW_MODE_CONFIG) as Exclude<ViewMode, 'admin'>[])
      .filter(mode => enabledStyles.includes(mode));

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white/80 dark:bg-background-dark/80 backdrop-blur-xl shadow-sm py-2'
        : 'bg-transparent py-4'
    }`}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* LEFT: View / Edit Toggle */}
        <div className="flex items-center gap-4">
            {!isAdmin ? (
                <div className="flex items-center p-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-inner">
                    <button
                        onClick={() => setIsEditing(false)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            !isEditing 
                            ? 'bg-white dark:bg-gray-600 shadow-sm text-black dark:text-white' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                        }`}
                    >
                        <Eye size={14} />
                        <span className="hidden sm:inline">View</span>
                    </button>
                    <button
                        onClick={() => setIsEditing(true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                            isEditing 
                            ? 'bg-primary text-black shadow-sm' 
                            : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300'
                        }`}
                    >
                        <Edit3 size={14} />
                        <span className="hidden sm:inline">Edit</span>
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Admin Mode</span>
                </div>
            )}

            {isEditing && (
                <div className="flex items-center gap-1">
                    <button 
                        onClick={onUndo} 
                        disabled={!canUndo}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo size={16} />
                    </button>
                    <button 
                        onClick={onRedo} 
                        disabled={!canRedo}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Redo (Ctrl+Shift+Z)"
                    >
                        <Redo size={16} />
                    </button>
                </div>
            )}
        </div>

        {/* RIGHT: Actions (Scrollable on mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pl-4">
          
           {/* Language Toggle */}
           <button
              onClick={toggleLanguage}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
           >
              <Languages size={14} />
              <span className="hidden md:inline">{language === 'en' ? 'EN' : '中'}</span>
           </button>

           {/* Theme Dropdown */}
           {!isAdmin && (
             <div className="relative flex-shrink-0" ref={themeRef}>
                 <div className="flex items-center gap-2">
                     <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                            isGlass
                                ? 'bg-white/50 text-gray-700 border border-white/60 shadow-sm backdrop-blur-xl hover:bg-white/70'
                                : 'bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-200 hover:text-black dark:hover:text-white'
                        } ${themeDropdownOpen ? 'ring-2 ring-primary/20 border-primary' : ''}`}
                     >
                        <Palette size={16} />
                        <span className="max-w-[80px] md:max-w-[100px] truncate">{currentThemeName}</span>
                        <ChevronDown size={14} className={`transition-transform ${themeDropdownOpen ? 'rotate-180' : ''}`} />
                     </motion.button>
                     
                     {/* Design Consultant Trigger (External) */}
                     {onOpenStyleConsultant && (
                         <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onOpenStyleConsultant}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all"
                            title="AI Style Consultant"
                         >
                             <MessageSquare size={16} className="md:w-[18px] md:h-[18px]" />
                         </motion.button>
                     )}
                 </div>

                 <AnimatePresence>
                    {themeDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-64 bg-white dark:bg-card-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
                        >
                            <div className="max-h-[350px] overflow-y-auto custom-scrollbar p-2 space-y-1">
                                <p className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400">System Views</p>
                                {availableViewModes.map(mode => {
                                    const config = VIEW_MODE_CONFIG[mode];
                                    const isActive = viewMode === mode;
                                    const handleClick = () => {
                                        setViewMode(mode);
                                        if (mode === 'classic') onApplyTheme && onApplyTheme(activeTheme || 'greyscale');
                                        setThemeDropdownOpen(false);
                                    };
                                    return (
                                        <button
                                            key={mode}
                                            onClick={handleClick}
                                            className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center justify-between"
                                        >
                                            <span className="flex items-center gap-2">
                                                {config.icon}
                                                {config.label}
                                            </span>
                                            {isActive && <Check size={14} className="text-primary" />}
                                        </button>
                                    );
                                })}

                                {customThemes.length > 0 && (
                                    <>
                                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-2"></div>
                                        <p className="px-3 py-1 text-[10px] uppercase font-bold text-gray-400 flex items-center gap-2">
                                            <Palette size={10} /> AI Generated
                                        </p>
                                        {customThemes.map(theme => (
                                            <button
                                                key={theme.id}
                                                onClick={() => { 
                                                    setViewMode('classic'); 
                                                    onApplyTheme && onApplyTheme(theme.id);
                                                    setThemeDropdownOpen(false);
                                                }}
                                                className="w-full text-left px-3 py-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg flex items-center justify-between group"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full border border-gray-200" style={{background: theme.colors.primary}}></div>
                                                    <span className="truncate max-w-[140px]">{theme.name}</span>
                                                </div>
                                                {activeTheme === theme.id && viewMode === 'classic' && <Check size={14} className="text-primary" />}
                                            </button>
                                        ))}
                                    </>
                                )}
                            </div>
                            <div className="p-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-black/20 flex gap-2">
                                {onOpenStyleConsultant && (
                                    <button 
                                        onClick={() => { onOpenStyleConsultant(); setThemeDropdownOpen(false); }}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:brightness-110 rounded-lg shadow-sm transition-all"
                                    >
                                        <Sparkles size={14} /> AI Gen
                                    </button>
                                )}
                                <button 
                                    onClick={() => { onOpenStyleEditor(); setThemeDropdownOpen(false); }}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-700 transition-all"
                                >
                                    <Sliders size={14} /> Editor
                                </button>
                            </div>
                        </motion.div>
                    )}
                 </AnimatePresence>
             </div>
           )}

           {/* Admin Toggle Button */}
           <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode(isAdmin ? 'classic' : 'admin')}
                className={`flex-shrink-0 p-2 rounded-full transition-all ${
                    isAdmin 
                    ? 'bg-primary text-black' 
                    : 'text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800'
                }`}
                title={isAdmin ? "Exit Admin" : "Enter Admin"}
            >
                <LayoutTemplate size={18} />
            </motion.button>

          {/* Dark Mode Toggle */}
          <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="flex-shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;
