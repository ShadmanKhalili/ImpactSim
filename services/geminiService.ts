import { GoogleGenAI, Type } from "@google/genai";
import { ProjectInput, SimulationResult } from "../types";

export const checkApiKeyStatus = () => {
  const key = process.env.API_KEY;
  return {
    hasKey: !!key,
    preview: key ? `${key.substring(0, 4)}...` : 'None'
  };
};

export const runSimulation = async (input: ProjectInput): Promise<SimulationResult> => {
  // Directly use process.env.API_KEY as per guidelines. 
  // Do not add fallback logic or UI prompts for the key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash";

  const prompt = `
    Act as a World-Class International Development Consultant and Sociologist. 
    Analyze the following NGO project proposal strictly based on local context, culture, geography, and socio-economic dynamics.

    Project Details:
    - Title: ${input.title}
    - Sector: ${input.sector}
    - Location: ${input.location}
    - Target Audience: ${input.targetAudience}
    - Estimated Budget: ${input.budget}
    - Duration: ${input.duration}
    - Local Partner Strategy: ${input.localPartner}
    - Technology Level: ${input.technologyLevel}
    - Description: ${input.description}

    Your task is to simulate how this project will likely play out in the real world.
    Be critically realistic. Consider human behavior, cultural taboos (e.g., privacy, gender roles), logistics, corruption, power dynamics, and economic incentives.
    
    Specific Instruction:
    - If the "Local Partner" is weak or missing, increase the risk of community rejection.
    - If "Technology Level" is high in a low-literacy area, assume adoption failure unless training is extensive.
    
    Generate a simulation that includes:
    1. A month-by-month timeline of likely events (including setbacks).
    2. A projected budget breakdown (where money actually goes vs intended).
    3. A stakeholder analysis (who supports vs opposes).
    4. A quantitative risk assessment (likelihood vs severity).
    5. A 5-year long-term impact projection across Social, Economic, and Environmental dimensions.
    
    Return the response in JSON format conforming to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        temperature: 0.4, 
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER, description: "Feasibility score 0-100." },
            communitySentiment: { type: Type.NUMBER, description: "Predicted community acceptance score 0-100." },
            sustainabilityScore: { type: Type.NUMBER, description: "Long-term sustainability score 0-100." },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  reasoning: { type: Type.STRING },
                },
              },
            },
            timeline: {
              type: Type.ARRAY,
              description: "6 key events throughout the project duration.",
              items: {
                type: Type.OBJECT,
                properties: {
                  month: { type: Type.STRING, description: "e.g., 'Month 1', 'Month 3'" },
                  title: { type: Type.STRING, description: "Event title" },
                  description: { type: Type.STRING, description: "What happened" },
                  sentimentScore: { type: Type.NUMBER, description: "Community sentiment at this time (0-100)" },
                }
              }
            },
            budgetBreakdown: {
              type: Type.ARRAY,
              description: "How the budget is likely utilized (including hidden costs like 'logistics overhead' or 'unforeseen repairs').",
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  percentage: { type: Type.NUMBER, description: "Percentage of total budget" },
                }
              }
            },
            stakeholderAnalysis: {
              type: Type.ARRAY,
              description: "Analysis of different groups and their stance.",
              items: {
                type: Type.OBJECT,
                properties: {
                  group: { type: Type.STRING, description: "e.g., 'Local Elders', 'Government Officials', 'Youth'" },
                  sentiment: { type: Type.NUMBER, description: "Negative (-100) to Positive (100)" },
                  influence: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                }
              }
            },
            riskAnalysis: {
               type: Type.ARRAY,
               description: "Key risks mapped by likelihood and severity.",
               items: {
                 type: Type.OBJECT,
                 properties: {
                   risk: { type: Type.STRING },
                   likelihood: { type: Type.NUMBER, description: "1 (Low) to 10 (High)" },
                   severity: { type: Type.NUMBER, description: "1 (Low) to 10 (High)" },
                 }
               }
            },
            longTermImpact: {
              type: Type.ARRAY,
              description: "Projected impact over 5 years. Year 1 to Year 5.",
              items: {
                type: Type.OBJECT,
                properties: {
                  year: { type: Type.STRING, description: "e.g., 'Year 1'" },
                  social: { type: Type.NUMBER, description: "0-100" },
                  economic: { type: Type.NUMBER, description: "0-100" },
                  environmental: { type: Type.NUMBER, description: "0-100" },
                }
              }
            },
            narrative: { type: Type.STRING, description: "A vivid summary of the simulation." },
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
              },
            },
          },
          required: ["overallScore", "communitySentiment", "sustainabilityScore", "metrics", "timeline", "budgetBreakdown", "stakeholderAnalysis", "riskAnalysis", "longTermImpact", "narrative", "risks", "successFactors", "pivots"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as SimulationResult;
  } catch (error: any) {
     console.error("API Call Failed Details:", error);
     throw new Error(error.message || "Unknown API Error");
  }
};