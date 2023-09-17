import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import {
  GraphQLContext,
  MessagePopulated,
  MessageSentSubscriptionPayload,
  SendMessageArguments,
} from "../../types";
import { userIsConversationParticipant } from "../../helpers";
import { conversationPopulatedInclude } from "./conversation";

const resolvers = {
  Query: {
    /**
     * Get all messages from the conversation. Signed in user must be participant of
     * this conversation.
     *
     * @param args conversationId - conversation from where to get messages
     */
    messages: async (
      _: any,
      args: { conversationId: string },
      context: GraphQLContext,
    ): Promise<Array<MessagePopulated>> => {
      const { session, prisma } = context;
      const { conversationId } = args;

      if (!session?.user) {
        throw new GraphQLError("User not authenticated.");
      }

      const signedInUserId = session.user.id as string;

      /**
       * Ensure that conversation exists and signedInUserId participates in
       * conversation with conversationId.
       */
      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: conversationPopulatedInclude,
      });

      if (!conversation) {
        console.log(`❌ messages error: conversationId "${conversationId}" not found in the database.`);
        throw new GraphQLError(`conversationId "${conversationId}" not found in the database.`);
      }

      const isAllowedToViewMessages = userIsConversationParticipant(
        conversation.participants,
        signedInUserId,
      );

      if (!isAllowedToViewMessages) {
        console.log(
          `❌ messages error: user "${signedInUserId}" not allowed to read conversation "${conversationId}".`,
        );
        throw new GraphQLError(
          `User "${signedInUserId}" not allowed to read conversation "${conversationId}".`,
        );
      }

      /**
       * Get messages from the database.
       */
      try {
        const messages = prisma.message.findMany({
          where: {
            conversationId: conversationId,
          },
          include: messagePopulatedInclude,
          orderBy: {
            createdAt: "desc",
          },
        });

        return messages;
      } catch (error: any) {
        console.log("❌ messages error:", error);
        throw new GraphQLError(error?.messages);
      }
    },
  },
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

      const signedInUserId = session.user.id;
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
          include: messagePopulatedInclude,
        });

        /**
         * Get ConversationParticipant document for signed in user in this
         * conversation, to use it's ID later.
         */
        const signedInUserConversationParticipantDocument = await prisma.conversationParticipant.findFirst({
          where: {
            userId: signedInUserId,
            conversationId: conversationId,
          },
        });

        if (!signedInUserConversationParticipantDocument) {
          console.log("❌ ConversationParticipant for signed in user not found.");
          throw new GraphQLError("ConversationParticipant for signed in user not found.");
        }

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
              // Update sender - set `hasSeenLatestMessage` to true
              update: {
                where: {
                  id: signedInUserConversationParticipantDocument.id,
                },
                data: {
                  hasSeenLatestMessage: true,
                },
              },
              updateMany: {
                // Update all other participants - set `hasSeenLatestMessage` to false.
                where: {
                  conversationId: conversationId,
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
          include: conversationPopulatedInclude,
        });

        /**
         * Notify clients
         */
        // Payload is of type `MessageSentSubscriptionPayload`:
        pubsub.publish("MESSAGE_SENT", { messageSent: newMessage });
        // Payload is of type `ConversationUpdatedSubscriptionPayload`:
        pubsub.publish("CONVERSATION_UPDATED", { conversationUpdated: { updatedConversation } });
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
export const messagePopulatedInclude = Prisma.validator<Prisma.MessageInclude>()({
  sender: {
    select: {
      id: true,
      username: true,
      image: true,
    },
  },
});

export default resolvers;
