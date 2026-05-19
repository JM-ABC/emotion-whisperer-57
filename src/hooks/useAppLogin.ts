import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useAppLogin() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    try {
      // Dynamic import using a variable to avoid Vite's static resolution during tests
      // and to defer bundling in the web build.
      const sdkName = '@apps-in-toss/web-framework';
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore dynamic import
      const sdk = await import(sdkName).catch(() => null);

      if (!sdk || typeof sdk.appLogin !== "function") {
        toast({ title: "로그인 불가", description: "앱 환경에서 로그인하세요.", variant: "destructive" });
        setLoading(false);
        return null;
      }

      const result = await sdk.appLogin();

      // The SDK may return various shapes — prefer authorizationCode or code, then accessToken
      const code = result?.authorizationCode ?? result?.code;
      const accessToken = result?.accessToken ?? result?.access_token;

      if (code) {
        // Exchange with server-side function
        const { data, error } = await supabase.functions.invoke("exchange-token", {
          body: { authorizationCode: code, redirectUri: window.location.origin },
        });

        if (error) throw new Error(error.message || "Token exchange failed");

        // store appToken if provided
        if (data?.appToken) localStorage.setItem("app_token", data.appToken);
        else if (data?.access_token) localStorage.setItem("app_token", data.access_token);

        toast({ title: "로그인 성공", description: "토큰을 발급받았습니다." });
        setLoading(false);
        return data;
      }

      if (accessToken) {
        localStorage.setItem("app_token", accessToken);
        toast({ title: "로그인 성공", description: "토큰을 로컬에 저장했습니다." });
        setLoading(false);
        return { accessToken };
      }

      toast({ title: "로그인 실패", description: "로그인 응답을 확인할 수 없습니다.", variant: "destructive" });
      setLoading(false);
      return null;
    } catch (e) {
      console.error("Login failed:", e);
      toast({ title: "로그인 실패", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
      setLoading(false);
      return null;
    }
  }

  function logout() {
    localStorage.removeItem("app_token");
    toast({ title: "로그아웃", description: "로컬 세션을 제거했습니다." });
  }

  return { login, logout, loading };
}
