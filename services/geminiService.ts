
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
    Persona: Critical, Cynical International Development Grant Auditor.
    Task: Assess project feasibility (Stage 1: Overview).
    
    Project: ${input.title} in ${input.location}.
    Sector: ${input.sector}. Budget: ${input.budget}.
    Desc: ${input.description}.
    Tech: ${input.technologyLevel}. Team: ${input.teamExperience}.
    ${historyContext}

    Scoring Heuristics (Be Strict):
    - Base Feasibility Score: 50/100.
    - **Community Buy-in (Sentiment)**: Scale 0.00 to 1.00. (e.g., 0.20 is hostile, 0.85 is welcoming).
    - **Technical Risk**: If Tech is "High" but Team is "New/Volunteer", deduct 20 points from Feasibility.
    - **Context Mismatch**: If Location is rural/remote and Tech requires stable internet/power (without solar mentioned), deduct 15 points.
    - **Budget Realism**: If Budget is <$10k for >1 year duration, deduct 10 points (Unsustainable).
    - **Experience**: If Team is "Expert", add 15 points.

    Output:
    1. Overall Feasibility Score (0-100).
    2. Community Buy-in Score (0.00 to 1.00).
    3. Sustainability Score (0-100).
    4. Executive Summary (Max 3 sentences. blunt. identify the specific fatal flaw or key strength).
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
    config: { temperature: 0.1, responseMimeType: "application/json", responseSchema: schema }
  });

  return JSON.parse(cleanJsonResponse(response.text!));
};

// --- STAGE 2: Deep Dive Analytics ---
export const runSimulationStage2 = async (input: ProjectInput, stage1: Partial<SimulationResult>): Promise<Partial<SimulationResult>> => {
  const models = getModel();
  
  const prompt = `
    Context: Project "${input.title}" scored ${stage1.overallScore}/100.
    Auditor Summary: ${stage1.narrative}.
    
    Task: Generate deeply analytical, logically coherent metrics (Stage 2).
    
    CRITICAL INSTRUCTION: Ensure "Causal Consistency" between charts.
    
    1. **Feasibility Metrics (Radar Chart)**:
       - **Financial**: Score low if Budget (${input.budget}) is too low for Duration (${input.duration}).
       - **Technical**: Score based on Team (${input.teamExperience}) vs Tech (${input.technologyLevel}).
       - **Cultural**: Score based on Target Audience (${input.targetAudience}) vs solution type.
       - **Regulatory**: Is the sector (${input.sector}) heavily regulated?
       - **Operational**: Logistics in ${input.location}.
    
    2. **Stakeholder Map (Power-Interest Grid)**:
       - Identify 5 SPECIFIC groups relevant to ${input.location} (e.g., "Village Elders", "Ministry of Health", "Local Gangs", "Youth Association").
       - Assign **Power** (1-10) and **Interest** (1-10).
       - Assign **Alignment** (Support, Neutral, Oppose).
    
    3. **Sentiment Forecast (Timeline)**:
       - Generate 6 key milestones over the ${input.duration}.
       - **Score Scale**: 0.00 to 1.00.
       - **Hype Cycle Logic**: 
         - Start: High (0.8+ Excitement).
         - Middle: Dip (0.4-0.5 Implementation friction).
         - End: Recovery (0.7+) OR Failure (<0.3) depending on Overall Score.
       
    4. **Risk Matrix**:
       - Identify 5 specific risks derived from the inputs (e.g. "Hardware theft" for high-tech in poor areas).

    Output:
    1. Timeline (6 points, sentiment 0.00-1.00).
    2. Stakeholder Map (5 groups, Power/Interest 1-10).
    3. Metrics (5 categories).
    4. Risk Matrix (5 risks).
    5. Critical Flaws (3 short strings).
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
          properties: { 
            group: { type: Type.STRING }, 
            power: { type: Type.NUMBER }, 
            interest: { type: Type.NUMBER },
            alignment: { type: Type.STRING, enum: ['Support', 'Neutral', 'Oppose'] } 
          },
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
    Context: Project "${input.title}" scored ${stage1.overallScore}/100. 
    Critical Flaws: ${stage2.risks?.join(', ')}.
    Weakest Metrics: ${stage2.metrics?.filter(m => m.score < 60).map(m => m.category).join(', ')}.
    
    Task: Generate implementation schedule and strategic pivots (Stage 3).
    
    1. **Strategic Pivots**: 
       - Suggest 3 concrete changes to parameters (e.g. "Increase Budget to $X", "Switch Partner to Y") that directly address the Weakest Metrics identified above.
       
    2. **Schedule**:
       - Realistic Gantt chart based on ${input.duration}.
       
    Output:
    1. Schedule.
    2. Pivots.
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

export const runSimulation = async (input: ProjectInput): Promise<SimulationResult> => {
   const s1 = await runSimulationStage1(input);
   const s2 = await runSimulationStage2(input, s1);
   const s3 = await runSimulationStage3(input, s1, s2);
   return { ...s1, ...s2, ...s3 } as SimulationResult;
}
