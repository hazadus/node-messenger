import { Avatar, Flex, Stack, Text, Tooltip } from "@chakra-ui/react";
import { format } from "date-fns";
import React from "react";
import { MessagePopulated } from "../../../../../../backend/src/types";

type MessageItemProps = {
  message: MessagePopulated;
  isSentBySignedInUser: boolean;
};

const MessageItem: React.FC<MessageItemProps> = ({ message, isSentBySignedInUser }) => {
  return (
    // Full message "line"
    <Flex justify={isSentBySignedInUser ? "right" : "left"}>
      {/* Avatar + Message */}
      <Stack
        maxWidth="60%"
        direction="row"
      >
        {/* User avatar */}
        {!isSentBySignedInUser && (
          <Avatar
            src={message.sender.image || ""}
            size="md"
            mt={1}
          />
        )}
        {/* Message block */}
        <Stack
          minWidth="120px"
          py={1}
          px={2}
          bgColor={isSentBySignedInUser ? "brand.100" : "whiteAlpha.300"}
          mt={1}
          borderRadius={4}
        >
          {/* Username */}
          {!isSentBySignedInUser && <Text fontWeight={600}>{message.sender.username}</Text>}
          {/* Message body */}
          <Text
            lineHeight={{ base: 1.1, md: 1.2 }}
            pt={isSentBySignedInUser ? 2 : 0}
          >
            {message.body}
          </Text>
          {/* createdAt with tooltip */}
          <Flex justify="right">
            <Tooltip
              hasArrow
              label={format(message.createdAt, "dd.MM.yy, HH:mm")}
              fontSize="10px"
            >
              <Text
                fontSize="11px"
                color="whiteAlpha.700"
              >
                {format(message.createdAt, "HH:mm")}
              </Text>
            </Tooltip>
          </Flex>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default MessageItem;
