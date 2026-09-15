import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  createSubscription,
  hasActiveSubscription,
  isGatedPath,
  loadSubscription,
  type PlanId,
  type Subscription,
} from "@/lib/subscription";
import { STORAGE_KEYS } from "@/lib/config";
import type { User } from "@/lib/apiService";

interface SubscriptionContextType {
  subscription: Subscription | null;
  hasAccess: boolean;
  isModalOpen: boolean;
  pendingPath: string | null;
  modalStep: 1 | 2 | 3;
  requestService: (path: string) => void;
  openSubscribeModal: (path?: string) => void;
  closeModal: () => void;
  setModalStep: (step: 1 | 2 | 3) => void;
  subscribe: (mobile: string, planId: PlanId) => Promise<boolean>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
  undefined,
);

export const useSubscription = (): SubscriptionContextType => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error("useSubscription must be used within SubscriptionProvider");
  }
  return ctx;
};

function buildUserFromSubscription(sub: Subscription): User {
  const masked = `+91 ${sub.mobile.slice(0, 5)}*****`;
  return {
    id: `user_${sub.mobile}`,
    email: `${sub.mobile}@subscriber.local`,
    username: `user_${sub.mobile}`,
    first_name: "Subscriber",
    last_name: "",
    phone_number: masked,
    timezone: "Asia/Kolkata",
    current_plan: sub.planId,
    subscription_status: "active",
    subscription_start: sub.subscribedAt,
    subscription_end: sub.expiresAt,
    total_readings: 0,
    accuracy_score: 94,
    member_since: sub.subscribedAt,
    email_notifications: true,
    daily_horoscope: true,
    marketing_emails: false,
    profile_visibility: "private",
    is_premium: true,
    readings_this_month: 0,
    date_joined: sub.subscribedAt,
  };
}

interface SubscriptionProviderProps {
  children: React.ReactNode;
  onUserActivated?: (user: User) => void;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({
  children,
  onUserActivated,
}) => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(() =>
    loadSubscription(),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);

  const hasAccess = useMemo(
    () => hasActiveSubscription(),
    [subscription],
  );

  useEffect(() => {
    const onStorage = () => setSubscription(loadSubscription());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const openSubscribeModal = useCallback((path?: string) => {
    if (path) setPendingPath(path);
    setModalStep(1);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setModalStep(1);
    if (!hasActiveSubscription()) {
      setPendingPath(null);
    }
  }, []);

  const requestService = useCallback(
    (path: string) => {
      if (!isGatedPath(path)) {
        navigate(path);
        return;
      }
      if (hasActiveSubscription()) {
        navigate(path);
        return;
      }
      setPendingPath(path);
      setModalStep(1);
      setIsModalOpen(true);
    },
    [navigate],
  );

  const subscribe = useCallback(
    async (mobile: string, planId: PlanId): Promise<boolean> => {
      await new Promise((r) => setTimeout(r, 800));
      const sub = createSubscription(mobile, planId);
      setSubscription(sub);

      const user = buildUserFromSubscription(sub);
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, `standalone_${sub.mobile}`);
      localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
      onUserActivated?.(user);

      window.dispatchEvent(
        new CustomEvent("subscription-activated", { detail: sub }),
      );

      setIsModalOpen(false);
      setModalStep(1);

      const target = pendingPath || "/dashboard";
      setPendingPath(null);
      navigate(target);
      return true;
    },
    [navigate, onUserActivated, pendingPath],
  );

  const value: SubscriptionContextType = {
    subscription,
    hasAccess,
    isModalOpen,
    pendingPath,
    modalStep,
    requestService,
    openSubscribeModal,
    closeModal,
    setModalStep,
    subscribe,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionProvider;
