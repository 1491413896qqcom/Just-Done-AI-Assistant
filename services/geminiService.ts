
import { GoogleGenAI, Content, Part } from "@google/genai";
import { Message, Sender, GeminResponse, PersonaMode, SystemState, PerspectiveType, ToolId, ToolResult } from '../types';

const MODEL_NAME = 'gemini-2.5-flash';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY is missing in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to detect language loosely
export const detectLanguage = (text: string): 'Chinese' | 'English' | 'Mixed' => {
  const chineseRegex = /[\u4e00-\u9fa5]/;
  const englishRegex = /[a-zA-Z]/;
  const hasChinese = chineseRegex.test(text);
  const hasEnglish = englishRegex.test(text);

  if (hasChinese && hasEnglish && text.length > 50) return 'Mixed'; // Simple heuristic
  if (hasChinese) return 'Chinese';
  return 'English';
};

// Mock File Parse - In a real app, this would send file to backend
export const mockFileUpload = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // For text files, actually read them
      if (file.type === 'text/plain' || file.name.endsWith('.md') || file.name.endsWith('.txt')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsText(file);
      } else {
        // For binaries (pdf, docx), return a placeholder since we can't parse in browser easily without libs
        resolve(`[Parsed Content of ${file.name}]\n\n(This is a simulation. Real file parsing requires a backend service for PDF/DOCX extraction.)\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit...`);
      }
    }, 2000);
  });
};

export const processToolRequest = async (
  toolId: ToolId,
  inputText: string,
  forcedLanguage?: string
): Promise<ToolResult> => {
  const ai = getClient();
  
  // 1. Detect Language
  const detectedLang = forcedLanguage || detectLanguage(inputText);
  
  // 2. Strict System Instruction
  let systemInstruction = "";
  let prompt = inputText;
  let useSearch = false;
  let responseMimeType = "text/plain";

  const strictLangRule = `
    CRITICAL INSTRUCTION:
    1. The user input language is detected as: ${detectedLang}.
    2. Your output MUST be in ${detectedLang}.
    3. If the input is Chinese, output Chinese. If English, output English.
    4. Do not translate unless explicitly asked.
    5. Maintain the original tone and structure.
  `;

  switch (toolId) {
    case ToolId.HUMANIZER:
      systemInstruction = `You are an AI Humanizer. ${strictLangRule} Rewrite the text to sound natural, human-like, and less robotic. Remove repetitive patterns.`;
      prompt = `Humanize this text:\n\n${inputText}`;
      break;
    
    case ToolId.DETECTOR:
      systemInstruction = `You are an AI Content Detector. ${strictLangRule} Analyze for AI patterns. Return a JSON object with 'score' (0-100), 'verdict', and 'reason'. The 'reason' MUST be in ${detectedLang}.`;
      prompt = `Analyze this text for AI patterns:\n\n${inputText}`;
      responseMimeType = "application/json";
      break;

    case ToolId.PLAGIARISM:
      systemInstruction = `You are a Plagiarism Checker. ${strictLangRule} Use Google Search to find matches. Highlight matches. Output report in ${detectedLang}.`;
      prompt = `Check for plagiarism:\n\n${inputText}`;
      useSearch = true;
      break;

    case ToolId.PARAPHRASER:
      systemInstruction = `You are an AI Paraphraser. ${strictLangRule} Rewrite to be clearer. Provide 2 versions: Standard and Fluent. Output in ${detectedLang}.`;
      prompt = `Paraphrase this:\n\n${inputText}`;
      break;

    case ToolId.SUMMARIZER:
      systemInstruction = `You are an AI Summarizer. ${strictLangRule} Create a concise summary with bullet points. Output in ${detectedLang}.`;
      prompt = `Summarize this:\n\n${inputText}`;
      break;

    case ToolId.GRAMMAR:
      systemInstruction = `You are a Grammar Checker. ${strictLangRule} Fix errors. List changes in ${detectedLang}.`;
      prompt = `Fix grammar:\n\n${inputText}`;
      break;

    case ToolId.FACT:
      systemInstruction = `You are a Fact Checker. ${strictLangRule} Verify claims using Google Search. Rate True/False. Output in ${detectedLang}.`;
      prompt = `Fact check this:\n\n${inputText}`;
      useSearch = true;
      break;

    case ToolId.CITATION:
      systemInstruction = `You are a Citation Generator. ${strictLangRule} Generate citations in APA, MLA, Chicago.`;
      prompt = `Generate citations for:\n\n${inputText}`;
      break;
    
    case ToolId.IMAGE:
      systemInstruction = `You are an Image Prompt Optimizer. ${strictLangRule} Optimize this description for an image generator. Output the optimized prompt in ${detectedLang} (or English if typically required by image models, but explain in ${detectedLang}).`;
      prompt = `Optimize image prompt:\n\n${inputText}`;
      break;

    default:
      systemInstruction = `You are a helpful AI assistant. ${strictLangRule}`;
  }

  try {
    const config: any = {
      systemInstruction,
    };
    
    if (useSearch) {
      config.tools = [{ googleSearch: {} }];
    }
    
    if (responseMimeType === "application/json") {
      config.responseMimeType = "application/json";
    }

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
      text: result.text || "Processing complete.",
      groundingUrls: Array.from(new Set(urls))
    };

  } catch (error) {
    console.error("Tool Processing Error:", error);
    return {
      text: "Error processing request. Please try again.",
    };
  }
};

// Legacy functions
export const sendMessageToGemini = async (h: any, m: string, mode: any) => { return { text: "Legacy", groundingUrls: [] } };
export const generateThinkingToolResponse = async () => "";
export const analyzeConversation = async () => ({} as any);
