import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { GraphQLContext, MessageSentSubscriptionPayload, SendMessageArguments } from "../../types";
import { withFilter } from "graphql-subscriptions";

const resolvers = {
  Query: {},
  Mutation: {
    /**
     * Creates new message document in the database. Updates the conversation document.
     * Notifies clients.
     *
     * @param args SendMessageArguments
     * @param context GraphQLContext
     * @returns true on success
     */
    sendMessage: async (_: any, args: SendMessageArguments, context: GraphQLContext): Promise<boolean> => {
      const { session, prisma, pubsub } = context;

      if (!session?.user) {
        throw new GraphQLError("User not authenticated.");
      }

      const {
        user: { id: signedInUserId },
      } = session;
      const { id: messageId, senderId, conversationId, body: messageBody } = args;

      if (signedInUserId !== senderId) {
        throw new GraphQLError("Not allowed to send message on behalf of other user.");
      }

      try {
        /**
         * Create new message document in the database.
         */
        const newMessage = await prisma.message.create({
          data: {
            id: messageId,
            senderId,
            conversationId,
            body: messageBody,
          },
          include: messagePopulated,
        });

        /**
         * Update conversation document in the database:
         * - set newly created message as the latest in the conversation;
         * - mark this message as read for sender;
         * - mark this message as unread for other conversation participants.
         */
        const updatedConversation = await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            latestMessageId: newMessage.id,
            participants: {
              update: {
                where: {
                  id: senderId,
                },
                data: {
                  hasSeenLatestMessage: true,
                },
              },
              updateMany: {
                where: {
                  NOT: {
                    userId: senderId,
                  },
                },
                data: {
                  hasSeenLatestMessage: false,
                },
              },
            },
          },
        });

        /**
         * Notify clients
         */
        // Payload is of type `MessageSentSubscriptionPayload`:
        pubsub.publish("MESSAGE_SENT", { messageSent: newMessage });
        // pubsub.publish("CONVERSATION_UPDATED", { conversationUpdated: { updatedConversation } });
      } catch (error: any) {
        console.log("❌ sendMessage error:", error);
        throw new GraphQLError("Error sending message.");
      }

      return true;
    },
  },
  Subscription: {
    messageSent: {
      // Reference: https://www.apollographql.com/docs/apollo-server/data/subscriptions/#filtering-events
      subscribe: withFilter(
        // The first parameter is exactly the function you would use
        // for subscribe if you weren't applying a filter.
        (_: any, __: any, context: GraphQLContext) => {
          const { pubsub } = context;
          return pubsub.asyncIterator(["MESSAGE_SENT"]);
        },
        // Filter function. `conversationId` arg comes from the `messageSent` subscription
        // definintion in GraphQL schema.
        (
          payload: MessageSentSubscriptionPayload,
          args: { conversationId: string },
          context: GraphQLContext,
        ) => {
          // Send events only to participants of the conversation where
          // the message was sent to.
          return payload.messageSent.conversationId === args.conversationId;
        },
      ),
    },
  },
};

/**
 * Define which fields should be included in the entity returned by `Prisma.message.create()`.
 */
export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
      image: true,
    },
  },
});

export default resolvers;
