import ConversationOperations from "@/graphql/operations/conversation";
import { useQuery } from "@apollo/client";
import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import ConversationsList from "./ConversationsList";
import ConversationsNavbar from "./ConversationsNavbar";
import { ConversationsData } from "@/types";

type ConversationsWrapperProps = {
  session: Session;
};

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({ session }) => {
  const {
    data: conversationsData,
    error: conversationsError,
    loading: conversationsLoading,
  } = useQuery<ConversationsData, null>(ConversationOperations.Queries.conversations);

  console.log("conversationsData =", conversationsData);

  return (
    <Box
      width={{ base: "100%", md: "400px" }}
      bg="whiteAlpha.50"
    >
      <ConversationsNavbar session={session} />
      {/* Insert "Skeleton loader" here  */}
      <ConversationsList session={session} />
    </Box>
  );
};

export default ConversationsWrapper;
