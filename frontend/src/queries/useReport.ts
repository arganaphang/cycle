import { graphql } from "@/graphql";
import type {
  TreatmentSessionReportsQuery,
  TreatmentSessionReportsQueryVariables,
} from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { useQuery } from "@tanstack/react-query";

const queryTreatmentSessionReports = graphql(`
  query TreatmentSessionReports(
    $limit: Int
    $offset: Int
    $filter: ReportFilter
    $sortBy: TreatmentSessionReportSortField
    $sortOrder: SortOrder
  ) {
    treatmentSessionReports(
      limit: $limit
      offset: $offset
      filter: $filter
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      nodes {
        id
        diagnosis
        created_at
        updated_at
        session_id
        treatment_session {
          id
          session_no
          session_date
          patient {
            id
            full_name
          }
        }
      }
      total_count
    }
  }
`);

/** Loader-safe fetch (no React). Returns `TreatmentSessionReports` or null if unauthenticated / GraphQL errors. */
export async function fetchTreatmentSessionReports(
  variables: TreatmentSessionReportsQueryVariables,
): Promise<TreatmentSessionReportsQuery | null> {
  const json = (await execute(queryTreatmentSessionReports, variables)) as {
    data?: TreatmentSessionReportsQuery;
    errors?: readonly unknown[];
  };
  if (json.errors?.length) return null;
  return json.data ?? null;
}

export function useTreatmentSessionReports(variables: TreatmentSessionReportsQueryVariables) {
  return useQuery({
    queryKey: ["treatmentSessionReports", variables],
    queryFn: () => fetchTreatmentSessionReports(variables),
    placeholderData: (previousData) => previousData,
  });
}
