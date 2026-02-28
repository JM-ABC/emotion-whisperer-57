import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import WritePage from "./pages/WritePage";
import InsightPage from "./pages/InsightPage";
import CoachingPage from "./pages/CoachingPage";
import NotFound from "./pages/NotFound";
import BottomNav from "./components/BottomNav";
import { useAmplitude } from "./hooks/useAmplitude";

const queryClient = new QueryClient();

const App = () => {
  useAmplitude();

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
