import { graphql } from "@/graphql";
import type { TreatmentSessionsQuery, TreatmentSessionsQueryVariables } from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { useQuery } from "@tanstack/react-query";

const queryTreatmentSessions = graphql(`
  query TreatmentSessions($limit: Int, $offset: Int, $filter: SessionFilter) {
    treatmentSessions(limit: $limit, offset: $offset, filter: $filter) {
      nodes {
        id
        session_no
        session_date
        status
        created_at
        updated_at
        patient {
          id
          full_name
        }
        staff {
          id
          full_name
        }
      }
      total_count
    }
  }
`);

/** Loader-safe fetch (no React). Returns `TreatmentSessions` or null if unauthenticated / GraphQL errors. */
export async function fetchTreatmentSessions(
  variables: TreatmentSessionsQueryVariables,
): Promise<TreatmentSessionsQuery | null> {
  const json = (await execute(queryTreatmentSessions, variables)) as {
    data?: TreatmentSessionsQuery;
    errors?: readonly unknown[];
  };
  if (json.errors?.length) return null;
  return json.data ?? null;
}

export function useTreatmentSessions(variables: TreatmentSessionsQueryVariables) {
  return useQuery({
    queryKey: ["treatmentSessions", variables],
    queryFn: () => fetchTreatmentSessions(variables),
    placeholderData: (previousData) => previousData,
  });
}
