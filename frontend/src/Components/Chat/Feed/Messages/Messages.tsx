import SkeletonLoader from "@/Components/SkeletonLoader";
import MessageOperation from "@/graphql/operations/message";
import { MessagesData, MessagesVariables } from "@/types";
import { ApolloError, useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import MessageOperations from "../../../../graphql/operations/message";
import { MessageSubscriptionData } from "../../../../types";
import MessageItem from "./MessageItem";

type MessagesProps = {
  userId: string;
  conversationId: string;
};

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore } = useQuery<MessagesData, MessagesVariables>(
    MessageOperation.Query.messages,
    {
      variables: {
        conversationId,
      },
      onError: (error: ApolloError) => {
        console.log("Messages component error:", error.message);
        toast.error(error.message);
      },
      onCompleted: () => {},
    },
  );

  const subscribeToMoreMessages = (conversationId: string) => {
    return subscribeToMore({
      document: MessageOperations.Subscription.messageSent,
      variables: {
        conversationId,
      },
      updateQuery: (prev, { subscriptionData }: MessageSubscriptionData) => {
        if (!subscriptionData) {
          return prev;
        }

        const newMessage = subscriptionData.data.messageSent;

        return Object.assign({}, prev, { messages: [newMessage, ...prev.messages] });
      },
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToMoreMessages(conversationId);

    return () => unsubscribe();
  }, [conversationId]);

  return (
    <Flex
      direction="column"
      justify="flex-end"
      overflow="hidden"
      flexGrow={1}
    >
      {loading && (
        <Stack px={4}>
          <SkeletonLoader
            count={2}
            width="70%"
            height="40px"
          />
        </Stack>
      )}
      {data?.messages && (
        <Flex
          direction="column-reverse"
          overflowY="scroll"
          height="100%"
          px={4}
        >
          {data.messages.map((message) => (
            <MessageItem
              key={`message-id-${message.id}`}
              message={message}
              isSentBySignedInUser={userId === message.sender.id}
            />
          ))}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
