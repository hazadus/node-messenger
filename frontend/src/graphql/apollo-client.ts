import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { getSession } from "next-auth/react";

const httpLink = new HttpLink({
  uri: `http://${process.env.NEXT_PUBLIC_BACKEND_HOST}/graphql`,
  credentials: "include",
});

// Ensure these code blocks are running in the browser:
const wsLink =
  typeof window !== "undefined"
    ? new GraphQLWsLink(
        createClient({
          url: `ws://${process.env.NEXT_PUBLIC_BACKEND_HOST}/graphql/subscriptions`,
          connectionParams: async () => ({
            session: await getSession(),
          }),
        }),
      )
    : null;

const link =
  typeof window !== "undefined" && wsLink != null
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query);
          return definition.kind === "OperationDefinition" && definition.operation === "subscription";
        },
        wsLink,
        httpLink,
      )
    : httpLink;

export const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
});
