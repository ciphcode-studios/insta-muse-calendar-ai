// supabase/functions/generate-image-prompts/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
// Placeholder for Gemini API Key - remind user to set this in Supabase project settings
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

interface RequestPayload {
  contentDescription: string;
  targetAudience: string;
  postType: string; // e.g., 'Reel', 'Carousel', 'Story', 'Single Image'
  tone: string; // e.g., 'Informative', 'Humorous', 'Inspirational'
  brandKeywords?: string[];
  negativeKeywords?: string[];
  imageStyle?: string; // e.g., 'Photorealistic', 'Cartoonish', 'Abstract'
}

interface ImagePrompt {
  prompt: string;
  // Potentially add other metadata here if Gemini provides it
}

interface ResponsePayload {
  prompts: ImagePrompt[];
  error?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: RequestPayload = await req.json();

    // Validate payload
    if (!payload.contentDescription || !payload.targetAudience || !payload.postType || !payload.tone) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: contentDescription, targetAudience, postType, tone" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // --- Placeholder for Gemini API Call --- 
    // Here you would construct the prompt for Gemini based on the payload
    // and then make a fetch request to the Gemini API.
    // Example construction:
    const geminiInputPrompt = `Generate an Instagram image prompt for a ${payload.postType} targeting ${payload.targetAudience}. The content is about: ${payload.contentDescription}. The desired tone is ${payload.tone}.${payload.imageStyle ? ` The image style should be ${payload.imageStyle}.` : ''}${payload.brandKeywords ? ` Include themes like: ${payload.brandKeywords.join(', ')}.` : ''}${payload.negativeKeywords ? ` Avoid themes like: ${payload.negativeKeywords.join(', ')}.` : ''}`;

    console.log("Constructed Gemini Prompt:", geminiInputPrompt);

    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY is not set in environment variables.");
      return new Response(
        JSON.stringify({ error: "Gemini API key not configured. Please set it in your Supabase project's Edge Function settings." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiInputPrompt }] }],
        // Add generationConfig if needed (e.g., temperature, maxOutputTokens, safetySettings)
        // Example safetySettings to allow potentially harmless content often flagged by default:
        // safetySettings: [
        //   { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        //   { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
        //   { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        //   { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        // ],
      }),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text(); // Read as text first for better debugging
      console.error("Gemini API Error Status:", geminiResponse.status);
      console.error("Gemini API Error Response:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        return new Response(
          JSON.stringify({ error: "Failed to generate prompts from Gemini AI", details: errorData }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: geminiResponse.status }
        );
      } catch (e) {
        // If parsing fails, return the raw text
        return new Response(
          JSON.stringify({ error: "Failed to generate prompts from Gemini AI and couldn't parse error response", details: errorText }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: geminiResponse.status }
        );
      }
    }

    const geminiData = await geminiResponse.json();
    const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    const responseBody: ResponsePayload = { prompts: [] };
    if (generatedText) {
      // Assuming Gemini returns one prompt, or you might need to parse multiple if applicable
      responseBody.prompts = [{ prompt: generatedText.trim() }];
    } else {
      // Check for blockages due to safety settings or other reasons
      if (geminiData.promptFeedback?.blockReason) {
        console.warn("Gemini content blocked:", geminiData.promptFeedback.blockReason);
        responseBody.error = `Content generation blocked by API: ${geminiData.promptFeedback.blockReason}`;
      } else {
        console.warn("Could not extract prompt from Gemini response. Data:", JSON.stringify(geminiData));
        responseBody.error = "Could not extract prompt from Gemini response";
      }
    }

    return new Response(
      JSON.stringify(responseBody),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );

  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

/* 
To deploy this function:
1. Make sure you have the Supabase CLI installed and are logged in.
2. Navigate to your project's root directory in the terminal.
3. Run: supabase functions deploy generate-image-prompts --project-ref YOUR_PROJECT_REF

To call this function (after deployment):
const { data, error } = await supabase.functions.invoke('generate-image-prompts', {
  body: { 
    contentDescription: "A new line of eco-friendly yoga mats",
    targetAudience: "millennial women interested in wellness",
    postType: "Single Image",
    tone: "Inspirational",
    imageStyle: "Minimalist and bright"
  }
})

Remember to set your GEMINI_API_KEY as an environment variable in your Supabase project settings.
Go to Project Settings > Edge Functions > Add new secret.
*/