
import React from 'react';
import { 
  Check, 
  Mail, 
  Link as LinkIcon, 
  School, 
  Brain, 
  Diamond, 
  CheckCircle2, 
  History, 
  Palette, 
  Users, 
  Terminal, 
  Lightbulb
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Language, ContentData, LayoutConfig, SectionId } from '../types';
import GlassCard from './GlassCard';
import ProjectCard from './ProjectCard';
import EditableText from './ui/EditableText';

interface GlassViewProps {
  language: Language;
  content: ContentData;
  fullContent: Record<'en' | 'zh', ContentData>;
  isEditing: boolean;
  onContentUpdate: (newContent: Record<'en' | 'zh', ContentData>, msg?: string) => void;
  layout?: LayoutConfig;
}

const IconMap: Record<string, React.ReactNode> = {
  Lightbulb: <Palette className="text-primary w-5 h-5" />,
  Workflow: <Users className="text-primary w-5 h-5" />,
  Cpu: <Terminal className="text-primary w-5 h-5" />
};

const GlassView: React.FC<GlassViewProps> = ({ 
    language, 
    content, 
    fullContent,
    isEditing,
    onContentUpdate,
    layout
}) => {
  const { personalInfo, education, coreValues, experience, services, skills, ui, projects } = content;
  const order = layout?.mainContentOrder || ['summary', 'values', 'experience', 'projects', 'services', 'toolkit'];
  const hidden = layout?.hiddenSections || [];

  const updateContent = (section: keyof ContentData, index: number | null, field: string, value: any, log: string) => {
    const newFullContent = JSON.parse(JSON.stringify(fullContent));
    if (index !== null) {
        // @ts-ignore
        newFullContent[language][section][index][field] = value;
    } else {
        // @ts-ignore
        newFullContent[language][section][field] = value;
    }
    onContentUpdate(newFullContent, log);
  };

  const updatePersonalInfo = (field: string, value: any) => {
    const newFullContent = JSON.parse(JSON.stringify(fullContent));
    // @ts-ignore
    newFullContent[language].personalInfo[field] = value;
    onContentUpdate(newFullContent, `Updated personal info ${field}`);
  };

  const getAlignmentClass = (sectionId: string) => {
    const alignment = layout?.sectionAlignment?.[sectionId as SectionId] || 'left';
    switch (alignment) {
      case 'center': return 'text-center items-center';
      case 'right': return 'text-right items-end';
      default: return 'text-left items-start';
    }
  };

  const renderSection = (sectionId: string) => {
    if (hidden.includes(sectionId)) return null;
    const alignClass = getAlignmentClass(sectionId);

    switch (sectionId) {
      case 'summary':
        return (
            <GlassCard key={sectionId} className={`h-full flex flex-col border-l-4 border-l-primary ${alignClass}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="text-primary w-5 h-5" />
                  <h2 className="text-sm font-bold uppercase tracking-wide dark:text-white">Summary</h2>
                </div>
                <EditableText 
                    tag="p"
                    multiline
                    value={personalInfo.summary}
                    isEditing={isEditing}
                    onSave={(val) => updatePersonalInfo('summary', val)}
                    className={`text-xs text-gray-700 dark:text-gray-300 leading-relaxed flex-1 font-medium ${alignClass.includes('text-center') ? 'text-center' : alignClass.includes('text-right') ? 'text-right' : 'text-justify'}`}
                />
            </GlassCard>
        );
      case 'values':
        return (
            <GlassCard key={sectionId} className={`h-full flex flex-col ${alignClass}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Diamond className="text-primary w-5 h-5" />
                  <h2 className="text-sm font-bold uppercase tracking-wide dark:text-white">{ui.valueProposition}</h2>
                </div>
                <div className={`space-y-3 flex-1 flex flex-col ${alignClass}`}>
                  {coreValues.map((val, idx) => (
                    <div key={idx} className={`flex gap-3 text-xs text-gray-700 dark:text-gray-300 font-medium ${alignClass.includes('items-end') ? 'flex-row-reverse' : ''}`}>
                      <CheckCircle2 className="text-primary w-4 h-4 shrink-0" />
                      <EditableText 
                        value={val.text}
                        isEditing={isEditing}
                        onSave={(val) => updateContent('coreValues', idx, 'text', val, 'Updated core value')}
                      />
                    </div>
                  ))}
                </div>
            </GlassCard>
        );
      case 'experience':
        return (
            <GlassCard key={sectionId} noPadding className="overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/30 dark:bg-black/20">
                <h2 className="text-lg font-bold flex items-center gap-2 dark:text-white">
                  <History className="text-gray-400 w-5 h-5" />
                  Work History
                </h2>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-white/50 dark:bg-[#2B2B2B]/50 border border-gray-200 dark:border-gray-700 px-2 py-1 rounded text-gray-500">All Roles</span>
                </div>
              </div>
              
              <div className={`p-6 space-y-6 flex flex-col ${alignClass}`}>
                {experience.map((job, index) => (
                  <motion.div 
                    key={job.id} 
                    className={`group relative pb-6 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0 flex flex-col ${alignClass}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    
                    <div className={`flex justify-between items-start mb-2 w-full ${alignClass.includes('items-end') ? 'flex-row-reverse' : ''}`}>
                      <div className={`flex gap-3 ${alignClass.includes('items-end') ? 'flex-row-reverse text-right' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mt-1 
                          ${index === 0 ? 'bg-primary/20 text-primary' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                          {job.company.charAt(0)}
                        </div>
                        <div>
                          <EditableText 
                            tag="h3"
                            value={job.company}
                            isEditing={isEditing}
                            onSave={(val) => updateContent('experience', index, 'company', val, 'Updated company')}
                            className="text-sm font-bold text-gray-900 dark:text-white"
                          />
                          <EditableText 
                             tag="p"
                             value={job.title}
                             isEditing={isEditing}
                             onSave={(val) => updateContent('experience', index, 'title', val, 'Updated title')}
                             className="text-xs text-primary/90 dark:text-primary font-medium"
                          />
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-[#2B2B2B] px-2 py-1 rounded">
                        {job.period}
                      </span>
                    </div>
                    
                    <EditableText 
                        tag="p"
                        multiline
                        value={job.summary}
                        isEditing={isEditing}
                        onSave={(val) => updateContent('experience', index, 'summary', val, 'Updated summary')}
                        className={`text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed ${alignClass.includes('items-end') ? 'pr-11' : 'pl-11'}`}
                    />
                    
                    <div className={`${alignClass.includes('items-end') ? 'pr-11' : 'pl-11'} mt-3 grid grid-cols-1 gap-2 w-full`}>
                      <div className="bg-gray-50/50 dark:bg-[#2B2B2B]/30 p-4 rounded-xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm">
                        <h5 className={`text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 ${alignClass.includes('text-right') ? 'text-right' : ''}`}>Key Achievements</h5>
                        <div className={`space-y-2 flex flex-col ${alignClass}`}>
                          {job.achievements.map((achievement, i) => (
                            <div key={i} className={`flex gap-2 items-start ${alignClass.includes('items-end') ? 'flex-row-reverse text-right' : ''}`}>
                              <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                              <p className="text-[11px] text-gray-600 dark:text-gray-400">{achievement}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
        );
      case 'projects':
        return projects && projects.length > 0 ? (
            <div key={sectionId} className={`space-y-4 flex flex-col ${alignClass}`}>
                <div className="flex items-center gap-2 px-1">
                    <Palette className="text-primary w-5 h-5" />
                    <h2 className="text-sm font-bold uppercase tracking-wide dark:text-white">{ui.projectHighlights}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} variant="glass" className="h-full" />
                    ))}
                </div>
            </div>
        ) : null;
      case 'services':
        return (
            <div key={sectionId} className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
              {services.map((cat, idx) => (
                <GlassCard key={idx} className={`h-full transition-colors hover:border-primary/30 flex flex-col ${alignClass}`}>
                  <div className={`flex items-center gap-2 mb-4 ${alignClass.includes('items-end') ? 'flex-row-reverse' : ''}`}>
                    {IconMap[cat.iconName] || <Lightbulb className="text-primary w-5 h-5" />}
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{cat.title}</h3>
                  </div>
                  <ul className={`space-y-3 flex flex-col ${alignClass}`}>
                    {cat.items.map((item, i) => (
                      <li key={i} className={`text-[11px] text-gray-600 dark:text-gray-400 flex items-center gap-2 ${alignClass.includes('items-end') ? 'flex-row-reverse text-right' : ''}`}>
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        <EditableText 
                            value={item}
                            isEditing={isEditing}
                            onSave={(val) => {
                                const newItems = [...cat.items];
                                newItems[i] = val;
                                updateContent('services', idx, 'items', newItems, 'Updated service item');
                            }}
                        />
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              ))}
            </div>
        );
      case 'toolkit':
        return (
            <div key={sectionId} className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {skills.slice(0, 2).map((cat, idx) => (
                <GlassCard key={idx} className={`flex flex-col ${alignClass}`}>
                  <h3 className="text-xs font-bold uppercase text-gray-500 mb-4 tracking-wider">{cat.title}</h3>
                  <div className={`flex flex-wrap gap-2 ${alignClass.includes('items-center') ? 'justify-center' : alignClass.includes('items-end') ? 'justify-end' : ''}`}>
                    {cat.skills.map((skill, i) => {
                         const skillName = typeof skill === 'string' ? skill : skill.name;
                         return (
                            <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-default bg-gray-50/50 dark:bg-[#2B2B2B]/50 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary backdrop-blur-sm">
                                {skillName}
                            </span>
                         )
                    })}
                  </div>
                </GlassCard>
              ))}
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 bg-[#F0F2F5] dark:bg-[#0A0A0A] transition-colors duration-300 font-sans text-gray-900 dark:text-gray-100 relative">
      
      {/* Background gradients for frosted glass effect depth */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-[1600px] mx-auto relative z-10">
        <main className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* SIDEBAR */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-6 flex flex-col self-start md:sticky md:top-24">
            
            {/* Profile Card */}
            <GlassCard className="relative overflow-hidden group border-t-4 border-t-primary/50">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-gray-100/50 to-transparent dark:from-white/5 opacity-50"></div>
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative w-28 h-28 mb-4">
                  <img 
                    src={personalInfo.avatar} 
                    alt={personalInfo.name} 
                    className="w-full h-full object-cover rounded-full border-4 border-white dark:border-[#1E1E1E] shadow-md grayscale group-hover:grayscale-0 transition-all duration-500"
                    loading="lazy" 
                  />
                  <div className="absolute bottom-1 right-1 bg-primary text-black rounded-full p-1 border-2 border-white dark:border-[#1E1E1E]">
                    <Check className="w-3 h-3 stroke-[4]" />
                  </div>
                </div>
                
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex flex-col items-center gap-1">
                  <EditableText 
                    value={personalInfo.name}
                    isEditing={isEditing}
                    onSave={(val) => updatePersonalInfo('name', val)}
                  />
                  <EditableText 
                    className="font-normal text-gray-500 text-base"
                    value={personalInfo.chineseName}
                    isEditing={isEditing}
                    onSave={(val) => updatePersonalInfo('chineseName', val)}
                  />
                </h1>
                
                <div className="mt-1 mb-4">
                     <EditableText 
                        className="text-primary text-xs font-semibold uppercase tracking-wider"
                        value={personalInfo.title}
                        isEditing={isEditing}
                        onSave={(val) => updatePersonalInfo('title', val)}
                    />
                </div>

                <div className="flex gap-2 w-full justify-center mb-6">
                  <a 
                    href={`mailto:${personalInfo.email}`}
                    className="flex-1 bg-gray-900 dark:bg-white text-white dark:text-black py-2 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity flex justify-center items-center gap-2 min-h-[44px]"
                    aria-label="Send Email"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                  <a 
                    href={`https://${personalInfo.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 flex items-center justify-center bg-gray-100 dark:bg-[#2B2B2B] rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors min-h-[44px]"
                    aria-label="Visit Website"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="w-full space-y-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Phone</span>
                    <span className="font-medium dark:text-gray-200">{personalInfo.phone}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Website</span>
                    <a href={`https://${personalInfo.website}`} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline truncate max-w-[140px]">
                      {personalInfo.website}
                    </a>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Location</span>
                    <EditableText 
                        value={personalInfo.location}
                        isEditing={isEditing}
                        onSave={(val) => updatePersonalInfo('location', val)}
                        className="font-medium dark:text-gray-200"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Education Card */}
            <GlassCard>
              <div className="flex items-center gap-2 mb-4">
                <School className="text-primary w-5 h-5" />
                <h2 className="text-sm font-bold uppercase tracking-wide dark:text-white">Education</h2>
              </div>
              <div className="space-y-4 relative">
                <div className="absolute left-[5px] top-1 bottom-1 w-[1px] bg-gray-200 dark:bg-gray-700"></div>
                
                {education.map((edu, idx) => (
                    <div key={idx} className="relative pl-6">
                        <div className={`absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full ${idx === 0 ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'} border-2 border-white dark:border-[#1E1E1E]`}></div>
                        <h4 className="font-bold text-xs dark:text-white">{edu.school}</h4>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{edu.degree}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{edu.year}</p>
                    </div>
                ))}
              </div>
            </GlassCard>
          </aside>

          {/* MAIN CONTENT */}
          <div className="md:col-span-8 lg:col-span-9 space-y-6">
            {order.map(sectionId => renderSection(sectionId))}
          </div>
        </main>

        <footer className="mt-12 text-center text-xs text-gray-500 uppercase tracking-wider py-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>© 2024 Christian Wu. Enterprise Portfolio.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              {['LinkedIn', 'Behance', 'Dribbble'].map(link => (
                  <a key={link} href="#" className="hover:text-primary transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GlassView;
