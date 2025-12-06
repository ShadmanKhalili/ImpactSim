
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectInput, SimulationResult } from "../types";

export const checkApiKeyStatus = () => {
  return {
    hasKey: !!process.env.API_KEY,
  };
};

// Helper to sanitize JSON
const cleanJsonResponse = (text: string): string => {
  return text.replace(/```json\n|\n```/g, "").replace(/```/g, "").trim();
};

const getModel = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) throw new Error("Missing API Key");
  return new GoogleGenAI({ apiKey }).models;
};

const MODEL_NAME = "gemini-2.5-flash";

// --- STAGE 1: High Level Summary & Scores ---
export const runSimulationStage1 = async (input: ProjectInput): Promise<Partial<SimulationResult>> => {
  const models = getModel();
  
  const historyContext = input.strategyHistory && input.strategyHistory.length > 0
    ? `Project Evolution:\n${input.strategyHistory.map(h => `- ${h}`).join('\n')}`
    : "Initial design.";

  const prompt = `
    Persona: Critical Grant Auditor.
    Task: Assess project feasibility (Stage 1: High Level Overview).
    
    Project: ${input.title} in ${input.location}.
    Sector: ${input.sector}. Budget: ${input.budget}.
    Desc: ${input.description}.
    Tech: ${input.technologyLevel}. Team: ${input.teamExperience}.
    ${historyContext}

    Scoring Guidelines:
    - Base 50/100.
    - Penalize for high-tech in low-resource areas, lack of local partners, or inexperienced teams.
    - Be objective.

    Output:
    1. Overall Score (0-100).
    2. Sentiment Score (0-100).
    3. Sustainability Score (0-100).
    4. Executive Summary (Max 3 sentences, focus on hard truths).
    5. Key Wins (3 bullet points).
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      overallScore: { type: Type.NUMBER },
      communitySentiment: { type: Type.NUMBER },
      sustainabilityScore: { type: Type.NUMBER },
      narrative: { type: Type.STRING },
      successFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["overallScore", "communitySentiment", "sustainabilityScore", "narrative", "successFactors"],
  };

  const response = await models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: { temperature: 0.2, responseMimeType: "application/json", responseSchema: schema }
  });

  return JSON.parse(cleanJsonResponse(response.text!));
};

// --- STAGE 2: Deep Dive Analytics ---
export const runSimulationStage2 = async (input: ProjectInput, stage1: Partial<SimulationResult>): Promise<Partial<SimulationResult>> => {
  const models = getModel();
  
  const prompt = `
    Context: Project "${input.title}" scored ${stage1.overallScore}/100. Summary: ${stage1.narrative}.
    Task: Generate detailed risk and stakeholder analytics (Stage 2).
    
    CRITICAL INSTRUCTION: Ensure the "Timeline" and "Stakeholder Map" are NOT arbitrary. They must be logically consistent with the risks and description provided.
    - If the team is inexperienced, the Timeline must show early struggles.
    - If the tech is high-level in a rural area, the "Stakeholder Map" must show skepticism from locals.

    Output:
    1. Sentiment Forecast (Timeline of 6 points).
    2. Stakeholder Map (5 groups).
    3. Feasibility Metrics (5 categories: Financial, Technical, Cultural, Regulatory, Operational).
    4. Risk Matrix (5 risks, likelihood 1-10, severity 1-10).
    5. Critical Flaws (3 text strings).
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      timeline: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: { month: { type: Type.STRING }, title: { type: Type.STRING }, description: { type: Type.STRING }, sentimentScore: { type: Type.NUMBER } },
        },
      },
      stakeholderAnalysis: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: { group: { type: Type.STRING }, sentiment: { type: Type.NUMBER }, influence: { type: Type.STRING } },
        },
      },
      metrics: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: { category: { type: Type.STRING }, score: { type: Type.NUMBER }, reasoning: { type: Type.STRING } },
        },
      },
      riskAnalysis: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: { risk: { type: Type.STRING }, likelihood: { type: Type.NUMBER }, severity: { type: Type.NUMBER } },
        },
      },
      risks: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["timeline", "stakeholderAnalysis", "metrics", "riskAnalysis", "risks"],
  };

  const response = await models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: { temperature: 0.2, responseMimeType: "application/json", responseSchema: schema }
  });

  return JSON.parse(cleanJsonResponse(response.text!));
};

// --- STAGE 3: Actionable Strategy ---
export const runSimulationStage3 = async (input: ProjectInput, stage1: Partial<SimulationResult>, stage2: Partial<SimulationResult>): Promise<Partial<SimulationResult>> => {
  const models = getModel();
  
  const prompt = `
    Context: Project "${input.title}" scored ${stage1.overallScore}/100. Critical Flaws: ${stage2.risks?.join(', ')}.
    Task: Generate implementation schedule and strategic pivots (Stage 3).
    
    Output:
    1. Implementation Schedule (Gantt chart items, realistic durations).
    2. Strategic Pivots (3 suggestions with specific parameter changes to improve score).
  `;

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      schedule: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: { task: { type: Type.STRING }, startMonth: { type: Type.NUMBER }, durationMonths: { type: Type.NUMBER }, type: { type: Type.STRING, enum: ['planning', 'execution', 'milestone'] } },
        },
      },
      pivots: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            modification: { type: Type.STRING },
            rationale: { type: Type.STRING },
            changes: {
              type: Type.OBJECT,
              properties: {
                budget: { type: Type.STRING },
                duration: { type: Type.STRING },
                localPartner: { type: Type.STRING },
                technologyLevel: { type: Type.STRING },
                fundingSource: { type: Type.STRING },
                teamExperience: { type: Type.STRING },
                description: { type: Type.STRING }
              },
            }
          },
          required: ["title", "modification", "rationale", "changes"],
        },
      },
    },
    required: ["schedule", "pivots"],
  };

  const response = await models.generateContent({
    model: MODEL_NAME,
    contents: prompt,
    config: { temperature: 0.2, responseMimeType: "application/json", responseSchema: schema }
  });

  return JSON.parse(cleanJsonResponse(response.text!));
};

// Keep the old function signature for backward compatibility if needed, but redirects to staged
export const runSimulation = async (input: ProjectInput): Promise<SimulationResult> => {
   const s1 = await runSimulationStage1(input);
   const s2 = await runSimulationStage2(input, s1);
   const s3 = await runSimulationStage3(input, s1, s2);
   return { ...s1, ...s2, ...s3 } as SimulationResult;
}
