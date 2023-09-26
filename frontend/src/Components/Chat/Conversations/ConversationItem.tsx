import { formatUsernames } from "@/helpers/helpers";
import { Avatar, Flex, Icon, Stack, Text } from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React from "react";
import { GoDotFill } from "react-icons/go";
import { ConversationPopulated } from "../../../../../backend/src/types";
import ConversationMenu from "../ConversationMenu";

type ConversationItemProps = {
  conversation: ConversationPopulated;
  isSelected: boolean;
  signedInUserId: string;
  hasSeenLatestMessage: boolean;
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
  signedInUserId,
  hasSeenLatestMessage,
  onClick,
}) => {
  return (
    <Flex
      p={1}
      align="center"
      width="100%"
      height="64px"
      minHeight="64px"
      cursor="pointer"
      bg={isSelected ? "whiteAlpha.200" : "none"}
      position="relative"
      _hover={{ bg: "whiteAlpha.200" }}
      onClick={onClick}
    >
      {/* Conversation item itself */}
      <Avatar
        src={
          conversation.participants.find((participant) => participant.user.id !== signedInUserId)?.user
            .image || ""
        }
      />
      <Stack
        p={1}
        spacing={0}
        width="100%"
        position="relative"
      >
        <Text
          maxWidth={{ base: "300px", lg: "250px" }}
          fontWeight={600}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {formatUsernames(conversation.participants, signedInUserId)} very long username list
        </Text>
        <Text
          maxWidth={{ base: "320px", lg: "280px" }}
          height="24px"
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
          top="5px"
        >
          {formatRelative(conversation.updatedAt, new Date(), {
            locale: {
              ...enUS,
              formatRelative: (token) => formatRelativeLocale[token as keyof typeof formatRelativeLocale],
            },
          })}
        </Text>
        {/* Conversation "context" menu */}
        <Flex
          display={{ base: "none", lg: "flex" }}
          position="absolute"
          top="22px"
          right="5px"
          onClick={(event) => event.preventDefault()}
        >
          <ConversationMenu iconType="chevron" />
        </Flex>
      </Stack>
      {/* Unread messages indicator */}
      {!hasSeenLatestMessage && (
        <Icon
          as={GoDotFill}
          position="absolute"
          left="-1px"
          top="24px"
          color="purple.300"
        />
      )}
    </Flex>
  );
};

export default ConversationItem;
