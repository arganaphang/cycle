import { graphql } from "@/graphql";
import type { LogoutMutation } from "@/graphql/graphql";
import { execute } from "@/graphql/execute";

const logoutMutation = graphql(`
  mutation Logout {
    logout
  }
`);

export async function logout(): Promise<void> {
  const json = (await execute(logoutMutation)) as {
    data?: LogoutMutation;
    errors?: readonly { message?: string }[];
  };
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message ?? "Error").join(", ") || "Logout failed");
  }
  if (json.data?.logout !== true) {
    throw new Error("Logout failed");
  }
}
