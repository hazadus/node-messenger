import { Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ConversationPopulated } from "../../../../../backend/src/types";

type ConversationItemProps = {
  conversation: ConversationPopulated;
};

const ConversationItem: React.FC<ConversationItemProps> = ({ conversation }) => {
  console.log("ConversationItem conversation=", conversation);

  return (
    <Stack
      p={4}
      _hover={{ bg: "whiteAlpha.200" }}
      cursor="pointer"
    >
      <Text>{conversation.id}</Text>
    </Stack>
  );
};

export default ConversationItem;
