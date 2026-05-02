import { graphql } from "@/graphql";
import type { MeQuery } from "@/graphql/graphql";
import { execute } from "@/graphql/execute";
import { useQuery } from "@tanstack/react-query";

const queryMe = graphql(`
  query Me {
    me {
      id
      email
      role
    }
  }
`);

/** Loader-safe fetch (no React). Returns `me` or null if unauthenticated / GraphQL errors. */
export async function fetchMe(): Promise<MeQuery["me"] | null> {
  const json = (await execute(queryMe)) as {
    data?: MeQuery;
    errors?: readonly unknown[];
  };
  if (json.errors?.length) return null;
  return json.data?.me ?? null;
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });
}
