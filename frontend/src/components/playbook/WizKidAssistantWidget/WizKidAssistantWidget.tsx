"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./WizKidAssistantWidget.module.css";
import { Send, X } from "lucide-react";
import {
  aiSearch,
  askPageAI,
  getAskPageAIErrorMessage,
  getAISearchErrorMessage,
  type AISource,
} from "@/lib/api/ai";
import {
  getDisplayFirstName,
  usePlaybookSession,
} from "@/lib/hooks/usePlaybookSession";
import {
  useWizKidArticle,
  type WizKidArticleContextValue,
} from "./WizKidArticleContext";

const GENERAL_PROMPTS = [
  "How do I request holiday leave?",
  "How can I grow in the company?",
  "Where can I find tools and workflows?",
  "What should I read as a new employee?",
];

const ARTICLE_PROMPTS = [
  "Summarize this article",
  "What should I remember from this?",
  "What actions do I need to take?",
  "Explain this in simple words",
];

const ERROR_MESSAGE =
  "I could not find an answer right now. Try AI Search or request missing info.";

type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: AISource[];
  isError?: boolean;
  questionForSearch?: string;
};

function buildWelcomeMessage(
  firstName: string,
  articleTitle: string | null,
): AssistantMessage {
  if (articleTitle) {
    return {
      id: "welcome",
      role: "assistant",
      text: `Hey ${firstName} 👋 I can help you understand this article: ${articleTitle}. Ask me anything about it.`,
    };
  }

  return {
    id: "welcome",
    role: "assistant",
    text: `Hey ${firstName} 👋 I can help you find playbook info, onboarding steps, topics, or policies.`,
  };
}

type WizKidAssistantWidgetInnerProps = {
  firstName: string;
  article: WizKidArticleContextValue;
};

function WizKidAssistantWidgetInner({
  firstName,
  article,
}: WizKidAssistantWidgetInnerProps) {
  const articleTitle = article?.articleTitle ?? null;
  const isArticleMode = Boolean(article?.articleId && article.articleSlug);

  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(() => [
    buildWelcomeMessage(firstName, articleTitle),
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, open]);

  const submitMessage = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed || loading) return;

      setDraft("");
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "user", text: trimmed },
      ]);
      setLoading(true);

      try {
        if (isArticleMode && article) {
          const data = await askPageAI({
            question: trimmed,
            slug: article.articleSlug,
            articleId: article.articleId,
          });
          const sources: AISource[] = data.source
            ? [
                {
                  id: data.source.id,
                  title: data.source.title,
                  slug: data.source.slug,
                  summary: data.source.summary,
                  category: data.source.category,
                },
              ]
            : [];

          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              text: data.answer,
              sources,
            },
          ]);
        } else {
          const data = await aiSearch(trimmed);
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              role: "assistant",
              text: data.answer,
              sources: data.sources,
              questionForSearch: trimmed,
            },
          ]);
        }
      } catch (err) {
        const message = isArticleMode
          ? getAskPageAIErrorMessage(err)
          : getAISearchErrorMessage(err);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            text: message || ERROR_MESSAGE,
            isError: true,
            questionForSearch: isArticleMode ? undefined : trimmed,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [article, isArticleMode, loading],
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submitMessage(draft);
  };

  const suggestedPrompts = isArticleMode ? ARTICLE_PROMPTS : GENERAL_PROMPTS;

  return (
    <div className={styles.root}>
      {open ? (
        <div className={styles.panel} role="dialog" aria-label="WizKid Assistant">
          <div className={styles.panelHeader}>
            <div className={styles.panelHeaderText}>
              <h2 className={styles.panelTitle}>WizKid Assistant</h2>
              <p className={styles.panelSubtitle}>
                {isArticleMode
                  ? "Ask about this article."
                  : "Ask me anything about the Playbook."}
              </p>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              aria-label="Close WizKid Assistant"
              onClick={() => setOpen(false)}
            >
              <X className={styles.closeIcon} aria-hidden />
            </button>
          </div>

          <div className={styles.messages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? styles.messageUser
                    : styles.messageAssistant
                }
              >
                <p
                  className={
                    message.isError ? styles.messageError : undefined
                  }
                  style={{ margin: 0 }}
                >
                  {message.text}
                </p>
                {message.role === "assistant" &&
                message.sources &&
                message.sources.length > 0 ? (
                  <div className={styles.sources}>
                    <span className={styles.sourcesLabel}>Sources:</span>
                    {message.sources.map((source) => (
                      <Link
                        key={source.id}
                        href={`/playbook/${source.slug}`}
                        className={styles.sourceChip}
                      >
                        {source.title}
                      </Link>
                    ))}
                  </div>
                ) : null}
                {!isArticleMode &&
                message.role === "assistant" &&
                message.questionForSearch ? (
                  <Link
                    href={`/playbook/search?q=${encodeURIComponent(message.questionForSearch)}`}
                    className={styles.fullSearchLink}
                  >
                    Open full AI Search
                  </Link>
                ) : null}
              </div>
            ))}
            {loading ? (
              <p className={styles.loadingRow}>Thinking…</p>
            ) : null}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 ? (
            <div className={styles.prompts}>
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className={styles.promptChip}
                  disabled={loading}
                  onClick={() => void submitMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          ) : null}

          <form className={styles.inputRow} onSubmit={handleSubmit}>
            <input
              type="text"
              className={styles.input}
              placeholder={
                isArticleMode ? "Ask about this article…" : "Ask a question…"
              }
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              className={styles.sendButton}
              aria-label="Send message"
              disabled={loading || !draft.trim()}
            >
              <Send className={styles.sendIcon} aria-hidden />
            </button>
          </form>
        </div>
      ) : null}

      {!open && showHint ? (
        <p className={styles.hintBubble}>Need help, Wizkid?</p>
      ) : null}

      <button
        type="button"
        className={`${styles.fab} ${open ? styles.fabOpen : ""}`}
        aria-label={open ? "Close WizKid Assistant" : "Open WizKid Assistant"}
        aria-expanded={open}
        onClick={() => {
          setOpen((value) => !value);
          setShowHint(false);
        }}
      >
        <span aria-hidden>🧙</span>
      </button>
    </div>
  );
}

export default function WizKidAssistantWidget() {
  const user = usePlaybookSession();
  const firstName = getDisplayFirstName(user);
  const { article } = useWizKidArticle();
  const contextKey = article?.articleId ?? "general";

  return (
    <WizKidAssistantWidgetInner
      key={contextKey}
      firstName={firstName}
      article={article}
    />
  );
}
