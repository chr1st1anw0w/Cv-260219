
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, FileText, Mail, Globe, Linkedin, ChevronDown, Check, Briefcase, GraduationCap, Link as LinkIcon, Sparkles, X, Wand2 } from 'lucide-react';
import { ContentData, Language, LayoutConfig, MobileBentoBlock, Experience, GlassStyleTokens } from '../types';
import HighlightedText from './ui/HighlightedText';
import { pickTopAchievements, extractKPIs } from '../utils/achievementScorer';
import { DEFAULT_MOBILE_LAYOUT } from '../constants';
import { experienceEnhancerAgent } from '../services/aiService';
import Button from './ui/Button';

interface MobileDashboardProps {
  language: Language;
  content: ContentData;
  layout?: LayoutConfig;
}

// Helper to resolve card style (Global + Override)
const resolveCardStyle = (globalStyle: GlassStyleTokens, block?: MobileBentoBlock): GlassStyleTokens => {
    return { ...globalStyle, ...(block?.styleOverride ?? {}) };
};

const GlassBentoCard: React.FC<{ 
    children: React.ReactNode; 
    className?: string; 
    onClick?: () => void;
    colSpan?: 1 | 2;
    styleConfig: GlassStyleTokens;
}> = ({ children, className = '', onClick, colSpan = 2, styleConfig }) => {
    
    // Dynamic styles based on config
    const bgStyle = {
        background: `rgba(255, 255, 255, ${styleConfig.opacity})`,
        backdropFilter: `blur(${styleConfig.blur === 'xl' ? 20 : styleConfig.blur === 'lg' ? 12 : 8}px)`,
        borderColor: `rgba(255, 255, 255, ${styleConfig.borderOpacity})`,
        borderRadius: `${styleConfig.radius}px`,
        padding: `${styleConfig.padding}px`
    };

    const accentStyle = styleConfig.accent?.enabled ? {
        borderLeftWidth: styleConfig.accent.position === 'left' ? `${styleConfig.accent.thickness}px` : 0,
        borderTopWidth: styleConfig.accent.position === 'top' ? `${styleConfig.accent.thickness}px` : 0,
        borderLeftColor: styleConfig.accent.color,
        borderTopColor: styleConfig.accent.color,
    } : {};

    const getShadowClass = (shadow: string) => {
        switch (shadow) {
            case 'sm': return 'shadow-sm';
            case 'md': return 'shadow-md';
            case 'none': return 'shadow-none';
            default: return 'shadow-sm';
        }
    };

    return (
        <motion.div 
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`${getShadowClass(styleConfig.shadow)} dark:shadow-none border border-white/10 relative overflow-hidden ${className}`}
            style={{ 
                gridColumn: `span ${colSpan}`,
                ...bgStyle,
                ...accentStyle
            }}
        >
            {children}
        </motion.div>
    );
};

const ExperienceBentoCard: React.FC<{ 
    exp: Experience; 
    styleConfig: GlassStyleTokens;
    onExpand: () => void; 
}> = ({ exp, styleConfig, onExpand }) => {
    
    // Smart folding: Pick top 2 most impactful bullets
    const topAchievements = pickTopAchievements(exp.achievements, 2);
    // Extract KPIs
    const kpis = exp.achievements.flatMap(a => extractKPIs(a)).slice(0, 2);

    return (
        <GlassBentoCard 
            onClick={onExpand} 
            colSpan={2} 
            styleConfig={styleConfig}
            className="group active:ring-2 active:ring-primary/50"
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{exp.company}</h4>
                    <span className="text-xs text-primary font-medium">{exp.title}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-mono text-gray-400 bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded">{exp.period.split('–')[0].trim()}</span>
                    {exp.isHighlight && <span className="text-[9px] bg-yellow-400/20 text-yellow-600 px-1.5 rounded font-bold">Highlight</span>}
                </div>
            </div>
            
            {/* KPI Chips */}
            {kpis.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {kpis.map((kpi, i) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20">
                            {kpi}
                        </span>
                    ))}
                </div>
            )}

            <ul className="space-y-1.5 mt-2 text-xs text-gray-600 dark:text-gray-300">
                {topAchievements.map((ach, i) => (
                    <li key={i} className="flex gap-2 items-start leading-snug line-clamp-2">
                        <span className="w-1 h-1 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                        <HighlightedText text={ach} />
                    </li>
                ))}
            </ul>
            
            <div className="mt-3 flex justify-between items-center pt-2 border-t border-dashed border-gray-200 dark:border-white/10">
                 <span className="text-[10px] text-gray-400">Tap to see full details</span>
                 <ChevronDown size={14} className="text-gray-400" />
            </div>
        </GlassBentoCard>
    );
};

const ExperienceDetailSheet: React.FC<{ 
    exp: Experience | null; 
    isOpen: boolean; 
    onClose: () => void;
}> = ({ exp, isOpen, onClose }) => {
    const [isRewriting, setIsRewriting] = useState(false);
    const [aiSuggestions, setAiSuggestions] = useState<string[] | null>(null);

    if (!exp) return null;

    const handleRewrite = async () => {
        setIsRewriting(true);
        try {
            const result = await experienceEnhancerAgent(exp);
            if (result && result.rewrittenBullets) {
                setAiSuggestions(result.rewrittenBullets);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsRewriting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div 
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#121212] rounded-t-[32px] z-50 max-h-[85vh] flex flex-col shadow-2xl"
                    >
                        {/* Handle */}
                        <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
                            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full" />
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 pb-24">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{exp.company}</h3>
                                    <p className="text-primary font-semibold">{exp.title}</p>
                                    <p className="text-xs text-gray-500 mt-1 font-mono">{exp.period} • {exp.location}</p>
                                </div>
                                <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-white/10 rounded-full">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500">Achievements</h4>
                                        <Button 
                                            variant="ghost" 
                                            className="!py-1 !px-2 !text-[10px] h-auto gap-1"
                                            onClick={handleRewrite}
                                            loading={isRewriting}
                                        >
                                            <Wand2 size={12} /> AI Rewrite
                                        </Button>
                                    </div>
                                    
                                    {/* AI Suggestions Area */}
                                    {aiSuggestions && (
                                        <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                                            <h5 className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                                                <Sparkles size={12} /> AI Suggestions
                                            </h5>
                                            <ul className="space-y-2">
                                                {aiSuggestions.map((sug, i) => (
                                                    <li key={i} className="text-xs text-gray-700 dark:text-gray-300 pl-2 border-l-2 border-purple-300">
                                                        {sug}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className="mt-3 flex gap-2">
                                                <Button className="!py-1.5 !px-3 !text-xs w-full justify-center">Apply All</Button>
                                                <Button variant="ghost" className="!py-1.5 !px-3 !text-xs w-full justify-center" onClick={() => setAiSuggestions(null)}>Discard</Button>
                                            </div>
                                        </div>
                                    )}

                                    <ul className="space-y-4">
                                        {exp.achievements.map((ach, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-700 dark:text-gray-300">
                                                <span className="mt-1.5 w-1.5 h-1.5 bg-primary rounded-full shrink-0" />
                                                <span className="leading-relaxed"><HighlightedText text={ach} /></span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {exp.tags && (
                                    <div>
                                        <h4 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-3">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {exp.tags.map(tag => (
                                                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-white/5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const MobileDashboard: React.FC<MobileDashboardProps> = ({ language, content, layout }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'resume'>('profile');
    const [expandedSummary, setExpandedSummary] = useState(false);
    const [selectedExpId, setSelectedExpId] = useState<string | null>(null);

    const { personalInfo, experience, skills, education, metrics } = content;
    
    // Use layout from props or fallback to default
    const mobileConfig = layout?.mobile || DEFAULT_MOBILE_LAYOUT;
    const activeBlocks = mobileConfig.tabs[activeTab].blocks.sort((a, b) => a.order - b.order);
    const globalStyle = mobileConfig.style;

    const selectedExp = experience.find(e => e.id === selectedExpId) || null;

    const renderBlock = (block: MobileBentoBlock) => {
        if (!block.visible) return null;
        
        // Resolve style for this specific card
        const cardStyle = resolveCardStyle(globalStyle, block);
        
        // Alignment classes
        const alignmentClass = block.alignment === 'center' ? 'text-center items-center' : 
                             block.alignment === 'right' ? 'text-right items-end' : 
                             block.alignment === 'justify' ? 'text-justify' : 'text-left items-start';

        // Snapping logic (simulated with CSS grid or motion props)
        const snapProps = block.snapToGrid ? {
            dragSnapToGrid: true,
            dragElastic: 0.1
        } : {};

        switch (block.kind) {
            case 'identity':
                return (
                    <GlassBentoCard key={block.id} colSpan={block.colSpan} styleConfig={cardStyle} className={`flex flex-col pt-8 pb-6 border-t-4 border-t-primary/80 ${alignmentClass}`}>
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-[#1E1E1E] shadow-md mb-4 relative">
                            <img src={personalInfo.avatar} alt={personalInfo.name} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full border-2 border-white dark:border-[#1E1E1E] flex items-center justify-center">
                                <Check size={12} className="text-black stroke-[4]" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold mb-1">{personalInfo.name}</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-3">{personalInfo.title}</p>
                        
                        <div className={`flex flex-wrap gap-2 mb-6 px-4 ${block.alignment === 'center' ? 'justify-center' : block.alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
                            {['Product', 'Design Systems', 'AI Workflow'].map(tag => (
                                <span key={tag} className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className={`flex gap-4 w-full px-4 ${block.alignment === 'center' ? 'justify-center' : block.alignment === 'right' ? 'justify-end' : 'justify-start'}`}>
                            <a href={`mailto:${personalInfo.email}`} className="p-3 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white hover:bg-primary hover:text-black transition-colors">
                                <Mail size={20} />
                            </a>
                            <a href={`https://${personalInfo.website}`} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white hover:bg-primary hover:text-black transition-colors">
                                <Globe size={20} />
                            </a>
                            <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="p-3 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white hover:bg-primary hover:text-black transition-colors">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </GlassBentoCard>
                );

            case 'metrics':
                return (
                   <React.Fragment key={block.id}>
                        {(metrics || []).slice(0, 4).map((metric, idx) => (
                             <GlassBentoCard key={`${block.id}-${idx}`} colSpan={1} styleConfig={cardStyle} className={`flex flex-col justify-between h-24 ${alignmentClass}`}>
                                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">{metric.label}</span>
                                <span className={`text-2xl font-bold ${metric.accent ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                    {metric.value}
                                </span>
                            </GlassBentoCard>
                        ))}
                   </React.Fragment>
                );

            case 'summary':
                return (
                    <GlassBentoCard key={block.id} colSpan={block.colSpan} styleConfig={cardStyle} onClick={() => setExpandedSummary(!expandedSummary)} className={alignmentClass}>
                        <div className={`flex justify-between items-center mb-2 w-full ${block.alignment === 'right' ? 'flex-row-reverse' : ''}`}>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">About</h3>
                            <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedSummary ? 'rotate-180' : ''}`} />
                        </div>
                        <div className={`text-sm leading-relaxed text-gray-600 dark:text-gray-300 relative ${!expandedSummary ? 'line-clamp-3' : ''} ${block.alignment === 'center' ? 'text-center' : block.alignment === 'right' ? 'text-right' : 'text-left'}`}>
                            <HighlightedText text={personalInfo.summary} />
                            {!expandedSummary && (
                                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white/90 dark:from-[#0f0f0f] to-transparent" />
                            )}
                        </div>
                    </GlassBentoCard>
                );

            case 'clients':
                 if (!personalInfo.clients) return null;
                 return (
                    <GlassBentoCard key={block.id} colSpan={block.colSpan} styleConfig={cardStyle}>
                        <div className="flex justify-between items-end mb-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Signature Clients</h3>
                            <span className="text-[9px] bg-primary text-black px-1.5 py-0.5 rounded font-bold">FORTUNE 500</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {personalInfo.clients.map(client => (
                                <span key={client} className="px-3 py-1.5 bg-gray-100 dark:bg-white/10 rounded-lg text-xs font-bold text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-white/5">
                                    {client}
                                </span>
                            ))}
                        </div>
                    </GlassBentoCard>
                 );

            case 'filters':
                return (
                    <div key={block.id} className="col-span-2 flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                        {['All', 'Highlight', 'PM', 'Design', 'Tech'].map(filter => (
                            <button key={filter} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors ${filter === 'All' ? 'bg-primary border-primary text-black' : 'bg-transparent border-gray-300 dark:border-gray-700 text-gray-500'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                );

            case 'experienceList':
                return (
                    <React.Fragment key={block.id}>
                        <div className="col-span-2 flex items-center gap-2 mt-2 mb-1">
                             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Experience</h3>
                             <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
                        </div>
                        {experience.map(exp => (
                            <div key={exp.id} className="col-span-2">
                                <ExperienceBentoCard 
                                    exp={exp} 
                                    styleConfig={cardStyle}
                                    onExpand={() => setSelectedExpId(exp.id)}
                                />
                            </div>
                        ))}
                    </React.Fragment>
                );

            case 'skills':
                return (
                    <React.Fragment key={block.id}>
                        <div className="col-span-2 flex items-center gap-2 mt-4 mb-1">
                             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Skills</h3>
                             <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
                        </div>
                        {skills.map((cat, idx) => (
                             <GlassBentoCard key={`${block.id}-${idx}`} colSpan={1} styleConfig={cardStyle} className="flex flex-col gap-2 min-h-[100px]">
                                <div className="p-2 bg-gray-100 dark:bg-white/5 w-fit rounded-lg text-gray-500">
                                    {idx === 0 ? <Sparkles size={14} /> : idx === 1 ? <Briefcase size={14} /> : <LinkIcon size={14} />}
                                </div>
                                <h4 className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-auto">{cat.title}</h4>
                                <p className="text-[10px] text-gray-500 line-clamp-2">
                                    {cat.skills.map(s => typeof s === 'string' ? s : s.name).join(', ')}
                                </p>
                            </GlassBentoCard>
                        ))}
                    </React.Fragment>
                );
            
            case 'education':
                return (
                     <React.Fragment key={block.id}>
                        <div className="col-span-2 flex items-center gap-2 mt-4 mb-1">
                             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 px-1">Education</h3>
                             <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800"></div>
                        </div>
                        {education.map((edu, idx) => (
                             <GlassBentoCard key={`${block.id}-${idx}`} colSpan={2} styleConfig={cardStyle} className="flex gap-3 items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 shrink-0">
                                    <GraduationCap size={18} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">{edu.school}</h4>
                                    <p className="text-[10px] text-gray-500">{edu.degree} • {edu.year}</p>
                                </div>
                            </GlassBentoCard>
                        ))}
                    </React.Fragment>
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-background-light dark:bg-background-dark text-gray-900 dark:text-white font-sans">
            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto pb-24 px-4 pt-6 custom-scrollbar">
                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className={`grid pb-8`} style={{ gridTemplateColumns: `repeat(${layout?.mobile?.columns || 2}, minmax(0, 1fr))`, gap: `${layout?.mobile?.gap || 16}px` }}
                    >
                        {activeBlocks.map(renderBlock)}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#060A12] dark:via-[#060A12]/90 dark:to-transparent z-40">
                <div className="bg-gray-900 dark:bg-white/10 backdrop-blur-xl rounded-full p-1.5 flex shadow-2xl border border-white/10 max-w-sm mx-auto">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-sm font-bold transition-all duration-300 ${
                            activeTab === 'profile' 
                            ? 'bg-primary text-black shadow-sm scale-100'
                            : 'text-gray-400 dark:text-gray-400 hover:text-white'
                        }`}
                    >
                        <User size={18} />
                        Profile
                    </button>
                    <button 
                        onClick={() => setActiveTab('resume')}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full text-sm font-bold transition-all duration-300 ${
                            activeTab === 'resume' 
                            ? 'bg-primary text-black shadow-sm scale-100'
                            : 'text-gray-400 dark:text-gray-400 hover:text-white'
                        }`}
                    >
                        <FileText size={18} />
                        Resume
                    </button>
                </div>
            </div>
            
            {/* Detail Sheet */}
            <ExperienceDetailSheet 
                exp={selectedExp} 
                isOpen={!!selectedExp} 
                onClose={() => setSelectedExpId(null)} 
            />
        </div>
    );
};

export default MobileDashboard;
