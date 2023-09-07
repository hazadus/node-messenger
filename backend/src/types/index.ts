import { Session } from "next-auth";

export type GraphQLContext = {
  session: Session | null;
  // prisma
  // pubsub
};
