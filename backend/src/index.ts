import { makeExecutableSchema } from "@graphql-tools/schema";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import * as dotenv from "dotenv";
import express from "express";
import http from "http";
import { getSession } from "next-auth/react";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import { GraphQLContext } from "./types";

async function main() {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // Ref: https://www.apollographql.com/docs/apollo-server/v3/security/cors#configuring-cors-options-for-apollo-server
  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN, // `origin` can be a list
    credentials: true, // alows server to accept auth headers
  };

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    context: async ({ req, res }): Promise<GraphQLContext> => {
      const session = await getSession({ req });
      return { session };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });

  await server.start();
  server.applyMiddleware({ app, cors: corsOptions });
  await new Promise<void>((resolve) => {
    httpServer.listen({ port: 4000 }, resolve);
  });
  console.log(`🚀 Node Messenger Server ready at http://localhost:4000${server.graphqlPath}`);
  console.log(`🧰 CLIENT_ORIGIN =`, process.env.CLIENT_ORIGIN);
}

main().catch((error) => console.log("❌ Node Messenger Server error:", error));
