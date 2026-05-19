export const endpoints = {
  health: "/api/health",

  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    me: "/api/auth/me",
  },

  articles: {
    list: "/api/articles",
    byId: (id: string) => `/api/articles/${encodeURIComponent(id)}`,
    bySlug: (slug: string) => `/api/articles/slug/${encodeURIComponent(slug)}`,
  },

  categories: {
    list: "/api/categories",
    byId: (id: string) => `/api/categories/${encodeURIComponent(id)}`,
  },

  feedback: {
    list: "/api/feedback",
    byId: (id: string) => `/api/feedback/${encodeURIComponent(id)}`,
  },

  missingInfo: {
    list: "/api/missing-info",
    byId: (id: string) => `/api/missing-info/${encodeURIComponent(id)}`,
  },

  analytics: {
    overview: "/api/analytics/overview",
    searches: "/api/analytics/searches",
    popularQuestions: "/api/analytics/popular-questions",
    feedback: "/api/analytics/feedback",
    missingInfo: "/api/analytics/missing-info",
  },

  onboarding: {
    list: "/api/onboarding",
    byId: (id: string) => `/api/onboarding/${encodeURIComponent(id)}`,
  },

  ai: {
    root: "/api/ai",
  },
} as const;
