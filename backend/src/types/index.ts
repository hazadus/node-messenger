import { Prisma, PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";
import { conversationPopulatedInclude, participantPopulatedInclude } from "../graphql/resolvers/converation";

export type GraphQLContext = {
  session: CustomSession | null;
  prisma: PrismaClient;
  // pubsub
};

export type CreateUsernameResponse = {
  success: boolean;
  error: string;
};

interface CustomSession {
  user?: CustomUser;
  expires: ISODateString;
}

export interface CustomUser {
  id?: string;
  username?: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: boolean;
  image?: string | null;
}

/**
 * Conversations
 */
export type ConversationPopulated = Prisma.ConversationGetPayload<{
  include: typeof conversationPopulatedInclude;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
  include: typeof participantPopulatedInclude;
}>;
