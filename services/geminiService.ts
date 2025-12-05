
import { GoogleGenAI, Type } from "@google/genai";
import { ProjectInput, SimulationResult } from "../types";

/**
 * Safely retrieves the API key from various environment locations.
 * Prioritizes standard process.env, then falls back to Vite's import.meta.env.
 */
export const getSafeKey = (): string | undefined => {
  // 1. Try process.env (Standard/Netlify)
  if (typeof process !== 'undefined' && process.env) {
     if (process.env.API_KEY) return process.env.API_KEY;
     if (process.env.VITE_ImpactSim) return process.env.VITE_ImpactSim;
     if (process.env.REACT_APP_ImpactSim) return process.env.REACT_APP_ImpactSim;
  }
  
  // 2. Try import.meta.env (Vite)
  try {
     // @ts-ignore
     if (typeof import.meta !== 'undefined' && import.meta.env) {
         // @ts-ignore
         return import.meta.env.VITE_ImpactSim;
     }
  } catch(e) {
     // Ignore errors if import.meta is not supported
  }

  return undefined;
};

export const checkApiKeyStatus = () => {
  const key = getSafeKey();
  return {
    hasKey: !!key,
  };
};

/**
 * Cleans the raw text response from Gemini to ensure valid JSON parsing.
 * Removes markdown code blocks (```json ... ```).
 */
const cleanJsonResponse = (text: string): string => {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.substring(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.substring(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3);
  }
  return cleaned.trim();
};

export const runSimulation = async (input: ProjectInput): Promise<SimulationResult> => {
  const apiKey = getSafeKey();
  if (!apiKey) {
    throw new Error("Missing API Key. Please ensure VITE_ImpactSim is set in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash";

  const prompt = `
    Analyze this NGO project proposal based on local context, culture, and economics.

    Project:
    - Title: ${input.title}
    - Location: ${input.location} (${input.sector})
    - Budget: ${input.budget} (${input.fundingSource})
    - Duration: ${input.duration}
    - Tech: ${input.technologyLevel}
    - Local Partner: ${input.localPartner}
    - User Risk Score: ${input.initialRiskLevel}/10
    - Description: ${input.description}

    Task:
    Simulate the project's lifecycle. Be critical. Consider corruption, cultural mismatch, logistics, and sustainability.
    
    Output strictly valid JSON matching this schema:
    {
      "overallScore": number (0-100),
      "communitySentiment": number (0-100),
      "sustainabilityScore": number (0-100),
      "metrics": [{ "category": string, "score": number, "reasoning": string }],
      "timeline": [{ "month": string, "title": string, "description": string, "sentimentScore": number }],
      "budgetBreakdown": [{ "category": string, "percentage": number }],
      "stakeholderAnalysis": [{ "group": string, "sentiment": number (-100 to 100), "influence": "High"|"Medium"|"Low" }],
      "riskAnalysis": [{ "risk": string, "likelihood": number (1-10), "severity": number (1-10) }],
      "longTermImpact": [{ "year": string, "social": number, "economic": number, "environmental": number }],
      "narrative": string (executive summary),
      "risks": [string],
      "successFactors": [string],
      "pivots": [{ "title": string, "modification": string, "rationale": string }]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.2, 
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI model.");
    }

    const cleanedText = cleanJsonResponse(text);
    return JSON.parse(cleanedText) as SimulationResult;
    
  } catch (error: any) {
     console.error("Simulation Error:", error);
     throw new Error(error.message || "Failed to generate simulation. Please check parameters and try again.");
  }
};
