export function unwrapListData<T>(body: unknown): T[] {
  if (Array.isArray(body)) return body;
  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    Array.isArray((body as { data: unknown }).data)
  ) {
    return (body as { data: T[] }).data;
  }
  return [];
}

export function unwrapEntityData<T>(body: unknown): T {
  if (
    body &&
    typeof body === "object" &&
    "data" in body &&
    (body as { data: unknown }).data !== undefined
  ) {
    return (body as { data: T }).data;
  }
  return body as T;
}
