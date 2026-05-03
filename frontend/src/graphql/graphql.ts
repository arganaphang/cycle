/* eslint-disable */
/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
import type { DocumentTypeDecoration } from "@graphql-typed-document-node/core";
export type CreatePatientInput = {
  address?: string | null | undefined;
  date_of_birth: string;
  email?: string | null | undefined;
  emergency_contact?: EmergencyContactInput | null | undefined;
  full_name: string;
  gender: Gender;
  phone?: string | null | undefined;
};

export type CreateStaffInput = {
  full_name: string;
  license_no?: string | null | undefined;
  phone?: string | null | undefined;
  specialization?: string | null | undefined;
  user_id: string;
};

export type CreateTreatmentSessionInput = {
  patient_id: string;
  session_date: string;
  staff_id: string;
};

export type CreateTreatmentSessionReportInput = {
  actual_condition?: string | null | undefined;
  anamnesis?: string | null | undefined;
  diagnosis?: string | null | undefined;
  examination?: string | null | undefined;
  intervention?: string | null | undefined;
  mechanism_of_injury?: string | null | undefined;
  planning_and_education?: string | null | undefined;
  session_id: string;
};

export type CreateUserInput = {
  email: string;
  password: string;
  role: UserRole;
};

export type EmergencyContactInput = {
  name: string;
  phone: string;
  relation: string;
};

export type Gender = "FEMALE" | "MALE";

export type LoginInput = {
  email: string;
  password: string;
};

export type ReportFilter = {
  date_from?: string | null | undefined;
  date_to?: string | null | undefined;
  /** Matches patient name, session number, or report text fields. */
  search?: string | null | undefined;
};

export type SessionFilter = {
  date_from?: string | null | undefined;
  date_to?: string | null | undefined;
  patient_id?: string | null | undefined;
  /** Matches patient name, therapist name, or session number. */
  search?: string | null | undefined;
  staff_id?: string | null | undefined;
  status?: SessionStatus | null | undefined;
};

export type SessionStatus = "CANCELLED" | "COMPLETED" | "IN_PROGRESS" | "SCHEDULED";

export type UserRole = "ADMIN" | "RECEPTIONIST" | "THERAPIST";

export type CreatePatientMutationVariables = Exact<{
  input: CreatePatientInput;
}>;

export type CreatePatientMutation = { createPatient: { id: string } };

export type CreateUserMutationVariables = Exact<{
  input: CreateUserInput;
}>;

export type CreateUserMutation = { createUser: { id: string } };

export type CreateStaffMutationVariables = Exact<{
  input: CreateStaffInput;
}>;

export type CreateStaffMutation = { createStaff: { id: string } };

export type CreateTreatmentSessionMutationVariables = Exact<{
  input: CreateTreatmentSessionInput;
}>;

export type CreateTreatmentSessionMutation = { createTreatmentSession: { id: string } };

export type CreateTreatmentSessionReportMutationVariables = Exact<{
  input: CreateTreatmentSessionReportInput;
}>;

export type CreateTreatmentSessionReportMutation = { createTreatmentSessionReport: { id: string } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;

export type LoginMutation = {
  login: { token: string; user: { id: string; email: string; role: UserRole } };
};

export type MeQueryVariables = Exact<{ [key: string]: never }>;

export type MeQuery = { me: { id: string; email: string; role: UserRole } };

export type PatientsQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  search?: string | null | undefined;
}>;

export type PatientsQuery = {
  patients: {
    total_count: number;
    nodes: Array<{
      id: string;
      full_name: string;
      medical_record_no: string;
      date_of_birth: string;
      gender: Gender;
      phone: string | null;
      email: string | null;
      address: string | null;
      created_at: string;
      updated_at: string;
    }>;
  };
};

export type TreatmentSessionReportsQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  filter?: ReportFilter | null | undefined;
}>;

export type TreatmentSessionReportsQuery = {
  treatmentSessionReports: {
    total_count: number;
    nodes: Array<{
      id: string;
      diagnosis: string | null;
      created_at: string;
      updated_at: string;
      session_id: string;
      treatment_session: {
        id: string;
        session_no: number;
        session_date: string;
        patient: { id: string; full_name: string };
      };
    }>;
  };
};

export type TreatmentSessionsQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  filter?: SessionFilter | null | undefined;
}>;

export type TreatmentSessionsQuery = {
  treatmentSessions: {
    total_count: number;
    nodes: Array<{
      id: string;
      session_no: number;
      session_date: string;
      status: SessionStatus;
      created_at: string;
      updated_at: string;
      patient: { id: string; full_name: string };
      staff: { id: string; full_name: string };
    }>;
  };
};

export type StaffsQueryVariables = Exact<{
  limit?: number | null | undefined;
  offset?: number | null | undefined;
  search?: string | null | undefined;
}>;

export type StaffsQuery = {
  staffs: {
    total_count: number;
    nodes: Array<{
      id: string;
      full_name: string;
      license_no: string | null;
      phone: string | null;
      specialization: string | null;
      created_at: string;
      updated_at: string;
      user: { email: string };
    }>;
  };
};

export class TypedDocumentString<TResult, TVariables>
  extends String
  implements DocumentTypeDecoration<TResult, TVariables>
{
  __apiType?: NonNullable<DocumentTypeDecoration<TResult, TVariables>["__apiType"]>;
  private value: string;
  public __meta__?: Record<string, any> | undefined;

  constructor(value: string, __meta__?: Record<string, any> | undefined) {
    super(value);
    this.value = value;
    this.__meta__ = __meta__;
  }

  override toString(): string & DocumentTypeDecoration<TResult, TVariables> {
    return this.value;
  }
}

export const CreatePatientDocument = new TypedDocumentString(`
    mutation CreatePatient($input: CreatePatientInput!) {
  createPatient(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreatePatientMutation, CreatePatientMutationVariables>;
export const CreateUserDocument = new TypedDocumentString(`
    mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateUserMutation, CreateUserMutationVariables>;
export const CreateStaffDocument = new TypedDocumentString(`
    mutation CreateStaff($input: CreateStaffInput!) {
  createStaff(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<CreateStaffMutation, CreateStaffMutationVariables>;
export const CreateTreatmentSessionDocument = new TypedDocumentString(`
    mutation CreateTreatmentSession($input: CreateTreatmentSessionInput!) {
  createTreatmentSession(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
  CreateTreatmentSessionMutation,
  CreateTreatmentSessionMutationVariables
>;
export const CreateTreatmentSessionReportDocument = new TypedDocumentString(`
    mutation CreateTreatmentSessionReport($input: CreateTreatmentSessionReportInput!) {
  createTreatmentSessionReport(input: $input) {
    id
  }
}
    `) as unknown as TypedDocumentString<
  CreateTreatmentSessionReportMutation,
  CreateTreatmentSessionReportMutationVariables
>;
export const LoginDocument = new TypedDocumentString(`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    token
    user {
      id
      email
      role
    }
  }
}
    `) as unknown as TypedDocumentString<LoginMutation, LoginMutationVariables>;
export const MeDocument = new TypedDocumentString(`
    query Me {
  me {
    id
    email
    role
  }
}
    `) as unknown as TypedDocumentString<MeQuery, MeQueryVariables>;
export const PatientsDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<PatientsQuery, PatientsQueryVariables>;
export const TreatmentSessionReportsDocument = new TypedDocumentString(`
    query TreatmentSessionReports($limit: Int, $offset: Int, $filter: ReportFilter) {
  treatmentSessionReports(limit: $limit, offset: $offset, filter: $filter) {
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
    `) as unknown as TypedDocumentString<
  TreatmentSessionReportsQuery,
  TreatmentSessionReportsQueryVariables
>;
export const TreatmentSessionsDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<TreatmentSessionsQuery, TreatmentSessionsQueryVariables>;
export const StaffsDocument = new TypedDocumentString(`
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
    `) as unknown as TypedDocumentString<StaffsQuery, StaffsQueryVariables>;
