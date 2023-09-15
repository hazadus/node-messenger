import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { ConversationPopulated, ParticipantPopulated } from "../../../../../backend/src/types";
import ConversationItem from "./ConversationItem";
import FindConversationModal from "./Modal/FindConversationModal";

type ConversationsListProps = {
  session: Session;
  conversations: ConversationPopulated[];
  onViewConversation: (conversationId: string, hasSeenLatestMessage: boolean) => void;
};

const ConversationsList: React.FC<ConversationsListProps> = ({
  session,
  conversations,
  onViewConversation,
}) => {
  const [isFindConversationModalOpen, setIsFindConversationModalOpen] = useState(false);
  const router = useRouter();

  const {
    user: { id: singedInUserId },
  } = session;
  const { conversationId: selectedConversationId } = router.query;

  const onOpenFindConversationModal = () => setIsFindConversationModalOpen(true);
  const onCloseFindConversationModal = () => setIsFindConversationModalOpen(false);

  const getSignedInUserParticipantObject = (conversation: ConversationPopulated) => {
    return conversation.participants.find((p) => p.user.id === session.user.id) as ParticipantPopulated;
  };

  return (
    <Box width="100%">
      <Box
        px={4}
        py={2}
        my={2}
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
      {conversations.map((conversation) => {
        const { hasSeenLatestMessage } = getSignedInUserParticipantObject(conversation);
        return (
          <ConversationItem
            key={`conversation-item-id-${conversation.id}`}
            conversation={conversation}
            isSelected={conversation.id === selectedConversationId}
            singedInUserId={singedInUserId}
            hasSeenLatestMessage={hasSeenLatestMessage}
            onClick={() => onViewConversation(conversation.id, hasSeenLatestMessage)}
          />
        );
      })}
    </Box>
  );
};

export default ConversationsList;
