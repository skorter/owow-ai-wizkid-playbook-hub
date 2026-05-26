"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AdminPageContainer,
  AdminPanelCard,
  AdminStatusBadge,
  AdminButton,
} from "@/components/admin";
import {
  fetchMissingInfoRequests,
  type AdminMissingInfoRequest,
} from "@/lib/mappers/missingInfo";
import { ApiError } from "@/lib/api";
import type { AdminBadgeColor } from "@/components/admin/AdminStatusBadge/AdminStatusBadge";
import { Inbox, RefreshCw, TrendingUp } from "lucide-react";
import PremiumEmptyState from "@/components/admin/PremiumEmptyState/PremiumEmptyState";
import styles from "./page.module.css";

type LoadState = "loading" | "error" | "ready";

function typeBadgeColor(type: string): AdminBadgeColor {
  const normalized = type.toLowerCase();
  if (normalized.includes("missing")) return "orange";
  if (normalized.includes("incorrect") || normalized.includes("wrong")) return "red";
  if (normalized.includes("outdated")) return "yellow";
  return "gray";
}

function statusBadgeColor(status: AdminMissingInfoRequest["status"]): AdminBadgeColor {
  if (status === "Open") return "orange";
  if (status === "Reviewed") return "yellow";
  return "green";
}

export default function MissingInfoPage() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [requests, setRequests] = useState<AdminMissingInfoRequest[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const loadRequests = useCallback(async () => {
    const data = await fetchMissingInfoRequests();
    setRequests(data);
    setLoadState("ready");
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialRequests() {
      try {
        await loadRequests();
        if (cancelled) return;
      } catch (err) {
        if (cancelled) return;
        setRequests([]);
        setLoadState("error");
        setErrorMessage(
          err instanceof ApiError
            ? err.message
            : "Could not load missing information requests.",
        );
      }
    }

    void loadInitialRequests();

    return () => {
      cancelled = true;
    };
  }, [loadRequests]);

  const handleRetry = async () => {
    setLoadState("loading");
    setErrorMessage("");

    try {
      await loadRequests();
    } catch (err) {
      setRequests([]);
      setLoadState("error");
      setErrorMessage(
        err instanceof ApiError
          ? err.message
          : "Could not load missing information requests.",
      );
    }
  };

  const openCount = useMemo(
    () => requests.filter((request) => request.status === "Open").length,
    [requests],
  );

  return (
    <AdminPageContainer
      title="Missing Information Requests"
      subtitle="Employee requests from search, topics, and articles when playbook information is missing or unclear."
      actions={
        <Link href="/admin/dashboard">
          <AdminButton variant="secondary" size="sm">
            Back to Dashboard
          </AdminButton>
        </Link>
      }
    >
      {loadState === "loading" ? (
        <p className={styles.statusMessage}>Loading requests…</p>
      ) : null}

      {loadState === "error" ? (
        <div className={styles.errorBlock}>
          <p className={styles.errorText}>{errorMessage}</p>
          <AdminButton
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            onClick={() => void handleRetry()}
          >
            Retry
          </AdminButton>
        </div>
      ) : null}

      {loadState === "ready" ? (
        <AdminPanelCard
          title="All requests"
          badge={
            openCount > 0 ? (
              <span className={styles.pendingBadge}>{openCount} open</span>
            ) : undefined
          }
        >
          {requests.length === 0 ? (
            <PremiumEmptyState
              compact
              icon={Inbox}
              title="No missing-info requests"
              description="When employees report missing or outdated playbook information, those requests will appear here."
            />
          ) : (
            <ul className={styles.requestList}>
              {requests.map((request) => (
                <li key={request.id} className={styles.requestCard}>
                  <div className={styles.requestTop}>
                    <h2 className={styles.requestTitle}>{request.title}</h2>
                    <span className={styles.requestStat}>
                      <TrendingUp className={styles.requestTrendIcon} aria-hidden />
                      {request.requestCount}
                    </span>
                  </div>

                  <div className={styles.requestMeta}>
                    <AdminStatusBadge color={typeBadgeColor(request.type)}>
                      {request.type}
                    </AdminStatusBadge>
                    <span className={styles.metaDot}>·</span>
                    <AdminStatusBadge color={statusBadgeColor(request.status)}>
                      {request.status}
                    </AdminStatusBadge>
                    <span className={styles.metaDot}>·</span>
                    <span className={styles.metaText}>{request.lastRequested}</span>
                  </div>

                  {request.linkedArticle ? (
                    <p className={styles.linkedArticle}>
                      Linked article: {request.linkedArticle}
                    </p>
                  ) : null}

                  <Link href="/admin/documents?action=create">
                    <AdminButton
                      variant="primary"
                      size="sm"
                      className={styles.createButton}
                    >
                      Create Article
                    </AdminButton>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AdminPanelCard>
      ) : null}
    </AdminPageContainer>
  );
}
