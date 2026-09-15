import { ReactNode, useEffect } from "react";
import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { useLocation } from "react-router-dom";

interface ServiceGateRouteProps {
  children: ReactNode;
}

const ServiceGateRoute = ({ children }: ServiceGateRouteProps) => {
  const { hasAccess, openSubscribeModal } = useSubscription();
  const location = useLocation();

  useEffect(() => {
    if (!hasAccess) {
      openSubscribeModal(location.pathname);
    }
  }, [hasAccess, location.pathname, openSubscribeModal]);

  if (hasAccess) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-[60vh]">
      <div className="pointer-events-none select-none blur-sm opacity-40">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
        <div className="text-center space-y-4 p-8 max-w-sm mx-4 rounded-2xl border border-purple-500/30 bg-slate-950/90">
          <div className="w-16 h-16 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center border border-purple-400/30">
            <Lock className="w-8 h-8 text-purple-300" />
          </div>
          <h2 className="text-xl font-bold text-white">Subscription Required</h2>
          <p className="text-sm text-gray-400">
            Enter your mobile number and choose a plan to unlock this service.
          </p>
          <Button
            onClick={() => openSubscribeModal(location.pathname)}
            className="bg-gradient-to-r from-purple-500 to-blue-600"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Subscribe Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceGateRoute;
