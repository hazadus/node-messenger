import { formatUsernames } from "@/helpers/helpers";
import { Avatar, AvatarGroup, Flex, Stack, Text } from "@chakra-ui/react";
import { formatRelative, parseISO } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React from "react";
import { ConversationPopulated } from "../../../../../backend/src/types";

type ConversationItemProps = {
  conversation: ConversationPopulated;
  isSelected: boolean;
  singedInUserId: string;
  onClick: () => void;
};

const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "HH:mm",
  other: "dd.MM.yy",
};

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  singedInUserId,
  onClick,
}) => {
  return (
    <Flex
      p={1}
      width="100%"
      cursor="pointer"
      bg={isSelected ? "whiteAlpha.200" : "none"}
      _hover={{ bg: "whiteAlpha.200" }}
      onClick={onClick}
    >
      <AvatarGroup
        size="md"
        max={2}
        spacing="-30px"
        pl={2}
      >
        {conversation.participants.map((participant) => (
          <Avatar
            key={`conv-list-item-avatar-id-${participant.user.id}`}
            name={participant.user.username || ""}
            src={participant.user.image || ""}
          />
        ))}
      </AvatarGroup>
      <Stack
        p={1}
        spacing={0}
        width="100%"
        position="relative"
      >
        <Text
          maxWidth="310px"
          fontWeight={600}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {formatUsernames(conversation.participants, singedInUserId)}
        </Text>
        <Text
          maxWidth="310px"
          color="whiteAlpha.700"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {conversation.latestMessage?.body}
        </Text>
        <Text
          color="whiteAlpha.700"
          fontSize="14px"
          textAlign="right"
          position="absolute"
          right="10px"
        >
          {formatRelative(conversation.updatedAt, new Date(), {
            locale: {
              ...enUS,
              formatRelative: (token) => formatRelativeLocale[token as keyof typeof formatRelativeLocale],
            },
          })}
        </Text>
      </Stack>
    </Flex>
  );
};

export default ConversationItem;
