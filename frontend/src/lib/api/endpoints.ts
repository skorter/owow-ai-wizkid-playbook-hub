export const endpoints = {
  health: "/api/health",

  auth: {
    register: "/api/auth/register",
    login: "/api/auth/login",
    me: "/api/auth/me",
    updateMe: "/api/auth/me",
  },

  articles: {
    list: "/api/articles",
    adminAll: "/api/articles/admin/all",
    adminById: (id: string) => `/api/articles/admin/${encodeURIComponent(id)}`,
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
    usageTrends: "/api/analytics/usage-trends",
    peakHours: "/api/analytics/peak-hours",
    unansweredQuestions: "/api/analytics/unanswered-questions",
    performance: "/api/analytics/performance",
    dashboard: "/api/analytics/dashboard",
  },

  onboarding: {
    list: "/api/onboarding",
    byId: (id: string) => `/api/onboarding/${encodeURIComponent(id)}`,
  },

  ai: {
    root: "/api/ai",
    status: "/api/ai/status",
    search: "/api/ai/search",
    askPage: "/api/ai/ask-page",
    recentSearches: "/api/ai/recent-searches",
  },

  profile: {
    activity: "/api/profile/activity",
    insights: "/api/profile/insights",
  },

  savedArticles: {
    list: "/api/saved-articles",
    byArticleId: (articleId: string) =>
      `/api/saved-articles/${encodeURIComponent(articleId)}`,
  },
} as const;
