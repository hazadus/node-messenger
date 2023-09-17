import SkeletonLoader from "@/Components/SkeletonLoader";
import ConversationOperations from "@/graphql/operations/conversation";
import { ConversationsData, ConversationUpdatedData } from "@/types";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { ConversationPopulated } from "../../../../../backend/src/types";
import ConversationsList from "./ConversationsList";
import ConversationsNavbar from "./ConversationsNavbar";

type ConversationsWrapperProps = {
  session: Session;
};

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({ session }) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
  } = useQuery<ConversationsData>(ConversationOperations.Queries.conversations);
  const router = useRouter();
  const { conversationId: selectedConversationId } = router.query;
  const signedInUserId = session.user.id;

  const [markConversationAsRead] = useMutation<
    { markConversationAsRead: boolean },
    { conversationId: string; userId: string }
  >(ConversationOperations.Mutations.markConversationAsRead);

  /**
   * Subscribe to conversation updates.
   */
  useSubscription<ConversationUpdatedData>(ConversationOperations.Subscriptions.conversationUpdated, {
    /**
     * Called when new subscription data is received.
     */
    onData: async ({ client, data }) => {
      const { data: subscriptionData } = data;

      if (!subscriptionData) {
        return;
      }

      /**
       * If we received update on conversation which is currently open,
       * mark it as read (if it is not already).
       */
      const updatedConversationId = subscriptionData.conversationUpdated.conversation.id;
      const isMarkedAsRead = subscriptionData.conversationUpdated.conversation.participants.find(
        (p) => p.user.id === signedInUserId,
      )?.hasSeenLatestMessage;

      if (updatedConversationId === selectedConversationId) {
        if (!isMarkedAsRead) {
          try {
            await markConversationAsRead({
              variables: {
                userId: signedInUserId,
                conversationId: updatedConversationId,
              },
            });
          } catch (error: any) {
            console.log("useSubscription / onData error:", error);
            toast.error(error?.message);
          }
        }
      }
    },
  });

  /**
   * Called when user selects a conversation in the list: push user to this conversation
   * and mark it as read, if needed.
   * @param conversationId selected conversation's id
   */
  const onViewConversation = async (conversationId: string, hasSeenLatestMessage: boolean) => {
    /**
     * Push user to conversation with `conversationId`
     */
    router.push({ query: { conversationId } });

    /**
     * Mark the conversation as read
     */
    if (hasSeenLatestMessage) {
      return;
    }

    try {
      await markConversationAsRead({
        variables: {
          userId: signedInUserId,
          conversationId,
        },
      });
    } catch (error: any) {
      console.log("onViewConversation error:", error);
      toast.error(error?.message);
    }
  };

  const subscribeToNewConversations = () => {
    subscribeToMore({
      document: ConversationOperations.Subscriptions.conversationCreated,
      updateQuery: (
        prev,
        // Inline typecast `subscriptionData`:
        { subscriptionData }: { subscriptionData: { data: { conversationCreated: ConversationPopulated } } },
      ) => {
        if (!subscriptionData.data) {
          return prev;
        }

        const newConversation = subscriptionData.data.conversationCreated;

        return Object.assign({}, prev, {
          // Update `conversationsData` with newly created conversation:
          conversations: [newConversation, ...prev.conversations],
        });
      },
    });
  };

  /**
   * Subscribe to updates on mount.
   */
  useEffect(() => {
    subscribeToNewConversations();
  }, []);

  return (
    <Box
      display={{ base: selectedConversationId ? "none" : "block", md: "block" }}
      width={{ base: "100%", md: "600px" }}
      bg="whiteAlpha.50"
    >
      <ConversationsNavbar session={session} />
      {conversationsLoading ? (
        <SkeletonLoader
          count={3}
          width="100%"
          height="80px"
        />
      ) : (
        <ConversationsList
          session={session}
          conversations={conversationsData?.conversations || []}
          onViewConversation={onViewConversation}
        />
      )}
    </Box>
  );
};

export default ConversationsWrapper;
