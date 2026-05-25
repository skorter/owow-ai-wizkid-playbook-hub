"use client";

import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./WizKidAssistantWidget.module.css";
import { Send } from "lucide-react";
import { aiSearch, type AISource } from "@/lib/api/ai";
import {
  getDisplayFirstName,
  usePlaybookSession,
} from "@/lib/hooks/usePlaybookSession";

const SUGGESTED_PROMPTS = [
  "How do I request holiday leave?",
  "How can I grow in the company?",
  "Where can I find tools and workflows?",
  "What should I read as a new employee?",
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

export default function WizKidAssistantWidget() {
  const user = usePlaybookSession();
  const firstName = getDisplayFirstName(user);

  const [open, setOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AssistantMessage[]>(() => [
    {
      id: "welcome",
      role: "assistant",
      text: `Hey ${firstName} 👋 I can help you find playbook info, onboarding steps, topics, or policies.`,
    },
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

  const submitMessage = useCallback(async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setDraft("");
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: trimmed },
    ]);
    setLoading(true);

    try {
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
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: ERROR_MESSAGE,
          isError: true,
          questionForSearch: trimmed,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void submitMessage(draft);
  };

  return (
    <div className={styles.root}>
      {open ? (
        <div className={styles.panel} role="dialog" aria-label="WizKid Assistant">
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>WizKid Assistant</h2>
            <p className={styles.panelSubtitle}>
              Ask me anything about the Playbook.
            </p>
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
                {message.role === "assistant" && message.questionForSearch ? (
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
              {SUGGESTED_PROMPTS.map((prompt) => (
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
              placeholder="Ask a question…"
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
