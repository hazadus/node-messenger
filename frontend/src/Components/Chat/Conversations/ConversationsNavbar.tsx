import { Button, Flex, Image, Tooltip } from "@chakra-ui/react";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import React from "react";

type ConversationsNavbarProps = {
  session: Session;
};

const ConversationsNavbar: React.FC<ConversationsNavbarProps> = ({ session }) => {
  return (
    <Flex
      px={4}
      py={2}
      height="60px"
      width="100%"
      bg="whiteAlpha.100"
      flexDirection="row"
      align="center"
      justify="space-between"
    >
      {session.user.image && (
        <Tooltip
          hasArrow
          label={session.user.username}
          placement="right"
        >
          <Image
            src={session.user.image}
            boxSize="40px"
            borderRadius="full"
            alt=""
          />
        </Tooltip>
      )}
      <Button onClick={() => signOut()}>Logout</Button>
    </Flex>
  );
};

export default ConversationsNavbar;
