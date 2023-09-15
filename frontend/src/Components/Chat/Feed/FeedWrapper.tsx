import { Flex } from "@chakra-ui/react";
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
          <div>No chat selected.</div>
        </>
      )}
    </Flex>
  );
};

export default FeedWrapper;
