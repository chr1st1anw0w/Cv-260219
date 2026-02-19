
import React, { useState, useRef } from 'react';
import { Reorder } from 'framer-motion';
import { Brain, Diamond, History, Lightbulb, Workflow, Cpu, Palette, Plus, X, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react';
import Card from './ui/Card';
import GlassCard from './GlassCard';
import SectionWrapper from './ui/SectionWrapper';
import ExperienceItem from './ExperienceItem';
import EditableText from './ui/EditableText';
import MarkdownEditorModal from './ui/MarkdownEditorModal';
import { ContentData, LayoutConfig, SectionId, Experience, SkillCategory, CoreValue, ServiceItem, Project, ViewMode } from '../types';
import Button from './ui/Button';
import ProjectCard from './ProjectCard';

interface MainContentProps {
  language: 'en' | 'zh';
  content: ContentData;
  fullContent: Record<'en' | 'zh', ContentData>;
  order: SectionId[];
  isEditing?: boolean;
  onContentUpdate?: (newContent: Record<'en' | 'zh', ContentData>, msg?: string) => void;
  onLayoutUpdate?: (newLayout: LayoutConfig, msg?: string) => void;
  currentLayout?: LayoutConfig;
  variant?: ViewMode;
  hiddenSections?: string[];
  onToggleVisibility?: (sectionId: string) => void;
}

const MobileSkillCard: React.FC<{ category: SkillCategory, variant?: ViewMode }> = ({ category, variant }) => (
  <div className={`flex-shrink-0 w-64 p-4 rounded-2xl border ${variant === 'glass' ? 'bg-white/5 border-white/10 backdrop-blur-md' : 'bg-white dark:bg-card-dark border-gray-100 dark:border-gray-800'}`}>
    <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3">{category.title}</h3>
    <div className="flex flex-wrap gap-2">
      {category.skills.map((skill, sIdx) => (
        <span key={sIdx} className="px-2 py-1 bg-gray-50 dark:bg-gray-800/50 rounded-lg text-[10px] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
          {typeof skill === 'string' ? skill : skill.name}
        </span>
      ))}
    </div>
  </div>
);

const MainContent: React.FC<MainContentProps> = ({ 
    language, content, fullContent, order, isEditing = false, onContentUpdate, onLayoutUpdate, currentLayout, variant = 'classic',
    hiddenSections = [], onToggleVisibility
}) => {
  const { services, skills, experience, personalInfo, coreValues, ui, projects } = content;
  const isGlass = variant === 'glass';
  const CardComponent = isGlass ? GlassCard : Card;
  const cardVariant = isGlass ? 'glass' : 'classic';

  const [mdModalOpen, setMdModalOpen] = useState(false);
  const [mdMode, setMdMode] = useState<SectionId | null>(null);
  const [mdContent, setMdContent] = useState("");
  const projectImageInputRef = useRef<HTMLInputElement>(null);
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);

  const updateContent = (section: keyof ContentData, index: number, field: string, value: any, log: string) => {
      if (!onContentUpdate) return;
      const newFullContent = JSON.parse(JSON.stringify(fullContent));
      const target = newFullContent[language][section];
      if (Array.isArray(target) && typeof index === 'number') {
          if (field) target[index][field] = value;
          else target[index] = value;
      }
      onContentUpdate(newFullContent, log);
  };
  
  const updatePersonalInfo = (field: string, value: any) => {
    if(!onContentUpdate) return;
    const newFullContent = JSON.parse(JSON.stringify(fullContent));
    // @ts-ignore
    newFullContent[language].personalInfo[field] = value;
    onContentUpdate(newFullContent, `Updated personal info ${field}`);
  };

  const updateCoreValue = (index: number, val: string) => {
    if(!onContentUpdate) return;
    const newFullContent = JSON.parse(JSON.stringify(fullContent));
    newFullContent[language].coreValues[index].text = val;
    onContentUpdate(newFullContent, `Updated core value`);
  };

  const addItem = (section: 'services' | 'skills' | 'experience' | 'coreValues' | 'projects') => {
      if (!onContentUpdate) return;
      const newFullContent = JSON.parse(JSON.stringify(fullContent));
      if (section === 'services') {
          newFullContent[language].services.push({ title: "New Service", items: ["New Item"], iconName: "Lightbulb" });
      } else if (section === 'skills') {
          newFullContent[language].skills.push({ title: "New Skill Set", skills: ["New Skill"] });
      } else if (section === 'experience') {
           newFullContent[language].experience.unshift({ id: Date.now().toString(), company: "New Company", title: "Title", period: "2024", summary: "", achievements: [] });
      } else if (section === 'coreValues') {
          newFullContent[language].coreValues.unshift({ text: "New Value" });
      } else if (section === 'projects') {
          if (!newFullContent[language].projects) newFullContent[language].projects = [];
          newFullContent[language].projects.unshift({
              id: Date.now().toString(),
              title: "New Project",
              subtitle: "Subtitle",
              type: "Personal",
              image: "https://via.placeholder.com/600x400?text=New+Project",
              description: "Project description goes here...",
              techStack: ["React"],
              link: ""
          });
      }
      onContentUpdate(newFullContent, `Added to ${section}`);
  };

  const deleteItem = (section: keyof ContentData, index: number) => {
      if (!onContentUpdate) return;
      const newFullContent = JSON.parse(JSON.stringify(fullContent));
      if (Array.isArray(newFullContent[language][section])) {
          newFullContent[language][section].splice(index, 1);
          onContentUpdate(newFullContent, `Deleted from ${section}`);
      }
  };

  const handleProjectImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              updateContent('projects', index, 'image', reader.result as string, "Updated project image");
          };
          reader.readAsDataURL(file);
      }
  };

  const getIcon = (name: string) => {
      switch(name) {
          case 'Lightbulb': return <Lightbulb size={24} />;
          case 'Workflow': return <Workflow size={24} />;
          case 'Cpu': return <Cpu size={24} />;
          default: return <Palette size={24} />;
      }
  };

  const enterMarkdownMode = (mode: SectionId) => {
      let contentStr = "";
      if (mode === 'summary') {
          contentStr = personalInfo.summary;
      } else if (mode === 'values') {
          contentStr = coreValues.map(v => `- ${v.text}`).join('\n');
      } else if (mode === 'toolkit') {
          contentStr = skills.map(cat => {
              const skillsList = cat.skills.map(s => {
                  if (typeof s === 'string') return `- ${s}`;
                  return `- ${s.name}: ${s.description || ''}`;
              }).join('\n');
              return `# ${cat.title}\n${skillsList}`;
          }).join('\n\n---\n\n');
      } else if (mode === 'experience') {
          contentStr = experience.map(exp => {
              return `# ${exp.company}\n## ${exp.title}\n### ${exp.period}\n\n${exp.summary}\n\n${exp.achievements.map(a => `- ${a}`).join('\n')}`;
          }).join('\n\n---\n\n');
      } else if (mode === 'services') {
          contentStr = services.map(s => {
              return `# ${s.title}\nIcon: ${s.iconName}\n${s.items.map(i => `- ${i}`).join('\n')}`;
          }).join('\n\n---\n\n');
      }
      setMdContent(contentStr);
      setMdMode(mode);
      setMdModalOpen(true);
  };

  const saveMarkdown = (content: string) => {
      if (!onContentUpdate) return;
      const newFullContent = JSON.parse(JSON.stringify(fullContent));
      const targetLang = newFullContent[language];

      if (mdMode === 'toolkit') {
          const blocks = content.split('---');
          const newSkills: SkillCategory[] = [];
          blocks.forEach(block => {
              if (!block.trim()) return;
              const lines = block.split('\n').filter(l => l.trim());
              let title = "New Category";
              let skillItems: (string | {name: string, description?: string})[] = [];
              lines.forEach(line => {
                  if (line.startsWith('# ')) title = line.replace(/^#\s*/, '').trim();
                  else if (line.startsWith('-') || line.startsWith('*')) {
                      const itemContent = line.replace(/^[-*]\s*/, '').trim();
                      if (itemContent.includes(':')) {
                          const [name, ...descParts] = itemContent.split(':');
                          skillItems.push({ name: name.trim(), description: descParts.join(':').trim() });
                      } else {
                          skillItems.push(itemContent);
                      }
                  }
              });
              newSkills.push({ title, skills: skillItems });
          });
          targetLang.skills = newSkills;
      } else if (mdMode === 'experience') {
          const blocks = content.split('---');
          const newExperience: Experience[] = [];
          blocks.forEach(block => {
              if (!block.trim()) return;
              const lines = block.split('\n').filter(l => l.trim());
              const exp: Experience = {
                  id: Date.now().toString() + Math.random(),
                  company: "Company",
                  title: "Title",
                  period: "Period",
                  summary: "",
                  achievements: []
              };
              let summaryLines: string[] = [];
              lines.forEach(line => {
                  if (line.startsWith('# ')) exp.company = line.replace(/^#\s*/, '').trim();
                  else if (line.startsWith('## ')) exp.title = line.replace(/^##\s*/, '').trim();
                  else if (line.startsWith('### ')) exp.period = line.replace(/^###\s*/, '').trim();
                  else if (line.startsWith('-') || line.startsWith('*')) exp.achievements.push(line.replace(/^[-*]\s*/, '').trim());
                  else summaryLines.push(line);
              });
              exp.summary = summaryLines.join('\n');
              newExperience.push(exp);
          });
          targetLang.experience = newExperience;
      } else if (mdMode === 'services') {
          const blocks = content.split('---');
          const newServices: ServiceItem[] = [];
          blocks.forEach(block => {
              if (!block.trim()) return;
              const lines = block.split('\n').filter(l => l.trim());
              let title = "New Service";
              let items: string[] = [];
              let iconName: any = "Lightbulb";
              lines.forEach(line => {
                  if (line.startsWith('# ')) title = line.replace(/^#\s*/, '').trim();
                  else if (line.startsWith('Icon: ')) iconName = line.replace('Icon: ', '').trim();
                  else if (line.startsWith('-') || line.startsWith('*')) items.push(line.replace(/^[-*]\s*/, '').trim());
              });
              newServices.push({ title, items, iconName });
          });
          targetLang.services = newServices;
      } else if (mdMode === 'summary') {
          targetLang.personalInfo.summary = content;
      } else if (mdMode === 'values') {
          targetLang.coreValues = content.split('\n').filter(l => l.trim()).map(l => ({ text: l.replace(/^[-*]\s*/, '').trim() }));
      }

      onContentUpdate(newFullContent, `Updated ${mdMode} via Markdown`);
      setMdModalOpen(false);
      setMdMode(null);
  };

  const renderSummary = () => (
    <SectionWrapper 
        value="summary" isEditing={isEditing} title="Summary" onToggleMarkdown={() => enterMarkdownMode('summary')}
        isHidden={hiddenSections.includes('summary')} onToggleVisibility={() => onToggleVisibility && onToggleVisibility('summary')}
    >
      <CardComponent delay={0.1} className={`h-full ${isGlass ? 'border-l-4 border-l-primary' : ''}`}>
          <div className="flex items-center gap-2 mb-4">
            <Brain size={20} className="text-primary" />
            <h3 className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">{language === 'en' ? 'Professional Summary' : '專業總結'}</h3>
          </div>
          <EditableText tag="p" multiline className="text-sm text-text-secondary-light dark:text-text-secondary-dark leading-relaxed" value={personalInfo.summary} isEditing={isEditing} onSave={(val) => updatePersonalInfo('summary', val)} />
      </CardComponent>
    </SectionWrapper>
  );

  const renderValues = () => (
    <SectionWrapper 
        value="values" isEditing={isEditing} title="Values" onAddBlock={() => addItem('coreValues')} onToggleMarkdown={() => enterMarkdownMode('values')}
        isHidden={hiddenSections.includes('values')} onToggleVisibility={() => onToggleVisibility && onToggleVisibility('values')}
    >
      <CardComponent delay={0.3} className="h-full">
          <div className="flex items-center gap-2 mb-4">
            <Diamond size={20} className="text-primary" />
            <h3 className="text-sm font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider">{ui.valueProposition}</h3>
          </div>
          <ul className="space-y-3">
            {coreValues.map((val, idx) => (
              <li key={idx} className="text-xs text-text-secondary-light dark:text-text-secondary-dark leading-relaxed flex gap-3 group">
                <span className="text-primary font-bold mt-0.5 group-hover:scale-150 transition-transform duration-300">•</span>
                <div className="flex-1 flex justify-between items-start gap-2">
                    <EditableText multiline value={val.text} isEditing={isEditing} onSave={(val) => updateCoreValue(idx, val)} />
                    {isEditing && (
                        <button onClick={() => deleteItem('coreValues', idx)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                            <X size={14} />
                        </button>
                    )}
                </div>
              </li>
            ))}
          </ul>
      </CardComponent>
    </SectionWrapper>
  );

  const renderServices = () => (
    <SectionWrapper 
        key="services" value="services" isEditing={isEditing} title="Core Competencies" onAddBlock={() => addItem('services')} onToggleMarkdown={() => enterMarkdownMode('services')}
        isHidden={hiddenSections.includes('services')} onToggleVisibility={() => onToggleVisibility && onToggleVisibility('services')}
    >
        <div className={getGridClass('services')}>
        {services.map((card, idx) => (
            <CardComponent key={idx} className="flex flex-col h-full relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                {isEditing && (
                    <button onClick={() => deleteItem('services', idx)} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                        <Trash2 size={14} />
                    </button>
                )}
                <div className="text-primary mb-4">{getIcon(card.iconName)}</div>
                <div className="mb-4 relative z-10">
                    <EditableText tag="h3" className="font-bold text-lg text-text-light dark:text-white" value={card.title} isEditing={isEditing} onSave={(val) => updateContent('services', idx, 'title', val, "Update")} />
                </div>
                <ul className="space-y-2 text-xs relative z-10 opacity-80">
                {card.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">−</span>
                    <EditableText value={item} isEditing={isEditing} onSave={(val) => {
                        const newItems = [...card.items];
                        if (val.trim() === '') newItems.splice(i, 1);
                        else newItems[i] = val;
                        updateContent('services', idx, 'items', newItems, "Update");
                    }} />
                    </li>
                ))}
                </ul>
            </CardComponent>
        ))}
        </div>
    </SectionWrapper>
  );

  const renderToolkit = () => (
    <SectionWrapper 
        key="toolkit" value="toolkit" isEditing={isEditing} title="Skills" onAddBlock={() => addItem('skills')} onToggleMarkdown={() => enterMarkdownMode('toolkit')}
        isHidden={hiddenSections.includes('toolkit')} onToggleVisibility={() => onToggleVisibility && onToggleVisibility('toolkit')}
    >
         <div className="w-full">
             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 px-1">{ui.technicalProficiencies}</h3>
             <div className="flex overflow-x-auto gap-2 pb-4 -mx-4 px-4 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
                {skills.map((category, idx) => (
                    <MobileSkillCard key={idx} category={category} variant={variant} />
                ))}
             </div>
         </div>
    </SectionWrapper>
  );

  const renderExperience = () => (
    <SectionWrapper 
        key="experience" value="experience" isEditing={isEditing} title="Work Experience" onAddBlock={() => addItem('experience')} onToggleMarkdown={() => enterMarkdownMode('experience')}
        isHidden={hiddenSections.includes('experience')} onToggleVisibility={() => onToggleVisibility && onToggleVisibility('experience')}
    >
      <CardComponent delay={0.3} className="relative">
        <h2 className="text-2xl font-bold mb-10 flex items-center gap-3">
            <History size={24} className="text-primary" /> {ui.workExperience}
        </h2>
        <div className="space-y-10 relative">
        {experience.map((exp, idx) => (
            <div key={exp.id} className="group relative">
                {isEditing && (
                    <button onClick={() => deleteItem('experience', idx)} className="absolute -right-2 top-0 p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 size={16} />
                    </button>
                )}
                {isEditing ? (
                    <div className="p-4 border border-dashed border-gray-300 rounded-xl space-y-3">
                        <EditableText value={exp.company} isEditing={true} onSave={(val) => updateContent('experience', idx, 'company', val, "Update")} className="font-bold" />
                        <EditableText value={exp.title} isEditing={true} onSave={(val) => updateContent('experience', idx, 'title', val, "Update")} className="text-primary" />
                        <EditableText value={exp.period} isEditing={true} onSave={(val) => updateContent('experience', idx, 'period', val, "Update")} className="text-xs" />
                        <EditableText multiline value={exp.summary} isEditing={true} onSave={(val) => updateContent('experience', idx, 'summary', val, "Update")} className="text-sm" />
                    </div>
                ) : <ExperienceItem key={exp.id} exp={exp} />}
            </div>
        ))}
        </div>
      </CardComponent>
    </SectionWrapper>
  );

  const renderProjects = () => (
    <SectionWrapper 
        key="projects" value="projects" isEditing={isEditing} title={ui.projectHighlights} onAddBlock={() => addItem('projects')}
        isHidden={hiddenSections.includes('projects')} onToggleVisibility={() => onToggleVisibility && onToggleVisibility('projects')}
    >
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Palette size={24} className="text-primary" /> {ui.projectHighlights}
            </h2>
            <div className={getGridClass('projects')}>
                {(isEditing ? (projects || []) : (projects || []).filter(p => p.type === 'Featured')).map((project, idx) => {
                    // Find actual index in original array for editing if filtered (simplified for now: editing mode shows all)
                    const realIndex = idx; // If we show all in edit mode

                    if (isEditing) {
                        return (
                            <div key={project.id} className="relative p-4 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-black/20 group">
                                <button onClick={() => deleteItem('projects', realIndex)} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                    <Trash2 size={14} />
                                </button>
                                
                                <div className="space-y-3">
                                    <div 
                                        className="w-full h-32 bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden relative cursor-pointer group/img"
                                        onClick={() => {
                                            setActiveProjectIndex(realIndex);
                                            projectImageInputRef.current?.click();
                                        }}
                                    >
                                        <img src={project.image} alt="Project" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                            <ImageIcon className="text-white" />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Title</label>
                                        <EditableText value={project.title} isEditing={true} onSave={(val) => updateContent('projects', realIndex, 'title', val, "Update project title")} className="font-bold text-sm" />
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Subtitle</label>
                                        <EditableText value={project.subtitle} isEditing={true} onSave={(val) => updateContent('projects', realIndex, 'subtitle', val, "Update project subtitle")} className="text-xs" />
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Type</label>
                                        <EditableText value={project.type} isEditing={true} onSave={(val) => updateContent('projects', realIndex, 'type', val, "Update project type")} className="text-xs bg-primary/10 px-1 rounded text-primary" />
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Description</label>
                                        <EditableText multiline value={project.description || ''} isEditing={true} onSave={(val) => updateContent('projects', realIndex, 'description', val, "Update project desc")} className="text-xs" />
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Tech Stack (comma separated)</label>
                                        <EditableText 
                                            value={project.techStack?.join(', ') || ''} 
                                            isEditing={true} 
                                            onSave={(val) => updateContent('projects', realIndex, 'techStack', val.split(',').map(s => s.trim()), "Update project tech")} 
                                            className="text-xs font-mono" 
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-gray-400">Link</label>
                                        <div className="flex items-center gap-2">
                                            <ExternalLink size={12} className="text-gray-400" />
                                            <EditableText value={project.link || ''} isEditing={true} onSave={(val) => updateContent('projects', realIndex, 'link', val, "Update project link")} className="text-xs text-blue-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }

                    return <ProjectCard key={project.id} project={project} variant={cardVariant} className="h-full" />;
                })}
            </div>
            
            {/* Hidden Input for Project Image */}
            <input 
                type="file" 
                ref={projectImageInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={(e) => activeProjectIndex !== null && handleProjectImageUpload(e, activeProjectIndex)} 
            />
        </div>
    </SectionWrapper>
  );

  const handleReorder = (newOrder: SectionId[]) => {
    if (onLayoutUpdate && currentLayout) {
      onLayoutUpdate({ ...currentLayout, mainContentOrder: newOrder }, "Reorder");
    }
  };

  const getAlignmentClass = (sectionId: SectionId) => {
    const alignment = currentLayout?.sectionAlignment?.[sectionId] || 'left';
    switch (alignment) {
      case 'center': return 'text-center items-center';
      case 'right': return 'text-right items-end';
      default: return 'text-left items-start';
    }
  };

  const getGridClass = (sectionId: SectionId) => {
    const cols = currentLayout?.gridColumns || 3;
    // Tailwind doesn't support dynamic classes like `grid-cols-${cols}`
    const gridMap: Record<number, string> = {
        1: 'md:grid-cols-1',
        2: 'md:grid-cols-2',
        3: 'md:grid-cols-3',
        4: 'md:grid-cols-4'
    };
    return `grid grid-cols-1 ${gridMap[cols] || 'md:grid-cols-3'} gap-6`;
  };

  return (
    <>
        <MarkdownEditorModal
            isOpen={mdModalOpen}
            onClose={() => setMdModalOpen(false)}
            onSave={saveMarkdown}
            initialContent={mdContent}
            title={mdMode || "Section"}
        />
        <div className="flex flex-col gap-8">
            <Reorder.Group axis="y" values={order} onReorder={handleReorder}>
            {order.map((sectionId) => {
                const alignmentClass = getAlignmentClass(sectionId);
                const gridClass = getGridClass(sectionId);
                
                switch (sectionId) {
                case 'summary': return <div key={sectionId} className={`flex flex-col ${alignmentClass}`}>{renderSummary()}</div>;
                case 'values': return <div key={sectionId} className={`flex flex-col ${alignmentClass}`}>{renderValues()}</div>;
                case 'projects': return <div key={sectionId} className={`flex flex-col ${alignmentClass}`}>{renderProjects()}</div>;
                case 'experience': return <div key={sectionId} className={`flex flex-col ${alignmentClass}`}>{renderExperience()}</div>;
                case 'services': return <div key={sectionId} className={`flex flex-col ${alignmentClass}`}>{renderServices()}</div>;
                case 'toolkit': return <div key={sectionId} className={`flex flex-col ${alignmentClass}`}>{renderToolkit()}</div>;
                default: return null;
                }
            })}
            </Reorder.Group>
        </div>
    </>
  );
};

export default MainContent;
