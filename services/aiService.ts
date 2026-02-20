import { GoogleGenAI, Type, Schema } from "@google/genai";
import { getDesignContext, STYLES_DB } from "./designDatabase";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "dummy-key" });

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
      contents: [{ role: "user", parts }],
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
         5. **Layout & Grid Architecture**: Analyze the photo for layout patterns. Is it a dense Bento grid, a breathable list, or a staggered creative layout? Define grid columns, gaps, and component spans.
         6. **Spacing & Rhythm**: Determine the vertical rhythm and component padding based on the visual density of the reference.
         7. **Motion Language**: Define animation curves and durations appropriate to the style.
         
         Return a JSON object strictly matching this extended schema:
         {
             "name": "Theme Name",
             "mood": "Mood description",
             "colors": {
                 "primary": "#hex",
                 "primaryHover": "#hex",
                 "accent": "#hex",
                 "backgroundLight": "#hex",
                 "backgroundDark": "#hex",
                 "cardLight": "#hex",
                 "cardDark": "#hex",
                 "textLight": "#hex",
                 "textDark": "#hex",
                 "border": "#hex"
             },
             "layout": {
                 "containerWidth": number,
                 "gridColumns": number,
                 "gridGap": number,
                 "sectionPadding": number,
                 "componentPadding": number,
                 "bentoStrategy": "dense" | "loose" | "staggered",
                 "alignment": "left" | "center" | "right"
             },
             "designSystem": {
                 "borderRadius": number,
                 "spacingScale": number,
                 "fontScale": number,
                 "shadowStrength": "none" | "soft" | "medium" | "hard" | "glass" | "glow",
                 "iconStyle": "thin" | "standard" | "bold"
             },
             "typography": {
                 "fontHeading": "Google Font Name",
                 "fontBody": "Google Font Name",
                 "fontMono": "Google Font Name"
             },
             "motion": {
                 "transitionFast": "150ms ease-out",
                 "transitionBase": "250ms ease-in-out"
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

export const homogenizeImage = async (base64: string, mimeType: string, primaryColor: string, mode: 'duotone' | 'mockup'): Promise<string | null> => {
    return base64;
};

export const analyzeImage = async (base64: string, mimeType: string): Promise<any> => {
    return { mood: "Modern", colors: ["#000", "#fff"] };
};

export const designExpertAgent = async (prompt: string, context: any): Promise<any> => {
    return { response: "Design expert response", suggestions: [] };
};

export const editImageWithAI = async (base64: string, mimeType: string, prompt: string): Promise<string | null> => {
    return base64;
};

export const generateImage = async (prompt: string, size?: string): Promise<string | null> => {
    return null;
};

// --- STITCH SKILL: CODE ARCHITECT AGENT ---
export const codeArchitectAgent = async (requirements: string, designContext: any): Promise<string> => {
    const prompt = `React Engineer. Design Context: ${JSON.stringify(designContext)}. Requirements: ${requirements}`;
    const response = await generateAIResponse({ prompt });
    return cleanAICss(response.text);
};

/**
 * Parsing Helpers
 */
export const parseAIJson = (text: string): any => {
  try {
    if (!text) return null;
    const jsonMatch = text.match(/\{.*\}/s) || text.match(/\[.*\]/s);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    const cleanJson = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();
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

// --- ONE-PAGE MAGICIAN AGENT ---
export const onePageMagician = async (objective: string, wordCount?: number): Promise<any> => {
    return { sections: [], cssVariables: {} };
};

// --- RESUME EXPERT AGENT ---
export const resumeExpertAgent = async (currentContent: any, targetJD: string, language: string = "en"): Promise<any> => {
    const systemInstruction = `
        You are an elite Career Strategy Consultant and ATS (Applicant Tracking System) Expert.
        Your task is to analyze the user's resume against a target Job Description (JD) and provide structured, high-impact feedback.

        Analyze based on:
        1. **Match Score**: 0-100 percentage.
        2. **Semantic Gap**: Identify missing high-impact keywords.
        3. **Experience Optimization**: How to rephrase achievements to match JD requirements.
        4. **Skill Vector**: Distribution across Work, Data, Tech, and Execution.

        Return a JSON object:
        {
            "matchScore": number,
            "alignment": "Strong" | "Good" | "Moderate" | "Gap Detected",
            "strengths": [
                { "title": "...", "description": "..." }
            ],
            "gaps": [
                { "title": "...", "description": "..." }
            ],
            "skillVector": {
                "WORK": number,
                "DATA": number,
                "EXECUTION": number,
                "TECH": number
            },
            "summarySuggestion": "...",
            "atsChecklist": [
                { "item": "...", "status": "pass" | "fail" }
            ]
        }
    `;

    const prompt = `
        Target Job Description: ${targetJD}
        Current Resume (Language: ${language}): ${JSON.stringify(currentContent)}
    `;

    const response = await generateAIResponse({
        model: "gemini-3-flash-preview",
        prompt,
        systemInstruction,
        responseMimeType: "application/json"
    });

    return parseAIJson(response.text);
};

// --- EXPERIENCE ENHANCER AGENT ---
export const experienceEnhancerAgent = async (experienceData: any, language: string = 'en', tone: string = 'leadership'): Promise<any> => {
    return { rewrittenBullets: [] };
};
