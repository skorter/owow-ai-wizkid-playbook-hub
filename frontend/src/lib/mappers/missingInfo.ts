import { apiDelete, apiGet, apiPost, apiPut, endpoints } from "@/lib/api";
import { ApiError } from "@/lib/api";
import { unwrapListData } from "@/lib/api/unwrap";
import type { MissingInfoRequest, MissingRequestStatus } from "@/data/adminMockData";

export type BackendMissingStatus = "OPEN" | "REVIEWED" | "RESOLVED";

export type ApiMissingInfoReport = {
  id: string;
  type: string;
  title: string | null;
  description: string;
  status: BackendMissingStatus;
  articleId: string | null;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
  article?: { id: string; title: string; slug: string } | null;
  user?: { id: string; name: string | null; email: string; role: string } | null;
};

export type AdminMissingInfoRequest = MissingInfoRequest & {
  reportIds: string[];
};

const MISSING_TYPE_LABELS: Record<string, string> = {
  MISSING_ARTICLE: "Missing article",
  OUTDATED_INFORMATION: "Outdated info",
  INCORRECT_INFORMATION: "Incorrect info",
  OUTDATED_INFO: "Outdated info",
  WRONG_INFO: "Wrong info",
  OTHER: "Other",
};

function formatMissingType(type: string): string {
  return MISSING_TYPE_LABELS[type] ?? type.replace(/_/g, " ").toLowerCase();
}

function formatTimeAgo(isoDate: string): string {
  const then = new Date(isoDate).getTime();
  if (Number.isNaN(then)) return "Recently";

  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 8) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function apiStatusToUiStatus(status: BackendMissingStatus): MissingRequestStatus {
  if (status === "REVIEWED") return "Reviewed";
  if (status === "RESOLVED") return "Resolved";
  return "Open";
}

export function uiStatusToApiStatus(status: MissingRequestStatus): BackendMissingStatus {
  if (status === "Reviewed") return "REVIEWED";
  if (status === "Resolved") return "RESOLVED";
  return "OPEN";
}

function groupStatus(reports: ApiMissingInfoReport[]): MissingRequestStatus {
  if (reports.some((report) => report.status === "OPEN")) return "Open";
  if (reports.some((report) => report.status === "REVIEWED")) return "Reviewed";
  return "Resolved";
}

function aggregationKey(report: ApiMissingInfoReport): string {
  const titleKey = (report.title ?? "").trim().toLowerCase() || "untitled";
  return `${report.type}::${titleKey}`;
}

export function aggregateMissingInfoReports(
  reports: ApiMissingInfoReport[],
): AdminMissingInfoRequest[] {
  const groups = new Map<string, ApiMissingInfoReport[]>();

  for (const report of reports) {
    const key = aggregationKey(report);
    const existing = groups.get(key) ?? [];
    existing.push(report);
    groups.set(key, existing);
  }

  const aggregated = Array.from(groups.values())
    .map((group) => {
      const sorted = [...group].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      const latest = sorted[0];

      return {
        row: {
          id: latest.id,
          title: latest.title?.trim() || "Untitled request",
          type: formatMissingType(latest.type),
          status: groupStatus(group),
          requestCount: group.length,
          lastRequested: formatTimeAgo(latest.createdAt),
          linkedArticle: latest.article?.title,
          reportIds: sorted.map((report) => report.id),
        },
        sortAt: latest.createdAt,
      };
    })
    .sort((a, b) => new Date(b.sortAt).getTime() - new Date(a.sortAt).getTime())
    .map((entry) => entry.row);

  return aggregated;
}

export async function fetchMissingInfoRequests(): Promise<AdminMissingInfoRequest[]> {
  const body = await apiGet<unknown>(endpoints.missingInfo.list);
  const reports = unwrapListData<ApiMissingInfoReport>(body);
  return aggregateMissingInfoReports(reports);
}

export async function updateMissingInfoGroupStatus(
  reportIds: string[],
  status: BackendMissingStatus,
): Promise<void> {
  await Promise.all(
    reportIds.map((id) => apiPut<unknown>(endpoints.missingInfo.byId(id), { status })),
  );
}

export async function deleteMissingInfoReport(id: string): Promise<void> {
  await apiDelete<unknown>(endpoints.missingInfo.byId(id));
}

export async function submitMissingInfoReport(input: {
  type: string;
  title: string;
  description: string;
  articleId?: string | null;
}): Promise<void> {
  try {
    await apiPost<unknown>(endpoints.missingInfo.list, {
      type: input.type,
      title: input.title,
      description: input.description,
      articleId: input.articleId ?? null,
    });
  } catch (err) {
    if (err instanceof ApiError) {
      throw new Error(err.message);
    }
    throw err;
  }
}
