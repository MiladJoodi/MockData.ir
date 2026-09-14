import type { QueryParamRow } from "@/components/docs/query-params-table";

/** Shared list controls used by most resource list endpoints. */
export const commonListQueryParams: QueryParamRow[] = [
  {
    param: "page",
    description: "Page number · default 1",
    example: "page=2",
  },
  {
    param: "limit",
    description: "Page size · default 12 · max 50",
    example: "limit=12",
  },
  {
    param: "order",
    description: "asc · desc",
    example: "order=asc",
  },
  {
    param: "lang",
    description: "Pass fa for Persian text · omit for English (default)",
    example: "lang=fa",
  },
  {
    param: "delay",
    description: "Artificial wait in ms · max 5000",
    example: "delay=800",
  },
  {
    param: "status",
    description: "Force error HTTP status · 400–599",
    example: "status=500",
  },
];

/** Resource-specific params first, then shared list controls. */
export function withCommonListParams(
  extras: QueryParamRow[],
): QueryParamRow[] {
  const extrasParams = new Set(extras.map((row) => row.param));
  return [
    ...extras,
    ...commonListQueryParams.filter((row) => !extrasParams.has(row.param)),
  ];
}

/** Mock controls only — for endpoints without pagination (e.g. Auth). */
export const mockControlQueryParams: QueryParamRow[] = [
  {
    param: "lang",
    description: "Pass fa for Persian text · omit for English (default)",
    example: "lang=fa",
  },
  {
    param: "delay",
    description: "Artificial wait in ms · max 5000",
    example: "delay=800",
  },
  {
    param: "status",
    description: "Force error HTTP status · 400–599",
    example: "status=500",
  },
];
