import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import http from "http";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/typeDefs";
import { makeExecutableSchema } from "@graphql-tools/schema";
import * as dotenv from "dotenv";

async function main() {
  dotenv.config();
  const app = express();
  const httpServer = http.createServer(app);
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const corsOptions = {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  };

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
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

main().catch((error) => console.log(error));
