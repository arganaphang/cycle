import { parseAsInteger, parseAsNumberLiteral, parseAsString, useQueryStates } from "nuqs";
import type { PaginationState, Updater } from "@tanstack/react-table";
import { useMemo, useRef, useState } from "react";

import { LIST_ROUTE_PAGE_SIZE_OPTIONS, type ListRoutePageSize } from "@/lib/list-route-search";

function useSyncedSearchDraft(urlQ: string) {
  const [draft, setDraft] = useState(urlQ);
  const prevUrlQ = useRef(urlQ);
  if (urlQ !== prevUrlQ.current) {
    prevUrlQ.current = urlQ;
    setDraft(urlQ);
  }
  return [draft, setDraft] as const;
}

/**
 * URL-backed pagination (`page`, `pageSize`) and debounced search (`q`) via nuqs.
 * `searchDraft` / `onSearchChange` drive the search input; GraphQL uses `querySearch` from the URL.
 */
export function useListRouteTableUrl(options: {
  defaultPageSize: ListRoutePageSize;
  debounceMs?: number;
}) {
  const { defaultPageSize, debounceMs = 300 } = options;

  const pageSizeParser = useMemo(
    () => parseAsNumberLiteral(LIST_ROUTE_PAGE_SIZE_OPTIONS).withDefault(defaultPageSize),
    [defaultPageSize],
  );

  const listQueryParsers = useMemo(
    () => ({
      page: parseAsInteger.withDefault(1),
      pageSize: pageSizeParser,
      q: parseAsString.withDefault(""),
    }),
    [pageSizeParser],
  );

  const [{ page, pageSize, q }, setListState] = useQueryStates(listQueryParsers, {
    history: "replace",
    clearOnDefault: true,
  });

  const searchDebounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [searchDraft, setSearchDraft] = useSyncedSearchDraft(q);

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize,
  };

  function onPaginationChange(updater: Updater<PaginationState>) {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    const pageSizeChanged = next.pageSize !== pageSize;
    void setListState({
      page: pageSizeChanged ? 1 : next.pageIndex + 1,
      pageSize: next.pageSize as ListRoutePageSize,
    });
  }

  function onSearchChange(value: string) {
    setSearchDraft(value);
    window.clearTimeout(searchDebounceTimer.current);
    searchDebounceTimer.current = window.setTimeout(() => {
      const trimmed = value.trim();
      void setListState({ q: trimmed, page: 1 });
    }, debounceMs);
  }

  const trimmed = q.trim();

  return {
    pagination,
    onPaginationChange,
    searchDraft,
    onSearchChange,
    querySearch: trimmed.length > 0 ? trimmed : undefined,
  };
}
