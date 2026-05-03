/* eslint-disable */
import * as types from "./graphql";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
  "\n  mutation CreatePatient($input: CreatePatientInput!) {\n    createPatient(input: $input) {\n      id\n    }\n  }\n": typeof types.CreatePatientDocument;
  "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateUserDocument;
  "\n  mutation CreateStaff($input: CreateStaffInput!) {\n    createStaff(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateStaffDocument;
  "\n  mutation CreateTreatmentSession($input: CreateTreatmentSessionInput!) {\n    createTreatmentSession(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateTreatmentSessionDocument;
  "\n  mutation CreateTreatmentSessionReport($input: CreateTreatmentSessionReportInput!) {\n    createTreatmentSessionReport(input: $input) {\n      id\n    }\n  }\n": typeof types.CreateTreatmentSessionReportDocument;
  "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        id\n        email\n        role\n      }\n    }\n  }\n": typeof types.LoginDocument;
  "\n  mutation UpdateStaff($id: UUID!, $input: UpdateStaffInput!) {\n    updateStaff(id: $id, input: $input) {\n      id\n    }\n  }\n": typeof types.UpdateStaffDocument;
  "\n  query Me {\n    me {\n      id\n      email\n      role\n    }\n  }\n": typeof types.MeDocument;
  "\n  query Patients(\n    $limit: Int\n    $offset: Int\n    $search: String\n    $sortBy: PatientSortField\n    $sortOrder: SortOrder\n  ) {\n    patients(\n      limit: $limit\n      offset: $offset\n      search: $search\n      sortBy: $sortBy\n      sortOrder: $sortOrder\n    ) {\n      nodes {\n        id\n        full_name\n        medical_record_no\n        date_of_birth\n        gender\n        phone\n        email\n        address\n        created_at\n        updated_at\n      }\n      total_count\n    }\n  }\n": typeof types.PatientsDocument;
  "\n  query TreatmentSessionReports(\n    $limit: Int\n    $offset: Int\n    $filter: ReportFilter\n    $sortBy: TreatmentSessionReportSortField\n    $sortOrder: SortOrder\n  ) {\n    treatmentSessionReports(\n      limit: $limit\n      offset: $offset\n      filter: $filter\n      sortBy: $sortBy\n      sortOrder: $sortOrder\n    ) {\n      nodes {\n        id\n        diagnosis\n        created_at\n        updated_at\n        session_id\n        treatment_session {\n          id\n          session_no\n          session_date\n          patient {\n            id\n            full_name\n          }\n        }\n      }\n      total_count\n    }\n  }\n": typeof types.TreatmentSessionReportsDocument;
  "\n  query TreatmentSessions(\n    $limit: Int\n    $offset: Int\n    $filter: SessionFilter\n    $sortBy: TreatmentSessionSortField\n    $sortOrder: SortOrder\n  ) {\n    treatmentSessions(\n      limit: $limit\n      offset: $offset\n      filter: $filter\n      sortBy: $sortBy\n      sortOrder: $sortOrder\n    ) {\n      nodes {\n        id\n        session_no\n        session_date\n        status\n        created_at\n        updated_at\n        patient {\n          id\n          full_name\n        }\n        staff {\n          id\n          full_name\n        }\n      }\n      total_count\n    }\n  }\n": typeof types.TreatmentSessionsDocument;
  "\n  query Staffs(\n    $limit: Int\n    $offset: Int\n    $search: String\n    $sortBy: StaffSortField\n    $sortOrder: SortOrder\n  ) {\n    staffs(\n      limit: $limit\n      offset: $offset\n      search: $search\n      sortBy: $sortBy\n      sortOrder: $sortOrder\n    ) {\n      nodes {\n        id\n        full_name\n        license_no\n        phone\n        specialization\n        created_at\n        updated_at\n        user {\n          email\n        }\n      }\n      total_count\n    }\n  }\n": typeof types.StaffsDocument;
};
const documents: Documents = {
  "\n  mutation CreatePatient($input: CreatePatientInput!) {\n    createPatient(input: $input) {\n      id\n    }\n  }\n":
    types.CreatePatientDocument,
  "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      id\n    }\n  }\n":
    types.CreateUserDocument,
  "\n  mutation CreateStaff($input: CreateStaffInput!) {\n    createStaff(input: $input) {\n      id\n    }\n  }\n":
    types.CreateStaffDocument,
  "\n  mutation CreateTreatmentSession($input: CreateTreatmentSessionInput!) {\n    createTreatmentSession(input: $input) {\n      id\n    }\n  }\n":
    types.CreateTreatmentSessionDocument,
  "\n  mutation CreateTreatmentSessionReport($input: CreateTreatmentSessionReportInput!) {\n    createTreatmentSessionReport(input: $input) {\n      id\n    }\n  }\n":
    types.CreateTreatmentSessionReportDocument,
  "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        id\n        email\n        role\n      }\n    }\n  }\n":
    types.LoginDocument,
  "\n  mutation UpdateStaff($id: UUID!, $input: UpdateStaffInput!) {\n    updateStaff(id: $id, input: $input) {\n      id\n    }\n  }\n":
    types.UpdateStaffDocument,
  "\n  query Me {\n    me {\n      id\n      email\n      role\n    }\n  }\n": types.MeDocument,
  "\n  query Patients(\n    $limit: Int\n    $offset: Int\n    $search: String\n    $sortBy: PatientSortField\n    $sortOrder: SortOrder\n  ) {\n    patients(\n      limit: $limit\n      offset: $offset\n      search: $search\n      sortBy: $sortBy\n      sortOrder: $sortOrder\n    ) {\n      nodes {\n        id\n        full_name\n        medical_record_no\n        date_of_birth\n        gender\n        phone\n        email\n        address\n        created_at\n        updated_at\n      }\n      total_count\n    }\n  }\n":
    types.PatientsDocument,
  "\n  query TreatmentSessionReports(\n    $limit: Int\n    $offset: Int\n    $filter: ReportFilter\n    $sortBy: TreatmentSessionReportSortField\n    $sortOrder: SortOrder\n  ) {\n    treatmentSessionReports(\n      limit: $limit\n      offset: $offset\n      filter: $filter\n      sortBy: $sortBy\n      sortOrder: $sortOrder\n    ) {\n      nodes {\n        id\n        diagnosis\n        created_at\n        updated_at\n        session_id\n        treatment_session {\n          id\n          session_no\n          session_date\n          patient {\n            id\n            full_name\n          }\n        }\n      }\n      total_count\n    }\n  }\n":
    types.TreatmentSessionReportsDocument,
  "\n  query TreatmentSessions(\n    $limit: Int\n    $offset: Int\n    $filter: SessionFilter\n    $sortBy: TreatmentSessionSortField\n    $sortOrder: SortOrder\n  ) {\n    treatmentSessions(\n      limit: $limit\n      offset: $offset\n      filter: $filter\n      sortBy: $sortBy\n      sortOrder: $sortOrder\n    ) {\n      nodes {\n        id\n        session_no\n        session_date\n        status\n        created_at\n        updated_at\n        patient {\n          id\n          full_name\n        }\n        staff {\n          id\n          full_name\n        }\n      }\n      total_count\n    }\n  }\n":
    types.TreatmentSessionsDocument,
  "\n  query Staffs(\n    $limit: Int\n    $offset: Int\n    $search: String\n    $sortBy: StaffSortField\n    $sortOrder: SortOrder\n  ) {\n    staffs(\n      limit: $limit\n      offset: $offset\n      search: $search\n      sortBy: $sortBy\n      sortOrder: $sortOrder\n    ) {\n      nodes {\n        id\n        full_name\n        license_no\n        phone\n        specialization\n        created_at\n        updated_at\n        user {\n          email\n        }\n      }\n      total_count\n    }\n  }\n":
    types.StaffsDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreatePatient($input: CreatePatientInput!) {\n    createPatient(input: $input) {\n      id\n    }\n  }\n",
): typeof import("./graphql").CreatePatientDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateUser($input: CreateUserInput!) {\n    createUser(input: $input) {\n      id\n    }\n  }\n",
): typeof import("./graphql").CreateUserDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateStaff($input: CreateStaffInput!) {\n    createStaff(input: $input) {\n      id\n    }\n  }\n",
): typeof import("./graphql").CreateStaffDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateTreatmentSession($input: CreateTreatmentSessionInput!) {\n    createTreatmentSession(input: $input) {\n      id\n    }\n  }\n",
): typeof import("./graphql").CreateTreatmentSessionDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation CreateTreatmentSessionReport($input: CreateTreatmentSessionReportInput!) {\n    createTreatmentSessionReport(input: $input) {\n      id\n    }\n  }\n",
): typeof import("./graphql").CreateTreatmentSessionReportDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation Login($input: LoginInput!) {\n    login(input: $input) {\n      token\n      user {\n        id\n        email\n        role\n      }\n    }\n  }\n",
): typeof import("./graphql").LoginDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  mutation UpdateStaff($id: UUID!, $input: UpdateStaffInput!) {\n    updateStaff(id: $id, input: $input) {\n      id\n    }\n  }\n",
): typeof import("./graphql").UpdateStaffDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query Me {\n    me {\n      id\n      email\n      role\n    }\n  }\n",
): typeof import("./graphql").MeDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query Patients(\n    $limit: Int\n    $offset: Int\n    $search: String\n    $sortBy: PatientSortField\n    $sortOrder: SortOrder\n  ) {\n    patients(\n      limit: $limit\n      offset: $offset\n      search: $search\n      sortBy: $sortBy\n      sortOrder: $sortOrder\n    ) {\n      nodes {\n        id\n        full_name\n        medical_record_no\n        date_of_birth\n        gender\n        phone\n        email\n        address\n        created_at\n        updated_at\n      }\n      total_count\n    }\n  }\n",
): typeof import("./graphql").PatientsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query TreatmentSessionReports(\n    $limit: Int\n    $offset: Int\n    $filter: ReportFilter\n    $sortBy: TreatmentSessionReportSortField\n    $sortOrder: SortOrder\n  ) {\n    treatmentSessionReports(\n      limit: $limit\n      offset: $offset\n      filter: $filter\n      sortBy: $sortBy\n      sortOrder: $sortOrder\n    ) {\n      nodes {\n        id\n        diagnosis\n        created_at\n        updated_at\n        session_id\n        treatment_session {\n          id\n          session_no\n          session_date\n          patient {\n            id\n            full_name\n          }\n        }\n      }\n      total_count\n    }\n  }\n",
): typeof import("./graphql").TreatmentSessionReportsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query TreatmentSessions(\n    $limit: Int\n    $offset: Int\n    $filter: SessionFilter\n    $sortBy: TreatmentSessionSortField\n    $sortOrder: SortOrder\n  ) {\n    treatmentSessions(\n      limit: $limit\n      offset: $offset\n      filter: $filter\n      sortBy: $sortBy\n      sortOrder: $sortOrder\n    ) {\n      nodes {\n        id\n        session_no\n        session_date\n        status\n        created_at\n        updated_at\n        patient {\n          id\n          full_name\n        }\n        staff {\n          id\n          full_name\n        }\n      }\n      total_count\n    }\n  }\n",
): typeof import("./graphql").TreatmentSessionsDocument;
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query Staffs(\n    $limit: Int\n    $offset: Int\n    $search: String\n    $sortBy: StaffSortField\n    $sortOrder: SortOrder\n  ) {\n    staffs(\n      limit: $limit\n      offset: $offset\n      search: $search\n      sortBy: $sortBy\n      sortOrder: $sortOrder\n    ) {\n      nodes {\n        id\n        full_name\n        license_no\n        phone\n        specialization\n        created_at\n        updated_at\n        user {\n          email\n        }\n      }\n      total_count\n    }\n  }\n",
): typeof import("./graphql").StaffsDocument;

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}
