import SkeletonLoader from "@/Components/SkeletonLoader";
import MessageOperation from "@/graphql/operations/message";
import { MessagesData, MessagesVariables } from "@/types";
import { ApolloError, useQuery } from "@apollo/client";
import { Flex, Stack, Text } from "@chakra-ui/react";
import { formatRelative } from "date-fns";
import enUS from "date-fns/locale/en-US";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import MessageOperations from "../../../../graphql/operations/message";
import { MessageSubscriptionData } from "../../../../types";
import MessageItem from "./MessageItem";

const formatRelativeLocale = {
  lastWeek: "eeee",
  yesterday: "'Yesterday",
  today: "'Today",
  other: "do LLLL, yyyy",
};

type MessagesProps = {
  userId: string;
  conversationId: string;
};

const Messages: React.FC<MessagesProps> = ({ userId, conversationId }) => {
  const { data, loading, error, subscribeToMore, refetch } = useQuery<MessagesData, MessagesVariables>(
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
    refetch();

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
        // Messages containter
        <Flex
          direction="column-reverse"
          overflowY="scroll"
          height="100%"
          px={{ base: 4, md: 8, "2xl": "20%" }}
        >
          {data.messages.map((message, index) => {
            /**
             * We want to show date only when the date of current message is > than date of
             * previous message, like in Telegram or WhatsApp web, and at the very beginning of
             * the conversation.
             */
            let dateCaption: string | null = null;
            let dateToFormat: Date | null = null;
            const prevIndex = index + 1;

            if (prevIndex < data.messages.length) {
              const prevMessage = data.messages[prevIndex];
              const currentMessageDate = new Date(message.createdAt).getDate();
              const previousMessageDate = new Date(prevMessage.createdAt).getDate();

              if (currentMessageDate != previousMessageDate) {
                /**
                 * Adjacent messages have different dates.
                 */
                dateToFormat = message.createdAt;
              }
            } else if (index === data.messages.length - 1) {
              /**
               * We're at the top of the messages list.
               */
              dateToFormat = message.createdAt;
            }

            if (dateToFormat) {
              /**
               * Apply relative date formatting.
               */
              dateCaption = formatRelative(dateToFormat, new Date(), {
                locale: {
                  ...enUS,
                  formatRelative: (token) => formatRelativeLocale[token as keyof typeof formatRelativeLocale],
                },
              });
            }

            return (
              <>
                <MessageItem
                  key={`message-id-${message.id}`}
                  message={message}
                  isSentBySignedInUser={userId === message.sender.id}
                />
                {dateCaption && (
                  <Flex
                    justify="center"
                    my={1}
                  >
                    <Text
                      bg="whiteAlpha.300"
                      px={2}
                      borderRadius={4}
                    >
                      {dateCaption}
                    </Text>
                  </Flex>
                )}
              </>
            );
          })}
        </Flex>
      )}
    </Flex>
  );
};

export default Messages;
