import { graphql } from "@/graphql";
import type {
  CreatePatientInput,
  CreatePatientMutation,
  CreateStaffInput,
  CreateStaffMutation,
  CreateTreatmentSessionInput,
  CreateTreatmentSessionMutation,
  CreateTreatmentSessionReportInput,
  CreateTreatmentSessionReportMutation,
  CreateUserInput,
  CreateUserMutation,
} from "@/graphql/graphql";
import { execute } from "@/graphql/execute";

const createPatientMutation = graphql(`
  mutation CreatePatient($input: CreatePatientInput!) {
    createPatient(input: $input) {
      id
    }
  }
`);

const createUserMutation = graphql(`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
    }
  }
`);

const createStaffMutation = graphql(`
  mutation CreateStaff($input: CreateStaffInput!) {
    createStaff(input: $input) {
      id
    }
  }
`);

const createTreatmentSessionMutation = graphql(`
  mutation CreateTreatmentSession($input: CreateTreatmentSessionInput!) {
    createTreatmentSession(input: $input) {
      id
    }
  }
`);

const createTreatmentSessionReportMutation = graphql(`
  mutation CreateTreatmentSessionReport($input: CreateTreatmentSessionReportInput!) {
    createTreatmentSessionReport(input: $input) {
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

export async function createPatient(input: CreatePatientInput) {
  const json = (await execute(createPatientMutation, { input })) as {
    data?: CreatePatientMutation;
    errors?: readonly { message?: string }[];
  };
  return assertMutationResult(json, "Failed to create patient").createPatient;
}

export async function createUser(input: CreateUserInput) {
  const json = (await execute(createUserMutation, { input })) as {
    data?: CreateUserMutation;
    errors?: readonly { message?: string }[];
  };
  return assertMutationResult(json, "Failed to create user").createUser;
}

export async function createStaff(input: CreateStaffInput) {
  const json = (await execute(createStaffMutation, { input })) as {
    data?: CreateStaffMutation;
    errors?: readonly { message?: string }[];
  };
  return assertMutationResult(json, "Failed to create staff").createStaff;
}

export async function createTreatmentSession(input: CreateTreatmentSessionInput) {
  const json = (await execute(createTreatmentSessionMutation, { input })) as {
    data?: CreateTreatmentSessionMutation;
    errors?: readonly { message?: string }[];
  };
  return assertMutationResult(json, "Failed to create session").createTreatmentSession;
}

export async function createTreatmentSessionReport(input: CreateTreatmentSessionReportInput) {
  const json = (await execute(createTreatmentSessionReportMutation, { input })) as {
    data?: CreateTreatmentSessionReportMutation;
    errors?: readonly { message?: string }[];
  };
  return assertMutationResult(json, "Failed to create report").createTreatmentSessionReport;
}
