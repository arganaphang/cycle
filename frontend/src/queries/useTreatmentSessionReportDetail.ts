import { graphql } from "@/graphql";
import type {
  TreatmentSessionReportDetailQuery,
  TreatmentSessionReportDetailQueryVariables,
} from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { useQuery } from "@tanstack/react-query";

export const queryTreatmentSessionReportDetail = graphql(`
  query TreatmentSessionReportDetail($id: UUID!) {
    treatmentSessionReport(id: $id) {
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
      treatment_session {
        id
        session_no
        session_date
        status
        note
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
      }
    }
  }
`);

export async function fetchTreatmentSessionReportDetail(
  variables: TreatmentSessionReportDetailQueryVariables,
): Promise<TreatmentSessionReportDetailQuery | null> {
  const json = (await execute(queryTreatmentSessionReportDetail, variables)) as {
    data?: TreatmentSessionReportDetailQuery;
    errors?: readonly unknown[];
  };
  if (json.errors?.length) return null;
  return json.data ?? null;
}

export function useTreatmentSessionReportDetail(
  id: string | undefined,
  options?: { enabled?: boolean },
) {
  const enabled = (options?.enabled !== false && Boolean(id)) as boolean;
  return useQuery({
    queryKey: ["treatmentSessionReport", id],
    queryFn: () => fetchTreatmentSessionReportDetail({ id: id! }),
    enabled,
  });
}
