import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import type { ConversationUpdatedSubscriptionPayload, GraphQLContext } from "../../types";
import { ConversationPopulated } from "../../types";

const resolvers = {
  Query: {
    /**
     * Return all conversations where signed in user participates,
     * sorted by updatedAt, desc.
     */
    conversations: async (
      _: any,
      __: any,
      context: GraphQLContext,
    ): Promise<Array<ConversationPopulated>> => {
      const { session, prisma } = context;

      console.log("💡 conversations resolver");

      if (!session?.user) {
        throw new GraphQLError("User not authenticated.");
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
          orderBy: {
            updatedAt: "desc",
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
        throw new GraphQLError(error?.message);
      }
    },
  },
  Mutation: {
    /**
     * Create conversation document in the database, including passed participants.
     * Signed in user is set as conversation creator.
     * @param args participantIds: Array<string> - array of participant IDs
     * @returns `conversationId: string` – ID of the newly created conversation
     */
    createConversation: async (
      _: any,
      args: { participantIds: Array<string> },
      context: GraphQLContext,
    ): Promise<{ conversationId: string }> => {
      const { participantIds } = args;
      const { session, prisma, pubsub } = context;

      if (!session?.user) {
        console.log("❌ latestConversationMessage: User not authenticated.");
        throw new GraphQLError("User not authenticated.");
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
            createdByUserId: session.user.id!,
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
        throw new GraphQLError("Error creating conversation.");
      }
    },
    /**
     * Mark specified conversation as "read" for specified user.
     * It is done by setting `hasSeenLatestMessage` to true in
     * corresponding ConversationParticipant document.
     *
     * @param args conversationId: string; userId: string
     */
    markConversationAsRead: async (
      _: any,
      args: { conversationId: string; userId: string },
      context: GraphQLContext,
    ): Promise<boolean> => {
      const { conversationId, userId } = args;
      const { session, prisma, pubsub } = context;

      if (!session?.user) {
        console.log("❌ markConversationAsRead error: User not authenticated.");
        throw new GraphQLError("User not authenticated.");
      }

      try {
        const conversationParticipant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId,
          },
        });

        if (!conversationParticipant) {
          console.log("❌ ConversationParticipant document not found!");
          throw new GraphQLError("ConversationParticipant document not found!");
        }

        await prisma.conversationParticipant.update({
          where: {
            id: conversationParticipant.id,
          },
          data: {
            hasSeenLatestMessage: true,
          },
        });

        /**
         * Send CONVERSATION_UPDATED event to all subscribers to update
         * `hasSeenLatestMessage` for all clients.
         */
        const updatedConversation = await prisma.conversation.findUnique({
          where: {
            id: conversationId,
          },
          include: conversationPopulatedInclude,
        });
        pubsub.publish("CONVERSATION_UPDATED", {
          conversationUpdated: { conversation: updatedConversation },
        });

        return true;
      } catch (error: any) {
        console.log("❌ markConversationAsRead error:", error);
        throw new GraphQLError(error?.message);
      }
    },
  },
  Subscription: {
    /**
     * Fires off when the new conversation is successfully created.
     */
    conversationCreated: {
      /**
       * Use `withFilter` to conditionally push updates only to participants of the conversation.
       * 1st param is the `subscribe` callback itself;
       * 2nd param callback checks if signed in user is in the conversation.
       */
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          /**
           * This will pass newly created conversation to the clients.
           */
          console.log("💡 conversationCreated subscription resolver");
          return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
        },
        /**
         * Filter callback function - checks if signed in user is in the conversation.
         */
        (payload: ConversationCreatedSubscriptionPayload, _, context: GraphQLContext) => {
          const { session } = context;
          const {
            conversationCreated: { participants },
          } = payload;
          // `!!` used to convert to boolean
          const signedInUserIsParticipant = !!participants.find((p) => p.userId === session?.user?.id);
          return signedInUserIsParticipant;
        },
      ),
    },
    conversationUpdated: {
      /**
       * Fires off when conversation gets updated: new message created,
       * conversation marked as read, etc.
       */
      subscribe: withFilter(
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          console.log("💡 conversationUpdated subscription resolver");
          return pubsub.asyncIterator(["CONVERSATION_UPDATED"]);
        },
        /**
         * Filter callback function - checks if signed in user is in the conversation.
         */
        (payload: ConversationUpdatedSubscriptionPayload, _, context: GraphQLContext) => {
          const { session } = context;

          if (!session?.user) {
            throw new GraphQLError("User not authenticated.");
          }

          const signedInUserId = session.user.id;
          const {
            conversationUpdated: {
              conversation: { participants },
            },
          } = payload;

          const signedInUserIsParticipant = !!participants.find((p) => p.userId === session?.user?.id);
          return signedInUserIsParticipant;
        },
      ),
    },
  },
};

export type ConversationCreatedSubscriptionPayload = {
  conversationCreated: ConversationPopulated;
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
