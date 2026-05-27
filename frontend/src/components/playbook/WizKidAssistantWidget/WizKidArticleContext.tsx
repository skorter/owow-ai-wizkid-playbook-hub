"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type WizKidArticleContextValue = {
  articleId: string;
  articleSlug: string;
  articleTitle: string;
} | null;

type WizKidArticleContextState = {
  article: WizKidArticleContextValue;
  setArticle: (article: WizKidArticleContextValue) => void;
  clearArticle: () => void;
};

const WizKidArticleContext = createContext<WizKidArticleContextState | null>(null);

export function WizKidArticleProvider({ children }: { children: ReactNode }) {
  const [article, setArticleState] = useState<WizKidArticleContextValue>(null);

  const setArticle = useCallback((value: WizKidArticleContextValue) => {
    setArticleState(value);
  }, []);

  const clearArticle = useCallback(() => {
    setArticleState(null);
  }, []);

  const value = useMemo(
    () => ({ article, setArticle, clearArticle }),
    [article, setArticle, clearArticle],
  );

  return (
    <WizKidArticleContext.Provider value={value}>
      {children}
    </WizKidArticleContext.Provider>
  );
}

export function useWizKidArticle() {
  const context = useContext(WizKidArticleContext);
  if (!context) {
    throw new Error("useWizKidArticle must be used within WizKidArticleProvider");
  }
  return context;
}
