import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { ConversationPopulated } from "../../../../../backend/src/types";
import FindConversationModal from "./Modal/FindConversationModal";
import ConversationItem from "./ConversationItem";

type ConversationsListProps = {
  session: Session;
  conversations: ConversationPopulated[];
};

const ConversationsList: React.FC<ConversationsListProps> = ({ session, conversations }) => {
  const [isFindConversationModalOpen, setIsFindConversationModalOpen] = useState(false);

  const onOpenFindConversationModal = () => setIsFindConversationModalOpen(true);
  const onCloseFindConversationModal = () => setIsFindConversationModalOpen(false);

  return (
    <Box width="100%">
      <Box
        px={4}
        py={2}
        mt={2}
        mb={4}
        mx={2}
        bg="blackAlpha.300"
        borderRadius={4}
        cursor="pointer"
        onClick={onOpenFindConversationModal}
      >
        <Text
          textAlign="center"
          color="whiteAlpha.800"
          fontWeight={500}
        >
          Find chat
        </Text>
        <FindConversationModal
          isOpen={isFindConversationModalOpen}
          onClose={onCloseFindConversationModal}
          session={session}
        />
      </Box>

      {/* Conversations list itself */}
      {conversations.map((conversation) => (
        <ConversationItem
          key={`conversation-item-id-${conversation.id}`}
          conversation={conversation}
        />
      ))}
    </Box>
  );
};

export default ConversationsList;
