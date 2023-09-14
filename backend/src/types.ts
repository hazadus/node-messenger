import { Prisma, PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws";
import { ISODateString } from "next-auth";
import { conversationPopulatedInclude, participantPopulatedInclude } from "./graphql/resolvers/conversation";
import { messagePopulatedInclude } from "./graphql/resolvers/message";

/**
 * Server configuration
 */
export type GraphQLContext = {
  session: CustomSession | null;
  prisma: PrismaClient;
  pubsub: PubSub;
};

interface CustomSession {
  // We extend basic NextAuth Session with `user.username` field.
  user?: CustomUser;
  expires: ISODateString;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: CustomSession;
  };
}

/**
 * User-related stuff
 */
export type CreateUsernameResponse = {
  success: boolean;
  error: string;
};

export interface CustomUser {
  id?: string;
  username?: string; // Our custom field, not present in basic NextAuth User object
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

/**
 * Messages
 */

// Defines arguments for sendMessage GraphQL mutation
export type SendMessageArguments = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
};

export type MessageSentSubscriptionPayload = {
  messageSent: MessagePopulated;
};

export type MessagePopulated = Prisma.MessageGetPayload<{ include: typeof messagePopulatedInclude }>;
