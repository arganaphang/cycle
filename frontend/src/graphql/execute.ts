import type { TypedDocumentString } from "./graphql";

function graphqlEndpoint(): string {
  const raw = (import.meta.env.VITE_BACKEND_URL as string | undefined)?.trim() ?? "";
  if (raw && /^https?:\/\//i.test(raw)) {
    return `${raw.replace(/\/$/, "")}/query`;
  }
  return "/query";
}

export async function execute<TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  ...[variables]: TVariables extends Record<string, never> ? [] : [TVariables]
) {
  const response = await fetch(graphqlEndpoint(), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json() as TResult;
}
