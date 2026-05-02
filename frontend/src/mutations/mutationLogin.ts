import { graphql } from "@/graphql";
import type { LoginMutation } from "@/graphql/graphql";
import { execute } from "@/graphql/execute";

const loginMutation = graphql(`
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
`);

export async function login(input: {
  email: string;
  password: string;
}): Promise<LoginMutation["login"]> {
  const json = (await execute(loginMutation, { input })) as {
    data?: LoginMutation;
    errors?: readonly { message?: string }[];
  };
  if (json.errors?.length) {
    throw new Error(
      json.errors.map((e) => e.message ?? "Error").join(", ") || "Login failed",
    );
  }
  const payload = json.data?.login;
  if (!payload) throw new Error("Login failed");
  return payload;
}
