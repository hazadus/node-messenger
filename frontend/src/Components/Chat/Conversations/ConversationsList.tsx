import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import FindConversationModal from "./Modal/FindConversationModal";

type ConversationsListProps = {
  session: Session;
};

const ConversationsList: React.FC<ConversationsListProps> = ({ session }) => {
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
    </Box>
  );
};

export default ConversationsList;
