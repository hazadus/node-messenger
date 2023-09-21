import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import { ConversationPopulated, ParticipantPopulated } from "../../../../../backend/src/types";
import ConversationItem from "./ConversationItem";

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
  const router = useRouter();

  const {
    user: { id: singedInUserId },
  } = session;
  const { conversationId: selectedConversationId } = router.query;
  const sortedConversations = [...conversations].sort(
    (a, b) => b.updatedAt.valueOf() - a.updatedAt.valueOf(),
  );

  const getSignedInUserParticipantObject = (conversation: ConversationPopulated) => {
    return conversation.participants.find((p) => p.user.id === session.user.id) as ParticipantPopulated;
  };

  return (
    <Box width="100%">
      {/* Conversations list itself */}
      {sortedConversations.map((conversation) => {
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
