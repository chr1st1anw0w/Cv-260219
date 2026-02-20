import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BrainCircuit,
  CheckCircle2,
  AlertCircle,
  Trophy,
  ArrowUpRight,
  Activity,
  Zap,
  Shield,
  Search,
  Copy,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ContentData, Language } from '../types';
import { resumeExpertAgent } from '../services/aiService';

interface ExpertViewProps {
  language: Language;
  content: ContentData;
  fullContent: any;
  isEditing: boolean;
  onContentUpdate: (content: any, message: string) => void;
  layout: any;
}

const DEFAULT_ANALYSIS = {
  matchScore: 85,
  alignment: "Strong",
  strengths: [
    { title: "Strategic Leadership", description: "Demonstrates high-level decision making in tech environments." },
    { title: "Cross-Functional Sync", description: "Proven ability to bridge design and engineering teams." }
  ],
  gaps: [
    { title: "Keyword Density", description: "Low frequency of 'Growth Hacking' and 'Retention Metrics'." },
    { title: "Tech Stack Specifics", description: "Mention more specific Web3 or AI infrastructure tools." }
  ],
  skillVector: {
    WORK: 88,
    DATA: 72,
    EXECUTION: 94,
    TECH: 81
  },
  summarySuggestion: "A results-driven Product Leader with over 12 years of experience in merging architectural vision with business growth...",
  atsChecklist: [
    { item: "Standard Font Usage", status: "pass" },
    { item: "Table-free Layout", status: "pass" },
    { item: "Section Labeling", status: "pass" },
    { item: "Date Formatting", status: "fail" }
  ]
};

const ExpertView: React.FC<ExpertViewProps> = ({
  language,
  content,
  onContentUpdate
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Senior Product Director");
  const [analysis, setAnalysis] = useState<any>(DEFAULT_ANALYSIS);

  const skillData = useMemo(() => {
    if (!analysis) return [];
    return Object.entries(analysis.skillVector).map(([key, value]) => ({
      subject: key,
      A: value,
      fullMark: 100,
    }));
  }, [analysis]);

  const matchData = useMemo(() => [
    { name: 'Match', value: analysis?.matchScore || 0, fill: '#D4FF3F' },
    { name: 'Gap', value: 100 - (analysis?.matchScore || 0), fill: '#1A1A1A' },
  ], [analysis]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const result = await resumeExpertAgent(content, selectedRole, language);
      if (result) setAnalysis(result);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setAnalyzing(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="h-full bg-[#050505] text-white overflow-y-auto custom-scrollbar p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
               <p className="text-primary font-mono text-[10px] tracking-[0.3em] uppercase font-bold">
                 Neural Link Active // CV_Expert_v1.0
               </p>
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">
              Executive Suite
            </h1>
            <p className="text-gray-500 max-w-xl text-sm font-medium">
              Manage career assets and optimize profile for top-tier opportunities.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-bold transition-all tracking-widest group uppercase">
              <Copy size={14} />
              Copy Raw MD
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-black hover:scale-105 rounded-lg text-[10px] font-black transition-all shadow-[0_0_20px_rgba(212,255,63,0.3)] tracking-widest uppercase">
              <Download size={14} />
              Export PDF
            </button>
          </div>
        </div>

        {/* Top Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Main Strategy Card */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-7 bg-[#0A0A0A] border border-white/5 rounded-3xl p-10 flex flex-col items-center justify-center text-center space-y-8 relative overflow-hidden min-h-[400px]"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,255,63,0.05),transparent)] opacity-50" />

            <div className="relative">
              <div className="absolute inset-0 bg-primary blur-2xl opacity-20 animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-black flex items-center justify-center border border-primary/30 relative z-10 shadow-2xl">
                <BrainCircuit size={40} className="text-primary" />
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <h3 className="text-3xl font-black tracking-tight uppercase italic">Profile Optimization</h3>
              <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                Run our Neural Engine to analyze your experience against <span className="text-white">industry-standard JDs</span>.
              </p>

              <div className="flex flex-col gap-2 pt-2 max-w-md mx-auto w-full">
                 <label className="text-[10px] font-mono text-gray-600 uppercase font-bold text-left">Target Role</label>
                 <div className="flex bg-black border border-white/10 rounded-xl overflow-hidden px-4 py-3 focus-within:border-primary/50 transition-colors">
                    <Search size={16} className="text-gray-500 mr-3 mt-0.5" />
                    <input
                       type="text"
                       value={selectedRole}
                       onChange={(e) => setSelectedRole(e.target.value)}
                       className="bg-transparent text-sm w-full outline-none text-white placeholder:text-gray-700 font-bold"
                       placeholder="e.g. Senior Product Designer"
                    />
                 </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full justify-center relative z-10">
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex-1 px-8 py-4 bg-white text-black font-black text-[10px] rounded-full hover:bg-primary transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 tracking-[0.2em]"
              >
                {analyzing ? <><RefreshCw size={14} className="animate-spin" /> SCANNING...</> : 'INITIATE SCAN'}
              </button>

              <button
                onClick={() => onContentUpdate({ ...content, personalInfo: { ...content.personalInfo, summary: analysis.summarySuggestion } }, "Applied AI Summary Optimization")}
                className="flex-1 px-8 py-4 bg-primary/10 text-primary font-black text-[10px] rounded-full border border-primary/30 hover:bg-primary/20 transition-all flex items-center justify-center gap-3 tracking-[0.2em]"
              >
                APPLY AI OPTIMIZATION
              </button>
            </div>
          </motion.div>

          {/* Compatibility Index */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-5 bg-[#0A0A0A] border border-white/5 rounded-3xl p-10 flex flex-col relative overflow-hidden"
          >
             <div className="mb-6">
                <h3 className="font-black text-xl uppercase tracking-tighter italic text-gray-200">Compatibility</h3>
                <p className="text-[10px] text-gray-600 font-mono tracking-widest uppercase">{selectedRole} MATCH</p>
             </div>

             <div className="flex-1 flex items-center justify-center relative py-6">
                <div className="w-52 h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={matchData}
                        cx="50%"
                        cy="50%"
                        innerRadius={75}
                        outerRadius={90}
                        paddingAngle={0}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {matchData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} stroke="none" />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-white italic">{analysis?.matchScore || 0}%</span>
                  <span className="text-[8px] text-gray-500 font-bold tracking-[0.3em] uppercase mt-2">Semantic Match</span>
                </div>
             </div>

             <div className="mt-8 pt-6 border-t border-white/5">
                <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded border border-primary/20 uppercase tracking-widest text-center">
                  Alignment: {analysis?.alignment || 'Strong'}
                </div>
             </div>
          </motion.div>

          {/* Analysis Engine */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-8 bg-[#0A0A0A] border border-white/5 rounded-3xl p-10 space-y-10"
          >
            <h3 className="text-2xl font-black italic flex items-center gap-3 tracking-tighter uppercase">
              <Activity className="text-primary" size={24} />
              Neural Engine Feed
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                {analysis?.strengths?.map((s: any, i: number) => (
                  <div key={i} className="bg-white/[0.02] border-l-2 border-primary p-6 space-y-2">
                    <div className="flex items-center gap-2 text-primary">
                      <CheckCircle2 size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{s.title}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{s.description}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                {analysis?.gaps?.map((g: any, i: number) => (
                  <div key={i} className="bg-white/[0.02] border-l-2 border-gray-700 p-6 space-y-2">
                    <div className="flex items-center gap-2 text-gray-400">
                      <AlertCircle size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{g.title}</span>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed font-medium italic">{g.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Skill Radar */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-4 bg-[#0A0A0A] border border-white/5 rounded-3xl p-10 flex flex-col"
          >
             <h3 className="font-black text-xl mb-10 uppercase tracking-tighter italic">Skill Vectors</h3>
             <div className="flex-1 h-[250px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                    <PolarGrid stroke="#222" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#444', fontSize: 10, fontWeight: 900 }} />
                    <Radar dataKey="A" stroke="#D4FF3F" fill="#D4FF3F" fillOpacity={0.5} />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
             <div className="grid grid-cols-2 gap-2 mt-8">
                {['WORK', 'DATA', 'EXEC', 'TECH'].map(tag => (
                  <div key={tag} className="text-center py-2 text-[8px] font-black border border-white/10 rounded text-gray-600 uppercase tracking-widest">{tag}</div>
                ))}
             </div>
          </motion.div>

          {/* Matches */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-12 bg-[#0A0A0A] border border-white/5 rounded-3xl p-10"
          >
             <div className="flex justify-between items-center mb-10">
                <h3 className="font-black text-2xl uppercase tracking-tighter italic flex items-center gap-3">
                   <Trophy className="text-primary" size={24} /> High-Confidence Matches
                </h3>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { role: "Systems Architect", company: "Aether Labs", match: "98%" },
                  { role: "Strategy Lead", company: "CyberDyne", match: "94%" },
                  { role: "Engineering Director", company: "Orbit-X", match: "82%" }
                ].map((job, i) => (
                  <div key={i} className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 space-y-6 hover:border-primary/20 transition-all group">
                    <div className="flex justify-between items-start">
                       <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center"><Shield size={20} className="text-gray-600 group-hover:text-primary" /></div>
                       <span className="text-[10px] font-black text-primary">{job.match}</span>
                    </div>
                    <div>
                       <p className="font-black text-lg uppercase group-hover:text-primary transition-colors">{job.role}</p>
                       <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{job.company}</p>
                    </div>
                    <button className="w-full py-4 rounded-xl text-[10px] font-black bg-white/5 hover:bg-white/10 text-white uppercase tracking-widest transition-all">View Role</button>
                  </div>
                ))}
             </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpertView;
