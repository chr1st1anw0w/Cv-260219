
// UI/UX Pro Max Knowledge Base
// Ported from ui-ux-pro-max-skill-main data

export interface DesignStyle {
    name: string;
    keywords: string[];
    bestFor: string[];
    colors: string[]; // Representative hex codes
    description: string;
    cssParams: any;
}

export const STYLES_DB: DesignStyle[] = [
    {
        name: "Minimalism & Swiss Style",
        keywords: ["clean", "simple", "functional", "white space", "grid", "essential"],
        bestFor: ["SaaS", "Enterprise", "Documentation", "Professional"],
        colors: ["#000000", "#FFFFFF", "#F5F1E8", "#808080"],
        description: "High contrast, geometric, sans-serif, grid-based, essential elements only.",
        cssParams: { borderRadius: 0, spacingScale: 1.2, shadowStrength: 'none', iconStyle: 'thin' }
    },
    {
        name: "Glassmorphism",
        keywords: ["frosted", "glass", "transparent", "blur", "vibrant", "depth"],
        bestFor: ["Modern SaaS", "Financial", "Lifestyle", "Crypto"],
        colors: ["rgba(255,255,255,0.1)", "#0080FF", "#8B00FF"],
        description: "Backdrop blur, translucent layers, vibrant backgrounds, subtle borders.",
        cssParams: { borderRadius: 16, spacingScale: 1.1, shadowStrength: 'glass', iconStyle: 'thin' }
    },
    {
        name: "Neubrutalism",
        keywords: ["bold", "border", "contrast", "flat", "retro", "raw", "hard"],
        bestFor: ["Startups", "Gen Z Brands", "Creative Agencies", "Figma-style"],
        colors: ["#FFEB3B", "#FF5252", "#2196F3", "#000000"],
        description: "Thick black borders, hard shadows, high saturation colors, no gradients.",
        cssParams: { borderRadius: 4, spacingScale: 1.0, shadowStrength: 'hard', iconStyle: 'bold' }
    },
    {
        name: "Aurora UI",
        keywords: ["gradient", "mesh", "glow", "soft", "blur", "atmospheric"],
        bestFor: ["AI Platforms", "Creative", "Modern SaaS"],
        colors: ["#0080FF", "#FF1493", "#00FFFF"],
        description: "Vibrant mesh gradients, smooth color blends, ethereal feel.",
        cssParams: { borderRadius: 24, spacingScale: 1.2, shadowStrength: 'soft', iconStyle: 'standard' }
    },
    {
        name: "Dark Mode (OLED)",
        keywords: ["dark", "night", "black", "neon", "contrast", "developer"],
        bestFor: ["Dev Tools", "Dashboards", "Entertainment", "Crypto"],
        colors: ["#000000", "#121212", "#39FF14", "#0080FF"],
        description: "Deep black backgrounds, neon accents, high contrast text.",
        cssParams: { borderRadius: 12, spacingScale: 1.0, shadowStrength: 'glow', iconStyle: 'standard' }
    },
    {
        name: "Claymorphism",
        keywords: ["3d", "soft", "bubbly", "playful", "rounded", "floating"],
        bestFor: ["Education", "Web3", "Casual Apps"],
        colors: ["#ADD8E6", "#FFB6C1", "#E6E6FA"],
        description: "Soft 3D, fluffy elements, inner shadows, pastel colors.",
        cssParams: { borderRadius: 32, spacingScale: 1.3, shadowStrength: 'soft', iconStyle: 'bold' }
    },
    {
        name: "Cyberpunk UI",
        keywords: ["neon", "glitch", "sci-fi", "futuristic", "hacker", "grid"],
        bestFor: ["Gaming", "Web3", "Tech"],
        colors: ["#0D0D0D", "#00FF00", "#FF00FF", "#00FFFF"],
        description: "Terminal aesthetics, neon glows, grid lines, glitch effects.",
        cssParams: { borderRadius: 0, spacingScale: 0.9, shadowStrength: 'hard', iconStyle: 'bold' }
    }
];

export const PALETTES_DB = [
    { type: "SaaS", primary: "#2563EB", secondary: "#3B82F6", bg: "#F8FAFC", notes: "Trust blue + orange CTA contrast" },
    { type: "Fintech", primary: "#0F172A", secondary: "#334155", bg: "#F8FAFC", notes: "Navy + Gold + Professional grey" },
    { type: "Healthcare", primary: "#0891B2", secondary: "#22D3EE", bg: "#ECFEFF", notes: "Calm cyan + health green" },
    { type: "E-commerce", primary: "#1C1917", secondary: "#44403C", bg: "#FAFAF9", notes: "Premium dark + gold accent" },
    { type: "AI/Chatbot", primary: "#7C3AED", secondary: "#A78BFA", bg: "#FAF5FF", notes: "AI purple + cyan interactions" },
    { type: "Creative", primary: "#EC4899", secondary: "#F472B6", bg: "#FDF2F8", notes: "Bold pink + cyan accent" }
];

export const TYPOGRAPHY_DB = [
    { name: "Modern Professional", heading: "Poppins", body: "Open Sans", mood: "Corporate, Clean" },
    { name: "Tech Startup", heading: "Space Grotesk", body: "DM Sans", mood: "Innovative, Bold" },
    { name: "Classic Elegant", heading: "Playfair Display", body: "Inter", mood: "Luxury, Editorial" },
    { name: "Minimal Swiss", heading: "Inter", body: "Inter", mood: "Functional, Neutral" },
    { name: "Developer Mono", heading: "JetBrains Mono", body: "IBM Plex Sans", mood: "Technical, Precise" }
];

export const UX_RULES = [
    "Minimum 4.5:1 color contrast ratio.",
    "Touch targets must be at least 44x44px.",
    "Interactive elements need visible focus states.",
    "Use skeleton loaders instead of spinners for content.",
    "Font size should be at least 16px for body text.",
    "Avoid layout shifts (CLS) by reserving space for images."
];

export const getDesignContext = (query: string): string => {
    const q = query.toLowerCase();
    
    // Simple relevance scoring
    const matchedStyles = STYLES_DB.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.keywords.some(k => q.includes(k)) || 
        s.bestFor.some(b => q.includes(b.toLowerCase()))
    );

    const matchedPalette = PALETTES_DB.find(p => q.includes(p.type.toLowerCase())) || PALETTES_DB[0];
    const matchedTypo = TYPOGRAPHY_DB.find(t => q.includes(t.mood.toLowerCase())) || TYPOGRAPHY_DB[0];

    let context = `\n--- UI/UX PRO MAX INTELLIGENCE ---\n`;
    
    if (matchedStyles.length > 0) {
        const best = matchedStyles[0];
        context += `RECOMMENDED STYLE: ${best.name}\n`;
        context += `Description: ${best.description}\n`;
        context += `Technical Specs: Radius ${best.cssParams.borderRadius}px, Shadow ${best.cssParams.shadowStrength}\n`;
    }

    context += `RECOMMENDED PALETTE (${matchedPalette.type}): Primary ${matchedPalette.primary}, BG ${matchedPalette.bg}. Note: ${matchedPalette.notes}\n`;
    context += `RECOMMENDED TYPOGRAPHY: Heading ${matchedTypo.heading} + Body ${matchedTypo.body} (${matchedTypo.mood})\n`;
    context += `UX RULES: ${UX_RULES[0]}, ${UX_RULES[1]}\n`;
    context += `----------------------------------\n`;

    return context;
};
