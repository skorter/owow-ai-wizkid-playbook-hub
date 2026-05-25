import { useMemo } from "react";

export type PaginatedSliceResult<T> = {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
  showPagination: boolean;
};

export function paginateList<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginatedSliceResult<T> {
  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize) || 1);
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    totalPages,
    totalItems,
    showPagination: totalItems > pageSize,
  };
}

export function usePaginatedSlice<T>(
  items: T[],
  page: number,
  pageSize: number,
): PaginatedSliceResult<T> {
  return useMemo(
    () => paginateList(items, page, pageSize),
    [items, page, pageSize],
  );
}
