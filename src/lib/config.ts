declare const __API_BASE_URL__: string;

export const API_CONFIG = {
  BASE_URL: typeof __API_BASE_URL__ !== "undefined" ? __API_BASE_URL__ : "/api/v1",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export const APP_CONFIG = {
  NAME: "Astroverse",
  VERSION: "1.0.0",
  ENVIRONMENT: import.meta.env.MODE,
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
} as const;

export const FEATURES = {
  MOCK_API:
    import.meta.env.VITE_USE_MOCK_API === "true" ||
    import.meta.env.VITE_STANDALONE === "true",
  STANDALONE: import.meta.env.VITE_STANDALONE === "true",
  OPENAI: Boolean(import.meta.env.VITE_OPENAI_API_KEY?.trim()),
  ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  PAYMENTS: import.meta.env.VITE_ENABLE_PAYMENTS === "true",
} as const;

export const OPENAI_CONFIG = {
  API_KEY: import.meta.env.VITE_OPENAI_API_KEY || "",
  MODEL: import.meta.env.VITE_OPENAI_MODEL || "gpt-4o-mini",
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: "palmastro_token",
  REFRESH_TOKEN: "palmastro_refresh_token",
  USER_DATA: "palmastro_user",
  SETTINGS: "palmastro_settings",
  SUBSCRIPTION: "palmastro_subscription",
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: "/auth/signup/",
    LOGIN: "/auth/login/",
    LOGOUT: "/auth/logout/",
    REFRESH: "/auth/refresh/",
    ME: "/auth/me/",
    CHANGE_PASSWORD: "/auth/password/change/",
    RESET_PASSWORD: "/auth/password/reset/",
    DASHBOARD: "/auth/dashboard/",
  },
  READINGS: {
    LIST: "/readings/list/",
    CREATE: "/readings/",
    DETAIL: (id: string) => `/readings/${id}/`,
    PALM_UPLOAD: "/readings/palm/upload/",
    PALM_ANALYZE: "/readings/palm/analyze/",
    PALM_ANALYZE_NEW: "/palm-reading/analyze/",
    ASTROLOGY_CREATE: "/readings/astrology/",
    SAVE_UNIFIED: "/readings/save/",
  },
  PREDICTIONS: { GET: "/predictions/get/" },
  DASHBOARD: { REALTIME: "/auth/dashboard/realtime/" },
  PLANS: { UPGRADE: "/auth/upgrade-plan/" },
  ASTROLOGY: {
    BIRTH_CHART: "/astrology/birth-chart/",
    COMPATIBILITY: "/astrology/compatibility/",
    DAILY_HOROSCOPE: "/astrology/daily-horoscope/",
  },
  SUBSCRIPTIONS: {
    PLANS: "/subscriptions/plans/",
    SUBSCRIBE: "/subscriptions/subscribe/",
    CANCEL: "/subscriptions/cancel/",
    PAYMENT_METHODS: "/subscriptions/payment-methods/",
  },
  ANALYTICS: {
    USER_STATS: "/analytics/user-stats/",
    READINGS_HISTORY: "/analytics/readings-history/",
  },
} as const;

export default API_CONFIG;
