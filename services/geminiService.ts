import { GoogleGenAI, Type, Schema, Modality } from "@google/genai";
import { FoodAnalysisResult } from "../types";

// --- Configuration & Schemas ---

const CACHE_TTL = 1000 * 60 * 60; // 1 Hour
const analysisCache = new Map<string, { data: FoodAnalysisResult, timestamp: number }>();

const COMMON_DISHES_LOOKUP: Record<string, FoodAnalysisResult> = {
  "butter chicken": {
    dishName: "Butter Chicken",
    portionSize: "1 Bowl (300g)",
    nutrition: { calories: 490, protein: 25, carbs: 18, fats: 35, fiber: 2, sodium: 850 },
    ingredients: ["Chicken", "Butter", "Cream", "Tomato", "Spices", "Fenugreek"],
    healthRating: 6,
    healthRatingReason: "Rich in protein but high in saturated fats and calories due to cream and butter.",
    dietaryInfo: { type: 'Non-veg', isGlutenFree: true, isDairyFree: false },
    allergens: ["Dairy"],
    healthierAlternative: "Opt for Chicken Tikka (dry) or reduce cream quantity."
  },
  "samosa": {
    dishName: "Samosa",
    portionSize: "2 Pieces (100g)",
    nutrition: { calories: 260, protein: 6, carbs: 32, fats: 18, fiber: 2, sodium: 400 },
    ingredients: ["Potatoes", "Peas", "All Purpose Flour", "Spices", "Oil"],
    healthRating: 4,
    healthRatingReason: "Deep fried and high in refined carbs and fats.",
    dietaryInfo: { type: 'Veg', isGlutenFree: false, isDairyFree: true },
    allergens: ["Gluten"],
    healthierAlternative: "Baked Samosa or Air-fried version."
  },
  "masala dosa": {
    dishName: "Masala Dosa",
    portionSize: "1 Dosa with Sambar",
    nutrition: { calories: 380, protein: 8, carbs: 65, fats: 10, fiber: 6, sodium: 600 },
    ingredients: ["Rice", "Urad Dal", "Potatoes", "Onions", "Spices"],
    healthRating: 7,
    healthRatingReason: "Fermented batter is good for gut health, but potato filling adds carbs.",
    dietaryInfo: { type: 'Veg', isGlutenFree: true, isDairyFree: true },
    allergens: [],
    healthierAlternative: "Reduce potato filling or use Paneer/Vegetable filling."
  }
};

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

// --- Helper Functions ---

const compressImage = async (base64Str: string, maxWidth = 800, quality = 0.7): Promise<string> => {
  if (typeof window === 'undefined') return base64Str; // Server-side safety
  
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str.startsWith('data:') ? base64Str : `data:image/jpeg;base64,${base64Str}`;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Maintain aspect ratio
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Get the data URL without the prefix to be cleaner if needed, but Gemini usually expects base64 data only if using inlineData structure differently. 
          // However, the SDK inlineData expects just the base64 string without the prefix usually, or handles it.
          // Let's return the full dataUrl and strip it later.
          resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
          resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

const getCacheKey = (text?: string, image?: string) => {
    if (image) {
        // Simple hash for image: use first 100 chars + last 100 chars + length
        const cleanImg = image.replace(/^data:image\/\w+;base64,/, "");
        return `IMG_${cleanImg.substring(0, 50)}_${cleanImg.slice(-50)}_${cleanImg.length}`;
    }
    return `TXT_${text?.trim().toLowerCase()}`;
};

// --- Main Analysis ---

export const analyzeFoodWithGemini = async (
  textDescription?: string,
  imageBase64?: string,
  mimeType?: string
): Promise<FoodAnalysisResult> => {
  
  // 1. Instant Cache/Lookup Check
  const cacheKey = getCacheKey(textDescription, imageBase64);
  const cached = analysisCache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
    console.log("Serving from cache");
    return cached.data;
  }

  // 1b. Static Common Dishes Lookup (Text Mode Only)
  if (textDescription && !imageBase64) {
      const cleanText = textDescription.trim().toLowerCase();
      for (const [key, data] of Object.entries(COMMON_DISHES_LOOKUP)) {
          if (cleanText.includes(key)) {
               return data;
          }
      }
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // OPTIMIZATION: Use 'gemini-2.5-flash' for BOTH image and text for maximum speed.
  // It is significantly faster than Pro and sufficient for food recognition.
  const modelName = 'gemini-2.5-flash';

  const systemInstruction = `
    Analyze this Indian food. Return JSON: dishName, portionSize, nutrition(calories, protein, carbs, fats, fiber, sodium), ingredients, healthRating(1-10), reason, dietaryInfo, allergens, healthierAlternative.
    Be concise.
  `;

  const parts: any[] = [];

  // 2. Image Compression & Pre-processing
  if (imageBase64 && mimeType) {
    let processableImage = imageBase64;
    
    // Compress only if it looks like a raw large image (length heuristic)
    if (imageBase64.length > 500000) { // ~350KB
        try {
            const compressedDataUrl = await compressImage(imageBase64);
            // Strip mime prefix for the API call if needed, but existing code might rely on it.
            // The existing code passes `data` as pure base64.
            const matches = compressedDataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                 processableImage = matches[2];
            }
        } catch (e) {
            console.warn("Compression failed, using original", e);
        }
    }

    parts.push({
      inlineData: {
        data: processableImage,
        mimeType: mimeType,
      },
    });
    
    // Optimize prompt for image
    parts.push({ text: "Identify this dish and provide nutrition data." });
  } else if (textDescription) {
    parts.push({ text: textDescription });
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts: parts },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.3, // Low temperature for consistent, faster deterministic outputs
      }
    });

    if (response.text) {
      const result = JSON.parse(response.text) as FoodAnalysisResult;
      
      // Cache the result
      analysisCache.set(cacheKey, { data: result, timestamp: Date.now() });
      
      return result;
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

// --- Image Editing (Gemini 2.5 Flash Image) ---
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
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
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

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({operation: operation});
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed");

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