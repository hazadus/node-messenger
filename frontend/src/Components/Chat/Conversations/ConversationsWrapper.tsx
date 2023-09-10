import ConversationOperations from "@/graphql/operations/conversation";
import { ConversationsData } from "@/types";
import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useEffect } from "react";
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
    // @ts-ignore
  } = useQuery<ConversationsData, null>(ConversationOperations.Queries.conversations);

  console.log("🚀 conversationsData =", conversationsData);

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
      width={{ base: "100%", md: "400px" }}
      bg="whiteAlpha.50"
    >
      <ConversationsNavbar session={session} />
      {/* Insert "Skeleton loader" here  */}
      <ConversationsList
        session={session}
        conversations={conversationsData?.conversations || []}
      />
    </Box>
  );
};

export default ConversationsWrapper;
