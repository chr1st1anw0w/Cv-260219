
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ProfileSidebar from './components/ProfileSidebar';
import MainContent from './components/MainContent';
import RightSidebar from './components/RightSidebar';
import CreativeView from './components/CreativeView';
import GlassView from './components/GlassView';
import AdminView from './components/AdminView';
import AiAssistant from './components/AiAssistant';
import MobileDashboard from './components/MobileDashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { CONTENT as INITIAL_CONTENT, THEMES, DEFAULT_MOBILE_LAYOUT } from './constants';
import { Language, ViewMode, ContentData, LayoutConfig, HistoryEntry, CustomTheme } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import StyleEditor from './components/StyleEditor';
import StyleConsultant from './components/StyleConsultant';
import { X, Check, RefreshCcw } from 'lucide-react';

// Use Deep Merge for initial layout to ensure mobile config exists
const getInitialLayout = (): LayoutConfig => ({
  mainContentOrder: ['summary', 'values', 'projects', 'experience', 'services', 'toolkit'],
  sidebarOrder: ['profile', 'education'],
  hiddenSections: ['projects'], 
  enabledStyles: ['classic', 'glass', 'dashboard', 'analytics'],
  activeTheme: 'greyscale',
  gridColumns: 3,
  gridSnap: true,
  sectionAlignment: {
    summary: 'left',
    values: 'left',
    projects: 'left',
    experience: 'left',
    services: 'left',
    toolkit: 'left'
  },
  designSystem: {
      borderRadius: 24,
      spacingScale: 1,
      fontScale: 1,
      iconStyle: 'standard',
      shadowStrength: 'soft'
  },
  mobile: {
    ...DEFAULT_MOBILE_LAYOUT,
    gridSnapSize: 8
  }
});

const INITIAL_LAYOUT = getInitialLayout();

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('classic');
  const [language, setLanguage] = useState<Language>('zh');
  
  // App State
  const [content, setContent] = useState<Record<'en' | 'zh', ContentData>>(INITIAL_CONTENT);
  const [layout, setLayout] = useState<LayoutConfig>(getInitialLayout());
  const [isStyleEditorOpen, setIsStyleEditorOpen] = useState(false);
  const [isStyleConsultantOpen, setIsStyleConsultantOpen] = useState(false);
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  
  // Preview & Compare State
  const [previewTheme, setPreviewTheme] = useState<CustomTheme | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Edit Mode & History
  const [isEditing, setIsEditing] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Apply Theme Colors (Smart Logic)
  useEffect(() => {
    const root = document.documentElement;
    
    // Logic: Use Preview Theme UNLESS comparing (then use active), otherwise Active Theme
    let themeToApply: CustomTheme | undefined;
    
    if (previewTheme && !isComparing) {
        themeToApply = previewTheme;
    } else {
        const themeKey = layout.activeTheme || 'greyscale';
        if (THEMES[themeKey]) {
            themeToApply = { ...THEMES[themeKey], id: themeKey };
        } else if (themeKey.startsWith('custom-')) {
            themeToApply = customThemes.find(t => t.id === themeKey);
        }
        
        // Fallback
        if (!themeToApply) themeToApply = { ...THEMES['greyscale'], id: 'default' };
    }

    if (!themeToApply) return;

    const colors = themeToApply.colors;
    const designSystem = themeToApply.designSystem || layout.designSystem || getInitialLayout().designSystem!;

    // Apply CSS Variables
    root.style.setProperty('--color-primary', colors.primary);
    root.style.setProperty('--color-primary-hover', colors.primaryHover);
    
    const hex = colors.primary.replace('#', '');
    if (hex.length === 6) {
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            root.style.setProperty('--color-primary-rgb', `${r}, ${g}, ${b}`);
    }

    root.style.setProperty('--color-bg-light', colors.backgroundLight);
    root.style.setProperty('--color-bg-dark', colors.backgroundDark);
    root.style.setProperty('--color-card-light', colors.cardLight);
    root.style.setProperty('--color-card-dark', colors.cardDark);
    root.style.setProperty('--color-text-light', colors.textLight);
    root.style.setProperty('--color-text-dark', colors.textDark);

    // Design System Tokens
    if (designSystem) {
        root.style.setProperty('--radius-card', `${designSystem.borderRadius}px`);
        
        let strokeWidth = '2px';
        if (designSystem.iconStyle === 'thin') strokeWidth = '1.5px';
        if (designSystem.iconStyle === 'bold') strokeWidth = '2.5px';
        root.style.setProperty('--icon-stroke', strokeWidth);

        // Dynamic Shadows via CSS Injection (Optimized)
        const shadowStyle = document.getElementById('dynamic-theme-styles');
        let css = '';
        const strength = designSystem.shadowStrength || 'soft';

        if (strength === 'hard') {
            css = `
                .shadow-soft, .shadow-lg, .shadow-xl, .shadow-sm {
                    box-shadow: 6px 6px 0px 0px rgba(0,0,0,1) !important;
                    border: 2px solid rgba(0,0,0,1) !important;
                }
                .dark .shadow-soft, .dark .shadow-lg {
                    box-shadow: 6px 6px 0px 0px rgba(255,255,255,1) !important;
                    border: 2px solid rgba(255,255,255,1) !important;
                }
            `;
        } else if (strength === 'glass') {
            css = `
               .shadow-soft, .shadow-lg {
                   box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15) !important;
                   backdrop-filter: blur(12px) !important;
                   border: 1px solid rgba(255, 255, 255, 0.2) !important;
               }
           `;
        } else if (strength === 'glow') {
             css = `
               .shadow-soft, .shadow-lg {
                   box-shadow: 0 0 25px var(--color-primary) !important;
                   border: 1px solid var(--color-primary) !important;
               }
           `;
        }
        
        if (!shadowStyle) {
            const style = document.createElement('style');
            style.id = 'dynamic-theme-styles';
            style.innerHTML = css;
            document.head.appendChild(style);
        } else {
            shadowStyle.innerHTML = css;
        }
    }

  }, [layout.activeTheme, layout.designSystem, isDark, customThemes, previewTheme, isComparing]);

  useEffect(() => {
    // Theme Init
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        setIsDark(true);
        document.documentElement.classList.add('dark');
    } else {
        setIsDark(false);
        document.documentElement.classList.remove('dark');
    }

    // Data Loading
    const savedContent = localStorage.getItem('portfolio_content');
    let initialContent = INITIAL_CONTENT;
    if (savedContent) {
      try {
        initialContent = JSON.parse(savedContent);
        setContent(initialContent);
      } catch (e) {}
    }

    const savedLayout = localStorage.getItem('portfolio_layout');
    let initialLayout = getInitialLayout();
    if (savedLayout) {
      try {
        const parsedLayout = JSON.parse(savedLayout);
        // Ensure mobile layout exists even if loading old layout config
        if (!parsedLayout.mobile) {
            parsedLayout.mobile = DEFAULT_MOBILE_LAYOUT;
        }
        initialLayout = { ...getInitialLayout(), ...parsedLayout };
        setLayout(initialLayout);
      } catch (e) {}
    }
    
    // History Init
    const initialEntry: HistoryEntry = {
        id: 'init',
        timestamp: Date.now(),
        description: 'Initial State',
        contentSnapshot: initialContent,
        layoutSnapshot: initialLayout
    };
    setHistory([initialEntry]);
    setHistoryIndex(0);
    
    const savedThemes = localStorage.getItem('portfolio_custom_themes');
    if (savedThemes) {
        try { setCustomThemes(JSON.parse(savedThemes)); } catch(e) {}
    }
  }, []);

  const addToHistory = (desc: string, newContent: Record<'en' | 'zh', ContentData>, newLayout: LayoutConfig) => {
      const entry: HistoryEntry = {
          id: Date.now().toString(),
          timestamp: Date.now(),
          description: desc,
          contentSnapshot: JSON.parse(JSON.stringify(newContent)),
          layoutSnapshot: JSON.parse(JSON.stringify(newLayout))
      };
      
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(entry);
      if (newHistory.length > 50) newHistory.shift();
      
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
  };

  const handleUndo = useCallback(() => {
      if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const entry = history[newIndex];
          setHistoryIndex(newIndex);
          setContent(entry.contentSnapshot);
          setLayout(entry.layoutSnapshot);
          localStorage.setItem('portfolio_content', JSON.stringify(entry.contentSnapshot));
          localStorage.setItem('portfolio_layout', JSON.stringify(entry.layoutSnapshot));
      }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
      if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          const entry = history[newIndex];
          setHistoryIndex(newIndex);
          setContent(entry.contentSnapshot);
          setLayout(entry.layoutSnapshot);
          localStorage.setItem('portfolio_content', JSON.stringify(entry.contentSnapshot));
          localStorage.setItem('portfolio_layout', JSON.stringify(entry.layoutSnapshot));
      }
  }, [history, historyIndex]);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
              if (e.shiftKey) {
                  e.preventDefault();
                  handleRedo();
              } else {
                  e.preventDefault();
                  handleUndo();
              }
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleContentChange = (newContent: Record<'en' | 'zh', ContentData>, logDescription: string = "Content update") => {
    addToHistory(logDescription, newContent, layout);
    setContent(newContent);
    localStorage.setItem('portfolio_content', JSON.stringify(newContent));
  };

  const handleLayoutChange = (newLayout: LayoutConfig, logDescription: string = "Layout reorder") => {
    addToHistory(logDescription, content, newLayout);
    setLayout(newLayout);
    localStorage.setItem('portfolio_layout', JSON.stringify(newLayout));
  };

  const handleToggleSectionVisibility = (sectionId: string) => {
      const isHidden = layout.hiddenSections?.includes(sectionId);
      let newHidden = [...(layout.hiddenSections || [])];
      
      if (isHidden) {
          newHidden = newHidden.filter(id => id !== sectionId);
      } else {
          newHidden.push(sectionId);
      }
      
      handleLayoutChange({ ...layout, hiddenSections: newHidden }, `Toggle visibility of ${sectionId}`);
  };

  const handleApplyCustomTheme = (theme: CustomTheme) => {
      setPreviewTheme(null);
      setCustomThemes(prev => {
          const exists = prev.findIndex(t => t.id === theme.id);
          let newThemes = [...prev];
          if (exists >= 0) newThemes[exists] = theme;
          else newThemes = [...prev, theme];
          localStorage.setItem('portfolio_custom_themes', JSON.stringify(newThemes));
          return newThemes;
      });
      
      const newLayoutState: LayoutConfig = {
          ...layout,
          activeTheme: theme.id,
          designSystem: theme.designSystem ? { ...layout.designSystem, ...theme.designSystem } : layout.designSystem,
          ...(theme.layoutPreference || {})
      };
      
      handleLayoutChange(newLayoutState, `Applied theme: ${theme.name}`);
  };

  const handlePreviewTheme = (theme: CustomTheme) => setPreviewTheme(theme);
  const handleCancelPreview = () => setPreviewTheme(null);

  const restoreVersion = (entry: HistoryEntry) => {
      setContent(entry.contentSnapshot);
      setLayout(entry.layoutSnapshot);
      localStorage.setItem('portfolio_content', JSON.stringify(entry.contentSnapshot));
      localStorage.setItem('portfolio_layout', JSON.stringify(entry.layoutSnapshot));
      setHistory([...history, entry]);
      setHistoryIndex(history.length); 
  };

  const toggleTheme = () => {
    if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.theme = 'light';
        setIsDark(false);
    } else {
        document.documentElement.classList.add('dark');
        localStorage.theme = 'dark';
        setIsDark(true);
    }
  };

  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'zh' : 'en');

  const getCurrentTheme = (): CustomTheme => {
      if (previewTheme) return previewTheme;
      const activeId = layout.activeTheme || 'greyscale';
      if (THEMES[activeId]) return { ...THEMES[activeId], id: activeId };
      const custom = customThemes.find(c => c.id === activeId);
      if (custom) return custom;
      return {
          id: 'default',
          name: 'Default',
          colors: { ...THEMES['greyscale'].colors },
          designSystem: layout.designSystem
      };
  };

  const handleStyleEditorUpdate = (updatedTheme: CustomTheme) => {
      if (previewTheme) {
          setPreviewTheme(updatedTheme);
          return;
      }
      const existingIndex = customThemes.findIndex(t => t.id === updatedTheme.id);
      if (existingIndex >= 0) {
          const newThemes = [...customThemes];
          newThemes[existingIndex] = updatedTheme;
          setCustomThemes(newThemes);
          localStorage.setItem('portfolio_custom_themes', JSON.stringify(newThemes));
          if (layout.activeTheme === updatedTheme.id) {
              const newLayout = {
                  ...layout,
                  designSystem: updatedTheme.designSystem ? { ...layout.designSystem, ...updatedTheme.designSystem } : layout.designSystem
              };
              setLayout(newLayout);
              localStorage.setItem('portfolio_layout', JSON.stringify(newLayout));
          }
      } else {
          setPreviewTheme(updatedTheme);
      }
  };
  
  const handleApplyAsset = (field: string, value: string) => {
      const newFullContent = JSON.parse(JSON.stringify(content));
      if (field === 'avatar') {
          newFullContent[language].personalInfo.avatar = value;
          handleContentChange(newFullContent, "Updated avatar from AI");
      }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300 font-sans h-[100dvh] overflow-hidden relative">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-black focus:font-bold focus:rounded-lg">
        Skip to main content
      </a>

      {/* Smart Preview Dock */}
      <AnimatePresence>
        {previewTheme && (
            <motion.div 
                initial={{ y: 100, opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 p-2 pl-4 bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full shadow-2xl ring-1 ring-black/5"
            >
                <div className="flex items-center gap-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-none">Previewing</span>
                        <span className="text-xs font-bold text-black dark:text-white leading-none">{previewTheme.name}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                     <button 
                        onMouseDown={() => setIsComparing(true)}
                        onMouseUp={() => setIsComparing(false)}
                        onMouseLeave={() => setIsComparing(false)}
                        onTouchStart={() => setIsComparing(true)}
                        onTouchEnd={() => setIsComparing(false)}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white rounded-full text-xs font-bold transition-all flex items-center gap-2 active:scale-95 select-none"
                    >
                        <RefreshCcw size={14} className={isComparing ? "animate-spin" : ""} />
                        {isComparing ? "Original" : "Hold to Compare"}
                    </button>

                    <button 
                        onClick={() => handleApplyCustomTheme(previewTheme)} 
                        className="px-4 py-2 bg-primary hover:brightness-110 text-white dark:text-black rounded-full text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
                    >
                        <Check size={14} strokeWidth={3} />
                        Apply
                    </button>
                    
                    <button 
                        onClick={handleCancelPreview} 
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 rounded-full transition-colors"
                        title="Discard"
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <Header
        toggleTheme={toggleTheme}
        isDark={isDark}
        viewMode={viewMode}
        setViewMode={setViewMode}
        language={language}
        toggleLanguage={toggleLanguage}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onOpenStyleEditor={() => setIsStyleEditorOpen(true)}
        onOpenStyleConsultant={() => setIsStyleConsultantOpen(true)}
        customThemes={customThemes}
        activeTheme={previewTheme ? previewTheme.id : layout.activeTheme}
        onApplyTheme={(themeId) => handleLayoutChange({ ...layout, activeTheme: themeId }, "Change Theme")}
        enabledStyles={layout.enabledStyles}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
      
      <StyleConsultant 
        isOpen={isStyleConsultantOpen}
        onClose={() => setIsStyleConsultantOpen(false)}
        onApplyTheme={handleApplyCustomTheme}
        onPreviewTheme={handlePreviewTheme}
        onCancelPreview={handleCancelPreview}
        currentPreview={previewTheme}
      />

      {/* Global AI Assistant */}
      {isEditing && viewMode !== 'admin' && (
          <AiAssistant 
            language={language}
            content={content[language]}
            fullContent={content}
            onContentUpdate={handleContentChange}
          />
      )}

      {viewMode === 'admin' ? (
        <div id="main-content" className="h-[calc(100vh-80px)] overflow-y-auto">
             <AdminView 
                content={content} 
                onContentChange={(c) => handleContentChange(c, "Admin panel update")}
                layout={layout}
                onLayoutChange={(l) => handleLayoutChange(l, "Admin panel layout update")}
                language={language}
                history={history}
                onRestore={restoreVersion}
                customThemes={customThemes}
                onExit={() => setViewMode('classic')}
             />
        </div>
      ) : viewMode === 'analytics' ? (
        /* Analytics Dashboard View */
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
            <AnalyticsDashboard language={language} content={content[language]} />
        </div>
      ) : (
        <>
            {/* Universal Mobile Dashboard for Visitor Views (md:hidden) */}
            <div className="md:hidden h-[calc(100vh-80px)] overflow-hidden">
                <MobileDashboard language={language} content={content[language]} layout={layout} />
            </div>

            {/* Desktop Views (hidden md:block) */}
            <div className="hidden md:block h-[calc(100vh-80px)]">
                {viewMode === 'dashboard' ? (
                    <CreativeView 
                        language={language} 
                        content={content[language]}
                        fullContent={content}
                        isEditing={isEditing}
                        onContentUpdate={handleContentChange}
                        layout={layout}
                    />
                ) : viewMode === 'glass' ? (
                    <GlassView
                        language={language}
                        content={content[language]}
                        fullContent={content}
                        isEditing={isEditing}
                        onContentUpdate={handleContentChange}
                        layout={layout}
                    />
                ) : (
                    /* Classic Mode Desktop */
                    <main className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-0 grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                        {/* Left Column */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                            className="md:col-span-4 lg:col-span-3 h-full overflow-y-auto pb-20 custom-scrollbar pr-2"
                        >
                            <ProfileSidebar 
                                language={language} 
                                content={content[language]} 
                                fullContent={content}
                                order={layout.sidebarOrder || INITIAL_LAYOUT.sidebarOrder}
                                isEditing={isEditing}
                                onContentUpdate={handleContentChange}
                                onLayoutUpdate={handleLayoutChange}
                                currentLayout={layout}
                                variant="classic"
                                hiddenSections={layout.hiddenSections || []}
                                onToggleVisibility={handleToggleSectionVisibility}
                            />
                        </motion.div>

                        {/* Middle Column */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="md:col-span-8 lg:col-span-6 h-full overflow-y-auto pb-20 custom-scrollbar px-1"
                        >
                            <MainContent 
                                language={language} 
                                content={content[language]} 
                                fullContent={content}
                                order={layout.mainContentOrder} 
                                isEditing={isEditing}
                                onContentUpdate={handleContentChange}
                                onLayoutUpdate={handleLayoutChange}
                                currentLayout={layout}
                                variant="classic"
                                hiddenSections={layout.hiddenSections || []}
                                onToggleVisibility={handleToggleSectionVisibility}
                            />
                        </motion.div>

                        {/* Right Column */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="hidden lg:block lg:col-span-3 h-full overflow-y-auto pb-20"
                        >
                             <RightSidebar 
                                 language={language}
                                 content={content[language]}
                                 fullContent={content}
                                 isEditing={isEditing}
                                 onContentUpdate={handleContentChange}
                                 variant="classic"
                                 hiddenSections={layout.hiddenSections || []}
                                 onToggleVisibility={handleToggleSectionVisibility}
                             />
                        </motion.div>
                    </main>
                )}
            </div>
        </>
      )}
      
      {/* Modal Style Editor */}
      <AnimatePresence>
        {isStyleEditorOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-end bg-black/50 backdrop-blur-sm" onClick={(e) => { if(e.target === e.currentTarget) setIsStyleEditorOpen(false); }}>
                <motion.div 
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="w-full max-w-md h-full bg-white dark:bg-card-dark shadow-2xl relative"
                >
                    <button onClick={() => setIsStyleEditorOpen(false)} className="absolute top-4 right-4 z-10 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>
                    <div className="h-full">
                        <StyleEditor 
                            currentTheme={getCurrentTheme()}
                            onUpdateTheme={handleStyleEditorUpdate}
                            language={language}
                            onApplyAsset={handleApplyAsset}
                        />
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
