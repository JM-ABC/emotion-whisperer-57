import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ISLANDS = [
  { id: "joy", prompt: "sunny golden floating island with warm light rays and glowing particles" },
  { id: "peace", prompt: "calm blue ocean floating island with gentle waves and serene water" },
  { id: "love", prompt: "pink heart-shaped floating island with warm rosy glow and flowers" },
  { id: "hope", prompt: "green sprouting floating island with fresh leaves and growing plants" },
  { id: "sadness", prompt: "rainy blue floating island with rain clouds and teardrops" },
  { id: "anger", prompt: "red volcanic floating island with lava flows and fire" },
  { id: "fear", prompt: "purple misty floating island with fog swirls and dark shadows" },
  { id: "fatigue", prompt: "dark blue moonlit floating island with crescent moon and stars" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const results: { id: string; status: string; url?: string; error?: string }[] = [];

    for (const island of ISLANDS) {
      try {
        console.log(`Generating image for ${island.id}...`);

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: `A cute floating fantasy island, ${island.prompt}, Pixar-style 3D illustration, isolated on pure black background, no frame, no border, soft ambient glow, game icon style, centered composition, high quality, detailed`,
              },
            ],
            modalities: ["image", "text"],
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`AI error for ${island.id}:`, response.status, errorText);
          results.push({ id: island.id, status: "error", error: `AI response ${response.status}` });
          continue;
        }

        const data = await response.json();
        const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

        if (!imageUrl) {
          console.error(`No image returned for ${island.id}`);
          results.push({ id: island.id, status: "error", error: "No image in response" });
          continue;
        }

        // Extract base64 data
        const base64Data = imageUrl.replace(/^data:image\/\w+;base64,/, "");
        const imageBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from("island-images")
          .upload(`${island.id}.png`, imageBytes, {
            contentType: "image/png",
            upsert: true,
          });

        if (uploadError) {
          console.error(`Upload error for ${island.id}:`, uploadError);
          results.push({ id: island.id, status: "error", error: uploadError.message });
          continue;
        }

        const { data: publicUrl } = supabase.storage
          .from("island-images")
          .getPublicUrl(`${island.id}.png`);

        console.log(`✅ ${island.id} uploaded: ${publicUrl.publicUrl}`);
        results.push({ id: island.id, status: "success", url: publicUrl.publicUrl });
      } catch (e) {
        console.error(`Error for ${island.id}:`, e);
        results.push({ id: island.id, status: "error", error: e.message });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
