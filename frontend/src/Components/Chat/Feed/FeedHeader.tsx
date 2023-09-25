import ConversationOperations from "@/graphql/operations/conversation";
import { formatUsernames } from "@/helpers/helpers";
import { ConversationsData } from "@/types";
import { useQuery } from "@apollo/client";
import { Avatar, AvatarGroup, Button, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";
import ConversationMenu from "../ConversationMenu";

type FeedHeaderProps = {
  conversationId: string;
  signedInUserId: string;
};

const FeedHeader: React.FC<FeedHeaderProps> = ({ conversationId, signedInUserId }) => {
  const { data, loading } = useQuery<ConversationsData>(ConversationOperations.Queries.conversations);
  const router = useRouter();

  const conversation = data?.conversations.find((conversation) => conversation.id === conversationId);

  return (
    <Flex
      height="60px"
      flexShrink={0}
      width="100%"
      align="center"
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Button
        display={{ lg: "none" }}
        ml={2}
        onClick={() =>
          router.replace("?conversationId", "/", {
            shallow: true,
          })
        }
      >
        <AiOutlineArrowLeft />
      </Button>
      {!conversation && !loading && <Text>Conversation not found!</Text>}
      {conversation && (
        <Flex
          width="100%"
          align="center"
          justify="space-between"
        >
          {/* Avatars and participants */}
          <Flex align="center">
            <AvatarGroup
              mr={2}
              size="md"
              spacing="-20px"
              pl={2}
            >
              {conversation.participants
                .filter((participant) => participant.user.id !== signedInUserId)
                .map((participant) => (
                  <Avatar
                    key={`feed-header-avatar-id-${participant.user.id}`}
                    name={participant.user.username || ""}
                    src={participant.user.image || ""}
                  />
                ))}
            </AvatarGroup>
            <Text>{formatUsernames(conversation.participants, signedInUserId)}</Text>
          </Flex>

          {/* Menu button and menu */}
          <ConversationMenu iconType="dots" />
        </Flex>
      )}
    </Flex>
  );
};

export default FeedHeader;
