
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
  const model = "gemini-3-pro-preview";

  // Incorporate strategy history into the context
  const historyContext = input.strategyHistory && input.strategyHistory.length > 0
    ? `Project Evolution / Applied Pivots:\n${input.strategyHistory.map(h => `- ${h}`).join('\n')}`
    : "No pivots applied yet. This is the initial design.";

  const prompt = `
    Persona: You are a Hard-Nosed, Critical International Development Grant Auditor. 
    Your job is to screen projects for MAJOR funding. You are skeptical, objective, and financially astute.
    You DO NOT glaze over details. You DO NOT give high scores to "nice ideas" that lack logistical grounding.
    You are allergic to buzzwords (AI, Blockchain, Drones) unless they are absolutely necessary and supported by infrastructure.

    Objective: Critically analyze the feasibility of the following NGO project.
    
    Project Parameters:
    - Title: ${input.title}
    - Location: ${input.location}
    - Sector: ${input.sector}
    - Budget: ${input.budget} (${input.fundingSource})
    - Duration: ${input.duration}
    - Technology: ${input.technologyLevel}
    - Local Partner: ${input.localPartner}
    - Team Experience: ${input.teamExperience}
    - Methodology/Description: ${input.description}
    
    ${historyContext}

    Scoring Guidelines (STRICT):
    1. Baseline Score: Start at 50/100 (Neutral). The project must EARN every point above that.
    2. Penalties (Apply Heavily):
       - "High Tech" in low-infrastructure areas without a maintenance plan (-20 points).
       - "New/Volunteer Teams" managing large budgets >$100k (-15 points).
       - "Direct Implementation" (No local partner) in a foreign country (-10 points).
       - Short durations (<1 year) for complex behavioral change (-10 points).
    3. Bonuses: Only award for "Expert" teams (+5), "Low Tech" solutions (+5), or specific evidence of strong local partnership.
    4. Objectivity: A typical well-meaning pilot usually fails or struggles. A score > 80 should be extremely rare and reserved for perfect alignment.

    Output Requirements:
    - Executive Summary: Be blunt. Focus on the "Hard Truths". Why might this fail? Is the budget realistic? Is the tech appropriate?
    - Critical Risks: List 3-5 specific, fatal flaws.
    - Schedule: Create a realistic Gantt chart data structure.

    Task:
    1. Simulate the project lifecycle.
    2. Analyze risks, stakeholders, and budget.
    3. Provide 3 concrete "Pivots" (strategic changes). For each pivot, you MUST specify exactly which project parameters (Budget, Duration, Partner, etc.) should change.
  `;

  // Helper to sanitize JSON string (remove markdown code blocks)
  const cleanJsonResponse = (text: string): string => {
    return text.replace(/```json\n|\n```/g, "").replace(/```/g, "").trim();
  };

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
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task: { type: Type.STRING },
                  startMonth: { type: Type.NUMBER },
                  durationMonths: { type: Type.NUMBER },
                  type: { type: Type.STRING, enum: ['planning', 'execution', 'milestone'] }
                },
                required: ["task", "startMonth", "durationMonths", "type"]
              }
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
                  changes: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      location: { type: Type.STRING },
                      targetAudience: { type: Type.STRING },
                      sector: { type: Type.STRING },
                      budget: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      description: { type: Type.STRING },
                      localPartner: { type: Type.STRING },
                      technologyLevel: { type: Type.STRING },
                      fundingSource: { type: Type.STRING },
                      teamExperience: { type: Type.STRING },
                    },
                  }
                },
                required: ["title", "modification", "rationale", "changes"],
              },
            },
          },
          required: [
            "overallScore", "communitySentiment", "sustainabilityScore", "metrics",
            "timeline", "schedule", "budgetBreakdown", "stakeholderAnalysis", "riskAnalysis",
            "longTermImpact", "narrative", "risks", "successFactors", "pivots"
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response received from AI model.");
    }
    
    const cleanText = cleanJsonResponse(text);
    return JSON.parse(cleanText) as SimulationResult;
    
  } catch (error: any) {
     console.error("Simulation Error:", error);
     throw new Error(error.message || "Failed to generate simulation. Please check parameters and try again.");
  }
};
