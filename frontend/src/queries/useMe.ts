import { graphql } from "@/graphql";
import { execute } from "@/graphql/execute";
import { useQuery } from "@tanstack/react-query";

const queryMe = graphql(`
  query Me {
    me {
      id
      email
      is_active
    }
  }
`);

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: () => execute(queryMe),
  });
}
