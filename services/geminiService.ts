import { GoogleGenAI, Modality } from "@google/genai";
import { MenuItem } from "../types";

// Helper to check if API key exists
export const hasApiKey = (): boolean => {
  return !!process.env.API_KEY;
};

// Initialize Gemini Client
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }
  return new GoogleGenAI({ apiKey });
};

// Cache for recommendations to prevent 429s on scroll
const recommendationCache = new Map<number, string>();

// Local fallbacks based on taste profile for when quota is exceeded
const getSmartFallback = (item: MenuItem): string => {
  const fallbacks: Record<string, string[]> = {
    'Spicy': [
      "Try a cooling yogurt drink to balance the heat.", 
      "Best paired with a sweet dessert.", 
      "Great with a cold soda."
    ],
    'Sweet': [
      "Pairs well with hot coffee.", 
      "Contrast this sweetness with something salty.", 
      "Perfect for a quick energy boost."
    ],
    'Savoury': [
      "Add a side of fresh salad for crunch.", 
      "Try it with our garlic bread.", 
      "Goes well with iced tea."
    ],
    'Sour': [
      "Balance the tartness with a sweet drink.", 
      "A great palate cleanser.", 
      "Try with something crunchy on the side."
    ]
  };
  
  const options = fallbacks[item.taste] || ["Chef's special recommendation.", "A customer favorite!", "Best enjoyed fresh."];
  // Deterministic fallback based on ID so it doesn't change on re-render
  return options[item.id % options.length];
};

export const generateDishPoster = async (item: MenuItem): Promise<string | null> => {
  if (!hasApiKey()) return null;

  try {
    const ai = getClient();
    // Using gemini-2.5-flash-image for faster/cheaper generation suitable for this demo
    const model = "gemini-2.5-flash-image";
    
    const prompt = `
      High-end culinary photography of ${item.name}.
      Vertical editorial poster style. 8k resolution, hyper-realistic.
      Key elements: ${item.description}.
      Visible Ingredients: ${item.ingredients.join(", ")}.
      Aesthetic: Michelin star plating, moody cinematic lighting, shallow depth of field (bokeh), glistening textures, steam rising, macro details.
      Composition: Centered, elegant, magazine cover quality.
      No text overlays, no labels.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }]
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    return null;

  } catch (error) {
    console.error("Failed to generate image for", item.name, error);
    return null;
  }
};

export const getAIRecommendationDetails = async (item: MenuItem): Promise<string> => {
  if (!hasApiKey()) return getSmartFallback(item);

  // Check cache first to avoid rate limits
  if (recommendationCache.has(item.id)) {
    return recommendationCache.get(item.id)!;
  }

  try {
    const ai = getClient();
    const model = "gemini-2.5-flash"; // Text model

    const prompt = `
      I am viewing a menu item: ${item.name} (${item.taste}).
      Ingredients: ${item.ingredients.join(", ")}.
      Briefly suggest a unique drink or side dish pairing and explain why in 1 short sentence (max 15 words).
      Make it sound exciting.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    const result = response.text?.trim() || getSmartFallback(item);
    recommendationCache.set(item.id, result);
    return result;
  } catch (error: any) {
    // Gracefully handle quota limits (429)
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429 || error?.message?.includes('429')) {
      console.warn(`Quota exceeded for ${item.name} recommendation. Using smart fallback.`);
      const fallback = getSmartFallback(item);
      recommendationCache.set(item.id, fallback); // Cache the fallback so we don't retry immediately
      return fallback;
    }
    console.error("Failed to get text recommendation", error);
    return getSmartFallback(item);
  }
};

export const askChefAboutDish = async (item: MenuItem, question: string): Promise<string> => {
  if (!hasApiKey()) return "I can't answer that right now.";
  
  try {
    const ai = getClient();
    const model = "gemini-2.5-flash";
    
    const prompt = `
      You are the head chef of a premium restaurant. 
      The customer is asking about: "${item.name}".
      Description: ${item.description}.
      Ingredients: ${item.ingredients.join(", ")}.
      
      User Question: "${question}"
      
      Answer briefly (under 40 words), accurately, and with a friendly, professional tone.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });

    return response.text?.trim() || "I'm not sure, let me check with the kitchen.";
  } catch (error: any) {
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429 || error?.message?.includes('429')) {
      console.warn("Quota exceeded for chat.");
      return "The chef is currently overwhelmed with orders (Rate Limit Reached). Please try again in a moment.";
    }
    console.error("Chat error", error);
    return "Sorry, the chef is busy right now.";
  }
};

// Audio Utilities
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

export const playDishDescription = async (item: MenuItem): Promise<void> => {
  if (!hasApiKey()) return;

  try {
    const ai = getClient();
    const prompt = `Describe the ${item.name} in a very appetizing, seductive way. Focus on textures and flavors. Max 2 sentences.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: prompt }] }],
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
    if (!base64Audio) throw new Error("No audio data");

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const outputNode = outputAudioContext.createGain();
    outputNode.connect(outputAudioContext.destination);

    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1,
    );
    
    const source = outputAudioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(outputNode);
    source.start();

  } catch (error: any) {
    if (error?.status === 'RESOURCE_EXHAUSTED' || error?.code === 429 || error?.message?.includes('429')) {
       console.warn("Quota exceeded for Audio TTS.");
       return;
    }
    console.error("TTS Error", error);
  }
};