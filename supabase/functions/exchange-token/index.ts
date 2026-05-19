import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type",
};

const createJwt = async (payload: Record<string, unknown>, secret: string) => {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const base64Url = (value: string) =>
    btoa(value)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const header = base64Url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64Url(JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }));
  const signatureBytes = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, encoder.encode(`${header}.${body}`)),
  );
  const signature = base64Url(String.fromCharCode(...signatureBytes));
  return `${header}.${body}.${signature}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { authorizationCode, redirectUri, codeVerifier } = body;

    if (!authorizationCode) {
      return new Response(
        JSON.stringify({ error: "authorizationCode is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (Deno.env.get("DEV_MOCK_TOKEN") === "true") {
      return new Response(
        JSON.stringify({
          token: `mock-jwt-token-${Date.now()}`,
          user: { id: "mock-user-001", name: "테스트 유저" },
          provider: "mock",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const tokenUrl = Deno.env.get("TOSS_OAUTH_TOKEN_URL") ?? "https://auth.toss.im/oauth/token";
    const clientId = Deno.env.get("TOSS_CLIENT_ID");
    const clientSecret = Deno.env.get("TOSS_CLIENT_SECRET");

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: "TOSS_CLIENT_ID and TOSS_CLIENT_SECRET must be configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: authorizationCode,
      client_id: clientId,
      client_secret: clientSecret,
    });

    if (redirectUri) params.append("redirect_uri", redirectUri);
    if (codeVerifier) params.append("code_verifier", codeVerifier);

    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      return new Response(
        JSON.stringify({ error: tokenData.error || "Token exchange failed", details: tokenData }),
        { status: tokenResponse.status || 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const appJwtSecret = Deno.env.get("TOSS_APP_JWT_SECRET");
    const appToken = appJwtSecret
      ? await createJwt({ provider: "toss", tokenData, createdAt: new Date().toISOString() }, appJwtSecret)
      : null;

    return new Response(
      JSON.stringify({
        ...tokenData,
        appToken,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
