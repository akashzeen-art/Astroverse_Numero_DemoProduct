import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  ChevronLeft,
  Crown,
  Loader2,
  Phone,
  Sparkles,
  Zap,
} from "lucide-react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import {
  isValidIndianMobile,
  normalizeMobile,
  SUBSCRIPTION_PLANS,
  type PlanId,
} from "@/lib/subscription";
import { APP_CONFIG } from "@/lib/config";
import { cn } from "@/lib/utils";

const STEP_LABELS = ["Mobile", "Plan", "Subscribe"] as const;

const SubscriptionGateModal = () => {
  const {
    isModalOpen,
    closeModal,
    modalStep,
    setModalStep,
    subscribe,
    pendingPath,
  } = useSubscription();

  const [mobile, setMobile] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("monthly");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const plan = SUBSCRIPTION_PLANS.find((p) => p.id === selectedPlan)!;

  const resetAndClose = () => {
    setError(null);
    setLoading(false);
    closeModal();
  };

  const handleMobileContinue = () => {
    setError(null);
    if (!isValidIndianMobile(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setModalStep(2);
  };

  const handleSubscribe = async () => {
    setError(null);
    setLoading(true);
    try {
      await subscribe(normalizeMobile(mobile), selectedPlan);
      setMobile("");
      setSelectedPlan("monthly");
    } catch {
      setError("Subscription failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const serviceLabel =
    pendingPath === "/palm-analysis"
      ? "Palm Reading"
      : pendingPath === "/numerology"
        ? "Numerology"
        : pendingPath === "/astrology"
          ? "Astrology"
          : pendingPath === "/dashboard"
            ? "Dashboard"
            : "Cosmic Services";

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => !open && resetAndClose()}>
      <DialogContent className="sm:max-w-md border-purple-500/30 bg-slate-950/95 backdrop-blur-xl text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-amber-400" />
            Unlock {serviceLabel}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Subscribe to access all readings on {APP_CONFIG.NAME}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 py-2">
          {STEP_LABELS.map((label, i) => {
            const step = (i + 1) as 1 | 2 | 3;
            const active = modalStep === step;
            const done = modalStep > step;
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                    done && "bg-green-500/20 text-green-400 border border-green-400/40",
                    active && "bg-purple-500/30 text-purple-200 border border-purple-400/50",
                    !done && !active && "bg-white/5 text-gray-500 border border-white/10",
                  )}
                >
                  {done ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
                <span
                  className={cn(
                    "text-xs hidden sm:inline",
                    active ? "text-purple-300" : "text-gray-500",
                  )}
                >
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <div className="w-6 h-px bg-white/10 hidden sm:block" />
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-400/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        {/* Step 1: Mobile */}
        {modalStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sub-mobile" className="text-gray-300">
                Mobile Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="sub-mobile"
                  type="tel"
                  inputMode="numeric"
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500">
                We&apos;ll use this to identify your subscription. No OTP required in demo mode.
              </p>
            </div>
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:opacity-90"
              onClick={handleMobileContinue}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Plan */}
        {modalStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 text-center">
              +91 {normalizeMobile(mobile).slice(0, 5)}*****
            </p>
            <div className="grid gap-3">
              {SUBSCRIPTION_PLANS.map((p) => {
                const Icon = p.id === "monthly" ? Crown : Zap;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={cn(
                      "relative text-left rounded-xl border-2 p-4 transition-all",
                      selectedPlan === p.id
                        ? "border-purple-400 bg-purple-500/15 scale-[1.01]"
                        : "border-white/10 bg-white/5 hover:border-white/20",
                    )}
                  >
                    {p.highlight && (
                      <Badge className="absolute -top-2.5 right-3 bg-amber-500 text-black border-0 text-[10px]">
                        Best Value
                      </Badge>
                    )}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                          <Icon className="h-5 w-5 text-purple-300" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{p.name}</p>
                          <p className="text-xs text-gray-400">
                            {p.features.slice(0, 2).join(" · ")}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">₹{p.price}</p>
                        <p className="text-xs text-gray-500">/{p.period}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-white/10 text-gray-300"
                onClick={() => setModalStep(1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600"
                onClick={() => setModalStep(3)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Subscribe */}
        {modalStep === 3 && (
          <div className="space-y-4">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Mobile</span>
                <span>+91 {normalizeMobile(mobile)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Plan</span>
                <span>{plan.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Duration</span>
                <span>{plan.durationDays} days</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-amber-400">₹{plan.price}</span>
              </div>
            </div>
            <ul className="space-y-1.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-white/10 text-gray-300"
                onClick={() => setModalStep(2)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:opacity-90 text-black font-semibold"
                onClick={handleSubscribe}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...
                  </>
                ) : (
                  "Subscribe & Get Access"
                )}
              </Button>
            </div>
            <p className="text-[10px] text-center text-gray-600">
              Demo mode — payment simulated. Full access granted instantly.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionGateModal;
