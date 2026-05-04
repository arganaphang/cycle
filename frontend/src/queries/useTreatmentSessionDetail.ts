import { graphql } from "@/graphql";
import type {
  TreatmentSessionDetailQuery,
  TreatmentSessionDetailQueryVariables,
} from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { useQuery } from "@tanstack/react-query";

export const queryTreatmentSessionDetail = graphql(`
  query TreatmentSessionDetail($id: UUID!) {
    treatmentSession(id: $id) {
      id
      session_no
      session_date
      status
      note
      created_at
      updated_at
      patient {
        id
        full_name
        medical_record_no
        date_of_birth
        gender
        phone
        email
        address
      }
      staff {
        id
        full_name
        specialization
        license_no
        phone
      }
      report {
        id
        anamnesis
        mechanism_of_injury
        actual_condition
        examination
        diagnosis
        intervention
        planning_and_education
        created_at
        updated_at
      }
    }
  }
`);

export async function fetchTreatmentSessionDetail(
  variables: TreatmentSessionDetailQueryVariables,
): Promise<TreatmentSessionDetailQuery | null> {
  const json = (await execute(queryTreatmentSessionDetail, variables)) as {
    data?: TreatmentSessionDetailQuery;
    errors?: readonly unknown[];
  };
  if (json.errors?.length) return null;
  return json.data ?? null;
}

export function useTreatmentSessionDetail(id: string | undefined, options?: { enabled?: boolean }) {
  const enabled = (options?.enabled !== false && Boolean(id)) as boolean;
  return useQuery({
    queryKey: ["treatmentSession", id],
    queryFn: () => fetchTreatmentSessionDetail({ id: id! }),
    enabled,
  });
}
