import * as React from "react";
import { motion } from "framer-motion";
import { useAppLogin } from "@/hooks/useAppLogin";
import { UserCircle2, LogIn, LogOut } from "lucide-react";

export default function LoginButton() {
  const { login, logout, loading } = useAppLogin();
  const [userName, setUserName] = React.useState<string | null>(() => {
    try {
      const raw = localStorage.getItem("app_user");
      return raw ? JSON.parse(raw).name : null;
    } catch {
      return null;
    }
  });

  React.useEffect(() => {
    // If app_token exists, set a placeholder name
    if (localStorage.getItem("app_token") && !userName) setUserName("로그인됨");
  }, [userName]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {userName ? (
        <button
          onClick={() => {
            logout();
            setUserName(null);
          }}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1 bg-muted/10"
        >
          <UserCircle2 size={18} />
          <span>{userName}</span>
          <LogOut size={16} />
        </button>
      ) : (
        <button
          onClick={async () => {
            const result = await login();
            if (result?.user?.name) setUserName(result.user.name);
          }}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1 bg-primary text-primary-foreground"
        >
          <LogIn size={16} />
          <span>{loading ? "로딩 중..." : "로그인"}</span>
        </button>
      )}
    </motion.div>
  );
}
