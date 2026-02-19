
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, Palette, Type, Sliders, Image as ImageIcon, 
    Upload, Wand2, RefreshCw, Layers, Monitor, RotateCcw, 
    Check, ChevronDown, Download, Loader2, Maximize2 
} from 'lucide-react';
import { CustomTheme, Language, LayoutConfig } from '../types';
import Button from './ui/Button';
import { generateThemeFromImage, editImageWithAI, generateImage } from '../services/aiService';
import AssetEngine from './AssetEngine';

interface StyleEditorProps {
    isOpen?: boolean; // Optional now as it might be embedded
    onClose?: () => void;
    onUpdateTheme: (theme: CustomTheme) => void;
    currentTheme: CustomTheme;
    language: Language;
    onApplyAsset?: (target: string, value: string) => void;
}

const StyleEditor: React.FC<StyleEditorProps> = ({ 
    onUpdateTheme, 
    currentTheme,
    language,
    onApplyAsset
}) => {
    // Robust safety guard
    if (!currentTheme) return null;
    
    // Ensure colors exist to prevent "undefined is not an object" when accessing properties
    const safeColors = currentTheme.colors || {
        primary: '#000000',
        primaryHover: '#333333',
        backgroundLight: '#ffffff',
        backgroundDark: '#000000',
        cardLight: '#ffffff',
        cardDark: '#111111',
        textLight: '#000000',
        textDark: '#ffffff'
    };

    const safeDesignSystem = currentTheme.designSystem || {
        borderRadius: 24,
        spacingScale: 1,
        fontScale: 1,
        fontBody: 'Inter',
        fontHeading: 'Plus Jakarta Sans',
        shadowStrength: 'soft',
        iconStyle: 'standard'
    };

    const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'other' | 'ai'>('colors');
    
    // AI / Nano Banana State
    const [aiMode, setAiMode] = useState<'theme' | 'image' | 'generate'>('theme');
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [genSize, setGenSize] = useState<'1K' | '2K' | '4K'>('1K');
    
    // Image Edit State
    const [editImageBase64, setEditImageBase64] = useState<string | null>(null);
    const [editImageMime, setEditImageMime] = useState<string | null>(null);
    const [editedResult, setEditedResult] = useState<string | null>(null);
    
    // File Refs
    const themeImageRef = useRef<HTMLInputElement>(null);
    const editImageRef = useRef<HTMLInputElement>(null);

    const handleColorChange = (key: keyof typeof safeColors, value: string) => {
        onUpdateTheme({
            ...currentTheme,
            colors: {
                ...safeColors,
                [key]: value
            }
        });
    };

    const handleDesignSystemChange = (key: string, value: any) => {
        onUpdateTheme({
            ...currentTheme,
            designSystem: {
                ...safeDesignSystem,
                [key]: value
            }
        });
    };

    // --- AI Handlers ---

    const handleGenerateTheme = async () => {
        if (!aiPrompt) return;
        setIsGenerating(true);
        
        try {
            const themeData = await generateThemeFromImage(null, null, aiPrompt);
            if (themeData) {
                onUpdateTheme({
                    ...currentTheme,
                    ...themeData,
                    id: `ai-${Date.now()}`
                });
            }
        } catch (error) {
            console.error("Theme generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleImageEditUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            const [meta, data] = result.split(',');
            const mime = meta.split(':')[1].split(';')[0];
            setEditImageBase64(data);
            setEditImageMime(mime);
            setEditedResult(null);
        };
        reader.readAsDataURL(file);
    };

    const handleNanoBananaEdit = async () => {
        if (!editImageBase64 || !editImageMime || !aiPrompt) return;
        setIsGenerating(true);
        try {
            const result = await editImageWithAI(editImageBase64, editImageMime, aiPrompt);
            if (result) {
                setEditedResult(result);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateImage = async () => {
        if (!aiPrompt) return;
        setIsGenerating(true);
        try {
            const result = await generateImage(aiPrompt, genSize);
            if (result) {
                setEditedResult(result);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="h-full flex flex-col bg-white dark:bg-card-dark border-r border-gray-200 dark:border-gray-800">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-black/20 shrink-0">
                <div>
                    <h2 className="text-sm font-bold flex items-center gap-2 dark:text-white">
                        <Sliders size={16} />
                        Design Studio
                    </h2>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">Customize Interface</p>
                </div>
                <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-gray-500 transition-colors" title="Undo">
                        <RotateCcw size={14} />
                    </button>
                </div>
            </div>

            {/* Main Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
                
                {/* --- COLORS TAB --- */}
                {activeTab === 'colors' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="space-y-3">
                            <SectionHeader title="Primary Colors" />
                            <ColorControl 
                                label="Primary" 
                                value={safeColors.primary} 
                                onChange={(v) => handleColorChange('primary', v)} 
                            />
                            <ColorControl 
                                label="Primary Hover" 
                                value={safeColors.primaryHover} 
                                onChange={(v) => handleColorChange('primaryHover', v)} 
                            />
                        </div>

                        <div className="space-y-3">
                            <SectionHeader title="Backgrounds" />
                            <ColorControl 
                                label="Background Light" 
                                value={safeColors.backgroundLight} 
                                onChange={(v) => handleColorChange('backgroundLight', v)} 
                            />
                            <ColorControl 
                                label="Background Dark" 
                                value={safeColors.backgroundDark} 
                                onChange={(v) => handleColorChange('backgroundDark', v)} 
                            />
                        </div>

                        <div className="space-y-3">
                            <SectionHeader title="Cards & Surface" />
                            <ColorControl 
                                label="Card Light" 
                                value={safeColors.cardLight} 
                                onChange={(v) => handleColorChange('cardLight', v)} 
                            />
                            <ColorControl 
                                label="Card Dark" 
                                value={safeColors.cardDark} 
                                onChange={(v) => handleColorChange('cardDark', v)} 
                            />
                        </div>

                        <div className="space-y-3">
                            <SectionHeader title="Typography Colors" />
                            <ColorControl 
                                label="Text Primary" 
                                value={safeColors.textLight} 
                                onChange={(v) => handleColorChange('textLight', v)} 
                            />
                            <ColorControl 
                                label="Text Inverse" 
                                value={safeColors.textDark} 
                                onChange={(v) => handleColorChange('textDark', v)} 
                            />
                        </div>
                    </div>
                )}

                {/* --- TYPOGRAPHY TAB --- */}
                {activeTab === 'typography' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="space-y-4">
                            <SectionHeader title="Font Family" />
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500">Body Font</label>
                                <select 
                                    className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium dark:text-white outline-none focus:border-brand-volt"
                                    value={safeDesignSystem.fontBody || 'Inter'}
                                    onChange={(e) => handleDesignSystemChange('fontBody', e.target.value)}
                                >
                                    <option value="Inter">Inter (Default)</option>
                                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                                    <option value="Roboto">Roboto</option>
                                    <option value="Open Sans">Open Sans</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-gray-500">Heading Font</label>
                                <select 
                                    className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-medium dark:text-white outline-none focus:border-brand-volt"
                                    value={safeDesignSystem.fontHeading || 'Plus Jakarta Sans'}
                                    onChange={(e) => handleDesignSystemChange('fontHeading', e.target.value)}
                                >
                                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                                    <option value="Inter">Inter</option>
                                    <option value="Playfair Display">Playfair Display (Serif)</option>
                                    <option value="JetBrains Mono">JetBrains Mono (Code)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <SectionHeader title="Scale" />
                            <RangeControl 
                                label="Font Size Scale" 
                                value={safeDesignSystem.fontScale || 1} 
                                min={0.8} max={1.3} step={0.05} 
                                onChange={(v) => handleDesignSystemChange('fontScale', v)} 
                            />
                        </div>
                    </div>
                )}

                {/* --- OTHER TAB --- */}
                {activeTab === 'other' && (
                    <div className="space-y-6 animate-fade-in">
                        <div className="space-y-4">
                            <SectionHeader title="Shape & Spacing" />
                            <RangeControl 
                                label="Border Radius" 
                                value={safeDesignSystem.borderRadius ?? 24} 
                                min={0} max={32} step={2} 
                                suffix="px"
                                onChange={(v) => handleDesignSystemChange('borderRadius', v)} 
                            />
                            <RangeControl 
                                label="Spacing Density" 
                                value={safeDesignSystem.spacingScale || 1} 
                                min={0.5} max={1.5} step={0.1} 
                                suffix="x"
                                onChange={(v) => handleDesignSystemChange('spacingScale', v)} 
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <SectionHeader title="Effects & Icons" />
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 block mb-2">Shadow Depth</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['none', 'soft', 'medium', 'hard'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => handleDesignSystemChange('shadowStrength', s)}
                                                className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                                                    (safeDesignSystem.shadowStrength || 'soft') === s
                                                    ? 'bg-black text-white border-black dark:bg-white dark:text-black'
                                                    : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-xs font-medium text-gray-500 block mb-2">Icon Style</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['thin', 'standard', 'bold'].map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => handleDesignSystemChange('iconStyle', s)}
                                                className={`py-2 px-1 rounded-lg text-[10px] font-bold uppercase border transition-all ${
                                                    (safeDesignSystem.iconStyle || 'standard') === s
                                                    ? 'bg-black text-white border-black dark:bg-white dark:text-black'
                                                    : 'bg-white dark:bg-gray-800 text-gray-500 border-gray-200 dark:border-gray-700'
                                                }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- AI STUDIO TAB --- */}
                {activeTab === 'ai' && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="bg-yellow-50/50 dark:bg-yellow-900/10 p-1.5 rounded-xl border border-yellow-200 dark:border-yellow-800/30 flex gap-1">
                            <button
                                onClick={() => setAiMode('theme')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                    aiMode === 'theme' 
                                    ? 'bg-white dark:bg-black shadow-sm text-black dark:text-white border border-gray-100 dark:border-gray-700' 
                                    : 'text-gray-500 hover:text-black'
                                }`}
                            >
                                Theme
                            </button>
                            <button
                                onClick={() => setAiMode('image')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                    aiMode === 'image' 
                                    ? 'bg-yellow-400 shadow-sm text-black border border-yellow-500' 
                                    : 'text-gray-500 hover:text-black'
                                }`}
                            >
                                Assets
                            </button>
                            <button
                                onClick={() => setAiMode('generate')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                                    aiMode === 'generate' 
                                    ? 'bg-purple-500 shadow-sm text-white border border-purple-600' 
                                    : 'text-gray-500 hover:text-black'
                                }`}
                            >
                                Gen
                            </button>
                        </div>

                        {aiMode === 'theme' ? (
                            <div className="space-y-4">
                                <div className="bg-gradient-to-br from-brand-slate/10 to-brand-volt/10 p-4 rounded-xl border border-brand-slate/20 relative overflow-hidden">
                                    <Sparkles size={80} className="absolute -right-4 -top-4 text-brand-slate/10" />
                                    <div className="relative z-10">
                                        <label className="text-[10px] font-bold uppercase text-brand-slate mb-2 block">Describe your dream aesthetic</label>
                                        <textarea 
                                            value={aiPrompt}
                                            onChange={(e) => setAiPrompt(e.target.value)}
                                            placeholder="e.g. 'Cyberpunk Fintech with neon accents' or 'Minimalist Japanese Tea House'..."
                                            className="w-full h-24 bg-white/50 dark:bg-black/20 rounded-lg p-3 text-xs border border-transparent focus:border-brand-slate outline-none resize-none mb-3"
                                        />
                                        <Button 
                                            onClick={handleGenerateTheme}
                                            loading={isGenerating}
                                            disabled={!aiPrompt}
                                            className="w-full bg-brand-slate text-white hover:bg-brand-slate/90 border-none"
                                        >
                                            <Wand2 size={14} className="mr-2" /> Generate Theme
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : aiMode === 'image' ? (
                            <div className="h-full">
                                {/* Use centralized AssetEngine */}
                                <AssetEngine primaryColor={safeColors.primary} onApplyAsset={onApplyAsset} />
                            </div>
                        ) : (
                            /* Image Generation Studio */
                            <div className="space-y-4">
                                 <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                                    <label className="text-[10px] font-bold uppercase text-purple-600 dark:text-purple-400 mb-2 block">Generation Prompt</label>
                                    <textarea 
                                        value={aiPrompt}
                                        onChange={(e) => setAiPrompt(e.target.value)}
                                        placeholder="Describe the image you want to create..."
                                        className="w-full h-24 bg-white/50 dark:bg-black/20 rounded-lg p-3 text-xs border border-transparent focus:border-purple-500 outline-none resize-none mb-3"
                                    />
                                    
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-bold text-gray-500">Resolution</span>
                                        <div className="flex bg-white dark:bg-black/20 rounded-lg p-0.5 border border-gray-200 dark:border-gray-700">
                                            {['1K', '2K', '4K'].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setGenSize(size as any)}
                                                    className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${
                                                        genSize === size 
                                                        ? 'bg-purple-500 text-white shadow-sm' 
                                                        : 'text-gray-500 hover:text-purple-500'
                                                    }`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <Button 
                                        onClick={handleGenerateImage}
                                        loading={isGenerating}
                                        disabled={!aiPrompt}
                                        className="w-full bg-purple-600 text-white hover:bg-purple-700 border-none"
                                    >
                                        <Sparkles size={14} className="mr-2" /> Generate Image
                                    </Button>
                                </div>

                                {/* Result Area */}
                                {editedResult && (
                                    <div className="p-3 border border-purple-200 bg-purple-50/50 dark:bg-purple-900/10 dark:border-purple-800 rounded-xl">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold uppercase text-purple-700 dark:text-purple-400">Generated</span>
                                            <a href={`data:image/png;base64,${editedResult}`} download="generated-image.png" className="text-[10px] font-bold text-purple-700 hover:underline flex items-center gap-1">
                                                <Download size={12} /> Save
                                            </a>
                                        </div>
                                        <div className="rounded-lg overflow-hidden border border-purple-100 dark:border-purple-800/30">
                                            <img src={`data:image/png;base64,${editedResult}`} className="w-full h-auto" alt="Result" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom Tabs Navigation */}
            <div className="p-2 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-card-dark shrink-0">
                <div className="flex bg-gray-100 dark:bg-gray-900/50 p-1 rounded-xl">
                    {[
                        { id: 'colors', label: 'Colors' },
                        { id: 'typography', label: 'Type' },
                        { id: 'other', label: 'Other' },
                        { id: 'ai', label: 'AI Studio', icon: Sparkles }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 py-3 px-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                                activeTab === tab.id 
                                ? 'bg-white dark:bg-card-dark text-black dark:text-white shadow-sm scale-100' 
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 scale-95'
                            }`}
                        >
                            {/* @ts-ignore */}
                            {tab.icon && <tab.icon size={12} className={activeTab === 'ai' ? 'text-yellow-500 fill-yellow-500' : ''} />}
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// UI Components for the Editor
const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-[10px] font-bold uppercase text-gray-400 tracking-wider flex items-center justify-between">
        {title}
        <ChevronDown size={12} />
    </h3>
);

const ColorControl = ({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) => (
    <div className="flex items-center justify-between group">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">{label}</span>
        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 p-1 pl-2 rounded-md border border-gray-200 dark:border-gray-700 hover:border-brand-volt transition-colors">
            <span className="text-[10px] font-mono text-gray-500 uppercase">{value}</span>
            <div className="relative w-6 h-6 rounded-sm overflow-hidden border border-gray-200 dark:border-gray-600 shadow-sm">
                <input 
                    type="color" 
                    value={value || '#000000'} 
                    onChange={(e) => onChange(e.target.value)}
                    className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 m-0 cursor-pointer"
                />
            </div>
        </div>
    </div>
);

const RangeControl = ({ label, value, min, max, step, suffix = '', onChange }: any) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
            <span className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">{value}{suffix}</span>
        </div>
        <input 
            type="range" min={min} max={max} step={step} 
            value={value} 
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-volt hover:accent-primary"
        />
    </div>
);

export default StyleEditor;
