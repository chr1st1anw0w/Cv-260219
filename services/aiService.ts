import { GoogleGenAI, Type, Schema } from "@google/genai";
import { getDesignContext, STYLES_DB } from "./designDatabase";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIParams {
  prompt: string;
  systemInstruction?: string;
  model?: string;
  responseMimeType?: string;
  image?: {
    data: string; // base64 string
    mimeType: string;
  };
  thinkingBudget?: number;
}

/**

 * Core Generation Function
   */
   export const generateAIResponse = async (
     params: AIParams,
   ): Promise<{ text: string }> => {
     try {
   let modelName = params.model || "gemini-3-flash-preview";

   // Model mapping
   if (modelName === "gemini-1.5-pro") modelName = "gemini-3-pro-preview";
   else if (modelName === "gemini-1.5-flash") modelName = "gemini-3-flash-preview";

   const parts: any[] = [];

   if (params.image) {
     parts.push({
       inlineData: {
         mimeType: params.image.mimeType,
         data: params.image.data,
       },
     });
   }

   parts.push({ text: params.prompt });

   const config: any = {};
   if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
   if (params.responseMimeType) config.responseMimeType = params.responseMimeType;

   if (params.thinkingBudget && params.thinkingBudget > 0) {
       config.thinkingConfig = { thinkingBudget: params.thinkingBudget };
   }

   const response = await ai.models.generateContent({
     model: modelName,
     contents: { parts },
     config,
   });

   return { text: response.text || "" };
     } catch (error) {
   console.error("Gemini API Call Failed:", error);
   return { text: "" };
     }
   };

/**

 * Generate Theme from Text or Image — v2.0 (Complete Design System)

 * 

 * Produces a comprehensive design system including:

 * - Full color palette (8 semantic tokens + extended accent/gradient)

 * - Typography recommendations (Google Fonts heading + body pairing)

 * - Spacing & layout tokens (scale, radius, grid, container widths)

 * - Animation & motion tokens (transition curves, durations)

 * - Gradient definitions (primary gradient, card overlays)

 * - Component-level tokens (card, button, input styling)
     */
     export const generateThemeFromImage = async (
     imageBase64: string | null,
     mimeType: string | null,
     prompt: string
     ): Promise<any> => {
     // Inject Pro Max Context
     const proMaxContext = getDesignContext(prompt);

     const systemInstruction = `
         You are a world-class UI Design Systems Architect equipped with the UI/UX Pro Max knowledge base.
         Your task is to deeply analyze the input (text description or image) and produce a **complete, production-ready Design System**.
         

         ${proMaxContext}
         
         **Analysis Dimensions (Deep Scan):**
         1. **Industry DNA**: Corporate (Tech, Finance), Creative (Art, Design), Minimal (Architecture, Editorial), or Playful (Education, Web3).
         2. **Aesthetic Movement**: Match to Pro Max database (Glassmorphism, Neubrutalism, Aurora, Cyberpunk, etc.).
         3. **Color Science**: If an image is provided, extract the dominant-5 palette using perceptual color clustering. Ensure WCAG AA contrast.
         4. **Typography Pairing**: Recommend Google Fonts heading + body pairing that reinforces the aesthetic mood.
         5. **Motion Language**: Define animation curves and durations appropriate to the style (e.g., bouncy for playful, ease-out for corporate).
         6. **Component Tokens**: Derive button, card, and input styling from the overall system.
         
         Return a JSON object strictly matching this extended schema:
         {
             "name": "Theme Name (e.g., 'Neon Fintech')",
             "mood": "One-line description of the visual mood",
             "colors": {
                 "primary": "#hex",
                 "primaryHover": "#hex",
                 "accent": "#hex",
                 "accentHover": "#hex",
                 "backgroundLight": "#hex",
                 "backgroundDark": "#hex",
                 "cardLight": "#hex",
                 "cardDark": "#hex",
                 "textLight": "#hex",
                 "textDark": "#hex",
                 "border": "#hex",
                 "success": "#hex",
                 "warning": "#hex",
                 "error": "#hex"
             },
             "gradients": {
                 "primary": "linear-gradient(...)",
                 "card": "linear-gradient(...)",
                 "hero": "linear-gradient(...)"
             },
             "typography": {
                 "fontHeading": "Google Font Name",
                 "fontBody": "Google Font Name",
                 "fontMono": "Google Font Name",
                 "scaleRatio": 1.25,
                 "baseSize": 16,
                 "lineHeightBody": 1.6,
                 "lineHeightHeading": 1.2,
                 "letterSpacingHeading": "-0.02em"
             },
             "designSystem": {
                 "borderRadius": number,
                 "borderRadiusLg": number,
                 "borderRadiusFull": 9999,
                 "spacingScale": number,
                 "fontScale": number,
                 "shadowStrength": "none" | "soft" | "medium" | "hard" | "glass" | "glow",
                 "iconStyle": "thin" | "standard" | "bold",
                 "containerMaxWidth": 1200,
                 "gridColumns": 12,
                 "gridGap": 24
             },
             "motion": {
                 "transitionFast": "150ms ease-out",
                 "transitionBase": "250ms ease-in-out",
                 "transitionSlow": "400ms cubic-bezier(0.16, 1, 0.3, 1)",
                 "hoverScale": 1.02,
                 "springBounce": "cubic-bezier(0.34, 1.56, 0.64, 1)"
             },
             "components": {
                 "button": { "radius": number, "paddingX": number, "paddingY": number, "fontWeight": 600 },
                 "card": { "radius": number, "padding": number, "borderWidth": number },
                 "input": { "radius": number, "height": number, "borderWidth": number }
             }
         }

     `;

     const imagePayload = imageBase64 && mimeType ? { data: imageBase64, mimeType } : undefined;

     const response = await generateAIResponse({
         model: 'gemini-3-pro-preview',
         prompt: prompt || "Create a unique UI theme based on current trends.",
         systemInstruction: systemInstruction,
         image: imagePayload,
         responseMimeType: "application/json",
         thinkingBudget: 2048
     });

     return parseAIJson(response.text);
     };

// --- STITCH SKILL: CODE ARCHITECT AGENT ---
export const codeArchitectAgent = async (requirements: string, designContext: any): Promise<string> => {
    const stitchProtocol = `
        **Stitch Skill Protocol Active**
        1. **Composition**: Use 'children' for flexible layouts.
        2. **Class Merging**: Always use 'cn()' (clsx + tailwind-merge) for className props.
        3. **Attributes**: Allow spread props ({...props}) for HTML attributes.
        4. **Icons**: Use Lucide React icons.
        5. **Tailwind**: Use semantic colors (bg-card-light, text-primary) derived from the theme variables.
    `;

    const prompt = `
        Act as a Senior React Engineer implementing the "Stitch" skill.
        
        **Design Context (Pro Max):**
        - Style: ${designContext.name}
        - Radius: ${designContext.designSystem?.borderRadius}px
        - Shadow: ${designContext.designSystem?.shadowStrength}
        
        **Task:**
        ${requirements}
        
        **Output:**
        Return ONLY the React Functional Component code (TSX). No markdown, no explanations.
    `;
    
    const response = await generateAIResponse({
        model: 'gemini-3-pro-preview',
        prompt: prompt,
        systemInstruction: stitchProtocol
    });
    
    return cleanAICss(response.text);

};

// --- 2. DESIGN EXPERT AGENT (AI Copilot — Interactive Mode v2.0) ---

/**

 * AI Copilot Design Agent — v2.0

 * 

 * Upgrades from v1.0 one-way generation to interactive collaboration:

 * - **Probing Questions (反問式引導)**: AI asks clarifying questions before generating

 * - **Data Mining (數據挖掘)**: Extracts implicit patterns from user history

 * - **Progressive Refinement**: Multi-turn convergent workflow

 * - **Context Memory**: Tracks decision points across conversation turns
     */
     export const designExpertAgent = async (
     chatHistory: any[], 
     currentContext: string, 
     imageContext?: {data: string, mimeType: string},
     userProfile?: { industry?: string; experienceLevel?: string; brandKeywords?: string[] }
     ): Promise<any> => {
     const proMaxContext = getDesignContext(currentContext);

     // Analyze conversation depth to adjust interaction mode
     const turnCount = chatHistory.filter(m => m.role === 'user').length;
     const isExploring = turnCount < 3;  // First 3 turns = exploration phase
     const isRefining = turnCount >= 3;   // After 3 turns = refinement phase

     // Extract implicit signals from user history for data mining
     const userSignals = userProfile ? `
         **USER PROFILE (Data Mining Context):**
         - Industry: ${userProfile.industry || 'Unknown'}
         - Experience Level: ${userProfile.experienceLevel || 'Unknown'}
         - Brand Keywords: ${(userProfile.brandKeywords || []).join(', ') || 'None provided'}
     ` : '';

     const systemPrompt = `
         你是一位世界級的 UI/UX 設計總監與 AI Copilot (協作夥伴)。
         你同時具備 "UI/UX Pro Max" (設計腦) 與 "Stitch" (工程腦) 的知識。
         

         **⚡ AI Copilot 模式已啟用 — 互動式協作引擎 ⚡**
         
         **核心原則：**
         1. **反問式引導 (Probing)**: 永遠不要在資訊不足時直接生成主題。先反問 1-2 個關鍵問題來釐清需求。
         2. **數據挖掘 (Mining)**: 從使用者的描述、上傳圖片、對話歷史中推斷隱含的偏好（例如：描述偏好深色→推斷為開發者或科技產業）。
         3. **漸進收斂 (Progressive Refinement)**: 對話前期擴展選項，後期收斂至精確方案。
         
         **互動階段判斷：**
         - 當前為 ${isExploring ? '🔍 探索階段 (Exploration Phase): 多提選項、多問問題、引導使用者發現自己的偏好' : '🎯 收斂階段 (Refinement Phase): 根據已確認的偏好，精確調整並生成設計系統'}。
         - 對話輪數：${turnCount}
         
         ${userSignals}
         
         **工作流路由 (SKILL_ROUTER) 已啟用：**
         1. 風格/靈感問題 → 呼叫 **Pro Max** 資料庫。
         2. 代碼/組件問題 → 呼叫 **Stitch** 規範。
         3. 模糊需求 → 進入 **Probing** 模式，反問釐清。
         
         **【UI/UX Pro Max 技能已啟用】**
         ${proMaxContext}
         
         **輸出格式 (JSON) — v2.0 擴展結構：**
         {
             "message": "你的對話回應 — 使用繁體中文",
             "interactionMode": "probing" | "suggesting" | "generating" | "refining",
             "probingQuestions": [
                 {
                     "question": "你的品牌調性偏向穩重專業還是年輕活躍？",
                     "type": "preference" | "constraint" | "context" | "quantitative",
                     "options": ["穩重專業", "年輕活躍", "介於兩者之間"],
                     "whyAsking": "這會影響配色飽和度與字體選擇"
                 }
             ],
             "dataMiningInsights": [
                 {
                     "observation": "從您的描述推斷偏好深色系與科技感",
                     "confidence": 0.85,
                     "influence": "建議使用 Dark Mode + Neon Accent 配色"
                 }
             ],
             "isThemeGenerated": boolean,
             "generatedTheme": { /* ...Complete Design System Object... */ } | null,
             "suggestedPrompts": ["改用暖色調", "加入玻璃擬態", "切換極簡主義"],
             "decisionLog": [
                 {
                     "turn": number,
                     "decision": "使用者確認偏好深色底",
                     "impact": "固定 backgroundDark 為 #0A0A0A 系列"
                 }
             ]
         }
         
         **規則：**
         - 在探索階段，「probingQuestions」必須有至少 1 個問題
         - 在收斂階段，「isThemeGenerated」應為 true
         - 「dataMiningInsights」持續更新，基於累積對話分析
         - 不要在沒有足夠上下文時生成完整主題

     `;

     const historyText = chatHistory.map(m => `${m.role}: ${m.text}`).join('\n');
     const fullPrompt = `Chat History:\n${historyText}\n\nUser's Latest Input: ${currentContext}`;

     const response = await generateAIResponse({
         model: 'gemini-3-pro-preview', 
         prompt: fullPrompt,
         systemInstruction: systemPrompt,
         image: imageContext, 
         responseMimeType: "application/json",
         thinkingBudget: 2048
     });

     return parseAIJson(response.text);
     };

// --- UTILITIES ---

export const editImageWithAI = async (
    imageBase64: string,
    mimeType: string,
    prompt: string
): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType: mimeType } },
                    { text: prompt }
                ]
            }
        });
        

        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) return part.inlineData.data;
            }
        }
        return null;
    } catch (error) {
        console.error("Image Edit Error:", error);
        return null;
    }

};

export const generateImage = async (prompt: string, size: '1K' | '2K' | '4K' = '1K'): Promise<string | null> => {
    try {
        let model = 'gemini-2.5-flash-image';
        if (size === '2K' || size === '4K') {
            model = 'gemini-3-pro-image-preview';
        }

        const config: any = {};
        const imageConfig: any = { aspectRatio: "1:1" };
        
        if (model === 'gemini-3-pro-image-preview') {
             imageConfig.imageSize = size;
        }
        config.imageConfig = imageConfig;
    
        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [{ text: prompt }]
            },
            config: config
        });
    
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        return null;
    } catch (error) {
        console.error("Image Generation Error:", error);
        return null;
    }

};

export const analyzeImage = async (base64: string, mimeType: string): Promise<string> => {
    const response = await generateAIResponse({
        model: 'gemini-3-pro-preview',
        prompt: "Analyze this image in detail. Describe the visual style, composition, colors, and potential design improvements relevant to a professional portfolio.",
        image: { data: base64, mimeType },
    });
    return response.text;
};

export const parseAIJson = (text: string): any => {
  try {
    if (!text) return null;
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("AI JSON Parse Error:", e);
    return null;
  }
};

export const cleanAICss = (text: string): string => {
  if (!text) return "";
  return text.replace(/```(tsx|jsx|css|javascript|typescript)?/g, "").replace(/```/g, "").trim();
};

export const homogenizeImage = async (base64: string, mimeType: string, primaryColor: string, mode: 'duotone' | 'mockup'): Promise<string | null> => {
    let prompt = "";
    if (mode === 'duotone') {
        prompt = `Apply a professional duotone filter using ${primaryColor} and dark charcoal. High contrast, modern UI style.`;
    } else {
        prompt = `Display this image on a modern laptop screen in a minimal, clean desk workspace. Professional product photography style.`;
    }
    return await editImageWithAI(base64, mimeType, prompt);
};

/**

 * One-Page Magician — v2.0 (AI CSS Variable Calculator)
 * 
 * Upgraded from simple prompt to structured analysis:
 * - Precise CSS variable calculations based on content density analysis
 * - Intelligent content pruning strategy with priority scoring
 * - A4 physical constraints (210mm × 297mm, 25mm margin standard)
 * - Font readability guardrails (never below 9pt/12px body text)
     */

const ONE_PAGE_MAGICIAN_SCHEMA: Schema = {
    type: Type.OBJECT,
    properties: {
        analysis: {
            type: Type.OBJECT,
            properties: {
                currentWordCount: { type: Type.NUMBER },
                targetWordCount: { type: Type.NUMBER },
                overflowPercentage: { type: Type.NUMBER },
                densityLevel: { type: Type.STRING },  // 'light' | 'moderate' | 'dense' | 'overflow'
                strategy: { type: Type.STRING },  // 'css-only' | 'css-and-trim' | 'major-restructure'
                densityScore: { type: Type.NUMBER }, // 0-1 score of how "packed" the page is
                clutterZones: { type: Type.ARRAY, items: { type: Type.STRING } } // Areas that feel too busy
            }
        },
        visualHierarchy: {
            type: Type.OBJECT,
            properties: {
                focalPoint: { type: Type.STRING }, // The element that should draw the most attention
                sectionOrdering: { type: Type.ARRAY, items: { type: Type.STRING } }, // Suggested order for maximum impact
                layoutType: { type: Type.STRING }, // 'single-column' | 'two-column' | 'hybrid'
                whiteSpaceBalance: { type: Type.STRING }, // Recommendation for white space usage
                emphasisStrategy: { type: Type.STRING } // How to highlight key achievements (e.g., 'bold-metrics', 'sidebar-highlights')
            }
        },
        cssVariables: {
            type: Type.OBJECT,
            properties: {
                fontSizeBody: { type: Type.STRING },
                fontSizeH1: { type: Type.STRING },
                fontSizeH2: { type: Type.STRING },
                fontSizeH3: { type: Type.STRING },
                fontSizeSmall: { type: Type.STRING },
                lineHeight: { type: Type.STRING },
                lineHeightTight: { type: Type.STRING },
                marginTop: { type: Type.STRING },
                marginBottom: { type: Type.STRING },
                marginLeft: { type: Type.STRING },
                marginRight: { type: Type.STRING },
                sectionGap: { type: Type.STRING },
                itemGap: { type: Type.STRING },
                bulletIndent: { type: Type.STRING },
                headerPadding: { type: Type.STRING },
                columnGap: { type: Type.STRING }
            }
        },
        cuts: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    target: { type: Type.STRING },
                    action: { type: Type.STRING },  // 'shorten' | 'remove' | 'merge' | 'abbreviate'
                    reason: { type: Type.STRING },
                    priority: { type: Type.NUMBER },  // 1=do first, 5=last resort
                    savedWords: { type: Type.NUMBER }
                }
            }
        },
        readabilityCheck: {
            type: Type.OBJECT,
            properties: {
                passesWCAG: { type: Type.BOOLEAN },
                minimumFontSize: { type: Type.STRING },
                contrastMaintained: { type: Type.BOOLEAN },
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        }
    }
};

export const onePageMagician = async (textData: string, wordCount: number): Promise<any> => {
    const prompt = `
        **ONE-PAGE MAGICIAN — A4 Layout & Visual Hierarchy Optimizer**
        

        Analyze this resume content and calculate the optimal CSS variables and visual hierarchy to fit it 
        precisely on one A4 page (210mm × 297mm) while maximizing impact.
        
        **Physical Constraints:**
        - A4 printable area: ~160mm × 247mm (with 25mm margins)
        - Standard body font: 10-11pt (13-14.7px)
        - Minimum readable body font: 9pt (12px) — NEVER go below this
        - Standard line-height: 1.3-1.5 for dense resumes
        - Typical A4 fits ~550-650 words at standard settings
        
        **Content Statistics:**
        - Total word count: ${wordCount}
        - Content sections: ${textData.split('\n\n').length}
        
        **Content:**
        ${textData.substring(0, 4000)}
        
        **Optimization Strategy:**
        1. **Density Analysis**: Calculate a density score (0-1) and identify "clutter zones" where information is too dense.
        2. **Visual Hierarchy**: 
           - Identify the "Focal Point" (e.g., Summary, Latest Experience).
           - Suggest a "Section Ordering" that flows logically for a recruiter.
           - Recommend a "Layout Type" (single, two-column, or hybrid) based on content length.
           - Define an "Emphasis Strategy" for key metrics.
        3. **CSS Optimization**: First try CSS-only adjustments (margins, font-size, line-height).
        4. **Pruning**: If overflow > 15%, suggest content cuts with priority scoring.
        5. **Readability**: Never sacrifice readability — maintain WCAG AA compliance.
        
        Calculate exact pixel/pt values, not vague suggestions.
    `;
    
    const systemInstruction = `
        You are a world-class typography and page layout engineer specializing in resume design.
        Your goal is to balance information density with visual hierarchy.
        
        **Sophisticated Layout Principles:**
        - **Fitts's Law**: Make important elements easy to find.
        - **Gestalt Principles**: Group related information (e.g., company and role).
        - **Scanning Patterns**: Optimize for F-pattern or Z-pattern reading.
        - **White Space**: Use white space as a tool for grouping, not just "empty space".
        
        Calculate precise CSS variables for A4 resume fitting.
        Consider the interplay between font-size, line-height, margins, and section gaps.
        All CSS values must be in appropriate units (px, pt, mm, or em).
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: ONE_PAGE_MAGICIAN_SCHEMA,
                systemInstruction: systemInstruction,
            }
        });
        
        return parseAIJson(response.text);
    } catch (e) {
        console.error("One-Page Magician Failed", e);
        return null;
    }

};

// --- RESUME EXPERT AGENT (Structured) ---

const RESUME_EXPERT_SCHEMA: Schema = {
    type: Type.OBJECT,
    properties: {
        keywords: {
            type: Type.OBJECT,
            properties: {
                mustHave: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { phrase: { type: Type.STRING }, evidence: { type: Type.STRING }, priority: { type: Type.NUMBER } } } },
                niceToHave: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { phrase: { type: Type.STRING }, evidence: { type: Type.STRING }, priority: { type: Type.NUMBER } } } },
                domain: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { phrase: { type: Type.STRING }, evidence: { type: Type.STRING }, priority: { type: Type.NUMBER } } } }
            }
        },
        gapAnalysis: {
            type: Type.OBJECT,
            properties: {
                missingOrWeak: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { keywordPhrase: { type: Type.STRING }, whyItMatters: { type: Type.STRING }, fixStrategy: { type: Type.STRING }, questionsToAsk: { type: Type.ARRAY, items: { type: Type.STRING } } } } },
                redundantOrOffTarget: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { item: { type: Type.STRING }, recommendation: { type: Type.STRING } } } }
            }
        },
        summaryRewrite: {
            type: Type.OBJECT,
            properties: {
                atsVersion: { type: Type.STRING },
                brandVersion: { type: Type.STRING },
                notes: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        },
        experienceRewrite: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    experienceId: { type: Type.STRING },
                    suggestedBullets: { type: Type.ARRAY, items: { type: Type.STRING } },
                    questionsToQuantify: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
            }
        },
        skillAlignment: {
            type: Type.OBJECT,
            properties: {
                addOrEmphasize: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { skill: { type: Type.STRING }, reason: { type: Type.STRING } } } },
                rephrase: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { from: { type: Type.STRING }, to: { type: Type.STRING } } } }
            }
        },
        atsChecklist: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.NUMBER },
                reasons: { type: Type.ARRAY, items: { type: Type.STRING } },
                nextEdits: { type: Type.ARRAY, items: { type: Type.STRING } }
            }
        }
    }
};

export const resumeExpertAgent = async (currentContent: any, targetJD: string, language: string = 'en'): Promise<any> => {
    // 1. Minify content to save context
    const minimalContent = {
        summary: currentContent.personalInfo?.summary || "",
        coreValues: currentContent.coreValues?.map((v: any) => v.text) || [],
        experience: currentContent.experience?.map((e: any) => ({
            id: e.id,
            company: e.company,
            title: e.title,
            period: e.period,
            bullets: e.achievements || []
        })),
        skills: currentContent.skills,
        projects: currentContent.projects?.map((p: any) => ({
            title: p.title,
            techStack: p.techStack || [],
            description: p.description || ""
        }))
    };

    const hasJD = targetJD.trim().length > 0;
    
    // 2. Build prompt based on mode
    const prompt = hasJD
        ? `
        **Mode: JD Match Analysis**
    
        jobDescription:
        """
        ${targetJD}
        """
    
        candidateProfile (JSON):
        ${JSON.stringify(minimalContent)}
    
        targetRoleLevel: "Senior/Lead"
        language: "${language}"
        `
        : `
        **Mode: General Resume Health Check (No JD provided)**
    
        Perform a comprehensive resume audit based solely on the candidate profile below.
        Evaluate the resume as a standalone document — assess its clarity, impact, quantification,
        keyword density for general ATS readability, and overall presentation quality.
    
        candidateProfile (JSON):
        ${JSON.stringify(minimalContent)}
    
        targetRoleLevel: "Senior/Lead"
        language: "${language}"
        `;
    
    // 3. Build system instruction based on mode
    const systemInstruction = hasJD
        ? `
        You are a Senior Resume Coach & ATS Specialist.
        Analyze the gap between the Candidate and the JD.
    
        **Rules:**
        1. Do NOT fabricate facts. If quantification is missing, use placeholders like "<X%>" and ask a question.
        2. Prioritize "Impact" and "Scope" in rewrites.
        3. Keep technical nouns (React, TypeScript) intact.
        4. Output strictly JSON matching the schema.
        5. Provide "ATS Version" (keyword heavy) and "Brand Version" (narrative heavy) for summary.
        6. For Experience, map suggestions back to the 'experienceId' provided in the input.
        `
        : `
        You are a Senior Resume Coach & ATS Specialist.
        No Job Description was provided. Perform a **General Resume Health Check** on the candidate's resume.
    
        **Analysis Focus:**
        1. **Summary Quality**: Does it contain quantified achievements? Is it compelling and scannable?
        2. **Achievement Bullet Strength**: Grade each experience's bullets — do they follow the "Action → Result → Scope" formula? Flag bullets missing quantifiable metrics.
        3. **Skill Completeness**: Are skills well-organized? Any obvious gaps for the candidate's stated seniority level?
        4. **ATS Readability**: Score the resume for general ATS compatibility (keyword density, formatting, standard section labels).
        5. **Overall Cohesion**: Does the resume tell a consistent career narrative?
    
        **Rules:**
        1. Do NOT fabricate facts. Use placeholders like "<X%>" and ask probing questions.
        2. For "keywords", extract the candidate's own strongest keywords (mustHave = core strengths, niceToHave = supporting skills, domain = industry keywords).
        3. For "gapAnalysis.missingOrWeak", identify weak areas within the resume itself (not compared to a JD).
        4. Provide "ATS Version" (keyword heavy) and "Brand Version" (narrative heavy) for summary rewrite.
        5. For Experience, map suggestions back to the 'experienceId' provided in the input.
        6. Output strictly JSON matching the schema.
        `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: RESUME_EXPERT_SCHEMA,
                systemInstruction: systemInstruction,
            }
        });
    
        return parseAIJson(response.text);
    } catch (e) {
        console.error("Resume Expert Failed", e);
        return null;
    }

};

// --- EXPERIENCE ENHANCER AGENT (Targeted Rewrite) ---

const EXPERIENCE_ENHANCER_SCHEMA: Schema = {
    type: Type.OBJECT,
    properties: {
        experienceId: { type: Type.STRING },
        rewrittenBullets: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
        },
        replacementPlan: {
            type: Type.OBJECT,
            properties: {
                mode: { type: Type.STRING, enum: ["replaceTopN", "replaceAll"] },
                topN: { type: Type.NUMBER }
            }
        },
        questionsToQuantify: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
        }
    }
};

export const experienceEnhancerAgent = async (
    experienceData: any, 
    language: string = 'en',
    tone: string = 'leadership'
): Promise<any> => {
    const prompt = `
        Enhance the bullet points for this specific experience to be more impact-driven, quantified, and leadership-oriented.
        

        Context:
        Role: ${experienceData.title} at ${experienceData.company}
        Original Bullets:
        ${JSON.stringify(experienceData.achievements)}
        
        Target Tone: ${tone} (Fintech / Product / Executive)
        Language: ${language}
    `;
    
    const systemInstruction = `
        You are an Executive Resume Writer. Rewrite the provided experience bullets.
        
        **Guidelines:**
        1. Start with strong power verbs (Spearheaded, Orchestrated, Engineered).
        2. Focus on the "So What?" (Business Impact).
        3. If numbers are missing, use placeholders [X%] and add a question in 'questionsToQuantify'.
        4. Return 3-4 strong bullets.
        5. Output strict JSON.
    `;
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview', // Faster model for interactive edits
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                responseMimeType: "application/json",
                responseSchema: EXPERIENCE_ENHANCER_SCHEMA,
                systemInstruction: systemInstruction,
            }
        });
        
        return parseAIJson(response.text);
    } catch (e) {
        console.error("Experience Enhancer Failed", e);
        return null;
    }

};