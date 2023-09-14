import { MessagesData, MessagesVariables } from "@/types";
import { ApolloError, useQuery } from "@apollo/client";
import { Flex, Stack, Text } from "@chakra-ui/react";
import React from "react";
import MessageOperation from "@/graphql/operations/message";
import toast from "react-hot-toast";

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

  console.log("Messages data:", data);

  return (
    <Flex
      direction="column"
      justify="flex-end"
      overflow="hidden"
      outline="1px solid purple"
    >
      {loading && (
        <Stack>
          <Text>Loading messages...</Text>
        </Stack>
      )}
      {data?.messages && (
        <Flex
          direction="column-reverse"
          overflowY="scroll"
          height="100%"
        >
          {data.messages.map((message) => (
            <Text key={`message-id-${message.id}`}>{message.body}</Text>
          ))}
        </Flex>
      )}
      Selected chat ID: {conversationId}, userId {userId}
    </Flex>
  );
};

export default Messages;
