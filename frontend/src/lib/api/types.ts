export type ApiUserRole = "HR_ADMIN" | "EMPLOYEE" | "NEW_EMPLOYEE";

export type ApiUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: ApiUserRole;
};

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
  count?: number;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export type ApiRequestOptions = {
  query?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
  init?: Omit<RequestInit, "method" | "body" | "headers">;
  headers?: Record<string, string>;
};

export type ApiMutationOptions = ApiRequestOptions & {
  body?: unknown;
};

export type ApiAuthData = {
  user: ApiUser;
  token: string;
};
