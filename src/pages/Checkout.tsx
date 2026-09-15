import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap, Crown, Shield } from "lucide-react";

const PLANS = [
  {
    id: "basic",
    name: "Basic Access",
    price: 80,
    features: ["Palm Reading", "Numerology", "Astrology", "Dashboard", "AI Insights"],
    highlight: false,
    icon: Star,
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-400/30",
  },
  {
    id: "premium",
    name: "Premium Access",
    price: 199,
    features: ["Everything in Basic", "Priority Access", "Unlimited Readings", "PDF Reports", "24/7 Support"],
    highlight: true,
    icon: Crown,
    color: "from-purple-500/20 to-pink-500/20",
    border: "border-purple-400/50",
  },
  {
    id: "yearly",
    name: "Annual Access",
    price: 999,
    features: ["Everything in Premium", "12 Months Access", "Exclusive Content", "Advanced Reports", "Best Value"],
    highlight: false,
    icon: Zap,
    color: "from-amber-500/20 to-orange-500/20",
    border: "border-amber-400/30",
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const plan = PLANS.find((p) => p.id === selected)!;

  const handlePayment = async () => {
    setLoading(true);
    // Demo payment - always succeeds after 1.5s
    await new Promise((r) => setTimeout(r, 1500));

    // Store subscription in localStorage
    localStorage.setItem("subscription", JSON.stringify({
      userId: "demo_user_123",
      plan: selected,
      amount: plan.price,
      status: "paid",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }));

    setLoading(false);
    setSuccess(true);

    setTimeout(() => navigate("/"), 2000);
  };

  if (success) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-green-400/50">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Payment Successful!</h2>
            <p className="text-gray-400">Welcome to The Bharat Astro. Redirecting...</p>
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-purple-400/30 border-t-purple-400 rounded-full animate-spin" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-4xl">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-4 border-purple-400/50 text-purple-300 bg-purple-500/10">
              🔱 Get Started
            </Badge>
            <h1 className="text-3xl font-bold text-white mb-3">Choose Your Plan</h1>
            <p className="text-gray-400">Unlock full access to all cosmic insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {PLANS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all duration-200 bg-gradient-to-br ${p.color} ${selected === p.id ? "border-purple-400 scale-[1.02] shadow-xl shadow-purple-500/20" : p.border} hover:scale-[1.01]`}
                >
                  {p.highlight && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white border-0 px-3">
                      Most Popular
                    </Badge>
                  )}
                  <div className="text-center mb-4">
                    <Icon className="w-8 h-8 mx-auto mb-2 text-purple-300" />
                    <h3 className="font-bold text-white">{p.name}</h3>
                    <div className="text-3xl font-bold text-white mt-2">
                      ₹{p.price}
                      <span className="text-sm font-normal text-gray-400">/month</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  {selected === p.id && (
                    <div className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Card className="glass-card border-purple-500/30 max-w-md mx-auto">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-center">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{plan.name}</span>
                <span className="text-white">₹{plan.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">GST (18%)</span>
                <span className="text-white">₹{Math.round(plan.price * 0.18)}</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold">
                <span className="text-white">Total</span>
                <span className="text-white text-lg">₹{Math.round(plan.price * 1.18)}</span>
              </div>

              <Button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 rounded-xl text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing Payment...
                  </span>
                ) : (
                  `Pay ₹${Math.round(plan.price * 1.18)} — Demo`
                )}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
                <Shield className="w-3 h-3" />
                Demo mode — no real payment processed
              </div>
            </CardContent>
          </Card>
      </div>
    </Layout>
  );
};

export default Checkout;
