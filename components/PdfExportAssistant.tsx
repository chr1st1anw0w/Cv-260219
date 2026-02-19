
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileDown,
    X,
    Wand2,
    Printer,
    Loader2,
    ZoomIn,
    ZoomOut,
    Maximize,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Check,
    Download,
    Eye,
    Settings,
    Layout,
    BookOpen,
    Zap,
    AlignJustify,
    Type,
    Minimize,
    Brain,
    Image as ImageIcon,
    Info,
    RefreshCw,
    ExternalLink,
    FileText,
    Minus,
    Plus,
    Sparkles
} from 'lucide-react';
import { ContentData, Language } from '../types';
import { onePageMagician, cleanAICss } from '../services/aiService';

interface PdfExportAssistantProps {
    isOpen?: boolean;
    onClose?: () => void;
    language: Language;
    content: ContentData;
    fullContent: Record<'en' | 'zh', ContentData>;
    onContentUpdate: (newContent: Record<'en' | 'zh', ContentData>, log: string) => void;
}

const PdfExportAssistant: React.FC<PdfExportAssistantProps> = ({
    onClose,
    content,
    language
}) => {
    // UI State
    const [zoom, setZoom] = useState(100);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Layout Optimization
    const [autoPageLimit, setAutoPageLimit] = useState(true);
    const [targetPages, setTargetPages] = useState(2);
    const [prioritizeImpact, setPrioritizeImpact] = useState(false);
    const [removePageBreaks, setRemovePageBreaks] = useState(false);

    // Formatting
    const [fontSize, setFontSize] = useState<'small' | 'standard' | 'large'>('standard');
    const [fontFamily, setFontFamily] = useState<'inter' | 'playfair' | 'roboto'>('inter');
    const [compactSpacing, setCompactSpacing] = useState(false);

    // Tone
    const [tone, setTone] = useState<'confident' | 'balanced' | 'humble'>('balanced');
    const [applyToneSummary, setApplyToneSummary] = useState(true);
    const [applyToneExperience, setApplyToneExperience] = useState(true);

    // File Quality
    const [vectorSharpness, setVectorSharpness] = useState(75);

    // Internal
    const [aiStyles, setAiStyles] = useState<string>('');
    const [layoutAnalysis, setLayoutAnalysis] = useState<any>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Colors
    const PRIMARY_YELLOW = "#f2cc0d";

    // Re-render preview when settings change
    useEffect(() => {
        updateIframePreview();
    }, [
        content, language, aiStyles, 
        fontSize, fontFamily, compactSpacing, removePageBreaks,
        tone, // In a real app, this would trigger content rewriting
    ]);

    const getFontSizeCss = () => {
        switch(fontSize) {
            case 'small': return '9pt';
            case 'large': return '12pt';
            default: return '11pt';
        }
    };

    const getFontFamilyCss = () => {
        switch(fontFamily) {
            case 'playfair': return "'Playfair Display', serif";
            case 'roboto': return "'Roboto Mono', monospace";
            default: return "'Inter', sans-serif";
        }
    };

    const updateIframePreview = () => {
        if (iframeRef.current) {
            const doc = iframeRef.current.contentDocument;
            if (doc) {
                const baseFontSize = getFontSizeCss();
                const font = getFontFamilyCss();
                const spacingMultiplier = compactSpacing ? 0.8 : 1.5;

                // Base CSS
                let css = `
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap');
                    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap');
                    @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');
                    
                    @page { margin: 0; size: A4; }
                    
                    body { 
                        font-family: ${font}; 
                        font-size: ${baseFontSize};
                        line-height: ${spacingMultiplier};
                        color: #1c190d; 
                        background: white;
                        margin: 0;
                        padding: 20mm; /* A4 Margin */
                        box-sizing: border-box;
                        width: 210mm;
                        min-height: 297mm; /* A4 Height */
                    }
                    *, *:before, *:after { box-sizing: inherit; }
                    
                    h1 { font-size: 2.5em; margin: 0; font-weight: 900; letter-spacing: -0.02em; line-height: 1.2; }
                    h2 { font-size: 1.2em; margin: 1.5em 0 0.5em 0; border-bottom: 2px solid ${PRIMARY_YELLOW}; padding-bottom: 2mm; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 700; }
                    h3 { font-size: 1.1em; font-weight: 700; margin: 0; }
                    p { margin: 0; color: #4b5563; }
                    
                    .header { margin-bottom: 10mm; display: flex; justify-content: space-between; align-items: flex-start; }
                    .role-title { font-size: 0.9em; color: #9c8e49; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 1mm; }
                    .contact-info { text-align: right; font-size: 0.9em; line-height: 1.6; color: #6b7280; }
                    
                    .section { margin-bottom: 8mm; }
                    .exp-item { margin-bottom: 5mm; }
                    .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1mm; }
                    .date { font-family: 'Roboto Mono', monospace; font-size: 0.85em; color: #9ca3af; }
                    
                    ul { margin: 2mm 0 0 0; padding-left: 4mm; }
                    li { margin-bottom: 1mm; color: #4b5563; }
                    
                    .skills-grid { display: flex; flex-wrap: wrap; gap: 2mm; }
                    .tag { display: inline-block; background: #f3f4f6; padding: 1mm 3mm; border-radius: 4px; font-size: 0.85em; font-weight: 500; color: #374151; }

                    ${removePageBreaks ? '' : '@media print { .section { break-inside: avoid; } }'}
                    
                    /* AI Auto-Fit Overrides */
                    ${aiStyles}
                `;

                const htmlContent = `
                    <!DOCTYPE html>
                    <html>
                    <head><style>${css}</style></head>
                    <body>
                        <div class="header">
                            <div>
                                <h1>${content.personalInfo.name}</h1>
                                <div class="role-title">${content.personalInfo.title}</div>
                            </div>
                            <div class="contact-info">
                                <div>${content.personalInfo.email}</div>
                                <div>${content.personalInfo.phone}</div>
                                <div>${content.personalInfo.location}</div>
                                <div>${content.personalInfo.website}</div>
                            </div>
                        </div>

                        ${content.personalInfo.summary ? `
                        <div class="section">
                            <h2>Summary</h2>
                            <p>${content.personalInfo.summary}</p>
                        </div>
                        ` : ''}

                        <div class="section">
                            <h2>Experience</h2>
                            ${content.experience.map(exp => `
                                <div class="exp-item">
                                    <div class="exp-header">
                                        <h3>${exp.company} — <span style="font-weight:400">${exp.title}</span></h3>
                                        <span class="date">${exp.period}</span>
                                    </div>
                                    <p>${exp.summary}</p>
                                    <ul>${exp.achievements.map(a => `<li>${a}</li>`).join('')}</ul>
                                </div>
                            `).join('')}
                        </div>

                        <div class="section">
                            <h2>Skills</h2>
                            <div class="skills-grid">
                                ${content.skills.map(cat => cat.skills.map(s => 
                                    `<span class="tag">${typeof s === 'string' ? s : s.name}</span>`
                                ).join('')).join('')}
                            </div>
                        </div>

                        <div class="section">
                            <h2>Education</h2>
                            ${content.education.map(edu => `
                                <div class="exp-item">
                                    <div class="exp-header">
                                        <h3>${edu.school}</h3>
                                        <span class="date">${edu.year}</span>
                                    </div>
                                    <p>${edu.degree}</p>
                                </div>
                            `).join('')}
                        </div>
                    </body>
                    </html>
                `;
                doc.open();
                doc.write(htmlContent);
                doc.close();
            }
        }
    };

    const handleAutoFit = async () => {
        setIsGenerating(true);
        try {
            // 1. Prepare text data for analysis
            const textData = `
                ${content.personalInfo.name} - ${content.personalInfo.title}
                Summary: ${content.personalInfo.summary}
                Experience: ${content.experience.map(exp => `${exp.title} at ${exp.company}: ${exp.summary} ${exp.achievements.join(' ')}`).join('\n')}
                Education: ${content.education.map(edu => `${edu.degree} from ${edu.school}`).join('\n')}
                Skills: ${content.skills.map(cat => `${cat.title}: ${cat.skills.join(', ')}`).join('\n')}
            `;
            const wordCount = textData.split(/\s+/).length;

            // 2. Call AI
            const result = await onePageMagician(textData, wordCount);
            
            if (result) {
                setLayoutAnalysis(result);
                
                // 3. Generate CSS from AI variables
                const vars = result.cssVariables;
                const css = `
                    body { 
                        font-size: ${vars.fontSizeBody || '11pt'}; 
                        line-height: ${vars.lineHeight || '1.4'};
                        padding: ${vars.marginTop || '20mm'} ${vars.marginRight || '20mm'} ${vars.marginBottom || '20mm'} ${vars.marginLeft || '20mm'};
                    }
                    h1 { font-size: ${vars.fontSizeH1 || '2.5em'}; padding: ${vars.headerPadding || '0'}; }
                    h2 { font-size: ${vars.fontSizeH2 || '1.2em'}; margin-top: ${vars.sectionGap || '1.5em'}; }
                    h3 { font-size: ${vars.fontSizeH3 || '1.1em'}; }
                    .section { margin-bottom: ${vars.sectionGap || '8mm'}; }
                    .exp-item { margin-bottom: ${vars.itemGap || '5mm'}; }
                    li { margin-bottom: ${vars.itemGap || '1mm'}; }
                    
                    /* Visual Hierarchy Adjustments */
                    ${result.visualHierarchy?.emphasisStrategy === 'bold-metrics' ? `
                        li b, li strong { color: var(--color-primary); font-weight: 800; }
                    ` : ''}
                `;
                setAiStyles(css);
            }
        } catch (error) {
            console.error("Auto-fit error:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.print();
        }
    };

    return (
        <div className="flex h-full w-full bg-[#f4f1e7] dark:bg-[#1a1810] text-[#1c190d] dark:text-gray-100 font-sans overflow-hidden">
            
            {/* LEFT: A4 Preview Pane (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col w-1/2 relative overflow-hidden border-r border-[#e8e4ce] dark:border-[#333]">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 z-10 px-6 py-4 bg-[#f4f1e7]/90 dark:bg-[#1a1810]/90 backdrop-blur-sm border-b border-[#e8e4ce] dark:border-[#333] flex items-center justify-between">
                    <h3 className="font-bold text-[#1c190d] dark:text-white flex items-center gap-2">
                        <FileText size={20} className="text-[#9c8e49]" />
                        A4 Preview
                    </h3>
                    <div className="flex items-center gap-2 bg-white dark:bg-[#222] rounded-full p-1 border border-[#e8e4ce] dark:border-[#333] shadow-sm">
                        <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="size-8 flex items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 text-[#1c190d] dark:text-white transition-colors" title="Zoom Out">
                            <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold w-12 text-center select-none">{zoom}%</span>
                        <button onClick={() => setZoom(z => Math.min(150, z + 10))} className="size-8 flex items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 text-[#1c190d] dark:text-white transition-colors" title="Zoom In">
                            <Plus size={14} />
                        </button>
                        <div className="w-px h-4 bg-[#e8e4ce] dark:bg-[#333] mx-1"></div>
                        <button onClick={() => setZoom(100)} className="size-8 flex items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 text-[#1c190d] dark:text-white transition-colors" title="Fit to Page">
                            <Maximize size={14} />
                        </button>
                        <button className="size-8 flex items-center justify-center rounded-full hover:bg-gray-50 dark:hover:bg-gray-800 text-[#1c190d] dark:text-white transition-colors" title="Open in New Window">
                            <ExternalLink size={14} />
                        </button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-12 pt-24 flex flex-col items-center">
                    <motion.div 
                        animate={{ scale: zoom / 100 }}
                        className="w-[210mm] min-h-[297mm] bg-white shadow-2xl relative overflow-hidden flex flex-col origin-top transition-transform duration-200"
                    >
                        <iframe 
                            ref={iframeRef}
                            title="PDF Preview"
                            className="w-full h-full min-h-[297mm] border-none pointer-events-none"
                        />
                        {/* Page Number Overlay */}
                        <div className="absolute top-4 right-4 opacity-30 pointer-events-none">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page 1 / {targetPages}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT: Config Sidebar */}
            <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#151515] relative overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pb-32 space-y-10">
                    
                    {/* Header */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
                                <Sparkles size={16} />
                                <span>Advanced Export</span>
                            </div>
                            <button className="text-xs font-bold text-[#9c8e49] hover:text-primary underline decoration-dotted underline-offset-4 cursor-pointer">
                                Reset to Default
                            </button>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-[#1c190d] dark:text-white tracking-tight">Smart PDF Settings</h1>
                        <p className="text-[#9c8e49] text-base md:text-lg leading-relaxed">Tailor your professional persona for the final document delivery.</p>
                    </div>

                    {/* Layout Analysis (AI Feedback) */}
                    <AnimatePresence>
                        {layoutAnalysis && (
                            <motion.section 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-[#1c190d] dark:text-white flex items-center gap-2">
                                        <Brain size={20} className="text-primary" /> AI Layout Analysis
                                    </h3>
                                    <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-wider border border-primary/20">
                                        Density: {Math.round((layoutAnalysis.analysis?.densityScore || 0) * 100)}%
                                    </div>
                                </div>
                                
                                <div className="bg-[#fcfbf8] dark:bg-[#1a1810] p-6 rounded-2xl border border-primary/10 space-y-4 shadow-sm">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-[#9c8e49] uppercase tracking-wider">Focal Point</p>
                                            <p className="text-sm font-bold text-[#1c190d] dark:text-white capitalize">{layoutAnalysis.visualHierarchy?.focalPoint || 'Balanced'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-[#9c8e49] uppercase tracking-wider">Strategy</p>
                                            <p className="text-sm font-bold text-[#1c190d] dark:text-white capitalize">{layoutAnalysis.analysis?.strategy?.replace('-', ' ') || 'Standard'}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <p className="text-[10px] font-bold text-[#9c8e49] uppercase tracking-wider">Visual Hierarchy Strategy</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                            "{layoutAnalysis.visualHierarchy?.whiteSpaceBalance}"
                                        </p>
                                    </div>

                                    {layoutAnalysis.analysis?.clutterZones?.length > 0 && (
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-bold text-[#9c8e49] uppercase tracking-wider">Clutter Zones</p>
                                            <div className="flex flex-wrap gap-2">
                                                {layoutAnalysis.analysis.clutterZones.map((zone: string, i: number) => (
                                                    <span key={i} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-bold rounded-md border border-red-100 dark:border-red-900/30">
                                                        {zone}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    
                                    {layoutAnalysis.cuts?.length > 0 && (
                                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                                            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                                                <Info size={14} />
                                                <p className="text-[10px] font-bold uppercase tracking-wider">Pruning Suggestions</p>
                                            </div>
                                            <div className="space-y-2">
                                                {layoutAnalysis.cuts.slice(0, 2).map((cut: any, i: number) => (
                                                    <div key={i} className="p-2 bg-amber-50/50 dark:bg-amber-900/10 rounded-lg border border-amber-100 dark:border-amber-900/20">
                                                        <p className="text-xs font-bold text-amber-800 dark:text-amber-300">{cut.action} {cut.target}</p>
                                                        <p className="text-[10px] text-amber-600 dark:text-amber-500 mt-0.5">{cut.reason}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.section>
                        )}
                    </AnimatePresence>

                    {/* Layout Optimization */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[#1c190d] dark:text-white flex items-center gap-2">
                                <Layout size={20} /> Layout Optimization
                            </h3>
                            <span className="text-xs font-bold text-[#9c8e49] bg-[#fcfbf8] dark:bg-[#222] border border-[#e8e4ce] dark:border-[#333] px-2 py-1 rounded-md">
                                Current: {targetPages} Pages
                            </span>
                        </div>

                        <div className="grid gap-3">
                            {/* Auto Page Limit */}
                            <label className={`flex items-center justify-between p-4 bg-[#fcfbf8] dark:bg-[#1a1810] rounded-xl border-2 transition-all cursor-pointer group ${autoPageLimit ? 'border-primary/20' : 'border-transparent'}`}>
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-white dark:bg-[#222] flex items-center justify-center text-primary border border-[#e8e4ce] dark:border-[#333]">
                                        <BookOpen size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <p className="font-bold text-[#1c190d] dark:text-white text-sm">Auto Page Limit Control</p>
                                            <select 
                                                value={targetPages}
                                                onChange={(e) => setTargetPages(Number(e.target.value))}
                                                disabled={!autoPageLimit}
                                                className="ml-2 py-0.5 pl-2 pr-7 text-xs font-bold rounded-md border-gray-200 dark:border-gray-700 bg-white dark:bg-[#222] focus:border-primary focus:ring-primary cursor-pointer disabled:opacity-50"
                                            >
                                                <option value={1}>1 Page</option>
                                                <option value={2}>2 Pages</option>
                                                <option value={3}>3 Pages</option>
                                            </select>
                                        </div>
                                        <p className="text-xs text-[#9c8e49]">AI adjusts spacing to fit exact page count</p>
                                    </div>
                                </div>
                                <input 
                                    type="checkbox" 
                                    checked={autoPageLimit}
                                    onChange={(e) => setAutoPageLimit(e.target.checked)}
                                    className="size-5 rounded-full border-[#e8e4ce] text-primary focus:ring-primary" 
                                />
                            </label>

                            {/* Prioritize Impact */}
                            <label className="flex items-center justify-between p-4 bg-[#fcfbf8] dark:bg-[#1a1810] rounded-xl border-2 border-transparent hover:border-primary/20 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-white dark:bg-[#222] flex items-center justify-center text-primary border border-[#e8e4ce] dark:border-[#333]">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#1c190d] dark:text-white text-sm">Prioritize Impact Highlights</p>
                                        <p className="text-xs text-[#9c8e49]">Bold key metrics and achievements automatically</p>
                                    </div>
                                </div>
                                <input 
                                    type="checkbox"
                                    checked={prioritizeImpact}
                                    onChange={(e) => setPrioritizeImpact(e.target.checked)}
                                    className="size-5 rounded-full border-[#e8e4ce] text-primary focus:ring-primary" 
                                />
                            </label>

                            {/* Remove Page Breaks */}
                            <label className="flex items-center justify-between p-4 bg-[#fcfbf8] dark:bg-[#1a1810] rounded-xl border-2 border-transparent hover:border-primary/20 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 rounded-full bg-white dark:bg-[#222] flex items-center justify-center text-primary border border-[#e8e4ce] dark:border-[#333]">
                                        <AlignJustify size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#1c190d] dark:text-white text-sm">Remove Page Breaks</p>
                                        <p className="text-xs text-[#9c8e49]">Continuous flow for digital screen reading</p>
                                    </div>
                                </div>
                                <input 
                                    type="checkbox"
                                    checked={removePageBreaks}
                                    onChange={(e) => setRemovePageBreaks(e.target.checked)}
                                    className="size-5 rounded-full border-[#e8e4ce] text-primary focus:ring-primary" 
                                />
                            </label>
                            
                            {/* Auto-Fit Action */}
                            <button 
                                onClick={handleAutoFit}
                                disabled={isGenerating}
                                className="w-full mt-2 py-2.5 rounded-xl border border-dashed border-[#e8e4ce] dark:border-[#333] text-[#9c8e49] hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all text-xs font-bold flex items-center justify-center gap-2"
                            >
                                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                                {isGenerating ? "Optimizing Layout..." : "Re-Run Auto Optimization"}
                            </button>
                        </div>
                    </section>

                    {/* Formatting */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-bold text-[#1c190d] dark:text-white flex items-center gap-2">
                            <Type size={20} /> Formatting
                        </h3>
                        <div className="bg-[#fcfbf8] dark:bg-[#1a1810] p-6 rounded-xl space-y-6 border border-transparent dark:border-[#333]">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#9c8e49] block">Font Size</label>
                                    <div className="relative">
                                        <select 
                                            value={fontSize}
                                            onChange={(e) => setFontSize(e.target.value as any)}
                                            className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-[#222] border border-[#e8e4ce] dark:border-[#333] rounded-xl text-sm font-semibold text-[#1c190d] dark:text-white focus:ring-primary focus:border-primary appearance-none cursor-pointer"
                                        >
                                            <option value="small">Small (9pt)</option>
                                            <option value="standard">Standard (11pt)</option>
                                            <option value="large">Large (12pt)</option>
                                        </select>
                                        <ChevronDown size={14} className="pointer-events-none absolute inset-y-0 right-3 top-1/2 -translate-y-1/2 text-[#9c8e49]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-[#9c8e49] block">Font Family</label>
                                    <div className="relative">
                                        <select 
                                            value={fontFamily}
                                            onChange={(e) => setFontFamily(e.target.value as any)}
                                            className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-[#222] border border-[#e8e4ce] dark:border-[#333] rounded-xl text-sm font-semibold text-[#1c190d] dark:text-white focus:ring-primary focus:border-primary appearance-none cursor-pointer"
                                        >
                                            <option value="inter">Inter (Sans)</option>
                                            <option value="playfair">Playfair (Serif)</option>
                                            <option value="roboto">Roboto (Mono)</option>
                                        </select>
                                        <ChevronDown size={14} className="pointer-events-none absolute inset-y-0 right-3 top-1/2 -translate-y-1/2 text-[#9c8e49]" />
                                    </div>
                                </div>
                            </div>
                            
                            <label className="flex items-center justify-between p-4 bg-white dark:bg-[#222] border border-[#e8e4ce] dark:border-[#333] rounded-xl hover:border-primary/40 transition-all cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Minimize size={18} className="text-[#9c8e49]" />
                                    <span className="text-sm font-bold text-[#1c190d] dark:text-white">Compact Paragraph Spacing</span>
                                </div>
                                <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:bg-gray-300 dark:hover:bg-gray-600 has-[:checked]:bg-primary">
                                    <input 
                                        type="checkbox"
                                        checked={compactSpacing}
                                        onChange={(e) => setCompactSpacing(e.target.checked)}
                                        className="peer sr-only" 
                                    />
                                    <span className="inline-block size-4 translate-x-1 rounded-full bg-white transition-transform peer-checked:translate-x-6"></span>
                                </div>
                            </label>
                        </div>
                    </section>

                    {/* Tone Adjustment */}
                    <section className="space-y-4">
                        <h3 className="text-xl font-bold text-[#1c190d] dark:text-white flex items-center gap-2">
                            <Brain size={20} /> Tone Adjustment
                        </h3>
                        <div className="bg-[#fcfbf8] dark:bg-[#1a1810] p-6 rounded-xl space-y-5 border border-transparent dark:border-[#333]">
                            <p className="text-xs text-[#9c8e49]">AI-driven adjustments for your professional tone of voice.</p>
                            
                            <div className="flex p-1 bg-white dark:bg-[#222] border border-[#e8e4ce] dark:border-[#333] rounded-lg">
                                {['confident', 'balanced', 'humble'].map((t) => (
                                    <label key={t} className="flex-1 cursor-pointer">
                                        <input 
                                            type="radio" 
                                            name="tone_segment" 
                                            className="hidden peer" 
                                            checked={tone === t} 
                                            onChange={() => setTone(t as any)}
                                        />
                                        <div className="py-2 px-3 text-center text-xs font-bold text-[#9c8e49] capitalize rounded-md peer-checked:bg-primary/10 peer-checked:text-primary transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                                            {t}
                                        </div>
                                    </label>
                                ))}
                            </div>
                            
                            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-[#e8e4ce]/50 dark:border-[#333]">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox"
                                        checked={applyToneSummary}
                                        onChange={(e) => setApplyToneSummary(e.target.checked)}
                                        className="size-4 rounded border-[#e8e4ce] text-primary focus:ring-primary" 
                                    />
                                    <span className="text-xs font-medium text-[#1c190d] dark:text-gray-300 group-hover:text-primary transition-colors">Apply to Summary</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input 
                                        type="checkbox"
                                        checked={applyToneExperience}
                                        onChange={(e) => setApplyToneExperience(e.target.checked)}
                                        className="size-4 rounded border-[#e8e4ce] text-primary focus:ring-primary" 
                                    />
                                    <span className="text-xs font-medium text-[#1c190d] dark:text-gray-300 group-hover:text-primary transition-colors">Apply to Experience</span>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* File Quality */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-[#1c190d] dark:text-white flex items-center gap-2">
                                <ImageIcon size={20} /> File Quality
                            </h3>
                            <span className="bg-[#fcfbf8] dark:bg-[#222] px-3 py-1 rounded-full border border-[#e8e4ce] dark:border-[#333] text-[10px] font-bold uppercase text-[#9c8e49]">
                                Best for ATS
                            </span>
                        </div>
                        <div className="bg-[#fcfbf8] dark:bg-[#1a1810] p-6 rounded-xl space-y-6 border border-transparent dark:border-[#333]">
                            <div className="flex justify-between text-[10px] font-bold text-[#9c8e49] uppercase tracking-wider">
                                <span>Minimum Size</span>
                                <span>Vector Sharpness</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={vectorSharpness} 
                                onChange={(e) => setVectorSharpness(Number(e.target.value))}
                                className="w-full h-2 bg-[#e8e4ce] dark:bg-[#333] rounded-lg appearance-none cursor-pointer accent-primary" 
                            />
                            <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-xl border border-primary/20">
                                <Info size={16} className="text-primary mt-0.5 shrink-0" />
                                <p className="text-xs text-[#1c190d] dark:text-gray-300 leading-relaxed">
                                    High vector sharpness ensures text remains crystal clear at any zoom level, though it may slightly increase file size (Estimated: 2.4MB).
                                </p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Fixed Bottom Bar */}
                <footer className="absolute bottom-0 right-0 w-full bg-white/90 dark:bg-[#151515]/90 backdrop-blur-xl border-t border-[#e8e4ce] dark:border-[#333] p-6 z-30">
                    <div className="max-w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="hidden sm:block">
                            <p className="text-sm font-black text-[#1c190d] dark:text-white">Final Export Settings</p>
                            <p className="text-xs text-[#9c8e49]">Ready for LinkedIn & Job Portals</p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none px-6 py-4 bg-white dark:bg-[#222] border-2 border-[#e8e4ce] dark:border-[#333] text-[#1c190d] dark:text-white font-bold rounded-full hover:bg-[#fcfbf8] dark:hover:bg-[#333] transition-all whitespace-nowrap">
                                Preview Fullscreen
                            </button>
                            <button 
                                onClick={handleDownload}
                                disabled={isGenerating}
                                className="flex-1 sm:flex-none px-8 py-4 bg-primary text-black font-black rounded-full shadow-[0_10px_25px_-5px_rgba(242,204,13,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" /> Processing...
                                    </>
                                ) : (
                                    <>
                                        <Download size={20} /> Download PDF
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PdfExportAssistant;
