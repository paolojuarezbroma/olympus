
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { UserProfile, LongevityPlan } from "./types";

const API_KEY = process.env.API_KEY || '';

export const generatePlan = async (userProfile: UserProfile) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const m = userProfile.healthMetrics;
  const healthContext = m?.isConnected 
    ? `
    FULL BIOMETRIC FEED:
    [Activity] Steps: ${m.dailySteps}, VO2 Max: ${m.vo2Max}.
    [Metabolic] Glucose: ${m.bloodGlucoseMgDl}mg/dL, Insulin: ${m.insulinMicroIU}uIU.
    [Recovery] HRV: ${m.hrv}ms, Deep Sleep: ${m.deepSleepMinutes}m.
    `
    : "No external health data. Using self-reported profile.";

  const prompt = `
    You are the Olympus Longevity Architect. Design an ELITE 7-day Age Reversal Protocol for:
    Profile: ${userProfile.age}yo ${userProfile.gender}, Goals: ${userProfile.goals}.
    
    ${healthContext}

    PROTOCOL REQUIREMENTS (SCIENTIFIC STANDARDS):
    1. EXERCISE: 
       - Zone 2 Cardio (45m, 3-4x/week).
       - Strength Training (High intensity to failure, 3x/week).
       - VO2 Max (4x4 Intervals, 1x/week).
    2. HORMESIS:
       - Sauna (20m @ 80C+, 4x/week).
       - Cold Plunge (1-3m, Daily morning).
    3. SUPPLEMENTS (SINCLAIR/BLUEPRINT):
       - Morning: 1g NMN, 500mg Resveratrol, Vitamin D3+K2, Omega-3.
       - Evening: Magnesium Threonate/Glycinate.
    4. NUTRITION:
       - Low inflammation / Blue Zone style.
       - Strict Time-Restricted Feeding (e.g., 18:6).
    5. STRESS: Box breathing (5m daily).

    Every item must have a specific 'time', 'activity', and a 'description' explaining the biological benefit (e.g., 'mTOR inhibition', 'SIRT1 activation').

    Format as valid JSON matching the LongevityPlan schema.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          week: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                items: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      time: { type: Type.STRING },
                      activity: { type: Type.STRING },
                      type: { type: Type.STRING },
                      description: { type: Type.STRING },
                      completed: { type: Type.BOOLEAN }
                    },
                    required: ['id', 'time', 'activity', 'type', 'description']
                  }
                }
              },
              required: ['day', 'items']
            }
          }
        },
        required: ['week']
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("AI Generation Error", e);
    return null;
  }
};

export const generateGroceryList = async (plan: LongevityPlan) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `
    Analyze this 7-day protocol: ${JSON.stringify(plan)}
    Extract all specific ingredients for meals and all required supplements.
    Categorize into: 'Longevity Supplements', 'Proteins', 'Produce', 'Fats & Oils', 'Pantry'.
    Ignore generic terms like "Water" or "Salt".
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          categories: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                items: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['category', 'items']
            }
          }
        },
        required: ['categories']
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return null;
  }
};

const updateProtocolDeclaration: FunctionDeclaration = {
  name: 'update_protocol',
  parameters: {
    type: Type.OBJECT,
    description: 'Adjust the user schedule based on their feedback.',
    properties: {
      day: { type: Type.STRING },
      updates: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, time: { type: Type.STRING }, activity: { type: Type.STRING }, type: { type: Type.STRING }, description: { type: Type.STRING }, completed: { type: Type.BOOLEAN } } } }
    }
  }
};

const markCompleteDeclaration: FunctionDeclaration = {
  name: 'mark_activity_complete',
  parameters: {
    type: Type.OBJECT,
    description: 'Log completion of a longevity task.',
    properties: { day: { type: Type.STRING }, id: { type: Type.STRING }, completed: { type: Type.BOOLEAN } }
  }
};

export const createVoiceSession = async (userProfile: UserProfile, currentPlan: LongevityPlan, callbacks: any) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const systemInstruction = `
    You are 'Olympus', the user's high-end personal longevity coach.
    You follow the research of David Sinclair and the Blueprint of Bryan Johnson.
    You are an expert in bio-hacking, hormetic stress, and nutritional biochemistry.
    
    Be supportive, precise, and scientifically rigorous. 
    If a user reports feeling fatigued, suggest shifting intensity or adjusting their NMN dosage/timing.
  `;

  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: ['AUDIO' as any],
      systemInstruction,
      tools: [{ functionDeclarations: [updateProtocolDeclaration, markCompleteDeclaration] }],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
      }
    }
  });
};
