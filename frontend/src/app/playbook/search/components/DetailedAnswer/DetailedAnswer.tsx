"use client";

import Link from "next/link";
import styles from "./DetailedAnswer.module.css";
import type { AISource } from "@/lib/api/ai";
import { CornerRightDown, ExternalLink, MoveRight } from "lucide-react";

type DetailedAnswerProps = {
  sources: AISource[];
  extendedOpen: boolean;
  setExtendedOpen: (open: boolean) => void;
};

export default function DetailedAnswer({
  sources,
  extendedOpen,
  setExtendedOpen,
}: DetailedAnswerProps) {
  return (
    <div className={styles.details}>
      <button
        type="button"
        className={styles.extendButton}
        onClick={() => setExtendedOpen(!extendedOpen)}
      >
        <p className={styles.label}>
          Source documents {sources.length > 0 ? `(${sources.length})` : ""}
        </p>
        {extendedOpen ? (
          <CornerRightDown className={styles.icon} />
        ) : (
          <MoveRight className={styles.icon} />
        )}
      </button>
      {extendedOpen ? (
        <div className={styles.content}>
          <div className={styles.sources}>
            {sources.length === 0 ? (
              <p className={styles.emptySources}>
                No matching playbook articles were found for this question.
              </p>
            ) : (
              <ul className={styles.list}>
                {sources.map((doc) => (
                  <li key={doc.id}>
                    <Link href={`/playbook/${doc.slug}`} className={styles.result}>
                      <div className={styles.badge}>
                        {doc.score != null
                          ? `${Math.round(doc.score * 100)}% match`
                          : "Playbook"}
                      </div>
                      <h3 className={styles.title}>{doc.title}</h3>
                      {doc.category ? (
                        <p className={styles.section}>Category: {doc.category}</p>
                      ) : null}
                      {doc.summary ? (
                        <p className={styles.summary}>{doc.summary}</p>
                      ) : null}
                      <ExternalLink className={styles.icon} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
