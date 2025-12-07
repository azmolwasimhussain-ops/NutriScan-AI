import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { FoodAnalysisResult } from "../types";

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    dishName: { type: Type.STRING, description: "Name of the identified dish" },
    portionSize: { type: Type.STRING, description: "Estimated portion size (e.g., 1 cup, 150g)" },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fats: { type: Type.NUMBER },
        fiber: { type: Type.NUMBER },
        sodium: { type: Type.NUMBER },
      },
      required: ["calories", "protein", "carbs", "fats", "fiber", "sodium"]
    },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of identified ingredients"
    },
    healthRating: { type: Type.NUMBER, description: "Rating from 1-10" },
    healthRatingReason: { type: Type.STRING, description: "Brief explanation for the rating" },
    dietaryInfo: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, enum: ["Veg", "Non-veg", "Vegan"] },
        isGlutenFree: { type: Type.BOOLEAN },
        isDairyFree: { type: Type.BOOLEAN },
      },
      required: ["type", "isGlutenFree", "isDairyFree"]
    },
    allergens: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of potential allergens"
    },
    healthierAlternative: { type: Type.STRING, description: "Suggestion to make it healthier" }
  },
  required: ["dishName", "portionSize", "nutrition", "ingredients", "healthRating", "healthRatingReason", "dietaryInfo", "allergens", "healthierAlternative"]
};

// --- Main Analysis ---
export const analyzeFoodWithGemini = async (
  textDescription?: string,
  imageBase64?: string,
  mimeType?: string
): Promise<FoodAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Requirement: Use 'gemini-3-pro-preview' for image understanding (Analyze Images)
  // Requirement: Use 'gemini-2.5-flash-lite' for text-only (Fast AI responses)
  const modelName = imageBase64 ? 'gemini-3-pro-preview' : 'gemini-2.5-flash-lite';

  const systemInstruction = `
    You are a professional nutritionist and food analyst specializing in Indian cuisine.
    Your task is to analyze the given food description or image accurately.
    Identify the dish, estimate portion size, calculate specific nutrition facts, check ingredients, rate health (1-10), and determine dietary type.
    Be extremely accurate with Indian dishes.
  `;

  const parts: any[] = [];

  if (imageBase64 && mimeType) {
    parts.push({
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    });
  }

  if (textDescription) {
    parts.push({ text: textDescription });
  } else if (imageBase64) {
    parts.push({ text: "Analyze this food image in detail according to the system instructions." });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as FoodAnalysisResult;
    } else {
      throw new Error("No data returned from Gemini");
    }
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

// --- TTS Generation (Gemini 2.5 Flash Preview TTS) ---
export const generateSpeech = async (text: string): Promise<AudioBuffer> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio data generated");

  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
  const audioBuffer = await decodeAudioData(
    decode(base64Audio),
    outputAudioContext,
    24000,
    1
  );
  return audioBuffer;
};

// --- Image Editing (Nano Banana / Gemini 2.5 Flash Image) ---
export const editFoodImage = async (
  originalImageBase64: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Use gemini-2.5-flash-image for editing with text prompts
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: originalImageBase64,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
};

// --- Video Generation (Veo) ---
export const generateFoodVideo = async (
  imageBase64: string,
  mimeType: string
): Promise<string> => {
  // Always create new instance for Veo to ensure API key is fresh from selection
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    // Prompt is optional but helpful
    prompt: 'Cinematic slow motion shot of this delicious Indian dish, professional food photography, 4k',
    image: {
      imageBytes: imageBase64,
      mimeType: mimeType,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  // Polling loop
  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5s
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");

  // Fetch the actual video bytes using the key
  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};


// --- Audio Helpers ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}