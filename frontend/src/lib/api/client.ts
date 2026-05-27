import { ApiError, type ApiRequestOptions, type ApiMutationOptions, type ApiResponse } from "./types";

const LOCAL_API_BASE_URL = "http://localhost:5001";

export const AUTH_TOKEN_STORAGE_KEY = "authToken";

export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (raw && raw.length > 0) {
    return raw.replace(/\/+$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    const message =
      "NEXT_PUBLIC_API_URL is not set. Add it in Vercel project settings and redeploy.";
    console.error(`[OWOW Playbook] ${message}`);
    throw new Error(message);
  }

  return LOCAL_API_BASE_URL.replace(/\/+$/, "");
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  }
}

function buildUrl(path: string, query?: ApiRequestOptions["query"]): string {
  const base = getApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${base}${normalizedPath}`);

  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null) continue;
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

function mergeHeaders(
  options: ApiRequestOptions | ApiMutationOptions,
  hasJsonBody: boolean,
): Headers {
  const headers = new Headers(options.headers);

  if (hasJsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  if (!options.skipAuth) {
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return headers;
}

export async function parseJsonSafe(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text.trim()) return null;

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError(
      "Server returned a non-JSON response",
      response.status,
      text.slice(0, 500),
    );
  }
}

function extractErrorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object" && "message" in body) {
    const msg = (body as { message: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return fallback;
}

function isApiErrorResponse(body: unknown): body is { success: false; message: string } {
  return (
    !!body &&
    typeof body === "object" &&
    "success" in body &&
    (body as { success: unknown }).success === false
  );
}

function isApiSuccessResponse<T>(body: unknown): body is ApiResponse<T> & { success: true; data: T } {
  return (
    !!body &&
    typeof body === "object" &&
    "success" in body &&
    (body as { success: unknown }).success === true &&
    "data" in body
  );
}

async function request<T>(
  method: string,
  path: string,
  options: ApiMutationOptions = {},
): Promise<T> {
  const hasBody = options.body !== undefined && options.body !== null;
  const url = buildUrl(path, options.query);
  const headers = mergeHeaders(options, hasBody);

  let response: Response;

  try {
    response = await fetch(url, {
      method,
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
      ...options.init,
    });
  } catch (cause) {
    const message =
      cause instanceof Error ? cause.message : "Network request failed";
    throw new ApiError(message, 0, cause);
  }

  const body = await parseJsonSafe(response);

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(body, response.statusText || `Request failed (${response.status})`),
      response.status,
      body,
    );
  }

  if (isApiErrorResponse(body)) {
    throw new ApiError(body.message, response.status, body);
  }

  if (isApiSuccessResponse<T>(body)) {
    return body.data;
  }

  if (body && typeof body === "object" && "success" in body && (body as { success: unknown }).success === true) {
    return body as T;
  }

  return body as T;
}

export async function apiGet<T>(path: string, options?: ApiRequestOptions): Promise<T> {
  return request<T>("GET", path, options ?? {});
}

export async function apiPost<T>(
  path: string,
  body?: unknown,
  options?: ApiRequestOptions,
): Promise<T> {
  return request<T>("POST", path, { ...options, body });
}

export async function apiPut<T>(
  path: string,
  body?: unknown,
  options?: ApiRequestOptions,
): Promise<T> {
  return request<T>("PUT", path, { ...options, body });
}

export async function apiDelete<T>(path: string, options?: ApiRequestOptions): Promise<T> {
  return request<T>("DELETE", path, options ?? {});
}

export async function apiGetEnvelope<T>(
  path: string,
  options?: ApiRequestOptions,
): Promise<ApiResponse<T>> {
  const url = buildUrl(path, options?.query);
  const headers = mergeHeaders(options ?? {}, false);

  let response: Response;
  try {
    response = await fetch(url, { method: "GET", headers, ...options?.init });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Network request failed";
    throw new ApiError(message, 0, cause);
  }

  const body = await parseJsonSafe(response);

  if (!response.ok) {
    throw new ApiError(
      extractErrorMessage(body, response.statusText || `Request failed (${response.status})`),
      response.status,
      body,
    );
  }

  if (isApiErrorResponse(body)) {
    throw new ApiError(body.message, response.status, body);
  }

  return body as ApiResponse<T>;
}
