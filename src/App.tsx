import { useEffect } from "react";
import { Toaster } from "@/components/tds-adapter";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/tds-adapter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WritePage from "./pages/WritePage";
import InsightPage from "./pages/InsightPage";
import CoachingPage from "./pages/CoachingPage";
import NotFound from "./pages/NotFound";
import UnlinkCallback from "./pages/UnlinkCallback";
import BottomNav from "./components/BottomNav";
import { useAmplitude, identify } from "./hooks/useAmplitude";
import { initFirstUseDate, getDaysSinceFirstUse } from "./lib/user-stats";

const queryClient = new QueryClient();

const App = () => {
  useAmplitude();

  useEffect(() => {
    initFirstUseDate();
    identify({ days_since_first_use: getDaysSinceFirstUse() });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="max-w-lg mx-auto min-h-screen relative">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/write" element={<WritePage />} />
              <Route path="/insight" element={<InsightPage />} />
              <Route path="/coaching" element={<CoachingPage />} />
              <Route path="/unlink" element={<UnlinkCallback />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <BottomNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};


export default App;
