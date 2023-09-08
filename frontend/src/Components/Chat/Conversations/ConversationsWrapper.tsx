import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import React from "react";
import ConversationsList from "./ConversationsList";
import ConversationsNavbar from "./ConversationsNavbar";

type ConversationsWrapperProps = {
  session: Session;
};

const ConversationsWrapper: React.FC<ConversationsWrapperProps> = ({ session }) => {
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
