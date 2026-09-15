import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { ReadingsProvider } from "@/contexts/ReadingsContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect } from "react";
import LoadingOverlay from "./components/LoadingOverlay";
import VideoBackground from "@/components/VideoBackground";
import SubscriptionGateModal from "@/components/SubscriptionGateModal";
import ServiceGateRoute from "@/components/ServiceGateRoute";

import Index from "./pages/Index";
import PalmAnalysis from "./pages/PalmAnalysis";
import Numerology from "./pages/Numerology";
import AstrologyReading from "./pages/AstrologyReading";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import VideoBackgroundDemo from "./pages/VideoBackgroundDemo";
import KidsBoxPortal from "./pages/KidsBoxPortal";
import VideoTest from "./pages/VideoTest";
import Checkout from "./pages/Checkout";
import MyAccount from "./pages/MyAccount";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppRoutes() {
  const { setUserFromSubscription } = useAuth();

  return (
    <SubscriptionProvider onUserActivated={setUserFromSubscription}>
      <SubscriptionGateModal />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/palm-analysis"
          element={
            <ServiceGateRoute>
              <PalmAnalysis />
            </ServiceGateRoute>
          }
        />
        <Route
          path="/numerology"
          element={
            <ServiceGateRoute>
              <Numerology />
            </ServiceGateRoute>
          }
        />
        <Route
          path="/astrology"
          element={
            <ServiceGateRoute>
              <AstrologyReading />
            </ServiceGateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ServiceGateRoute>
              <Dashboard />
            </ServiceGateRoute>
          }
        />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-account" element={<MyAccount />} />
        <Route path="/video-demo" element={<VideoBackgroundDemo />} />
        <Route path="/kids-portal" element={<KidsBoxPortal />} />
        <Route path="/video-test" element={<VideoTest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SubscriptionProvider>
  );
}

const queryClient = new QueryClient();

const App = () => (
  <>
    <VideoBackground src="https://vz-8af39f0e-519.b-cdn.net/5c0c8c84-eb47-47c4-bcb5-484792933da7/play_480p.mp4" overlay={true} />
    <LoadingOverlay />
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <ReadingsProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <AppRoutes />
                </BrowserRouter>
              </TooltipProvider>
            </ReadingsProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </>
);

export default App;
