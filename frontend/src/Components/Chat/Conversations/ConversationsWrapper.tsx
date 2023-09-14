import ConversationOperations from "@/graphql/operations/conversation";
import { ConversationsData } from "@/types";
import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { ConversationPopulated } from "../../../../../backend/src/types";
import ConversationsList from "./ConversationsList";
import ConversationsNavbar from "./ConversationsNavbar";
import SkeletonLoader from "@/Components/SkeletonLoader";

type ConversationsWrapperProps = {
  session: Session;
};

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({ session }) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
    subscribeToMore,
    // @ts-ignore
  } = useQuery<ConversationsData, null>(ConversationOperations.Queries.conversations);
  const router = useRouter();
  const { conversationId: selectedConversationId } = router.query;

  console.log("🚀 conversationsData =", conversationsData);

  /**
   * Called when user selects a conversation in the list: push user to this conversation
   * and mark it as read.
   * @param conversationId selected conversation's id
   */
  const onViewConversation = async (conversationId: string) => {
    // Push user to conversation with `conversationId`
    router.push({ query: { conversationId } });
    // Mark the conversation as read
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

        console.log("🚀 subscribeToNewConversations -> subscriptionData=", subscriptionData);

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
