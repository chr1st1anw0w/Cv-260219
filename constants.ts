
import { ContentData, ColorPalette, MobileLayoutConfig } from './types';

export const THEMES: Record<string, ColorPalette> = {
  greyscale: {
    name: 'Greyscale Minimalist',
    colors: {
      primary: '#111111', // Dark Grey/Black for Light Mode
      primaryHover: '#333333',
      backgroundLight: '#F9F9F9',
      backgroundDark: '#050505',
      cardLight: '#FFFFFF',
      cardDark: '#111111',
      textLight: '#1A1A1A',
      textDark: '#E5E5E5'
    }
  },
  lime: {
    name: 'Original Lime',
    colors: {
      primary: '#DFFF00', // Lime Yellow
      primaryHover: '#ccec00',
      backgroundLight: '#F6F6F4',
      backgroundDark: '#121212',
      cardLight: '#FFFFFF',
      cardDark: '#1E1E1E',
      textLight: '#1A1A1A',
      textDark: '#E5E5E5'
    }
  }
};

const COMMON_PROJECTS = [
  {
    id: "design-dev-bridge",
    title: "Bridging Design & Industrial Systems.",
    subtitle: "Case Study",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBbTKG6d1taTIgPoDTuBovyfpNOZKaA0PYUEP0Q3Oxggpvs01BY3VaruK69GCIfGQvZgLc6W4v8xUPUPUvOeNXh1Uvh96EGgLeHpAfJ_dC0lbn3UGIeQG2gnATLJes5TWqx2QLDCAYIrNqx6XJqgScG1soXvftM5fSDvsHFNAqTl-rHGg-GqQZCPRuAiazjPvKN5NMVpTWkkUESaLASqq6XPcj_3D8nkOqJS5_YuAc1L33Ips6YyKp6ko-9ienlR-LjeRxPrqPSvzQ",
    type: "Featured",
    techStack: ["Next.js", "React Three Fiber", "Tailwind CSS"],
    description: "An interactive dashboard for industrial systems control."
  }
];

export const CONTENT: Record<'en' | 'zh', ContentData> = {
  en: {
    personalInfo: {
      name: "Christian Wu",
      chineseName: "吳華哲",
      title: "Multidisciplinary Designer & Manager",
      email: "christianwu.185@gmail.com",
      phone: "+886 908 683 180",
      website: "christianwu.framer.ai",
      linkedin: "linkedin.com/in/christian--wu",
      location: "Taipei, Taiwan",
      avatar: "/profile.jpeg",
      summary: "Innovative Design Strategist (ENTP) with 12+ years of cross-disciplinary expertise spanning architectural visualization to AI-enhanced digital experiences. Excel at transforming complex challenges into breakthrough solutions for Fortune 500 clients including **Apple**, **Tesla**, and **LVMH**. Natural catalyst for cross-functional innovation, consistently identifying emerging technology patterns and integrating them to achieve **30% efficiency improvements** and **15% brand recognition growth**.",
      clients: ["Apple", "Tesla", "LVMH", "Nike", "Adidas"]
    },
    metrics: [
      { label: "Experience", value: "12+ Yrs" },
      { label: "Projects", value: "50+" },
      { label: "Efficiency", value: "+40%", accent: true },
      { label: "Delivery", value: "100%" }
    ],
    coreValues: [
      { text: "Cross-industry design expertise with quantifiable business impact: **50+ projects**." },
      { text: "Proven design workflow optimization and team leadership: **20-40% efficiency gains**." },
      { text: "Strategic project management from concept to market delivery: **100% on-time delivery** record." },
      { text: "Fortune 500 client experience across architecture, technology, and luxury goods industries." },
      { text: "ENTP Innovation Mindset: Rapid adaptation to change, integrating diverse perspectives to create breakthrough value." }
    ],
    education: [
      {
        school: "National Taipei University of Technology",
        degree: "Bachelor of Science, in Architecture",
        year: "2010 — 2014"
      },
      {
        school: "Taipei Municipal Shilin High School of Commerce",
        degree: "Advertising Design Department",
        year: "2007 — 2010"
      }
    ],
    services: [
      {
        title: "Design Leadership & Strategy",
        iconName: 'Lightbulb',
        items: [
          "Product Design & Architecture",
          "Brand Identity Systems",
          "User Experience Design",
          "Design System Development",
          "Visual Storytelling",
          "Cross-platform Integration",
          "Innovation Integration",
          "Cross-disciplinary Pattern Recognition",
          "Strategic Design Decisions"
        ]
      },
      {
        title: "Project & Team Management",
        iconName: 'Workflow',
        items: [
          "Agile Project Management",
          "Cross-functional Team Leadership",
          "Digital Transformation",
          "Stakeholder Management",
          "Process Optimization",
          "Quality Assurance",
          "Innovation Catalyst",
          "Adaptive Management Strategies",
          "Large-scale Project Execution"
        ]
      },
      {
        title: "Technology Integration",
        iconName: 'Cpu',
        items: [
          "AR/VR/XR Implementation",
          "AI-Enhanced Workflows",
          "Data-Driven Design and Visualization",
          "Parametric Design",
          "BIM System Development",
          "Emerging Tech Adoption",
          "Digital Transformation Leadership"
        ]
      }
    ],
    skills: [
      {
        title: "Design & Prototyping",
        skills: [
          { name: "Figma", description: "Expert level. Advanced prototyping, variables, and design systems." },
          { name: "Sketch", description: "Expert level." },
          { name: "Adobe Creative Suite", description: "Expert: Photoshop, Illustrator, InDesign, After Effects, Premiere Pro." },
          { name: "Adobe XD", description: "Advanced level." }
        ]
      },
      {
        title: "3D & Architectural Design",
        skills: [
          { name: "Rhino", description: "Expert level." },
          { name: "Grasshopper", description: "Expert level parametric design." },
          { name: "SketchUp", description: "Expert level." },
          { name: "ArchiCAD", description: "Expert level." },
          { name: "AutoCAD", description: "Expert level." },
          { name: "Revit", description: "Advanced level." },
          "Blender", "Cinema 4D", "V-Ray", "Enscape", "Twinmotion", "D5 Render", "Unity"
        ]
      },
      {
        title: "AI & Emerging Technologies",
        skills: [
          { name: "ChatGPT", description: "Expert level workflow automation." },
          { name: "Midjourney", description: "Expert level visual generation." },
          { name: "Stable Diffusion", description: "Expert level." },
          { name: "Flux", description: "Advanced level." },
          "Claude Code", "Figma MCP", "Krea", "Manus AI", "GitHub Copilot", "Framer", "Cursor", "Spline"
        ]
      },
      {
        title: "Development & Programming",
        skills: [
          { name: "JavaScript", description: "Advanced level." },
          { name: "Python", description: "Advanced level." },
          { name: "API Integration", description: "Advanced level." },
          { name: "Git", description: "Version Control." },
          { name: "React Fundamentals", description: "Advanced level." },
          { name: "Node.js Basics", description: "Advanced level." },
          "HTML/CSS", "RESTful APIs", "Database Concepts", "Responsive Web Design"
        ]
      }
    ],
    experience: [
      {
        id: "araizen",
        company: "Araizen Inc.",
        title: "Creative Lead / Product Manager",
        period: "04/2025 – 07/2025",
        location: "Taipei, Taiwan",
        summary: "Leading AR & AI product integration. Autonomous R&D for original AR social products.",
        achievements: [
          "Led product roadmap, launched **25 core features**, 4.2/5.0 satisfaction.",
          "Reduced development cycle by **25%** with **95%** on-time delivery.",
          "Improved user conversion by **35%**, increasing MAU to **300%**."
        ],
        isHighlight: true,
        tags: ["Product", "AR/AI", "Strategy"]
      },
      {
        id: "12group",
        company: "12GROUP",
        title: "Creative Strategy / Digital Consultant",
        period: "02/2025 – 05/2025",
        location: "Taipei, Taiwan",
        summary: "Overseeing digital transformation for luxury residential parametric projects.",
        achievements: [
          "Increased brand recognition by **15%** in 2 weeks.",
          "Reduced design time by **20%** via AI asset management.",
          "Shortened strategy cycle by **30%**."
        ],
        tags: ["Consulting", "Luxury", "AI Ops"]
      },
      {
        id: "blocktempo",
        company: "BLOCKTEMPO",
        title: "Senior Design Consultant",
        period: "06/2024 – 08/2024",
        location: "Taipei, Taiwan",
        summary: "Led end-to-end design for blockchain media platform.",
        achievements: [
          "Executed 2-month project with **100% on-time delivery**.",
          "Enhanced UX through strategic design."
        ],
        tags: ["Web3", "UX", "Media"]
      },
      {
        id: "richhonour",
        company: "RICH HONOUR",
        title: "Project Manager",
        period: "06/2023 – 03/2024",
        location: "Taipei, Taiwan",
        summary: "Managed luxury projects for Apple, Tesla, LVMH. Digital PM system implementation.",
        achievements: [
          "Managed **600M TWD** luxury projects.",
          "Won **200M TWD** private banking proposal.",
          "Achieved **40% efficiency gain** via BIM."
        ],
        tags: ["PM", "BIM", "Fortune 500"]
      },
      {
        id: "kollector",
        company: "KOLLECTOR",
        title: "Creative Lead",
        period: "04/2021 – 06/2023",
        location: "Taipei, Taiwan",
        summary: "Multi-Product Manager for Visual Design, Tech Integration, and AR filters.",
        achievements: [
          "Delivered projects for **Apple**, **Nike**, **Adidas**, **Red Bull**.",
          "Contributed to 'Today at Apple' Creative Studios.",
          "Provided BIM consulting for various firms."
        ],
        tags: ["Creative", "AR", "Tech"]
      },
      {
        id: "ravenel",
        company: "RAVENEL ART GROUP",
        title: "Design Lead & Product Manager",
        period: "09/2018 – 04/2021",
        location: "Taipei, Taiwan",
        summary: "Head of Digital Media/Design. Built team from 0 to 1.",
        achievements: [
          "Established APP/Web development from scratch.",
          "Shortened project duration from **2 years** to **1 year**.",
          "Supported **20M TWD** revenue through exhibitions."
        ]
      },
      {
        id: "unfoldesign",
        company: "UNFOLDESIN",
        title: "Project Manager",
        period: "05/2016 – 09/2018",
        location: "Beijing, China",
        summary: "Design + Build projects for Tesla, UGG, Xiaomi.",
        achievements: [
          "Delivered turnkey solutions for major brands.",
          "Enhanced efficiency by **45%** via BIM.",
          "Completed **35,000 sqm** across 6 buildings."
        ]
      },
      {
        id: "baosteel",
        company: "BAOSTEEL CONSTRUCTION",
        title: "Design Manager",
        period: "06/2014 – 05/2016",
        location: "Beijing, China",
        summary: "Youngest design manager for Apple Retail Stores in China.",
        achievements: [
          "Managed **30 subcontractors** for Apple projects.",
          "**Zero tolerance** construction error.",
          "Led multiple Apple Store projects from 0 to 1."
        ]
      }
    ],
    projects: COMMON_PROJECTS,
    ui: {
      available: "AVAILABLE FOR HIRE",
      contact: "Get in touch",
      talk: "Let's Talk",
      dashboard: "Dashboard View",
      exitDashboard: "Exit Dashboard",
      viewCaseStudy: "VIEW CASE STUDY",
      workExperience: "Work Experience",
      projectHighlights: "Project Highlights",
      coreCompetencies: "Core Competencies",
      technicalProficiencies: "Technical Proficiencies",
      impactData: "Impact Data",
      efficiency: "Efficiency Improvement",
      volume: "Project Volume",
      designToolkit: "Design Toolkit",
      engagementHistory: "Engagement History",
      valueProposition: "Value Proposition"
    }
  },
  zh: {
    personalInfo: {
      name: "吳華哲",
      chineseName: "Christian Wu",
      title: "跨領域設計師暨專案經理",
      email: "christianwu.185@gmail.com",
      phone: "+886 908 683 180",
      website: "christianwu.framer.ai",
      linkedin: "linkedin.com/in/christian--wu",
      location: "台北, 台灣",
      avatar: "/profile.jpeg",
      summary: "具備超過 12 年跨領域經驗的創新設計策略師 (ENTP)，擅長將建築視覺化與 AI 增強的數位體驗無縫結合。精於將複雜挑戰轉化為突破性解決方案，曾為財富 500 強客戶 (**Apple**, **Tesla**, **LVMH**) 提供服務。持續識別新興技術模式並加以整合，實現 **30% 的效率提升** 和 **15% 的品牌知名度增長**。",
      clients: ["Apple", "Tesla", "LVMH", "Nike", "Adidas"]
    },
    metrics: [
      { label: "年資", value: "12+ 年" },
      { label: "專案數", value: "50+" },
      { label: "效率提升", value: "+40%", accent: true },
      { label: "交付率", value: "100%" }
    ],
    coreValues: [
      { text: "跨產業設計專業知識，具可量化的商業影響：**50+ 個專案**。" },
      { text: "經驗證的設計工作流程優化和團隊領導能力：**20-40% 的效率提升**。" },
      { text: "從概念到市場交付的策略性專案管理：**100% 準時交付記錄**。" },
      { text: "財富 500 強客戶經驗，涵蓋建築、科技和奢侈品產業。" },
      { text: "ENTP 創新思維：快速適應變化，整合多元視角以創造突破性價值。" }
    ],
    education: [
      {
        school: "國立臺北科技大學",
        degree: "建築系學士",
        year: "2010 — 2014"
      },
      {
        school: "臺北市立士林高級商業職業學校",
        degree: "廣告設計科",
        year: "2007 — 2010"
      }
    ],
    services: [
      {
        title: "設計領導與策略",
        iconName: 'Lightbulb',
        items: [
          "產品設計與架構",
          "品牌識別系統",
          "使用者體驗設計",
          "設計系統開發",
          "視覺敘事",
          "跨平台整合",
          "創新整合",
          "跨領域模式識別",
          "策略性設計決策"
        ]
      },
      {
        title: "專案與團隊管理",
        iconName: 'Workflow',
        items: [
          "敏捷專案管理",
          "跨職能團隊領導",
          "數位轉型",
          "利害關係人管理",
          "流程優化",
          "品質保證",
          "創新催化劑",
          "適應性管理策略",
          "大規模專案執行"
        ]
      },
      {
        title: "技術整合",
        iconName: 'Cpu',
        items: [
          "AR/VR/XR 實施",
          "AI 增強工作流程",
          "數據驅動設計與視覺化",
          "參數化設計",
          "BIM 系統開發",
          "新興技術採用",
          "數位轉型領導"
        ]
      }
    ],
    skills: [
      {
        title: "設計與原型製作",
        skills: [
          { name: "Figma", description: "專家級。進階原型製作、變數與設計系統。" },
          { name: "Sketch", description: "專家級。" },
          { name: "Adobe Creative Suite", description: "專家：Photoshop, Illustrator, InDesign, After Effects, Premiere Pro。" },
          { name: "Adobe XD", description: "進階級。" }
        ]
      },
      {
        title: "3D 與建築設計",
        skills: [
          { name: "Rhino", description: "專家級。" },
          { name: "Grasshopper", description: "專家級參數化設計。" },
          { name: "SketchUp", description: "專家級。" },
          { name: "ArchiCAD", description: "專家級。" },
          { name: "AutoCAD", description: "專家級。" },
          { name: "Revit", description: "進階級。" },
          "Blender", "Cinema 4D", "V-Ray", "Enscape", "Twinmotion", "D5 Render", "Unity"
        ]
      },
      {
        title: "AI 與新興技術",
        skills: [
          { name: "ChatGPT", description: "專家級工作流自動化。" },
          { name: "Midjourney", description: "專家級視覺生成。" },
          { name: "Stable Diffusion", description: "專家級。" },
          { name: "Flux", description: "進階級。" },
          "Claude Code", "Figma MCP", "Krea", "Manus AI", "GitHub Copilot", "Framer", "Cursor", "Spline"
        ]
      },
      {
        title: "開發與程式設計",
        skills: [
          { name: "JavaScript", description: "進階級。" },
          { name: "Python", description: "進階級。" },
          { name: "API 整合", description: "進階級。" },
          { name: "Git", description: "版本控制。" },
          { name: "React 基礎", description: "進階級。" },
          { name: "Node.js 基礎", description: "進階級。" },
          "HTML/CSS", "RESTful APIs", "資料庫概念", "響應式網頁設計"
        ]
      }
    ],
    experience: [
      {
        id: "araizen",
        company: "ARAIZEN",
        title: "創意總監 / 產品經理",
        period: "2025/04 – 2025/07",
        location: "台北, 台灣",
        summary: "主導 AR 與 AI 整合，開發前瞻性 AR 社交產品。",
        achievements: [
          "推出 **25 項核心功能**，產品滿意度 4.2/5.0。",
          "縮短開發週期 **25%**，準時交付率 **95%**。",
          "提升轉換率 **35%**，月活躍用戶增至 **300%**。"
        ],
        isHighlight: true,
        tags: ["產品", "AR/AI", "策略"]
      },
      {
        id: "12group",
        company: "12GROUP",
        title: "創意策略 / 數位顧問",
        period: "2025/02 – 2025/05",
        location: "台北, 台灣",
        summary: "負責豪宅專案數位轉型與多媒體開發。",
        achievements: [
          "2 週內提升品牌知名度 **15%**。",
          "透過 AI 資產管理減少 **20%** 設計時間。",
          "縮短策略開發週期 **30%**。"
        ],
        tags: ["顧問", "豪宅", "AI 營運"]
      },
      {
        id: "blocktempo",
        company: "BLOCKTEMPO",
        title: "資深設計顧問",
        period: "2024/06 – 2024/08",
        location: "台北, 台灣",
        summary: "領導區塊鏈媒體平台設計專案。",
        achievements: [
          "2 個月專案 **100% 準時交付**。",
          "透過策略設計提升用戶體驗。"
        ],
        tags: ["Web3", "UX", "媒體"]
      },
      {
        id: "richhonour",
        company: "RICH HONOUR 富御",
        title: "專案經理",
        period: "2023/06 – 2024/03",
        location: "台北, 台灣",
        summary: "管理 6 億台幣豪宅專案，導入 BIM 提升效率。",
        achievements: [
          "管理 **6 億台幣**專案與國際團隊。",
          "贏得 **2 億台幣**私人銀行提案。",
          "BIM 流程提升 **40%** 設計效率。"
        ],
        tags: ["專案管理", "BIM", "財富 500 強"]
      },
      {
        id: "kollector",
        company: "KOLLECTOR",
        title: "創意總監",
        period: "2021/04 – 2023/06",
        location: "台北, 台灣",
        summary: "多產品經理，負責視覺設計、技術整合與 AR 濾鏡。",
        achievements: [
          "交付 **Apple**, **Nike**, **Adidas**, **Red Bull** 等專案。",
          "參與 Today at Apple 創意工作坊。",
          "提供 BIM 系統化顧問服務。"
        ],
        tags: ["創意", "AR", "科技"]
      },
      {
        id: "ravenel",
        company: "羅芙奧藝術集團",
        title: "設計總監 & 產品經理",
        period: "2018/09 – 2021/04",
        location: "台北, 台灣",
        summary: "建立數位媒體團隊，從 0 到 1 開發 APP 與網站。",
        achievements: [
          "建立 APP/Web 開發流程。",
          "專案時程從 **2 年**縮短至 **1 年**。",
          "協助展覽創造 **2000 萬台幣**營收。"
        ]
      },
      {
        id: "unfoldesign",
        company: "UNFOLDESIN",
        title: "專案經理",
        period: "2016/05 – 2018/09",
        location: "北京, 中國",
        summary: "為 Tesla, Xiaomi 提供設計+建造一站式方案。",
        achievements: [
          "交付國際品牌一站式解決方案。",
          "BIM 提升 **45%** 施工圖效率。",
          "完成 6 棟建築共 **35,000 平米**。"
        ]
      },
      {
        id: "baosteel",
        company: "寶鋼建設",
        title: "設計經理",
        period: "2014/06 – 2016/05",
        location: "北京, 中國",
        summary: "中國 Apple Store 最年輕總承包商設計經理。",
        achievements: [
          "管理 **30 家分包商**。",
          "**零容忍**施工錯誤。",
          "領導多間 Apple Store 專案。"
        ]
      }
    ],
    projects: COMMON_PROJECTS,
    ui: {
      available: "可接受委託",
      contact: "聯絡我",
      talk: "聯絡洽談",
      dashboard: "儀表板模式",
      exitDashboard: "退出儀表板",
      viewCaseStudy: "查看案例研究",
      workExperience: "工作經歷",
      projectHighlights: "精選專案",
      coreCompetencies: "核心能力",
      technicalProficiencies: "技術專長",
      impactData: "影響力數據",
      efficiency: "效率提升",
      volume: "專案數量",
      designToolkit: "設計工具",
      engagementHistory: "參與歷史",
      valueProposition: "價值主張"
    }
  }
};

// --- Default Mobile Layout Schema v2 ---
export const DEFAULT_MOBILE_LAYOUT: MobileLayoutConfig = {
  enabled: true,
  columns: 2,
  gap: 16,
  safeArea: true,
  style: { 
      variant: "glass", 
      blur: "xl", 
      opacity: 0.10, 
      borderOpacity: 0.18, 
      radius: 18,
      shadow: "md",
      padding: 14,
      accent: { enabled: false, color: "#4DE1FF", position: "top", thickness: 3 }
  },
  gridSnapSize: 8,
  tabs: {
    profile: {
      blocks: [
        { id: "b_identity", tab: "profile", kind: "identity", order: 10, colSpan: 2, visible: true },
        {
          id: "b_metrics",
          tab: "profile",
          kind: "metrics",
          order: 20,
          colSpan: 2,
          visible: true,
          props: { layout: "2up", items: ["years", "projects", "efficiency", "onTime"] }
        },
        { id: "b_summary", tab: "profile", kind: "summary", order: 30, colSpan: 2, visible: true, props: { collapsible: true, linesCollapsed: 3 } },
        { id: "b_clients", tab: "profile", kind: "clients", order: 40, colSpan: 2, visible: true }
      ]
    },
    resume: {
      blocks: [
        { id: "b_filters", tab: "resume", kind: "filters", order: 10, colSpan: 2, visible: true },
        {
          id: "b_experience",
          tab: "resume",
          kind: "experienceList",
          order: 20,
          colSpan: 2,
          visible: true,
          props: {
            defaultExpandedId: null,
            card: {
              showTopAchievements: 2,
              maxChips: 2,
              expandMode: "bottomSheet"
            }
          },
          styleOverride: {
             opacity: 0.14,
             accent: { enabled: true, color: "#7CFFB2", position: "left", thickness: 3 }
          }
        },
        { id: "b_skills", tab: "resume", kind: "skills", order: 30, colSpan: 2, visible: true, props: { collapsible: true } },
        { id: "b_education", tab: "resume", kind: "education", order: 40, colSpan: 2, visible: true }
      ]
    }
  }
};
