import { Prisma } from "@prisma/client";
import { ApolloError } from "apollo-server-core";
import type { GraphQLContext } from "../../types";
import { ConversationPopulated } from "../../types";

const resolvers = {
  Query: {
    /**
     * Return all conversations where signed in user participates.
     */
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext,
    ): Promise<Array<ConversationPopulated>> => {
      const { session, prisma } = context;

      console.log("💡 conversations resolver");

      if (!session?.user) {
        throw new ApolloError("User not authenticated.");
      }

      const {
        user: { id: signedInUserId },
      } = session;

      try {
        const conversations = await prisma.conversation.findMany({
          /**
           * NB!!!
           *
           * This is correct, but Shadee said it doesn't work... (Pt.3 1:15)
           * Let's find out.
           */
          where: {
            participants: {
              some: {
                userId: {
                  equals: signedInUserId,
                },
              },
            },
          },
          include: conversationPopulatedInclude,
        });

        /**
         * If the above query in fact doesn't work, filter conversations by ourselves like so:
         * return conversations.filter(conv => conv.participants.find(p => p.userId === signedInUserId))
         */
        return conversations;
      } catch (error: any) {
        console.log("conversations error:", error);
        throw new ApolloError(error?.message);
      }
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext,
    ): Promise<{ conversationId: string }> => {
      const { participantIds } = args;
      const { session, prisma, pubsub } = context;

      if (!session?.user) {
        console.log("❌ latestConversationMessage: User not authenticated.");
        throw new ApolloError("User not authenticated.");
      }

      const {
        user: { id: signedInUserId },
      } = session;

      console.log("💡 createConversation resolver | participantIds =", participantIds);

      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMessage: id === signedInUserId,
                })),
              },
            },
          },
          include: conversationPopulatedInclude,
        });

        /**
         * Emit the event via WebSockets.
         */
        pubsub.publish("CONVERSATION_CREATED", {
          conversationCreated: conversation,
        });

        console.log(`✅ Conversation "${conversation.id}" with users "${participantIds}" created.`);
        return {
          conversationId: conversation.id,
        };
      } catch (error: any) {
        console.log("❌ createConversation error:", error);
        throw new ApolloError("Error creating conversation.");
      }
    },
  },
  Subscription: {
    conversationCreated: {
      subscribe: (_: any, __: any, context: GraphQLContext) => {
        const { pubsub } = context;
        /**
         * This will pass newly created conversation to the clients.
         */
        pubsub.asyncIterator(["CONVERSATION_CREATED"]);
      },
    },
  },
};

export const participantPopulatedInclude = Prisma.validator<Prisma.ConversationParticipantInclude>()({
  user: {
    select: {
      id: true,
      username: true,
      image: true,
    },
  },
});

export const conversationPopulatedInclude = Prisma.validator<Prisma.ConversationInclude>()({
  participants: {
    include: participantPopulatedInclude,
  },
  latestMessage: {
    include: {
      sender: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
    },
  },
});

export default resolvers;
