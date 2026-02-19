
import React, { useState } from 'react';
import { Reorder } from 'framer-motion';
import Card from './ui/Card';
import EditableText from './ui/EditableText';
import Tooltip from './ui/Tooltip';
import SectionWrapper from './ui/SectionWrapper';
import { motion } from 'framer-motion';
import { ContentData, Language, ViewMode, SkillCategory } from '../types';
import { FileText, Layout, Info } from 'lucide-react';
import MarkdownEditorModal from './ui/MarkdownEditorModal';

interface RightSidebarProps {
  language: Language;
  content: ContentData;
  isEditing: boolean;
  onContentUpdate?: (newContent: any, msg: string) => void;
  fullContent: Record<'en' | 'zh', ContentData>;
  variant?: ViewMode;
  hiddenSections?: string[];
  onToggleVisibility?: (sectionId: string) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ 
    language, 
    content, 
    isEditing, 
    onContentUpdate, 
    fullContent,
    variant = 'classic',
    hiddenSections = [],
    onToggleVisibility
}) => {
  const { skills, ui } = content;
  const isGlass = variant === 'glass';

  // Markdown State
  const [mdModalOpen, setMdModalOpen] = useState(false);
  const [mdContent, setMdContent] = useState("");

  const updateContent = (index: number, field: string, value: any, log: string) => {
      if (!onContentUpdate) return;
      const newFullContent = JSON.parse(JSON.stringify(fullContent));
      // @ts-ignore
      newFullContent[language].skills[index][field] = value;
      onContentUpdate(newFullContent, log);
  };

  const enterMarkdownMode = () => {
    const text = skills.map(s => `# ${s.title}\n${s.skills.map(sk => typeof sk === 'string' ? `- ${sk}` : `- ${sk.name}: ${sk.description || ''}`).join('\n')}`).join('\n\n');
    setMdContent(text);
    setMdModalOpen(true);
  };

  const saveMarkdown = (content: string) => {
    if (!onContentUpdate) return;
    const newFullContent = JSON.parse(JSON.stringify(fullContent));
    const targetLang = newFullContent[language];

    const blocks = content.split(/\n\n+/);
    const newSkills: SkillCategory[] = [];
    blocks.forEach(block => {
        if(!block.trim()) return;
        const lines = block.split('\n').filter(l => l.trim());
        let title = "New Category";
        let skillItems: (string | {name: string, description?: string})[] = [];
        lines.forEach(line => {
            if (line.startsWith('#')) {
                title = line.replace(/^#\s*/, '').trim();
            } else if (line.startsWith('-') || line.startsWith('*')) {
                const itemContent = line.replace(/^[-*]\s*/, '').trim();
                if (itemContent.includes(':')) {
                    const [name, ...descParts] = itemContent.split(':');
                    skillItems.push({ name: name.trim(), description: descParts.join(':').trim() });
                } else {
                    skillItems.push(itemContent);
                }
            }
        });
        if (skillItems.length > 0 || title !== "New Category") newSkills.push({ title, skills: skillItems });
    });
    targetLang.skills = newSkills;
    
    onContentUpdate(newFullContent, "Updated skills via Markdown");
  };

  return (
    <aside className="hidden lg:block lg:col-span-3">
       <MarkdownEditorModal 
            isOpen={mdModalOpen}
            onClose={() => setMdModalOpen(false)}
            onSave={saveMarkdown}
            initialContent={mdContent}
            title="Skills & Proficiencies"
       />
       <Reorder.Group axis="y" values={['skills']} onReorder={() => {}}>
           <SectionWrapper 
                value="skills" isEditing={isEditing} title={ui.technicalProficiencies} onToggleMarkdown={enterMarkdownMode}
                isHidden={hiddenSections.includes('skills')} onToggleVisibility={() => onToggleVisibility && onToggleVisibility('skills')}
           >
                <div className="space-y-6">
                    {skills.map((category, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: idx * 0.1 }}
                        >
                            <Card className="relative group overflow-hidden" variant={isGlass ? 'glass' : 'classic'}>
                                {/* Background Decoration */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>

                                <EditableText
                                    tag="h4"
                                    className="text-xs font-bold text-text-secondary-light dark:text-text-secondary-dark uppercase tracking-wider mb-4 border-b border-gray-100 dark:border-gray-800 pb-2 block relative z-10"
                                    value={category.title}
                                    isEditing={isEditing}
                                    onSave={(val) => updateContent(idx, 'title', val, 'Updated skill title')}
                                />
                                <div className="flex flex-wrap gap-2 relative z-10">
                                    {category.skills.map((skill, sIdx) => {
                                        const skillName = typeof skill === 'string' ? skill : skill.name;
                                        const skillDesc = typeof skill === 'string' ? '' : (skill.description || '');
                                        return (
                                            <div key={sIdx} className="group/skill relative">
                                                {isEditing ? (
                                                    <div className="flex flex-col gap-1 p-1 border border-dashed border-gray-300 rounded bg-white/50">
                                                        <EditableText
                                                            value={skillName}
                                                            isEditing={true}
                                                            className="text-xs font-medium"
                                                            onSave={(val) => {
                                                                const newSkills = [...category.skills];
                                                                if (typeof newSkills[sIdx] === 'string') newSkills[sIdx] = val;
                                                                else (newSkills[sIdx] as any).name = val;
                                                                updateContent(idx, 'skills', newSkills, 'Updated skill name');
                                                            }}
                                                        />
                                                        <EditableText
                                                            value={skillDesc}
                                                            isEditing={true}
                                                            className="text-[10px] text-gray-500 italic"
                                                            onSave={(val) => {
                                                                const newSkills = [...category.skills];
                                                                if (typeof newSkills[sIdx] === 'string') {
                                                                    newSkills[sIdx] = { name: newSkills[sIdx] as string, description: val };
                                                                } else {
                                                                    (newSkills[sIdx] as any).description = val;
                                                                }
                                                                updateContent(idx, 'skills', newSkills, 'Updated skill description');
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <Tooltip content={skillDesc}>
                                                        <motion.span
                                                            whileHover={{
                                                                scale: 1.05,
                                                                y: -2,
                                                                boxShadow: "0 0 15px rgba(var(--color-primary-rgb), 0.3)",
                                                                borderColor: "rgba(var(--color-primary-rgb), 0.5)",
                                                                backgroundColor: "rgba(var(--color-primary-rgb), 0.1)"
                                                            }}
                                                            transition={{ duration: 0.2 }}
                                                            className="cursor-default px-3 py-1.5 bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap shadow-sm transition-all inline-block"
                                                        >
                                                            {skillName}
                                                        </motion.span>
                                                    </Tooltip>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
           </SectionWrapper>
       </Reorder.Group>
    </aside>
  );
};

export default RightSidebar;
