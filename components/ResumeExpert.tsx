
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Sparkles, ArrowRight, CheckCircle, AlertTriangle, RefreshCw, Briefcase, 
    FileText, X, Target, Zap, TrendingUp, Search, ChevronDown, Check,
    Layout, User, Settings, Plus
} from 'lucide-react';
import { ContentData, Language } from '../types';
import Button from './ui/Button';
import { resumeExpertAgent } from '../services/aiService';

interface ResumeExpertProps {
    content: ContentData;
    language: Language;
    onUpdate: (section: string, data: any) => void;
}

type Tab = 'strategy' | 'content' | 'skills';

const ResumeExpert: React.FC<ResumeExpertProps> = ({ content, language, onUpdate }) => {
    const [targetJD, setTargetJD] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [analysisHadJD, setAnalysisHadJD] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('strategy');
    const [expandedExp, setExpandedExp] = useState<string | null>(null);

    const hasJD = targetJD.trim().length > 0;

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setAnalysisHadJD(hasJD);
        try {
            const data = await resumeExpertAgent(content, targetJD, language);
            setResult(data);
            setActiveTab('strategy');
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const applySummary = (type: 'ats' | 'brand') => {
        if (result?.summaryRewrite) {
            const text = type === 'ats' ? result.summaryRewrite.atsVersion : result.summaryRewrite.brandVersion;
            onUpdate('personalInfo.summary', text);
        }
    };

    const applyBullet = (expId: string, bulletIndex: number, newText: string) => {
        // Find experience index in original content
        const expIndex = content.experience.findIndex(e => e.id === expId);
        if (expIndex === -1) return;
        
        const currentBullets = [...content.experience[expIndex].achievements];
        // Strategy: We append recommended bullets if they don't exist, or replace if user chooses (UI simplification: Append for now)
        // Ideally we'd map 1:1, but AI might suggest 3 bullets for 5 originals.
        // Let's implement "Add as new bullet" for safety.
        
        const newBullets = [...currentBullets, newText];
        // Call the parent update function which handles deep updates
        // We need to construct the full path: experience[index].achievements
        // The AdminView updateLocal handles 'experience' array replacement, or deep path?
        // AdminView updateLocal handles deep paths like 'personalInfo.name'. 
        // For arrays, it's trickier. Let's assume onUpdate handles 'experience' root replacement if needed, 
        // or we pass the full modified experience array.
        
        // Actually AdminView's updateLocal does: target[keys[last]] = value.
        // So we can pass 'experience.0.achievements' if we knew the index.
        // Let's rely on re-constructing the whole experience array to be safe.
        
        const newExperienceArray = [...content.experience];
        newExperienceArray[expIndex] = {
            ...newExperienceArray[expIndex],
            achievements: newBullets
        };
        onUpdate('experience', newExperienceArray);
    };

    const ScoreGauge = ({ score }: { score: number }) => {
        const circumference = 2 * Math.PI * 40;
        const offset = circumference - (score / 100) * circumference;
        const color = score > 80 ? 'text-green-500' : score > 60 ? 'text-yellow-500' : 'text-red-500';

        return (
            <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-gray-700" />
                    <circle 
                        cx="50%" cy="50%" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={offset} 
                        strokeLinecap="round"
                        className={`${color} transition-all duration-1000 ease-out`} 
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${color}`}>{score}</span>
                    <span className="text-[10px] text-gray-400 font-medium">ATS SCORE</span>
                </div>
            </div>
        );
    };

    return (
        <div className="h-full flex flex-col space-y-6">
            {/* Input Section */}
            <div className="bg-white dark:bg-card-dark p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                {!result ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                <Target size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Resume Strategy Expert</h3>
                                <p className="text-xs text-gray-500">Paste a JD for targeted gap analysis, or run a general resume health check without one.</p>
                            </div>
                        </div>
                        <div className="relative">
                            <textarea
                                className="w-full h-40 p-4 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                                placeholder="Paste Job Description here (Optional — leave empty for a general resume health check)..."
                                value={targetJD}
                                onChange={(e) => setTargetJD(e.target.value)}
                            />
                            <span className="absolute top-2 right-3 text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">Optional</span>
                        </div>
                        <Button
                            onClick={handleAnalyze}
                            loading={isAnalyzing}
                            className="w-full justify-center bg-blue-600 hover:bg-blue-700 text-white"
                            icon={<Sparkles size={16} />}
                        >
                            {hasJD ? 'Analyze & Optimize' : 'Run Resume Health Check'}
                        </Button>
                    </div>
                ) : (
                    <div className="flex items-center justify-between">
                         <div className="flex items-center gap-4">
                            <ScoreGauge score={result.atsChecklist?.score || 0} />
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    {analysisHadJD ? 'JD Match Analysis Complete' : 'Resume Health Check Complete'}
                                </h3>
                                <div className="flex gap-2 mt-1">
                                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">
                                        {result.keywords?.mustHave?.length || 0} {analysisHadJD ? 'Key Matches' : 'Core Strengths'}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-bold">
                                        {result.gapAnalysis?.missingOrWeak?.length || 0} {analysisHadJD ? 'Gaps Found' : 'Areas to Improve'}
                                    </span>
                                </div>
                            </div>
                         </div>
                         <Button variant="ghost" onClick={() => setResult(null)} className="text-gray-400">New Analysis</Button>
                    </div>
                )}
            </div>

            {result && (
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-800 mb-6 bg-white dark:bg-card-dark rounded-xl p-1 shadow-sm shrink-0">
                        {(['strategy', 'content', 'skills'] as Tab[]).map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all capitalize flex items-center justify-center gap-2 ${
                                    activeTab === tab 
                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                }`}
                            >
                                {tab === 'strategy' && <Search size={14} />}
                                {tab === 'content' && <FileText size={14} />}
                                {tab === 'skills' && <Zap size={14} />}
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-6">
                        
                        {/* STRATEGY TAB */}
                        {activeTab === 'strategy' && (
                            <div className="space-y-6 animate-fade-in">
                                {/* Keywords */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {['mustHave', 'niceToHave', 'domain'].map((key) => (
                                        <div key={key} className="bg-white dark:bg-card-dark p-4 rounded-xl border border-gray-200 dark:border-gray-800">
                                            <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 tracking-wider">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.keywords?.[key]?.map((k: any, i: number) => (
                                                    <div key={i} className="group relative">
                                                        <span className={`px-2 py-1 text-[10px] font-medium rounded-md border cursor-help ${
                                                            key === 'mustHave' ? 'bg-red-50 text-red-700 border-red-100' :
                                                            key === 'domain' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                            'bg-blue-50 text-blue-700 border-blue-100'
                                                        }`}>
                                                            {k.phrase}
                                                        </span>
                                                        {/* Evidence Tooltip */}
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                                            {k.evidence}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Gap Analysis */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold flex items-center gap-2">
                                        <AlertTriangle size={16} className="text-yellow-500" /> Strategic Gaps
                                    </h4>
                                    {result.gapAnalysis?.missingOrWeak?.map((gap: any, i: number) => (
                                        <div key={i} className="bg-yellow-50/50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30 p-4 rounded-xl">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-bold text-sm text-yellow-800 dark:text-yellow-200">{gap.keywordPhrase}</span>
                                                <span className="text-[10px] font-mono text-yellow-600 uppercase">Missing / Weak</span>
                                            </div>
                                            <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">{gap.whyItMatters}</p>
                                            <div className="bg-white dark:bg-black/20 p-3 rounded-lg border border-yellow-100 dark:border-yellow-800/50">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Fix Strategy</p>
                                                <p className="text-xs text-gray-700 dark:text-gray-300">{gap.fixStrategy}</p>
                                                {gap.questionsToAsk?.length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                                        <p className="text-[10px] font-bold text-blue-500 mb-1">Reflect on:</p>
                                                        <ul className="list-disc pl-4 space-y-1">
                                                            {gap.questionsToAsk.map((q: string, qi: number) => (
                                                                <li key={qi} className="text-[10px] text-gray-600 dark:text-gray-400">{q}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CONTENT TAB */}
                        {activeTab === 'content' && (
                            <div className="space-y-8 animate-fade-in">
                                {/* Summary Section */}
                                <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                    <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                                        <Layout size={16} className="text-primary" /> Professional Summary
                                    </h4>
                                    
                                    <div className="grid grid-cols-1 gap-4">
                                        {/* Original */}
                                        <div className="p-3 rounded-lg border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-black/20 opacity-75">
                                            <div className="text-[10px] uppercase font-bold text-gray-400 mb-2">Original</div>
                                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{content.personalInfo.summary}</p>
                                        </div>
                                        
                                        {/* ATS Version */}
                                        <div className="p-4 rounded-lg border border-blue-100 dark:border-blue-900/30 bg-blue-50/50 dark:bg-blue-900/10">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="text-[10px] uppercase font-bold text-blue-600">ATS Optimized</div>
                                                <button onClick={() => applySummary('ats')} className="text-[10px] font-bold bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors">Apply</button>
                                            </div>
                                            <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">{result.summaryRewrite?.atsVersion}</p>
                                        </div>

                                        {/* Brand Version */}
                                        <div className="p-4 rounded-lg border border-purple-100 dark:border-purple-900/30 bg-purple-50/50 dark:bg-purple-900/10">
                                             <div className="flex justify-between items-center mb-2">
                                                <div className="text-[10px] uppercase font-bold text-purple-600">Executive Brand</div>
                                                <button onClick={() => applySummary('brand')} className="text-[10px] font-bold bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition-colors">Apply</button>
                                            </div>
                                            <p className="text-xs text-gray-800 dark:text-gray-200 leading-relaxed">{result.summaryRewrite?.brandVersion}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Experience Section */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-bold flex items-center gap-2">
                                        <Briefcase size={16} className="text-primary" /> Experience Enhancements
                                    </h4>
                                    
                                    {result.experienceRewrite?.map((exp: any) => {
                                        // Find original company name for display
                                        const original = content.experience.find(e => e.id === exp.experienceId);
                                        const isExpanded = expandedExp === exp.experienceId;

                                        return (
                                            <div key={exp.experienceId} className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                                                <button 
                                                    onClick={() => setExpandedExp(isExpanded ? null : exp.experienceId)}
                                                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                                >
                                                    <span className="font-bold text-sm">{original?.company || 'Unknown Company'}</span>
                                                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                                </button>
                                                
                                                <AnimatePresence>
                                                    {isExpanded && (
                                                        <motion.div 
                                                            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                                                            className="overflow-hidden bg-gray-50/30 dark:bg-black/10 border-t border-gray-100 dark:border-gray-800"
                                                        >
                                                            <div className="p-4 space-y-4">
                                                                <div>
                                                                    <div className="text-[10px] uppercase font-bold text-gray-400 mb-2">Suggested Power Bullets</div>
                                                                    <ul className="space-y-3">
                                                                        {exp.suggestedBullets?.map((bullet: string, bIdx: number) => (
                                                                            <li key={bIdx} className="bg-white dark:bg-card-dark p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex gap-3 group">
                                                                                <div className="mt-0.5"><TrendingUp size={14} className="text-green-500" /></div>
                                                                                <div className="flex-1">
                                                                                    <p className="text-xs text-gray-700 dark:text-gray-300">{bullet}</p>
                                                                                </div>
                                                                                <button 
                                                                                    onClick={() => applyBullet(exp.experienceId, bIdx, bullet)}
                                                                                    className="opacity-0 group-hover:opacity-100 text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200 hover:bg-green-100 transition-all h-fit whitespace-nowrap"
                                                                                >
                                                                                    Add Bullet
                                                                                </button>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>

                                                                {exp.questionsToQuantify?.length > 0 && (
                                                                    <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                                                        <div className="text-[10px] font-bold text-blue-600 mb-2 flex items-center gap-1"><User size={12}/> Quantify Your Impact</div>
                                                                        <ul className="list-disc pl-4 space-y-1">
                                                                            {exp.questionsToQuantify.map((q: string, i: number) => (
                                                                                <li key={i} className="text-[10px] text-blue-800 dark:text-blue-200">{q}</li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* SKILLS TAB */}
                        {activeTab === 'skills' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-green-100 dark:border-green-900/30">
                                        <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-green-700 dark:text-green-400">
                                            <Plus size={16} /> Add / Emphasize
                                        </h4>
                                        <div className="space-y-3">
                                            {result.skillAlignment?.addOrEmphasize?.map((item: any, i: number) => (
                                                <div key={i} className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                                                    <div className="font-bold text-xs text-gray-900 dark:text-white mb-1">{item.skill}</div>
                                                    <p className="text-[10px] text-gray-500">{item.reason}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-card-dark p-5 rounded-xl border border-orange-100 dark:border-orange-900/30">
                                        <h4 className="text-sm font-bold mb-4 flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                            <RefreshCw size={16} /> Rephrase
                                        </h4>
                                        <div className="space-y-3">
                                            {result.skillAlignment?.rephrase?.map((item: any, i: number) => (
                                                <div key={i} className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                                                    <div className="flex items-center gap-2 text-xs mb-1">
                                                        <span className="text-red-400 line-through decoration-red-400/50">{item.from}</span>
                                                        <ArrowRight size={10} className="text-gray-400" />
                                                        <span className="font-bold text-gray-900 dark:text-white">{item.to}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ResumeExpert;
