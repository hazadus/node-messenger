import { ApolloError } from "apollo-server-core";
import type { GraphQLContext } from "../../types";
import _logger from "next-auth/utils/logger";
import { Prisma } from "@prisma/client";

const resolvers = {
  Query: {
    conversations: async (_: any, __: any, context: GraphQLContext) => {
      console.log("💡 conversations resolver");
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext,
    ): Promise<{ conversationId: string }> => {
      const { participantIds } = args;
      const { session, prisma } = context;

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
