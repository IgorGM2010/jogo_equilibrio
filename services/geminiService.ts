import { GoogleGenAI, Type } from "@google/genai";
import { GameCard } from '../types';

const SYSTEM_INSTRUCTION = `
You are a creative game designer for a game called "Equilíbrio". 
The game is about the mental health of a teenager student. 
Generate balanced, realistic scenarios involving school, home life, or social situations.
Each scenario requires a binary choice. Each choice must affect at least one of these stats: 
- mental (Mental Health)
- energy (Physical Energy)
- mood (Happiness/Anxiety)
- focus (Academic Focus)

The effects should be integers between -25 and +25.
IMPORTANT: All text (scenario, choice text) must be in PORTUGUESE (Brazil).
Return strictly JSON.
`;

export const generateNewCard = async (existingIds: string[]): Promise<GameCard | null> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 1 unique game card scenario for a student life simulation in Portuguese. 
      Ensure the ID is unique (random string).
      Contexts allowed: 'school', 'home', 'social'.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            scenario: { type: Type.STRING },
            context: { type: Type.STRING, enum: ['school', 'home', 'social'] },
            leftChoice: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                effect: {
                  type: Type.OBJECT,
                  properties: {
                    mental: { type: Type.INTEGER },
                    energy: { type: Type.INTEGER },
                    mood: { type: Type.INTEGER },
                    focus: { type: Type.INTEGER },
                  }
                }
              }
            },
            rightChoice: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                effect: {
                  type: Type.OBJECT,
                  properties: {
                    mental: { type: Type.INTEGER },
                    energy: { type: Type.INTEGER },
                    mood: { type: Type.INTEGER },
                    focus: { type: Type.INTEGER },
                  }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    const card = JSON.parse(text) as GameCard;
    return card;

  } catch (error) {
    console.error("Gemini generation failed", error);
    return null;
  }
};