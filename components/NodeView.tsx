import React from 'react';
import { motion } from 'framer-motion';
import { Network, User, Briefcase, Code, GraduationCap, Workflow, Globe, Mail, Linkedin, Sparkles } from 'lucide-react';
import { Language, ContentData, LayoutConfig } from '../types';
import GlassCard from './GlassCard';

interface NodeViewProps {
  language: Language;
  content: ContentData;
  fullContent: Record<Language, ContentData>;
  isEditing: boolean;
  onContentUpdate: (newContent: any, description?: string) => void;
  layout: LayoutConfig;
}

const NodeView: React.FC<NodeViewProps> = ({ language, content, layout }) => {
  const { personalInfo, experience, projects, skills, education, services } = content;

  const nodeVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.1, duration: 0.5, type: 'spring' }
    })
  };

  return (
    <div className="relative w-full h-full min-h-[800px] overflow-hidden bg-[#050505] font-mono text-white p-8">
      {/* Technical Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
           style={{
             backgroundImage: 'linear-gradient(#137FEC 1px, transparent 1px), linear-gradient(90deg, #137FEC 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}
      />

      {/* Background Decorative Lines */}
      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#137FEC" />
          </marker>
        </defs>
        {/* Main connections */}
        <line x1="50%" y1="50%" x2="20%" y2="20%" stroke="#137FEC" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="50%" y1="50%" x2="80%" y2="20%" stroke="#137FEC" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="50%" y1="50%" x2="20%" y2="80%" stroke="#137FEC" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="50%" y1="50%" x2="80%" y2="80%" stroke="#137FEC" strokeWidth="1" strokeDasharray="5,5" />
        <line x1="50%" y1="50%" x2="50%" y2="10%" stroke="#137FEC" strokeWidth="1" strokeDasharray="5,5" />
      </svg>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 h-full max-w-7xl mx-auto items-center">

        {/* Left Column: Top - Skills, Bottom - Education */}
        <div className="space-y-12">
            <motion.div custom={1} initial="hidden" animate="visible" variants={nodeVariants}>
                <div className="border border-[#137FEC] bg-black/80 p-6 rounded-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:opacity-100 transition-opacity">
                        <Code size={20} className="text-[#137FEC]" />
                    </div>
                    <h3 className="text-[#137FEC] font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#137FEC] rounded-full animate-pulse"></span>
                        TECH_STACK.EXE
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {skills[0]?.skills.slice(0, 8).map((s: any, i: number) => (
                            <span key={i} className="px-2 py-1 bg-[#137FEC]/10 border border-[#137FEC]/30 text-[10px] text-[#137FEC]">
                                {typeof s === 'string' ? s : s.name}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>

            <motion.div custom={2} initial="hidden" animate="visible" variants={nodeVariants}>
                <div className="border border-white/20 bg-black/80 p-6 rounded-lg relative group">
                    <div className="absolute top-0 right-0 p-2">
                        <GraduationCap size={20} className="text-gray-500" />
                    </div>
                    <h3 className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Education</h3>
                    {education.map((edu, i) => (
                        <div key={i} className="mb-4 last:mb-0">
                            <div className="text-sm font-bold text-white">{edu.school}</div>
                            <div className="text-[10px] text-gray-500">{edu.degree} | {edu.year}</div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>

        {/* Center Column: Core Identity */}
        <div className="flex flex-col items-center justify-center">
            <motion.div custom={0} initial="hidden" animate="visible" variants={nodeVariants} className="text-center relative">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-[#137FEC] blur-[80px] opacity-20 pointer-events-none rounded-full"></div>

                <div className="relative z-10 space-y-6">
                    <div className="w-32 h-32 mx-auto rounded-full border-4 border-[#137FEC] p-1 bg-black relative">
                        <img src={personalInfo.avatar} alt={personalInfo.name} className="w-full h-full rounded-full grayscale hover:grayscale-0 transition-all duration-500 object-cover" />
                        <div className="absolute -bottom-2 -right-2 bg-[#137FEC] text-black p-1.5 rounded-full">
                            <Sparkles size={16} />
                        </div>
                    </div>

                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-1">
                            {language === 'en' ? personalInfo.name : personalInfo.chineseName}
                        </h1>
                        <p className="text-[#137FEC] text-sm font-bold tracking-[0.2em]">{personalInfo.title.toUpperCase()}</p>
                    </div>

                    <div className="flex justify-center gap-4 py-4">
                        <a href={personalInfo.linkedin} className="p-2 border border-white/20 rounded hover:border-[#137FEC] hover:text-[#137FEC] transition-colors"><Linkedin size={18} /></a>
                        <a href={`mailto:${personalInfo.email}`} className="p-2 border border-white/20 rounded hover:border-[#137FEC] hover:text-[#137FEC] transition-colors"><Mail size={18} /></a>
                        <a href={personalInfo.website} className="p-2 border border-white/20 rounded hover:border-[#137FEC] hover:text-[#137FEC] transition-colors"><Globe size={18} /></a>
                    </div>

                    <div className="max-w-xs mx-auto p-4 border border-white/10 bg-white/5 rounded backdrop-blur-md">
                        <p className="text-[10px] text-gray-400 italic leading-relaxed">
                            "{personalInfo.summary}"
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Right Column: Top - Experience, Bottom - Projects */}
        <div className="space-y-12">
            <motion.div custom={3} initial="hidden" animate="visible" variants={nodeVariants}>
                <div className="border border-[#137FEC] bg-[#137FEC]/5 p-6 rounded-lg relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 text-[#137FEC] opacity-10">
                        <Briefcase size={80} />
                    </div>
                    <h3 className="text-[#137FEC] font-bold mb-4 uppercase text-xs tracking-widest flex items-center justify-between">
                        Deployment History
                        <span className="text-[10px] bg-[#137FEC] text-black px-1">ACTIVE</span>
                    </h3>
                    <div className="space-y-4">
                        {experience.slice(0, 2).map((exp, i) => (
                            <div key={i} className="relative pl-4 border-l border-[#137FEC]/30">
                                <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-[#137FEC]"></div>
                                <div className="text-xs font-bold text-white uppercase">{exp.company}</div>
                                <div className="text-[9px] text-[#137FEC]">{exp.title}</div>
                                <div className="text-[9px] text-gray-500">{exp.period}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            <motion.div custom={4} initial="hidden" animate="visible" variants={nodeVariants}>
                <div className="border border-white/20 bg-black/80 p-6 rounded-lg group">
                    <h3 className="text-gray-400 font-bold mb-4 uppercase tracking-widest text-xs">Artifacts</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {projects.slice(0, 4).map((project, i) => (
                            <div key={i} className="relative aspect-video rounded overflow-hidden border border-white/10 group-hover:border-[#137FEC]/50 transition-colors">
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                                <div className="absolute inset-0 bg-black/60 flex items-end p-2">
                                    <div className="text-[8px] font-bold truncate text-white">{project.title}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>

      </div>

      {/* Footer System Status */}
      <div className="fixed bottom-4 left-4 right-4 flex justify-between items-center text-[10px] text-gray-600 font-bold">
          <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              SYSTEM_READY // NODE_FLOW_V1.0
          </div>
          <div>
              LOC: {personalInfo.location} | LATENCY: 24ms
          </div>
      </div>
    </div>
  );
};

export default NodeView;
