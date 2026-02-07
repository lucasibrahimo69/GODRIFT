
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getItemAnalysis = async (itemName: string, category: string): Promise<AIAnalysis> => {
  const prompt = `Como um engenheiro de corrida especialista em Assetto Corsa 2014, analise o seguinte ${category}: "${itemName}".
  Forneça uma análise curta em JSON contendo:
  - itemTitle: Nome do item
  - pros: Uma lista de 3 pontos fortes no simulador (em português)
  - tips: Uma dica secreta de pilotagem ou setup para este item em Assetto Corsa (em português)`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itemTitle: { type: Type.STRING },
            pros: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            tips: { type: Type.STRING }
          },
          required: ["itemTitle", "pros", "tips"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      itemTitle: itemName,
      pros: ["Desempenho sólido", "Manuseio equilibrado", "Ótima escolha"],
      tips: "Foque na consistência das voltas antes de buscar o limite extremo."
    };
  }
};
