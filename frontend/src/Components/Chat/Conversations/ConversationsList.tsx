import { Box, Flex, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import { ConversationPopulated, ParticipantPopulated } from "../../../../../backend/src/types";
import ConversationItem from "./ConversationItem";
import { formatUsernames } from "@/helpers/helpers";

type ConversationsListProps = {
  session: Session;
  conversations: ConversationPopulated[];
  onViewConversation: (conversationId: string, hasSeenLatestMessage: boolean) => void;
  searchText: string;
  showUnreadOnly: boolean;
};

const ConversationsList: React.FC<ConversationsListProps> = ({
  session,
  conversations,
  onViewConversation,
  searchText,
  showUnreadOnly,
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

  let filteredConversations = sortedConversations;

  /**
   * Filter conversations by searchText - show only conversations where usernames
   * include searchText.
   */
  if (searchText.trim().length) {
    filteredConversations = filteredConversations.filter((conversation) => {
      const userNames = formatUsernames(conversation.participants, singedInUserId);
      return userNames.toLowerCase().includes(searchText.trim().toLowerCase());
    });
  }

  /**
   * Filter - show only conversations with unread messages.
   */
  if (showUnreadOnly) {
    filteredConversations = filteredConversations.filter((conversation) => {
      const signedInUser = getSignedInUserParticipantObject(conversation);
      return !signedInUser.hasSeenLatestMessage;
    });
  }

  return (
    <Box width="100%">
      {/* Filter info */}
      {searchText.length > 0 && (
        <Flex p={2}>
          <Text
            width="100%"
            textAlign="center"
            color="whiteAlpha.700"
          >
            Chats filtered by "{searchText}"
          </Text>
        </Flex>
      )}
      {showUnreadOnly && (
        <Flex p={2}>
          <Text
            width="100%"
            textAlign="center"
            color="whiteAlpha.700"
          >
            Displaying chats with unread messages only.
          </Text>
        </Flex>
      )}
      {/* Conversations list itself */}
      {filteredConversations.map((conversation) => {
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
