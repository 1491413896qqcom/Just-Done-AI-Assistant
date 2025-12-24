import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message, Sender, GeminResponse, PersonaMode, SystemState, PerspectiveType, ToolId, ToolResult } from '../types';

const MODEL_NAME = 'gemini-3-flash-preview';

const getClient = () => {
  const apiKey = localStorage.getItem('JUSTDONE_API_KEY');
  if (!apiKey) {
    throw new Error("API_KEY_MISSING");
  }
  return new GoogleGenAI({ apiKey });
};

export const detectLanguage = (text: string): 'Chinese' | 'English' | 'Mixed' => {
  const chineseRegex = /[\u4e00-\u9fa5]/;
  const englishRegex = /[a-zA-Z]/;
  const hasChinese = chineseRegex.test(text);
  const hasEnglish = englishRegex.test(text);

  if (hasChinese && hasEnglish && text.length > 50) return 'Mixed';
  if (hasChinese) return 'Chinese';
  return 'English';
};

export const mockFileUpload = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      } else {
        resolve(`[Parsed Content of ${file.name}]\n\n(Simulation mode active for binary files.)`);
      }
    }, 1500);
  });
};

export const processToolRequest = async (
  toolId: ToolId,
  inputText: string,
  forcedLanguage?: string
): Promise<ToolResult> => {
  let ai;
  try {
    ai = getClient();
  } catch (e) {
    return { text: "SYSTEM ERROR: API Key is missing. Please configure it in Settings." };
  }
  
  const detectedLang = forcedLanguage || detectLanguage(inputText);
  
  let systemInstruction = "";
  let prompt = inputText;
  let useSearch = false;
  let responseMimeType = "text/plain";

  const strictLangRule = `
    CRITICAL: Output MUST be in ${detectedLang}.
  `;

  switch (toolId) {
    case ToolId.HUMANIZER:
      systemInstruction = `You are an AI Humanizer. ${strictLangRule} Rewrite to sound natural and human-like.`;
      prompt = `Humanize:\n\n${inputText}`;
      break;
    case ToolId.DETECTOR:
      systemInstruction = `AI Content Detector. ${strictLangRule} Return JSON: {score, verdict, reason}.`;
      prompt = `Analyze:\n\n${inputText}`;
      responseMimeType = "application/json";
      break;
    case ToolId.PLAGIARISM:
      systemInstruction = `Plagiarism Checker. ${strictLangRule} Use Google Search.`;
      prompt = `Check plagiarism:\n\n${inputText}`;
      useSearch = true;
      break;
    default:
      systemInstruction = `Helpful AI assistant. ${strictLangRule}`;
  }

  try {
    const config: any = { systemInstruction };
    if (useSearch) config.tools = [{ googleSearch: {} }];
    if (responseMimeType === "application/json") config.responseMimeType = "application/json";

    const result = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config
    });

    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const urls: string[] = [];
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri) urls.push(chunk.web.uri);
      });
    }

    return {
      text: result.text || "No response generated.",
      groundingUrls: Array.from(new Set(urls))
    };

  } catch (error) {
    console.error("Tool Error:", error);
    return { text: "SYSTEM FAULT: Request failed. Verify your API key and network connection." };
  }
};

export const sendMessageToGemini = async () => ({ text: "", groundingUrls: [] });
export const generateThinkingToolResponse = async () => "";
export const analyzeConversation = async () => ({} as any);