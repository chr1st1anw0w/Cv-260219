
export type Language = 'en' | 'zh';
export type ViewMode = 'classic' | 'dashboard' | 'glass' | 'admin' | 'analytics' | 'node' | 'expert';

export interface ColorPalette {
  name: string;
  colors: {
    primary: string;
    primaryHover: string;
    backgroundLight: string;
    backgroundDark: string;
    cardLight: string;
    cardDark: string;
    textLight: string;
    textDark: string;
  }
}

export interface LayoutTokens {
    containerWidth: number;
    gridColumns: number;
    gridGap: number;
    sectionPadding: number;
    componentPadding: number;
    bentoStrategy: "dense" | "loose" | "staggered";
    alignment: "left" | "center" | "right";
}

export interface DesignSystem {
    borderRadius: number; // in px
    spacingScale: number; // multiplier 0.8 - 1.5
    fontScale: number; // multiplier 0.8 - 1.2
    fontBody?: string;
    fontHeading?: string;
    shadowStrength?: 'none' | 'soft' | 'medium' | 'hard' | 'glass' | 'glow';
    iconStyle?: 'thin' | 'standard' | 'bold'; // New granular style
}

export interface CustomTheme extends ColorPalette {
    id: string;
    isAiGenerated?: boolean;
    sourceImage?: string;
    layoutPreference?: Partial<LayoutConfig>;
    designSystem?: DesignSystem;
    layoutTokens?: LayoutTokens;
}

export interface StyleAnalysis {
    palette: ColorPalette;
    mood: string;
    description: string;
}

export interface CustomField {
  id: string;
  label: string;
  value: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  period: string;
  location?: string;
  summary: string;
  achievements: string[];
  highlightAchievementIndexes?: number[]; // New: Manual override for top achievements
  isHighlight?: boolean;
  tags?: string[]; // New: For filtering/bento chips
}

export interface Education {
  school: string;
  degree: string;
  year: string;
  department?: string;
}

export interface SkillItem {
  name: string;
  description?: string;
}

export interface SkillCategory {
  title: string;
  skills: (string | SkillItem)[];
}

export interface ServiceItem {
  title: string;
  items: string[];
  iconName: 'Lightbulb' | 'Workflow' | 'Cpu';
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  type: string;
  link?: string;
  techStack?: string[];
  description?: string;
}

export interface CoreValue {
  text: string;
}

export interface Metric { // New: For Dashboard/Bento
    label: string;
    value: string;
    accent?: boolean;
}

export interface PersonalInfo {
  name: string;
  chineseName: string;
  title: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  location: string;
  avatar: string;
  summary: string;
  customFields?: CustomField[];
  clients?: string[]; // New: For Signature Clients card
}

export interface UIStrings {
  available: string;
  contact: string;
  talk: string;
  dashboard: string;
  exitDashboard: string;
  viewCaseStudy: string;
  workExperience: string;
  projectHighlights: string;
  coreCompetencies: string;
  technicalProficiencies: string;
  impactData: string;
  efficiency: string;
  volume: string;
  designToolkit: string;
  engagementHistory: string;
  valueProposition: string;
}

export interface ContentData {
  personalInfo: PersonalInfo;
  coreValues: CoreValue[];
  education: Education[];
  services: ServiceItem[];
  skills: SkillCategory[];
  experience: Experience[];
  projects: Project[];
  metrics?: Metric[]; // New
  ui: UIStrings;
}

export type SectionId = 'summary' | 'values' | 'services' | 'toolkit' | 'experience' | 'projects';
export type SidebarSectionId = 'profile' | 'education';

// --- Mobile Bento Grid Types v2 ---
export type MobileTabKey = "profile" | "resume";
export type BentoColSpan = 1 | 2;
export type BentoRowSpan = 1 | 2 | 3;
export type GlassBlur = "md" | "lg" | "xl";

export type BlockKind =
  | "identity"
  | "metrics"
  | "summary"
  | "clients"
  | "filters"
  | "experienceList"
  | "skills"
  | "education"
  | "projects"
  | "custom";

export interface GlassStyleTokens {
  variant: "glass";
  blur: GlassBlur;          // backdrop blur
  opacity: number;          // 0~1 (card background)
  borderOpacity: number;    // 0~1
  radius: number;           // px
  shadow: "none" | "sm" | "md";
  padding: 10 | 12 | 14 | 16;
  accent?: {
    enabled: boolean;
    color: string;          // e.g. "#4DE1FF"
    position: "top" | "left" | "none";
    thickness: 2 | 3 | 4;
  };
}

export interface MobileBentoBlock {
  id: string;
  tab: MobileTabKey;
  kind: BlockKind;
  order: number;
  colSpan: BentoColSpan;
  rowSpan?: BentoRowSpan;
  visible: boolean;
  title?: string;
  props?: Record<string, any>;
  styleOverride?: Partial<GlassStyleTokens>; // Per-card style override
  alignment?: 'left' | 'center' | 'right' | 'justify'; // New: Alignment
  snapToGrid?: boolean; // New: Snapping behavior
}

export interface MobileLayoutConfig {
  enabled: boolean;
  columns: 2;
  gap: number;
  safeArea: boolean;
  style: GlassStyleTokens; // Global default style
  tabs: {
    profile: { blocks: MobileBentoBlock[] };
    resume: { blocks: MobileBentoBlock[] };
  };
  gridSnapSize?: number; // New: Grid snap increment in px
}

export interface LayoutConfig {
  mainContentOrder: SectionId[];
  sidebarOrder: SidebarSectionId[];
  hiddenSections: string[];
  enabledStyles: ViewMode[];
  activeTheme?: string;
  customThemes?: CustomTheme[];
  customPalette?: ColorPalette;
  designSystem?: DesignSystem;
    layoutTokens?: LayoutTokens;
  mobile?: MobileLayoutConfig; // New Mobile Schema
  gridColumns?: number; // New: Desktop grid columns
  gridSnap?: boolean; // New: Desktop grid snapping
  sectionAlignment?: Record<SectionId, 'left' | 'center' | 'right'>; // New: Desktop alignment
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  description: string;
  contentSnapshot: Record<'en' | 'zh', ContentData>;
  layoutSnapshot: LayoutConfig;
}


// --- Resume Export Schema ---
// Standardized structure for exporting resume data as JSON.
// Derived from ContentData, flattened for portability.
export interface ResumeExportSchema {
  $schema: 'neocv-resume/1.0';
  exportedAt: string;           // ISO 8601 timestamp
  language: Language;
  personalInfo: PersonalInfo;
  summary: string;              // personalInfo.summary extracted to top-level
  coreValues: CoreValue[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: SkillCategory[];
  services: ServiceItem[];
  metrics?: Metric[];
}