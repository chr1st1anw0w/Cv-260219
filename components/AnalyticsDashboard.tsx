
import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    Activity, BarChart3, Clock, Code2, Globe, Layout, TrendingUp, Zap,
    Briefcase, Award, CheckCircle2, User, Sparkles, FileJson, FileText
} from 'lucide-react';
import { ContentData, Language, ResumeExportSchema } from '../types';
import RadarChart from './ui/RadarChart';
import GlassCard from './GlassCard';

interface AnalyticsDashboardProps {
    language: Language;
    content: ContentData;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ language, content }) => {
    // --- Data Processing ---
    const stats = useMemo(() => {
        const totalExp = content.experience.length;
        const totalSkills = content.skills.reduce((acc, cat) => acc + cat.skills.length, 0);
        const totalProjects = content.projects?.length || 0;
        
        // Mock calculation for "Impact Score" based on quantifiable numbers in bullets
        const impactPoints = content.experience.reduce((acc, exp) => {
            return acc + exp.achievements.reduce((innerAcc, bullet) => {
                return innerAcc + (bullet.match(/\d+[%kM]/) ? 1 : 0);
            }, 0);
        }, 0);

        return { totalExp, totalSkills, totalProjects, impactPoints };
    }, [content]);

    const radarData = useMemo(() => {
        return content.skills.slice(0, 5).map(cat => ({
            label: cat.title.split(' ')[0], // Take first word for chart brevity
            value: Math.min(cat.skills.length * 20, 100), // Mock value based on skill count
            fullMark: 100
        }));
    }, [content]);

    // Extract numbers from achievements for "Impact Highlights"
    const impactHighlights = useMemo(() => {
        const highlights: { number: string; text: string; company: string }[] = [];
        content.experience.forEach(exp => {
            exp.achievements.forEach(ach => {
                const match = ach.match(/(\d+(?:[.,]\d+)?[%kMKx])/);
                if (match && highlights.length < 4) {
                    highlights.push({
                        number: match[0],
                        text: ach.replace(match[0], '').trim(),
                        company: exp.company
                    });
                }
            });
        });
        return highlights;
    }, [content]);

    // --- Export helpers ---
    const downloadFile = useCallback((blob: Blob, filename: string) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, []);

    const exportToJSON = useCallback(() => {
        const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const schema: ResumeExportSchema = {
            $schema: 'neocv-resume/1.0',
            exportedAt: new Date().toISOString(),
            language,
            personalInfo: content.personalInfo,
            summary: content.personalInfo.summary,
            coreValues: content.coreValues,
            education: content.education,
            experience: content.experience,
            projects: content.projects,
            skills: content.skills,
            services: content.services,
            ...(content.metrics ? { metrics: content.metrics } : {}),
        };
        const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
        downloadFile(blob, `resume-${language}-${ts}.json`);
    }, [content, language, downloadFile]);

    const exportToMarkdown = useCallback(() => {
        const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const { personalInfo, coreValues, education, experience, projects, skills, services } = content;
        const lines: string[] = [];

        // Header
        lines.push(`# ${personalInfo.name}`);
        if (personalInfo.chineseName) lines.push(`**${personalInfo.chineseName}**`);
        lines.push('', `**${personalInfo.title}**`);
        lines.push('', `📍 ${personalInfo.location} · ✉️ ${personalInfo.email} · 🔗 ${personalInfo.website}`);

        // Summary
        lines.push('', '## Summary', '', personalInfo.summary);

        // Core Values
        if (coreValues.length) {
            lines.push('', '## Core Values', '');
            coreValues.forEach(v => lines.push(`- ${v.text}`));
        }

        // Experience
        if (experience.length) {
            lines.push('', '## Experience', '');
            experience.forEach(exp => {
                lines.push(`### ${exp.company} — ${exp.title} (${exp.period})`);
                if (exp.summary) lines.push('', exp.summary);
                if (exp.achievements.length) {
                    lines.push('');
                    exp.achievements.forEach(a => lines.push(`- ${a}`));
                }
                lines.push('');
            });
        }

        // Projects
        if (projects.length) {
            lines.push('## Projects', '');
            projects.forEach(proj => {
                lines.push(`### ${proj.title}`);
                if (proj.subtitle) lines.push(`*${proj.subtitle}*`);
                if (proj.description) lines.push('', proj.description);
                if (proj.techStack?.length) lines.push('', `**Tech:** ${proj.techStack.join(', ')}`);
                if (proj.link) lines.push('', `🔗 ${proj.link}`);
                lines.push('');
            });
        }

        // Skills
        if (skills.length) {
            lines.push('## Skills', '');
            skills.forEach(cat => {
                lines.push(`### ${cat.title}`);
                cat.skills.forEach(s => {
                    if (typeof s === 'string') lines.push(`- ${s}`);
                    else lines.push(`- **${s.name}**${s.description ? `: ${s.description}` : ''}`);
                });
                lines.push('');
            });
        }

        // Services
        if (services.length) {
            lines.push('## Services', '');
            services.forEach(svc => {
                lines.push(`### ${svc.title}`);
                svc.items.forEach(item => lines.push(`- ${item}`));
                lines.push('');
            });
        }

        // Education
        if (education.length) {
            lines.push('## Education', '');
            education.forEach(edu => {
                lines.push(`- **${edu.school}** — ${edu.degree} (${edu.year})`);
            });
        }

        const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
        downloadFile(blob, `resume-${language}-${ts}.md`);
    }, [content, language, downloadFile]);

    return (
        <div className="h-full bg-gray-50 dark:bg-[#0A0A0A] p-4 md:p-8 overflow-y-auto custom-scrollbar font-sans text-gray-900 dark:text-white">
            <div className="max-w-[1400px] mx-auto space-y-6">
                
                {/* Header: Neo-Brutalist Dark Style */}
                <header className="relative bg-[#09090B] border border-zinc-800 rounded-[2.5rem] p-8 mb-8 overflow-hidden group shadow-2xl">
                    {/* Decorative Technical Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-6">
                            {/* Geometric Icon Shape */}
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center border-4 border-zinc-200 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] transition-transform group-hover:scale-105">
                                <Activity size={36} className="text-black" strokeWidth={3} />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">
                                    Career<span className="text-zinc-600">.OS</span>
                                </h1>
                                <p className="text-sm font-mono text-zinc-400 mt-2 flex items-center gap-2 uppercase tracking-widest">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    System Metrics Active
                                </p>
                            </div>
                        </div>

                        {/* Status Capsule + Export Buttons */}
                        <div className="flex items-center gap-3 flex-wrap justify-end">
                            {/* Export Buttons */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={exportToJSON}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider hover:bg-zinc-700 hover:text-white transition-colors"
                                >
                                    <FileJson size={14} /> Export JSON
                                </button>
                                <button
                                    onClick={exportToMarkdown}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-bold uppercase tracking-wider hover:bg-zinc-700 hover:text-white transition-colors"
                                >
                                    <FileText size={14} /> Export MD
                                </button>
                            </div>
                            {/* Status Capsule */}
                            <div className="flex items-center gap-4 bg-zinc-900/80 backdrop-blur-md border border-zinc-800 p-2 pr-6 rounded-full shadow-inner">
                                <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                    Available
                                </div>
                                <div className="h-4 w-px bg-zinc-700" />
                                <span className="text-xs font-mono text-zinc-500">SYNC: 100%</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Top Row: KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    <MetricCard 
                        label="Years Exp" 
                        value={`${stats.totalExp}+`} 
                        icon={<Clock size={16} />} 
                        trend="+1.2 yr"
                        color="blue"
                    />
                    <MetricCard 
                        label="Projects" 
                        value={stats.totalProjects.toString()} 
                        icon={<Briefcase size={16} />} 
                        trend="Active"
                        color="purple"
                    />
                    <MetricCard 
                        label="Tech Stack" 
                        value={stats.totalSkills.toString()} 
                        icon={<Code2 size={16} />} 
                        trend="Diverse"
                        color="emerald"
                    />
                    <MetricCard 
                        label="Impact Score" 
                        value="98" 
                        icon={<Zap size={16} />} 
                        trend="Top 5%"
                        color="amber"
                    />
                </div>

                {/* Middle Row: Main Viz */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[400px]">
                    
                    {/* Career Timeline / Experience Graph */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#151515] rounded-[24px] p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 flex items-center gap-2">
                                <TrendingUp size={16} /> Career Trajectory
                            </h3>
                            <button className="text-[10px] font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-gray-600 dark:text-gray-300">View Full History</button>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center space-y-4">
                            {content.experience.slice(0, 4).map((exp, i) => (
                                <div key={exp.id} className="relative group">
                                    <div className="flex justify-between items-end mb-1 text-xs">
                                        <span className="font-bold text-gray-800 dark:text-white">{exp.company}</span>
                                        <span className="font-mono text-gray-400">{exp.period}</span>
                                    </div>
                                    <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${100 - (i * 15)}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 relative"
                                        >
                                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        </motion.div>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-1 truncate">{exp.title}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skills Radar */}
                    <div className="lg:col-span-1 bg-white dark:bg-[#151515] rounded-[24px] p-6 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col items-center justify-center">
                         <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2 w-full text-left flex items-center gap-2">
                             <Layout size={16} /> Capability Map
                         </h3>
                         <div className="flex-1 w-full flex items-center justify-center">
                             <div className="transform scale-110">
                                <RadarChart 
                                    data={radarData} 
                                    width={240} 
                                    height={240} 
                                    fillColor="rgba(37, 99, 235, 0.2)" 
                                    strokeColor="#2563EB" 
                                />
                             </div>
                         </div>
                    </div>
                </div>

                {/* Bottom Row: Impact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {impactHighlights.map((highlight, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all group cursor-default">
                            <div className="flex justify-between items-start mb-3">
                                <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                    {highlight.number}
                                </div>
                                <div className="p-1.5 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-400 group-hover:text-blue-500 transition-colors">
                                    <Award size={16} />
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed mb-2">
                                {highlight.text}
                            </p>
                            <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center gap-1.5">
                                <Briefcase size={10} className="text-gray-400" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase">{highlight.company}</span>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* AI Summary Section */}
                <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-[24px] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Globe size={120} />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <div className="flex items-center gap-2 mb-4 text-blue-200">
                            <Sparkles size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">AI Assessment</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-4 leading-relaxed">
                            "A highly specialized profile balancing <span className="text-blue-300 border-b border-blue-300/30">technical precision</span> with <span className="text-purple-300 border-b border-purple-300/30">creative strategy</span>. Strong indicators of leadership in cross-functional environments."
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {['Product Strategy', 'UI/UX Design', 'Technical Leadership'].map(tag => (
                                <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-xs font-medium backdrop-blur-sm flex items-center gap-2">
                                    <CheckCircle2 size={12} className="text-green-400" /> {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const MetricCard = ({ label, value, icon, trend, color }: any) => {
    const colorStyles = {
        blue: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        purple: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
        emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
        amber: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
    };

    return (
        <div className="bg-white dark:bg-[#151515] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between h-32 hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase text-gray-400 tracking-wider">{label}</span>
                {/* @ts-ignore */}
                <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
                    {icon}
                </div>
            </div>
            <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">{value}</div>
                <div className="flex items-center gap-1 mt-1">
                    <TrendingUp size={12} className="text-green-500" />
                    <span className="text-[10px] font-bold text-green-500">{trend}</span>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
