"use client";
import Link from "next/link";
import styles from "./DetailedAnswer.module.css";
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
          <CornerRightDown className={styles.cornerRightDownIcon} />
        ) : (
          <MoveRight className={styles.moveRightIcon} />
        )}
      </button>
      {extendedOpen && (
        <div className={styles.content}>
          <div className={styles.longAnswer}>
            <h2 className={styles.title}>Time Off Request Process</h2>
            <div className={styles.steps}>
              <p className={styles.description}>
                OWOW uses Simplicate for all time off management. Here's the
                complete process:
              </p>
              <ul className={styles.list}>
                <li className={styles.item}>
                  Log into Simplicate with your OWOW credentials
                </li>
                <li className={styles.item}>
                  Navigate to HR → Time Off Requests
                </li>
                <li className={styles.item}>
                  Click "New Request" and select your dates
                </li>
                <li className={styles.item}>
                  Choose the type: Vacation, Sick Leave, or Personal Day
                </li>
                <li className={styles.item}>
                  Add optional notes for your manager
                </li>
                <li className={styles.item}> Submit and wait for approval</li>
              </ul>
              <p className={styles.note}>
                Note: Time off requests should be submitted at least 2 weeks in
                advance for planned vacations. Emergency or sick leave can be
                submitted retroactively.
              </p>
            </div>
          </div>
          <div className={styles.sources}>
            <h2 className={styles.title}>Source Documents</h2>
            <ul className={styles.list}>
              <li>
                <Link
                  href="/playbook/time-off-policy"
                  className={styles.result}
                >
                  <div className={styles.badge}>HR</div>
                  <h3 className={styles.title}>Time Off Policy</h3>
                  <p className={styles.section}>Section: Request Process</p>
                  <ExternalLink className={styles.externalLinkIcon} />
                </Link>
              </li>
              <li>
                <Link
                  href="/playbook/simplicate-time-off-guide"
                  className={styles.result}
                >
                  <div className={styles.badge}>Tools</div>
                  <h3 className={styles.title}>Simplicate Time Off Guide</h3>
                  <p className={styles.section}>Section: Time Management</p>
                  <ExternalLink className={styles.externalLinkIcon} />
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.related}>
            <h2 className={styles.title}>Related Questions</h2>
            <ul className={styles.list}>
              {[
                "How do I request time off?",
                "What tools do I need access to?",
                "How does the performance review process work?",
                "What are the working hours?",
              ].map((question) => (
                <li key={question} className={styles.item}>
                  <span>{question}</span>
                  <ArrowRight className={styles.arrowRightIcon} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
