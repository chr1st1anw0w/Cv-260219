
import React, { useState, useRef } from 'react';
import { Mail, Phone, Globe, Linkedin, MapPin, GraduationCap, Plus, History, Brain, Diamond, Camera } from 'lucide-react';
import { Reorder } from 'framer-motion';
import Card from './ui/Card';
import SectionWrapper from './ui/SectionWrapper';
import EditableText from './ui/EditableText';
import MarkdownEditorModal from './ui/MarkdownEditorModal';
import { ContentData, LayoutConfig, SidebarSectionId, CustomField, Education, ViewMode } from '../types';

interface ProfileSidebarProps {
  language: 'en' | 'zh';
  content: ContentData;
  fullContent: Record<'en' | 'zh', ContentData>;
  order: SidebarSectionId[];
  isEditing?: boolean;
  onContentUpdate?: (newContent: Record<'en' | 'zh', ContentData>, msg?: string) => void;
  onLayoutUpdate?: (newLayout: LayoutConfig, msg?: string) => void;
  currentLayout?: LayoutConfig;
  variant?: ViewMode;
  hiddenSections?: string[];
  onToggleVisibility?: (sectionId: string) => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
    language, content, fullContent, order, isEditing = false, onContentUpdate, onLayoutUpdate, currentLayout,
    hiddenSections = [], onToggleVisibility
}) => {
  const { personalInfo, education, ui } = content;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Markdown State
  const [mdModalOpen, setMdModalOpen] = useState(false);
  const [mdContent, setMdContent] = useState("");
  const [mdMode, setMdMode] = useState<SidebarSectionId | null>(null);

  const updatePersonalInfo = (field: keyof typeof personalInfo, value: any) => {
    if(!onContentUpdate) return;
    const newFullContent = JSON.parse(JSON.stringify(fullContent));
    // @ts-ignore
    newFullContent[language].personalInfo[field] = value;
    onContentUpdate(newFullContent, `Updated personal info ${String(field)}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              updatePersonalInfo('avatar', reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  const updateEducation = (index: number, field: string, value: any) => {
      if(!onContentUpdate) return;
      const newFullContent = JSON.parse(JSON.stringify(fullContent));
      // @ts-ignore
      newFullContent[language].education[index][field] = value;
      onContentUpdate(newFullContent, `Updated education ${field}`);
  };

  const addCustomField = () => {
      if(!onContentUpdate) return;
      const newFullContent = JSON.parse(JSON.stringify(fullContent));
      const target = newFullContent[language].personalInfo;
      if (!target.customFields) target.customFields = [];
      target.customFields.push({ id: Date.now().toString(), label: "New Label", value: "New Value" });
      onContentUpdate(newFullContent, `Added custom field`);
  };

  const updateCustomField = (index: number, field: 'label' | 'value', val: string) => {
      if(!onContentUpdate) return;
      const newFullContent = JSON.parse(JSON.stringify(fullContent));
      // @ts-ignore
      newFullContent[language].personalInfo.customFields[index][field] = val;
      onContentUpdate(newFullContent, `Updated custom field ${field}`);
  };

  const enterMarkdownMode = (mode: SidebarSectionId) => {
    let contentStr = "";
    if (mode === 'profile') {
        contentStr = `# Name: ${personalInfo.name}\n# Chinese Name: ${personalInfo.chineseName}\n# Title: ${personalInfo.title}\n- Email: ${personalInfo.email}\n- Phone: ${personalInfo.phone}\n- Website: ${personalInfo.website}\n- LinkedIn: ${personalInfo.linkedin}\n- Location: ${personalInfo.location}\n- Avatar: ${personalInfo.avatar}`;
        if (personalInfo.customFields && personalInfo.customFields.length > 0) {
            contentStr += '\n' + personalInfo.customFields.map(f => `- Custom: ${f.label}: ${f.value}`).join('\n');
        }
    } else if (mode === 'education') {
        contentStr = education.map(edu => `# ${edu.school}\n## ${edu.degree}\n### ${edu.year}`).join('\n\n---\n\n');
    }
    setMdContent(contentStr);
    setMdMode(mode);
    setMdModalOpen(true);
  };

  const saveMarkdown = (content: string) => {
      if (!onContentUpdate) return;
      const newFullContent = JSON.parse(JSON.stringify(fullContent));
      const targetLang = newFullContent[language];

      if (mdMode === 'profile') {
          const lines = content.split('\n').filter(l => l.trim());
          const customFields: CustomField[] = [];
          lines.forEach(line => {
              if (line.startsWith('# Name:')) targetLang.personalInfo.name = line.replace('# Name:', '').trim();
              else if (line.startsWith('# Chinese Name:')) targetLang.personalInfo.chineseName = line.replace('# Chinese Name:', '').trim();
              else if (line.startsWith('# Title:')) targetLang.personalInfo.title = line.replace('# Title:', '').trim();
              else if (line.startsWith('- Email:')) targetLang.personalInfo.email = line.replace('- Email:', '').trim();
              else if (line.startsWith('- Phone:')) targetLang.personalInfo.phone = line.replace('- Phone:', '').trim();
              else if (line.startsWith('- Website:')) targetLang.personalInfo.website = line.replace('- Website:', '').trim();
              else if (line.startsWith('- LinkedIn:')) targetLang.personalInfo.linkedin = line.replace('- LinkedIn:', '').trim();
              else if (line.startsWith('- Location:')) targetLang.personalInfo.location = line.replace('- Location:', '').trim();
              else if (line.startsWith('- Avatar:')) targetLang.personalInfo.avatar = line.replace('- Avatar:', '').trim();
              else if (line.startsWith('- Custom:')) {
                  const parts = line.replace('- Custom:', '').split(':');
                  if (parts.length >= 2) {
                      const label = parts[0].trim();
                      const value = parts.slice(1).join(':').trim();
                      customFields.push({ id: Date.now().toString() + Math.random().toString(), label, value });
                  }
              }
          });
          if (customFields.length > 0) targetLang.personalInfo.customFields = customFields;
      } else if (mdMode === 'education') {
          const blocks = content.split('---');
          const newEdu: Education[] = [];
          blocks.forEach(block => {
              if (!block.trim()) return;
              const lines = block.split('\n').filter(l => l.trim());
              const edu: Education = { school: "School", degree: "Degree", year: "Year" };
              lines.forEach(line => {
                  if (line.startsWith('# ')) edu.school = line.replace(/^#\s*/, '').trim();
                  else if (line.startsWith('## ')) edu.degree = line.replace(/^##\s*/, '').trim();
                  else if (line.startsWith('### ')) edu.year = line.replace(/^###\s*/, '').trim();
              });
              newEdu.push(edu);
          });
          targetLang.education = newEdu;
      }

      onContentUpdate(newFullContent, `Updated ${mdMode} via Markdown`);
      setMdModalOpen(false);
      setMdMode(null);
  };

  const renderProfile = () => (
    <SectionWrapper 
        value="profile" 
        isEditing={isEditing} 
        title="Profile" 
        onToggleMarkdown={() => enterMarkdownMode('profile')}
        isHidden={hiddenSections.includes('profile')}
        onToggleVisibility={() => onToggleVisibility && onToggleVisibility('profile')}
    >
      <Card className="flex flex-col items-center text-center">
        <div 
            className={`relative mb-6 group ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={() => isEditing && fileInputRef.current?.click()}
        >
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-colors duration-500 relative">
                <img src={personalInfo.avatar} alt={personalInfo.name} className="w-full h-full object-cover" />
            </div>
            {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera size={24} className="text-white" />
                </div>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
            />
        </div>

        <EditableText tag="h1" className="text-3xl font-bold mb-1" value={personalInfo.name} isEditing={isEditing} onSave={(val) => updatePersonalInfo('name', val)} />
        <EditableText tag="h2" className="text-lg text-text-secondary-light dark:text-text-secondary-dark mb-2" value={personalInfo.chineseName} isEditing={isEditing} onSave={(val) => updatePersonalInfo('chineseName', val)} />
        <EditableText tag="p" className="text-sm text-primary font-bold mb-6" value={personalInfo.title} isEditing={isEditing} onSave={(val) => updatePersonalInfo('title', val)} />

        <div className="w-full space-y-3 pt-6 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 text-sm group">
                <Mail size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                <EditableText value={personalInfo.email} isEditing={isEditing} onSave={(val) => updatePersonalInfo('email', val)} className="text-text-secondary-light dark:text-text-secondary-dark" />
            </div>
            <div className="flex items-center gap-3 text-sm group">
                <Phone size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                <EditableText value={personalInfo.phone} isEditing={isEditing} onSave={(val) => updatePersonalInfo('phone', val)} className="text-text-secondary-light dark:text-text-secondary-dark" />
            </div>
            <div className="flex items-center gap-3 text-sm group">
                <Globe size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                <EditableText value={personalInfo.website} isEditing={isEditing} onSave={(val) => updatePersonalInfo('website', val)} className="text-text-secondary-light dark:text-text-secondary-dark" />
            </div>
            <div className="flex items-center gap-3 text-sm group">
                <Linkedin size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                <EditableText value={personalInfo.linkedin} isEditing={isEditing} onSave={(val) => updatePersonalInfo('linkedin', val)} className="text-text-secondary-light dark:text-text-secondary-dark" />
            </div>
            <div className="flex items-center gap-3 text-sm group">
                <MapPin size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                <EditableText value={personalInfo.location} isEditing={isEditing} onSave={(val) => updatePersonalInfo('location', val)} className="text-text-secondary-light dark:text-text-secondary-dark" />
            </div>
            
            {personalInfo.customFields?.map((field, idx) => (
                <div key={field.id} className="flex items-center gap-3 text-sm group">
                    <div className="w-4 flex justify-center">
                        <EditableText value={field.label} isEditing={isEditing} onSave={(val) => updateCustomField(idx, 'label', val)} className="text-[10px] uppercase font-bold text-gray-400" />
                    </div>
                    <EditableText value={field.value} isEditing={isEditing} onSave={(val) => updateCustomField(idx, 'value', val)} className="text-text-secondary-light dark:text-text-secondary-dark" />
                </div>
            ))}

            {isEditing && (
                <button onClick={addCustomField} className="w-full py-2 border border-dashed border-gray-200 dark:border-gray-700 rounded-lg text-xs text-gray-400 hover:text-primary hover:border-primary transition-all flex items-center justify-center gap-2">
                    <Plus size={12} /> Add Field
                </button>
            )}
        </div>
      </Card>
    </SectionWrapper>
  );

  const renderEducation = () => (
    <SectionWrapper 
        value="education" 
        isEditing={isEditing} 
        title="Education" 
        onToggleMarkdown={() => enterMarkdownMode('education')}
        isHidden={hiddenSections.includes('education')}
        onToggleVisibility={() => onToggleVisibility && onToggleVisibility('education')}
    >
      <Card>
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <GraduationCap size={20} />
            </div>
            <h3 className="font-bold text-sm uppercase tracking-widest text-text-secondary-light dark:text-text-secondary-dark">EDUCATION</h3>
        </div>
        <div className="space-y-6">
            {education.map((edu, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-primary/20 hover:border-primary transition-colors duration-300">
                    <EditableText tag="h4" className="font-bold text-sm leading-tight mb-1" value={edu.school} isEditing={isEditing} onSave={(val) => updateEducation(idx, 'school', val)} />
                    <EditableText tag="p" className="text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1" value={edu.degree} isEditing={isEditing} onSave={(val) => updateEducation(idx, 'degree', val)} />
                    <EditableText tag="p" className="text-[10px] text-gray-400" value={edu.year} isEditing={isEditing} onSave={(val) => updateEducation(idx, 'year', val)} />
                </div>
            ))}
        </div>
      </Card>
    </SectionWrapper>
  );

  const handleReorder = (newOrder: SidebarSectionId[]) => {
    if (onLayoutUpdate && currentLayout) {
      onLayoutUpdate({ ...currentLayout, sidebarOrder: newOrder }, "Reorder Sidebar");
    }
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
        <div className="flex flex-col gap-6">
            <Reorder.Group axis="y" values={order} onReorder={handleReorder}>
                {order.map(sectionId => {
                    switch(sectionId) {
                        case 'profile': return <div key={sectionId}>{renderProfile()}</div>;
                        case 'education': return <div key={sectionId}>{renderEducation()}</div>;
                        default: return null;
                    }
                })}
            </Reorder.Group>
        </div>
    </>
  );
};

export default ProfileSidebar;
