import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { PrismaClient } from "@prisma/client";
import { json } from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express from "express";
import { PubSub } from "graphql-subscriptions";
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
  const pubsub = new PubSub();

  // Save the returned server's info so we can shutdown this server later
  const serverCleanup = useServer(
    {
      schema,
      context: async (ctx: SubscriptionContext): Promise<GraphQLContext> => {
        if (ctx.connectionParams && ctx.connectionParams.session) {
          const { session } = ctx.connectionParams;
          return { session, prisma, pubsub };
        }

        // In case the user is not signed in:
        return { session: null, prisma, pubsub };
      },
    },
    wsServer,
  );

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
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
    ],
  });

  await server.start();

  // Ref: https://www.apollographql.com/docs/apollo-server/v3/security/cors#configuring-cors-options-for-apollo-server
  const corsOptions = {
    origin: [process.env.CLIENT_ORIGIN, "http://localhost:3000", "http://localhost"],
    credentials: true, // alows server to accept auth headers
  };

  app.use(
    "/graphql",
    // @ts-ignore
    cors<cors.CorsRequest>(corsOptions),
    json(),
    expressMiddleware(server, {
      /**
       * Adds session, prisma and pubsub to context that will be
       * shared across all resolvers.
       */
      context: async ({ req, res }): Promise<GraphQLContext> => {
        const session = await getSession({ req });
        return { session, prisma, pubsub };
      },
    }),
  );

  await new Promise<void>((resolve) => {
    httpServer.listen({ port: 4000 }, resolve);
  });

  console.log(`🚀 Node Messenger Server ready at http://localhost:4000/graphql`);
  console.log(`🧰 corsOptions.origin =`, corsOptions.origin);
  console.log(`🧰 NEXTAUTH_URL =`, process.env.NEXTAUTH_URL);
}

main().catch((error) => console.log("❌ Node Messenger Server error:", error));
