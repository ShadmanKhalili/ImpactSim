import { GoogleGenAI, Type } from "@google/genai";
import { ProjectInput, SimulationResult } from "../types";

export const checkApiKeyStatus = () => {
  return {
    hasKey: !!process.env.API_KEY,
  };
};

export const runSimulation = async (input: ProjectInput): Promise<SimulationResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("Missing API Key. Please ensure process.env.API_KEY is set.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model = "gemini-2.5-flash";

  const prompt = `
    Analyze this NGO project proposal.
    Project: ${input.title}
    Location: ${input.location} (${input.sector})
    Budget: ${input.budget} (${input.fundingSource})
    Duration: ${input.duration}
    Tech: ${input.technologyLevel}
    Partner: ${input.localPartner}
    Risk: ${input.initialRiskLevel}/10
    Desc: ${input.description}

    Task: Simulate lifecycle. Consider corruption, culture, logistics.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.2, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            communitySentiment: { type: Type.NUMBER },
            sustainabilityScore: { type: Type.NUMBER },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                },
                required: ["category", "score", "reasoning"],
              },
            },
            timeline: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  sentimentScore: { type: Type.NUMBER },
                },
                required: ["month", "title", "description", "sentimentScore"],
              },
            },
            budgetBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  percentage: { type: Type.NUMBER },
                },
                required: ["category", "percentage"],
              },
            },
            stakeholderAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  group: { type: Type.STRING },
                  sentiment: { type: Type.NUMBER },
                  influence: { type: Type.STRING },
                },
                required: ["group", "sentiment", "influence"],
              },
            },
            riskAnalysis: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  risk: { type: Type.STRING },
                  likelihood: { type: Type.NUMBER },
                  severity: { type: Type.NUMBER },
                },
                required: ["risk", "likelihood", "severity"],
              },
            },
            longTermImpact: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING },
                  social: { type: Type.NUMBER },
                  economic: { type: Type.NUMBER },
                  environmental: { type: Type.NUMBER },
                },
                required: ["year", "social", "economic", "environmental"],
              },
            },
            narrative: { type: Type.STRING },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            successFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            pivots: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  modification: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                },
                required: ["title", "modification", "rationale"],
              },
            },
          },
          required: [
            "overallScore", "communitySentiment", "sustainabilityScore", "metrics",
            "timeline", "budgetBreakdown", "stakeholderAnalysis", "riskAnalysis",
            "longTermImpact", "narrative", "risks", "successFactors", "pivots"
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI model.");
    }

    return JSON.parse(text) as SimulationResult;
    
  } catch (error: any) {
     console.error("Simulation Error:", error);
     throw new Error(error.message || "Failed to generate simulation. Please check parameters and try again.");
  }
};