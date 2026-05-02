/** Shim: `@graphql-typed-document-node/core` ships no JS; bundlers need a real module to resolve. */
export interface DocumentTypeDecoration<TResult, TVariables> {
  __apiType?: (variables: TVariables) => TResult;
}
