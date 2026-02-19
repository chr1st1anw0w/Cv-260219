
import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { 
  Save, Layout, Settings, CheckCircle, Plus, Trash2, Sparkles, Briefcase, 
  BarChart2, Target, Zap, Shield, Palette, LogOut, Eye, Edit3, X, FileDown,
  GripVertical, EyeOff, Layers, Image as ImageIcon
} from 'lucide-react';
import { ContentData, LayoutConfig, Language, HistoryEntry, CustomTheme, SectionId } from '../types';
import Button from './ui/Button';
import RadarChart from './ui/RadarChart';
import StyleEditor from './StyleEditor'; 
import GlassView from './GlassView'; 
import CreativeView from './CreativeView'; 
import AssetEngine from './AssetEngine';
import ResumeExpert from './ResumeExpert';
import PdfExportAssistant from './PdfExportAssistant';
import { THEMES, DEFAULT_MOBILE_LAYOUT } from '../constants';

// --- Types ---
type ModuleId = 'personal' | 'experience' | 'skills' | 'services' | 'layout' | 'strategy' | 'design' | 'export';

interface AdminViewProps {
  content: Record<'en' | 'zh', ContentData>;
  onContentChange: (newContent: Record<'en' | 'zh', ContentData>) => void;
  layout: LayoutConfig;
  onLayoutChange: (newLayout: LayoutConfig) => void;
  language: Language;
  history?: HistoryEntry[];
  onRestore?: (entry: HistoryEntry) => void;
  customThemes?: CustomTheme[];
  onExit?: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ 
  content, 
  onContentChange, 
  layout, 
  onLayoutChange,
  language,
  customThemes = [],
  onExit
}) => {
  const [activeModule, setActiveModule] = useState<ModuleId>('personal');
  const [editLang, setEditLang] = useState<Language>(language);
  const [localContent, setLocalContent] = useState(content);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Analytics State
  const [healthScore, setHealthScore] = useState(0);
  const [radarData, setRadarData] = useState<any[]>([]);

  // Design Studio State
  const [previewMode, setPreviewMode] = useState<'glass' | 'dashboard'>('glass');
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [designSubTab, setDesignSubTab] = useState<'style' | 'assets'>('style');
  
  // Real-time Analysis Effect
  useEffect(() => {
      const current = localContent[editLang];
      
      // 1. Calculate Score
      let score = 0;
      if (current.personalInfo.summary.length > 50) score += 15;
      if (current.experience.length > 0) score += 25;
      if (current.skills.length > 0) score += 20;
      const totalBullets = current.experience.reduce((acc, curr) => acc + curr.achievements.length, 0);
      if (totalBullets > 5) score += 25;
      if (current.services.length > 0) score += 15;
      setHealthScore(Math.min(score, 100)); // Cap at 100

      // 2. Radar Data
      setRadarData([
        { label: 'CORE', value: Math.min(current.services.length * 20, 95), fullMark: 100 },
        { label: 'LEAD', value: Math.min(totalBullets * 10 + 20, 90), fullMark: 100 },
        { label: 'IND', value: Math.min(current.experience.length * 15, 85), fullMark: 100 },
        { label: 'SOFT', value: 75, fullMark: 100 },
        { label: 'TOOL', value: Math.min(current.skills.reduce((a,b) => a + b.skills.length, 0) * 5, 98), fullMark: 100 },
      ]);

  }, [localContent, editLang]);

  const handleSave = () => {
    onContentChange(localContent);
    setSuccessMsg("Synced");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const updateLocal = (section: string, value: any, shouldSync: boolean = false) => {
      // Helper for deep nested updates
      const newContent = JSON.parse(JSON.stringify(localContent));
      const langData = newContent[editLang];
      
      const keys = section.split(".");
      let target = langData;
      for(let i=0; i<keys.length-1; i++) {
          target = target[keys[i]];
      }
      target[keys[keys.length-1]] = value;
      
      setLocalContent(newContent);
      if (shouldSync) {
          onContentChange(newContent);
      }
  };

  const handleThemeUpdate = (newTheme: CustomTheme) => {
      const themeId = newTheme.id || `custom-draft-${Date.now()}`;
      const newLayout = {
          ...layout,
          activeTheme: themeId,
          designSystem: newTheme.designSystem || layout.designSystem
      };
      
      // Inject temporary styles
      const root = document.documentElement;
      root.style.setProperty('--color-primary', newTheme.colors.primary);
      root.style.setProperty('--color-primary-hover', newTheme.colors.primaryHover);
      // ... (other vars)
      if(newTheme.designSystem) {
          root.style.setProperty('--radius-card', `${newTheme.designSystem.borderRadius}px`);
      }

      onLayoutChange(newLayout);
  };

  const getCurrentTheme = (): CustomTheme => {
      const activeId = layout.activeTheme;
      if (activeId && THEMES[activeId]) return { ...THEMES[activeId], id: activeId };
      const custom = customThemes.find(c => c.id === activeId);
      if (custom) return custom;
      return {
          id: 'default',
          name: 'Default',
          colors: {
              primary: '#111111', primaryHover: '#333333', backgroundLight: '#F9F9F9', backgroundDark: '#050505',
              cardLight: '#FFFFFF', cardDark: '#111111', textLight: '#1A1A1A', textDark: '#E5E5E5'
          },
          designSystem: layout.designSystem
      };
  };

  // --- Layout Handlers ---
  const toggleSectionVisibility = (sectionId: string) => {
      const currentHidden = layout.hiddenSections || [];
      const newHidden = currentHidden.includes(sectionId)
          ? currentHidden.filter(id => id !== sectionId)
          : [...currentHidden, sectionId];
      onLayoutChange({ ...layout, hiddenSections: newHidden });
  };

  const handleReorderMain = (newOrder: SectionId[]) => {
      onLayoutChange({ ...layout, mainContentOrder: newOrder });
  };

  // --- Components ---

  const TabItem = ({ id, label, icon: Icon, active }: any) => (
    <button 
        onClick={() => setActiveModule(id)}
        className={`relative flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-2 px-3 md:px-6 py-2 md:py-3 text-[10px] md:text-sm font-bold transition-all whitespace-nowrap min-w-[70px] md:min-w-0 rounded-lg ${
            active 
            ? 'bg-white shadow-sm text-black dark:text-black' 
            : 'text-gray-400 hover:text-gray-600 hover:bg-white/50'
        }`}
    >
        <Icon size={active ? 18 : 16} className="" />
        <span className="max-w-[60px] md:max-w-none truncate">{label}</span>
    </button>
  );

  const EditorCard = ({ title, children, className = '', action }: any) => (
      <div className={`bg-white rounded-card p-6 md:p-8 shadow-premium border border-gray-100 ${className}`}>
          {(title || action) && (
              <div className="flex justify-between items-center mb-6">
                  {title && <h3 className="text-xl font-bold text-black">{title}</h3>}
                  {action}
              </div>
          )}
          {children}
      </div>
  );

  const InputGroup = ({ label, value, onChange, multiline = false }: any) => (
      <div className="group space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</label>
          {multiline ? (
              <textarea 
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-gray-50 text-black font-medium text-sm p-4 rounded-input border border-gray-200 focus:border-black focus:ring-0 transition-all resize-y min-h-[120px]"
              />
          ) : (
              <input 
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full bg-gray-50 text-black font-medium text-sm p-4 rounded-input border border-gray-200 focus:border-black focus:ring-0 transition-all"
              />
          )}
      </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-black font-sans text-black overflow-hidden relative">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

        <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
            {/* Top Bar */}
            <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 shadow-sm flex items-center justify-between px-4 py-3 z-20 shrink-0">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Portfolio OS</span>
                </div>
                <div className="flex items-center gap-3">
                    {onExit && <button onClick={onExit} className="p-2 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"><LogOut size={16} /></button>}
                    <div className="flex bg-gray-100 p-0.5 rounded-lg">
                        {['en', 'zh'].map(l => (
                            <button key={l} onClick={() => setEditLang(l as Language)} className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${editLang === l ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>{l.toUpperCase()}</button>
                        ))}
                    </div>
                    <Button onClick={handleSave} className="!py-1.5 !px-3 !text-xs !rounded-lg" icon={successMsg ? <CheckCircle size={14}/> : <Save size={14} />}>{successMsg || 'Save'}</Button>
                </div>
            </div>

            {/* --- MODULES --- */}

            {/* 1. DESIGN STUDIO MODULE (Completely Redesigned) */}
            {activeModule === 'design' ? (
                <div className="flex flex-col md:flex-row h-full overflow-hidden pb-[72px] md:pb-0">
                    {/* Mobile Toggles */}
                    <div className="md:hidden flex p-2 bg-white border-b border-gray-200 z-30 shrink-0 gap-2">
                        <button onClick={() => setShowMobilePreview(false)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${!showMobilePreview ? 'bg-black text-white shadow-lg' : 'bg-gray-100 text-gray-500'}`}><Edit3 size={14} /> Editor</button>
                        <button onClick={() => setShowMobilePreview(true)} className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${showMobilePreview ? 'bg-primary text-black shadow-lg' : 'bg-gray-100 text-gray-500'}`}><Eye size={14} /> Preview</button>
                    </div>

                    {/* Left Panel: Editor */}
                    <div className={`${showMobilePreview ? 'hidden' : 'block'} md:block w-full md:w-[400px] lg:w-[450px] border-r border-gray-200 bg-white h-full z-20 shrink-0 flex flex-col`}>
                        {/* Sub-tabs for Style vs Assets */}
                        <div className="flex p-2 gap-2 border-b border-gray-100">
                            <button 
                                onClick={() => setDesignSubTab('style')}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${designSubTab === 'style' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <Palette size={14} /> Theme Style
                            </button>
                            <button 
                                onClick={() => setDesignSubTab('assets')}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all ${designSubTab === 'assets' ? 'bg-gray-100 text-black' : 'text-gray-400 hover:bg-gray-50'}`}
                            >
                                <ImageIcon size={14} /> Assets & AI
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden relative">
                            {designSubTab === 'style' ? (
                                <StyleEditor currentTheme={getCurrentTheme()} onUpdateTheme={handleThemeUpdate} language={editLang} />
                            ) : (
                                <div className="p-4 h-full overflow-y-auto custom-scrollbar">
                                    <AssetEngine primaryColor={getCurrentTheme().colors.primary} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Preview */}
                    <div className={`${!showMobilePreview ? 'hidden' : 'block'} md:block flex-1 bg-gray-100 dark:bg-black h-full overflow-hidden relative flex flex-col`}>
                        {/* Preview Controls */}
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-white/90 dark:bg-black/90 backdrop-blur-md rounded-full p-1 flex gap-1 border border-gray-200 dark:border-gray-800 shadow-sm">
                            <button 
                                onClick={() => setPreviewMode('glass')} 
                                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${previewMode === 'glass' ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
                            >
                                <Layout size={14} /> Glass
                            </button>
                            <button 
                                onClick={() => setPreviewMode('dashboard')} 
                                className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${previewMode === 'dashboard' ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
                            >
                                <BarChart2 size={14} /> Dashboard
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 pt-16">
                            <div className="max-w-[1200px] mx-auto origin-top transform scale-[0.85] md:scale-95 lg:scale-100 transition-transform">
                                {previewMode === 'glass' ? 
                                    <GlassView language={editLang} content={localContent[editLang]} fullContent={localContent} isEditing={false} onContentUpdate={() => {}} layout={layout} /> : 
                                    <CreativeView language={editLang} content={localContent[editLang]} fullContent={localContent} isEditing={false} onContentUpdate={() => {}} layout={layout} />
                                }
                            </div>
                        </div>
                    </div>
                </div>
            ) : activeModule === 'export' ? (
                /* PDF Export Module */
                <div className="h-full overflow-hidden pb-[72px] md:pb-0">
                    <PdfExportAssistant 
                        language={editLang}
                        content={localContent[editLang]}
                        fullContent={localContent}
                        onContentUpdate={(c) => { setLocalContent(c); onContentChange(c); }}
                    />
                </div>
            ) : (
                /* STANDARD DATA MODULES */
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 pb-24 md:pb-8">
                    <div className="max-w-4xl mx-auto space-y-8">
                        
                        {/* PERSONAL MODULE */}
                        {activeModule === 'personal' && (
                            <EditorCard title="Personal Information">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Full Name" value={localContent[editLang].personalInfo.name} onChange={(v: string) => updateLocal('personalInfo.name', v)} />
                                    <InputGroup label="Job Title" value={localContent[editLang].personalInfo.title} onChange={(v: string) => updateLocal('personalInfo.title', v)} />
                                    <div className="md:col-span-2">
                                        <InputGroup label="Professional Summary" value={localContent[editLang].personalInfo.summary} onChange={(v: string) => updateLocal('personalInfo.summary', v)} multiline />
                                    </div>
                                    <InputGroup label="Email" value={localContent[editLang].personalInfo.email} onChange={(v: string) => updateLocal('personalInfo.email', v)} />
                                    <InputGroup label="Location" value={localContent[editLang].personalInfo.location} onChange={(v: string) => updateLocal('personalInfo.location', v)} />
                                </div>
                            </EditorCard>
                        )}

                        {/* EXPERIENCE MODULE */}
                        {activeModule === 'experience' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center"><h3 className="text-xl font-bold">Experience</h3><Button onClick={() => { const newExp = [{ id: Date.now().toString(), company: "New Company", title: "Role", period: "2024", summary: "", achievements: [] }, ...localContent[editLang].experience]; updateLocal('experience', newExp); }} icon={<Plus size={16}/>}>Add Role</Button></div>
                                {localContent[editLang].experience.map((exp, idx) => (
                                    <EditorCard key={exp.id} className="relative group border-l-4 border-l-transparent hover:border-l-primary transition-all">
                                        <button onClick={() => { const newExp = localContent[editLang].experience.filter((_, i) => i !== idx); updateLocal('experience', newExp); }} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                            <InputGroup label="Company" value={exp.company} onChange={(v: string) => { const newExp = [...localContent[editLang].experience]; newExp[idx].company = v; updateLocal('experience', newExp); }} />
                                            <InputGroup label="Title" value={exp.title} onChange={(v: string) => { const newExp = [...localContent[editLang].experience]; newExp[idx].title = v; updateLocal('experience', newExp); }} />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                            <InputGroup label="Period" value={exp.period} onChange={(v: string) => { const newExp = [...localContent[editLang].experience]; newExp[idx].period = v; updateLocal('experience', newExp); }} />
                                            <InputGroup label="Location" value={exp.location} onChange={(v: string) => { const newExp = [...localContent[editLang].experience]; newExp[idx].location = v; updateLocal('experience', newExp); }} />
                                        </div>
                                        <InputGroup label="Summary" value={exp.summary} multiline onChange={(v: string) => { const newExp = [...localContent[editLang].experience]; newExp[idx].summary = v; updateLocal('experience', newExp); }} />
                                        
                                        <div className="mt-4">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Achievements (One per line)</label>
                                            <textarea 
                                                className="w-full bg-gray-50 text-black font-medium text-sm p-4 rounded-input border border-gray-200 focus:border-black focus:ring-0 transition-all resize-y min-h-[100px]"
                                                value={exp.achievements.join('\n')}
                                                onChange={(e) => {
                                                    const lines = e.target.value.split('\n');
                                                    const newExp = [...localContent[editLang].experience];
                                                    newExp[idx].achievements = lines;
                                                    updateLocal('experience', newExp);
                                                }}
                                            />
                                        </div>
                                    </EditorCard>
                                ))}
                            </div>
                        )}

                        {/* SKILLS MODULE - FIXED */}
                        {(activeModule === 'skills') && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-bold">Skills & Proficiencies</h3>
                                    <Button onClick={() => { 
                                        const newSkills = [...localContent[editLang].skills, { title: "New Category", skills: ["New Skill"] }];
                                        updateLocal('skills', newSkills); 
                                    }} icon={<Plus size={16}/>}>Add Category</Button>
                                </div>
                                {localContent[editLang].skills.map((category, idx) => (
                                    <EditorCard key={idx} className="relative group">
                                        <button onClick={() => { const newS = localContent[editLang].skills.filter((_, i) => i !== idx); updateLocal('skills', newS); }} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                                        
                                        <InputGroup label="Category Name" value={category.title} onChange={(v: string) => { const newS = [...localContent[editLang].skills]; newS[idx].title = v; updateLocal('skills', newS); }} />
                                        
                                        <div className="mt-4">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Skills (Comma separated)</label>
                                            <textarea 
                                                className="w-full bg-gray-50 text-black font-medium text-sm p-4 rounded-input border border-gray-200 focus:border-black focus:ring-0 transition-all resize-y"
                                                value={category.skills.map(s => typeof s === 'string' ? s : s.name).join(', ')}
                                                onChange={(e) => {
                                                    const raw = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                                    const newS = [...localContent[editLang].skills];
                                                    // Preserve object structure if needed, but for simplicity here we use strings for editing unless it was complex objects
                                                    newS[idx].skills = raw;
                                                    updateLocal('skills', newS);
                                                }}
                                            />
                                            <p className="text-[10px] text-gray-400 mt-1">Tip: Use commas to separate skills (e.g. React, TypeScript, Node.js)</p>
                                        </div>
                                    </EditorCard>
                                ))}
                            </div>
                        )}

                        {/* LAYOUT MODULE - FIXED */}
                        {activeModule === 'layout' && (
                            <div className="space-y-6">
                                <EditorCard title="Section Visibility">
                                    <div className="space-y-2">
                                        {['summary', 'values', 'projects', 'experience', 'services', 'toolkit'].map((sectionId) => {
                                            const isHidden = layout.hiddenSections?.includes(sectionId);
                                            return (
                                                <div key={sectionId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                    <span className="text-sm font-bold uppercase text-gray-700">{sectionId}</span>
                                                    <button 
                                                        onClick={() => toggleSectionVisibility(sectionId)}
                                                        className={`p-2 rounded-md flex items-center gap-2 text-xs font-bold transition-all ${isHidden ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}
                                                    >
                                                        {isHidden ? <><EyeOff size={14}/> Hidden</> : <><Eye size={14}/> Visible</>}
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </EditorCard>

                                <EditorCard title="Section Order (Main Content)">
                                    <div className="space-y-2">
                                        <Reorder.Group axis="y" values={layout.mainContentOrder} onReorder={handleReorderMain}>
                                            {layout.mainContentOrder.map((item) => {
                                                const ReorderItem = Reorder.Item as any;
                                                return (
                                                    <ReorderItem key={item} value={item}>
                                                        <div className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm cursor-grab active:cursor-grabbing hover:border-primary transition-colors mb-2">
                                                            <GripVertical size={18} className="text-gray-400" />
                                                            <div className="flex-1 flex items-center justify-between">
                                                                <span className="text-sm font-bold uppercase">{item}</span>
                                                                <div className="flex bg-gray-100 p-0.5 rounded-lg">
                                                                    {['left', 'center', 'right'].map(align => (
                                                                        <button 
                                                                            key={align}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                const newAlign = { ...(layout.sectionAlignment || {}) };
                                                                                // @ts-ignore
                                                                                newAlign[item] = align;
                                                                                onLayoutChange({ ...layout, sectionAlignment: newAlign });
                                                                            }}
                                                                            className={`px-2 py-1 text-[9px] font-bold rounded transition-all ${
                                                                                (layout.sectionAlignment?.[item] || 'left') === align 
                                                                                ? 'bg-white shadow-sm text-black' 
                                                                                : 'text-gray-400 hover:text-gray-600'
                                                                            }`}
                                                                        >
                                                                            {align.toUpperCase()}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </ReorderItem>
                                                );
                                            })}
                                        </Reorder.Group>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 text-center">Drag to reorder sections. Use buttons to set alignment.</p>
                                </EditorCard>

                                <EditorCard title="Smart Grid System">
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-sm font-bold text-gray-700">Grid Snapping</h4>
                                                <p className="text-xs text-gray-400">Snap elements to a precise grid for perfect alignment.</p>
                                            </div>
                                            <button 
                                                onClick={() => onLayoutChange({ ...layout, gridSnap: !layout.gridSnap })}
                                                className={`w-12 h-6 rounded-full transition-all relative ${layout.gridSnap ? 'bg-primary' : 'bg-gray-200'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${layout.gridSnap ? 'right-1' : 'left-1'}`} />
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <h4 className="text-sm font-bold text-gray-700">Grid Columns (Desktop)</h4>
                                                <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{layout.gridColumns || 3} Cols</span>
                                            </div>
                                            <input 
                                                type="range" min="1" max="4" step="1"
                                                value={layout.gridColumns || 3}
                                                onChange={(e) => onLayoutChange({ ...layout, gridColumns: parseInt(e.target.value) })}
                                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>

                                        <div className="pt-4 border-t border-gray-100">
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Mobile Grid Settings</h4>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-medium text-gray-500">Snap Increment</span>
                                                    <span className="text-[10px] font-mono bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{layout.mobile?.gridSnapSize || 8}px</span>
                                                </div>
                                                <input 
                                                    type="range" min="4" max="32" step="4"
                                                    value={layout.mobile?.gridSnapSize || 8}
                                                    onChange={(e) => {
                                                        const currentMobile = layout.mobile || DEFAULT_MOBILE_LAYOUT;
                                                        const newMobile = { ...currentMobile, gridSnapSize: parseInt(e.target.value) };
                                                        // @ts-ignore
                                                        onLayoutChange({ ...layout, mobile: newMobile });
                                                    }}
                                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </EditorCard>
                            </div>
                        )}

                        {/* STRATEGY MODULE */}
                        {activeModule === 'strategy' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2">
                                    <ResumeExpert content={localContent[editLang]} language={editLang} onUpdate={updateLocal} />
                                </div>
                                <div className="space-y-8">
                                    <EditorCard title="Health Analysis" className="h-full">
                                        <div className="flex items-center justify-center mb-8">
                                            <div className="relative w-40 h-40">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="80" cy="80" r="70" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                                                    <circle cx="80" cy="80" r="70" stroke="#D4FF3F" strokeWidth="12" fill="none" strokeDasharray={440} strokeDashoffset={440 - (440 * healthScore) / 100} className="transition-all duration-1000 ease-out" />
                                                </svg>
                                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                    <span className="text-4xl font-bold text-black">{healthScore}</span>
                                                    <span className="text-xs font-bold text-gray-400 uppercase">Score</span>
                                                </div>
                                            </div>
                                        </div>
                                    </EditorCard>
                                    <EditorCard title="Radar"><div className="flex justify-center"><RadarChart data={radarData} width={250} height={250} /></div></EditorCard>
                                </div>
                            </div>
                        )}
                        
                    </div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex overflow-x-auto scrollbar-hide px-4 py-3 gap-2 items-center justify-start md:justify-center w-full">
                    <TabItem id="personal" label="Profile" icon={Target} active={activeModule === 'personal'} />
                    <TabItem id="experience" label="Work" icon={Briefcase} active={activeModule === 'experience'} />
                    <TabItem id="skills" label="Skills" icon={Zap} active={activeModule === 'skills'} />
                    <TabItem id="layout" label="Layout" icon={Layout} active={activeModule === 'layout'} />
                    <TabItem id="design" label="Design" icon={Palette} active={activeModule === 'design'} />
                    <TabItem id="strategy" label="Strategy" icon={Shield} active={activeModule === 'strategy'} />
                    <TabItem id="export" label="Export" icon={FileDown} active={activeModule === 'export'} />
                </div>
            </div>
        </div>
    </div>
  );
};

export default AdminView;