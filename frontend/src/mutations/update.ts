import { graphql } from "@/graphql";
import type { UpdateStaffInput, UpdateStaffMutation } from "@/graphql/graphql";
import { execute } from "@/graphql/execute";

const updateStaffMutation = graphql(`
  mutation UpdateStaff($id: UUID!, $input: UpdateStaffInput!) {
    updateStaff(id: $id, input: $input) {
      id
    }
  }
`);

function assertMutationResult<TData>(
  json: { data?: TData; errors?: readonly { message?: string }[] },
  fallbackMessage: string,
): TData {
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message ?? "Error").join(", "));
  }
  if (!json.data) throw new Error(fallbackMessage);
  return json.data;
}

export async function updateStaff(id: string, input: UpdateStaffInput) {
  const json = (await execute(updateStaffMutation, { id, input })) as {
    data?: UpdateStaffMutation;
    errors?: readonly { message?: string }[];
  };
  return assertMutationResult(json, "Failed to update staff").updateStaff;
}
