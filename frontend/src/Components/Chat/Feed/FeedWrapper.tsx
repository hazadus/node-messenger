import { Flex, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import FeedHeader from "./FeedHeader";
import MessageInput from "./MessageInput";
import Messages from "./Messages/Messages";

type FeedWrapperProps = {
  session: Session;
};

const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  const router = useRouter();
  const { conversationId } = router.query;
  const {
    user: { id: singedInUserId },
  } = session;

  return (
    <Flex
      display={{ base: conversationId ? "flex" : "none", md: "flex" }}
      width="100%"
      direction="column"
    >
      {conversationId ? (
        <>
          <FeedHeader
            conversationId={conversationId as string}
            signedInUserId={singedInUserId}
          />
          <Messages
            userId={singedInUserId}
            conversationId={conversationId as string}
          />
          <MessageInput
            session={session}
            conversationId={conversationId as string}
          />
        </>
      ) : (
        <>
          <Flex
            width="100%"
            height="100%"
            justify="center"
            align="center"
          >
            <Flex
              direction="column"
              p={8}
              maxWidth="700px"
              borderRadius={4}
              bg="whiteAlpha.300"
            >
              <Text
                textAlign="center"
                mb={4}
                fontSize="2xl"
                fontWeight={500}
              >
                Welcome to Node Messenger! 💬
              </Text>
              <Text
                textAlign="center"
                mb={4}
              >
                Please select or create new chat.
              </Text>
              <Text
                textAlign="center"
                maxWidth="70%"
                mx="auto"
              >
                It'd be nice if you drop a line to the developer of this app, my username is hazadus👋!
              </Text>
            </Flex>
          </Flex>
        </>
      )}
    </Flex>
  );
};

export default FeedWrapper;
