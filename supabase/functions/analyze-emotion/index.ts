import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const EMOTIONS = [
  "happiness", "excitement", "calm", "contentment",
  "love", "gratitude", "hope", "inspiration",
  "sadness", "loneliness", "anger", "frustration",
  "anxiety", "fear", "exhaustion", "boredom",
];

const ISLANDS = ["joy", "peace", "love", "hope", "sadness", "anger", "fear", "fatigue"];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { diary } = await req.json();
    if (!diary || typeof diary !== "string" || diary.trim().length < 5) {
      return new Response(JSON.stringify({ error: "일기 내용이 너무 짧아요." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `너는 사용자의 하루 일기를 읽고 핵심 감정과 기억을 추출하는 감정 분석가야.
사용자의 일기에서 가장 강한 감정 하나를 골라 분석해줘.
반드시 tool call로 응답해야 해. 직접 텍스트로 응답하지 마.

감정 종류: ${EMOTIONS.join(", ")}
섬 종류: ${ISLANDS.join(", ")}

감정-섬 매핑:
- joy: happiness, excitement
- peace: calm, contentment  
- love: love, gratitude
- hope: hope, inspiration
- sadness: sadness, loneliness
- anger: anger, frustration
- fear: anxiety, fear
- fatigue: exhaustion, boredom`,
          },
          { role: "user", content: diary },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_emotion",
              description: "일기에서 추출한 감정과 핵심 기억을 반환합니다.",
              parameters: {
                type: "object",
                properties: {
                  emotion: {
                    type: "string",
                    enum: EMOTIONS,
                    description: "16개 감정 중 가장 두드러지는 감정 하나",
                  },
                  island: {
                    type: "string",
                    enum: ISLANDS,
                    description: "해당 감정이 속하는 섬",
                  },
                  core_memory: {
                    type: "string",
                    description: "일기에서 가장 핵심적인 기억을 한 줄로 요약 (20자 이내)",
                  },
                  empathy_message: {
                    type: "string",
                    description: "사용자에게 건네는 따뜻한 공감 한마디 (30자 이내)",
                  },
                },
                required: ["emotion", "island", "core_memory", "empathy_message"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_emotion" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "요청이 너무 많아요. 잠시 후 다시 시도해주세요." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI 사용량을 초과했어요." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI 분석에 실패했어요." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "AI 응답을 처리할 수 없어요." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-emotion error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
