"use client";
import Link from "next/link";
import styles from "./DetailedAnswer.module.css";
import {
  detailedAnswer,
  sourceDocuments,
  relatedQuestions,
} from "@/lib/data/search";

import {
  ArrowRight,
  ExternalLink,
  CornerRightDown,
  MoveRight,
} from "lucide-react";

type DetailedAnswerProps = {
  extendedOpen: boolean;
  setExtendedOpen: (open: boolean) => void;
};

export default function DetailedAnswer({
  extendedOpen,
  setExtendedOpen,
}: DetailedAnswerProps) {
  return (
    <div className={styles.details}>
      <button
        className={styles.extendButton}
        onClick={() => setExtendedOpen(!extendedOpen)}
      >
        <p className={styles.label}>Detailed Information</p>
        {extendedOpen ? (
          <CornerRightDown className={styles.icon} />
        ) : (
          <MoveRight className={styles.icon} />
        )}
      </button>
      {extendedOpen && (
        <div className={styles.content}>
          <div className={styles.longAnswer}>
            <h2 className={styles.title}>{detailedAnswer.title}</h2>
            <div className={styles.steps}>
              <p className={styles.description}>{detailedAnswer.description}</p>
              <ul className={styles.list}>
                {detailedAnswer.steps.map((step, index) => (
                  <li key={index} className={styles.item}>
                    {step}
                  </li>
                ))}
              </ul>
              <p className={styles.note}>{detailedAnswer.note}</p>
            </div>
          </div>
          <div className={styles.sources}>
            <h2 className={styles.title}>Source Documents</h2>
            <ul className={styles.list}>
              {sourceDocuments.map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/playbook/${doc.slug}`}
                    className={styles.result}
                  >
                    <div className={styles.badge}>{doc.badge}</div>
                    <h3 className={styles.title}>{doc.title}</h3>
                    <p className={styles.section}>Section: {doc.section}</p>
                    <ExternalLink className={styles.icon} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.related}>
            <h2 className={styles.title}>Related Questions</h2>
            <ul className={styles.list}>
              {relatedQuestions.map((question) => (
                <li key={question} className={styles.item}>
                  <span>{question}</span>
                  <ArrowRight className={styles.icon} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
