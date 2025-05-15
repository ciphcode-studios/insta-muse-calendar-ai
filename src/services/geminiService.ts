// src/services/geminiService.ts
import { supabase } from '@/integrations/supabase/client';

export interface GeminiRequestPayload {
  contentDescription: string;
  targetAudience: string;
  postType: string; // e.g., 'Reel', 'Carousel', 'Story', 'Single Image'
  tone: string; // e.g., 'Informative', 'Humorous', 'Inspirational'
  brandKeywords?: string[];
  negativeKeywords?: string[];
  imageStyle?: string; // e.g., 'Photorealistic', 'Cartoonish', 'Abstract'
}

export interface ImagePrompt {
  prompt: string;
}

export interface GeminiResponsePayload {
  prompts: ImagePrompt[];
  error?: string;
}

export const generateImagePrompts = async (payload: GeminiRequestPayload): Promise<GeminiResponsePayload> => {
  const { data, error } = await supabase.functions.invoke('generate-image-prompts', {
    body: payload,
  });

  if (error) {
    console.error('Error invoking Supabase function:', error);
    // It's good practice to throw an error or return a structured error response
    // For now, we'll return the error message in the payload
    return { prompts: [], error: error.message };
  }

  // Assuming the data returned by the function matches GeminiResponsePayload
  // You might need to add more robust error handling or data transformation here
  return data as GeminiResponsePayload;
};

// Example usage (you can remove this or keep for testing):
/*
async function testGeneratePrompts() {
  try {
    const payload: GeminiRequestPayload = {
      contentDescription: 'A new line of eco-friendly yoga mats',
      targetAudience: 'millennial women interested in wellness',
      postType: 'Single Image',
      tone: 'Inspirational',
      imageStyle: 'Minimalist and bright',
    };
    const result = await generateImagePrompts(payload);
    if (result.error) {
      console.error('Failed to generate prompts:', result.error);
    } else {
      console.log('Generated Prompts:', result.prompts);
    }
  } catch (e) {
    console.error('An unexpected error occurred:', e);
  }
}

testGeneratePrompts();
*/