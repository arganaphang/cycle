import { graphql } from "@/graphql";
import type { StaffsQuery, StaffsQueryVariables } from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { useQuery } from "@tanstack/react-query";

const queryStaffs = graphql(`
  query Staffs($limit: Int, $offset: Int, $search: String) {
    staffs(limit: $limit, offset: $offset, search: $search) {
      nodes {
        id
        full_name
        license_no
        phone
        specialization
        created_at
        updated_at
        user {
          email
        }
      }
      total_count
    }
  }
`);

/** Loader-safe fetch (no React). Returns `Staffs` or null if unauthenticated / GraphQL errors. */
export async function fetchStaffs(variables: StaffsQueryVariables): Promise<StaffsQuery | null> {
  const json = (await execute(queryStaffs, variables)) as {
    data?: StaffsQuery;
    errors?: readonly unknown[];
  };
  if (json.errors?.length) return null;
  return json.data ?? null;
}

export function useStaffs(variables: StaffsQueryVariables) {
  return useQuery({
    queryKey: ["staffs", variables],
    queryFn: () => fetchStaffs(variables),
    placeholderData: (previousData) => previousData,
  });
}
