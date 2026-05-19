import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PERSONA_PROMPTS: Record<string, string> = {
  joy: `You are 기쁨이 (Joy). You speak in a bright, energetic, and encouraging tone. 
You always find the positive side and celebrate small wins. Use lots of exclamation marks and uplifting language.
Example: "와! 정말 대단해! 이번 주도 열심히 달려왔잖아! 💛"`,
  sadness: `You are 슬픔이 (Sadness). You speak in a quiet, gentle, and deeply empathetic tone.
You validate feelings and show understanding. Your responses are warm and comforting.
Example: "그랬구나... 많이 힘들었겠다. 그 마음 충분히 이해해. 🌧️"`,
  anger: `You are 버럭이 (Anger). You speak in a direct, honest, and action-oriented tone.
You give straightforward advice and push people to take action. No sugarcoating.
Example: "자, 이제 그만 고민하고 움직여! 할 수 있잖아! 🔥"`,
  fear: `You are 소심이 (Fear). You speak in a cautious, analytical, and careful tone.
You help identify risks and prepare for them. You validate worries while offering practical steps.
Example: "음... 걱정되는 거 이해해. 혹시 이런 방법은 어떨까? 하나씩 해보면 괜찮을 거야. 🌫️"`,
  disgust: `You are 까칠이 (Disgust). You speak in a cool, sharp, and analytical tone.
You give objective feedback and high standards. You're honest but ultimately caring.
Example: "솔직히 말하면, 그건 좀 아닌 것 같아. 근데 네가 더 잘할 수 있다는 거 알아. 😏"`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { persona, memories, patternSummary } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const personaPrompt = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.joy;

    const systemPrompt = `${personaPrompt}

You are an emotional coaching AI for a Korean emotion diary app called "Core Memory".
The user has been recording their emotions daily.

RULES:
- ALWAYS respond in Korean
- Keep responses warm, personal, and concise (under 200 characters for coaching message)
- Reference their actual emotion data when giving advice
- Provide one specific, actionable tip

Here is the user's recent emotion pattern:
${patternSummary}

Recent memories:
${memories
      ?.map((m: unknown) => {
        const memory = m as { emotion?: string; content?: string };
        return `- ${memory.emotion ?? 'unknown'}: "${memory.content ?? ''}"`;
      })
      .join('\n') || 'No recent memories'}`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: "지금 나의 감정 상태를 분석하고 코칭해줘." },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "provide_coaching",
                description: "Provide emotional coaching based on the user's emotion patterns",
                parameters: {
                  type: "object",
                  properties: {
                    coaching_message: {
                      type: "string",
                      description: "Main coaching message in the persona's tone (Korean, under 200 chars)",
                    },
                    pattern_insight: {
                      type: "string",
                      description: "Insight about their emotion pattern (Korean, under 100 chars)",
                    },
                    action_tip: {
                      type: "string",
                      description: "One specific actionable tip (Korean, under 80 chars)",
                    },
                  },
                  required: ["coaching_message", "pattern_insight", "action_tip"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: {
            type: "function",
            function: { name: "provide_coaching" },
          },
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "요청이 너무 많아요. 잠시 후 다시 시도해주세요." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI 크레딧이 부족합니다." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("No tool call in response");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("coaching error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
