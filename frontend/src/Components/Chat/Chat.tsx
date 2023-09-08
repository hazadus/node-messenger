import { Flex } from "@chakra-ui/react";
import React from "react";
import ConversationsWrapper from "./Conversations/ConversationsWrapper";
import FeedWrapper from "./Feed/FeedWrapper";
import { Session } from "next-auth";

type ChatProps = {
  session: Session;
};

const Chat: React.FC<ChatProps> = ({ session }) => {
  return (
    <Flex height="100vh">
      <ConversationsWrapper session={session} />
      <FeedWrapper session={session} />
    </Flex>
  );
};

export default Chat;
