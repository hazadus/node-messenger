import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import * as dotenv from "dotenv";
import express from "express";
import { useServer } from "graphql-ws/lib/use/ws";
import http from "http";
import { getSession } from "next-auth/react";
import { WebSocketServer } from "ws";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import { GraphQLContext, SubscriptionContext } from "./types";

async function main() {
  dotenv.config();
  const app = express();
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql/subscriptions",
  });

  const prisma = new PrismaClient();

  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
        if (ctx.connectionParams && ctx.connectionParams.session) {
          const { session } = ctx.connectionParams;
          return { session, prisma };
        }

        // In case the user is not signed in:
        return { session: null, prisma };
      },
    },
    wsServer,
  );

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
      return { session, prisma };
    },
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSockets server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
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
