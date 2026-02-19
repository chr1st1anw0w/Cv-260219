
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Check, 
  Mail, 
  Share2, 
  BadgeCheck, 
  CheckCircle2, 
  Activity, 
  BarChart3, 
  GraduationCap, 
  ArrowRight,
  Network
} from 'lucide-react';
import { Language, ContentData, LayoutConfig } from '../types';
import EditableText from './ui/EditableText';

interface CreativeViewProps {
  language: Language;
  content: ContentData;
  fullContent: Record<'en' | 'zh', ContentData>;
  isEditing: boolean;
  onContentUpdate: (newContent: Record<'en' | 'zh', ContentData>, msg?: string) => void;
  layout?: LayoutConfig;
}

// --- Shared Components for this View ---

const DashboardCard = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.005, boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.08)' }}
    transition={{ duration: 0.4 }}
    style={{
        background: 'var(--neo-glass)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid var(--neo-glass-border)',
        boxShadow: 'var(--neo-shadow, 0px 4px 20px rgba(0, 0, 0, 0.05))'
    }}
    className={`rounded-[24px] p-8 ${className}`}
  >
    {children}
  </motion.div>
);

const CharcoalCard = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.005, boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)' }}
    transition={{ duration: 0.4 }}
    style={{
        backgroundColor: 'var(--neo-charcoal)',
        color: '#FFFFFF',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
    }}
    className={`rounded-[24px] p-8 ${className}`}
  >
    {children}
  </motion.div>
);

const IconContainer = ({ children, className = '' }: { children?: React.ReactNode, className?: string }) => (
  <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-[#F0F0F0] text-[#666] ${className}`}>
    {children}
  </div>
);

const SquircleButton = ({ children, className = '', ...props }: any) => (
  <motion.button 
    whileTap={{ scale: 0.95 }}
    whileHover={{ brightness: 0.95, scale: 1.02 }}
    style={{ borderRadius: '14px' }}
    className={`transition-all duration-200 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

const CreativeView: React.FC<CreativeViewProps> = ({ 
    language, 
    content, 
    fullContent,
    isEditing,
    onContentUpdate,
    layout
}) => {
  const { personalInfo, experience, services, projects, ui } = content;

  // Helper to update content safely
  const updateContent = (section: keyof ContentData, index: number | null, field: string, value: any, log: string) => {
    const newFullContent = JSON.parse(JSON.stringify(fullContent));
    
    if (index !== null) {
        // Array item update
        // @ts-ignore
        newFullContent[language][section][index][field] = value;
    } else {
        // Single object update
        // @ts-ignore
        newFullContent[language][section][field] = value;
    }
    onContentUpdate(newFullContent, log);
  };
  
  // Specific helper for Personal Info nested object
  const updatePersonalInfo = (field: string, value: any) => {
    const newFullContent = JSON.parse(JSON.stringify(fullContent));
    // @ts-ignore
    newFullContent[language].personalInfo[field] = value;
    onContentUpdate(newFullContent, `Updated personal info ${field}`);
  };

  return (
    <div className="min-h-screen bg-neo-bg text-[#555555] font-sans pb-12 pt-0 px-4 lg:px-10">
      
      <main className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        
        {/* LEFT ASIDE: Profile */}
        <aside className="lg:col-span-3 md:col-span-1 space-y-6 order-1">
          
          {/* Profile Card */}
          <CharcoalCard className="flex flex-col items-center text-center">
            <div className="relative mb-6 group cursor-pointer">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                alt={personalInfo.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-white/10 grayscale group-hover:grayscale-0 transition-all duration-500" 
                src={personalInfo.avatar}
              />
              <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-neo-lime flex items-center justify-center border-4 border-neo-charcoal">
                <Check size={16} className="text-black font-bold stroke-[3]" />
              </div>
            </div>
            
            <EditableText 
                tag="h2"
                className="text-white text-xl mb-1 font-semibold"
                value={personalInfo.name}
                isEditing={isEditing}
                onSave={(val) => updatePersonalInfo('name', val)}
            />
            
            <EditableText 
                tag="p"
                multiline
                className="text-gray-400 text-xs mb-6 px-4 leading-relaxed"
                value={personalInfo.summary}
                isEditing={isEditing}
                onSave={(val) => updatePersonalInfo('summary', val)}
            />
            
            <div className="w-full flex gap-2">
              <SquircleButton className="flex-1 bg-white/10 hover:bg-white/20 py-3 text-xs font-semibold text-white flex items-center justify-center gap-2">
                 <Mail size={16} /> Email
              </SquircleButton>
              <SquircleButton className="w-12 bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
                 <Share2 size={16} />
              </SquircleButton>
            </div>

            <div className="w-full mt-8 pt-6 border-t border-white/5 space-y-4">
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">EXPERIENCE</span>
                <span className="text-gray-300 font-medium">12+ YEARS</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span className="text-gray-500">LOCATION</span>
                <EditableText 
                    value={personalInfo.location}
                    isEditing={isEditing}
                    onSave={(val) => updatePersonalInfo('location', val)}
                    className="text-gray-300 font-medium text-right"
                />
              </div>
            </div>
          </CharcoalCard>

          {/* Value Proposition */}
          <div className="bg-white/50 rounded-[24px] p-6 border border-white/60 shadow-sm backdrop-blur-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <IconContainer><BadgeCheck size={18} strokeWidth={1.5} /></IconContainer>
              <h3 className="text-sm font-semibold text-gray-800">{ui.valueProposition}</h3>
            </div>
            <ul className="space-y-4">
              {content.coreValues.slice(0, 3).map((val, i) => (
                  <li key={i} className="flex gap-3 text-xs leading-relaxed group">
                    <CheckCircle2 size={16} className="text-neo-lime shrink-0 group-hover:scale-110 transition-transform" />
                    <EditableText 
                        value={val.text}
                        isEditing={isEditing}
                        onSave={(newVal) => updateContent('coreValues', i, 'text', newVal, 'Updated core value')}
                    />
                  </li>
              ))}
            </ul>
          </div>

        </aside>

        {/* CENTER COLUMN: Content */}
        <section className="lg:col-span-6 md:col-span-2 space-y-6 order-3 lg:order-2">
          
          {/* Engagement History */}
          <DashboardCard>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <IconContainer><Activity size={18} strokeWidth={1.5} /></IconContainer>
                <h3 className="text-sm uppercase tracking-wider font-semibold text-gray-800">{ui.engagementHistory}</h3>
              </div>
              <span className="text-[10px] font-bold text-gray-400 bg-white/50 px-2 py-1 rounded">2010 — 2024</span>
            </div>

            <div className="space-y-10 relative">
               {/* Timeline Connector Line */}
              <div className="absolute left-[15px] top-[32px] bottom-[-32px] w-[1px] bg-[#E0E0E0]" />

              {/* Items */}
              {experience.slice(0, 3).map((exp, idx) => (
                  <motion.div 
                    key={exp.id} 
                    className="relative flex gap-6 group cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    {/* Dot */}
                    <div className="relative z-10 w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                        <div className={`w-2 h-2 rounded-full ${idx === 0 ? 'bg-neo-charcoal animate-pulse' : 'bg-gray-300'}`}></div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-2">
                        <div className="flex justify-between items-start mb-1">
                            <EditableText 
                                tag="h4"
                                className="text-sm font-semibold text-gray-800 group-hover:text-neo-charcoal transition-colors"
                                value={exp.company}
                                isEditing={isEditing}
                                onSave={(val) => updateContent('experience', idx, 'company', val, 'Updated company')}
                            />
                            <span className="text-[10px] text-gray-400 font-medium uppercase">{exp.period.split('—')[0]}</span>
                        </div>
                        <EditableText 
                            tag="p"
                            className="text-[11px] text-[#555] font-medium mb-3 uppercase tracking-wide"
                            value={exp.title}
                            isEditing={isEditing}
                            onSave={(val) => updateContent('experience', idx, 'title', val, 'Updated title')}
                        />
                        <EditableText 
                            tag="p"
                            multiline
                            className="text-xs leading-relaxed mb-4 text-gray-600 line-clamp-2"
                            value={exp.summary}
                            isEditing={isEditing}
                            onSave={(val) => updateContent('experience', idx, 'summary', val, 'Updated summary')}
                        />
                        
                        {idx === 0 && (
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-white/80 rounded-md border border-gray-100 text-[10px] font-medium text-gray-500">Product Strategy</span>
                                <span className="px-2 py-1 bg-white/80 rounded-md border border-gray-100 text-[10px] font-medium text-gray-500">AR/VR</span>
                            </div>
                        )}
                    </div>
                  </motion.div>
              ))}
            </div>
          </DashboardCard>

          {/* Core Competencies (Horizontal Bar Charts) */}
          <DashboardCard>
            <div className="flex items-center gap-3 mb-8">
              <IconContainer><Network size={18} strokeWidth={1.5} /></IconContainer>
              <h3 className="text-sm uppercase tracking-wider font-semibold text-gray-800">{ui.coreCompetencies}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Block 1 */}
                <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-[16px] bg-white/40 border border-white/20 hover:bg-white/60 transition-colors">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">{services[0].title}</h4>
                    <div className="space-y-3">
                        {services[0].items.slice(0, 2).map((item, i) => (
                             <div key={i} className="flex items-center justify-between group">
                                <span className="text-xs text-gray-600">{item}</span>
                                <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div initial={{width: 0}} whileInView={{width: i===0 ? '90%' : '85%'}} transition={{duration: 1}} className="h-full bg-neo-charcoal"></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Block 2 */}
                <motion.div whileHover={{ scale: 1.02 }} className="p-5 rounded-[16px] bg-white/40 border border-white/20 hover:bg-white/60 transition-colors">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-4">{services[2].title}</h4>
                    <div className="space-y-3">
                        {services[2].items.slice(0, 2).map((item, i) => (
                             <div key={i} className="flex items-center justify-between group">
                                <span className="text-xs text-gray-600">{item}</span>
                                <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
                                    <motion.div initial={{width: 0}} whileInView={{width: i===0 ? '95%' : '70%'}} transition={{duration: 1}} className="h-full bg-neo-charcoal"></motion.div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
          </DashboardCard>

        </section>

        {/* RIGHT ASIDE: Stats & Tools */}
        <aside className="lg:col-span-3 md:col-span-1 space-y-6 order-2 lg:order-3">
            
            {/* Impact Data */}
            <CharcoalCard>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <IconContainer className="bg-white/10 text-white"><BarChart3 size={18} strokeWidth={1.5} /></IconContainer>
                        <h3 className="text-sm text-white font-medium">{ui.impactData}</h3>
                    </div>
                </div>
                
                <div className="flex items-end gap-2 h-32 mb-8">
                    <div className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full diagonal-stripes-dark h-[40%] rounded-md opacity-40 group-hover:opacity-50 transition-opacity"></div>
                        <span className="text-[9px] text-gray-500">2014</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full diagonal-stripes-dark h-[65%] rounded-md opacity-60 group-hover:opacity-70 transition-opacity"></div>
                        <span className="text-[9px] text-gray-500">2018</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="w-full diagonal-stripes-dark h-[85%] rounded-md bg-neo-yellow !opacity-100 shadow-[0_0_15px_rgba(247,241,135,0.3)] group-hover:scale-105 transition-transform origin-bottom"></div>
                        <span className="text-[9px] text-white font-bold">2024</span>
                    </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center group cursor-default">
                        <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{ui.efficiency}</span>
                        <span className="text-sm font-bold text-neo-yellow">+30%</span>
                    </div>
                    <div className="flex justify-between items-center group cursor-default">
                        <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{ui.volume}</span>
                        <span className="text-sm font-bold text-neo-yellow">50+</span>
                    </div>
                </div>
            </CharcoalCard>

            {/* Design Toolkit */}
            <div className="bg-white/50 rounded-[24px] p-8 border border-white/60 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
                 <h3 className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6">{ui.designToolkit}</h3>
                 <div className="flex flex-wrap gap-2">
                    {["Figma", "Spline 3D", "Rhino", "Blender", "Midjourney", "Tailwind"].map((tool) => (
                        <motion.span 
                            key={tool}
                            whileHover={{ scale: 1.1, backgroundColor: '#fff' }}
                            className="px-3 py-1.5 bg-white/80 rounded-lg text-xs font-medium border border-gray-100 text-gray-600 shadow-sm cursor-default transition-colors"
                        >
                            {tool}
                        </motion.span>
                    ))}
                 </div>
            </div>

            {/* Education */}
            <div className="bg-white/50 rounded-[24px] p-8 border border-white/60 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-3 mb-6">
                    <IconContainer><GraduationCap size={18} strokeWidth={1.5} /></IconContainer>
                    <h3 className="text-sm font-semibold text-gray-800">Education</h3>
                </div>
                <div className="space-y-6">
                    {content.education.map((edu, idx) => (
                        <div key={idx}>
                            <h4 className="text-xs font-bold text-gray-800">{edu.school}</h4>
                            <p className="text-[11px] text-gray-500 mt-1">{edu.degree}</p>
                        </div>
                    ))}
                </div>
            </div>

        </aside>

        {/* BOTTOM: Case Study */}
        <section className="lg:col-span-12 md:col-span-2 order-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.005 }}
                style={{
                    backgroundColor: 'var(--neo-charcoal, #333333)'
                }}
                className="rounded-[32px] overflow-hidden min-h-[500px] relative group flex flex-col justify-end p-8 lg:p-16 shadow-2xl"
            >
                <img 
                    alt="Featured Case Study" 
                    className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" 
                    src={projects[0].image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neo-charcoal via-transparent to-transparent"></div>
                
                <div className="relative z-10 max-w-2xl">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase mb-6 shadow-lg">Selected Case Study</span>
                    <h2 className="text-4xl lg:text-6xl text-white font-bold mb-8 leading-tight">Bridging <span className="italic text-neo-yellow">Design</span> & Industrial Systems.</h2>
                    <p className="text-gray-300 text-lg mb-10 leading-relaxed font-light">Integrating high-end aesthetics with complex enterprise architectures for the next generation of industrial dashboard experiences.</p>
                    
                    <SquircleButton className="bg-neo-yellow px-10 py-4 font-bold text-black flex items-center gap-3 hover:gap-5 transition-all shadow-[0_0_20px_rgba(247,241,135,0.4)]">
                        {ui.viewCaseStudy}
                        <ArrowRight size={20} />
                    </SquircleButton>
                </div>
            </motion.div>
        </section>

      </main>

      <footer className="max-w-[1440px] mx-auto mt-20 pb-10 border-t border-gray-200 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">© 2024 Christian Wu • Neo-Industrial Systems Portfolio</p>
        <div className="flex gap-8">
            {['LINKEDIN', 'BEHANCE', 'INSTAGRAM'].map(link => (
                <a key={link} className="text-xs font-bold text-neo-charcoal hover:text-gray-500 transition-colors" href="#">{link}</a>
            ))}
        </div>
      </footer>

    </div>
  );
};

export default CreativeView;
