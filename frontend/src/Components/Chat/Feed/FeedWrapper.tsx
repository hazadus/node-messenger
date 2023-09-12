import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React from "react";
import FeedHeader from "./FeedHeader";

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
          <Flex
            direction="column"
            justify="space-between"
            overflow="hidden"
            flexGrow={1}
          >
            <FeedHeader
              conversationId={conversationId as string}
              signedInUserId={singedInUserId}
            />
            Selected chat ID: {conversationId}
          </Flex>
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
