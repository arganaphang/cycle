export const LIST_ROUTE_PAGE_SIZE_OPTIONS = [10, 20, 25, 30, 40, 50] as const;
export type ListRoutePageSize = (typeof LIST_ROUTE_PAGE_SIZE_OPTIONS)[number];
