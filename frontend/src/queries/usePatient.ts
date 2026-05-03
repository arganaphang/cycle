import { graphql } from "@/graphql";
import type { PatientsQuery, PatientsQueryVariables } from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { useQuery } from "@tanstack/react-query";

const queryPatients = graphql(`
  query Patients($limit: Int, $offset: Int, $search: String) {
    patients(limit: $limit, offset: $offset, search: $search) {
      nodes {
        id
        full_name
        medical_record_no
        date_of_birth
        gender
        phone
        email
        address
        created_at
        updated_at
      }
      total_count
    }
  }
`);

/** Loader-safe fetch (no React). Returns `Patients` or null if unauthenticated / GraphQL errors. */
export async function fetchPatients(
  variables: PatientsQueryVariables,
): Promise<PatientsQuery | null> {
  const json = (await execute(queryPatients, variables)) as {
    data?: PatientsQuery;
    errors?: readonly unknown[];
  };
  if (json.errors?.length) return null;
  return json.data ?? null;
}

export function usePatients(variables: PatientsQueryVariables) {
  return useQuery({
    queryKey: ["patients", variables],
    queryFn: () => fetchPatients(variables),
    placeholderData: (previousData) => previousData,
  });
}
